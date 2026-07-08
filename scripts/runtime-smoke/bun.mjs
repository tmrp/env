/* global Bun */

import { createBunEnv } from "@tmrp/env/bun";
import z from "zod";

import { strict as assert } from "node:assert";

Bun.env.RUNTIME_SMOKE_BUN = " bun ";

assert.deepEqual(createBunEnv({ RUNTIME_SMOKE_BUN: z.string().min(1) }), {
  RUNTIME_SMOKE_BUN: "bun",
});
