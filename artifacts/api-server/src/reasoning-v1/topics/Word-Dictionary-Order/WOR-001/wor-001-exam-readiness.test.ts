import assert from "node:assert/strict";

import { WOR_001_EXAM_READINESS_FREEZE } from "./exam-readiness-freeze";
import {
  WOR_001_PERMANENT_QL_REGISTRY,
  WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS,
  worPermanentQlIdForPrototype,
} from "./permanent-ql-registry";
import { WOR_001_ALL_PROTOTYPES } from "./prototype-registry";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";
import { WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review";

const mappedPrototypeIds = WOR_001_PERMANENT_QL_REGISTRY.flatMap((entry) => entry.mappedPrototypeIds);
assert.equal(WOR_001_EXAM_READINESS_FREEZE.status, "EXAM_READY_CONTENT_AUTHORITY_FROZEN");
assert.equal(WOR_001_PERMANENT_QL_REGISTRY.length, 8);
assert.equal(mappedPrototypeIds.length, 15);
assert.equal(new Set(mappedPrototypeIds).size, 15);
assert.equal(WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length, 9);
assert.equal(mappedPrototypeIds.length + WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length, WOR_001_ALL_PROTOTYPES.length);

for (const entry of WOR_001_PERMANENT_QL_REGISTRY) {
  assert.notEqual(entry.sourceEvidenceStatus, "EXPLORATORY_SOURCE_GAP");
  assert.equal(entry.active, false);
  assert.equal(entry.questionBankWritable, false);
  assert.equal(entry.testEligible, false);
  assert.equal(entry.mockTestEligible, false);
  assert.equal(entry.publiclyPublishable, false);
}
for (const prototypeId of WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS) {
  assert.equal(worPermanentQlIdForPrototype(prototypeId), null);
}

const bannedEditorialPatterns = [
  /\b(?:TODO|TBD|PLACEHOLDER|undefined|null)\b/i,
  /\b(?:prototype|misconceptionId|structuredPrompt|bankingTrace)\b/i,
  /character \d+ from/i,
  /move 1 places/i,
  /alphabet offset/i,
];
const answerPositions = new Map<number, Set<number>>();
let generatedCount = 0;

for (const prototypeId of mappedPrototypeIds) {
  const contract = WOR_001_ALL_PROTOTYPES.find((entry) => entry.prototypeId === prototypeId)!;
  const difficulties = contract.hardOnly ? ["HARD" as const] : (contract.supportedDifficulties ?? ["EASY", "MEDIUM", "HARD"] as const);
  const expectedOptionCount = contract.optionCount ?? 4;
  const positions = answerPositions.get(expectedOptionCount) ?? new Set<number>();
  answerPositions.set(expectedOptionCount, positions);

  for (const difficulty of difficulties) {
    for (let seedOffset = 0; seedOffset < 6; seedOffset += 1) {
      const seed = 818000 + seedOffset * 97 + Number(prototypeId.slice(-3));
      for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
        const question = WOR_001_QUESTION_STUDIO_ADAPTER.generate(prototypeId, seed, locale, difficulty);
        const values = question.options.map((option) => option.value);
        generatedCount += 1;

        assert.equal(question.permanentQlId, worPermanentQlIdForPrototype(prototypeId));
        assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
        assert.equal(question.questionStudioVisible, true);
        assert.equal(question.metadata.independentSolverVerified, true);
        assert.equal(question.metadata.ambiguityAudit, "LEXICALLY_UNIQUE");
        assert.notEqual(question.metadata.sourceEvidenceStatus, "EXPLORATORY_SOURCE_GAP");
        assert.equal(question.structuredPrompt.transformedWords, undefined);
        assert.equal(values.length, expectedOptionCount);
        assert.equal(new Set(values).size, values.length);
        assert.ok(question.correctIndex >= 0 && question.correctIndex < values.length);
        assert.equal(values[question.correctIndex], question.answer);
        assert.equal(question.options.filter((option) => option.misconceptionId === null).length, 1);
        assert.ok(question.explanation.trim().length >= 50);
        assert.ok(question.explanation.includes(question.answer));
        positions.add(question.correctIndex);

        const learnerText = `${question.stem}\n${question.explanation}`;
        for (const pattern of bannedEditorialPatterns) assert.doesNotMatch(learnerText, pattern);
        if (locale === "hi-IN") assert.match(question.stem, /[\u0900-\u097F]/);
        if (locale === "pa-IN") assert.match(question.stem, /[\u0A00-\u0A7F]/);
      }
    }
  }
}

assert.deepEqual([...answerPositions.get(4)!].sort(), [0, 1, 2, 3]);
assert.deepEqual([...answerPositions.get(5)!].sort(), [0, 1, 2, 3, 4]);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 8);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(WOR_001_QUESTION_STUDIO_REVIEW_PACKAGE.nativeHumanSignoffRequired, true);

assert.equal(WOR_001_EXAM_READINESS_FREEZE.questionBankWritable, false);
assert.equal(WOR_001_EXAM_READINESS_FREEZE.testEligible, false);
assert.equal(WOR_001_EXAM_READINESS_FREEZE.mockTestEligible, false);
assert.equal(WOR_001_EXAM_READINESS_FREEZE.publiclyPublishable, false);
assert.equal(WOR_001_EXAM_READINESS_FREEZE.nativeHindiPunjabiHumanSignoff, "PENDING");

console.log("WOR-001 final exam-readiness freeze audit passed.", {
  permanentQlCount: WOR_001_PERMANENT_QL_REGISTRY.length,
  mappedPrototypeCount: mappedPrototypeIds.length,
  sourceDeferredPrototypeCount: WOR_001_SOURCE_DEFERRED_PROTOTYPE_IDS.length,
  generatedAuditQuestions: generatedCount,
  answerPositions4: [...answerPositions.get(4)!].sort(),
  answerPositions5: [...answerPositions.get(5)!].sort(),
  lifecycle: WOR_001_EXAM_READINESS_FREEZE.lifecycleStatus,
});
