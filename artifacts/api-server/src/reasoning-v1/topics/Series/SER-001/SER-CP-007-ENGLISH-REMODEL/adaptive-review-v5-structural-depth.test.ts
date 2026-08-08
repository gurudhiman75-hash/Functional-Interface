import assert from "node:assert/strict";
import {
  SER_CP007_TEMPLATE_PROBES_V5,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v5";
import {
  generateSerCp007WaveDQuestion,
  type SerCp007WaveDTemporaryTemplateId,
} from "../SER-CP-007-WAVE-D/foundation";
import { generateSerCp007WaveDExamReadyQuestion } from "../SER-CP-007-WAVE-D/foundation-exam-ready";
import {
  analyzeSerCp007StructuralDepth,
  type SerCp007StructuralBlocker,
} from "./structural-depth";
import { buildAdaptiveSerCp007ReviewV5 } from "./adaptive-review-v5";
import type { SerCp007EditorialQuestion } from "./adaptive-review";

type FullEditorialQuestion = SerCp007EditorialQuestion & {
  readonly sequence?: readonly (string | null)[];
  readonly waveId?: string;
};

const REMODELLED_SOURCE_RULES = new Set([
  "PAIRWISE_ADJACENT_SWAP_PERMUTATION",
  "FULL_REVERSAL_PERMUTATION",
  "ODD_EVEN_POSITION_REORDERING",
  "ALPHABET_COMPLEMENT_CLUSTER",
  "ALPHABET_COMPLEMENT_WITH_ROTATION",
]);

const knownBad = {
  temporaryTemplateId: "KNOWN-BAD-PERIOD-2",
  canonicalAuthorityId: "ALPHABET_COMPLEMENT_CLUSTER_SEQUENCE",
  sourceRuleId: "ALPHABET_COMPLEMENT_CLUSTER",
  taskKind: "MISSING_TERM",
  seed: 1,
  stem:
    "Which letter group should replace the question mark?\nCGRLMQF, XTIONJU, CGRLMQF, XTIONJU, ?, XTIONJU, CGRLMQF",
  sequence: [
    "CGRLMQF",
    "XTIONJU",
    "CGRLMQF",
    "XTIONJU",
    null,
    "XTIONJU",
    "CGRLMQF",
  ],
  options: ["GRLMQFC", "FCGRLMQ", "CGRLMQF", "CGRLOQF"],
  correctAnswer: "CGRLMQF",
  correctIndex: 2,
  explanation: {
    rule: "Replace each letter with its alphabet opposite.",
    steps: ["CGRLMQF → XTIONJU"],
    quickMethod: "Use alphabet opposites.",
    commonMistake: "Do not use a fixed shift.",
    trapCode: "PERIOD_2",
    conclusion: "Therefore, the answer is CGRLMQF.",
  },
  hiddenState: {
    canonicalTerms: [
      "CGRLMQF",
      "XTIONJU",
      "CGRLMQF",
      "XTIONJU",
      "CGRLMQF",
      "XTIONJU",
      "CGRLMQF",
      "XTIONJU",
    ],
    answerIndex: 4,
  },
} as unknown as FullEditorialQuestion;

const badProfile = analyzeSerCp007StructuralDepth(knownBad);
assert.equal(badProfile.passesStructuralDepth, false);
assert.ok(
  badProfile.blockers.includes("ANSWER_LEAKAGE_PERIODIC_LAYOUT"),
);
assert.ok(
  badProfile.blockers.includes("ANSWER_ALREADY_VISIBLE_MULTIPLE_TIMES"),
);
assert.ok(badProfile.blockers.includes("EQUALITY_MATCH_ONLY"));
assert.ok(badProfile.blockers.includes("INSUFFICIENT_STRUCTURAL_DEPTH"));

const originalComplement = generateSerCp007WaveDQuestion(
  "SER-CP-007-WD-TMP-014" as SerCp007WaveDTemporaryTemplateId,
  1,
) as unknown as FullEditorialQuestion;
const remodelledComplement = generateSerCp007WaveDExamReadyQuestion(
  "SER-CP-007-WD-TMP-014" as SerCp007WaveDTemporaryTemplateId,
  1,
) as unknown as FullEditorialQuestion;
assert.equal(
  analyzeSerCp007StructuralDepth(originalComplement).passesStructuralDepth,
  false,
);
assert.equal(
  analyzeSerCp007StructuralDepth(remodelledComplement).passesStructuralDepth,
  true,
);
assert.notDeepEqual(
  originalComplement.hiddenState?.canonicalTerms,
  remodelledComplement.hiddenState?.canonicalTerms,
);
const remodelledComplementReview = buildAdaptiveSerCp007ReviewV5(
  remodelledComplement,
);
assert.match(
  remodelledComplementReview.review,
  /\*\*Use the two-part pair pattern:\*\*/,
);
assert.match(
  remodelledComplementReview.review,
  /First groups of the four pairs:/,
);
assert.match(
  remodelledComplementReview.review,
  /This fixes the first group of the required pair as/,
);
assert.match(
  remodelledComplementReview.review,
  /replace every letter with its alphabet opposite/,
);
assert.equal(remodelledComplementReview.difficulty, "MEDIUM");

const failureRows: Array<{
  readonly template: string;
  readonly seed: number;
  readonly sourceRule: string;
  readonly task: string;
  readonly blockers: readonly SerCp007StructuralBlocker[];
  readonly terms: readonly string[];
}> = [];
const blockerCounts = new Map<SerCp007StructuralBlocker, number>();
const roleCombinations = new Set<string>();
let sampledQuestions = 0;
let remodelledQuestions = 0;
let questionsWithEightUniqueStates = 0;
let answerOccurrencesAfterRemodel = 0;
let reviewProofs = 0;
let pairedExplanationProofs = 0;

for (const probe of SER_CP007_TEMPLATE_PROBES_V5) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed) as unknown as FullEditorialQuestion;
    const profile = analyzeSerCp007StructuralDepth(question);
    const review = buildAdaptiveSerCp007ReviewV5(question);
    sampledQuestions += 1;
    reviewProofs += 1;

    assert.equal(review.options.length, 4);
    assert.equal(new Set(review.options).size, 4);
    assert.equal(review.options[question.correctIndex], question.correctAnswer);
    assert.ok(review.review.includes(`**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`));
    roleCombinations.add(
      review.distractors.map((distractor) => distractor.role).join("|"),
    );

    if (!profile.passesStructuralDepth) {
      for (const blocker of profile.blockers) {
        blockerCounts.set(blocker, (blockerCounts.get(blocker) ?? 0) + 1);
      }
      failureRows.push({
        template: question.temporaryTemplateId,
        seed,
        sourceRule: question.sourceRuleId,
        task: question.taskKind,
        blockers: profile.blockers,
        terms: question.hiddenState?.canonicalTerms ?? [],
      });
    }

    if (probe.waveId === "WAVE_D" && REMODELLED_SOURCE_RULES.has(probe.sourceRuleId)) {
      remodelledQuestions += 1;
      assert.match(question.explanation.rule, /^Read the groups in pairs\./);
      assert.match(question.explanation.rule, /From one pair to the next/);
      assert.match(question.explanation.trapCode, /ANSWER_LEAKAGE_PERIODIC_LAYOUT_REMOVED/);
      const canonicalTerms = question.hiddenState?.canonicalTerms ?? [];
      assert.equal(canonicalTerms.length, 8);
      assert.equal(new Set(canonicalTerms).size, 8);
      questionsWithEightUniqueStates += 1;
      answerOccurrencesAfterRemodel += profile.visibleAnswerOccurrences;
      assert.equal(profile.visibleAnswerOccurrences, 0);
      assert.equal(profile.minimumExactPeriod, null);
      assert.match(review.review, /\*\*Use the two-part pair pattern:\*\*/);
      assert.match(review.review, /First groups of the four pairs:/);
      assert.match(review.review, /Therefore, the pair is/);
      assert.notEqual(review.difficulty, "EASY");
      pairedExplanationProofs += 1;
    }
  }
}

