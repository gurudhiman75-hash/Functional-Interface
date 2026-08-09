import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../canonical.ts";
import { CircularTopology, personAt, seatIndexOf } from "../cp003/topology.ts";
import type {
  OutwardAnswerType,
  OutwardChildQuestion,
  OutwardMisconceptionId,
  OutwardOption,
  OutwardSemanticValue,
  OutwardSolverModel,
} from "./types.ts";

type Trap = {
  readonly value: OutwardSemanticValue;
  readonly misconceptionId: OutwardMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
};

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function display(value: OutwardSemanticValue, answerType: OutwardAnswerType): string {
  return Array.isArray(value) ? value.join(answerType === "SEQUENCE" ? " → " : " and ") : String(value);
}

function buildOptions(
  seed: string,
  questionOrder: 1 | 2 | 3 | 4,
  answerType: OutwardAnswerType,
  answer: OutwardSemanticValue,
  traps: readonly Trap[],
  fallbackValues: readonly OutwardSemanticValue[],
): Pick<OutwardChildQuestion, "options" | "answerIndex"> {
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
      misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
      recomputation: { fallbackVerifiedValue: value },
      explanation: "This does not match the solved outward-facing arrangement.",
    });
  }
  if (unique.size < 3) throw new Error(`Insufficient ${answerType} distractors`);

  const options: OutwardOption[] = [...unique.values()].slice(0, 3).map((trap) => ({
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
    recomputation: { method: "unique_verified_outward_model" },
    explanation: "This matches the solved outward-facing arrangement.",
  });
  return { options: options as unknown as OutwardChildQuestion["options"], answerIndex };
}

function secondLeftQuestion(
  seed: string,
  model: OutwardSolverModel,
  random: DeterministicRandom,
): OutwardChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const reference = random.pick(model.clockwiseOrder);
  const referenceIndex = seatIndexOf(model.clockwiseOrder, reference);
  const answer = personAt(model.clockwiseOrder, topology.moveRelativeOutward(referenceIndex, "LEFT", 2));
  const centreFacingCounterfactual = personAt(
    model.clockwiseOrder,
    topology.moveRelativeCentre(referenceIndex, "LEFT", 2),
  );
  return {
    questionOrder: 1,
    queryContractId: "SEA-QC-003",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC003:${reference}:OUTWARD:LEFT:2`,
    text: `Who sits second to the left of ${reference}?`,
    ...buildOptions(seed, 1, "PERSON", answer, [
      {
        value: centreFacingCounterfactual,
        misconceptionId: "SEA-MC-OUT-CENTRE_RULE_APPLIED",
        recomputation: { incorrectlyUsedFacing: "CENTER" },
        explanation: "This applies the centre-facing rule. For outward-facing persons, left is anticlockwise.",
      },
      {
        value: personAt(model.clockwiseOrder, topology.moveRelativeOutward(referenceIndex, "LEFT", 1)),
        misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
        recomputation: { direction: "LEFT", steps: 1 },
        explanation: "This stops one seat early.",
      },
      {
        value: personAt(model.clockwiseOrder, topology.moveRelativeOutward(referenceIndex, "LEFT", 3)),
        misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
        recomputation: { direction: "LEFT", steps: 3 },
        explanation: "This moves one seat too far.",
      },
    ], model.clockwiseOrder),
    answer,
    centreFacingCounterfactual,
    explanation: `Everyone faces outward, so left means anticlockwise. Moving two seats anticlockwise from ${reference} reaches ${answer}.`,
  };
}

function neighbourQuestion(
  seed: string,
  model: OutwardSolverModel,
  random: DeterministicRandom,
): OutwardChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);
  const answer = [
    personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, "ANTICLOCKWISE", 1)),
    personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, "CLOCKWISE", 1)),
  ].sort();
  return {
    questionOrder: 2,
    queryContractId: "SEA-QC-006",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC006:${reference}:NEIGHBOURS`,
    text: `Who are the immediate neighbours of ${reference}?`,
    ...buildOptions(seed, 2, "PAIR", answer, [
      {
        value: [personAt(model.clockwiseOrder, referenceIndex + 1), personAt(model.clockwiseOrder, referenceIndex + 2)].sort(),
        misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
        recomputation: { sameArc: "CLOCKWISE" },
        explanation: "Both persons were selected from the same side.",
      },
      {
        value: [personAt(model.clockwiseOrder, referenceIndex - 1), personAt(model.clockwiseOrder, referenceIndex - 2)].sort(),
        misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
        recomputation: { sameArc: "ANTICLOCKWISE" },
        explanation: "Both persons were selected from the same side.",
      },
      {
        value: [reference, personAt(model.clockwiseOrder, referenceIndex + 1)].sort(),
        misconceptionId: "SEA-MC-OUT-ENDPOINT_INCLUDED",
        recomputation: { includedReference: true },
        explanation: "This incorrectly includes the reference person.",
      },
    ], []),
    answer,
    explanation: `${answer[0]} and ${answer[1]} occupy the two seats directly beside ${reference}. Facing does not change adjacency.`,
  };
}

