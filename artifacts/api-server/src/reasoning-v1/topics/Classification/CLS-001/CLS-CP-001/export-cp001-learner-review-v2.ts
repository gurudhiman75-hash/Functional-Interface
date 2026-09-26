import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_CP001_PERMANENT_CONTRACTS,
  type ClsCp001PermanentContract,
} from "./cp001-permanent-contracts";
import { generateClsCp001Question } from "./cp001-multilingual-runtime";
import { generateClsCp001LearnerReviewV2 } from "./cp001-learner-review-v2";
import type { ClsCp001Locale } from "./localization/cp001-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp001-learner-review-v2");
const locales: readonly ClsCp001Locale[] = ["en-IN", "hi-IN", "pa-IN"];

function firstSeedByPrototype(contract: ClsCp001PermanentContract): ReadonlyMap<string, number> {
  const seeds = new Map<string, number>();
  for (let seed = 0; seed < 4000 && seeds.size < contract.allowedPrototypeIds.length; seed += 1) {
    const question = generateClsCp001Question(contract.qlId, "en-IN", seed);
    const prototypeId = question.metadata.sourcePrototypeId;
    if (!seeds.has(prototypeId)) seeds.set(prototypeId, seed);
  }
  for (const prototypeId of contract.allowedPrototypeIds) {
    assert.ok(seeds.has(prototypeId), `${contract.qlId} did not expose ${prototypeId}`);
  }
  return seeds;
}

const rows: Array<{
  locale: ClsCp001Locale;
  qlId: (typeof CLS_CP001_PERMANENT_CONTRACTS)[number]["qlId"];
  prototypeId: string;
  seed: number;
  question: ReturnType<typeof generateClsCp001LearnerReviewV2>;
}> = [];

for (const contract of CLS_CP001_PERMANENT_CONTRACTS) {
  for (const [prototypeId, seed] of firstSeedByPrototype(contract)) {
    for (const locale of locales) {
      rows.push({
        locale,
        qlId: contract.qlId,
        prototypeId,
        seed,
        question: generateClsCp001LearnerReviewV2(contract.qlId, locale, seed),
      });
    }
  }
}

assert.equal(rows.length, 24, "CP001 learner V2 review must cover 8 prototypes × 3 locales");

const markdown = [
  "# CLS-CP-001 Final-Audit Learner Review V2",
  "",
  "Questions: 24",
  "Coverage: all 8 permanent source prototypes × English/Hindi/Punjabi",
  "Purpose: learner-presentation review only; frozen semantic state and multilingual runtime are unchanged.",
  "Change under review: retain the compact core/solution; remove mandatory Shortcut and Common Trap boilerplate.",
  "Question Studio / Question Bank / test / mock / student / public gates: closed.",
  "",
  ...rows.flatMap(({ locale, qlId, prototypeId, seed, question }, index) => [
    `## ${index + 1}. ${qlId} · ${locale} · ${prototypeId}`,
    "",
    `**Question:** ${question.stem}`,
    "",
    "**Options:**",
    ...question.options.map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`),
    "",
    `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
    "",
    "### Explanation",
    ...question.explanation.coreRule.map((line) => `- ${line}`),
    ...question.explanation.optionChecks.map((line, i) => `${i + 1}. ${line}`),
    "",
    "<details>",
    "<summary>Reviewer metadata</summary>",
    "",
    `- Canonical seed: ${seed}`,
    `- Source prototype: ${prototypeId}`,
    `- Difficulty: ${question.difficulty}`,
    `- Option count: ${question.options.length}`,
    `- Ambiguity: ${question.ambiguityAudit.result}`,
    "- Frozen evidence remains unchanged; Shortcut/Common Trap fields are empty only in this learner projection.",
    "",
    "</details>",
    "",
    "---",
    "",
  ]),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "cls-cp001-learner-review-v2.md"), `${markdown}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp001-learner-review-v2.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log("CLS-CP-001 learner review V2 written.", { questions: rows.length, outputDir });
