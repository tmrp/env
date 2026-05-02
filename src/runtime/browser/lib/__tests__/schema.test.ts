import { describe, expect, it } from "vitest";

import { BrowserRuntimeGlobalsSchema } from "../schema.js";

describe("BrowserRuntimeGlobalsSchema", () => {
  it("validates browser runtime globals", () => {
    expect(
      BrowserRuntimeGlobalsSchema.safeParse({
        __APP_CONFIG__: { NAME: "value" },
      }).success
    ).toBe(true);
    expect(
      BrowserRuntimeGlobalsSchema.safeParse({ __APP_CONFIG__: null }).success
    ).toBe(false);
  });
});
