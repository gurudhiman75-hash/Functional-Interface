import {
  getSylDiscoveryPrototypeV3,
  SYL_DISCOVERY_PROTOTYPES_V3,
} from "./discovery-prototypes-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(SYL_DISCOVERY_PROTOTYPES_V3.length === 6, "All six V3 discovery decisions must be executable and recorded.");
assert(SYL_DISCOVERY_PROTOTYPES_V3.every((entry) => entry.permanentQlId === null), "Discovery prototypes must not allocate permanent QL IDs.");

const witness = getSylDiscoveryPrototypeV3("SYL-DISC-V3-WITNESS-SAME-DIFFERENT");
assert(witness.decision === "IMPLEMENTED_EXECUTABLE_PROTOTYPE", "Same/different witness case must be executable.");
assert(witness.evidence.sameWitnessModelValid === true, "Same-witness model must satisfy both existential statements.");
assert(witness.evidence.differentWitnessModelValid === true, "Different-witness model must satisfy both existential statements.");
assert(witness.evidence.someAareCClassification === "UNDETERMINED", "Some A are C must remain undetermined when witnesses may differ.");
assert(witness.evidence.canBeTrue === true && witness.evidence.canBeFalse === true, "Witness case must prove both admissible truth states.");

const threeWitness = getSylDiscoveryPrototypeV3("SYL-DISC-V3-THREE-DISTINCT-WITNESSES");
assert(threeWitness.decision === "IMPLEMENTED_EXECUTABLE_PROTOTYPE", "Three-witness case must be executable.");
assert(threeWitness.evidence.satisfiable === true, "Three-witness prototype must be satisfiable.");
assert(Number(threeWitness.evidence.occupiedRegionCount) >= 3, "Three-witness prototype must retain at least three occupied regions.");
assert(threeWitness.evidence.maxTerms === 5, "Three-witness prototype must exercise the five-term solver boundary.");

const inconsistent = getSylDiscoveryPrototypeV3("SYL-DISC-V3-INCONSISTENT-PREMISES");
assert(inconsistent.decision === "GOVERNED_EXCLUSION", "Inconsistent-premise family must remain governed without source authority.");
assert(inconsistent.evidence.solverDiagnosticImplemented === true, "Inconsistency diagnostics must be implemented.");
assert(inconsistent.evidence.satisfiable === false, "Contradictory premises must be detected as unsatisfiable.");
assert(inconsistent.evidence.productionTaskEnabled === false, "Inconsistent-premise task must remain disabled.");

const irrelevant = getSylDiscoveryPrototypeV3("SYL-DISC-V3-IRRELEVANT-PREMISE-REJECTION");
assert(irrelevant.decision === "REJECT_FROM_GENERATED_POOL", "Irrelevant premises must be rejected, not published as a normal family.");
assert(irrelevant.evidence.fullClassification === irrelevant.evidence.reducedClassification, "Irrelevant premise changed the classification unexpectedly.");
assert(irrelevant.evidence.fullCanBeTrue === irrelevant.evidence.reducedCanBeTrue, "Irrelevant premise changed canBeTrue unexpectedly.");
assert(irrelevant.evidence.fullCanBeFalse === irrelevant.evidence.reducedCanBeFalse, "Irrelevant premise changed canBeFalse unexpectedly.");

const redundant = getSylDiscoveryPrototypeV3("SYL-DISC-V3-REDUNDANT-PREMISE-REJECTION");
assert(redundant.decision === "REJECT_FROM_GENERATED_POOL", "Redundant premises must be rejected from generated pools.");
assert(redundant.evidence.fullClassification === redundant.evidence.reducedClassification, "Redundant premise changed the classification unexpectedly.");
assert(redundant.evidence.fullCanBeTrue === redundant.evidence.reducedCanBeTrue, "Redundant premise changed canBeTrue unexpectedly.");
assert(redundant.evidence.fullCanBeFalse === redundant.evidence.reducedCanBeFalse, "Redundant premise changed canBeFalse unexpectedly.");

const few = getSylDiscoveryPrototypeV3("SYL-DISC-V3-PLAIN-FEW-EXCLUSION");
assert(few.decision === "GOVERNED_EXCLUSION", "Plain FEW must remain a governed exclusion.");
assert(few.evidence.productionNormalization === "BLOCKED", "Plain FEW normalization must remain blocked.");
assert(Array.isArray(few.evidence.competingInterpretations) && few.evidence.competingInterpretations.length === 2, "Plain FEW conflict must preserve both interpretations.");

console.log(JSON.stringify({
  status: "SYL-001 V3 discovery prototypes passed",
  prototypes: SYL_DISCOVERY_PROTOTYPES_V3.map((entry) => ({
    prototypeId: entry.prototypeId,
    decision: entry.decision,
    permanentQlId: entry.permanentQlId,
  })),
}, null, 2));
