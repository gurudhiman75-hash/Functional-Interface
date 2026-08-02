import type { BlrGender } from "../foundation/types";
import {
  personName,
  type BlrCp005ModelSpace,
  type BlrCp005PrototypeId,
  type BlrCp005QuerySpec,
  type GeneratedBlrCp005Question,
} from "./cp005-model";

export const BLR_CP005_GENDER_EVIDENCE_VERSION =
  "BLR_CP005_EXPLICIT_GENDER_EVIDENCE_V1" as const;

interface BuiltCp005Case {
  modelSpace: BlrCp005ModelSpace;
  stem: string;
  querySpec: BlrCp005QuerySpec;
}

function possessive(name: string): string {
  return name.toLocaleLowerCase("en-IN").endsWith("s") ? `${name}'` : `${name}'s`;
}

function naturalList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

function existingIds(modelSpace: BlrCp005ModelSpace, ids: readonly string[]): string[] {
  return ids.filter((id) =>
    modelSpace.models.some((model) =>
      model.graph.persons.some((person) => person.personId === id),
    ),
  );
}

function overrideGenders(
  modelSpace: BlrCp005ModelSpace,
  overrides: Readonly<Record<string, BlrGender>>,
): BlrCp005ModelSpace {
  return {
    ...modelSpace,
    models: modelSpace.models.map((model) => ({
      ...model,
      graph: {
        ...model.graph,
        persons: model.graph.persons.map((person) => ({
          ...person,
          gender: overrides[person.personId] ?? person.gender,
        })),
      },
    })),
  };
}

