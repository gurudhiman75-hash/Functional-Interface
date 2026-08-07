import assert from "node:assert/strict";
import {
  SAP_CP001_PERMANENT_QL_IDS,
  SAP_CP001_TEMPLATE_TO_PERMANENT_QL,
  SAP_PERMANENT_QL_BY_ID,
  SAP_PERMANENT_QL_REGISTRY,
  SAP_PERMANENT_QL_REGISTRY_STATE,
} from "../../SAP-PERMANENT-QL-REGISTRY";
import {
  SAP_CP001_ALL_PROTOTYPE_IDS,
  SAP_CP001_ENGLISH_TEMPLATE_IDS,
  SAP_CP001_ENGLISH_TEMPLATE_MAP,
  SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL,
} from "./SAP-CP-001-ENGLISH-TEMPLATE-PROPOSAL";
import { generateSapCp001EnglishCandidate } from "./english-freeze/runtime";
import { generateSapCp001PermanentEnglishSweep } from "./permanent-runtime/runtime";

const permanentIds = [...SAP_CP001_PERMANENT_QL_IDS];
const cp001Registry = SAP_PERMANENT_QL_REGISTRY.filter((entry) => entry.checkpointId === "SAP-CP-001");
const registryIds = cp001Registry.map((entry) => entry.permanentQlId);
const registryTemplates = cp001Registry.map((entry) => entry.templateId);

assert.equal(SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL.length, 16);
assert.equal(SAP_CP001_ENGLISH_TEMPLATE_IDS.length, 16);
assert.equal(SAP_CP001_PERMANENT_QL_IDS.length, 16);
assert.equal(cp001Registry.length, 16);
assert.equal(new Set(permanentIds).size, 16);
assert.equal(new Set(registryIds).size, 16);
assert.equal(new Set(registryTemplates).size, 16);
assert.deepEqual(registryIds, permanentIds);
assert.deepEqual(registryTemplates, [...SAP_CP001_ENGLISH_TEMPLATE_IDS]);

for (let index = 0; index < permanentIds.length; index += 1) {
  assert.equal(permanentIds[index], `SAP-QL-${String(index + 1).padStart(3, "0")}`);
}

for (const template of SAP_CP001_ENGLISH_TEMPLATE_PROPOSAL) {
  const permanentQlId = SAP_CP001_TEMPLATE_TO_PERMANENT_QL[template.temporaryTemplateId];
  const registryEntry = SAP_PERMANENT_QL_BY_ID[permanentQlId];
  assert.equal(registryEntry.checkpointId, "SAP-CP-001");
  assert.equal(registryEntry.templateId, template.temporaryTemplateId);
  assert.equal(registryEntry.title, template.title);
  assert.equal(registryEntry.solveAuthority, template.solveAuthority);
  assert.equal(registryEntry.answerSemantic, template.answerSemantic);
  assert.deepEqual(registryEntry.taskDirections, template.taskDirections);
  assert.deepEqual(registryEntry.representations, template.representations);
  assert.deepEqual(registryEntry.prototypeAncestry, template.prototypeAncestry);
  assert.equal(registryEntry.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(registryEntry.englishStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(registryEntry.active, false);
  assert.equal(registryEntry.questionStudioDiscoverable, false);
  assert.equal(registryEntry.questionBankWritable, false);
  assert.equal(registryEntry.testEligible, false);
  assert.equal(registryEntry.publiclyPublishable, false);
}

assert.ok(SAP_PERMANENT_QL_REGISTRY_STATE.registryVersion >= 2);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.cp001Range, "SAP-QL-001..SAP-QL-016");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.activeQlCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.questionStudioDiscoverableCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.questionBankWritableCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.testEligibleCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.publiclyPublishableCount, 0);

const packages = generateSapCp001PermanentEnglishSweep(100);
assert.equal(packages.length, 1_700);
const packageCountByQl = new Map<string, number>();
const difficultyByQl = new Map<string, Set<string>>();
const answerPositionsByQl = new Map<string, Set<number>>();
const prototypesByQl = new Map<string, Set<string>>();

for (const pkg of packages) {
  const expectedTemplate = SAP_CP001_ENGLISH_TEMPLATE_MAP[pkg.temporaryPrototypeId];
  const expectedQl = SAP_CP001_TEMPLATE_TO_PERMANENT_QL[expectedTemplate];
  assert.equal(pkg.templateId, expectedTemplate);
  assert.equal(pkg.proposedTemplateId, expectedTemplate);
  assert.equal(pkg.permanentQlId, expectedQl);
  assert.equal(pkg.registryEntry.permanentQlId, expectedQl);
  assert.equal(pkg.registryEntry.templateId, expectedTemplate);
  assert.equal(pkg.registryEntry.checkpointId, "SAP-CP-001");
  assert.equal(pkg.reviewDecision, "APPROVED_FOR_PERMANENT_IDENTITY");
  assert.equal(pkg.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(pkg.canonicalAnswer, pkg.verifierAnswer);
  assert.equal(pkg.options.length, 4);
  assert.equal(new Set(pkg.options.map((option) => option.value)).size, 4);
  assert.equal(pkg.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(pkg.options[pkg.correctIndex]?.isCorrect, true);
  assert.equal(pkg.lifecycle.permanentQlId, expectedQl);
  assert.equal(pkg.technicalDetails.lifecycle.permanentQlId, expectedQl);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  packageCountByQl.set(expectedQl, (packageCountByQl.get(expectedQl) ?? 0) + 1);
  const difficulties = difficultyByQl.get(expectedQl) ?? new Set<string>();
  difficulties.add(pkg.difficulty);
  difficultyByQl.set(expectedQl, difficulties);
  const positions = answerPositionsByQl.get(expectedQl) ?? new Set<number>();
  positions.add(pkg.correctIndex);
  answerPositionsByQl.set(expectedQl, positions);
  const prototypes = prototypesByQl.get(expectedQl) ?? new Set<string>();
  prototypes.add(pkg.temporaryPrototypeId);
  prototypesByQl.set(expectedQl, prototypes);
}

for (const permanentQlId of SAP_CP001_PERMANENT_QL_IDS) {
  const registryEntry = SAP_PERMANENT_QL_BY_ID[permanentQlId];
  assert.equal(packageCountByQl.get(permanentQlId), registryEntry.prototypeAncestry.length * 100);
  assert.deepEqual([...difficultyByQl.get(permanentQlId)!].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.deepEqual([...answerPositionsByQl.get(permanentQlId)!].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...prototypesByQl.get(permanentQlId)!].sort(), [...registryEntry.prototypeAncestry].sort());
}

for (const prototypeId of SAP_CP001_ALL_PROTOTYPE_IDS) {
  assert.equal(generateSapCp001EnglishCandidate(prototypeId, 1).permanentQlId, null);
}

console.log(JSON.stringify({
  status: "PASS_SAP_CP001_PERMANENT_ALLOCATION_AUTHORITY",
  allocatedRange: SAP_PERMANENT_QL_REGISTRY_STATE.cp001Range,
  allocatedTemplateCount: cp001Registry.length,
  generatedPermanentPackages: packages.length,
  globalNextAvailableId: SAP_PERMANENT_QL_REGISTRY_STATE.nextAvailableId,
  activeQlCount: 0,
}, null, 2));
