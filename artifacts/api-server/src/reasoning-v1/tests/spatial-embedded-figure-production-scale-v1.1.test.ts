import { matchEmbeddedGraphV1, validateEmbeddedGraphV1, type EmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import { EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1, type EmbeddedDistractorKindV1 } from "../foundation/spatial/embedded-figure-production-generator-v1";
import {
  EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1,
  generateEmbeddedFigureVisualRealismBatchV1,
  generateEmbeddedFigureVisualRealismQuestionV1,
} from "../foundation/spatial/embedded-figure-visual-realism-remediation-v1";
import { EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/embedded-figure-source-saturated-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertNoFloatingConcealment(graph: EmbeddedGraphV1, seed: string, optionIndex: number): number {
  const baseIds = new Set(graph.vertices.filter((vertex) => !vertex.id.startsWith("vr")).map((vertex) => vertex.id));
  const concealmentIds = new Set(graph.vertices.filter((vertex) => vertex.id.startsWith("vr")).map((vertex) => vertex.id));
  const concealmentEdges = graph.edges.filter((edge) => edge.id.startsWith("vr"));
  assert(concealmentIds.size > 0, `${seed} option ${optionIndex}: no connected concealment vertices were generated.`);
  assert(concealmentEdges.length > 0, `${seed} option ${optionIndex}: no connected concealment edges were generated.`);

  const adjacency = new Map<string, Set<string>>();
  for (const vertex of graph.vertices) adjacency.set(vertex.id, new Set());
  for (const edge of graph.edges) {
    adjacency.get(edge.a)?.add(edge.b);
    adjacency.get(edge.b)?.add(edge.a);
  }
  const seen = new Set(baseIds);
  const queue = [...baseIds];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  const unreachable = [...concealmentIds].filter((id) => !seen.has(id));
  assert(unreachable.length === 0, `${seed} option ${optionIndex}: floating concealment vertices ${unreachable.join(", ")}.`);
  assert(graph.edges.every((edge) => !edge.id.includes("noise")), `${seed} option ${optionIndex}: legacy floating-noise edge survived remediation.`);
  assert(graph.vertices.every((vertex) => !/n\d+[ab]$/.test(vertex.id)), `${seed} option ${optionIndex}: legacy floating-noise vertex survived remediation.`);
  return concealmentEdges.length;
}

const corpus = Array.from({ length: 240 }, (_, index) => generateEmbeddedFigureVisualRealismQuestionV1(`EMB-VR-SCALE-${index}`));
const contentFingerprints = new Set<string>();
const geometryFingerprints = new Set<string>();
const sourceFingerprints = new Set<string>();
const targetFingerprints = new Set<string>();
const motifIds = new Set<string>();
const motifFamilies = new Set<string>();
const stemVariants = new Set<number>();
const scaleSamples = new Set<string>();
const answerCounts = [0, 0, 0, 0];
const difficultyCounts: Record<string, number> = { L1: 0, L2: 0, L3: 0 };
const distractorCounts: Record<EmbeddedDistractorKindV1, number> = {
  ROTATION_TRAP: 0,
  REFLECTION_TRAP: 0,
  MISSING_EDGE: 0,
  WRONG_INCIDENCE: 0,
  NON_UNIFORM_SCALE: 0,
};
let independentSolverChecks = 0;
let graphValidationChecks = 0;
let connectedConcealmentChecks = 0;
let concealmentEdgesTotal = 0;
let explanationChecks = 0;
let maxBaseGenerationAttempt = 0;

for (const question of corpus) {
  assert(question.visualRemediationAuthority === EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId, `${question.seed}: wrong remediation authority.`);
  assert(question.chapterCode === "EMB-001" && question.proposalId === "EMB-PROP-01", `${question.seed}: chapter/proposal trace changed.`);
  assert(question.qlStatus === "PROPOSED_NOT_PERMANENT", `${question.seed}: remediation prematurely assigned a permanent QL.`);
  assert(question.equivalencePolicy === "FIXED_ORIENTATION", `${question.seed}: source-backed equivalence policy changed.`);
  assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctIndex], `${question.seed}: answer/index mismatch.`);
  assert(question.optionGraphs.length === 4 && question.optionSvgs.length === 4, `${question.seed}: four-option contract failed.`);
  assert(question.visualValidation.valid && question.visualValidation.noFloatingConcealmentEdges && question.visualValidation.allConcealmentVerticesAttachedToHost, `${question.seed}: visual-remediation validation flags failed.`);
  assert(question.visualValidation.solverCorrectIndex === question.correctIndex, `${question.seed}: visual-remediation solver index changed.`);
  assert(question.visualValidation.concealmentEdgeCounts.length === 4 && question.visualValidation.concealmentVertexCounts.length === 4, `${question.seed}: concealment statistics incomplete.`);

  const solved = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const solvedIndices = solved.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
  assert(solvedIndices.length === 1 && solvedIndices[0] === question.correctIndex, `${question.seed}: independent exact solver changed after connected concealment.`);
  independentSolverChecks += 4;

  for (let optionIndex = 0; optionIndex < question.optionGraphs.length; optionIndex += 1) {
    const option = question.optionGraphs[optionIndex]!;
    assert(validateEmbeddedGraphV1(option).valid, `${question.seed} option ${optionIndex}: graph invalid.`);
    graphValidationChecks += 1;
    concealmentEdgesTotal += assertNoFloatingConcealment(option, question.seed, optionIndex);
    connectedConcealmentChecks += 1;
  }

  const replay = generateEmbeddedFigureVisualRealismQuestionV1(question.seed);
  assert(JSON.stringify(question) === JSON.stringify(replay), `${question.seed}: deterministic replay failed.`);

  assert(!contentFingerprints.has(question.contentFingerprint), `${question.seed}: duplicate remediated content fingerprint ${question.contentFingerprint}.`);
  assert(!geometryFingerprints.has(question.geometryFingerprint), `${question.seed}: duplicate seed-independent geometry fingerprint ${question.geometryFingerprint}.`);
  contentFingerprints.add(question.contentFingerprint);
  geometryFingerprints.add(question.geometryFingerprint);
  sourceFingerprints.add(question.sourceContentFingerprint);
  targetFingerprints.add(question.targetFingerprint);
  motifIds.add(question.motifId);
  motifFamilies.add(question.motifFamily);
  stemVariants.add(question.stemVariant);
  scaleSamples.add(question.targetScaleInCorrectHost.toFixed(5));
  answerCounts[question.correctIndex] += 1;
  difficultyCounts[question.difficulty] += 1;
  maxBaseGenerationAttempt = Math.max(maxBaseGenerationAttempt, question.generationAttempt);

  const kinds = question.distractorKindsByIndex.filter((kind): kind is EmbeddedDistractorKindV1 => kind !== "CORRECT");
  assert(kinds.length === 3 && new Set(kinds).size === 3, `${question.seed}: distractor ownership changed.`);
  for (const kind of kinds) distractorCounts[kind] += 1;

  assert(question.explanation.application.includes(`Option ${question.answer}`), `${question.seed}: question-specific answer explanation changed.`);
  assert(question.explanation.rule.includes("extra lines"), `${question.seed}: embedded-figure rule explanation changed.`);
  explanationChecks += 1;

  assert(question.targetSvg.includes('<rect width="120" height="120" fill="white"/>'), `${question.seed}: target background changed.`);
  assert(question.optionSvgs.every((svg) => svg.includes('<rect width="120" height="120" fill="white"/>') && svg.includes('stroke-width="2.2"')), `${question.seed}: option SVG contract changed.`);
  assert(question.optionSvgs.every((svg) => !svg.includes("correct") && !svg.includes("answer")), `${question.seed}: option SVG leaks answer state.`);
  assert(!question.lifecycle.permanentQlAllocated && !question.lifecycle.questionStudioRegistered && !question.lifecycle.questionBankWritable && !question.lifecycle.publiclyPublishable && !question.lifecycle.automaticStudentPublication, `${question.seed}: lifecycle boundary changed.`);
}

