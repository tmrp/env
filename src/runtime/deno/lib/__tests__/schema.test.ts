import { describe, expect, it } from "vitest";

import { DenoRuntimeGlobalsSchema } from "../schema.js";

describe("DenoRuntimeGlobalsSchema", () => {
  it("validates Deno runtime globals", () => {
    expect(
      DenoRuntimeGlobalsSchema.safeParse({
        Deno: { env: { get: () => "value" } },
      }).success
    ).toBe(true);
    expect(
      DenoRuntimeGlobalsSchema.safeParse({ Deno: { env: { get: "nope" } } })
        .success
    ).toBe(false);
  });
});
