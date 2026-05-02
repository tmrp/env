import { readNodeEnv } from "../../node/lib/read-node-env.js";
import { NetlifyRuntimeGlobalsSchema } from "./schema.js";

export const readNetlifyEnv = (env: string) => {
  const netlifyGlobalScope = NetlifyRuntimeGlobalsSchema.safeParse(globalThis);

  if (!netlifyGlobalScope.success) {
    return undefined;
  }

  const netlifyRuntimeGlobals = netlifyGlobalScope.data;

  if (!netlifyRuntimeGlobals.process?.env.NETLIFY) {
    return undefined;
  }

  return readNodeEnv(env);
};
