import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007LocalizedPipeline } from "./foundation/cp007-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP007_REGISTRY) {
  const seed = `tmw-cp007-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const row = `${entry.qlId}:${language}`;
    const question = runTmwCp007LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
    const prose = [
      question.stem,
      ...question.options,
      question.explanation.opening,
      ...question.explanation.givens,
      question.explanation.shortcut.title,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.optionLabel,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");

    assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent heterogeneous|Don't fall for|Do not/i.test(prose), false, `${row}: internal wording`);
    assert.equal(/\b(?:workers?|clerks?|painters?|helpers?|trainees?|machines?|printers?|automatic lines?|manual stations?|work units|components|files|copies|bottles|per day|per hour|whole job)\b/i.test(prose), false, `${row}: English leakage`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${row}: raw mixed fraction`);
    assert.equal(/प्रति-संसाधन|सक्रिय श्रेणी|केवल सिरों की संख्या|अभिलेख|भारित दर|ਪ੍ਰਤੀ-ਸਰੋਤ|ਸਰਗਰਮ ਸ਼੍ਰੇਣੀ|ਅਭਿਲੇਖ|ਭਾਰਿਤ ਦਰ/.test(prose), false, `${row}: technical wording`);
    assert.equal(/दो अनुपात जोड़ें|ਦੋ ਅਨੁਪਾਤ ਜੋੜੋ/.test(prose), false, `${row}: ratios described as addition`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${row}: trap option link`);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true, `${row}: option label`);
    assert.ok(question.explanation.givens.length >= 2, `${row}: givens`);
    assert.ok(question.explanation.shortcut.steps.length >= 2, `${row}: shortcut`);
    assert.equal(question.explanation.conclusion.includes(question.solution.answerText), true, `${row}: conclusion answer`);
    assert.equal(question.publiclyPublishable, false, `${row}: publication lock`);
    assert.equal(question.editorialStatus, "PENDING", `${row}: lifecycle`);

    if (entry.answerType === "COUNT_PAIR") {
      assert.match(question.solution.answerText, language === "hi" ? / और / : / ਅਤੇ /, row);
      assert.match(question.explanation.conclusion, language === "hi" ? /आवश्यक समूह/ : /ਲੋੜੀਂਦਾ ਸਮੂਹ/, row);
    }
    if (entry.answerType === "TRIPLE_RATIO") assert.match(question.solution.answerText, /^\d+:\d+:\d+$/, row);
    if (entry.solveMode === "findUnknownCategoryCountForTargetTime") {
      assert.match(question.explanation.opening, language === "hi" ? /ज्ञात समूह की दर घटाएँ/ : /ਜਾਣੇ ਸਮੂਹ ਦੀ ਦਰ ਘਟਾਓ/, row);
      assert.match(question.explanation.conclusion, language === "hi" ? /अतिरिक्त चाहिए/ : /ਵਾਧੂ ਚਾਹੀਦੇ/, row);
    }
    if (entry.solveMode === "findCompletionAfterCategoryReplacement") {
      assert.match(question.explanation.opening, language === "hi" ? /पुरानी दर ÷ नई दर/ : /ਪੁਰਾਣੀ ਦਰ ÷ ਨਵੀਂ ਦਰ/, row);
    }
    if (entry.solveMode === "findEquivalentStandardResourceTime") {
      assert.match(question.solution.answerText, language === "hi" ? /समतुल्य/ : /ਬਰਾਬਰ/, row);
      assert.match(question.explanation.conclusion, language === "hi" ? /समतुल्य योगदान/ : /ਬਰਾਬਰ ਯੋਗਦਾਨ/, row);
    }
    if (entry.solveMode === "findUnknownCategorySoloTime") {
      const givens = question.explanation.givens.join(" ");
      assert.equal(/e_B\s*=/.test(givens), false, `${row}: unknown rate leak`);
      assert.equal(givens.includes(question.solution.answerText), false, `${row}: answer leak`);
    }
    if (entry.solveMode === "findMinimumIntegerCrewComposition" || entry.solveMode === "findIntegerCrewCompositionUnderConstraints") {
      assert.match(prose, language === "hi" ? /पूर्णांक/ : /ਪੂਰਨ ਅੰਕ/, row);
    }

    checked += 1;
  }
}

assert.equal(checked, 32);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  localizedEditorialRows: checked,
  status: "PASS",
}, null, 2));
