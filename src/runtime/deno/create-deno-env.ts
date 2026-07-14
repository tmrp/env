import type { EnvKeys, Options } from "../../lib/types.js";

import { createEnvEffect } from "../../effects/create-env-effect.js";
import { readDenoEnv } from "./lib/read-deno-env.js";

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
 * @param options Parsing options. Set `skipValidation` to return raw values and
 *   `undefined` for unavailable variables instead of throwing, such as during CI
 *   or build steps where runtime env vars are not present.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured variable is missing or fails validation, unless
 *   `options.skipValidation` is enabled.
 */
export function createDenoEnv<
  const TEnvKeys extends EnvKeys,
  const TOptions extends Options | undefined = undefined,
>(envKeys: TEnvKeys, options?: TOptions) {
  return createEnvEffect(envKeys, readDenoEnv, options);
}
