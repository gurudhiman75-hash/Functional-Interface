import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp006Wave01EditorialV2FinalQuestion,
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  malCp006Wave01V2FinalStable,
  verifyMalCp006Wave01V2Answer,
} from "./foundation/cp006-wave01-learner-remediation-v2-final";
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
    assert(denominator <= 30, `${seed}: learner denominator ${denominator} is too awkward.`);
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

const genericDistractors = new Set([
  "ADDED_ONE_PART_AFTER_REDUCTION",
  "ALTERED_COMPLEMENT_PART",
  "SUBTRACTED_ONE_LITRE_EXTRA",
  "ADDED_ONE_LITRE_EXTRA",
  "HALVED_FINAL_COMPONENT_SHARE",
  "DOUBLE_COUNTED_TRANSFERRED_COMPONENT",
]);

assert(MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS.length === 5, "Expected five retained learner candidates.");
const held = Object.entries(MAL_CP006_WAVE01_V2_HELD_PROTOTYPES);
assert(held.length === 1, "Expected one held Wave 01 candidate.");
assert(
  held[0]?.[0] === "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE" &&
    held[0]?.[1].decision === "HOLD_CP001_WEIGHTED_BLEND_EQUIVALENT",
  "Common-concentration task must remain held at CP-001 boundary.",
);

const answerPositions = [0, 0, 0, 0];
const review: ReturnType<typeof generateMalCp006Wave01EditorialV2FinalQuestion>[] = [];
const evidence: Array<{
  prototypeId: string;
  states: number;
  siblingStates: number;
  stemShapes: number;
  answers: number;
  difficulty: string;
}> = [];

let generated = 0;
let deterministic = 0;
let answerProofs = 0;
let learnerProofs = 0;
let distractorProofs = 0;
let lifecycleProofs = 0;

for (const prototypeId of MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS) {
  const states = new Set<string>();
  const siblings = new Set<string>();
  const shapes = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < 100; index += 1) {
    const seed = `mal-cp006-wave01-v2-final:${prototypeId}:${index}`;
    const first = generateMalCp006Wave01EditorialV2FinalQuestion(prototypeId, seed);
    const replay = generateMalCp006Wave01EditorialV2FinalQuestion(prototypeId, seed);

    assert(
      malCp006Wave01V2FinalStable(first) === malCp006Wave01V2FinalStable(replay),
      `${seed}: output is not deterministic.`,
    );
    deterministic += 1;

    assert(first.runtimeId === MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID, `${seed}: runtime changed.`);
    assert(first.prototypeId === prototypeId, `${seed}: prototype route changed.`);
    assert(first.validation.ok, `${seed}: ${first.validation.errors.join(" | ")}`);
    assert(verifyMalCp006Wave01V2Answer(first), `${seed}: independent answer proof failed.`);
    answerProofs += 1;

    assert(first.stem.endsWith("?"), `${seed}: stem does not end with ?.`);
    assert(!/(?:^|\s)Find\s.+\.$/u.test(first.stem), `${seed}: command-style stem survived.`);
    assert(first.explanation.visibleLines.length >= 3 && first.explanation.visibleLines.length <= 4, `${seed}: solution is not 3-4 lines.`);
    assert(first.explanation.visibleLines.filter((line) => /\d/u.test(line)).length >= 3, `${seed}: solution is not calculation-first.`);
    const learnerText = [
      first.stem,
      ...first.explanation.visibleLines,
      first.explanation.optionalHelp.commonMistake,
    ].join(" ");
    const lower = learnerText.toLowerCase();
    for (const phrase of bannedLearnerPhrases) {
      assert(!lower.includes(phrase), `${seed}: learner phrase '${phrase}' survived.`);
    }
    assert(!/\bcomponent\s+[ab]\b/iu.test(learnerText), `${seed}: internal component label leaked.`);
    assertFriendlyFractions(learnerText, seed);
    if (prototypeId === "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS") {
      assert((first.stem.match(/%/gu) ?? []).length >= 2, `${seed}: both starting concentrations are not visible.`);
    }
    learnerProofs += 1;

    assert(first.options.length === 4 && new Set(first.options).size === 4, `${seed}: options are not four unique values.`);
    assert(first.options[first.correctIndex] === first.answer, `${seed}: answer/index mismatch.`);
    assert(first.optionAudit.filter((entry) => entry.isCorrect).length === 1, `${seed}: correct option ownership failed.`);
    for (const entry of first.optionAudit) {
      assert(!genericDistractors.has(entry.misconceptionId), `${seed}: generic distractor ${entry.misconceptionId} survived.`);
    }
    distractorProofs += 1;

    assert(first.permanentQlId === null && first.permanentSolveModeId === null, `${seed}: permanent identity allocated.`);
    assert(first.runtimeMode === "REVIEW_ONLY", `${seed}: review-only runtime changed.`);
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      `${seed}: delivery lifecycle activated.`,
    );
    lifecycleProofs += 1;

    states.add(first.stateKey);
    siblings.add(first.siblingStateKey);
    shapes.add(stemShape(first.stem));
    answers.add(first.answer);
    answerPositions[first.correctIndex] += 1;
    generated += 1;
    if (index < 5) review.push(first);
  }

  assert(states.size >= 20, `${prototypeId}: too few exact states (${states.size}).`);
  assert(siblings.size >= 6, `${prototypeId}: too few sibling states (${siblings.size}).`);
  assert(shapes.size >= 4, `${prototypeId}: fewer than four natural stem forms (${shapes.size}).`);
  assert(answers.size >= 3, `${prototypeId}: too few answer values (${answers.size}).`);
  const sample = generateMalCp006Wave01EditorialV2FinalQuestion(prototypeId, `sample:${prototypeId}`);
  evidence.push({
    prototypeId,
    states: states.size,
    siblingStates: siblings.size,
    stemShapes: shapes.size,
    answers: answers.size,
    difficulty: sample.difficulty,
  });
}

