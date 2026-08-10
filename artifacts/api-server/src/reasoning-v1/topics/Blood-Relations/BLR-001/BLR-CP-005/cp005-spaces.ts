import type { FamilyGraph, FamilyPerson } from "../foundation/types";
import {
  enumerateModelSpace,
  type BlrCp005Authority,
  type BlrCp005ModelSpace,
  type BlrCp005PrototypeId,
  type BlrCp005QuerySpec,
} from "./cp005-model";

const MALE_NAMES = ["Arjun", "Rohit", "Harjit", "Manav", "Karan", "Sahil", "Dev", "Aman", "Vikas", "Deepak", "Gagan", "Bharat"] as const;
const FEMALE_NAMES = ["Meera", "Ritu", "Gurleen", "Asha", "Simran", "Pooja", "Kavita", "Nisha", "Tanya", "Bhavna", "Isha", "Anita"] as const;
const NEUTRAL_NAMES = ["Kiran", "Gurpreet", "Harpreet", "Jaspreet", "Manpreet", "Navjot", "Simar", "Mandeep"] as const;

function namePicker(seed: number) {
  const normalized = ((Math.trunc(seed) % 100000) + 100000) % 100000;
  return {
    male: (index: number) => MALE_NAMES[(normalized + index) % MALE_NAMES.length]!,
    female: (index: number) => FEMALE_NAMES[(normalized * 5 + index) % FEMALE_NAMES.length]!,
    neutral: (index: number) => NEUTRAL_NAMES[(normalized * 3 + index) % NEUTRAL_NAMES.length]!,
  };
}

function graph(input: {
  persons: readonly FamilyPerson[];
  parents?: readonly [string, string][];
  spouses?: readonly [string, string][];
  siblings?: readonly [string, string][];
}): FamilyGraph {
  return {
    persons: input.persons,
    parentEdges: (input.parents ?? []).map(([parentId, childId]) => ({ parentId, childId })),
    spouseEdges: (input.spouses ?? []).map(([personAId, personBId]) => ({ personAId, personBId })),
    siblingEdges: (input.siblings ?? []).map(([personAId, personBId]) => ({ personAId, personBId })),
  };
}

export function childGenderSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed);
  const father = names.male(0);
  const mother = names.female(0);
  const child = names.neutral(0);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-UNKNOWN-ONLY-CHILD-GENDER",
    topologyId: "TWO-PARENT-ONE-CHILD-GENDER-OPEN",
    groupKey: `UNKNOWN-ONLY-CHILD-GENDER::${seed}`,
    sharedPrompt: `${father} and ${mother} are married. ${child} is their only child. The gender of ${child} is not stated.`,
    variables: [{ variableId: "childGender", values: ["MALE", "FEMALE"] }],
    buildGraph: (assignment) => graph({
      persons: [
        { personId: "F", name: father, gender: "MALE" },
        { personId: "M", name: mother, gender: "FEMALE" },
        { personId: "C", name: child, gender: assignment.childGender as "MALE" | "FEMALE" },
      ],
      spouses: [["F", "M"]],
      parents: [["F", "C"], ["M", "C"]],
    }),
  });
}

export function parentSideSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 101);
  const parent = names.neutral(0);
  const uncle = names.male(0);
  const child = names.female(0);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-UNKNOWN-PARENT-SIDE",
    topologyId: "PARENT-SIBLING-CHILD-SIDE-OPEN",
    groupKey: `UNKNOWN-PARENT-SIDE::${seed}`,
    sharedPrompt: `${parent} is a parent of ${child}. ${uncle} is the brother of ${parent}. Nothing states whether ${parent} is ${child}'s father or mother.`,
    variables: [{ variableId: "parentGender", values: ["MALE", "FEMALE"] }],
    buildGraph: (assignment) => graph({
      persons: [
        { personId: "P", name: parent, gender: assignment.parentGender as "MALE" | "FEMALE" },
        { personId: "U", name: uncle, gender: "MALE" },
        { personId: "T", name: child, gender: "FEMALE" },
      ],
      parents: [["P", "T"]],
      siblings: [["P", "U"]],
    }),
  });
}

export function oldWomanSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 211);
  const anita = names.female(0);
  const oldWoman = names.female(1);
  const daughter = names.female(2);
  const aunt = names.female(3);
  const husband = names.male(0);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-OLD-WOMAN-POINTER",
    topologyId: "POINTER-MOTHER-OR-MOTHER-IN-LAW",
    groupKey: `OLD-WOMAN-POINTER::${seed}`,
    sharedPrompt: `Pointing to ${oldWoman}, ${anita} said, “Her daughter is my daughter's aunt.” No other family relation is given.`,
    variables: [{ variableId: "auntRoute", values: ["SPEAKER_SISTER", "HUSBAND_SISTER"] }],
    buildGraph: (assignment) => assignment.auntRoute === "SPEAKER_SISTER"
      ? graph({
          persons: [
            { personId: "O", name: oldWoman, gender: "FEMALE" },
            { personId: "A", name: anita, gender: "FEMALE" },
            { personId: "D", name: daughter, gender: "FEMALE" },
            { personId: "X", name: aunt, gender: "FEMALE" },
          ],
          parents: [["O", "A"], ["O", "X"], ["A", "D"]],
          siblings: [["A", "X"]],
        })
      : graph({
          persons: [
            { personId: "O", name: oldWoman, gender: "FEMALE" },
            { personId: "A", name: anita, gender: "FEMALE" },
            { personId: "D", name: daughter, gender: "FEMALE" },
            { personId: "X", name: aunt, gender: "FEMALE" },
            { personId: "H", name: husband, gender: "MALE" },
          ],
          parents: [["O", "H"], ["O", "X"], ["A", "D"]],
          siblings: [["H", "X"]],
          spouses: [["H", "A"]],
        }),
  });
}

