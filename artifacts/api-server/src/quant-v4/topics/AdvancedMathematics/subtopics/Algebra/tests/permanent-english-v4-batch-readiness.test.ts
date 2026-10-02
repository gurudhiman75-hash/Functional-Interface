import assert from "node:assert/strict";

import {
  ALG_CP002_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp002EnglishReviewV4,
} from "../permanent/english-review-v4-cp002";
import {
  ALG_CP003_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp003EnglishReviewV4,
} from "../permanent/english-review-v4-cp003";
import {
  ALG_CP004_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp004EnglishReviewV4,
} from "../permanent/english-review-v4-cp004";
import {
  ALG_CP007_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp007EnglishReviewV4,
} from "../permanent/english-review-v4-cp007";
import {
  ALG_CP008_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp008EnglishReviewV4,
} from "../permanent/english-review-v4-cp008";
import { generateAlgCp009EnglishReviewV4 } from "../permanent/english-review-v4-cp009";
import {
  ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT,
  generateAlgCp011EnglishReviewV4,
} from "../permanent/english-review-v4-cp011";
import {
  ALG_CP012_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp012EnglishReviewV4,
} from "../permanent/english-review-v4-cp012";
import {
  ALG_CP013_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp013EnglishReviewV4,
} from "../permanent/english-review-v4-cp013";
import {
  ALG_CP014_ENGLISH_REVIEW_V4_TARGETS,
  generateAlgCp014EnglishReviewV4,
} from "../permanent/english-review-v4-cp014";

type ReviewItem = {
  readonly question: string;
  readonly explanation: string;
  readonly reviewStatus: string;
  readonly learnerContentFrozen: boolean;
  readonly active: boolean;
  readonly questionStudioDiscoverable: boolean;
  readonly questionBankWritable: boolean;
  readonly testEligible: boolean;
  readonly publiclyPublishable: boolean;
};

type Family = {
  readonly cpId: string;
  readonly targets: readonly string[];
  readonly generate: (prototypeId: any, seed: number) => ReviewItem;
  readonly minQuestions: number;
  readonly minExplanations: number;
};

const families: readonly Family[] = [
  { cpId: "ALG-CP-002", targets: ALG_CP002_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp002EnglishReviewV4 as Family["generate"], minQuestions: 32, minExplanations: 32 },
  { cpId: "ALG-CP-003", targets: ALG_CP003_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp003EnglishReviewV4 as Family["generate"], minQuestions: 32, minExplanations: 32 },
  { cpId: "ALG-CP-004", targets: ALG_CP004_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp004EnglishReviewV4 as Family["generate"], minQuestions: 48, minExplanations: 48 },
  { cpId: "ALG-CP-007", targets: ALG_CP007_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp007EnglishReviewV4 as Family["generate"], minQuestions: 48, minExplanations: 48 },
  { cpId: "ALG-CP-008", targets: ALG_CP008_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp008EnglishReviewV4 as Family["generate"], minQuestions: 32, minExplanations: 32 },
  { cpId: "ALG-CP-009", targets: ["ALG-CP009-CAND-005"], generate: ((_prototypeId, seed) => generateAlgCp009EnglishReviewV4(seed)) as Family["generate"], minQuestions: 48, minExplanations: 48 },
  { cpId: "ALG-CP-011", targets: Array.from({ length: ALG_CP011_ENGLISH_REVIEW_V4_VARIANT_COUNT }, (_unused, index) => `ALG-CP011-VARIANT-${index}`), generate: ((prototypeId, seed) => {
      const variantIndex = Number(String(prototypeId).split("-").at(-1));
      return generateAlgCp011EnglishReviewV4(seed, variantIndex);
    }) as Family["generate"], minQuestions: 32, minExplanations: 32 },
  { cpId: "ALG-CP-012", targets: ALG_CP012_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp012EnglishReviewV4 as Family["generate"], minQuestions: 32, minExplanations: 32 },
  { cpId: "ALG-CP-013", targets: ALG_CP013_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp013EnglishReviewV4 as Family["generate"], minQuestions: 24, minExplanations: 24 },
  { cpId: "ALG-CP-014", targets: ALG_CP014_ENGLISH_REVIEW_V4_TARGETS, generate: generateAlgCp014EnglishReviewV4 as Family["generate"], minQuestions: 32, minExplanations: 32 },
];

let targetCount = 0;
let sampleCount = 0;
const cpSummary: Record<string, { targets: number; samples: number }> = {};

for (const family of families) {
  cpSummary[family.cpId] = { targets: family.targets.length, samples: 0 };
  for (const prototypeId of family.targets) {
    targetCount += 1;
    const questions = new Set<string>();
    const explanations = new Set<string>();
    for (let seed = 1; seed <= 64; seed += 1) {
      const item = family.generate(prototypeId, seed);
      sampleCount += 1;
      cpSummary[family.cpId]!.samples += 1;

      assert.equal(item.reviewStatus, "REVIEW_CANDIDATE_ONLY", `${prototypeId}/${seed}: review lifecycle changed`);
      assert.equal(item.learnerContentFrozen, false, `${prototypeId}/${seed}: candidate unexpectedly frozen`);
      assert.equal(item.active, false, `${prototypeId}/${seed}: candidate became active`);
      assert.equal(item.questionStudioDiscoverable, false, `${prototypeId}/${seed}: candidate leaked into Question Studio`);
      assert.equal(item.questionBankWritable, false, `${prototypeId}/${seed}: candidate became bank-writable`);
      assert.equal(item.testEligible, false, `${prototypeId}/${seed}: candidate became test-eligible`);
      assert.equal(item.publiclyPublishable, false, `${prototypeId}/${seed}: candidate became public`);

      assert.ok(item.question.trim().length >= 12, `${prototypeId}/${seed}: thin question`);
      assert.ok(item.explanation.trim().length >= 45, `${prototypeId}/${seed}: thin explanation`);
      assert.doesNotMatch(item.question, /oracle|runtime|prototype|canonical|machine policy|TODO|TBD|undefined|NaN/i);
      assert.doesNotMatch(item.explanation, /oracle|runtime|prototype|canonical|machine policy|TODO|TBD|undefined|NaN/i);
      questions.add(item.question);
      explanations.add(item.explanation);
    }

    assert.ok(
      questions.size >= family.minQuestions,
      `${prototypeId}: V4 candidate question diversity too low (${questions.size}/64; need ${family.minQuestions})`,
    );
    assert.ok(
      explanations.size >= family.minExplanations,
      `${prototypeId}: V4 candidate explanation diversity too low (${explanations.size}/64; need ${family.minExplanations})`,
    );
  }
}

assert.ok(targetCount >= 20, `Expected broad V4 remediation coverage, found only ${targetCount} target variants`);
assert.equal(sampleCount, targetCount * 64);

console.log("PASS_ALGEBRA_ENGLISH_V4_BATCH_READINESS", {
  targetCount,
  sampleCount,
  cpSummary,
  lifecycle: "REVIEW_CANDIDATE_ONLY",
});
