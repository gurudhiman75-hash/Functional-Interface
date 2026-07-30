import type { BlrGender, FamilyGraph } from "../foundation/types";
import type { BlrCp003ScenarioTemplate } from "./cp003-types";

function hiddenFamily(
  genders: Readonly<Record<string, Exclude<BlrGender, "UNKNOWN">>>,
  parentEdges: readonly { parentId: string; childId: string }[],
  spouseEdges: readonly { personAId: string; personBId: string }[],
): FamilyGraph {
  return {
    persons: Object.entries(genders).map(([personId, gender]) => ({
      personId,
      name: personId,
      gender,
    })),
    parentEdges,
    spouseEdges,
    siblingEdges: [],
  };
}

export const BLR_CP003_SCENARIOS: readonly BlrCp003ScenarioTemplate[] = [
  {
    scenarioId: "BLR-CP003-SCN-THREE-GENERATION-TWO-BRANCH",
    topologyId: "THREE_GENERATION_TWO_BRANCH",
    hiddenGraph: hiddenFamily(
      {
        A: "MALE",
        B: "FEMALE",
        C: "MALE",
        D: "FEMALE",
        E: "FEMALE",
        F: "MALE",
        G: "FEMALE",
      },
      [
        { parentId: "A", childId: "C" },
        { parentId: "A", childId: "D" },
        { parentId: "C", childId: "F" },
        { parentId: "D", childId: "G" },
      ],
      [
        { personAId: "A", personBId: "B" },
        { personAId: "C", personBId: "E" },
      ],
    ),
    clues: [
      { subjectId: "A", relationId: "HUSBAND", referenceId: "B" },
      { subjectId: "C", relationId: "SON", referenceId: "A" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "A" },
      { subjectId: "E", relationId: "WIFE", referenceId: "C" },
      { subjectId: "F", relationId: "SON", referenceId: "C" },
      { subjectId: "G", relationId: "DAUGHTER", referenceId: "D" },
    ],
    questions: [
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "D",
        referenceId: "F",
      },
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "F",
        referenceId: "G",
      },
      {
        kind: "MARRIED_PAIR",
        prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
        personAId: "A",
        personBId: "B",
      },
      {
        kind: "GENDER",
        prototypeId: "BLR-CP003-PROT-SHARED-GENDER",
        personId: "E",
      },
      {
        kind: "GENERATION",
        prototypeId: "BLR-CP003-PROT-SHARED-GENERATION",
        subjectId: "F",
        referenceId: "G",
      },
      {
        kind: "TRUE_CLAIM",
        prototypeId: "BLR-CP003-PROT-SHARED-TRUE-CLAIM",
        subjectId: "A",
        referenceId: "F",
      },
    ],
  },
  {
    scenarioId: "BLR-CP003-SCN-AFFINAL-CHILD-BRANCH",
    topologyId: "AFFINAL_CHILD_BRANCH",
    hiddenGraph: hiddenFamily(
      {
        A: "MALE",
        B: "FEMALE",
        C: "FEMALE",
        D: "MALE",
        E: "MALE",
        F: "MALE",
      },
      [
        { parentId: "A", childId: "C" },
        { parentId: "A", childId: "D" },
        { parentId: "C", childId: "F" },
      ],
      [
        { personAId: "A", personBId: "B" },
        { personAId: "C", personBId: "E" },
      ],
    ),
    clues: [
      { subjectId: "A", relationId: "HUSBAND", referenceId: "B" },
      { subjectId: "C", relationId: "DAUGHTER", referenceId: "A" },
      { subjectId: "D", relationId: "SON", referenceId: "A" },
      { subjectId: "E", relationId: "HUSBAND", referenceId: "C" },
      { subjectId: "F", relationId: "SON", referenceId: "C" },
    ],
    questions: [
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "E",
        referenceId: "A",
      },
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "D",
        referenceId: "E",
      },
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "A",
        referenceId: "F",
      },
      {
        kind: "MARRIED_PAIR",
        prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
        personAId: "C",
        personBId: "E",
      },
      {
        kind: "GENDER",
        prototypeId: "BLR-CP003-PROT-SHARED-GENDER",
        personId: "B",
      },
      {
        kind: "GENERATION",
        prototypeId: "BLR-CP003-PROT-SHARED-GENERATION",
        subjectId: "C",
        referenceId: "D",
      },
      {
        kind: "TRUE_CLAIM",
        prototypeId: "BLR-CP003-PROT-SHARED-TRUE-CLAIM",
        subjectId: "A",
        referenceId: "E",
      },
    ],
  },
  {
    scenarioId: "BLR-CP003-SCN-TWO-COUPLE-COUSIN-BRANCH",
    topologyId: "TWO_COUPLE_COUSIN_BRANCH",
    hiddenGraph: hiddenFamily(
      {
        A: "MALE",
        B: "FEMALE",
        C: "FEMALE",
        D: "MALE",
        E: "MALE",
        F: "FEMALE",
        G: "FEMALE",
        H: "MALE",
      },
      [
        { parentId: "A", childId: "C" },
        { parentId: "A", childId: "D" },
        { parentId: "C", childId: "F" },
        { parentId: "D", childId: "H" },
      ],
      [
        { personAId: "A", personBId: "B" },
        { personAId: "C", personBId: "E" },
        { personAId: "D", personBId: "G" },
      ],
    ),
    clues: [
      { subjectId: "A", relationId: "HUSBAND", referenceId: "B" },
      { subjectId: "C", relationId: "DAUGHTER", referenceId: "A" },
      { subjectId: "D", relationId: "SON", referenceId: "A" },
      { subjectId: "E", relationId: "HUSBAND", referenceId: "C" },
      { subjectId: "F", relationId: "DAUGHTER", referenceId: "C" },
      { subjectId: "G", relationId: "WIFE", referenceId: "D" },
      { subjectId: "H", relationId: "SON", referenceId: "D" },
    ],
    questions: [
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "C",
        referenceId: "H",
      },
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "D",
        referenceId: "F",
      },
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
        subjectId: "F",
        referenceId: "H",
      },
      {
        kind: "MARRIED_PAIR",
        prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
        personAId: "D",
        personBId: "G",
      },
      {
        kind: "GENDER",
        prototypeId: "BLR-CP003-PROT-SHARED-GENDER",
        personId: "B",
      },
      {
        kind: "GENERATION",
        prototypeId: "BLR-CP003-PROT-SHARED-GENERATION",
        subjectId: "E",
        referenceId: "D",
      },
    ],
  },
] as const;

export function getBlrCp003Scenario(scenarioId: string): BlrCp003ScenarioTemplate {
  const scenario = BLR_CP003_SCENARIOS.find((entry) => entry.scenarioId === scenarioId);
  if (!scenario) throw new Error(`Unknown BLR-CP-003 scenario '${scenarioId}'.`);
  return scenario;
}
