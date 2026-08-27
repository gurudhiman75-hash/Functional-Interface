import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { matchEmbeddedGraphV1, type EmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import {
  EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1,
} from "../foundation/spatial/embedded-figure-english-freeze-v1";
import {
  EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generateEmbeddedFigurePermanentEnglishQuestionV1,
} from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import { EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/embedded-figure-product-owner-approval-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5 } from "../foundation/spatial/spatial-permanent-ql-allocation-v5";

function componentCount(graph: EmbeddedGraphV1): number {
  const adjacency = new Map<string, Set<string>>();
  for (const vertex of graph.vertices) adjacency.set(vertex.id, new Set());
  for (const edge of graph.edges) {
    adjacency.get(edge.a)?.add(edge.b);
    adjacency.get(edge.b)?.add(edge.a);
  }
  const unseen = new Set(graph.vertices.map((vertex) => vertex.id));
  let count = 0;
  while (unseen.size > 0) {
    count += 1;
    const start = unseen.values().next().value as string;
    unseen.delete(start);
    const queue = [start];
    while (queue.length > 0) {
      const current = queue.shift()!;
      for (const next of adjacency.get(current) ?? []) {
        if (!unseen.has(next)) continue;
        unseen.delete(next);
        queue.push(next);
      }
    }
  }
  return count;
}

assert.equal(EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorization.englishFreezeAllowed, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlCount, 41);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlRange, "SPA-QL-001..SPA-QL-041");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId, "SPA-QL-042");
assert.equal(EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance.englishRuntimeImplemented, true);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactAllocationGate.conclusion, "success");
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactRuntimeGate.conclusion, "success");
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactAllocationGate.headSha, "b8be2b4c7b2d54236e84bfd287e6199006cd6f4d");
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactRuntimeGate.headSha, "b8be2b4c7b2d54236e84bfd287e6199006cd6f4d");
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactAllocationGate.artifactDigest, "sha256:0e5ff0426479c87f972e9657366f2110d7c6982d959faf761804e8a140285231");
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactRuntimeGate.artifactDigest, "sha256:1313a13f6de3970c0d5213e38c5a069d13fbef894c78513eb9b17954b56bf83b");
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen, true);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiGenerationAllowed, true);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.localizationFrozen, false);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.questionBankWritesAuthorized, false);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.testEligibilityAuthorized, false);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.mergeAuthorized, false);
assert.equal(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance.deploymentAuthorized, false);

const frozenFieldSet = new Set<string>(EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.frozenFields);
for (const required of [
  "permanentQlId",
  "proposalId",
  "chapterCode",
  "equivalencePolicy",
  "targetGraph",
  "targetSvg",
  "optionGraphs",
  "optionSvgs",
  "correctIndex",
  "answer",
  "geometryFingerprint",
  "contentFingerprint",
  "stem",
  "explanation",
]) assert.equal(frozenFieldSet.has(required), true, `Freeze is missing required field ${required}.`);

const corpus = Array.from({ length: 240 }, (_, index) => generateEmbeddedFigurePermanentEnglishQuestionV1(`EMB-FREEZE-${index}`));
const geometryFingerprints = new Set<string>();
const contentFingerprints = new Set<string>();
const motifFamilies = new Set<string>();
const difficulties = new Set<string>();
const stems = new Set<number>();
const answers = new Set<number>();
let connectedOptionChecks = 0;
let solverChecks = 0;

for (const question of corpus) {
  assert.equal(question.permanentQlId, "SPA-QL-041", `${question.seed}: permanent QL drift.`);
  assert.equal(question.proposalId, "EMB-PROP-01", `${question.seed}: proposal drift.`);
  assert.equal(question.chapterCode, "EMB-001", `${question.seed}: chapter drift.`);
  assert.equal(question.language, "en", `${question.seed}: language drift.`);
  assert.equal(question.locale, "en-IN", `${question.seed}: locale drift.`);
  assert.equal(question.equivalencePolicy, "FIXED_ORIENTATION", `${question.seed}: equivalence policy drift.`);
  assert.equal(question.lifecycle.questionStudioRegistered, false, `${question.seed}: Question Studio leaked.`);
  assert.equal(question.lifecycle.questionBankWritable, false, `${question.seed}: Question Bank write leaked.`);
  assert.equal(question.lifecycle.testEligible, false, `${question.seed}: test eligibility leaked.`);
  assert.equal(question.lifecycle.publiclyPublishable, false, `${question.seed}: publication leaked.`);
  assert.equal(question.lifecycle.automaticStudentPublication, false, `${question.seed}: automatic publication leaked.`);

  for (const option of question.optionGraphs) {
    assert.equal(componentCount(option), 1, `${question.seed}: disconnected option in frozen runtime.`);
    connectedOptionChecks += 1;
  }
  const solved = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const matched = solved.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
  assert.deepEqual(matched, [question.correctIndex], `${question.seed}: frozen runtime lost unique answer.`);
  solverChecks += 4;

  assert.equal(geometryFingerprints.has(question.geometryFingerprint), false, `${question.seed}: duplicate geometry in freeze corpus.`);
  assert.equal(contentFingerprints.has(question.contentFingerprint), false, `${question.seed}: duplicate content in freeze corpus.`);
  geometryFingerprints.add(question.geometryFingerprint);
  contentFingerprints.add(question.contentFingerprint);
  motifFamilies.add(question.motifFamily);
  difficulties.add(question.difficulty);
  stems.add(question.stemVariant);
  answers.add(question.correctIndex);
}

assert.equal(geometryFingerprints.size, 240);
assert.equal(contentFingerprints.size, 240);
assert.equal(motifFamilies.size, 8);
assert.equal(difficulties.size, 3);
assert.equal(stems.size, 8);
assert.equal(answers.size, 4);
assert.equal(connectedOptionChecks, 960);
assert.equal(solverChecks, 960);

const localization = EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract;
assert.equal(localization.diagramsInvariant, true);
assert.equal(localization.optionOrderInvariant, true);
assert.equal(localization.answerInvariant, true);
assert.equal(localization.permanentQlIdInvariant, true);
assert.equal(localization.geometryFingerprintInvariant, true);
assert.equal(localization.canonicalContentFingerprintInvariant, true);
assert.deepEqual(localization.localizedFieldsOnly, ["permanentQlTitle", "stem", "explanation", "language", "locale"]);

const evidence = {
  status: "PASS_EMB_001_ENGLISH_FREEZE_V1",
  authorityId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  permanentQlId: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlId,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId,
  corpusSize: corpus.length,
  uniqueGeometryFingerprints: geometryFingerprints.size,
  uniqueContentFingerprints: contentFingerprints.size,
  motifFamilyCount: motifFamilies.size,
  difficultyBandCount: difficulties.size,
  stemVariantCount: stems.size,
  answerPositionCount: answers.size,
  connectedOptionChecks,
  solverChecks,
  exactAllocationGate: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactAllocationGate,
  exactRuntimeGate: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.exactRuntimeGate,
  localizationContract: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract,
  governance: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.governance,
  nextGate: EMBEDDED_FIGURE_ENGLISH_FREEZE_AUTHORITY_V1.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-english-freeze-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
