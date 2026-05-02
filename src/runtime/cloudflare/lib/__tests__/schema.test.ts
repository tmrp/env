import { describe, expect, it } from "vitest";

import { CloudflareRuntimeGlobalsSchema } from "../schema.js";

describe("CloudflareRuntimeGlobalsSchema", () => {
  it("validates Cloudflare runtime globals", () => {
    expect(
      CloudflareRuntimeGlobalsSchema.safeParse({
        __CLOUDFLARE_ENV__: { NAME: "value" },
      }).success
    ).toBe(true);
    expect(
      CloudflareRuntimeGlobalsSchema.safeParse({ __CLOUDFLARE_ENV__: null })
        .success
    ).toBe(false);
  });
});
