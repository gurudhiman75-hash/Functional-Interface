import { canonicalDigest } from "../canonical.ts";
import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { CircularTopology, personAt, seatIndexOf } from "../cp003/topology.ts";
import { oppositeFacing } from "./constraints.ts";
import type {
  MixedCircleAnswerType,
  MixedCircleBlueprintId,
  MixedCircleChildQuestion,
  MixedCircleFacing,
  MixedCircleMisconceptionId,
  MixedCircleModel,
  MixedCircleOption,
  MixedCircleSemanticValue,
} from "./types.ts";

type Trap = {
  readonly value: MixedCircleSemanticValue;
  readonly misconceptionId: MixedCircleMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
};

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function display(value: MixedCircleSemanticValue, answerType: MixedCircleAnswerType): string {
  return Array.isArray(value)
    ? value.join(answerType === "SEQUENCE" ? " → " : " and ")
    : String(value);
}

function buildOptions(
  seed: string,
  questionOrder: 1 | 2 | 3 | 4,
  answerType: MixedCircleAnswerType,
  answer: MixedCircleSemanticValue,
  traps: readonly Trap[],
  fallbackValues: readonly MixedCircleSemanticValue[],
): Pick<MixedCircleChildQuestion, "options" | "answerIndex"> {
  const answerKey = canonicalDigest(answer);
  const unique = new Map<string, Trap>();
  for (const trap of traps) {
    const key = canonicalDigest(trap.value);
    if (key !== answerKey && !unique.has(key)) unique.set(key, trap);
  }
  for (const value of fallbackValues) {
    const key = canonicalDigest(value);
    if (key === answerKey || unique.has(key)) continue;
    unique.set(key, {
      value,
      misconceptionId: "SEA-MC-OFF_BY_ONE",
      recomputation: { fallbackVerifiedValue: value },
      explanation: "This does not match the uniquely solved mixed-facing circle.",
    });
  }
  if (unique.size < 3) throw new Error(`Insufficient ${answerType} distractors`);

  const options: MixedCircleOption[] = [...unique.values()].slice(0, 3).map((trap) => ({
    semanticValue: trap.value,
    semanticFingerprint: canonicalDigest(trap.value),
    display: display(trap.value, answerType),
    isCorrect: false,
    misconceptionId: trap.misconceptionId,
    recomputation: trap.recomputation,
    explanation: trap.explanation,
  }));
  const answerIndex = (stableNumber(`${seed}|${questionOrder}`) % 4) as 0 | 1 | 2 | 3;
  options.splice(answerIndex, 0, {
    semanticValue: answer,
    semanticFingerprint: answerKey,
    display: display(answer, answerType),
    isCorrect: true,
    recomputation: { method: "unique_verified_mixed_circle_state" },
    explanation: "This matches the uniquely solved circular order and facing pattern.",
  });
  return {
    options: options as unknown as MixedCircleChildQuestion["options"],
    answerIndex,
  };
}

function moveRelative(
  topology: CircularTopology,
  seatIndex: number,
  facing: MixedCircleFacing,
  direction: "LEFT" | "RIGHT",
  steps: number,
): number {
  return facing === "CENTER"
    ? topology.moveRelativeCentre(seatIndex, direction, steps)
    : topology.moveRelativeOutward(seatIndex, direction, steps);
}

function facingText(facing: MixedCircleFacing): string {
  return facing === "CENTER" ? "the centre" : "outward";
}

function secondLeftQuestion(
  seed: string,
  model: MixedCircleModel,
  random: DeterministicRandom,
): MixedCircleChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const reference = random.pick(model.clockwiseOrder);
  const referenceIndex = seatIndexOf(model.clockwiseOrder, reference);
  const facing = model.facings[reference] as MixedCircleFacing;
  const answer = personAt(
    model.clockwiseOrder,
    moveRelative(topology, referenceIndex, facing, "LEFT", 2),
  );
  const wrongFacing = oppositeFacing(facing);
  const counterfactual = personAt(
    model.clockwiseOrder,
    moveRelative(topology, referenceIndex, wrongFacing, "LEFT", 2),
  );

  return {
    questionOrder: 1,
    queryContractId: "SEA-QC-003",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC003:${reference}:${facing}:LEFT:2`,
    text: `Who sits second to the left of ${reference}?`,
    ...buildOptions(seed, 1, "PERSON", answer, [
      {
        value: counterfactual,
        misconceptionId: "SEA-MC-CENTER_OUTWARD_SWAPPED",
        recomputation: { usedFacing: wrongFacing },
        explanation: `This treats ${reference} as facing ${facingText(wrongFacing)} instead of ${facingText(facing)}.`,
      },
      {
        value: personAt(
          model.clockwiseOrder,
          moveRelative(topology, referenceIndex, facing, "LEFT", 1),
        ),
        misconceptionId: "SEA-MC-OFF_BY_ONE",
        recomputation: { steps: 1 },
        explanation: "This stops after one seat.",
      },
      {
        value: personAt(
          model.clockwiseOrder,
          moveRelative(topology, referenceIndex, facing, "LEFT", 3),
        ),
        misconceptionId: "SEA-MC-OFF_BY_ONE",
        recomputation: { steps: 3 },
        explanation: "This moves one seat too far.",
      },
    ], model.clockwiseOrder),
    answer,
    oppositeFacingCounterfactual: counterfactual,
    explanation: `${reference} faces ${facingText(facing)}. Therefore, ${reference}'s left is ${facing === "CENTER" ? "clockwise" : "anticlockwise"}. Moving two seats in that direction reaches ${answer}.`,
  };
}

