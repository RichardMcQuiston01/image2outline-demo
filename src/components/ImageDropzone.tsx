"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, MouseEvent } from "react";

export interface ImageDropzoneProps {
  readonly selectedFile: File | null;
  readonly previewUrl: string | null;
  readonly onFileSelected: (file: File) => void;
  readonly onCleared: () => void;
  readonly disabled?: boolean;
}

/** Drag-and-drop / click-to-browse picker for the source image. */
export function ImageDropzone({
  selectedFile,
  previewUrl,
  onFileSelected,
  onCleared,
  disabled = false,
}: ImageDropzoneProps): React.JSX.Element {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const openFileBrowser = useCallback((): void => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

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
      // Reset so re-selecting the same file (after Remove) still fires onChange.
      event.target.value = "";
    },
    [handleFiles],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>): void => {
      event.preventDefault();
      setIsDraggingOver(false);
      if (!disabled) {
        handleFiles(event.dataTransfer.files);
      }
    },
    [disabled, handleFiles],
  );

  const handleRemove = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      onCleared();
    },
    [onCleared],
  );

  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        Upload an image to trace
      </label>
      <div
        role="button"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={openFileBrowser}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            openFileBrowser();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDraggingOver(true);
          }
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          disabled
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        } ${
          isDraggingOver
            ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
        }`}
      >
        {previewUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user upload, not an optimizable static asset */}
            <img
              src={previewUrl}
              alt="Selected source"
              className="max-h-48 rounded-lg object-contain shadow-sm"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="absolute right-3 top-3 rounded-full bg-zinc-900/70 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100/80 dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Drop an image here, or click to browse
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Any common image format, up to 8 MB
            </p>
          </>
        )}
        {selectedFile ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {selectedFile.name} &middot;{" "}
            {(selectedFile.size / 1024).toFixed(0)} KB &middot; click to
            choose a different image
          </p>
        ) : null}
      </div>
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
