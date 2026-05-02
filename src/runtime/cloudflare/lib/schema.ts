import z from "zod";

import { EnvRecordSchema } from "../../record/lib/schema.js";

export const CloudflareRuntimeGlobalsSchema = z.object({
  __CLOUDFLARE_ENV__: EnvRecordSchema.optional(),
});