export function threeWayRelationSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 307);
  const reference = names.female(0);
  const subject = names.male(0);
  const sibling = names.female(1);
  const spouse = names.male(1);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-THREE-WAY-MALE-RELATIVE",
    topologyId: "EXPLICIT-THREE-MODEL-RELATION-SPACE",
    groupKey: `THREE-WAY-MALE-RELATIVE::${seed}`,
    sharedPrompt: `The available clues establish only that ${subject} is a male family member of ${reference}. He may be ${reference}'s brother, her sibling's son, or her spouse's father. No clue distinguishes these three structures.`,
    variables: [{ variableId: "role", values: ["BROTHER", "NEPHEW", "FATHER_IN_LAW"] }],
    buildGraph: (assignment) => {
      if (assignment.role === "BROTHER") {
        return graph({ persons: [
          { personId: "R", name: reference, gender: "FEMALE" },
          { personId: "S", name: subject, gender: "MALE" },
        ], siblings: [["R", "S"]] });
      }
      if (assignment.role === "NEPHEW") {
        return graph({ persons: [
          { personId: "R", name: reference, gender: "FEMALE" },
          { personId: "S", name: subject, gender: "MALE" },
          { personId: "B", name: sibling, gender: "FEMALE" },
        ], siblings: [["R", "B"]], parents: [["B", "S"]] });
      }
      return graph({ persons: [
        { personId: "R", name: reference, gender: "FEMALE" },
        { personId: "S", name: subject, gender: "MALE" },
        { personId: "H", name: spouse, gender: "MALE" },
      ], spouses: [["R", "H"]], parents: [["S", "H"]] });
    },
  });
}

export function affinalRouteSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 401);
  const reference = names.female(0);
  const subject = names.male(0);
  const sister = names.female(1);
  const husband = names.male(1);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-BROTHER-IN-LAW-ROUTE-OPEN",
    topologyId: "AFFINAL-PATH-ALTERNATIVE",
    groupKey: `BROTHER-IN-LAW-ROUTE-OPEN::${seed}`,
    sharedPrompt: `${subject} is either the husband of ${reference}'s sister or the brother of ${reference}'s husband. The available clues do not identify which route applies.`,
    variables: [{ variableId: "affinalRoute", values: ["SISTERS_HUSBAND", "HUSBANDS_BROTHER"] }],
    buildGraph: (assignment) => assignment.affinalRoute === "SISTERS_HUSBAND"
      ? graph({ persons: [
          { personId: "R", name: reference, gender: "FEMALE" },
          { personId: "S", name: subject, gender: "MALE" },
          { personId: "X", name: sister, gender: "FEMALE" },
        ], siblings: [["R", "X"]], spouses: [["S", "X"]] })
      : graph({ persons: [
          { personId: "R", name: reference, gender: "FEMALE" },
          { personId: "S", name: subject, gender: "MALE" },
          { personId: "H", name: husband, gender: "MALE" },
        ], siblings: [["S", "H"]], spouses: [["H", "R"]] }),
  });
}

export function spouseIdentitySpace(seed: number, candidateCount: 2 | 3): BlrCp005ModelSpace {
  const names = namePicker(seed + candidateCount * 503);
  const woman = names.female(0);
  const candidates = [names.male(0), names.male(1), names.male(2)];
  const excludedRelatives = [names.male(4), names.male(5), names.male(6)];
  const values = candidates.slice(0, candidateCount).map((_, index) => `C${index + 1}`);
  return enumerateModelSpace({
    scenarioId: candidateCount === 2 ? "BLR-CP005-SCN-SPOUSE-ONE-OF-TWO" : "BLR-CP005-SCN-SPOUSE-ONE-OF-THREE",
    topologyId: candidateCount === 2 ? "TWO-CANDIDATE-SPOUSE" : "THREE-CANDIDATE-SPOUSE",
    groupKey: `${candidateCount === 2 ? "SPOUSE-ONE-OF-TWO" : "SPOUSE-ONE-OF-THREE"}::${seed}`,
    sharedPrompt: `${woman} is married to one of ${candidates.slice(0, candidateCount).join(candidateCount === 2 ? " and " : ", ")}. The available information does not identify which one.`,
    variables: [{ variableId: "husbandId", values }],
    buildGraph: (assignment) => graph({
      persons: [
        { personId: "W", name: woman, gender: "FEMALE" },
        ...candidates.slice(0, candidateCount).map((name, index) => ({ personId: `C${index + 1}`, name, gender: "MALE" as const })),
        { personId: "O", name: excludedRelatives[0]!, gender: "MALE" },
        { personId: "Q", name: excludedRelatives[1]!, gender: "MALE" },
        { personId: "R", name: excludedRelatives[2]!, gender: "MALE" },
      ],
      spouses: [[assignment.husbandId!, "W"]],
      siblings: candidateCount === 2
        ? [["C1", "C2"], ["W", "O"], ["W", "Q"], ["W", "R"]]
        : [["C1", "C2"], ["C2", "C3"], ["W", "O"], ["W", "Q"], ["W", "R"]],
    }),
  });
}

export function fixedSpouseOpenChildSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 607);
  const wife = names.female(0);
  const husband = names.male(0);
  const child = names.neutral(0);
  const relatives = [names.male(2), names.male(3), names.male(4)];
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-FIXED-SPOUSE-OPEN-CHILD-GENDER",
    topologyId: "FIXED-SPOUSE-IRRELEVANT-UNCERTAINTY",
    groupKey: `FIXED-SPOUSE-OPEN-CHILD-GENDER::${seed}`,
    sharedPrompt: `${husband} is the husband of ${wife}. They have one child, ${child}, whose gender is not stated. ${relatives.join(", ")} are other named male relatives; none of them is ${wife}'s spouse.`,
    variables: [{ variableId: "childGender", values: ["MALE", "FEMALE"] }],
    buildGraph: (assignment) => graph({
      persons: [
        { personId: "H", name: husband, gender: "MALE" },
        { personId: "W", name: wife, gender: "FEMALE" },
        { personId: "C", name: child, gender: assignment.childGender as "MALE" | "FEMALE" },
        { personId: "O", name: relatives[0]!, gender: "MALE" },
        { personId: "P", name: relatives[1]!, gender: "MALE" },
        { personId: "B", name: relatives[2]!, gender: "MALE" },
      ],
      spouses: [["H", "W"]],
      parents: [["H", "C"], ["W", "C"]],
      siblings: [["H", "O"], ["H", "P"], ["H", "B"]],
    }),
  });
}

export function optionalChildrenSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 701);
  const father = names.male(0);
  const mother = names.female(0);
  const first = names.female(1);
  const second = names.neutral(0);
  const third = names.neutral(1);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-BOUNDED-CHILD-COUNT",
    topologyId: "ONE-TO-THREE-CHILDREN",
    groupKey: `BOUNDED-CHILD-COUNT::${seed}`,
    sharedPrompt: `${father} and ${mother} are married and have at least one but no more than three children. ${first} is definitely one of their children; the exact number of additional children is not stated.`,
    variables: [{ variableId: "childCount", values: ["1", "2", "3"] }],
    buildGraph: (assignment) => {
      const count = Number(assignment.childCount);
      const allChildren: FamilyPerson[] = [
        { personId: "C1", name: first, gender: "FEMALE" },
        { personId: "C2", name: second, gender: "MALE" },
        { personId: "C3", name: third, gender: "FEMALE" },
      ];
      const childPeople = allChildren.slice(0, count);
      return graph({
        persons: [
          { personId: "F", name: father, gender: "MALE" },
          { personId: "M", name: mother, gender: "FEMALE" },
          ...childPeople,
        ],
        spouses: [["F", "M"]],
        parents: childPeople.flatMap((person) => [["F", person.personId], ["M", person.personId]] as [string, string][]),
      });
    },
  });
}

export function fixedTotalVariableGenderSpace(seed: number): BlrCp005ModelSpace {
  const names = namePicker(seed + 809);
  const father = names.male(0);
  const mother = names.female(0);
  const daughter = names.female(1);
  const child = names.neutral(0);
  return enumerateModelSpace({
    scenarioId: "BLR-CP005-SCN-FIXED-TOTAL-OPEN-GENDER",
    topologyId: "FOUR-MEMBERS-ONE-GENDER-OPEN",
    groupKey: `FIXED-TOTAL-OPEN-GENDER::${seed}`,
    sharedPrompt: `${father} and ${mother} are married. ${daughter} is their daughter, and ${child} is their other child. The gender of ${child} is not stated. No other family member is included in this question.`,
    variables: [{ variableId: "secondChildGender", values: ["MALE", "FEMALE"] }],
    buildGraph: (assignment) => graph({
      persons: [
        { personId: "F", name: father, gender: "MALE" },
        { personId: "M", name: mother, gender: "FEMALE" },
        { personId: "D", name: daughter, gender: "FEMALE" },
        { personId: "C", name: child, gender: assignment.secondChildGender as "MALE" | "FEMALE" },
      ],
      spouses: [["F", "M"]],
      parents: [["F", "D"], ["M", "D"], ["F", "C"], ["M", "C"]],
    }),
  });
}
