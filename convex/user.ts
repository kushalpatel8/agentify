import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    // Check if user already exists
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    // If user does not exist, create a new user
    if (user.length === 0) {
      const userData = {
        name: args.name,
        email: args?.email,
        token: 5000,
        subscription: args.subscription,
      };

      const newId = await ctx.db.insert("UserTable", userData);
      return await ctx.db.get(newId);
    }

    // User already exists - sync subscription if updated
    if (args.subscription !== undefined && user[0].subscription !== args.subscription) {
      await ctx.db.patch(user[0]._id, { subscription: args.subscription });
      return await ctx.db.get(user[0]._id);
    }

    return user[0];
  },
});

// Update the user's subscription status/plan
export const UpdateUserSubscription = mutation({
  args: {
    userId: v.id("UserTable"),
    subscription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { subscription: args.subscription });
    return await ctx.db.get(args.userId);
  },
});

export const GetUserById = query({
  args: {
    userId: v.id("UserTable"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const GetUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0] ?? null;
  },
});

// Update the user's remaining token balance
export const UpdateUserToken = mutation({
  args: {
    userId: v.id("UserTable"),
    token: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { token: args.token });
  },
});

export const DecrementUserToken = mutation({
  args: {
    userId: v.id("UserTable"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return 0;
    const currentToken = user.token ?? 0;
    const newToken = Math.max(0, currentToken - args.amount);
    await ctx.db.patch(args.userId, { token: newToken });
    return newToken;
  },
});