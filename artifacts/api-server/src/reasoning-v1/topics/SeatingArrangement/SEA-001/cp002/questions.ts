import { canonicalDigest } from "../canonical.ts";
import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { MixedFacingRowTopology, personAt, seatIndexOf } from "./topology.ts";
import type {
  MixedFacingAnswerType,
  MixedFacingChildQuestion,
  MixedFacingDirection,
  MixedFacingMisconceptionId,
  MixedFacingModel,
  MixedFacingOption,
  MixedFacingSemanticValue,
  MixedPersonId,
} from "./types.ts";

type Trap = {
  readonly value: MixedFacingSemanticValue;
  readonly misconceptionId: MixedFacingMisconceptionId;
  readonly recomputation: Readonly<Record<string, unknown>>;
  readonly explanation: string;
};

function stableNumber(value: string): number {
  let hash = 0x811c9dc5;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

function display(value: MixedFacingSemanticValue, type: MixedFacingAnswerType): string {
  return Array.isArray(value) ? value.join(type === "PAIR" ? " and " : " → ") : String(value);
}

function buildOptions(
  seed: string,
  questionOrder: 1 | 2 | 3 | 4,
  answerType: MixedFacingAnswerType,
  answer: MixedFacingSemanticValue,
  traps: readonly Trap[],
  fallbackValues: readonly MixedFacingSemanticValue[],
): Pick<MixedFacingChildQuestion, "options" | "answerIndex"> {
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
      misconceptionId: "SEA-MC-MIX-OFF_BY_ONE_SEAT",
      recomputation: { fallbackVerifiedValue: value },
      explanation: "This is another occupied position, but it does not follow the stated relation.",
    });
  }
  if (unique.size < 3) throw new Error(`Insufficient ${answerType} distractors`);
  const options: MixedFacingOption[] = [...unique.values()].slice(0, 3).map((trap) => ({
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
    recomputation: { method: "unique_verified_mixed_facing_model" },
    explanation: "This matches the uniquely solved row and facing pattern.",
  });
  return { options: options as unknown as MixedFacingChildQuestion["options"], answerIndex };
}

function facingWord(facing: MixedFacingDirection): string { return facing === "NORTH" ? "north" : "south"; }

function relativeTarget(
  model: MixedFacingModel,
  referenceId: MixedPersonId,
  direction: "LEFT" | "RIGHT",
  steps: number,
): number | null {
  const topology = new MixedFacingRowTopology(model.seatOrder.length);
  return topology.moveRelative(seatIndexOf(model.seatOrder, referenceId), model.facings[referenceId] as MixedFacingDirection, direction, steps);
}

function secondLeftQuestion(seed: string, model: MixedFacingModel, rng: DeterministicRandom): MixedFacingChildQuestion {
  const candidates = model.seatOrder.filter((personId) => relativeTarget(model, personId, "LEFT", 2) !== null);
  const reference = rng.pick(candidates);
  const target = relativeTarget(model, reference, "LEFT", 2);
  if (target === null) throw new Error("No second-left target");
  const answer = personAt(model.seatOrder, target);
  const referenceFacing = model.facings[reference] as MixedFacingDirection;
  const subjectFacing = model.facings[answer] as MixedFacingDirection;
  const topology = new MixedFacingRowTopology(model.seatOrder.length);
  const referenceSeat = seatIndexOf(model.seatOrder, reference);
  const wrongRight = topology.moveRelative(referenceSeat, referenceFacing, "RIGHT", 2);
  const wrongSubjectFacing = topology.moveRelative(referenceSeat, subjectFacing, "LEFT", 2);
  const wrongOne = topology.moveRelative(referenceSeat, referenceFacing, "LEFT", 1);
  const wrongThree = topology.moveRelative(referenceSeat, referenceFacing, "LEFT", 3);
  const traps: Trap[] = [];
  if (wrongRight !== null) traps.push({ value: personAt(model.seatOrder, wrongRight), misconceptionId: "SEA-MC-MIX-LEFT_RIGHT_REVERSED", recomputation: { direction: "RIGHT", steps: 2 }, explanation: "This reverses left and right for the reference person's facing." });
  if (wrongSubjectFacing !== null) traps.push({ value: personAt(model.seatOrder, wrongSubjectFacing), misconceptionId: "SEA-MC-MIX-SUBJECT_FACING_USED", recomputation: { usedFacingOf: answer }, explanation: `The direction must be read from ${reference}'s facing, not from the other person's facing.` });
  if (wrongOne !== null) traps.push({ value: personAt(model.seatOrder, wrongOne), misconceptionId: "SEA-MC-MIX-OFF_BY_ONE_SEAT", recomputation: { direction: "LEFT", steps: 1 }, explanation: "This stops after one seat instead of two." });
  if (wrongThree !== null) traps.push({ value: personAt(model.seatOrder, wrongThree), misconceptionId: "SEA-MC-MIX-OFF_BY_ONE_SEAT", recomputation: { direction: "LEFT", steps: 3 }, explanation: "This moves one seat too far." });
  return {
    questionOrder: 1,
    queryContractId: "SEA-QC-003",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC003:${reference}:LEFT:2:${referenceFacing}`,
    text: `Who sits second to the left of ${reference}?`,
    ...buildOptions(seed, 1, "PERSON", answer, traps, model.seatOrder),
    answer,
    explanation: `${reference} faces ${facingWord(referenceFacing)}. Therefore, ${reference}'s left is towards the ${referenceFacing === "NORTH" ? "left" : "right"} end of the row. Moving two seats in that direction reaches ${answer}.`,
  };
}

