import { useState } from "react";

import { PlayIcon } from "lucide-react";

import type { PlaygroundResult } from "../lib/run-playground";
import type { EnvKeyRow, PlaygroundOptions } from "../lib/schema-spec";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { validateNodeEnv } from "../lib/server";
import { ResultAlert } from "./result-panel";

type ServerDemoProps = {
  options: PlaygroundOptions;
  rows: Array<EnvKeyRow>;
};

export function ServerDemo({ options, rows }: ServerDemoProps) {
  const [result, setResult] = useState<PlaygroundResult | undefined>(undefined);
  const [pending, setPending] = useState(false);

  const validate = async () => {
    setPending(true);
    try {
      setResult(await validateNodeEnv({ data: { options, rows } }));
    } catch (error) {
      setResult({
        message: error instanceof Error ? error.message : String(error),
        status: "error",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server demo</CardTitle>
        <CardDescription>
          <code>createNodeEnv</code> against the dev server&apos;s real{" "}
          <code>process.env</code>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          This runs the same schema in a TanStack Start server function on your
          machine, reading the actual <code>process.env</code> of the dev
          server. Only the keys declared above are read. Restart the dev server
          with different variables (e.g.{" "}
          <code className="font-mono text-xs">PORT=8080 pnpm playground</code>)
          to see results change.
        </p>
        <Button className="self-start" disabled={pending} onClick={validate}>
          <PlayIcon />
          {pending ? "Validating…" : "Validate against process.env"}
        </Button>
        {result === undefined ? null : <ResultAlert result={result} />}
      </CardContent>
    </Card>
  );
}
