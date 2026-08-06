import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";
import {
  localizeClsCp006Question,
  type GeneratedClsCp006LocalizedQuestion,
} from "./localization/cp006-localizer";
import type { ClsCp006TranslatedLocale } from "./localization/cp006-language-pack";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp006-localisation-review",
);
const qlIds: readonly ClsCp006EnglishQlId[] = [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
];
const locales: readonly ClsCp006TranslatedLocale[] = ["hi-IN", "pa-IN"];
const optionCounts = [4, 5] as const;

function firstSeedByRule(
  qlId: ClsCp006EnglishQlId,
): ReadonlyMap<string, number> {
  const expectedRuleCount = qlId === CLS_CP006_ODD_LETTER_QL_ID ? 3 : 5;
  const seeds = new Map<string, number>();
  for (let seed = 0; seed < 1000 && seeds.size < expectedRuleCount; seed += 1) {
    const question = generateClsCp006EnglishQuestion(qlId, seed, 4);
    if (!seeds.has(question.intendedRuleId)) {
      seeds.set(question.intendedRuleId, seed);
    }
  }
  assert.equal(
    seeds.size,
    expectedRuleCount,
    `${qlId} did not expose every CP-006 rule for localisation review`,
  );
  return seeds;
}

type ReviewRow = {
  readonly locale: ClsCp006TranslatedLocale;
  readonly canonicalSeed: number;
  readonly requestedOptionCount: 4 | 5;
  readonly question: GeneratedClsCp006LocalizedQuestion;
};

const rows: ReviewRow[] = [];
for (const qlId of qlIds) {
  const seeds = firstSeedByRule(qlId);
  for (const [ruleId, seed] of [...seeds.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    for (const optionCount of optionCounts) {
      const english = generateClsCp006EnglishQuestion(qlId, seed, optionCount);
      assert.equal(english.intendedRuleId, ruleId);
      assert.equal(english.options.length, optionCount);
      for (const locale of locales) {
        rows.push({
          locale,
          canonicalSeed: seed,
          requestedOptionCount: optionCount,
          question: localizeClsCp006Question(english, locale),
        });
      }
    }
  }
}

assert.equal(rows.length, 32);
const countsByLocale = Object.fromEntries(
  locales.map((locale) => [
    locale,
    rows.filter((row) => row.locale === locale).length,
  ]),
);
const countsByQl = Object.fromEntries(
  qlIds.map((qlId) => [
    qlId,
    rows.filter((row) => row.question.qlId === qlId).length,
  ]),
);
const countsByOptionCount = Object.fromEntries(
  optionCounts.map((optionCount) => [
    optionCount,
    rows.filter((row) => row.requestedOptionCount === optionCount).length,
  ]),
);

const markdown = [
  "# CLS-CP-006 Hindi and Punjabi Localisation Review",
  "",
  `Questions: ${rows.length}`,
  `Locales: ${locales.join(", ")}`,
  `Permanent QLs: ${qlIds.join(", ")}`,
  "Rules represented: 8",
  "Option counts represented: 4 and 5",
  "Status: EXECUTABLE_REVIEW_REQUIRED",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "## Inventory",
  "",
  "| Locale | Questions |",
  "|---|---:|",
  ...Object.entries(countsByLocale).map(
    ([locale, count]) => `| ${locale} | ${count} |`,
  ),
  "",
  "| QL | Questions |",
  "|---|---:|",
  ...Object.entries(countsByQl).map(
    ([qlId, count]) => `| ${qlId} | ${count} |`,
  ),
  "",
  "| Options | Questions |",
  "|---:|---:|",
  ...Object.entries(countsByOptionCount).map(
    ([optionCount, count]) => `| ${optionCount} | ${count} |`,
  ),
  "",
  ...rows.flatMap(
    ({ locale, canonicalSeed, requestedOptionCount, question }, index) => [
      `## ${index + 1}. ${question.qlId} · ${locale} · ${question.intendedRuleId} · ${requestedOptionCount} options`,
      "",
      `**Question:** ${question.stem}`,
      "",
      "**Options:**",
      "",
      ...question.options.map(
        (option, optionIndex) =>
          `${String.fromCharCode(65 + optionIndex)}. ${option}`,
      ),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
      "",
      "### 📌 Core Concept",
      "",
      ...question.explanation.coreConcept,
      "",
      "### 📝 Option Explanations",
      "",
      ...question.evidenceByOption.map(
        (line, optionIndex) =>
          `${String.fromCharCode(65 + optionIndex)}. ${line}`,
      ),
      "",
      "### 📝 Step-by-Step Solution",
      "",
      ...question.explanation.stepByStep.map(
        (step, stepIndex) => `${stepIndex + 1}. ${step}`,
      ),
      "",
      "### ⚡ Exam Speed Shortcut",
      "",
      ...question.explanation.examSpeedShortcut,
      "",
      "### ⚠️ Common Trap",
      "",
      ...question.explanation.commonTrapWarning,
      "",
      "<details>",
      "<summary>Reviewer metadata</summary>",
      "",
      `- Canonical English seed: ${canonicalSeed}`,
      `- Source prototype: ${question.metadata.sourcePrototypeId}`,
      `- Rule: ${question.intendedRuleId}`,
      `- Rule value: ${question.intendedRuleValue}`,
      `- Answer object: ${question.optionKind}`,
      `- Difficulty: ${question.difficulty}`,
      `- Option count: ${question.options.length}`,
      `- Ambiguity result: ${question.ambiguityAudit.result}`,
      `- Supporting rules: ${question.ambiguityAudit.candidateSupports.length}`,
      `- Localisation version: ${question.metadata.localizationVersion}`,
      "",
      "</details>",
      "",
      "---",
      "",
    ],
  ),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp006-hi-pa-localisation-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp006-hi-pa-localisation-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-006 Hindi/Punjabi localisation review written.", {
  outputDir,
  questions: rows.length,
  countsByLocale,
  countsByQl,
  countsByOptionCount,
  rules: 8,
});
