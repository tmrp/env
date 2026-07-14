import type { EnvKeys, EnvRecord, Options } from "../../lib/types.js";

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
 * @param options Parsing options. Set `skipValidation` to return raw values and
 *   `undefined` for unavailable values instead of throwing, such as during CI or
 *   build steps where runtime env vars are not present.
 * @returns A strongly typed object inferred from `envKeys`.
 * @throws When a configured value is missing or fails validation, unless
 *   `options.skipValidation` is enabled.
 */
export function createImportMetaEnv<
  const TEnvKeys extends EnvKeys,
  const TOptions extends Options | undefined = undefined,
>(envKeys: TEnvKeys, importMetaEnv: EnvRecord, options?: TOptions) {
  return createRecordEnv(envKeys, importMetaEnv, options);
}
