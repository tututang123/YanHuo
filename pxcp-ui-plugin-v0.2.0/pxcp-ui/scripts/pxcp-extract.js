#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const JPG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const JSON_SIGNATURES = [Buffer.from('{"name"'), Buffer.from('{"artboardId"')];

function usage() {
  console.log(`Usage:
  node plugins/pxcp-ui/scripts/pxcp-extract.js <file.pxcp> [--out generated/pxcp]

Output:
  <out>/<file-name>/
    manifest.json
    assets/embedded/*
    artboards/<index>-<name>/spec.json
    artboards/<index>-<name>/reference.png
    artboards/<index>-<name>/thumb.png
    artboards/<index>-<name>/tokens.css
    artboards/<index>-<name>/implementation.css
    artboards/<index>-<name>/preview.html
    artboards/<index>-<name>/implementation-plan.md
    artboards/<index>-<name>/prompt.md`);
}

function parseArgs(argv) {
  const args = { input: null, out: "generated/pxcp" };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "-h" || arg === "--help") {
      args.help = true;
    } else if (arg === "-o" || arg === "--out") {
      args.out = argv[i + 1];
      i += 1;
    } else if (!args.input) {
      args.input = arg;
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }

  return args;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function slash(value) {
  return value.split(path.sep).join("/");
}

function has(value, key) {
  return value && Object.prototype.hasOwnProperty.call(value, key);
}

function get(value, keys, fallback) {
  let current = value;
  for (const key of keys) {
    if (current == null) return fallback;
    current = current[key];
  }
  return current == null ? fallback : current;
}

function numberOr(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function rel(from, to) {
  return slash(path.relative(from, to));
}

function sanitizeName(value, fallback) {
  const cleaned = String(value || "")
    .trim()
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || fallback;
}

function findJsonEnd(buffer, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < buffer.length; index += 1) {
    const byte = buffer[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (byte === 0x5c) {
        escaped = true;
      } else if (byte === 0x22) {
        inString = false;
      }
      continue;
    }

    if (byte === 0x22) {
      inString = true;
    } else if (byte === 0x7b) {
      depth += 1;
    } else if (byte === 0x7d) {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }

  return -1;
}

function readArtboards(buffer) {
  const artboards = [];
  let offset = 0;

  while (offset < buffer.length) {
    const matches = JSON_SIGNATURES
      .map((signature) => ({
        signature,
        offset: buffer.indexOf(signature, offset),
      }))
      .filter((match) => match.offset !== -1)
      .sort((a, b) => a.offset - b.offset);

    if (matches.length === 0) break;

    const match = matches[0];
    offset = match.offset;
    const end = findJsonEnd(buffer, offset);
    if (end === -1) {
      offset += match.signature.length;
      continue;
    }

    try {
      const obj = JSON.parse(buffer.slice(offset, end).toString("utf8"));
      if (
        obj &&
        Number.isFinite(obj.width) &&
        Number.isFinite(obj.height) &&
        Array.isArray(obj.elements)
      ) {
        artboards.push({
          index: artboards.length,
          offset,
          byteLength: end - offset,
          data: obj,
        });
      }
    } catch (_error) {
      // Not every {"name"... sequence in the binary payload is an artboard JSON.
    }

    offset += match.signature.length;
  }

  return artboards;
}

function readPngSize(buffer, offset) {
  return {
    width: buffer.readUInt32BE(offset + 16),
    height: buffer.readUInt32BE(offset + 20),
  };
}

function readJpegSize(buffer) {
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker);

    if (isSof) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += 2 + length;
  }

  return { width: null, height: null };
}