function immediateRightQuestion(
  seed: string,
  model: MixedFacingModel,
  rng: DeterministicRandom,
  excludedAnswers: ReadonlySet<string>,
): MixedFacingChildQuestion {
  const allCandidates = model.seatOrder.filter((personId) => relativeTarget(model, personId, "RIGHT", 1) !== null);
  const distinctCandidates = allCandidates.filter((personId) => {
    const target = relativeTarget(model, personId, "RIGHT", 1);
    return target !== null && !excludedAnswers.has(personAt(model.seatOrder, target));
  });
  const reference = rng.pick(distinctCandidates.length > 0 ? distinctCandidates : allCandidates);
  const target = relativeTarget(model, reference, "RIGHT", 1);
  if (target === null) throw new Error("No immediate-right target");
  const answer = personAt(model.seatOrder, target);
  const referenceFacing = model.facings[reference] as MixedFacingDirection;
  const left = relativeTarget(model, reference, "LEFT", 1);
  const rightTwo = relativeTarget(model, reference, "RIGHT", 2);
  const traps: Trap[] = [];
  if (left !== null) traps.push({ value: personAt(model.seatOrder, left), misconceptionId: "SEA-MC-MIX-LEFT_RIGHT_REVERSED", recomputation: { direction: "LEFT", steps: 1 }, explanation: "This selects the immediate left person instead." });
  if (rightTwo !== null) traps.push({ value: personAt(model.seatOrder, rightTwo), misconceptionId: "SEA-MC-MIX-OFF_BY_ONE_SEAT", recomputation: { direction: "RIGHT", steps: 2 }, explanation: "This moves two seats rather than one." });
  traps.push({ value: reference, misconceptionId: "SEA-MC-MIX-ENDPOINT_INCLUDED", recomputation: { includedReference: true }, explanation: "The reference person cannot be their own neighbour." });
  return {
    questionOrder: 2,
    queryContractId: "SEA-QC-005",
    answerType: "PERSON",
    answerDeterminingFactFingerprint: `QC005:${reference}:RIGHT:1:${referenceFacing}`,
    text: `Who sits immediately to the right of ${reference}?`,
    ...buildOptions(seed, 2, "PERSON", answer, traps, model.seatOrder),
    answer,
    explanation: `${reference} faces ${facingWord(referenceFacing)}. Hence, ${reference}'s right is towards the ${referenceFacing === "NORTH" ? "right" : "left"} end of the row, where ${answer} is seated.`,
  };
}

