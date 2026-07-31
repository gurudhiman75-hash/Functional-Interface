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
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(/\b\d+ दिन में\b|\b\d+ ਦਿਨ ਵਿੱਚ\b/.test(prose), false, `${entry.qlId}:${language}: uninflected day before postposition`);
      assert.equal(/\b\d+ दिन के भीतर\b|\b\d+ ਦਿਨ ਦੇ ਅੰਦਰ\b/.test(prose), false, `${entry.qlId}:${language}: uninflected deadline phrase`);
      assert.equal(/का काम में|ਦਾ ਕੰਮ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: task phrase not inflected`);
      assert.equal(/शेष काम का \\|ਬਾਕੀ ਕੰਮ ਦਾ \\/.test(question.explanation.shortcut.steps.join(" ")), false, `${entry.qlId}:${language}: malformed remaining-work shortcut`);

      if (entry.solveMode === "findJoinTimeFromFinalCompletion") {
        assert.match(question.stem, language === "hi" ? /भागीदारी कितने समय बाद शुरू हुई/ : /ਭਾਗੀਦਾਰੀ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਈ/);
        assert.equal(/कितने समय बाद जुड़ा|ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਜੁੜਿਆ/.test(question.stem), false);
      }
      if (entry.solveMode === "findLeaveTimeFromFinalCompletion") {
        assert.match(question.stem, language === "hi" ? /भागीदारी कितने समय बाद समाप्त हुई/ : /ਭਾਗੀਦਾਰੀ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਖਤਮ ਹੋਈ/);
        assert.equal(/कितने समय बाद गया|ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਗਿਆ/.test(question.stem), false);
      }
      if (entry.solveMode === "findUnknownInitialPhaseDuration") {
        assert.match(question.stem, language === "hi" ? /में पहले पूरे काम का/ : /ਵਿੱਚ ਪਹਿਲਾਂ ਪੂਰੇ ਕੰਮ ਦਾ/);
        assert.equal(/का (?:एक )?(?:बैच|सेट|ऑर्डर|काम) में|ਦਾ (?:ਇੱਕ )?(?:ਬੈਚ|ਸੈੱਟ|ਆਰਡਰ|ਕੰਮ) ਵਿੱਚ/.test(question.stem), false);
      }
      if (entry.solveMode === "findRequiredRemainingRateForDeadline") {
        assert.equal(/की (?:मशीन|टीम|दल) [ABC] की अवधि/.test(question.stem), false);
        assert.match(question.stem, language === "hi" ? /अकेले पूरा करने में .* को .* लगते हैं/ : /ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ .* ਨੂੰ .* ਲੱਗਦੇ ਹਨ/);
      }
      if (entry.solveMode === "findEarlyCompletionAfterWorkerJoins") {
        assert.match(question.stem, language === "hi" ? /यदि अंत तक काम केवल .* से होता/ : /ਜੇ ਅੰਤ ਤੱਕ ਕੰਮ ਸਿਰਫ਼ .* ਨਾਲ ਹੁੰਦਾ/);
      }
      if (entry.solveMode === "findCompletionWithChangedDailyHours") {
        assert.match(question.stem, language === "hi" ? /\d+ दिनों में पूरा होता है/ : /\d+ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ/);
      }
      if (entry.solveMode === "findCompletionWithNegativeWorkerActivatedLater") {
        assert.match(question.stem, language === "hi" ? /काम को बिगाड़ने में .* लगते|काम को बिगाड़ने में .* लेती/ : /ਕੰਮ ਨੂੰ ਖਰਾਬ ਕਰਨ ਵਿੱਚ .* ਲੈਂਦੀ/);
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