if (failureRows.length > 0) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL_SER_CP007_V5_STRUCTURAL_DEPTH",
        failures: failureRows,
        blockerCounts: Object.fromEntries(blockerCounts),
      },
      null,
      2,
    ),
  );
}

assert.equal(SER_CP007_TEMPLATE_PROBES_V5.length, 140);
assert.equal(sampledQuestions, 420);
assert.equal(reviewProofs, 420);
assert.equal(remodelledQuestions, 60);
assert.equal(questionsWithEightUniqueStates, 60);
assert.equal(answerOccurrencesAfterRemodel, 0);
assert.equal(pairedExplanationProofs, 60);
assert.equal(failureRows.length, 0);
assert.ok(roleCombinations.size >= 18);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_V5_STRUCTURAL_DEPTH_REMEDIATION",
      temporaryTemplates: SER_CP007_TEMPLATE_PROBES_V5.length,
      sampledQuestions,
      knownBadQuestionRejected: true,
      originalComplementRejected: true,
      remodelledComplementAccepted: true,
      remodelledQuestions,
      questionsWithEightUniqueStates,
      answerOccurrencesAfterRemodel,
      pairedExplanationProofs,
      structuralDepthFailures: failureRows.length,
      blockerCounts: Object.fromEntries(blockerCounts),
      distractorRoleCombinations: roleCombinations.size,
      permanentQls: 0,
      englishFreeze: "PENDING_V5_MANUAL_APPROVAL",
      nextAuthority: "SER_CP007_V5_NON_TRIVIAL_400Q_MANUAL_REVIEW",
    },
    null,
    2,
  ),
);
