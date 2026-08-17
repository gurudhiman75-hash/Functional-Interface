import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007Pipeline } from "./foundation/cp007-runtime";
import { runTmwCp007LocalizedPipeline } from "./foundation/cp007-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const counts: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };

for (const entry of TMW_CP007_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp007-localization:${entry.qlId}:${index}`;
    const english = runTmwCp007Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp007LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp007LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });

      assert.deepEqual(first, second, `${entry.qlId}:${language}: nondeterministic localization`);
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
      assert.deepEqual(first.solution.answerValues, english.solution.answerValues);
      assert.equal(first.solution.answerType, english.solution.answerType);
      assert.equal(first.solution.answerKey, english.solution.answerKey);
      assert.equal(first.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(first.solution.workedLatex, english.solution.workedLatex);
      assert.equal(first.correctIndex, english.correctIndex);
      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.deepEqual(first.optionAudit.map((option) => option.key), english.optionAudit.map((option) => option.key));
      assert.deepEqual(first.optionAudit.map((option) => option.misconceptionId), english.optionAudit.map((option) => option.misconceptionId));
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.optionAudit[first.correctIndex]?.key, first.solution.answerKey);
      assert.equal(first.options[first.correctIndex], first.solution.answerText);
      assert.ok(first.explanation.formula.startsWith("\\("));
      assert.ok(first.explanation.steps.length >= 2);
      assert.ok(first.explanation.steps.every((step) => step.startsWith("\\(") && step.endsWith("\\)")));
      assert.ok(first.explanation.givens.length >= 2);
      assert.ok(first.explanation.shortcut.title.trim().length > 0);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(first.explanation.shortcut.title) : /[\u0A00-\u0A7F]/.test(first.explanation.shortcut.title), true);
      assert.equal(/10-सेकंड|10-ਸਕਿੰਟ/.test(first.explanation.shortcut.title), false, `${entry.qlId}:${language}: generic shortcut title`);
      assert.ok(first.options.includes(first.explanation.commonTrap.optionText));
      assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");

      const learnerText = [
        first.stem,
        ...first.options,
        first.explanation.opening,
        ...first.explanation.givens,
        first.explanation.shortcut.title,
        ...first.explanation.shortcut.steps,
        first.explanation.commonTrap.explanation,
        first.explanation.conclusion,
      ].join("\n");
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Independent heterogeneous|Don't fall for|Do not/i.test(learnerText), false, `${entry.qlId}:${language}: internal wording`);
      assert.equal(/\b(?:workers?|clerks?|painters?|helpers?|trainees?|machines?|printers?|automatic lines?|manual stations?|work units|components|files|copies|bottles|per day|per hour|whole job)\b/i.test(learnerText), false, `${entry.qlId}:${language}: English learner leakage`);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);

      switch (entry.answerType) {
        case "COUNT":
          assert.match(first.solution.answerText, language === "hi" ? /श्रमिक|क्लर्क|पेंटर|सहायक|मशीन|प्रिंटर|लाइन|स्टेशन/ : /ਮਜ਼ਦੂਰ|ਕਲਰਕ|ਪੇਂਟਰ|ਸਹਾਇਕ|ਮਸ਼ੀਨ|ਪ੍ਰਿੰਟਰ|ਲਾਈਨ|ਸਟੇਸ਼ਨ/);
          break;
        case "TIME":
          assert.match(first.solution.answerText, language === "hi" ? /दिन|घंटे/ : /ਦਿਨ|ਘੰਟੇ/);
          break;
        case "RATE":
          assert.match(first.solution.answerText, language === "hi" ? /प्रति घंटा|प्रतिदिन/ : /ਪ੍ਰਤੀ ਘੰਟਾ|ਪ੍ਰਤੀ ਦਿਨ/);
          break;
        case "RATIO":
          assert.match(first.solution.answerText, /^\d+:\d+$/);
          break;
        case "TRIPLE_RATIO":
          assert.match(first.solution.answerText, /^\d+:\d+:\d+$/);
          break;
        case "COUNT_PAIR":
          assert.match(first.solution.answerText, language === "hi" ? / और / : / ਅਤੇ /);
          break;
        case "WORK":
          assert.ok(/\d|\\\(/.test(first.solution.answerText));
          break;
        case "FRACTION":
          assert.match(first.solution.answerText, language === "hi" ? /कुल काम का.*भाग/ : /ਕੁੱਲ ਕੰਮ ਦਾ.*ਹਿੱਸਾ/);
          break;
        case "RESOURCE_TIME":
          assert.match(first.solution.answerText, language === "hi" ? /समतुल्य/ : /ਬਰਾਬਰ/);
          break;
      }

      counts[language] += 1;
      stems[language].add(first.stem);
    }
  }
}

assert.equal(counts.hi, 320);
assert.equal(counts.pa, 320);
assert.ok(stems.hi.size > 100, `Hindi stem diversity is ${stems.hi.size}`);
assert.ok(stems.pa.size > 100, `Punjabi stem diversity is ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  qls: TMW_CP007_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: counts.hi,
  punjabiCandidates: counts.pa,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
