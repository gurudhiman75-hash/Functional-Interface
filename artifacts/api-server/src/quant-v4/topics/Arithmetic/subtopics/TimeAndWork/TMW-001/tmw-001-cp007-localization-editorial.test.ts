import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007LocalizedPipeline } from "./foundation/cp007-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP007_REGISTRY) {
  const seed = `tmw-cp007-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
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

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent heterogeneous|Don't fall for|Do not/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
    assert.equal(/\b(?:workers?|clerks?|painters?|helpers?|trainees?|machines?|printers?|automatic lines?|manual stations?|work units|components|files|copies|bottles|per day|per hour|whole job)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
    assert.equal(/\d+ दिन में|\d+ घंटे में|\d+ ਦਿਨ ਵਿੱਚ|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time postposition`);
    assert.equal(/एक (?:भारी मशीनें|मानक मशीनें|छोटी मशीनें|तेज़ मशीनें|स्वचालित बोतल लाइनें|अर्ध-स्वचालित बोतल लाइनें)|ਇੱਕ (?:ਭਾਰੀ ਮਸ਼ੀਨਾਂ|ਮਿਆਰੀ ਮਸ਼ੀਨਾਂ|ਛੋਟੀਆਂ ਮਸ਼ੀਨਾਂ|ਤੇਜ਼ ਮਸ਼ੀਨਾਂ|ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ|ਅਰਧ-ਆਟੋਮੈਟਿਕ ਬੋਤਲ ਲਾਈਨਾਂ)/.test(prose), false, `${entry.qlId}:${language}: singular category agreement`);
    assert.equal(/in \d|positive-integer|weighted-rate|per-unit|category efficiencies|headcount/i.test(prose), false, `${entry.qlId}:${language}: untranslated academic wording`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.ok(question.explanation.givens.length >= 2);
    assert.ok(question.explanation.shortcut.title.startsWith(language === "hi" ? "10-सेकंड" : "10-ਸਕਿੰਟ"));
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    switch (entry.ruleId) {
      case "TMW_CATEGORY_EQUIVALENCE":
        assert.match(question.explanation.opening, language === "hi" ? /कुल क्षमता बराबर.*विपरीत/ : /ਕੁੱਲ ਸਮਰੱਥਾ ਬਰਾਬਰ.*ਉਲਟੀ/);
        break;
      case "TMW_WEIGHTED_CREW_RATE":
        assert.match(question.explanation.opening, language === "hi" ? /संख्या.*दक्षता.*संयुक्त दर/ : /ਗਿਣਤੀ.*ਦੱਖਤਾ.*ਸਾਂਝੀ ਦਰ/);
        break;
      case "TMW_HETEROGENEOUS_LINEAR_SYSTEM":
        assert.match(question.explanation.opening, language === "hi" ? /अलग अज्ञात.*समीकरण/ : /ਵੱਖ ਅਣਜਾਣ.*ਸਮੀਕਰਨ/);
        break;
      case "TMW_CATEGORY_REPLACEMENT":
        assert.match(question.explanation.opening, language === "hi" ? /बदले समूह.*व्युत्क्रमानुपाती/ : /ਬਦਲੇ ਸਮੂਹ.*ਉਲਟ ਅਨੁਪਾਤ/);
        break;
      case "TMW_WEIGHTED_CONTRIBUTION":
        assert.match(question.explanation.opening, language === "hi" ? /संख्या और व्यक्तिगत दक्षता/ : /ਗਿਣਤੀ ਅਤੇ ਵਿਅਕਤੀਗਤ ਦੱਖਤਾ/);
        break;
      case "TMW_INTEGER_CREW_SEARCH":
        assert.match(question.explanation.opening, language === "hi" ? /धनात्मक पूर्णांक/ : /ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ/);
        break;
    }

    if (entry.answerType === "COUNT_PAIR") {
      assert.match(question.solution.answerText, language === "hi" ? / और / : / ਅਤੇ /);
      assert.match(question.explanation.conclusion, language === "hi" ? /समूह की संरचना/ : /ਸਮੂਹ ਦੀ ਬਣਤਰ/);
    }
    if (entry.answerType === "TRIPLE_RATIO") assert.match(question.solution.answerText, /^\d+:\d+:\d+$/);
    if (entry.solveMode === "findUnknownCategoryCountForTargetTime") {
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /ज्ञात समूह की दर घटाकर/ : /ਜਾਣੇ ਸਮੂਹ ਦੀ ਦਰ ਘਟਾ ਕੇ/);
    }
    if (entry.solveMode === "findCompletionAfterCategoryReplacement") {
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /पुराना समय.*पुरानी दर.*नई दर/ : /ਪੁਰਾਣਾ ਸਮਾਂ.*ਪੁਰਾਣੀ ਦਰ.*ਨਵੀਂ ਦਰ/);
    }
    if (entry.solveMode === "findEquivalentStandardResourceTime") {
      assert.match(question.solution.answerText, language === "hi" ? /समतुल्य/ : /ਬਰਾਬਰ/);
    }
    if (entry.solveMode === "findMinimumIntegerCrewComposition" || entry.solveMode === "findIntegerCrewCompositionUnderConstraints") {
      assert.match(prose, language === "hi" ? /पूर्णांक/ : /ਪੂਰਨ ਅੰਕ/);
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
