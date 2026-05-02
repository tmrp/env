import { Effect } from "effect";

import type { RuntimeGlobalsSchemaType } from "../lib/schema.js";

import { readBrowserEnv } from "../runtime/browser/lib/read-browser-env.js";
import { readBunEnv } from "../runtime/bun/lib/read-bun-env.js";
import { readCloudflareEnv } from "../runtime/cloudflare/lib/read-cloudflare-env.js";
import { readDenoEnv } from "../runtime/deno/lib/read-deno-env.js";
import { readImportMetaEnv } from "../runtime/import-meta/lib/read-import-meta-env.js";
import { readNetlifyEnv } from "../runtime/netlify/lib/read-netlify-env.js";
import { readNodeEnv } from "../runtime/node/lib/read-node-env.js";
import { readVercelEdgeEnv } from "../runtime/vercel/lib/read-vercel-edge-env.js";
import { getRuntimeGlobalScopeEffect } from "./get-runtime-global-scope-effect.js";

type Env = string;

export const readEnvEffect = (
  env: Env,
  runtimeSchema: RuntimeGlobalsSchemaType
) => {
  const readEnvEffect = Effect.gen(function* () {
    const globalScope = yield* getRuntimeGlobalScopeEffect(runtimeSchema);

    if (globalScope?.Bun) {
      return readBunEnv(env);
    }

    if (globalScope?.EdgeRuntime) {
      return readVercelEdgeEnv(env);
    }

    if (globalScope?.process?.env.NETLIFY) {
      return readNetlifyEnv(env);
    }

    if (globalScope?.process) {
      return readNodeEnv(env);
    }

    if (globalScope?.Deno) {
      return readDenoEnv(env);
    }

    if (globalScope?.__CLOUDFLARE_ENV__) {
      return readCloudflareEnv(env);
    }

    if (globalScope?.__IMPORT_META_ENV__) {
      return readImportMetaEnv(env);
    }

    if (globalScope?.__APP_CONFIG__ || globalScope?.__ENV__) {
      return readBrowserEnv(env);
    }

    return undefined;
  });

  return Effect.runSync(readEnvEffect);
};
