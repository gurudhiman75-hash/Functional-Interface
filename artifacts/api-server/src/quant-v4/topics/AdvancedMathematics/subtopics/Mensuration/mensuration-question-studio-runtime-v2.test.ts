import {
  MENSURATION_QUESTION_STUDIO_EXAM_PROFILES,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationStudioBatchV2,
  generateMensurationStudioQuestionV2,
} from "./mensuration-question-studio-runtime-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function balancedDollarMath(text: string) {
  return (text.match(/\$/g) ?? []).length % 2 === 0 && !/\\pih\b/.test(text);
}

const cp013Patterns = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => row.cpId === "MEN-CP-013");
const cpDifficulty = new Map<string, Set<string>>();
let men001GenericShortcutCount = 0;
let men001MissingTrapCount = 0;
let cp008MalformedMathCount = 0;
let setterShorthandCount = 0;
let objectPoolRealizations = 0;
let stemPoolRealizations = 0;
let generated = 0;

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  const difficulties = cpDifficulty.get(pattern.cpId) ?? new Set<string>();
  cpDifficulty.set(pattern.cpId, difficulties);
  for (let index = 0; index < 4; index += 1) {
    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `mensuration-realism-v2:${pattern.patternId}:${index}`,
      examProfile: "SSC_CORE",
    });
    const replay = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `mensuration-realism-v2:${pattern.patternId}:${index}`,
      examProfile: "SSC_CORE",
    });
    assert(JSON.stringify(question) === JSON.stringify(replay), `${pattern.patternId}/${index}: deterministic V2 replay failed.`);
    assert(question.validation.valid, `${pattern.patternId}/${index}: source validation failed.`);
    assert(question.options.length === 4 && new Set(question.options).size === 4, `${pattern.patternId}/${index}: four unique options required.`);
    assert(question.optionDetails.filter((row) => row.isCorrect).length === 1, `${pattern.patternId}/${index}: exactly one correct answer required.`);
    assert(question.options[question.correctIndex] === question.answer, `${pattern.patternId}/${index}: answer parity failed.`);
    assert(question.realism.authority === MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY, `${pattern.patternId}/${index}: realism authority missing.`);
    assert(question.realism.selectionWeight > 0, `${pattern.patternId}/${index}: profile weight must be positive.`);
    difficulties.add(question.difficultyBand);
    if (question.realism.objectVariantId !== "SOURCE_OBJECT") objectPoolRealizations += 1;
    if (question.realism.stemVariantId !== "SOURCE_STEM") stemPoolRealizations += 1;
    if (pattern.packageId === "MEN-001") {
      if (question.explanation.shortcut === "Use the governing mensuration relation and keep units consistent.") men001GenericShortcutCount += 1;
      if (!question.explanation.traps.length) men001MissingTrapCount += 1;
    }
    if (pattern.cpId === "MEN-CP-008") {
      const visible = [question.stem, ...question.options, ...question.explanation.steps, question.explanation.shortcut, ...question.explanation.traps].join("\n");
      if (!balancedDollarMath(visible)) cp008MalformedMathCount += 1;
    }
    if (pattern.patternId === "MEN-002-QL-084" && /\br:h\s*=/.test(question.stem)) setterShorthandCount += 1;
    if (pattern.patternId === "MEN-002-QL-143" && /larger radius\s*=|smaller radius\s*=|vertical height\s*=/.test(question.stem)) setterShorthandCount += 1;
    generated += 1;
  }
}

assert(generated === MENSURATION_QUESTION_STUDIO_PATTERNS.length * 4, "V2 four-state chapter proof count drifted.");
assert(men001GenericShortcutCount === 0, `MEN-001 still exposes ${men001GenericShortcutCount} generic shortcut fallbacks.`);
assert(men001MissingTrapCount === 0, `MEN-001 lost structured traps in ${men001MissingTrapCount} states.`);
assert(cp008MalformedMathCount === 0, `CP008 still exposes malformed learner math in ${cp008MalformedMathCount} states.`);
assert(setterShorthandCount === 0, `Setter shorthand remains in ${setterShorthandCount} targeted states.`);
assert(objectPoolRealizations > 20, `Object/context pool surfaced only ${objectPoolRealizations} times.`);
assert(stemPoolRealizations > 20, `Stem-expression pool surfaced only ${stemPoolRealizations} times.`);

