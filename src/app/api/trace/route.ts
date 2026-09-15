import { image2outline } from "@richardmcquiston01/makertool-image2outline";
import type {
  Image2OutlineOptions,
  OutputFormat,
} from "@richardmcquiston01/makertool-image2outline";
import { NextResponse } from "next/server";
import { MAX_IMAGE_BYTES } from "@/lib/constants";

// `image2outline` decodes images with `sharp`, a native addon that only
// runs in a Node.js server runtime, not on the Edge — this route must stay
// on Node.
export const runtime = "nodejs";

const VALID_FORMATS: readonly OutputFormat[] = ["svg", "dxf"];
const VALID_UNITS = ["mm", "in"] as const;

function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

function parseFormats(
  raw: FormDataEntryValue | null,
): readonly [OutputFormat, ...OutputFormat[]] {
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error("Select at least one output format (SVG and/or DXF).");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The requested output formats were malformed.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Select at least one output format (SVG and/or DXF).");
  }

  for (const format of parsed) {
    if (!VALID_FORMATS.includes(format as OutputFormat)) {
      throw new Error(`Unsupported output format: "${String(format)}".`);
    }
  }

  return parsed as [OutputFormat, ...OutputFormat[]];
}

function parsePositiveNumber(
  raw: FormDataEntryValue | null,
  fieldLabel: string,
): number {
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldLabel} must be a positive number.`);
  }
  return value;
}

function parseUnit(
  raw: FormDataEntryValue | null,
  fieldLabel: string,
): (typeof VALID_UNITS)[number] {
  if (!VALID_UNITS.includes(raw as (typeof VALID_UNITS)[number])) {
    throw new Error(
      `${fieldLabel} must be one of: ${VALID_UNITS.join(", ")}.`,
    );
  }
  return raw as (typeof VALID_UNITS)[number];
}

async function buildOptions(
  formData: FormData,
): Promise<Image2OutlineOptions> {
  const formats = parseFormats(formData.get("formats"));
  const flipY = formData.get("flipY") === "true";
  const calibrationMode = formData.get("calibrationMode");

  const base = { formats, flipY } as const;

  if (calibrationMode === "scale") {
    const pixelsPerUnit = parsePositiveNumber(
      formData.get("pixelsPerUnit"),
      "Pixels per unit",
    );
    const unit = parseUnit(formData.get("scaleUnit"), "Scale unit");
    return { ...base, scale: { pixelsPerUnit, unit } };
  }

  if (calibrationMode === "marker") {
    const size = parsePositiveNumber(
      formData.get("markerSize"),
      "Reference marker size",
    );
    const unit = parseUnit(formData.get("markerUnit"), "Marker unit");
    return { ...base, referenceMarker: { size, unit } };
  }

  return base;
}

export async function POST(request: Request): Promise<NextResponse> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return badRequest("The request body was not valid multipart form data.");
  }

  const imageEntry = formData.get("image");
  if (!(imageEntry instanceof File) || imageEntry.size === 0) {
    return badRequest("No image file was provided.");
  }
  if (imageEntry.size > MAX_IMAGE_BYTES) {
    return badRequest(
      `The image is too large (${(imageEntry.size / 1024 / 1024).toFixed(1)} MB). The demo accepts up to ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`,
    );
  }
  if (!imageEntry.type.startsWith("image/")) {
    return badRequest(
      `Unsupported file type: "${imageEntry.type || "unknown"}". Upload an image file.`,
    );
  }

  let options: Image2OutlineOptions;
  try {
    options = await buildOptions(formData);
  } catch (error) {
    return badRequest(
      error instanceof Error ? error.message : "Invalid trace options.",
    );
  }

  try {
    const imageBytes = new Uint8Array(await imageEntry.arrayBuffer());
    const result = await image2outline(imageBytes, options);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Tracing the image failed for an unknown reason.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
