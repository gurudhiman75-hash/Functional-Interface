import { generateFigureFormationReviewQuestionV3 } from "./figure-formation-review-runtime-v3";
import { generateFigureFormationReviewQuestionV4 } from "./figure-formation-review-runtime-v4";
import type { FigureFormationLanguageV1 } from "./figure-formation-question-studio-v1";
import type { FigureFormationPermanentQlIdV10 } from "./spatial-permanent-ql-allocation-v10";

type Segment = Readonly<{ x1: number; y1: number; x2: number; y2: number }>;
type Component = Readonly<{ segments: readonly Segment[]; minX: number; minY: number; maxX: number; maxY: number; unit: number; cx: number }>;

function attr(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`${name}="([\\d.-]+)"`, "i"));
  return match ? Number(match[1]) : null;
}
function key(x: number, y: number): string { return `${x.toFixed(2)},${y.toFixed(2)}`; }
function components(svg: string): Component[] {
  const lines: Segment[] = [];
  for (const tag of svg.match(/<line\b[^>]*>/gi) ?? []) {
    if (/stroke="#9ca3af"/i.test(tag)) continue;
    const x1 = attr(tag, "x1"), y1 = attr(tag, "y1"), x2 = attr(tag, "x2"), y2 = attr(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    lines.push({ x1: x1!, y1: y1!, x2: x2!, y2: y2! });
  }
  const parent = lines.map((_, index) => index);
  const find = (index: number): number => parent[index] === index ? index : (parent[index] = find(parent[index]!));
  const union = (a: number, b: number) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[rb] = ra; };
  const owners = new Map<string, number[]>();
  lines.forEach((line, index) => {
    for (const endpoint of [key(line.x1, line.y1), key(line.x2, line.y2)]) {
      const list = owners.get(endpoint) ?? [];
      list.forEach((owner) => union(index, owner));
      list.push(index);
      owners.set(endpoint, list);
    }
  });
  const grouped = new Map<number, Segment[]>();
  lines.forEach((line, index) => { const root = find(index); grouped.set(root, [...(grouped.get(root) ?? []), line]); });
  return [...grouped.values()].filter((group) => group.length >= 3).map((group) => {
    const xs = group.flatMap((line) => [line.x1, line.x2]);
    const ys = group.flatMap((line) => [line.y1, line.y2]);
    const lengths = group.map((line) => Math.hypot(line.x2 - line.x1, line.y2 - line.y1)).filter((length) => length > 0.5).sort((a, b) => a - b);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    return { segments: group, minX, minY, maxX, maxY, unit: lengths[0]!, cx: (minX + maxX) / 2 };
  }).sort((a, b) => a.cx - b.cx);
}
function draw(component: Component, x: number, y: number, width: number, height: number, unit: number): string {
  const factor = unit / component.unit;
  const shapeWidth = (component.maxX - component.minX) * factor;
  const shapeHeight = (component.maxY - component.minY) * factor;
  if (shapeWidth > width - 6 || shapeHeight > height - 6) throw new Error("FFM V4 inverse component exceeds common-scale slot.");
  const ox = x + (width - shapeWidth) / 2;
  const oy = y + (height - shapeHeight) / 2;
  return component.segments.map((line) => `<line x1="${(ox + (line.x1 - component.minX) * factor).toFixed(2)}" y1="${(oy + (line.y1 - component.minY) * factor).toFixed(2)}" x2="${(ox + (line.x2 - component.minX) * factor).toFixed(2)}" y2="${(oy + (line.y2 - component.minY) * factor).toFixed(2)}"/>`).join("");
}
function shell(width: number, height: number, body: string, label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${label}"><rect width="${width}" height="${height}" fill="white"/><g stroke="#111827" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" fill="none">${body}</g></svg>`;
}
function single(component: Component): string { return shell(250, 130, draw(component, 8, 8, 234, 114, 14), "Target figure at the same geometric scale as the options"); }
function pair(parts: readonly Component[]): string {
  if (parts.length !== 2) throw new Error(`FFM V4 inverse option expected two pieces, got ${parts.length}.`);
  return shell(250, 130, draw(parts[0]!, 5, 8, 115, 114, 14) + draw(parts[1]!, 130, 8, 115, 114, 14), "Two option pieces at the target scale");
}
function illustration(parts: readonly Component[], target: Component): string {
  let body = draw(parts[0]!, 12, 18, 125, 105, 12) + draw(parts[1]!, 150, 18, 125, 105, 12);
  body += `<text x="310" y="82" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#111827" stroke="none">→</text>`;
  body += draw(target, 355, 16, 190, 112, 12);
  body += `<text x="144" y="151" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#374151" stroke="none">Pieces in the correct option</text>`;
  body += `<text x="450" y="151" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#374151" stroke="none">Required final outline</text>`;
  return shell(565, 170, body, "Illustrated explanation from the two selected pieces to the final target");
}

export function generateFigureFormationReviewQuestionV4Final(input: Readonly<{ qlId: FigureFormationPermanentQlIdV10; seed: string; language?: FigureFormationLanguageV1 }>) {
  if (input.qlId !== "SPA-QL-053") return generateFigureFormationReviewQuestionV4(input);
  const base = generateFigureFormationReviewQuestionV3(input) as any;
  const target = components(base.stimulusSvgs[0]);
  if (target.length !== 1) throw new Error("FFM V4 inverse review expected exactly one target outline.");
  const options = base.optionSvgs.map((svg: string) => components(svg));
  if (options.some((parts: Component[]) => parts.length !== 2)) throw new Error("FFM V4 inverse review expected exactly two shapes in every answer option.");
  const correctParts = options[base.correctIndex]!;
  const targetKind = String(base.solveFacts?.targetKind ?? "target").toLowerCase();
  const explanation = base.language === "en" ? Object.freeze({
    observation: `Keep the printed scale fixed. Compare the two pieces in each option with the ${targetKind}; a visually similar pair is not valid if its edge lengths would have to be stretched or shrunk.`,
    rule: "The two pieces may be turned, but not mirrored or resized. Their joining edges must be equal in length, and the unmatched edges must reproduce the complete target boundary.",
    application: `In option ${base.answer}, the two shapes have complementary equal-length joining edges. Turning them and bringing those edges together produces the required ${targetKind} outline shown in the illustration.`,
    check: `Only option ${base.answer} works at the same scale with no gap, overlap, reflection or changed side length; the other options fail at least one edge-length/boundary match.`,
    steps: Object.freeze([
      "Compare actual side lengths first; do not mentally resize the pieces.",
      `Take the two pieces in option ${base.answer} and turn them until their equal-length complementary edges face each other.`,
      `Join those edges; the remaining outside boundary becomes the required ${targetKind}.`,
      "Reject any option that needs stretching, mirroring, overlap or an uncovered part of the target.",
    ]),
  }) : base.explanation;
  return Object.freeze({
    ...base,
    version: "SPA-FFM-001-REVIEW-QUESTION-V4" as const,
    stimulusSvgs: Object.freeze([single(target[0]!)]),
    optionSvgs: Object.freeze(options.map((parts: Component[]) => pair(parts))),
    explanation,
    explanationIllustrationSvg: illustration(correctParts, target[0]!),
    renderer: Object.freeze({
      ...base.renderer,
      reviewStrokeWidth: 1.35 as const,
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

export type FigureFormationReviewQuestionV4Final = ReturnType<typeof generateFigureFormationReviewQuestionV4Final>;
