import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./cp005-english-contracts";
import { generateClsCp005EnglishQuestion } from "./cp005-english-runtime";
import { generateClsCp005LearnerReviewV2 } from "./cp005-learner-review-v2";
import type { ClsCp005TranslatedLocale } from "./localization/cp005-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp005-learner-review-v2");
const qls: readonly ClsCp005EnglishQlId[] = [
  CLS_CP005_ODD_TUPLE_QL_ID,
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
];
const locales: readonly ClsCp005TranslatedLocale[] = ["hi-IN", "pa-IN"];

function firstSeedByRule(qlId: ClsCp005EnglishQlId): ReadonlyMap<string, number> {
  const seeds = new Map<string, number>();
  for (let seed = 0; seed < 5000 && seeds.size < 35; seed += 1) {
    const question = generateClsCp005EnglishQuestion(qlId, seed, 4);
    if (!seeds.has(question.intendedRuleId)) seeds.set(question.intendedRuleId, seed);
  }
  assert.equal(seeds.size, 35, `${qlId} did not expose all 35 rules`);
  return seeds;
}

const rows: Array<{
  locale: ClsCp005TranslatedLocale;
  qlId: ClsCp005EnglishQlId;
  seed: number;
  question: ReturnType<typeof generateClsCp005LearnerReviewV2>;
}> = [];

for (const qlId of qls) {
  for (const [, seed] of [...firstSeedByRule(qlId)].sort(([a], [b]) => a.localeCompare(b))) {
    for (const locale of locales) {
      rows.push({ locale, qlId, seed, question: generateClsCp005LearnerReviewV2(qlId, locale, seed, 4) });
    }
  }
}
assert.equal(rows.length, 140);

const markdown = [
  "# CLS-CP-005 Final-Audit Native Learner Review V2",
  "",
  "Questions: 140",
  "Coverage: 35 rules × 2 permanent QLs × Hindi/Punjabi",
  "Purpose: learner-presentation review only; frozen mathematical/native state is unchanged.",
  "Question Studio / Question Bank / test / mock / student / public gates: closed.",
  "",
  ...rows.flatMap(({ locale, qlId, seed, question }, index) => [
    `## ${index + 1}. ${qlId} · ${locale} · ${question.intendedRuleId}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    ...(question.referenceTuple ? [`**Given group:** (${question.referenceTuple.join(", ")})`, ""] : []),
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
    `- Ambiguity: ${question.expandedAmbiguityAudit.result}`,
    "- Full per-option evidence retained in structured QA data but intentionally omitted from learner explanation.",
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "cls-cp005-hi-pa-learner-review-v2.md"), `${markdown}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp005-hi-pa-learner-review-v2.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log("CLS-CP-005 learner review V2 written.", { questions: rows.length, outputDir });
