import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";
import { generateClsCp006LearnerReviewV2 } from "./cp006-learner-review-v2";
import type { ClsCp006TranslatedLocale } from "./localization/cp006-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp006-learner-review-v2");
const qls: readonly ClsCp006EnglishQlId[] = [
  CLS_CP006_ODD_LETTER_QL_ID,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
];
const locales: readonly ClsCp006TranslatedLocale[] = ["hi-IN", "pa-IN"];

function firstSeedByRule(qlId: ClsCp006EnglishQlId): ReadonlyMap<string, number> {
  const expectedRuleCount = qlId === CLS_CP006_ODD_LETTER_QL_ID ? 3 : 5;
  const seeds = new Map<string, number>();
  for (let seed = 0; seed < 1000 && seeds.size < expectedRuleCount; seed += 1) {
    const question = generateClsCp006EnglishQuestion(qlId, seed, 4);
    if (!seeds.has(question.intendedRuleId)) seeds.set(question.intendedRuleId, seed);
  }
  assert.equal(seeds.size, expectedRuleCount, `${qlId} did not expose all rules`);
  return seeds;
}

const rows: Array<{
  locale: ClsCp006TranslatedLocale;
  qlId: ClsCp006EnglishQlId;
  seed: number;
  optionCount: 4 | 5;
  question: ReturnType<typeof generateClsCp006LearnerReviewV2>;
}> = [];

for (const qlId of qls) {
  for (const [, seed] of [...firstSeedByRule(qlId)].sort(([a], [b]) => a.localeCompare(b))) {
    for (const optionCount of [4, 5] as const) {
      for (const locale of locales) {
        rows.push({
          locale,
          qlId,
          seed,
          optionCount,
          question: generateClsCp006LearnerReviewV2(qlId, locale, seed, optionCount),
        });
      }
    }
  }
}
assert.equal(rows.length, 32);

const markdown = [
  "# CLS-CP-006 Final-Audit Native Learner Review V2",
  "",
  "Questions: 32",
  "Coverage: all 8 rules × both 4/5-option forms × Hindi/Punjabi",
  "Purpose: learner-presentation review only; frozen mathematical/native state is unchanged.",
  "Question Studio / Question Bank / test / mock / student / public gates: closed.",
  "",
  ...rows.flatMap(({ locale, qlId, seed, optionCount, question }, index) => [
    `## ${index + 1}. ${qlId} · ${locale} · ${question.intendedRuleId} · ${optionCount} options`,
    "",
    `**Question:** ${question.stem}`,
    "",
    "**Options:**",
    ...question.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Explanation",
    ...question.explanation.coreConcept.map((line) => `- ${line}`),
    ...question.explanation.stepByStep.map((line, i) => `${i + 1}. ${line}`),
    "",
    "<details>",
    "<summary>Reviewer metadata</summary>",
    "",
    `- Canonical seed: ${seed}`,
    `- Rule: ${question.intendedRuleId}`,
    `- Rule value: ${question.intendedRuleValue}`,
    `- Difficulty: ${question.difficulty}`,
    `- Option count: ${question.options.length}`,
    `- Ambiguity: ${question.ambiguityAudit.result}`,
    "- Full per-option evidence retained in structured QA data but intentionally omitted from learner explanation.",
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "cls-cp006-hi-pa-learner-review-v2.md"), `${markdown}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp006-hi-pa-learner-review-v2.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log("CLS-CP-006 learner review V2 written.", { questions: rows.length, outputDir });
