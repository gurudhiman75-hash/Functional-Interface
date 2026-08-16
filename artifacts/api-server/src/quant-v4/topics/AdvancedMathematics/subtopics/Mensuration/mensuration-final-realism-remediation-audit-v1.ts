import fs from "node:fs";
import path from "node:path";
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

function dollarsBalanced(text: string) {
  return (text.match(/\$/g) ?? []).length % 2 === 0 && !/\\pih\b/.test(text);
}

function questionState(question: ReturnType<typeof generateMensurationStudioQuestionV2>) {
  return `${question.patternId}|${question.stem}|${question.options.join("|")}`;
}

const fourStateRecords: Array<Record<string, unknown>> = [];
const fourStateSignatures = new Set<string>();
const cpDifficulty = new Map<string, Set<string>>();
let structuralCritical = 0;
let genericShortcutFallbacks = 0;
let malformedMath = 0;
let setterShorthand = 0;
let objectPoolRealizations = 0;
let stemPoolRealizations = 0;

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const question = generateMensurationStudioQuestionV2({
      patternId: pattern.patternId,
      seed: `mensuration-remediation-audit:${pattern.patternId}:${index}`,
      examProfile: "SSC_CORE",
    });
    const valid = question.validation.valid
      && question.options.length === 4
      && new Set(question.options).size === 4
      && question.optionDetails.filter((row) => row.isCorrect).length === 1
      && question.options[question.correctIndex] === question.answer
      && question.explanation.steps.length > 0;
    if (!valid) structuralCritical += 1;
    if (question.explanation.shortcut === "Use the governing mensuration relation and keep units consistent.") genericShortcutFallbacks += 1;
    const learnerVisible = [question.stem, ...question.options, ...question.explanation.steps, question.explanation.shortcut, ...question.explanation.traps].join("\n");
    if (!dollarsBalanced(learnerVisible)) malformedMath += 1;
    if (/\br:h\s*=|larger radius\s*=|smaller radius\s*=|vertical height\s*=/.test(question.stem)) setterShorthand += 1;
    if (question.realism.objectVariantId !== "SOURCE_OBJECT") objectPoolRealizations += 1;
    if (question.realism.stemVariantId !== "SOURCE_STEM") stemPoolRealizations += 1;
    fourStateSignatures.add(questionState(question));
    const bands = cpDifficulty.get(question.cpId) ?? new Set<string>();
    bands.add(question.difficultyBand);
    cpDifficulty.set(question.cpId, bands);
    fourStateRecords.push({
      cpId: question.cpId,
      patternId: question.patternId,
      difficulty: question.difficultyBand,
      stem: question.stem,
      answer: question.answer,
      shortcut: question.explanation.shortcut,
      traps: question.explanation.traps,
      realism: question.realism,
    });
  }
}

const saturationRows: Array<Record<string, unknown>> = [];
let allFourAnswerPositionPatterns = 0;
let fewerThanFourContentStatesAcross16 = 0;
let cp013FirstFourSingleStateCount = 0;
let cp013NamespaceInsensitiveCount = 0;

for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  const sixteen = Array.from({ length: 16 }, (_, index) => generateMensurationStudioQuestionV2({
    patternId: pattern.patternId,
    seed: `mensuration-remediation-saturation:${pattern.patternId}:${index}`,
    examProfile: "SSC_CORE",
  }));
  const answerPositions = new Set(sixteen.map((question) => question.correctIndex)).size;
  const contentStates = new Set(sixteen.map((question) => question.realism.numericalStateSignature)).size;
  const firstFourStates = new Set(sixteen.slice(0, 4).map((question) => question.realism.numericalStateSignature)).size;
  if (answerPositions === 4) allFourAnswerPositionPatterns += 1;
  if (contentStates < 4) fewerThanFourContentStatesAcross16 += 1;

  let namespaceStates: number | null = null;
  if (pattern.cpId === "MEN-CP-013") {
    if (firstFourStates === 1) cp013FirstFourSingleStateCount += 1;
    namespaceStates = new Set(["alpha", "bravo", "charlie", "delta"].map((namespace) =>
      generateMensurationStudioQuestionV2({
        patternId: pattern.patternId,
        seed: `${namespace}:${pattern.patternId}:0`,
        examProfile: "SSC_CORE",
      }).realism.numericalStateSignature,
    )).size;
    if (namespaceStates === 1) cp013NamespaceInsensitiveCount += 1;
  }
  saturationRows.push({
    cpId: pattern.cpId,
    patternId: pattern.patternId,
    answerPositions,
    contentStates,
    firstFourStates,
    namespaceStates,
  });
}

const profileCounts: Record<string, Record<string, number>> = {};
for (const profile of MENSURATION_QUESTION_STUDIO_EXAM_PROFILES) {
  const result = generateMensurationStudioBatchV2({ examProfile: profile, seed: `profile-audit:${profile}`, count: 50 });
  profileCounts[profile] = {};
  for (const question of result.questions) {
    profileCounts[profile]![question.cpId] = (profileCounts[profile]![question.cpId] ?? 0) + 1;
  }
}
const tailCps = ["MEN-CP-010", "MEN-CP-011", "MEN-CP-012", "MEN-CP-013"];
const advancedTail = tailCps.reduce((sum, cpId) => sum + (profileCounts.SSC_ADVANCED?.[cpId] ?? 0), 0);
const coreTail = tailCps.reduce((sum, cpId) => sum + (profileCounts.SSC_CORE?.[cpId] ?? 0), 0);

