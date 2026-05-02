import { Effect } from "effect";

import { readBrowserEnv } from "../runtime/browser/lib/read-browser-env.js";
import { readBunEnv } from "../runtime/bun/lib/read-bun-env.js";
import { readCloudflareEnv } from "../runtime/cloudflare/lib/read-cloudflare-env.js";
import { readDenoEnv } from "../runtime/deno/lib/read-deno-env.js";
import { readImportMetaEnv } from "../runtime/import-meta/lib/read-import-meta-env.js";
import { readNetlifyEnv } from "../runtime/netlify/lib/read-netlify-env.js";
import { readNodeEnv } from "../runtime/node/lib/read-node-env.js";
import { readVercelEdgeEnv } from "../runtime/vercel/lib/read-vercel-edge-env.js";
import { RuntimeGlobalsSchema } from "./schema.js";

/**
 * Reads an environment variable from the current runtime.
 *
 * The function checks known runtime globals and explicit global env records.
 * When a string value is found, surrounding whitespace is trimmed before it is
 * returned.
 *
 * @example
 * 	const apiBaseUrl = readEnv("API_BASE_URL");
 *
 * 	fetch(`${apiBaseUrl}/health`);
 *
 * @param env The name of the environment variable to read.
 * @returns The trimmed environment variable value, or `undefined` when the
 *   variable is not defined in the current runtime.
 */

export const readEnv = (env: string) => {
  const readEnvEffect = Effect.gen(function* () {
    const globalScope = yield* Effect.try({
      try: () => RuntimeGlobalsSchema.safeParse(globalThis),
      catch: () => undefined,
    });

    if (!globalScope.success) {
      return undefined;
    }

    const runtimeGlobals = globalScope.data;

    if (runtimeGlobals.Bun) {
      return readBunEnv(env);
    }

    if (runtimeGlobals.EdgeRuntime) {
      return readVercelEdgeEnv(env);
    }

    if (runtimeGlobals.process?.env.NETLIFY) {
      return readNetlifyEnv(env);
    }

    if (runtimeGlobals.process) {
      return readNodeEnv(env);
    }

    if (runtimeGlobals.Deno) {
      return readDenoEnv(env);
    }

    if (runtimeGlobals.__CLOUDFLARE_ENV__) {
      return readCloudflareEnv(env);
    }

    if (runtimeGlobals.__IMPORT_META_ENV__) {
      return readImportMetaEnv(env);
    }

    if (runtimeGlobals.__APP_CONFIG__ || runtimeGlobals.__ENV__) {
      return readBrowserEnv(env);
    }

    return undefined;
  });

  return Effect.runSync(readEnvEffect);
};
