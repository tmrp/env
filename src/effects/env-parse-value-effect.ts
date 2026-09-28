import type { ZodType } from "zod";

import { Effect } from "effect";

import type { Options } from "../lib/types.js";

import { EnvValidationError } from "../lib/env-validation-error.js";

export const envParseValueEffect = (
  key: string,
  schema: ZodType,
  value: unknown,
  options?: Options
) =>
  Effect.try({
    try: () => {
      if (options?.skipValidation) {
        return { success: true, data: value } as const;
      }

      if (options?.errorMode === "all") {
        return schema.safeParse(value);
      }

      return { success: true, data: schema.parse(value) } as const;
    },
    catch: (error) => {
      const message =
        value === undefined
          ? `Environment variable "${key}" is not defined`
          : `Environment variable "${key}" failed validation: ${error}`;

      return new Error(message, { cause: error });
    },
  }).pipe(
    Effect.flatMap((result) =>
      result.success
        ? Effect.succeed(result.data)
        : Effect.fail(
            new EnvValidationError(
              result.error.issues.map(({ code, message, path }) => ({
                key,
                code,
                path,
                message,
              }))
            )
          )
    )
  );
