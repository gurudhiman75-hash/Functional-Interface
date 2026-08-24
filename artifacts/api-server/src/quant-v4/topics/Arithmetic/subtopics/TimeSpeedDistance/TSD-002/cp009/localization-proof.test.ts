import { TSD_CP009_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP009_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP009_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import { TSD_CP009_RENDERED_HINDI_QUESTIONS, TSD_CP009_RENDERED_PUNJABI_QUESTIONS } from "./localized-rendered-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 localization proof failed: ${message}`);
}

function placeholders(value: string): readonly string[] {
  return Object.freeze([...value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort());
}

const frozenFamilies = TSD_CP009_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => ({ qlId: ql.qlId, authorityKey: ql.authorityKey, ...family })));
assert(frozenFamilies.length === 66, "frozen English family count changed");

for (const registry of [TSD_CP009_HINDI_LOCALIZATION, TSD_CP009_PUNJABI_LOCALIZATION]) {
  assert(registry.qls.length === 11, `${registry.locale}: expected 11 QLs`);
  assert(JSON.stringify(registry.qls.map((ql) => ql.qlId)) === JSON.stringify(TSD_CP009_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId)), `${registry.locale}: QL order drifted`);
  const localizedFamilies = registry.qls.flatMap((ql) => ql.families.map((family) => ({ qlId: ql.qlId, authorityKey: ql.authorityKey, ...family })));
  assert(localizedFamilies.length === 66, `${registry.locale}: expected 66 families`);
  assert(new Set(localizedFamilies.map((family) => family.familyId)).size === 66, `${registry.locale}: duplicate family IDs`);
  for (let index = 0; index < frozenFamilies.length; index += 1) {
    const english = frozenFamilies[index];
    const localized = localizedFamilies[index];
    assert(localized.familyId === english.familyId, `${registry.locale}/${english.familyId}: family order drifted`);
    assert(localized.qlId === english.qlId && localized.authorityKey === english.authorityKey, `${registry.locale}/${english.familyId}: QL/authority drifted`);
    assert(localized.difficulty === english.difficulty, `${registry.locale}/${english.familyId}: difficulty drifted`);
    assert(JSON.stringify(placeholders(localized.stem)) === JSON.stringify(placeholders(english.stem)), `${registry.locale}/${english.familyId}: stem placeholder parity failed`);
    assert(localized.stem.trim().split(/\s+/).length >= 8, `${registry.locale}/${english.familyId}: localized stem too thin`);
    assert(localized.explanationGuide.trim().split(/\s+/).length >= 6, `${registry.locale}/${english.familyId}: localized explanation too thin`);
    assert(!/[{}]/.test(localized.explanationGuide), `${registry.locale}/${english.familyId}: explanation contains template braces`);
  }
}

assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.length === 66, "Hindi rendered count changed");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.length === 66, "Punjabi rendered count changed");
for (const question of [...TSD_CP009_RENDERED_HINDI_QUESTIONS, ...TSD_CP009_RENDERED_PUNJABI_QUESTIONS]) {
  assert(!/[{}]/.test(question.stem), `${question.locale}/${question.familyId}: unresolved placeholder`);
  assert(question.answer.length > 0 && question.explanation.includes(question.answer), `${question.locale}/${question.familyId}: answer/explanation mismatch`);
  assert(!/\d+\/\d+\s*(?:किमी|ਕਿਮੀ)/.test(question.answer), `${question.locale}/${question.familyId}: fractional localized answer leaked`);
}

assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.every((question) => !/[\u0A00-\u0A7F]/.test(question.stem)), "Hindi stem contains Gurmukhi leakage");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.every((question) => !/[\u0900-\u097F]/.test(question.stem)), "Punjabi stem contains Devanagari leakage");
assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-111").every((question) => /ऊपरी सिरे/.test(question.stem)), "Hindi QL111 upstream-end anchor missing");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-111").every((question) => /ਉਪਰਲੇ ਸਿਰੇ/.test(question.stem)), "Punjabi QL111 upstream-end anchor missing");
assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-113").every((question) => /मुड़|दिशा बदल/.test(question.stem)), "Hindi QL113 turnaround event missing");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-113").every((question) => /ਮੁੜ|ਦਿਸ਼ਾ ਬਦਲ/.test(question.stem)), "Punjabi QL113 turnaround event missing");

console.log("TSD-CP-009 HINDI/PUNJABI LOCALIZATION PROOF: PASS");
console.log(JSON.stringify({
  hindiFamilies: 66,
  punjabiFamilies: 66,
  placeholderParity: true,
  renderedHindi: TSD_CP009_RENDERED_HINDI_QUESTIONS.length,
  renderedPunjabi: TSD_CP009_RENDERED_PUNJABI_QUESTIONS.length,
  unresolvedPlaceholders: 0,
  sourceEnglishStatus: "FROZEN",
  localizationStatus: "REVIEW_CANDIDATE",
}, null, 2));
