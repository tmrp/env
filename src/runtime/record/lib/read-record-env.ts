import type { EnvRecord } from "../../../lib/types.js";

export const readRecordEnv = (env: string, record: EnvRecord) => {
  if (!Object.hasOwn(record, env)) {
    return undefined;
  }

  return (record as Record<string, unknown>)[env];
};
