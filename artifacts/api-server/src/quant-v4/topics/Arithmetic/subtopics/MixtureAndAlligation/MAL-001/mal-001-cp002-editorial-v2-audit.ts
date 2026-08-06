import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateQuestion as generateQuestionStudioQuestion } from "../../../../../question-studio-generation-engine";
import {
  MAL_CP002_PERMANENT_ALLOCATION,
  runMalCp002EnglishReleasePipeline,
  type MalCp002ReleasedQuestion,
} from "./foundation/cp002-permanent-runtime";
import {
  MAL_CP002_EDITORIAL_V2,
  MAL_CP002_EDITORIAL_V2_ID,
  runMalCp002EnglishEditorialV2Pipeline,
} from "./foundation/cp002-editorial-v2";
import { MAL_CP002_CONTEXT_LIBRARY } from "./foundation/cp002-context-library";
import { runMalCp001EnglishReleasePipeline } from "./foundation/cp001-release";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    typeof item === "bigint" ? `${item}n` : item,
  );
}

function learnerText(question: MalCp002ReleasedQuestion): string {
  return [
    question.stem,
    question.explanation.coreConcept,
    question.explanation.formula,
    ...question.explanation.steps,
    question.explanation.verification,
    question.explanation.conclusion,
    question.explanation.examShortcut,
    question.explanation.commonTrap,
  ].join("\n");
}

function proseOutsideMath(value: string): string {
  return value
    .replace(/\\\[[\s\S]*?\\\]/gu, " ")
    .replace(/\\\([\s\S]*?\\\)/gu, " ");
}

function assertNoNumericLeak(
  questionId: string,
  label: string,
  value: string,
  stripStep = false,
): void {
  const normalized = stripStep ? value.replace(/^Step \d+:\s*/u, "") : value;
  const outside = proseOutsideMath(normalized);
  assert(
    !/\d/u.test(outside),
    `${questionId}: ${label} has a numeric value outside MathJax: ${outside}`,
  );
  assert(
    !/[=×÷−+]/u.test(outside),
    `${questionId}: ${label} has an arithmetic symbol outside MathJax: ${outside}`,
  );
}

const actorOpenings = MAL_CP002_CONTEXT_LIBRARY.map(
  (context) => context.actor.toLowerCase(),
);

