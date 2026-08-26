import { matchEmbeddedGraphV1, validateEmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import {
  EMBEDDED_FIGURE_MOTIFS_V1,
  EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1,
  generateEmbeddedFigureBatchV1,
  generateEmbeddedFigureQuestionV1,
  type EmbeddedDistractorKindV1,
} from "../foundation/spatial/embedded-figure-production-generator-v1";
import { EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/embedded-figure-source-saturated-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(EMBEDDED_FIGURE_MOTIFS_V1.length === 32, `Expected 32 canonical EMB target motifs, got ${EMBEDDED_FIGURE_MOTIFS_V1.length}.`);
assert(new Set(EMBEDDED_FIGURE_MOTIFS_V1.map((motif) => motif.motifId)).size === 32, "EMB motif IDs are not unique.");
assert(new Set(EMBEDDED_FIGURE_MOTIFS_V1.map((motif) => motif.family)).size === 8, "EMB motif pool does not cover all eight structural families.");
for (const motif of EMBEDDED_FIGURE_MOTIFS_V1) {
  assert(validateEmbeddedGraphV1(motif.graph).valid, `${motif.motifId}: canonical motif graph is invalid.`);
  assert(motif.graph.edges.every((edge) => edge.kind === "LINE"), `${motif.motifId}: source-backed V1 target pool introduced curved edges before direct visual-source confirmation.`);
}

const corpus = Array.from({ length: 240 }, (_, index) => generateEmbeddedFigureQuestionV1(`EMB-SCALE-${index}`));
const contentFingerprints = new Set<string>();
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
let optionGraphChecks = 0;
let explanationChecks = 0;
let maxGenerationAttempt = 0;

for (const question of corpus) {
  assert(question.chapterCode === "EMB-001" && question.proposalId === "EMB-PROP-01", `${question.seed}: chapter/proposal trace changed.`);
  assert(question.qlStatus === "PROPOSED_NOT_PERMANENT", `${question.seed}: generator prematurely assigned permanent status.`);
  assert(question.equivalencePolicy === "FIXED_ORIENTATION", `${question.seed}: SSC source-backed rule changed.`);
  assert(question.optionGraphs.length === 4 && question.optionSvgs.length === 4, `${question.seed}: four-option contract failed.`);
  assert(question.answer === (["A", "B", "C", "D"] as const)[question.correctIndex], `${question.seed}: answer/index mismatch.`);
  assert(question.validation.solverCorrectIndex === question.correctIndex, `${question.seed}: generator oracle and stored answer disagree.`);
  assert(question.validation.valid && question.validation.exactlyOneEmbeddedOption && question.validation.optionSemanticUniqueness, `${question.seed}: generator validation contract failed.`);
  assert(question.targetSvg.includes('<rect width="120" height="120" fill="white"/>'), `${question.seed}: target SVG lost white background.`);
  assert(question.targetSvg.includes('stroke-width="2.2"'), `${question.seed}: target SVG stroke contract changed.`);
  assert(question.optionSvgs.every((svg) => svg.includes('<rect width="120" height="120" fill="white"/>') && svg.includes('stroke-width="2.2"')), `${question.seed}: option SVG visual contract failed.`);
  assert(!question.targetSvg.includes("correct") && question.optionSvgs.every((svg) => !svg.includes("correct")), `${question.seed}: SVG leaks answer state.`);

  const solved = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const solvedIndices = solved.map((result, index) => result.matched ? index : -1).filter((index) => index >= 0);
  assert(solvedIndices.length === 1 && solvedIndices[0] === question.correctIndex, `${question.seed}: independent exact solver does not yield one correct option.`);
  independentSolverChecks += 4;

  assert(validateEmbeddedGraphV1(question.targetGraph).valid, `${question.seed}: generated target graph invalid.`);
  for (const option of question.optionGraphs) {
    assert(validateEmbeddedGraphV1(option).valid, `${question.seed}: generated option graph invalid.`);
    optionGraphChecks += 1;
  }

  const replay = generateEmbeddedFigureQuestionV1(question.seed);
  assert(JSON.stringify(question) === JSON.stringify(replay), `${question.seed}: deterministic replay failed.`);

  assert(!contentFingerprints.has(question.contentFingerprint), `${question.seed}: duplicate content fingerprint ${question.contentFingerprint}.`);
  contentFingerprints.add(question.contentFingerprint);
  targetFingerprints.add(question.targetFingerprint);
  motifIds.add(question.motifId);
  motifFamilies.add(question.motifFamily);
  stemVariants.add(question.stemVariant);
  scaleSamples.add(question.targetScaleInCorrectHost.toFixed(5));
  answerCounts[question.correctIndex] += 1;
  difficultyCounts[question.difficulty] += 1;
  maxGenerationAttempt = Math.max(maxGenerationAttempt, question.generationAttempt);

  const kinds = question.distractorKindsByIndex.filter((kind): kind is EmbeddedDistractorKindV1 => kind !== "CORRECT");
  assert(kinds.length === 3 && new Set(kinds).size === 3, `${question.seed}: distractors are not owned by three distinct misconception families.`);
  for (const kind of kinds) distractorCounts[kind] += 1;

  assert(question.explanation.observation.length >= 30, `${question.seed}: observation explanation is too thin.`);
  assert(question.explanation.rule.includes("same orientation") && question.explanation.rule.includes("extra lines"), `${question.seed}: rule explanation lost the source-backed invariant.`);
  assert(question.explanation.application.includes(`Option ${question.answer}`), `${question.seed}: application is not customized to the generated answer.`);
  assert(question.explanation.check.includes(`option ${question.answer}`), `${question.seed}: option check is not customized.`);
  assert(kinds.some((kind) => question.explanation.application.includes(
    kind === "ROTATION_TRAP" ? "rotated copy" :
    kind === "REFLECTION_TRAP" ? "mirror-reversed copy" :
    kind === "MISSING_EDGE" ? "required segment missing" :
    kind === "WRONG_INCIDENCE" ? "wrong point" :
    "proportions",
  )), `${question.seed}: application does not name a generated misconception.`);
  explanationChecks += 1;

  assert(!question.lifecycle.permanentQlAllocated, `${question.seed}: permanent QL allocation leaked into production proof.`);
  assert(!question.lifecycle.questionStudioRegistered, `${question.seed}: Question Studio registration leaked into production proof.`);
  assert(!question.lifecycle.questionBankWritable && !question.lifecycle.testEligible && !question.lifecycle.publiclyPublishable, `${question.seed}: downstream release lifecycle enabled prematurely.`);
  assert(!question.lifecycle.automaticStudentPublication, `${question.seed}: automatic publication enabled.`);
}

assert(contentFingerprints.size === 240, `Expected 240 unique content fingerprints, got ${contentFingerprints.size}.`);
assert(targetFingerprints.size === 32, `Expected 32 semantically distinct target fingerprints, got ${targetFingerprints.size}.`);
assert(motifIds.size === 32, `Scale corpus did not exercise every motif: ${motifIds.size}/32.`);
assert(motifFamilies.size === 8, `Scale corpus did not exercise every motif family: ${motifFamilies.size}/8.`);
assert(stemVariants.size === 8, `Scale corpus did not exercise every stem variant: ${stemVariants.size}/8.`);
assert(scaleSamples.size >= 220, `Correct-host scale parameter is too repetitive: ${scaleSamples.size} unique values.`);
assert(JSON.stringify(answerCounts) === JSON.stringify([60, 60, 60, 60]), `Answer positions are not exactly balanced: ${JSON.stringify(answerCounts)}.`);
assert(JSON.stringify(difficultyCounts) === JSON.stringify({ L1: 80, L2: 80, L3: 80 }), `Difficulty bands are not exactly balanced: ${JSON.stringify(difficultyCounts)}.`);
for (const [kind, count] of Object.entries(distractorCounts)) {
  assert(count >= 100, `${kind}: misconception family is too thin in scale corpus (${count}).`);
}
assert(maxGenerationAttempt < 20, `Generator relies on excessive retries; max attempt ${maxGenerationAttempt}.`);

const batch = generateEmbeddedFigureBatchV1({ seed: "EMB-BATCH-PROOF", count: 50 });
assert(batch.length === 50, "Production batch generator did not return 50 items.");
assert(new Set(batch.map((question) => question.contentFingerprint)).size === 50, "Production batch contains duplicate content fingerprints.");
assert(JSON.stringify(batch) === JSON.stringify(generateEmbeddedFigureBatchV1({ seed: "EMB-BATCH-PROOF", count: 50 })), "Production batch replay is not deterministic.");

assert(EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1.sourceDiscoveryAuthority === EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId, "Generator is not pinned to source-saturated discovery authority.");
assert(!EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1.permanentQlAllocationAuthorized, "Production proof authorized permanent allocation prematurely.");
assert(EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.permanentQlCount === 0 && EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.nextFreeSpatialQlId === "SPA-QL-041", "Production proof consumed the next permanent Spatial ID.");

const evidence = {
  status: "PASS_EMB_001_PRODUCTION_SCALE_V1",
  authorityId: EMBEDDED_FIGURE_PRODUCTION_GENERATOR_AUTHORITY_V1.authorityId,
  corpusSize: corpus.length,
  motifCount: motifIds.size,
  motifFamilyCount: motifFamilies.size,
  targetFingerprintCount: targetFingerprints.size,
  uniqueContentFingerprints: contentFingerprints.size,
  stemVariantCount: stemVariants.size,
  answerCounts,
  difficultyCounts,
  distractorCounts,
  uniqueCorrectHostScales: scaleSamples.size,
  independentSolverChecks,
  optionGraphChecks,
  explanationChecks,
  maxGenerationAttempt,
  batchProofCount: batch.length,
  checks: {
    canonicalMotifPoolDeep: true,
    everyMotifExercised: true,
    everyStructuralFamilyExercised: true,
    deterministicReplay: true,
    exactIndependentSolverOracle: true,
    exactlyOneAnswer: true,
    exactAnswerBalance: true,
    exactDifficultyBalance: true,
    semanticQuestionUniqueness: true,
    misconceptionOwnedDistractors: true,
    stemVariety: true,
    questionSpecificExplanations: true,
    deterministicWhiteBackgroundSvg: true,
    noAnswerLeakageInSvg: true,
    permanentQlStillUnallocated: true,
  },
  nextGate: "EMB_CP_004_ENGLISH_LEARNER_REVIEW_AND_PERMANENT_QL_PROPOSAL",
};

console.log(JSON.stringify(evidence, null, 2));
