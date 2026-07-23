import type { EntryPoint } from "../lib/entry-points";
import type { IsServerMode, PlaygroundOptions } from "../lib/schema-spec";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { entryPoints } from "../lib/entry-points";

type OptionsPanelProps = {
  entryPoint: EntryPoint;
  onEntryPointChange: (id: string) => void;
  onOptionsChange: (options: PlaygroundOptions) => void;
  options: PlaygroundOptions;
};

export function OptionsPanel({
  entryPoint,
  onEntryPointChange,
  onOptionsChange,
  options,
}: OptionsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Options</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Entry point</Label>
            <Select
              onValueChange={(value) => onEntryPointChange(value as string)}
              value={entryPoint.id}
            >
              <SelectTrigger className="w-full font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entryPoints.map((option) => (
                  <SelectItem
                    className="font-mono text-xs"
                    key={option.id}
                    value={option.id}
                  >
                    {option.importPath}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>clientPrefix</Label>
            <Input
              className="font-mono"
              onChange={(event) =>
                onOptionsChange({
                  ...options,
                  clientPrefix: event.target.value,
                })
              }
              placeholder="PUBLIC_"
              value={options.clientPrefix}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>isServer</Label>
            <Select
              onValueChange={(value) =>
                onOptionsChange({
                  ...options,
                  isServer: value as IsServerMode,
                })
              }
              value={options.isServer}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">auto (detect)</SelectItem>
                <SelectItem value="server">server</SelectItem>
                <SelectItem value="client">client</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>skipValidation</Label>
            <Label className="h-8 text-muted-foreground">
              <Checkbox
                checked={options.skipValidation}
                onCheckedChange={(checked) =>
                  onOptionsChange({
                    ...options,
                    skipValidation: checked === true,
                  })
                }
              />
              Return raw values instead of throwing
            </Label>
          </div>
        </div>
        {entryPoint.note === undefined ? null : (
          <p className="text-xs text-muted-foreground">{entryPoint.note}</p>
        )}
      </CardContent>
    </Card>
  );
}
