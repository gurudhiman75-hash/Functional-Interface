import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import type {
  SeatingMisconceptionId,
  SeatingOption,
  SeatingPerson,
  SeatingSemanticValue,
} from "../types.ts";

function semanticFingerprint(value: SeatingSemanticValue): string {
  return Array.isArray(value) ? `A:${[...value].sort().join("|")}` : `${typeof value}:${String(value)}`;
}

function asTuple(options: readonly SeatingOption[]): [SeatingOption, SeatingOption, SeatingOption, SeatingOption] {
  if (options.length !== 4) throw new Error(`Expected four options, received ${options.length}`);
  return [options[0] as SeatingOption, options[1] as SeatingOption, options[2] as SeatingOption, options[3] as SeatingOption];
}

export function buildPersonOptions(input: {
  readonly correctPersonId: string;
  readonly persons: readonly SeatingPerson[];
  readonly wrongCandidates: readonly {
    readonly personId: string | null;
    readonly misconceptionId: SeatingMisconceptionId;
    readonly recomputation: Readonly<Record<string, unknown>>;
    readonly explanation: string;
  }[];
  readonly seed: string;
}): { readonly options: [SeatingOption, SeatingOption, SeatingOption, SeatingOption]; readonly answerIndex: 0 | 1 | 2 | 3 } {
  const personName = new Map(input.persons.map((person) => [person.id, person.displayName] as const));
  const chosen = new Map<string, SeatingOption>();
  const correctName = personName.get(input.correctPersonId);
  if (!correctName) throw new Error(`Unknown correct person ${input.correctPersonId}`);
  chosen.set(input.correctPersonId, {
    semanticValue: input.correctPersonId,
    semanticFingerprint: semanticFingerprint(input.correctPersonId),
    display: correctName,
    isCorrect: true,
    recomputation: { method: "GROUND_TRUTH" },
    explanation: `${correctName} occupies the queried position.`,
  });

  for (const wrong of input.wrongCandidates) {
    if (!wrong.personId || wrong.personId === input.correctPersonId || chosen.has(wrong.personId)) continue;
    const display = personName.get(wrong.personId);
    if (!display) continue;
    chosen.set(wrong.personId, {
      semanticValue: wrong.personId,
      semanticFingerprint: semanticFingerprint(wrong.personId),
      display,
      isCorrect: false,
      misconceptionId: wrong.misconceptionId,
      recomputation: wrong.recomputation,
      explanation: wrong.explanation,
    });
    if (chosen.size === 4) break;
  }

  const fallbackIds = input.persons.map((person) => person.id).filter((id) => !chosen.has(id));
  const fallbackMisconceptions: SeatingMisconceptionId[] = [
    "SEA-MC-LIN-OFF_BY_ONE_SEAT",
    "SEA-MC-LIN-SUBJECT_REFERENCE_SWAPPED",
    "SEA-MC-LIN-MIRROR_POSITION",
  ];
  for (const id of fallbackIds) {
    if (chosen.size === 4) break;
    const display = personName.get(id) as string;
    const misconceptionId = fallbackMisconceptions[(chosen.size - 1) % fallbackMisconceptions.length] as SeatingMisconceptionId;
    chosen.set(id, {
      semanticValue: id,
      semanticFingerprint: semanticFingerprint(id),
      display,
      isCorrect: false,
      misconceptionId,
      recomputation: { method: "NEAREST_VALID_DISTRACTOR", personId: id },
      explanation: `${display} is a plausible nearby occupant, but not the person at the queried seat.`,
    });
  }

  if (chosen.size !== 4) throw new Error("Could not construct four semantically unique person options");
  const random = new DeterministicRandom(`${input.seed}:options`);
  const shuffled = random.shuffle([...chosen.values()]);
  const answerIndex = shuffled.findIndex((option) => option.isCorrect);
  if (answerIndex < 0 || answerIndex > 3) throw new Error("Correct option missing after shuffle");
  return { options: asTuple(shuffled), answerIndex: answerIndex as 0 | 1 | 2 | 3 };
}

export function buildCountOptions(input: {
  readonly correctCount: number;
  readonly seed: string;
}): { readonly options: [SeatingOption, SeatingOption, SeatingOption, SeatingOption]; readonly answerIndex: 0 | 1 | 2 | 3 } {
  const candidates: Array<{
    value: number;
    misconceptionId?: SeatingMisconceptionId;
    explanation: string;
    method: string;
  }> = [
    { value: input.correctCount, explanation: `${input.correctCount} persons lie strictly between the two endpoints.`, method: "GROUND_TRUTH" },
    { value: input.correctCount + 2, misconceptionId: "SEA-MC-LIN-COUNT_ENDPOINT_INCLUDED", explanation: "This counts both named endpoints as well as the persons between them.", method: "INCLUDE_BOTH_ENDPOINTS" },
    { value: input.correctCount + 1, misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", explanation: "This is one more than the number of intervening persons.", method: "ADD_ONE" },
    { value: Math.max(0, input.correctCount - 1), misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", explanation: "This is one less than the number of intervening persons.", method: "SUBTRACT_ONE" },
  ];
  const unique = new Map<number, typeof candidates[number]>();
  for (const candidate of candidates) unique.set(candidate.value, candidate);
  let filler = input.correctCount + 3;
  while (unique.size < 4) {
    unique.set(filler, { value: filler, misconceptionId: "SEA-MC-LIN-OFF_BY_ONE_SEAT", explanation: "This does not match the strict between-count.", method: "DISTANCE_SHIFT" });
    filler += 1;
  }
  const options = [...unique.values()].slice(0, 4).map<SeatingOption>((candidate) => ({
    semanticValue: candidate.value,
    semanticFingerprint: semanticFingerprint(candidate.value),
    display: String(candidate.value),
    isCorrect: candidate.value === input.correctCount,
    misconceptionId: candidate.misconceptionId,
    recomputation: { method: candidate.method, sourceCount: input.correctCount, produced: candidate.value },
    explanation: candidate.explanation,
  }));
  const shuffled = new DeterministicRandom(`${input.seed}:options`).shuffle(options);
  const answerIndex = shuffled.findIndex((option) => option.isCorrect);
  if (answerIndex < 0 || answerIndex > 3) throw new Error("Correct count option missing after shuffle");
  return { options: asTuple(shuffled), answerIndex: answerIndex as 0 | 1 | 2 | 3 };
}
