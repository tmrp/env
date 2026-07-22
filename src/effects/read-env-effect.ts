import { parseRuntimeGlobal } from "../lib/parse-runtime-global.js";
import {
  BrowserAppConfigRuntimeGlobalsSchema,
  BrowserEnvRuntimeGlobalsSchema,
} from "../runtime/browser/lib/schema.js";
import { BunRuntimeGlobalsSchema } from "../runtime/bun/lib/schema.js";
import { CloudflareRuntimeGlobalsSchema } from "../runtime/cloudflare/lib/schema.js";
import { DenoRuntimeGlobalsSchema } from "../runtime/deno/lib/schema.js";
import { ImportMetaRuntimeGlobalsSchema } from "../runtime/import-meta/lib/schema.js";
import { NetlifyRuntimeGlobalsSchema } from "../runtime/netlify/lib/schema.js";
import { NodeRuntimeGlobalsSchema } from "../runtime/node/lib/schema.js";
import { readRecordEnv } from "../runtime/record/lib/read-record-env.js";
import { VercelEdgeRuntimeGlobalsSchema } from "../runtime/vercel/lib/schema.js";

export const readEnvEffect = (env: string) => {
  const bunGlobal = parseRuntimeGlobal(BunRuntimeGlobalsSchema);

  if (bunGlobal?.Bun) {
    return readRecordEnv(env, bunGlobal.Bun.env);
  }

  if (parseRuntimeGlobal(VercelEdgeRuntimeGlobalsSchema)?.EdgeRuntime) {
    const nodeGlobal = parseRuntimeGlobal(NodeRuntimeGlobalsSchema);

    return nodeGlobal?.process
      ? readRecordEnv(env, nodeGlobal.process.env)
      : undefined;
  }

  const netlifyGlobal = parseRuntimeGlobal(NetlifyRuntimeGlobalsSchema);

  if (netlifyGlobal?.process?.env.NETLIFY) {
    return readRecordEnv(env, netlifyGlobal.process.env);
  }

  const nodeGlobal = parseRuntimeGlobal(NodeRuntimeGlobalsSchema);

  if (nodeGlobal?.process) {
    return readRecordEnv(env, nodeGlobal.process.env);
  }

  const denoGlobal = parseRuntimeGlobal(DenoRuntimeGlobalsSchema);

  if (denoGlobal?.Deno) {
    return denoGlobal.Deno.env.get(env) ?? undefined;
  }

  const cloudflareGlobal = parseRuntimeGlobal(CloudflareRuntimeGlobalsSchema);

  if (cloudflareGlobal?.__CLOUDFLARE_ENV__) {
    return readRecordEnv(env, cloudflareGlobal.__CLOUDFLARE_ENV__);
  }

  const importMetaGlobal = parseRuntimeGlobal(ImportMetaRuntimeGlobalsSchema);

  if (importMetaGlobal?.__IMPORT_META_ENV__) {
    return readRecordEnv(env, importMetaGlobal.__IMPORT_META_ENV__);
  }

  const appConfigGlobal = parseRuntimeGlobal(
    BrowserAppConfigRuntimeGlobalsSchema
  );

  if (appConfigGlobal?.__APP_CONFIG__) {
    return readRecordEnv(env, appConfigGlobal.__APP_CONFIG__);
  }

  const browserEnvGlobal = parseRuntimeGlobal(BrowserEnvRuntimeGlobalsSchema);

  if (browserEnvGlobal?.__ENV__) {
    return readRecordEnv(env, browserEnvGlobal.__ENV__);
  }

  return undefined;
};
