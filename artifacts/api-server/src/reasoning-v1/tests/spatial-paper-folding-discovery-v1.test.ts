import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_DISCOVERY_AUTHORITY_V1,
  PFC_001_REPRESENTATION_CATALOG_V1,
  generatePfcDiscoveryCorpusV1,
  generatePfcDiscoveryQuestionV1,
  pfcDiscoveryOptionIsReadableV1,
  renderPfcDiscoveryReviewHtmlV1,
  validatePfcDiscoveryCutReachabilityV1,
} from "../foundation/spatial/paper-folding-discovery-v1";

const corpus = generatePfcDiscoveryCorpusV1();
assert.equal(corpus.length, 800);
assert.equal(PFC_001_REPRESENTATION_CATALOG_V1.length, 10);
assert.equal(PFC_001_DISCOVERY_AUTHORITY_V1.permanentQlAllocationStatus, "NOT_ALLOCATED_DISCOVERY_REVIEW_REQUIRED");
assert.equal(PFC_001_DISCOVERY_AUTHORITY_V1.nextAvailableQl, "SPA-QL-035");

const countsByRepresentation = new Map<string, number>();
const countsByCorrectOption = new Map<string, number>();
const countsByDifficulty = new Map<string, number>();
const semanticFingerprints = new Set<string>();
const questionIds = new Set<string>();
let optionCount = 0;
let correctOptionCount = 0;
let readableOptionCount = 0;

for (const question of corpus) {
  countsByRepresentation.set(
    question.representationId,
    (countsByRepresentation.get(question.representationId) ?? 0) + 1,
  );
  countsByCorrectOption.set(
    question.correctOptionId,
    (countsByCorrectOption.get(question.correctOptionId) ?? 0) + 1,
  );
  countsByDifficulty.set(
    question.difficulty,
    (countsByDifficulty.get(question.difficulty) ?? 0) + 1,
  );

  assert.equal(question.chapterCode, "PFC-001");
  assert.equal(question.options.length, 4);
  assert.ok(validatePfcDiscoveryCutReachabilityV1(question));
  assert.ok(question.explanation.includes(`option ${question.correctOptionId}`));
  assert.ok(question.explanation.includes("Open the folds in reverse order"));

  assert.ok(!questionIds.has(question.questionId), `duplicate question id ${question.questionId}`);
  questionIds.add(question.questionId);
  assert.ok(
    !semanticFingerprints.has(question.semanticFingerprint),
    `duplicate semantic question ${question.questionId} ${question.semanticFingerprint}`,
  );
  semanticFingerprints.add(question.semanticFingerprint);

  const optionFingerprints = new Set(question.options.map((option) => option.fingerprint));
  assert.equal(optionFingerprints.size, 4, `duplicate option in ${question.questionId}`);
  assert.equal(
    question.options.filter((option) => option.misconception === "CORRECT").length,
    1,
    `incorrect correct-option cardinality in ${question.questionId}`,
  );
  assert.equal(question.options[question.correctOptionIndex].optionId, question.correctOptionId);
  assert.equal(question.options[question.correctOptionIndex].misconception, "CORRECT");

  for (const option of question.options) {
    optionCount += 1;
    if (option.misconception === "CORRECT") correctOptionCount += 1;
    assert.ok(pfcDiscoveryOptionIsReadableV1(option), `mobile readability failed ${question.questionId} ${option.optionId}`);
    readableOptionCount += 1;
  }
}

for (const representation of PFC_001_REPRESENTATION_CATALOG_V1) {
  assert.equal(countsByRepresentation.get(representation.id), 80, `${representation.id} must have 80 discovery questions`);
}

assert.deepEqual(
  Object.fromEntries([...countsByCorrectOption.entries()].sort()),
  { A: 200, B: 200, C: 200, D: 200 },
);
assert.equal(optionCount, 3200);
assert.equal(correctOptionCount, 800);
assert.equal(readableOptionCount, 3200);
assert.equal(semanticFingerprints.size, 800);
assert.equal(questionIds.size, 800);

