import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { canonicalDigest } from "../canonical.ts";
import { CircularTopology, personAt, seatIndexOf } from "../cp003/topology.ts";
import { moveMixedCircularRelative } from "./constraints.ts";
import type {
  MixedCircularAnswerType,
  MixedCircularBlueprintId,
  MixedCircularChildQuestion,
  MixedCircularFacing,
  MixedCircularMisconceptionId,
  MixedCircularModel,
  MixedCircularOption,
  MixedCircularQueryContractId,
  MixedCircularSemanticValue,
} from "./types.ts";

export const SEA_CP005_ACCEPTED_QUERY_CONTRACTS: readonly MixedCircularQueryContractId[] = [
  "SEA-QC-003",
  "SEA-QC-005",
  "SEA-QC-006",
  "SEA-QC-009",
  "SEA-QC-010",
  "SEA-QC-020",
  "SEA-QC-022",
];

export const SEA_CP005_QUERY_SURFACE_IDS = [
  "SEA-CP005-QS-001-SECOND-LEFT",
  "SEA-CP005-QS-002-IMMEDIATE-RIGHT",
  "SEA-CP005-QS-003-NEIGHBOURS",
  "SEA-CP005-QS-004-DIRECTIONAL-GAP",
  "SEA-CP005-QS-005-CLOCKWISE-SEQUENCE",
  "SEA-CP005-QS-006-OPPOSITE",
  "SEA-CP005-QS-007-ALL-CHANGE-FACING",
] as const;

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
  const answer = personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, facing, direction, steps));
  const wrongFacing = oppositeFacing(facing);
  const counterfactual = personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, wrongFacing, direction, steps));
  const oneStep = personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, facing, direction, Math.max(1, steps - 1)));
  const extraStep = personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, facing, direction, steps + 1));
  const queryContractId = questionOrder === 1 ? "SEA-QC-003" as const : "SEA-QC-005" as const;
  const surfaceId = questionOrder === 1 ? "SEA-CP005-QS-001-SECOND-LEFT" : "SEA-CP005-QS-002-IMMEDIATE-RIGHT";
  const text = questionOrder === 1 ? `Who sits second to the left of ${reference}?` : `Who sits immediately to the right of ${reference}?`;
  const assumedMisconception = wrongFacing === "CENTRE" ? "SEA-MC-MCIRC-ASSUMED_CENTRE" as const : "SEA-MC-MCIRC-ASSUMED_OUTWARD" as const;

  return {
    questionOrder,
    queryContractId,
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `${surfaceId}|${queryContractId}:${reference}:${facing}:${direction}:${steps}`,
    text,
    ...buildOptions(seed, questionOrder, "PERSON", answer, [
      { value: counterfactual, misconceptionId: assumedMisconception, recomputation: { reference, incorrectlyUsedFacing: wrongFacing, direction, steps }, explanation: `This uses ${wrongFacing.toLowerCase()}-facing direction for ${reference}, although ${reference} faces ${facing.toLowerCase()}.` },
      { value: oneStep, misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { reference, facing, direction, steps: Math.max(1, steps - 1) }, explanation: "This stops at the wrong distance from the reference person." },
      { value: extraStep, misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { reference, facing, direction, steps: steps + 1 }, explanation: "This moves one seat too far." },
    ], model.clockwiseOrder),
    answer,
    explanation: `${reference} faces ${facingRule(facing, direction)}. Moving ${steps === 1 ? "one seat" : `${steps} seats`} in that direction reaches ${answer}.`,
    referencePersonId: reference,
    referenceFacing: facing,
    oppositeFacingCounterfactual: counterfactual,
  };
}

function neighbourQuestion(seed: string, model: MixedCircularModel, random: DeterministicRandom): MixedCircularChildQuestion {
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
    answerDeterminingFactFingerprint: `SEA-CP005-QS-003-NEIGHBOURS|QC006:${reference}:NEIGHBOURS`,
    text: `Who are the immediate neighbours of ${reference}?`,
    ...buildOptions(seed, 3, "PAIR", answer, [
      { value: [personAt(model.clockwiseOrder, referenceIndex + 1), personAt(model.clockwiseOrder, referenceIndex + 2)].sort(), misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { sameArc: "CLOCKWISE" }, explanation: "Both persons were selected from the same side of the circle." },
      { value: [personAt(model.clockwiseOrder, referenceIndex - 1), personAt(model.clockwiseOrder, referenceIndex - 2)].sort(), misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { sameArc: "ANTICLOCKWISE" }, explanation: "Both persons were selected from the same side of the circle." },
      { value: [reference, personAt(model.clockwiseOrder, referenceIndex + 1)].sort(), misconceptionId: "SEA-MC-MCIRC-ENDPOINT_INCLUDED", recomputation: { includedReference: true }, explanation: "This incorrectly includes the reference person." },
    ], []),
    answer,
    explanation: `${answer[0]} and ${answer[1]} occupy the two seats directly beside ${reference}. Facing does not change adjacency.`,
  };
}

