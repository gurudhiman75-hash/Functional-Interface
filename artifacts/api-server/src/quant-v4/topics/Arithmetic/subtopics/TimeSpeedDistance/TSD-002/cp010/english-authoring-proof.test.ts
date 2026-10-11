import { verifyTsdCp010 } from "./executable-verifier";
import { TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT, TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { TSD_CP010_QL_ALLOCATION } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 English authoring proof failed: ${message}`);
}

const SYNTHETIC_STEM_FILLER = /\b(?:race report|selection trial|practice race|practice trial|official timing|official report|race record|athletics meet|sports-day|stadium trial|maintains?|steady speeds?|course reconstruction|determine the finish-time difference)\b/i;

assert(TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.length === 10, "expected 10 English QLs");
assert(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.length === 60, "expected 60 rendered English questions");
assert(TSD_CP010_ENGLISH_EXHAUSTIVENESS_PATCH_COUNT === 60, "expected all 60 families to be rewritten to exam-paper style");

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
  for (const family of ql.families) {
    assert(family.stem.length >= 55, `${family.familyId} stem is too thin`);
    assert(family.stem.length <= 250, `${family.familyId} stem is too verbose for exam style`);
    assert(family.explanationGuide.length >= 25, `${family.familyId} explanation guide is too thin`);
    assert(!SYNTHETIC_STEM_FILLER.test(family.stem), `${family.familyId} contains synthetic/non-exam filler`);
    assert(!stems.has(family.stem), `${family.familyId} duplicates another structural stem`);
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
  assert(question.stem.length >= 55, `${question.familyId} rendered stem too short`);
  assert(question.stem.length <= 250, `${question.familyId} rendered stem too verbose`);
  assert(!SYNTHETIC_STEM_FILLER.test(question.stem), `${question.familyId} rendered stem contains synthetic/non-exam filler`);
  assert(question.explanation.steps.length >= 2, `${question.familyId} explanation lacks calculation flow`);
  assert(question.answer.length > 0, `${question.familyId} missing learner answer`);
  assert(!/\b(?:10|11|12) m\/s\b/.test(question.stem), `${question.familyId} uses an unrealistic sustained running speed`);
  assert(verifyTsdCp010(question.input, question.solution).accepted, `${question.familyId} fails independent verification`);
}

const ql115 = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-115");
const ql117 = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-117");
const ql118 = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.filter((x) => x.qlId === "TSD-QL-118");
assert(ql115.filter((x) => x.input.authorityKey === "finishDistanceLeadState" && x.input.target === "PERCENT_OF_RACE").length === 1, "QL115 needs an explicit percent-of-race winning-margin variant");
assert(ql117.filter((x) => x.input.authorityKey === "raceSpeedRatioState" && x.input.mode === "DISTANCE_LEAD").length === 3, "QL117 needs three distance-lead variants");
assert(ql117.filter((x) => x.input.authorityKey === "raceSpeedRatioState" && x.input.mode === "TIME_LEAD").length === 3, "QL117 needs three time-lead variants");
assert(ql118.filter((x) => x.input.authorityKey === "raceLengthFromLeadEvidence" && x.input.mode === "DISTANCE_LEAD").length === 3, "QL118 needs three distance-lead variants");
assert(ql118.filter((x) => x.input.authorityKey === "raceLengthFromLeadEvidence" && x.input.mode === "TIME_LEAD").length === 3, "QL118 needs three time-lead variants");
assert(new Set(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.map((x) => x.stem)).size === 60, "rendered English stems must all be unique");

console.log("TSD-CP-010 EXAM-STYLE ENGLISH AUTHORING PROOF: PASS");
console.log(JSON.stringify({
  qls: 10,
  families: 60,
  fullStemRewrite: true,
  easy,
  medium,
  hard: 0,
  uniqueRenderedStems: new Set(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.map((x) => x.stem)).size,
  syntheticStemFiller: "ABSENT",
  stemStyle: "COMPACT_CONVENTIONAL_EXAM_RACE_LANGUAGE",
  difficultyPolicy: "DEPTH_DRIVEN_NO_FORCED_HARD_QUOTA",
}, null, 2));
