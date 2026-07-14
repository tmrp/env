import { parseRuntimeGlobal } from "../../../lib/parse-runtime-global.js";
import { readRecordEnv } from "../../record/lib/read-record-env.js";
import {
  BrowserAppConfigRuntimeGlobalsSchema,
  BrowserEnvRuntimeGlobalsSchema,
} from "./schema.js";

export const readBrowserEnv = (env: string) => {
  const appConfigGlobalScope = parseRuntimeGlobal(
    BrowserAppConfigRuntimeGlobalsSchema
  );

  if (appConfigGlobalScope?.__APP_CONFIG__) {
    return readRecordEnv(env, appConfigGlobalScope.__APP_CONFIG__);
  }

  const envGlobalScope = parseRuntimeGlobal(BrowserEnvRuntimeGlobalsSchema);

  if (envGlobalScope?.__ENV__) {
    return readRecordEnv(env, envGlobalScope.__ENV__);
  }

  return undefined;
};
