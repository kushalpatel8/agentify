import { NextRequest, NextResponse } from 'next/server';
import { Agent, run, StreamEvent, tool } from '@openai/agents';
import { z } from 'zod';
import { openAi } from '@/config/OpenAi';
import axios from 'axios';

// 1. GET: Generate / Retrieve a unique conversation session ID [05:11:30]
export async function GET() {
  try {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return NextResponse.json(conversationId);
  } catch (error: any) {
    console.error('Error generating conversation ID:', error);
    return NextResponse.json({ error: 'Failed to generate conversation ID' }, { status: 500 });
  }
}

// 2. POST: Execute Multi-Agent Flow with OpenAI Agent SDK & Streaming Output [05:03:50]
export async function POST(req: NextRequest) {
  try {
    const { agentName, agents, tools, userInput, conversationId } = await req.json();

    if (!userInput) {
      return NextResponse.json({ error: 'Missing userInput' }, { status: 400 });
    }

    // Map configured tools into executable OpenAI SDK tools
    const executableTools = (tools || []).map((t: any) => {
      if (t.type === 'API') {
        return tool({
          name: t.name ? t.name.replace(/\s+/g, '_').toLowerCase() : `api_tool_${t.id}`,
          description: t.description || `Calls external API at ${t.url}`,
          parameters: z.object({
            queryParam: z.string().optional().describe('Dynamic query param or search term if needed'),
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
              return `API Error: ${err?.message || 'Failed to call endpoint'}`;
            }
          },
        });
      }

      // Default fallback tool
      return tool({
        name: t.name ? t.name.replace(/\s+/g, '_').toLowerCase() : `tool_${t.id}`,
        description: t.description || 'Custom agent helper tool',
        parameters: z.object({ input: z.string().optional() }),
        execute: async () => `Tool ${t.name} acknowledged.`,
      });
    });

    // Create Sub-Agents based on configuration
    const createdAgents = (agents || []).map((a: any) => {
      return new Agent({
        name: a.name || 'SubAgent',
        instructions: a.instruction || 'You are a helpful AI sub-agent.',
        tools: executableTools,
      });
    });

    // Primary Dispatcher Agent with handoffs
    const primaryAgent = new Agent({
      name: agentName || 'PrimaryAgent',
      instructions: `You are the primary coordinator agent for ${agentName}. Determine the user query intent, call appropriate tools or delegate to sub-agents as necessary.`,
      handoffs: createdAgents,
      tools: executableTools,
    });

    // Execute agent with streaming enabled
    const result = await run(primaryAgent, userInput, {
      stream: true,
      conversationId: conversationId,
    });

    const str = result.toTextStream({
      compatibleWithNodeStreams: true,
    });

    //@ts-ignore
    return new Response(str, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Error executing agent chat:', error);
    return NextResponse.json(
      { error: 'Failed to process agent chat', details: error?.message },
      { status: 500 }
    );
  }
}