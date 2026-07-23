import { Effect } from "effect";

import type { Options } from "../lib/types.js";

export const envReadValueEffect = (
  key: string,
  readRuntimeEnv: (key: string) => unknown,
  options?: Options
) =>
  Effect.try({
    try: () => readRuntimeEnv(key),
    catch: (error) =>
      new Error(`Environment variable "${key}" failed to read: ${error}`, {
        cause: error,
      }),
  }).pipe(
    Effect.flatMap((value) =>
      options?.skipValidation
        ? Effect.succeed(value)
        : Effect.mapError(
            Effect.fromNullable(value),
            () => new Error(`Environment variable "${key}" is not defined`)
          )
    )
  );
