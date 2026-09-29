import type { SeatingCaseletRecord } from "./types.ts";
import type { CircularCaseletRecord } from "./cp003/types.ts";
import { CircularTopology, personAt } from "./cp003/topology.ts";

export type Sea001QueryExtensionKindV1 =
  | "EXTREME_END_PAIR"
  | "RELATIVE_POSITION_DESCRIPTION"
  | "DEFINITELY_TRUE_RELATION_STATEMENT";

export interface Sea001QueryExtensionV1 {
  authority: "SEA_001_QUERY_EXTENSION_V1";
  kind: Sea001QueryExtensionKindV1;
  checkpointId: "SEA-CP-001" | "SEA-CP-003";
  sourceCaseletId: string;
  answerType: "PAIR" | "RELATION";
  stem: string;
  options: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  answer: string | readonly string[];
  sourceBackedGap: true;
  permanentQlAllocated: false;
  reviewOnly: true;
}

function answerIndex(seed: string): 0 | 1 | 2 | 3 {
  let hash = 2166136261;
  for (const ch of seed) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 4 as 0 | 1 | 2 | 3;
}

function placeCorrect(
  seed: string,
  correct: string,
  wrong: readonly [string, string, string],
): { options: readonly [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3 } {
  const index = answerIndex(seed);
  const values = [...wrong];
  values.splice(index, 0, correct);
  if (new Set(values).size !== 4) throw new Error("SEA-001 query extension needs four unique options");
  return { options: values as unknown as readonly [string, string, string, string], correctIndex: index };
}

function linearOrder(caselet: SeatingCaseletRecord): readonly string[] {
  const key = caselet.solverOracleAgreement.productionKeys[0];
  if (!key) throw new Error("SEA-CP-001 query extension needs a solved model");
  const [, orderText] = key.split("|");
  const order = orderText?.split(">") ?? [];
  if (order.length < 5) throw new Error("Unexpected SEA-CP-001 solved key");
  return order;
}

function circularOrder(caselet: CircularCaseletRecord): readonly string[] {
  const key = caselet.solverOracleAgreement.productionKeys[0];
  if (!key) throw new Error("SEA-CP-003 query extension needs a solved model");
  const order = key.split("|");
  if (order.length < 6) throw new Error("Unexpected SEA-CP-003 solved key");
  return order;
}

export function buildExtremeEndPairExtensionV1(
  caselet: SeatingCaseletRecord,
): Sea001QueryExtensionV1 {
  const order = linearOrder(caselet);
  const answer = [order[0]!, order[order.length - 1]!].sort();
  const pair = (a: string, b: string) => [a, b].sort().join(" and ");
  const correct = answer.join(" and ");
  const wrong: [string, string, string] = [
    pair(order[0]!, order[order.length - 2]!),
    pair(order[1]!, order[order.length - 1]!),
    pair(order[1]!, order[order.length - 2]!),
  ];
  const placed = placeCorrect(caselet.caseletId + ":EXTREME_PAIR", correct, wrong);
  return {
    authority: "SEA_001_QUERY_EXTENSION_V1",
    kind: "EXTREME_END_PAIR",
    checkpointId: "SEA-CP-001",
    sourceCaseletId: caselet.caseletId,
    answerType: "PAIR",
    stem: "Which pair sits at the two extreme ends of the row?",
    options: placed.options,
    correctIndex: placed.correctIndex,
    answer,
    sourceBackedGap: true,
    permanentQlAllocated: false,
    reviewOnly: true,
  };
}

function relationLabel(direction: "LEFT" | "RIGHT", steps: number): string {
  const ordinal = steps === 1 ? "Immediately" : steps === 2 ? "Second" : steps === 3 ? "Third" : `${steps}th`;
  return `${ordinal} to the ${direction.toLowerCase()}`;
}

export function buildCircularRelativeDescriptionExtensionV1(
  caselet: CircularCaseletRecord,
): readonly [Sea001QueryExtensionV1, Sea001QueryExtensionV1] {
  const order = circularOrder(caselet);
  const topology = new CircularTopology(order.length);
  const referenceIndex = 0;
  const reference = personAt(order, referenceIndex);
  const targetIndex = topology.moveRelativeCentre(referenceIndex, "LEFT", 2);
  const target = personAt(order, targetIndex);
  const correct = relationLabel("LEFT", 2);
  const wrong: [string, string, string] = [
    relationLabel("RIGHT", 2),
    relationLabel("LEFT", 1),
    relationLabel("RIGHT", 1),
  ];
  const relationPlaced = placeCorrect(caselet.caseletId + ":REL_DESC", correct, wrong);

  const trueStatement = `${target} sits ${correct.toLowerCase()} of ${reference}.`;
  const falseStatements: [string, string, string] = [
    `${target} sits second to the right of ${reference}.`,
    `${target} sits immediately to the left of ${reference}.`,
    `${target} sits immediately to the right of ${reference}.`,
  ];
  const statementPlaced = placeCorrect(caselet.caseletId + ":TRUE_REL", trueStatement, falseStatements);

  return [
    {
      authority: "SEA_001_QUERY_EXTENSION_V1",
      kind: "RELATIVE_POSITION_DESCRIPTION",
      checkpointId: "SEA-CP-003",
      sourceCaseletId: caselet.caseletId,
      answerType: "RELATION",
      stem: `What is the position of ${target} with respect to ${reference}?`,
      options: relationPlaced.options,
      correctIndex: relationPlaced.correctIndex,
      answer: correct,
      sourceBackedGap: true,
      permanentQlAllocated: false,
      reviewOnly: true,
    },
    {
      authority: "SEA_001_QUERY_EXTENSION_V1",
      kind: "DEFINITELY_TRUE_RELATION_STATEMENT",
      checkpointId: "SEA-CP-003",
      sourceCaseletId: caselet.caseletId,
      answerType: "RELATION",
      stem: "Which of the following statements is definitely true?",
      options: statementPlaced.options,
      correctIndex: statementPlaced.correctIndex,
      answer: trueStatement,
      sourceBackedGap: true,
      permanentQlAllocated: false,
      reviewOnly: true,
    },
  ];
}

export const SEA_001_QUERY_EXTENSION_AUTHORITY_V1 = Object.freeze({
  authorityId: "SEA_001_QUERY_EXTENSION_V1",
  status: "REVIEW_ONLY_SOURCE_GAP_REMEDIATION",
  coveredGaps: [
    "EXTREME_END_PAIR",
    "RELATIVE_POSITION_DESCRIPTION",
    "DEFINITELY_TRUE_RELATION_STATEMENT",
  ] as const,
  topologyChanged: false,
  solverChanged: false,
  permanentQlAllocated: false,
  questionStudioRegistered: false,
  activationPermitted: false,
});
