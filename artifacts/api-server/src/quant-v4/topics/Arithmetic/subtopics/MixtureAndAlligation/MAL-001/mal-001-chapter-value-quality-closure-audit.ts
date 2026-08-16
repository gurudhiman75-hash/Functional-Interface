import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAL_CP002_PERMANENT_ALLOCATION } from "./foundation/cp002-permanent-runtime";
import { runMalCp002EnglishChapterClosureV4Pipeline } from "./foundation/cp002-chapter-closure-runtime-v4";
import { MAL_CP003_PERMANENT_ALLOCATION } from "./foundation/cp003-permanent-runtime";
import { runMalCp003EnglishEditorialV3Pipeline } from "./foundation/cp003-release-editorial-v3";
import { MAL_CP004_PERMANENT_ALLOCATION } from "./foundation/cp004-permanent-runtime";
import { runMalCp004EnglishChapterClosureV9Pipeline } from "./foundation/cp004-chapter-closure-runtime-v9";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

const samplesPerQl = 50;
const review: unknown[] = [];
const evidence: Array<{
  cpId: string;
  qlId: string;
  states: number;
  stems: number;
  answers: number;
}> = [];
let generated = 0;
let realismChecks = 0;

function assertOptionPackage(question: {
  questionId: string;
  options: string[];
  correctIndex: number;
  answer: string;
}): void {
  assert(question.options.length === 4, `${question.questionId}: expected four options.`);
  assert(new Set(question.options).size === 4, `${question.questionId}: duplicate options.`);
  assert(
    question.options[question.correctIndex] === question.answer,
    `${question.questionId}: answer/index mismatch.`,
  );
}

function assertReducedSmallRatios(questionId: string, learnerChoices: string): void {
  for (const match of learnerChoices.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    const left = Number(match[1]);
    const right = Number(match[2]);
    assert(
      Math.max(left, right) <= 99,
      `${questionId}: synthetic large learner-visible ratio survived (${match[0]}).`,
    );
    assert(
      left === 0 || right === 0 || gcd(left, right) === 1,
      `${questionId}: unreduced learner-visible ratio survived (${match[0]}).`,
    );
    realismChecks += 2;
  }
}

function hasFractionalQuantity(stem: string): boolean {
  return /(?:\\frac\{\d+\}\{\d+\}|\b\d+\s+\d+\/\d+)\s*(?:\\,\\text\{(?:kg|litres?)\}|kg|litres?)/u.test(
    stem,
  );
}

function assertEasyMagnitudeAndQuantity(
  questionId: string,
  stem: string,
): void {
  for (const match of stem.matchAll(/\b\d+\b/gu)) {
    assert(
      Number(match[0]) <= 250,
      `${questionId}: Easy question contains an unnecessarily large value above 250 (${match[0]}).`,
    );
    realismChecks += 1;
  }
  assert(
    !hasFractionalQuantity(stem),
    `${questionId}: Easy question contains an unnecessary fractional quantity.`,
  );
  realismChecks += 1;
}

function assertMixedQuantityDenominator(
  questionId: string,
  learnerChoices: string,
  maximum: number,
): void {
  for (const match of learnerChoices.matchAll(/\b\d+\s+(\d+)\/(\d+)\s+(?:kg|litres?)\b/gu)) {
    assert(
      Number(match[2]) <= maximum,
      `${questionId}: mixed quantity denominator exceeds ${maximum} (${match[0]}).`,
    );
    realismChecks += 1;
  }
}

function assertMixedPercentDenominator(
  questionId: string,
  learnerChoices: string,
  maximum: number,
): void {
  for (const match of learnerChoices.matchAll(/\b\d+\s+(\d+)\/(\d+)%/gu)) {
    assert(
      Number(match[2]) <= maximum,
      `${questionId}: mixed percentage denominator exceeds ${maximum} (${match[0]}).`,
    );
    realismChecks += 1;
  }
}

