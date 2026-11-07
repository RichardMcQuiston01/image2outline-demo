# Image2Outline Demo

- Author: [Richard McQuiston](mailto:richard.mcquiston@gmail.com)
- Website: https://richardmcquiston.com/

## Table of Contents

| [Overview](#overview) | [Features](#features) | [Getting Started](#getting-started) | [Deployment](#deployment) | [Buy Me a Coffee](#buy-me-a-coffee) | [License](#license) | [Copyright](#copyright) |

## Overview

This is a one-page demo site for
[`@richardmcquiston01/makertool-image2outline`](https://www.npmjs.com/package/@richardmcquiston01/makertool-image2outline).
That package traces the objects in a photo and turns them into a vector
outline. The outline can be an SVG file, a DXF file, or both. You can use it
for laser cutting, Computer Numerical Control (CNC) work, or Computer-Aided
Design (CAD).

The package reads images with [`sharp`](https://sharp.pixelplumbing.com/), a
native Node.js add-on. That means it cannot run in a web browser. This demo is
a [Next.js](https://nextjs.org/) app. The page at `/` sends your image to an
API route at `/api/trace`. The route runs `image2outline()` on the server and
returns the result as JSON.

[Back to Top](#table-of-contents)

## Features

- Upload an image by drag and drop or with the file picker.
- Trace the image to SVG, DXF, or both.
- Set the scale by hand with `scale: { pixelsPerUnit, unit }`.
- Set the scale automatically from a square marker of known size in the photo
  with `referenceMarker: { size, unit }`.
- Flip the output to CAD style (Y up, origin at the bottom left) with `flipY`.
- See an SVG preview and a DXF text preview, then download each format.
- Upload any image file up to 8 MB.

[Back to Top](#table-of-contents)

## Getting Started

### Prerequisites

- Node.js 20.9 or later. Next.js 16 needs this version.

### Installation

```sh
npm install
```

### Usage

1. Start the dev server:

   ```sh
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000).
3. Upload an image.
4. Pick your output formats and scale settings.
5. Click **Trace outline**.

To check the code for lint problems, run:

```sh
npm run lint
```

### Examples

The package is used in one server route,
[`src/app/api/trace/route.ts`](./src/app/api/trace/route.ts). This is the
core call:

```ts
import { image2outline } from "@richardmcquiston01/makertool-image2outline";

const result = await image2outline(imageBytes, {
  formats: ["svg", "dxf"],
  scale: { pixelsPerUnit: 10, unit: "mm" },
  flipY: true,
});
```

[Back to Top](#table-of-contents)

## Deployment

This app is built to run on [Vercel](https://vercel.com). The trace route sets
`export const runtime = "nodejs"`. It needs this because `sharp` uses native
code that the Edge runtime does not support.

To build and run the app yourself:

```sh
npm run build
npm run start
```

[Back to Top](#table-of-contents)

## Buy Me a Coffee

If this app, code, or repository has helped you or someone you know, please consider donating. I appreciate any help to offset the costs of development and/or AI Credits.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P1V529Z7ZP)

[Back to Top](#table-of-contents)

## License

Apache 2

[Back to Top](#table-of-contents)

## Copyright

(c)2026 Richard McQuiston. All rights reserved.

[Back to Top](#table-of-contents)
