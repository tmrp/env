import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readCloudflareEnv } from "../read-cloudflare-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readCloudflareEnv", () => {
  it("reads the Cloudflare global shim", () => {
    useRuntimeGlobals({ __CLOUDFLARE_ENV__: { NAME: " cloudflare " } });

    expect(readCloudflareEnv("NAME")).toBe("cloudflare");
  });

  it("returns undefined for absent or invalid Cloudflare globals", () => {
    clearRuntimeGlobals();
    expect(readCloudflareEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ __CLOUDFLARE_ENV__: null });
    expect(readCloudflareEnv("NAME")).toBeUndefined();
  });
});