function directionalCountQuestion(seed: string, model: MixedCircularModel, random: DeterministicRandom): MixedCircularChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const firstIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const distance = random.integer(2, model.clockwiseOrder.length - 2);
  const first = personAt(model.clockwiseOrder, firstIndex);
  const second = personAt(model.clockwiseOrder, topology.moveCyclic(firstIndex, "CLOCKWISE", distance));
  const answer = distance - 1;
  const reverse = model.clockwiseOrder.length - distance - 1;
  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-009",
    answerType: "COUNT",
    answerDeterminingFactFingerprint: `SEA-CP005-QS-004-DIRECTIONAL-GAP|QC009:${first}:CW:${second}`,
    text: `How many persons sit between ${first} and ${second} when counted clockwise from ${first}?`,
    ...buildOptions(seed, 3, "COUNT", answer, [
      { value: reverse, misconceptionId: "SEA-MC-MCIRC-WRONG_ARC", recomputation: { direction: "ANTICLOCKWISE" }, explanation: "This counts the other arc." },
      { value: answer + 1, misconceptionId: "SEA-MC-MCIRC-ENDPOINT_INCLUDED", recomputation: { includedOneEndpoint: true }, explanation: "This includes one named endpoint." },
      { value: Math.max(0, answer - 1), misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { stoppedEarly: true }, explanation: "This stops one seat early." },
    ], Array.from({ length: model.clockwiseOrder.length - 1 }, (_, value) => value)),
    answer,
    explanation: `The clockwise distance from ${first} to ${second} is ${distance} seats, so ${distance} − 1 = ${answer} ${answer === 1 ? "person sits" : "persons sit"} strictly between them. Facing does not affect a clockwise arc count.`,
  };
}

function sequenceQuestion(seed: string, model: MixedCircularModel, random: DeterministicRandom): MixedCircularChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);
  const sequence = (direction: "CLOCKWISE" | "ANTICLOCKWISE", offset = 0): readonly string[] => [1, 2, 3].map((steps) =>
    personAt(model.clockwiseOrder, topology.moveCyclic(referenceIndex, direction, steps + offset)));
  const answer = sequence("CLOCKWISE");
  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-020",
    answerType: "SEQUENCE",
    answerDeterminingFactFingerprint: `SEA-CP005-QS-005-CLOCKWISE-SEQUENCE|QC020:${reference}:NEXT3CW`,
    text: `Which sequence lists the next three persons clockwise from ${reference}?`,
    ...buildOptions(seed, 3, "SEQUENCE", answer, [
      { value: sequence("ANTICLOCKWISE"), misconceptionId: "SEA-MC-MCIRC-CLOCKWISE_REVERSAL", recomputation: { direction: "ANTICLOCKWISE" }, explanation: "This follows the reverse arc." },
      { value: sequence("CLOCKWISE", 1), misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { skippedImmediate: true }, explanation: "This skips the immediate clockwise person." },
      { value: [reference, ...answer.slice(0, 2)], misconceptionId: "SEA-MC-MCIRC-ENDPOINT_INCLUDED", recomputation: { includedReference: true }, explanation: "This incorrectly includes the reference person." },
      { value: [...answer].reverse(), misconceptionId: "SEA-MC-MCIRC-CLOCKWISE_REVERSAL", recomputation: { reversedSequence: true }, explanation: "This reverses the correct sequence." },
    ], []),
    answer,
    explanation: `Starting immediately clockwise from ${reference}, the next three persons are ${answer.join(", ")}. Clockwise order is independent of individual facing.`,
  };
}

