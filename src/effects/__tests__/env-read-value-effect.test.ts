import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { envReadValueEffect } from "../env-read-value-effect.js";

describe("envReadValueEffect", () => {
  it("reads values without assigning schema semantics", () => {
    expect(Effect.runSync(envReadValueEffect("NAME", () => "value"))).toBe(
      "value"
    );
    expect(
      Effect.runSync(envReadValueEffect("NAME", () => undefined))
    ).toBeUndefined();
    expect(Effect.runSync(envReadValueEffect("NAME", () => null))).toBeNull();
  });

  it("wraps errors thrown while reading the value", () => {
    expect(() =>
      Effect.runSync(
        envReadValueEffect("NAME", () => {
          throw new Error("PermissionDenied");
        })
      )
    ).toThrow('Environment variable "NAME" failed to read');
  });
});
