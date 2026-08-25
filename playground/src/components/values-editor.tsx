import { useState } from "react";

import { FileTextIcon } from "lucide-react";

import type { EnvKeyRow, SchemaSpec } from "../lib/schema-spec";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { defaultSpecForKind, parseEnumValues } from "../lib/schema-spec";
import { loadDotEnv } from "../lib/server";

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

type LoadStatus = { message: string; status: "error" | "success" };

type ValuesEditorProps = {
  onRowsChange: (rows: Array<EnvKeyRow>) => void;
  onValuesChange: (values: Record<string, string>) => void;
  rows: Array<EnvKeyRow>;
  values: Record<string, string>;
};

export function ValuesEditor({
  onRowsChange,
  onValuesChange,
  rows,
  values,
}: ValuesEditorProps) {
  const [loading, setLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState<LoadStatus | undefined>(
    undefined
  );

  const loadFromDotEnv = async () => {
    setLoading(true);
    setLoadStatus(undefined);
    try {
      const result = await loadDotEnv();
      if (result.status === "error") {
        setLoadStatus(result);
        return;
      }

      const rowByKey = new Map(
        rows
          .filter((row) => row.key.trim() !== "")
          .map((row) => [row.key.trim(), row])
      );
      const nextRows = [...rows];
      const nextValues = { ...values };
      let matched = 0;
      let added = 0;

      for (const [key, value] of Object.entries(result.values)) {
        const existing = rowByKey.get(key);
        if (existing === undefined) {
          const id = crypto.randomUUID();
          nextRows.push({ id, key, spec: defaultSpecForKind("string") });
          nextValues[id] = value;
          added += 1;
        } else {
          nextValues[existing.id] = value;
          matched += 1;
        }
      }

      onRowsChange(nextRows);
      onValuesChange(nextValues);
      setLoadStatus({
        message: `Loaded ${Object.keys(result.values).length} variable(s) from ${result.path} — ${matched} matched the schema, ${added} added as string rows.`,
        status: "success",
      });
    } catch (error) {
      setLoadStatus({
        message: error instanceof Error ? error.message : String(error),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const namedRows = rows.filter((row) => row.key.trim() !== "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment values</CardTitle>
        <CardDescription>
          Raw strings; an empty input counts as missing.
        </CardDescription>
        <CardAction>
          <Button
            disabled={loading}
            onClick={loadFromDotEnv}
            size="sm"
            variant="outline"
          >
            <FileTextIcon />
            {loading ? "Loading…" : "Load .env"}
          </Button>
        </CardAction>
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
        {loadStatus === undefined ? null : (
          <p
            className={
              loadStatus.status === "error"
                ? "pt-3 text-xs text-destructive"
                : "pt-3 text-xs text-muted-foreground"
            }
          >
            {loadStatus.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
