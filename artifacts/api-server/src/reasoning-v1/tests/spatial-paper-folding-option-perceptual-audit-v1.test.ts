import assert from "node:assert/strict";
import { generatePfcTpfFinalCombinedEnglishReviewV1_1 } from "../foundation/spatial/paper-folding-final-combined-english-review-v1-1";

const questions = generatePfcTpfFinalCombinedEnglishReviewV1_1();
const GRID = 84;
const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const MIN_COARSE_PATTERN_DISTANCE = 0.34;

type MarkKind = "CIRCLE" | "POLYGON" | "LINE";
interface Mark { kind: MarkKind; points: Array<[number, number]>; radius?: number }

function num(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}

function viewBox(svg: string): [number, number, number, number] | null {
  const values = svg.match(/\bviewBox="([^"]+)"/i)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  return values.length === 4 ? [values[0], values[1], values[2], values[3]] : null;
}

function svgCount(markup: string): number {
  return (markup.match(/<svg\b/g) ?? []).length;
}

function polygonPoints(tag: string): Array<[number, number]> {
  const values = tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
  const points: Array<[number, number]> = [];
  for (let index = 0; index + 1 < values.length; index += 2) points.push([values[index], values[index + 1]]);
  return points;
}

function span(points: readonly [number, number][]): number {
  if (!points.length) return 0;
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
}

function marks(svg: string): Mark[] {
  const found: Mark[] = [];
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    const cx = num(tag, "cx"), cy = num(tag, "cy"), r = num(tag, "r");
    if (cx === null || cy === null || r === null || r > 9.5) continue;
    found.push({ kind: "CIRCLE", points: [[cx, cy]], radius: r });
  }
  for (const tag of svg.match(/<polygon\b[^>]*\/?\s*>/g) ?? []) {
    const points = polygonPoints(tag);
    if (points.length < 3) continue;
    const s = span(points);
    if (s <= 0 || s > 22) continue;
    found.push({ kind: "POLYGON", points });
  }
  for (const tag of svg.match(/<line\b[^>]*\/?\s*>/g) ?? []) {
    const x1 = num(tag, "x1"), y1 = num(tag, "y1"), x2 = num(tag, "x2"), y2 = num(tag, "y2");
    if ([x1, y1, x2, y2].some((value) => value === null)) continue;
    const length = Math.hypot(x2! - x1!, y2! - y1!);
    if (length <= 0 || length > 22) continue;
    found.push({ kind: "LINE", points: [[x1!, y1!], [x2!, y2!]] });
  }
  return found;
}

function signature(found: readonly Mark[]): string {
  const counts = new Map<MarkKind, number>();
  for (const mark of found) counts.set(mark.kind, (counts.get(mark.kind) ?? 0) + 1);
  return (["CIRCLE", "POLYGON", "LINE"] as MarkKind[]).map((kind) => `${kind}:${counts.get(kind) ?? 0}`).join("|");
}

function paintDisc(mask: Set<number>, gx: number, gy: number, radius: number): void {
  const r = Math.max(2.4, radius);
  const minX = Math.floor(gx - r), maxX = Math.ceil(gx + r);
  const minY = Math.floor(gy - r), maxY = Math.ceil(gy + r);
  for (let x = minX; x <= maxX; x += 1) {
    for (let y = minY; y <= maxY; y += 1) {
      if (x < 0 || x >= GRID || y < 0 || y >= GRID) continue;
      if (Math.hypot(x - gx, y - gy) <= r) mask.add(y * GRID + x);
    }
  }
}

function paintSegment(mask: Set<number>, a: [number, number], b: [number, number], vb: [number, number, number, number]): void {
  const [vx, vy, vw, vh] = vb;
  const map = ([x, y]: [number, number]): [number, number] => [
    (x - vx) * (GRID - 1) / vw,
    (y - vy) * (GRID - 1) / vh,
  ];
  const aa = map(a), bb = map(b);
  const steps = Math.max(8, Math.ceil(Math.hypot(bb[0] - aa[0], bb[1] - aa[1]) * 2));
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    paintDisc(mask, aa[0] + (bb[0] - aa[0]) * t, aa[1] + (bb[1] - aa[1]) * t, 2.7);
  }
}

function coarseMask(svg: string, found: readonly Mark[]): Set<number> {
  const vb = viewBox(svg);
  if (!vb) return new Set<number>();
  const [vx, vy, vw, vh] = vb;
  const map = ([x, y]: [number, number]): [number, number] => [
    (x - vx) * (GRID - 1) / vw,
    (y - vy) * (GRID - 1) / vh,
  ];
  const scale = (GRID - 1) / Math.max(vw, vh);
  const mask = new Set<number>();
  for (const mark of found) {
    if (mark.kind === "CIRCLE") {
      const [gx, gy] = map(mark.points[0]);
      paintDisc(mask, gx, gy, Math.max(2.8, (mark.radius ?? 2) * scale + 2.2));
    } else if (mark.kind === "LINE") {
      paintSegment(mask, mark.points[0], mark.points[1], vb);
    } else {
      for (let index = 0; index < mark.points.length; index += 1) {
        paintSegment(mask, mark.points[index], mark.points[(index + 1) % mark.points.length], vb);
      }
    }
  }
  return mask;
}

function jaccardDistance(a: Set<number>, b: Set<number>): number {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 1;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return 1 - intersection / union.size;
}

const offenders: Array<{ question: string; pair: string; signature: string; distance: number }> = [];
let auditedPairs = 0;
let minimumDistance = 1;

for (const question of questions) {
  if (question.chapterCode !== "PFC-001") continue;
  if (question.options.some((option) => svgCount(option.svg) !== 1)) continue;
  const parsed = question.options.map((option) => {
    const found = marks(option.svg);
    return { option, found, signature: signature(found), mask: coarseMask(option.svg, found) };
  });
  if (parsed.some((item) => item.found.length === 0 || item.mask.size === 0)) continue;

  for (let left = 0; left < parsed.length; left += 1) {
    for (let right = left + 1; right < parsed.length; right += 1) {
      if (parsed[left].signature !== parsed[right].signature) continue;
      auditedPairs += 1;
      const distance = jaccardDistance(parsed[left].mask, parsed[right].mask);
      minimumDistance = Math.min(minimumDistance, distance);
      if (distance + 1e-9 < MIN_COARSE_PATTERN_DISTANCE) {
        offenders.push({
          question: question.reviewId,
          pair: `${parsed[left].option.optionId}/${parsed[right].option.optionId}`,
          signature: parsed[left].signature,
          distance,
        });
      }
    }
  }
}

console.log(JSON.stringify({
  audit: "PFC_STUDENT_PERCEPTION_OPTION_SIMILARITY_V1",
  reviewQuestionCount: questions.length,
  auditedSameStructurePairs: auditedPairs,
  minimumCoarsePatternDistance: minimumDistance,
  requiredMinimum: MIN_COARSE_PATTERN_DISTANCE,
  offenderCount: offenders.length,
  offenders,
}, null, 2));

assert.equal(
  offenders.length,
  0,
  `Student-perception audit found ${offenders.length} option pair(s) that differ mainly by slight spacing/placement: ${offenders.map((item) => `${item.question} ${item.pair}=${item.distance.toFixed(3)}`).join(", ")}`,
);
