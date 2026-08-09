import assert from "node:assert/strict";

import { solveRelationFromGraph } from "../foundation/graph-closure";
import type { FamilyGraph } from "../foundation/types";
import {
  generateBlrCp003V9TopologyGapWave02Candidates,
  type BlrCp003V9Wave02CandidateRecord,
} from "./cp003-v9-topology-gap-wave-02";

function graphFor(record: BlrCp003V9Wave02CandidateRecord): FamilyGraph {
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

function semanticIds(key: string): string[] {
  return key.split(":").slice(1);
}

function assertAnswerIdentity(record: BlrCp003V9Wave02CandidateRecord): void {
  assert.equal(
    record.options[record.correctIndex]!.semanticKey,
    record.answerSemanticKey,
  );
  const answerIds = [...semanticIds(record.answerSemanticKey)].sort();
  if (record.answerType === "PERSON_NAME") {
    assert.equal(answerIds.length, 1);
    assert.equal(record.evidencePaths[0]!.subjectId, answerIds[0]);
    return;
  }
  const evidenceSubjects = [
    ...new Set(record.evidencePaths.map((path) => path.subjectId)),
  ].sort();
  assert.deepEqual(answerIds, evidenceSubjects);
}

const records = generateBlrCp003V9TopologyGapWave02Candidates();
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
    assert.equal(
      solved.path.steps.length,
      evidencePath.distance,
      `${record.itemId} declared evidence distance ${evidencePath.distance} but independently solved ${solved.path.steps.length}`,
    );
    independentlySolvedEvidencePaths += 1;
    relationCounts[solved.relationId] =
      (relationCounts[solved.relationId] ?? 0) + 1;
  }
  assertAnswerIdentity(record);
  answerIdentityChecks += 1;
}

assert.equal(records.length, 72);
assert.equal(answerIdentityChecks, 72);
assert.equal(independentlySolvedEvidencePaths, 120);
assert.deepEqual(
  Object.fromEntries(Object.entries(relationCounts).sort(([a], [b]) => a.localeCompare(b))),
  {
    AUNT: 18,
    BROTHER_IN_LAW: 6,
    COUSIN: 18,
    DAUGHTER: 6,
    DAUGHTER_IN_LAW: 6,
    FATHER: 6,
    FATHER_IN_LAW: 6,
    MOTHER: 6,
    MOTHER_IN_LAW: 12,
    NEPHEW: 18,
    SON_IN_LAW: 6,
    UNCLE: 12,
  },
);

console.log(
  JSON.stringify(
    {
      candidateRecords: records.length,
      independentlySolvedEvidencePaths,
      answerIdentityChecks,
      relationCounts,
      verdict:
        "BLR-CP-003 V9 WAVE 02 PASSES INDEPENDENT GRAPH-CLOSURE VERIFICATION FOR EVERY DECLARED RELATION AND ANSWER IDENTITY",
    },
    null,
    2,
  ),
);
