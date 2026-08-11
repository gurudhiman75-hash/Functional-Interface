import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../canonical.ts";
import { CircularTopology, personAt, seatIndexOf } from "../cp003/topology.ts";
import { moveMixedCircularRelative } from "./constraints.ts";
import type {
  MixedCircularAnswerType,
  MixedCircularChildQuestion,
  MixedCircularFacing,
  MixedCircularMisconceptionId,
  MixedCircularModel,
  MixedCircularOption,
  MixedCircularSemanticValue,
} from "./types.ts";

type Trap = {
  readonly value: MixedCircularSemanticValue;
  readonly misconceptionId: MixedCircularMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
};

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function display(value: MixedCircularSemanticValue, answerType: MixedCircularAnswerType): string {
  return Array.isArray(value) ? value.join(answerType === "SEQUENCE" ? " → " : " and ") : String(value);
}

function buildOptions(
  seed: string,
  questionOrder: 1 | 2 | 3 | 4,
  answerType: MixedCircularAnswerType,
  answer: MixedCircularSemanticValue,
  traps: readonly Trap[],
  fallbackValues: readonly MixedCircularSemanticValue[],
): Pick<MixedCircularChildQuestion, "options" | "answerIndex"> {
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
      misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE",
      recomputation: { fallbackVerifiedValue: value },
      explanation: "This does not match the verified mixed-facing circular arrangement.",
    });
  }
  if (unique.size < 3) throw new Error(`Insufficient mixed-circle ${answerType} distractors`);

  const options: MixedCircularOption[] = [...unique.values()].slice(0, 3).map((trap) => ({
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
    recomputation: { method: "unique_verified_mixed_circle_model" },
    explanation: "This matches the verified mixed-facing circular arrangement.",
  });
  return { options: options as unknown as MixedCircularChildQuestion["options"], answerIndex };
}

function oppositeFacing(facing: MixedCircularFacing): MixedCircularFacing {
  return facing === "CENTRE" ? "OUTWARD" : "CENTRE";
}

function facingRule(facing: MixedCircularFacing, direction: "LEFT" | "RIGHT"): string {
  const cyclic = facing === "CENTRE"
    ? direction === "LEFT" ? "clockwise" : "anticlockwise"
    : direction === "LEFT" ? "anticlockwise" : "clockwise";
  return `${facing === "CENTRE" ? "the centre" : "outward"}, so ${direction.toLowerCase()} means ${cyclic}`;
}

function relativeQuestion(
  seed: string,
  questionOrder: 1 | 2,
  model: MixedCircularModel,
  random: DeterministicRandom,
): MixedCircularChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const reference = random.pick(model.clockwiseOrder);
  const referenceIndex = seatIndexOf(model.clockwiseOrder, reference);
  const facing = model.facings[reference];
  if (!facing) throw new Error(`Missing facing for ${reference}`);
  const direction = questionOrder === 1 ? "LEFT" as const : "RIGHT" as const;
  const steps = questionOrder === 1 ? 2 : 1;
  const answer = personAt(
    model.clockwiseOrder,
    moveMixedCircularRelative(topology, referenceIndex, facing, direction, steps),
  );
  const wrongFacing = oppositeFacing(facing);
  const counterfactual = personAt(
    model.clockwiseOrder,
    moveMixedCircularRelative(topology, referenceIndex, wrongFacing, direction, steps),
  );
  const oneStep = personAt(
    model.clockwiseOrder,
    moveMixedCircularRelative(topology, referenceIndex, facing, direction, Math.max(1, steps - 1)),
  );
  const extraStep = personAt(
    model.clockwiseOrder,
    moveMixedCircularRelative(topology, referenceIndex, facing, direction, steps + 1),
  );
  const queryContractId = questionOrder === 1 ? "SEA-QC-003" as const : "SEA-QC-005" as const;
  const text = questionOrder === 1
    ? `Who sits second to the left of ${reference}?`
    : `Who sits immediately to the right of ${reference}?`;
  const assumedMisconception = wrongFacing === "CENTRE"
    ? "SEA-MC-MCIRC-ASSUMED_CENTRE" as const
    : "SEA-MC-MCIRC-ASSUMED_OUTWARD" as const;

  return {
    questionOrder,
    queryContractId,
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `${queryContractId}:${reference}:${facing}:${direction}:${steps}`,
    text,
    ...buildOptions(seed, questionOrder, "PERSON", answer, [
      {
        value: counterfactual,
        misconceptionId: assumedMisconception,
        recomputation: { reference, incorrectlyUsedFacing: wrongFacing, direction, steps },
        explanation: `This uses ${wrongFacing.toLowerCase()}-facing direction for ${reference}, although ${reference} faces ${facing.toLowerCase()}.`,
      },
      {
        value: oneStep,
        misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE",
        recomputation: { reference, facing, direction, steps: Math.max(1, steps - 1) },
        explanation: "This stops at the wrong distance from the reference person.",
      },
      {
        value: extraStep,
        misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE",
        recomputation: { reference, facing, direction, steps: steps + 1 },
        explanation: "This moves one seat too far.",
      },
    ], model.clockwiseOrder),
    answer,
    explanation: `${reference} faces ${facingRule(facing, direction)}. Moving ${steps === 1 ? "one seat" : `${steps} seats`} in that direction reaches ${answer}.`,
    referencePersonId: reference,
    referenceFacing: facing,
    oppositeFacingCounterfactual: counterfactual,
  };
}

