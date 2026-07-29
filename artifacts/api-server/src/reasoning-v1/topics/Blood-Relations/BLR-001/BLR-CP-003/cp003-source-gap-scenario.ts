import type { BlrCp003SourceGapScenario } from "./cp003-source-gap-types";

export const BLR_CP003_SOURCE_GAP_SCENARIO: BlrCp003SourceGapScenario = {
  scenarioId: "BLR-CP003-SCN-COMPACT-JOINT-PARENT-PASSAGE",
  topologyId: "COMPACT_JOINT_PARENT_PASSAGE",
  hiddenGraph: {
    persons: [
      { personId: "A", name: "A", gender: "MALE" },
      { personId: "B", name: "B", gender: "FEMALE" },
      { personId: "C", name: "C", gender: "MALE" },
      { personId: "D", name: "D", gender: "FEMALE" },
      { personId: "E", name: "E", gender: "FEMALE" },
      { personId: "F", name: "F", gender: "MALE" },
    ],
    parentEdges: [
      { parentId: "A", childId: "C" },
      { parentId: "B", childId: "C" },
      { parentId: "A", childId: "D" },
      { parentId: "B", childId: "D" },
      { parentId: "C", childId: "F" },
      { parentId: "E", childId: "F" },
    ],
    spouseEdges: [
      { personAId: "A", personBId: "B" },
      { personAId: "C", personBId: "E" },
    ],
    siblingEdges: [],
  },
  clues: [
    { subjectId: "A", relationId: "HUSBAND", referenceId: "B" },
    { subjectId: "C", relationId: "SON", referenceId: "A" },
    { subjectId: "C", relationId: "SON", referenceId: "B" },
    { subjectId: "D", relationId: "DAUGHTER", referenceId: "A" },
    { subjectId: "D", relationId: "DAUGHTER", referenceId: "B" },
    { subjectId: "E", relationId: "WIFE", referenceId: "C" },
    { subjectId: "F", relationId: "SON", referenceId: "C" },
    { subjectId: "F", relationId: "SON", referenceId: "E" },
  ],
  questions: [
    {
      kind: "IDENTIFY_PERSON_BY_GENDER",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER",
      gender: "MALE",
      candidatePersonIds: ["B", "C", "D", "E"],
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "B",
      referenceId: "F",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "A",
      referenceId: "F",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "A",
      referenceId: "D",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "B",
      referenceId: "D",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "E",
      referenceId: "A",
    },
    {
      kind: "RELATION",
      prototypeId: "BLR-CP003-PROT-SHARED-RELATION",
      subjectId: "E",
      referenceId: "F",
    },
    {
      kind: "MARRIED_PAIR",
      prototypeId: "BLR-CP003-PROT-SHARED-MARRIED-PAIR",
      personAId: "A",
      personBId: "B",
    },
  ],
};
