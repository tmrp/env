import { describe, expect, it } from "vitest";
import z from "zod";

import { createRecordEnv } from "../create-record-env.js";

describe("createRecordEnv", () => {
  it("trims strings, preserves non-strings, and returns inferred values", () => {
    expect(
      createRecordEnv(
        {
          COUNT: z.coerce.number().int(),
          ENABLED: z.boolean(),
          NAME: z.string(),
          SETTINGS: z.object({ nested: z.literal(true) }),
        },
        {
          COUNT: " 42 ",
          ENABLED: false,
          NAME: " service ",
          SETTINGS: { nested: true },
        }
      )
    ).toEqual({
      COUNT: 42,
      ENABLED: false,
      NAME: "service",
      SETTINGS: { nested: true },
    });
  });

  it("treats nullish values as missing and surfaces validation errors", () => {
    expect(() => createRecordEnv({ MISSING: z.string() }, {})).toThrow(
      'Environment variable "MISSING" is not defined'
    );
    expect(() =>
      createRecordEnv({ MISSING: z.string() }, { MISSING: null })
    ).toThrow('Environment variable "MISSING" is not defined');
    expect(() =>
      createRecordEnv(
        { PORT: z.coerce.number().int() },
        { PORT: "not-a-number" }
      )
    ).toThrow('Environment variable "PORT" failed validation:');
  });
});
