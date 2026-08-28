import type { ExactTrigNumber } from "../foundation/types";
import {
  assertDefined,
  divideExact,
  exactInteger,
  exactKey,
  exactRational,
  exactSurd,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  subtractExact,
} from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import {
  buildObserverHeightElevationState,
  buildSameSideMovingState,
  buildTrg002DiagramSpec,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  type Trg002SpatialPoint,
  type Trg002SpatialState,
  type Trg002VerticalObject,
} from "./spatial";
import {
  TRG_002_RUNTIME_PROOF_IDS,
  TRG_002_RUNTIME_PROOF_REGISTRY,
  type Trg002ProofQlId,
  type Trg002ProofQuestion,
} from "./runtime-proof";
import { generateReviewedTrg002RuntimeProofQuestion } from "./runtime-proof-reviewed";

type NumberAnswer = Extract<Trg002ProofQuestion["exactAnswer"], { kind: "NUMBER" }>;
type Explanation = Trg002ProofQuestion["explanation"];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(seed: string, salt: string, values: readonly T[]): T {
  return values[hash(`${seed}|${salt}`) % values.length];
}

function shuffle<T>(seed: string, values: T[]) {
  let state = hash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

const ZERO = exactInteger(0);
const numberAnswer = (value: ExactTrigNumber): NumberAnswer => ({ kind: "NUMBER", value, unit: "m" });
const div = (left: ExactTrigNumber, right: ExactTrigNumber) => assertDefined(divideExact(left, right));
const tan = (angle: number) => requireTrigExact("TAN", degree(angle));
const sin = (angle: number) => requireTrigExact("SIN", degree(angle));

function answerKey(answer: Trg002ProofQuestion["exactAnswer"]) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const angle = toDegrees(answer.value);
  return `A:${angle.numerator}/${angle.denominator}`;
}

function showAnswer(answer: Trg002ProofQuestion["exactAnswer"]) {
  if (answer.kind === "NUMBER") return `${formatExactPlain(answer.value)} m`;
  const angle = toDegrees(answer.value);
  return `${angle.denominator === 1n ? angle.numerator : `${angle.numerator}/${angle.denominator}`}°`;
}

function point(
  id: string,
  x: ExactTrigNumber,
  y: ExactTrigNumber,
  role: Trg002SpatialPoint["role"],
  label?: string,
): Trg002SpatialPoint {
  return { id, x, y, role, ...(label ? { label } : {}) };
}

function verticalObject(
  id: string,
  kind: Trg002VerticalObject["kind"],
  basePointId: string,
  topPointId: string,
  height: ExactTrigNumber,
): Trg002VerticalObject {
  return { id, kind, basePointId, topPointId, height };
}

function spatialPoint(state: Trg002SpatialState, id: string) {
  const found = state.points.find((item) => item.id === id);
  if (!found) throw new Error(`Missing canonical point ${id}.`);
  return found;
}

function spatialObject(state: Trg002SpatialState, id: string) {
  const found = state.verticalObjects.find((item) => item.id === id);
  if (!found) throw new Error(`Missing canonical object ${id}.`);
  return found;
}

function requestedNumericValue(state: Trg002SpatialState): number {
  switch (state.requested.kind) {
    case "OBJECT_HEIGHT":
      return exactToNumber(spatialObject(state, state.requested.objectId).height);
    case "HORIZONTAL_DISTANCE": {
      const first = spatialPoint(state, state.requested.fromPointId);
      const second = spatialPoint(state, state.requested.toPointId);
      return Math.abs(exactToNumber(first.x) - exactToNumber(second.x));
    }
    case "SHADOW_LENGTH": {
      const targetObject = spatialObject(state, state.requested.objectId);
      const base = spatialPoint(state, targetObject.basePointId);
      const tip = spatialPoint(state, state.requested.shadowTipPointId);
      return Math.abs(exactToNumber(base.x) - exactToNumber(tip.x));
    }
    case "SIGHT_LINE_LENGTH": {
      const first = spatialPoint(state, state.requested.fromPointId);
      const second = spatialPoint(state, state.requested.toPointId);
      return Math.hypot(
        exactToNumber(first.x) - exactToNumber(second.x),
        exactToNumber(first.y) - exactToNumber(second.y),
      );
    }
    case "MOVEMENT_DISTANCE": {
      const movement = state.movements.find((item) => item.id === state.requested.movementId);
      if (!movement) throw new Error(`Missing movement ${state.requested.movementId}.`);
      return exactToNumber(movement.distance);
    }
    case "EYE_HEIGHT": {
      const observer = state.observers.find((item) => item.id === state.requested.observerId);
      if (!observer) throw new Error(`Missing observer ${state.requested.observerId}.`);
      return exactToNumber(observer.eyeHeight);
    }
    case "ANGLE": {
      const observation = state.observations.find((item) => item.id === state.requested.observationId);
      if (!observation) throw new Error(`Missing observation ${state.requested.observationId}.`);
      const angle = toDegrees(observation.angle);
      return Number(angle.numerator) / Number(angle.denominator);
    }
  }
}

