import assert from "node:assert/strict";
import {
  SAP_CP002_ALL_PROTOTYPE_IDS,
  SAP_CP002_AUTHORITY_MAP,
  SAP_CP002_DESIGN_SOLVE_MODES,
  SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES,
  SAP_CP002_ENGLISH_TEMPLATE_IDS,
  SAP_CP002_FREEZE_STATE,
  SAP_CP002_TEMPLATE_MAP,
} from "./SAP-CP-002-AUTHORITY-AND-TEMPLATE-MAP";
import {
  generateSapCp002EnglishFrozenCandidate,
  generateSapCp002EnglishFrozenSweep,
  generateSapCp002EnglishReviewExport,
} from "./english-freeze/runtime";
import {
  SAP_CP002_PERMANENT_QL_IDS,
  SAP_CP002_TEMPLATE_TO_PERMANENT_QL,
  generateSapCp002PermanentEnglishSweep,
} from "./permanent-runtime/runtime";
import {
  SAP_PERMANENT_QL_BY_ID,
  SAP_PERMANENT_QL_REGISTRY,
  SAP_PERMANENT_QL_REGISTRY_STATE,
} from "../../SAP-PERMANENT-QL-REGISTRY";

assert.equal(SAP_CP002_DESIGN_SOLVE_MODES.length, 21);
assert.equal(SAP_CP002_ALL_PROTOTYPE_IDS.length, 19);
assert.equal(SAP_CP002_ENGLISH_TEMPLATE_IDS.length, 17);
assert.equal(SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES.length, 17);
assert.equal(SAP_CP002_PERMANENT_QL_IDS.length, 17);
assert.equal(Object.keys(SAP_CP002_AUTHORITY_MAP).length, 21);
assert.equal(new Set(Object.values(SAP_CP002_AUTHORITY_MAP)).size, 19);
assert.equal(new Set(Object.values(SAP_CP002_TEMPLATE_MAP)).size, 17);

for (const solveMode of SAP_CP002_DESIGN_SOLVE_MODES) {
  assert.ok(SAP_CP002_ALL_PROTOTYPE_IDS.includes(SAP_CP002_AUTHORITY_MAP[solveMode] as never));
}
for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
  assert.ok(Object.values(SAP_CP002_AUTHORITY_MAP).includes(prototypeId));
  assert.ok(SAP_CP002_TEMPLATE_MAP[prototypeId]);
}

assert.equal(
  SAP_CP002_AUTHORITY_MAP.evaluateFractionSumOrDifference,
  SAP_CP002_AUTHORITY_MAP.evaluateFractionExpressionWithDifferentDenominators,
);
assert.equal(
  SAP_CP002_AUTHORITY_MAP.evaluateSignedFractionExpression,
  SAP_CP002_AUTHORITY_MAP.evaluateFractionExpressionWithBrackets,
);
assert.equal(
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-MIXED-FRACTION-OPERATION-CHAIN"],
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-FRACTION-EXPRESSION-INTEGER-PART"],
);
assert.equal(
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-MISSING-NUMERATOR"],
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-MISSING-DENOMINATOR"],
);
assert.notEqual(
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-NESTED-COMPLEX-FRACTION"],
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-BOUNDED-CONTINUED-FRACTION"],
);
assert.notEqual(
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-FRACTION-DIVISION-RECIPROCAL"],
  SAP_CP002_TEMPLATE_MAP["SAP-CP002-PROT-RECIPROCAL-EXPRESSION"],
);

const frozen = generateSapCp002EnglishFrozenSweep(100);
const review = generateSapCp002EnglishReviewExport();
const permanent = generateSapCp002PermanentEnglishSweep(100);
assert.equal(frozen.length, 1_900);
assert.equal(review.length, 57);
assert.equal(permanent.length, 1_900);

const BANNED = /\b(?:AST|RPN|canonical evaluator|verifier|prototype|seed|fingerprint)\b/i;
const framesByPrototype = new Map<string, Set<string>>();
const fingerprintsByPrototype = new Map<string, Set<string>>();
const qlStats = new Map<string, { count: number; positions: Set<number>; difficulties: Set<string>; prototypes: Set<string> }>();

for (const item of frozen) {
  assert.equal(item.permanentQlId, null);
  assert.equal(item.editorialStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
  assert.equal(item.reviewDecision, "APPROVED_FOR_PERMANENT_IDENTITY");
  assert.equal(item.templateId, SAP_CP002_TEMPLATE_MAP[item.temporaryPrototypeId]);
  assert.equal(item.canonicalAnswer, item.verifierAnswer);
  assert.equal(item.options.length, 4);
  assert.equal(new Set(item.options.map((option) => option.value)).size, 4);
  assert.equal(item.options.filter((option) => option.isCorrect).length, 1);
  assert.equal(item.options[item.correctIndex]?.isCorrect, true);
  assert.ok(item.stem.length >= 20);
  assert.doesNotMatch(item.stem, BANNED);
  assert.ok(item.explanation.coreConcept.length >= 25);
  assert.ok(item.explanation.givenDataAndStrategy.length >= 25);
  assert.ok(item.explanation.stepByStep.length >= 3);
  assert.equal(item.explanation.commonTraps.length, 3);
  assert.ok(item.explanation.finalAnswer.includes(item.canonicalAnswer));
  assert.equal(item.lifecycle.permanentQlId, null);
  assert.equal(item.lifecycle.active, false);
  assert.equal(item.lifecycle.questionStudioDiscoverable, false);
  assert.equal(item.lifecycle.questionBankWritable, false);
  assert.equal(item.lifecycle.testEligible, false);
  assert.equal(item.lifecycle.publiclyPublishable, false);

  const frames = framesByPrototype.get(item.temporaryPrototypeId) ?? new Set<string>();
  frames.add(item.stemFrameId);
  framesByPrototype.set(item.temporaryPrototypeId, frames);
  const fingerprints = fingerprintsByPrototype.get(item.temporaryPrototypeId) ?? new Set<string>();
  fingerprints.add(item.mathematicalFingerprint);
  fingerprintsByPrototype.set(item.temporaryPrototypeId, fingerprints);
}

for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
  assert.equal(framesByPrototype.get(prototypeId)?.size, 4, `${prototypeId} must have four approved stem frames`);
  assert.ok((fingerprintsByPrototype.get(prototypeId)?.size ?? 0) >= 45, `${prototypeId} lacks mathematical diversity`);
}

