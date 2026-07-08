
import z, { type ZodType } from "zod";

import { BrowserRuntimeGlobalsSchema } from "../runtime/browser/lib/schema.js";
import { BunRuntimeGlobalsSchema } from "../runtime/bun/lib/schema.js";
import { CloudflareRuntimeGlobalsSchema } from "../runtime/cloudflare/lib/schema.js";
import { DenoRuntimeGlobalsSchema } from "../runtime/deno/lib/schema.js";
import { ImportMetaRuntimeGlobalsSchema } from "../runtime/import-meta/lib/schema.js";
import { NetlifyRuntimeGlobalsSchema } from "../runtime/netlify/lib/schema.js";
import { NodeRuntimeGlobalsSchema } from "../runtime/node/lib/schema.js";
import { VercelEdgeRuntimeGlobalsSchema } from "../runtime/vercel/lib/schema.js";

export const RuntimeGlobalsSchema = z.object({
  __APP_CONFIG__: BrowserRuntimeGlobalsSchema.shape.__APP_CONFIG__?.optional(),
  __CLOUDFLARE_ENV__:
    CloudflareRuntimeGlobalsSchema.shape.__CLOUDFLARE_ENV__?.optional(),
  __ENV__: BrowserRuntimeGlobalsSchema.shape.__ENV__?.optional(),
  __IMPORT_META_ENV__:
    ImportMetaRuntimeGlobalsSchema.shape.__IMPORT_META_ENV__?.optional(),
  Bun: BunRuntimeGlobalsSchema.shape.Bun?.optional(),
  Deno: DenoRuntimeGlobalsSchema.shape.Deno?.optional(),
  EdgeRuntime: VercelEdgeRuntimeGlobalsSchema.shape.EdgeRuntime?.optional(),
  process: NodeRuntimeGlobalsSchema.shape.process
    ?.or(NetlifyRuntimeGlobalsSchema.shape.process)
    .optional(),
});

export type RuntimeGlobals = z.infer<typeof RuntimeGlobalsSchema>;

export type RuntimeGlobalsSchemaType = ZodType<Partial<RuntimeGlobals>>;
