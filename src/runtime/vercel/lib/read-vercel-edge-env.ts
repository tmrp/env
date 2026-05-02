import { readNodeEnv } from "../../node/lib/read-node-env.js";
import { VercelEdgeRuntimeGlobalsSchema } from "./schema.js";

export const readVercelEdgeEnv = (env: string) => {
  const vercelEdgeGlobalScope =
    VercelEdgeRuntimeGlobalsSchema.safeParse(globalThis);

  if (!vercelEdgeGlobalScope.success) {
    return undefined;
  }

  const vercelEdgeRuntimeGlobals = vercelEdgeGlobalScope.data;

  if (!vercelEdgeRuntimeGlobals.EdgeRuntime) {
    return undefined;
  }

  return readNodeEnv(env);
};
