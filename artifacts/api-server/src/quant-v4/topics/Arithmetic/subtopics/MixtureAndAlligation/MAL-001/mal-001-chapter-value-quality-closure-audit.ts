import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAL_CP002_PERMANENT_ALLOCATION } from "./foundation/cp002-permanent-runtime";
import { runMalCp002EnglishChapterClosureV3Pipeline } from "./foundation/cp002-chapter-closure-runtime-v3";
import { MAL_CP003_PERMANENT_ALLOCATION } from "./foundation/cp003-permanent-runtime";
import { runMalCp003EnglishEditorialV2Pipeline } from "./foundation/cp003-release-editorial-v2";
import { MAL_CP004_PERMANENT_ALLOCATION } from "./foundation/cp004-permanent-runtime";
import { runMalCp004EnglishChapterClosureV8Pipeline } from "./foundation/cp004-chapter-closure-runtime-v8";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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

function assertCp002ValueQuality(question: {
  questionId: string;
  permanentQlId: string;
  stem: string;
}): void {
  for (const match of question.stem.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    assert(
      Math.max(Number(match[1]), Number(match[2])) <= 250,
      `${question.questionId}: CP002 ratio component exceeds 250.`,
    );
  }
  if (question.permanentQlId === "MAL-QL-026") {
    assert(
      !/\\frac\{\d+\}\{\d+\}[^.!?]*(?:kg|litres?)/u.test(question.stem),
      `${question.questionId}: Easy CP002 invariance uses an unnecessary fractional removal.`,
    );
  }
}

function assertCp003ValueQuality(question: {
  questionId: string;
  stem: string;
  options: string[];
}): void {
  const learnerChoices = [question.stem, ...question.options].join(" ");
  for (const match of learnerChoices.matchAll(/\b(\d+)\/(\d+)\b/gu)) {
    assert(
      Number(match[2]) <= 32,
      `${question.questionId}: CP003 learner fraction denominator exceeds 32.`,
    );
  }
  for (const match of question.stem.matchAll(/\b(\d+)\s*:\s*(\d+)\b/gu)) {
    assert(
      Math.max(Number(match[1]), Number(match[2])) <= 300,
      `${question.questionId}: CP003 stem ratio component exceeds 300.`,
    );
  }
}

function assertCp004ValueQuality(question: {
  questionId: string;
  stem: string;
  options: string[];
  answer: string;
}): void {
  const learnerChoices = [question.stem, ...question.options, question.answer].join(" ");
  for (const match of learnerChoices.matchAll(/(?<!\d)(\d+)\/(\d+)(?!\d)/gu)) {
    assert(
      Number(match[2]) <= 20,
      `${question.questionId}: CP004 learner fraction denominator exceeds 20.`,
    );
  }
  for (const match of learnerChoices.matchAll(/\\frac\{(\d+)\}\{(\d+)\}/gu)) {
    assert(
      Number(match[2]) <= 20,
      `${question.questionId}: CP004 MathJax fraction denominator exceeds 20.`,
    );
  }
}

for (const allocation of MAL_CP002_PERMANENT_ALLOCATION) {
  const states = new Set<string>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  for (let index = 0; index < samplesPerQl; index += 1) {
    const question = runMalCp002EnglishChapterClosureV3Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-001-value-quality:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}: CP002 identity drift.`);
    assertOptionPackage(question);
    assertCp002ValueQuality(question);
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
    const question = runMalCp003EnglishEditorialV2Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-001-value-quality:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}: CP003 identity drift.`);
    assertOptionPackage(question);
    assertCp003ValueQuality(question);
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
    const question = runMalCp004EnglishChapterClosureV8Pipeline({
      questionLanguageId: allocation.qlId,
      seed: `mal-001-value-quality:${allocation.qlId}:${index}`,
      language: "en",
    });
    assert(question.permanentQlId === allocation.qlId, `${allocation.qlId}: CP004 identity drift.`);
    assertOptionPackage(question);
    assertCp004ValueQuality(question);
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

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-001-chapter-value-quality-closure.json");
const markdownPath = resolve(outputDirectory, "MAL-001-CHAPTER-VALUE-QUALITY-CLOSURE-36Q.md");

const summary = {
  status: "PASS_MAL_001_CHAPTER_VALUE_QUALITY_CLOSURE",
  runtimeCandidates: {
    cp002: "MAL-CP002-EN-CHAPTER-CLOSURE-RUNTIME-V3",
    cp003: "MAL-CP003-EN-CHAPTER-CLOSURE-EDITORIAL-V2",
    cp004: "MAL-CP004-EN-CHAPTER-CLOSURE-RUNTIME-V8",
  },
  qlCount: 36,
  samplesPerQl,
  generated,
  evidence,
  lifecycle: "REVIEW_ONLY_CHAPTER_CLOSURE_EVIDENCE",
};
writeFileSync(jsonPath, `${JSON.stringify({ ...summary, review }, null, 2)}\n`, "utf8");

const lines = [
  "# MAL-001 — Chapter Value-Quality Closure 36Q",
  "",
  "> Review-only evidence for CP002 V3, CP003 V2 and CP004 V8. Existing seed-stable production/editorial authorities remain unchanged unless separately approved.",
  "",
  `Generated proof: ${generated} questions (${samplesPerQl} per QL).`,
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