function makeExplanation(rule: string, steps: string[], trap: string, shortcut?: string): Explanation {
  return {
    keyRule: rule,
    steps: steps.map((body, index) => ({
      title: index === steps.length - 1 ? "Answer" : `Step ${index + 1}`,
      body,
    })),
    shortcut: shortcut ?? rule,
    traps: [trap],
  };
}

function makeOptions(
  qlId: Trg002ProofQlId,
  seed: string,
  correct: NumberAnswer,
  wrong: Array<{ value: ExactTrigNumber; misconceptionId: string }>,
): Trg002ProofQuestion["options"] {
  const raw: Array<{
    value: Trg002ProofQuestion["exactAnswer"];
    isCorrect: boolean;
    misconceptionId: string | null;
  }> = [
    { value: correct, isCorrect: true, misconceptionId: null },
    ...wrong.map((item) => ({ value: numberAnswer(item.value), isCorrect: false, misconceptionId: item.misconceptionId })),
  ];
  assert(raw.length === 4, `${qlId}: exactly four options are required.`);
  assert(new Set(raw.map((item) => answerKey(item.value))).size === 4, `${qlId}: equivalent option collision.`);
  return shuffle(`${seed}|${qlId}|exam-ready-options`, raw).map((item, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: item.value,
    display: showAnswer(item.value),
    isCorrect: item.isCorrect,
    misconceptionId: item.misconceptionId,
  }));
}

