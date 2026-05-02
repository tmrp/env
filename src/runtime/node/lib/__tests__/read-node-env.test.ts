import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readNodeEnv } from "../read-node-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readNodeEnv", () => {
  it("reads process.env", () => {
    useRuntimeGlobals({ process: { env: { NAME: " node " } } });

    expect(readNodeEnv("NAME")).toBe("node");
  });

  it("returns undefined for absent, invalid, or missing Node values", () => {
    clearRuntimeGlobals();
    expect(readNodeEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ process: null });
    expect(readNodeEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ process: { env: {} } });
    expect(readNodeEnv("NAME")).toBeUndefined();
  });
});
