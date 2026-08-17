import { strict as assert } from "node:assert";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const counts: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };

for (const entry of TMW_CP006_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp006-localization:${entry.qlId}:${index}`;
    const english = runTmwCp006Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp006Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp006Pipeline({ questionLanguageId: entry.qlId, seed, language });
      assert.deepEqual(first, second);
      assert.equal(first.validation.valid, true, `${entry.qlId}:${language}:${first.validation.errors.join(" | ")}`);
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
      assert.equal(first.options[first.correctIndex], first.solution.answerText);
      assert.ok(first.explanation.formula.startsWith("\\("));
      assert.ok((first.explanation.givens ?? []).length >= 2);
      assert.ok(first.explanation.steps.length >= 2);
      assert.ok(first.explanation.steps.every((step) => step.startsWith("\\(") && step.endsWith("\\)")));
      assert.ok(first.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"));
      assert.ok(first.options.includes(first.explanation.commonTrap.optionText));
      assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");

      const learnerText = [
        first.stem,
        ...first.options,
        first.explanation.opening,
        ...(first.explanation.givens ?? []),
        first.explanation.shortcut.title,
        ...first.explanation.shortcut.steps,
        first.explanation.commonTrap.explanation,
        first.explanation.conclusion,
      ].join("\n");
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Independent invariant|Do not|Don't/i.test(learnerText), false, `${entry.qlId}:${language}: internal wording`);
      assert.equal(/\b(?:workers?|clerks?|packers?|painters?|inspectors?|machines?|printers?|bottling lines?|assembly units?|person-days?|worker-days?|machine-hours?|shifts?|overtime)\b/i.test(learnerText), false, `${entry.qlId}:${language}: English unit leakage`);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);

      switch (first.solution.answerType) {
        case "COUNT":
          assert.match(first.solution.answerText, language === "hi" ? /श्रमिक|क्लर्क|कर्मी|पेंटर|निरीक्षक|मशीन|लाइन|इकाई/ : /ਮਜ਼ਦੂਰ|ਕਲਰਕ|ਕਰਮਚਾਰੀ|ਪੇਂਟਰ|ਮਸ਼ੀਨ|ਲਾਈਨ|ਇਕਾਈ/);
          break;
        case "TIME":
          assert.match(first.solution.answerText, language === "hi" ? /दिन$/ : /ਦਿਨ$/);
          break;
        case "HOURS":
          assert.match(first.solution.answerText, language === "hi" ? /घंट/ : /ਘੰਟ/);
          break;
        case "EFFICIENCY":
          assert.match(first.solution.answerText, language === "hi" ? /दक्षता/ : /ਦੱਖਤਾ/);
          break;
        case "WORK":
          assert.ok(/\d|\\\(/.test(first.solution.answerText));
          break;
        case "RATIO":
          assert.match(first.solution.answerText, /^\d+:\d+$/);
          break;
        case "PERCENT":
          assert.match(first.solution.answerText, /%$/);
          break;
        case "SHIFT":
          assert.match(first.solution.answerText, language === "hi" ? /पाली|पालियाँ/ : /ਸ਼ਿਫ਼ਟ|ਸ਼ਿਫ਼ਟਾਂ/);
          break;
        case "RESOURCE_TIME":
          assert.match(first.solution.answerText, language === "hi" ? /दिन|घंटे/ : /ਦਿਨ|ਘੰਟੇ/);
          break;
      }

      counts[language] += 1;
      stems[language].add(first.stem);
    }
  }
}

assert.equal(counts.hi, 440);
assert.equal(counts.pa, 440);
assert.ok(stems.hi.size > 170, `Hindi stem diversity is ${stems.hi.size}`);
assert.ok(stems.pa.size > 170, `Punjabi stem diversity is ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-006",
  qls: TMW_CP006_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: counts.hi,
  punjabiCandidates: counts.pa,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
