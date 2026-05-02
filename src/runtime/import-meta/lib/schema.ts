import z from "zod";

import { EnvRecordSchema } from "../../record/lib/schema.js";

export const ImportMetaRuntimeGlobalsSchema = z.object({
  __IMPORT_META_ENV__: EnvRecordSchema.optional(),
});
