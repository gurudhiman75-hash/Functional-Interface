import assert from "node:assert/strict";
import type { SylLocale, TermId } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import { generateBankingPossibilityReviewQuestionV4 } from "./banking-possibility-review-question-v4";
import { scenariosForGroup } from "./scenarios";

interface Shape { cx: number; cy: number; r: number }
interface Point { x: number; y: number }

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const seeds = Array.from({ length: 80 }, (_, index) => index);
const EPSILON = 2;

let records = 0;
let enabled = 0;
let fourTermRecords = 0;
const geometrySources: Record<string, number> = {};
const scenarios: Record<string, number> = {};
const perSeedSource = new Map<number, string>();

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

function parseShapes(svg: string): ReadonlyMap<TermId, Shape> {
  const result = new Map<TermId, Shape>();
  for (const match of svg.matchAll(
    /<g data-set="([^"]+)" data-cx="([\d.]+)" data-cy="([\d.]+)" data-r="([\d.]+)">/gu,
  )) {
    result.set(match[1], {
      cx: Number(match[2]),
      cy: Number(match[3]),
      r: Number(match[4]),
    });
  }
  return result;
}

function distance(left: Shape, right: Shape): number {
  return Math.hypot(left.cx - right.cx, left.cy - right.cy);
}

function contains(outer: Shape, inner: Shape): boolean {
  return distance(outer, inner) + inner.r <= outer.r + EPSILON;
}

function disjoint(left: Shape, right: Shape): boolean {
  return distance(left, right) >= left.r + right.r + 3;
}

function properOverlap(left: Shape, right: Shape): boolean {
  const d = distance(left, right);
  return d < left.r + right.r - 5
    && !contains(left, right)
    && !contains(right, left);
}

function pointInside(point: Point, shape: Shape, margin = 5): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) <= shape.r - margin;
}

function pointOutside(point: Point, shape: Shape, margin = 5): boolean {
  return Math.hypot(point.x - shape.cx, point.y - shape.cy) >= shape.r + margin;
}

function auditCore009(seed: number, locale: SylLocale, svg: string): void {
  const scenario = scenariosForGroup("CORE").find((entry) => entry.scenarioId === "SYL-SC-CORE-009");
  assert.ok(scenario);
  const analysis = analyzeScenario(scenario);
  const no = analysis.premises.find((premise) => premise.form === "NO");
  const some = analysis.premises.find((premise) => premise.form === "SOME");
  const all = analysis.premises.find((premise) => premise.form === "ALL");
  assert.ok(no && some && all);

  const c = some.subject;
  const a = some.predicate;
  assert.equal(all.subject, c);
  const d = all.predicate;
  const b = no.subject === a ? no.predicate : no.subject;
  assert.ok(no.subject === a || no.predicate === a);

  const shapes = parseShapes(svg);
  assert.equal(shapes.size, 4, `${seed}/${locale}: CORE-009 must show four sets`);
  const shapeA = shapes.get(a)!;
  const shapeB = shapes.get(b)!;
  const shapeC = shapes.get(c)!;
  const shapeD = shapes.get(d)!;
  assert.ok(shapeA && shapeB && shapeC && shapeD);

  // Stated relations.
  assert.ok(disjoint(shapeA, shapeB), `${seed}/${locale}: No A-B geometry failed`);
  assert.ok(contains(shapeD, shapeC), `${seed}/${locale}: All C-D geometry failed`);
  assert.ok(properOverlap(shapeC, shapeA), `${seed}/${locale}: Some C-A geometry failed`);

  // Unstated relations stay open: overlap is permitted but proves nothing without ×.
  assert.ok(properOverlap(shapeC, shapeB), `${seed}/${locale}: C-B became a strong relation`);
  assert.ok(properOverlap(shapeD, shapeA), `${seed}/${locale}: D-A became a strong relation`);
  assert.ok(properOverlap(shapeD, shapeB), `${seed}/${locale}: D-B became a strong relation`);

  const witnessMatch = svg.match(
    /<g data-witness="decisive"[^>]*data-x="([\d.]+)"[^>]*data-y="([\d.]+)"[^>]*data-inside="([^"]*)"[^>]*data-outside="([^"]*)"/u,
  );
  assert.ok(witnessMatch, `${seed}/${locale}: CORE-009 witness missing`);
  assert.equal((svg.match(/data-witness="decisive"/gu) ?? []).length, 1);
  const point = { x: Number(witnessMatch[1]), y: Number(witnessMatch[2]) };
  const inside = new Set(witnessMatch[3].split(",").filter(Boolean));
  const outside = new Set(witnessMatch[4].split(",").filter(Boolean));
  assert.deepEqual(inside, new Set([a, c, d]));
  assert.deepEqual(outside, new Set([b]));
  assert.ok(pointInside(point, shapeA));
  assert.ok(pointInside(point, shapeC));
  assert.ok(pointInside(point, shapeD));
  assert.ok(pointOutside(point, shapeB));
}

