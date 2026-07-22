import { afterEach, beforeAll, describe, expect, it } from "vitest";
import z from "zod";

import { createEnv } from "../create-env.js";
import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "./runtime-globals.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("createEnv", () => {
  it("reads from the detected runtime and is re-exported from index", () => {
    useRuntimeGlobals({ process: { env: { NAME: " node " } } });

    expect(createEnv({ NAME: z.string() })).toEqual({ NAME: " node " });
  });

  it("throws a missing-variable error without a readable runtime", () => {
    clearRuntimeGlobals();

    expect(() => createEnv({ NAME: z.string() })).toThrow(
      'Environment variable "NAME" is not defined'
    );
  });

  it("allows missing variables when validation is skipped", () => {
    clearRuntimeGlobals();

    expect(createEnv({ NAME: z.string() }, { skipValidation: true })).toEqual({
      NAME: undefined,
    });
  });

  describe("clientPrefix", () => {
    it("validates all variables on the server", () => {
      useRuntimeGlobals({
        process: {
          env: {
            NEXT_PUBLIC_API_URL: "https://api.example.com",
          },
        },
      });

      expect(() =>
        createEnv(
          {
            DATABASE_URL: z.string(),
            NEXT_PUBLIC_API_URL: z.string(),
          },
          {
            clientPrefix: "NEXT_PUBLIC_",
            isServer: true,
          }
        )
      ).toThrow('Environment variable "DATABASE_URL" is not defined');
    });

    it("skips validation for non-prefixed variables on the client", () => {
      useRuntimeGlobals({
        process: {
          env: {
            NEXT_PUBLIC_API_URL: "https://api.example.com",
          },
        },
      });

      const env = createEnv(
        {
          DATABASE_URL: z.string(),
          NEXT_PUBLIC_API_URL: z.string(),
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
      useRuntimeGlobals({
        process: {
          env: {
            DATABASE_URL: "postgres://localhost",
          },
        },
      });

      expect(() =>
        createEnv(
          {
            DATABASE_URL: z.string(),
            NEXT_PUBLIC_API_URL: z.string(),
          },
          {
            clientPrefix: "NEXT_PUBLIC_",
            isServer: false,
          }
        )
      ).toThrow('Environment variable "NEXT_PUBLIC_API_URL" is not defined');
    });
  });
});
