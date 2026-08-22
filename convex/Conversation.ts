import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Get conversation record by agentId & userId [05:39:19]
export const GetConversationById = query({
  args: {
    agentId: v.id("AgentTable"),
    userId: v.id("UserTable"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("ConversationTable")
      .filter((q) =>
        q.and(
          q.eq(q.field("agentId"), args.agentId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .collect();

    return result[0];
  },
});

// 2. Create and persist a new conversation session record
export const CreateConversation = mutation({
  args: {
    conversationId: v.string(),
    agentId: v.id("AgentTable"),
    userId: v.id("UserTable"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ConversationTable", {
      conversationId: args.conversationId,
      agentId: args.agentId,
      userId: args.userId,
    });
  },
});