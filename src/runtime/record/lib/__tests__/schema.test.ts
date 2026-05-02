import { describe, expect, it } from "vitest";

import { EnvRecordSchema } from "../schema.js";

describe("EnvRecordSchema", () => {
  it("validates env records", () => {
    expect(EnvRecordSchema.safeParse({ NAME: "value" }).success).toBe(true);
    expect(EnvRecordSchema.safeParse(null).success).toBe(false);
  });
});
