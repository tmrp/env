import { DenoRuntimeGlobalsSchema } from "./schema.js";

export const readDenoEnv = (env: string) => {
  const denoGlobalScope = DenoRuntimeGlobalsSchema.safeParse(globalThis);

  if (!denoGlobalScope.success) {
    return undefined;
  }

  const denoRuntimeGlobals = denoGlobalScope.data;

  if (!denoRuntimeGlobals?.Deno) {
    return undefined;
  }

  return denoRuntimeGlobals.Deno.env?.get?.(env) ?? undefined;
};