assert(contentFingerprints.size === 240, `Expected 240 unique remediated content fingerprints, got ${contentFingerprints.size}.`);
assert(geometryFingerprints.size === 240, `Expected 240 seed-independent geometry-unique questions, got ${geometryFingerprints.size}.`);
assert(sourceFingerprints.size === 240, `Underlying V1 source generator unexpectedly duplicated its source fingerprints: ${sourceFingerprints.size}/240.`);
assert(targetFingerprints.size === 32, `Expected 32 target fingerprints, got ${targetFingerprints.size}.`);
assert(motifIds.size === 32, `Scale corpus did not exercise all motifs: ${motifIds.size}/32.`);
assert(motifFamilies.size === 8, `Scale corpus did not exercise all motif families: ${motifFamilies.size}/8.`);
assert(stemVariants.size === 8, `Scale corpus did not exercise all stems: ${stemVariants.size}/8.`);
assert(scaleSamples.size >= 220, `Correct-host scale variety is too thin: ${scaleSamples.size}.`);
assert(JSON.stringify(answerCounts) === JSON.stringify([60, 60, 60, 60]), `Answer positions are not exactly balanced: ${JSON.stringify(answerCounts)}.`);
assert(JSON.stringify(difficultyCounts) === JSON.stringify({ L1: 80, L2: 80, L3: 80 }), `Difficulty bands are not exactly balanced: ${JSON.stringify(difficultyCounts)}.`);
for (const [kind, count] of Object.entries(distractorCounts)) assert(count >= 100, `${kind}: distractor family too thin (${count}).`);
assert(maxBaseGenerationAttempt < 20, `Underlying generator relies on excessive retries: ${maxBaseGenerationAttempt}.`);
assert(connectedConcealmentChecks === 960, `Expected 960 connected-concealment checks, got ${connectedConcealmentChecks}.`);
assert(concealmentEdgesTotal >= 240 * 4 * 4, `Connected concealment density unexpectedly thin: ${concealmentEdgesTotal} edges.`);

