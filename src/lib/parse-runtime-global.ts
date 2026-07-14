import type { ZodType } from "zod";

export const parseRuntimeGlobal = <T>(runtimeSchema: ZodType<T>) => {
  try {
    const runtime = runtimeSchema.safeParse(globalThis);

    return runtime.success ? runtime.data : undefined;
  } catch {
    return undefined;
  }
};
