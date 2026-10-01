import assert from "node:assert/strict";
import {
  generateVen001ShapeRegionBatch,
  isVen001ShapeRegionRequest,
  VEN_001_SHAPE_REGION_CP_ID,
} from "./ven-001-shape-regions.ts";
import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";
import {
  LAYOUTS,
  maskAt,
  pointClearance,
  pointsFor,
} from "./ven-001-shape-regions.ts";

const request = {
  packageId: "VEN-001",
  patternId: VEN_001_SHAPE_REGION_CP_ID,
  count: 50,
  language: "en" as const,
  seed: "shape-region-coverage",
};
assert.equal(isVen001ShapeRegionRequest(request), true);
const result = generateVen001ShapeRegionBatch(request);
assert.equal(result.questions.length, 50);
assert.equal(
  (result.questions[0]!.semanticMetadata as any).shapeLayoutId,
  "CIRCLE_RECTANGLE_TRIANGLE",
);
assert.match(result.questions[0]!.stimulusSvgs![0]!, /A — circle =/);
assert.match(result.questions[0]!.stimulusSvgs![0]!, /B — rectangle =/);
assert.match(result.questions[0]!.stimulusSvgs![0]!, /C — triangle =/);
assert.deepEqual(
  result.questions.map((q) => q.questionId),
  generateVen001ShapeRegionBatch(request).questions.map((q) => q.questionId),
);
assert.ok(
  new Set(result.questions.map((q) => (q.semanticMetadata as any).scenarioId))
    .size >= 6,
);
assert.ok(
  new Set(result.questions.map((q) => (q.semanticMetadata as any).queryKey))
    .size >= 8,
);
assert.ok(
  new Set(
    result.questions.map((q) => (q.semanticMetadata as any).shapeLayoutId),
  ).size >= 5,
);
assert.ok(
  LAYOUTS.some((layout) => layout.shapes.includes("right-triangle" as any)),
);
assert.ok(LAYOUTS.some((layout) => layout.shapes.includes("trapezoid" as any)));
assert.ok(LAYOUTS.some((layout) => layout.shapes.includes("pentagon" as any)));
const rightTriangleQuestion = generateVen001ShapeRegionBatch({
  ...request,
  count: LAYOUTS.length,
}).questions.find((q) =>
  String((q.semanticMetadata as any).shapeLayoutId).includes("RIGHT_TRIANGLE"),
)!;
assert.match(rightTriangleQuestion.stimulusSvgs![0]!, /right-angled triangle/);
assert.match(
  rightTriangleQuestion.stimulusSvgs![0]!,
  /M 60 40 L 60 70 L 30 70/,
);
for (const layout of LAYOUTS) {
  const points = pointsFor(layout);
  assert.equal(points.length, 8);
  points.forEach(([x, y], mask) => {
    assert.equal(maskAt(layout, x, y), mask);
    assert.ok(pointClearance(layout, x, y) >= 20);
  });
}
for (const q of result.questions) {
  const meta = q.semanticMetadata as any;
  const vals = meta.exclusiveRegions as number[];
  const masks = meta.selectedMasks as number[];
  const expected = masks.reduce((sum, m) => sum + vals[m], 0);
  assert.equal(q.canonicalAnswer, String(expected));
  assert.equal(new Set(q.options).size, 4);
  assert.equal((q.validation as any).exactlyOneCorrect, true);
  assert.equal(q.reviewOnly, true);
  assert.equal(q.questionBankWritable, false);
  assert.equal(q.testEligible, false);
  assert.equal(q.stimulusSvgs?.length, 1);
  for (const mask of Array.from({ length: 8 }, (_, i) => i))
    assert.match(q.stimulusSvgs![0]!, new RegExp(`data-mask="${mask}"`));
  const svg = q.stimulusSvgs![0]!;
  assert.match(svg, new RegExp(`data-layout="${meta.shapeLayoutId}"`));
  const layout = LAYOUTS.find((item) => item.id === meta.shapeLayoutId)!;
  const points = pointsFor(layout);
  assert.equal(points.length, 8);
  for (let mask = 0; mask < 8; mask++) {
    assert.equal(maskAt(layout, points[mask]![0], points[mask]![1]), mask);
    assert.ok(pointClearance(layout, points[mask]![0], points[mask]![1]) >= 20);
    assert.match(svg, new RegExp(`data-mask="${mask}"`));
  }
  const selected = masks.map((m) => String(vals[m])).join(" + ");
  assert.ok(q.explanation!.includes(selected));
}
for (const language of ["en", "hi", "pa"] as const) {
  const localized = await reasoningV1QuestionStudioAdapter.generate({
    packageId: "VEN-001",
    patternId: VEN_001_SHAPE_REGION_CP_ID,
    count: 12,
    language,
    seed: "ven-cp011-adapter",
  });
  assert.equal(localized.questions.length, 12);
  assert.ok(
    localized.questions.every(
      (q) =>
        q.questionOperation === "GEOMETRIC_REGION_COUNT" &&
        q.reviewOnly === true,
    ),
  );
}
const packageItem = reasoningV1QuestionStudioAdapter
  .listPackages()
  .find((p) => p.packageId === "VEN-001")!;
assert.ok(packageItem.cpIds.includes(VEN_001_SHAPE_REGION_CP_ID));
console.log("VEN-CP011 shape-region tests passed");
