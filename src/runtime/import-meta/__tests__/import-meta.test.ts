import { describe, expect, it } from "vitest";
import z from "zod";

import { createImportMetaEnv } from "../create-import-meta-env.js";

describe("createImportMetaEnv", () => {
  it("delegates import.meta.env objects through record validation", () => {
    expect(
      createImportMetaEnv(
        { DEV: z.boolean(), VITE_API_URL: z.string() },
        { DEV: true, VITE_API_URL: " https://example.com " }
      )
    ).toEqual({ DEV: true, VITE_API_URL: "https://example.com" });
  });
});
