import type { EnvKeys, EnvRecord, Options } from "../../lib/types.js";

import { createRecordEnv } from "../record/create-record-env.js";

/**
 * Creates a typed environment object from a Vercel Edge env-like object.
 *
 * Use this for Vercel Edge code when you want to validate an explicit env
 * object, such as `process.env` or another object made available to the edge
 * handler.
 *
 * @example
 * ```ts
 * import { createVercelEdgeEnv } from "@tmrp/env/vercel-edge";
 * import z from "zod";
 *
 * const env = createVercelEdgeEnv(
 *   { API_URL: z.url() },
 *   process.env
 * );
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @param env Vercel Edge env object to read values from.
 * @param options Parsing options. Set `skipValidation` to return raw values and
 *   `undefined` for unavailable values instead of throwing, such as during CI or
 *   build steps where runtime env vars are not present.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation, unless
 *   `options.skipValidation` is enabled.
 */
export function createVercelEdgeEnv<
  const TEnvKeys extends EnvKeys,
  const TOptions extends Options | undefined = undefined,
>(envKeys: TEnvKeys, env: EnvRecord, options?: TOptions) {
  return createRecordEnv(envKeys, env, options);
}
