import z from "zod";

export const VercelEdgeRuntimeGlobalsSchema = z.object({
  EdgeRuntime: z.string().optional(),
});
