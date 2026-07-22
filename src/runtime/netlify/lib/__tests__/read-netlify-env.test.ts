import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readNetlifyEnv } from "../read-netlify-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readNetlifyEnv", () => {
  it("reads process.env when NETLIFY is present", () => {
    useRuntimeGlobals({
      process: { env: { NAME: " netlify ", NETLIFY: "true" } },
    });

    expect(readNetlifyEnv("NAME")).toBe(" netlify ");
  });

  it("returns undefined for absent, invalid, or non-Netlify process globals", () => {
    clearRuntimeGlobals();
    expect(readNetlifyEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ process: { env: { NETLIFY: 123 } } });
    expect(readNetlifyEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ process: { env: {} } });
    expect(readNetlifyEnv("NAME")).toBeUndefined();
  });
});
