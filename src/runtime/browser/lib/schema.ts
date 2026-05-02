import z from "zod";

import { EnvRecordSchema } from "../../record/lib/schema.js";

export const BrowserRuntimeGlobalsSchema = z.object({
  __APP_CONFIG__: EnvRecordSchema.optional(),
  __ENV__: EnvRecordSchema.optional(),
});
