import { Effect } from "effect";

type Key = string;

type readRuntimeEnvEffect = (key: Key) => unknown;

export const envReadValueEffect = (
  key: Key,
  readRuntimeEnvEffect: readRuntimeEnvEffect
) =>
  Effect.fromNullable(readRuntimeEnvEffect(key)).pipe(
    Effect.mapError(
      () => new Error(`Environment variable "${key}" is not defined`)
    )
  );
