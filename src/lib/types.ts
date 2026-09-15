import type {
  OutlineResult,
  OutputFormat,
  Unit,
} from "@richardmcquiston01/makertool-image2outline";

/** Real-world units the demo lets a visitor pick for calibration. */
export type CalibrationUnit = Exclude<Unit, "px">;

/** How the visitor wants pixel coordinates converted to real-world units. */
export type CalibrationMode = "none" | "scale" | "marker";

/** Form state captured by the options panel, before it is sent to the API. */
export interface TraceRequestOptions {
  readonly formats: readonly OutputFormat[];
  readonly flipY: boolean;
  readonly calibrationMode: CalibrationMode;
  readonly pixelsPerUnit: number | null;
  readonly scaleUnit: CalibrationUnit;
  readonly markerSize: number | null;
  readonly markerUnit: CalibrationUnit;
}

/** JSON body returned by `POST /api/trace` on failure. */
export interface TraceErrorResponse {
  readonly error: string;
}

export type { OutlineResult, OutputFormat, Unit };