function countQuestion(
  seed: string,
  model: OutwardSolverModel,
  random: DeterministicRandom,
): OutwardChildQuestion {
  const firstIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const distance = random.integer(2, model.clockwiseOrder.length - 2);
  const first = personAt(model.clockwiseOrder, firstIndex);
  const second = personAt(model.clockwiseOrder, firstIndex + distance);
  const answer = distance - 1;
  const reverseCount = model.clockwiseOrder.length - distance - 1;
  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-009",
    answerType: "COUNT",
    answerDeterminingFactFingerprint: `QC009:${first}:CW:${second}`,
    text: `How many persons sit between ${first} and ${second} when counted clockwise from ${first}?`,
    ...buildOptions(seed, 3, "COUNT", answer, [
      {
        value: reverseCount,
        misconceptionId: "SEA-MC-OUT-WRONG_ARC",
        recomputation: { direction: "ANTICLOCKWISE" },
        explanation: "This counts the other arc.",
      },
      {
        value: answer + 1,
        misconceptionId: "SEA-MC-OUT-ENDPOINT_INCLUDED",
        recomputation: { includedOneEndpoint: true },
        explanation: "This includes one endpoint.",
      },
      {
        value: Math.max(0, answer - 1),
        misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
        recomputation: { stoppedEarly: true },
        explanation: "This stops one seat early.",
      },
    ], Array.from({ length: model.clockwiseOrder.length - 1 }, (_, value) => value)),
    answer,
    explanation: `The clockwise distance is ${distance} seats, so ${distance} − 1 = ${answer} ${answer === 1 ? "person sits" : "persons sit"} strictly between them.`,
  };
}

function fourthQuestion(
  seed: string,
  model: OutwardSolverModel,
  random: DeterministicRandom,
): OutwardChildQuestion {
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
          misconceptionId: "SEA-MC-OUT-ADJACENT_AS_OPPOSITE",
          recomputation: { neighbour: "CLOCKWISE" },
          explanation: "This selects a neighbour.",
        },
        {
          value: personAt(model.clockwiseOrder, referenceIndex - 1),
          misconceptionId: "SEA-MC-OUT-ADJACENT_AS_OPPOSITE",
          recomputation: { neighbour: "ANTICLOCKWISE" },
          explanation: "This selects the other neighbour.",
        },
        {
          value: personAt(model.clockwiseOrder, opposite + 1),
          misconceptionId: "SEA-MC-OUT-OFF_BY_ONE",
          recomputation: { halfTurnPlusOne: true },
          explanation: "This moves one seat beyond the opposite seat.",
        },
      ], model.clockwiseOrder),
      answer,
      explanation: `With ${model.clockwiseOrder.length} seats, the opposite position is ${model.clockwiseOrder.length / 2} seats away. ${answer} occupies it.`,
    };
  }

  const sequence = (direction: "CLOCKWISE" | "ANTICLOCKWISE"): readonly string[] => [1, 2, 3].map((steps) =>
    personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, direction, steps)));
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
        misconceptionId: "SEA-MC-OUT-CLOCKWISE_REVERSAL",
        recomputation: { direction: "ANTICLOCKWISE" },
        explanation: "This follows the reverse arc.",
      },
      {
        value: [reference, ...answer.slice(0, 2)],
        misconceptionId: "SEA-MC-OUT-ENDPOINT_INCLUDED",
        recomputation: { includedReference: true },
        explanation: "This incorrectly includes the reference person.",
      },
      {
        value: [...answer].reverse(),
        misconceptionId: "SEA-MC-OUT-CLOCKWISE_REVERSAL",
        recomputation: { reversedSequence: true },
        explanation: "This reverses the correct sequence.",
      },
    ], []),
    answer,
    explanation: `Starting immediately clockwise from ${reference}, the next three persons are ${answer.join(", ")}.`,
  };
}

export function buildOutwardChildren(
  seed: string,
  model: OutwardSolverModel,
  random: DeterministicRandom,
): readonly OutwardChildQuestion[] {
  return [
    secondLeftQuestion(seed, model, random),
    neighbourQuestion(seed, model, random),
    countQuestion(seed, model, random),
    fourthQuestion(seed, model, random),
  ];
}
