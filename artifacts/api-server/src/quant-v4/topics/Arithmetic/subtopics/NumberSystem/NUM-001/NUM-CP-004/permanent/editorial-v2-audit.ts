import fs from "node:fs";
import path from "node:path";
import { NUM_CP004_PERMANENT_QL_IDS } from "./allocation";
import {
  NUM_CP004_EDITORIAL_V2_RELEASE,
  type NumCp004EditorialV2Question,
} from "./editorial-v2";
import { runNumCp004EditorialV2Final } from "./editorial-v2-final";

const SEEDS_PER_QL = 80;
const REVIEW_SEEDS = [1, 2, 3, 4] as const;
const OUTPUT_DIR = path.resolve("dist/quant-v4/num-cp004-editorial-v2");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalized(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function learnerSurface(question: NumCp004EditorialV2Question): string {
  const optionText = question.options.map((option) => option.value).join(" | ");
  return normalized(`${question.stem} :: ${optionText}`);
}

function explanationText(question: NumCp004EditorialV2Question): string {
  return normalized([
    question.explanation.concept,
    ...question.explanation.solution,
    question.explanation.finalAnswer,
  ].join(" "));
}

function auditQuestion(question: NumCp004EditorialV2Question): void {
  const tag = `${question.permanentQlId}/${question.seed}`;
  assert(question.editorialVersion === "NUM-CP-004-EDITORIAL-V2", `${tag}: wrong editorial version`);
  assert(question.reviewStatus === "EDITORIAL_V2_CONTROLLED_REVIEW", `${tag}: wrong review status`);
  assert(question.maturity === "EDITORIAL_REVIEW", `${tag}: wrong maturity`);
  assert(question.allocationStatus === "EDITORIAL_V2_CONTROLLED_REVIEW", `${tag}: wrong allocation status`);
  assert(question.explanation.concept.startsWith("This question tests "), `${tag}: concept does not identify tested skill`);
  assert(question.explanation.solution.length >= 2 && question.explanation.solution.length <= 4, `${tag}: solution must contain 2-4 lines`);
  assert(question.explanation.solution[0]!.startsWith("Rule:"), `${tag}: solution does not teach the rule first`);
  assert(question.explanation.finalAnswer === question.canonicalAnswer, `${tag}: final answer mismatch`);
  assert(question.options.length === 4, `${tag}: expected four options`);
  assert(question.options[question.correctIndex]?.value === question.canonicalAnswer, `${tag}: correct-index mismatch`);
  assert(question.options.filter((option) => option.isCorrect).length === 1, `${tag}: expected one correct option`);
  assert(new Set(question.options.map((option) => option.value)).size === 4, `${tag}: options are not unique`);

  const text = explanationText(question);
  const rejected = [
    /required direction or interval is encoded in the question/iu,
    /requested metric/iu,
    /use its positive-divisor structure/iu,
    /resulting class/iu,
    /candidate:HCF/iu,
    /possible value\(s\)/iu,
    /exam speed method/iu,
    /common traps/iu,
    /misconceptionId/iu,
    /NUM-CP004/iu,
    /NUM-QL-/iu,
  ];
  for (const pattern of rejected) {
    assert(!pattern.test(text), `${tag}: rejected legacy/meta wording leaked: ${pattern}`);
  }

  assert(!question.lifecycle.active, `${tag}: active lifecycle leaked`);
  assert(!question.lifecycle.questionStudioDiscoverable, `${tag}: Question Studio exposure leaked`);
  assert(!question.lifecycle.questionBankWritable, `${tag}: Question Bank exposure leaked`);
  assert(!question.lifecycle.testEligible, `${tag}: test exposure leaked`);
  assert(!question.lifecycle.publiclyPublishable, `${tag}: public exposure leaked`);
}

function toReviewRow(question: NumCp004EditorialV2Question) {
  return {
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    difficulty: question.difficulty,
    stem: question.stem,
    options: question.options.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      value: option.value,
      isCorrect: option.isCorrect,
    })),
    correctIndex: question.correctIndex,
    answer: question.canonicalAnswer,
    concept: question.explanation.concept,
    solution: question.explanation.solution,
    finalAnswer: question.explanation.finalAnswer,
  };
}

