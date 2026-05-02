import { describe, expect, it } from "vitest";

import { ImportMetaRuntimeGlobalsSchema } from "../schema.js";

describe("ImportMetaRuntimeGlobalsSchema", () => {
  it("validates import-meta runtime globals", () => {
    expect(
      ImportMetaRuntimeGlobalsSchema.safeParse({
        __IMPORT_META_ENV__: { NAME: "value" },
      }).success
    ).toBe(true);
    expect(
      ImportMetaRuntimeGlobalsSchema.safeParse({ __IMPORT_META_ENV__: null })
        .success
    ).toBe(false);
  });
});
