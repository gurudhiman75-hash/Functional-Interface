import { SeededRandom } from "../foundation/prng";
import type { CodDifficulty, CodRenderer, GeneratedOption } from "../foundation/types";
import { validateOptions } from "../foundation/option-validator";
import { getUniformDigitPrototypeContract } from "./uniform-digit-contracts";
import {
  decimalDigits,
  digitTranslationTrace,
  hasRepeatedDigit,
  inverseTranslateDigitSequence,
  translateDigitSequence,
  wrapCount,
} from "./uniform-digit-rule";
import { auditUniformDigitEvidence } from "./uniform-digit-solver";
import type {
  GeneratedUniformDigitPrototypeQuestion,
  UniformDigitEvidence,
  UniformDigitPrototypeId,
  UniformDigitTaskKind,
} from "./uniform-digit-types";

const RENDERERS: readonly CodRenderer[] = ["INLINE_CODE_PAIR", "EXAMPLE_TARGET_BLOCK", "MAPPING_TABLE"];
const TARGET_PROFILES = ["PLAIN", "LEADING_SOURCE", "LEADING_CODE", "REPEATED", "WRAP_HEAVY"] as const;

type TargetProfile = typeof TARGET_PROFILES[number];

function randomDigit(random: SeededRandom): string {
  return String(random.int(0, 9));
}

function makeDistinctDigitString(random: SeededRandom, length: number, shift: number, requireWrap: boolean): string {
  const digits = Array.from({ length }, () => randomDigit(random));
  const wrapStart = 10 - shift;
  if (requireWrap) digits[random.int(0, length - 1)] = String(random.int(wrapStart, 9));
  digits[random.int(0, length - 1)] = String(random.int(0, Math.max(0, wrapStart - 1)));
  if (digits.every((digit) => digit === digits[0])) digits[length - 1] = String((Number(digits[0]) + 3) % 10);
  if (digits.join("") === [...digits].reverse().join("")) digits[length - 1] = String((Number(digits[length - 1]) + 1) % 10);
  return digits.join("");
}

function buildEvidence(random: SeededRandom, shift: number): UniformDigitEvidence[] {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const firstSource = makeDistinctDigitString(random, 5, shift, true);
    const secondSource = makeDistinctDigitString(random, 4, shift, attempt % 2 === 0);
    const evidence = [
      { source: firstSource, code: translateDigitSequence(firstSource, shift) },
      { source: secondSource, code: translateDigitSequence(secondSource, shift) },
    ];
    if (auditUniformDigitEvidence(evidence, shift).accepted) return evidence;
  }
  throw new Error(`Unable to build unambiguous uniform digit evidence for shift ${shift}`);
}

function buildTarget(random: SeededRandom, shift: number, profile: TargetProfile, length: number): string {
  const digits = Array.from({ length }, () => randomDigit(random));
  const wrapStart = 10 - shift;

  if (profile === "LEADING_SOURCE") digits[0] = "0";
  if (profile === "LEADING_CODE") digits[0] = String(wrapStart);
  if (profile === "REPEATED") {
    const repeated = randomDigit(random);
    digits[0] = repeated;
    digits[Math.min(2, length - 1)] = repeated;
  }
  if (profile === "WRAP_HEAVY") {
    for (let index = 0; index < Math.max(1, Math.floor(length / 2)); index += 1) {
      digits[index] = String(random.int(wrapStart, 9));
    }
  }
  if (profile === "PLAIN") {
    for (let index = 0; index < length; index += 1) {
      digits[index] = String(random.int(0, Math.max(0, wrapStart - 1)));
    }
  }
  return digits.join("");
}

function mutateAt(value: string, index: number, amount: number): string {
  const digits = [...value];
  digits[index] = String((Number(digits[index]) + amount + 10) % 10);
  return digits.join("");
}

