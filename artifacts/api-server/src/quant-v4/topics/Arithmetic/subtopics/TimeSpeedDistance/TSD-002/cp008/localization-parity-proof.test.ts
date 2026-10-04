import { TSD_CP008_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP008_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP008_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import type { TsdCp008LocalizationRegistry } from "./localization-types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-008 localization parity proof failed: ${message}`);
}

function placeholders(value: string): readonly string[] {
  return Object.freeze([...value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!).sort());
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\{[^}]+\}/g, "#").replace(/[\p{P}\p{S}\s]+/gu, " ").trim();
}

const englishQls = new Map(TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => [ql.qlId, ql] as const));
const englishOrder = TSD_CP008_FROZEN_ENGLISH_REGISTRY.map((ql) => ql.qlId);

function proveRegistry(registry: TsdCp008LocalizationRegistry): void {
  const isHindi = registry.locale === "hi-IN";
  const targetScript = isHindi ? /\p{Script=Devanagari}/u : /\p{Script=Gurmukhi}/u;
  assert(registry.qls.length === 9, `${registry.locale}: expected 9 QLs`);
  assert(JSON.stringify(registry.qls.map((ql) => ql.qlId)) === JSON.stringify(englishOrder), `${registry.locale}: QL order differs from frozen English`);
  const localizedStems: string[] = [];
  const localizedGuides: string[] = [];

  for (const ql of registry.qls) {
    const englishQl = englishQls.get(ql.qlId);
    assert(englishQl, `${registry.locale}/${ql.qlId}: frozen English QL missing`);
    assert(ql.authorityKey === englishQl.authorityKey, `${registry.locale}/${ql.qlId}: authority mismatch`);
    assert(ql.sourceEnglishStatus === "FROZEN", `${registry.locale}/${ql.qlId}: source English is not FROZEN`);
    assert(ql.localizationStatus === "REVIEW_CANDIDATE", `${registry.locale}/${ql.qlId}: localization status changed`);
    assert(ql.objectPool.length >= 8 && new Set(ql.objectPool.map(normalize)).size >= 8, `${registry.locale}/${ql.qlId}: object pool is thin`);
    assert(targetScript.test(ql.learnerContract), `${registry.locale}/${ql.qlId}: learner contract lacks target script`);
    assert(ql.families.length === englishQl.stemFamilies.length, `${registry.locale}/${ql.qlId}: family count mismatch`);

    for (let index = 0; index < ql.families.length; index += 1) {
      const localized = ql.families[index]!;
      const english = englishQl.stemFamilies[index]!;
      assert(localized.familyId === english.familyId, `${registry.locale}/${ql.qlId}: family ID/order mismatch at ${index}`);
      assert(localized.difficulty === english.difficulty, `${registry.locale}/${localized.familyId}: difficulty mismatch`);
      assert(JSON.stringify(placeholders(localized.stem)) === JSON.stringify(placeholders(english.stem)), `${registry.locale}/${localized.familyId}: stem placeholder mismatch`);
      assert(targetScript.test(localized.stem), `${registry.locale}/${localized.familyId}: stem lacks target script`);
      assert(targetScript.test(localized.explanationGuide), `${registry.locale}/${localized.familyId}: explanation lacks target script`);
      assert(!/\b(?:train|speed|crossing|platform|bridge|observer|relative)\b/i.test(localized.stem.replace(/\{[^}]+\}/g, "")), `${registry.locale}/${localized.familyId}: learner stem leaks English terminology`);
      assert(!/\b(?:train|speed|crossing|platform|bridge|observer|relative)\b/i.test(localized.explanationGuide.replace(/\{[^}]+\}/g, "")), `${registry.locale}/${localized.familyId}: explanation leaks English terminology`);
      if (isHindi) {
        assert(!/चाल/.test(localized.stem), `${localized.familyId}: deprecated Hindi term चाल appears in stem`);
        assert(!/चाल/.test(localized.explanationGuide), `${localized.familyId}: deprecated Hindi term चाल appears in explanation`);
      }
      localizedStems.push(normalize(localized.stem));
      localizedGuides.push(normalize(localized.explanationGuide));
    }
  }

  assert(localizedStems.length === 54, `${registry.locale}: expected 54 families`);
  assert(new Set(localizedStems).size === 54, `${registry.locale}: localized stems are structurally duplicated`);
  assert(new Set(localizedGuides).size === 54, `${registry.locale}: localized explanation guides are structurally duplicated`);
}

proveRegistry(TSD_CP008_HINDI_LOCALIZATION);
proveRegistry(TSD_CP008_PUNJABI_LOCALIZATION);

console.log("TSD-CP-008 HINDI/PUNJABI TEMPLATE PARITY PROOF: PASS");
console.log(JSON.stringify({
  locales: ["hi-IN", "pa-IN"],
  qlsPerLocale: 9,
  familiesPerLocale: 54,
  sourceEnglishStatus: "FROZEN",
  localizationStatus: "REVIEW_CANDIDATE",
  hindiTerminology: "गति",
  deprecatedHindiChaalOccurrences: 0,
}, null, 2));
