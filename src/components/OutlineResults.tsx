"use client";

import { useEffect, useMemo } from "react";
import type { OutlineResult } from "@/lib/types";

export interface OutlineResultsProps {
  readonly result: OutlineResult;
  readonly sourceFileName: string;
}

function toDownloadUrl(content: string, format: string): string {
  const mimeType = format === "svg" ? "image/svg+xml" : "application/dxf";
  const blob = new Blob([content], { type: mimeType });
  return URL.createObjectURL(blob);
}

function baseName(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
}

/** Renders each traced output: an inline SVG preview, or a DXF text excerpt, with a download link. */
export function OutlineResults({
  result,
  sourceFileName,
}: OutlineResultsProps): React.JSX.Element {
  const outputsWithUrls = useMemo(
    () =>
      result.outputs.map((output) => ({
        ...output,
        downloadUrl: toDownloadUrl(output.content, output.format),
      })),
    [result.outputs],
  );

  useEffect(() => {
    return () => {
      for (const output of outputsWithUrls) {
        URL.revokeObjectURL(output.downloadUrl);
      }
    };
  }, [outputsWithUrls]);

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-3 gap-4 rounded-lg bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Unit</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-100">
            {result.unit}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Width</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-100">
            {result.width.toFixed(2)} {result.unit}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Height</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-100">
            {result.height.toFixed(2)} {result.unit}
          </dd>
        </div>
      </dl>

      <div className="grid gap-6 sm:grid-cols-2">
        {outputsWithUrls.map((output) => (
          <div
            key={output.format}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase text-zinc-700 dark:text-zinc-300">
                {output.format}
              </h3>
              <a
                href={output.downloadUrl}
                download={`${baseName(sourceFileName)}-outline.${output.format}`}
                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Download
              </a>
            </div>

            {output.format === "svg" ? (
              // Rendered via <img> from a blob URL, not dangerouslySetInnerHTML,
              // so any markup the traced SVG contains never executes as script.
              // eslint-disable-next-line @next/next/no-img-element -- generated blob URL, not a static asset
              <img
                src={output.downloadUrl}
                alt={`Traced ${output.format.toUpperCase()} outline`}
                className="max-h-64 self-center rounded-lg bg-white object-contain p-2 shadow-sm"
              />
            ) : (
              <pre className="max-h-64 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">
                {output.content.slice(0, 2000)}
                {output.content.length > 2000 ? "\n…" : ""}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
