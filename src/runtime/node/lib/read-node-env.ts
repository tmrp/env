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

  return nodeRuntimeGlobals.process.env?.[env]?.trim() ?? undefined;
};
