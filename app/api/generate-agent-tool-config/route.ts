import { NextRequest, NextResponse } from 'next/server';
import { openAi } from '@/config/OpenAi';

const PROMPT = `You are an AI system architect. Based on the provided workflow (nodes and edges from a visual React Flow canvas), convert the workflow into a structured JSON configuration for an AI Agent execution engine.

Return ONLY a valid JSON object with the following schema:
{
  "primaryAgentName": "string",
  "agents": [
    {
      "name": "string",
      "instruction": "string (Detailed instructions describing when and how to call tools, handle conditions, and respond to the user based on connected nodes)",
      "tools": ["toolId1", "toolId2"]
    }
  ],
  "tools": [
    {
      "id": "string",
      "name": "string",
      "type": "API" | "UserApproval" | "End",
      "description": "string",
      "url": "string (if API node)",
      "method": "GET" | "POST" | "PUT" | "DELETE",
      "apiKey": "string (if provided)",
      "body": "string",
      "schema": "string (if End node or JSON output format)"
    }
  ]
}

Strict Rules:
- Return ONLY the JSON object. No Markdown code fences, no extra text.
- Merge connected nodes (like If/Else, Loops, Approvals, APIs) into logical instructions and tool configurations for the agents.`;

export async function POST(req: NextRequest) {
  try {
    const { jsonConfig } = await req.json();

    if (!jsonConfig) {
      return NextResponse.json(
        { error: 'Missing jsonConfig in request body' },
        { status: 400 }
      );
    }

    const response = await openAi.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: PROMPT },
        {
          role: 'user',
          content: `Here is the workflow graph structure:\n${JSON.stringify(
            jsonConfig
          )}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const outputText = response.choices[0]?.message?.content || '{}';
    const parsedJson = JSON.parse(outputText);

    return NextResponse.json(parsedJson);
  } catch (error: any) {
    console.error('Error generating agent tool config:', error?.message ?? error);
    return NextResponse.json(
      {
        error: 'Failed to generate agent tool configuration',
        details: error?.message ?? String(error),
        code: error?.code,
      },
      { status: 500 }
    );
  }
}