import z from "zod";

export const NodeRuntimeGlobalsSchema = z.object({
  process: z
    .object({
      env: z.custom<NodeJS.ProcessEnv>(
        (value) => value !== null && typeof value === "object"
      ),
    })
    .optional(),
});
