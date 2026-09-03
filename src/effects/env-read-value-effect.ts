import { Effect } from "effect";

export const envReadValueEffect = (
  key: string,
  readRuntimeEnv: (key: string) => unknown
) =>
  Effect.try({
    try: () => readRuntimeEnv(key),
    catch: (error) =>
      new Error(`Environment variable "${key}" failed to read: ${error}`, {
        cause: error,
      }),
  });
