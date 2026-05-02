import { describe, expect, it } from "vitest";

import { BunRuntimeGlobalsSchema } from "../schema.js";

describe("BunRuntimeGlobalsSchema", () => {
  it("validates Bun runtime globals", () => {
    expect(
      BunRuntimeGlobalsSchema.safeParse({ Bun: { env: { NAME: "value" } } })
        .success
    ).toBe(true);
    expect(
      BunRuntimeGlobalsSchema.safeParse({ Bun: { env: 123 } }).success
    ).toBe(false);
  });
});
