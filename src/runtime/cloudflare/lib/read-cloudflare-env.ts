import { readRecordEnv } from "../../record/lib/read-record-env.js";
import { CloudflareRuntimeGlobalsSchema } from "./schema.js";

export const readCloudflareEnv = (env: string) => {
  const cloudflareGlobalScope =
    CloudflareRuntimeGlobalsSchema.safeParse(globalThis);

  if (!cloudflareGlobalScope.success) {
    return undefined;
  }

  const cloudflareRuntimeGlobals = cloudflareGlobalScope.data;

  if (!cloudflareRuntimeGlobals.__CLOUDFLARE_ENV__) {
    return undefined;
  }

  return readRecordEnv(env, cloudflareRuntimeGlobals.__CLOUDFLARE_ENV__);
};
