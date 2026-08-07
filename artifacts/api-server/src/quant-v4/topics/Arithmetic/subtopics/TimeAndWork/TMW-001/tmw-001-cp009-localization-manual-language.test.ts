import { strict as assert } from "node:assert";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const rawMixedFractionPattern = /\b\d+\s+\d+\/\d+\b/;
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
      const mixedFractionField = fields.find(([, value]) => rawMixedFractionPattern.test(value));
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
      assert.equal(mixedFractionField, undefined, `${entry.qlId}:${language}: raw mixed fraction in ${mixedFractionField?.[0]}: ${mixedFractionField?.[1]}`);
      assert.equal(/\d+ घंटे में|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time`);
      assert.equal(devanagariField, undefined, `${entry.qlId}:${language}: Devanagari leakage in ${devanagariField?.[0]}: ${devanagariField?.[1]}`);
      assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}: Gurmukhi leakage in ${gurmukhiField?.[0]}: ${gurmukhiField?.[1]}`);
      assert.equal(/भरने वाली पाइपें.*अकेले|ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ.*ਇਕੱਲੀ/.test(prose), false, `${entry.qlId}:${language}: pipe agreement`);
      assert.equal(/कितना समय लेंगी|पूरी खाली का समय|पूरी तरह खाली देती हैं|पूरी तरह खाली जाती है|पूरी तरह खाली जाएगी|पूरी तरह भर होने|टंकी पूरी भरने में|टंकी पूरी खाली होने में|पाइप अभिलेख|हस्ताक्षरित|परिमाण|पानी के स्तर के साथ क्या होगा|रिसाव [A-Z] अकेले|अज्ञात: रिसाव [A-Z] का अकेले काम/.test(prose), false, `${entry.qlId}:${language}: rejected Hindi phrasing`);
      assert.equal(/ਪੂਰੀ ਖਾਲੀ ਦਾ ਸਮਾਂ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਦਿੰਦੀਆਂ ਹਨ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਜਾਂਦੀ ਹੈ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਜਾਵੇਗੀ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰ ਹੋਣ|ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ|ਟੈਂਕੀ ਪੂਰੀ ਖਾਲੀ ਹੋਣ ਵਿੱਚ|ਪਾਈਪ ਰਿਕਾਰਡ|ਚਿੰਨ੍ਹਿਤ ਪੱਧਰ ਅਪਡੇਟ|ਪਰਿਮਾਣ|ਪਾਣੀ ਦੇ ਪੱਧਰ ਨਾਲ ਕੀ ਹੋਵੇਗਾ|ਰਿਸਾਅ [A-Z] ਇਕੱਲੀ|ਅਣਜਾਣ: ਰਿਸਾਅ [A-Z] ਦਾ ਇਕੱਲੀ ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: rejected Punjabi phrasing`);
      assert.equal(/रिसाव [A-Z] भी लगातार काम करती है|रिसाव [A-Z].*कितना समय लेगी|ਰਿਸਾਅ [A-Z] ਵੀ ਲਗਾਤਾਰ ਕੰਮ ਕਰਦੀ ਹੈ|ਰਿਸਾਅ [A-Z].*ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗੀ/.test(prose), false, `${entry.qlId}:${language}: leak agreement`);
      assert.equal(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ/.test(prose), false, `${entry.qlId}:${language}: generic shortcut title`);
      assert.equal(/टंकी का टंकी का|ਟੈਂਕੀ ਦਾ ਟੈਂਕੀ ਦਾ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}: duplicated fraction subject`);
      assert.equal(/संख्या .*पाइपें है|ਗਿਣਤੀ .*ਪਾਈਪਾਂ ਹੈ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}: duplicated count noun`);
      assert.equal(/स्तर .*भरी होगा|ਪੱਧਰ .*ਭਰੀ ਹੋਵੇਗਾ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}: level agreement`);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText));
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.editorialStatus, "PENDING");

      if (entry.solveMode === "findFillTimeFromPositiveInlets") {
        assert.match(question.stem, language === "hi" ? /टंकी के पूरी तरह भरने में कितना समय लगेगा\?$/ : /ਟੈਂਕੀ ਦੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ\?$/);
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
        if (/रिसाव|ਰਿਸਾਅ/.test(question.stem)) {
          assert.match(question.stem, language === "hi" ? /रिसाव [A-Z] अकेला.*कितना समय लेगा\?$/ : /ਰਿਸਾਅ [A-Z] ਇਕੱਲਾ.*ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ\?$/);
          assert.match(question.explanation.givens[1], language === "hi" ? /रिसाव [A-Z] द्वारा अकेले टंकी खाली/ : /ਰਿਸਾਅ [A-Z] ਨੂੰ ਇਕੱਲੇ ਟੈਂਕੀ ਖਾਲੀ/);
        }
      }
      if (entry.solveMode === "findTimeFromInitialLevelToBoundary") {
        assert.match(
          question.stem,
          language === "hi"
            ? /पूरी तरह (?:भरने|खाली होने) में/
            : /ਪੂਰੀ ਤਰ੍ਹਾਂ (?:ਭਰਨ|ਖਾਲੀ ਹੋਣ) ਵਿੱਚ/,
        );
      }
      if (entry.solveMode === "findFinalLevelAfterGivenTime") {
        assert.match(question.explanation.shortcut.title, language === "hi" ? /प्रारंभिक भाग ± शुद्ध परिवर्तन/ : /ਸ਼ੁਰੂਆਤੀ ਹਿੱਸਾ ± ਸ਼ੁੱਧ ਬਦਲਾਅ/);
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
