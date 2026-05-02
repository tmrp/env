/* global Deno */

import { assertEquals } from "jsr:@std/assert@^1.0.0";
import z from "npm:zod@^4.0.0";

import { createDenoEnv } from "../../dist/runtime/deno/create-deno-env.js";

Deno.env.set("RUNTIME_SMOKE_DENO", " deno ");

assertEquals(createDenoEnv({ RUNTIME_SMOKE_DENO: z.string().min(1) }), {
  RUNTIME_SMOKE_DENO: "deno",
});
