import {defineSchema, defineTable} from "convex/server"
import {v} from "convex/values"

export default defineSchema({
    UserTable:defineTable({
        name:v.string(),
        email:v.string(),
        imageUrl:v.optional(v.string()),
        subscription:v.optional(v.string()),
        token:v.number(),
    }),

    AgentTable: defineTable({
        agentId: v.string(),
        name: v.string(),
        userId: v.id("UserTable"),
        publish: v.optional(v.boolean()),
        config: v.optional(v.any()),
        nodes: v.optional(v.any()),
        edges: v.optional(v.any()),
        agentToolConfig: v.optional(v.any()),
    }),

    ConversationTable: defineTable({
    conversationId: v.string(),
    agentId: v.id("AgentTable"),
    userId: v.id("UserTable"),
  }),
})