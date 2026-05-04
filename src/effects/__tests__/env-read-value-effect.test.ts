import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { envReadValueEffect } from "../env-read-value-effect.js";

describe("envReadValueEffect", () => {
  it("reads values and wraps missing values", () => {
    expect(Effect.runSync(envReadValueEffect("NAME", () => "value"))).toBe(
      "value"
    );
    expect(() =>
      Effect.runSync(envReadValueEffect("NAME", () => undefined))
    ).toThrow('Environment variable "NAME" is not defined');
  });

  it("allows missing values when validation is skipped", () => {
    expect(
      Effect.runSync(
        envReadValueEffect("NAME", () => undefined, { skipValidation: true })
      )
    ).toBeUndefined();
  });
});
