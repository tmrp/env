import z from "zod";

export const BunRuntimeGlobalsSchema = z.object({
  Bun: z
    .object({
      env: z.record(z.string(), z.string().optional()),
    })
    .optional(),
});
