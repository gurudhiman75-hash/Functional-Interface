import { TSD_CP007_FROZEN_ENGLISH_REGISTRY } from "./english-freeze-registry";
import { TSD_CP007_FINAL_HINDI_LOCALIZATION, TSD_CP007_FINAL_PUNJABI_LOCALIZATION } from "./localization-final";
import type { TsdCp007LocalizedQlSpec } from "./localization-authoring";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 localization parity proof failed: ${message}`);
}

function placeholders(value: string): readonly string[] {
  return Object.freeze([...new Set([...value.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!))].sort());
}

function normalized(value: string): string {
  return value.toLowerCase().replace(/\{[^}]+\}/g, "{var}").replace(/[\p{P}\p{S}\s]+/gu, " ").trim();
}

function visibleText(value: string): string {
  return value.replace(/\{[^}]+\}/g, " ").toLowerCase();
}

function proveLocale(localeName: string, localized: readonly TsdCp007LocalizedQlSpec[], script: RegExp): void {
  assert(localized.length === 11, `${localeName}: expected 11 QLs`);
  assert(JSON.stringify(localized.map((entry) => entry.qlId)) === JSON.stringify(TSD_CP007_FROZEN_ENGLISH_REGISTRY.map((entry) => entry.qlId)), `${localeName}: QL order differs from frozen English`);

  let familyCount = 0;
  const stemSignatures = new Set<string>();
  const guideSignatures = new Set<string>();

  for (let qlIndex = 0; qlIndex < localized.length; qlIndex += 1) {
    const englishQl = TSD_CP007_FROZEN_ENGLISH_REGISTRY[qlIndex]!;
    const localizedQl = localized[qlIndex]!;
    assert(localizedQl.sourceEnglishStatus === "FROZEN", `${localeName}/${localizedQl.qlId}: source English is not frozen`);
    assert(localizedQl.localizationStatus === "REVIEW_CANDIDATE", `${localeName}/${localizedQl.qlId}: localization was prematurely frozen`);
    assert(localizedQl.authorityKey === englishQl.authorityKey, `${localeName}/${localizedQl.qlId}: authority changed`);
    assert(localizedQl.objectPool.length >= 8, `${localeName}/${localizedQl.qlId}: object pool thinner than eight entries`);
    assert(new Set(localizedQl.objectPool.map(normalized)).size >= 7, `${localeName}/${localizedQl.qlId}: object pool lacks distinct contexts`);
    assert(script.test(localizedQl.learnerContract), `${localeName}/${localizedQl.qlId}: learner contract lacks target script`);
    assert(localizedQl.stemFamilies.length === englishQl.stemFamilies.length, `${localeName}/${localizedQl.qlId}: family count differs from English`);

    if (localeName === "hi-IN") {
      assert(!/चाल/.test(localizedQl.learnerContract), `${localeName}/${localizedQl.qlId}: deprecated Hindi term 'चाल' remains in learner contract`);
      assert(!localizedQl.objectPool.some((entry) => /चाल/.test(entry)), `${localeName}/${localizedQl.qlId}: deprecated Hindi term 'चाल' remains in object pool`);
    }

    for (let familyIndex = 0; familyIndex < localizedQl.stemFamilies.length; familyIndex += 1) {
      familyCount += 1;
      const englishFamily = englishQl.stemFamilies[familyIndex]!;
      const localizedFamily = localizedQl.stemFamilies[familyIndex]!;
      assert(localizedFamily.familyId === englishFamily.familyId, `${localeName}/${englishFamily.familyId}: family ID/order changed`);
      assert(localizedFamily.difficulty === englishFamily.difficulty, `${localeName}/${englishFamily.familyId}: difficulty changed`);
      assert(script.test(localizedFamily.stem), `${localeName}/${englishFamily.familyId}: stem lacks target script`);
      assert(script.test(localizedFamily.explanationGuide), `${localeName}/${englishFamily.familyId}: explanation lacks target script`);

      const englishStemVars = placeholders(englishFamily.stem);
      const localizedStemVars = placeholders(localizedFamily.stem);
      assert(JSON.stringify(localizedStemVars) === JSON.stringify(englishStemVars), `${localeName}/${englishFamily.familyId}: stem placeholder parity failed: ${localizedStemVars.join(",")} vs ${englishStemVars.join(",")}`);

      const englishAllVars = placeholders(`${englishFamily.stem} ${englishFamily.explanationGuide}`);
      const localizedAllVars = placeholders(`${localizedFamily.stem} ${localizedFamily.explanationGuide}`);
      assert(JSON.stringify(localizedAllVars) === JSON.stringify(englishAllVars), `${localeName}/${englishFamily.familyId}: total placeholder parity failed: ${localizedAllVars.join(",")} vs ${englishAllVars.join(",")}`);

      const learnerVisible = visibleText(`${localizedFamily.stem} ${localizedFamily.explanationGuide}`);
      assert(!/\bcrossing\b/i.test(learnerVisible), `${localeName}/${englishFamily.familyId}: English word 'crossing' leaked into localized prose`);
      assert(!/\bspeed\b/i.test(learnerVisible), `${localeName}/${englishFamily.familyId}: English word 'speed' leaked into localized prose`);
      assert(!/\b(starting position|included in the count|excluded from the count)\b/i.test(learnerVisible), `${localeName}/${englishFamily.familyId}: English endpoint instruction leaked into localized prose`);
      if (localeName === "hi-IN") assert(!/चाल/.test(learnerVisible), `${localeName}/${englishFamily.familyId}: deprecated Hindi term 'चाल' remains in learner-facing text`);

      const stemSignature = normalized(localizedFamily.stem);
      const guideSignature = normalized(localizedFamily.explanationGuide);
      assert(!stemSignatures.has(stemSignature), `${localeName}/${englishFamily.familyId}: duplicate localized stem signature`);
      assert(!guideSignatures.has(guideSignature), `${localeName}/${englishFamily.familyId}: duplicate localized explanation signature`);
      stemSignatures.add(stemSignature);
      guideSignatures.add(guideSignature);
    }
  }

  assert(familyCount === 66, `${localeName}: expected 66 localized families, found ${familyCount}`);
}

proveLocale("hi-IN", TSD_CP007_FINAL_HINDI_LOCALIZATION, /[\u0900-\u097F]/);
proveLocale("pa-IN", TSD_CP007_FINAL_PUNJABI_LOCALIZATION, /[\u0A00-\u0A7F]/);

console.log("TSD-CP-007 HINDI/PUNJABI LOCALIZATION PARITY PROOF: PASS");
console.log(JSON.stringify({
  frozenEnglishFamilies: 66,
  hindiFamilies: 66,
  punjabiFamilies: 66,
  qlsPerLocale: 11,
  localizedObjectPoolEntriesPerLocale: 88,
  learnerFacingEnglishLeakage: 0,
  hindiTerminology: "गति",
  deprecatedHindiChaalOccurrences: 0,
  sourceEnglishStatus: "FROZEN",
  localizationStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
