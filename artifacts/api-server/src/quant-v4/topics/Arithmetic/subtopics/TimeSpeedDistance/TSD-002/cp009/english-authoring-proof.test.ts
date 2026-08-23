import { TSD_CP009_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-registry";
import { TSD_CP009_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";
import { TSD_CP009_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 English authoring proof failed: ${message}`);
}

assert(TSD_CP009_ENGLISH_AUTHORING_REGISTRY.length === 11, "expected 11 English QLs");
assert(JSON.stringify(TSD_CP009_ENGLISH_AUTHORING_REGISTRY.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP009_PERMANENT_QL_IDS), "English QL order differs from permanent allocation");
assert(TSD_CP009_ENGLISH_AUTHORING_REGISTRY.every((ql) => ql.objectPool.length >= 8), "every QL must have at least eight context/object entries");
assert(TSD_CP009_ENGLISH_AUTHORING_REGISTRY.every((ql) => new Set(ql.objectPool).size === ql.objectPool.length), "object pools contain duplicates");
assert(TSD_CP009_ENGLISH_AUTHORING_REGISTRY.every((ql) => ql.stemFamilies.length === 6), "every QL must have six stem families");

const families = TSD_CP009_ENGLISH_AUTHORING_REGISTRY.flatMap((ql) => ql.stemFamilies);
assert(families.length === 66, `expected 66 English families, got ${families.length}`);
assert(new Set(families.map((family) => family.familyId)).size === 66, "family IDs are not unique");
assert(new Set(families.map((family) => family.stem)).size === 66, "structural English stems are not unique");
assert(new Set(families.map((family) => family.explanationGuide)).size === 66, "explanation guides are not unique");
assert(families.every((family) => family.explanationGuide.length >= 70), "one or more explanation guides is too thin");
assert(families.every((family) => family.difficulty !== "HARD"), "artificial Hard question leaked into CP009 English review");

const easy = families.filter((family) => family.difficulty === "EASY").length;
const medium = families.filter((family) => family.difficulty === "MEDIUM").length;
assert(easy === 12 && medium === 54, `expected 12 Easy / 54 Medium, got ${easy} / ${medium}`);

assert(TSD_CP009_RENDERED_ENGLISH_QUESTIONS.length === 66, "rendered English count changed");
assert(new Set(TSD_CP009_RENDERED_ENGLISH_QUESTIONS.map((question) => question.stem)).size === 66, "rendered stems are not unique");
for (const question of TSD_CP009_RENDERED_ENGLISH_QUESTIONS) {
  assert(!/[{}]/.test(question.stem), `${question.familyId}: unresolved placeholder in stem`);
  assert(!/[{}]/.test(question.explanation), `${question.familyId}: unresolved placeholder in explanation`);
  assert(question.answer.length > 0 && question.explanation.includes(question.answer), `${question.familyId}: answer/explanation mismatch`);
  assert(!/\bm\/s\b/.test(question.stem), `${question.familyId}: learner stem leaked internal m/s representation`);
  assert(!/\bm\b/.test(question.answer.replace(/km/g, "")), `${question.familyId}: learner answer leaked raw metre unit`);
  assert(!/\d+\/\d+\s*(?:km\/h|km|hours?)/.test(question.answer), `${question.familyId}: non-natural fractional learner answer leaked`);
}

const ql111 = TSD_CP009_RENDERED_ENGLISH_QUESTIONS.filter((question) => question.qlId === "TSD-QL-111");
assert(ql111.every((question) => /upstream end/.test(question.stem)), "meeting-point coordinate anchor is not explicit in all QL111 stems");
const ql113 = TSD_CP009_RENDERED_ENGLISH_QUESTIONS.filter((question) => question.qlId === "TSD-QL-113");
assert(ql113.every((question) => /turn|turning|revers/.test(question.stem)), "floating-object recovery stems must explicitly contain the turnaround event");

console.log("TSD-CP-009 ENGLISH AUTHORING / RENDERED REVIEW PROOF: PASS");
console.log(JSON.stringify({
  qls: 11,
  families: 66,
  objectPoolMinimum: 8,
  easy,
  medium,
  hard: 0,
  renderedQuestions: 66,
  unresolvedPlaceholders: 0,
  fractionalLearnerAnswers: 0,
}, null, 2));
