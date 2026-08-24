import { TSD_CP009_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import {
  TSD_CP009_FINAL_HINDI_LOCALIZATION,
  TSD_CP009_FINAL_PUNJABI_LOCALIZATION,
} from "./localization-review-final";
import { TSD_CP009_RENDERED_HINDI_QUESTIONS, TSD_CP009_RENDERED_PUNJABI_QUESTIONS } from "./localized-rendered-review";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-009 localization proof failed: ${message}`);
}

function placeholders(value: string): readonly string[] {
  return Object.freeze([...value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]).sort());
}

const frozenFamilies = TSD_CP009_FROZEN_ENGLISH_REGISTRY.flatMap((ql) => ql.stemFamilies.map((family) => ({ qlId: ql.qlId, authorityKey: ql.authorityKey, ...family })));
assert(frozenFamilies.length === 66, "frozen English family count changed");

for (const registry of [TSD_CP009_FINAL_HINDI_LOCALIZATION, TSD_CP009_FINAL_PUNJABI_LOCALIZATION]) {
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

const finalHindiText = JSON.stringify(TSD_CP009_FINAL_HINDI_LOCALIZATION);
const finalPunjabiText = JSON.stringify(TSD_CP009_FINAL_PUNJABI_LOCALIZATION);
const rejectedHindi = ["गश्ती नाव", "वॉटर टैक्सी", "ड्रिफ्ट मार्कर", "लाइफबॉय", "मार्कर बुआ"] as const;
const rejectedPunjabi = ["ਗਸ਼ਤੀ", "ਨਿਗਰਾਨੀ ਕਿਸ਼ਤੀ", "ਸਰਵੇ ਕਿਸ਼ਤੀ", "ਵਾਟਰ ਟੈਕਸੀ", "ਡ੍ਰਿਫਟ ਮਾਰਕਰ", "ਲਾਈਫਬੁਆਇ", "ਮਾਰਕਰ ਬੁਆਇ", "ਟ੍ਰੇਨਿੰਗ ਜਹਾਜ਼"] as const;
for (const wording of rejectedHindi) assert(!finalHindiText.includes(wording), `Hindi rejected wording '${wording}' leaked into final localization`);
for (const wording of rejectedPunjabi) assert(!finalPunjabiText.includes(wording), `Punjabi rejected wording '${wording}' leaked into final localization`);

assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.length === 66, "Hindi rendered count changed");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.length === 66, "Punjabi rendered count changed");
for (const question of [...TSD_CP009_RENDERED_HINDI_QUESTIONS, ...TSD_CP009_RENDERED_PUNJABI_QUESTIONS]) {
  assert(!/[{}]/.test(question.stem), `${question.locale}/${question.familyId}: unresolved placeholder`);
  assert(question.answer.length > 0 && question.explanation.includes(question.answer), `${question.locale}/${question.familyId}: answer/explanation mismatch`);
  assert(!/\d+\/\d+\s*(?:किमी|ਕਿਮੀ)/.test(question.answer), `${question.locale}/${question.familyId}: fractional localized answer leaked`);
}

for (const question of TSD_CP009_RENDERED_HINDI_QUESTIONS) {
  const match = question.stem.match(/[\u0A00-\u0A7F]/);
  assert(!match, `Hindi/${question.familyId}: Gurmukhi leakage '${match?.[0] ?? ""}'`);
}
for (const question of TSD_CP009_RENDERED_PUNJABI_QUESTIONS) {
  const match = question.stem.match(/[\u0900-\u0963\u0966-\u097F]/);
  assert(!match, `Punjabi/${question.familyId}: Devanagari leakage '${match?.[0] ?? ""}' U+${match ? match[0].codePointAt(0)?.toString(16).toUpperCase() : ""}`);
}

const hindi111 = TSD_CP009_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-111");
assert(hindi111.every((question) => /ऊपरी सिरे से चलने वाली|ऊपरी सिरे वाली/.test(question.stem) && /निचले सिरे से चलने वाली|निचले सिरे वाली/.test(question.stem)), "Hindi QL111 must explicitly assign each speed to its starting end");
const punjabi111 = TSD_CP009_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-111");
assert(punjabi111.every((question) => /ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਚੱਲਣ ਵਾਲੀ|ਉੱਪਰਲੇ ਸਿਰੇ ਵਾਲੀ/.test(question.stem) && /ਹੇਠਲੇ ਸਿਰੇ ਤੋਂ ਚੱਲਣ ਵਾਲੀ|ਹੇਠਲੇ ਸਿਰੇ ਵਾਲੀ/.test(question.stem)), "Punjabi QL111 must explicitly assign each speed to its starting end");

assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-110").every((question) => /समान|एक ही|एक ही नाव/.test(question.stem)), "Hindi QL110 equal-time invariant not explicit");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-110").every((question) => /ਇੱਕੋ|ਇੱਕੋ ਰਹਿੰਦੀ|ਇੱਕੋ ਹੈ/.test(question.stem)), "Punjabi QL110 equal-time invariant not explicit");

assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-113").every((question) => /बह|तैर/.test(question.stem) && /मुड़|दिशा बदल/.test(question.stem)), "Hindi QL113 floating-object + turnaround semantics must be explicit");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-113").every((question) => /ਵਗ|ਤੈਰ/.test(question.stem) && /ਮੁੜ|ਦਿਸ਼ਾ ਬਦਲ/.test(question.stem)), "Punjabi QL113 floating-object + turnaround semantics must be explicit");

assert(TSD_CP009_RENDERED_HINDI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-114").every((question) => /स्थिर जल में गति.*(?:समान|नहीं बदलती|अपरिवर्तित)|केवल धारा|केवल प्रवाह/.test(question.stem)), "Hindi QL114 must state that only the medium changes");
assert(TSD_CP009_RENDERED_PUNJABI_QUESTIONS.filter((question) => question.qlId === "TSD-QL-114").every((question) => /ਸ਼ਾਂਤ ਪਾਣੀ.*(?:ਇੱਕੋ|ਨਹੀਂ ਬਦਲਦੀ)|ਸਿਰਫ਼ ਧਾਰਾ|ਸਿਰਫ਼ ਵਹਾਅ/.test(question.stem)), "Punjabi QL114 must state that only the medium changes");

console.log("TSD-CP-009 NATIVE HINDI/PUNJABI LOCALIZATION + AMBIGUITY PROOF: PASS");
console.log(JSON.stringify({
  hindiFamilies: 66,
  punjabiFamilies: 66,
  placeholderParity: true,
  renderedHindi: TSD_CP009_RENDERED_HINDI_QUESTIONS.length,
  renderedPunjabi: TSD_CP009_RENDERED_PUNJABI_QUESTIONS.length,
  rejectedHindiTerms: rejectedHindi.length,
  rejectedPunjabiTerms: rejectedPunjabi.length,
  ambiguityGuardedQls: ["TSD-QL-109", "TSD-QL-110", "TSD-QL-111", "TSD-QL-113", "TSD-QL-114"],
  sourceEnglishStatus: "FROZEN",
  localizationStatus: "REVIEW_CANDIDATE",
}, null, 2));
