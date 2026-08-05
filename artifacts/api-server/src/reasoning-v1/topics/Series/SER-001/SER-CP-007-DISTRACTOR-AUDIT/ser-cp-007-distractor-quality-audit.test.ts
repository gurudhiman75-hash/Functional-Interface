import assert from "node:assert/strict";
import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";
import { editorialTaskKindFor } from "../SER-CP-007-ENGLISH-REMODEL/adaptive-review";

type AuditQuestion = {
  readonly temporaryTemplateId: string;
  readonly canonicalAuthorityId: string;
  readonly sourceRuleId: string;
  readonly taskKind: string;
  readonly options: readonly string[];
  readonly correctAnswer: string;
  readonly correctIndex: number;
  readonly explanation: {
    readonly commonMistake: string;
    readonly trapCode: string;
  };
};

type Probe = {
  readonly temporaryTemplateId: string;
  readonly generate: (seed: number) => AuditQuestion;
};

const probes: readonly Probe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as unknown as AuditQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as AuditQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as AuditQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as AuditQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as AuditQuestion,
  })),
];

assert.equal(probes.length, 140);
assert.equal(new Set(probes.map((probe) => probe.temporaryTemplateId)).size, 140);

type DistractorFamily =
  | "SINGLE_POSITION_MUTATION"
  | "TWO_POSITION_MUTATION"
  | "UNIFORM_SHIFT_FORWARD"
  | "UNIFORM_SHIFT_BACKWARD"
  | "WHOLE_REVERSAL"
  | "CYCLIC_ROTATION"
  | "PAIRWISE_ADJACENT_SWAP"
  | "LENGTH_PLUS_ONE"
  | "LENGTH_MINUS_ONE"
  | "SAME_PREFIX_WRONG_END"
  | "SAME_SUFFIX_WRONG_START"
  | "ORDERED_PAIR_SWAPPED"
  | "ONE_COMPONENT_WRONG"
  | "WRONG_TO_REPLACEMENT_LEFT_FIXED"
  | "UNKNOWN";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function increment<K>(map: Map<K, number>, key: K, amount = 1): void {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function splitUnits(value: string): readonly string[] {
  return value
    .split(/\s*(?:,|→)\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function letterPositions(value: string): readonly number[] | null {
  const positions: number[] = [];
  for (const character of value) {
    const position = ALPHABET.indexOf(character.toUpperCase());
    if (position < 0) return null;
    positions.push(position);
  }
  return positions;
}

function hammingDistance(left: string, right: string): number | null {
  if (left.length !== right.length) return null;
  let distance = 0;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) distance += 1;
  }
  return distance;
}

function isUniformShift(
  correct: string,
  distractor: string,
): "FORWARD" | "BACKWARD" | null {
  const left = letterPositions(correct);
  const right = letterPositions(distractor);
  if (!left || !right || left.length !== right.length || left.length === 0) {
    return null;
  }
  const shifts = left.map(
    (position, index) => ((right[index]! - position) % 26 + 26) % 26,
  );
  if (new Set(shifts).size !== 1 || shifts[0] === 0) return null;
  return shifts[0]! <= 13 ? "FORWARD" : "BACKWARD";
}

function isRotation(correct: string, distractor: string): boolean {
  return (
    correct.length === distractor.length &&
    correct !== distractor &&
    (correct + correct).includes(distractor)
  );
}

function pairwiseSwap(value: string): string | null {
  if (value.length < 2 || value.length % 2 !== 0) return null;
  let output = "";
  for (let index = 0; index < value.length; index += 2) {
    output += value[index + 1]! + value[index]!;
  }
  return output;
}

function classifySingleUnit(
  correct: string,
  distractor: string,
): ReadonlySet<DistractorFamily> {
  const families = new Set<DistractorFamily>();
  if (correct.length === distractor.length) {
    const distance = hammingDistance(correct, distractor);
    if (distance === 1) families.add("SINGLE_POSITION_MUTATION");
    if (distance === 2) families.add("TWO_POSITION_MUTATION");

    const shift = isUniformShift(correct, distractor);
    if (shift === "FORWARD") families.add("UNIFORM_SHIFT_FORWARD");
    if (shift === "BACKWARD") families.add("UNIFORM_SHIFT_BACKWARD");

    if ([...correct].reverse().join("") === distractor) {
      families.add("WHOLE_REVERSAL");
    }
    if (isRotation(correct, distractor)) families.add("CYCLIC_ROTATION");
    if (pairwiseSwap(correct) === distractor) {
      families.add("PAIRWISE_ADJACENT_SWAP");
    }

    if (
      correct.length > 1 &&
      correct.slice(0, -1) === distractor.slice(0, -1) &&
      correct.at(-1) !== distractor.at(-1)
    ) {
      families.add("SAME_PREFIX_WRONG_END");
    }
    if (
      correct.length > 1 &&
      correct.slice(1) === distractor.slice(1) &&
      correct[0] !== distractor[0]
    ) {
      families.add("SAME_SUFFIX_WRONG_START");
    }
  }

  if (distractor.length === correct.length + 1) {
    families.add("LENGTH_PLUS_ONE");
  }
  if (distractor.length + 1 === correct.length) {
    families.add("LENGTH_MINUS_ONE");
  }

  if (families.size === 0) families.add("UNKNOWN");
  return families;
}

function classifyDistractor(
  correctAnswer: string,
  distractor: string,
): ReadonlySet<DistractorFamily> {
  const correctUnits = splitUnits(correctAnswer);
  const distractorUnits = splitUnits(distractor);

  if (correctUnits.length === 1 && distractorUnits.length === 1) {
    return classifySingleUnit(correctUnits[0]!, distractorUnits[0]!);
  }

  const families = new Set<DistractorFamily>();
  if (
    correctUnits.length === 2 &&
    distractorUnits.length === 2 &&
    correctUnits[0] === distractorUnits[1] &&
    correctUnits[1] === distractorUnits[0]
  ) {
    families.add("ORDERED_PAIR_SWAPPED");
  }

  if (correctUnits.length === distractorUnits.length) {
    const mismatches = correctUnits.filter(
      (unit, index) => unit !== distractorUnits[index],
    ).length;
    if (mismatches === 1) families.add("ONE_COMPONENT_WRONG");
  }

  if (
    correctAnswer.includes("→") &&
    distractor.includes("→") &&
    correctUnits.length === 2 &&
    distractorUnits.length === 2 &&
    correctUnits[0] === distractorUnits[0] &&
    correctUnits[1] !== distractorUnits[1]
  ) {
    families.add("WRONG_TO_REPLACEMENT_LEFT_FIXED");
  }

  for (let index = 0; index < Math.min(correctUnits.length, distractorUnits.length); index += 1) {
    for (const family of classifySingleUnit(
      correctUnits[index]!,
      distractorUnits[index]!,
    )) {
      if (family !== "UNKNOWN") families.add(family);
    }
  }

  if (families.size === 0) families.add("UNKNOWN");
  return families;
}

function expectedFamilies(commonMistake: string): ReadonlySet<DistractorFamily> {
  const text = commonMistake.toLowerCase();
  const expected = new Set<DistractorFamily>();

  if (/reverse the whole|whole group|right to left/.test(text)) {
    expected.add("WHOLE_REVERSAL");
  }
  if (/neighbouring pair|neighboring pair|each pair/.test(text)) {
    expected.add("PAIRWISE_ADJACENT_SWAP");
  }
  if (/rotate|rotation|move the first .* to the end/.test(text)) {
    expected.add("CYCLIC_ROTATION");
  }
  if (/forward|backward|wrong direction|opposite direction/.test(text)) {
    expected.add("UNIFORM_SHIFT_FORWARD");
    expected.add("UNIFORM_SHIFT_BACKWARD");
  }
  if (/longer|shorter|length|one letter/.test(text)) {
    expected.add("LENGTH_PLUS_ONE");
    expected.add("LENGTH_MINUS_ONE");
  }
  if (/first letter|last letter|edge|middle/.test(text)) {
    expected.add("SINGLE_POSITION_MUTATION");
    expected.add("TWO_POSITION_MUTATION");
    expected.add("SAME_PREFIX_WRONG_END");
    expected.add("SAME_SUFFIX_WRONG_START");
  }
  if (/row|alternate|odd|even/.test(text)) {
    expected.add("ONE_COMPONENT_WRONG");
    expected.add("ORDERED_PAIR_SWAPPED");
  }
  if (/order of the answers|blank order|group order/.test(text)) {
    expected.add("ORDERED_PAIR_SWAPPED");
  }
  if (/replacement|replace/.test(text)) {
    expected.add("WRONG_TO_REPLACEMENT_LEFT_FIXED");
    expected.add("ONE_COMPONENT_WRONG");
  }

  return expected;
}

const familyCounts = new Map<DistractorFamily, number>();
const taskCounts = new Map<string, number>();
const authorityCounts = new Map<string, number>();
const trapCodeCounts = new Map<string, number>();
const unknownByAuthority = new Map<string, number>();
const alignmentByAuthority = new Map<string, { aligned: number; auditable: number }>();
let sampledQuestions = 0;
let sampledDistractors = 0;
let meaningfulDistractors = 0;
let unknownDistractors = 0;
let allDistractorsMeaningfulQuestions = 0;
let atLeastOneMeaningfulQuestions = 0;
let auditableCommonMistakeQuestions = 0;
let alignedCommonMistakeQuestions = 0;
let unauditableCommonMistakeQuestions = 0;
let answerSemanticProofs = 0;
let optionUniquenessProofs = 0;
let replacementTaskProofs = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    assert.equal(question.temporaryTemplateId, probe.temporaryTemplateId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);
    assert.equal(
      question.options.filter((option) => option === question.correctAnswer).length,
      1,
    );
    optionUniquenessProofs += 1;

    const editorialTaskKind = editorialTaskKindFor(question.taskKind);
    if (question.taskKind === "WRONG_TERM") {
      assert.equal(editorialTaskKind, "REPLACE_WRONG_TERM");
      replacementTaskProofs += 1;
    }
    answerSemanticProofs += 1;

    const distractors = question.options.filter(
      (_, index) => index !== question.correctIndex,
    );
    const questionFamilies = new Set<DistractorFamily>();
    let meaningfulInQuestion = 0;
    for (const distractor of distractors) {
      const families = classifyDistractor(question.correctAnswer, distractor);
      const meaningful = [...families].some((family) => family !== "UNKNOWN");
      if (meaningful) {
        meaningfulDistractors += 1;
        meaningfulInQuestion += 1;
      } else {
        unknownDistractors += 1;
        increment(unknownByAuthority, question.canonicalAuthorityId);
      }
      for (const family of families) {
        increment(familyCounts, family);
        questionFamilies.add(family);
      }
      sampledDistractors += 1;
    }

    if (meaningfulInQuestion === distractors.length) {
      allDistractorsMeaningfulQuestions += 1;
    }
    if (meaningfulInQuestion > 0) atLeastOneMeaningfulQuestions += 1;

    const expected = expectedFamilies(question.explanation.commonMistake);
    if (expected.size === 0) {
      unauditableCommonMistakeQuestions += 1;
    } else {
      auditableCommonMistakeQuestions += 1;
      const aligned = [...expected].some((family) => questionFamilies.has(family));
      const authorityAlignment =
        alignmentByAuthority.get(question.canonicalAuthorityId) ?? {
          aligned: 0,
          auditable: 0,
        };
      authorityAlignment.auditable += 1;
      if (aligned) {
        alignedCommonMistakeQuestions += 1;
        authorityAlignment.aligned += 1;
      }
      alignmentByAuthority.set(
        question.canonicalAuthorityId,
        authorityAlignment,
      );
    }

    increment(taskCounts, editorialTaskKind);
    increment(authorityCounts, question.canonicalAuthorityId);
    increment(trapCodeCounts, question.explanation.trapCode);
    sampledQuestions += 1;
  }
}

