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

  it("returns raw missing and invalid values when validation is skipped", () => {
    expect(
      createRecordEnv(
        { MISSING: z.string(), PORT: z.coerce.number().int() },
        { PORT: "not-a-number" },
        { skipValidation: true }
      )
    ).toEqual({ MISSING: undefined, PORT: "not-a-number" });
  });

  describe("clientPrefix", () => {
    it("validates all variables on the server", () => {
      const run = () =>
        createRecordEnv(
          {
            DATABASE_URL: z.string(),
            NEXT_PUBLIC_API_URL: z.string(),
          },
          {
            NEXT_PUBLIC_API_URL: "https://api.example.com",
          },
          {
            clientPrefix: "NEXT_PUBLIC_",
            isServer: true,
          }
        );
      expect(run).toThrow('Environment variable "DATABASE_URL" is not defined');
    });

    it("skips validation for non-prefixed variables on the client", () => {
      const env = createRecordEnv(
        {
          DATABASE_URL: z.string(),
          NEXT_PUBLIC_API_URL: z.string(),
        },
        {
          NEXT_PUBLIC_API_URL: "https://api.example.com",
        },
        {
          clientPrefix: "NEXT_PUBLIC_",
          isServer: false,
        }
      );
      expect(env).toEqual({
        DATABASE_URL: undefined,
        NEXT_PUBLIC_API_URL: "https://api.example.com",
      });
    });

    it("throws error for missing prefixed variables on the client", () => {
      const run = () =>
        createRecordEnv(
          {
            DATABASE_URL: z.string(),
            NEXT_PUBLIC_API_URL: z.string(),
          },
          {
            DATABASE_URL: "postgres://localhost",
          },
          {
            clientPrefix: "NEXT_PUBLIC_",
            isServer: false,
          }
        );
      expect(run).toThrow(
        'Environment variable "NEXT_PUBLIC_API_URL" is not defined'
      );
    });

    it("defaults to validating all variables on the client if no prefix is set", () => {
      const run = () =>
        createRecordEnv(
          {
            DATABASE_URL: z.string(),
            NEXT_PUBLIC_API_URL: z.string(),
          },
          {
            NEXT_PUBLIC_API_URL: "https://api.example.com",
          },
          {
            isServer: false,
          }
        );
      expect(run).toThrow('Environment variable "DATABASE_URL" is not defined');
    });
  });
});
