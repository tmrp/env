/* global Deno */

import { assertEquals, assertThrows } from "jsr:@std/assert@^1.0.0";
import z from "npm:zod@^4.0.0";

import { EnvValidationError } from "../../dist/index.js";
import { createDenoEnv } from "../../dist/runtime/deno/create-deno-env.js";

Deno.env.set("RUNTIME_SMOKE_DENO", " deno ");

assertEquals(createDenoEnv({ RUNTIME_SMOKE_DENO: z.string().min(1) }), {
  RUNTIME_SMOKE_DENO: " deno ",
});

Deno.env.set("RUNTIME_SMOKE_PORT", "-1");

const error = assertThrows(
  () =>
    createDenoEnv(
      {
        RUNTIME_SMOKE_DENO: z.number(),
        RUNTIME_SMOKE_PORT: z.coerce.number().positive(),
      },
      { errorMode: "all" }
    ),
  EnvValidationError
);

assertEquals(
  error.issues.map((issue) => issue.key),
  ["RUNTIME_SMOKE_DENO", "RUNTIME_SMOKE_PORT"]
);