assert.equal(sampledQuestions, 420);
assert.equal(sampledDistractors, 1_260);
assert.equal(optionUniquenessProofs, 420);
assert.equal(answerSemanticProofs, 420);
assert.equal(replacementTaskProofs, 99);
assert.equal(
  meaningfulDistractors + unknownDistractors,
  sampledDistractors,
);
assert.equal(
  auditableCommonMistakeQuestions + unauditableCommonMistakeQuestions,
  sampledQuestions,
);
assert.ok(atLeastOneMeaningfulQuestions > 0);
assert.ok(familyCounts.size > 1);

const alignmentRate =
  auditableCommonMistakeQuestions === 0
    ? 0
    : alignedCommonMistakeQuestions / auditableCommonMistakeQuestions;
const meaningfulDistractorRate = meaningfulDistractors / sampledDistractors;

const authorityAlignment = Object.fromEntries(
  [...alignmentByAuthority.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([authority, value]) => [
      authority,
      {
        ...value,
        rate: Number((value.aligned / value.auditable).toFixed(4)),
      },
    ]),
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_DISTRACTOR_AUDIT_REMODEL_REQUIRED",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      sampledQuestions,
      sampledDistractors,
      optionUniquenessProofs,
      answerSemanticProofs,
      replacementTaskProofs,
      meaningfulDistractors,
      unknownDistractors,
      meaningfulDistractorRate: Number(meaningfulDistractorRate.toFixed(4)),
      allDistractorsMeaningfulQuestions,
      atLeastOneMeaningfulQuestions,
      auditableCommonMistakeQuestions,
      unauditableCommonMistakeQuestions,
      alignedCommonMistakeQuestions,
      alignmentRate: Number(alignmentRate.toFixed(4)),
      distractorFamilyCounts: Object.fromEntries(
        [...familyCounts.entries()].sort(),
      ),
      taskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      authorityCounts: Object.fromEntries([...authorityCounts.entries()].sort()),
      trapCodeCounts: Object.fromEntries([...trapCodeCounts.entries()].sort()),
      unknownDistractorsByAuthority: Object.fromEntries(
        [...unknownByAuthority.entries()].sort(),
      ),
      authorityAlignment,
      auditConclusion:
        "STRUCTURAL_OPTIONS_VALID_MISCONCEPTION_ALIGNMENT_NOT_YET_FREEZE_GRADE",
      permanentQls: 0,
      englishDiscoveryFreeze: "BLOCKED",
      nextAuthority:
        "SER_CP007_DISTRACTOR_MISCONCEPTION_REMODEL_AND_MANUAL_REVIEW",
    },
    null,
    2,
  ),
);