function sequenceDistractorCandidates(
  taskKind: UniformDigitTaskKind,
  targetSource: string,
  targetCode: string,
  shift: number,
  correct: string,
): { value: string; errorLabel: string }[] {
  const candidates: { value: string; errorLabel: string }[] = [];
  if (taskKind === "DECODE_TARGET") {
    candidates.push(
      { value: translateDigitSequence(targetCode, shift), errorLabel: "ENCODED_INSTEAD_OF_DECODED" },
      { value: inverseTranslateDigitSequence(targetCode, (shift % 9) + 1), errorLabel: "WRONG_INVERSE_SHIFT" },
      { value: [...correct].reverse().join(""), errorLabel: "REVERSED_DECODE" },
      { value: mutateAt(correct, 0, 1), errorLabel: "FIRST_DIGIT_OFF_BY_ONE" },
    );
  } else {
    candidates.push(
      { value: translateDigitSequence(targetSource, -shift), errorLabel: "WRONG_SHIFT_DIRECTION" },
      { value: translateDigitSequence(targetSource, (shift % 9) + 1), errorLabel: "OFF_BY_ONE_SHIFT" },
      { value: [...correct].reverse().join(""), errorLabel: "REVERSED_CODE" },
      { value: targetSource, errorLabel: "RULE_NOT_APPLIED" },
      { value: mutateAt(correct, Math.floor(correct.length / 2), 1), errorLabel: "ONE_POSITION_OFF_BY_ONE" },
    );
  }
  return candidates;
}

