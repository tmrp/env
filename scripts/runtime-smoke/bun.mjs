/* global Bun */

import { EnvValidationError } from "@tmrp/env";
import { createBunEnv } from "@tmrp/env/bun";
import { strict as assert } from "node:assert";
import z from "zod";

Bun.env.RUNTIME_SMOKE_BUN = " bun ";

assert.deepEqual(createBunEnv({ RUNTIME_SMOKE_BUN: z.string().min(1) }), {
  RUNTIME_SMOKE_BUN: " bun ",
});

Bun.env.RUNTIME_SMOKE_PORT = "-1";

assert.throws(
  () =>
    createBunEnv(
      {
        RUNTIME_SMOKE_BUN: z.number(),
        RUNTIME_SMOKE_PORT: z.coerce.number().positive(),
      },
      { errorMode: "all" }
    ),
  (error) => {
    assert.ok(error instanceof EnvValidationError);
    assert.deepEqual(
      error.issues.map((issue) => issue.key),
      ["RUNTIME_SMOKE_BUN", "RUNTIME_SMOKE_PORT"]
    );
    return true;
  }
);
