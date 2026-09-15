# Image2Outline Demo

## Overview

Single-page demo site for
[`@richardmcquiston01/makertool-image2outline`](https://www.npmjs.com/package/@richardmcquiston01/makertool-image2outline)
— a framework-agnostic TypeScript package that traces the object(s) in an
image into a vector outline (SVG and/or DXF), ready for laser cutting, CNC,
or CAD.

The package decodes images with [`sharp`](https://sharp.pixelplumbing.com/),
a native Node.js addon, so it can't run in the browser. This demo is a
[Next.js](https://nextjs.org/) app: a single client page (`/`) posts the
uploaded image to a server API route (`/api/trace`), which runs
`image2outline()` on the Node.js runtime and returns the result as JSON.

## Features demonstrated

- Uploading an image (drag-and-drop or file picker) and tracing it to SVG
  and/or DXF
- Manual scale calibration (`scale: { pixelsPerUnit, unit }`) for real-world
  dimensions
- Automatic scale calibration from a known-size square reference marker in
  the frame (`referenceMarker: { size, unit }`)
- Flipping to CAD convention (Y up, origin bottom-left) with `flipY`
- Inline SVG preview and DXF text preview, plus per-format download

## Getting Started

### Prerequisites

- Node.js 20.9 or later (required by Next.js 16)

### Installation

```sh
npm install
```

### Usage

```sh
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000), upload an image,
choose your output format(s) and calibration, and click **Trace outline**.

### Examples

The package itself is used from a single server route,
[`src/app/api/trace/route.ts`](./src/app/api/trace/route.ts):

```ts
import { image2outline } from "@richardmcquiston01/makertool-image2outline";

const result = await image2outline(imageBytes, {
  formats: ["svg", "dxf"],
  scale: { pixelsPerUnit: 10, unit: "mm" },
  flipY: true,
});
```

## Deployment

This app is designed to deploy on [Vercel](https://vercel.com). The trace
route is pinned to the Node.js serverless runtime (`export const runtime =
"nodejs"`) since `sharp` requires native bindings unavailable on the Edge
runtime.

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[**Donate via Stripe**](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800), or scan:

[![Donate via Stripe](./donate.svg)](https://donate.stripe.com/00w5kD3Gj1Xo9v7gVOcs800)

## License

Apache 2

## Copyright

(c)2026 Richard McQuiston. All rights reserved.
