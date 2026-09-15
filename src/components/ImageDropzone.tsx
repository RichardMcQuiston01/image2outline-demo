"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";

export interface ImageDropzoneProps {
  readonly selectedFile: File | null;
  readonly previewUrl: string | null;
  readonly onFileSelected: (file: File) => void;
}

/** Drag-and-drop / click-to-browse picker for the source image. */
export function ImageDropzone({
  selectedFile,
  previewUrl,
  onFileSelected,
}: ImageDropzoneProps): React.JSX.Element {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const handleFiles = useCallback(
    (files: FileList | null): void => {
      const file = files?.[0];
      if (file) {
        onFileSelected(file);
      }
    },
    [onFileSelected],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      handleFiles(event.target.files);
    },
    [handleFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      setIsDraggingOver(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        Upload an image to trace
      </label>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          isDraggingOver
            ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
        }`}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user upload, not an optimizable static asset
          <img
            src={previewUrl}
            alt="Selected source"
            className="max-h-48 rounded-lg object-contain shadow-sm"
          />
        ) : (
          <>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Drop an image here, or click to browse
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              PNG or JPEG, up to 8 MB
            </p>
          </>
        )}
        {selectedFile ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {selectedFile.name} &middot;{" "}
            {(selectedFile.size / 1024).toFixed(0)} KB
          </p>
        ) : null}
      </div>
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
