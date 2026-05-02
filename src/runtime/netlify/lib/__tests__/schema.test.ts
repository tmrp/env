import { describe, expect, it } from "vitest";

import { NetlifyRuntimeGlobalsSchema } from "../schema.js";

describe("NetlifyRuntimeGlobalsSchema", () => {
  it("validates Netlify runtime globals", () => {
    expect(
      NetlifyRuntimeGlobalsSchema.safeParse({
        process: { env: { NETLIFY: "true" } },
      }).success
    ).toBe(true);
    expect(
      NetlifyRuntimeGlobalsSchema.safeParse({
        process: { env: { NETLIFY: 123 } },
      }).success
    ).toBe(false);
  });
});
