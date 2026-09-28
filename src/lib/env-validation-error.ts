import type { ZodIssue } from "zod";

/** A validation issue for one environment variable, without its input value. */
export type EnvValidationIssue = {
  code: ZodIssue["code"];
  key: string;
  message: string;
  /** The path within the variable's value; the variable name is in `key`. */
  path: readonly PropertyKey[];
};

/** All schema validation issues collected with `errorMode: "all"`. */
export class EnvValidationError extends Error {
  readonly issues: readonly EnvValidationIssue[];

  constructor(issues: readonly EnvValidationIssue[]) {
    super(
      [
        "Invalid environment configuration:",
        ...issues.map((issue) => {
          const location = [issue.key, ...issue.path].map(String).join(".");

          return `  ${location} — ${issue.message}`;
        }),
      ].join("\n")
    );
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}