for (const item of review) {
  assert.equal(item.permanentQlId, null);
  assert.equal(item.editorialStatus, "ENGLISH_MANUAL_FREEZE_APPROVED");
}
for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
  const samples = review.filter((item) => item.temporaryPrototypeId === prototypeId);
  assert.equal(samples.length, 3);
  assert.deepEqual(samples.map((item) => item.difficulty).sort(), ["EASY", "HARD", "MEDIUM"]);
}

for (const pkg of permanent) {
  const expectedTemplate = SAP_CP002_TEMPLATE_MAP[pkg.temporaryPrototypeId];
  const expectedQl = SAP_CP002_TEMPLATE_TO_PERMANENT_QL[expectedTemplate];
  assert.equal(pkg.templateId, expectedTemplate);
  assert.equal(pkg.permanentQlId, expectedQl);
  assert.equal(pkg.allocationStatus, "PERMANENT_ID_ALLOCATED_INACTIVE");
  assert.equal(pkg.lifecycle.permanentQlId, expectedQl);
  assert.equal(pkg.lifecycle.identityStatus, "PERMANENT_ID_ALLOCATED");
  assert.equal(pkg.lifecycle.contentStatus, "ENGLISH_FROZEN");
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);

  const stat = qlStats.get(expectedQl) ?? { count: 0, positions: new Set<number>(), difficulties: new Set<string>(), prototypes: new Set<string>() };
  stat.count += 1;
  stat.positions.add(pkg.correctIndex);
  stat.difficulties.add(pkg.difficulty);
  stat.prototypes.add(pkg.temporaryPrototypeId);
  qlStats.set(expectedQl, stat);
}

for (const template of SAP_CP002_ENGLISH_TEMPLATE_AUTHORITIES) {
  const ql = SAP_CP002_TEMPLATE_TO_PERMANENT_QL[template.templateId];
  const stat = qlStats.get(ql)!;
  assert.equal(stat.count, template.prototypeAncestry.length * 100);
  assert.deepEqual([...stat.positions].sort(), [0, 1, 2, 3]);
  assert.deepEqual([...stat.difficulties].sort(), ["EASY", "HARD", "MEDIUM"]);
  assert.deepEqual([...stat.prototypes].sort(), [...template.prototypeAncestry].sort());
  const registryEntry = SAP_PERMANENT_QL_BY_ID[ql];
  assert.equal(registryEntry.checkpointId, "SAP-CP-002");
  assert.equal(registryEntry.templateId, template.templateId);
  assert.deepEqual([...registryEntry.prototypeAncestry].sort(), [...template.prototypeAncestry].sort());
}

const allIds = SAP_PERMANENT_QL_REGISTRY.map((entry) => entry.permanentQlId);
assert.equal(SAP_PERMANENT_QL_REGISTRY.length, 33);
assert.equal(new Set(allIds).size, 33);
for (let index = 0; index < 33; index += 1) {
  assert.equal(allIds[index], `SAP-QL-${String(index + 1).padStart(3, "0")}`);
}
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.registryVersion, 2);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.allocatedCheckpointCount, 2);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.allocatedTemplateCount, 33);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.cp002Range, "SAP-QL-017..SAP-QL-033");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.nextAvailableId, "SAP-QL-034");
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.activeQlCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.questionStudioDiscoverableCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.questionBankWritableCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.testEligibleCount, 0);
assert.equal(SAP_PERMANENT_QL_REGISTRY_STATE.publiclyPublishableCount, 0);

for (const prototypeId of SAP_CP002_ALL_PROTOTYPE_IDS) {
  assert.equal(generateSapCp002EnglishFrozenCandidate(prototypeId, 1).permanentQlId, null);
}

assert.equal(SAP_CP002_FREEZE_STATE.designSolveModeCount, 21);
assert.equal(SAP_CP002_FREEZE_STATE.executablePrototypeCount, 19);
assert.equal(SAP_CP002_FREEZE_STATE.approvedEnglishTemplateCount, 17);
assert.equal(SAP_CP002_FREEZE_STATE.permanentQlRange, "SAP-QL-017..SAP-QL-033");
assert.equal(SAP_CP002_FREEZE_STATE.nextAvailablePermanentQlId, "SAP-QL-034");

console.log(JSON.stringify({
  status: "PASS_SAP_CP002_FINAL_FREEZE_ALLOCATION_AUTHORITY",
  designSolveModes: 21,
  executablePrototypes: 19,
  approvedTemplates: 17,
  frozenEnglishCandidates: frozen.length,
  reviewExportItems: review.length,
  permanentPackages: permanent.length,
  allocatedRange: "SAP-QL-017..SAP-QL-033",
  cumulativeRange: SAP_PERMANENT_QL_REGISTRY_STATE.allocatedRange,
  nextAvailableId: SAP_PERMANENT_QL_REGISTRY_STATE.nextAvailableId,
  activeQlCount: 0,
  questionStudioDiscoverableCount: 0,
  questionBankWritableCount: 0,
  testEligibleCount: 0,
  publiclyPublishableCount: 0,
}, null, 2));
