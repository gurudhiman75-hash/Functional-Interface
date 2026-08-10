import { canonicalDigest } from "../canonical.ts";
import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { CircularTopology, personAt } from "./topology.ts";
import type {
  CircularAnswerType,
  CircularChildQuestion,
  CircularMisconceptionId,
  CircularOption,
  CircularSemanticValue,
  CyclicDirection,
  PersonId,
} from "./types.ts";

type Trap = {
  readonly value: CircularSemanticValue;
  readonly misconceptionId: CircularMisconceptionId;
  readonly explanation: string;
  readonly recomputation: Readonly<Record<string, unknown>>;
};

function hash(value: string): number {
  let output = 0x811c9dc5;
  for (const character of value) output = Math.imul(output ^ character.charCodeAt(0), 0x01000193);
  return output >>> 0;
}

function display(value: CircularSemanticValue, type: CircularAnswerType): string {
  if (!Array.isArray(value)) return String(value);
  return value.join(type === "SEQUENCE" ? " → " : " and ");
}

function options(
  seed: string,
  order: 1 | 2 | 3 | 4,
  type: CircularAnswerType,
  answer: CircularSemanticValue,
  traps: readonly Trap[],
): Pick<CircularChildQuestion, "options" | "answerIndex"> {
  const correctKey = canonicalDigest(answer);
  const unique = new Map<string, Trap>();
  for (const trap of traps) {
    const key = canonicalDigest(trap.value);
    if (key !== correctKey && !unique.has(key)) unique.set(key, trap);
  }
  if (unique.size < 3) throw new Error(`Insufficient distinct ${type} distractors`);
  const output: CircularOption[] = [...unique.values()].slice(0, 3).map((trap) => ({
    semanticValue: trap.value,
    semanticFingerprint: canonicalDigest(trap.value),
    display: display(trap.value, type),
    isCorrect: false,
    misconceptionId: trap.misconceptionId,
    recomputation: trap.recomputation,
    explanation: trap.explanation,
  }));
  const answerIndex = (hash(`${seed}|${order}`) % 4) as 0 | 1 | 2 | 3;
  output.splice(answerIndex, 0, {
    semanticValue: answer,
    semanticFingerprint: correctKey,
    display: display(answer, type),
    isCorrect: true,
    recomputation: { method: "unique_verified_circular_model" },
    explanation: "This matches the solved circular arrangement.",
  });
  return { options: output as unknown as CircularChildQuestion["options"], answerIndex };
}

function personQuestion(seed: string, order: readonly PersonId[]): CircularChildQuestion {
  const topology = new CircularTopology(order.length);
  const referenceIndex = order.length - 1;
  const reference = personAt(order, referenceIndex);
  const steps = 2;
  const answer = personAt(order, topology.moveRelativeCentre(referenceIndex, "LEFT", steps));
  return {
    questionOrder: 1,
    queryContractId: "SEA-QC-003",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC003:${reference}:LEFT:${steps}`,
    text: `Who sits second to the left of ${reference}?`,
    ...options(seed, 1, "PERSON", answer, [
      { value: personAt(order, topology.moveRelativeCentre(referenceIndex, "RIGHT", steps)), misconceptionId: "SEA-MC-CYC-CENTRE_LEFT_RIGHT_REVERSAL", recomputation: { treatedLeftAsAnticlockwise: true }, explanation: "This reverses the centre-facing left/right rule." },
      { value: personAt(order, topology.moveCyclic(referenceIndex, "CLOCKWISE", 1)), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { steps: 1 }, explanation: "This stops one seat early." },
      { value: personAt(order, topology.moveCyclic(referenceIndex, "CLOCKWISE", 3)), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { steps: 3 }, explanation: "This moves one seat too far." },
      { value: personAt(order, referenceIndex), misconceptionId: "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP", recomputation: { includedReference: true }, explanation: "This incorrectly keeps the reference person." },
    ]),
    answer,
    explanation: `All persons face the centre, so left means clockwise. Moving two seats clockwise from ${reference} reaches ${answer}.`,
  };
}

function neighbourQuestion(seed: string, order: readonly PersonId[], rng: DeterministicRandom): CircularChildQuestion {
  const topology = new CircularTopology(order.length);
  const index = rng.integer(0, order.length - 1);
  const reference = personAt(order, index);
  const left = personAt(order, topology.moveCyclic(index, "ANTICLOCKWISE", 1));
  const right = personAt(order, topology.moveCyclic(index, "CLOCKWISE", 1));
  const answer = [left, right].sort();
  return {
    questionOrder: 2,
    queryContractId: "SEA-QC-006",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC006:${reference}:NEIGHBOURS`,
    text: `Who are the immediate neighbours of ${reference}?`,
    ...options(seed, 2, "PAIR", answer, [
      { value: [right, personAt(order, topology.moveCyclic(index, "CLOCKWISE", 2))].sort(), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { sameArc: "CLOCKWISE" }, explanation: "Both persons were selected from the clockwise side." },
      { value: [left, personAt(order, topology.moveCyclic(index, "ANTICLOCKWISE", 2))].sort(), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { sameArc: "ANTICLOCKWISE" }, explanation: "Both persons were selected from the anticlockwise side." },
      { value: [personAt(order, topology.moveCyclic(index, "CLOCKWISE", 2)), personAt(order, topology.moveCyclic(index, "ANTICLOCKWISE", 2))].sort(), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { skippedImmediateSeats: true }, explanation: "This skips both immediate seats." },
      { value: [reference, right].sort(), misconceptionId: "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP", recomputation: { includedReference: true }, explanation: "This incorrectly includes the reference person." },
    ]),
    answer,
    explanation: `${answer[0]} and ${answer[1]} occupy the two seats directly beside ${reference}.`,
  };
}