function verifyEditorialQuestion(
  question: MalCp002ReleasedQuestion,
  base: MalCp002ReleasedQuestion,
): void {
  assert(question.answer === base.answer, `${question.questionId}: editorial pass changed the answer.`);
  assert(stable(question.options) === stable(base.options), `${question.questionId}: editorial pass changed the options.`);
  assert(question.correctIndex === base.correctIndex, `${question.questionId}: editorial pass changed the correct index.`);
  assert(stable(question.solution) === stable(base.solution), `${question.questionId}: editorial pass changed the solution.`);
  assert(question.mathematicalFingerprint === base.mathematicalFingerprint, `${question.questionId}: editorial pass changed the mathematical fingerprint.`);
  assert(question.explanationId.endsWith("CONSERVED-PART-MATHJAX-V2"), `${question.questionId}: V2 explanation identity is missing.`);
  assert((question.parameters as Record<string, unknown>).editorialVersion === MAL_CP002_EDITORIAL_V2_ID, `${question.questionId}: editorial metadata is missing.`);
  assert((question.parameters as Record<string, unknown>).alligationAllowed === false, `${question.questionId}: alligation was not explicitly disabled.`);

  const text = learnerText(question);
  const forbidden: Array<[RegExp, string]> = [
    [/\balligation\b/iu, "alligation"],
    [/\bpure\b/iu, "unnecessary pure-item wording"],
    [/\bfixed counterpart\b/iu, "fixed counterpart"],
    [/\bunaltered component\b/iu, "unaltered component"],
    [/\bunchanged component\b/iu, "unchanged component"],
    [/\bchanged component\b/iu, "changed component"],
    [/\bcounterpart\b/iu, "counterpart"],
    [/\|[^|\n]+\|/u, "raw absolute-value bars"],
    [/\b1 parts\b/iu, "1 parts"],
    [/\[cite(?:_start|:)|googleusercontent|immersive_entry_chip/iu, "citation debris"],
  ];
  for (const [pattern, label] of forbidden) {
    assert(!pattern.test(text), `${question.questionId}: learner text contains ${label}.`);
  }

  const lowerStem = question.stem.toLowerCase();
  assert(
    !actorOpenings.some((actor) => lowerStem.startsWith(actor)),
    `${question.questionId}: stem starts with a synthetic occupational role.`,
  );
  assert(question.stem.endsWith("?"), `${question.questionId}: stem is not interrogative.`);
  assertNoNumericLeak(question.questionId, "stem", question.stem);
  assert(question.explanation.formula.includes("\\["), `${question.questionId}: formula has no displayed MathJax.`);
  assertNoNumericLeak(question.questionId, "formula prose", question.explanation.formula);

  question.explanation.steps.forEach((step, index) => {
    assert(step.startsWith(`Step ${index + 1}:`), `${question.questionId}: worked steps are not sequential.`);
    assert(step.includes("\\(") || step.includes("\\["), `${question.questionId}: step ${index + 1} has no MathJax.`);
    assertNoNumericLeak(question.questionId, `step ${index + 1}`, step, true);
  });

  assertNoNumericLeak(question.questionId, "verification", question.explanation.verification);
  assertNoNumericLeak(question.questionId, "conclusion", question.explanation.conclusion);
  assertNoNumericLeak(question.questionId, "shortcut", question.explanation.examShortcut);

  assert(
    question.explanation.lines.some((line) => line.includes("EXAMTREE_RATIO_ADJUSTMENT_SVG_V1")),
    `${question.questionId}: conserved-part SVG directive is missing.`,
  );
  assert(
    !question.explanation.lines.some((line) => line.includes("EXAMTREE_ALLIGATION_SVG_V1")),
    `${question.questionId}: CP-002 contains an alligation SVG directive.`,
  );
  assert(
    question.diagram.kind === "TWO_COMPONENT" || question.diagram.kind === "THREE_COMPONENT",
    `${question.questionId}: ratio-adjustment diagram contract is invalid.`,
  );
}

let generatedQuestionCount = 0;
let deterministicReplayCount = 0;
let mathematicalIdentityCount = 0;
let questionStudioPreviewCount = 0;
const stemSet = new Set<string>();
const explanationSet = new Set<string>();
const openingSet = new Set<string>();
const reviewRows: Array<{
  reviewKey: string;
  qlId: string;
  familyId: string;
  question: MalCp002ReleasedQuestion;
}> = [];

for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `editorial-v2-${allocation.qlId}-${index}`;
    const base = runMalCp002EnglishReleasePipeline({ questionLanguageId: allocation.qlId, seed, language: "en" });
    const question = runMalCp002EnglishEditorialV2Pipeline({ questionLanguageId: allocation.qlId, seed, language: "en" });
    const replay = runMalCp002EnglishEditorialV2Pipeline({ questionLanguageId: allocation.qlId, seed, language: "en" });

    assert(stable(question) === stable(replay), `${question.questionId}: editorial V2 is not deterministic.`);
    deterministicReplayCount += 1;
    verifyEditorialQuestion(question, base);
    mathematicalIdentityCount += 1;
    generatedQuestionCount += 1;
    stemSet.add(question.stem);
    explanationSet.add(stable(question.explanation));
    openingSet.add(proseOutsideMath(question.stem).split(/\s+/u).slice(0, 6).join(" "));

    if (index < 4) {
      reviewRows.push({
        reviewKey: `${allocation.qlId}:editorial-v2-${index + 1}`,
        qlId: allocation.qlId,
        familyId: allocation.familyId,
        question,
      });
    }
  }

  const studio: any = await generateQuestionStudioQuestion({
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    questionLanguageId: allocation.qlId,
    difficulty: allocation.difficulty,
    language: "en",
    count: 2,
    seed: `editorial-v2-studio-${allocation.qlId}`,
  });
  assert(studio.questionPackages.length === 2 && studio.questions.length === 2, `${allocation.qlId}: Question Studio batch mismatch.`);
  for (const question of studio.questionPackages as MalCp002ReleasedQuestion[]) {
    assert(question.explanationId.endsWith("CONSERVED-PART-MATHJAX-V2"), `${allocation.qlId}: Question Studio did not use editorial V2.`);
    verifyEditorialQuestion(
      question,
      runMalCp002EnglishReleasePipeline({
        questionLanguageId: allocation.qlId,
        seed: question.seed,
        language: "en",
      }),
    );
    questionStudioPreviewCount += 1;
  }
}

