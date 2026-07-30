import type { BlrCp003LineageScenario } from "./cp003-lineage-types";

export const BLR_CP003_LINEAGE_SCENARIOS: readonly BlrCp003LineageScenario[] = [
  {
    scenarioId: "BLR-CP003-SCN-DUAL-MATERNAL-PATERNAL-BRANCH",
    topologyId: "DUAL_MATERNAL_PATERNAL_BRANCH",
    displayRootId: "C",
    hiddenGraph: {
      persons: [
        { personId: "P", name: "P", gender: "MALE" },
        { personId: "Q", name: "Q", gender: "FEMALE" },
        { personId: "R", name: "R", gender: "MALE" },
        { personId: "S", name: "S", gender: "FEMALE" },
        { personId: "M", name: "M", gender: "MALE" },
        { personId: "N", name: "N", gender: "FEMALE" },
        { personId: "T", name: "T", gender: "FEMALE" },
        { personId: "U", name: "U", gender: "MALE" },
        { personId: "C", name: "C", gender: "MALE" },
      ],
      parentEdges: [
        { parentId: "P", childId: "R" },
        { parentId: "Q", childId: "R" },
        { parentId: "P", childId: "S" },
        { parentId: "M", childId: "T" },
        { parentId: "N", childId: "T" },
        { parentId: "M", childId: "U" },
        { parentId: "R", childId: "C" },
        { parentId: "T", childId: "C" },
      ],
      spouseEdges: [],
      siblingEdges: [],
    },
    clues: [
      { subjectId: "P", relationId: "FATHER", referenceId: "R" },
      { subjectId: "Q", relationId: "MOTHER", referenceId: "R" },
      { subjectId: "S", relationId: "DAUGHTER", referenceId: "P" },
      { subjectId: "M", relationId: "FATHER", referenceId: "T" },
      { subjectId: "N", relationId: "MOTHER", referenceId: "T" },
      { subjectId: "U", relationId: "SON", referenceId: "M" },
      { subjectId: "R", relationId: "FATHER", referenceId: "C" },
      { subjectId: "T", relationId: "MOTHER", referenceId: "C" },
    ],
    questions: [
      {
        kind: "EXACT_LINEAGE",
        prototypeId: "BLR-CP003-PROT-SHARED-EXACT-LINEAGE",
        subjectId: "P",
        referenceId: "C",
      },
      {
        kind: "EXACT_LINEAGE",
        prototypeId: "BLR-CP003-PROT-SHARED-EXACT-LINEAGE",
        subjectId: "Q",
        referenceId: "C",
      },
      {
        kind: "EXACT_LINEAGE",
        prototypeId: "BLR-CP003-PROT-SHARED-EXACT-LINEAGE",
        subjectId: "M",
        referenceId: "C",
      },
      {
        kind: "EXACT_LINEAGE",
        prototypeId: "BLR-CP003-PROT-SHARED-EXACT-LINEAGE",
        subjectId: "N",
        referenceId: "C",
      },
      {
        kind: "IDENTIFY_BY_EXACT_LINEAGE",
        prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE",
        exactRelationId: "PATERNAL_AUNT",
        referenceId: "C",
      },
      {
        kind: "IDENTIFY_BY_EXACT_LINEAGE",
        prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE",
        exactRelationId: "MATERNAL_UNCLE",
        referenceId: "C",
      },
    ],
  },
  {
    scenarioId: "BLR-CP003-SCN-FOUR-GENERATION-DIRECT-LINE",
    topologyId: "FOUR_GENERATION_DIRECT_LINE",
    displayRootId: "D",
    hiddenGraph: {
      persons: [
        { personId: "A", name: "A", gender: "MALE" },
        { personId: "B", name: "B", gender: "MALE" },
        { personId: "C", name: "C", gender: "FEMALE" },
        { personId: "D", name: "D", gender: "FEMALE" },
      ],
      parentEdges: [
        { parentId: "A", childId: "B" },
        { parentId: "B", childId: "C" },
        { parentId: "C", childId: "D" },
      ],
      spouseEdges: [],
      siblingEdges: [],
    },
    clues: [
      { subjectId: "A", relationId: "FATHER", referenceId: "B" },
      { subjectId: "B", relationId: "FATHER", referenceId: "C" },
      { subjectId: "C", relationId: "MOTHER", referenceId: "D" },
      { subjectId: "D", relationId: "DAUGHTER", referenceId: "C" },
    ],
    questions: [
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-GREAT-RELATION",
        subjectId: "A",
        referenceId: "D",
      },
      {
        kind: "RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-GREAT-RELATION",
        subjectId: "D",
        referenceId: "A",
      },
      {
        kind: "IDENTIFY_BY_RELATION",
        prototypeId: "BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION",
        relationId: "GREAT_GRANDDAUGHTER",
        referenceId: "A",
      },
      {
        kind: "GENERATION_DISTANCE",
        prototypeId: "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE",
        subjectId: "A",
        referenceId: "D",
      },
      {
        kind: "GENERATION_DISTANCE",
        prototypeId: "BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE",
        subjectId: "D",
        referenceId: "A",
      },
      {
        kind: "TRUE_CLAIM",
        prototypeId: "BLR-CP003-PROT-SHARED-TRUE-CLAIM",
        subjectId: "C",
        referenceId: "D",
      },
    ],
  },
] as const;

export function getBlrCp003LineageScenario(
  scenarioId: string,
): BlrCp003LineageScenario {
  const scenario = BLR_CP003_LINEAGE_SCENARIOS.find(
    (entry) => entry.scenarioId === scenarioId,
  );
  if (!scenario) throw new Error(`Unknown BLR-CP-003 lineage scenario '${scenarioId}'.`);
  return scenario;
}