export function applyCp005GenderEvidence<T extends BuiltCp005Case>(
  prototypeId: BlrCp005PrototypeId,
  built: T,
): T {
  const space = built.modelSpace;
  let sharedPrompt = space.sharedPrompt;
  let overrides: Readonly<Record<string, BlrGender>> = {};

  switch (space.scenarioId) {
    case "BLR-CP005-SCN-UNKNOWN-ONLY-CHILD-GENDER": {
      const father = personName(space, "F");
      const mother = personName(space, "M");
      const child = personName(space, "C");
      sharedPrompt = `${father} and ${mother} are married; ${father} is the husband and ${mother} is the wife. ${child} is their only child.`;
      break;
    }

    case "BLR-CP005-SCN-UNKNOWN-PARENT-SIDE": {
      const parent = personName(space, "P");
      const child = personName(space, "T");
      const uncle = personName(space, "U");
      sharedPrompt = `${parent} is a parent of ${child}. ${uncle} is ${possessive(parent)} brother.`;
      overrides = { T: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-OLD-WOMAN-POINTER": {
      const oldWoman = personName(space, "O");
      const speaker = personName(space, "A");
      sharedPrompt = `Pointing to ${oldWoman}, ${speaker} said, “Her daughter is my daughter's aunt.”`;
      overrides = { A: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-THREE-WAY-MALE-RELATIVE": {
      const subject = personName(space, "S");
      const reference = personName(space, "R");
      sharedPrompt = `${subject} may be ${possessive(reference)} brother, her sibling's son, or her spouse's father.`;
      overrides = { B: "UNKNOWN", H: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-BROTHER-IN-LAW-ROUTE-OPEN": {
      const subject = personName(space, "S");
      const reference = personName(space, "R");
      sharedPrompt = `${subject} is either the husband of ${possessive(reference)} sister or the brother of ${possessive(reference)} husband.`;
      overrides = { R: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-SPOUSE-ONE-OF-TWO":
    case "BLR-CP005-SCN-SPOUSE-ONE-OF-THREE": {
      const woman = personName(space, "W");
      const candidateIds = existingIds(space, ["C1", "C2", "C3"]);
      const candidates = candidateIds.map((id) => personName(space, id));
      const brotherIds = existingIds(space, ["O", "Q", "R"]);
      const brothers = brotherIds.map((id) => personName(space, id));
      const countWord = candidates.length === 2 ? "two" : "three";
      sharedPrompt = `${possessive(woman)} husband is exactly one of the ${countWord} men—${naturalList(candidates)}. ${naturalList(brothers)} are ${possessive(woman)} brothers.`;
      overrides = { W: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-FIXED-SPOUSE-OPEN-CHILD-GENDER": {
      const husband = personName(space, "H");
      const wife = personName(space, "W");
      const child = personName(space, "C");
      const brothers = ["O", "P", "B"].map((id) => personName(space, id));
      sharedPrompt = `${husband} is the husband of ${wife}. They have one child, ${child}. ${naturalList(brothers)} are ${possessive(husband)} brothers; none is ${possessive(wife)} spouse.`;
      overrides = { W: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-BOUNDED-CHILD-COUNT": {
      const firstParent = personName(space, "F");
      const secondParent = personName(space, "M");
      const knownChild = personName(space, "C1");
      sharedPrompt = `${firstParent} and ${secondParent} are married and have one, two or three children. ${knownChild} is one of them.`;
      overrides = { F: "UNKNOWN", M: "UNKNOWN", C1: "UNKNOWN", C2: "UNKNOWN", C3: "UNKNOWN" };
      break;
    }

    case "BLR-CP005-SCN-FIXED-TOTAL-OPEN-GENDER": {
      const father = personName(space, "F");
      const mother = personName(space, "M");
      const daughter = personName(space, "D");
      const child = personName(space, "C");
      sharedPrompt = `${father} and ${mother} are married; ${father} is the husband and ${mother} is the wife. ${daughter} is their daughter, and ${child} is their other child. These four are the only named family members.`;
      break;
    }

    default:
      throw new Error(`${prototypeId} uses an unaudited CP-005 gender-evidence scenario: ${space.scenarioId}.`);
  }

  return {
    ...built,
    modelSpace: {
      ...overrideGenders(space, overrides),
      sharedPrompt,
    },
  };
}

function nodeGenders(
  question: GeneratedBlrCp005Question,
  personId: string,
): Set<"male" | "female" | "unknown"> {
  return new Set(
    question.explanation.familyTrees
      .flatMap((tree) => tree.nodes)
      .filter((node) => node.id === personId)
      .map((node) => node.gender),
  );
}

function sameSet<T>(actual: Set<T>, expected: readonly T[]): boolean {
  return actual.size === expected.length && expected.every((value) => actual.has(value));
}

export function cp005GenderEvidenceIssues(
  question: GeneratedBlrCp005Question,
): readonly string[] {
  const issues: string[] = [];
  const prompt = question.sharedPrompt;
  const nodeName = (id: string) =>
    question.explanation.familyTrees
      .flatMap((tree) => tree.nodes)
      .find((node) => node.id === id)?.label ?? id;
  const expectGender = (
    id: string,
    expected: readonly ("male" | "female" | "unknown")[],
  ) => {
    const actual = nodeGenders(question, id);
    if (!sameSet(actual, expected)) {
      issues.push(`${id} has genders {${[...actual].join(",")}}, expected {${expected.join(",")}}.`);
    }
  };
  const expectText = (fragment: string) => {
    if (!prompt.includes(fragment)) issues.push(`Missing explicit clue: ${fragment}`);
  };

  switch (question.scenarioId) {
    case "BLR-CP005-SCN-UNKNOWN-ONLY-CHILD-GENDER":
      expectGender("F", ["male"]);
      expectGender("M", ["female"]);
      expectGender("C", ["male", "female"]);
      expectText(`${nodeName("F")} is the husband`);
      expectText(`${nodeName("M")} is the wife`);
      break;

    case "BLR-CP005-SCN-UNKNOWN-PARENT-SIDE":
      expectGender("P", ["male", "female"]);
      expectGender("U", ["male"]);
      expectGender("T", ["unknown"]);
      expectText(`${nodeName("U")} is ${possessive(nodeName("P"))} brother`);
      break;

    case "BLR-CP005-SCN-OLD-WOMAN-POINTER":
      expectGender("O", ["female"]);
      expectGender("A", ["unknown"]);
      expectGender("D", ["female"]);
      expectGender("X", ["female"]);
      expectText("Her daughter");
      expectText("daughter's aunt");
      break;

    case "BLR-CP005-SCN-THREE-WAY-MALE-RELATIVE":
      expectGender("S", ["male"]);
      expectGender("R", ["female"]);
      expectGender("B", ["unknown"]);
      expectGender("H", ["unknown"]);
      expectText("brother");
      expectText("son");
      expectText("father");
      break;

    case "BLR-CP005-SCN-BROTHER-IN-LAW-ROUTE-OPEN":
      expectGender("S", ["male"]);
      expectGender("R", ["unknown"]);
      expectGender("X", ["female"]);
      expectGender("H", ["male"]);
      expectText("husband");
      expectText("sister");
      expectText("brother");
      break;

    case "BLR-CP005-SCN-SPOUSE-ONE-OF-TWO":
    case "BLR-CP005-SCN-SPOUSE-ONE-OF-THREE":
      expectGender("W", ["unknown"]);
      for (const id of ["C1", "C2", "C3", "O", "Q", "R"]) {
        if (nodeGenders(question, id).size) expectGender(id, ["male"]);
      }
      expectText("men—");
      expectText(`${possessive(nodeName("W"))} brothers`);
      break;

    case "BLR-CP005-SCN-FIXED-SPOUSE-OPEN-CHILD-GENDER":
      expectGender("H", ["male"]);
      expectGender("W", ["unknown"]);
      expectGender("C", ["male", "female"]);
      for (const id of ["O", "P", "B"]) expectGender(id, ["male"]);
      expectText(`${nodeName("H")} is the husband`);
      expectText(`${possessive(nodeName("H"))} brothers`);
      break;

    case "BLR-CP005-SCN-BOUNDED-CHILD-COUNT":
      for (const id of ["F", "M", "C1", "C2", "C3"]) {
        if (nodeGenders(question, id).size) expectGender(id, ["unknown"]);
      }
      break;

    case "BLR-CP005-SCN-FIXED-TOTAL-OPEN-GENDER":
      expectGender("F", ["male"]);
      expectGender("M", ["female"]);
      expectGender("D", ["female"]);
      expectGender("C", ["male", "female"]);
      expectText(`${nodeName("F")} is the husband`);
      expectText(`${nodeName("M")} is the wife`);
      expectText(`${nodeName("D")} is their daughter`);
      break;

    default:
      issues.push(`Unaudited scenario ${question.scenarioId}.`);
  }

  return issues;
}
