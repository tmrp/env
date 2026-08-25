import type { EnvKeyRow, PlaygroundOptions, SchemaSpec } from "./schema-spec";

import { parseEnumValues, parseMin } from "./schema-spec";

const specToCode = (spec: SchemaSpec): string => {
  switch (spec.kind) {
    case "boolean":
      return "z.coerce.boolean()";
    case "enum": {
      const values = parseEnumValues(spec.values);
      if (values.length === 0) {
        return "z.never()";
      }
      return `z.enum([${values.map((value) => JSON.stringify(value)).join(", ")}])`;
    }
    case "number": {
      let code = "z.coerce.number()";
      if (spec.int) {
        code += ".int()";
      }
      if (spec.positive) {
        code += ".positive()";
      }
      return code;
    }
    case "string": {
      const min = parseMin(spec.min);
      return min === undefined ? "z.string()" : `z.string().min(${min})`;
    }
    case "url":
      return "z.url()";
  }
};

const optionsToCode = (options: PlaygroundOptions): string | undefined => {
  const lines: Array<string> = [];
  if (options.skipValidation) {
    lines.push("skipValidation: true");
  }
  if (options.clientPrefix.trim() !== "") {
    lines.push(`clientPrefix: ${JSON.stringify(options.clientPrefix.trim())}`);
  }
  if (options.isServer !== "auto") {
    lines.push(`isServer: ${options.isServer === "server"}`);
  }
  if (lines.length === 0) {
    return undefined;
  }
  return `{\n    ${lines.join(",\n    ")}\n  }`;
};

export type CodeTarget = {
  fnName: string;
  importPath: string;
  /** Setup code emitted before the create call, e.g. exposing a global. */
  preamble?: string;
  /** Record argument source, e.g. `runtimeEnv`. Omit for global readers. */
  recordArg?: string;
};

export const generateCode = (
  target: CodeTarget,
  rows: Array<EnvKeyRow>,
  options: PlaygroundOptions
): string => {
  const schemaLines = rows
    .filter((row) => row.key.trim() !== "")
    .map((row) => `    ${row.key.trim()}: ${specToCode(row.spec)},`)
    .join("\n");

  const args = [`{\n${schemaLines}\n  }`];
  if (target.recordArg !== undefined) {
    args.push(target.recordArg);
  }
  const optionsCode = optionsToCode(options);
  if (optionsCode !== undefined) {
    args.push(optionsCode);
  }

  const preamble =
    target.preamble === undefined ? "" : `\n${target.preamble}\n`;

  return `import { ${target.fnName} } from "${target.importPath}";
import z from "zod";
${preamble}
export const env = ${target.fnName}(
  ${args.join(",\n  ")}
);
`;
};