function extractEmbeddedImages(buffer, outputRoot) {
  const imageDir = path.join(outputRoot, "assets", "embedded");
  ensureDir(imageDir);

  const images = [];
  let offset = 0;
  let pngIndex = 0;

  while ((offset = buffer.indexOf(PNG_SIGNATURE, offset)) !== -1) {
    const iend = buffer.indexOf(Buffer.from("IEND"), offset);
    if (iend === -1) break;

    const end = iend + 8;
    const imageBuffer = buffer.slice(offset, end);
    const size = readPngSize(buffer, offset);
    const fileName = `png_${String(pngIndex).padStart(2, "0")}_${size.width}x${size.height}.png`;
    const outputPath = path.join(imageDir, fileName);

    fs.writeFileSync(outputPath, imageBuffer);
    images.push({
      kind: "png",
      index: images.length,
      pngIndex,
      offset,
      byteLength: imageBuffer.length,
      width: size.width,
      height: size.height,
      path: outputPath,
      fileName,
    });

    pngIndex += 1;
    offset = end;
  }

  let jpgOffset = 0;
  let jpgIndex = 0;
  while ((jpgOffset = buffer.indexOf(JPG_SIGNATURE, jpgOffset)) !== -1) {
    const end = buffer.indexOf(Buffer.from([0xff, 0xd9]), jpgOffset);
    if (end === -1) break;

    const imageBuffer = buffer.slice(jpgOffset, end + 2);
    const size = readJpegSize(imageBuffer);
    const fileName = `jpg_${String(jpgIndex).padStart(2, "0")}.jpg`;
    const outputPath = path.join(imageDir, fileName);

    fs.writeFileSync(outputPath, imageBuffer);
    images.push({
      kind: "jpg",
      index: images.length,
      jpgIndex,
      offset: jpgOffset,
      byteLength: imageBuffer.length,
      width: size.width,
      height: size.height,
      path: outputPath,
      fileName,
    });

    jpgIndex += 1;
    jpgOffset = end + 2;
  }

  return images.sort((a, b) => a.offset - b.offset);
}

function argbToCss(value) {
  const unsigned = value >>> 0;
  const alpha = (unsigned >>> 24) & 255;
  const red = (unsigned >>> 16) & 255;
  const green = (unsigned >>> 8) & 255;
  const blue = unsigned & 255;
  const hex = [red, green, blue]
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("");

  if (alpha === 255) return `#${hex}`;
  return `rgba(${red}, ${green}, ${blue}, ${(alpha / 255).toFixed(4)})`;
}

function collectElementColors(element, colors) {
  const add = (value) => {
    if (Number.isInteger(value) && value > 0) colors.add(value >>> 0);
  };

  for (const run of get(element, ["fontInfo", "fonts"], [])) add(run.color);

  for (const fill of get(element, ["vectorInfo", "fill", "colors"], [])) {
    add(get(fill, ["solidColor", "color"], undefined));
    for (const value of get(fill, ["gradientColor", "colors"], [])) add(value);
  }

  for (const style of get(element, ["vectorInfo", "stroke", "styles"], [])) {
    add(get(style, ["color", "solidColor", "color"], undefined));
    for (const value of get(style, ["color", "gradientColor", "colors"], [])) add(value);
  }

  for (const shadow of get(element, ["effectInfo", "shadows"], [])) add(shadow.color);
}

function summarizeFill(fill) {
  const colors = get(fill, ["colors"], []);
  return colors.map((entry) => {
    const gradient = entry.gradientColor || {};
    return {
      type: entry.type,
      blendMode: entry.blendMode || "",
      solidColor: Number.isInteger(get(entry, ["solidColor", "color"], undefined))
        ? argbToCss(get(entry, ["solidColor", "color"], undefined))
        : null,
      gradient:
        (gradient.colors || []).length > 0
          ? {
              type: gradient.type,
              angle: gradient.angle,
              colors: gradient.colors.map(argbToCss),
              positions: gradient.colorPos || [],
            }
          : null,
    };
  });
}

