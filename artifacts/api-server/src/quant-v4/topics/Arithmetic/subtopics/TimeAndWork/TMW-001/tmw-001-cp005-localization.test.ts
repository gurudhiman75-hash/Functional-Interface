import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const counts: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };

for (const entry of TMW_CP005_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp005-localization:${entry.qlId}:${index}`;
    const english = runTmwCp005Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp005Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp005Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const row = `${entry.qlId}:${language}:${index}`;
      assert.deepEqual(first, second, `${row}: nondeterministic package`);
      assert.equal(first.validation.valid, true, `${row}:${first.validation.errors.join(" | ")}`);
      assert.equal(first.language, language);
      assert.equal(first.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(first.sourceLanguage, "en");
      assert.equal(first.editorialStatus, "PENDING");
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.canonicalProblemId, english.canonicalProblemId);
      assert.equal(first.questionLanguageId, english.questionLanguageId);
      assert.equal(first.solveMode, english.solveMode);
      assert.deepEqual(first.parameters, english.parameters);
      assert.deepEqual(first.solution.answer, english.solution.answer);
      assert.equal(first.solution.answerType, english.solution.answerType);
      assert.equal(first.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(first.solution.workedLatex, english.solution.workedLatex);
      assert.equal(first.correctIndex, english.correctIndex);
      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.deepEqual(first.optionAudit.map((option) => option.value), english.optionAudit.map((option) => option.value));
      assert.deepEqual(
        first.optionAudit.map((option) => option.misconceptionId),
        english.optionAudit.map((option) => option.misconceptionId),
      );
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT");
      assert.ok(first.explanation.formula.startsWith("\\("));
      assert.equal(
        (first.explanation.formula.match(/\\\(/g) ?? []).length,
        (first.explanation.formula.match(/\\\)/g) ?? []).length,
      );
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
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Do not|Don't/i.test(learnerText), false, `${row}: internal wording`);
      assert.equal(/\b(?:Operator|Technician|Clerk|Machine|Crew|Team|Inspector|Typist|Painter|Recorder|Surveyor|Assembler) [ABC]\b/.test(learnerText), false, `${row}: English actor leakage`);
      assert.equal(/\b(?:Rest day|Saturday|Sunday|Cannot be determined)\b/.test(learnerText), false, `${row}: English cycle label leakage`);
      assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(learnerText), false, `${row}: uninflected time before postposition`);
      assert.equal(/\b(?:work|cycle|turn|worker|rate|deadline|output|rest day|weekend|shift)\b/i.test(learnerText), false, `${row}: English prose leakage`);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);

      switch (first.solution.answerType) {
        case "TIME":
          assert.equal(first.options.every((option) => language === "hi" ? /(?:दिन|घंटा|घंटे|मिनट|पाली)$/.test(option) : /(?:ਦਿਨ|ਘੰਟਾ|ਘੰਟੇ|ਮਿੰਟ|ਸ਼ਿਫ਼ਟ)$/.test(option)), true);
          break;
        case "FRACTION":
          assert.equal(first.options.every((option) => option.includes(language === "hi" ? "भाग" : "ਹਿੱਸਾ")), true);
          break;
        case "COUNT":
          assert.equal(first.options.every((option) => option.endsWith(language === "hi" ? "चक्र" : "ਚੱਕਰ")), true);
          break;
        case "AGENT":
          assert.equal(first.options.every((option) => !/Operator|Technician|Clerk|Machine|Crew|Team|Inspector|Typist|Painter|Recorder|Surveyor|Assembler|Cannot/.test(option)), true);
          break;
        case "RATE":
          assert.equal(first.options.every((option) => option.includes(language === "hi" ? "पूरे काम का" : "ਪੂਰੇ ਕੰਮ ਦਾ")), true);
          assert.equal(first.options.every((option) => option.includes(language === "hi" ? "भाग" : "ਹਿੱਸਾ")), true);
          assert.equal(first.options.every((option) => option.includes(language === "hi" ? "प्रति" : "ਪ੍ਰਤੀ")), true);
          break;
        case "OUTPUT":
          assert.equal(first.options.every((option) => /\d/.test(option)), true);
          break;
      }

      if (entry.solveMode === "findOutputUnderPeriodicMachineSchedule") {
        assert.match(first.stem, language === "hi" ? /मशीन A.*मशीन B/ : /ਮਸ਼ੀਨ A.*ਮਸ਼ੀਨ B/);
        assert.equal(/पेंटर|ऑपरेटर|तकनीशियन|टीम|ਪੇਂਟਰ|ਆਪਰੇਟਰ|ਟੈਕਨੀਸ਼ੀਅਨ|ਟੀਮ/.test(first.stem), false);
      }
      if (entry.solveMode === "findCompletionWithPeriodicNegativeWork") {
        assert.match(first.explanation.opening, language === "hi" ? /बिगड़े हुए काम को घटाएँ/ : /ਖਰਾਬ ਹੋਇਆ ਕੰਮ ਘਟਾਓ/);
      }
      if (entry.solveMode === "findCompletionWhenAgentRestsEveryNthDay" || entry.solveMode === "findCompletionWithWeekendOrHolidayPattern" || entry.solveMode === "findCompletionWithTwoDaysOnOneDayOffPattern") {
        assert.match(first.explanation.shortcut.steps.join(" "), language === "hi" ? /शून्य|विश्राम/ : /ਸਿਫ਼ਰ|ਆਰਾਮ/);
      }
      if (entry.solveMode === "findTimeFromArbitraryCyclePhase") {
        if (first.explanation.commonTrap.misconceptionId === "OFFSET_IGNORED") {
          assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /दी गई शुरुआती बारी|सामान्य पहली बारी/ : /ਦਿੱਤੀ ਸ਼ੁਰੂਆਤੀ ਵਾਰੀ|ਆਮ ਪਹਿਲੀ ਵਾਰੀ/, row);
        } else if (first.explanation.commonTrap.misconceptionId === "FINAL_CYCLE_OMITTED") {
          assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /अंतिम चक्र|आवश्यक भाग/ : /ਆਖ਼ਰੀ ਚੱਕਰ|ਲੋੜੀਂਦਾ ਹਿੱਸਾ/, row);
        }
      }

      counts[language] += 1;
      stems[language].add(first.stem);
    }
  }
}

assert.equal(counts.hi, 480);
assert.equal(counts.pa, 480);
assert.ok(stems.hi.size > 180, `Hindi stem diversity is ${stems.hi.size}`);
assert.ok(stems.pa.size > 180, `Punjabi stem diversity is ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-005",
  qls: TMW_CP005_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: counts.hi,
  punjabiCandidates: counts.pa,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
