"use client";

import { useCallback, useState } from "react";
import { ImageDropzone } from "@/components/ImageDropzone";
import { OutlineResults } from "@/components/OutlineResults";
import { TraceOptionsForm } from "@/components/TraceOptionsForm";
import { traceImage } from "@/lib/traceClient";
import type { OutlineResult, TraceRequestOptions } from "@/lib/types";

const DEFAULT_OPTIONS: TraceRequestOptions = {
  formats: ["svg"],
  flipY: false,
  calibrationMode: "none",
  pixelsPerUnit: null,
  scaleUnit: "mm",
  markerSize: null,
  markerUnit: "mm",
};

const USAGE_SNIPPET = `import { image2outline } from "@richardmcquiston01/makertool-image2outline";

const result = await image2outline("photo.png", {
  formats: ["svg", "dxf"],
  scale: { pixelsPerUnit: 10, unit: "mm" },
  flipY: true,
});`;

function validateOptions(options: TraceRequestOptions): string | null {
  if (options.formats.length === 0) {
    return "Select at least one output format (SVG and/or DXF).";
  }
  if (options.calibrationMode === "scale" && !options.pixelsPerUnit) {
    return "Enter a pixels-per-unit value, or switch to pixel coordinates.";
  }
  if (options.calibrationMode === "marker" && !options.markerSize) {
    return "Enter the reference marker's real-world size, or switch to pixel coordinates.";
  }
  return null;
}

export default function Home(): React.JSX.Element {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<TraceRequestOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<OutlineResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTracing, setIsTracing] = useState<boolean>(false);

  const handleFileSelected = useCallback((file: File): void => {
    setSelectedFile(file);
    setResult(null);
    setErrorMessage(null);
    setPreviewUrl((existingUrl) => {
      if (existingUrl) {
        URL.revokeObjectURL(existingUrl);
      }
      return URL.createObjectURL(file);
    });
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!selectedFile) {
      setErrorMessage("Choose an image to trace first.");
      return;
    }

    const validationError = validateOptions(options);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsTracing(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const traced = await traceImage(selectedFile, options);
      setResult(traced);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Tracing the image failed.",
      );
    } finally {
      setIsTracing(false);
    }
  }, [selectedFile, options]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          @richardmcquiston01/makertool-image2outline
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Image → vector outline
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Upload a photo or scan of an object and trace it into an SVG and/or
          DXF outline &mdash; ready for laser cutting, CNC, or CAD. This page
          runs the package server-side (it depends on{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
            sharp
          </code>{" "}
          for image decoding) and streams the result back to your browser.
        </p>
      </header>

      <section className="flex flex-col gap-6 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <ImageDropzone
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          onFileSelected={handleFileSelected}
        />

        <TraceOptionsForm options={options} onChange={setOptions} />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isTracing || !selectedFile}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
          >
            {isTracing ? "Tracing…" : "Trace outline"}
          </button>
          {errorMessage ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </section>

      {result ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Result
          </h2>
          <OutlineResults
            result={result}
            sourceFileName={selectedFile?.name ?? "outline"}
          />
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Using it in your own project
        </h2>
        <pre className="overflow-auto rounded-xl bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-200">
          <code>{USAGE_SNIPPET}</code>
        </pre>
      </section>
    </div>
  );
}
