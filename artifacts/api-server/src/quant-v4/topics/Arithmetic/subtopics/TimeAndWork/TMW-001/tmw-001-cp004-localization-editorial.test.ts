import { strict as assert } from "node:assert";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP004_REGISTRY) {
  const seed = `tmw-cp004-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed, language });
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
    assert.equal(/\b(?:operator|technician|clerk|machine|crew|team|inspector|typist|painter|recorder|surveyor|assembler)\b/i.test(prose), false, `${entry.qlId}:${language}: English actor leakage`);
    assert.equal(/\b(?:work|rate|remaining|completed|event|phase|deadline|worker|replacement|idle|rework)\b/i.test(prose), false, `${entry.qlId}:${language}: English prose leakage`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal or command language`);
    assert.equal(/इवेंट|फेज|रिवर्क|डेडलाइन|आइडल|ਈਵੈਂਟ|ਫੇਜ਼|ਰੀਵਰਕ|ਡੈੱਡਲਾਈਨ|ਆਇਡਲ/.test(prose), false, `${entry.qlId}:${language}: avoidable transliteration`);
    assert.equal(/द्वारा .* किया जाता है|ਵੱਲੋਂ .* ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(prose), false, `${entry.qlId}:${language}: translated passive phrasing`);
    assert.equal(/भागीदारी (?:शुरू|समाप्त)|ਭਾਗੀਦਾਰੀ (?:ਸ਼ੁਰੂ|ਖਤਮ)/.test(prose), false, `${entry.qlId}:${language}: bureaucratic participation wording`);
    assert.equal(/सक्रिय सदस्य|ठीक शेष काम|ਸਰਗਰਮ ਮੈਂਬਰ|ਸਹੀ ਬਾਕੀ ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: technical stage wording`);
    assert.equal(/बदली हुई चरणबद्ध स्थिति|संदर्भ स्थिति|ਬਦਲੀ ਹੋਈ ਪੜਾਅਵਾਰ ਸਥਿਤੀ|ਹਵਾਲਾ ਸਥਿਤੀ/.test(prose), false, `${entry.qlId}:${language}: technical comparison wording`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    if (question.solution.answerType === "FRACTION") {
      assert.equal(question.options.every((option) => option.includes(language === "hi" ? "काम का" : "ਕੰਮ ਦਾ")), true);
    }
    if (question.solution.answerType === "RATE") {
      assert.equal(question.options.every((option) => option.includes(language === "hi" ? "प्रति" : "ਪ੍ਰਤੀ")), true);
    }
    if (question.solution.answerType === "COUNT") {
      assert.equal(question.options.every((option) => option.endsWith(language === "hi" ? "कर्मचारी" : "ਕਰਮਚਾਰੀ")), true);
    }

    switch (entry.ruleId) {
      case "TMW_STAGE_LEDGER":
        assert.match(question.explanation.opening, language === "hi" ? /हर चरण|बचा हुआ काम|दिए समय/ : /ਹਰ ਪੜਾਅ|ਬਚਿਆ ਹੋਇਆ ਕੰਮ|ਦਿੱਤੇ ਸਮੇਂ/);
        break;
      case "TMW_STAGE_HANDOFF":
        assert.match(question.explanation.opening, language === "hi" ? /पहले किया गया काम नहीं मिटता|बचे हुए काम/ : /ਪਹਿਲਾਂ ਕੀਤਾ ਕੰਮ ਮਿਟਦਾ ਨਹੀਂ|ਬਚੇ ਕੰਮ/);
        break;
      case "TMW_STAGE_INVERSE_EVENT":
        assert.match(question.explanation.opening, language === "hi" ? /समय x|पहले चरण|लक्षित काम|बचे हुए काम/ : /ਸਮਾਂ x|ਪਹਿਲੇ ਪੜਾਅ|ਟੀਚੇ ਵਾਲੇ ਕੰਮ|ਬਚੇ ਕੰਮ/);
        break;
      case "TMW_STAGE_RATE_CHANGE":
        assert.match(question.explanation.opening, language === "hi" ? /पहले चरण में हुआ काम|बाद के चरण/ : /ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਹੋਇਆ ਕੰਮ|ਬਾਅਦਲੇ ਪੜਾਅ/);
        break;
      case "TMW_STAGE_SIGNED_RATE":
        assert.match(question.explanation.opening, language === "hi" ? /बिगाड़.*दर|शुद्ध दर/ : /ਖਰਾਬ.*ਦਰ|ਸ਼ੁੱਧ ਦਰ/);
        break;
      case "TMW_STAGE_WORKFORCE_EVENT":
        assert.match(question.explanation.opening, language === "hi" ? /पहले चरण में कर्मचारियों|आवश्यक कुल कर्मचारी/ : /ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ|ਲੋੜੀਂਦੇ ਕੁੱਲ ਕਰਮਚਾਰੀ/);
        break;
      case "TMW_STAGE_COMPARISON":
        assert.match(question.explanation.opening, language === "hi" ? /वास्तविक स्थिति|अंतर/ : /ਅਸਲ ਸਥਿਤੀ|ਅੰਤਰ/);
        break;
    }

    if (entry.solveMode === "findCompletionWithIdleInterval") {
      assert.match(question.stem, language === "hi" ? /पूरी तरह रुका/ : /ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੁਕਿਆ/);
      assert.match(question.explanation.shortcut.title, language === "hi" ? /रुका समय/ : /ਰੁਕਿਆ ਸਮਾਂ/);
    }
    if (entry.solveMode === "findCompletionWithNegativeWorkerActivatedLater") {
      assert.match(question.stem, language === "hi" ? /काम को.*बिगाड़/ : /ਕੰਮ ਨੂੰ.*ਖਰਾਬ/);
      assert.match(question.explanation.opening, language === "hi" ? /बिगाड़ की दर.*शुद्ध दर/ : /ਖਰਾਬੀ ਦੀ ਦਰ.*ਸ਼ੁੱਧ ਦਰ/);
    }
    if (entry.solveMode === "findRequiredRemainingRateForDeadline") {
      assert.match(question.explanation.opening, language === "hi" ? /बचे हुए काम.*बाकी समय/ : /ਬਚੇ ਕੰਮ.*ਬਾਕੀ ਸਮੇਂ/);
      assert.match(question.explanation.shortcut.title, language === "hi" ? /शेष काम ÷ शेष समय/ : /ਬਾਕੀ ਕੰਮ ÷ ਬਾਕੀ ਸਮਾਂ/);
    }
    if (entry.solveMode === "findDelayAfterWorkerLeaves" || entry.solveMode === "findEarlyCompletionAfterWorkerJoins") {
      assert.match(question.explanation.opening, language === "hi" ? /वास्तविक स्थिति|अंतर/ : /ਅਸਲ ਸਥਿਤੀ|ਅੰਤਰ/);
    }

    checked += 1;
  }
}

assert.equal(checked, 48);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-004",
  localizedEditorialRows: checked,
  status: "PASS",
}, null, 2));
