import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readDenoEnv } from "../read-deno-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readDenoEnv", () => {
  it("reads Deno.env.get", () => {
    useRuntimeGlobals({
      Deno: {
        env: { get: (key: string) => (key === "NAME" ? " deno " : undefined) },
      },
    });

    expect(readDenoEnv("NAME")).toBe(" deno ");
  });

  it("returns undefined for absent, invalid, or missing Deno values", () => {
    clearRuntimeGlobals();
    expect(readDenoEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ Deno: { env: { get: "not-a-function" } } });
    expect(readDenoEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ Deno: { env: { get: () => undefined } } });
    expect(readDenoEnv("NAME")).toBeUndefined();
  });
});
