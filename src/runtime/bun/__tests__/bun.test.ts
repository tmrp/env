import { afterEach, beforeAll, describe, expect, it } from "vitest";
import z from "zod";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../__tests__/runtime-globals.js";
import { createBunEnv } from "../create-bun-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("createBunEnv", () => {
  it("reads Bun.env", () => {
    useRuntimeGlobals({ Bun: { env: { NAME: " bun " } } });

    expect(createBunEnv({ NAME: z.string() })).toEqual({ NAME: "bun" });
  });

  it("throws missing-variable errors when Bun is unavailable", () => {
    clearRuntimeGlobals();

    expect(() => createBunEnv({ NAME: z.string() })).toThrow(
      'Environment variable "NAME" is not defined'
    );
  });
});