function fillToCss(fill) {
  const first = (fill || []).find((entry) => entry.solidColor || entry.gradient);
  if (!first) return null;
  if (first.gradient) {
    const angle = Number.isFinite(first.gradient.angle) ? first.gradient.angle : 180;
    const stops = first.gradient.colors.map((color, index) => {
      const position = first.gradient.positions[index];
      return Number.isFinite(position) ? `${color} ${Math.round(position * 100)}%` : color;
    });
    return `linear-gradient(${angle}deg, ${stops.join(", ")})`;
  }
  return first.solidColor;
}

function radiusToCss(radius) {
  if (!Array.isArray(radius) || radius.length === 0) return null;
  const values = radius.map((value) => numberOr(value, 0));
  if (values.every((value) => value === 0)) return null;
  if (values.length === 1 || values.every((value) => value === values[0])) {
    return `${values[0]}px`;
  }
  return `${values[0] || 0}px ${values[1] || 0}px ${values[2] || 0}px ${values[3] || 0}px`;
}

function shadowsToCss(effects) {
  const shadows = effects?.shadows || [];
  if (shadows.length === 0) return null;
  return shadows
    .map((shadow) => {
      const inset = shadow.inner ? "inset " : "";
      return `${inset}${numberOr(shadow.x, 0)}px ${numberOr(shadow.y, 0)}px ${numberOr(
        shadow.blur,
        0
      )}px ${numberOr(shadow.spread, 0)}px ${shadow.color}`;
    })
    .join(", ");
}

function cssTextValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildElementCss(summary) {
  const css = {
    position: "absolute",
    left: `${summary.rect.x}px`,
    top: `${summary.rect.y}px`,
    width: `${summary.rect.width}px`,
    height: `${summary.rect.height}px`,
    opacity: summary.opacity,
  };

  if (summary.kind === "text" && summary.text?.runs?.length) {
    const run = summary.text.runs[0];
    css.color = run.color;
    css.fontFamily = run.fontFamily;
    css.fontSize = `${numberOr(run.size, 16)}px`;
    if (Number.isFinite(run.lineHeight) && run.lineHeight > 0) {
      css.lineHeight = `${run.lineHeight}px`;
    }
    if (Number.isFinite(run.letterSpacing)) css.letterSpacing = `${run.letterSpacing}px`;
    if (run.alignment) css.textAlign = run.alignment;
  }

  if (summary.vector) {
    const background = fillToCss(summary.vector.fill);
    if (background) css.background = background;
    const radius = radiusToCss(summary.vector.radius);
    if (radius) css.borderRadius = radius;
    const firstStroke = summary.vector.stroke?.styles?.[0];
    const strokeColor = fillToCss(firstStroke?.colors);
    if (firstStroke && strokeColor) {
      css.border = `${numberOr(firstStroke.thickness, 1)}px solid ${strokeColor}`;
    }
  }

  const boxShadow = shadowsToCss(summary.effects);
  if (boxShadow) css.boxShadow = boxShadow;
  return css;
}

