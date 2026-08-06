import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./cp005-english-contracts";
import { generateClsCp005EnglishQuestion } from "./cp005-english-runtime";
import {
  localizeClsCp005Question,
  type GeneratedClsCp005LocalizedQuestion,
} from "./localization/cp005-localizer";
import type { ClsCp005TranslatedLocale } from "./localization/cp005-language-pack";

const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp005-localisation-review",
);
const qlIds: readonly ClsCp005EnglishQlId[] = [
  CLS_CP005_ODD_TUPLE_QL_ID,
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
];
const locales: readonly ClsCp005TranslatedLocale[] = ["hi-IN", "pa-IN"];

function firstSeedByRule(qlId: ClsCp005EnglishQlId): ReadonlyMap<string, number> {
  const seeds = new Map<string, number>();
  for (let seed = 0; seed < 5000 && seeds.size < 35; seed += 1) {
    const question = generateClsCp005EnglishQuestion(qlId, seed);
    if (!seeds.has(question.intendedRuleId)) seeds.set(question.intendedRuleId, seed);
  }
  assert.equal(seeds.size, 35, `${qlId} did not expose all 35 rules for localisation review`);
  return seeds;
}

type ReviewRow = {
  readonly locale: ClsCp005TranslatedLocale;
  readonly canonicalSeed: number;
  readonly question: GeneratedClsCp005LocalizedQuestion;
};

const rows: ReviewRow[] = [];
for (const qlId of qlIds) {
  const seeds = firstSeedByRule(qlId);
  for (const [ruleId, seed] of [...seeds.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    const english = generateClsCp005EnglishQuestion(qlId, seed);
    assert.equal(english.intendedRuleId, ruleId);
    for (const locale of locales) {
      rows.push({
        locale,
        canonicalSeed: seed,
        question: localizeClsCp005Question(english, locale),
      });
    }
  }
}

const countsByLocale = Object.fromEntries(
  locales.map((locale) => [locale, rows.filter((row) => row.locale === locale).length]),
);
const countsByQl = Object.fromEntries(
  qlIds.map((qlId) => [qlId, rows.filter((row) => row.question.qlId === qlId).length]),
);

const markdown = [
  "# CLS-CP-005 Hindi and Punjabi Localisation Review",
  "",
  `Questions: ${rows.length}`,
  `Locales: ${locales.join(", ")}`,
  `Permanent QLs: ${qlIds.join(", ")}`,
  "Rules represented in every QL and locale: 35",
  "Status: EXECUTABLE_REVIEW_REQUIRED",
  "Question Studio: disabled",
  "Question Bank: disabled",
  "Test/publication eligibility: disabled",
  "",
  "## Inventory",
  "",
  "| Locale | Questions |",
  "|---|---:|",
  ...Object.entries(countsByLocale).map(([locale, count]) => `| ${locale} | ${count} |`),
  "",
  "| QL | Questions |",
  "|---|---:|",
  ...Object.entries(countsByQl).map(([qlId, count]) => `| ${qlId} | ${count} |`),
  "",
  ...rows.flatMap(({ locale, canonicalSeed, question }, index) => [
    `## ${index + 1}. ${question.qlId} · ${locale} · ${question.intendedRuleId}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...(question.referenceTuple ? [`**Given group:** (${question.referenceTuple.join(", ")})`, ""] : []),
    "**Options:**",
    "",
    ...question.options.map((option, optionIndex) =>
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
    ...question.evidenceByOption.map((line, optionIndex) =>
      `${String.fromCharCode(65 + optionIndex)}. ${line}`,
    ),
    "",
    "### 📝 Step-by-Step Solution",
    "",
    ...question.explanation.stepByStep.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
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
    `- Source family: ${question.metadata.sourceFamily}`,
    `- Rule: ${question.intendedRuleId}`,
    `- Rule value: ${question.intendedRuleValue}`,
    `- Arity: ${question.arity}`,
    `- Difficulty: ${question.difficulty}`,
    `- Option count: ${question.options.length}`,
    `- Expanded ambiguity result: ${question.expandedAmbiguityAudit.result}`,
    `- Localisation version: ${question.metadata.localizationVersion}`,
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp005-hi-pa-localisation-review.json"),
  `${JSON.stringify(rows, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp005-hi-pa-localisation-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-005 Hindi/Punjabi localisation review written.", {
  outputDir,
  questions: rows.length,
  countsByLocale,
  countsByQl,
  rulesPerQlPerLocale: 35,
});
