import type { ZodType } from "zod";

import { createEnv } from "@tmrp/env";
import { createBrowserEnv } from "@tmrp/env/browser";
import { createCloudflareEnv } from "@tmrp/env/cloudflare";
import { createImportMetaEnv } from "@tmrp/env/import-meta";
import { createNetlifyEnv } from "@tmrp/env/netlify";
import { createRecordEnv } from "@tmrp/env/record";
import { createVercelEdgeEnv } from "@tmrp/env/vercel-edge";

import type { Options } from "./schema-spec";

type CreateFn = (
  envKeys: Record<string, ZodType>,
  record: Record<string, unknown>,
  options?: Options
) => unknown;

/**
 * `createEnv` auto-detects runtime globals instead of taking a record. In the
 * browser none of the higher-priority globals exist, so exposing the values
 * as `globalThis.__APP_CONFIG__` (the documented browser config global) lets
 * detection find them. Any previous global is restored afterwards.
 */
const createAutoEnv: CreateFn = (envKeys, record, options) => {
  const scope = globalThis as Record<string, unknown>;
  const hadAppConfig = "__APP_CONFIG__" in scope;
  const previous = scope.__APP_CONFIG__;
  scope.__APP_CONFIG__ = record;
  try {
    return createEnv(envKeys, options);
  } finally {
    if (hadAppConfig) {
      scope.__APP_CONFIG__ = previous;
    } else {
      delete scope.__APP_CONFIG__;
    }
  }
};

export type EntryPoint = {
  create: CreateFn;
  fnName: string;
  id: string;
  importPath: string;
  label: string;
  /** Hint shown under the entry point select. */
  note?: string;
  /** Setup code emitted before the create call in the generated snippet. */
  preamble?: string;
  /** Code sample used for the record argument; omit for global readers. */
  recordArg?: string;
};

/**
 * The record-based entry points, plus the auto-detecting root entry point.
 * All of them take `(envKeys, record, options)` (the auto-detect wrapper
 * adapts `createEnv` to that shape), so they can run entirely in the browser
 * against values typed into the playground.
 */
export const entryPoints: Array<EntryPoint> = [
  {
    create: createAutoEnv,
    fnName: "createEnv",
    id: "auto",
    importPath: "@tmrp/env",
    label: "Auto-detect runtime",
    note: "Auto-detects runtime globals instead of taking a record. The playground exposes your values as globalThis.__APP_CONFIG__ (browser config) so detection finds them.",
    preamble:
      "// Auto-detects runtime globals. In the browser, expose values\n// as a config global first (see the @tmrp/env README):\nglobalThis.__APP_CONFIG__ = runtimeEnv;",
  },
  {
    create: createRecordEnv,
    fnName: "createRecordEnv",
    id: "record",
    importPath: "@tmrp/env/record",
    label: "Record (explicit object)",
    recordArg: "runtimeEnv",
  },
  {
    create: createBrowserEnv,
    fnName: "createBrowserEnv",
    id: "browser",
    importPath: "@tmrp/env/browser",
    label: "Browser config",
    recordArg: "globalThis.__APP_CONFIG__ as Record<string, unknown>",
  },
  {
    create: createCloudflareEnv,
    fnName: "createCloudflareEnv",
    id: "cloudflare",
    importPath: "@tmrp/env/cloudflare",
    label: "Cloudflare bindings",
    recordArg: "bindings",
  },
  {
    create: createImportMetaEnv,
    fnName: "createImportMetaEnv",
    id: "import-meta",
    importPath: "@tmrp/env/import-meta",
    label: "import.meta.env",
    recordArg: "import.meta.env",
  },
  {
    create: createNetlifyEnv,
    fnName: "createNetlifyEnv",
    id: "netlify",
    importPath: "@tmrp/env/netlify",
    label: "Netlify env object",
    recordArg: "process.env",
  },
  {
    create: createVercelEdgeEnv,
    fnName: "createVercelEdgeEnv",
    id: "vercel-edge",
    importPath: "@tmrp/env/vercel-edge",
    label: "Vercel Edge env object",
    recordArg: "process.env",
  },
];

export const getEntryPoint = (id: string): EntryPoint =>
  entryPoints.find((entryPoint) => entryPoint.id === id) ?? entryPoints[0];
