import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateAgent = mutation({
    args: {
        name: v.string(),
        agentId: v.string(),
        userId: v.id('UserTable'),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert("AgentTable", {
            name: args.name,
            agentId: args.agentId,
            publish: false,
            userId: args.userId,
        });
        return result;
    },
});

export const GetUsersAgents = query({
    args:{
        userId:v.id('UserTable'),
    },
    handler:async(ctx, args) => {
        const result = await ctx.db.query('AgentTable').filter((q) =>q.eq(q.field('userId'),args.userId)).order('desc').collect();
        return result;
    }
})