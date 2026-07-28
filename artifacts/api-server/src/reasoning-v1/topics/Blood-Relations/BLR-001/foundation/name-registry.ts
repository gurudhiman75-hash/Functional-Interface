import { SeededRandom } from "./prng";
import type { DirectRelationClue } from "./types";

const MALE_NAMES = [
  "Aman",
  "Bharat",
  "Charan",
  "Deepak",
  "Gagan",
  "Harjit",
  "Karan",
  "Manav",
  "Nitin",
  "Rohit",
  "Sahil",
  "Vikas",
] as const;

const FEMALE_NAMES = [
  "Asha",
  "Bhavna",
  "Divya",
  "Gurleen",
  "Isha",
  "Kavita",
  "Meena",
  "Neha",
  "Pooja",
  "Ritu",
  "Simran",
  "Tanya",
] as const;

export function inferredGenderByPerson(
  clues: readonly DirectRelationClue[],
): Map<string, "MALE" | "FEMALE"> {
  const result = new Map<string, "MALE" | "FEMALE">();

  const set = (
    personId: string,
    gender: "MALE" | "FEMALE",
    source: string,
  ): void => {
    const existing = result.get(personId);
    if (existing && existing !== gender) {
      throw new Error(`Contradictory gender for ${personId} in ${source}.`);
    }
    result.set(personId, gender);
  };

  for (const entry of clues) {
    const subjectGender = ["FATHER", "SON", "BROTHER", "HUSBAND"].includes(
      entry.relationId,
    )
      ? "MALE"
      : "FEMALE";
    set(entry.subjectId, subjectGender, entry.relationId);
    if (entry.relationId === "HUSBAND") {
      set(entry.referenceId, "FEMALE", entry.relationId);
    }
    if (entry.relationId === "WIFE") {
      set(entry.referenceId, "MALE", entry.relationId);
    }
  }

  return result;
}

export function assignNamesForClues(
  clues: readonly DirectRelationClue[],
  random: SeededRandom,
): Readonly<Record<string, string>> {
  const personIds = [
    ...new Set(clues.flatMap((entry) => [entry.subjectId, entry.referenceId])),
  ];
  const inferredGenders = inferredGenderByPerson(clues);
  const maleNames = random.shuffle(MALE_NAMES);
  const femaleNames = random.shuffle(FEMALE_NAMES);
  let maleIndex = 0;
  let femaleIndex = 0;
  let unknownAlternator = random.int(2);
  const names: Record<string, string> = {};

  for (const personId of personIds) {
    const inferred = inferredGenders.get(personId);
    const gender =
      inferred ?? (unknownAlternator++ % 2 === 0 ? "MALE" : "FEMALE");
    names[personId] =
      gender === "MALE" ? maleNames[maleIndex++]! : femaleNames[femaleIndex++]!;
  }

  return names;
}
