import { strict as assert } from "node:assert";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { runTmwCp002Pipeline } from "./foundation/cp002-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const counts: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };

for (const entry of TMW_CP002_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp002-localization:${entry.qlId}:${index}`;
    const english = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed, language });
      assert.equal(first.validation.valid, true, `${entry.qlId}:${language}:${first.validation.errors.join(" | ")}`);
      assert.deepEqual(first, second);
      assert.equal(first.language, language);
      assert.equal(first.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(first.sourceLanguage, "en");
      assert.equal(first.editorialStatus, "PENDING");
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.canonicalProblemId, english.canonicalProblemId);
      assert.equal(first.questionLanguageId, english.questionLanguageId);
      assert.equal(first.solveMode, english.solveMode);
      assert.deepEqual(first.parameters, english.parameters);
      assert.equal(first.solution.answer.numerator, english.solution.answer.numerator);
      assert.equal(first.solution.answer.denominator, english.solution.answer.denominator);
      assert.equal(first.solution.answerType, english.solution.answerType);
      assert.equal(first.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(first.solution.workedLatex, english.solution.workedLatex);
      assert.equal(first.correctIndex, english.correctIndex);
      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.deepEqual(first.optionAudit.map((option) => option.value), english.optionAudit.map((option) => option.value));
      assert.deepEqual(first.optionAudit.map((option) => option.misconceptionId), english.optionAudit.map((option) => option.misconceptionId));
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT");
      assert.ok(first.explanation.formula.startsWith("\\("));
      assert.equal((first.explanation.formula.match(/\\\(/g) ?? []).length, (first.explanation.formula.match(/\\\)/g) ?? []).length);
      assert.ok(first.explanation.steps.length >= 3);
      assert.ok(first.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"));
      assert.ok(first.options.includes(first.explanation.commonTrap.optionText));
      assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");
      const learnerText = [first.stem, ...first.options, first.explanation.opening, ...first.explanation.shortcut.steps, first.explanation.commonTrap.explanation, first.explanation.conclusion].join("\n");
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Do not|Don't/i.test(learnerText), false);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);
      counts[language] += 1;
      stems[language].add(first.stem);
    }
  }
}

assert.equal(counts.hi, 280);
assert.equal(counts.pa, 280);
assert.ok(stems.hi.size > 180, `Hindi stem diversity is ${stems.hi.size}`);
assert.ok(stems.pa.size > 180, `Punjabi stem diversity is ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-002",
  qls: TMW_CP002_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: counts.hi,
  punjabiCandidates: counts.pa,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
