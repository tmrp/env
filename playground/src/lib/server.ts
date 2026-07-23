import { createServerFn } from "@tanstack/react-start";
import { createNodeEnv } from "@tmrp/env/node";

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
