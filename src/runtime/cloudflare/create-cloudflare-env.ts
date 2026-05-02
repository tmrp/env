import type { EnvKeys, EnvRecord } from "../../lib/types.js";

import { createRecordEnv } from "../record/create-record-env.js";

/**
 * Creates a typed environment object from Cloudflare Worker bindings.
 *
 * Cloudflare passes bindings to handlers instead of exposing them as normal
 * process environment variables. Pass the handler's bindings object as the
 * second argument.
 *
 * @example
 * ```ts
 * import { createCloudflareEnv } from "@tmrp/env/cloudflare";
 * import z from "zod";
 *
 * export default {
 *   fetch(request: Request, bindings: Record<string, unknown>) {
 *     const env = createCloudflareEnv(
 *       { API_TOKEN: z.string().min(1) },
 *       bindings
 *     );
 *
 *     return new Response(env.API_TOKEN);
 *   },
 * };
 * ```
 *
 * @param envKeys Binding names mapped to Zod schemas.
 * @param bindings Cloudflare Worker bindings object.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured binding is missing or fails validation.
 */
export function createCloudflareEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  bindings: EnvRecord
) {
  return createRecordEnv(envKeys, bindings);
}