function summarizeElement(element, index) {
  const rect = element.rectInfo || {};
  const text = get(element, ["fontInfo", "text"], "");
  const fonts = get(element, ["fontInfo", "fonts"], []);
  const vector = element.vectorInfo || {};
  const shadows = get(element, ["effectInfo", "shadows"], []);

  let kind = "layer";
  if (get(element, ["baseInfo", "root"], false)) kind = "root";
  else if (text) kind = "text";
  else if (vector.filled || vector.stroked) kind = "vector";

  const summary = {
    index,
    id: get(element, ["baseInfo", "id"], ""),
    name: get(element, ["baseInfo", "name"], ""),
    kind,
    opacity: has(element.baseInfo || {}, "opacity") ? element.baseInfo.opacity : 1,
    rect: {
      x: numberOr(rect.x, 0),
      y: numberOr(rect.y, 0),
      width: numberOr(rect.width, 0),
      height: numberOr(rect.height, 0),
    },
    text: text
      ? {
          value: text,
          runs: fonts.map((font) => ({
            text: font.text,
            fontFamily: font.name,
            size: font.size,
            color: argbToCss(font.color),
            alignment: font.alignment,
            lineHeight: font.lineHeight,
            letterSpacing: font.letterSpacing,
            start: font.start,
            end: font.end,
          })),
        }
      : null,
    vector:
      vector.filled || vector.stroked
        ? {
            filled: Boolean(vector.filled),
            fill: summarizeFill(vector.fill),
            stroked: Boolean(vector.stroked),
            stroke: {
              styles: get(vector, ["stroke", "styles"], []).map((style) => ({
                position: style.position,
                thickness: style.thickness,
                colors: summarizeFill({ colors: [style.color] }),
              })),
              dashSet: get(vector, ["stroke", "dashSet"], []),
            },
            radius: vector.radius || [],
          }
        : null,
    effects:
      shadows.length > 0
        ? {
            shadows: shadows.map((shadow) => ({
              color: argbToCss(shadow.color),
              x: shadow.x,
              y: shadow.y,
              blur: shadow.blur,
              spread: shadow.spread,
              inner: shadow.inner,
              blendMode: shadow.blendMode,
            })),
          }
        : null,
  };

  summary.css = buildElementCss(summary);
  return summary;
}

function getElementArea(element) {
  return Math.max(0, element.rect.width) * Math.max(0, element.rect.height);
}

function buildInsights(elements, artboard) {
  const visible = elements.filter((element) => element.kind !== "root" && getElementArea(element) > 0);
  const repeatedNames = new Map();
  for (const element of visible) {
    const key = sanitizeName(element.name || element.kind, element.kind).toLowerCase();
    repeatedNames.set(key, (repeatedNames.get(key) || 0) + 1);
  }

  const componentCandidates = [...repeatedNames.entries()]
    .filter(([, count]) => count > 1)
    .map(([name, count]) => ({ name, count }));

  const edgeLocked = visible.filter((element) => {
    const right = artboard.width - (element.rect.x + element.rect.width);
    const bottom = artboard.height - (element.rect.y + element.rect.height);
    return element.rect.x <= 24 || element.rect.y <= 24 || right <= 24 || bottom <= 24;
  });

  const largePanels = visible
    .filter((element) => getElementArea(element) >= artboard.width * artboard.height * 0.08)
    .map((element) => ({
      index: element.index,
      name: element.name,
      kind: element.kind,
      rect: element.rect,
    }));

  return {
    componentCandidates,
    responsiveHints: {
      preserveAspectRatio: `${artboard.width} / ${artboard.height}`,
      edgeLockedCount: edgeLocked.length,
      notes: [
        "Start with the original artboard size, then scale via a bounded wrapper.",
        "Convert repeated names or similarly sized groups into components before polishing.",
        "Prefer CSS/SVG for text, fills, gradients, borders, radii, and shadows; reserve raster assets for artwork.",
      ],
    },
    largePanels,
  };
}

function buildSpec(artboard, artboardDir, outputRoot, pair) {
  const data = artboard.data;
  const colors = new Set();
  for (const element of data.elements) collectElementColors(element, colors);
  const elements = data.elements.map(summarizeElement);

  const colorTokens = [...colors].sort((a, b) => a - b).map((value, index) => ({
    name: `color-${String(index + 1).padStart(3, "0")}`,
    argb: value,
    css: argbToCss(value),
  }));

  return {
    source: {
      format: "PXCP",
      filePath: data.filePath || "",
      sourceGuid: data.sourceGuid || "",
      generatedGuid: data.generatedGuid || "",
      jsonOffset: artboard.offset,
      jsonByteLength: artboard.byteLength,
    },
    artboard: {
      name: data.name || "",
      width: data.width,
      height: data.height,
      version: data.version,
      stampCreated: data.stampCreated,
      stampModified: data.stampModified,
      retinaScale: data.retinaScale,
    },
    assets: {
      thumb: pair.thumb ? rel(artboardDir, pair.thumb.outputPath) : null,
      reference: pair.reference ? rel(artboardDir, pair.reference.outputPath) : null,
      embeddedThumb: pair.thumb ? rel(artboardDir, pair.thumb.path) : null,
      embeddedReference: pair.reference ? rel(artboardDir, pair.reference.path) : null,
    },
    summary: {
      elementCount: data.elements.length,
      textCount: data.elements.filter((element) => get(element, ["fontInfo", "text"], "")).length,
      vectorCount: data.elements.filter(
        (element) =>
          get(element, ["vectorInfo", "filled"], false) ||
          get(element, ["vectorInfo", "stroked"], false)
      ).length,
      colorCount: colorTokens.length,
    },
    tokens: {
      colors: colorTokens,
    },
    insights: buildInsights(elements, data),
    elements,
    raw: data,
    outputRoot: rel(artboardDir, outputRoot),
  };
}

