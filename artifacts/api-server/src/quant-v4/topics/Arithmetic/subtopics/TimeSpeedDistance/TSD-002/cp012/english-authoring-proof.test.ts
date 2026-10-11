import { generateTsdCp012ExecutableCases } from "./executable-cases";
import { verifyTsdCp012 } from "./executable-verifier";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_PROVISIONAL_QL_IDS, TSD_CP012_QL_ALLOCATION } from "./ql-allocation";
import { generateTsdCp012SourceExtensionCases, verifyTsdCp012SourceExtension } from "./source-executable-extensions";
import { TSD_CP012_TWO_ENGINE_PROVENANCE } from "./two-engine-provenance";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 English authoring proof failed: ${message}`);
}
function stemShape(stem: string): string {
  return stem.toLowerCase().replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g, "#").replace(/\s+/g, " ").trim();
}
function hasMotionEvidence(stem: string): boolean {
  return /m\/s|\bm\b|seconds?|speed|distance|time|route|track|train|current|walkway|surface|stage|rest|delay|cycle|journey|revolution|lap/i.test(stem);
}
function hasLearnerRequest(stem: string): boolean {
  return /find|what|how|which|list|determine|recover|at what|how much|how many/i.test(stem);
}

const baseCases = generateTsdCp012ExecutableCases();
const extensionCases = generateTsdCp012SourceExtensionCases();
const expectedPerQl = new Map<string, number>();
for (const allocation of TSD_CP012_QL_ALLOCATION) {
  expectedPerQl.set(
    allocation.qlId,
    baseCases.filter((x) => x.authorityKey === allocation.authorityKey).length + extensionCases.filter((x) => x.authorityKey === allocation.authorityKey).length,
  );
}

assert(TSD_CP012_ENGLISH_REVIEW_FINAL.length === 270, `expected 270 English review questions, found ${TSD_CP012_ENGLISH_REVIEW_FINAL.length}`);
assert(new Set(TSD_CP012_ENGLISH_REVIEW_FINAL.map((x) => x.familyId)).size === 270, "family IDs must be unique");
assert(new Set(TSD_CP012_ENGLISH_REVIEW_FINAL.map((x) => x.stem)).size === 270, "learner stems must be unique after capacity expansion");
assert(TSD_CP012_ENGLISH_REVIEW_FINAL.every((x) => x.difficulty === "EASY" || x.difficulty === "MEDIUM"), "final English review must expose only calibrated EASY/MEDIUM bands");
assert(TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.difficulty === "EASY").length === 22, "final English review must contain exactly 22 EASY families");
assert(TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.difficulty === "MEDIUM").length === 248, "final English review must contain exactly 248 MEDIUM families");

for (const qlId of TSD_CP012_PROVISIONAL_QL_IDS) {
  const questions = TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.qlId === qlId);
  const expected = expectedPerQl.get(qlId);
  assert(expected !== undefined, `${qlId}: missing expected review capacity`);
  assert(questions.length === expected, `${qlId}: expected ${expected} review families, found ${questions.length}`);
  assert(expected === 24 || expected === 26, `${qlId}: unexpected family count ${expected}`);
  assert(new Set(questions.map((x) => stemShape(x.stem))).size >= 3, `${qlId}: stems are structurally too repetitive after normalizing numbers`);
  assert(questions.filter((x) => x.difficulty === "EASY").length === 2, `${qlId}: expected exactly two EASY review families`);
  assert(questions.filter((x) => x.difficulty === "MEDIUM").length === expected - 2, `${qlId}: remaining review families must calibrate to MEDIUM`);

  const allocation = TSD_CP012_QL_ALLOCATION.find((x) => x.qlId === qlId)!;
  const executableTargets = new Set([
    ...baseCases.filter((x) => x.authorityKey === allocation.authorityKey).map((x) => x.input.target),
    ...extensionCases.filter((x) => x.authorityKey === allocation.authorityKey).map((x) => x.input.target),
  ]);
  const reviewedTargets = new Set(questions.map((x) => x.input.target));
  for (const target of executableTargets) assert(reviewedTargets.has(target), `${qlId}: executable target ${target} is missing from reviewed learner surface`);
}

const extensionTargets = new Set(["EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE", "DISTANCE_REMAINING_AFTER_STAGES", "CLOSED_ROUTE_OPPOSITE_MEETING_TIME"]);
for (const target of extensionTargets) assert(TSD_CP012_ENGLISH_REVIEW_FINAL.some((x) => x.input.target === target), `${target}: source-backed extension is absent from English review`);

for (const requiredTarget of [
  "PERIODIC_DISTANCE",
  "MAXIMUM_DELAY",
  "MINIMUM_SPEED",
  "TIME_DIFFERENCE_BETWEEN_ROUTES",
  "MISSING_STAGE_DISTANCE",
  "DROPPED_OBJECT_RECOVERY_DISTANCE",
  "UNKNOWN_ACTIVE_TIME_BEFORE_STOP",
] as const) {
  assert(TSD_CP012_ENGLISH_REVIEW_FINAL.some((x) => x.input.target === requiredTarget), `${requiredTarget}: previously omitted executable target is still missing from review`);
}

for (const question of TSD_CP012_ENGLISH_REVIEW_FINAL) {
  assert(hasMotionEvidence(question.stem), `${question.familyId}: stem does not expose explicit TSD evidence`);
  assert(hasLearnerRequest(question.stem), `${question.familyId}: stem does not state a clear learner request`);
  assert(question.explanation.steps.length === 2, `${question.familyId}: explanation must contain exactly two concise steps`);
  assert(question.explanation.steps.every((step) => /[.!?]$/.test(step.trim())), `${question.familyId}: explanation contains a sentence fragment`);
  assert(question.explanation.steps.every((step) => !step.includes(question.stem)), `${question.familyId}: explanation repeats the question stem`);
  assert(question.explanation.steps.some((step) => /\d|m\/s|seconds|distance|time|speed|route|track|rest|delay|stage|cycle|equation|current/i.test(step)), `${question.familyId}: explanation is not problem-specific`);
  assert(question.explanation.conclusion.startsWith("Answer: "), `${question.familyId}: concise answer conclusion missing`);
  assert(!/\{[A-Za-z0-9_]+\}/.test(question.stem), `${question.familyId}: unresolved placeholder in stem`);

  if (extensionTargets.has(question.input.target)) {
    const verification = verifyTsdCp012SourceExtension(question.input as Parameters<typeof verifyTsdCp012SourceExtension>[0], question.solution as Parameters<typeof verifyTsdCp012SourceExtension>[1]);
    assert(verification.accepted, `${question.familyId}: source-extension verifier rejected English review case (${verification.reason})`);
  } else {
    const verification = verifyTsdCp012(question.input as Parameters<typeof verifyTsdCp012>[0], question.solution);
    assert(verification.accepted, `${question.familyId}: independent verifier rejected English review case (${verification.reason})`);
  }
}

const ql139 = TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-139" && x.input.target === "TRACK_GAP_AT_FASTER_FINISH");
assert(ql139.every((x) => /remaining distance|still have to cover|must still run/i.test(x.stem)), "TSD-QL-139 finish-gap wording must describe the slower runner's remaining distance to finish");

const ql141 = TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-141");
assert(ql141.length === 24, "TSD-QL-141 must expose all 24 exact two-engine review families");
assert(ql141.every((x) => TSD_CP012_TWO_ENGINE_PROVENANCE.some((row) => row.caseId === x.caseId && row.engineA !== row.engineB)), "TSD-QL-141 review case lost two-engine provenance");
assert(ql141.every((x) => /In one observation/.test(x.stem) && /another independent observation/.test(x.stem)), "TSD-QL-141 learner stems must present two concrete independent observations");
assert(ql141.every((x) => /runs for|distance in|together they cover/i.test(x.stem)), "TSD-QL-141 learner stems must expose observable distance/time evidence");
assert(ql141.every((x) => !/equation|relation|unknown speeds x|x and y|=/.test(x.stem)), "TSD-QL-141 learner stems must not hand learners the internal algebra model");
assert(ql141.every((x) => x.explanation.steps[0]?.includes("distance = speed × time")), "TSD-QL-141 explanations must derive equations from motion evidence rather than begin from abstract algebra");

const ql142 = TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-142");
assert(ql142.length === 24, "TSD-QL-142 must expose all 24 finite-feasibility cases");
assert(ql142.some((x) => x.solution.kind === "SET"), "TSD-QL-142 must review complete-set output");
assert(ql142.some((x) => x.solution.kind === "SCALAR" && x.input.target === "COUNT"), "TSD-QL-142 must review valid-state count output");
const ql142Sets = ql142.filter((x) => x.input.target === "VALID_SET");
assert(ql142Sets.length === 12, "TSD-QL-142 must expose 12 complete-set MCQ families across three scale bands");
assert(ql142Sets.every((x) => /Which option gives the complete set/.test(x.stem)), "TSD-QL-142 complete-set stems must be phrased as option-selection MCQs");
assert(ql142Sets.every((x) => !/List every|List the complete set/i.test(x.stem)), "TSD-QL-142 complete-set stems must not regress to worksheet-style list instructions");

console.log("TSD-CP-012 ENGLISH REVIEW AUTHORING PROOF: PASS");
console.log(JSON.stringify({
  questions: TSD_CP012_ENGLISH_REVIEW_FINAL.length,
  qls: TSD_CP012_PROVISIONAL_QL_IDS.length,
  familiesPerQl: Object.fromEntries(TSD_CP012_PROVISIONAL_QL_IDS.map((qlId) => [qlId, expectedPerQl.get(qlId)])),
  uniqueStems: new Set(TSD_CP012_ENGLISH_REVIEW_FINAL.map((x) => x.stem)).size,
  minimumNormalizedStemShapesPerQl: 3,
  difficultyBands: { easy: 22, medium: 248, hard: 0 },
  sourceExtensionTargetsInReview: [...extensionTargets],
  targetCoverage: "ALL_EXECUTABLE_TARGETS_REVIEWED",
  ql141LearnerSurface: "CONCRETE_MOTION_OBSERVATIONS_DERIVE_ALGEBRA_IN_EXPLANATION",
  ql142SetSurface: "FOUR_OPTION_COMPLETE_SET_MCQ",
  explanationStyle: "TWO_CONCISE_QUESTION_SPECIFIC_STEPS_PLUS_CONCLUSION",
  editorialGuard: "EXPLICIT_MOTION_EVIDENCE_CLEAR_REQUEST_COMPLETE_SENTENCES",
  lifecycle: "REVIEW_ONLY_NOT_FROZEN",
}, null, 2));
