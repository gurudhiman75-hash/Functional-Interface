import assert from "node:assert/strict";
import { SAP_CP010_CATALOGUE, SAP_CP010_PROTOTYPE_IDS } from "./SAP-002/SAP-CP-010/runtime";
import { SAP_CP011_E2_STRUCTURES } from "./SAP-002/SAP-CP-011/runtime-release-r6";
import { SAP_CP012_E2_STRUCTURES } from "./SAP-002/SAP-CP-012/runtime-release-e3";
import { SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID } from "./SAP-001/SAP-CP-004/e1-runtime";
import { SAP_CP005_E1_TELESCOPING_CANDIDATE_ID } from "./SAP-001/SAP-CP-005/e1-runtime";
import { SAP_CP007_E1_SIGFIG_CANDIDATE_ID } from "./SAP-001/SAP-CP-007/e1-runtime";
import { SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID } from "./SAP-002/SAP-CP-010/e1-runtime";

type ProposalEntry = Readonly<{
  ql: string;
  checkpoint: string;
  sourceIdentity: string;
  finalTitle: string;
  status: "PROPOSED_NOT_APPLIED";
}>;

function ql(number: number): string { return `SAP-QL-${String(number).padStart(3, "0")}`; }

const cp010Titles = [
  "Square-root interval from nearby perfect squares",
  "Cube-root interval from nearby perfect cubes",
  "Bounded higher-root interval",
  "Nearest integer square root",
  "Nearest integer cube root",
  "Greatest lower / least upper integer root bound",
  "Small decimal power estimate",
  "Percentage power-factor estimate",
  "Reciprocal near an integer benchmark",
  "Approximate product of roots",
  "Approximate quotient of roots",
  "Mixed bounded power-root estimate",
  "Missing radicand under nearest-integer root",
  "Missing base under bounded approximate power",
  "Nearest option for a power estimate",
  "Compare approximate root and power values",
  "Diagnose a wrong root benchmark",
] as const;

assert.equal(SAP_CP010_CATALOGUE.length, 17);
assert.equal(SAP_CP010_PROTOTYPE_IDS.length, 17);
for (let i = 0; i < 17; i += 1) assert.equal(SAP_CP010_CATALOGUE[i]!.proposedPermanentQlId, ql(166 + i));
assert.equal(SAP_CP010_PROTOTYPE_IDS[14], "SAP-CP010-PROT-NEAREST-OPTION-SPECIAL-FORM");

const cp010: ProposalEntry[] = SAP_CP010_PROTOTYPE_IDS.map((sourceIdentity, index) => Object.freeze({
  ql: ql(166 + index), checkpoint: "SAP-CP-010", sourceIdentity, finalTitle: cp010Titles[index]!, status: "PROPOSED_NOT_APPLIED" as const,
}));

const e1Candidates = [
  ["SAP-CP-004", SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID, "Nested additive exact radical chain"],
  ["SAP-CP-005", SAP_CP005_E1_TELESCOPING_CANDIDATE_ID, "Numeric partial-fraction telescoping sum"],
  ["SAP-CP-007", SAP_CP007_E1_SIGFIG_CANDIDATE_ID, "Round a number to declared significant figures"],
  ["SAP-CP-010", SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID, "Scale a supplied approximate root value"],
] as const;
const e1: ProposalEntry[] = e1Candidates.map(([checkpoint, sourceIdentity, finalTitle], index) => Object.freeze({
  ql: ql(183 + index), checkpoint, sourceIdentity, finalTitle, status: "PROPOSED_NOT_APPLIED" as const,
}));

assert.equal(SAP_CP011_E2_STRUCTURES.length, 12);
const cp011Titles = [
  "Closest option for a mixed approximate expression",
  "Closest option for a fraction-product estimate",
  "Nearest multiple after approximation",
  "Closest option for an approximate root expression",
  "Absolute error of an estimate",
  "Percentage error of an estimate",
  "Overestimate / underestimate direction",
  "Compare the accuracy of two estimates",
  "Tight bound from multiple rounded terms",
  "Select the option inside a stated tolerance",
  "Guaranteed nearest option from an interval",
  "Diagnose when no unique nearest option is guaranteed",
] as const;
const cp011: ProposalEntry[] = SAP_CP011_E2_STRUCTURES.map((sourceIdentity, index) => Object.freeze({
  ql: ql(187 + index), checkpoint: "SAP-CP-011", sourceIdentity, finalTitle: cp011Titles[index]!, status: "PROPOSED_NOT_APPLIED" as const,
}));