function immediateRightQuestion(
  seed: string,
  model: MixedCircleModel,
  random: DeterministicRandom,
  excludedAnswers: ReadonlySet<string>,
): MixedCircleChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const candidates = model.clockwiseOrder.filter((personId) => {
    const index = seatIndexOf(model.clockwiseOrder, personId);
    const facing = model.facings[personId] as MixedCircleFacing;
    const answer = personAt(
      model.clockwiseOrder,
      moveRelative(topology, index, facing, "RIGHT", 1),
    );
    return !excludedAnswers.has(answer);
  });
  const reference = random.pick(candidates.length > 0 ? candidates : model.clockwiseOrder);
  const referenceIndex = seatIndexOf(model.clockwiseOrder, reference);
  const facing = model.facings[reference] as MixedCircleFacing;
  const answer = personAt(
    model.clockwiseOrder,
    moveRelative(topology, referenceIndex, facing, "RIGHT", 1),
  );
  const wrongFacing = oppositeFacing(facing);
  const counterfactual = personAt(
    model.clockwiseOrder,
    moveRelative(topology, referenceIndex, wrongFacing, "RIGHT", 1),
  );

  return {
    questionOrder: 2,
    queryContractId: "SEA-QC-005",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC005:${reference}:${facing}:RIGHT:1`,
    text: `Who sits immediately to the right of ${reference}?`,
    ...buildOptions(seed, 2, "PERSON", answer, [
      {
        value: counterfactual,
        misconceptionId: "SEA-MC-CENTER_OUTWARD_SWAPPED",
        recomputation: { usedFacing: wrongFacing },
        explanation: `This uses the wrong facing for ${reference}.`,
      },
      {
        value: personAt(
          model.clockwiseOrder,
          moveRelative(topology, referenceIndex, facing, "LEFT", 1),
        ),
        misconceptionId: "SEA-MC-LEFT_RIGHT_REVERSED",
        recomputation: { direction: "LEFT" },
        explanation: "This follows the left side instead.",
      },
      {
        value: reference,
        misconceptionId: "SEA-MC-ENDPOINT_INCLUDED",
        recomputation: { includedReference: true },
        explanation: "The reference person cannot be their own neighbour.",
      },
    ], model.clockwiseOrder),
    answer,
    oppositeFacingCounterfactual: counterfactual,
    explanation: `${reference} faces ${facingText(facing)}. Hence, ${reference}'s right is ${facing === "CENTER" ? "anticlockwise" : "clockwise"}, where ${answer} is seated.`,
  };
}

function neighboursQuestion(
  seed: string,
  model: MixedCircleModel,
  random: DeterministicRandom,
): MixedCircleChildQuestion {
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);
  const answer = [
    personAt(model.clockwiseOrder, referenceIndex - 1),
    personAt(model.clockwiseOrder, referenceIndex + 1),
  ].sort();
  const fallbackPairs: MixedCircleSemanticValue[] = [];
  for (let first = 0; first < model.clockwiseOrder.length; first += 1) {
    for (let second = first + 1; second < model.clockwiseOrder.length; second += 1) {
      fallbackPairs.push([
        model.clockwiseOrder[first] as string,
        model.clockwiseOrder[second] as string,
      ].sort());
    }
  }

  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-006",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC006:${reference}:NEIGHBOURS`,
    text: `Who are the immediate neighbours of ${reference}?`,
    ...buildOptions(seed, 3, "PAIR", answer, [
      {
        value: [
          personAt(model.clockwiseOrder, referenceIndex + 1),
          personAt(model.clockwiseOrder, referenceIndex + 2),
        ].sort(),
        misconceptionId: "SEA-MC-WRONG_NEIGHBOUR",
        recomputation: { sameArc: "CLOCKWISE" },
        explanation: "Both persons were selected from one side.",
      },
      {
        value: [
          personAt(model.clockwiseOrder, referenceIndex - 1),
          personAt(model.clockwiseOrder, referenceIndex - 2),
        ].sort(),
        misconceptionId: "SEA-MC-WRONG_NEIGHBOUR",
        recomputation: { sameArc: "ANTICLOCKWISE" },
        explanation: "Both persons were selected from one side.",
      },
      {
        value: [reference, personAt(model.clockwiseOrder, referenceIndex + 1)].sort(),
        misconceptionId: "SEA-MC-ENDPOINT_INCLUDED",
        recomputation: { includedReference: true },
        explanation: "This incorrectly includes the reference person.",
      },
    ], fallbackPairs),
    answer,
    explanation: `${answer[0]} and ${answer[1]} occupy the two seats directly beside ${reference}. Facing does not change physical adjacency.`,
  };
}

