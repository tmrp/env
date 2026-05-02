import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readBrowserEnv } from "../read-browser-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readBrowserEnv", () => {
  it("reads __APP_CONFIG__ before __ENV__", () => {
    useRuntimeGlobals({
      __APP_CONFIG__: { NAME: " app " },
      __ENV__: { NAME: " env " },
    });

    expect(readBrowserEnv("NAME")).toBe("app");
  });

  it("reads __ENV__ as a fallback", () => {
    useRuntimeGlobals({ __ENV__: { NAME: " env " } });

    expect(readBrowserEnv("NAME")).toBe("env");
  });

  it("returns undefined for absent or invalid browser globals", () => {
    clearRuntimeGlobals();
    expect(readBrowserEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ __APP_CONFIG__: null });
    expect(readBrowserEnv("NAME")).toBeUndefined();
  });
});
