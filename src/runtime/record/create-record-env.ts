import { Effect } from "effect";

import type { Env, EnvKeys, EnvRecord, Options } from "../../lib/types.js";

import { envParseValueEffect } from "../../effects/env-parse-value-effect.js";
import { envReadValueEffect } from "../../effects/env-read-value-effect.js";
import { readRecordEnv } from "./lib/read-record-env.js";

/**
 * Creates a typed environment object from any explicit object.
 *
 * Use this when environment values are passed to your code rather than exposed
 * through a runtime global. String values are trimmed before validation;
 * non-string values are passed directly to Zod.
 *
 * @example
 * ```ts
 * import { createRecordEnv } from "@tmrp/env/record";
 * import z from "zod";
 *
 * const env = createRecordEnv(
 *   {
 *     API_URL: z.url(),
 *     FEATURE_ENABLED: z.coerce.boolean(),
 *   },
 *   runtimeEnv
 * );
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @param record Object to read values from.
 * @param options Parsing options. Set `skipValidation` to return raw values and
 *   `undefined` for unavailable values instead of throwing, such as during CI or
 *   build steps where runtime env vars are not present.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation, unless
 *   `options.skipValidation` is enabled.
 */
export function createRecordEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  record: EnvRecord,
  options?: Options
) {
  const env = Effect.runSync(
    Effect.forEach(Object.entries(envKeys), ([key, schema]) =>
      envReadValueEffect(
        key,
        (env) => readRecordEnv(env, record),
        options
      ).pipe(
        Effect.flatMap((value) =>
          envParseValueEffect(key, schema, value, options)
        ),
        Effect.map((value) => [key, value] as const)
      )
    ).pipe(Effect.map((entries) => Object.fromEntries(entries)))
  );

  return env as Env<TEnvKeys>;
}