function fourthQuestion(
  seed: string,
  blueprint: MixedCircleBlueprintId,
  model: MixedCircleModel,
  random: DeterministicRandom,
): MixedCircleChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);

  if (blueprint === "SEA-PBA-019" && model.clockwiseOrder.length % 2 === 0) {
    const oppositeIndex = topology.oppositeSeatIndex(referenceIndex) as number;
    const answer = personAt(model.clockwiseOrder, oppositeIndex);
    return {
      questionOrder: 4,
      queryContractId: "SEA-QC-010",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: `QC010:${reference}:OPPOSITE`,
      text: `Who sits opposite ${reference}?`,
      ...buildOptions(seed, 4, "PERSON", answer, [
        {
          value: personAt(model.clockwiseOrder, referenceIndex + 1),
          misconceptionId: "SEA-MC-WRONG_NEIGHBOUR",
          recomputation: { neighbour: "CLOCKWISE" },
          explanation: "This selects a neighbour.",
        },
        {
          value: personAt(model.clockwiseOrder, referenceIndex - 1),
          misconceptionId: "SEA-MC-WRONG_NEIGHBOUR",
          recomputation: { neighbour: "ANTICLOCKWISE" },
          explanation: "This selects the other neighbour.",
        },
        {
          value: personAt(model.clockwiseOrder, oppositeIndex + 1),
          misconceptionId: "SEA-MC-OFF_BY_ONE",
          recomputation: { halfTurnPlusOne: true },
          explanation: "This moves one seat beyond the opposite position.",
        },
      ], model.clockwiseOrder),
      answer,
      explanation: `In a circle of ${model.clockwiseOrder.length} persons, the opposite seat is ${model.clockwiseOrder.length / 2} positions away. ${answer} occupies that seat.`,
    };
  }

  const facing = model.facings[reference] as MixedCircleFacing;
  const changedFacing = oppositeFacing(facing);
  const answer = personAt(
    model.clockwiseOrder,
    moveRelative(topology, referenceIndex, changedFacing, "LEFT", 2),
  );
  const unchangedAnswer = personAt(
    model.clockwiseOrder,
    moveRelative(topology, referenceIndex, facing, "LEFT", 2),
  );

  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-022",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC022:${reference}:ALL_CHANGE_FACING:LEFT:2`,
    text: `If everyone changes their facing direction, who will sit second to the left of ${reference}?`,
    ...buildOptions(seed, 4, "PERSON", answer, [
      {
        value: unchangedAnswer,
        misconceptionId: "SEA-MC-REFERENCE_FACING_IGNORED",
        recomputation: { facingNotChanged: true },
        explanation: `This keeps ${reference}'s original facing instead of changing it.`,
      },
      {
        value: personAt(
          model.clockwiseOrder,
          moveRelative(topology, referenceIndex, changedFacing, "LEFT", 1),
        ),
        misconceptionId: "SEA-MC-OFF_BY_ONE",
        recomputation: { steps: 1 },
        explanation: "This stops after one seat.",
      },
      {
        value: personAt(
          model.clockwiseOrder,
          moveRelative(topology, referenceIndex, changedFacing, "RIGHT", 2),
        ),
        misconceptionId: "SEA-MC-LEFT_RIGHT_REVERSED",
        recomputation: { direction: "RIGHT" },
        explanation: "This follows the right side after the facing change.",
      },
    ], model.clockwiseOrder),
    answer,
    oppositeFacingCounterfactual: unchangedAnswer,
    explanation: `${reference} originally faces ${facingText(facing)}; after everyone changes facing, ${reference} faces ${facingText(changedFacing)}. Under that new facing, left is ${changedFacing === "CENTER" ? "clockwise" : "anticlockwise"}, so the second person to the left is ${answer}.`,
  };
}

export function buildMixedCircleChildren(
  seed: string,
  blueprint: MixedCircleBlueprintId,
  model: MixedCircleModel,
  random: DeterministicRandom,
): readonly MixedCircleChildQuestion[] {
  const first = secondLeftQuestion(seed, model, random);
  const second = immediateRightQuestion(
    seed,
    model,
    random,
    new Set([String(first.answer)]),
  );
  return [
    first,
    second,
    neighboursQuestion(seed, model, random),
    fourthQuestion(seed, blueprint, model, random),
  ];
}