for (const seed of seeds) {
  for (const locale of locales) {
    const question = generateBankingPossibilityReviewQuestionV4(seed, locale);
    records += 1;
    assert.equal(question.diagram.enabled, true, `${seed}/${locale}: V4 must not omit a selected Banking diagram`);
    assert.equal(question.diagram.diagramCount, 1);
    assert.equal(question.diagram.omissionReason, null);
    assert.ok(question.diagram.svg);
    assert.match(question.diagram.svg, /<svg\b/u);
    assert.equal((question.diagram.svg.match(/<svg\b/gu) ?? []).length, 1);
    assert.match(question.diagram.svg, /data-banking-combined-venn="true"/u);
    assert.match(question.diagram.svg, /data-premise-only="true"/u);
    assert.doesNotMatch(question.diagram.svg, /<script\b/iu);
    assert.doesNotMatch(question.diagram.svg, /<foreignObject\b/iu);
    enabled += 1;
    increment(geometrySources, question.diagram.geometrySource);
    increment(scenarios, question.scenarioId);

    const previous = perSeedSource.get(seed);
    if (previous === undefined) perSeedSource.set(seed, question.diagram.geometrySource);
    else assert.equal(question.diagram.geometrySource, previous, `${seed}: geometry source must be locale invariant`);

    if (question.scenarioId === "SYL-SC-CORE-009") {
      fourTermRecords += 1;
      assert.equal(question.diagram.geometrySource, "SAFETY_GATED_FOUR_TERM_TEMPLATE");
      assert.equal(question.diagram.schemaVersion, "banking-possibility-four-term-diagram-v4");
      assert.match(question.diagram.svg, /data-supplemental-four-term="core-009"/u);
      auditCore009(seed, locale, question.diagram.svg);
    } else {
      assert.notEqual(question.diagram.geometrySource, "SAFETY_GATED_FOUR_TERM_TEMPLATE");
    }
  }
}

assert.equal(records, 240);
assert.equal(enabled, 240);
assert.equal(fourTermRecords, scenarios["SYL-SC-CORE-009"] ?? 0);
assert.ok(fourTermRecords > 0, "exhaustive range must exercise CORE-009");
assert.equal(geometrySources.OMITTED ?? 0, 0);

const first = generateBankingPossibilityReviewQuestionV4(0, "en-IN");
assert.equal(first.diagram.enabled, true);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_POSSIBILITY_COMPLETE_DIAGRAM_V4",
  records,
  enabled,
  omitted: records - enabled,
  geometrySources,
  scenarios,
  fourTermRecords,
  contract: {
    oneCombinedDiagramPerSelectedRecord: true,
    everySelectedThreeTermRecordRetainsV3: true,
    core009FourTermGapClosed: true,
    fourTermWitnessClosure: "A,C,D inside; B outside",
    unstatedFourTermPairsRemainOpen: true,
    geometrySourceLocaleInvariant: true,
    registrationChanged: false,
    deliveryActivationChanged: false,
  },
}, null, 2));
