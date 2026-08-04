import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getSylDiscoveryPrototypeV3,
  SYL_DISCOVERY_PROTOTYPES_V3,
} from "./discovery-prototypes-v3";
import { generateSylQuestion } from "./generator";
import {
  SYL_PROVISIONAL_QL_ARCHETYPES_V3,
  SYL_QL_DISCOVERY_STATE_V3,
} from "./provisional-ql-registry-v3";

type CoverageStatus =
  | "COVERED_RUNTIME"
  | "IMPLEMENTED_EXECUTABLE_PROTOTYPE"
  | "GOVERNED_EXCLUSION"
  | "REJECT_FROM_GENERATED_POOL"
  | "OPEN";

interface CoverageDecision {
  id: string;
  status: CoverageStatus;
  covered: boolean;
  note: string;
  authorityId?: string;
}

const premiseForms = new Set<string>();
const taskKinds = new Set<string>();
const topologies = new Set<string>();
const semanticStatuses = new Set<string>();
const taskStatuses = new Set<string>();
const proofTypes = new Set<string>();
const diagramModes = new Set<string>();
const reasonCodes = new Set<string>();
const witnessRelations = new Set<string>();
const existenceDependencies = new Set<string>();
let maxWitnesses = 0;
let records = 0;

for (const definition of SYL_PROVISIONAL_QL_ARCHETYPES_V3) {
  taskKinds.add(definition.taskKind);
  for (let seed = 0; seed < 80; seed += 1) {
    const question = generateSylQuestion(definition.qlId, seed, "en-IN");
    question.metadata.premiseForms.forEach((form) => premiseForms.add(form));
    topologies.add(question.metadata.topology);
    const proof = question.structuredProofV3;
    proof.visibleOptionAnalysis.forEach((option) => {
      semanticStatuses.add(option.semanticStatus);
      taskStatuses.add(option.taskStatus);
      reasonCodes.add(option.reasonCode);
    });
    proofTypes.add(proof.correctOptionProof.proofType);
    diagramModes.add(proof.diagramSpec.mode);
    proof.combinedReasoning.witnesses.forEach((witness) => witnessRelations.add(witness.relation));
    maxWitnesses = Math.max(maxWitnesses, proof.combinedReasoning.witnesses.length);
    existenceDependencies.add(proof.existencePolicy.dependentAnswer ? "DEPENDENT" : "INDEPENDENT");
    records += 1;
  }
}

const sameDifferent = getSylDiscoveryPrototypeV3("SYL-DISC-V3-WITNESS-SAME-DIFFERENT");
const threeWitness = getSylDiscoveryPrototypeV3("SYL-DISC-V3-THREE-DISTINCT-WITNESSES");
const inconsistent = getSylDiscoveryPrototypeV3("SYL-DISC-V3-INCONSISTENT-PREMISES");
const irrelevant = getSylDiscoveryPrototypeV3("SYL-DISC-V3-IRRELEVANT-PREMISE-REJECTION");
const redundant = getSylDiscoveryPrototypeV3("SYL-DISC-V3-REDUNDANT-PREMISE-REJECTION");
const plainFew = getSylDiscoveryPrototypeV3("SYL-DISC-V3-PLAIN-FEW-EXCLUSION");

function runtime(id: string, condition: boolean, note: string): CoverageDecision {
  return { id, status: condition ? "COVERED_RUNTIME" : "OPEN", covered: condition, note };
}

