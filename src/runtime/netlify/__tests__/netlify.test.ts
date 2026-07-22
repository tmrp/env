import { describe, expect, it } from "vitest";
import z from "zod";

import { createNetlifyEnv } from "../create-netlify-env.js";

describe("createNetlifyEnv", () => {
  it("delegates explicit Netlify env objects through record validation", () => {
    expect(
      createNetlifyEnv(
        { API_URL: z.string(), NETLIFY: z.string() },
        { API_URL: " https://example.com ", NETLIFY: "true" }
      )
    ).toEqual({ API_URL: " https://example.com ", NETLIFY: "true" });
  });
});
