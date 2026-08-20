import { Id } from "@/convex/_generated/dataModel";

export type Agent = {
  _id: Id<"AgentTable">;
  _creationTime: number;
  name: string;
  agentId: string;
  userId: Id<"UserTable">;
  publish?: boolean;
  config?: any;
  nodes?: any;
  edges?: any;
  agentToolConfig?: any;
};