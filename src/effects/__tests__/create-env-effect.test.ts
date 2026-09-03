import { describe, expect, it } from "vitest";
import z from "zod";

import { createEnvEffect } from "../create-env-effect.js";

describe("createEnvEffect", () => {
  it("creates env objects with custom runtime readers", () => {
    expect(
      createEnvEffect({ NAME: z.string() }, (key) => ` ${key.toLowerCase()} `)
    ).toEqual({ NAME: " name " });
  });

  it("lets schemas handle values missing from the runtime", () => {
    expect(
      createEnvEffect(
        {
          OPTIONAL: z.string().optional(),
          WITH_DEFAULT: z.string().default("fallback"),
        },
        () => undefined
      )
    ).toEqual({ OPTIONAL: undefined, WITH_DEFAULT: "fallback" });
  });
});
