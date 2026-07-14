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

  it("validates browser globals independently", () => {
    useRuntimeGlobals({
      __APP_CONFIG__: { NAME: " app " },
      __ENV__: "owned by another library",
    });
    expect(readBrowserEnv("NAME")).toBe("app");

    useRuntimeGlobals({
      __APP_CONFIG__: "owned by another library",
      __ENV__: { NAME: " env " },
    });
    expect(readBrowserEnv("NAME")).toBe("env");
  });

  it("continues to __ENV__ when reading __APP_CONFIG__ throws", () => {
    useRuntimeGlobals({ __ENV__: { NAME: " env " } });
    Object.defineProperty(globalThis, "__APP_CONFIG__", {
      configurable: true,
      get: () => {
        throw new Error("boom");
      },
    });

    expect(readBrowserEnv("NAME")).toBe("env");
  });

  it("returns undefined for absent or invalid browser globals", () => {
    clearRuntimeGlobals();
    expect(readBrowserEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ __APP_CONFIG__: null });
    expect(readBrowserEnv("NAME")).toBeUndefined();
  });
});