// Replay representative questions from every prototype, including the advanced end of each 80-question block.
for (let representationIndex = 0; representationIndex < 10; representationIndex += 1) {
  for (const offset of [0, 17, 43, 79]) {
    const index = representationIndex * 80 + offset;
    assert.deepEqual(generatePfcDiscoveryQuestionV1(index), generatePfcDiscoveryQuestionV1(index));
  }
}

// Coverage invariants for the representation families.
const prototype01 = corpus[0];
assert.equal(prototype01.folds.length, 1);
assert.equal(prototype01.options[prototype01.correctOptionIndex].imprints.length, 2);

const prototype03 = corpus[160];
assert.equal(prototype03.folds.length, 2);
assert.equal(prototype03.options[prototype03.correctOptionIndex].imprints.length, 4);

const prototype05 = corpus[320];
assert.equal(prototype05.folds[0].kind, "CORNER");
assert.equal(prototype05.options[prototype05.correctOptionIndex].imprints.length, 2);

const prototype08 = corpus[560];
assert.equal(prototype08.cuts.length, 2);
assert.equal(prototype08.options[prototype08.correctOptionIndex].imprints.length, 8);

const prototype09 = corpus[640];
assert.equal(prototype09.cuts[0].kind, "BOUNDARY_NOTCH");
assert.ok(prototype09.options[prototype09.correctOptionIndex].imprints.every((imprint) => imprint.contact === "BOUNDARY"));

const prototype10 = corpus[720];
assert.equal(prototype10.folds.length, 3);
assert.equal(prototype10.options[prototype10.correctOptionIndex].imprints.length, 8);

const reviewQuestions = PFC_001_REPRESENTATION_CATALOG_V1.flatMap((_, representationIndex) =>
  [0, 19, 41, 73].map((variantIndex) => corpus[representationIndex * 80 + variantIndex]),
);
assert.equal(reviewQuestions.length, 40);
const reviewHtml = renderPfcDiscoveryReviewHtmlV1(reviewQuestions);
assert.ok(reviewHtml.includes("PFC-001 Discovery Learner Review V1"));
assert.ok(reviewHtml.includes("width=\"112\""));
assert.ok(!reviewHtml.includes("<script"));
assert.ok(!reviewHtml.includes("http://") || reviewHtml.includes("http://www.w3.org/2000/svg"));

const evidence = {
  authority: PFC_001_DISCOVERY_AUTHORITY_V1,
  status: "PASS_PFC_001_EXECUTABLE_DISCOVERY_V1",
  corpus: {
    totalQuestions: corpus.length,
    representationCount: PFC_001_REPRESENTATION_CATALOG_V1.length,
    questionsPerRepresentation: Object.fromEntries([...countsByRepresentation.entries()].sort()),
    uniqueSemanticQuestions: semanticFingerprints.size,
    optionCount,
    mobileReadableOptions: readableOptionCount,
    correctAnswerBalance: Object.fromEntries([...countsByCorrectOption.entries()].sort()),
    difficultyDistribution: Object.fromEntries([...countsByDifficulty.entries()].sort()),
    learnerReviewQuestions: reviewQuestions.length,
    learnerOptionPixels: 112,
  },
  coverage: PFC_001_REPRESENTATION_CATALOG_V1,
  governance: {
    frozenExistingSpatialQlRange: "SPA-QL-001..SPA-QL-034",
    nextAvailableQl: "SPA-QL-035",
    permanentPfcQlAllocation: "NOT_YET_ALLOCATED",
    questionStudioRegistered: false,
    questionBankWrites: false,
    automaticPublication: false,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-discovery-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-discovery-v1-review.html",
  reviewHtml,
  "utf8",
);
console.log(JSON.stringify(evidence));
