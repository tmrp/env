import { afterEach, beforeAll, describe, expect, it } from "vitest";
import z from "zod";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../__tests__/runtime-globals.js";
import { createNodeEnv } from "../create-node-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("createNodeEnv", () => {
  it("reads process.env", () => {
    useRuntimeGlobals({ process: { env: { NAME: " node " } } });

    expect(createNodeEnv({ NAME: z.string() })).toEqual({ NAME: "node" });
  });

  it("throws missing-variable errors when process is unavailable", () => {
    clearRuntimeGlobals();

    expect(() => createNodeEnv({ NAME: z.string() })).toThrow(
      'Environment variable "NAME" is not defined'
    );
  });
});
