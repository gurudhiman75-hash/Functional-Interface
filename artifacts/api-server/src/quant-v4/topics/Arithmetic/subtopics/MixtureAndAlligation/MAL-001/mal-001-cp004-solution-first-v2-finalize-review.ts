import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  runMalCp004EnglishAlligationV2Pipeline,
  type MalCp004AlligationQuestion,
} from "./foundation/cp004-alligation-help-v2";
import {
  MAL_CP004_PERMANENT_ALLOCATION,
  type MalCp004PermanentQlId,
} from "./foundation/cp004-permanent-runtime";
import type { MalCp004ClutterFreeQuestion } from "./foundation/cp004-clutter-free-editorial-v2";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, entry) =>
    typeof entry === "bigint" ? `${entry}n` : entry,
  );
}

function assertGrammar(question: MalCp004ClutterFreeQuestion): void {
  const prefix = `${question.permanentQlId}/${question.seed}`;
  const forbidden = [
    /\bA (?:8\d*|18\d*|11)(?=[\s%-])/u,
    /\ba (?:8\d*|18\d*|11)(?=[\s%-])/u,
    /\ba alcohol\b/iu,
    /\blitres of solution contains\b/iu,
    /\blitres of water evaporates\b/iu,
    /\blitres evaporates\b/iu,
    /\blitres of water is lost\b/iu,
    /\bthe (?:raisins|dried grapes) contains\b/iu,
    /After drying, [0-9][^,]*? kg of [^.]+? contains/iu,
    /For a processing vessel, a container initially contains/iu,
    /^chemical A\b/u,
    /\bcomplete solution\b/iu,
    /Only the water quantity changes/iu,
    /\bstrength\b/iu,
    /For a stored solution, a solution/iu,
    /final dried .+ weighs/iu,
    /how much fresh .+ was/iu,
    /During food processing[^?]*timber/iu,
  ];
  for (const pattern of forbidden) {
    assert(!pattern.test(question.stem), `${prefix}: grammar pattern remains: ${pattern}.`);
  }
  const given = question.reasoningGraph.nodes.find((node) => node.kind === "GIVEN");
  assert(given?.text === question.stem, `${prefix}: reasoning graph has stale stem text.`);
}

function assertAlligationPolicy(question: MalCp004AlligationQuestion): boolean {
  const expected =
    question.permanentQlId === "MAL-QL-041" ||
    question.permanentQlId === "MAL-QL-042";
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  assert(
    expected === Boolean(alternative),
    `${question.permanentQlId}/${question.seed}: alligation applicability is wrong.`,
  );
  if (!alternative) return false;
  assert(
    alternative.title === "Alternative method: Alligation cross" &&
      alternative.crossLines.length === 3,
    `${question.permanentQlId}/${question.seed}: alligation cross is incomplete.`,
  );
  assert(
    alternative.calculation.includes(question.answer.replace(/\s+(?:litres|kg)$/u, "")),
    `${question.permanentQlId}/${question.seed}: alligation does not reach the answer.`,
  );
  return true;
}

let grammarAuditCount = 0;
let runtimeAlligationCount = 0;
for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  for (let index = 0; index < 200; index += 1) {
    const question = runMalCp004EnglishAlligationV2Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-cp004-solution-first-v2:${allocation.qlId}:${index}`,
      language: "en",
    });
    assertGrammar(question);
    if (assertAlligationPolicy(question)) runtimeAlligationCount += 1;
    grammarAuditCount += 1;
  }
}
assert(grammarAuditCount === 2_000, "Grammar audit did not cover 2,000 questions.");
assert(
  runtimeAlligationCount === 400,
  `Expected 400 applicable alligation questions, received ${runtimeAlligationCount}.`,
);

const outputDir = resolve(process.cwd(), "dist/quant-v4");
const jsonPath = resolve(outputDir, "mal-cp004-solution-first-v2-review.json");
const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as {
  releaseId: string;
  runtimeId: string;
  presentationRuntimeId: string;
  presentationId: string;
  permanentQlRange: string;
  questionCount: number;
  answerPositionCounts: number[];
  reviewRows: MalCp004ClutterFreeQuestion[];
};

const reviewRows = raw.reviewRows.map((row) =>
  runMalCp004EnglishAlligationV2Pipeline({
    questionLanguageId: row.permanentQlId as MalCp004PermanentQlId,
    seed: row.seed,
    language: "en",
  }),
);
let reviewAlligationCount = 0;
for (const question of reviewRows) {
  assertGrammar(question);
  if (assertAlligationPolicy(question)) reviewAlligationCount += 1;
}
assert(reviewRows.length === 100, "Final review pack does not contain 100 questions.");
assert(
  new Set(reviewRows.map((question) => question.mathematicalFingerprint)).size === 100,
  "Final review pack repeats a mathematical state.",
);
assert(
  reviewAlligationCount === 20,
  `Expected 20 review alligation crosses, received ${reviewAlligationCount}.`,
);
const answerPositionCounts = [0, 0, 0, 0];
for (const question of reviewRows) answerPositionCounts[question.correctIndex] += 1;
assert(
  answerPositionCounts.join(",") === "25,25,25,25",
  `Final answer positions changed: ${answerPositionCounts.join(",")}.`,
);

writeFileSync(
  jsonPath,
  `${stable({
    ...raw,
    answerPositionCounts,
    alligationQuestionCount: reviewAlligationCount,
    reviewRows,
  })}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-004 Solution-First English V2 — Human Review",
  "",
  `Release candidate: \`${raw.releaseId}\``,
  "",
  "The exact mathematics, answer and permanent QL identity remain unchanged. V2 improves the stem, distractors and learner-facing solution.",
  "",
  "This review contains ten distinct numerical states per QL and exactly 25 correct answers in each option position.",
  "",
  "Alligation cross is shown under More help only for MAL-QL-041 and MAL-QL-042, where the second ingredient is 0% water or 100% pure solute.",
  "",
];
for (const [index, question] of reviewRows.entries()) {
  markdown.push(
    `## ${index + 1}. ${question.permanentQlId}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`,
    ),
    "",
    `**Correct answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Solution",
    "",
    ...question.explanation.solution.map((line) => `- ${line}`),
    "",
    `**Answer:** ${question.explanation.answer}`,
    "",
    "<details>",
    "<summary>More help — collapsed in the product</summary>",
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
  );
  const alternative = question.explanation.optionalHelp.alternativeMethod;
  if (alternative) {
    markdown.push(
      `**${alternative.title}**`,
      "",
      "```text",
      ...alternative.crossLines,
      "```",
      "",
      `**${alternative.ratioLabel}:** ${alternative.ratio}`,
      "",
      alternative.calculation,
      "",
      alternative.result,
      "",
    );
  }
  if (question.explanation.optionalHelp.verification) {
    markdown.push("**Verification**", "", question.explanation.optionalHelp.verification, "");
  }
  markdown.push("</details>", "", "---", "");
}
writeFileSync(
  resolve(outputDir, "MAL-CP-004-SOLUTION-FIRST-V2-100Q-REVIEW.md"),
  `${markdown.join("\n")}\n`,
  "utf8",
);

console.log("PASS_MAL_CP004_SOLUTION_FIRST_V2_GRAMMAR_AND_ALLIGATION");
console.log(
  JSON.stringify({
    grammarAuditCount,
    runtimeAlligationCount,
    reviewQuestionCount: reviewRows.length,
    reviewAlligationCount,
    uniqueReviewStateCount: 100,
    answerPositionCounts,
  }),
);
