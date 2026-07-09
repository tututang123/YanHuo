---
name: pxcp-ui
description: Extract PXCP design files and implement UI from them. Use when Codex needs to inspect, parse, convert, or build an interface from .pxcp files, especially when precise layout, assets, text, colors, fonts, gradients, shadows, or screenshot-based visual verification are required.
---

# PXCP UI

Use this skill for `.pxcp` design files. Do not treat PXCP as only a screenshot; first extract its embedded artboard JSON and image assets.

## Workflow

1. Run the extractor:

```bash
node tools/pxcp-extract.js path/to/file.pxcp --out generated/pxcp
```

If `tools/pxcp-extract.js` is unavailable but this plugin is present, run:

```bash
node plugins/pxcp-ui/scripts/pxcp-extract.js path/to/file.pxcp --out generated/pxcp
```

2. Open `generated/pxcp/<file>/manifest.json` and choose the target artboard.
3. Use the chosen artboard folder:
   - `spec.json` for coordinates, layer order, text, fonts, colors, gradients, radii, opacity, shadows, CSS-ready layer summaries, component candidates, and responsive hints.
   - `reference.png` as the visual target.
   - `tokens.css` as a quick color/size token source.
   - `implementation.css` as an absolute-positioned CSS draft for extracted text/vector layers.
   - `preview.html` as a browser preview that can be inspected before framework implementation.
   - `implementation-plan.md` for component candidates, large layout panels, and verification steps.
   - `prompt.md` as a concise implementation prompt when handing work to another Codex thread.
4. Open `preview.html` when useful to understand extracted geometry, then implement the UI in the project stack. Preserve the original aspect ratio and scale coordinates from the PXCP artboard size.
5. Convert repeated layers or similarly shaped groups from `spec.json.insights.componentCandidates` into real components before polishing.
6. Verify visually with Playwright screenshots at the same aspect ratio. Compare against `reference.png` and iterate on layout, color, typography, spacing, clipping, and asset placement.

## Notes

- PXCP files inspected so far begin with `PXCP`, contain multiple `{"name": ...}` artboard JSON blocks, and embed PNG/JPG resources.
- The extractor pairs PNGs as `thumb.png` then `reference.png` for each artboard in file order when available, and falls back to dimension-aware reference matching for partial exports.
- Prefer structured `spec.json` over manual screenshot guessing. Use `reference.png` to validate, not as the only source of truth.
- Treat generated `preview.html` as a first-pass reconstruction, not finished product code. It is strongest for geometry, text, fills, borders, radii, and shadows; final implementation should still use the app's real components and responsive layout patterns.
