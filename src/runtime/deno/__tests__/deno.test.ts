import { afterEach, beforeAll, describe, expect, it } from "vitest";
import z from "zod";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../__tests__/runtime-globals.js";
import { createDenoEnv } from "../create-deno-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("createDenoEnv", () => {
  it("reads Deno.env.get", () => {
    useRuntimeGlobals({
      Deno: {
        env: { get: (key: string) => (key === "NAME" ? " deno " : undefined) },
      },
    });

    expect(createDenoEnv({ NAME: z.string() })).toEqual({ NAME: "deno" });
  });

  it("throws missing-variable errors when Deno is unavailable", () => {
    clearRuntimeGlobals();

    expect(() => createDenoEnv({ NAME: z.string() })).toThrow(
      'Environment variable "NAME" is not defined'
    );
  });
});