assert(structuralCritical === 0, `Post-remediation audit has ${structuralCritical} structural failures.`);
assert(genericShortcutFallbacks === 0, `Post-remediation audit still has ${genericShortcutFallbacks} generic shortcut fallbacks.`);
assert(malformedMath === 0, `Post-remediation audit still has ${malformedMath} malformed learner-math states.`);
assert(setterShorthand === 0, `Post-remediation audit still has ${setterShorthand} setter-shorthand stems.`);
assert(cp013FirstFourSingleStateCount === 0, `CP013 still has ${cp013FirstFourSingleStateCount} QLs with one state across the first four generations.`);
assert(cp013NamespaceInsensitiveCount === 0, `CP013 still has ${cp013NamespaceInsensitiveCount} namespace-insensitive QLs.`);
assert(allFourAnswerPositionPatterns >= 393, `Answer-position coverage regressed to ${allFourAnswerPositionPatterns}/399 patterns.`);
assert(fewerThanFourContentStatesAcross16 <= 1, `${fewerThanFourContentStatesAcross16} patterns have fewer than four content states across 16 generations.`);
assert(fourStateSignatures.size >= 1593, `Four-state chapter diversity regressed to ${fourStateSignatures.size}/1596 distinct states.`);
assert(objectPoolRealizations > 20, `Object/context pool is not materially surfacing (${objectPoolRealizations}).`);
assert(stemPoolRealizations > 20, `Stem-expression pool is not materially surfacing (${stemPoolRealizations}).`);
for (const cpId of ["MEN-CP-008", "MEN-CP-010", "MEN-CP-012", "MEN-CP-013"]) {
  assert((cpDifficulty.get(cpId)?.size ?? 0) >= 2, `${cpId} still has only one product difficulty band.`);
}
assert(advancedTail > coreTail, `Exam profiles are not differentiating advanced-tail sampling (${advancedTail} <= ${coreTail}).`);

const outputDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
const summary = {
  authority: MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  scope: {
    patterns: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
    editorialQuestions: fourStateRecords.length,
    saturationQuestions: MENSURATION_QUESTION_STUDIO_PATTERNS.length * 16,
    totalQuestions: fourStateRecords.length + MENSURATION_QUESTION_STUDIO_PATTERNS.length * 16,
  },
  postRemediation: {
    structuralCritical,
    distinctFourStateQuestions: fourStateSignatures.size,
    genericShortcutFallbacks,
    malformedMath,
    setterShorthand,
    objectPoolRealizations,
    stemPoolRealizations,
    allFourAnswerPositionPatterns,
    fewerThanFourContentStatesAcross16,
    cp013FirstFourSingleStateCount,
    cp013NamespaceInsensitiveCount,
    difficultyBands: Object.fromEntries([...cpDifficulty.entries()].map(([cpId, bands]) => [cpId, [...bands].sort()])),
    profileCounts,
    sscCoreAdvancedTailQuestions: coreTail,
    sscAdvancedAdvancedTailQuestions: advancedTail,
  },
  saturationRows,
  reviewSample: fourStateRecords.filter((_, index) => index % 16 === 0),
};
const jsonPath = path.join(outputDir, "mensuration-final-realism-remediation-audit-v1.json");
const markdownPath = path.join(outputDir, "mensuration-final-realism-remediation-audit-v1.md");
fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));
fs.writeFileSync(markdownPath, [
  "# Mensuration Final Realism Remediation Audit V1",
  "",
  `Authority: \`${MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY}\``,
  "",
  `- Patterns: **${MENSURATION_QUESTION_STUDIO_PATTERNS.length}**`,
  `- Editorial corpus: **${fourStateRecords.length}** questions`,
  `- Saturation corpus: **${MENSURATION_QUESTION_STUDIO_PATTERNS.length * 16}** questions`,
  `- Structural failures: **${structuralCritical}**`,
  `- Distinct 4-state questions: **${fourStateSignatures.size}/${fourStateRecords.length}**`,
  `- Generic MEN-001 shortcut fallbacks: **${genericShortcutFallbacks}**`,
  `- Malformed learner math: **${malformedMath}**`,
  `- Setter-shorthand stems: **${setterShorthand}**`,
  `- CP013 first-four single-state QLs: **${cp013FirstFourSingleStateCount}**`,
  `- CP013 namespace-insensitive QLs: **${cp013NamespaceInsensitiveCount}**`,
  `- Patterns reaching A/B/C/D across 16: **${allFourAnswerPositionPatterns}/${MENSURATION_QUESTION_STUDIO_PATTERNS.length}**`,
  `- Patterns with <4 content states across 16: **${fewerThanFourContentStatesAcross16}**`,
  `- Object/context pool realizations: **${objectPoolRealizations}**`,
  `- Stem-expression pool realizations: **${stemPoolRealizations}**`,
  `- SSC_CORE CP010-013 sample count: **${coreTail}/50**`,
  `- SSC_ADVANCED CP010-013 sample count: **${advancedTail}/50**`,
  "",
  "## Verdict",
  "",
  "All audit P0 integration/realism blockers covered by this authority pass their machine gates. Frozen mathematical identities remain unchanged.",
  "",
].join("\n"));

console.log(JSON.stringify(summary.postRemediation, null, 2));
