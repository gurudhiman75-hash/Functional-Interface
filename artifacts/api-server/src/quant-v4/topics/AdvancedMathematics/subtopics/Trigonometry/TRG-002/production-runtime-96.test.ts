import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateHumanApprovedTrg002Mvp48Question, TRG_002_HUMAN_APPROVAL } from "./mvp-human-approved-runtime";
import {
  TRG_002_PRODUCTION_96_IDS,
  TRG_002_PRODUCTION_EXPANSION_48_IDS,
  assertTrg002ProductionRegistry,
  trg002ProductionCpForId,
} from "./production-96-registry";
import { generateTrg002Production96Question } from "./production-runtime-96";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function approvedProjection(question: any) {
  return {
    qlId: question.qlId,
    cpId: question.cpId,
    difficulty: question.difficulty,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option: any) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    explanation: question.explanation,
    strategy: question.solutionDiagram.strategy,
    solutionDiagram: question.solutionDiagram,
    solutionAnnotations: question.solutionAnnotations ?? [],
    validation: question.validation,
  };
}

const registry = assertTrg002ProductionRegistry();
assert(registry.production === 96 && registry.frozen === 48 && registry.expansion === 48 && registry.perCp === 24, "TRG-002 production registry reconciliation failed.");
assert(TRG_002_PRODUCTION_96_IDS[0] === "TRG-002-QL-001" && TRG_002_PRODUCTION_96_IDS[95] === "TRG-002-QL-096", "TRG-002 production IDs are not contiguous 001...096.");
assert(new Set(TRG_002_PRODUCTION_EXPANSION_48_IDS).size === 48, "Expansion must contain exactly 48 unique permanent IDs.");

const cpCounts = new Map<string, number>();
for (const qlId of TRG_002_PRODUCTION_96_IDS) {
  const cp = trg002ProductionCpForId(qlId);
  cpCounts.set(cp, (cpCounts.get(cp) ?? 0) + 1);
}
for (const cp of ["TRG-CP-007", "TRG-CP-008", "TRG-CP-009", "TRG-CP-010"]) {
  assert(cpCounts.get(cp) === 24, `${cp}: production registry must contain 24 QLs.`);
}

// The frozen human-approved 48 are a non-regressing content anchor.
for (let index = 0; index < TRG_002_MVP_48_IDS.length; index += 1) {
  const qlId = TRG_002_MVP_48_IDS[index];
  const seed = `trg002-production-frozen-anchor-${String(index + 1).padStart(2, "0")}`;
  const frozen: any = generateHumanApprovedTrg002Mvp48Question(qlId, seed);
  const production: any = generateTrg002Production96Question(qlId, seed);
  assert(JSON.stringify(approvedProjection(production)) === JSON.stringify(approvedProjection(frozen)), `${qlId}: Phase 8 changed frozen approved content.`);
  assert(production.productionBaseline === "FROZEN_MVP_48" && production.productionExpansion === false, `${qlId}: frozen baseline provenance missing.`);
  assert(production.freezeStatus === "FROZEN" && production.humanReviewStatus === "APPROVED", `${qlId}: frozen approval state regressed.`);
  assert(production.freeze?.approvedContentFingerprint === TRG_002_HUMAN_APPROVAL.approvedContentFingerprint, `${qlId}: frozen fingerprint binding regressed.`);
}

const expansionSolveModes = new Set<string>();
const expansionStems = new Set<string>();
for (let index = 0; index < TRG_002_PRODUCTION_EXPANSION_48_IDS.length; index += 1) {
  const qlId = TRG_002_PRODUCTION_EXPANSION_48_IDS[index];
  const seed = `trg002-production-expansion-role-${String(index + 1).padStart(2, "0")}`;
  const question: any = generateTrg002Production96Question(qlId, seed);
  assert(question.qlId === qlId, `${qlId}: generated QL identity mismatch.`);
  assert(question.cpId === trg002ProductionCpForId(qlId), `${qlId}: generated CP does not match Phase-0 range.`);
  assert(question.productionBaseline === "PHASE8_EXPANSION_48" && question.productionExpansion === true, `${qlId}: expansion provenance missing.`);
  assert(question.reviewStatus === "UNREVIEWED" && question.aiEditorialStatus === "PENDING" && question.humanReviewStatus === "PENDING", `${qlId}: new expansion QL overstates review status.`);
  assert(question.frozen === false && question.freezeEligible === false, `${qlId}: new expansion QL must not be frozen before review.`);
  assert(question.validation?.valid === true, `${qlId}: validation failed.`);
  assert(question.verification?.spatial?.valid === true && question.verification?.answer?.valid === true, `${qlId}: spatial/answer verification failed.`);
  assert(question.verification?.diagram?.valid === true && question.verification?.diagramPolicy?.valid === true, `${qlId}: diagram verification failed.`);
  assert(question.solutionDiagram && question.stemDiagram === undefined, `${qlId}: solution/stem diagram policy regressed.`);
  assert(question.options?.length === 4 && question.options.filter((option: any) => option.isCorrect).length === 1, `${qlId}: invalid option structure.`);
  assert(!expansionSolveModes.has(question.solveMode), `${qlId}: duplicate expansion solveMode ${question.solveMode}.`);
  expansionSolveModes.add(question.solveMode);
  const normalizedStem = question.stem.toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/\s+/g, " ").trim();
  assert(!expansionStems.has(normalizedStem), `${qlId}: normalized expansion stem duplicates another role.`);
  expansionStems.add(normalizedStem);
  assert(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE" && question.publiclyPublishable === false && question.questionStudioDiscoverable === false && question.activationAuthorized === false, `${qlId}: Phase 8 must not activate product surfaces.`);
}
assert(expansionSolveModes.size === 48, `Expected 48 distinct expansion solve modes, found ${expansionSolveModes.size}.`);

let executed = 0;
const sweepSeeds = Array.from({ length: 12 }, (_, index) => `trg002-production-sweep-${String(index + 1).padStart(2, "0")}`);
for (const qlId of TRG_002_PRODUCTION_96_IDS) {
  for (const seed of sweepSeeds) {
    const question: any = generateTrg002Production96Question(qlId, seed);
    executed += 1;
    assert(question.qlId === qlId, `${qlId}/${seed}: identity mismatch.`);
    assert(question.validation?.valid === true, `${qlId}/${seed}: validation failed.`);
    assert(question.verification?.spatial?.valid === true, `${qlId}/${seed}: spatial verification failed.`);
    assert(question.verification?.answer?.valid === true, `${qlId}/${seed}: answer reconstruction failed.`);
    assert(question.verification?.diagram?.valid === true && question.verification?.diagramPolicy?.valid === true, `${qlId}/${seed}: diagram gate failed.`);
    assert(new Set(question.options.map((option: any) => option.display)).size === 4, `${qlId}/${seed}: displayed option collision.`);
    assert(question.options.filter((option: any) => option.isCorrect).length === 1, `${qlId}/${seed}: expected exactly one correct option.`);
    assert(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE" && question.publiclyPublishable === false && question.questionStudioDiscoverable === false, `${qlId}/${seed}: activation lock regressed.`);
  }
}

console.log(`TRG002_PRODUCTION_96_GATE_PASS qls=96 frozen=48 expansion=48 perCp=24 sweepCases=${executed} expansionSolveModes=${expansionSolveModes.size} activation=OFF`);
