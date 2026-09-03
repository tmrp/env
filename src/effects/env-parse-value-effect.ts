import type { ZodType } from "zod";

import { Effect } from "effect";

import type { Options } from "../lib/types.js";

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
    catch: (error) => {
      const message =
        value === undefined
          ? `Environment variable "${key}" is not defined`
          : `Environment variable "${key}" failed validation: ${error}`;

      return new Error(message, { cause: error });
    },
  });
