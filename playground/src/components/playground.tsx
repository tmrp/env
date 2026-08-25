import { useMemo, useState } from "react";

import type { EnvKeyRow, PlaygroundOptions } from "../lib/schema-spec";

import { getEntryPoint } from "../lib/entry-points";
import { generateCode } from "../lib/generate-code";
import { runClientPlayground } from "../lib/run-playground";
import { CodePreview } from "./code-preview";
import { OptionsPanel } from "./options-panel";
import { ResultPanel } from "./result-panel";
import { SchemaBuilder } from "./schema-builder";
import { ServerDemo } from "./server-demo";
import { ValuesEditor } from "./values-editor";

const defaultRows: Array<EnvKeyRow> = [
  { id: "api-url", key: "API_URL", spec: { kind: "url" } },
  {
    id: "port",
    key: "PORT",
    spec: { int: true, kind: "number", positive: true },
  },
  {
    id: "node-env",
    key: "NODE_ENV",
    spec: { kind: "enum", values: "development, test, production" },
  },
  { id: "feature", key: "FEATURE_ENABLED", spec: { kind: "boolean" } },
  { id: "secret", key: "SECRET_KEY", spec: { kind: "string", min: "32" } },
];

const defaultValues: Record<string, string> = {
  "api-url": "https://api.example.com",
  feature: "true",
  "node-env": "development",
  port: "3000",
  secret: "s3cr3t-that-is-long-enough-to-pass-32-chars",
};

export function Playground() {
  const [rows, setRows] = useState<Array<EnvKeyRow>>(defaultRows);
  const [values, setValues] = useState<Record<string, string>>(defaultValues);
  const [options, setOptions] = useState<PlaygroundOptions>({
    clientPrefix: "",
    isServer: "auto",
    skipValidation: false,
  });
  const [entryPointId, setEntryPointId] = useState("record");

  const entryPoint = getEntryPoint(entryPointId);

  const result = useMemo(
    () => runClientPlayground(entryPoint, rows, values, options),
    [entryPoint, rows, values, options]
  );

  const code = useMemo(
    () =>
      generateCode(
        {
          fnName: entryPoint.fnName,
          importPath: entryPoint.importPath,
          preamble: entryPoint.preamble,
          recordArg: entryPoint.recordArg,
        },
        rows,
        options
      ),
    [entryPoint, rows, options]
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-6 pb-16">
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          <code className="font-mono">@tmrp/env</code> playground
        </h1>
        <p className="text-sm text-muted-foreground">
          Type-safe environment variable parsing, live.
        </p>
        <a
          className="ml-auto font-mono text-sm text-muted-foreground hover:text-foreground"
          href="https://github.com/tmrp/env"
        >
          github.com/tmrp/env
        </a>
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SchemaBuilder onRowsChange={setRows} rows={rows} />
          <ResultPanel
            result={result}
            title={`Result · ${entryPoint.fnName}`}
          />
        </div>
        <div className="flex flex-col gap-4">
          <ValuesEditor
            onValuesChange={setValues}
            rows={rows}
            values={values}
          />
          <OptionsPanel
            entryPoint={entryPoint}
            onEntryPointChange={setEntryPointId}
            onOptionsChange={setOptions}
            options={options}
          />
          <CodePreview code={code} />
        </div>
      </div>
      <ServerDemo options={options} rows={rows} />
    </div>
  );
}