assert(generated === 500, `Expected 500 questions, got ${generated}.`);
assert(deterministic === 500, "Determinism proof incomplete.");
assert(answerProofs === 500, "Answer proof incomplete.");
assert(learnerProofs === 500, "Learner-surface proof incomplete.");
assert(distractorProofs === 500, "Distractor proof incomplete.");
assert(lifecycleProofs === 500, "Lifecycle proof incomplete.");
assert(answerPositions.every((count) => count >= 80), `Answer positions too imbalanced: ${answerPositions.join("/")}.`);
assert(review.length === 25, "Expected 25 review questions.");

const out = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(out, { recursive: true });
const result = {
  status: "PASS_MAL_CP006_WAVE01_LEARNER_REMEDIATION_V2_FINAL",
  runtimeId: MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
  retainedPrototypeCount: 5,
  heldPrototypeCount: 1,
  heldPrototype: held[0],
  permanentQlCount: 0,
  permanentSolveModeCount: 0,
  generated,
  deterministic,
  answerProofs,
  learnerProofs,
  distractorProofs,
  lifecycleProofs,
  answerPositions,
  reviewQuestionCount: review.length,
  evidence,
  learnerPolicy: {
    naturalContextsOnly: true,
    interrogativeStemsOnly: true,
    calculationFirstExplanations: true,
    startingConcentrationsVisibleForEqualExchange: true,
    technicalMetadataHidden: true,
    misconceptionDistractorsOnly: true,
    commonConcentrationHeldAtCp001Boundary: true,
  },
  lifecycle: {
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  },
};
writeFileSync(resolve(out, "mal-cp006-wave01-learner-remediation-v2-final.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");

const letters = ["A", "B", "C", "D"];
const markdown = [
  "# MAL-CP-006 Wave 01 — Learner Remediation V2 Final — 25Q Review",
  "",
  "> English discovery review only. Five learner candidates are retained. The common-concentration candidate is held at the CP-001 boundary. No permanent allocation or delivery activation is authorized.",
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
assert(!markdown.toLowerCase().includes("state key"), "Technical state key leaked into review export.");
writeFileSync(resolve(out, "MAL-CP-006-WAVE-01-LEARNER-REMEDIATION-V2-FINAL-25Q-REVIEW.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