function revalidate(question: Trg002ProofQuestion): Trg002ProofQuestion {
  const entry = TRG_002_RUNTIME_PROOF_REGISTRY.find((item) => item.qlId === question.qlId);
  if (!entry) throw new Error(`${question.qlId}: missing proof registry entry.`);
  const minimum = question.difficulty === "Hard" ? 3 : question.difficulty === "Medium" ? 2 : 1;
  const checks = [
    { name: "SPATIAL_VERIFIED", passed: question.verification.spatial.valid, message: "Canonical spatial state verified." },
    { name: "DIAGRAM_VERIFIED", passed: question.verification.diagram.valid, message: "Legacy diagram projection verified." },
    { name: "ANSWER_VERIFIED", passed: question.verification.answer.valid, message: "Answer reconstructed independently from canonical state." },
    { name: "FOUR_OPTIONS", passed: question.options.length === 4, message: "Exactly four options are present." },
    { name: "ONE_CORRECT", passed: question.options.filter((item) => item.isCorrect).length === 1, message: "Exactly one option is correct." },
    { name: "UNIQUE_OPTIONS", passed: new Set(question.options.map((item) => answerKey(item.value))).size === 4, message: "Options are mathematically unique." },
    { name: "CORRECT_INDEX", passed: question.options[question.correctIndex]?.isCorrect === true, message: "Correct index points to the correct option." },
    { name: "ANSWER_DISPLAY", passed: question.answer === question.options[question.correctIndex]?.display, message: "Rendered answer matches the correct option." },
    { name: "DIAGRAM_STRATEGY", passed: question.canonicalSpatialState.diagramStrategy === entry.diagramStrategy, message: "Locked diagram strategy retained." },
    { name: "EXPLANATION_DEPTH", passed: question.explanation.steps.length >= minimum, message: "Explanation depth matches calibrated difficulty." },
    { name: "NO_PLACEHOLDERS", passed: !/[{}]\\w+|\\{\\{/.test(question.stem), message: "No unresolved placeholders remain." },
    { name: "ACTIVATION_LOCK", passed: !question.publiclyPublishable && !question.questionStudioDiscoverable && question.testEligibility === "INELIGIBLE" && question.questionBankStatus === "NOT_STORED", message: "Proof remains inactive." },
  ];
  const validation = { valid: checks.every((check) => check.passed), checks };
  if (!validation.valid) {
    const failed = checks.filter((check) => !check.passed).map((check) => check.name).join(", ");
    throw new Error(`${question.qlId}: exam-ready validation failed: ${failed}`);
  }
  return { ...question, validation };
}

function customQuestion(input: {
  qlId: Trg002ProofQlId;
  seed: string;
  state: Trg002SpatialState;
  difficulty: "Easy" | "Medium" | "Hard";
  stem: string;
  correct: ExactTrigNumber;
  wrong: Array<{ value: ExactTrigNumber; misconceptionId: string }>;
  explanation: Explanation;
}): Trg002ProofQuestion {
  const entry = TRG_002_RUNTIME_PROOF_REGISTRY.find((item) => item.qlId === input.qlId);
  if (!entry) throw new Error(`${input.qlId}: missing proof registry entry.`);
  const exactAnswer = numberAnswer(input.correct);
  const options = makeOptions(input.qlId, input.seed, exactAnswer, input.wrong);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const spatial = verifyTrg002SpatialState(input.state);
  const diagram = buildTrg002DiagramSpec(input.state);
  const diagramCheck = validateTrg002DiagramSpec(diagram);
  const reconstructed = requestedNumericValue(input.state);
  const expected = exactToNumber(input.correct);
  const delta = Math.abs(reconstructed - expected);
  const question: Trg002ProofQuestion = {
    packageId: "TRG-002",
    cpId: entry.cpId,
    qlId: input.qlId,
    lockedFamily: entry.lockedFamily,
    solveMode: entry.solveMode,
    language: "en",
    seed: input.seed,
    difficulty: input.difficulty,
    target: entry.target,
    stem: input.stem,
    options,
    correctIndex,
    answer: showAnswer(exactAnswer),
    exactAnswer,
    explanation: input.explanation,
    canonicalSpatialState: input.state,
    diagram,
    verification: {
      spatial,
      diagram: diagramCheck,
      answer: {
        valid: Number.isFinite(reconstructed) && delta <= 1e-9,
        method: "CANONICAL_REQUEST_RECONSTRUCTION",
        reconstructed,
        expected,
        delta,
      },
    },
    validation: { valid: false, checks: [] },
    reviewStatus: "UNREVIEWED",
    aiEditorialStatus: "PENDING",
    humanReviewStatus: "PENDING",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    proofOnly: true,
  };
  return revalidate(question);
}

function buildDepressionHeightQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-015";
  const k = pick(seed, `${qlId}|scale`, [10, 15] as const);
  const run = exactSurd(k, 3);
  const observerHeight = exactInteger(3 * k);
  const targetHeight = exactInteger(2 * k);
  const state: Trg002SpatialState = {
    packageId: "TRG-002",
    scenario: "TWO_BUILDINGS",
    groundY: ZERO,
    points: [
      point("observer-base", ZERO, ZERO, "OBJECT_BASE", "A"),
      point("observer-top", ZERO, observerHeight, "OBSERVER_EYE", "E"),
      point("target-base", run, ZERO, "OBJECT_BASE", "B"),
      point("target-top", run, targetHeight, "OBJECT_TOP", "T"),
    ],
    verticalObjects: [
      verticalObject("observer-building", "BUILDING", "observer-base", "observer-top", observerHeight),
      verticalObject("target-object", "POLE", "target-base", "target-top", targetHeight),
    ],
    observers: [{ id: "observer-1", groundPointId: "observer-base", eyePointId: "observer-top", eyeHeight: observerHeight }],
    observations: [{
      id: "obs-1",
      observerId: "observer-1",
      eyePointId: "observer-top",
      targetPointId: "target-top",
      classification: "DEPRESSION",
      angle: degree(30),
      horizontalReference: "EYE_LEVEL",
    }],
    movements: [],
    requested: { kind: "OBJECT_HEIGHT", objectId: "target-object" },
    diagramStrategy: "SINGLE_DEPRESSION",
    metadata: { units: "m", sameSide: true },
  };
  return customQuestion({
    qlId,
    seed,
    state,
    difficulty: "Medium",
    stem: `From the top of a ${3 * k} m building, the top of a vertical pole ${formatExactPlain(run)} m away is seen at an angle of depression of 30°. Find the height of the pole.`,
    correct: targetHeight,
    wrong: [
      { value: exactInteger(k), misconceptionId: "RETURNED_VERTICAL_DROP" },
      { value: observerHeight, misconceptionId: "IGNORED_DEPRESSION" },
      { value: exactInteger(4 * k), misconceptionId: "ADDED_DROP_INSTEAD_OF_SUBTRACTING" },
    ],
    explanation: makeExplanation(
      "For an angle of depression, first find the vertical drop from the observer's horizontal eye level.",
      [
        `Let the vertical drop from the building top to the pole top be d. Then tan30°=d/${formatExactPlain(run)}.`,
        `So d=${formatExactPlain(run)}×tan30°=${k} m. The pole top is ${k} m below the ${3 * k} m observation level.`,
        `Pole height=${3 * k}−${k}=${2 * k} m.`,
      ],
      "A common mistake is to report the vertical drop as the pole height.",
      "Depression gives the drop below eye level; subtract that drop from the observer height.",
    ),
  });
}

function buildShadowState(height: ExactTrigNumber, shadow: ExactTrigNumber, angle: 30 | 60, requested: "HEIGHT" | "SHADOW"): Trg002SpatialState {
  return {
    packageId: "TRG-002",
    scenario: "SHADOW",
    groundY: ZERO,
    points: [
      point("object-base", ZERO, ZERO, "OBJECT_BASE", "B"),
      point("object-top", ZERO, height, "OBJECT_TOP", "T"),
      point("shadow-tip", shadow, ZERO, "SHADOW_TIP", "S"),
    ],
    verticalObjects: [verticalObject("object-1", "POLE", "object-base", "object-top", height)],
    observers: [{ id: "sun-reference", groundPointId: "shadow-tip", eyePointId: "shadow-tip", eyeHeight: ZERO }],
    observations: [{
      id: "obs-sun",
      observerId: "sun-reference",
      eyePointId: "shadow-tip",
      targetPointId: "object-top",
      classification: "ELEVATION",
      angle: degree(angle),
      horizontalReference: "EYE_LEVEL",
    }],
    movements: [],
    requested: requested === "HEIGHT"
      ? { kind: "OBJECT_HEIGHT", objectId: "object-1" }
      : { kind: "SHADOW_LENGTH", objectId: "object-1", shadowTipPointId: "shadow-tip" },
    diagramStrategy: "SHADOW",
    metadata: { units: "m", sameSide: true },
  };
}

function buildShadowToHeightQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-025";
  const k = pick(seed, `${qlId}|scale`, [10, 20] as const);
  const angle = pick(seed, `${qlId}|angle`, [30, 60] as const);
  const shadow = exactInteger(angle === 30 ? 3 * k : k);
  const height = exactSurd(k, 3);
  return customQuestion({
    qlId,
    seed,
    state: buildShadowState(height, shadow, angle, "HEIGHT"),
    difficulty: "Easy",
    stem: `A vertical pole casts a ${formatExactPlain(shadow)} m shadow when the sun's angle of elevation is ${angle}°. Find the height of the pole.`,
    correct: height,
    wrong: [
      { value: shadow, misconceptionId: "RETURNED_SHADOW_LENGTH" },
      { value: div(shadow, tan(angle)), misconceptionId: "INVERTED_TANGENT_RATIO" },
      { value: multiplyExact(shadow, sin(angle)), misconceptionId: "USED_SINE_WITH_SHADOW_AS_HYPOTENUSE" },
    ],
    explanation: makeExplanation(
      "For a vertical object and its shadow, tanθ=height/shadow length.",
      [`tan${angle}°=h/${formatExactPlain(shadow)}.`, `Therefore h=${formatExactPlain(shadow)}×tan${angle}°=${formatExactPlain(height)} m.`],
      "The shadow is the adjacent horizontal side, not the hypotenuse.",
    ),
  });
}

function buildHeightToShadowQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-030";
  const k = pick(seed, `${qlId}|scale`, [10, 20] as const);
  const angle = pick(seed, `${qlId}|angle`, [30, 60] as const);
  const height = exactInteger(angle === 30 ? k : 3 * k);
  const shadow = exactSurd(k, 3);
  return customQuestion({
    qlId,
    seed,
    state: buildShadowState(height, shadow, angle, "SHADOW"),
    difficulty: "Easy",
    stem: `A vertical pole is ${formatExactPlain(height)} m high. When the sun's angle of elevation is ${angle}°, find the length of its shadow.`,
    correct: shadow,
    wrong: [
      { value: height, misconceptionId: "RETURNED_POLE_HEIGHT" },
      { value: multiplyExact(height, tan(angle)), misconceptionId: "MULTIPLIED_BY_TANGENT_INSTEAD_OF_DIVIDING" },
      { value: div(height, sin(angle)), misconceptionId: "USED_SINE_INSTEAD_OF_TANGENT" },
    ],
    explanation: makeExplanation(
      "Use tanθ=height/shadow and solve for the shadow length.",
      [`tan${angle}°=${formatExactPlain(height)}/s.`, `Hence s=${formatExactPlain(height)}/tan${angle}°=${formatExactPlain(shadow)} m.`],
      "The shadow is the adjacent side, so isolate it by dividing the height by tanθ.",
    ),
  });
}

