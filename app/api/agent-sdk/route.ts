import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery, fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { agentId, userId, userInput } = await req.json();

    if (!agentId || !userInput) {
      return NextResponse.json(
        { error: 'Missing agentId or userInput' },
        { status: 400 }
      );
    }

    // 1. Fetch Agent Details from Convex DB [05:35:10]
    const agentDetail = await fetchQuery(api.agent.GetAgentById, {
      agentId: agentId as string,
    });

    if (!agentDetail) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const { agentToolConfig, name } = agentDetail;
    const tools = agentToolConfig?.tools || [];
    const agents = agentToolConfig?.agents || [];

    // 2. Fetch or create unique conversation session ID for this user/agent [05:37:44]
    let conversationId = '';
    if (userId && agentDetail._id) {
      try {
        const conversationDetail = await fetchQuery(
          api.Conversation.GetConversationById,
          {
            agentId: agentDetail._id,
            userId: userId,
          }
        );

        if (conversationDetail?.conversationId) {
          conversationId = conversationDetail.conversationId;
        }
      } catch (err) {
        console.warn('No existing conversation session found');
      }
    }

    if (!conversationId) {
      conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    // 3. Map Configured Tools into OpenAI Agent SDK Tools [05:43:13]
    const executableTools = tools.map((t: any) => {
      if (t.type === 'API') {
        return tool({
          name: t.name ? t.name.replace(/\s+/g, '_').toLowerCase() : `api_${t.id}`,
          description: t.description || `Calls API endpoint at ${t.url}`,
          parameters: z.object({
            queryParam: z.string().optional().describe('Dynamic URL or query parameters'),
          }),
          execute: async ({ queryParam }) => {
            try {
              let targetUrl = t.url;
              if (queryParam && targetUrl.includes('{')) {
                targetUrl = targetUrl.replace(/\{.*?\}/g, encodeURIComponent(queryParam));
              }

              const headers: Record<string, string> = {};
              if (t.apiKey) {
                headers['Authorization'] = `Bearer ${t.apiKey}`;
              }

              const res = await axios({
                method: t.method || 'GET',
                url: targetUrl,
                headers,
                data: t.body ? JSON.parse(t.body) : undefined,
              });

              return JSON.stringify(res.data);
            } catch (err: any) {
              return `API Execution Error: ${err?.message || 'Failed to call endpoint'}`;
            }
          },
        });
      }

      return tool({
        name: t.name ? t.name.replace(/\s+/g, '_').toLowerCase() : `tool_${t.id}`,
        description: t.description || 'Generic agent helper tool',
        parameters: z.object({ input: z.string().optional() }),
        execute: async () => `Tool ${t.name} executed.`,
      });
    });

    // 4. Construct Sub-Agents
    const createdAgents = agents.map((a: any) => {
      return new Agent({
        name: a.name || 'SubAgent',
        instructions: a.instruction || 'You are an execution sub-agent.',
        tools: executableTools,
      });
    });

    // 5. Construct Primary Agent
    const primaryAgent = new Agent({
      name: name || 'PrimaryAgent',
      instructions: `You are the primary coordinator agent for ${name}. Interpret user intent, coordinate tools, and answer the user query.`,
      handoffs: createdAgents,
      tools: executableTools,
    });

    // 6. Run Agent with Streaming Output [05:44:25]
    const result = await run(primaryAgent, userInput, {
      stream: true,
      conversationId: conversationId,
    });

    const stream = result.toTextStream({
      compatibleWithNodeStreams: true,
    });
    //@ts-ignore
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Error in agent SDK endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to execute agent SDK', details: error?.message },
      { status: 500 }
    );
  }
}