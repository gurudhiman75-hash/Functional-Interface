import { deterministicIndex, rotate } from "./foundation/prng";
import { formatMoney, rational, rationalKey } from "./foundation/rational";
import type { Rational } from "./foundation/types";
import { generateIntCp002Wave01PrototypeV2 } from "./cp002-wave01-runtime-v2";
import type { IntCp002Wave01PrototypeId } from "./cp002-wave01-types";
import { generateIntCp002Wave02QuestionV2 } from "./cp002-wave02-runtime-v2";
import type { IntCp002Wave02PrototypeId } from "./cp002-wave02-types";
import { generateIntCp002FinalClosureQuestion } from "./cp002-final-closure-runtime";
import type { IntCp002FinalClosurePrototypeId } from "./cp002-final-closure-types";
import {
  getIntCp002FinalRegistryEntry,
  INT_CP002_RELEASE_CANDIDATE_ID,
  type IntCp002FinalQlId,
  type IntCp002FinalSourceAdapter,
} from "./cp002-final-registry";

interface CommonSourceQuestion {
  stem: string;
  options: string[];
  optionAudit: Array<{
    text: string;
    value: Rational;
    misconceptionId: string;
    explanation: string;
  }>;
  correctIndex: number;
  explanation: {
    mainRule: string;
    workedSteps: string[];
    examShortcut: string;
    verification: string;
    conclusion: string;
    trapAnalysis: Array<{
      optionNumber: number;
      misconceptionId: string;
      explanation: string;
    }>;
  };
  solution: Rational;
  validation: { ok: boolean; errors: string[] };
  difficulty: "Easy" | "Medium" | "Hard";
  mathematicalFingerprint: string;
  answerSemantic: string;
  sourceState?: unknown;
  state?: unknown;
}

function generateSource(adapter: IntCp002FinalSourceAdapter, seed: string): CommonSourceQuestion {
  switch (adapter.kind) {
    case "WAVE01":
      return generateIntCp002Wave01PrototypeV2({
        prototypeId: adapter.prototypeId as IntCp002Wave01PrototypeId,
        seed,
      }) as unknown as CommonSourceQuestion;
    case "WAVE02":
      return generateIntCp002Wave02QuestionV2({
        prototypeId: adapter.prototypeId as IntCp002Wave02PrototypeId,
        seed,
      }) as unknown as CommonSourceQuestion;
    case "CLOSURE":
      return generateIntCp002FinalClosureQuestion({
        prototypeId: adapter.prototypeId as IntCp002FinalClosurePrototypeId,
        seed,
      }) as unknown as CommonSourceQuestion;
  }
}

function normalizeFinalStem(stem: string): string {
  return stem
    .replace(
      /^(.+)'s an unknown principal deposit follows this simple-interest timeline:/u,
      "$1 deposits an unknown principal. Its simple-interest timeline is:",
    )
    .replace(/another unknown principal/gu, "a second, unknown amount");
}

function roundPositiveToStep(value: Rational, step: bigint): Rational {
  const scaledDenominator = value.denominator * step;
  let units = value.numerator / scaledDenominator;
  const remainder = value.numerator % scaledDenominator;
  if (remainder * 2n >= scaledDenominator) units += 1n;
  if (units <= 0n) units = 1n;
  return rational(units * step);
}

function normalizeMoneyOptionAudit(
  source: CommonSourceQuestion,
  answerSemantic: string,
): CommonSourceQuestion["optionAudit"] {
  if (answerSemantic !== "MONEY" && answerSemantic !== "PRINCIPAL") {
    return source.optionAudit.map((option) => ({ ...option }));
  }

  const correctKey = rationalKey(source.solution);
  const reservedKeys = new Set(
    source.optionAudit
      .filter((option) => option.value.denominator === 1n)
      .map((option) => rationalKey(option.value)),
  );
  reservedKeys.add(correctKey);
  const usedKeys = new Set<string>();
  const step = answerSemantic === "PRINCIPAL" ? 100n : 1n;
  const roundingLabel = answerSemantic === "PRINCIPAL" ? "nearest ₹100" : "nearest rupee";

  return source.optionAudit.map((option, optionIndex) => {
    if (option.misconceptionId === "CORRECT" || option.value.denominator === 1n) {
      usedKeys.add(rationalKey(option.value));
      return { ...option };
    }

    let normalizedValue = roundPositiveToStep(option.value, step);
    let normalizedKey = rationalKey(normalizedValue);
    const direction = optionIndex % 2 === 0 ? 1n : -1n;
    let collisionOffset = 0n;
    while (reservedKeys.has(normalizedKey) || usedKeys.has(normalizedKey)) {
      collisionOffset += 1n;
      const shifted = normalizedValue.numerator + direction * step * collisionOffset;
      normalizedValue = rational(shifted > 0n ? shifted : step * (collisionOffset + 1n));
      normalizedKey = rationalKey(normalizedValue);
    }
    usedKeys.add(normalizedKey);
    return {
      ...option,
      text: formatMoney(normalizedValue),
      value: normalizedValue,
      explanation: `${option.explanation} This exam-style distractor rounds that mistaken result to the ${roundingLabel}.`,
    };
  });
}

export interface IntCp002FinalGeneratedQuestion {
  packageId: "INT-001";
  canonicalProblemId: "INT-CP-002";
  qlId: IntCp002FinalQlId;
  permanentQlId: IntCp002FinalQlId;
  questionLanguageId: string;
  releaseCandidateId: typeof INT_CP002_RELEASE_CANDIDATE_ID;
  language: "en";
  maturity: "FINAL_ENGLISH_REVIEW_CANDIDATE";
  seed: string;
  solveContract: string;
  topology: string;
  taskDirection: string;
  answerSemantic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  options: string[];
  optionAudit: CommonSourceQuestion["optionAudit"];
  correctIndex: number;
  explanation: CommonSourceQuestion["explanation"];
  solution: Rational;
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  internalProvenance: {
    sourceKind: IntCp002FinalSourceAdapter["kind"];
    sourcePrototypeId: string;
    sourceState: unknown;
  };
  reviewStatus: "FINAL_ENGLISH_REVIEW_CANDIDATE";
  enabled: false;
  stagingStatus: "NOT_STAGED";
  registrationStatus: "NOT_REGISTERED";
  questionStudioDiscoverable: false;
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
}

