import assert from "node:assert/strict";
import {
  generateVen001ShapeRegionBatch,
  isVen001ShapeRegionRequest,
  VEN_001_SHAPE_REGION_CP_ID,
} from "./ven-001-shape-regions.ts";
import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";

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
  const pointMatches = [
    ...svg.matchAll(/<text x="(\d+)" y="(\d+)" data-mask="(\d+)">/g),
  ];
  assert.equal(pointMatches.length, 8);
  for (const [, xText, yText, maskText] of pointMatches) {
    const x = Number(xText),
      y = Number(yText),
      mask = Number(maskText);
    const inCircle = (x - 397) ** 2 + (y - 237) ** 2 < 175 ** 2;
    const inRectangle = x > 76 && x < 575 && y > 200 && y < 374;
    const [a, b, c] = [
      [304, 95],
      [64, 433],
      [538, 463],
    ] as const;
    const cross = (p: readonly number[], q: readonly number[]) =>
      (x - q[0]!) * (p[1]! - q[1]!) - (p[0]! - q[0]!) * (y - q[1]!);
    const edges = [cross(a, b), cross(b, c), cross(c, a)];
    const inTriangle = edges.every((v) => v >= 0) || edges.every((v) => v <= 0);
    assert.equal(
      Number(inCircle) + 2 * Number(inRectangle) + 4 * Number(inTriangle),
      mask,
      `number label for region ${mask} must lie inside exactly its named shapes`,
    );
    const point = [x, y] as const;
    const segmentDistance = (
      p: readonly number[],
      start: readonly number[],
      end: readonly number[],
    ) => {
      const dx = end[0]! - start[0]!,
        dy = end[1]! - start[1]!;
      const t = Math.max(
        0,
        Math.min(
          1,
          ((p[0]! - start[0]!) * dx + (p[1]! - start[1]!) * dy) /
            (dx * dx + dy * dy),
        ),
      );
      return Math.hypot(
        p[0]! - (start[0]! + t * dx),
        p[1]! - (start[1]! + t * dy),
      );
    };
    const triangleClearance = Math.min(
      segmentDistance(point, a, b),
      segmentDistance(point, b, c),
      segmentDistance(point, c, a),
    );
    const rectangleClearance = inRectangle
      ? Math.min(x - 76, 575 - x, y - 200, 374 - y)
      : Math.hypot(Math.max(76 - x, 0, x - 575), Math.max(200 - y, 0, y - 374));
    const circleClearance = Math.abs(Math.hypot(x - 397, y - 237) - 175);
    assert.ok(
      Math.min(triangleClearance, rectangleClearance, circleClearance) >= 32,
      `region ${mask} number label must stay at least 32 px from shape boundaries`,
    );
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
