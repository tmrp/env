import type { EnvKeys, EnvRecord } from "../../lib/types.js";

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
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation.
 */
export function createNetlifyEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  env: EnvRecord
) {
  return createRecordEnv(envKeys, env);
}
