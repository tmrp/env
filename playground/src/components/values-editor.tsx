import type { EnvKeyRow, SchemaSpec } from "../lib/schema-spec";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { parseEnumValues } from "../lib/schema-spec";

const placeholderFor = (spec: SchemaSpec): string => {
  switch (spec.kind) {
    case "boolean":
      return "true";
    case "enum":
      return parseEnumValues(spec.values)[0] ?? "value";
    case "number":
      return "3000";
    case "string":
      return "some-value";
    case "url":
      return "https://example.com";
  }
};

type ValuesEditorProps = {
  onValuesChange: (values: Record<string, string>) => void;
  rows: Array<EnvKeyRow>;
  values: Record<string, string>;
};

export function ValuesEditor({
  onValuesChange,
  rows,
  values,
}: ValuesEditorProps) {
  const namedRows = rows.filter((row) => row.key.trim() !== "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment values</CardTitle>
        <CardDescription>
          Raw strings; an empty input counts as missing.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {namedRows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Name a variable in the schema to give it a value.
          </p>
        ) : (
          namedRows.map((row) => (
            <div
              className="grid grid-cols-[minmax(110px,160px)_1fr] items-center gap-3 border-b py-2 first:pt-0 last:border-b-0 last:pb-0"
              key={row.id}
            >
              <div className="min-w-0">
                <div className="truncate font-mono text-xs">
                  {row.key.trim()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {row.spec.kind}
                </div>
              </div>
              <Input
                aria-label={`Value for ${row.key.trim()}`}
                className="font-mono"
                onChange={(event) =>
                  onValuesChange({ ...values, [row.id]: event.target.value })
                }
                placeholder={placeholderFor(row.spec)}
                value={values[row.id] ?? ""}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
