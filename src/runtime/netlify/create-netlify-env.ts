import type { EnvKeys, EnvRecord, Options } from "../../lib/types.js";

import { createRecordEnv } from "../record/create-record-env.js";

/**
 * Creates a typed environment object from a Netlify env-like object.
 *
 * Use this for Netlify Functions or Edge Functions when you want to validate an
 * explicit env object, such as `process.env` or a platform-provided context.
 *
 * @example
 * ```ts
 * import { createNetlifyEnv } from "@tmrp/env/netlify";
 * import z from "zod";
 *
 * const env = createNetlifyEnv(
 *   { API_URL: z.url() },
 *   process.env
 * );
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @param env Netlify env object to read values from.
 * @param options Parsing options. Set `skipValidation` to return raw values and
 *   `undefined` for unavailable values instead of throwing, such as during CI or
 *   build steps where runtime env vars are not present.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation, unless
 *   `options.skipValidation` is enabled.
 */
export function createNetlifyEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  env: EnvRecord,
  options?: Options
) {
  return createRecordEnv(envKeys, env, options);
}
