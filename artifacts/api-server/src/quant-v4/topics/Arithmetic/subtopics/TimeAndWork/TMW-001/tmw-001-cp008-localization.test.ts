import { strict as assert } from "node:assert";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { runTmwCp008Pipeline } from "./foundation/cp008-runtime";
import { runTmwCp008LocalizedPipeline } from "./foundation/cp008-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const stems: Record<TmwLocalizedLanguage, Set<string>> = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};
let hindiCandidates = 0;
let punjabiCandidates = 0;

for (const entry of TMW_CP008_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp008-localization:${entry.qlId}:${index}`;
    const source = runTmwCp008Pipeline({ questionLanguageId: entry.qlId, seed });

    for (const language of languages) {
      const first = runTmwCp008LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp008LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
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

      const prose = [
        first.stem,
        ...first.options,
        first.explanation.opening,
        ...first.explanation.givens,
        first.explanation.shortcut.title,
        ...first.explanation.shortcut.steps,
        first.explanation.commonTrap.explanation,
        first.explanation.conclusion,
      ].join(" ");
      assert.equal(/find[A-Z]|TMW_|Independent contribution|Don't fall for|Do not choose/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
      assert.equal(/\b(?:warehouse|bank|painting|factory|worker|employee|payment ratio|total payment|piece rate|bonus pool|per hour|days)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);

      if (["MONEY", "MONEY_TRIPLE"].includes(entry.answerType)) {
        assert.ok(first.options.every((option) => option.split(", ").every((part) => part.startsWith("₹"))));
      }
      if (entry.answerType === "MONEY_TRIPLE") {
        assert.equal(first.solution.answerText.split(", ").length, 3);
        assert.ok(first.options.every((option) => option.split(", ").length === 3));
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

assert.equal(TMW_CP008_REGISTRY.length, 13);
assert.equal(hindiCandidates, 260);
assert.equal(punjabiCandidates, 260);
assert.ok(stems.hi.size >= 80, `Hindi stem diversity too low: ${stems.hi.size}`);
assert.ok(stems.pa.size >= 80, `Punjabi stem diversity too low: ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-008",
  qls: TMW_CP008_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates,
  punjabiCandidates,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
