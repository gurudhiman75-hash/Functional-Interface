import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp006Wave01EditorialV2Question,
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  malCp006Wave01V2Stable,
  verifyMalCp006Wave01V2Answer,
} from "./foundation/cp006-wave01-learner-remediation-v2";
import { MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID } from "./foundation/cp006-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function stemShape(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?(?:\s+\d+\/\d+)?/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

function assertFriendlyFractions(text: string, seed: string): void {
  for (const match of text.matchAll(/(?:^|\s)(\d+)\/(\d+)(?:\s|[.,;)]|$)/gu)) {
    const denominator = Number(match[2]);
    assert(denominator <= 30, `${seed}: learner text contains denominator ${denominator}.`);
  }
}

const bannedLearnerPhrases = [
  "salt solution component",
  "component load",
  "sugar syrup-milk",
  "recompute",
  "ledger",
  "state key",
  "current fraction",
  "snapshot",
  "global component",
];

const bannedDistractorIds = new Set([
  "ADDED_ONE_PART_AFTER_REDUCTION",
  "ALTERED_COMPLEMENT_PART",
  "SUBTRACTED_ONE_LITRE_EXTRA",
  "ADDED_ONE_LITRE_EXTRA",
  "HALVED_FINAL_COMPONENT_SHARE",
  "DOUBLE_COUNTED_TRANSFERRED_COMPONENT",
]);

assert(
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS.length === 5,
  "V2 must retain exactly five learner candidates.",
);
const heldEntries = Object.entries(MAL_CP006_WAVE01_V2_HELD_PROTOTYPES);
assert(heldEntries.length === 1, "V2 must hold exactly one Wave 01 candidate.");
assert(
  heldEntries[0]?.[0] ===
    "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE",
  "Unexpected held candidate.",
);
assert(
  heldEntries[0]?.[1].decision === "HOLD_CP001_WEIGHTED_BLEND_EQUIVALENT",
  "Common-concentration candidate must be held at the CP-001 boundary.",
);

const seedsPerPrototype = 100;
let generatedCount = 0;
let deterministicCount = 0;
let answerProofCount = 0;
let editorialCount = 0;
let lifecycleCount = 0;
let distractorCount = 0;
const answerPositions = [0, 0, 0, 0];
const review: ReturnType<typeof generateMalCp006Wave01EditorialV2Question>[] = [];
const evidence: Array<{
  prototypeId: string;
  states: number;
  siblingStates: number;
  stemShapes: number;
  answers: number;
  difficulty: string;
}> = [];

for (const prototypeId of MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS) {
  const states = new Set<string>();
  const siblingStates = new Set<string>();
  const shapes = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < seedsPerPrototype; index += 1) {
    const seed = `mal-cp006-wave01-v2:${prototypeId}:${index}`;
    const first = generateMalCp006Wave01EditorialV2Question(prototypeId, seed);
    const second = generateMalCp006Wave01EditorialV2Question(prototypeId, seed);

    assert(
      malCp006Wave01V2Stable(first) === malCp006Wave01V2Stable(second),
      `${seed}: V2 is not deterministic.`,
    );
    deterministicCount += 1;

    assert(first.runtimeId === MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID, `${seed}: wrong runtime.`);
    assert(first.prototypeId === prototypeId, `${seed}: route changed.`);
    assert(first.validation.ok, `${seed}: ${first.validation.errors.join(" | ")}`);
    assert(verifyMalCp006Wave01V2Answer(first), `${seed}: independent answer proof failed.`);
    answerProofCount += 1;

    assert(first.options.length === 4, `${seed}: option count changed.`);
    assert(new Set(first.options).size === 4, `${seed}: duplicate options.`);
    assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
    assert(first.optionAudit.filter((entry) => entry.isCorrect).length === 1, `${seed}: correct option ownership failed.`);
    assert(first.optionAudit.filter((entry) => entry.misconceptionId !== "CORRECT").length === 3, `${seed}: expected three misconception distractors.`);
    for (const entry of first.optionAudit) {
      assert(!bannedDistractorIds.has(entry.misconceptionId), `${seed}: generic distractor ${entry.misconceptionId} survived V2.`);
    }
    distractorCount += 1;

    const learnerText = [
      first.stem,
      ...first.explanation.visibleLines,
      first.explanation.optionalHelp.commonMistake,
    ].join(" ");
    const lower = learnerText.toLowerCase();
    for (const phrase of bannedLearnerPhrases) {
      assert(!lower.includes(phrase), `${seed}: learner phrase '${phrase}' survived.`);
    }
    assert(first.stem.endsWith("?"), `${seed}: stem is not interrogative.`);
    assert(first.explanation.visibleLines.length >= 3 && first.explanation.visibleLines.length <= 4, `${seed}: visible solution length is not 3-4 lines.`);
    assert(first.explanation.visibleLines.filter((line) => /\d/u.test(line)).length >= 3, `${seed}: explanation is not calculation-first.`);
    assertFriendlyFractions(learnerText, seed);
    assert(!/\bcomponent\s+[ab]\b/iu.test(learnerText), `${seed}: internal component labels leaked.`);
    if (prototypeId === "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS") {
      assert((first.stem.match(/%/gu) ?? []).length >= 2, `${seed}: equal-exchange stem does not state both starting concentrations.`);
    }
    editorialCount += 1;

    assert(first.permanentQlId === null, `${seed}: permanent QL allocated.`);
    assert(first.permanentSolveModeId === null, `${seed}: permanent solve mode allocated.`);
    assert(first.runtimeMode === "REVIEW_ONLY", `${seed}: runtime mode changed.`);
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      `${seed}: delivery surface activated.`,
    );
    lifecycleCount += 1;

    states.add(first.stateKey);
    siblingStates.add(first.siblingStateKey);
    shapes.add(stemShape(first.stem));
    answers.add(first.answer);
    answerPositions[first.correctIndex] += 1;
    generatedCount += 1;
    if (index < 5) review.push(first);
  }

  assert(states.size >= 20, `${prototypeId}: too few exact states (${states.size}).`);
  assert(siblingStates.size >= 6, `${prototypeId}: too few sibling states (${siblingStates.size}).`);
  assert(shapes.size >= 4, `${prototypeId}: fewer than four real stem forms (${shapes.size}).`);
  assert(answers.size >= 3, `${prototypeId}: answer diversity too low (${answers.size}).`);
  const sample = generateMalCp006Wave01EditorialV2Question(
    prototypeId,
    `mal-cp006-wave01-v2:${prototypeId}:sample`,
  );
  evidence.push({
    prototypeId,
    states: states.size,
    siblingStates: siblingStates.size,
    stemShapes: shapes.size,
    answers: answers.size,
    difficulty: sample.difficulty,
  });
}

