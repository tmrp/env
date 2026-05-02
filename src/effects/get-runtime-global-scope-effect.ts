import { Effect } from "effect";

import { type RuntimeGlobalsSchemaType } from "../lib/schema.js";

export const getRuntimeGlobalScopeEffect = (
  runtimeSchema: RuntimeGlobalsSchemaType
) =>
  Effect.try({
    try: () => {
      const runtime = runtimeSchema.safeParse(globalThis);

      if (!runtime.success) {
        return undefined;
      }

      return runtime.data;
    },
    catch: () => undefined,
  });
