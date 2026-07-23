import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { createServerFn } from "@tanstack/react-start";
import { createNodeEnv } from "@tmrp/env/node";
import { parse } from "dotenv";

import type { EnvKeyRow, PlaygroundOptions } from "./schema-spec";

import { toResult } from "./run-playground";
import { buildEnvKeys, buildOptions } from "./schema-spec";

export type ServerDemoPayload = {
  options: PlaygroundOptions;
  rows: Array<EnvKeyRow>;
};

/**
 * Playground demo: validates the declared keys against the dev server's real
 * `process.env`. Only keys declared in the schema are read and returned.
 */
export const validateNodeEnv = createServerFn({ method: "POST" })
  .validator((data: ServerDemoPayload) => data)
  .handler(({ data }) =>
    toResult(() =>
      createNodeEnv(buildEnvKeys(data.rows), buildOptions(data.options))
    )
  );

export type LoadDotEnvResult =
  | { message: string; status: "error" }
  | { path: string; status: "success"; values: Record<string, string> };

/** Candidate .env locations, relative to the dev server's working directory. */
const dotEnvCandidates = [".env", "../.env"];

/**
 * Playground helper: reads and parses a local `.env` file (the playground
 * directory first, then the repository root) so its values can be loaded into
 * the editor.
 */
export const loadDotEnv = createServerFn({ method: "GET" }).handler(
  async (): Promise<LoadDotEnvResult> => {
    const candidates = dotEnvCandidates.map((candidate) =>
      path.resolve(process.cwd(), candidate)
    );
    const found = candidates.find((candidate) => existsSync(candidate));

    if (found === undefined) {
      return {
        message: `No .env file found (looked in ${candidates.join(" and ")}).`,
        status: "error",
      };
    }

    const values = parse(await readFile(found, "utf8"));
    return { path: found, status: "success", values };
  }
);
