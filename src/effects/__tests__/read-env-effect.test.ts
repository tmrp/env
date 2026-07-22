import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../__tests__/runtime-globals.js";
import { BunRuntimeGlobalsSchema } from "../../runtime/bun/lib/schema.js";
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
      " bun ",
    ],
    [
      "Vercel Edge before Node",
      { EdgeRuntime: "edge", process: { env: { NAME: " edge " } } },
      " edge ",
    ],
    [
      "Netlify before Node",
      { process: { env: { NAME: " netlify ", NETLIFY: "true" } } },
      " netlify ",
    ],
    ["Node", { process: { env: { NAME: " node " } } }, " node "],
    [
      "Deno",
      {
        Deno: {
          env: {
            get: (key: string) => (key === "NAME" ? " deno " : undefined),
          },
        },
      },
      " deno ",
    ],
    [
      "Cloudflare global shim",
      { __CLOUDFLARE_ENV__: { NAME: " cloudflare " } },
      " cloudflare ",
    ],
    [
      "import-meta global shim",
      { __IMPORT_META_ENV__: { NAME: " import-meta " } },
      " import-meta ",
    ],
    [
      "browser __APP_CONFIG__",
      { __APP_CONFIG__: { NAME: " app-config " } },
      " app-config ",
    ],
    ["browser __ENV__ fallback", { __ENV__: { NAME: " env " } }, " env "],
  ];

  it.each(cases)("reads from %s", (_name, globals, expected) => {
    useRuntimeGlobals(globals);

    expect(readEnvEffect("NAME")).toBe(expected);
  });

  it("ignores malformed globals from unrelated runtimes", () => {
    useRuntimeGlobals({
      __ENV__: "owned by another library",
      process: { env: { NAME: " node " } },
    });

    expect(readEnvEffect("NAME")).toBe(" node ");
  });

  it("continues after a malformed higher-priority runtime candidate", () => {
    useRuntimeGlobals({
      Bun: { env: null },
      process: { env: { NAME: " node " } },
    });

    expect(readEnvEffect("NAME")).toBe(" node ");
  });

  it("continues when a runtime candidate parser throws", () => {
    useRuntimeGlobals({ process: { env: { NAME: " node " } } });
    const safeParse = vi
      .spyOn(BunRuntimeGlobalsSchema, "safeParse")
      .mockImplementation(() => {
        throw new Error("boom");
      });

    expect(readEnvEffect("NAME")).toBe(" node ");
    safeParse.mockRestore();
  });

  it("continues to a browser fallback when a global getter throws", () => {
    useRuntimeGlobals({ __ENV__: { NAME: " env " } });
    Object.defineProperty(globalThis, "__APP_CONFIG__", {
      configurable: true,
      get: () => {
        throw new Error("boom");
      },
    });

    expect(readEnvEffect("NAME")).toBe(" env ");
  });

  it("returns undefined when a selected runtime has no readable value", () => {
    useRuntimeGlobals({ EdgeRuntime: "edge" });
    expect(readEnvEffect("NAME")).toBeUndefined();

    useRuntimeGlobals({
      Deno: { env: { get: () => undefined } },
    });
    expect(readEnvEffect("NAME")).toBeUndefined();
  });

  it("returns undefined without a readable runtime", () => {
    clearRuntimeGlobals();

    expect(readEnvEffect("NAME")).toBeUndefined();
  });
});
