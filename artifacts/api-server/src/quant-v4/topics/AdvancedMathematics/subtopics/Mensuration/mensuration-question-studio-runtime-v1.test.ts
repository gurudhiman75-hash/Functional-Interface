import {
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_PACKAGE_V1,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioBatchV1,
  generateMensurationStudioQuestionV1,
} from "./mensuration-question-studio-runtime-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.length === 13, "Mensuration Question Studio must expose CP001..CP013.");
assert(new Set(MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.map((row) => row.cpId)).size === 13, "Mensuration CP identities must be unique.");
assert(MENSURATION_QUESTION_STUDIO_PACKAGE_V1.questionStudioDiscoverable === true, "Chapter adapter must be Question Studio discoverable.");
assert(MENSURATION_QUESTION_STUDIO_PACKAGE_V1.persistenceAllowed === true, "Chapter adapter must allow Question Studio persistence.");
assert(MENSURATION_QUESTION_STUDIO_PACKAGE_V1.questionBankWritable === false, "Question Studio connection must not write Question Bank directly.");
assert(MENSURATION_QUESTION_STUDIO_PACKAGE_V1.publiclyPublishable === false, "Question Studio connection must not publish directly.");
assert(new Set(MENSURATION_QUESTION_STUDIO_PATTERNS.map((row) => row.patternId)).size === MENSURATION_QUESTION_STUDIO_PATTERNS.length, "Pattern IDs must be globally unique across Mensuration.");
assert(MENSURATION_QUESTION_STUDIO_PATTERNS.some((row) => row.packageId === "MEN-001"), "MEN-001 must be connected.");
assert(MENSURATION_QUESTION_STUDIO_PATTERNS.some((row) => row.packageId === "MEN-002"), "MEN-002 must be connected.");

const generatedCps = new Set<string>();
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  const seed = `mensuration-full-studio-proof:${pattern.patternId}`;
  const question = generateMensurationStudioQuestionV1({ patternId: pattern.patternId, seed });
  const replay = generateMensurationStudioQuestionV1({ patternId: pattern.patternId, seed });
  assert(JSON.stringify(question) === JSON.stringify(replay), `${pattern.patternId}: deterministic replay failed.`);
  assert(question.cpId === pattern.cpId, `${pattern.patternId}: CP identity drift.`);
  assert(question.patternKind === pattern.patternKind, `${pattern.patternId}: pattern-kind drift.`);
  assert(question.qlId === pattern.qlId, `${pattern.patternId}: QL identity drift.`);
  assert(question.options.length === 4 && new Set(question.options).size === 4, `${pattern.patternId}: four unique options required.`);
  assert(question.optionDetails.filter((row) => row.isCorrect).length === 1, `${pattern.patternId}: exactly one correct option required.`);
  assert(question.options[question.correctIndex] === question.answer, `${pattern.patternId}: answer parity failed.`);
  assert(question.explanation.steps.length > 0, `${pattern.patternId}: teaching explanation missing.`);
  assert(question.validation.valid, `${pattern.patternId}: normalized validation failed.`);
  assert(question.validation.sourceLifecycleLocked, `${pattern.patternId}: source product lifecycle leak.`);
  if (pattern.cpId === "MEN-CP-011") {
    assert(pattern.patternKind === "PROTOTYPE" && pattern.qlId === null, `${pattern.patternId}: CP011 must retain truthful prototype identity.`);
  } else {
    assert(pattern.patternKind === "QL" && typeof pattern.qlId === "string", `${pattern.patternId}: non-CP011 pattern must use its existing QL identity.`);
  }
  generatedCps.add(question.cpId);
}
assert(generatedCps.size === 13, `Only ${generatedCps.size}/13 Mensuration CPs generated.`);

for (const chapter of MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS) {
  const result = generateMensurationStudioBatchV1({ cpId: chapter.cpId, seed: `mensuration-chapter-batch:${chapter.cpId}`, count: 4 });
  assert(result.questions.length === 4, `${chapter.cpId}: batch count failed.`);
  assert(result.questions.every((question) => question.cpId === chapter.cpId), `${chapter.cpId}: batch filter leaked another CP.`);
}

const wholeChapter = generateMensurationStudioBatchV1({ seed: "mensuration-whole-chapter-proof", count: 50 });
assert(wholeChapter.questions.length === 50, "Whole-chapter batch must generate 50 questions.");
assert(wholeChapter.questions.every((question) => question.validation.valid), "Whole-chapter batch contains an invalid question.");

console.log(JSON.stringify({
  authority: MENSURATION_QUESTION_STUDIO_PACKAGE_V1.integrationAuthority,
  canonicalProblems: MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS.length,
  patterns: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  qls: MENSURATION_QUESTION_STUDIO_PACKAGE_V1.qlCount,
  prototypes: MENSURATION_QUESTION_STUDIO_PACKAGE_V1.prototypeCount,
  generatedPatterns: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  generatedCanonicalProblems: generatedCps.size,
  questionStudioDiscoverable: true,
  persistenceAllowed: true,
  questionBankWritable: false,
  publiclyPublishable: false,
}, null, 2));
