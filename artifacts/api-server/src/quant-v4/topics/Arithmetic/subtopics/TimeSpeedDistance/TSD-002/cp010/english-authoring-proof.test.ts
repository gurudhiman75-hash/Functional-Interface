import { verifyTsdCp010 } from "./executable-verifier";
import { TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT, TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { TSD_CP010_QL_ALLOCATION } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 English authoring proof failed: ${message}`);
}

assert(TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.length === 10, "expected 10 English QLs");
assert(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.length === 60, "expected 60 rendered English questions");
assert(TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT === 6, "expected six time-lead exhaustiveness patches");

const stems = new Set<string>();
const guides = new Set<string>();
let easy = 0;
let medium = 0;
for (const allocation of TSD_CP010_QL_ALLOCATION) {
  const ql = TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.find((x) => x.qlId === allocation.qlId);
  assert(ql, `${allocation.qlId} missing authoring registry`);
  assert(ql.authorityKey === allocation.authorityKey, `${allocation.qlId} authority mismatch`);
  assert(ql.families.length === 6, `${allocation.qlId} must have six families`);
  assert(ql.objectPool.length >= 8, `${allocation.qlId} object pool is too thin`);
  assert(new Set(ql.objectPool.map((x) => `${x.first}|${x.second}|${x.third ?? ""}|${x.scene}`)).size === ql.objectPool.length, `${allocation.qlId} object pool contains duplicates`);
  for (const family of ql.families) {
    assert(family.stem.length >= 90, `${family.familyId} stem is too thin`);
    assert(family.explanationGuide.length >= 35, `${family.familyId} explanation guide is too thin`);
    assert(!stems.has(family.stem), `${family.familyId} duplicates another structural stem`);
    assert(!guides.has(family.explanationGuide), `${family.familyId} duplicates another explanation guide`);
    stems.add(family.stem);
    guides.add(family.explanationGuide);
    if (family.difficulty === "EASY") easy += 1;
    else medium += 1;
  }
}

assert(easy === 12, `expected 12 Easy families, got ${easy}`);
assert(medium === 48, `expected 48 Medium families, got ${medium}`);

for (const question of TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW) {
  assert(!/\{[A-Za-z0-9]+\}/.test(question.stem), `${question.familyId} has unresolved placeholder`);
  assert(question.stem.length >= 75, `${question.familyId} rendered stem too short`);
  assert(question.explanation.steps.length >= 2, `${question.familyId} explanation lacks calculation flow`);
  assert(question.answer.length > 0, `${question.familyId} missing learner answer`);
  assert(!/\b(?:10|11|12) m\/s\b/.test(question.stem), `${question.familyId} uses an unrealistic sustained running speed`);
  assert(verifyTsdCp010(question.input, question.solution).accepted, `${question.familyId} fails independent verification`);
}

const ql117 = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-117");
const ql118 = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-118");
assert(ql117.filter((x) => x.input.authorityKey === "raceSpeedRatioState" && x.input.mode === "DISTANCE_LEAD").length === 3, "QL117 needs three distance-lead variants");
assert(ql117.filter((x) => x.input.authorityKey === "raceSpeedRatioState" && x.input.mode === "TIME_LEAD").length === 3, "QL117 needs three time-lead variants");
assert(ql118.filter((x) => x.input.authorityKey === "raceLengthFromLeadEvidence" && x.input.mode === "DISTANCE_LEAD").length === 3, "QL118 needs three distance-lead variants");
assert(ql118.filter((x) => x.input.authorityKey === "raceLengthFromLeadEvidence" && x.input.mode === "TIME_LEAD").length === 3, "QL118 needs three time-lead variants");
assert(new Set(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.map((x) => x.stem)).size === 60, "rendered English stems must all be unique");

console.log("TSD-CP-010 FINAL ENGLISH AUTHORING / RENDERED REVIEW PROOF: PASS");
console.log(JSON.stringify({
  qls: TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.length,
  families: TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.reduce((sum, ql) => sum + ql.families.length, 0),
  objectPoolMinimum: Math.min(...TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.map((ql) => ql.objectPool.length)),
  exhaustivenessPatches: TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT,
  ql117DistanceLeadVariants: 3,
  ql117TimeLeadVariants: 3,
  ql118DistanceLeadVariants: 3,
  ql118TimeLeadVariants: 3,
  easy,
  medium,
  hard: 0,
  renderedQuestions: TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.length,
  uniqueStructuralStems: stems.size,
  uniqueRenderedStems: new Set(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.map((x) => x.stem)).size,
  unresolvedPlaceholders: TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.filter((x) => /\{[A-Za-z0-9]+\}/.test(x.stem)).length,
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_HARD_QUOTA",
  runningSpeedRealismGuard: "NO_10_11_12_MPS_IN_REVIEW_STEMS",
}, null, 2));