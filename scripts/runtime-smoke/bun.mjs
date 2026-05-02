/* global Bun */

import { createBunEnv } from "@tmrp/env/bun";
import { strict as assert } from "node:assert";
import z from "zod";

Bun.env.RUNTIME_SMOKE_BUN = " bun ";

assert.deepEqual(createBunEnv({ RUNTIME_SMOKE_BUN: z.string().min(1) }), {
  RUNTIME_SMOKE_BUN: "bun",
});
