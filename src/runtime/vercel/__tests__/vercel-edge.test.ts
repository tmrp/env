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
    ).toEqual({ API_URL: "https://example.com", FEATURE_ENABLED: true });
  });
});
