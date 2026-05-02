import type { EnvKeys, EnvRecord } from "../../lib/types.js";

import { createRecordEnv } from "../record/create-record-env.js";

/**
 * Creates a typed environment object from an `import.meta.env`-style object.
 *
 * Use this for Vite, Astro, SvelteKit, Nuxt, or any other toolchain that
 * exposes build-time environment values through `import.meta.env`.
 *
 * @example
 * ```ts
 * import { createImportMetaEnv } from "@tmrp/env/import-meta";
 * import z from "zod";
 *
 * const env = createImportMetaEnv(
 *   {
 *     DEV: z.boolean(),
 *     VITE_API_URL: z.url(),
 *   },
 *   import.meta.env
 * );
 * ```
 *
 * @param envKeys Environment variable names mapped to Zod schemas.
 * @param importMetaEnv The `import.meta.env` object, or a compatible object.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation.
 */
export function createImportMetaEnv<const TEnvKeys extends EnvKeys>(
  envKeys: TEnvKeys,
  importMetaEnv: EnvRecord
) {
  return createRecordEnv(envKeys, importMetaEnv);
}