for (const cpId of ["MEN-CP-008", "MEN-CP-010", "MEN-CP-012", "MEN-CP-013"]) {
  assert((cpDifficulty.get(cpId)?.size ?? 0) >= 2, `${cpId}: product difficulty still collapses to one band.`);
}

const cp013Proof: Array<{ patternId: string; firstFourStates: number; namespaces: number; answerPositions: number }> = [];
for (const pattern of cp013Patterns) {
  const firstFour = Array.from({ length: 4 }, (_, index) => generateMensurationStudioQuestionV2({
    patternId: pattern.patternId,
    seed: `cp013-short-batch:${pattern.patternId}:${index}`,
  }));
  const firstFourStates = new Set(firstFour.map((question) => question.realism.numericalStateSignature)).size;
  assert(firstFourStates >= 2, `${pattern.patternId}: first four CP013 generations still expose only one numerical state.`);

  const namespaceStates = new Set(["alpha", "bravo", "charlie", "delta"].map((namespace) =>
    generateMensurationStudioQuestionV2({ patternId: pattern.patternId, seed: `${namespace}:${pattern.patternId}:0` }).realism.numericalStateSignature,
  )).size;
  assert(namespaceStates >= 2, `${pattern.patternId}: CP013 content is still insensitive to the full seed namespace.`);

  const sixteen = Array.from({ length: 16 }, (_, index) => generateMensurationStudioQuestionV2({
    patternId: pattern.patternId,
    seed: `cp013-saturation:${pattern.patternId}:${index}`,
  }));
  const answerPositions = new Set(sixteen.map((question) => question.correctIndex)).size;
  assert(answerPositions === 4, `${pattern.patternId}: CP013 no longer reaches all four answer positions.`);
  cp013Proof.push({ patternId: pattern.patternId, firstFourStates, namespaces: namespaceStates, answerPositions });
}

const profileCounts: Record<string, Record<string, number>> = {};
for (const profile of MENSURATION_QUESTION_STUDIO_EXAM_PROFILES) {
  const result = generateMensurationStudioBatchV2({
    examProfile: profile,
    seed: `mensuration-profile-proof:${profile}`,
    count: 50,
  });
  assert(result.questions.length === 50, `${profile}: weighted profile batch failed.`);
  profileCounts[profile] = {};
  for (const question of result.questions) {
    profileCounts[profile]![question.cpId] = (profileCounts[profile]![question.cpId] ?? 0) + 1;
  }
}
const advancedTail = ["MEN-CP-010", "MEN-CP-011", "MEN-CP-012", "MEN-CP-013"]
  .reduce((sum, cpId) => sum + (profileCounts.SSC_ADVANCED?.[cpId] ?? 0), 0);
const coreTail = ["MEN-CP-010", "MEN-CP-011", "MEN-CP-012", "MEN-CP-013"]
  .reduce((sum, cpId) => sum + (profileCounts.SSC_CORE?.[cpId] ?? 0), 0);
assert(advancedTail > coreTail, `SSC_ADVANCED should surface more CP010-013 material than SSC_CORE (${advancedTail} <= ${coreTail}).`);

const cp013Batch = generateMensurationStudioBatchV2({
  patternId: "MEN-002-QL-171",
  examProfile: "SSC_ADVANCED",
  seed: "cp013-anti-repeat-proof",
  count: 8,
});
assert(new Set(cp013Batch.questions.slice(0, 4).map((question) => question.realism.numericalStateSignature)).size >= 3,
  "CP013 short-batch anti-repetition failed to surface at least three numerical states in the first four accepted questions.");

console.log(JSON.stringify({
  authority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  patterns: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  fourStateQuestions: generated,
  men001GenericShortcutCount,
  men001MissingTrapCount,
  cp008MalformedMathCount,
  setterShorthandCount,
  objectPoolRealizations,
  stemPoolRealizations,
  calibratedDifficultyBands: Object.fromEntries([...cpDifficulty.entries()].map(([cpId, bands]) => [cpId, [...bands].sort()])),
  cp013Proof,
  profileCounts,
  cp013ShortBatchDistinctFirstFour: new Set(cp013Batch.questions.slice(0, 4).map((question) => question.realism.numericalStateSignature)).size,
}, null, 2));
