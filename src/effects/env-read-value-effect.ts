import { Effect } from "effect";

import type { Options } from "../lib/types.js";

type Key = string;

type readRuntimeEnvEffect = (key: Key) => unknown;

export const envReadValueEffect = (
  key: Key,
  readRuntimeEnvEffect: readRuntimeEnvEffect,
  options?: Options
): Effect.Effect<unknown, Error> => {
  const value = readRuntimeEnvEffect(key);

  if (options?.skipValidation) {
    return Effect.succeed(value);
  }

  return Effect.fromNullable(value).pipe(
    Effect.mapError(
      () => new Error(`Environment variable "${key}" is not defined`)
    )
  );
};