function neighboursQuestion(seed: string, model: MixedFacingModel, rng: DeterministicRandom): MixedFacingChildQuestion {
  const index = rng.integer(1, model.seatOrder.length - 2);
  const reference = personAt(model.seatOrder, index);
  const answer = [personAt(model.seatOrder, index - 1), personAt(model.seatOrder, index + 1)].sort();
  const traps: Trap[] = [
    { value: [personAt(model.seatOrder, Math.max(0, index - 2)), personAt(model.seatOrder, index + 1)].sort(), misconceptionId: "SEA-MC-MIX-WRONG_NEIGHBOUR", recomputation: { skippedLeftImmediate: true }, explanation: "This skips the person immediately beside the reference on one side." },
    { value: [personAt(model.seatOrder, index - 1), personAt(model.seatOrder, Math.min(model.seatOrder.length - 1, index + 2))].sort(), misconceptionId: "SEA-MC-MIX-WRONG_NEIGHBOUR", recomputation: { skippedRightImmediate: true }, explanation: "This skips the immediate neighbour on the other side." },
    { value: [reference, personAt(model.seatOrder, index + 1)].sort(), misconceptionId: "SEA-MC-MIX-ENDPOINT_INCLUDED", recomputation: { includedReference: true }, explanation: "This incorrectly includes the reference person." },
  ];
  const fallbackPairs: MixedFacingSemanticValue[] = [];
  for (let left = 0; left < model.seatOrder.length; left += 1) {
    for (let right = left + 1; right < model.seatOrder.length; right += 1) fallbackPairs.push([model.seatOrder[left] as string, model.seatOrder[right] as string].sort());
  }
  return {
    questionOrder: 3,
    queryContractId: "SEA-QC-006",
    answerType: "PAIR",
    answerDeterminingFactFingerprint: `QC006:${reference}:NEIGHBOURS`,
    text: `Who are the immediate neighbours of ${reference}?`,
    ...buildOptions(seed, 3, "PAIR", answer, traps, fallbackPairs),
    answer,
    explanation: `${answer[0]} and ${answer[1]} occupy the two seats directly beside ${reference}. Facing does not change physical adjacency.`,
  };
}

function countBetweenQuestion(seed: string, model: MixedFacingModel, rng: DeterministicRandom): MixedFacingChildQuestion {
  const firstIndex = rng.integer(0, model.seatOrder.length - 3);
  const secondIndex = rng.integer(firstIndex + 2, model.seatOrder.length - 1);
  const first = personAt(model.seatOrder, firstIndex);
  const second = personAt(model.seatOrder, secondIndex);
  const answer = secondIndex - firstIndex - 1;
  const candidateCounts = Array.from({ length: model.seatOrder.length - 1 }, (_, value) => value).filter((value) => value !== answer);
  const maximumValidCount = model.seatOrder.length - 2;
  const countTraps: Trap[] = [
    { value: answer + 1, misconceptionId: "SEA-MC-MIX-ENDPOINT_INCLUDED", recomputation: { includedOneEndpoint: true }, explanation: "This includes one endpoint in the count." },
    { value: answer + 2, misconceptionId: "SEA-MC-MIX-ENDPOINT_INCLUDED", recomputation: { includedBothEndpoints: true }, explanation: "This includes both named persons." },
    { value: Math.max(0, answer - 1), misconceptionId: "SEA-MC-MIX-OFF_BY_ONE_SEAT", recomputation: { stoppedEarly: true }, explanation: "This misses one person between the endpoints." },
  ];
  const traps = countTraps.filter((trap) => typeof trap.value === "number" && trap.value >= 0 && trap.value <= maximumValidCount);
  return {
    questionOrder: 4,
    queryContractId: "SEA-QC-008",
    answerType: "COUNT",
    answerDeterminingFactFingerprint: `QC008:${first}:${second}`,
    text: `How many persons sit between ${first} and ${second}?`,
    ...buildOptions(seed, 4, "COUNT", answer, traps, candidateCounts),
    answer,
    explanation: `${first} and ${second} are ${secondIndex - firstIndex} seats apart, so ${secondIndex - firstIndex} − 1 = ${answer} ${answer === 1 ? "person sits" : "persons sit"} between them.`,
  };
}

export function buildMixedFacingChildren(seed: string, model: MixedFacingModel, rng: DeterministicRandom): readonly MixedFacingChildQuestion[] {
  const first = secondLeftQuestion(seed, model, rng);
  const second = immediateRightQuestion(seed, model, rng, new Set([String(first.answer)]));
  return [
    first,
    second,
    neighboursQuestion(seed, model, rng),
    countBetweenQuestion(seed, model, rng),
  ];
}
