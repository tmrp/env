import { Effect } from "effect";
import { afterEach, beforeAll, describe, expect, it } from "vitest";

import {
  clearRuntimeGlobals,
  restoreRuntimeGlobals,
  saveRuntimeGlobals,
  useRuntimeGlobals,
} from "../../__tests__/runtime-globals.js";
import { RuntimeGlobalsSchema } from "../../lib/schema.js";
import { getRuntimeGlobalScopeEffect } from "../get-runtime-global-scope-effect.js";

beforeAll(() => {
  saveRuntimeGlobals();
});

afterEach(() => {
  restoreRuntimeGlobals();
});

describe("getRuntimeGlobalScopeEffect", () => {
  it("returns parsed runtime scope, undefined for invalid scope, and fails if parsing throws", () => {
    clearRuntimeGlobals();
    expect(
      Effect.runSync(getRuntimeGlobalScopeEffect(RuntimeGlobalsSchema))
    ).toEqual({});

    useRuntimeGlobals({ process: null });
    expect(
      Effect.runSync(getRuntimeGlobalScopeEffect(RuntimeGlobalsSchema))
    ).toBeUndefined();

    expect(() =>
      Effect.runSync(
        getRuntimeGlobalScopeEffect({
          safeParse: () => {
            throw new Error("boom");
          },
        } as unknown as typeof RuntimeGlobalsSchema)
      )
    ).toThrow();
  });
});
