import assert from "node:assert/strict";
import { relationTopologyFingerprint } from "./fingerprint";
import type { PositionRelation } from "./types";

const original: readonly PositionRelation[] = [
  { fromEntity: "A", toEntity: "B", vector: { x: 4, y: 0 } },
  { fromEntity: "B", toEntity: "C", vector: { x: 0, y: 3 } },
];

const renamedAndReordered: readonly PositionRelation[] = [
  { fromEntity: "Ravi", toEntity: "Simran", vector: { x: 0, y: 3 } },
  { fromEntity: "Mohan", toEntity: "Ravi", vector: { x: 4, y: 0 } },
];

const reverseStatements: readonly PositionRelation[] = [
  { fromEntity: "B", toEntity: "A", vector: { x: -4, y: 0 } },
  { fromEntity: "C", toEntity: "B", vector: { x: 0, y: -3 } },
];

const differentTopology: readonly PositionRelation[] = [
  { fromEntity: "A", toEntity: "B", vector: { x: 4, y: 0 } },
  { fromEntity: "A", toEntity: "C", vector: { x: 0, y: 3 } },
];

const fingerprint = relationTopologyFingerprint(original);
assert.equal(relationTopologyFingerprint(renamedAndReordered), fingerprint);
assert.equal(relationTopologyFingerprint(reverseStatements), fingerprint);
assert.notEqual(relationTopologyFingerprint(differentTopology), fingerprint);
assert.equal(relationTopologyFingerprint([]), "RELATION:EMPTY");

console.log("DIR-001 relation fingerprint invariance test passed.");
