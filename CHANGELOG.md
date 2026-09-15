# CHANGELOG

## Unreleased

- Bumped `@richardmcquiston01/makertool-image2outline` to 1.1.3 (fixes
  silhouette edges lost to saturated highlights).
- Bumped `@richardmcquiston01/makertool-image2outline` to 1.1.2 (fixes
  spurious holes from printed logos/text on traced objects).
- Fixed a stale README prerequisite: Next.js 16 requires Node.js ≥20.9.0,
  not 18+; added a matching `engines` field to `package.json`.
- Polished the trace form's UX: client-side image type/size validation,
  a computed blocking reason with a neutral hint instead of click-to-discover
  errors, a loading spinner with the form disabled mid-trace, a Remove
  control on the image preview, and auto-scroll to the result on completion.
- Documented the branching workflow in `CLAUDE.md`: new work branches off
  `dev` and targets `dev` in pull requests; `main` tracks released/deployed
  state.
- Added the initial Next.js single-page demo: an upload form posting to a
  `/api/trace` Node.js API route that runs `image2outline()` server-side,
  with an inline SVG preview, a DXF text preview, per-format downloads, and
  support for manual scale calibration, reference-marker calibration, and
  `flipY`.
