import { NextResponse } from "next/server";
import { aj } from "@/config/Arcjet";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const TOKEN_COST = 2500; // tokens deducted per agent creation

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, agentId, name, isSubscribed } = body as {
      userId: string;
      agentId: string;
      name: string;
      isSubscribed: boolean;
    };

    if (!userId || !agentId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const convexUserId = userId as Id<"UserTable">;

    // --- Subscribed users: skip Arcjet entirely ---
    if (isSubscribed) {
      await convex.mutation(api.agent.CreateAgent, {
        agentId,
        name,
        userId: convexUserId,
      });
      return NextResponse.json({ success: true });
    }

    // --- Free users: enforce token bucket via Arcjet ---
    const decision = await aj.protect(req, {
      userId,          // per-user bucket key
      requested: TOKEN_COST,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        {
          error: "insufficient_tokens",
          message: "Not enough tokens. Your tokens will refill in 10 days.",
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Arcjet allowed — create the agent in Convex
    await convex.mutation(api.agent.CreateAgent, {
      agentId,
      name,
      userId: convexUserId,
    });

    // Sync remaining token count from Arcjet back to Convex so sidebar updates
    const remaining = await convex.mutation(api.user.DecrementUserToken, {
      userId: convexUserId,
      amount: TOKEN_COST,
    });

    return NextResponse.json({ success: true, remaining });
  } catch (error) {
    console.error("[create-agent] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
