import type { EnvKeys, EnvRecord } from "../../lib/types.js";

import { createRecordEnv } from "../record/create-record-env.js";

/**
 * Creates a typed environment object from an explicit browser config object.
 *
 * Use this for client-side configuration that has already been made available
 * to browser code, such as `globalThis.__APP_CONFIG__`. Only pass values that
 * are safe to expose publicly.
 *
 * @example
 * ```ts
 * import { createBrowserEnv } from "@tmrp/env/browser";
 * import z from "zod";
 *
 * const env = createBrowserEnv(
 *   { PUBLIC_API_URL: z.url() },
 *   globalThis.__APP_CONFIG__ as Record<string, unknown>
 * );
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @param env Browser config object to read values from.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation.
 */
export function createBrowserEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  env: EnvRecord
) {
  return createRecordEnv(envKeys, env);
}
