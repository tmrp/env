import { describe, expect, it } from "vitest";

import { readRecordEnv } from "../read-record-env.js";

describe("readRecordEnv", () => {
  it("reads records with trimming, passthrough values, and nullish misses", () => {
    expect(readRecordEnv("NAME", { NAME: " value " })).toBe("value");
    expect(readRecordEnv("ENABLED", { ENABLED: false })).toBe(false);
    expect(readRecordEnv("COUNT", { COUNT: 0 })).toBe(0);
    expect(readRecordEnv("MISSING", {})).toBeUndefined();
    expect(readRecordEnv("NULL", { NULL: null })).toBeUndefined();
  });
});
