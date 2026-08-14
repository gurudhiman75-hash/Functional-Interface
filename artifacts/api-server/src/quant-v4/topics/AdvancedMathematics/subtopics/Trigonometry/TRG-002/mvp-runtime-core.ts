import type { AngleMeasure, ExactTrigNumber } from "../foundation/types";
import { exactKey, exactToNumber, formatExactPlain } from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import {
  buildTrg002DiagramEvidence,
  validateTrg002DiagramEvidence,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  type Trg002SpatialState,
} from "./spatial";

export type Trg002MvpDifficulty = "Easy" | "Medium" | "Hard";
export type Trg002MvpCpId = "TRG-CP-007" | "TRG-CP-008" | "TRG-CP-009" | "TRG-CP-010";
export type Trg002MvpAnswer =
  | { kind: "NUMBER"; value: ExactTrigNumber; unit: "m" }
  | { kind: "ANGLE"; value: AngleMeasure; preferredDisplay: "DEGREE" };

export interface Trg002MvpExplanation {
  keyRule: string;
  steps: Array<{ title: string; body: string }>;
  shortcut: string;
  traps: string[];
}

export interface Trg002MvpQuestion {
  packageId: "TRG-002";
  cpId: Trg002MvpCpId;
  qlId: string;
  lockedFamily: string;
  solveMode: string;
  language: "en";
  seed: string;
  difficulty: Trg002MvpDifficulty;
  target: "LENGTH" | "ANGLE";
  stem: string;
  options: Array<{ label: "A" | "B" | "C" | "D"; value: Trg002MvpAnswer; display: string; isCorrect: boolean; misconceptionId: string | null }>;
  correctIndex: number;
  answer: string;
  exactAnswer: Trg002MvpAnswer;
  explanation: Trg002MvpExplanation;
  canonicalSpatialState: Trg002SpatialState;
  solutionDiagram: NonNullable<ReturnType<typeof buildTrg002DiagramEvidence>["solutionDiagram"]>;
  stemDiagram: undefined;
  diagramEvidence: ReturnType<typeof buildTrg002DiagramEvidence>;
  verification: {
    spatial: ReturnType<typeof verifyTrg002SpatialState>;
    diagram: ReturnType<typeof validateTrg002DiagramSpec>;
    diagramPolicy: ReturnType<typeof validateTrg002DiagramEvidence>;
    answer: { valid: boolean; method: string; reconstructed: number; expected: number; delta: number };
  };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  aiEditorialStatus: "PENDING";
  humanReviewStatus: "PENDING";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  mvpOnly: true;
}

export function mvpHash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function mvpPick<T>(seed: string, salt: string, values: readonly T[]): T {
  return values[mvpHash(`${seed}|${salt}`) % values.length];
}

function shuffle<T>(seed: string, values: T[]) {
  let state = mvpHash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

export const mvpNumberAnswer = (value: ExactTrigNumber): Trg002MvpAnswer => ({ kind: "NUMBER", value, unit: "m" });
export const mvpAngleAnswer = (value: AngleMeasure): Trg002MvpAnswer => ({ kind: "ANGLE", value, preferredDisplay: "DEGREE" });

export function mvpAnswerKey(answer: Trg002MvpAnswer) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const angle = toDegrees(answer.value);
  return `A:${angle.numerator}/${angle.denominator}`;
}

export function mvpShowAnswer(answer: Trg002MvpAnswer) {
  if (answer.kind === "NUMBER") return `${formatExactPlain(answer.value)} m`;
  const angle = toDegrees(answer.value);
  return `${angle.denominator === 1n ? angle.numerator : `${angle.numerator}/${angle.denominator}`}°`;
}

export function mvpExplanation(rule: string, steps: string[], trap: string, shortcut = rule): Trg002MvpExplanation {
  return {
    keyRule: rule,
    steps: steps.map((body, index) => ({ title: index === steps.length - 1 ? "Answer" : `Step ${index + 1}`, body })),
    shortcut,
    traps: [trap],
  };
}

function point(state: Trg002SpatialState, id: string) {
  const found = state.points.find((item) => item.id === id);
  if (!found) throw new Error(`Missing canonical point ${id}.`);
  return found;
}

function object(state: Trg002SpatialState, id: string) {
  const found = state.verticalObjects.find((item) => item.id === id);
  if (!found) throw new Error(`Missing canonical object ${id}.`);
  return found;
}

function requestedNumericValue(state: Trg002SpatialState) {
  const requested = state.requested;
  switch (requested.kind) {
    case "OBJECT_HEIGHT": return exactToNumber(object(state, requested.objectId).height);
    case "HORIZONTAL_DISTANCE": return Math.abs(exactToNumber(point(state, requested.fromPointId).x) - exactToNumber(point(state, requested.toPointId).x));
    case "SHADOW_LENGTH": {
      const target = object(state, requested.objectId);
      return Math.abs(exactToNumber(point(state, target.basePointId).x) - exactToNumber(point(state, requested.shadowTipPointId).x));
    }
    case "SIGHT_LINE_LENGTH": {
      const first = point(state, requested.fromPointId), second = point(state, requested.toPointId);
      return Math.hypot(exactToNumber(first.x) - exactToNumber(second.x), exactToNumber(first.y) - exactToNumber(second.y));
    }
    case "MOVEMENT_DISTANCE": {
      const movementId = requested.movementId;
      const movement = state.movements.find((item) => item.id === movementId);
      if (!movement) throw new Error(`Missing movement ${movementId}.`);
      return exactToNumber(movement.distance);
    }
    case "EYE_HEIGHT": {
      const observerId = requested.observerId;
      const observer = state.observers.find((item) => item.id === observerId);
      if (!observer) throw new Error(`Missing observer ${observerId}.`);
      return exactToNumber(observer.eyeHeight);
    }
    case "ANGLE": {
      const observationId = requested.observationId;
      const observation = state.observations.find((item) => item.id === observationId);
      if (!observation) throw new Error(`Missing observation ${observationId}.`);
      const angle = toDegrees(observation.angle);
      return Number(angle.numerator) / Number(angle.denominator);
    }
  }
}

