import z from "zod";

export const DenoRuntimeGlobalsSchema = z.object({
  Deno: z
    .object({
      env: z.object({
        get: z.function({
          input: [z.string()],
          output: z.string().optional(),
        }),
      }),
    })
    .optional(),
});
