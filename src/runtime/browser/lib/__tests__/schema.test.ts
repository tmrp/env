import { describe, expect, it } from "vitest";

import {
  BrowserAppConfigRuntimeGlobalsSchema,
  BrowserEnvRuntimeGlobalsSchema,
} from "../schema.js";

describe("browser runtime global schemas", () => {
  it("validates browser runtime globals independently", () => {
    expect(
      BrowserAppConfigRuntimeGlobalsSchema.safeParse({
        __APP_CONFIG__: { NAME: "value" },
      }).success
    ).toBe(true);
    expect(
      BrowserAppConfigRuntimeGlobalsSchema.safeParse({ __APP_CONFIG__: null })
        .success
    ).toBe(false);
    expect(
      BrowserEnvRuntimeGlobalsSchema.safeParse({
        __ENV__: { NAME: "value" },
      }).success
    ).toBe(true);
  });
});
