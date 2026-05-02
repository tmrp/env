import { readRecordEnv } from "../../record/lib/read-record-env.js";
import { ImportMetaRuntimeGlobalsSchema } from "./schema.js";

export const readImportMetaEnv = (env: string) => {
  const importMetaGlobalScope =
    ImportMetaRuntimeGlobalsSchema.safeParse(globalThis);

  if (!importMetaGlobalScope.success) {
    return undefined;
  }

  const importMetaRuntimeGlobals = importMetaGlobalScope.data;

  if (!importMetaRuntimeGlobals.__IMPORT_META_ENV__) {
    return undefined;
  }

  return readRecordEnv(env, importMetaRuntimeGlobals.__IMPORT_META_ENV__);
};
