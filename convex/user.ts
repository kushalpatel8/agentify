import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
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
        token:5000
      };

      const result = await ctx.db.insert("UserTable", userData);

      return result;
    }

    // User already exists
    return user[0];
  },
});