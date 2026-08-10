import type { BlrCp003ExtendedScenario } from "./cp003-extended-types";

export const BLR_CP003_EXTENDED_SCENARIO: BlrCp003ExtendedScenario = {
  scenarioId: "BLR-CP003-SCN-SIBLING-SET-BRANCH",
  topologyId: "SIBLING_SET_BRANCH",
  hiddenGraph: {
    persons: [
      { personId: "A", name: "A", gender: "MALE" },
      { personId: "B", name: "B", gender: "FEMALE" },
      { personId: "C", name: "C", gender: "MALE" },
      { personId: "D", name: "D", gender: "MALE" },
      { personId: "E", name: "E", gender: "FEMALE" },
      { personId: "F", name: "F", gender: "FEMALE" },
      { personId: "G", name: "G", gender: "FEMALE" },
    ],
    parentEdges: [
      { parentId: "A", childId: "C" },
      { parentId: "A", childId: "D" },
      { parentId: "A", childId: "E" },
      { parentId: "C", childId: "G" },
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
    { subjectId: "D", relationId: "SON", referenceId: "A" },
    { subjectId: "E", relationId: "DAUGHTER", referenceId: "A" },
    { subjectId: "F", relationId: "WIFE", referenceId: "C" },
    { subjectId: "G", relationId: "DAUGHTER", referenceId: "C" },
  ],
  questions: [
    {
      kind: "IDENTIFY_PERSON",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON",
      relationId: "WIFE",
      referenceId: "A",
    },
    {
      kind: "IDENTIFY_PERSON",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON",
      relationId: "FATHER_IN_LAW",
      referenceId: "F",
    },
    {
      kind: "IDENTIFY_PERSON",
      prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-PERSON",
      relationId: "DAUGHTER",
      referenceId: "A",
    },
    {
      kind: "SIBLING_PAIR",
      prototypeId: "BLR-CP003-PROT-SHARED-SIBLING-PAIR",
      personAId: "C",
      personBId: "D",
    },
    {
      kind: "PARENT_CHILD_PAIR",
      prototypeId: "BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR",
      parentId: "C",
      childId: "G",
    },
    {
      kind: "FALSE_CLAIM",
      prototypeId: "BLR-CP003-PROT-SHARED-FALSE-CLAIM",
      subjectId: "A",
      falseRelationId: "UNCLE",
      referenceId: "G",
    },
    {
      kind: "MEMBER_SET",
      prototypeId: "BLR-CP003-PROT-SHARED-MEMBER-SET",
      relationId: "SON",
      referenceId: "A",
    },
  ],
};
