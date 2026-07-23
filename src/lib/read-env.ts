import { readRuntimeEnv } from "./read-runtime-env.js";

/**
 * Reads an environment variable from the current runtime.
 *
 * The function checks known runtime globals and explicit global env records.
 * Values are returned as-is; surrounding whitespace is not trimmed.
 *
 * @example
 * 	const apiBaseUrl = readEnv("API_BASE_URL");
 *
 * 	fetch(`${apiBaseUrl}/health`);
 *
 * @param env The name of the environment variable to read.
 * @returns The environment variable value, or `undefined` when the variable is
 *   not defined in the current runtime.
 */

export const readEnv = (env: string) => {
  return readRuntimeEnv(env);
};
