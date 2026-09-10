import { strict as assert } from "node:assert";

import { GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1 } from "./geo-riv-001-cp002-editorial-review-v1";
import { generateGeoRiv001Cp002ReviewV2 } from "./geo-riv-001-cp002-review-generator-v2";

const QLS = Array.from({ length: 9 }, (_, index) => `GEO-RIV-001-QL-${String(index + 10).padStart(3, "0")}`);
const SOURCE_RELATIONS = new Set(["originates_from", "source_region", "source_area"]);
const sourceFacts = GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1.filter((fact) => SOURCE_RELATIONS.has(fact.relation));

function valueText(fact: (typeof GEO_RIV_001_CP002_REVIEWABLE_FACTS_V1)[number]) {
  if (fact.value.kind === "entity_ref") return fact.value.label.en;
  if (fact.value.kind === "text") return fact.value.text.en;
  return "";
}

function sourcePairTruth(option: string) {
  const [river, value] = option.split(" — ");
  if (!river || !value) return false;
  return sourceFacts.some((fact) => fact.entity.label.en === river && valueText(fact) === value);
}

for (const qlId of QLS) {
  const generated = Array.from({ length: 40 }, (_, index) =>
    generateGeoRiv001Cp002ReviewV2(qlId, `cp002-v2-${qlId}-${index + 1}`),
  );
  for (const question of generated) {
    assert.equal(question.cpId, "GEO-RIV-001-CP002");
    assert.equal(question.qlId, qlId);
    assert.equal(question.questionId.includes("CP002-V2"), true, question.questionId);
    assert.equal(question.options.length, 4, question.questionId);
    assert.equal(new Set(question.options).size, 4, question.questionId);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer, question.questionId);
    assert.equal(question.sourceIds.length > 0, true, question.questionId);
    assert.equal(question.sourceFactIds.length > 0, true, question.questionId);
    assert.equal(question.explanation.length >= 30, true, question.questionId);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
  }
}

for (let index = 0; index < 80; index += 1) {
  const q = generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-010", `ql010-safe-${index}`);
  const targetFact = sourceFacts.find((fact) => fact.factId === q.sourceFactIds[0]);
  assert.ok(targetFact);
  const trueValues = new Set(
    sourceFacts
      .filter((fact) => fact.entityId === targetFact.entityId)
      .map(valueText),
  );
  assert.equal(q.options.filter((option) => trueValues.has(option)).length, 1, q.questionId);
}

for (const qlId of ["GEO-RIV-001-QL-014", "GEO-RIV-001-QL-015"]) {
  for (let index = 0; index < 80; index += 1) {
    const q = generateGeoRiv001Cp002ReviewV2(qlId, `${qlId}-pair-${index}`);
    const trueCount = q.options.filter(sourcePairTruth).length;
    assert.equal(trueCount, qlId.endsWith("014") ? 1 : 3, q.questionId);
  }
}

const ql016Answers = new Set(
  Array.from({ length: 120 }, (_, index) =>
    generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-016", `ql016-mode-${index}`).canonicalAnswer,
  ),
);
assert.equal(ql016Answers.size, 4);

const ql017Answers = new Set(
  Array.from({ length: 180 }, (_, index) =>
    generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-017", `ql017-pattern-${index}`).canonicalAnswer,
  ),
);
assert.equal(ql017Answers.size, 4);

const ql018Answers = new Set(
  Array.from({ length: 220 }, (_, index) =>
    generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-018", `ql018-pattern-${index}`).canonicalAnswer,
  ),
);
assert.deepEqual(ql018Answers, new Set(["None", "One", "Two", "Three"]));

const replayA = generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-016", "cp002-replay-seed");
const replayB = generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-016", "cp002-replay-seed");
assert.deepEqual(replayA, replayB);

assert.throws(
  () => generateGeoRiv001Cp002ReviewV2("GEO-RIV-001-QL-999", "unknown"),
  /Unknown GEO-RIV-001 CP002 QL/i,
);
