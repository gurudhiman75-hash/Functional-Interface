import type {
  SvgLayoutGraph,
  SvgRenderResult,
  SvgThemeName,
} from "../contracts/svg-visualization-types";
import { getSvgTheme, nodeFill } from "../themes/svg-themes";

function xml(text: string) {
  return text
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;");
}

function textLine(input: {
  x: number;
  y: number;
  text: string;
  size: number;
  weight?: number;
  fill: string;
}) {
  return `<text x="${input.x}" y="${input.y}" font-size="${input.size}" font-weight="${input.weight ?? 400}" fill="${input.fill}">${xml(input.text)}</text>`;
}

export function renderSvgPedagogy(
  graph: SvgLayoutGraph,
  themeName: SvgThemeName = "coaching_board",
): SvgRenderResult {
  const theme = getSvgTheme(themeName);
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${xml(graph.title)}" viewBox="0 0 ${graph.width} ${graph.height}" width="${graph.width}" height="${graph.height}">`,
    `<rect width="100%" height="100%" fill="${theme.background}"/>`,
    `<style>text{font-family:${theme.fontFamily};dominant-baseline:auto}.eq{font-variant-numeric:tabular-nums}</style>`,
    textLine({
      x: 80,
      y: 42,
      text: graph.title,
      size: 24,
      weight: 700,
      fill: theme.foreground,
    }),
    textLine({
      x: 80,
      y: 65,
      text: `${graph.subtype} · ${graph.difficulty}`,
      size: 13,
      fill: theme.muted,
    }),
  );

  for (let index = 0; index < graph.nodes.length; index += 1) {
    const node = graph.nodes[index]!;
    const fill = nodeFill(theme, node.emphasis);
    const stroke = node.emphasis === "answer" ? theme.accent : theme.cardStroke;
    parts.push(
      `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${node.emphasis === "answer" ? 2 : 1.2}"/>`,
    );

    let cursor = node.y + 28;
    for (const line of node.labelLines) {
      parts.push(
        textLine({
          x: node.x + 22,
          y: cursor,
          text: line,
          size: 16,
          weight: 700,
          fill: theme.foreground,
        }),
      );
      cursor += 20;
    }

    for (const line of node.equationLines) {
      parts.push(
        `<text class="eq" x="${node.x + 22}" y="${cursor + 6}" font-size="18" fill="${theme.equation}">${xml(line)}</text>`,
      );
      cursor += 22;
    }

    const next = graph.nodes[index + 1];
    if (next) {
      const x = node.x + node.width / 2;
      const y1 = node.y + node.height;
      const y2 = next.y;
      parts.push(
        `<path d="M ${x} ${y1 + 4} L ${x} ${y2 - 10}" stroke="${theme.accent}" stroke-width="1.5" fill="none"/>`,
        `<path d="M ${x - 5} ${y2 - 16} L ${x} ${y2 - 8} L ${x + 5} ${y2 - 16}" stroke="${theme.accent}" stroke-width="1.5" fill="none"/>`,
      );
    }
  }

  parts.push("</svg>");
  const svg = parts.join("\n");
  const html = `<figure class="quant-svg-pedagogy">${svg}</figure>`;

  return {
    svg,
    width: graph.width,
    height: graph.height,
    html,
  };
}

export function svgToDataUri(svg: string) {
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

