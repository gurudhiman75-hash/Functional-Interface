import assert from "node:assert/strict";

import { solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import {
  generateBlrCp003V9TopologyGapWave01Candidates,
  type BlrCp003V9CandidateRecord,
} from "./cp003-v9-topology-gap-wave-01";

function graphFor(record: BlrCp003V9CandidateRecord): FamilyGraph {
  return {
    persons: record.proceduralLogic.nodes.map((node) => ({
      personId: node.id,
      name: node.label,
      gender:
        node.gender === "male"
          ? "MALE"
          : node.gender === "female"
            ? "FEMALE"
            : "UNKNOWN",
    })),
    parentEdges: record.proceduralLogic.edges
      .filter((edge) => edge.type === "parent-child")
      .map((edge) => ({ parentId: edge.sourceId, childId: edge.targetId })),
    spouseEdges: record.proceduralLogic.edges
      .filter((edge) => edge.type === "marriage")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
    siblingEdges: record.proceduralLogic.edges
      .filter((edge) => edge.type === "sibling")
      .map((edge) => ({ personAId: edge.sourceId, personBId: edge.targetId })),
  };
}

function semanticIds(semanticKey: string): string[] {
  const [, ...ids] = semanticKey.split(":");
  return ids.filter(Boolean);
}

function assertAnswerIdentity(record: BlrCp003V9CandidateRecord): void {
  const correct = record.options[record.correctIndex]!;
  assert.equal(correct.semanticKey, record.answerSemanticKey);
  const answerIds = semanticIds(record.answerSemanticKey);

  if (record.answerType === "PERSON_NAME") {
    assert.equal(answerIds.length, 1);
    assert.equal(record.evidencePaths[0]?.subjectId, answerIds[0]);
    return;
  }

  if (record.answerType === "PERSON_NAME_SET") {
    const evidenceSubjects = [
      ...new Set(record.evidencePaths.map((path) => path.subjectId)),
    ].sort();
    assert.deepEqual([...answerIds].sort(), evidenceSubjects);
    return;
  }

  assert.equal(record.answerType, "UNORDERED_PERSON_PAIR");
  assert.equal(answerIds.length, 2);
  const answerSet = new Set(answerIds);
  if (record.evidencePaths.length === 1) {
    const path = record.evidencePaths[0]!;
    assert.deepEqual(
      answerSet,
      new Set([path.subjectId, path.referenceId]),
      `${record.itemId} pair identity does not match its evidence endpoints`,
    );
  } else {
    assert.deepEqual(
      answerSet,
      new Set(record.evidencePaths.map((path) => path.subjectId)),
      `${record.itemId} pair identity does not match its reference-based subjects`,
    );
  }
}

const records = generateBlrCp003V9TopologyGapWave01Candidates();
let independentlySolvedEvidencePaths = 0;
let answerIdentityChecks = 0;
const relationCounts: Record<string, number> = {};

for (const record of records) {
  const graph = graphFor(record);
  for (const evidencePath of record.evidencePaths) {
    const solved = solveRelationFromGraph(
      graph,
      evidencePath.subjectId,
      evidencePath.referenceId,
    );
    assert.equal(
      solved.relationId,
      evidencePath.relationId,
      `${record.itemId} declared ${evidencePath.relationId} but independent closure solved ${solved.relationId}`,
    );
    assert.ok(solved.path.steps.length >= 2);
    independentlySolvedEvidencePaths += 1;
    relationCounts[solved.relationId] =
      (relationCounts[solved.relationId] ?? 0) + 1;
  }
  assertAnswerIdentity(record);
  answerIdentityChecks += 1;
}

assert.equal(records.length, 96);
assert.equal(answerIdentityChecks, 96);
assert.equal(independentlySolvedEvidencePaths, 176);
assert.deepEqual(relationCounts, {
  BROTHER_IN_LAW: 16,
  DAUGHTER_IN_LAW: 16,
  SON_IN_LAW: 8,
  COUSIN: 48,
  GRANDFATHER: 16,
  GRANDMOTHER: 16,
  GREAT_GRANDFATHER: 8,
  GREAT_GRANDMOTHER: 16,
  GREAT_GRANDSON: 8,
  GREAT_GRANDDAUGHTER: 8,
  AUNT: 16,
});

console.log(
  JSON.stringify(
    {
      candidateRecords: records.length,
      independentlySolvedEvidencePaths,
      answerIdentityChecks,
      relationCounts,
      verdict:
        "BLR-CP-003 V9 WAVE 01 PASSES MATERIAL INDEPENDENT GRAPH-CLOSURE VERIFICATION FOR EVERY DECLARED RELATION AND ANSWER IDENTITY",
    },
    null,
    2,
  ),
);