function neighbourQuestion(
  seed: string,
  model: MixedCircularModel,
  random: DeterministicRandom,
): MixedCircularChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);
  const answer = [
    personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, "ANTICLOCKWISE", 1)),
    personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, "CLOCKWISE", 1)),
  ].sort();
  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-006",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC006:${reference}:NEIGHBOURS`,
    text: `Who are the immediate neighbours of ${reference}?`,
    ...buildOptions(seed, 3, "PAIR", answer, [
      {
        value: [personAt(model.clockwiseOrder, referenceIndex + 1), personAt(model.clockwiseOrder, referenceIndex + 2)].sort(),
        misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE",
        recomputation: { sameArc: "CLOCKWISE" },
        explanation: "Both persons were selected from the same side of the circle.",
      },
      {
        value: [personAt(model.clockwiseOrder, referenceIndex - 1), personAt(model.clockwiseOrder, referenceIndex - 2)].sort(),
        misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE",
        recomputation: { sameArc: "ANTICLOCKWISE" },
        explanation: "Both persons were selected from the same side of the circle.",
      },
      {
        value: [reference, personAt(model.clockwiseOrder, referenceIndex + 1)].sort(),
        misconceptionId: "SEA-MC-MCIRC-ENDPOINT_INCLUDED",
        recomputation: { includedReference: true },
        explanation: "This incorrectly includes the reference person.",
      },
    ], []),
    answer,
    explanation: `${answer[0]} and ${answer[1]} occupy the two seats directly beside ${reference}. Facing does not change adjacency.`,
  };
}

function fourthQuestion(
  seed: string,
  model: MixedCircularModel,
  random: DeterministicRandom,
): MixedCircularChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);
  const opposite = topology.oppositeSeatIndex(referenceIndex);
  if (opposite !== null) {
    const answer = personAt(model.clockwiseOrder, opposite);
    return {
      questionOrder: 4,
      queryContractId: "SEA-QC-010",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: `QC010:${reference}:OPPOSITE`,
      text: `Who sits opposite ${reference}?`,
      ...buildOptions(seed, 4, "PERSON", answer, [
        {
          value: personAt(model.clockwiseOrder, referenceIndex + 1),
          misconceptionId: "SEA-MC-MCIRC-ADJACENT_AS_OPPOSITE",
          recomputation: { neighbour: "CLOCKWISE" },
          explanation: "This selects a neighbour instead of the diametrically opposite seat.",
        },
        {
          value: personAt(model.clockwiseOrder, referenceIndex - 1),
          misconceptionId: "SEA-MC-MCIRC-ADJACENT_AS_OPPOSITE",
          recomputation: { neighbour: "ANTICLOCKWISE" },
          explanation: "This selects the other neighbour.",
        },
        {
          value: personAt(model.clockwiseOrder, opposite + 1),
          misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE",
          recomputation: { halfTurnPlusOne: true },
          explanation: "This moves one seat beyond the opposite seat.",
        },
      ], model.clockwiseOrder),
      answer,
      explanation: `With ${model.clockwiseOrder.length} seats, the opposite seat is ${model.clockwiseOrder.length / 2} positions away. ${answer} occupies that seat; facing does not change opposition.`,
    };
  }

  const sequence = (direction: "CLOCKWISE" | "ANTICLOCKWISE"): readonly string[] =>
    [1, 2, 3].map((steps) => personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, direction, steps)));
  const answer = sequence("CLOCKWISE");
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-020",
    answerType: "SEQUENCE",
    answerDeterminingFactFingerprint: `QC020:${reference}:NEXT3CW`,
    text: `Which sequence lists the next three persons clockwise from ${reference}?`,
    ...buildOptions(seed, 4, "SEQUENCE", answer, [
      {
        value: sequence("ANTICLOCKWISE"),
        misconceptionId: "SEA-MC-MCIRC-CLOCKWISE_REVERSAL",
        recomputation: { direction: "ANTICLOCKWISE" },
        explanation: "This follows the reverse arc.",
      },
      {
        value: [reference, ...answer.slice(0, 2)],
        misconceptionId: "SEA-MC-MCIRC-ENDPOINT_INCLUDED",
        recomputation: { includedReference: true },
        explanation: "This incorrectly includes the reference person.",
      },
      {
        value: [...answer].reverse(),
        misconceptionId: "SEA-MC-MCIRC-CLOCKWISE_REVERSAL",
        recomputation: { reversedSequence: true },
        explanation: "This reverses the correct clockwise sequence.",
      },
    ], []),
    answer,
    explanation: `Starting immediately clockwise from ${reference}, the next three persons are ${answer.join(", ")}. This query uses the circle's clockwise order, not anyone's facing.`,
  };
}

export function buildMixedCircularChildren(
  seed: string,
  model: MixedCircularModel,
  random: DeterministicRandom,
): readonly MixedCircularChildQuestion[] {
  return [
    relativeQuestion(seed, 1, model, random),
    relativeQuestion(seed, 2, model, random),
    neighbourQuestion(seed, model, random),
    fourthQuestion(seed, model, random),
  ];
}
