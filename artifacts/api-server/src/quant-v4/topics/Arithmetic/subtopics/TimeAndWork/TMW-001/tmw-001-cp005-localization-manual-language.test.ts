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
      const question = runTmwCp005Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const prose = [
        question.stem,
        question.explanation.opening,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
      assert.equal(
        /^(?!दिया गया कार्य:).+ अकेले पूरा करने में |^(?!ਦਿੱਤਾ ਗਿਆ ਕੰਮ:).+ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ /m.test(question.stem),
        false,
        `${entry.qlId}:${language}: assignment agreement`,
      );
      assert.equal(
        /दिया गया काम .+ काम है|ਦਿੱਤਾ ਗਿਆ ਕੰਮ .+ ਕੰਮ ਹੈ/.test(question.stem),
        false,
        `${entry.qlId}:${language}: mechanical assignment header`,
      );
      assert.equal(
        /काम [^।;]+ से होता है|ਕੰਮ [^।;]+ ਨਾਲ ਹੁੰਦਾ ਹੈ/.test(question.stem),
        false,
        `${entry.qlId}:${language}: agent-as-instrument phrasing`,
      );
      assert.equal(
        /(?:[2-9]|\d{2,}) घंटा\b|(?:[2-9]|\d{2,}) ਘੰਟਾ\b/.test([prose, ...question.options].join("\n")),
        false,
        `${entry.qlId}:${language}: plural hour agreement`,
      );
      assert.equal(
        /चक्र[^।]* दोहरता है|क्रम[^।]* दोहरता है|ਚੱਕਰ[^।]* ਦੁਹਰਦਾ ਹੈ|ਕ੍ਰਮ[^।]* ਦੁਹਰਦਾ ਹੈ/.test(prose),
        false,
        `${entry.qlId}:${language}: repeated-cycle verb`,
      );
      assert.equal(
        /अंतिम पूरा होने वाले चक्र|ਆਖ਼ਰੀ ਪੂਰਾ ਹੋਣ ਵਾਲੇ ਚੱਕਰ/.test(question.explanation.commonTrap.explanation),
        false,
        `${entry.qlId}:${language}: stale generic trap`,
      );
      assert.equal(
        /हर खंड का दर|ਹਰ ਖੰਡ ਦਾ ਦਰ|पाली-अवधि|ਸ਼ਿਫ਼ਟ ਮਿਆਦ|मशीनों का दर|ਮਸ਼ੀਨਾਂ ਦਾ ਦਰ/.test(prose),
        false,
        `${entry.qlId}:${language}: shortcut grammar`,
      );
      assert.equal(
        /(?:[2-9]|\d{2,}) चक्र के बाद|(?:[2-9]|\d{2,}) ਚੱਕਰ ਤੋਂ ਬਾਅਦ/.test(prose),
        false,
        `${entry.qlId}:${language}: cycle-count inflection`,
      );
      assert.equal(
        /\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose),
        false,
        `${entry.qlId}:${language}: time postposition`,
      );
      assert.equal(
        /\bk-|kवें|kਵੇਂ/.test(prose),
        false,
        `${entry.qlId}:${language}: unexplained symbolic cycle notation`,
      );
      assert.equal(
        /दोहराया मशीन-चक्र|ਦੁਹਰਾਇਆ ਮਸ਼ੀਨ-ਚੱਕਰ/.test(question.explanation.conclusion),
        false,
        `${entry.qlId}:${language}: machine-output conclusion`,
      );

      if (entry.solveMode === "findUnknownTimeFromAlternatingCompletion") {
        assert.match(question.explanation.conclusion, language === "hi" ? /अकेले.*समय/ : /ਇਕੱਲੇ.*ਸਮਾਂ/);
        assert.ok(question.explanation.conclusion.includes(question.solution.answerText));
        assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अज्ञात दर.*उलटा समय/ : /ਅਣਜਾਣ ਦਰ.*ਉਲਟ ਸਮਾਂ/);
      }
      if (entry.solveMode === "findCompletionWhenHelperWorksEveryNthDay") {
        assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /सहायक वाले दिन/ : /ਮਦਦਗਾਰ ਵਾਲੇ ਦਿਨ/);
      }
      if (entry.solveMode === "findTimeFromArbitraryCyclePhase") {
        assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /दी गई शुरुआती बारी.*सामान्य पहली बारी/ : /ਦਿੱਤੀ ਸ਼ੁਰੂਆਤੀ ਵਾਰੀ.*ਆਮ ਪਹਿਲੀ ਵਾਰੀ/);
      }
      if (entry.solveMode === "findOutputUnderPeriodicMachineSchedule") {
        assert.match(question.stem, language === "hi" ? /मशीन A.*मशीन B/ : /ਮਸ਼ੀਨ A.*ਮਸ਼ੀਨ B/);
        assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /मशीन-चक्र.*उत्पादन/ : /ਮਸ਼ੀਨ-ਚੱਕਰ.*ਉਤਪਾਦਨ/);
        assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /मशीनों के लिए दर × समय/ : /ਮਸ਼ੀਨਾਂ ਲਈ ਦਰ × ਸਮਾਂ/);
        assert.match(question.explanation.conclusion, language === "hi" ? /दोहरावों में कुल उत्पादन/ : /ਦੁਹਰਾਵਾਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ/);
      }
      if (entry.solveMode === "findRequiredCycleRateForDeadline") {
        assert.equal(/काम [^।;]+ से|ਕੰਮ [^।;]+ ਨਾਲ/.test(question.stem), false);
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
