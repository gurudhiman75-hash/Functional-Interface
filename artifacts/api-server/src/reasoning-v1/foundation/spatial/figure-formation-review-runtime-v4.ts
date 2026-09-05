import { generateFigureFormationReviewQuestionV3 } from "./figure-formation-review-runtime-v3";
import type { FigureFormationLanguageV1 } from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";

type Segment = Readonly<{ x1: number; y1: number; x2: number; y2: number }>;
type Component = Readonly<{ segments: readonly Segment[]; minX: number; minY: number; maxX: number; maxY: number; unit: number; cx: number; cy: number }>;

const EXAM_STROKE = 1.35;
const LINE_TAG = /<line\b[^>]*>/gi;

function readAttr(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`${name}="([\\d.-]+)"`, "i"));
  return match ? Number(match[1]) : null;
}

function endpointKey(x: number, y: number): string {
  return `${x.toFixed(2)},${y.toFixed(2)}`;
}

function boundsFor(segments: readonly Segment[]) {
  const xs = segments.flatMap((segment) => [segment.x1, segment.x2]);
  const ys = segments.flatMap((segment) => [segment.y1, segment.y2]);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  };
}

function inferUnit(segments: readonly Segment[]): number {
  const lengths = segments
    .map((segment) => Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1))
    .filter((length) => Number.isFinite(length) && length > 0.5)
    .sort((a, b) => a - b);
  if (!lengths.length) throw new Error("FFM V4 could not infer a geometric unit from an SVG component.");
  return lengths[0]!;
}

