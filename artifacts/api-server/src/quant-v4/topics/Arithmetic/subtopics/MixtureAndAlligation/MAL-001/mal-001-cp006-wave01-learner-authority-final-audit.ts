import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  generateMalCp006Wave01FinalLearnerAuthorityQuestion,
  MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID,
  MAL_CP006_WAVE01_V2_HELD_PROTOTYPES,
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS,
  malCp006Wave01FinalLearnerAuthorityStable,
  verifyMalCp006Wave01V2Answer,
} from "./foundation/cp006-wave01-learner-authority-final";
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

const ALLOWED_OPTION_DENOMINATORS = new Set([2, 3, 4, 5, 8, 10]);
const ALLOWED_PERCENT_DENOMINATORS = new Set([2, 3, 4, 5]);

function assertFriendlyOption(option: string, seed: string): void {
  for (const match of option.matchAll(/(\d+)\/(\d+)/gu)) {
    const denominator = Number(match[2]);
    assert(
      ALLOWED_OPTION_DENOMINATORS.has(denominator),
      `${seed}: option '${option}' has unfriendly denominator ${denominator}.`,
    );
    if (option.includes("%")) {
      assert(
        ALLOWED_PERCENT_DENOMINATORS.has(denominator),
        `${seed}: percent option '${option}' has unfriendly denominator ${denominator}.`,
      );
    }
  }
}

const forbiddenLearnerPhrases = [
  "salt solution component",
  "component load",
  "state key",
  "current fraction",
  "global component",
  "snapshot",
  "recompute",
];

const genericDistractorIds = new Set([
  "ADDED_ONE_PART_AFTER_REDUCTION",
  "ALTERED_COMPLEMENT_PART",
  "SUBTRACTED_ONE_LITRE_EXTRA",
  "ADDED_ONE_LITRE_EXTRA",
  "HALVED_FINAL_COMPONENT_SHARE",
  "DOUBLE_COUNTED_TRANSFERRED_COMPONENT",
]);

assert(
  MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS.length === 5,
  "Final learner authority must retain exactly five Wave 01 candidates.",
);
const held = Object.entries(MAL_CP006_WAVE01_V2_HELD_PROTOTYPES);
assert(held.length === 1, "Exactly one Wave 01 candidate must remain held.");
assert(
  held[0]?.[0] ===
    "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE" &&
    held[0]?.[1].decision === "HOLD_CP001_WEIGHTED_BLEND_EQUIVALENT",
  "Common-concentration candidate must remain held at the CP-001 boundary.",
);

