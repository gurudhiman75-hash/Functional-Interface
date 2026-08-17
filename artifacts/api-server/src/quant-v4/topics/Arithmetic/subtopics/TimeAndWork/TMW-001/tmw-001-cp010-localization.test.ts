import { strict as assert } from "node:assert";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { runTmwCp010Pipeline } from "./foundation/cp010-runtime";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const stems: Record<TmwLocalizedLanguage, Set<string>> = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};
let hindiCandidates = 0;
let punjabiCandidates = 0;

for (const entry of TMW_CP010_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp010-localization:${entry.qlId}:${index}`;
    const english = runTmwCp010Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.equal(english.validation.valid, true, `${entry.qlId}:en:${english.validation.errors.join(" | ")}`);

    for (const language of languages) {
      const localized = runTmwCp010LocalizedPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });

      assert.equal(localized.validation.valid, true, `${entry.qlId}:${language}:${localized.validation.errors.join(" | ")}`);
      assert.equal(localized.questionLanguageId, english.questionLanguageId);
      assert.equal(localized.solveMode, english.solveMode);
      assert.equal(localized.seed, english.seed);
      assert.deepEqual(localized.parameters, english.parameters);
      assert.deepEqual(localized.solution.answerValues, english.solution.answerValues);
      assert.equal(localized.solution.answerType, english.solution.answerType);
      assert.equal(localized.solution.answerKey, english.solution.answerKey);
      assert.equal(localized.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(localized.solution.workedLatex, english.solution.workedLatex);
      assert.equal(localized.solution.terminalSegmentIndex, english.solution.terminalSegmentIndex);
      assert.deepEqual(
        localized.optionAudit.map((option) => option.key),
        english.optionAudit.map((option) => option.key),
      );
      assert.deepEqual(
        localized.optionAudit.map((option) => option.misconceptionId),
        english.optionAudit.map((option) => option.misconceptionId),
      );
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.equal(localized.options.length, 4);
      assert.equal(new Set(localized.options).size, 4);
      assert.equal(localized.options[localized.correctIndex], localized.solution.answerText);
      assert.equal(localized.optionAudit[localized.correctIndex]?.key, english.solution.answerKey);
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.editorialStatus, "PENDING");
      assert.equal(localized.sourceLanguage, "en");
      assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.ok(localized.stem.trim().length > 0);
      assert.ok(localized.explanation.givens.length >= 2);
      assert.ok(localized.explanation.steps.length >= 3);
      assert.ok(localized.explanation.shortcut.steps.length >= 2);
      assert.notEqual(localized.explanation.commonTrap.optionText, localized.solution.answerText);
      assert.equal(
        localized.options.includes(localized.explanation.commonTrap.optionText),
        true,
      );

      stems[language].add(localized.stem);
      if (language === "hi") hindiCandidates += 1;
      else punjabiCandidates += 1;
    }
  }
}

assert.equal(TMW_CP010_REGISTRY.length, 18);
assert.equal(hindiCandidates, 360);
assert.equal(punjabiCandidates, 360);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-010",
  qls: TMW_CP010_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates,
  punjabiCandidates,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