assert.equal(SAP_CP012_E2_STRUCTURES.length, 13);
const cp012Titles = [
  "Approximate missing addend in a mixed equation",
  "Approximate missing multiplier",
  "Approximate missing divisor",
  "Recover a missing value from a square relation",
  "Recover a missing value from a cube relation",
  "Reverse a root-ratio approximation",
  "Recover a missing percentage approximately",
  "Reverse a two-sided mixed approximate equation",
  "Unique integer satisfying an approximation tolerance",
  "Count admissible integers in an approximation band",
  "Classify an approximation band as unique / multiple / impossible",
  "Recover the exact possible interval of a rounded operand",
  "Mixed root/power reverse-approximation synthesis",
] as const;
const cp012: ProposalEntry[] = SAP_CP012_E2_STRUCTURES.map((sourceIdentity, index) => Object.freeze({
  ql: ql(199 + index), checkpoint: "SAP-CP-012", sourceIdentity, finalTitle: cp012Titles[index]!, status: "PROPOSED_NOT_APPLIED" as const,
}));

const proposal = Object.freeze([...cp010, ...e1, ...cp011, ...cp012]);
assert.equal(proposal.length, 46);
assert.equal(new Set(proposal.map(x => x.ql)).size, 46);
assert.deepEqual(proposal.map(x => x.ql), Array.from({ length: 46 }, (_, i) => ql(166 + i)));
assert.equal(proposal[0]!.ql, "SAP-QL-166");
assert.equal(proposal.at(-1)!.ql, "SAP-QL-211");
assert.equal(ql(212), "SAP-QL-212");

const checkpointCounts = Object.fromEntries([...new Set(proposal.map(x => x.checkpoint))].map(cp => [cp, proposal.filter(x => x.checkpoint === cp).length]));
assert.deepEqual(checkpointCounts, {
  "SAP-CP-010": 18,
  "SAP-CP-004": 1,
  "SAP-CP-005": 1,
  "SAP-CP-007": 1,
  "SAP-CP-011": 12,
  "SAP-CP-012": 13,
});

assert.equal(proposal.find(x => x.ql === "SAP-QL-180")!.finalTitle, "Nearest option for a power estimate");
assert.equal(proposal.find(x => x.ql === "SAP-QL-183")!.sourceIdentity, SAP_CP004_E1_NESTED_ADDITIVE_CANDIDATE_ID);
assert.equal(proposal.find(x => x.ql === "SAP-QL-184")!.sourceIdentity, SAP_CP005_E1_TELESCOPING_CANDIDATE_ID);
assert.equal(proposal.find(x => x.ql === "SAP-QL-185")!.sourceIdentity, SAP_CP007_E1_SIGFIG_CANDIDATE_ID);
assert.equal(proposal.find(x => x.ql === "SAP-QL-186")!.sourceIdentity, SAP_CP010_E1_SUPPLIED_ROOT_CANDIDATE_ID);
assert.equal(proposal.find(x => x.ql === "SAP-QL-211")!.sourceIdentity, "CP012-E2-MIXED-ROOT-POWER-SYNTHESIS");
assert.ok(proposal.every(x => x.status === "PROPOSED_NOT_APPLIED"));

console.log(JSON.stringify({
  authority: "SAP-FINAL-ALLOCATION-PROPOSAL-V1",
  status: "PROPOSED_NOT_APPLIED",
  priorFrozenThrough: "SAP-QL-165",
  proposedRange: "SAP-QL-166..SAP-QL-211",
  proposedCount: proposal.length,
  nextAvailable: "SAP-QL-212",
  checkpointCounts,
  ql180: "POWER_ONLY_NEAREST_OPTION",
  e3RepresentationExpansionsConsumeNewQl: false,
  lifecycleMutation: false,
}));
