import type { EnvKeys, Options } from "../../lib/types.js";

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
 * @param options Parsing options. Set `skipValidation` to return raw values and
 *   `undefined` for unavailable variables instead of throwing, such as during CI
 *   or build steps where runtime env vars are not present.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured variable is missing or fails validation, unless
 *   `options.skipValidation` is enabled.
 */
export function createNodeEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  options?: Options
) {
  return createEnvEffect(
    envKeys,
    NodeRuntimeGlobalsSchema,
    readEnvEffect,
    options
  );
}
