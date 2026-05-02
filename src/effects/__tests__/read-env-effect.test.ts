import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../__tests__/runtime-globals.js";
import { RuntimeGlobalsSchema } from "../../lib/schema.js";
import { readEnvEffect } from "../read-env-effect.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readEnvEffect", () => {
  const cases: Array<
    [string, Parameters<typeof useRuntimeGlobals>[0], string]
  > = [
    [
      "Bun before Node",
      { Bun: { env: { NAME: " bun " } }, process: { env: { NAME: "node" } } },
      "bun",
    ],
    [
      "Vercel Edge before Node",
      { EdgeRuntime: "edge", process: { env: { NAME: " edge " } } },
      "edge",
    ],
    [
      "Netlify before Node",
      { process: { env: { NAME: " netlify ", NETLIFY: "true" } } },
      "netlify",
    ],
    ["Node", { process: { env: { NAME: " node " } } }, "node"],
    [
      "Deno",
      {
        Deno: {
          env: {
            get: (key: string) => (key === "NAME" ? " deno " : undefined),
          },
        },
      },
      "deno",
    ],
    [
      "Cloudflare global shim",
      { __CLOUDFLARE_ENV__: { NAME: " cloudflare " } },
      "cloudflare",
    ],
    [
      "import-meta global shim",
      { __IMPORT_META_ENV__: { NAME: " import-meta " } },
      "import-meta",
    ],
    [
      "browser __APP_CONFIG__",
      { __APP_CONFIG__: { NAME: " app-config " } },
      "app-config",
    ],
    ["browser __ENV__ fallback", { __ENV__: { NAME: " env " } }, "env"],
  ];

  it.each(cases)("reads from %s", (_name, globals, expected) => {
    useRuntimeGlobals(globals);

    expect(readEnvEffect("NAME", RuntimeGlobalsSchema)).toBe(expected);
  });

  it("returns undefined without a readable runtime", () => {
    clearRuntimeGlobals();

    expect(readEnvEffect("NAME", RuntimeGlobalsSchema)).toBeUndefined();
  });
});
