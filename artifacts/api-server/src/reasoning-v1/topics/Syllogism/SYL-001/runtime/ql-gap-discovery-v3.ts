import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateSylQuestion } from "./generator";
import {
  SYL_PROVISIONAL_QL_ARCHETYPES_V3,
  SYL_QL_DISCOVERY_STATE_V3,
} from "./provisional-ql-registry-v3";

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

const requiredCoverage = [
  { id: "EXPLICIT_SOME_NOT", covered: premiseForms.has("SOME_NOT"), note: "Explicit Some A are not B premise." },
  { id: "NOT_ALL", covered: premiseForms.has("NOT_ALL"), note: "Not all A are B normalization." },
  { id: "A_FEW", covered: premiseForms.has("A_FEW"), note: "A few A are B." },
  { id: "ONLY_A_FEW", covered: premiseForms.has("ONLY_A_FEW"), note: "Only a few A are B." },
  { id: "PLAIN_FEW", covered: premiseForms.has("FEW"), note: "Plain Few remains source-profile blocked." },
  { id: "IDENTITY", covered: premiseForms.has("IDENTITY"), note: "Identity/equality relation." },
  { id: "CONTRADICTORY_STATEMENTS", covered: semanticStatuses.has("PREMISES_INCONSISTENT"), note: "Intentional inconsistent-premise task." },
  { id: "IRRELEVANT_PREMISE", covered: false, note: "Dedicated irrelevant-premise reasoning mode is not yet represented." },
  { id: "REDUNDANT_PREMISE", covered: false, note: "Dedicated redundant-premise mode is not yet represented." },
  { id: "SAME_VS_DIFFERENT_WITNESS", covered: witnessRelations.has("MAY_BE_SAME_OR_DIFFERENT"), note: "Witness identity is represented, but dedicated task coverage still needs manual audit." },
  { id: "TWO_WITNESS", covered: maxWitnesses >= 2, note: "At least two required witnesses." },
  { id: "THREE_WITNESS", covered: maxWitnesses >= 3, note: "At least three required witnesses." },
  { id: "ALL_PAIR_MASKS", covered: taskKinds.has("TWO_CONCLUSION_FOLLOW_MASK"), note: "All semantic pair masks require distribution audit." },
  { id: "THREE_CONCLUSION_MASKS", covered: taskKinds.has("THREE_CONCLUSION_FOLLOW_MASK") || taskKinds.has("MIXED_THREE_CONCLUSION_MASK"), note: "Three-conclusion mask family." },
  { id: "EITHER_OR_VALID_INVALID", covered: taskKinds.has("TWO_CONCLUSION_EITHER_OR") && taskKinds.has("CLASSIFY_CONCLUSION_PAIR"), note: "Valid and invalid pair classification." },
  { id: "ONLY_BOTH_DIRECTIONS", covered: premiseForms.has("ONLY") && premiseForms.has("ARE_ONLY"), note: "Only A are B and A are only B." },
  { id: "MIXED_FOUR_TERM", covered: topologies.has("MIXED"), note: "Mixed topology exists; four-term distribution needs manual confirmation." },
  { id: "BRANCHING", covered: topologies.has("BRANCHING"), note: "Branching topology." },
  { id: "CONVERGING", covered: topologies.has("CONVERGING"), note: "Converging topology." },
  { id: "DEFINITE_TASK", covered: taskKinds.has("SELECT_DEFINITE_CONCLUSION"), note: "Definite conclusion task." },
  { id: "POSSIBILITY_TASK", covered: taskKinds.has("SELECT_GENUINE_POSSIBILITY"), note: "Genuine possibility task." },
  { id: "IMPOSSIBLE_TASK", covered: taskKinds.has("SELECT_IMPOSSIBLE_CONCLUSION"), note: "Impossible conclusion task." },
  { id: "NON_FOLLOWING_TASK", covered: taskKinds.has("SELECT_NON_FOLLOWING_CONCLUSION"), note: "Non-following countermodel task." },
];

const gaps = requiredCoverage.filter((entry) => !entry.covered);
const report = {
  authority: SYL_QL_DISCOVERY_STATE_V3.authority,
  status: "OPEN",
  freezePermitted: false,
  provisionalArchetypeCount: SYL_PROVISIONAL_QL_ARCHETYPES_V3.length,
  auditedEnglishLogicalRecords: records,
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
    maxWitnesses,
    existenceDependencies: [...existenceDependencies].sort(),
  },
  requiredCoverage,
  openGaps: gaps,
  closeoutAudits: SYL_QL_DISCOVERY_STATE_V3.requiredCloseoutAudits,
  decision: gaps.length === 0
    ? "Automated coverage has no listed gap, but native review and merge/split audits still block freeze."
    : `${gaps.length} explicit coverage gaps remain. Permanent QL allocation is prohibited.`,
};

const outputDir = process.env.SYL_DISCOVERY_DIR
  ? resolve(process.env.SYL_DISCOVERY_DIR)
  : resolve(process.cwd(), "artifacts/api-server/dist/reasoning-v1/syl-001-discovery-v3");
mkdirSync(outputDir, { recursive: true });
writeFileSync(resolve(outputDir, "syl-001-ql-gap-discovery-v3.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, outputDir }, null, 2));
