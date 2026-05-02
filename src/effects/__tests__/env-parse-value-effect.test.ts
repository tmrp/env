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
});
