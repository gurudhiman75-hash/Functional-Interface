import { matchEmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import {
  EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generateEmbeddedFigurePermanentEnglishBatchV1,
  generateEmbeddedFigurePermanentEnglishQuestionV1,
} from "../foundation/spatial/embedded-figure-permanent-english-runtime-v1";
import { generateEmbeddedFigureWholeOptionConnectivityQuestionV1 } from "../foundation/spatial/embedded-figure-whole-option-connectivity-remediation-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5 } from "../foundation/spatial/spatial-permanent-ql-allocation-v5";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const corpus = Array.from({ length: 240 }, (_, index) => generateEmbeddedFigurePermanentEnglishQuestionV1(`EMB-PERM-EN-${index}`));
const geometries = new Set<string>();
const contentFingerprints = new Set<string>();
const answerCounts = [0, 0, 0, 0];
const difficultyCounts: Record<string, number> = { L1: 0, L2: 0, L3: 0 };
let solverChecks = 0;
let sourceParityChecks = 0;
let connectedOptionChecks = 0;

for (const question of corpus) {
  assert(question.permanentQlId === "SPA-QL-041", `${question.seed}: permanent QL mismatch.`);
  assert(question.permanentQlTitle === "Embedded figure identification without rotation", `${question.seed}: permanent title mismatch.`);
  assert(question.chapterCode === "EMB-001" && question.proposalId === "EMB-PROP-01", `${question.seed}: chapter/proposal trace changed.`);
  assert(question.language === "en" && question.locale === "en-IN", `${question.seed}: English locale mismatch.`);
  assert(question.qlStatus === "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME", `${question.seed}: runtime status mismatch.`);
  assert(question.equivalencePolicy === "FIXED_ORIENTATION", `${question.seed}: policy changed.`);
  assert(question.allocationAuthorityId === SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId, `${question.seed}: allocation authority mismatch.`);
  assert(question.runtimeAuthorityId === EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId, `${question.seed}: runtime authority mismatch.`);
  assert(question.lifecycle.permanentQlAllocated && question.lifecycle.englishRuntimeImplemented, `${question.seed}: permanent/runtime lifecycle flags missing.`);
  assert(!question.lifecycle.englishImplementationFrozen, `${question.seed}: runtime test froze English before freeze authority.`);
  assert(!question.lifecycle.questionStudioRegistered && !question.lifecycle.questionBankWritable && !question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable && !question.lifecycle.automaticStudentPublication, `${question.seed}: downstream lifecycle leaked.`);
  assert(question.connectivityValidation.finalComponentCounts.every((count) => count === 1), `${question.seed}: disconnected option returned.`);
  connectedOptionChecks += 4;

  const solved = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const solvedIndices = solved.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
  assert(solvedIndices.length === 1 && solvedIndices[0] === question.correctIndex, `${question.seed}: exact solver disagrees with runtime answer.`);
  solverChecks += 4;

  const source = generateEmbeddedFigureWholeOptionConnectivityQuestionV1(question.seed);
  assert(source.targetSvg === question.targetSvg, `${question.seed}: permanent runtime changed target SVG.`);
  assert(JSON.stringify(source.optionSvgs) === JSON.stringify(question.optionSvgs), `${question.seed}: permanent runtime changed option SVGs.`);
  assert(source.correctIndex === question.correctIndex && source.answer === question.answer, `${question.seed}: permanent runtime changed answer.`);
  assert(source.geometryFingerprint === question.geometryFingerprint, `${question.seed}: permanent runtime changed geometry fingerprint.`);
  assert(source.contentFingerprint === question.contentFingerprint, `${question.seed}: permanent runtime changed content fingerprint.`);
  assert(JSON.stringify(source.explanation) === JSON.stringify(question.explanation), `${question.seed}: permanent runtime changed explanation.`);
  sourceParityChecks += 1;

  const replay = generateEmbeddedFigurePermanentEnglishQuestionV1(question.seed);
  assert(JSON.stringify(question) === JSON.stringify(replay), `${question.seed}: permanent runtime replay failed.`);

  assert(!geometries.has(question.geometryFingerprint), `${question.seed}: geometry duplicate in permanent corpus.`);
  assert(!contentFingerprints.has(question.contentFingerprint), `${question.seed}: content duplicate in permanent corpus.`);
  geometries.add(question.geometryFingerprint);
  contentFingerprints.add(question.contentFingerprint);
  answerCounts[question.correctIndex] += 1;
  difficultyCounts[question.difficulty] += 1;
}

assert(geometries.size === 240 && contentFingerprints.size === 240, "Permanent English corpus is not unique across 240 questions.");
assert(JSON.stringify(answerCounts) === JSON.stringify([60, 60, 60, 60]), `Permanent answer positions are not balanced: ${JSON.stringify(answerCounts)}.`);
assert(JSON.stringify(difficultyCounts) === JSON.stringify({ L1: 80, L2: 80, L3: 80 }), `Permanent difficulty bands are not balanced: ${JSON.stringify(difficultyCounts)}.`);
assert(connectedOptionChecks === 960, `Expected 960 connected-option checks, got ${connectedOptionChecks}.`);
assert(sourceParityChecks === 240, `Expected 240 source parity checks, got ${sourceParityChecks}.`);
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlCount === 41 && SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId === "SPA-QL-042", "Permanent QL authority drifted during runtime proof.");

const batch = generateEmbeddedFigurePermanentEnglishBatchV1({ seed: "EMB-PERM-BATCH", count: 50 });
assert(batch.length === 50, "Permanent English batch did not return 50 items.");
assert(new Set(batch.map((question) => question.geometryFingerprint)).size === 50, "Permanent English batch contains geometry duplicates.");
assert(JSON.stringify(batch) === JSON.stringify(generateEmbeddedFigurePermanentEnglishBatchV1({ seed: "EMB-PERM-BATCH", count: 50 })), "Permanent English batch replay failed.");

console.log(JSON.stringify({
  status: "PASS_EMB_001_PERMANENT_ENGLISH_RUNTIME_V1",
  authorityId: EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
  permanentQlId: EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.permanentQlId,
  corpusSize: corpus.length,
  uniqueGeometryFingerprints: geometries.size,
  uniqueContentFingerprints: contentFingerprints.size,
  answerCounts,
  difficultyCounts,
  solverChecks,
  connectedOptionChecks,
  sourceParityChecks,
  batchProofCount: batch.length,
  governance: EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.governance,
  nextGate: EMBEDDED_FIGURE_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.nextGate,
}, null, 2));
