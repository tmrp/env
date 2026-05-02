import { Effect } from "effect";

import type { Env, EnvKeys, EnvRecord } from "../../lib/types.js";

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
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation.
 */
export function createRecordEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  record: EnvRecord
) {
  const env = Effect.runSync(
    Effect.forEach(Object.entries(envKeys), ([key, schema]) =>
      envReadValueEffect(key, (env) => readRecordEnv(env, record)).pipe(
        Effect.flatMap((value) => envParseValueEffect(key, schema, value)),
        Effect.map((value) => [key, value] as const)
      )
    ).pipe(Effect.map((entries) => Object.fromEntries(entries)))
  );

  return env as Env<TEnvKeys>;
}
