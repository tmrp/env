import { describe, expect, it } from "vitest";

import { VercelEdgeRuntimeGlobalsSchema } from "../schema.js";

describe("VercelEdgeRuntimeGlobalsSchema", () => {
  it("validates Vercel Edge runtime globals", () => {
    expect(
      VercelEdgeRuntimeGlobalsSchema.safeParse({ EdgeRuntime: "edge" }).success
    ).toBe(true);
    expect(
      VercelEdgeRuntimeGlobalsSchema.safeParse({ EdgeRuntime: 123 }).success
    ).toBe(false);
  });
});