function buildOptions(
  random: SeededRandom,
  taskKind: UniformDigitTaskKind,
  targetSource: string,
  targetCode: string,
  shift: number,
  correct: string,
): { options: GeneratedOption[]; correctIndex: number } {
  if (taskKind === "RECOVER_MISSING_TOKEN") {
    const correctDigit = Number(correct);
    const options = random.shuffle([
      { value: correct, isCorrect: true },
      { value: String((correctDigit + 1) % 10), isCorrect: false, errorLabel: "NEXT_DIGIT" },
      { value: String((correctDigit + 9) % 10), isCorrect: false, errorLabel: "PREVIOUS_DIGIT" },
      { value: String((correctDigit + 5) % 10), isCorrect: false, errorLabel: "OPPOSITE_DIGIT" },
    ] satisfies GeneratedOption[]);
    validateOptions(options);
    return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
  }

  const seen = new Set([correct]);
  const wrong: GeneratedOption[] = [];
  for (const candidate of sequenceDistractorCandidates(taskKind, targetSource, targetCode, shift, correct)) {
    if (candidate.value.length !== correct.length || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push({ ...candidate, isCorrect: false });
    if (wrong.length === 3) break;
  }
  for (let amount = 1; wrong.length < 3 && amount <= 9; amount += 1) {
    const value = mutateAt(correct, (amount - 1) % correct.length, amount);
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push({ value, isCorrect: false, errorLabel: "DIGIT_MUTATION_FALLBACK" });
  }
  if (wrong.length !== 3) throw new Error("Unable to build three unique digit-sequence distractors");
  const options = random.shuffle([{ value: correct, isCorrect: true }, ...wrong]);
  validateOptions(options);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function evidenceText(evidence: readonly UniformDigitEvidence[]): string {
  return evidence.map(({ source, code }) => `‘${source}’ is coded as ‘${code}’`).join(" and ");
}

function buildStem(
  taskKind: UniformDigitTaskKind,
  evidence: readonly UniformDigitEvidence[],
  targetSource: string,
  targetCode: string,
  displayedTargetCode: string | undefined,
  shift: number,
  style: number,
): string {
  const shown = evidenceText(evidence);
  if (taskKind === "ENCODE_TARGET") {
    const openings = [
      `In a digit code, every digit is moved ${shift} places forward on the cycle 0–9.`,
      `A code changes each digit independently by adding ${shift}, returning to 0 after 9.`,
      `Use the rule “add ${shift} to each digit separately, with decimal wrap”.`,
    ];
    return `${openings[style % openings.length]} For confirmation, ${shown}. How will ‘${targetSource}’ be coded?`;
  }
  if (taskKind === "DECODE_TARGET") {
    const endings = [
      `Which original digit string is represented by ‘${targetCode}’?`,
      `Decode ‘${targetCode}’ using the same rule.`,
      `What was the original string before it became ‘${targetCode}’?`,
    ];
    return `In a certain digit code, ${shown}. ${endings[style % endings.length]}`;
  }
  if (taskKind === "RECOVER_MISSING_TOKEN") {
    return `In a certain digit code, ${shown}. The code for ‘${targetSource}’ is shown as ‘${displayedTargetCode}’. Which digit replaces ‘?’?`;
  }
  if (taskKind === "INFER_AND_ENCODE") {
    const endings = [
      `Find the rule and code ‘${targetSource}’.`,
      `Using the same coding pattern, how will ‘${targetSource}’ be written?`,
      `Which code is obtained for ‘${targetSource}’?`,
    ];
    return `Study the digit coding examples: ${shown}. ${endings[style % endings.length]}`;
  }
  return `The same digit-wise coding rule is used in these examples: ${shown}. Which option is the correct code for ‘${targetSource}’?`;
}

function buildExplanation(
  taskKind: UniformDigitTaskKind,
  evidence: readonly UniformDigitEvidence[],
  targetSource: string,
  targetCode: string,
  displayedTargetCode: string | undefined,
  missingIndex: number | undefined,
  shift: number,
  correct: string,
  trap: GeneratedOption,
) {
  const first = evidence[0]!;
  const sourceTrace = digitTranslationTrace(first.source, shift).join(", ");
  const inverse = taskKind === "DECODE_TARGET";
  const targetTrace = inverse
    ? digitTranslationTrace(targetCode, -shift).join(", ")
    : digitTranslationTrace(targetSource, shift).join(", ");
  const ruleStatement = inverse
    ? `The examples show that each source digit moves ${shift} places forward around 0–9. To decode, move every coded digit ${shift} places backward.`
    : `The examples show one position-preserving rule: move every digit ${shift} places forward around 0–9.`;
  const targetApplication = taskKind === "RECOVER_MISSING_TOKEN"
    ? [
      `${targetSource} becomes ${targetCode}: ${targetTrace}.`,
      `The blank is at position ${(missingIndex ?? 0) + 1}, where the required digit is ${correct}; therefore ${displayedTargetCode} becomes ${targetCode}.`,
    ]
    : [`Applying the ${inverse ? "inverse " : ""}rule gives ${targetTrace}, so the result is ${correct}.`];

  return {
    referenceAid: [
      "Treat the code as a string of separate digits; do not add to the whole number.",
      "After 9, continue from 0. While decoding, move in the opposite direction.",
    ],
    quickMethod: inverse
      ? `Subtract ${shift} from each coded digit separately and wrap below 0.`
      : `Add ${shift} to each digit separately and wrap after 9.`,
    ruleStatement,
    sourceDemonstration: [
      `${first.source} → ${first.code}: ${sourceTrace}.`,
      `The second example, ${evidence[1]!.source} → ${evidence[1]!.code}, confirms the same digit-wise movement.`
    ],
    targetApplication,
    conclusion: taskKind === "RECOVER_MISSING_TOKEN"
      ? `Therefore, the missing digit is ${correct}.`
      : `Therefore, the correct answer is ${correct}.`,
    commonTrapAlert: `${trap.value} follows the ${trap.errorLabel?.toLowerCase().replaceAll("_", " ") ?? "wrong"} approach, which does not match every displayed digit movement.`,
  } as const;
}

function calculateDifficulty(
  taskKind: UniformDigitTaskKind,
  profile: TargetProfile,
  targetWrapCount: number,
): CodDifficulty {
  if (taskKind === "ENCODE_TARGET" && profile === "PLAIN") return "EASY";
  if (taskKind === "CHOOSE_MATCHING_CODE" && targetWrapCount === 0) return "EASY";
  if (taskKind === "DECODE_TARGET" && (profile === "LEADING_SOURCE" || profile === "LEADING_CODE" || targetWrapCount >= 2)) return "HARD";
  if (taskKind === "RECOVER_MISSING_TOKEN" && profile === "LEADING_CODE") return "HARD";
  if (taskKind === "INFER_AND_ENCODE" && targetWrapCount >= 3) return "HARD";
  return "MEDIUM";
}

export function generateUniformDigitPrototypeQuestion(
  prototypeId: UniformDigitPrototypeId,
  seed: number,
): GeneratedUniformDigitPrototypeQuestion {
  const contract = getUniformDigitPrototypeContract(prototypeId);
  const random = new SeededRandom(`${prototypeId}:${seed}:generator-v1`);
  const shift = random.int(1, 9);
  const evidence = buildEvidence(random, shift);
  const audit = auditUniformDigitEvidence(evidence, shift);
  if (!audit.accepted || audit.wholeNumberDeltaSurvives) {
    throw new Error(`${prototypeId}/${seed} failed ambiguity audit: ${audit.reason ?? "unknown"}`);
  }

  const profile = TARGET_PROFILES[(seed + UNIFORM_PROTOTYPE_INDEX[prototypeId]) % TARGET_PROFILES.length]!;
  const targetLength = 3 + ((seed + UNIFORM_PROTOTYPE_INDEX[prototypeId] * 2) % 6);
  const targetSource = buildTarget(random, shift, profile, targetLength);
  const targetCode = translateDigitSequence(targetSource, shift);
  const missingIndex = contract.taskKind === "RECOVER_MISSING_TOKEN" ? random.int(0, targetLength - 1) : undefined;
  const displayedTargetCode = missingIndex === undefined
    ? undefined
    : `${targetCode.slice(0, missingIndex)}?${targetCode.slice(missingIndex + 1)}`;
  const correct = contract.taskKind === "DECODE_TARGET"
    ? targetSource
    : contract.taskKind === "RECOVER_MISSING_TOKEN"
      ? targetCode[missingIndex!]!
      : targetCode;
  const { options, correctIndex } = buildOptions(
    new SeededRandom(`${prototypeId}:${seed}:options-v1`),
    contract.taskKind,
    targetSource,
    targetCode,
    shift,
    correct,
  );
  const trap = options.find((option) => !option.isCorrect)!;
  const style = new SeededRandom(`${prototypeId}:${seed}:stem-v1`).int(0, 2);
  const targetWrapCount = wrapCount(targetSource, shift);

  return {
    packageId: "COD-001",
    checkpointId: "COD-CP-007",
    prototypeId,
    permanentQlId: null,
    prototypeOnly: true,
    publiclyPublishable: false,
    ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION",
    seed,
    locale: "en-IN",
    difficulty: calculateDifficulty(contract.taskKind, profile, targetWrapCount),
    renderer: RENDERERS[(seed + style) % RENDERERS.length]!,
    answerType: contract.answerType,
    stem: buildStem(contract.taskKind, evidence, targetSource, targetCode, displayedTargetCode, shift, style),
    structuredPrompt: {
      taskKind: contract.taskKind,
      evidence,
      targetSource,
      targetCode,
      displayedTargetCode,
      missingIndex,
      ruleDisclosure: contract.taskKind === "ENCODE_TARGET" ? "EXPLICIT" : "INFER_FROM_EVIDENCE",
    },
    options,
    correctIndex,
    explanation: buildExplanation(
      contract.taskKind,
      evidence,
      targetSource,
      targetCode,
      displayedTargetCode,
      missingIndex,
      shift,
      correct,
      trap,
    ),
    metadata: {
      runtimeVersion: "cod-cp007-uniform-digit-prototype-v1",
      shift,
      hiddenFingerprint: audit.canonicalWinner!,
      ambiguityAccepted: true,
      uniformShiftSurvivors: audit.uniformShiftSurvivors,
      wholeNumberDeltaSurvives: false,
      reversedUniformShiftSurvivors: audit.reversedUniformShiftSurvivors,
      arbitraryDigitMapConsistent: audit.arbitraryDigitMapConsistent,
      evidenceCount: evidence.length,
      sourceLengths: evidence.map(({ source }) => source.length),
      targetLength,
      wrapCount: targetWrapCount,
      leadingZeroInSource: targetSource.startsWith("0"),
      leadingZeroInCode: targetCode.startsWith("0"),
      repeatedDigitInTarget: hasRepeatedDigit(targetSource),
      inverseUnique: true,
      correctAnswer: correct,
    },
  };
}

const UNIFORM_PROTOTYPE_INDEX: Readonly<Record<UniformDigitPrototypeId, number>> = {
  "COD-CP007-PROT-UNIFORM-DIGIT-ENCODE": 0,
  "COD-CP007-PROT-UNIFORM-DIGIT-DECODE": 1,
  "COD-CP007-PROT-UNIFORM-DIGIT-MISSING": 2,
  "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE": 3,
  "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING": 4,
};

export function digitSequenceRoundTrip(value: string, shift: number): string {
  return inverseTranslateDigitSequence(translateDigitSequence(value, shift), shift);
}

export function digitSequenceTokens(value: string): readonly string[] {
  return decimalDigits(value);
}
