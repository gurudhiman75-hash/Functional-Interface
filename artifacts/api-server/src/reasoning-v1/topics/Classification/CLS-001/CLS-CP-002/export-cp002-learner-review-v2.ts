import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_CP002_PERMANENT_CONTRACT,
  CLS_CP002_QL_ID,
} from "./cp002-permanent-contract";
import { generateClsCp002Question } from "./cp002-multilingual-runtime";
import { generateClsCp002LearnerReviewV2 } from "./cp002-learner-review-v2";
import type { ClsCp002Locale } from "./localization/cp002-language-pack";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/cp002-learner-review-v2");
const locales: readonly ClsCp002Locale[] = ["en-IN", "hi-IN", "pa-IN"];

function firstSeedByPrototype(): ReadonlyMap<string, number> {
  const seeds = new Map<string, number>();
  for (let seed = 0; seed < 4000 && seeds.size < CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds.length; seed += 1) {
    const question = generateClsCp002Question(CLS_CP002_QL_ID, "en-IN", seed);
    const prototypeId = question.metadata.sourcePrototypeId;
    if (!seeds.has(prototypeId)) seeds.set(prototypeId, seed);
  }
  for (const prototypeId of CLS_CP002_PERMANENT_CONTRACT.allowedPrototypeIds) {
    assert.ok(seeds.has(prototypeId), `CP002 did not expose ${prototypeId}`);
  }
  return seeds;
}

const rows: Array<{
  locale: ClsCp002Locale;
  prototypeId: string;
  seed: number;
  question: ReturnType<typeof generateClsCp002LearnerReviewV2>;
}> = [];

for (const [prototypeId, seed] of firstSeedByPrototype()) {
  for (const locale of locales) {
    rows.push({
      locale,
      prototypeId,
      seed,
      question: generateClsCp002LearnerReviewV2(CLS_CP002_QL_ID, locale, seed),
    });
  }
}

assert.equal(rows.length, 15, "CP002 learner V2 review must cover 5 prototypes × 3 locales");

const markdown = [
  "# CLS-CP-002 Final-Audit Learner Review V2",
  "",
  "Questions: 15",
  "Coverage: all 5 permanent source prototypes × English/Hindi/Punjabi",
  "Purpose: learner-presentation review only; frozen semantic-pair state and multilingual runtime are unchanged.",
  "Change under review: retain the compact concept + three-step solution; remove mandatory Shortcut and Common Trap boilerplate.",
  "Question Studio / Question Bank / test / mock / student / public gates: closed.",
  "",
  ...rows.flatMap(({ locale, prototypeId, seed, question }, index) => [
    `## ${index + 1}. ${CLS_CP002_QL_ID} · ${locale} · ${prototypeId}`,
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
    `- Source prototype: ${prototypeId}`,
    `- Intended relation: ${question.intendedRelationId}`,
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
await writeFile(path.join(outputDir, "cls-cp002-learner-review-v2.md"), `${markdown}\n`, "utf8");
await writeFile(path.join(outputDir, "cls-cp002-learner-review-v2.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log("CLS-CP-002 learner review V2 written.", { questions: rows.length, outputDir });
