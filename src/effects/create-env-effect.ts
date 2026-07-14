import { Effect } from "effect";

import type { EnvForOptions, EnvKeys, Options } from "../lib/types.js";

import { envParseValueEffect } from "./env-parse-value-effect.js";
import { envReadValueEffect } from "./env-read-value-effect.js";

export function createEnvEffect<
  const TEnvKeys extends EnvKeys,
  const TOptions extends Options | undefined = undefined,
>(
  envKeys: TEnvKeys,
  runtimeEnvReadEffect: (key: string) => unknown,
  options?: TOptions
) {
  const isServer = options?.isServer ?? !("window" in globalThis);
  const clientPrefix = options?.clientPrefix;

  const env = Effect.runSync(
    Effect.forEach(Object.entries(envKeys), ([key, schema]) => {
      if (
        !isServer &&
        clientPrefix !== undefined &&
        !key.startsWith(clientPrefix)
      ) {
        return Effect.succeed([key, undefined] as const);
      }

      return envReadValueEffect(key, runtimeEnvReadEffect, options).pipe(
        Effect.flatMap((value) =>
          envParseValueEffect(key, schema, value, options)
        ),
        Effect.map((value) => [key, value] as const)
      );
    }).pipe(Effect.map((entries) => Object.fromEntries(entries)))
  );

  return env as EnvForOptions<TEnvKeys, TOptions>;
}