export function buildTrg002MvpQuestion(input: {
  qlId: string;
  cpId: Trg002MvpCpId;
  lockedFamily: string;
  solveMode: string;
  seed: string;
  difficulty: Trg002MvpDifficulty;
  target: "LENGTH" | "ANGLE";
  stem: string;
  state: Trg002SpatialState;
  correct: Trg002MvpAnswer;
  wrong: Array<{ value: Trg002MvpAnswer; misconceptionId: string }>;
  explanation: Trg002MvpExplanation;
}): Trg002MvpQuestion {
  const raw = [{ value: input.correct, isCorrect: true, misconceptionId: null as string | null }, ...input.wrong.map((item) => ({ ...item, isCorrect: false }))];
  if (raw.length !== 4) throw new Error(`${input.qlId}: exactly four options required.`);
  if (new Set(raw.map((item) => mvpAnswerKey(item.value))).size !== 4) throw new Error(`${input.qlId}: equivalent option collision.`);
  const options = shuffle(`${input.seed}|${input.qlId}|options`, raw).map((item, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: item.value,
    display: mvpShowAnswer(item.value),
    isCorrect: item.isCorrect,
    misconceptionId: item.misconceptionId,
  }));
  const correctIndex = options.findIndex((item) => item.isCorrect);
  const spatial = verifyTrg002SpatialState(input.state);
  const diagramEvidence = buildTrg002DiagramEvidence(input.qlId, input.state);
  const diagramPolicy = validateTrg002DiagramEvidence(input.state, diagramEvidence);
  if (!diagramEvidence.solutionDiagram) throw new Error(`${input.qlId}: required solution diagram missing.`);
  const diagram = validateTrg002DiagramSpec(diagramEvidence.solutionDiagram);
  const reconstructed = requestedNumericValue(input.state);
  const expected = input.correct.kind === "NUMBER"
    ? exactToNumber(input.correct.value)
    : (() => { const a = toDegrees(input.correct.value); return Number(a.numerator) / Number(a.denominator); })();
  const delta = Math.abs(reconstructed - expected);
  const answerVerification = { valid: Number.isFinite(reconstructed) && delta <= 1e-9, method: "CANONICAL_REQUEST_RECONSTRUCTION", reconstructed, expected, delta };
  const minimum = input.difficulty === "Hard" ? 3 : input.difficulty === "Medium" ? 2 : 1;
  const checks = [
    { name: "SPATIAL_VERIFIED", passed: spatial.valid, message: "Canonical spatial state verified." },
    { name: "SOLUTION_DIAGRAM_VERIFIED", passed: diagram.valid && diagramPolicy.valid, message: "Required solution diagram is valid and state-bound." },
    { name: "ANSWER_VERIFIED", passed: answerVerification.valid, message: "Requested target reconstructs the exact answer." },
    { name: "FOUR_UNIQUE_OPTIONS", passed: options.length === 4 && new Set(options.map((item) => mvpAnswerKey(item.value))).size === 4, message: "Four mathematically distinct options." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0 && options[correctIndex]?.isCorrect === true, message: "Correct index valid." },
    { name: "EXPLANATION_DEPTH", passed: input.explanation.steps.length >= minimum, message: "Explanation depth matches difficulty." },
    { name: "NO_AUTOMATIC_STEM_DIAGRAM", passed: diagramEvidence.stemDiagram === undefined, message: "Stem diagram remains optional rather than automatic." },
    { name: "ACTIVATION_LOCK", passed: true, message: "MVP remains inactive." },
  ];
  const validation = { valid: checks.every((item) => item.passed), checks };
  if (!validation.valid) throw new Error(`${input.qlId}: MVP validation failed: ${checks.filter((item) => !item.passed).map((item) => item.name).join(", ")}`);
  return {
    packageId: "TRG-002", cpId: input.cpId, qlId: input.qlId, lockedFamily: input.lockedFamily, solveMode: input.solveMode,
    language: "en", seed: input.seed, difficulty: input.difficulty, target: input.target, stem: input.stem, options, correctIndex,
    answer: mvpShowAnswer(input.correct), exactAnswer: input.correct, explanation: input.explanation, canonicalSpatialState: input.state,
    solutionDiagram: diagramEvidence.solutionDiagram, stemDiagram: undefined, diagramEvidence,
    verification: { spatial, diagram, diagramPolicy, answer: answerVerification }, validation,
    reviewStatus: "UNREVIEWED", aiEditorialStatus: "PENDING", humanReviewStatus: "PENDING",
    questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false, questionStudioDiscoverable: false, mvpOnly: true,
  };
}