assert(generatedCount === 500, `Expected 500 V2 questions, got ${generatedCount}.`);
assert(deterministicCount === generatedCount, "Determinism coverage incomplete.");
assert(answerProofCount === generatedCount, "Answer-proof coverage incomplete.");
assert(editorialCount === generatedCount, "Editorial coverage incomplete.");
assert(lifecycleCount === generatedCount, "Lifecycle coverage incomplete.");
assert(distractorCount === generatedCount, "Distractor coverage incomplete.");
assert(answerPositions.every((count) => count >= 80), `Answer positions too imbalanced: ${answerPositions.join("/")}.`);
assert(review.length === 25, "Expected 25 review questions.");
assert(
  review.every(
    (question) =>
      question.prototypeId !==
      "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE",
  ),
  "Held common-concentration candidate leaked into learner review.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(outputDirectory, "mal-cp006-wave01-learner-remediation-v2.json");
const markdownPath = resolve(
  outputDirectory,
  "MAL-CP-006-WAVE-01-LEARNER-REMEDIATION-V2-25Q-REVIEW.md",
);

const result = {
  status: "PASS_MAL_CP006_WAVE01_LEARNER_REMEDIATION_V2",
  runtimeId: MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
  retainedPrototypeCount: MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS.length,
  heldPrototypeCount: heldEntries.length,
  heldPrototype: heldEntries[0],
  permanentQlCount: 0,
  permanentSolveModeCount: 0,
  generatedCount,
  deterministicCount,
  answerProofCount,
  editorialCount,
  lifecycleCount,
  distractorCount,
  answerPositions,
  reviewQuestionCount: review.length,
  evidence,
  learnerPolicy: {
    naturalContextsOnly: true,
    startingConcentrationsExplicit: true,
    calculationFirstExplanations: true,
    technicalMetadataHiddenFromReview: true,
    genericPlusMinusDistractorsRejected: true,
    denominatorGuard: 30,
  },
  lifecycle: {
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  },
};
writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");

const letters = ["A", "B", "C", "D"];
const markdown = [
  "# MAL-CP-006 Wave 01 — Learner Remediation V2 — 25Q Review",
  "",
  "> English discovery review only. Five learner candidates are retained; the common-concentration candidate is held at the CP-001 boundary. No permanent QL or delivery activation is authorized.",
  "",
  `Runtime: \`${MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID}\``,
  "",
  ...review.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} — ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...question.options.map((option, optionIndex) => `${letters[optionIndex]}. ${option}`),
    "",
    "<details>",
    "<summary>Answer and solution</summary>",
    "",
    `**Answer:** ${letters[question.correctIndex]}. ${question.answer}`,
    "",
    ...question.explanation.visibleLines.map((line, lineIndex) => `${lineIndex + 1}. ${line}`),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
    "</details>",
    "",
  ]),
].join("\n");
assert(!markdown.toLowerCase().includes("state key"), "Technical state key leaked into learner review export.");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
