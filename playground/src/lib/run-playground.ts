import type { EntryPoint } from "./entry-points";
import type { EnvKeyRow, PlaygroundOptions } from "./schema-spec";

import { buildEnvKeys, buildOptions } from "./schema-spec";

export type EnvValue = boolean | number | string | undefined;

export type PlaygroundResult =
  | { message: string; status: "error" }
  | { env: Record<string, EnvValue>; status: "success" };

export const toResult = (run: () => unknown): PlaygroundResult => {
  try {
    return { env: run() as Record<string, EnvValue>, status: "success" };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : String(error),
      status: "error",
    };
  }
};

/**
 * Builds the explicit record handed to the entry point. Values stay raw
 * strings, like real environment variables; an empty input counts as missing.
 */
export const buildRecord = (
  rows: Array<EnvKeyRow>,
  values: Record<string, string>
): Record<string, unknown> => {
  const record: Record<string, unknown> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (key === "") {
      continue;
    }
    const value = values[row.id] ?? "";
    record[key] = value === "" ? undefined : value;
  }
  return record;
};

export const runClientPlayground = (
  entryPoint: EntryPoint,
  rows: Array<EnvKeyRow>,
  values: Record<string, string>,
  options: PlaygroundOptions
): PlaygroundResult =>
  toResult(() =>
    entryPoint.create(
      buildEnvKeys(rows),
      buildRecord(rows, values),
      buildOptions(options)
    )
  );