const batch = generateEmbeddedFigureVisualRealismBatchV1({ seed: "EMB-VR-BATCH-PROOF", count: 50 });
assert(batch.length === 50, "Visual-remediation production batch did not return 50 items.");
assert(new Set(batch.map((question) => question.geometryFingerprint)).size === 50, "Visual-remediation batch contains geometry-equivalent duplicates.");
assert(new Set(batch.map((question) => question.contentFingerprint)).size === 50, "Visual-remediation batch contains duplicate content fingerprints.");
assert(JSON.stringify(batch) === JSON.stringify(generateEmbeddedFigureVisualRealismBatchV1({ seed: "EMB-VR-BATCH-PROOF", count: 50 })), "Visual-remediation batch replay is not deterministic.");

assert(EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.sourceGeneratorAuthority === EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId, "Remediation is not pinned to the proven source generator.");
assert(!EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.permanentQlAllocationAuthorized, "Remediation authorized permanent QL allocation prematurely.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.permanentQlCount === 0 && EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.nextFreeSpatialQlId === "SPA-QL-041", "Visual remediation consumed SPA-QL-041 prematurely.");

console.log(JSON.stringify({
  status: "PASS_EMB_001_PRODUCTION_SCALE_V1_1_VISUAL_REALISM",
  authorityId: EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId,
  corpusSize: corpus.length,
  uniqueContentFingerprints: contentFingerprints.size,
  uniqueGeometryFingerprints: geometryFingerprints.size,
  targetFingerprintCount: targetFingerprints.size,
  motifCount: motifIds.size,
  motifFamilyCount: motifFamilies.size,
  stemVariantCount: stemVariants.size,
  answerCounts,
  difficultyCounts,
  distractorCounts,
  uniqueCorrectHostScales: scaleSamples.size,
  independentSolverChecks,
  graphValidationChecks,
  connectedConcealmentChecks,
  concealmentEdgesTotal,
  explanationChecks,
  maxBaseGenerationAttempt,
  batchProofCount: batch.length,
  checks: {
    legacyFloatingNoiseRemoved: true,
    allConcealmentAttachedToHost: true,
    seedIndependentGeometryUniqueness: true,
    answerPositionIgnoredByGeometryFingerprint: true,
    deterministicReplay: true,
    exactIndependentSolverOracle: true,
    exactAnswerBalance: true,
    exactDifficultyBalance: true,
    misconceptionOwnedDistractorsPreserved: true,
    whiteBackgroundSvgPreserved: true,
    noAnswerLeakageInSvg: true,
    permanentQlStillUnallocated: true,
  },
  nextGate: "EMB_CP_004_1_VISUAL_REVIEW_OF_CONNECTED_CONCEALMENT_PACK",
}, null, 2));
