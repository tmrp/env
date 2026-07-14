import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../__tests__/runtime-globals.js";
import { readEnv } from "../read-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readEnv", () => {
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

    expect(readEnv("NAME")).toBe(expected);
  });

  it("returns undefined when runtime parsing fails or finds no runtime", () => {
    clearRuntimeGlobals();
    expect(readEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ process: null });
    expect(readEnv("NAME")).toBeUndefined();
  });

  it("ignores malformed globals from unrelated runtimes", () => {
    useRuntimeGlobals({
      __ENV__: "owned by another library",
      process: { env: { NAME: " node " } },
    });

    expect(readEnv("NAME")).toBe("node");
  });
});
