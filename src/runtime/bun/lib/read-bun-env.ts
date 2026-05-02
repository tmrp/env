import { readRecordEnv } from "../../record/lib/read-record-env.js";
import { BunRuntimeGlobalsSchema } from "./schema.js";

export const readBunEnv = (env: string) => {
  const bunGlobalScope = BunRuntimeGlobalsSchema.safeParse(globalThis);

  if (!bunGlobalScope.success) {
    return undefined;
  }

  const bunRuntimeGlobals = bunGlobalScope.data;

  if (!bunRuntimeGlobals.Bun) {
    return undefined;
  }

  return readRecordEnv(env, bunRuntimeGlobals.Bun.env);
};
