import { TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import { TSD_CP008_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";
import { TSD_CP008_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 English authoring proof failed: ${message}`);
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/\d+(?:\.\d+)?/g, "#").replace(/[\p{P}\p{S}\s]+/gu, " ").trim();
}

const families = TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.flatMap((ql) => ql.stemFamilies);
assert(TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.length === 9, "expected nine English QLs");
assert(JSON.stringify(TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP008_PERMANENT_QL_IDS), "English QL order differs from permanent allocation");
assert(families.length === 54, "expected 54 English families");
assert(TSD_CP008_RENDERED_ENGLISH_QUESTIONS.length === 54, "expected 54 rendered English questions");
assert(TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.every((ql) => ql.objectPool.length >= 8 && new Set(ql.objectPool.map(normalized)).size >= 8), "object pool is thin or repetitive");
assert(TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.every((ql) => ql.stemFamilies.length === 6), "each QL must have six family shapes");
assert(TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.every((ql) => new Set(ql.stemFamilies.map((family) => family.representation)).size >= 6), "representation labels must be genuinely varied within each QL");
assert(TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.every((ql) => new Set(ql.stemFamilies.map((family) => family.scene)).size >= 6), "scene labels must be genuinely varied within each QL");

const easy = families.filter((family) => family.difficulty === "EASY").length;
const medium = families.filter((family) => family.difficulty === "MEDIUM").length;
assert(easy === 17 && medium === 37, `difficulty mix must be 17 Easy / 37 Medium, got ${easy}/${medium}`);

const banned = /\b(use formula|as per|synthetic|generated question|computed answer|template)\b/i;
for (const ql of TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY) {
  assert(!banned.test(ql.learnerContract), `${ql.qlId}: learner contract contains tutoring/meta language`);
  for (const family of ql.stemFamilies) {
    assert(!banned.test(family.stem), `${family.familyId}: stem contains tutoring/meta language`);
    assert(!banned.test(family.explanationGuide), `${family.familyId}: explanation contains tutoring/meta language`);
    assert(family.stem.length >= 90, `${family.familyId}: stem too thin`);
    assert(family.explanationGuide.length >= 70, `${family.familyId}: explanation guide is too thin to state the governing distance/relative-speed reasoning`);
    assert(/length|distance|speed|time|equation|relative|ratio|crossing|containment/i.test(family.explanationGuide), `${family.familyId}: explanation guide lacks the actual reasoning quantity`);
  }
}

const structuralStems = TSD_CP008_RENDERED_ENGLISH_QUESTIONS.map((question) => normalized(question.stem));
const structuralExplanations = TSD_CP008_RENDERED_ENGLISH_QUESTIONS.map((question) => normalized(question.explanation));
assert(new Set(structuralStems).size === 54, "rendered stems are structurally duplicated");
assert(new Set(structuralExplanations).size === 54, "rendered explanations are structurally duplicated");

for (const question of TSD_CP008_RENDERED_ENGLISH_QUESTIONS) {
  assert(!/[{}]/.test(question.stem), `${question.familyId}: unresolved placeholder in stem`);
  assert(!/[{}]/.test(question.explanation), `${question.familyId}: unresolved placeholder in explanation`);
  assert(!/\d+\/\d+/.test(question.stem), `${question.familyId}: learner stem contains an awkward rational fraction`);
  assert(!/\d+\.\d+\s*km\/h/.test(question.stem), `${question.familyId}: learner stem contains fractional km/h`);
  assert(!/directions are in the same direction|same direction to the|opposite direction to the/i.test(question.stem), `${question.familyId}: awkward direction wording survived final editorial layer`);
  assert(question.answer.length > 0, `${question.familyId}: answer missing`);
  assert(question.explanation.includes(question.answer), `${question.familyId}: explanation does not conclude with its computed answer`);
}

const q102 = TSD_CP008_RENDERED_ENGLISH_QUESTIONS.filter((question) => question.qlId === "TSD-QL-102");
assert(q102.some((question) => /platform/i.test(question.stem)) && q102.some((question) => /bridge/i.test(question.stem)), "QL102 must cover both platform and bridge scenes");
assert(q102.some((question) => /Find the length of the first train\./.test(question.stem)), "QL102 must include train-length target");
assert(q102.some((question) => /Find the length of the (?:station platform|railway bridge)\./.test(question.stem)), "QL102 must include fixed-object target");

const q103 = TSD_CP008_RENDERED_ENGLISH_QUESTIONS.filter((question) => question.qlId === "TSD-QL-103");
assert(q103.length === 6, "QL103 must render six questions");
assert(q103.every((question) => /shorter train|shorter|wholly|entirely|completely within/i.test(question.stem)), "QL103 containment semantics are not explicit in every family");
assert(q103.every((question) => !/maximum overlap/i.test(question.stem)), "QL103 leaked ambiguous maximum-overlap wording");

console.log("TSD-CP-008 ENGLISH AUTHORING/RENDERED REVIEW PROOF: PASS");
console.log(JSON.stringify({
  qls: 9,
  families: 54,
  objectPoolEntries: TSD_CP008_FINAL_ENGLISH_AUTHORING_REGISTRY.reduce((sum, ql) => sum + ql.objectPool.length, 0),
  renderedQuestions: 54,
  difficulty: { EASY: easy, MEDIUM: medium, HARD: 0 },
  uniqueStructuralStems: new Set(structuralStems).size,
  uniqueStructuralExplanations: new Set(structuralExplanations).size,
  unresolvedPlaceholders: 0,
  fractionalKmhStems: 0,
  awkwardDirectionPhrases: 0,
  ambiguousMaximumOverlapStems: 0,
  explanationPolicy: "COMPLETE_AND_CONCISE_NOT_LENGTH_PADDED",
  englishFreezeStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
