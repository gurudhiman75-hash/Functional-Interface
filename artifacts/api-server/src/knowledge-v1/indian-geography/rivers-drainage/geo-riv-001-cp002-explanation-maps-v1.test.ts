import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CP002_EXPLANATION_MAP_PATTERN_EXAMPLES_V1,
  auditGeoRiv001Cp002ExplanationMapV1,
  buildGeoRiv001Cp002ExplanationMapV1,
} from "./geo-riv-001-cp002-explanation-maps-v1";
import { GEO_RIV_001_CP002_REVIEW_BATCH_V1 } from "./geo-riv-001-cp002-review-batch-v1";

const examples = GEO_RIV_001_CP002_EXPLANATION_MAP_PATTERN_EXAMPLES_V1;
assert.equal(examples.source.spec.kind, "SOURCE");
assert.equal(examples.tributary.spec.kind, "TRIBUTARY");
assert.equal(examples.confluence.spec.kind, "CONFLUENCE");
assert.equal(examples.course.spec.kind, "COURSE");
assert.equal(examples.systemChain.spec.kind, "SYSTEM_CHAIN");

for (const render of Object.values(examples)) {
  assert.equal(render.spec.geometryMode, "SCHEMATIC");
  assert.equal(render.spec.notToScale, true);
  assert.match(render.svg, /<svg/);
  assert.match(render.svg, /Schematic · not to scale/);
  assert.ok(render.altText.length > 20);
}

let mapped = 0;
const kinds = new Set<string>();
for (const question of GEO_RIV_001_CP002_REVIEW_BATCH_V1) {
  const audit = auditGeoRiv001Cp002ExplanationMapV1(question);
  assert.equal(audit.valid, true, `${question.questionId}: ${audit.issues.join(", ")}`);
  const map = buildGeoRiv001Cp002ExplanationMapV1(question);
  assert.equal(Boolean(question.explanationMap), Boolean(map));
  if (question.explanationMap) {
    mapped += 1;
    kinds.add(question.explanationMap.spec.kind);
    assert.equal(question.explanationMap.spec.nodes.length <= 6, true);
    assert.equal(question.explanationMap.spec.sourceFactIds.length > 0, true);
  }
}

assert.ok(mapped >= 30, `Expected at least 30 mapped review questions, found ${mapped}`);
for (const kind of ["SOURCE", "TRIBUTARY", "CONFLUENCE", "SYSTEM_CHAIN"]) {
  assert.ok(kinds.has(kind), `Review batch is missing map kind ${kind}`);
}
