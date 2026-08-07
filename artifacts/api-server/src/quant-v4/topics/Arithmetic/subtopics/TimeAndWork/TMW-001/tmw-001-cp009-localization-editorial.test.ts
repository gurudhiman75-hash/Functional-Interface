import { strict as assert } from "node:assert";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const internalIdentifierPattern = /find[A-Z]|TMW_|_[A-Z_]{3,}/;
const internalEnglishPattern = /Independent signed-flow|Don't fall for|Do not choose/i;
const englishPattern = /\b(?:tank|reservoir|inlet|outlet|leak|litres|hours?|water level|flow rate|full|empty|level change needed|required level change|lost efficiency|blockage|tank fills|boundary is not reached within the window)\b/i;
let rows = 0;

for (const entry of TMW_CP009_REGISTRY) {
  const seed = `tmw-cp009-localization-review:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp009LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
    const fields: Array<[string, string]> = [
      ["stem", question.stem],
      ...question.options.map((value, index): [string, string] => [`option-${index + 1}`, value]),
      ["opening", question.explanation.opening],
      ["formula", question.explanation.formula],
      ...question.explanation.givens.map((value, index): [string, string] => [`given-${index + 1}`, value]),
      ...question.explanation.steps.map((value, index): [string, string] => [`worked-step-${index + 1}`, value]),
      ["shortcut-title", question.explanation.shortcut.title],
      ...question.explanation.shortcut.steps.map((value, index): [string, string] => [`shortcut-step-${index + 1}`, value]),
      ["trap", question.explanation.commonTrap.explanation],
      ["conclusion", question.explanation.conclusion],
    ];
    const prose = fields.map(([, value]) => value).join("\n");
    const internalField = fields.find(([, value]) => internalIdentifierPattern.test(value) || internalEnglishPattern.test(value));
    const englishField = fields.find(([, value]) => englishPattern.test(value));
    const devanagariField = language === "pa"
      ? fields.find(([, value]) => /[\u0900-\u0963\u0966-\u097F]/.test(value))
      : undefined;
    const gurmukhiField = language === "hi"
      ? fields.find(([, value]) => /[\u0A00-\u0A7F]/.test(value))
      : undefined;

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");
    assert.equal(internalField, undefined, `${entry.qlId}:${language}: internal wording in ${internalField?.[0]}: ${internalField?.[1]}`);
    assert.equal(englishField, undefined, `${entry.qlId}:${language}: English learner wording in ${englishField?.[0]}: ${englishField?.[1]}`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}: raw mixed fraction`);
    assert.equal(/\d+ घंटे में|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}: uninflected time postposition`);
    assert.equal(devanagariField, undefined, `${entry.qlId}:${language}: Devanagari leakage in ${devanagariField?.[0]}: ${devanagariField?.[1]}`);
    assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}: Gurmukhi leakage in ${gurmukhiField?.[0]}: ${gurmukhiField?.[1]}`);
    assert.equal(/भरने वाली पाइपें.*अकेले|ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ.*ਇਕੱਲੀ/.test(prose), false, `${entry.qlId}:${language}: pipe agreement`);
    assert.equal(/कितना समय लेंगी|पूरी खाली का समय|पूरी तरह खाली देती हैं|पूरी तरह खाली जाती है|पूरी तरह खाली जाएगी|पूरी तरह भर होने|टंकी पूरी भरने में|टंकी पूरी खाली होने में|पाइप अभिलेख|हस्ताक्षरित|परिमाण|पानी के स्तर के साथ क्या होगा|रिसाव [A-Z] अकेले|अज्ञात: रिसाव [A-Z] का अकेले काम/.test(prose), false, `${entry.qlId}:${language}: rejected Hindi phrasing`);
    assert.equal(/ਪੂਰੀ ਖਾਲੀ ਦਾ ਸਮਾਂ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਦਿੰਦੀਆਂ ਹਨ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਜਾਂਦੀ ਹੈ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਾਲੀ ਜਾਵੇਗੀ|ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰ ਹੋਣ|ਟੈਂਕੀ ਪੂਰੀ ਭਰਨ ਵਿੱਚ|ਟੈਂਕੀ ਪੂਰੀ ਖਾਲੀ ਹੋਣ ਵਿੱਚ|ਪਾਈਪ ਰਿਕਾਰਡ|ਚਿੰਨ੍ਹਿਤ ਪੱਧਰ ਅਪਡੇਟ|ਪਰਿਮਾਣ|ਪਾਣੀ ਦੇ ਪੱਧਰ ਨਾਲ ਕੀ ਹੋਵੇਗਾ|ਰਿਸਾਅ [A-Z] ਇਕੱਲੀ|ਅਣਜਾਣ: ਰਿਸਾਅ [A-Z] ਦਾ ਇਕੱਲੀ ਕੰਮ/.test(prose), false, `${entry.qlId}:${language}: rejected Punjabi phrasing`);
    assert.equal(/रिसाव [A-Z] भी लगातार काम करती है|रिसाव [A-Z].*कितना समय लेगी|ਰਿਸਾਅ [A-Z] ਵੀ ਲਗਾਤਾਰ ਕੰਮ ਕਰਦੀ ਹੈ|ਰਿਸਾਅ [A-Z].*ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗੀ/.test(prose), false, `${entry.qlId}:${language}: leak agreement`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.solution.answerText);
    assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
    assert.ok(question.explanation.conclusion.includes(question.solution.answerText));

    if (entry.answerType === "DIRECTION") {
      assert.match(question.solution.answerText, language === "hi" ? /टंकी|पानी का स्तर/ : /ਟੈਂਕੀ|ਪਾਣੀ ਦਾ ਪੱਧਰ/);
    }
    if (entry.answerType === "DECISION") {
      assert.match(question.solution.answerText, language === "hi" ? /^(हाँ|नहीं)/ : /^(ਹਾਂ|ਨਹੀਂ)/);
      assert.equal(question.solution.answerValues.length, 3);
    }
    if (entry.answerType === "FLOW_RATE") {
      assert.match(question.solution.answerText, language === "hi" ? /लीटर प्रति (?:घंटा|मिनट)$/ : /ਲੀਟਰ ਪ੍ਰਤੀ (?:ਘੰਟਾ|ਮਿੰਟ)$/);
    }
    if (entry.answerType === "CAPACITY") {
      assert.match(question.solution.answerText, language === "hi" ? /लीटर$/ : /ਲੀਟਰ$/);
    }

    switch (entry.solveMode) {
      case "findFillTimeFromPositiveInlets":
        assert.match(question.stem, language === "hi" ? /टंकी के पूरी तरह भरने में कितना समय लगेगा\?$/ : /ਟੈਂਕੀ ਦੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਭਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ\?$/);
        assert.match(question.explanation.opening, language === "hi" ? /समय उलटकर.*भरने की दर.*दरें जोड़ें/ : /ਸਮੇਂ ਨੂੰ ਉਲਟ.*ਭਰਨ ਦਰ.*ਦਰਾਂ ਜੋੜੋ/);
        break;
      case "findFillTimeFromMixedPipes":
        assert.match(question.explanation.opening, language === "hi" ? /भरने वाली पाइपों की दरें जोड़ें.*निकासी.*घटाएँ/ : /ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ.*ਨਿਕਾਸੀ.*ਘਟਾਓ/);
        break;
      case "findEmptyTimeFromMixedPipes":
        assert.match(question.explanation.opening, language === "hi" ? /निकासी और रिसाव की दरें जोड़ें.*भरने वाली.*घटाएँ/ : /ਨਿਕਾਸੀ ਅਤੇ ਰਿਸਾਅ ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ.*ਭਰਨ ਵਾਲੀਆਂ.*ਘਟਾਓ/);
        break;
      case "findNetFractionChangedInGivenTime":
        assert.match(question.explanation.shortcut.title, language === "hi" ? /शुद्ध दर × खुला समय/ : /ਸ਼ੁੱਧ ਦਰ × ਖੁੱਲ੍ਹਾ ਸਮਾਂ/);
        break;
      case "findMissingInletTime":
      case "findMissingOutletOrLeakTime":
        assert.match(question.explanation.givens[0], language === "hi" ? /(?:भर जाती है|खाली हो जाती है)/ : /(?:ਭਰ ਜਾਂਦੀ ਹੈ|ਖਾਲੀ ਹੋ ਜਾਂਦੀ ਹੈ)/);
        if (/रिसाव|ਰਿਸਾਅ/.test(question.stem)) {
          assert.match(question.stem, language === "hi" ? /रिसाव [A-Z] अकेला.*कितना समय लेगा\?$/ : /ਰਿਸਾਅ [A-Z] ਇਕੱਲਾ.*ਕਿੰਨਾ ਸਮਾਂ ਲਵੇਗਾ\?$/);
          assert.match(question.explanation.givens[1], language === "hi" ? /रिसाव [A-Z] द्वारा अकेले टंकी खाली/ : /ਰਿਸਾਅ [A-Z] ਨੂੰ ਇਕੱਲੇ ਟੈਂਕੀ ਖਾਲੀ/);
        }
        break;
      case "findTimeFromInitialLevelToBoundary":
        assert.match(question.stem, language === "hi" ? /पूरी तरह (?:भरने|खाली होने) में/ : /ਪੂਰੀ ਤਰ੍ਹਾਂ (?:ਭਰਨ|ਖਾਲੀ ਹੋਣ) ਵਿੱਚ/);
        assert.match(question.explanation.opening, language === "hi" ? /1 − प्रारंभिक भाग.*प्रारंभिक भरा भाग/ : /1 − ਸ਼ੁਰੂਆਤੀ ਹਿੱਸਾ.*ਸ਼ੁਰੂਆਤੀ ਭਰਿਆ ਹਿੱਸਾ/);
        break;
      case "findFinalLevelAfterGivenTime":
        assert.match(question.explanation.shortcut.title, language === "hi" ? /प्रारंभिक भाग ± शुद्ध परिवर्तन/ : /ਸ਼ੁਰੂਆਤੀ ਹਿੱਸਾ ± ਸ਼ੁੱਧ ਬਦਲਾਅ/);
        break;
      case "findNetRateDirection":
        assert.match(question.stem, language === "hi" ? /बढ़ेगा, घटेगा या स्थिर रहेगा/ : /ਵਧੇਗਾ, ਘਟੇਗਾ ਜਾਂ ਸਥਿਰ ਰਹੇਗਾ/);
        assert.match(question.explanation.shortcut.title, language === "hi" ? /दर का चिन्ह दिशा बताता है/ : /ਦਰ ਦਾ ਚਿੰਨ੍ਹ ਦਿਸ਼ਾ ਦੱਸਦਾ ਹੈ/);
        break;
      case "findBoundaryEventFeasibility":
        assert.match(question.explanation.shortcut.title, language === "hi" ? /दिशा और समय—दोनों जाँचें/ : /ਦਿਸ਼ਾ ਅਤੇ ਸਮਾਂ—ਦੋਵੇਂ ਜਾਂਚੋ/);
        break;
    }

    rows += 1;
  }
}

assert.equal(rows, 36);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-009", localizedEditorialRows: rows, status: "PASS" }, null, 2));