function cyclicPersonQuestion(seed: string, order: readonly PersonId[], rng: DeterministicRandom): CircularChildQuestion {
  const topology = new CircularTopology(order.length);
  const index = rng.integer(0, order.length - 1);
  const reference = personAt(order, index);
  const direction: CyclicDirection = hash(`${seed}:qc004-direction`) % 2 === 0 ? "CLOCKWISE" : "ANTICLOCKWISE";
  const reverse: CyclicDirection = direction === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE";
  const steps = 2;
  const answer = personAt(order, topology.moveCyclic(index, direction, steps));
  return {
    questionOrder: 2,
    queryContractId: "SEA-QC-004",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC004:${reference}:${direction}:${steps}`,
    text: `Who sits second ${direction.toLowerCase()} from ${reference}?`,
    ...options(seed, 2, "PERSON", answer, [
      { value: personAt(order, topology.moveCyclic(index, reverse, steps)), misconceptionId: "SEA-MC-CYC-CLOCKWISE_ANTICLOCKWISE_REVERSAL", recomputation: { usedDirection: reverse }, explanation: `This moves ${reverse.toLowerCase()} instead of ${direction.toLowerCase()}.` },
      { value: personAt(order, topology.moveCyclic(index, direction, 1)), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { steps: 1 }, explanation: "This stops after the immediate seat." },
      { value: personAt(order, topology.moveCyclic(index, direction, 3)), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { steps: 3 }, explanation: "This moves one seat too far." },
      { value: reference, misconceptionId: "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP", recomputation: { includedReference: true }, explanation: "This incorrectly counts the reference person as a moved position." },
    ]),
    answer,
    explanation: `Starting from ${reference} and moving two seats ${direction.toLowerCase()} reaches ${answer}. This question uses the physical circular direction directly, independent of facing.`,
  };
}

function countQuestion(seed: string, order: readonly PersonId[], rng: DeterministicRandom): CircularChildQuestion {
  const firstIndex = rng.integer(0, order.length - 1);
  const distance = rng.integer(2, order.length - 2);
  const first = personAt(order, firstIndex);
  const second = personAt(order, firstIndex + distance);
  const answer = distance - 1;
  const reverse = order.length - distance - 1;
  const resultPhrase = answer === 1 ? "1 person lies" : `${answer} persons lie`;
  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-009",
    answerType: "COUNT",
    answerDeterminingFactFingerprint: `QC009:${first}:CW:${second}`,
    text: `How many persons sit between ${first} and ${second} when counted clockwise from ${first}?`,
    ...options(seed, 3, "COUNT", answer, [
      { value: reverse, misconceptionId: "SEA-MC-CYC-WRONG_ARC", recomputation: { direction: "ANTICLOCKWISE" }, explanation: "This counts the other arc." },
      { value: answer + 1, misconceptionId: "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP", recomputation: { includedOneEndpoint: true }, explanation: "This includes one endpoint." },
      { value: answer + 2, misconceptionId: "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP", recomputation: { includedBothEndpoints: true }, explanation: "This includes both endpoints." },
      { value: Math.max(0, answer - 1), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { stoppedEarly: true }, explanation: "This stops one seat early." },
    ]),
    answer,
    explanation: `The clockwise distance is ${distance} seats, so ${distance} − 1 = ${answer}; therefore, ${resultPhrase} strictly between them.`,
  };
}

function fourthQuestion(seed: string, order: readonly PersonId[], rng: DeterministicRandom): CircularChildQuestion {
  const topology = new CircularTopology(order.length);
  const index = rng.integer(0, order.length - 1);
  const reference = personAt(order, index);
  const opposite = topology.oppositeSeatIndex(index);
  if (opposite !== null) {
    const answer = personAt(order, opposite);
    return {
      questionOrder: 4,
      queryContractId: "SEA-QC-010",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: `QC010:${reference}:OPPOSITE`,
      text: `Who sits opposite ${reference}?`,
      ...options(seed, 4, "PERSON", answer, [
        { value: personAt(order, index + 1), misconceptionId: "SEA-MC-CYC-ADJACENT_AS_OPPOSITE", recomputation: { neighbour: "CLOCKWISE" }, explanation: "This selects a neighbour." },
        { value: personAt(order, index - 1), misconceptionId: "SEA-MC-CYC-ADJACENT_AS_OPPOSITE", recomputation: { neighbour: "ANTICLOCKWISE" }, explanation: "This selects the other neighbour." },
        { value: personAt(order, opposite + 1), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { halfTurnPlusOne: true }, explanation: "This moves one seat beyond the opposite seat." },
        { value: personAt(order, opposite - 1), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { halfTurnMinusOne: true }, explanation: "This stops one seat before the opposite seat." },
      ]),
      answer,
      explanation: `In a circle of ${order.length} persons, the opposite seat is ${order.length / 2} positions away. That seat is occupied by ${answer}.`,
    };
  }

  const sequence = (direction: CyclicDirection, offset = 0): readonly PersonId[] => [1, 2, 3].map((step) =>
    personAt(order, topology.moveCyclic(index, direction, step + offset)));
  const answer = sequence("CLOCKWISE");
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-020",
    answerType: "SEQUENCE",
    answerDeterminingFactFingerprint: `QC020:${reference}:NEXT3CW`,
    text: `Which sequence lists the next three persons clockwise from ${reference}?`,
    ...options(seed, 4, "SEQUENCE", answer, [
      { value: sequence("ANTICLOCKWISE"), misconceptionId: "SEA-MC-CYC-CLOCKWISE_ANTICLOCKWISE_REVERSAL", recomputation: { direction: "ANTICLOCKWISE" }, explanation: "This follows the reverse arc." },
      { value: sequence("CLOCKWISE", 1), misconceptionId: "SEA-MC-CYC-OFF_BY_ONE_STEP", recomputation: { skippedImmediate: true }, explanation: "This skips the immediate clockwise person." },
      { value: [reference, ...answer.slice(0, 2)], misconceptionId: "SEA-MC-CYC-ENDPOINT_INCLUDED_IN_GAP", recomputation: { includedReference: true }, explanation: "This includes the reference person." },
      { value: [...answer].reverse(), misconceptionId: "SEA-MC-CYC-CLOCKWISE_ANTICLOCKWISE_REVERSAL", recomputation: { reversedOrder: true }, explanation: "This reverses the correct sequence." },
    ]),
    answer,
    explanation: `Starting immediately clockwise from ${reference}, the next three persons are ${answer.join(", ")}.`,
  };
}

export function buildCircularChildren(seed: string, order: readonly PersonId[], rng: DeterministicRandom): readonly CircularChildQuestion[] {
  const second = hash(`${seed}:cp003:second-query`) % 2 === 0
    ? neighbourQuestion(seed, order, rng)
    : cyclicPersonQuestion(seed, order, rng);
  return [personQuestion(seed, order), second, countQuestion(seed, order, rng), fourthQuestion(seed, order, rng)];
}