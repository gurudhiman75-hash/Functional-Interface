import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP005_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp005-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const row = `${entry.qlId}:${language}:${index}`;
      const question = runTmwCp005Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const prose = [
        question.stem,
        question.explanation.opening,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
      assert.equal(/दिया गया कार्य:|दिया गया काम:|ਦਿੱਤਾ ਗਿਆ ਕੰਮ:/.test(question.stem), false, `${row}: mechanical assignment header`);
      assert.equal(/काम की जिम्मेदारी|ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ/.test(question.stem), false, `${row}: bureaucratic responsibility wording`);
      assert.equal(/काम [^।;]+ से होता है|ਕੰਮ [^।;]+ ਨਾਲ ਹੁੰਦਾ ਹੈ/.test(question.stem), false, `${row}: agent-as-instrument phrasing`);
      assert.equal(/(?:[2-9]|\d{2,}) घंटा\b|(?:[2-9]|\d{2,}) ਘੰਟਾ\b/.test([prose, ...question.options].join("\n")), false, `${row}: plural hour agreement`);
      assert.equal(/चक्र[^।]* दोहरता है|क्रम[^।]* दोहरता है|ਚੱਕਰ[^।]* ਦੁਹਰਦਾ ਹੈ|ਕ੍ਰਮ[^।]* ਦੁਹਰਦਾ ਹੈ/.test(prose), false, `${row}: repeated-cycle verb`);
      assert.equal(/अंतिम पूरा होने वाले चक्र|आख਼ਰੀ ਪੂਰਾ ਹੋਣ ਵਾਲੇ ਚੱਕਰ/.test(question.explanation.commonTrap.explanation), false, `${row}: stale generic trap`);
      assert.equal(/अंतिम आवश्यक चक्र या अधूरी बारी|ਆਖ਼ਰੀ ਲੋੜੀਂਦੇ ਚੱਕਰ ਜਾਂ ਅਧੂਰੀ ਵਾਰੀ/.test(question.explanation.commonTrap.explanation), false, `${row}: uncustomized trap`);
      assert.equal(/हर खंड का दर|ਹਰ ਖੰਡ ਦਾ ਦਰ|पाली-अवधि|ਸ਼ਿਫ਼ਟ ਮਿਆਦ|मशीनों का दर|ਮਸ਼ੀਨਾਂ ਦਾ ਦਰ/.test(prose), false, `${row}: shortcut grammar`);
      assert.equal(/(?:[2-9]|\d{2,}) चक्र के बाद|(?:[2-9]|\d{2,}) ਚੱਕਰ ਤੋਂ ਬਾਅਦ/.test(prose), false, `${row}: cycle-count inflection`);
      assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${row}: time postposition`);
      assert.equal(/\bk-|kवें|kਵੇਂ/.test(prose), false, `${row}: unexplained symbolic cycle notation`);
      assert.equal(/अंतिम सक्रिय बारी|अगली सक्रिय दर|चक्र की अवस्था|अज्ञात सक्रिय समय|शुद्ध चक्र-काम|ਆਖ਼ਰੀ ਸਰਗਰਮ ਵਾਰੀ|ਅਗਲੀ ਸਰਗਰਮ ਦਰ|ਚੱਕਰ ਦੀ ਸਥਿਤੀ|ਅਣਜਾਣ ਸਰਗਰਮ ਸਮੇਂ|ਸ਼ੁੱਧ ਚੱਕਰ-ਕੰਮ/.test(prose), false, `${row}: technical cycle terminology`);
      assert.equal(/हानिकारक प्रक्रिया|नुकसान वाली प्रक्रिया|ਨੁਕਸਾਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ/.test(prose), false, `${row}: technical negative-work label`);

      if (entry.solveMode === "findTerminalAgent") {
        assert.match(question.explanation.conclusion, language === "hi" ? /की बारी में पूरा होगा/ : /ਦੀ ਵਾਰੀ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ/, row);
      }
      if (entry.solveMode === "findStartingAgentFromCompletionCondition") {
        assert.match(question.explanation.opening, language === "hi" ? /दोनों क्रम अलग.*अंतिम बारी/ : /ਦੋਵੇਂ ਕ੍ਰਮ ਵੱਖ.*ਆਖ਼ਰੀ ਵਾਰੀ/, row);
        assert.match(question.explanation.conclusion, language === "hi" ? /कुल समय और अंतिम बारी/ : /ਕੁੱਲ ਸਮਾਂ ਅਤੇ ਆਖ਼ਰੀ ਵਾਰੀ/, row);
      }
      if (entry.solveMode === "findUnknownTimeFromAlternatingCompletion") {
        assert.match(question.explanation.conclusion, language === "hi" ? /अकेले काम करने का कुल समय/ : /ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ/, row);
        assert.ok(question.explanation.conclusion.includes(question.solution.answerText));
      }
      if (entry.solveMode === "findCompletionWhenHelperWorksEveryNthDay") {
        assert.match(question.explanation.opening, language === "hi" ? /सहायता वाले दिन.*अतिरिक्त काम/ : /ਮਦਦ ਵਾਲੇ ਦਿਨ.*ਵਾਧੂ ਕੰਮ/, row);
      }
      if (entry.solveMode === "findCompletionWhenAgentRestsEveryNthDay") {
        assert.match(question.stem, language === "hi" ? /कोई काम नहीं होता/ : /ਕੋਈ ਕੰਮ ਨਹੀਂ ਹੁੰਦਾ/, row);
      }
      if (entry.solveMode === "findCompletionWithPeriodicNegativeWork") {
        assert.match(question.stem, language === "hi" ? /काम बिगाड़ने वाली प्रक्रिया/ : /ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ/, row);
      }
      if (entry.solveMode === "findTimeFromArbitraryCyclePhase") {
        if (question.explanation.commonTrap.misconceptionId === "OFFSET_IGNORED") {
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /दी गई शुरुआती बारी.*सामान्य पहली बारी/ : /ਦਿੱਤੀ ਸ਼ੁਰੂਆਤੀ ਵਾਰੀ.*ਆਮ ਪਹਿਲੀ ਵਾਰੀ/, row);
        } else if (question.explanation.commonTrap.misconceptionId === "FINAL_CYCLE_OMITTED") {
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अंतिम चक्र|आवश्यक भाग/ : /ਆਖ਼ਰੀ ਚੱਕਰ|ਲੋੜੀਂਦਾ ਹਿੱਸਾ/, row);
        }
      }
      if (entry.solveMode === "findOutputUnderPeriodicMachineSchedule") {
        assert.match(question.stem, language === "hi" ? /मशीन A.*मशीन B/ : /ਮਸ਼ੀਨ A.*ਮਸ਼ੀਨ B/);
        assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /मशीनों के लिए दर × समय/ : /ਮਸ਼ੀਨਾਂ ਲਈ ਦਰ × ਸਮਾਂ/);
        assert.match(question.explanation.conclusion, language === "hi" ? /दोहरावों में कुल उत्पादन/ : /ਦੁਹਰਾਵਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ/);
      }
      if (entry.solveMode === "findRequiredCycleRateForDeadline") {
        assert.match(question.explanation.conclusion, language === "hi" ? /जब भी .* की बारी/ : /ਜਦੋਂ ਵੀ .* ਦੀ ਵਾਰੀ/, row);
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 960);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-005",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
