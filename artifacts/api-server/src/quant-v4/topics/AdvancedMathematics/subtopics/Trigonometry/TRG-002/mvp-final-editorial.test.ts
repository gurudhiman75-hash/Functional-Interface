import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const seeds = Array.from({ length: 12 }, (_, index) => `trg002-final-editorial-${String(index + 1).padStart(2, "0")}`);
let cases = 0;
for (const qlId of TRG_002_MVP_48_IDS) {
  for (const seed of seeds) {
    const question: any = generateFinalEditorialTrg002Mvp48Question(qlId, seed);
    assert(question.validation.valid, `${qlId}: underlying MVP validation failed for ${seed}.`);
    assert(question.reviewStatus === "AI_REVIEWED", `${qlId}: reviewStatus must be AI_REVIEWED.`);
    assert(question.aiEditorialStatus === "PASS", `${qlId}: AI editorial status must be PASS.`);
    assert(question.humanReviewStatus === "PENDING", `${qlId}: human review must remain PENDING.`);
    assert(question.finalEditorialReview.status === "PASS", `${qlId}: final AI editorial review must be PASS.`);
    assert(question.finalEditorialReview.runtimeSpecVisualInspection === "PASS", `${qlId}: runtime-spec visual inspection must be PASS.`);
    assert(question.finalEditorialReview.appUiRenderedInspection === "PENDING", `${qlId}: app/UI rendered inspection must remain PENDING.`);
    assert(question.finalEditorialReview.renderedVisualInspection === "PENDING", `${qlId}: generic rendered visual inspection must remain PENDING until app/UI inspection.`);
    assert(question.finalEditorialReview.humanReviewSubstituted === false, `${qlId}: AI review must not substitute for human review.`);
    assert(question.questionBankStatus === "NOT_STORED" && question.testEligibility === "INELIGIBLE", `${qlId}: activation lock changed.`);
    assert(question.publiclyPublishable === false && question.questionStudioDiscoverable === false, `${qlId}: publication/discovery lock changed.`);
    cases += 1;
  }
}
assert(cases === 576, `Expected 576 final-editorial cases, got ${cases}.`);

const wordingSeed = "trg002-final-editorial-wording";
const q005: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-005", wordingSeed);
assert(q005.stem.includes("angle of elevation of its top"), "QL-005 must identify what the elevation angle refers to.");
const q009: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-009", wordingSeed);
assert(q009.stem.includes("From a point on level ground") && q009.stem.includes("angle of elevation of its top"), "QL-009 must use explicit exam-style observation wording.");
const q018: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-018", wordingSeed);
assert(q018.stem.includes("horizontal distance between the building and the pole"), "QL-018 must state the horizontal separation explicitly.");
const q020: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-020", wordingSeed);
assert(q020.stem.includes("angle of depression of 45°"), "QL-020 must use standard depression wording.");
const q048: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-048", wordingSeed);
assert(q048.stem.includes("with the ground"), "QL-048 must remove the ambiguous pronoun in the wire angle statement.");
const q095: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-095", wordingSeed);
assert(q095.stem.includes("point on level ground") && q095.stem.includes("from the foot of a building"), "QL-095 must state the observation baseline explicitly.");

console.log(`TRG-002 MVP final editorial gate target: ${cases} cases; runtime-spec visual PASS, app/UI visual and human review pending.`);
