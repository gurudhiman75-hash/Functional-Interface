import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP005_REGISTRY) {
  const seed = `tmw-cp005-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp005Pipeline({ questionLanguageId: entry.qlId, seed, language });
    const prose = [
      question.stem,
      question.explanation.opening,
      question.explanation.shortcut.title,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.optionLabel,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(/\b(?:work|cycle|turn|worker|rate|deadline|output|rest|weekend|shift|helper|machine schedule)\b/i.test(prose), false, `${entry.qlId}:${language}: English prose leakage`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal or command language`);
    assert.equal(/साइकिल|टर्न|रेस्ट डे|वीकेंड|शिफ्ट ड्यूरेशन|हेल्पर|डेडलाइन|ਸਾਈਕਲ|ਟਰਨ|ਰੈਸਟ ਡੇ|ਵੀਕਐਂਡ|ਸ਼ਿਫ਼ਟ ਡਿਊਰੇਸ਼ਨ|ਹੈਲਪਰ|ਡੈੱਡਲਾਈਨ/.test(prose), false, `${entry.qlId}:${language}: avoidable transliteration`);
    assert.equal(/द्वारा .* किया जाता है|ਵੱਲੋਂ .* ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(prose), false, `${entry.qlId}:${language}: translated passive phrasing`);
    assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: time inflection`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    switch (entry.ruleId) {
      case "TMW_CYCLE_COMPLETION":
        assert.match(question.explanation.opening, language === "hi" ? /पूरे दोहराए जाने वाले चक्र|अंतिम अधूरी बारी/ : /ਪੂਰੇ ਦੁਹਰਾਏ ਜਾਣ ਵਾਲੇ ਚੱਕਰ|ਆਖ਼ਰੀ ਅਧੂਰੀ ਵਾਰੀ/);
        break;
      case "TMW_CYCLE_STATE":
        assert.match(question.explanation.opening, language === "hi" ? /एक पूरे चक्र की अवस्था|अगली बारी/ : /ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦੀ ਸਥਿਤੀ|ਅਗਲੀ ਵਾਰੀ/);
        break;
      case "TMW_CYCLE_INVERSE":
        assert.match(question.explanation.opening, language === "hi" ? /अज्ञात बारी की कुल सक्रिय अवधि|शेष काम/ : /ਅਣਜਾਣ ਵਾਰੀ ਦੀ ਕੁੱਲ ਸਰਗਰਮ ਮਿਆਦ|ਬਾਕੀ ਕੰਮ/);
        break;
      case "TMW_CYCLE_SIGNED_RATE":
        assert.match(question.explanation.opening, language === "hi" ? /बिगड़े हुए काम को घटाएँ|शुद्ध चक्र-काम/ : /ਖਰਾਬ ਹੋਇਆ ਕੰਮ ਘਟਾਓ|ਸ਼ੁੱਧ ਚੱਕਰ-ਕੰਮ/);
        break;
      case "TMW_CYCLE_OUTPUT":
        assert.match(question.explanation.opening, language === "hi" ? /हर मशीन|दर × चलने का समय/ : /ਹਰ ਮਸ਼ੀਨ|ਦਰ × ਚੱਲਣ ਦਾ ਸਮਾਂ/);
        break;
    }

    if (entry.solveMode === "findTerminalAgent" || entry.solveMode === "findStartingAgentFromCompletionCondition") {
      assert.equal(question.options.some((option) => /Operator|Technician|Clerk|Machine|Crew|Team|Inspector|Typist|Painter|Recorder|Surveyor|Assembler|Cannot/.test(option)), false);
      assert.match(question.stem, language === "hi" ? /बारी/ : /ਵਾਰੀ/);
    }
    if (entry.solveMode === "findCompletionWithWeekendOrHolidayPattern") {
      assert.match(question.stem, language === "hi" ? /शनिवार-रविवार.*कोई काम नहीं/ : /ਸ਼ਨੀਵਾਰ-ਐਤਵਾਰ.*ਕੋਈ ਕੰਮ ਨਹੀਂ/);
    }
    if (entry.solveMode === "findCompletionWithUnequalShiftDurations") {
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /अपनी पाली की अवधि/ : /ਆਪਣੀ ਸ਼ਿਫ਼ਟ ਦੀ ਮਿਆਦ/);
      assert.equal(/पाली-अवधि|ਸ਼ਿਫ਼ਟ ਮਿਆਦ/.test(question.explanation.shortcut.steps.join(" ")), false);
    }
    if (entry.solveMode === "findOutputUnderPeriodicMachineSchedule") {
      assert.match(question.stem, language === "hi" ? /मशीन A.*मशीन B/ : /ਮਸ਼ੀਨ A.*ਮਸ਼ੀਨ B/);
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /दोनों मशीनों.*दोहराव/ : /ਦੋਵਾਂ ਮਸ਼ੀਨਾਂ.*ਦੁਹਰਾਵ/);
    }
    if (entry.solveMode === "findUnknownTimeFromAlternatingCompletion") {
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /उलटा/ : /ਉਲਟ/);
    }
    if (entry.solveMode === "findRequiredCycleRateForDeadline") {
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /अज्ञात बारी की कुल अवधि/ : /ਅਣਜਾਣ ਵਾਰੀ ਦੀ ਕੁੱਲ ਮਿਆਦ/);
    }

    checked += 1;
  }
}

assert.equal(checked, 48);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-005",
  localizedEditorialRows: checked,
  status: "PASS",
}, null, 2));
