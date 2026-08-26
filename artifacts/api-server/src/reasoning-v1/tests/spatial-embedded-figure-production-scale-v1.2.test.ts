import { matchEmbeddedGraphV1, validateEmbeddedGraphV1, type EmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import { type EmbeddedDistractorKindV1 } from "../foundation/spatial/embedded-figure-production-generator-v1";
import { EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1 } from "../foundation/spatial/embedded-figure-visual-realism-remediation-v1";
import {
  EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1,
  generateEmbeddedFigureWholeOptionConnectivityBatchV1,
  generateEmbeddedFigureWholeOptionConnectivityQuestionV1,
} from "../foundation/spatial/embedded-figure-whole-option-connectivity-remediation-v1";
import { EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/embedded-figure-source-saturated-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

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

const corpus = Array.from({ length: 240 }, (_, index) => generateEmbeddedFigureWholeOptionConnectivityQuestionV1(`EMB-WOC-SCALE-${index}`));
const contentFingerprints = new Set<string>();
const geometryFingerprints = new Set<string>();
const sourceVisualFingerprints = new Set<string>();
const motifIds = new Set<string>();
const motifFamilies = new Set<string>();
const targetFingerprints = new Set<string>();
const stemVariants = new Set<number>();
const answerCounts = [0, 0, 0, 0];
const difficultyCounts: Record<string, number> = { L1: 0, L2: 0, L3: 0 };
const distractorCounts: Record<EmbeddedDistractorKindV1, number> = {
  ROTATION_TRAP: 0,
  REFLECTION_TRAP: 0,
  MISSING_EDGE: 0,
  WRONG_INCIDENCE: 0,
  NON_UNIFORM_SCALE: 0,
};
let optionConnectivityChecks = 0;
let solverChecks = 0;
let graphChecks = 0;
let disconnectedSourceOptions = 0;
let bridgePathsAdded = 0;
let bridgeVerticesChecked = 0;
let visualConcealmentChecks = 0;

for (const question of corpus) {
  assert(question.connectivityRemediationAuthority === EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1.authorityId, `${question.seed}: wrong connectivity authority.`);
  assert(question.visualRemediationAuthority === EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId, `${question.seed}: V1.1 visual remediation trace lost.`);
  assert(question.qlStatus === "PROPOSED_NOT_PERMANENT", `${question.seed}: permanent status leaked.`);
  assert(question.equivalencePolicy === "FIXED_ORIENTATION", `${question.seed}: SSC fixed-orientation policy changed.`);
  assert(question.connectivityValidation.valid && question.connectivityValidation.everyOptionSingleConnectedComponent, `${question.seed}: connectivity validation flags failed.`);
  assert(question.connectivityValidation.solverCorrectIndex === question.correctIndex, `${question.seed}: stored connectivity solver index mismatch.`);
  assert(question.connectivityValidation.sourceComponentCounts.length === 4, `${question.seed}: source component counts incomplete.`);
  assert(question.connectivityValidation.finalComponentCounts.length === 4, `${question.seed}: final component counts incomplete.`);
  assert(question.connectivityValidation.bridgePathCounts.length === 4, `${question.seed}: bridge path counts incomplete.`);

  const independentlySolved = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const solvedIndices = independentlySolved.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
  assert(solvedIndices.length === 1 && solvedIndices[0] === question.correctIndex, `${question.seed}: exact-one-answer property changed after connectivity repair.`);
  solverChecks += 4;

  question.optionGraphs.forEach((option, optionIndex) => {
    assert(validateEmbeddedGraphV1(option).valid, `${question.seed} option ${optionIndex}: graph invalid.`);
    graphChecks += 1;
    assert(componentCount(option) === 1, `${question.seed} option ${optionIndex}: option still has detached islands.`);
    assert(question.connectivityValidation.finalComponentCounts[optionIndex] === 1, `${question.seed} option ${optionIndex}: stored final component count is not one.`);
    optionConnectivityChecks += 1;

    const sourceCount = question.connectivityValidation.sourceComponentCounts[optionIndex]!;
    const bridgeCount = question.connectivityValidation.bridgePathCounts[optionIndex]!;
    if (sourceCount > 1) {
      disconnectedSourceOptions += 1;
      assert(bridgeCount === sourceCount - 1, `${question.seed} option ${optionIndex}: expected ${sourceCount - 1} bridge paths, got ${bridgeCount}.`);
    } else {
      assert(bridgeCount === 0, `${question.seed} option ${optionIndex}: connected source received unnecessary bridge.`);
    }
    bridgePathsAdded += bridgeCount;

    const bridgeVertices = option.vertices.filter((vertex) => vertex.id.startsWith("woc"));
    assert(bridgeVertices.length === bridgeCount, `${question.seed} option ${optionIndex}: bridge vertex/path count mismatch.`);
    for (const bridgeVertex of bridgeVertices) {
      const incident = option.edges.filter((edge) => edge.a === bridgeVertex.id || edge.b === bridgeVertex.id);
      assert(incident.length === 2, `${question.seed} option ${optionIndex}: bridge vertex ${bridgeVertex.id} must have exactly two incident edges.`);
      assert(incident.every((edge) => edge.id.startsWith("woc")), `${question.seed} option ${optionIndex}: bridge vertex mixed with non-remediation edge.`);
      bridgeVerticesChecked += 1;
    }

    assert(option.edges.every((edge) => !edge.id.includes("noise")), `${question.seed} option ${optionIndex}: legacy floating-noise edge returned.`);
    assert(option.vertices.every((vertex) => !/n\d+[ab]$/.test(vertex.id)), `${question.seed} option ${optionIndex}: legacy floating-noise vertex returned.`);
    visualConcealmentChecks += 1;
  });

  const replay = generateEmbeddedFigureWholeOptionConnectivityQuestionV1(question.seed);
  assert(JSON.stringify(question) === JSON.stringify(replay), `${question.seed}: deterministic replay failed.`);

  assert(!contentFingerprints.has(question.contentFingerprint), `${question.seed}: duplicate content fingerprint.`);
  assert(!geometryFingerprints.has(question.geometryFingerprint), `${question.seed}: duplicate seed-independent geometry fingerprint.`);
  contentFingerprints.add(question.contentFingerprint);
  geometryFingerprints.add(question.geometryFingerprint);
  sourceVisualFingerprints.add(question.sourceVisualGeometryFingerprint);
  motifIds.add(question.motifId);
  motifFamilies.add(question.motifFamily);
  targetFingerprints.add(question.targetFingerprint);
  stemVariants.add(question.stemVariant);
  answerCounts[question.correctIndex] += 1;
  difficultyCounts[question.difficulty] += 1;

  const kinds = question.distractorKindsByIndex.filter((kind): kind is EmbeddedDistractorKindV1 => kind !== "CORRECT");
  assert(kinds.length === 3 && new Set(kinds).size === 3, `${question.seed}: distractor ownership changed.`);
  for (const kind of kinds) distractorCounts[kind] += 1;

  assert(question.optionSvgs.every((svg) => svg.includes('<rect width="120" height="120" fill="white"/>') && svg.includes('stroke-width="2.2"')), `${question.seed}: SVG rendering contract changed.`);
  assert(question.optionSvgs.every((svg) => !svg.includes("correct") && !svg.includes("answer")), `${question.seed}: SVG answer leakage.`);
  assert(question.explanation.application.includes(`Option ${question.answer}`), `${question.seed}: customized explanation changed.`);
  assert(!question.lifecycle.permanentQlAllocated && !question.lifecycle.questionStudioRegistered && !question.lifecycle.questionBankWritable && !question.lifecycle.publiclyPublishable && !question.lifecycle.automaticStudentPublication, `${question.seed}: lifecycle boundary changed.`);
}

assert(contentFingerprints.size === 240, `Expected 240 unique content fingerprints, got ${contentFingerprints.size}.`);
assert(geometryFingerprints.size === 240, `Expected 240 geometry-unique questions, got ${geometryFingerprints.size}.`);
assert(sourceVisualFingerprints.size === 240, `Expected 240 unique source visual geometries, got ${sourceVisualFingerprints.size}.`);
assert(targetFingerprints.size === 32, `Expected 32 target fingerprints, got ${targetFingerprints.size}.`);
assert(motifIds.size === 32 && motifFamilies.size === 8, `Motif coverage incomplete: ${motifIds.size} motifs / ${motifFamilies.size} families.`);
assert(stemVariants.size === 8, `Stem coverage incomplete: ${stemVariants.size}/8.`);
assert(JSON.stringify(answerCounts) === JSON.stringify([60, 60, 60, 60]), `Answer balance changed: ${JSON.stringify(answerCounts)}.`);
assert(JSON.stringify(difficultyCounts) === JSON.stringify({ L1: 80, L2: 80, L3: 80 }), `Difficulty balance changed: ${JSON.stringify(difficultyCounts)}.`);
for (const [kind, count] of Object.entries(distractorCounts)) assert(count >= 100, `${kind}: distractor family too thin (${count}).`);
assert(optionConnectivityChecks === 960, `Expected 960 whole-option connectivity checks, got ${optionConnectivityChecks}.`);
assert(disconnectedSourceOptions > 0, "Scale corpus did not exercise the detached-island remediation path.");
assert(bridgePathsAdded > 0 && bridgeVerticesChecked === bridgePathsAdded, `Bridge remediation was not deeply exercised: paths=${bridgePathsAdded}, vertices=${bridgeVerticesChecked}.`);

const batch = generateEmbeddedFigureWholeOptionConnectivityBatchV1({ seed: "EMB-WOC-BATCH-PROOF", count: 50 });
assert(batch.length === 50, "Connectivity-remediated batch did not return 50 items.");
assert(new Set(batch.map((question) => question.geometryFingerprint)).size === 50, "Connectivity-remediated batch contains geometry-equivalent duplicates.");
assert(JSON.stringify(batch) === JSON.stringify(generateEmbeddedFigureWholeOptionConnectivityBatchV1({ seed: "EMB-WOC-BATCH-PROOF", count: 50 })), "Connectivity-remediated batch replay failed.");

assert(EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1.sourceVisualAuthority === EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId, "V1.2 is not pinned to V1.1 visual remediation.");
assert(!EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1.permanentQlAllocationAuthorized, "V1.2 authorized permanent QL allocation prematurely.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.permanentQlCount === 0 && EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.nextFreeSpatialQlId === "SPA-QL-041", "V1.2 consumed SPA-QL-041 prematurely.");

console.log(JSON.stringify({
  status: "PASS_EMB_001_PRODUCTION_SCALE_V1_2_WHOLE_OPTION_CONNECTIVITY",
  authorityId: EMBEDDED_FIGURE_WHOLE_OPTION_CONNECTIVITY_REMEDIATION_V1.authorityId,
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
  solverChecks,
  graphChecks,
  optionConnectivityChecks,
  visualConcealmentChecks,
  disconnectedSourceOptions,
  bridgePathsAdded,
  bridgeVerticesChecked,
  batchProofCount: batch.length,
  checks: {
    everyOptionSingleConnectedComponent: true,
    detachedSourceIslandPathExercised: true,
    bentTwoEdgeBridgePathStructure: true,
    legacyFloatingNoiseAbsent: true,
    seedIndependentGeometryUniqueness: true,
    exactIndependentSolverOracle: true,
    exactAnswerBalance: true,
    exactDifficultyBalance: true,
    deterministicReplay: true,
    whiteBackgroundSvgPreserved: true,
    noAnswerLeakageInSvg: true,
    permanentQlStillUnallocated: true,
  },
  nextGate: "EMB_CP_004_2_FULL_VISUAL_AUDIT_OF_WHOLE_OPTION_CONNECTED_REVIEW_PACK",
}, null, 2));