function sameSideBase(qlId: Trg002ProofQlId, seed: string) {
  const k = pick(seed, `${qlId}|scale`, [10, 20] as const);
  const movement = exactInteger(2 * k);
  const state = buildSameSideMovingState({
    farAngle: degree(30),
    nearAngle: degree(60),
    movementTowardObject: movement,
    units: "m",
  });
  return { k, movement, state, height: spatialObject(state, "object-1").height };
}

function buildMoveCloserQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-056";
  const { k, movement, state: base, height } = sameSideBase(qlId, seed);
  const state: Trg002SpatialState = {
    ...base,
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "near-ground" },
  };
  return customQuestion({
    qlId,
    seed,
    state,
    difficulty: "Medium",
    stem: `An observer sees the top of a tower at an elevation of 30°. After walking ${2 * k} m directly toward the tower, the angle of elevation becomes 60°. How far is the observer from the tower now?`,
    correct: exactInteger(k),
    wrong: [
      { value: exactInteger(3 * k), misconceptionId: "RETURNED_ORIGINAL_DISTANCE" },
      { value: movement, misconceptionId: "RETURNED_DISTANCE_WALKED" },
      { value: height, misconceptionId: "RETURNED_TOWER_HEIGHT" },
    ],
    explanation: makeExplanation(
      "The tower height is unchanged at both observation points.",
      [
        `Let the new distance be x m. Then the original distance was x+${2 * k} m.`,
        `Equate the two height expressions: x tan60°=(x+${2 * k})tan30°. Solving gives x=${k} m.`,
      ],
      "Do not confuse the distance walked with the final distance from the tower.",
    ),
  });
}

function buildOriginalDistanceQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-065";
  const { k, movement, state: base, height } = sameSideBase(qlId, seed);
  const state: Trg002SpatialState = {
    ...base,
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "far-ground" },
  };
  return customQuestion({
    qlId,
    seed,
    state,
    difficulty: "Medium",
    stem: `The angle of elevation of a tower top is 30°. After an observer walks ${2 * k} m toward the tower, the angle becomes 60°. Find the observer's original distance from the tower.`,
    correct: exactInteger(3 * k),
    wrong: [
      { value: exactInteger(k), misconceptionId: "RETURNED_FINAL_DISTANCE" },
      { value: movement, misconceptionId: "RETURNED_DISTANCE_WALKED" },
      { value: height, misconceptionId: "RETURNED_TOWER_HEIGHT" },
    ],
    explanation: makeExplanation(
      "Use the same tower height at the original and new observation points.",
      [
        `Let the original distance be x m. After walking toward the tower, the distance is x−${2 * k} m.`,
        `So x tan30°=(x−${2 * k})tan60°. Solving gives x=${3 * k} m.`,
      ],
      "The original distance is the larger of the two same-side distances.",
    ),
  });
}

function buildPointSeparationQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-068";
  const { k, movement, state: base, height } = sameSideBase(qlId, seed);
  const state: Trg002SpatialState = {
    ...base,
    movements: [],
    requested: { kind: "HORIZONTAL_DISTANCE", fromPointId: "near-ground", toPointId: "far-ground" },
    diagramStrategy: "TWO_OBSERVATIONS_SAME_SIDE",
  };
  return customQuestion({
    qlId,
    seed,
    state,
    difficulty: "Medium",
    stem: `A tower is ${formatExactPlain(height)} m high. From two points on the same side of the tower, the angles of elevation of its top are 60° and 30°. Find the distance between the two observation points.`,
    correct: movement,
    wrong: [
      { value: exactInteger(k), misconceptionId: "RETURNED_NEARER_DISTANCE" },
      { value: exactInteger(3 * k), misconceptionId: "RETURNED_FARTHER_DISTANCE" },
      { value: height, misconceptionId: "RETURNED_TOWER_HEIGHT" },
    ],
    explanation: makeExplanation(
      "Find each horizontal distance from the known tower height, then subtract because both points are on the same side.",
      [
        `Nearer distance=${formatExactPlain(height)}/tan60°=${k} m, while farther distance=${formatExactPlain(height)}/tan30°=${3 * k} m.`,
        `Distance between the points=${3 * k}−${k}=${2 * k} m.`,
      ],
      "For same-side points, subtract the two distances; do not add them.",
    ),
  });
}

function buildObserverHeightQuestion(seed: string) {
  const qlId: Trg002ProofQlId = "TRG-002-QL-073";
  const run = exactInteger(pick(seed, `${qlId}|run`, [10, 20] as const));
  const eyeHeight = exactRational(3, 2);
  const state = buildObserverHeightElevationState({ horizontal: run, angle: degree(45), eyeHeight, units: "m" });
  const correct = spatialObject(state, "object-1").height;
  const rise = subtractExact(correct, eyeHeight);
  return customQuestion({
    qlId,
    seed,
    state,
    difficulty: "Medium",
    stem: `An observer's eye level is 1.5 m above the ground. From a point ${formatExactPlain(run)} m from a building, the angle of elevation of the top is 45°. Find the height of the building.`,
    correct,
    wrong: [
      { value: rise, misconceptionId: "OMITTED_EYE_HEIGHT" },
      { value: subtractExact(rise, eyeHeight), misconceptionId: "SUBTRACTED_EYE_HEIGHT" },
      { value: eyeHeight, misconceptionId: "RETURNED_ONLY_EYE_HEIGHT" },
    ],
    explanation: makeExplanation(
      "The tangent relation gives the rise above eye level; the observer's eye height must then be added once.",
      [`Rise above eye level=${formatExactPlain(run)}×tan45°=${formatExactPlain(rise)} m.`, `Building height=${formatExactPlain(rise)}+1.5=${formatExactPlain(correct)} m.`],
      "Do not omit the 1.5 m eye height, and do not add it twice.",
    ),
  });
}