function writeTokensCss(file, spec) {
  const lines = [
    ":root {",
    `  --pxcp-artboard-width: ${spec.artboard.width}px;`,
    `  --pxcp-artboard-height: ${spec.artboard.height}px;`,
  ];

  for (const token of spec.tokens.colors) {
    lines.push(`  --pxcp-${token.name}: ${token.css};`);
  }

  lines.push("}");
  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

function camelToKebab(value) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

function writeImplementationCss(file, spec) {
  const lines = [
    "@import url('./tokens.css');",
    "",
    ".pxcp-artboard {",
    "  position: relative;",
    `  width: ${spec.artboard.width}px;`,
    `  height: ${spec.artboard.height}px;`,
    "  overflow: hidden;",
    "  background: var(--pxcp-color-001, #ffffff);",
    "}",
    "",
    ".pxcp-layer {",
    "  box-sizing: border-box;",
    "  white-space: pre-wrap;",
    "}",
  ];

  for (const element of spec.elements.filter((item) => item.kind !== "root")) {
    lines.push("", `.pxcp-layer-${element.index} {`);
    for (const [key, value] of Object.entries(element.css || {})) {
      if (value == null || value === "") continue;
      if (key === "opacity" && value === 1) continue;
      const cssValue = key === "fontFamily" ? `"${cssTextValue(value)}"` : value;
      lines.push(`  ${camelToKebab(key)}: ${cssValue};`);
    }
    lines.push("}");
  }

  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

function writePreviewHtml(file, spec) {
  const layers = spec.elements
    .filter((element) => element.kind !== "root")
    .map((element) => {
      const label = escapeHtml(element.name || `${element.kind}-${element.index}`);
      const classes = `pxcp-layer pxcp-layer-${element.index}`;
      if (element.kind === "text") {
        return `    <div class="${classes}" data-layer="${element.index}" aria-label="${label}">${escapeHtml(
          element.text.value
        )}</div>`;
      }
      return `    <div class="${classes}" data-layer="${element.index}" aria-label="${label}"></div>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(spec.artboard.name)} PXCP preview</title>
  <link rel="stylesheet" href="./implementation.css">
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f3f4f6;
    }
    .pxcp-scale {
      transform-origin: center;
      max-width: 100vw;
      max-height: 100vh;
      overflow: auto;
    }
  </style>
</head>
<body>
  <main class="pxcp-scale">
  <section class="pxcp-artboard" aria-label="${escapeHtml(spec.artboard.name)}">
${layers}
  </section>
  </main>
</body>
</html>
`;

  fs.writeFileSync(file, html);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function writeImplementationPlan(file, spec) {
  const components = spec.insights.componentCandidates
    .map((item) => `- ${item.name}: ${item.count} repeated layers`)
    .join("\n");
  const panels = spec.insights.largePanels
    .slice(0, 12)
    .map(
      (item) =>
        `- #${item.index} ${item.name || item.kind}: ${item.rect.x},${item.rect.y} ${item.rect.width}x${item.rect.height}`
    )
    .join("\n");

  const body = `# Implementation plan

Artboard: ${spec.artboard.name}
Size: ${spec.artboard.width} x ${spec.artboard.height}

Generated files:
- spec.json: structured layer data with CSS-ready summaries.
- implementation.css: absolute-positioned CSS draft for layer styling.
- preview.html: browser preview of text/vector layers.
- tokens.css: extracted colors and artboard dimensions.
- reference.png: visual target for Playwright comparison.

Suggested build path:
1. Open preview.html and compare it to reference.png.
2. Move obvious repeated groups into framework components.
3. Replace placeholder vector boxes with semantic HTML/CSS or SVG.
4. Add responsive behavior around the original ${spec.artboard.width} / ${spec.artboard.height} aspect ratio.
5. Take a Playwright screenshot at the artboard size and iterate against reference.png.

Component candidates:
${components || "- No repeated layer names detected."}

Large layout panels:
${panels || "- No large panel candidates detected."}
`;

  fs.writeFileSync(file, body);
}

function writePrompt(file, spec) {
  const body = `# PXCP implementation prompt

Implement the "${spec.artboard.name}" artboard from this folder.

Use:
- spec.json for exact coordinates, layer order, text, fonts, colors, gradients, radii, opacity, shadows, CSS-ready layer summaries, and implementation insights.
- reference.png as the visual target.
- preview.html and implementation.css as a generated first-pass browser preview.
- implementation-plan.md for component and responsive hints.
- thumb.png only as a quick preview.

Coordinate system:
- Original artboard: ${spec.artboard.width} x ${spec.artboard.height}.
- Preserve relative positions and scale from the original coordinate system.
- Prefer real image assets when a layer is raster artwork; use CSS/SVG for text, rectangles, gradients, borders, and shadows when practical.

Verification:
- Render the implemented UI at the same aspect ratio.
- Take a Playwright screenshot.
- Compare against reference.png and iterate on layout, color, typography, spacing, and clipping.
`;

  fs.writeFileSync(file, body);
}

function imageArtboardScore(image, artboard) {
  if (!image.width || !image.height) return Number.POSITIVE_INFINITY;
  const widthRatio = image.width / artboard.data.width;
  const heightRatio = image.height / artboard.data.height;
  const ratioDelta = Math.abs(widthRatio - heightRatio);
  const scalePenalty = widthRatio >= 0.75 && heightRatio >= 0.75 ? 0 : 5;
  return ratioDelta * 100 + scalePenalty + Math.abs(1 - Math.min(widthRatio, heightRatio));
}

function pairArtboardImages(artboards, images) {
  const pngs = images.filter((image) => image.kind === "png");
  const sequentialPairs = artboards.map((_artboard, index) => ({
    thumb: pngs[index * 2] || null,
    reference: pngs[index * 2 + 1] || null,
    strategy: "sequential-thumb-reference",
  }));

  if (pngs.length >= artboards.length * 2) return sequentialPairs;

  const used = new Set();
  return artboards.map((artboard) => {
    const candidates = pngs
      .filter((image) => !used.has(image.index))
      .map((image) => ({ image, score: imageArtboardScore(image, artboard) }))
      .sort((a, b) => a.score - b.score);
    const reference = candidates[0]?.image || null;
    if (reference) used.add(reference.index);

    return {
      thumb: null,
      reference,
      strategy: "dimension-match-reference",
    };
  });
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.input) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const inputPath = path.resolve(args.input);
  const inputBase = path.basename(inputPath, path.extname(inputPath));
  const outputRoot = path.resolve(args.out, sanitizeName(inputBase, "pxcp-export"));

  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file does not exist: ${inputPath}`);
  }

  const buffer = fs.readFileSync(inputPath);
  if (buffer.slice(0, 4).toString("ascii") !== "PXCP") {
    throw new Error(`Unsupported file: expected PXCP magic at byte 0 in ${inputPath}`);
  }

  ensureDir(outputRoot);

  const artboards = readArtboards(buffer);
  const images = extractEmbeddedImages(buffer, outputRoot);
  const pairs = pairArtboardImages(artboards, images);
  const artboardOutputs = [];

  const artboardsDir = path.join(outputRoot, "artboards");
  ensureDir(artboardsDir);

  for (const artboard of artboards) {
    const dirName = `${String(artboard.index + 1).padStart(2, "0")}-${sanitizeName(
      artboard.data.name,
      "artboard"
    )}`;
    const artboardDir = path.join(artboardsDir, dirName);
    const pair = pairs[artboard.index];

    ensureDir(artboardDir);

    if (pair.thumb) {
      pair.thumb.outputPath = path.join(artboardDir, "thumb.png");
      fs.copyFileSync(pair.thumb.path, pair.thumb.outputPath);
    }

    if (pair.reference) {
      pair.reference.outputPath = path.join(artboardDir, "reference.png");
      fs.copyFileSync(pair.reference.path, pair.reference.outputPath);
    }

    const spec = buildSpec(artboard, artboardDir, outputRoot, pair);
    const specPath = path.join(artboardDir, "spec.json");
    const tokensPath = path.join(artboardDir, "tokens.css");
    const implementationCssPath = path.join(artboardDir, "implementation.css");
    const previewPath = path.join(artboardDir, "preview.html");
    const implementationPlanPath = path.join(artboardDir, "implementation-plan.md");
    const promptPath = path.join(artboardDir, "prompt.md");

    writeJson(specPath, spec);
    writeTokensCss(tokensPath, spec);
    writeImplementationCss(implementationCssPath, spec);
    writePreviewHtml(previewPath, spec);
    writeImplementationPlan(implementationPlanPath, spec);
    writePrompt(promptPath, spec);

    artboardOutputs.push({
      name: artboard.data.name,
      width: artboard.data.width,
      height: artboard.data.height,
      elements: artboard.data.elements.length,
      texts: spec.summary.textCount,
      vectors: spec.summary.vectorCount,
      directory: rel(outputRoot, artboardDir),
      spec: rel(outputRoot, specPath),
      implementationCss: rel(outputRoot, implementationCssPath),
      preview: rel(outputRoot, previewPath),
      implementationPlan: rel(outputRoot, implementationPlanPath),
      reference: pair.reference ? rel(outputRoot, pair.reference.outputPath) : null,
      thumb: pair.thumb ? rel(outputRoot, pair.thumb.outputPath) : null,
      imagePairing: pair.strategy,
    });
  }

  const manifest = {
    extractor: {
      name: "pxcp-ui",
      version: 2,
      features: [
        "structured-artboard-spec",
        "css-ready-layer-summaries",
        "browser-preview",
        "implementation-plan",
        "dimension-aware-image-pairing",
      ],
    },
    source: {
      input: slash(inputPath),
      fileName: path.basename(inputPath),
      byteLength: buffer.length,
      magic: buffer.slice(0, 4).toString("ascii"),
    },
    output: slash(outputRoot),
    counts: {
      artboards: artboards.length,
      embeddedImages: images.length,
      pngImages: images.filter((image) => image.kind === "png").length,
      jpgImages: images.filter((image) => image.kind === "jpg").length,
    },
    artboards: artboardOutputs,
    embeddedImages: images.map((image) => ({
      kind: image.kind,
      width: image.width,
      height: image.height,
      offset: image.offset,
      byteLength: image.byteLength,
      path: rel(outputRoot, image.path),
    })),
  };

  const manifestPath = path.join(outputRoot, "manifest.json");
  writeJson(manifestPath, manifest);

  console.log(`PXCP extracted: ${inputPath}`);
  console.log(`Output: ${outputRoot}`);
  console.log(`Artboards: ${artboards.length}`);
  console.log(`Embedded images: ${images.length}`);
  console.log(`Manifest: ${manifestPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
