import type { ZodType } from "zod";

import { Effect } from "effect";

export const envParseValueEffect = (
  key: string,
  schema: ZodType,
  value: unknown
) =>
  Effect.try({
    try: () => schema.parse(value),
    catch: (error) =>
      new Error(`Environment variable "${key}" failed validation: ${error}`, {
        cause: error,
      }),
  });
