"use client";

import type { CalibrationMode, CalibrationUnit, TraceRequestOptions } from "@/lib/types";
import type { OutputFormat } from "@richardmcquiston01/makertool-image2outline";

export interface TraceOptionsFormProps {
  readonly options: TraceRequestOptions;
  readonly onChange: (options: TraceRequestOptions) => void;
  readonly disabled?: boolean;
}

const ALL_FORMATS: readonly OutputFormat[] = ["svg", "dxf"];
const ALL_UNITS: readonly CalibrationUnit[] = ["mm", "in"];

function toggleFormat(
  formats: readonly OutputFormat[],
  format: OutputFormat,
): OutputFormat[] {
  return formats.includes(format)
    ? formats.filter((existing) => existing !== format)
    : [...formats, format];
}

/** Controls for output format, real-world calibration, and axis flipping. */
export function TraceOptionsForm({
  options,
  onChange,
  disabled = false,
}: TraceOptionsFormProps): React.JSX.Element {
  return (
    <fieldset
      disabled={disabled}
      className="flex flex-col gap-6 disabled:opacity-60"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Output formats
        </legend>
        <div className="mt-2 flex gap-4">
          {ALL_FORMATS.map((format) => (
            <label
              key={format}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <input
                type="checkbox"
                checked={options.formats.includes(format)}
                onChange={() =>
                  onChange({
                    ...options,
                    formats: toggleFormat(options.formats, format),
                  })
                }
                className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              {format.toUpperCase()}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Real-world scale
        </legend>
        <div className="mt-2 flex flex-col gap-3">
          {(
            [
              ["none", "Keep pixel coordinates"],
              ["scale", "I know the pixels-per-unit ratio"],
              ["marker", "Detect a known-size square marker in the image"],
            ] as const satisfies readonly (readonly [CalibrationMode, string])[]
          ).map(([mode, label]) => (
            <label
              key={mode}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <input
                type="radio"
                name="calibrationMode"
                checked={options.calibrationMode === mode}
                onChange={() => onChange({ ...options, calibrationMode: mode })}
                className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              {label}
            </label>
          ))}
        </div>

        {options.calibrationMode === "scale" ? (
          <div className="mt-3 flex flex-wrap items-end gap-3 pl-6">
            <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
              Pixels per unit
              <input
                type="number"
                min={0}
                step="any"
                value={options.pixelsPerUnit ?? ""}
                onChange={(event) =>
                  onChange({
                    ...options,
                    pixelsPerUnit:
                      event.target.value === "" ? null : Number(event.target.value),
                  })
                }
                className="w-28 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </label>
            <UnitSelect
              value={options.scaleUnit}
              onChange={(unit) => onChange({ ...options, scaleUnit: unit })}
            />
          </div>
        ) : null}

        {options.calibrationMode === "marker" ? (
          <div className="mt-3 flex flex-wrap items-end gap-3 pl-6">
            <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
              Marker side length
              <input
                type="number"
                min={0}
                step="any"
                value={options.markerSize ?? ""}
                onChange={(event) =>
                  onChange({
                    ...options,
                    markerSize:
                      event.target.value === "" ? null : Number(event.target.value),
                  })
                }
                className="w-28 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </label>
            <UnitSelect
              value={options.markerUnit}
              onChange={(unit) => onChange({ ...options, markerUnit: unit })}
            />
          </div>
        ) : null}
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={options.flipY}
          onChange={(event) => onChange({ ...options, flipY: event.target.checked })}
          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
        />
        Flip Y (CAD convention: Y up, origin bottom-left)
      </label>
    </fieldset>
  );
}

interface UnitSelectProps {
  readonly value: CalibrationUnit;
  readonly onChange: (unit: CalibrationUnit) => void;
}

function UnitSelect({ value, onChange }: UnitSelectProps): React.JSX.Element {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
      Unit
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CalibrationUnit)}
        className="w-20 rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {ALL_UNITS.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </label>
  );
}