let generated = 0;
let deterministic = 0;
let answerProofs = 0;
let learnerSurfaceProofs = 0;
let optionProofs = 0;
let lifecycleProofs = 0;
let calculationProofs = 0;
const answerPositions = [0, 0, 0, 0];
const review: ReturnType<typeof generateMalCp006Wave01FinalLearnerAuthorityQuestion>[] = [];
const evidence: Array<{
  prototypeId: string;
  exactStates: number;
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

  for (let index = 0; index < 100; index += 1) {
    const seed = `mal-cp006-wave01-final-authority:${prototypeId}:${index}`;
    const first = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
      prototypeId,
      seed,
    );
    const replay = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
      prototypeId,
      seed,
    );

    assert(
      malCp006Wave01FinalLearnerAuthorityStable(first) ===
        malCp006Wave01FinalLearnerAuthorityStable(replay),
      `${seed}: final learner authority is not deterministic.`,
    );
    deterministic += 1;

    assert(
      first.runtimeId === MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
      `${seed}: learner runtime identity changed.`,
    );
    assert(first.prototypeId === prototypeId, `${seed}: prototype route changed.`);
    assert(first.validation.ok, `${seed}: ${first.validation.errors.join(" | ")}`);
    assert(
      verifyMalCp006Wave01V2Answer(first),
      `${seed}: independent exact-answer verification failed.`,
    );
    answerProofs += 1;

    assert(first.stem.endsWith("?"), `${seed}: stem is not a question.`);
    assert(
      !/(?:^|\s)Find\s.+\.$/u.test(first.stem),
      `${seed}: command-style question survived.`,
    );
    const learnerText = [
      first.stem,
      ...first.options,
      ...first.explanation.visibleLines,
      first.explanation.optionalHelp.commonMistake,
      ...first.explanation.optionalHelp.verification,
    ].join(" ");
    const lower = learnerText.toLowerCase();
    for (const phrase of forbiddenLearnerPhrases) {
      assert(
        !lower.includes(phrase),
        `${seed}: internal learner phrase '${phrase}' survived.`,
      );
    }
    assert(
      !/\ba (?:acid|alcohol)-water\b/iu.test(learnerText),
      `${seed}: a/an article error survived.`,
    );
    assert(!/\b1 litres\b/iu.test(learnerText), `${seed}: '1 litres' survived.`);
    assert(
      !/\blitres goes\b/iu.test(learnerText),
      `${seed}: plural transfer grammar survived.`,
    );
    assert(
      !/What is (?:final )?[a-z]+\s*:\s*[a-z]+/iu.test(first.stem),
      `${seed}: colon-style prose survived in the question wording.`,
    );
    assert(
      !/\bcomponent\s+[ab]\b/iu.test(learnerText),
      `${seed}: internal component label leaked.`,
    );
    learnerSurfaceProofs += 1;

    assert(first.options.length === 4, `${seed}: option count changed.`);
    assert(new Set(first.options).size === 4, `${seed}: duplicate options.`);
    assert(
      first.options[first.correctIndex] === first.answer,
      `${seed}: answer/index mismatch.`,
    );
    assert(
      first.optionAudit.length === 4 &&
        first.optionAudit.every((entry, optionIndex) => entry.text === first.options[optionIndex]),
      `${seed}: option audit is not synchronized with learner options.`,
    );
    assert(
      first.optionAudit.filter((entry) => entry.isCorrect).length === 1,
      `${seed}: correct-option ownership failed.`,
    );
    assert(
      first.optionAudit.filter((entry) => entry.misconceptionId !== "CORRECT").length === 3,
      `${seed}: expected three misconception-owned distractors.`,
    );
    for (const entry of first.optionAudit) {
      assert(
        !genericDistractorIds.has(entry.misconceptionId),
        `${seed}: generic perturbation distractor ${entry.misconceptionId} survived.`,
      );
    }
    for (const option of first.options) assertFriendlyOption(option, seed);
    optionProofs += 1;

    assert(
      first.explanation.visibleLines.length >= 3 &&
        first.explanation.visibleLines.length <= 4,
      `${seed}: visible solution must contain three or four short lines.`,
    );
    assert(
      first.explanation.visibleLines.filter((line) => /\d/u.test(line)).length >= 3,
      `${seed}: solution is not calculation-first.`,
    );
    if (
      prototypeId ===
      "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS"
    ) {
      assert(
        (first.stem.match(/%/gu) ?? []).length >= 2,
        `${seed}: both starting concentrations are not stated.`,
      );
      assert(
        first.explanation.visibleLines.some(
          (line) => line.includes("=") && line.includes("/") && line.includes("x"),
        ),
        `${seed}: equal-exchange solution does not show the actual equation.`,
      );
      assert(
        !first.explanation.visibleLines.join(" ").includes("first liquid"),
        `${seed}: generic 'first liquid' wording survived.`,
      );
    }
    if (
      prototypeId ===
      "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO"
    ) {
      const working = first.explanation.visibleLines.join(" ");
      assert(
        working.includes("Milk fraction in B"),
        `${seed}: round-trip solution does not use direct fraction arithmetic.`,
      );
      assert(
        !working.includes("Milk percentage in B"),
        `${seed}: round-trip solution reverted to awkward percentage conversion.`,
      );
    }
    calculationProofs += 1;

    assert(first.permanentQlId === null, `${seed}: permanent QL allocated.`);
    assert(
      first.permanentSolveModeId === null,
      `${seed}: permanent solve mode allocated.`,
    );
    assert(first.runtimeMode === "REVIEW_ONLY", `${seed}: runtime mode changed.`);
    assert(
      !first.active &&
        !first.publiclyPublishable &&
        !first.questionStudioDiscoverable &&
        !first.questionBankWritable &&
        !first.testEligible,
      `${seed}: a delivery lifecycle surface was activated.`,
    );
    lifecycleProofs += 1;

    states.add(first.stateKey);
    siblingStates.add(first.siblingStateKey);
    shapes.add(stemShape(first.stem));
    answers.add(first.answer);
    answerPositions[first.correctIndex] += 1;
    generated += 1;
    if (index < 5) review.push(first);
  }

  assert(states.size >= 15, `${prototypeId}: too few exact states (${states.size}).`);
  if (
    prototypeId ===
    "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS"
  ) {
    assert(
      siblingStates.size >= 10,
      `${prototypeId}: curated equal-exchange pool is too narrow (${siblingStates.size}).`,
    );
  } else {
    assert(
      siblingStates.size >= 6,
      `${prototypeId}: too few sibling states (${siblingStates.size}).`,
    );
  }
  assert(shapes.size >= 4, `${prototypeId}: fewer than four natural stem forms.`);
  assert(answers.size >= 4, `${prototypeId}: answer diversity is too low.`);

  const sample = generateMalCp006Wave01FinalLearnerAuthorityQuestion(
    prototypeId,
    `mal-cp006-wave01-final-authority:sample:${prototypeId}`,
  );
  evidence.push({
    prototypeId,
    exactStates: states.size,
    siblingStates: siblingStates.size,
    stemShapes: shapes.size,
    answers: answers.size,
    difficulty: sample.difficulty,
  });
}