function fourthQuestion(seed: string, blueprint: MixedCircularBlueprintId, model: MixedCircularModel, random: DeterministicRandom): MixedCircularChildQuestion {
  const topology = new CircularTopology(model.clockwiseOrder.length);
  const referenceIndex = random.integer(0, model.clockwiseOrder.length - 1);
  const reference = personAt(model.clockwiseOrder, referenceIndex);

  if (blueprint === "SEA-PBA-019") {
    const opposite = topology.oppositeSeatIndex(referenceIndex);
    if (opposite === null) throw new Error("SEA-PBA-019 requires an even circle");
    const answer = personAt(model.clockwiseOrder, opposite);
    return {
      questionOrder: 4,
      queryContractId: "SEA-QC-010",
      answerType: "PERSON",
      answerDeterminingFactFingerprint: `SEA-CP005-QS-006-OPPOSITE|QC010:${reference}:OPPOSITE`,
      text: `Who sits opposite ${reference}?`,
      ...buildOptions(seed, 4, "PERSON", answer, [
        { value: personAt(model.clockwiseOrder, referenceIndex + 1), misconceptionId: "SEA-MC-MCIRC-ADJACENT_AS_OPPOSITE", recomputation: { neighbour: "CLOCKWISE" }, explanation: "This selects a neighbour instead of the diametrically opposite seat." },
        { value: personAt(model.clockwiseOrder, referenceIndex - 1), misconceptionId: "SEA-MC-MCIRC-ADJACENT_AS_OPPOSITE", recomputation: { neighbour: "ANTICLOCKWISE" }, explanation: "This selects the other neighbour." },
        { value: personAt(model.clockwiseOrder, opposite + 1), misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { halfTurnPlusOne: true }, explanation: "This moves one seat beyond the opposite seat." },
      ], model.clockwiseOrder),
      answer,
      explanation: `With ${model.clockwiseOrder.length} seats, the opposite seat is ${model.clockwiseOrder.length / 2} positions away. ${answer} occupies that seat; facing does not change opposition.`,
    };
  }

  const facing = model.facings[reference];
  if (!facing) throw new Error(`Missing facing for ${reference}`);
  const changedFacing = oppositeFacing(facing);
  const answer = personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, changedFacing, "LEFT", 2));
  const unchangedAnswer = personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, facing, "LEFT", 2));
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-022",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `SEA-CP005-QS-007-ALL-CHANGE-FACING|QC022:${reference}:ALL_CHANGE_FACING:LEFT:2`,
    text: `If everyone changes their facing direction, who will sit second to the left of ${reference}?`,
    ...buildOptions(seed, 4, "PERSON", answer, [
      { value: unchangedAnswer, misconceptionId: "SEA-MC-MCIRC-REFERENCE_FACING_IGNORED", recomputation: { reference, facingNotChanged: true, originalFacing: facing }, explanation: `This keeps ${reference}'s original facing instead of changing it.` },
      { value: personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, changedFacing, "LEFT", 1)), misconceptionId: "SEA-MC-MCIRC-OFF_BY_ONE", recomputation: { changedFacing, direction: "LEFT", steps: 1 }, explanation: "This stops after one seat." },
      { value: personAt(model.clockwiseOrder, moveMixedCircularRelative(topology, referenceIndex, changedFacing, "RIGHT", 2)), misconceptionId: "SEA-MC-MCIRC-CLOCKWISE_REVERSAL", recomputation: { changedFacing, direction: "RIGHT", steps: 2 }, explanation: "This follows the right side after the facing change." },
    ], model.clockwiseOrder),
    answer,
    explanation: `${reference} originally faces ${facing === "CENTRE" ? "the centre" : "outward"}; after everyone changes facing, ${reference} faces ${changedFacing === "CENTRE" ? "the centre" : "outward"}. Under that new facing, left is ${changedFacing === "CENTRE" ? "clockwise" : "anticlockwise"}, so the second person to the left is ${answer}.`,
    referencePersonId: reference,
    referenceFacing: facing,
    oppositeFacingCounterfactual: unchangedAnswer,
  };
}

export function buildMixedCircularChildren(
  seed: string,
  blueprint: MixedCircularBlueprintId,
  model: MixedCircularModel,
  random: DeterministicRandom,
): readonly MixedCircularChildQuestion[] {
  const thirdMode = stableNumber(`${seed}:cp005-third-contract`) % 3;
  const third = thirdMode === 0
    ? neighbourQuestion(seed, model, random)
    : thirdMode === 1
      ? directionalCountQuestion(seed, model, random)
      : sequenceQuestion(seed, model, random);
  return [relativeQuestion(seed, 1, model, random), relativeQuestion(seed, 2, model, random), third, fourthQuestion(seed, blueprint, model, random)];
}
