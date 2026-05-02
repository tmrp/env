import type { EnvKeys } from "./lib/types.js";

import { createEnvEffect } from "./effects/create-env-effect.js";
import { readEnvEffect } from "./effects/read-env-effect.js";
import { RuntimeGlobalsSchema } from "./lib/schema.js";

/**
 * Creates a typed environment object from the currently available runtime.
 *
 * Use this entry point when your code can run across multiple supported
 * runtimes, or when you do not want to bind the call site to a runtime-specific
 * reader. The default reader detects supported globals such as Bun, Node, Deno,
 * Vercel Edge, Netlify, Cloudflare-style global bindings, import-meta global
 * shims, and browser config globals.
 *
 * For runtimes that pass env values directly to handlers, prefer the explicit
 * record-based runtime helpers when possible.
 *
 * @example
 * ```ts
 * import { createEnv } from "@tmrp/env";
 * import z from "zod";
 *
 * const env = createEnv({
 *   API_URL: z.url(),
 *   NODE_ENV: z.enum(["development", "test", "production"]),
 *   PORT: z.coerce.number().int().positive(),
 * });
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured variable is missing or fails validation.
 */
export function createEnv<const TEnvKeys extends EnvKeys>(envKeys: TEnvKeys) {
  return createEnvEffect(envKeys, RuntimeGlobalsSchema, readEnvEffect);
}
