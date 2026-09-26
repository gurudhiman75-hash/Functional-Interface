export type FigureRenderer = 'SVG_TRIANGLE' | 'SVG_CIRCLE' | 'SVG_BOX';

export interface FigurePositionMap {
  readonly [position: string]: number | '?' | null;
}

function esc(value: number | '?'): string {
  return String(value);
}

function textNode(x: number, y: number, value: number | '?'): string {
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="Arial, sans-serif" font-weight="600">${esc(value)}</text>`;
}

export function renderTriangleSvg(values: {
  readonly top: number | '?';
  readonly left: number | '?';
  readonly right: number | '?';
  readonly centre: number | '?';
}): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180" role="img" aria-label="number triangle">',
    '<polygon points="110,18 28,154 192,154" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    '<circle cx="110" cy="94" r="27" fill="none" stroke="currentColor" stroke-width="2"/>',
    textNode(110, 13, values.top),
    textNode(21, 163, values.left),
    textNode(199, 163, values.right),
    textNode(110, 94, values.centre),
    '</svg>',
  ].join('');
}

export function renderCircleSvg(values: {
  readonly top: number | '?';
  readonly right: number | '?';
  readonly bottom: number | '?';
  readonly left: number | '?' | null;
  readonly centre: number | '?';
}): string {
  const four = values.left != null;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" role="img" aria-label="number wheel">',
    '<circle cx="110" cy="110" r="82" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    four
      ? '<line x1="110" y1="28" x2="110" y2="192" stroke="currentColor" stroke-width="1.5"/><line x1="28" y1="110" x2="192" y2="110" stroke="currentColor" stroke-width="1.5"/>'
      : '<line x1="110" y1="28" x2="110" y2="83" stroke="currentColor" stroke-width="1.5"/><line x1="181" y1="151" x2="134" y2="124" stroke="currentColor" stroke-width="1.5"/><line x1="39" y1="151" x2="86" y2="124" stroke="currentColor" stroke-width="1.5"/>',
    '<circle cx="110" cy="110" r="27" fill="none" stroke="currentColor" stroke-width="2"/>',
    textNode(110, 62, values.top),
    four ? textNode(158, 110, values.right) : textNode(166, 146, values.right),
    textNode(110, 158, values.bottom),
    four && values.left != null ? textNode(62, 110, values.left) : '',
    textNode(110, 110, values.centre),
    '</svg>',
  ].join('');
}

export function renderBoxSvg(values: {
  readonly topLeft: number | '?';
  readonly topRight: number | '?';
  readonly bottomLeft: number | '?';
  readonly bottomRight: number | '?';
  readonly centre: number | '?';
}, shape: 'SQUARE' | 'RECTANGLE' = 'SQUARE'): string {
  const x = shape === 'SQUARE' ? 35 : 20;
  const width = shape === 'SQUARE' ? 150 : 180;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190" role="img" aria-label="corner centre number figure">',
    `<rect x="${x}" y="20" width="${width}" height="150" fill="none" stroke="currentColor" stroke-width="2.5"/>`,
    '<circle cx="110" cy="95" r="27" fill="none" stroke="currentColor" stroke-width="2"/>',
    textNode(x + 13, 35, values.topLeft),
    textNode(x + width - 13, 35, values.topRight),
    textNode(x + 13, 155, values.bottomLeft),
    textNode(x + width - 13, 155, values.bottomRight),
    textNode(110, 95, values.centre),
    '</svg>',
  ].join('');
}

export function figurePreview(renderer: FigureRenderer, values: FigurePositionMap): string {
  if (renderer === 'SVG_TRIANGLE') {
    return [
      `      ${values.top}`,
      '     / \\',
      `   ${values.left}   ${values.right}`,
      `     [${values.centre}]`,
    ].join('\n');
  }
  if (renderer === 'SVG_CIRCLE') {
    if (values.left == null) {
      return [
        `      ${values.top}`,
        `     [${values.centre}]`,
        `   ${values.bottom}   ${values.right}`,
      ].join('\n');
    }
    return [
      `      ${values.top}`,
      `  ${values.left}  [${values.centre}]  ${values.right}`,
      `      ${values.bottom}`,
    ].join('\n');
  }
  return [
    `${values.topLeft}       ${values.topRight}`,
    `    [${values.centre}]`,
    `${values.bottomLeft}       ${values.bottomRight}`,
  ].join('\n');
}
