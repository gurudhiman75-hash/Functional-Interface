import { strict as assert } from "node:assert";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { runTmwCp003Pipeline } from "./foundation/cp003-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const counts: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const outputModes = new Set([
  "findOutputFromEfficiencyRatioAndReferenceOutput",
  "findReferenceOutputFromEfficiencyRatioAndOtherOutput",
  "findComparativeOutputFromDifferentEfficienciesAndDurations",
]);

for (const entry of TMW_CP003_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp003-localization:${entry.qlId}:${index}`;
    const english = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp003Pipeline({ questionLanguageId: entry.qlId, seed, language });
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
      const learnerText = [
        first.stem,
        ...first.options,
        first.explanation.opening,
        first.explanation.shortcut.title,
        ...first.explanation.shortcut.steps,
        first.explanation.commonTrap.explanation,
        first.explanation.conclusion,
      ].join("\n");
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Do not|Don't/i.test(learnerText), false);
      assert.equal(/\b(?:operator|technician|clerk|machine|crew|packer|inspector|typist|painter|worker|surveyor|assembler|efficiency ratio|completion time|reference output)\b/i.test(learnerText), false, `${entry.qlId}:${language}: English leakage`);
      assert.equal(/आउटपुट/.test(learnerText), false, `${entry.qlId}: transliterated output wording`);
      assert.equal(/\b\d+\s+\d+\/\d+%/.test(learnerText), false, `${entry.qlId}: raw mixed percentage`);
      assert.equal(/(?:वस्तुएँ|पुस्तिकाएँ|इकाइयाँ) पूरा करता|(?:ਵਸਤੂਆਂ|ਪੁਸਤਿਕਾਵਾਂ|ਇਕਾਈਆਂ|ਅਰਜ਼ੀਆਂ) ਪੂਰੇ ਕਰਦਾ/.test(first.stem), false, `${entry.qlId}:${language}: output agreement`);
      assert.equal(/A .+ और .+ B .+ काम करता है|A .+ ਅਤੇ .+ B .+ ਕੰਮ ਕਰਦਾ ਹੈ/.test(first.stem), false, `${entry.qlId}:${language}: plural-subject agreement`);
      assert.equal(/मशीन A.+समय लेता है|ਮਸ਼ੀਨ A.+ਸਮਾਂ ਲੈਂਦਾ ਹੈ/.test(first.explanation.conclusion), false, `${entry.qlId}:${language}: machine time agreement`);
      assert.equal(/\b(?!1\b)\d+ दिन में/.test(first.stem), false, `${entry.qlId}: Hindi day postposition`);
      assert.equal(/\b(?!1\b)\d+ ਦਿਨ ਵਿੱਚ/.test(first.stem), false, `${entry.qlId}: Punjabi day postposition`);
      assert.equal(/उत्पादन \d+ (?:वस्तुएँ|कमरे|पुस्तिकाएँ|इकाइयाँ) है|ਉਤਪਾਦਨ \d+ (?:ਵਸਤੂਆਂ|ਕਮਰੇ|ਪੁਸਤਿਕਾਵਾਂ|ਇਕਾਈਆਂ) ਹੈ/.test(first.stem), false, `${entry.qlId}:${language}: output quantity agreement`);
      assert.equal(/(?:आवश्यक )?उत्पादन \d+ (?:वस्तुएँ|कमरे|पुस्तिकाएँ|इकाइयाँ) मिलता है|(?:ਲੋੜੀਂਦਾ )?ਉਤਪਾਦਨ \d+ (?:ਵਸਤੂਆਂ|ਕਮਰੇ|ਪੁਸਤਿਕਾਵਾਂ|ਇਕਾਈਆਂ) ਮਿਲਦਾ ਹੈ/.test(first.explanation.shortcut.steps.join(" ")), false, `${entry.qlId}:${language}: output shortcut agreement`);
      if (first.solution.answerType === "PERCENT") {
        assert.equal(first.options.every((option) => /^\d+%$|^\\\(.+\\%\\\)$/.test(option)), true, `${entry.qlId}:${language}: percent option formatting`);
      }
      if (outputModes.has(entry.solveMode)) {
        assert.match(first.stem, language === "hi" ? /के बराबर/ : /ਦੇ ਬਰਾਬਰ/);
        assert.match(first.explanation.shortcut.steps.join(" "), language === "hi" ? /के बराबर/ : /ਦੇ ਬਰਾਬਰ/);
        assert.match(first.explanation.conclusion, language === "hi" ? /के बराबर/ : /ਦੇ ਬਰਾਬਰ/);
      }
      if (entry.solveMode === "findSuccessiveEfficiencyRatioAcrossThreeAgents") {
        assert.equal(/अनुपात जोड़ें|श्रृंखला जोड़|ਅਨੁਪਾਤ ਜੋੜੋ|ਲੜੀ ਜੋੜ/.test([first.explanation.opening, ...first.explanation.shortcut.steps].join(" ")), false);
        assert.match(first.explanation.opening, language === "hi" ? /दोनों अनुपात मिलाएँ/ : /ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਓ/);
        assert.match(first.explanation.shortcut.steps.join(" "), language === "hi" ? /दोनों अनुपात मिलाने/ : /ਦੋਵੇਂ ਅਨੁਪਾਤ ਮਿਲਾਉਣ/);
      }
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);
      counts[language] += 1;
      stems[language].add(first.stem);
    }
  }
}

assert.equal(counts.hi, 460);
assert.equal(counts.pa, 460);
assert.ok(stems.hi.size > 250, `Hindi stem diversity is ${stems.hi.size}`);
assert.ok(stems.pa.size > 250, `Punjabi stem diversity is ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-003",
  qls: TMW_CP003_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: counts.hi,
  punjabiCandidates: counts.pa,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
