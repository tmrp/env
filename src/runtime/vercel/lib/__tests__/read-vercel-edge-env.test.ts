import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readVercelEdgeEnv } from "../read-vercel-edge-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readVercelEdgeEnv", () => {
  it("reads process.env when EdgeRuntime is present", () => {
    useRuntimeGlobals({
      EdgeRuntime: "edge",
      process: { env: { NAME: " vercel-edge " } },
    });

    expect(readVercelEdgeEnv("NAME")).toBe("vercel-edge");
  });

  it("returns undefined for absent, invalid, or missing Vercel Edge values", () => {
    clearRuntimeGlobals();
    expect(readVercelEdgeEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ EdgeRuntime: 123 });
    expect(readVercelEdgeEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ EdgeRuntime: "edge" });
    expect(readVercelEdgeEnv("NAME")).toBeUndefined();
  });
});