const requiredCoverage: readonly CoverageDecision[] = [
  runtime("EXPLICIT_SOME_NOT", premiseForms.has("SOME_NOT"), "Explicit Some A are not B premise."),
  runtime("NOT_ALL", premiseForms.has("NOT_ALL"), "Not all A are B normalization."),
  runtime("A_FEW", premiseForms.has("A_FEW"), "A few A are B."),
  runtime("ONLY_A_FEW", premiseForms.has("ONLY_A_FEW"), "Only a few A are B."),
  {
    id: "PLAIN_FEW",
    status: plainFew.decision,
    covered: true,
    note: "Plain Few is intentionally blocked because available exam authorities conflict between SOME_ONLY and SOME_AND_SOME_NOT.",
    authorityId: plainFew.prototypeId,
  },
  runtime("IDENTITY", premiseForms.has("IDENTITY"), "Identity/equality relation."),
  {
    id: "CONTRADICTORY_STATEMENTS",
    status: inconsistent.decision,
    covered: true,
    note: "Solver diagnostic is executable; student task family is excluded until a verified target-exam authority exists.",
    authorityId: inconsistent.prototypeId,
  },
  {
    id: "IRRELEVANT_PREMISE",
    status: irrelevant.decision,
    covered: true,
    note: "Irrelevant-premise payloads are executable rejection cases and are prohibited from the generated pool.",
    authorityId: irrelevant.prototypeId,
  },
  {
    id: "REDUNDANT_PREMISE",
    status: redundant.decision,
    covered: true,
    note: "Redundant-premise payloads are executable rejection cases and are prohibited from the generated pool.",
    authorityId: redundant.prototypeId,
  },
  {
    id: "SAME_VS_DIFFERENT_WITNESS",
    status: sameDifferent.decision,
    covered: sameDifferent.evidence.someAareCClassification === "UNDETERMINED",
    note: "Executable prototype proves both same-witness and different-witness models are legal.",
    authorityId: sameDifferent.prototypeId,
  },
  runtime("TWO_WITNESS", maxWitnesses >= 2, "At least two required witnesses in the review runtime."),
  {
    id: "THREE_WITNESS",
    status: threeWitness.decision,
    covered: Number(threeWitness.evidence.occupiedRegionCount) >= 3,
    note: "Executable five-term prototype forces at least three occupied witness regions.",
    authorityId: threeWitness.prototypeId,
  },
  runtime("ALL_PAIR_MASKS", taskKinds.has("TWO_CONCLUSION_FOLLOW_MASK"), "Two-conclusion mask family is implemented and distribution-audited."),
  runtime("THREE_CONCLUSION_MASKS", taskKinds.has("THREE_CONCLUSION_FOLLOW_MASK") || taskKinds.has("MIXED_THREE_CONCLUSION_MASK"), "Three-conclusion mask family is implemented."),
  runtime("EITHER_OR_VALID_INVALID", taskKinds.has("TWO_CONCLUSION_EITHER_OR") && taskKinds.has("CLASSIFY_CONCLUSION_PAIR"), "Valid and invalid pair classification is implemented."),
  runtime("ONLY_BOTH_DIRECTIONS", premiseForms.has("ONLY") && premiseForms.has("ARE_ONLY"), "Only A are B and A are only B are distinct runtime forms."),
  runtime("MIXED_FOUR_TERM", topologies.has("MIXED"), "Mixed topology is represented; source/merge-split review remains a freeze gate."),
  runtime("BRANCHING", topologies.has("BRANCHING"), "Branching topology."),
  runtime("CONVERGING", topologies.has("CONVERGING"), "Converging topology."),
  runtime("DEFINITE_TASK", taskKinds.has("SELECT_DEFINITE_CONCLUSION"), "Definite conclusion task."),
  runtime("POSSIBILITY_TASK", taskKinds.has("SELECT_GENUINE_POSSIBILITY"), "Genuine possibility task."),
  runtime("IMPOSSIBLE_TASK", taskKinds.has("SELECT_IMPOSSIBLE_CONCLUSION"), "Impossible conclusion task."),
  runtime("NON_FOLLOWING_TASK", taskKinds.has("SELECT_NON_FOLLOWING_CONCLUSION"), "Non-following countermodel task."),
];

const openGaps = requiredCoverage.filter((entry) => entry.status === "OPEN" || !entry.covered);
const governedDecisions = requiredCoverage.filter((entry) =>
  entry.status === "GOVERNED_EXCLUSION" || entry.status === "REJECT_FROM_GENERATED_POOL");
const executablePrototypeCoverage = requiredCoverage.filter((entry) =>
  entry.status === "IMPLEMENTED_EXECUTABLE_PROTOTYPE");

const report = {
  authority: SYL_QL_DISCOVERY_STATE_V3.authority,
  status: "OPEN_CLOSEOUT",
  freezePermitted: false,
  permanentQlAllocationPermitted: false,
  provisionalArchetypeCount: SYL_PROVISIONAL_QL_ARCHETYPES_V3.length,
  auditedEnglishLogicalRecords: records,
  discoveryPrototypeCount: SYL_DISCOVERY_PROTOTYPES_V3.length,
  observed: {
    premiseForms: [...premiseForms].sort(),
    taskKinds: [...taskKinds].sort(),
    topologies: [...topologies].sort(),
    semanticStatuses: [...semanticStatuses].sort(),
    taskStatuses: [...taskStatuses].sort(),
    proofTypes: [...proofTypes].sort(),
    diagramModes: [...diagramModes].sort(),
    reasonCodes: [...reasonCodes].sort(),
    witnessRelations: [...witnessRelations].sort(),
    maxRuntimeWitnesses: maxWitnesses,
    maxPrototypeWitnessRegions: Number(threeWitness.evidence.occupiedRegionCount),
    existenceDependencies: [...existenceDependencies].sort(),
  },
  requiredCoverage,
  openGaps,
  executablePrototypeCoverage,
  governedDecisions,
  closeoutAudits: SYL_QL_DISCOVERY_STATE_V3.requiredCloseoutAudits,
  remainingFreezeBlockers: [
    "source saturation and source-profile sign-off",
    "QL merge/split and duplicate-authority audit",
    "native English/Hindi/Punjabi editorial review",
    "mobile diagram human review across representative modes",
    "immutable review decisions for the final discovered archetype inventory",
  ],
  decision: openGaps.length === 0
    ? "All listed automated coverage decisions are resolved by runtime coverage, executable prototypes, governed exclusions or rejection rules. Permanent QL allocation remains prohibited until the remaining human/source/merge-split closeout audits finish."
    : `${openGaps.length} unresolved automated coverage gaps remain. Permanent QL allocation is prohibited.`,
};

const outputDir = process.env.SYL_DISCOVERY_DIR
  ? resolve(process.env.SYL_DISCOVERY_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-discovery-v3");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "syl-001-ql-gap-discovery-v3.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, outputDir }, null, 2));
