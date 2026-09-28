import type { EnvKeys, EnvRecord, Options } from "../../lib/types.js";

import { createEnvEffect } from "../../effects/create-env-effect.js";
import { readRecordEnv } from "./lib/read-record-env.js";

/**
 * Creates a typed environment object from any explicit object.
 *
 * Use this when environment values are passed to your code rather than exposed
 * through a runtime global. Values are passed to Zod as-is: string values keep
 * their surrounding whitespace, and non-string values are passed directly.
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
 * @throws When a configured value does not satisfy its schema, unless
 *   `options.skipValidation` is enabled.
 */
export function createRecordEnv<
  const TEnvKeys extends EnvKeys,
  const TOptions extends Options | undefined = undefined,
>(envKeys: TEnvKeys, record: EnvRecord, options?: TOptions) {
  return createEnvEffect(envKeys, (key) => readRecordEnv(key, record), options);
}
