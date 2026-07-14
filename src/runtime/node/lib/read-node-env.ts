import { readRecordEnv } from "../../record/lib/read-record-env.js";
import { NodeRuntimeGlobalsSchema } from "./schema.js";

export const readNodeEnv = (env: string) => {
  const nodeGlobalScope = NodeRuntimeGlobalsSchema.safeParse(globalThis);

  if (!nodeGlobalScope.success) {
    return undefined;
  }

  const nodeRuntimeGlobals = nodeGlobalScope.data;

  if (!nodeRuntimeGlobals.process) {
    return undefined;
  }

  return readRecordEnv(env, nodeRuntimeGlobals.process.env);
};
