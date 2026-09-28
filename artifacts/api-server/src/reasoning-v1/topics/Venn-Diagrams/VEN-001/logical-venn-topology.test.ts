import assert from "node:assert/strict";
import {
  findVennTopologyWitness,
  relationForPair,
  validateVennTopology,
} from "./logical-venn-topology.ts";

const nested = validateVennTopology(["A", "B", "C"], [
  { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
  { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
  { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
]);
assert.equal(relationForPair(nested, "A", "C"), "LEFT_SUBSET_RIGHT");

const reversedLabelOrder = validateVennTopology(["B", "A"], [
  { left: "B", right: "A", relation: "LEFT_SUBSET_RIGHT" },
]);
assert.equal(relationForPair(reversedLabelOrder, "B", "A"), "LEFT_SUBSET_RIGHT");

const siblingSets = validateVennTopology(["A", "B", "C"], [
  { left: "A", right: "B", relation: "DISJOINT" },
  { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
  { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
]);
assert.ok(siblingSets.membershipAtoms.some((atom) => atom.includes("A")));
assert.ok(siblingSets.membershipAtoms.some((atom) => atom.includes("B")));
assert.ok(siblingSets.membershipAtoms.every((atom) => !atom.includes("A") || !atom.includes("B")));

const overlapInsideSuperset = validateVennTopology(["A", "B", "C"], [
  { left: "A", right: "B", relation: "PARTIAL_OVERLAP" },
  { left: "A", right: "C", relation: "LEFT_SUBSET_RIGHT" },
  { left: "B", right: "C", relation: "LEFT_SUBSET_RIGHT" },
]);
assert.ok(overlapInsideSuperset.membershipAtoms.some((atom) => atom.length === 3));

assert.throws(() => validateVennTopology(["A", "B"], [
  { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
  { left: "B", right: "A", relation: "DISJOINT" },
]), /exactly one relation|repeated/);

assert.equal(findVennTopologyWitness(["A", "B", "C"], [
  { left: "A", right: "B", relation: "LEFT_SUBSET_RIGHT" },
  { left: "B", right: "C", relation: "DISJOINT" },
  { left: "A", right: "C", relation: "PARTIAL_OVERLAP" },
]), null);

assert.throws(() => validateVennTopology(["A", "A"], [
  { left: "A", right: "A", relation: "EQUAL" },
]), /labels must be unique/);

console.log("PASS_VEN_001_TOPOLOGY_SOLVER");
