import type { EnvKeys, EnvRecord } from "../../lib/types.js";

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
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation.
 */
export function createVercelEdgeEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  env: EnvRecord
) {
  return createRecordEnv(envKeys, env);
}
