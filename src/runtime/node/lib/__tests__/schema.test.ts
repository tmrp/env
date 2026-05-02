import { describe, expect, it } from "vitest";

import { NodeRuntimeGlobalsSchema } from "../schema.js";

describe("NodeRuntimeGlobalsSchema", () => {
  it("validates Node runtime globals", () => {
    expect(
      NodeRuntimeGlobalsSchema.safeParse({ process: { env: {} } }).success
    ).toBe(true);
    expect(NodeRuntimeGlobalsSchema.safeParse({ process: null }).success).toBe(
      false
    );
  });
});
