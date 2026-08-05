import { strict as assert } from "node:assert";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP006_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp006-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const question = runTmwCp006Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const fields = [
        question.stem,
        ...question.options,
        question.explanation.opening,
        ...(question.explanation.givens ?? []),
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ];
      const prose = fields.join("\n");

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
      assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent invariant|Do not|Don't/i.test(prose), false, `${entry.qlId}:${language}: internal wording`);
      assert.equal(/\b(?:workers?|clerks?|packers?|painters?|inspectors?|machines?|printers?|bottling lines?|assembly units?|worker-days?|machine-hours?|person-days?|resource-hours?|overtime|deadline|shift count)\b/i.test(prose), false, `${entry.qlId}:${language}: English leakage`);
      assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
      assert.equal(/ठेका को|निर्माण को|कार्य को|ऑर्डर का का|ਠੇਕਾ ਨੂੰ|ਨਿਰਮਾਣ ਨੂੰ|ਕੰਮ ਨੂੰ/.test(question.stem), false, `${entry.qlId}:${language}: task case duplication`);
      assert.equal(/\d+ (?:श्रमिक|क्लर्क|पैकिंग कर्मी|पेंटर|निरीक्षक) (?:को|ने)|\d+ (?:ਮਜ਼ਦੂਰ|ਕਲਰਕ|ਪੈਕਿੰਗ ਕਰਮਚਾਰੀ|ਪੇਂਟਰ|ਜਾਂਚ ਕਰਮਚਾਰੀ) (?:ਨੂੰ|ਨੇ)/.test(question.stem), false, `${entry.qlId}:${language}: plural resource inflection`);
      assert.equal(/मीटर/.test(language === "pa" ? prose : ""), false, `${entry.qlId}:${language}: Hindi metre leakage`);
      assert.equal(/कितने (?:बोतलें|प्रतियाँ|इकाइयाँ)|ਕਿੰਨੇ (?:ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ|ਅਰਜ਼ੀਆਂ)/.test(question.stem), false, `${entry.qlId}:${language}: feminine interrogative agreement`);
      assert.equal(/ਉਤਨਾ ਹੀ ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: unnatural Punjabi same-work phrase`);
      assert.equal(/आयाम वाले (?:ईंटों की दीवार|सड़क की सतह)|ਮਾਪ ਵਾਲੇ (?:ਇੱਟਾਂ ਦੀ ਕੰਧ|ਸੜਕ ਦੀ ਸਤਹ)/.test(question.stem), false, `${entry.qlId}:${language}: dimensional context agreement`);
      assert.equal(/(?:लाइनें|मशीनें|इकाइयाँ)[^।?\n]*(?:बनाते हैं|बनाएँगे)|(?:लाइन|मशीन|इकाई)[^।?\n]*बनाता है/.test(question.stem), false, `${entry.qlId}:${language}: Hindi machine gender`);
      assert.equal(/(?:ਲਾਈਨਾਂ|ਮਸ਼ੀਨਾਂ|ਇਕਾਈਆਂ)[^।?\n]*(?:ਬਣਾਉਂਦੇ ਹਨ|ਬਣਾਉਣਗੇ)|(?:ਲਾਈਨ|ਮਸ਼ੀਨ|ਇਕਾਈ)[^।?\n]*ਬਣਾਉਂਦਾ ਹੈ/.test(question.stem), false, `${entry.qlId}:${language}: Punjabi machine gender`);
      assert.equal(/(?:पालियाँ|बोतलें|प्रतियाँ|इकाइयाँ) है(?!ं)|(?:ਸ਼ਿਫ਼ਟਾਂ|ਬੋਤਲਾਂ|ਕਾਪੀਆਂ|ਇਕਾਈਆਂ) ਹੈ/.test(prose), false, `${entry.qlId}:${language}: plural copula agreement`);
      assert.equal(/\d+ (?:ਮਜ਼ਦੂਰਾਂ|ਕਲਰਕਾਂ|ਪੈਕਿੰਗ ਕਰਮਚਾਰੀਆਂ|ਪੇਂਟਰਾਂ|ਜਾਂਚ ਕਰਮਚਾਰੀਆਂ) ਨੇ [^।]+ ਪੂਰਾ ਕਰਨਾ (?:ਸੀ|ਹੈ)/.test(question.stem), false, `${entry.qlId}:${language}: Punjabi planned-work case`);

      if (entry.answerType === "COUNT" && question.solution.answer.denominator === 1 && question.solution.answer.numerator !== 1) {
        assert.equal(
          new RegExp(`${question.solution.answerText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} (?:है(?!ं)|ਹੈ)`).test(prose),
          false,
          `${entry.qlId}:${language}: plural count answer agreement`,
        );
      }
      if (entry.solveMode === "findRemainingDaysFromActualProgress") {
        const givens = (question.explanation.givens ?? []).join(" ");
        assert.equal(/मूल व्यवस्था|बदली व्यवस्था|ਮੂਲ ਵਿਵਸਥਾ|ਬਦਲੀ ਵਿਵਸਥਾ/.test(givens), false);
        assert.match(givens, language === "hi" ? /बीता समय.*पूरा काम.*शेष काम/ : /ਬੀਤਿਆ ਸਮਾਂ.*ਪੂਰਾ ਕੰਮ.*ਬਾਕੀ ਕੰਮ/);
      }
      if (entry.solveMode === "findExtraWorkersFromPlannedVsActualProgress") {
        const givens = (question.explanation.givens ?? []).join(" ");
        assert.match(givens, language === "hi" ? /मूल योजना.*वास्तविक प्रगति.*शेष समय/ : /ਮੂਲ ਯੋਜਨਾ.*ਅਸਲ ਤਰੱਕੀ.*ਬਾਕੀ ਸਮਾਂ/);
      }
      if (
        entry.solveMode === "findOvertimeHoursForDeadline" &&
        question.explanation.commonTrap.misconceptionId === "TOTAL_REPORTED_AS_CHANGE"
      ) {
        assert.match(
          question.explanation.commonTrap.explanation,
          language === "hi"
            ? /अतिरिक्त घंटों.*प्रतिदिन आवश्यक कुल घंटे/
            : /ਵਾਧੂ ਘੰਟਿਆਂ.*ਹਰ ਦਿਨ ਦੇ ਕੁੱਲ ਲੋੜੀਂਦੇ ਘੰਟੇ/,
        );
      }
      if (entry.solveMode === "findEquivalentResourceTime") {
        assert.equal(/कितना है\?|ਕਿੰਨਾ ਹੈ\?/.test(question.stem), false);
        assert.equal(/N_2=1|D_2=1|H_2=1|E_2=1/.test((question.explanation.givens ?? []).join(" ")), false);
        switch (question.explanation.commonTrap.misconceptionId) {
          case "WORK_RATIO_OMITTED":
            assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /काम का अनुपात.*नहीं/ : /ਕੰਮ ਦਾ ਅਨੁਪਾਤ.*ਨਹੀਂ/);
            break;
          case "HOURS_FACTOR_OMITTED":
            assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /घंटों का बदलाव/ : /ਘੰਟਿਆਂ ਦਾ ਬਦਲਾਅ/);
            break;
          case "EFFICIENCY_FACTOR_OMITTED":
            assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /दक्षता का बदलाव/ : /ਦੱਖਤਾ ਦਾ ਬਦਲਾਅ/);
            break;
          case "DIRECT_INVERSE_PROPORTION_CONFUSED":
            assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /सीधे और उलटे संबंध/ : /ਸਿੱਧੇ ਅਤੇ ਉਲਟੇ ਸੰਬੰਧ/);
            break;
          default:
            assert.ok(question.explanation.commonTrap.explanation.length > 20);
        }
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 880);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-006",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