for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  const states = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  for (let index = 0; index < samplesPerQl; index += 1) {
    const question = runMalCp002EnglishChapterClosureV4Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-001-value-quality-v2:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}: CP002 identity drift.`);
    assertOptionPackage(question);
    const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
    assertReducedSmallRatios(question.questionId, learnerChoices);
    if (allocation.difficulty === "Easy") {
      assertEasyMagnitudeAndQuantity(question.questionId, question.stem);
    }
    states.add(question.stateKey);
    stems.add(question.stem);
    answers.add(question.answer);
    generated += 1;
    if (index === 0) review.push(question);
  }
  assert(stems.size >= 4, `${allocation.qlId}: CP002 stem diversity collapsed.`);
  assert(answers.size >= 2, `${allocation.qlId}: CP002 answer diversity collapsed.`);
  evidence.push({ cpId: "MAL-CP-002", qlId: allocation.qlId, states: states.size, stems: stems.size, answers: answers.size });
}

for (const allocation of MAL_CP003_PERMANENT_ALLOCATION) {
  const states = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  for (let index = 0; index < samplesPerQl; index += 1) {
    const question = runMalCp003EnglishEditorialV3Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-001-value-quality-v2:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}: CP003 identity drift.`);
    assertOptionPackage(question);
    const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
    assertReducedSmallRatios(question.questionId, learnerChoices);
    assertMixedQuantityDenominator(question.questionId, learnerChoices, 12);
    assert(!/\b1 operations\b/iu.test(learnerChoices), `${question.questionId}: singular operation grammar survived.`);
    realismChecks += 1;
    states.add(question.stateKey);
    stems.add(question.stem);
    answers.add(question.answer);
    generated += 1;
    if (index === 0) review.push(question);
  }
  assert(stems.size >= 4, `${allocation.qlId}: CP003 stem diversity collapsed.`);
  assert(answers.size >= 2, `${allocation.qlId}: CP003 answer diversity collapsed.`);
  evidence.push({ cpId: "MAL-CP-003", qlId: allocation.qlId, states: states.size, stems: stems.size, answers: answers.size });
}

for (const allocation of MAL_CP004_PERMANENT_ALLOCATION) {
  const states = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  for (let index = 0; index < samplesPerQl; index += 1) {
    const question = runMalCp004EnglishChapterClosureV9Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-001-value-quality-v2:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}: CP004 identity drift.`);
    assertOptionPackage(question);
    const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
    assertMixedQuantityDenominator(question.questionId, learnerChoices, 12);
    assertMixedPercentDenominator(question.questionId, learnerChoices, 12);
    if (allocation.difficulty === "Easy") {
      assertEasyMagnitudeAndQuantity(question.questionId, question.stem);
    }
    states.add(question.stateKey);
    stems.add(question.stem);
    answers.add(question.answer);
    generated += 1;
    if (index === 0) review.push(question);
  }
  assert(stems.size >= 4, `${allocation.qlId}: CP004 stem diversity collapsed.`);
  assert(answers.size >= 2, `${allocation.qlId}: CP004 answer diversity collapsed.`);
  evidence.push({ cpId: "MAL-CP-004", qlId: allocation.qlId, states: states.size, stems: stems.size, answers: answers.size });
}

assert(generated === 1800, `Expected 1,800 value-quality questions, received ${generated}.`);
assert(review.length === 36, `Expected 36 retained value-quality review questions, received ${review.length}.`);
assert(realismChecks > 0, "Exam-realism checks did not execute.");

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-001-chapter-value-quality-closure.json");
const markdownPath = resolve(outputDirectory, "MAL-001-CHAPTER-VALUE-QUALITY-CLOSURE-36Q.md");

const summary = {
  status: "PASS_MAL_001_CHAPTER_VALUE_QUALITY_CLOSURE_V3",
  runtimeCandidates: {
    cp002: "MAL-CP002-EN-CHAPTER-CLOSURE-RUNTIME-V4",
    cp003: "MAL-CP003-EN-CHAPTER-CLOSURE-EDITORIAL-V3",
    cp004: "MAL-CP004-EN-CHAPTER-CLOSURE-RUNTIME-V9",
  },
  qlCount: 36,
  samplesPerQl,
  generated,
  realismChecks,
  policy: {
    learnerVisibleRatioComponentMaximum: 99,
    learnerVisibleRatiosMustBeReduced: true,
    easyMaximumAbsoluteInteger: 250,
    easyFractionalQuantitiesAllowed: false,
    mixedQuantityDenominatorMaximum: 12,
    mixedPercentDenominatorMaximum: 12,
    singularOperationGrammar: true,
  },
  evidence,
  lifecycle: "REVIEW_ONLY_CHAPTER_CLOSURE_EVIDENCE",
};
writeFileSync(
  jsonPath,
  `${JSON.stringify(
    { ...summary, review },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const lines = [
  "# MAL-001 — Exam-Realistic Value Closure 36Q",
  "",
  "> Review-only evidence for CP002 V4, CP003 V3 and CP004 V9. Existing seed-stable Question Studio authorities remain unchanged unless separately approved.",
  "",
  `Generated proof: ${generated} questions (${samplesPerQl} per QL).`,
  `Executed exam-realism assertions: ${realismChecks}.`,
  "",
  "Policy: every learner-visible 2-way ratio is reduced with components ≤99; Easy stems keep integers ≤250 and avoid fractional quantities; mixed quantity/percentage denominators are ≤12; singular operation counts use singular grammar.",
  "",
];
for (const question of review as any[]) {
  lines.push(
    `## ${question.permanentQlId} — ${question.stem}`,
    "",
    ...question.options.map((option: string, index: number) => `${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${question.answer}`,
    "",
  );
}
writeFileSync(markdownPath, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
