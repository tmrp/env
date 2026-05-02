import type { EnvKeys } from "../../lib/types.js";

import { createEnvEffect } from "../../effects/create-env-effect.js";
import { readEnvEffect } from "../../effects/read-env-effect.js";
import { DenoRuntimeGlobalsSchema } from "./lib/schema.js";

/**
 * Creates a typed environment object from Deno's `Deno.env.get`.
 *
 * Use this entry point when your application is expected to run in Deno. Deno
 * requires env access permission, such as `--allow-env`.
 *
 * @example
 * ```ts
 * import { createDenoEnv } from "@tmrp/env/deno";
 * import z from "zod";
 *
 * const env = createDenoEnv({
 *   API_TOKEN: z.string().min(1),
 * });
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured variable is missing or fails validation.
 */
export function createDenoEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys
) {
  return createEnvEffect(envKeys, DenoRuntimeGlobalsSchema, readEnvEffect);
}
