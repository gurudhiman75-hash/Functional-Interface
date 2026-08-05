import { strict as assert } from "node:assert";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP004_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp004-manual-guard:${entry.qlId}:${index}`;
    for (const language of languages) {
      const question = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const prose = [
        question.stem,
        question.explanation.opening,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected day before postposition`);
      assert.equal(/\d+ दिन के भीतर|\d+ ਦਿਨ ਦੇ ਅੰਦਰ/.test(prose), false, `${entry.qlId}:${language}: uninflected deadline phrase`);
      assert.equal(/का काम में|ਦਾ ਕੰਮ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: task phrase not inflected`);
      assert.equal(/शेष काम का \\|ਬਾਕੀ ਕੰਮ ਦਾ \\/.test(question.explanation.shortcut.steps.join(" ")), false, `${entry.qlId}:${language}: malformed remaining-work shortcut`);
      assert.equal(/काम का \\[^।\n]+ काम पूरा|ਕੰਮ ਦਾ \\[^।\n]+ ਕੰਮ ਪੂਰਾ/.test(prose), false, `${entry.qlId}:${language}: duplicated work noun`);
      assert.equal(/भागीदारी (?:शुरू|समाप्त)|ਭਾਗੀਦਾਰੀ (?:ਸ਼ੁਰੂ|ਖਤਮ)/.test(prose), false, `${entry.qlId}:${language}: reviewed participation wording regressed`);
      assert.equal(/सक्रिय सदस्य|ठीक शेष काम|ਸਰਗਰਮ ਮੈਂਬਰ|ਸਹੀ ਬਾਕੀ ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: reviewed stage wording regressed`);

      if (entry.solveMode === "findRemainingWorkAfterInitialPhase") {
        assert.match(question.explanation.conclusion, language === "hi" ? /भाग बाकी है/ : /ਹਿੱਸਾ ਬਾਕੀ ਹੈ/);
      }
      if (entry.solveMode === "findWorkCompletedBeforeEvent") {
        assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /भाग पूरा हुआ/ : /ਹਿੱਸਾ ਪੂਰਾ ਹੋਇਆ/);
        assert.match(question.explanation.conclusion, language === "hi" ? /भाग पूरा हो चुका है/ : /ਹਿੱਸਾ ਪੂਰਾ ਹੋ ਚੁੱਕਾ ਹੈ/);
        assert.equal(/कार्य-दल बदल|ਟੀਮ ਬਦਲ/.test(question.stem), false);
      }
      if (entry.solveMode === "findTotalTimeWhenFirstAgentStartsThenSecondFinishes") {
        assert.match(question.stem, language === "hi" ? /शेष काम .* को सौंप दिया जाता है/ : /ਬਾਕੀ ਕੰਮ .* ਨੂੰ ਸੌਂਪ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ/);
        assert.equal(/सौंप देता है|ਸੌਂਪ ਦਿੰਦਾ ਹੈ/.test(question.stem), false);
      }
      if (entry.solveMode === "findJoinTimeFromFinalCompletion") {
        assert.match(question.stem, language === "hi" ? /कितने समय बाद काम में लगाया गया/ : /ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਗਿਆ/);
        assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /काम में लगाने का समय/ : /ਕੰਮ ਵਿੱਚ ਲਾਉਣ ਦਾ ਸਮਾਂ/);
        assert.match(question.explanation.conclusion, language === "hi" ? /काम में लगाया गया/ : /ਕੰਮ ਵਿੱਚ ਲਾਇਆ ਗਿਆ/);
      }
      if (entry.solveMode === "findLeaveTimeFromFinalCompletion") {
        assert.match(question.stem, language === "hi" ? /कितने समय बाद काम से हटाया गया/ : /ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਕੰਮ ਤੋਂ ਹਟਾਇਆ ਗਿਆ/);
        assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /काम से हटाने का समय/ : /ਕੰਮ ਤੋਂ ਹਟਾਉਣ ਦਾ ਸਮਾਂ/);
        assert.match(question.explanation.conclusion, language === "hi" ? /काम से हटाया गया/ : /ਕੰਮ ਤੋਂ ਹਟਾਇਆ ਗਿਆ/);
      }
      if (entry.solveMode === "findUnknownInitialPhaseDuration") {
        assert.match(question.stem, language === "hi" ? /में पहले पूरे काम का/ : /ਵਿੱਚ ਪਹਿਲਾਂ ਪੂਰੇ ਕੰਮ ਦਾ/);
        assert.equal(/का (?:एक )?(?:बैच|सेट|ऑर्डर|काम) में|ਦਾ (?:ਇੱਕ )?(?:ਬੈਚ|ਸੈੱਟ|ਆਰਡਰ|ਕੰਮ) ਵਿੱਚ/.test(question.stem), false);
        assert.match(question.explanation.opening, language === "hi" ? /पहले चरण की अवधि x/ : /ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਮਿਆਦ x/);
      }
      if (entry.solveMode === "findRequiredRemainingRateForDeadline") {
        assert.equal(/की (?:मशीन|टीम|दल) [ABC] की अवधि/.test(question.stem), false);
        assert.match(question.stem, language === "hi" ? /अकेले पूरा करने में .* को .* लगते हैं/ : /ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ .* ਨੂੰ .* ਲੱਗਦੇ ਹਨ/);
        assert.match(question.explanation.opening, language === "hi" ? /बचे हुए काम.*बाकी समय/ : /ਬਚੇ ਕੰਮ.*ਬਾਕੀ ਸਮੇਂ/);
      }
      if (entry.solveMode === "findEarlyCompletionAfterWorkerJoins") {
        assert.match(question.stem, language === "hi" ? /यदि अंत तक काम केवल .* से होता/ : /ਜੇ ਅੰਤ ਤੱਕ ਕੰਮ ਸਿਰਫ਼ .* ਨਾਲ ਹੁੰਦਾ/);
        assert.equal(/संदर्भ स्थिति|ਹਵਾਲਾ ਸਥਿਤੀ/.test(prose), false);
      }
      if (entry.solveMode === "findCompletionWithChangedDailyHours") {
        assert.match(question.stem, language === "hi" ? /\d+ दिनों में पूरा होता है/ : /\d+ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ/);
        assert.match(question.explanation.opening, language === "hi" ? /नए और पुराने घंटों के अनुपात/ : /ਨਵੇਂ ਅਤੇ ਪੁਰਾਣੇ ਘੰਟਿਆਂ ਦੇ ਅਨੁਪਾਤ/);
      }
      if (entry.solveMode === "findCompletionWithNegativeWorkerActivatedLater") {
        assert.match(question.stem, language === "hi" ? /काम को बिगाड़ने में .* लगते|काम को बिगाड़ने में .* लेती/ : /ਕੰਮ ਨੂੰ ਖਰਾਬ ਕਰਨ ਵਿੱਚ .* ਲੈਂਦੀ/);
        assert.match(question.explanation.shortcut.title, language === "hi" ? /काम की दर − बिगाड़ की दर/ : /ਕੰਮ ਦੀ ਦਰ − ਖਰਾਬੀ ਦੀ ਦਰ/);
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 960);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-004",
  manualLanguageCandidates: checked,
  status: "PASS",
}, null, 2));
