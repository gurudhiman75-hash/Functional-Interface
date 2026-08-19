import "./english-review-evidence-v11";
import { generateCp005ReviewSetV11 } from "./english-review-runtime-v11";
import { generateCp005EnglishAuditPoolV12, generateCp005ReviewSetV12 } from "./english-review-runtime-v12";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeStem(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?(?:\/\d+)?\b/g, "#")
    .replace(/\s+/g, " ")
    .trim();
}

function words(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function explanationWords(row: ReturnType<typeof generateCp005ReviewSetV12>[number]): number {
  return words([
    row.explanation.method,
    ...row.explanation.steps,
    row.explanation.shortcut,
    row.explanation.finalAnswer,
  ].join(" "));
}

const rows = generateCp005ReviewSetV12(6);
const v11 = generateCp005ReviewSetV11(6);
const audit = generateCp005EnglishAuditPoolV12(30);

assert(rows.length === 78, `CP005 V12 expected 78 selected questions, received ${rows.length}`);
assert(audit.length === 390, `CP005 V12 expected 390 audit questions, received ${audit.length}`);
assert(new Set(rows.map((row) => row.permanentQlId)).size === 13, "CP005 V12 does not cover all thirteen QLs");
assert(new Set(rows.map((row) => row.solveMode)).size === 20, "CP005 V12 does not cover all twenty learner solve modes");
assert(new Set(rows.map((row) => row.stem)).size === 78, "CP005 V12 selected stems are not globally unique");
assert(new Set(rows.map((row) => row.mathematicalFingerprint)).size === 78, "CP005 V12 selected fingerprints changed uniqueness");

for (const ql of [...new Set(rows.map((row) => row.permanentQlId))]) {
  const qlRows = rows.filter((row) => row.permanentQlId === ql);
  assert(qlRows.length === 6, `${ql}: V12 expected six selected questions`);
  const structures = new Set(qlRows.map((row) => normalizeStem(row.stem)));
  assert(structures.size >= 5, `${ql}: V12 stem variety too weak (${structures.size}/6 normalized structures)`);
}

const explanationLengths = rows.map(explanationWords);
const averageExplanationWords = explanationLengths.reduce((sum, count) => sum + count, 0) / explanationLengths.length;
assert(rows.every((row) => row.explanation.steps.length === 2), "CP005 V12 explanations must use exactly two calculation steps");
assert(explanationLengths.every((count) => count <= 70), `CP005 V12 explanation exceeds 70-word ceiling: ${Math.max(...explanationLengths)}`);
assert(averageExplanationWords <= 58, `CP005 V12 average explanation still too long: ${averageExplanationWords.toFixed(1)} words`);
assert(rows.every((row) => words(row.explanation.method) <= 14), "CP005 V12 method line is too long");
assert(rows.every((row) => words(row.explanation.shortcut) <= 12), "CP005 V12 shortcut line is too long");
assert(rows.every((row) => row.explanation.finalAnswer.startsWith("Answer:")), "CP005 V12 final answer is not concise");

assert(rows.every((row, index) => row.permanentQlId === v11[index]!.permanentQlId), "CP005 V12 QL identity changed from V11");
assert(rows.every((row, index) => row.solveMode === v11[index]!.solveMode), "CP005 V12 solve-mode identity changed from V11");
assert(rows.every((row, index) => row.answerText === v11[index]!.answerText), "CP005 V12 answer changed from V11");
assert(rows.every((row, index) => row.correctIndex === v11[index]!.correctIndex), "CP005 V12 correct option position changed from V11");
assert(rows.every((row, index) => row.options.join("|") === v11[index]!.options.join("|")), "CP005 V12 options changed from V11");
assert(rows.every((row, index) => row.mathematicalFingerprint === v11[index]!.mathematicalFingerprint), "CP005 V12 mathematical fingerprint changed from V11");

assert(rows.every((row) => row.options.length === 4 && new Set(row.options).size === 4), "CP005 V12 option uniqueness failed");
assert(rows.every((row) => row.options[row.correctIndex] === row.answerText), "CP005 V12 keyed option mismatch");
assert(rows.every((row) => row.lifecycle.englishFreezeStatus === "UNFROZEN" && !row.lifecycle.questionStudioEnabled && row.lifecycle.questionBankStatus === "NOT_STORED" && row.lifecycle.testEligibility === "INELIGIBLE" && !row.lifecycle.publiclyPublishable), "CP005 V12 downstream lifecycle lock violated");

const difficulty = {
  EASY: rows.filter((row) => row.difficulty === "EASY").length,
  MEDIUM: rows.filter((row) => row.difficulty === "MEDIUM").length,
  HARD: rows.filter((row) => row.difficulty === "HARD").length,
};
assert(difficulty.EASY === 24 && difficulty.MEDIUM === 36 && difficulty.HARD === 18, `CP005 V12 difficulty mix changed: ${JSON.stringify(difficulty)}`);

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP005_ENGLISH_REVIEW_CANDIDATE_V12",
  selectedQuestions: rows.length,
  auditQuestions: audit.length,
  learnerQLs: 13,
  learnerSolveModes: 20,
  minNormalizedStemStructuresPerQl: Math.min(...[...new Set(rows.map((row) => row.permanentQlId))].map((ql) => new Set(rows.filter((row) => row.permanentQlId === ql).map((row) => normalizeStem(row.stem))).size)),
  averageExplanationWords: Number(averageExplanationWords.toFixed(1)),
  maxExplanationWords: Math.max(...explanationLengths),
  explanationStepsPerQuestion: 2,
  mathSurfaceIdenticalToV11: true,
  difficulty,
  englishFreezeStatus: "UNFROZEN",
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
}, null, 2));
