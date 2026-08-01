import { strict as assert } from "node:assert";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP009_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp009-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const question = runTmwCp009LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const fields: Array<[string, string]> = [
        ["stem", question.stem],
        ...question.options.map((value, optionIndex): [string, string] => [`option-${optionIndex + 1}`, value]),
        ["opening", question.explanation.opening],
        ["formula", question.explanation.formula],
        ...question.explanation.givens.map((value, givenIndex): [string, string] => [`given-${givenIndex + 1}`, value]),
        ...question.explanation.steps.map((value, stepIndex): [string, string] => [`worked-step-${stepIndex + 1}`, value]),
        ["shortcut-title", question.explanation.shortcut.title],
        ...question.explanation.shortcut.steps.map((value, stepIndex): [string, string] => [`shortcut-step-${stepIndex + 1}`, value]),
        ["trap", question.explanation.commonTrap.explanation],
        ["conclusion", question.explanation.conclusion],
      ];
      const prose = fields.map(([, value]) => value).join("\n");
      const devanagariField = language === "pa"
        ? fields.find(([, value]) => /[\u0900-\u0963\u0966-\u097F]/.test(value))
        : undefined;
      const gurmukhiField = language === "hi"
        ? fields.find(([, value]) => /[\u0A00-\u0A7F]/.test(value))
        : undefined;

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
      assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}/.test(prose), false, `${entry.qlId}:${language}: internal identifier`);
      assert.equal(/Independent signed-flow|Don't fall for|Do not choose/i.test(prose), false, `${entry.qlId}:${language}: internal English wording`);
      assert.equal(/\b(?:tank|reservoir|inlet|outlet|leak|litres|hours?|water level|flow rate|full|empty|level change needed|required level change|lost efficiency|blockage|tank fills|boundary is not reached within the window)\b/i.test(prose), false, `${entry.qlId}:${language}: English learner wording`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
      assert.equal(/\d+ घंटे में|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time`);
      assert.equal(devanagariField, undefined, `${entry.qlId}:${language}: Devanagari leakage in ${devanagariField?.[0]}: ${devanagariField?.[1]}`);
      assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}: Gurmukhi leakage in ${gurmukhiField?.[0]}: ${gurmukhiField?.[1]}`);
      assert.equal(/भरने वाली पाइपें.*अकेले|ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ.*ਇਕੱਲੀ/.test(prose), false, `${entry.qlId}:${language}: pipe agreement`);
      assert.equal(/कितना समय लेंगी|पूरी खाली का समय|पूरी तरह खाली देती हैं|पूरी तरह खाली जाती है|पूरी तरह भर होने|पाइप अभिलेख|हस्ताक्षरित|परिमाण|पानी के स्तर के साथ क्या होगा/.test(prose), false, `${entry.qlId}:${language}: rejected Hindi phrasing`);
      assert.equal(/ਪੂਰੀ ਖਾਲੀ ਦਾ ਸਮਾਂ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਦਿੰਦੀਆਂ ਹਨ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਜਾਂਦੀ ਹੈ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰ ਹੋਣ|ਪਾਈਪ ਰਿਕਾਰਡ|ਚਿੰਨ੍ਹਿਤ ਪੱਧਰ ਅਪਡੇਟ|ਪਰਿਮਾਣ|ਪਾਣੀ ਦੇ ਪੱਧਰ ਨਾਲ ਕੀ ਹੋਵੇਗਾ/.test(prose), false, `${entry.qlId}:${language}: rejected Punjabi phrasing`);
      assert.equal(/रिसाव [A-Z] भी लगातार काम करती है|ਰਿਸਾਅ [A-Z] ਵੀ ਲਗਾਤਾਰ ਕੰਮ ਕਰਦੀ ਹੈ/.test(prose), false, `${entry.qlId}:${language}: leak agreement`);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.editorialStatus, "PENDING");

      if (entry.solveMode === "findFillTimeFromPositiveInlets") {
        assert.match(question.stem, language === "hi" ? /कितना समय लगेगा\?$/ : /ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ\?$/);
      }
      if (entry.solveMode === "findEmptyTimeFromMixedPipes") {
        assert.match(question.explanation.givens[1], language === "hi" ? /पूरी तरह खाली होने/ : /ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਹੋਣ/);
      }
      if (entry.solveMode === "findMissingInletTime" || entry.solveMode === "findMissingOutletOrLeakTime") {
        assert.match(
          question.explanation.givens[0],
          language === "hi"
            ? /पूरी तरह (?:भर जाती है|खाली हो जाती है)/
            : /ਪੂਰੀ ਤਰ੍ਹਾਂ (?:ਭਰ ਜਾਂਦੀ ਹੈ|ਖਾਲੀ ਹੋ ਜਾਂਦੀ ਹੈ)/,
        );
      }
      if (entry.solveMode === "findTimeFromInitialLevelToBoundary") {
        assert.match(question.stem, language === "hi" ? /पूरी तरह भरने में/ : /ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨ ਵਿੱਚ/);
      }
      if (entry.solveMode === "findFinalLevelAfterGivenTime") {
        assert.match(question.explanation.shortcut.title, language === "hi" ? /चिह्न सहित स्तर परिवर्तन/ : /ਚਿੰਨ੍ਹ ਸਮੇਤ ਪੱਧਰ ਬਦਲਾਅ/);
      }
      if (entry.solveMode === "findNetRateDirection") {
        assert.match(question.stem, language === "hi" ? /बढ़ेगा, घटेगा या स्थिर रहेगा/ : /ਵਧੇਗਾ, ਘਟੇਗਾ ਜਾਂ ਸਥਿਰ ਰਹੇਗਾ/);
      }

      checked += 1;
    }
  }
}

assert.equal(checked, 720);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-009",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
