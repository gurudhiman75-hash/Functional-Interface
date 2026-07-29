import type { BlrCp003MaritalScenario } from "./cp003-marital-types";

export const BLR_CP003_MARITAL_SCENARIO: BlrCp003MaritalScenario = {
  scenarioId: "BLR-CP003-SCN-EXPLICIT-UNMARRIED-BRANCH",
  topologyId: "EXPLICIT_UNMARRIED_BRANCH",
  hiddenGraph: {
    persons: [
      { personId: "A", name: "A", gender: "MALE" },
      { personId: "B", name: "B", gender: "FEMALE" },
      { personId: "C", name: "C", gender: "MALE" },
      { personId: "D", name: "D", gender: "FEMALE" },
      { personId: "E", name: "E", gender: "MALE" },
      { personId: "F", name: "F", gender: "FEMALE" },
      { personId: "G", name: "G", gender: "FEMALE" },
      { personId: "H", name: "H", gender: "MALE" },
    ],
    parentEdges: [
      { parentId: "A", childId: "C" },
      { parentId: "A", childId: "D" },
      { parentId: "A", childId: "E" },
      { parentId: "C", childId: "G" },
      { parentId: "D", childId: "H" },
    ],
    spouseEdges: [
      { personAId: "A", personBId: "B" },
      { personAId: "C", personBId: "F" },
    ],
    siblingEdges: [],
  },
  clues: [
    { subjectId: "A", relationId: "HUSBAND", referenceId: "B" },
    { subjectId: "C", relationId: "SON", referenceId: "A" },
    { subjectId: "D", relationId: "DAUGHTER", referenceId: "A" },
    { subjectId: "E", relationId: "SON", referenceId: "A" },
    { subjectId: "F", relationId: "WIFE", referenceId: "C" },
    { subjectId: "G", relationId: "DAUGHTER", referenceId: "C" },
    { subjectId: "H", relationId: "SON", referenceId: "D" },
  ],
  maritalFacts: [
    {
      personId: "E",
      status: "UNMARRIED",
      evidence: "EXPLICIT_STATEMENT",
    },
  ],
  questions: [
    {
      kind: "MARITAL_STATUS",
      prototypeId: "BLR-CP003-PROT-SHARED-MARITAL-STATUS",
      personId: "E",
    },
    {
      kind: "IDENTIFY_BY_MARITAL_STATUS",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS",
      status: "UNMARRIED",
    },
    {
      kind: "MARITAL_STATUS",
      prototypeId: "BLR-CP003-PROT-SHARED-MARITAL-STATUS",
      personId: "B",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "F",
      referenceId: "A",
    },
    {
      kind: "SIBLING_PAIR",
      prototypeId: "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
      personAId: "D",
      personBId: "E",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "H",
      referenceId: "G",
    },
  ],
};