function polishExisting(question: Trg002ProofQuestion): Trg002ProofQuestion {
  if (question.qlId === "TRG-002-QL-061") {
    const movement = question.canonicalSpatialState.movements[0];
    if (!movement) throw new Error("TRG-002-QL-061: canonical movement missing.");
    const moved = formatExactPlain(movement.distance);
    const originalDistance = formatExactPlain(spatialPoint(question.canonicalSpatialState, "near-ground").x);
    return revalidate({
      ...question,
      stem: `An observer sees the top of a tower at an elevation of 60°. After walking ${moved} m directly away from the tower, the angle of elevation becomes 30°. Find the height of the tower.`,
      explanation: makeExplanation(
        "The tower height stays the same while the horizontal distance increases.",
        [
          `Let the original distance be x m. After walking away, the distance is x+${moved} m.`,
          `Equate the two height expressions: x tan60°=(x+${moved})tan30°. This gives x=${originalDistance} m.`,
          `Now h=x tan60°, so the tower height is ${question.answer}.`,
        ],
        "Using only the distance walked as a tower distance ignores one of the observations.",
      ),
    });
  }

  if (question.qlId === "TRG-002-QL-078") {
    const separation = formatExactPlain(spatialPoint(question.canonicalSpatialState, "right-ground").x);
    return revalidate({
      ...question,
      difficulty: "Medium",
      options: question.options.map((option) => ({
        ...option,
        misconceptionId: option.misconceptionId === "USED_FULL_SEPARATION"
          ? "USED_FULL_OBSERVER_SEPARATION_AS_HEIGHT"
          : option.misconceptionId === "USED_THREE_QUARTERS"
            ? "USED_THREE_QUARTERS_OF_SEPARATION"
            : option.misconceptionId,
      })),
      stem: `Two observation points are ${separation} m apart on opposite sides of a tower. From each point, the angle of elevation of the tower top is 45°. Find the height of the tower.`,
      explanation: makeExplanation(
        "At 45°, the tower height equals the horizontal distance from each observation point to the tower.",
        [
          "Let the distances from the tower to the two observation points be x and y. Since tan45°=1, h=x and h=y.",
          `The points are on opposite sides, so x+y=${separation}. Hence 2h=${separation}.`,
          `Therefore the tower height is ${question.answer}.`,
        ],
        "Because the observers are on opposite sides, their distances from the tower add to the given separation.",
      ),
    });
  }

  if (question.qlId === "TRG-002-QL-083") {
    const firstHeight = formatExactPlain(spatialObject(question.canonicalSpatialState, "building-1").height);
    const run = formatExactPlain(spatialPoint(question.canonicalSpatialState, "second-base").x);
    return revalidate({
      ...question,
      difficulty: "Medium",
      stem: `From the top of a ${firstHeight} m building, the angle of elevation of the top of a second building ${run} m away is 45°. Find the height of the second building.`,
      explanation: makeExplanation(
        "Tangent gives the vertical rise of the second roof above the first roof level.",
        [
          `At 45°, vertical rise=horizontal distance=${run} m.`,
          `Second building height=first building height+rise=${firstHeight}+${run}.`,
          `Therefore the second building is ${question.answer} high.`,
        ],
        "The tangent calculation gives only the rise above the first roof, not the full second-building height.",
      ),
    });
  }

  if (question.qlId === "TRG-002-QL-088") {
    return revalidate({
      ...question,
      difficulty: "Medium",
      stem: question.stem.replace("a tower base", "the base of a tower").replace("its top", "the tower top"),
      explanation: {
        ...question.explanation,
        keyRule: "Use the angle of depression to locate the tower horizontally, then use the elevation for the part above the observer's level.",
        shortcut: "Split the tower at the observer's horizontal level: lower part from depression, upper part from elevation.",
      },
    });
  }

  if (question.qlId === "TRG-002-QL-092") {
    return revalidate({
      ...question,
      difficulty: "Medium",
      stem: question.stem.replace("the point directly opposite", "a point directly opposite the tower"),
      explanation: {
        ...question.explanation,
        keyRule: "The angle of depression equals the corresponding angle of elevation across the horizontal river banks.",
        shortcut: "At 45°, vertical height and horizontal width are equal.",
      },
    });
  }

  return revalidate(question);
}

export function generateExamReadyTrg002RuntimeProofQuestion(qlId: Trg002ProofQlId, seed: string): Trg002ProofQuestion {
  switch (qlId) {
    case "TRG-002-QL-015": return buildDepressionHeightQuestion(seed);
    case "TRG-002-QL-025": return buildShadowToHeightQuestion(seed);
    case "TRG-002-QL-030": return buildHeightToShadowQuestion(seed);
    case "TRG-002-QL-056": return buildMoveCloserQuestion(seed);
    case "TRG-002-QL-065": return buildOriginalDistanceQuestion(seed);
    case "TRG-002-QL-068": return buildPointSeparationQuestion(seed);
    case "TRG-002-QL-073": return buildObserverHeightQuestion(seed);
    default: return polishExisting(generateReviewedTrg002RuntimeProofQuestion(qlId, seed));
  }
}

export function generateAllExamReadyTrg002RuntimeProofQuestions(seed: string) {
  return TRG_002_RUNTIME_PROOF_IDS.map((qlId) => generateExamReadyTrg002RuntimeProofQuestion(qlId, seed));
}