assert(generated === 500, `Expected 500 generated questions, got ${generated}.`);
assert(deterministic === 500, "Determinism proof incomplete.");
assert(answerProofs === 500, "Answer proof incomplete.");
assert(learnerSurfaceProofs === 500, "Learner-surface proof incomplete.");
assert(optionProofs === 500, "Option proof incomplete.");
assert(calculationProofs === 500, "Calculation-first proof incomplete.");
assert(lifecycleProofs === 500, "Lifecycle proof incomplete.");
assert(
  answerPositions.every((count) => count >= 80),
  `Answer positions are too imbalanced: ${answerPositions.join("/")}.`,
);
assert(review.length === 25, "Expected 25 final review questions.");
assert(
  review.every(
    (question) =>
      question.prototypeId !==
      "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE",
  ),
  "Held CP-001-equivalent candidate leaked into final learner review.",
);

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const result = {
  status: "PASS_MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY",
  authorityId: MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID,
  runtimeId: MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
  retainedPrototypeCount: 5,
  heldPrototypeCount: 1,
  heldPrototype: held[0],
  permanentQlCount: 0,
  permanentSolveModeCount: 0,
  generated,
  deterministic,
  answerProofs,
  learnerSurfaceProofs,
  optionProofs,
  calculationProofs,
  lifecycleProofs,
  answerPositions,
  reviewQuestionCount: review.length,
  evidence,
  learnerPolicy: {
    naturalExamEnglish: true,
    calculationFirstSolutions: true,
    actualEquationForEqualExchange: true,
    directFractionArithmeticForRoundTrip: true,
    optionArithmeticGuard: true,
    misconceptionOwnedDistractors: true,
    technicalMetadataHidden: true,
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
writeFileSync(
  resolve(outputDirectory, "mal-cp006-wave01-final-learner-authority.json"),
  `${JSON.stringify(result, null, 2)}\n`,
  "utf8",
);

const letters = ["A", "B", "C", "D"];
const markdown = [
  "# MAL-CP-006 Wave 01 — Final Learner Authority — 25Q Review",
  "",
  "> English discovery review only. Five learner candidates remain. The common-concentration candidate is held at the CP-001 weighted-blend boundary. No permanent allocation or delivery activation is authorized.",
  "",
  `Authority: \`${MAL_CP006_WAVE01_FINAL_LEARNER_AUTHORITY_ID}\``,
  `Runtime: \`${MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID}\``,
  "",
  ...review.flatMap((question, index) => [
    `## ${index + 1}. ${question.prototypeId} — ${question.difficulty}`,
    "",
    question.stem,
    "",
    ...question.options.map(
      (option, optionIndex) => `${letters[optionIndex]}. ${option}`,
    ),
    "",
    "<details>",
    "<summary>Answer and solution</summary>",
    "",
    `**Answer:** ${letters[question.correctIndex]}. ${question.answer}`,
    "",
    ...question.explanation.visibleLines.map(
      (line, lineIndex) => `${lineIndex + 1}. ${line}`,
    ),
    "",
    `**Common mistake:** ${question.explanation.optionalHelp.commonMistake}`,
    "",
    "</details>",
    "",
  ]),
].join("\n");
assert(
  !markdown.toLowerCase().includes("state key"),
  "Technical state key leaked into final review export.",
);
writeFileSync(
  resolve(
    outputDirectory,
    "MAL-CP-006-WAVE-01-FINAL-LEARNER-AUTHORITY-25Q-REVIEW.md",
  ),
  `${markdown}\n`,
  "utf8",
);
console.log(JSON.stringify(result, null, 2));
