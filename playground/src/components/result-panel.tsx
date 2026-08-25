import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import type { PlaygroundResult } from "../lib/run-playground";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatEnv = (env: unknown): string => {
  if (typeof env !== "object" || env === null || Array.isArray(env)) {
    return String(env);
  }
  const entries = Object.entries(env as Record<string, unknown>);
  if (entries.length === 0) {
    return "(schema has no named keys)";
  }
  return entries
    .map(([key, value]) => {
      if (value === undefined) {
        return `${key}: undefined`;
      }
      return `${key}: ${JSON.stringify(value)} (${typeof value})`;
    })
    .join("\n");
};

export function ResultAlert({ result }: { result: PlaygroundResult }) {
  if (result.status === "success") {
    return (
      <Alert className="border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400">
        <CheckCircle2Icon />
        <AlertTitle>Parsed successfully</AlertTitle>
        <AlertDescription className="text-green-600/90 dark:text-green-400/90">
          <pre className="overflow-x-auto font-mono text-xs whitespace-pre">
            {formatEnv(result.env)}
          </pre>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <XCircleIcon />
      <AlertTitle>Threw during creation</AlertTitle>
      <AlertDescription>
        <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap">
          {result.message}
        </pre>
      </AlertDescription>
    </Alert>
  );
}

type ResultPanelProps = {
  result: PlaygroundResult;
  title: string;
};

export function ResultPanel({ result, title }: ResultPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResultAlert result={result} />
      </CardContent>
    </Card>
  );
}