function extractComponents(svg: string): Component[] {
  const segments: Segment[] = [];
  for (const tag of svg.match(LINE_TAG) ?? []) {
    if (/stroke="#9ca3af"/i.test(tag)) continue;
    const x1 = readAttr(tag, "x1");
    const y1 = readAttr(tag, "y1");
    const x2 = readAttr(tag, "x2");
    const y2 = readAttr(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    segments.push(Object.freeze({ x1: x1!, y1: y1!, x2: x2!, y2: y2! }));
  }
  if (!segments.length) return [];

  const parent = segments.map((_, index) => index);
  const find = (index: number): number => {
    let current = index;
    while (parent[current] !== current) {
      parent[current] = parent[parent[current]!]!;
      current = parent[current]!;
    }
    return current;
  };
  const union = (left: number, right: number) => {
    const rootLeft = find(left);
    const rootRight = find(right);
    if (rootLeft !== rootRight) parent[rootRight] = rootLeft;
  };

  const endpointOwners = new Map<string, number[]>();
  segments.forEach((segment, index) => {
    for (const key of [endpointKey(segment.x1, segment.y1), endpointKey(segment.x2, segment.y2)]) {
      const owners = endpointOwners.get(key) ?? [];
      for (const owner of owners) union(index, owner);
      owners.push(index);
      endpointOwners.set(key, owners);
    }
  });

  const groups = new Map<number, Segment[]>();
  segments.forEach((segment, index) => {
    const root = find(index);
    const group = groups.get(root) ?? [];
    group.push(segment);
    groups.set(root, group);
  });

  return [...groups.values()]
    .map((group) => {
      const bounds = boundsFor(group);
      return Object.freeze({
        segments: Object.freeze(group),
        ...bounds,
        unit: inferUnit(group),
        cx: (bounds.minX + bounds.maxX) / 2,
        cy: (bounds.minY + bounds.maxY) / 2,
      });
    })
    .filter((component) => component.segments.length >= 3)
    .sort((left, right) => left.cx - right.cx || left.cy - right.cy);
}

function renderComponent(component: Component, x: number, y: number, width: number, height: number, unit: number): string {
  const factor = unit / component.unit;
  const scaledWidth = (component.maxX - component.minX) * factor;
  const scaledHeight = (component.maxY - component.minY) * factor;
  if (scaledWidth > width - 6 || scaledHeight > height - 6) {
    throw new Error(`FFM V4 common-scale component exceeds its slot (${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)} in ${width}x${height}).`);
  }
  const ox = x + (width - scaledWidth) / 2;
  const oy = y + (height - scaledHeight) / 2;
  return component.segments.map((segment) => {
    const x1 = ox + (segment.x1 - component.minX) * factor;
    const y1 = oy + (segment.y1 - component.minY) * factor;
    const x2 = ox + (segment.x2 - component.minX) * factor;
    const y2 = oy + (segment.y2 - component.minY) * factor;
    return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
  }).join("");
}

function svgShell(width: number, height: number, body: string, label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white"/><g stroke="#111827" stroke-width="${EXAM_STROKE}" stroke-linecap="round" stroke-linejoin="round" fill="none">${body}</g></svg>`;
}

function renderPieces(components: readonly Component[], labels: boolean, unit: number, width: number, height: number): string {
  const slot = width / components.length;
  let body = "";
  components.forEach((component, index) => {
    body += renderComponent(component, index * slot + 5, 8, slot - 10, height - (labels ? 35 : 16), unit);
    if (labels) body += `<text x="${(index * slot + slot / 2).toFixed(2)}" y="${height - 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#111827" stroke="none">${index + 1}</text>`;
  });
  return svgShell(width, height, body, "Figure formation pieces drawn to one common scale");
}

function renderSingle(component: Component, unit: number, width: number, height: number, label: string): string {
  return svgShell(width, height, renderComponent(component, 8, 8, width - 16, height - 16, unit), label);
}

function renderPair(components: readonly Component[], unit: number, width = 250, height = 130): string {
  if (components.length !== 2) throw new Error("FFM V4 pair renderer requires exactly two connected components.");
  const slot = width / 2;
  const body = components.map((component, index) => renderComponent(component, index * slot + 5, 8, slot - 10, height - 16, unit)).join("");
  return svgShell(width, height, body, "Two formation pieces drawn to the target scale");
}

function parsePair(svg: string): readonly [number, number] {
  const label = svg.match(/Pieces\s+(\d+)\s+and\s+(\d+)/i);
  if (!label) throw new Error("FFM V4 could not recover the numbered pair from the option SVG.");
  return [Number(label[1]), Number(label[2])] as const;
}

function renderPairNumberOption(pair: readonly [number, number]): string {
  const body = `<circle cx="55" cy="50" r="20" fill="white"/><circle cx="115" cy="50" r="20" fill="white"/><text x="55" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" fill="#111827" stroke="none">${pair[0]}</text><text x="115" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-size="19" fill="#111827" stroke="none">${pair[1]}</text><text x="85" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" fill="#111827" stroke="none">+</text>`;
  return svgShell(170, 100, body, `Pieces ${pair[0]} and ${pair[1]}`);
}

function rebuildQl052Stimulus(svg: string): { svg: string; target: Component; pool: readonly Component[] } {
  const components = extractComponents(svg);
  if (components.length !== 6) throw new Error(`FFM V4 expected target + five pool pieces for SPA-QL-052, got ${components.length}.`);
  const target = components[0]!;
  const pool = components.slice(1);
  const width = 820;
  const height = 170;
  const unit = 12;
  let body = renderComponent(target, 12, 16, 150, 130, unit);
  body += `<line x1="180" y1="14" x2="180" y2="156" stroke="#9ca3af" stroke-width="1"/>`;
  const slot = 124;
  pool.forEach((component, index) => {
    const x = 190 + index * slot;
    body += renderComponent(component, x + 4, 12, slot - 8, 118, unit);
    body += `<text x="${(x + slot / 2).toFixed(2)}" y="153" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#111827" stroke="none">${index + 1}</text>`;
  });
  return { svg: svgShell(width, height, body, "Target and five numbered pieces drawn to one common geometric scale"), target, pool: Object.freeze(pool) };
}

function localizedExplanation(base: any, qlId: FigureFormationPermanentQlIdV10, pair: readonly [number, number] | null) {
  if (base.language !== "en") return base.explanation;
  const placements = [...(base.solveFacts?.placements ?? [])].sort((left: any, right: any) => String(left.pieceId).localeCompare(String(right.pieceId)));
  const targetKind = String(base.solveFacts?.targetKind ?? "figure").toLowerCase();

  if (qlId === "SPA-QL-051") {
    const placementText = placements
      .map((placement: any, index: number) => `piece ${index + 1} in the ${String(placement.region).replaceAll("-", " ")} part`)
      .join(", ");
    return Object.freeze({
      observation: "First compare lengths at the printed scale. Do not stretch or shrink any piece; equal-length edges are the edges that can actually meet.",
      rule: "The pieces may be turned, but not mirrored. A joined edge disappears inside the final figure, while the unmatched edges become the outside boundary.",
      application: `Fit ${placementText}. With those placements, the touching edges are equal in length and the remaining outer boundary is exactly option ${base.answer}.`,
      check: `Option ${base.answer} is the only choice that can use every piece at the same scale without a gap, overlap, reflection or changed edge length.`,
      steps: Object.freeze([
        "Keep every piece at the same unit scale shown in the question.",
        "Start from the longest straight outer edge/corner and match it with an equal-length edge on another piece.",
        `Place the pieces in their matching regions; the completed outside boundary becomes option ${base.answer}.`,
        "Reject any option that would require stretching a side, leaving a gap, overlapping pieces or flipping a piece like a mirror image.",
      ]),
    });
  }

  const selected = pair ? `pieces ${pair[0]} and ${pair[1]}` : "the selected pieces";
  return Object.freeze({
    observation: `Compare ${selected} with the ${targetKind} using the same printed scale. Their edge lengths and total occupied area must agree with the target before joining is possible.`,
    rule: "Pieces may be turned but not mirrored or resized. The correct pair must have complementary joining edges and must reproduce the complete target boundary exactly.",
    application: `${selected[0]!.toUpperCase()}${selected.slice(1)} have matching join lengths; after turning and joining them, the internal meeting edge disappears and the remaining outline is the required ${targetKind}.`,
    check: `Therefore option ${base.answer} is uniquely correct. The other pairs contain at least one boundary/length mismatch and cannot make the target without distortion, a gap or an overlap.`,
    steps: Object.freeze([
      "Use the common scale to compare actual side lengths; ignore pairs that only look similar after visual resizing.",
      `Take ${selected} and turn them until their complementary equal-length edges face each other.`,
      `Join those edges; the outside boundary then matches the ${targetKind} exactly.`,
      "Check that no piece was mirrored and that no portion lies outside the target or leaves an uncovered part.",
    ]),
  });
}

function renderExplanationIllustration(input: Readonly<{ pieces: readonly Component[]; target: Component; unit: number; labels?: readonly number[] }>): string {
  const width = 600;
  const height = 175;
  const leftWidth = 340;
  const slot = leftWidth / input.pieces.length;
  let body = "";
  input.pieces.forEach((component, index) => {
    body += renderComponent(component, index * slot + 5, 16, slot - 10, 112, input.unit);
    body += `<text x="${(index * slot + slot / 2).toFixed(2)}" y="148" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#374151" stroke="none">Piece ${input.labels?.[index] ?? index + 1}</text>`;
  });
  body += `<text x="370" y="91" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#111827" stroke="none">→</text>`;
  body += renderComponent(input.target, 405, 18, 175, 125, input.unit);
  body += `<text x="492" y="158" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#374151" stroke="none">Required final outline</text>`;
  return svgShell(width, height, body, "Illustration showing the selected pieces at one scale and the required final outline");
}

export function generateFigureFormationReviewQuestionV4(input: Readonly<{
  qlId: FigureFormationPermanentQlIdV10;
  seed: string;
  language?: FigureFormationLanguageV1;
}>) {
  const base = generateFigureFormationReviewQuestionV3(input) as any;
  let stimulusSvgs: readonly string[];
  let optionSvgs: readonly string[];
  let illustration: string;
  let pair: readonly [number, number] | null = null;

  if (input.qlId === "SPA-QL-051") {
    const pieces = extractComponents(base.stimulusSvgs[0]);
    if (pieces.length < 2 || pieces.length > 3) throw new Error(`FFM V4 expected two or three source pieces for SPA-QL-051, got ${pieces.length}.`);
    const optionComponents = base.optionSvgs.map((svg: string) => extractComponents(svg));
    if (optionComponents.some((components: Component[]) => components.length !== 1)) throw new Error("FFM V4 expected one connected target outline per SPA-QL-051 option.");
    stimulusSvgs = Object.freeze([renderPieces(pieces, true, 16, pieces.length * 120, 135)]);
    optionSvgs = Object.freeze(optionComponents.map((components: Component[], index: number) => renderSingle(components[0]!, 16, 170, 125, `Option ${String.fromCharCode(65 + index)} at common scale`)));
    illustration = renderExplanationIllustration({ pieces, target: optionComponents[base.correctIndex]![0]!, unit: 14 });
  } else if (input.qlId === "SPA-QL-052") {
    const rebuilt = rebuildQl052Stimulus(base.stimulusSvgs[0]);
    pair = parsePair(base.optionSvgs[base.correctIndex]);
    stimulusSvgs = Object.freeze([rebuilt.svg]);
    optionSvgs = Object.freeze(base.optionSvgs.map((svg: string) => renderPairNumberOption(parsePair(svg))));
    const selected = [rebuilt.pool[pair[0] - 1]!, rebuilt.pool[pair[1] - 1]!];
    illustration = renderExplanationIllustration({ pieces: selected, target: rebuilt.target, unit: 12, labels: pair });
  } else {
    const target = extractComponents(base.stimulusSvgs[0]);
    if (target.length !== 1) throw new Error("FFM V4 expected one target component for SPA-QL-053.");
    const optionComponents = base.optionSvgs.map((svg: string) => extractComponents(svg));
    if (optionComponents.some((components: Component[]) => components.length !== 2)) throw new Error("FFM V4 expected two piece outlines in every SPA-QL-053 option.");
    stimulusSvgs = Object.freeze([renderSingle(target[0]!, 14, 250, 130, "Target figure at option scale")]);
    optionSvgs = Object.freeze(optionComponents.map((components: Component[]) => renderPair(components, 14, 250, 130)));
    pair = parsePair(base.optionSvgs[base.correctIndex]);
    illustration = renderExplanationIllustration({ pieces: optionComponents[base.correctIndex]!, target: target[0]!, unit: 12, labels: pair });
  }

  return Object.freeze({
    ...base,
    version: "SPA-FFM-001-REVIEW-QUESTION-V4" as const,
    stimulusSvgs,
    optionSvgs,
    explanation: localizedExplanation(base, input.qlId, pair),
    explanationIllustrationSvg: illustration,
    renderer: Object.freeze({
      ...base.renderer,
      reviewStrokeWidth: EXAM_STROKE,
      reviewBackground: "WHITE" as const,
      reviewGeometryScalePolicy: "COMMON_UNIT_PER_QUESTION_NO_INDEPENDENT_AUTOSCALE" as const,
      reviewIllustratedExplanation: true as const,
    }),
    review: Object.freeze({
      ...base.review,
      v3RejectedForGeometryScaleAndExplanation: true as const,
      geometryScaleApprovalRequired: true as const,
      explanationIllustrationApprovalRequired: true as const,
      learnerContentFrozen: false as const,
      downstreamActivationAllowed: false as const,
    }),
  });
}

export type FigureFormationReviewQuestionV4 = ReturnType<typeof generateFigureFormationReviewQuestionV4>;
