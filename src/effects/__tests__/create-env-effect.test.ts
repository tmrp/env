import { describe, expect, it } from "vitest";
import z from "zod";

import { RuntimeGlobalsSchema } from "../../lib/schema.js";
import { createEnvEffect } from "../create-env-effect.js";

describe("createEnvEffect", () => {
  it("creates env objects with custom runtime readers", () => {
    expect(
      createEnvEffect(
        { NAME: z.string() },
        RuntimeGlobalsSchema,
        (key) => ` ${key.toLowerCase()} `
      )
    ).toEqual({ NAME: " name " });
  });
});
