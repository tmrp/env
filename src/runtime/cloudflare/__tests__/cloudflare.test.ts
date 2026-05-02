import { describe, expect, it } from "vitest";
import z from "zod";

import { createCloudflareEnv } from "../create-cloudflare-env.js";

describe("createCloudflareEnv", () => {
  it("delegates Cloudflare bindings through record validation", () => {
    expect(
      createCloudflareEnv(
        { API_TOKEN: z.string(), FEATURE_ENABLED: z.boolean() },
        { API_TOKEN: " token ", FEATURE_ENABLED: false }
      )
    ).toEqual({ API_TOKEN: "token", FEATURE_ENABLED: false });
  });
});
