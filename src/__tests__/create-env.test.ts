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

    expect(createEnv({ NAME: z.string() })).toEqual({ NAME: "node" });
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
});
