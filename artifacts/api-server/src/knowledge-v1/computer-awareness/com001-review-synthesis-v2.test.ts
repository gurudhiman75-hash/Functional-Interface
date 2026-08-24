import { strict as assert } from "node:assert";

import {
  COM001_EDITORIALLY_BLOCKED_SOURCE_IDS,
  COM001_EDITORIAL_FACT_DECISIONS,
} from "./com001-editorial-review";
import { COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2 } from "./com001-human-review-pyq-evidence-v2";
import {
  generateCom001ReviewBatchV2,
  generateCom001ReviewQuestionV2,
  listCom001ReviewV2QlIds,
} from "./com001-review-synthesis-v2";

const blockedSources = new Set<string>(COM001_EDITORIALLY_BLOCKED_SOURCE_IDS);
const nonApprovedFactIds = new Set(
  COM001_EDITORIAL_FACT_DECISIONS
    .filter((entry) => entry.disposition !== "APPROVE")
    .map((entry) => entry.factId),
);
const pyqEvidenceIds = new Set(COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2.map((entry) => entry.evidenceId));

const forbiddenLearnerLanguage = [
  /canonical fact/i,
  /canonical relation/i,
  /distractor/i,
  /this QL/i,
  /reviewed device profile/i,
  /solver authority/i,
  /sourceFact/i,
  /stored separately/i,
  /not being conflated/i,
  /generator/i,
];

let audited = 0;
for (const qlId of listCom001ReviewV2QlIds()) {
  const batch = generateCom001ReviewBatchV2(qlId, 40, `v2-audit:${qlId}`);
  const stems = new Set<string>();
  const answers = new Set<string>();
  const positions = new Set<number>();

  for (let index = 0; index < batch.length; index += 1) {
    const question = batch[index]!;
    audited += 1;
    stems.add(question.stem);
    answers.add(question.canonicalAnswer);
    positions.add(question.correctIndex);

    const replay = generateCom001ReviewQuestionV2({
      qlId,
      seed: `v2-audit:${qlId}:${index}`,
    });
    assert.deepEqual(replay, question, `${question.questionId} failed deterministic replay`);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.runtimeRegistered, false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `${question.questionId} has duplicate options`);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.stem.trim().length > 0, true);
    assert.equal(question.explanation.trim().length > 0, true);
    assert.equal(question.explanation.length <= 650, true, `${question.questionId} explanation too long`);

    for (const pattern of forbiddenLearnerLanguage) {
      assert.equal(pattern.test(question.stem), false, `${question.questionId} leaked internal language in stem`);
      assert.equal(pattern.test(question.explanation), false, `${question.questionId} leaked internal language in explanation`);
    }

    assert.equal(
      question.sourceIds.some((sourceId) => blockedSources.has(sourceId)),
      false,
      `${question.questionId} used an editorially blocked source`,
    );
    assert.equal(
      question.sourceFactIds.some((factId) => nonApprovedFactIds.has(factId)),
      false,
      `${question.questionId} used a held/rejected V1 fact`,
    );
    assert.equal(question.sourceFactIds.includes("com001-sram-layer"), false);
  }

  assert.equal(stems.size >= 3, true, `${qlId} needs at least three V2 stem surfaces`);
  assert.equal(answers.size >= 2, true, `${qlId} needs broader V2 answer/object coverage`);
  assert.equal(positions.size >= 3, true, `${qlId} V2 answer-position spread is too narrow`);
}
assert.equal(audited, 360);

function assertSurfaceModes(qlId: string, expected: string[]) {
  const batch = generateCom001ReviewBatchV2(qlId, 80, `v2-surface-audit:${qlId}`);
  const modes = new Set(batch.map((q) => q.relationalSurfaceMode).filter(Boolean));
  for (const mode of expected) {
    assert.equal(modes.has(mode), true, `${qlId} failed to surface ${mode}`);
  }
}

assertSurfaceModes("COM-001-QL-001", ["ENTITY_SELECTION", "MATCHED_PAIR"]);
assertSurfaceModes("COM-001-QL-002", ["LAYER_TO_ENTITY", "ENTITY_TO_LAYER"]);
assertSurfaceModes("COM-001-QL-003", ["COMPONENT_TO_FUNCTION", "FUNCTION_TO_COMPONENT"]);
assertSurfaceModes("COM-001-QL-004", ["PARENT_TO_ENTITY", "ENTITY_TO_PARENT"]);
assertSurfaceModes("COM-001-QL-005", ["MEDIUM_TO_ENTITY", "MATCHED_PAIR"]);

const ql002 = generateCom001ReviewBatchV2("COM-001-QL-002", 40, "v2-ql002-grammar");
assert.ok(ql002.every((q) => !/CPU registers (?:is classified|belongs to)/iu.test(q.explanation)));

const ql003 = generateCom001ReviewBatchV2("COM-001-QL-003", 40, "v2-ql003-grammar");
assert.ok(ql003.every((q) => !/is used to (?:stores|holds|keeps|provides|serves)/iu.test(q.explanation)));

const ql005Matched = generateCom001ReviewBatchV2("COM-001-QL-005", 80, "v2-ql005-pairs")
  .filter((q) => q.relationalSurfaceMode === "MATCHED_PAIR");
assert.equal(ql005Matched.length > 0, true);
assert.ok(ql005Matched.every((q) => q.canonicalAnswer.includes(" — ")));

const ql007 = generateCom001ReviewBatchV2("COM-001-QL-007", 40, "v2-audit:COM-001-QL-007");
const ql007TapeCount = ql007.filter((q) => q.canonicalAnswer === "Magnetic tape").length;
assert.equal(ql007TapeCount >= 20, true, `QL-007 magnetic-tape share too low: ${ql007TapeCount}/40`);
assert.equal(ql007.some((q) => q.canonicalAnswer === "WORM optical media"), true);
assert.equal(ql007.some((q) => q.canonicalAnswer === "USB flash drive"), true);
assert.ok(ql007.every((q) => !q.options.includes("RDX removable disk")));

const ql009 = generateCom001ReviewBatchV2("COM-001-QL-009", 40, "v2-audit:COM-001-QL-009");
const examMode = ql009.filter((q) => q.capacityConvention === "TRADITIONAL_EXAM_1024");
const standardsMode = ql009.filter((q) => q.capacityConvention === "SI_IEC_EXPLICIT");
assert.equal(examMode.length, 30);
assert.equal(standardsMode.length, 10);
assert.ok(examMode.every((q) => !/\bKiB\b|\bMiB\b|\bGiB\b/iu.test(q.stem)));
assert.ok(examMode.every((q) => /1024-based convention|One byte contains 8 bits/iu.test(q.explanation)));
assert.ok(standardsMode.every((q) => /SI|IEC|binary-prefix|decimal-prefix/iu.test(q.stem) || /byte/i.test(q.stem)));
assert.ok(examMode.every((q) => q.sourceIds.every((id) => id === "NIST-CSRC-BYTE" || pyqEvidenceIds.has(id))));

for (const question of examMode) {
  const units = question.options.map((option) => option.match(/\b(bits|bytes|KB|MB|GB|TB)$/u)?.[1]).filter(Boolean);
  if (question.stem.endsWith("1024 ______.")) continue;
  assert.equal(new Set(units).size, 1, `${question.questionId} mixes distractor units`);
}
