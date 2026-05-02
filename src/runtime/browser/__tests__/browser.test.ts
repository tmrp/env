import { describe, expect, it } from "vitest";
import z from "zod";

import { createBrowserEnv } from "../create-browser-env.js";

describe("createBrowserEnv", () => {
  it("delegates explicit browser config objects through record validation", () => {
    expect(
      createBrowserEnv(
        { PUBLIC_API_URL: z.string(), PUBLIC_FLAG: z.boolean() },
        { PUBLIC_API_URL: " https://example.com ", PUBLIC_FLAG: true }
      )
    ).toEqual({ PUBLIC_API_URL: "https://example.com", PUBLIC_FLAG: true });
  });
});
