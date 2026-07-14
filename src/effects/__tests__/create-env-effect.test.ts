import { describe, expect, it } from "vitest";
import z from "zod";

import { createEnvEffect } from "../create-env-effect.js";

describe("createEnvEffect", () => {
  it("creates env objects with custom runtime readers", () => {
    expect(
      createEnvEffect({ NAME: z.string() }, (key) => ` ${key.toLowerCase()} `)
    ).toEqual({ NAME: " name " });
  });
});
