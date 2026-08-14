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
    assert(question.finalEditorialReview.runtimeSpecVisualInspection === "NOT_ASSERTED_PER_INSTANCE", `${qlId}: runtime must not claim visual PASS for an uninspected generated seed.`);
    assert(question.finalEditorialReview.representativeRuntimeVisualEvidence === "EXTERNAL_REVIEW_ARTIFACT", `${qlId}: representative runtime visual evidence must remain external to per-instance metadata.`);
    assert(question.finalEditorialReview.representativeVisualReviewScope === "ONE_DESIGNATED_REVIEW_INSTANCE_PER_QL", `${qlId}: representative visual-review scope must be explicit.`);
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
const q007: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-007", wordingSeed);
assert(!q007.stem.includes("√3/3"), "QL-007 stem must avoid generator-like sqrt(3)/3 presentation.");
const q009: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-009", wordingSeed);
assert(q009.stem.includes("From a point on level ground") && q009.stem.includes("angle of elevation of its top"), "QL-009 must use explicit exam-style observation wording.");
const q018: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-018", wordingSeed);
assert(q018.stem.includes("horizontal distance between the building and the pole"), "QL-018 must state the horizontal separation explicitly.");
const q020: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-020", wordingSeed);
assert(q020.stem.includes("angle of depression of 45°"), "QL-020 must use standard depression wording.");
const q024: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-024", wordingSeed);
assert(q024.stem.startsWith("A building is ") && !q024.stem.includes("a 8 m building"), "QL-024 must use grammatically natural height wording.");
const q043: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-043", wordingSeed);
assert(q043.stem.includes("makes an angle of 45° with the ground"), "QL-043 must explicitly define the fallen-part ground angle.");
const q048: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-048", wordingSeed);
assert(q048.stem.includes("with the ground"), "QL-048 must remove the ambiguous pronoun in the wire angle statement.");
const q049: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-049", wordingSeed);
assert(q049.stem.includes("30° at A, the farther point") && q049.stem.includes("60° at B, the nearer point"), "QL-049 must assign each angle to the correct observation point explicitly.");
const q067: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-067", wordingSeed);
assert(q067.stem.includes("45°") && q067.stem.includes("30°") && q067.stem.includes("same straight line"), "QL-067 must retain its diversified 45°/30° collinear form.");
const q069: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-069", wordingSeed);
assert(q069.stem.includes("45°") && q069.stem.includes("60°"), "QL-069 must retain its diversified 45°/60° moving-observer form.");
const q071: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-071", wordingSeed);
assert(q071.stem.includes("feet of both towers lie on the same straight line"), "QL-071 must state the collinearity needed to subtract tower distances.");
const q076: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-076", wordingSeed);
assert(/\d+\.5 m building/.test(q076.stem) && !/\d+\/2 m building/.test(q076.stem), "QL-076 must present half-metre building heights as natural decimals.");
const q081: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-081", wordingSeed);
assert(q081.explanation.steps.some((step: any) => step.body.includes("x=3y")), "QL-081 Hard explanation must derive the unequal opposite-side distance ratio.");
const q083: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-083", wordingSeed);
assert(q083.stem.includes("horizontal distance between the feet of the two buildings"), "QL-083 must state the horizontal building separation explicitly.");
const q092: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-092", wordingSeed);
const q092WrongIds = new Set(q092.options.filter((option: any) => !option.isCorrect).map((option: any) => option.misconceptionId));
assert(q092WrongIds.has("RETURNED_LINE_OF_SIGHT_USING_SIN45") && q092WrongIds.has("TREATED_TOWER_HEIGHT_AS_HYPOTENUSE") && q092WrongIds.has("USED_60_DEGREE_RATIO_INSTEAD_OF_45"), "QL-092 distractors must come from genuine trigonometric misconceptions rather than arbitrary multiples.");
const q095: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-095", wordingSeed);
assert(q095.stem.includes("point on level ground") && q095.stem.includes("from the foot of a building"), "QL-095 must state the observation baseline explicitly.");
const q096: any = generateFinalEditorialTrg002Mvp48Question("TRG-002-QL-096", wordingSeed);
assert(q096.explanation.steps.some((step: any) => step.body.includes("Rationalize") && step.body.includes("√3+1")), "QL-096 Hard explanation must show the rationalization step explicitly.");

console.log(`TRG-002 MVP final editorial gate target: ${cases} cases; per-instance visual PASS is deliberately not asserted, and app/UI visual plus human review remain pending.`);
