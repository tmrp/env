import { describe, expect, it } from "vitest";

import { RuntimeGlobalsSchema } from "../schema.js";

describe("RuntimeGlobalsSchema", () => {
  it("accepts supported runtime global shapes", () => {
    expect(
      RuntimeGlobalsSchema.safeParse({
        __APP_CONFIG__: { APP: "value" },
        __CLOUDFLARE_ENV__: { BINDING: true },
        __ENV__: { PUBLIC_VALUE: "value" },
        __IMPORT_META_ENV__: { DEV: true },
        Bun: { env: { NAME: "value" } },
        Deno: { env: { get: () => "value" } },
        EdgeRuntime: "edge",
        process: { env: { NAME: "value" } },
      }).success
    ).toBe(true);
  });

  it("rejects invalid runtime global shapes", () => {
    expect(RuntimeGlobalsSchema.safeParse({ process: null }).success).toBe(
      false
    );
  });
});
