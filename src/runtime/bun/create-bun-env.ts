import type { EnvKeys } from "../../lib/types.js";

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
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured variable is missing or fails validation.
 */
export function createBunEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys
) {
  return createEnvEffect(envKeys, BunRuntimeGlobalsSchema, (env) =>
    readBunEnv(env)
  );
}
