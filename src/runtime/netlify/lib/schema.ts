import z from "zod";

export const NetlifyRuntimeGlobalsSchema = z.object({
  process: z
    .object({
      env: z
        .object({
          NETLIFY: z.string().optional(),
        })
        .passthrough(),
    })
    .optional(),
});
