import { TSD_CP008_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";
import { TSD_CP008_RENDERED_HINDI_QUESTIONS, TSD_CP008_RENDERED_LOCALIZED_QUESTIONS, TSD_CP008_RENDERED_PUNJABI_QUESTIONS } from "./localized-rendered-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 localized rendered proof failed: ${message}`);
}

function numericMultiset(value: string): readonly string[] {
  return Object.freeze((value.match(/\d+(?:\.\d+)?/g) ?? []).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)));
}

const englishByFamily = new Map(TSD_CP008_RENDERED_ENGLISH_QUESTIONS.map((question) => [question.familyId, question] as const));
assert(TSD_CP008_RENDERED_LOCALIZED_QUESTIONS.length === 108, "expected 108 localized questions");
assert(TSD_CP008_RENDERED_HINDI_QUESTIONS.length === 54, "expected 54 Hindi questions");
assert(TSD_CP008_RENDERED_PUNJABI_QUESTIONS.length === 54, "expected 54 Punjabi questions");

for (const question of TSD_CP008_RENDERED_LOCALIZED_QUESTIONS) {
  const english = englishByFamily.get(question.familyId);
  assert(english, `${question.locale}/${question.familyId}: matching frozen English rendered question missing`);
  assert(question.qlId === english.qlId, `${question.locale}/${question.familyId}: QL mismatch`);
  assert(question.authorityKey === english.authorityKey, `${question.locale}/${question.familyId}: authority mismatch`);
  assert(question.difficulty === english.difficulty, `${question.locale}/${question.familyId}: difficulty mismatch`);
  assert(!/[{}]/.test(question.stem), `${question.locale}/${question.familyId}: unresolved placeholder in stem`);
  assert(!/[{}]/.test(question.explanation), `${question.locale}/${question.familyId}: unresolved placeholder in explanation`);
  assert(JSON.stringify(numericMultiset(question.stem)) === JSON.stringify(numericMultiset(english.stem)), `${question.locale}/${question.familyId}: numeric evidence differs from frozen English case`);
  assert(question.answer.length > 0 && question.explanation.includes(question.answer), `${question.locale}/${question.familyId}: answer/explanation mismatch`);
  assert(!/same direction|opposite direction|station platform|railway bridge|find the|train speed|observer speed/i.test(question.stem), `${question.locale}/${question.familyId}: dynamic English phrase leaked into stem`);
  if (question.locale === "hi-IN") {
    assert(/\p{Script=Devanagari}/u.test(question.stem), `${question.familyId}: Hindi stem lacks Devanagari`);
    assert(!/चाल/.test(question.stem), `${question.familyId}: deprecated चाल appears in rendered Hindi stem`);
  } else {
    assert(/\p{Script=Gurmukhi}/u.test(question.stem), `${question.familyId}: Punjabi stem lacks Gurmukhi`);
  }
}

const hindi103 = TSD_CP008_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-103");
const punjabi103 = TSD_CP008_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-103");
assert(hindi103.every((question) => /पूरी तरह|पूरी लंबाई|दोनों सिरों/.test(question.stem)), "Hindi QL103 containment semantics are not explicit");
assert(punjabi103.every((question) => /ਪੂਰੀ ਤਰ੍ਹਾਂ|ਪੂਰੀ ਲੰਬਾਈ|ਦੋਵੇਂ ਸਿਰ/.test(question.stem)), "Punjabi QL103 containment semantics are not explicit");
assert([...hindi103, ...punjabi103].every((question) => !/maximum overlap/i.test(question.stem)), "ambiguous maximum-overlap wording leaked into localization");

const hindi102 = TSD_CP008_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-102");
const punjabi102 = TSD_CP008_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-102");
assert(hindi102.some((question) => /प्लेटफॉर्म/.test(question.stem)) && hindi102.some((question) => /पुल/.test(question.stem)), "Hindi QL102 must cover platform and bridge");
assert(punjabi102.some((question) => /ਪਲੇਟਫਾਰਮ/.test(question.stem)) && punjabi102.some((question) => /ਪੁਲ/.test(question.stem)), "Punjabi QL102 must cover platform and bridge");

console.log("TSD-CP-008 RENDERED HINDI/PUNJABI PARITY PROOF: PASS");
console.log(JSON.stringify({
  totalLocalizedQuestions: 108,
  hindiQuestions: 54,
  punjabiQuestions: 54,
  numericParity: "IDENTICAL_MULTISET_TO_FROZEN_ENGLISH_CASES",
  unresolvedPlaceholders: 0,
  deprecatedHindiChaalOccurrences: 0,
  ambiguousMaximumOverlapStems: 0,
}, null, 2));
