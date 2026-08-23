import assert from "node:assert/strict";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import {
  STA_SEMANTIC_EXTENSION_V3_AUTHORITIES,
  STA_SEMANTIC_EXTENSION_V3_BY_QL,
  STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS,
  STA_SEMANTIC_EXTENSION_V3_SOURCES,
} from "./semantic-extension-v3-authorities.ts";
import {
  assertStaExtensionScenarioOracleParity,
  generateStaSemanticExtensionV3Question,
  STA_SEMANTIC_EXTENSION_V3_VERSION,
} from "./semantic-extension-v3-generator.ts";
import type { StaExtensionQlId } from "./semantic-extension-v3-types.ts";

const CASES_PER_QL = Number(process.env.STA_EXTENSION_V3_CASES_PER_QL ?? 4096);
const QLS: readonly StaExtensionQlId[] = ["STA-QL-005", "STA-QL-006"];

assert.equal(STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.length, 32, "Extension V3 must contain exactly 32 reviewed authorities");
assert.equal(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-005"].length, 16, "QL005 must contain 16 authorities");
assert.equal(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-006"].length, 16, "QL006 must contain 16 authorities");
assert.equal(new Set(STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.map((scenario) => scenario.scenarioId)).size, 32, "Extension scenario IDs must be unique");

const sourceIds = new Set(STA_SEMANTIC_EXTENSION_V3_SOURCES.map((source) => source.evidenceId));
for (const scenario of STA_SEMANTIC_EXTENSION_V3_AUTHORITIES) {
  assert.ok(sourceIds.has(scenario.sourceAuthorityId), `${scenario.scenarioId}: missing source authority`);
  assertStaExtensionScenarioOracleParity(scenario);
  assert.ok(scenario.statementVariants.length >= 2, `${scenario.scenarioId}: requires at least two statement variants`);
  assert.equal(scenario.candidates.length, 4, `${scenario.scenarioId}: extension authority should expose four curated candidates`);
  assert.ok(scenario.allowedCandidateCounts.includes(2), `${scenario.scenarioId}: two-assumption surface missing`);
  assert.ok(scenario.allowedCandidateCounts.includes(3), `${scenario.scenarioId}: three-assumption surface missing`);
}

assert.ok(STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS.DIRECT_PYQ >= 8, "Extension must be anchored in multiple direct-PYQ-shaped authorities");
assert.ok(STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS.MEMORY_BASED_PYQ >= 1, "Extension memory-PYQ provenance missing");
assert.ok(STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS.TARGET_EXAM_PREP_PATTERN >= 1, "Extension target-pattern provenance missing");
assert.ok(STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS.CONTROLLED_SYNTHESIS >= 1, "Extension controlled-synthesis provenance missing");

const coreDiscourseActs = new Set(
  Object.values(STA_ENGLISH_CORPUS_BY_QL).flatMap((pool) => pool.map((scenario) => scenario.discourseAct)),
);
const coreRelations = new Set(
  Object.values(STA_ENGLISH_CORPUS_BY_QL).flatMap((pool) => pool.flatMap((scenario) => scenario.hiddenDependencies.map((dependency) => dependency.relation))),
);

assert.ok(!coreDiscourseActs.has("ADVERTISEMENT"), "ADVERTISEMENT already exists in frozen core; QL005 collision review required");
assert.ok(!coreDiscourseActs.has("APPEAL"), "APPEAL already exists in frozen core; QL005 collision review required");
for (const relation of ["COMPARABILITY", "MEASUREMENT", "REPRESENTATIVENESS"] as const) {
  assert.ok(!coreRelations.has(relation), `${relation} already exists in frozen core; QL006 collision review required`);
}

const ql005Relations = new Set(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-005"].flatMap((scenario) => scenario.hiddenDependencies.map((dependency) => dependency.relation)));
for (const relation of ["VALUE", "BEHAVIOUR"] as const) assert.ok(ql005Relations.has(relation), `QL005 must exercise ${relation}`);
const ql005Acts = new Set(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-005"].map((scenario) => scenario.discourseAct));
assert.deepEqual([...ql005Acts].sort(), ["ADVERTISEMENT", "APPEAL"], "QL005 must own advertisement and appeal acts only");

const ql006Relations = new Set(STA_SEMANTIC_EXTENSION_V3_BY_QL["STA-QL-006"].flatMap((scenario) => scenario.hiddenDependencies.map((dependency) => dependency.relation)));
for (const relation of ["COMPARABILITY", "MEASUREMENT", "REPRESENTATIVENESS"] as const) assert.ok(ql006Relations.has(relation), `QL006 must exercise ${relation}`);

let generatedQuestions = 0;
let generatedCandidates = 0;
let implicit = 0;
let notImplicit = 0;
const reached = new Map<StaExtensionQlId, Set<string>>(QLS.map((ql) => [ql, new Set<string>()]));
const answerPositions = new Map<StaExtensionQlId, number[]>(QLS.map((ql) => [ql, [0, 0, 0, 0]]));
const candidateCounts = new Map<StaExtensionQlId, Set<number>>(QLS.map((ql) => [ql, new Set<number>()]));
const answerCardinalities = new Map<StaExtensionQlId, Set<number>>(QLS.map((ql) => [ql, new Set<number>()]));
const difficulties = new Map<StaExtensionQlId, Set<string>>(QLS.map((ql) => [ql, new Set<string>()]));
const sourceProfiles = new Map<StaExtensionQlId, Set<string>>(QLS.map((ql) => [ql, new Set<string>()]));

for (const qlId of QLS) {
  for (let index = 0; index < CASES_PER_QL; index += 1) {
    const seed = `sta-extension-v3:${qlId}:${index}`;
    const question = generateStaSemanticExtensionV3Question(seed, qlId, "en-IN");
    const replay = generateStaSemanticExtensionV3Question(seed, qlId, "en-IN");
    assert.deepEqual(replay, question, `${seed}: deterministic replay failed`);
    assert.equal(question.extensionVersion, STA_SEMANTIC_EXTENSION_V3_VERSION);
    assert.equal(question.qlId, qlId);
    assert.equal(question.locale, "en-IN");
    assert.equal(question.oracleParity, true);
    assert.equal(question.lifecycle.coreQl001To004, "IMMUTABLE_FROZEN");
    assert.equal(question.lifecycle.semanticExtensionV3, "REVIEW_CANDIDATE");
    assert.equal(question.lifecycle.questionStudioDiscoverable, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    reached.get(qlId)!.add(question.scenarioId);
    answerPositions.get(qlId)![question.answerIndex] += 1;
    candidateCounts.get(qlId)!.add(question.candidates.length);
    answerCardinalities.get(qlId)!.add(question.answerSet.length);
    difficulties.get(qlId)!.add(question.difficulty);
    sourceProfiles.get(qlId)!.add(question.sourceProfile);
    generatedQuestions += 1;
    generatedCandidates += question.candidates.length;
    for (const candidate of question.candidates) {
      if (candidate.oracle.classification === "IMPLICIT") implicit += 1;
      else notImplicit += 1;
    }
  }
}

for (const qlId of QLS) {
  assert.equal(reached.get(qlId)!.size, 16, `${qlId}: all 16 authorities must be reached`);
  assert.deepEqual([...candidateCounts.get(qlId)!].sort(), [2, 3], `${qlId}: both 2- and 3-assumption forms must occur`);
  assert.ok(answerCardinalities.get(qlId)!.has(0), `${qlId}: neither/none answer cardinality missing`);
  assert.ok(answerCardinalities.get(qlId)!.has(1), `${qlId}: single-implicit answer cardinality missing`);
  assert.ok(answerCardinalities.get(qlId)!.has(2), `${qlId}: double-implicit answer cardinality missing`);
  assert.deepEqual([...difficulties.get(qlId)!].sort(), ["Easy", "Hard", "Medium"], `${qlId}: difficulty coverage incomplete`);
  assert.equal(sourceProfiles.get(qlId)!.size, 4, `${qlId}: source-profile coverage incomplete`);
  assert.ok(answerPositions.get(qlId)!.every((count) => count > 0), `${qlId}: every answer position must occur`);
}

assert.ok(implicit > 0 && notImplicit > 0, "Extension must generate both implicit and not-implicit candidates");

console.log("PASS_STA_001_SEMANTIC_EXTENSION_V3");
console.log(JSON.stringify({
  extensionVersion: STA_SEMANTIC_EXTENSION_V3_VERSION,
  coreQl001To004: "IMMUTABLE_FROZEN",
  extensionQls: QLS,
  authorities: STA_SEMANTIC_EXTENSION_V3_AUTHORITIES.length,
  authoritiesPerQl: Object.fromEntries(QLS.map((ql) => [ql, STA_SEMANTIC_EXTENSION_V3_BY_QL[ql].length])),
  sourceEvidenceCounts: STA_SEMANTIC_EXTENSION_V3_SOURCE_EVIDENCE_COUNTS,
  generatedQuestions,
  generatedCandidates,
  implicit,
  notImplicit,
  reachedAuthorities: Object.fromEntries(QLS.map((ql) => [ql, reached.get(ql)!.size])),
  answerPositions: Object.fromEntries(QLS.map((ql) => [ql, answerPositions.get(ql)])),
  candidateCounts: Object.fromEntries(QLS.map((ql) => [ql, [...candidateCounts.get(ql)!].sort()])),
  answerCardinalities: Object.fromEntries(QLS.map((ql) => [ql, [...answerCardinalities.get(ql)!].sort()])),
  difficulties: Object.fromEntries(QLS.map((ql) => [ql, [...difficulties.get(ql)!].sort()])),
  sourceProfiles: Object.fromEntries(QLS.map((ql) => [ql, [...sourceProfiles.get(ql)!].sort()])),
  ql005Relations: [...ql005Relations].sort(),
  ql006Relations: [...ql006Relations].sort(),
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
