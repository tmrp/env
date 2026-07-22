import { describe, expect, it } from "vitest";
import z from "zod";

import { createVercelEdgeEnv } from "../create-vercel-edge-env.js";

describe("createVercelEdgeEnv", () => {
  it("delegates explicit Vercel Edge env objects through record validation", () => {
    expect(
      createVercelEdgeEnv(
        { API_URL: z.string(), FEATURE_ENABLED: z.boolean() },
        { API_URL: " https://example.com ", FEATURE_ENABLED: true }
      )
    ).toEqual({ API_URL: " https://example.com ", FEATURE_ENABLED: true });
  });

  it("passes options through to record validation", () => {
    expect(
      createVercelEdgeEnv(
        { API_URL: z.url(), MISSING: z.string() },
        { API_URL: "not-a-url" },
        { skipValidation: true }
      )
    ).toEqual({ API_URL: "not-a-url", MISSING: undefined });
  });
});
