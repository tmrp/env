import { createEnv } from "@tmrp/env";
import { createBrowserEnv } from "@tmrp/env/browser";
import { createCloudflareEnv } from "@tmrp/env/cloudflare";
import { createImportMetaEnv } from "@tmrp/env/import-meta";
import { createNetlifyEnv } from "@tmrp/env/netlify";
import { createNodeEnv } from "@tmrp/env/node";
import { createRecordEnv } from "@tmrp/env/record";
import { createVercelEdgeEnv } from "@tmrp/env/vercel-edge";
import { strict as assert } from "node:assert";
import z from "zod";

process.env.RUNTIME_SMOKE_NODE = " node ";
process.env.RUNTIME_SMOKE_AUTO = " auto ";

assert.deepEqual(createNodeEnv({ RUNTIME_SMOKE_NODE: z.string().min(1) }), {
  RUNTIME_SMOKE_NODE: "node",
});

assert.deepEqual(createEnv({ RUNTIME_SMOKE_AUTO: z.string().min(1) }), {
  RUNTIME_SMOKE_AUTO: "auto",
});

assert.deepEqual(
  createRecordEnv(
    { RUNTIME_SMOKE_RECORD: z.string().min(1) },
    {
      RUNTIME_SMOKE_RECORD: " record ",
    }
  ),
  { RUNTIME_SMOKE_RECORD: "record" }
);

assert.deepEqual(
  createCloudflareEnv(
    { RUNTIME_SMOKE_CLOUDFLARE: z.string().min(1) },
    {
      RUNTIME_SMOKE_CLOUDFLARE: " cloudflare ",
    }
  ),
  { RUNTIME_SMOKE_CLOUDFLARE: "cloudflare" }
);

assert.deepEqual(
  createVercelEdgeEnv(
    { RUNTIME_SMOKE_VERCEL: z.string().min(1) },
    {
      RUNTIME_SMOKE_VERCEL: " vercel ",
    }
  ),
  { RUNTIME_SMOKE_VERCEL: "vercel" }
);

assert.deepEqual(
  createNetlifyEnv(
    { RUNTIME_SMOKE_NETLIFY: z.string().min(1) },
    {
      RUNTIME_SMOKE_NETLIFY: " netlify ",
    }
  ),
  { RUNTIME_SMOKE_NETLIFY: "netlify" }
);

assert.deepEqual(
  createBrowserEnv(
    { RUNTIME_SMOKE_BROWSER: z.string().min(1) },
    {
      RUNTIME_SMOKE_BROWSER: " browser ",
    }
  ),
  { RUNTIME_SMOKE_BROWSER: "browser" }
);

assert.deepEqual(
  createImportMetaEnv(
    { RUNTIME_SMOKE_IMPORT_META: z.string().min(1) },
    {
      RUNTIME_SMOKE_IMPORT_META: " import-meta ",
    }
  ),
  { RUNTIME_SMOKE_IMPORT_META: "import-meta" }
);
