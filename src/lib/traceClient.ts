import type {
  OutlineResult,
  TraceErrorResponse,
  TraceRequestOptions,
} from "@/lib/types";

/**
 * Sends an image and trace options to `POST /api/trace` and returns the
 * decoded {@link OutlineResult}. Throws a descriptive `Error` on any
 * client- or server-side failure so callers can surface it to the visitor.
 */
export async function traceImage(
  file: File,
  options: TraceRequestOptions,
): Promise<OutlineResult> {
  const formData = new FormData();
  formData.set("image", file);
  formData.set("formats", JSON.stringify(options.formats));
  formData.set("flipY", String(options.flipY));
  formData.set("calibrationMode", options.calibrationMode);

  if (options.calibrationMode === "scale" && options.pixelsPerUnit !== null) {
    formData.set("pixelsPerUnit", String(options.pixelsPerUnit));
    formData.set("scaleUnit", options.scaleUnit);
  }

  if (options.calibrationMode === "marker" && options.markerSize !== null) {
    formData.set("markerSize", String(options.markerSize));
    formData.set("markerUnit", options.markerUnit);
  }

  let response: Response;
  try {
    response = await fetch("/api/trace", { method: "POST", body: formData });
  } catch {
    throw new Error(
      "Could not reach the tracing service. Check your connection and try again.",
    );
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error("The tracing service returned an unreadable response.");
  }

  if (!response.ok) {
    const message = (body as Partial<TraceErrorResponse>).error;
    throw new Error(message ?? `Tracing failed with status ${response.status}.`);
  }

  return body as OutlineResult;
}
