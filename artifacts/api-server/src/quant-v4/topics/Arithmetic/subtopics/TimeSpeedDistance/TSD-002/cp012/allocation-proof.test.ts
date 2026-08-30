import { generateTsdCp012ExecutableCases } from "./executable-cases";
import { generateTsdCp012SourceExtensionCases } from "./source-executable-extensions";
import {
  TSD_CP012_NEXT_QL_ID,
  TSD_CP012_PROVISIONAL_QL_IDS,
  TSD_CP012_QL_ALLOCATION,
  TSD_CP012_QL_ALLOCATION_STATUS,
  TSD_CP012_QL_LIFECYCLE,
} from "./ql-allocation";
import { TSD_CP012_LEARNER_AUTHORITIES, TSD_CP012_SOURCE_SUMMARY, type TsdCp012AuthorityKey } from "./source-saturation";
import { TSD_CP012_TWO_ENGINE_PROVENANCE } from "./two-engine-provenance";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 provisional QL allocation proof failed: ${message}`);
}

assert(TSD_CP012_QL_ALLOCATION_STATUS === "PROVISIONAL_EXECUTABLE_DISCOVERY_CANDIDATE", "allocation status must remain provisional");
assert(TSD_CP012_QL_ALLOCATION.length === 11, "expected one provisional QL for each of eleven mathematical authorities");
assert(TSD_CP012_PROVISIONAL_QL_IDS.length === 11, "expected eleven provisional QL IDs");
assert(new Set(TSD_CP012_PROVISIONAL_QL_IDS).size === 11, "provisional QL IDs must be unique");
assert(new Set(TSD_CP012_QL_ALLOCATION.map((x) => x.authorityKey)).size === 11, "each authority must receive exactly one provisional QL");
assert(TSD_CP012_NEXT_QL_ID === "TSD-QL-143", "next QL ID must remain TSD-QL-143");

const expectedIds = Array.from({ length: 11 }, (_, index) => `TSD-QL-${132 + index}`);
assert(expectedIds.every((id, index) => TSD_CP012_PROVISIONAL_QL_IDS[index] === id), "allocation must be contiguous TSD-QL-132..TSD-QL-142");
assert(TSD_CP012_LEARNER_AUTHORITIES.every((authorityKey) => TSD_CP012_QL_ALLOCATION.some((x) => x.authorityKey === authorityKey)), "every learner authority must be allocated");

const contractEvidence: Readonly<Record<TsdCp012AuthorityKey, readonly RegExp[]>> = Object.freeze({
  discreteSpeedProgramState: [/speed-stage|repeating/i, /partial|inverse/i],
  periodicTravelRestProgramState: [/travel-rest/i, /rest count|rest duration|terminal/i],
  terminalConstraintProgramState: [/final-stage|changeover|minimum speed|maximum delay/i, /constraint/i],
  routeProfileProgramState: [/route/i, /segment|mode|side-speed/i],
  motionReconstructionProgramState: [/reconstruct/i, /itinerary|table|diagram|caselet/i],
  trainScheduleSynthesisState: [/train|station/i, /departure|schedule/i],
  mediumPursuitSynthesisState: [/medium|current|floating/i, /pursuit|recovery|catch/i],
  closedTrackRaceSynthesisState: [/closed-track|modular/i, /race|finish|handicap|overtake/i],
  movingSurfaceScheduleSynthesisState: [/moving-surface/i, /stop|activation|reversal|schedule/i],
  twoEngineInverseState: [/two|earlier TSD|motion engine/i, /independent/i],
  feasibleParameterSetState: [/enumerate|count/i, /finite|feasibility/i],
});
for (const allocation of TSD_CP012_QL_ALLOCATION) {
  const required = contractEvidence[allocation.authorityKey];
  assert(required.every((pattern) => pattern.test(allocation.learnerContract)), `${allocation.qlId}: learner contract does not preserve the authority's mathematical boundary`);
}

const allExecutableCases = [...generateTsdCp012ExecutableCases(), ...generateTsdCp012SourceExtensionCases()];
for (const allocation of TSD_CP012_QL_ALLOCATION) {
  const owned = allExecutableCases.filter((x) => x.authorityKey === allocation.authorityKey);
  assert(owned.length >= 24, `${allocation.qlId}: expected at least 24 exact executable cases for ${allocation.authorityKey}`);
  assert(new Set(owned.map((x) => x.input.target)).size >= 2, `${allocation.qlId}: executable target variety is too thin`);
}
assert(TSD_CP012_TWO_ENGINE_PROVENANCE.length === 24, "TSD-QL-141 must retain 24 provenance rows across the three semantics-preserving scale bands");
assert(TSD_CP012_TWO_ENGINE_PROVENANCE.every((x) => x.engineA !== x.engineB), "TSD-QL-141 must not collapse into one-engine or abstract algebra evidence");

assert(TSD_CP012_SOURCE_SUMMARY.frozen === false, "source discovery must remain unfrozen");
assert(TSD_CP012_SOURCE_SUMMARY.questionStudioRegistered === false, "source discovery must remain unregistered in Studio");
assert(TSD_CP012_SOURCE_SUMMARY.bankWritable === false, "source discovery must remain non-writable to Bank");
assert(TSD_CP012_SOURCE_SUMMARY.testEligible === false, "source discovery must remain test-ineligible");
assert(TSD_CP012_SOURCE_SUMMARY.publiclyPublishable === false, "source discovery must remain non-publishable");

assert(TSD_CP012_QL_LIFECYCLE.productOwnerApproved === false, "product-owner approval must remain false");
assert(TSD_CP012_QL_LIFECYCLE.frozen === false, "QL allocation must remain unfrozen");
assert(TSD_CP012_QL_LIFECYCLE.productionRegistered === false, "production registration must remain disabled");
assert(TSD_CP012_QL_LIFECYCLE.questionStudioRegistered === false, "Question Studio registration must remain disabled");
assert(TSD_CP012_QL_LIFECYCLE.questionBankWritable === false, "Question Bank writes must remain disabled");
assert(TSD_CP012_QL_LIFECYCLE.testEligible === false, "test eligibility must remain disabled");
assert(TSD_CP012_QL_LIFECYCLE.publiclyPublishable === false, "public publishing must remain disabled");

console.log("TSD-CP-012 PROVISIONAL QL ALLOCATION + LIFECYCLE PROOF: PASS");
console.log(JSON.stringify({
  allocationStatus: TSD_CP012_QL_ALLOCATION_STATUS,
  provisionalQlIds: TSD_CP012_PROVISIONAL_QL_IDS,
  nextQlId: TSD_CP012_NEXT_QL_ID,
  authorities: TSD_CP012_QL_ALLOCATION.map((x) => ({ qlId: x.qlId, authorityKey: x.authorityKey })),
  minimumExecutableEvidencePerQl: 24,
  twoEngineProvenanceRows: TSD_CP012_TWO_ENGINE_PROVENANCE.length,
  contractGuard: "SEMANTIC_BOUNDARY_PATTERNS_NOT_CHARACTER_COUNT",
  frozen: TSD_CP012_QL_LIFECYCLE.frozen,
  studioRegistered: TSD_CP012_QL_LIFECYCLE.questionStudioRegistered,
  bankWritable: TSD_CP012_QL_LIFECYCLE.questionBankWritable,
  testEligible: TSD_CP012_QL_LIFECYCLE.testEligible,
  publiclyPublishable: TSD_CP012_QL_LIFECYCLE.publiclyPublishable,
}, null, 2));
