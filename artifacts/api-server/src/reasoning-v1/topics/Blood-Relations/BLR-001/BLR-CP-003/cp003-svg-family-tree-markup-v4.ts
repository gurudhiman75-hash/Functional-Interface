import type { BlrCp003SvgFamilyTreeDiagram } from "./cp003-svg-family-tree";
import { renderBlrCp003SvgFamilyTreeMarkup as renderV3 } from "./cp003-svg-family-tree-markup-v3";

function escapeXml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function numberText(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "");
}

function addRoleLabel(
  markup: string,
  nodeLabel: string,
  roleLabel: string,
): string {
  const escapedNodeLabel = escapeXml(nodeLabel);
  const nameMarker = `font-size="14" font-weight="700" fill="#0f172a">${escapedNodeLabel}</text>`;
  const nameIndex = markup.indexOf(nameMarker);
  if (nameIndex < 0) {
    throw new Error(`Unable to locate SVG card for role-labelled node ${nodeLabel}.`);
  }

  const genderTextStart = markup.indexOf("<text ", nameIndex + nameMarker.length);
  const genderTextEnd = markup.indexOf("</text>", genderTextStart);
  if (genderTextStart < 0 || genderTextEnd < 0) {
    throw new Error(`Unable to locate SVG gender label for ${nodeLabel}.`);
  }

  const genderMarkup = markup.slice(genderTextStart, genderTextEnd + "</text>".length);
  const coordinates = /x="(-?\d+(?:\.\d+)?)" y="(-?\d+(?:\.\d+)?)"/.exec(
    genderMarkup,
  );
  if (!coordinates) {
    throw new Error(`Unable to locate SVG role-label coordinates for ${nodeLabel}.`);
  }

  const x = coordinates[1]!;
  const y = numberText(Number(coordinates[2]!) + 13);
  const roleMarkup = `<text data-role-label="true" x="${x}" y="${y}" font-size="7" font-weight="800" fill="#92400e">${escapeXml(roleLabel.toLocaleUpperCase("en-IN"))}</text>`;
  const insertionPoint = genderTextEnd + "</text>".length;
  return `${markup.slice(0, insertionPoint)}${roleMarkup}${markup.slice(insertionPoint)}`;
}

export function renderBlrCp003SvgFamilyTreeMarkup(
  diagram: BlrCp003SvgFamilyTreeDiagram,
): string {
  let markup = renderV3(diagram);
  for (const node of diagram.nodes) {
    if (!node.roleLabel) continue;
    markup = addRoleLabel(markup, node.label, node.roleLabel);
  }
  return markup;
}