assert(generatedQuestionCount === 1700, `Expected 1,700 questions, received ${generatedQuestionCount}.`);
assert(deterministicReplayCount === 1700, "Deterministic replay count mismatch.");
assert(mathematicalIdentityCount === 1700, "Mathematical identity count mismatch.");
assert(reviewRows.length === 68, `Expected 68 review rows, received ${reviewRows.length}.`);
assert(stemSet.size >= 1500, `Stem diversity is too low: ${stemSet.size}.`);
assert(explanationSet.size >= 1500, `Explanation diversity is too low: ${explanationSet.size}.`);
assert(openingSet.size >= 12, `Natural stem-opening diversity is too low: ${openingSet.size}.`);

const cp001 = runMalCp001EnglishReleasePipeline({
  questionLanguageId: "MAL-QL-001",
  seed: "cp002-editorial-v2-cp001-regression",
  language: "en",
});
assert(
  cp001.explanation.lines.some((line) => line.includes("EXAMTREE_ALLIGATION_SVG_V1")),
  "CP-001 lost its structured alligation cross.",
);
assert(cp001.validation.ok, "CP-001 release regression failed.");

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });
const jsonPath = resolve(outputDir, "mal-cp002-editorial-v2-review.json");
const markdownPath = resolve(outputDir, "mal-cp002-editorial-v2-review.md");

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "MAL_CP002_EDITORIAL_V2_REVIEW",
      authority: MAL_CP002_EDITORIAL_V2,
      reviewQuestionCount: reviewRows.length,
      rows: reviewRows,
    },
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
    2,
  )}\n`,
  "utf8",
);

const markdown: string[] = [
  "# MAL-CP-002 English Editorial V2 Review",
  "",
  `Editorial authority: \`${MAL_CP002_EDITORIAL_V2_ID}\``,
  `Review questions: **${reviewRows.length}**`,
  "",
  "## Mandatory rules",
  "",
  "- Conserved-ratio-part method; no alligation in MAL-CP-002.",
  "- Natural competitive-exam stem voice.",
  "- Full MathJax working with directed addition/removal arithmetic.",
  "- No engine jargon, synthetic roles, raw absolute bars or citation debris.",
  "",
];

for (const row of reviewRows) {
  const question = row.question;
  markdown.push(
    `## ${row.reviewKey} — ${row.familyId}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${question.answer}`,
    "",
    question.explanation.sectionTitles.coreConcept,
    "",
    question.explanation.coreConcept,
    "",
    question.explanation.formula,
    "",
    question.explanation.sectionTitles.steps,
    "",
    ...question.explanation.steps,
    "",
    `**Quick check:** ${question.explanation.verification}`,
    "",
    `**Final answer:** ${question.explanation.conclusion}`,
    "",
    question.explanation.sectionTitles.shortcut,
    "",
    question.explanation.examShortcut,
    "",
    question.explanation.sectionTitles.trap,
    "",
    question.explanation.commonTrap,
    "",
    "---",
    "",
  );
}

writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP002_EDITORIAL_V2",
      editorialId: MAL_CP002_EDITORIAL_V2_ID,
      permanentQlCount: MAL_CP002_PERMANENT_ALLOCATION.length,
      generatedQuestionCount,
      deterministicReplayCount,
      mathematicalIdentityCount,
      distinctStemCount: stemSet.size,
      distinctExplanationCount: explanationSet.size,
      naturalOpeningCount: openingSet.size,
      reviewQuestionCount: reviewRows.length,
      questionStudioPreviewCount,
      cp001StructuredAlligationRegression: true,
      reviewJson: jsonPath,
      reviewMarkdown: markdownPath,
    },
    null,
    2,
  ),
);
