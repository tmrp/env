import type { EnvKeys } from "../../lib/types.js";

import { createEnvEffect } from "../../effects/create-env-effect.js";
import { readEnvEffect } from "../../effects/read-env-effect.js";
import { NodeRuntimeGlobalsSchema } from "./lib/schema.js";

/**
 * Creates a typed environment object from Node.js `process.env`.
 *
 * Use this entry point when your application is expected to run in Node. If you
 * load environment variables from a `.env` file, import your dotenv loader before
 * calling this function.
 *
 * @example
 * ```ts
 * import "dotenv/config";
 *
 * import { createNodeEnv } from "@tmrp/env/node";
 * import z from "zod";
 *
 * const env = createNodeEnv({
 *   DATABASE_URL: z.url(),
 *   PORT: z.coerce.number().int().positive(),
 * });
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured variable is missing or fails validation.
 */
export function createNodeEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys
) {
  return createEnvEffect(envKeys, NodeRuntimeGlobalsSchema, readEnvEffect);
}
