import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readBunEnv } from "../read-bun-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readBunEnv", () => {
  it("reads Bun.env", () => {
    useRuntimeGlobals({ Bun: { env: { NAME: " bun " } } });

    expect(readBunEnv("NAME")).toBe(" bun ");
  });

  it("returns undefined for absent or invalid Bun globals", () => {
    clearRuntimeGlobals();
    expect(readBunEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ Bun: { env: 123 } });
    expect(readBunEnv("NAME")).toBeUndefined();
  });
});