export function generateIntCp002FinalQuestion(
  qlId: IntCp002FinalQlId,
  seed: string,
): IntCp002FinalGeneratedQuestion {
  const registryEntry = getIntCp002FinalRegistryEntry(qlId);
  const sourceSeed = `${qlId}:${registryEntry.sourceAdapter.kind}:${seed}`;
  const source = generateSource(registryEntry.sourceAdapter, sourceSeed);
  const normalizedStem = normalizeFinalStem(source.stem);
  const normalizedSourceAudit = normalizeMoneyOptionAudit(source, registryEntry.answerSemantic);
  const normalizedSourceOptions = normalizedSourceAudit.map((option) => option.text);
  const desiredCorrectIndex = deterministicIndex(`${qlId}:${seed}:final-answer-position`, 4);
  const rotationOffset = source.correctIndex - desiredCorrectIndex;
  const options = rotate(normalizedSourceOptions, rotationOffset);
  const optionAudit = rotate(normalizedSourceAudit, rotationOffset);
  const correctIndex = desiredCorrectIndex;
  const explanation: CommonSourceQuestion["explanation"] = {
    ...source.explanation,
    trapAnalysis: optionAudit
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.misconceptionId !== "CORRECT")
      .map(({ option, index }) => ({
        optionNumber: index + 1,
        misconceptionId: option.misconceptionId,
        explanation: option.explanation,
      })),
  };
  const errors = [...source.validation.errors];

  if (!source.validation.ok) errors.push("Source runtime validation failed.");
  if (options.length !== 4 || new Set(options).size !== 4) {
    errors.push("Final CP-002 package must contain four unique options.");
  }
  if (new Set(optionAudit.map((option) => rationalKey(option.value))).size !== 4) {
    errors.push("Final CP-002 option values are not unique after presentation normalization.");
  }
  if (correctIndex < 0 || correctIndex > 3) errors.push("Final correct index is invalid.");
  if (optionAudit[correctIndex]?.misconceptionId !== "CORRECT") {
    errors.push("QL-owned answer rotation did not preserve correct-option ownership.");
  }
  if (rationalKey(optionAudit[correctIndex]!.value) !== rationalKey(source.solution)) {
    errors.push("Final correct option value changed during presentation normalization.");
  }
  if (
    (registryEntry.answerSemantic === "MONEY" || registryEntry.answerSemantic === "PRINCIPAL")
    && optionAudit.some((option) => option.value.denominator !== 1n)
  ) {
    errors.push("Final money/principal options must use integral rupee values.");
  }
  if (!explanation.conclusion.includes(options[correctIndex]!)) {
    errors.push("Final explanation conclusion does not state the displayed correct answer.");
  }
  if (explanation.trapAnalysis.length !== 3) {
    errors.push("Final wrong-option analysis is incomplete after answer rotation.");
  }
  for (const trap of explanation.trapAnalysis) {
    const audited = optionAudit[trap.optionNumber - 1];
    if (!audited || audited.misconceptionId !== trap.misconceptionId || audited.explanation !== trap.explanation) {
      errors.push(`Rotated trap analysis is not aligned with option ${trap.optionNumber}.`);
    }
  }
  if (source.answerSemantic !== registryEntry.answerSemantic) {
    errors.push(`Source answer semantic '${source.answerSemantic}' does not match registry semantic '${registryEntry.answerSemantic}'.`);
  }

  const learnerText = [
    normalizedStem,
    ...options,
    explanation.mainRule,
    ...explanation.workedSteps,
    explanation.examShortcut,
    explanation.verification,
    explanation.conclusion,
    ...explanation.trapAnalysis.map((item) => item.explanation),
  ].join(" ");
  if (/INT-CP|INT-QL|PROT-|WAVE0|CLOSE-|prototypeId|effectiveSeed|generationAttempts/iu.test(learnerText)) {
    errors.push("Learner-facing text leaks an internal identity.");
  }
  if (/'s an unknown principal|another unknown principal/iu.test(normalizedStem)) {
    errors.push("Final stem contains a blocked unknown-principal construction.");
  }

  return {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-002",
    qlId,
    permanentQlId: qlId,
    questionLanguageId: `${qlId}:en`,
    releaseCandidateId: INT_CP002_RELEASE_CANDIDATE_ID,
    language: "en",
    maturity: "FINAL_ENGLISH_REVIEW_CANDIDATE",
    seed,
    solveContract: registryEntry.solveContract,
    topology: registryEntry.topology,
    taskDirection: registryEntry.taskDirection,
    answerSemantic: registryEntry.answerSemantic,
    difficulty: source.difficulty,
    stem: normalizedStem,
    options,
    optionAudit,
    correctIndex,
    explanation,
    solution: source.solution,
    mathematicalFingerprint: `${qlId}::${source.mathematicalFingerprint}`,
    validation: { ok: errors.length === 0, errors },
    internalProvenance: {
      sourceKind: registryEntry.sourceAdapter.kind,
      sourcePrototypeId: registryEntry.sourceAdapter.prototypeId,
      sourceState: source.sourceState ?? source.state,
    },
    reviewStatus: "FINAL_ENGLISH_REVIEW_CANDIDATE",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  };
}
