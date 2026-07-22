import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../../../__tests__/runtime-globals.js";
import { readImportMetaEnv } from "../read-import-meta-env.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("readImportMetaEnv", () => {
  it("reads the import.meta global shim", () => {
    useRuntimeGlobals({ __IMPORT_META_ENV__: { NAME: " import-meta " } });

    expect(readImportMetaEnv("NAME")).toBe(" import-meta ");
  });

  it("returns undefined for absent or invalid import-meta globals", () => {
    clearRuntimeGlobals();
    expect(readImportMetaEnv("NAME")).toBeUndefined();

    useRuntimeGlobals({ __IMPORT_META_ENV__: null });
    expect(readImportMetaEnv("NAME")).toBeUndefined();
  });
});
