import assert from "node:assert/strict";
import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1,
  LP_001_008_LOCALIZED_GENERATORS_V1,
  type Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v1.ts";
import { LP_001_008_ENGLISH_FREEZE_V1 } from "./lp-001-008-permanent-freeze-v1.ts";

assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.sourceEnglishAuthorityId, LP_001_008_ENGLISH_FREEZE_V1.authorityId);
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.status, "HUMAN_REVIEW_CANDIDATE_V1");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.localizationFreezeStatus, "NOT_FROZEN");
assert.equal(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.questionStudioActivation, "NOT_ENABLED_UNTIL_HUMAN_APPROVAL");
assert.deepEqual(LP_001_008_HI_PA_LOCALIZATION_REVIEW_V1.supportedLanguages, ["hi", "pa"]);

const forbiddenEnglishMeta = [
  "Start with this clue", "Now use this clue", "Next take this clue", "Then apply this clue",
  "Use these connected clues", "The table becomes", "We can now write", "So far, the table is",
  "Only two arrangements", "The clues now leave two", "At this point, only two cases", "We are down to two",
  "This clue rules out", "This clue removes", "Complete the arrangement", "Answer the question",
  "From the completed table", "The completed table is", "The final table is",
];

const scriptPattern: Record<Lp001008LocalizedLanguage, RegExp> = {
  hi: /[\u0900-\u097F]/u,
  pa: /[\u0A00-\u0A7F]/u,
};

for (const language of ["hi", "pa"] as const) {
  const qls = new Set<string>();
  for (const [packageId, generator] of Object.entries(LP_001_008_LOCALIZED_GENERATORS_V1)) {
    const batch = generator(language, `localization-proof:${packageId}:${language}`, 8);
    assert.equal(batch.length, 8, `${packageId}/${language}: expected eight caselets`);
    for (const caselet of batch) {
      assert.equal(caselet.packageId, packageId);
      assert.equal(caselet.language, language);
      assert.ok(scriptPattern[language].test(caselet.scenario), `${packageId}/${language}: scenario must use target script`);
      assert.ok(caselet.learnerFacingClues.length >= 1, `${packageId}/${language}: missing localized clues`);
      for (const clue of caselet.learnerFacingClues) {
        assert.ok(scriptPattern[language].test(clue), `${packageId}/${language}: clue is not localized: ${clue}`);
        assert.ok(!clue.includes("undefined"), `${packageId}/${language}: undefined in clue`);
      }
      const englishCaselet = caselet.englishCaselet as any;
      assert.equal(caselet.children.length, englishCaselet.children.length);
      caselet.children.forEach((child, index) => {
        const english = englishCaselet.children[index];
        qls.add(child.qlId);
        assert.equal(child.qlId, english.qlId, `${packageId}/${language}: QL drift`);
        assert.equal(child.correctIndex, english.correctIndex, `${packageId}/${language}: correct-index drift`);
        assert.equal(child.difficultyBand, english.difficultyBand, `${packageId}/${language}: difficulty drift`);
        assert.equal(child.options.length, 4, `${packageId}/${language}/${child.qlId}: option count`);
        assert.equal(child.answer, child.options[child.correctIndex], `${packageId}/${language}/${child.qlId}: localized answer does not match correct option`);
        assert.ok(scriptPattern[language].test(child.stem), `${packageId}/${language}/${child.qlId}: stem must use target script`);
        assert.ok(!child.stem.includes("undefined") && !child.stem.includes("? का") && !child.stem.includes("? ਦਾ"), `${packageId}/${language}/${child.qlId}: unresolved target in stem: ${child.stem}`);
        assert.ok(scriptPattern[language].test(child.explanation.summary), `${packageId}/${language}/${child.qlId}: summary must use target script`);
        const explanation = child.explanation.lines.join("\n");
        assert.ok(scriptPattern[language].test(explanation), `${packageId}/${language}/${child.qlId}: explanation must use target script`);
        assert.ok(explanation.includes("|"), `${packageId}/${language}/${child.qlId}: progressive/final table missing`);
        assert.ok(!explanation.includes("undefined"), `${packageId}/${language}/${child.qlId}: undefined in explanation`);
        for (const phrase of forbiddenEnglishMeta) assert.ok(!explanation.includes(phrase), `${packageId}/${language}/${child.qlId}: untranslated explanation phrase: ${phrase}`);
      });
    }
  }
  assert.deepEqual([...qls].sort(), Array.from({ length: 32 }, (_, index) => `LP-QL-${String(index + 1).padStart(3, "0")}`));
}

console.log("LP-001..008 Hindi/Punjabi localization V1 proof passed: frozen semantics retained across QLs 001-032; learner-facing setup, clues, questions and explanations localized for review.");
