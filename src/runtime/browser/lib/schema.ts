import z from "zod";

import { EnvRecordSchema } from "../../record/lib/schema.js";

export const BrowserAppConfigRuntimeGlobalsSchema = z.object({
  __APP_CONFIG__: EnvRecordSchema.optional(),
});

export const BrowserEnvRuntimeGlobalsSchema = z.object({
  __ENV__: EnvRecordSchema.optional(),
});
