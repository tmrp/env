import { PlusIcon, XIcon } from "lucide-react";

import type { EnvKeyRow, SchemaSpec } from "../lib/schema-spec";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { defaultSpecForKind } from "../lib/schema-spec";

const kindOptions: Array<{ kind: SchemaSpec["kind"]; label: string }> = [
  { kind: "string", label: "string" },
  { kind: "url", label: "url" },
  { kind: "enum", label: "enum" },
  { kind: "number", label: "coerce number" },
  { kind: "boolean", label: "coerce boolean" },
];

type SchemaBuilderProps = {
  onRowsChange: (rows: Array<EnvKeyRow>) => void;
  rows: Array<EnvKeyRow>;
};

export function SchemaBuilder({ onRowsChange, rows }: SchemaBuilderProps) {
  const patchRow = (id: string, patch: Partial<EnvKeyRow>) => {
    onRowsChange(
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const patchSpec = (id: string, spec: SchemaSpec) => {
    onRowsChange(rows.map((row) => (row.id === id ? { ...row, spec } : row)));
  };

  const changeKind = (id: string, kind: SchemaSpec["kind"]) => {
    patchSpec(id, defaultSpecForKind(kind));
  };

  const removeRow = (id: string) => {
    onRowsChange(rows.filter((row) => row.id !== id));
  };

  const addRow = () => {
    onRowsChange([
      ...rows,
      { id: crypto.randomUUID(), key: "", spec: defaultSpecForKind("string") },
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schema</CardTitle>
        <CardDescription>One Zod schema per variable.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            className="flex flex-col gap-2 border-b pb-3 last:border-b-0 last:pb-0"
            key={row.id}
          >
            <div className="flex items-center gap-2">
              <Input
                aria-label="Variable name"
                className="font-mono"
                onChange={(event) =>
                  patchRow(row.id, { key: event.target.value })
                }
                placeholder="VARIABLE_NAME"
                value={row.key}
              />
              <Select
                onValueChange={(value) =>
                  changeKind(row.id, value as SchemaSpec["kind"])
                }
                value={row.spec.kind}
              >
                <SelectTrigger aria-label="Schema type" className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {kindOptions.map((option) => (
                    <SelectItem key={option.kind} value={option.kind}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                aria-label={`Remove ${row.key || "row"}`}
                onClick={() => removeRow(row.id)}
                size="icon-sm"
                variant="ghost"
              >
                <XIcon />
              </Button>
            </div>
            <SpecOptions onSpecChange={patchSpec} row={row} />
          </div>
        ))}
        <Button className="self-start" onClick={addRow} variant="outline">
          <PlusIcon />
          Add variable
        </Button>
      </CardContent>
    </Card>
  );
}

function SpecOptions({
  onSpecChange,
  row,
}: {
  onSpecChange: (id: string, spec: SchemaSpec) => void;
  row: EnvKeyRow;
}) {
  const spec = row.spec;

  switch (spec.kind) {
    case "enum":
      return (
        <Input
          aria-label="Enum values, comma separated"
          className="font-mono"
          onChange={(event) =>
            onSpecChange(row.id, { ...spec, values: event.target.value })
          }
          placeholder="development, test, production"
          value={spec.values}
        />
      );
    case "number":
      return (
        <div className="flex items-center gap-4">
          <Label className="font-mono text-xs text-muted-foreground">
            <Checkbox
              checked={spec.int}
              onCheckedChange={(checked) =>
                onSpecChange(row.id, { ...spec, int: checked === true })
              }
            />
            .int()
          </Label>
          <Label className="font-mono text-xs text-muted-foreground">
            <Checkbox
              checked={spec.positive}
              onCheckedChange={(checked) =>
                onSpecChange(row.id, { ...spec, positive: checked === true })
              }
            />
            .positive()
          </Label>
        </div>
      );
    case "string":
      return (
        <Input
          aria-label="Minimum length"
          className="w-28 font-mono"
          onChange={(event) =>
            onSpecChange(row.id, { ...spec, min: event.target.value })
          }
          placeholder="min length"
          value={spec.min}
        />
      );
    case "boolean":
    case "url":
      return null;
  }
}
