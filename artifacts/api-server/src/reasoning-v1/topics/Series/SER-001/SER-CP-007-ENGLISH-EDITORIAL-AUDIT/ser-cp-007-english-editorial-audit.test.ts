import assert from "node:assert/strict";
import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
  renderSerCp007Review,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
  renderSerCp007WaveBReview,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
  renderSerCp007WaveDReview,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
  renderSerCp007WaveEReview,
} from "../SER-CP-007-WAVE-E/foundation";

type EditorialQuestion = {
  readonly temporaryTemplateId: string;
  readonly canonicalAuthorityId: string;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly stem: string;
  readonly correctAnswer: string;
  readonly explanation: {
    readonly rule: string;
    readonly steps: readonly string[];
    readonly quickMethod: string;
    readonly commonMistake: string;
    readonly trapCode: string;
    readonly conclusion: string;
  };
};

type EditorialProbe = {
  readonly temporaryTemplateId: string;
  readonly generate: (seed: number) => EditorialQuestion;
  readonly render: (question: EditorialQuestion) => string;
};

const probes: readonly EditorialProbe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007Question(template.temporaryTemplateId, seed) as EditorialQuestion,
    render: (question: EditorialQuestion) => renderSerCp007Review(question as never),
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(template.temporaryTemplateId, seed) as EditorialQuestion,
    render: (question: EditorialQuestion) => renderSerCp007WaveBReview(question as never),
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(template.temporaryTemplateId, seed) as EditorialQuestion,
    render: (question: EditorialQuestion) => renderSerCp007WaveCReview(question as never),
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(template.temporaryTemplateId, seed) as EditorialQuestion,
    render: (question: EditorialQuestion) => renderSerCp007WaveDReview(question as never),
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(template.temporaryTemplateId, seed) as EditorialQuestion,
    render: (question: EditorialQuestion) => renderSerCp007WaveEReview(question as never),
  })),
];

assert.equal(probes.length, 140);
assert.equal(new Set(probes.map((probe) => probe.temporaryTemplateId)).size, 140);

const REQUIRED_HEADINGS = [
  "📌 **Rule**",
  "📝 **Solution**",
  "⚡ **Quick Method**",
  "⚠️ **Common Mistake**",
] as const;
const VISIBLE_TRAP_CODE = /\[[A-Z][A-Z0-9_]*\]/;

function wordCount(value: string): number {
  return value
    .replace(/[`*_#📌📝⚡⚠️✓]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function duplicateStats(values: readonly string[]): {
  readonly distinct: number;
  readonly duplicateGroups: number;
  readonly maxMultiplicity: number;
} {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const multiplicities = [...counts.values()];
  return {
    distinct: counts.size,
    duplicateGroups: multiplicities.filter((count) => count > 1).length,
    maxMultiplicity: Math.max(...multiplicities),
  };
}

const rules: string[] = [];
const quickMethods: string[] = [];
const commonMistakes: string[] = [];
const openingLines: string[] = [];
const reviewWordCounts: number[] = [];
const stepCounts: number[] = [];
const taskCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();

let reviews = 0;
let fixedFourHeadingShellReviews = 0;
let visibleTrapCodeReviews = 0;
let wrongTermReplacementSemanticReviews = 0;
let previousTermReviews = 0;
let reviewsOver180Words = 0;
let reviewsUnder45Words = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const review = probe.render(question);

    assert.equal(question.temporaryTemplateId, probe.temporaryTemplateId);
    assert.ok(question.explanation.rule.length > 0);
    assert.ok(question.explanation.steps.length > 0);
    assert.ok(question.explanation.quickMethod.length > 0);
    assert.ok(question.explanation.commonMistake.length > 0);
    assert.ok(question.explanation.trapCode.length > 0);

    const hasCompleteShell = REQUIRED_HEADINGS.every(
      (heading) => review.split(heading).length - 1 === 1,
    );
    if (hasCompleteShell) fixedFourHeadingShellReviews += 1;
    if (VISIBLE_TRAP_CODE.test(review)) visibleTrapCodeReviews += 1;

    if (question.taskKind === "WRONG_TERM") {
      assert.match(question.stem, /replace the incorrectly placed group/i);
      wrongTermReplacementSemanticReviews += 1;
    }
    if (question.taskKind === "PREVIOUS_TERM") previousTermReviews += 1;

    const words = wordCount(review);
    if (words > 180) reviewsOver180Words += 1;
    if (words < 45) reviewsUnder45Words += 1;

    rules.push(question.explanation.rule);
    quickMethods.push(question.explanation.quickMethod);
    commonMistakes.push(question.explanation.commonMistake);
    openingLines.push(question.stem.split("\n")[0]!);
    reviewWordCounts.push(words);
    stepCounts.push(question.explanation.steps.length);
    taskCounts.set(question.taskKind, (taskCounts.get(question.taskKind) ?? 0) + 1);
    authorityCounts.set(
      question.canonicalAuthorityId,
      (authorityCounts.get(question.canonicalAuthorityId) ?? 0) + 1,
    );
    reviews += 1;
  }
}

assert.equal(reviews, 420);
assert.equal(fixedFourHeadingShellReviews, reviews);
assert.equal(visibleTrapCodeReviews, reviews);
assert.ok(wrongTermReplacementSemanticReviews > 0);
assert.ok(previousTermReviews > 0);
assert.equal(authorityCounts.size, 17);

const ruleDuplication = duplicateStats(rules);
const quickMethodDuplication = duplicateStats(quickMethods);
const commonMistakeDuplication = duplicateStats(commonMistakes);
const openingLineDuplication = duplicateStats(openingLines);

const averageReviewWords =
  reviewWordCounts.reduce((sum, count) => sum + count, 0) / reviewWordCounts.length;
const averageSolutionSteps =
  stepCounts.reduce((sum, count) => sum + count, 0) / stepCounts.length;

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_ENGLISH_EDITORIAL_AUDIT_REMODEL_REQUIRED",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      sampledReviews: reviews,
      authoritiesSampled: authorityCounts.size,
      fixedFourHeadingShellReviews,
      visibleTrapCodeReviews,
      wrongTermReplacementSemanticReviews,
      previousTermReviews,
      averageReviewWords: Number(averageReviewWords.toFixed(2)),
      minimumReviewWords: Math.min(...reviewWordCounts),
      maximumReviewWords: Math.max(...reviewWordCounts),
      reviewsOver180Words,
      reviewsUnder45Words,
      averageSolutionSteps: Number(averageSolutionSteps.toFixed(2)),
      minimumSolutionSteps: Math.min(...stepCounts),
      maximumSolutionSteps: Math.max(...stepCounts),
      ruleDuplication,
      quickMethodDuplication,
      commonMistakeDuplication,
      openingLineDuplication,
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      englishEditorialReview: "AUDIT_COMPLETE_REMODEL_REQUIRED",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      nextAuthority: "SER_CP007_ADAPTIVE_EXPLANATION_AND_TASK_SEMANTICS_REMODEL",
    },
    null,
    2,
  ),
);
