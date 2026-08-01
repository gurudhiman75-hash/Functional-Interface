import { strict as assert } from "node:assert";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { runTmwCp009Pipeline } from "./foundation/cp009-runtime";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
let hindiCandidates = 0;
let punjabiCandidates = 0;

for (const entry of TMW_CP009_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp009-localization:${entry.qlId}:${index}`;
    const source = runTmwCp009Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp009LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp009LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      assert.deepEqual(first, second, `${entry.qlId}:${language}: deterministic replay`);
      assert.equal(first.validation.valid, true, `${entry.qlId}:${language}: ${first.validation.errors.join(" | ")}`);
      assert.equal(first.language, language);
      assert.equal(first.sourceLanguage, "en");
      assert.deepEqual(first.parameters, source.parameters, `${entry.qlId}:${language}: parameter parity`);
      assert.deepEqual(first.solution.answerValues, source.solution.answerValues, `${entry.qlId}:${language}: answer-value parity`);
      assert.equal(first.solution.answerType, source.solution.answerType, `${entry.qlId}:${language}: answer-type parity`);
      assert.equal(first.solution.answerKey, source.solution.answerKey, `${entry.qlId}:${language}: answer-key parity`);
      assert.equal(first.solution.formulaLatex, source.solution.formulaLatex, `${entry.qlId}:${language}: formula parity`);
      assert.deepEqual(first.solution.workedLatex, source.solution.workedLatex, `${entry.qlId}:${language}: worked-math parity`);
      assert.deepEqual(first.optionAudit.map((option) => option.key), source.optionAudit.map((option) => option.key), `${entry.qlId}:${language}: option-key parity`);
      assert.deepEqual(first.optionAudit.map((option) => option.misconceptionId), source.optionAudit.map((option) => option.misconceptionId), `${entry.qlId}:${language}: misconception parity`);
      assert.equal(first.correctIndex, source.correctIndex, `${entry.qlId}:${language}: correct-index parity`);
      assert.equal(first.mathematicalFingerprint, source.mathematicalFingerprint, `${entry.qlId}:${language}: fingerprint parity`);
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.options[first.correctIndex], first.solution.answerText);
      assert.equal(first.optionAudit[first.correctIndex]?.key, source.solution.answerKey);
      assert.equal(first.editorialStatus, "PENDING");
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.explanation.commonTrap.misconceptionId, source.explanation.commonTrap.misconceptionId);
      assert.notEqual(first.explanation.commonTrap.optionText, first.solution.answerText);
      assert.ok(first.explanation.givens.length >= 2);
      assert.ok(first.explanation.shortcut.steps.length >= 2);
      assert.ok(language === "hi" ? /[\u0900-\u097F]/.test(first.stem) : /[\u0A00-\u0A7F]/.test(first.stem));

      const prose = [first.stem, ...first.options, first.explanation.opening, ...first.explanation.givens, first.explanation.shortcut.title, ...first.explanation.shortcut.steps, first.explanation.commonTrap.explanation, first.explanation.conclusion].join(" ");
      assert.equal(/find[A-Z]|TMW_|Independent signed-flow|Don't fall for|Do not choose/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
      assert.equal(/\b(?:tank|reservoir|inlet|outlet|leak|litres per|hours?|full|empty|water level|flow rate)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);

      if (entry.answerType === "DIRECTION") {
        assert.equal(first.solution.answerValues.length, 1);
        assert.ok([-1, 0, 1].includes(first.solution.answerValues[0].numerator));
        assert.equal(first.options.length, 4);
      }
      if (entry.answerType === "DECISION") {
        assert.equal(first.solution.answerValues.length, 3);
        assert.ok([0, 1].includes(first.solution.answerValues[0].numerator));
        assert.ok(first.solution.answerValues[1].numerator > 0);
        assert.ok([-1, 1].includes(first.solution.answerValues[2].numerator));
        assert.match(first.solution.answerText, language === "hi" ? /^(हाँ|नहीं)/ : /^(ਹਾਂ|ਨਹੀਂ)/);
      }
      if (entry.answerType === "RATIO") {
        assert.equal(first.solution.answerText.split(":").length, source.solution.answerValues.length);
      }

      stems[language].add(first.stem);
      if (language === "hi") hindiCandidates += 1;
      else punjabiCandidates += 1;
    }
  }
}

assert.equal(TMW_CP009_REGISTRY.length, 18);
assert.equal(hindiCandidates, 360);
assert.equal(punjabiCandidates, 360);
assert.ok(stems.hi.size >= 110, `Hindi stem diversity too low: ${stems.hi.size}`);
assert.ok(stems.pa.size >= 110, `Punjabi stem diversity too low: ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-009",
  qls: TMW_CP009_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates,
  punjabiCandidates,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
