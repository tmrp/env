import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import z from "zod";

import { envParseValueEffect } from "../env-parse-value-effect.js";

describe("envParseValueEffect", () => {
  it("parses values and wraps parse failures", () => {
    expect(
      Effect.runSync(envParseValueEffect("PORT", z.coerce.number(), "42"))
    ).toBe(42);
    expect(() =>
      Effect.runSync(envParseValueEffect("PORT", z.number(), "42"))
    ).toThrow('Environment variable "PORT" failed validation:');
  });

  it("lets schemas handle missing values", () => {
    expect(
      Effect.runSync(
        envParseValueEffect("OPTIONAL", z.string().optional(), undefined)
      )
    ).toBeUndefined();
    expect(
      Effect.runSync(
        envParseValueEffect(
          "WITH_DEFAULT",
          z.string().default("fallback"),
          undefined
        )
      )
    ).toBe("fallback");
    expect(() =>
      Effect.runSync(envParseValueEffect("REQUIRED", z.string(), undefined))
    ).toThrow('Environment variable "REQUIRED" is not defined');
  });

  it("returns raw values when validation is skipped", () => {
    expect(
      Effect.runSync(
        envParseValueEffect("PORT", z.coerce.number(), "not-a-number", {
          skipValidation: true,
        })
      )
    ).toBe("not-a-number");
  });
});
