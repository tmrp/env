import type { EnvRecord } from "../../../lib/types.js";

export const readRecordEnv = (env: string, record: EnvRecord) => {
  if (!Object.hasOwn(record, env)) {
    return undefined;
  }

  const value = (record as Record<string, unknown>)[env];

  if (typeof value === "string") {
    return value.trim();
  }

  return value ?? undefined;
};
