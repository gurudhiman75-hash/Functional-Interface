import { TRG_002_PRODUCTION_EXPANSION_48_IDS, trg002ProductionCpForId } from "./production-96-registry";
import { generateFinalEditorialTrg002ProductionExpansionQuestion } from "./production-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizedStem(stem: string) {
  return stem.toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/\s+/g, " ").trim();
}

const seeds = Array.from({ length: 12 }, (_, index) => `trg002-production-final-editorial-${String(index + 1).padStart(2, "0")}`);
let cases = 0;
for (const qlId of TRG_002_PRODUCTION_EXPANSION_48_IDS) {
  for (const seed of seeds) {
    const question: any = generateFinalEditorialTrg002ProductionExpansionQuestion(qlId, seed);
    assert(question.qlId === qlId, `${qlId}: QL identity changed in editorial overlay.`);
    assert(question.cpId === trg002ProductionCpForId(qlId), `${qlId}: CP identity changed in editorial overlay.`);
    assert(question.validation?.valid === true, `${qlId}: underlying production validation failed for ${seed}.`);
    assert(question.verification?.spatial?.valid === true && question.verification?.answer?.valid === true, `${qlId}: spatial/answer verification failed for ${seed}.`);
    assert(question.verification?.diagram?.valid === true && question.verification?.diagramPolicy?.valid === true, `${qlId}: solution diagram verification failed for ${seed}.`);
    assert(question.reviewStatus === "AI_REVIEWED", `${qlId}: reviewStatus must be AI_REVIEWED.`);
    assert(question.aiEditorialStatus === "PASS", `${qlId}: AI editorial status must be PASS.`);
    assert(question.humanReviewStatus === "PENDING", `${qlId}: human review must remain PENDING.`);
    assert(question.finalEditorialReview?.status === "PASS", `${qlId}: final editorial review must be PASS.`);
    assert(question.finalEditorialReview?.scope === "TRG-002_PHASE8_EXPANSION_48", `${qlId}: editorial scope is incorrect.`);
    assert(question.finalEditorialReview?.runtimeSpecVisualInspection === "NOT_ASSERTED_PER_INSTANCE", `${qlId}: editorial layer must not claim per-seed visual PASS.`);
    assert(question.finalEditorialReview?.representativeRuntimeVisualEvidence === "EDITORIAL_REVIEW_ARTIFACT_TEXT_PLUS_DIAGRAM_METADATA", `${qlId}: representative editorial evidence marker is incorrect.`);
    assert(question.finalEditorialReview?.appUiRenderedInspection === "PENDING" && question.finalEditorialReview?.renderedVisualInspection === "PENDING", `${qlId}: rendered/app UI inspection must remain pending.`);
    assert(question.finalEditorialReview?.humanReviewSubstituted === false, `${qlId}: AI review must not substitute for human review.`);
    assert(question.productionBaseline === "PHASE8_EXPANSION_48" && question.productionExpansion === true, `${qlId}: Phase-8 provenance changed.`);
    assert(question.frozen === false && question.freezeEligible === false && question.freezeStatus === "NOT_FROZEN", `${qlId}: expansion must remain unfrozen.`);
    assert(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE", `${qlId}: activation lock changed.`);
    assert(question.publiclyPublishable === false && question.questionStudioDiscoverable === false && question.activationAuthorized === false, `${qlId}: publication/discovery lock changed.`);
    assert(question.solutionDiagram && question.stemDiagram === undefined, `${qlId}: solution/stem diagram policy changed.`);
    assert(question.options?.length === 4 && question.options.filter((option: any) => option.isCorrect).length === 1, `${qlId}: option structure is invalid.`);
    assert(new Set(question.options.map((option: any) => option.display)).size === 4, `${qlId}: editorial presentation created an option collision.`);
    assert(!question.answer.startsWith("-"), `${qlId}: answer must use positive-first exact notation.`);
    assert(!question.options.some((option: any) => option.display.startsWith("-")), `${qlId}: option must not start with an avoidable negative exact term.`);
    const studentText = [
      question.stem,
      question.answer,
      ...question.options.map((option: any) => option.display),
      question.explanation.keyRule,
      question.explanation.shortcut,
      ...question.explanation.traps,
      ...question.explanation.steps.map((step: any) => step.body),
    ].join(" | ");
    assert(!/\b\d+\/2 m\b/.test(studentText), `${qlId}: half-metre values must use natural decimal presentation.`);
    assert(!/-\d+ \+ \d+√3/.test(studentText), `${qlId}: exact surd differences must use positive-first notation.`);
    const wrongIds = question.options.filter((option: any) => !option.isCorrect).map((option: any) => option.misconceptionId);
    assert(wrongIds.every((id: unknown) => typeof id === "string" && id.length > 0), `${qlId}: every distractor must retain a named misconception.`);
    assert(new Set(wrongIds).size === 3, `${qlId}: distractor misconception roles must be distinct.`);
    if (question.difficulty === "Hard") {
      assert(question.explanation.steps.length >= 4, `${qlId}: Hard editorial explanation must include rule plus at least three calculation steps.`);
    }
    cases += 1;
  }
}
assert(cases === 576, `Expected 576 Phase-8 editorial cases, got ${cases}.`);

const wordingSeed = "trg002-production-final-editorial-wording";
const q016: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-016", wordingSeed);
assert(q016.stem.includes("horizontal distance between the building and the pole"), "QL-016 must state the horizontal separation explicitly.");
const q017: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-017", wordingSeed);
assert(q017.stem.includes("horizontal distance between the two structures"), "QL-017 must state the horizontal separation explicitly.");
for (const qlId of ["TRG-002-QL-050", "TRG-002-QL-051", "TRG-002-QL-053", "TRG-002-QL-054"] as const) {
  const question: any = generateFinalEditorialTrg002ProductionExpansionQuestion(qlId, wordingSeed);
  assert(question.stem.includes("same straight line with its foot"), `${qlId}: same-side system must state collinearity explicitly.`);
  assert(!/-\d+ \+ \d+√3/.test(question.stem), `${qlId}: point separation must use conventional positive-first surd notation.`);
}
const q072: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-072", wordingSeed);
assert(q072.stem.includes("point and both tower feet are collinear"), "QL-072 must state the collinearity required to subtract tower distances.");
assert(/^\d+\(√3−1\) m$/.test(q072.answer), "QL-072 answer must use factored positive-first surd notation.");
const q074: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-074", wordingSeed);
assert(/^\d+\.5 m$/.test(q074.answer), "QL-074 total height must use natural half-metre decimal presentation.");
const q075: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-075", wordingSeed);
assert(q075.answer === "1.5 m", "QL-075 eye-height answer must be shown as 1.5 m.");
const q084: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-084", wordingSeed);
assert(q084.stem.includes("horizontal distance between the buildings"), "QL-084 must state horizontal building separation explicitly.");
const q085: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-085", wordingSeed);
assert(q085.stem.includes("horizontal distance between the buildings"), "QL-085 must state horizontal building separation explicitly.");
const q089: any = generateFinalEditorialTrg002ProductionExpansionQuestion("TRG-002-QL-089", wordingSeed);
assert(q089.explanation.steps.length >= 4, "QL-089 Hard explanation must retain the explicit three-stage calculation after the rule step.");

const stemOwners = new Map<string, string>();
for (let index = 0; index < TRG_002_PRODUCTION_EXPANSION_48_IDS.length; index += 1) {
  const qlId = TRG_002_PRODUCTION_EXPANSION_48_IDS[index];
  const question: any = generateFinalEditorialTrg002ProductionExpansionQuestion(qlId, `trg002-production-editorial-unique-${String(index + 1).padStart(2, "0")}`);
  const key = normalizedStem(question.stem);
  const prior = stemOwners.get(key);
  assert(!prior, `${qlId}: normalized editorial stem duplicates ${prior}.`);
  stemOwners.set(key, qlId);
}

console.log(`TRG002_PRODUCTION_EDITORIAL_GATE_PASS qls=48 cases=${cases} normalizedStemGroups=${stemOwners.size} visual=NOT_ASSERTED human=PENDING activation=OFF`);