function markdown(rows: ReturnType<typeof toReviewRow>[]): string {
  const lines: string[] = [
    "# NUM-CP-004 — English Editorial V2 Rule-First Review",
    "",
    "**Explanation contract:** Concept → Rule-first Solution → Answer",
    "",
    "Each solution must first teach the governing rule in simple language, then apply it to the exact values in the question.",
    "",
  ];
  rows.forEach((row, index) => {
    lines.push(`## ${index + 1}. ${row.permanentQlId} — seed ${row.seed} — ${row.difficulty}`);
    lines.push("");
    lines.push(row.stem);
    lines.push("");
    row.options.forEach((option) => {
      lines.push(`${option.label}. ${option.value}${option.isCorrect ? " **✓**" : ""}`);
    });
    lines.push("");
    lines.push(`**Answer:** ${row.answer}`);
    lines.push("");
    lines.push("### Concept");
    lines.push("");
    lines.push(row.concept);
    lines.push("");
    lines.push("### Solution");
    lines.push("");
    row.solution.forEach((line, lineIndex) => lines.push(`${lineIndex + 1}. ${line}`));
    lines.push("");
    lines.push(`**Final answer:** ${row.finalAnswer}`);
    lines.push("");
    lines.push("---");
    lines.push("");
  });
  return `${lines.join("\n")}\n`;
}

const reviewRows: ReturnType<typeof toReviewRow>[] = [];
const surfaces = new Set<string>();
const explanations = new Set<string>();
let auditedQuestions = 0;
let maxExplanationChars = 0;

for (const questionLanguageId of NUM_CP004_PERMANENT_QL_IDS) {
  for (let seed = 1; seed <= SEEDS_PER_QL; seed += 1) {
    const question = runNumCp004EditorialV2Final({ questionLanguageId, seed, language: "en" });
    auditQuestion(question);
    auditedQuestions += 1;
    surfaces.add(learnerSurface(question));
    const explanation = explanationText(question);
    explanations.add(explanation);
    maxExplanationChars = Math.max(maxExplanationChars, explanation.length);
    if (REVIEW_SEEDS.includes(seed as (typeof REVIEW_SEEDS)[number])) reviewRows.push(toReviewRow(question));
  }
}

assert(auditedQuestions === NUM_CP004_PERMANENT_QL_IDS.length * SEEDS_PER_QL, "Unexpected audited-question count");
assert(reviewRows.length === NUM_CP004_PERMANENT_QL_IDS.length * REVIEW_SEEDS.length, "Unexpected review-row count");
assert(surfaces.size >= Math.floor(auditedQuestions * 0.9), "Learner-surface diversity unexpectedly low");
assert(explanations.size >= Math.floor(auditedQuestions * 0.85), "Explanation diversity unexpectedly low");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const audit = {
  status: "PASS_NUM_CP004_EDITORIAL_V2_RULE_FIRST_AUDIT",
  auditedQuestions,
  permanentQlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  reviewQuestionCount: reviewRows.length,
  reviewQuestionsPerQl: REVIEW_SEEDS.length,
  uniqueLearnerSurfaces: surfaces.size,
  uniqueExplanations: explanations.size,
  maxExplanationChars,
  ruleFirstTeachingViolations: 0,
  legacyExplanationLeaks: 0,
  internalIdentityLeaks: 0,
  lifecycle: NUM_CP004_EDITORIAL_V2_RELEASE,
};

fs.writeFileSync(path.join(OUTPUT_DIR, "num-cp004-editorial-v2-audit.json"), JSON.stringify(audit, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, "num-cp004-editorial-v2-112q-review.json"), JSON.stringify({ audit, rows: reviewRows }, null, 2));
fs.writeFileSync(path.join(OUTPUT_DIR, "num-cp004-editorial-v2-112q-review.md"), markdown(reviewRows));

console.log(JSON.stringify({
  ...audit,
  jsonPath: path.join(OUTPUT_DIR, "num-cp004-editorial-v2-112q-review.json"),
  markdownPath: path.join(OUTPUT_DIR, "num-cp004-editorial-v2-112q-review.md"),
  auditPath: path.join(OUTPUT_DIR, "num-cp004-editorial-v2-audit.json"),
}, null, 2));
