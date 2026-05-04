import type { EnvKeys, Options } from "../../lib/types.js";

import { createEnvEffect } from "../../effects/create-env-effect.js";
import { readBunEnv } from "./lib/read-bun-env.js";
import { BunRuntimeGlobalsSchema } from "./lib/schema.js";

/**
 * Creates a typed environment object from Bun's `Bun.env`.
 *
 * Use this entry point when your application is expected to run in Bun and you
 * want runtime selection to be explicit.
 *
 * @example
 * ```ts
 * import { createBunEnv } from "@tmrp/env/bun";
 * import z from "zod";
 *
 * const env = createBunEnv({
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
export function createBunEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  options?: Options
) {
  return createEnvEffect(
    envKeys,
    BunRuntimeGlobalsSchema,
    (env) => readBunEnv(env),
    options
  );
}
