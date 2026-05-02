import { readRecordEnv } from "../../record/lib/read-record-env.js";
import { BrowserRuntimeGlobalsSchema } from "./schema.js";

export const readBrowserEnv = (env: string) => {
  const browserGlobalScope = BrowserRuntimeGlobalsSchema.safeParse(globalThis);

  if (!browserGlobalScope.success) {
    return undefined;
  }

  const browserRuntimeGlobals = browserGlobalScope.data;
  const browserEnv =
    browserRuntimeGlobals.__APP_CONFIG__ ?? browserRuntimeGlobals.__ENV__;

  if (!browserEnv) {
    return undefined;
  }

  return readRecordEnv(env, browserEnv);
};
