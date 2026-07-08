import { Effect } from "effect";

import type { Options } from "../lib/types.js";
import type { ZodType } from "zod";

export const envParseValueEffect = (
  key: string,
  schema: ZodType,
  value: unknown,
  options?: Options
) =>
  Effect.try({
    try: () => {
      if (options?.skipValidation) {
        return value;
      }

      return schema.parse(value);
    },
    catch: (error) =>
      new Error(`Environment variable "${key}" failed validation: ${error}`, {
        cause: error,
      }),
  });
