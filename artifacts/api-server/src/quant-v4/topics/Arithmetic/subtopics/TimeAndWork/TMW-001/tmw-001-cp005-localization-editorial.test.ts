import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let checked = 0;

for (const entry of TMW_CP005_REGISTRY) {
  const seed = `tmw-cp005-localization-editorial:${entry.qlId}`;
  for (const language of languages) {
    const row = `${entry.qlId}:${language}`;
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

    assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
    assert.equal(/\b(?:work|cycle|turn|worker|rate|deadline|output|rest|weekend|shift|helper|machine schedule)\b/i.test(prose), false, `${row}: English prose leakage`);
    assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Do not|Don't/i.test(prose), false, `${row}: internal or command language`);
    assert.equal(/साइकिल|टर्न|रेस्ट डे|वीकेंड|शिफ्ट ड्यूरेशन|हेल्पर|डेडलाइन|ਸਾਈਕਲ|ਟਰਨ|ਰੈਸਟ ਡੇ|ਵੀਕਐਂਡ|ਸ਼ਿਫ਼ਟ ਡਿਊਰੇਸ਼ਨ|ਹੈਲਪਰ|ਡੈੱਡਲਾਈਨ/.test(prose), false, `${row}: avoidable transliteration`);
    assert.equal(/द्वारा .* किया जाता है|ਵੱਲੋਂ .* ਕੀਤਾ ਜਾਂਦਾ ਹੈ/.test(prose), false, `${row}: translated passive phrasing`);
    assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${row}: time inflection`);
    assert.equal(/दिया गया कार्य:|दिया गया काम:|ਦਿੱਤਾ ਗਿਆ ਕੰਮ:/.test(question.stem), false, `${row}: mechanical task header`);
    assert.equal(/काम की जिम्मेदारी|ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ/.test(question.stem), false, `${row}: bureaucratic cycle wording`);
    assert.equal(/अंतिम सक्रिय बारी|अगली सक्रिय दर|चक्र की अवस्था|अज्ञात सक्रिय समय|शुद्ध चक्र-काम|ਆਖ਼ਰੀ ਸਰਗਰਮ ਵਾਰੀ|ਅਗਲੀ ਸਰਗਰਮ ਦਰ|ਚੱਕਰ ਦੀ ਸਥਿਤੀ|ਅਣਜਾਣ ਸਰਗਰਮ ਸਮੇਂ|ਸ਼ੁੱਧ ਚੱਕਰ-ਕੰਮ/.test(prose), false, `${row}: technical cycle wording`);
    assert.equal(/अंतिम आवश्यक चक्र या अधूरी बारी|ਆਖ਼ਰੀ ਲੋੜੀਂਦੇ ਚੱਕਰ ਜਾਂ ਅਧੂਰੀ ਵਾਰੀ/.test(question.explanation.commonTrap.explanation), false, `${row}: generic trap wording`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.equal(question.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"), true);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");

    if (entry.solveMode === "findTerminalAgent" || entry.solveMode === "findStartingAgentFromCompletionCondition") {
      assert.equal(question.options.some((option) => /Operator|Technician|Clerk|Machine|Crew|Team|Inspector|Typist|Painter|Recorder|Surveyor|Assembler|Cannot/.test(option)), false);
      assert.match(question.stem, language === "hi" ? /बारी/ : /ਵਾਰੀ/);
    }
    if (entry.solveMode === "findStartingAgentFromCompletionCondition") {
      assert.match(question.explanation.opening, language === "hi" ? /दोनों क्रम अलग.*अंतिम बारी/ : /ਦੋਵੇਂ ਕ੍ਰਮ ਵੱਖ.*ਆਖ਼ਰੀ ਵਾਰੀ/);
    }
    if (entry.solveMode === "findCompletionWithWeekendOrHolidayPattern") {
      assert.match(question.stem, language === "hi" ? /शनिवार-रविवार.*कोई काम नहीं/ : /ਸ਼ਨੀਵਾਰ-ਐਤਵਾਰ.*ਕੋਈ ਕੰਮ ਨਹੀਂ/);
      assert.match(question.explanation.opening, language === "hi" ? /पाँच काम वाले दिन.*दो बिना काम/ : /ਪੰਜ ਕੰਮ ਵਾਲੇ ਦਿਨ.*ਦੋ ਬਿਨਾਂ ਕੰਮ/);
    }
    if (entry.solveMode === "findCompletionWithUnequalShiftDurations") {
      assert.match(question.explanation.opening, language === "hi" ? /पाली के घंटों.*अधूरी पाली/ : /ਸ਼ਿਫ਼ਟ ਦੇ ਘੰਟਿਆਂ.*ਅਧੂਰੀ ਸ਼ਿਫ਼ਟ/);
      assert.match(question.explanation.shortcut.steps.join(" "), language === "hi" ? /अपनी पाली की अवधि/ : /ਆਪਣੀ ਸ਼ਿਫ਼ਟ ਦੀ ਮਿਆਦ/);
    }
    if (entry.solveMode === "findCompletionWithPeriodicNegativeWork") {
      assert.match(question.stem, language === "hi" ? /काम बिगाड़ने वाली प्रक्रिया/ : /ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ/);
      assert.match(question.explanation.opening, language === "hi" ? /बिगाड़ वाले दिन.*घटाएँ/ : /ਖਰਾਬੀ ਵਾਲੇ ਦਿਨ.*ਘਟਾਓ/);
    }
    if (entry.solveMode === "findOutputUnderPeriodicMachineSchedule") {
      assert.match(question.stem, language === "hi" ? /मशीन A.*मशीन B/ : /ਮਸ਼ੀਨ A.*ਮਸ਼ੀਨ B/);
      assert.match(question.explanation.opening, language === "hi" ? /प्रति घंटा उत्पादन.*चलने के घंटे/ : /ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਨ.*ਚੱਲਣ ਦੇ ਘੰਟੇ/);
    }
    if (entry.solveMode === "findUnknownTimeFromAlternatingCompletion") {
      assert.match(question.explanation.opening, language === "hi" ? /दर का उलटा/ : /ਦਰ ਦਾ ਉਲਟ/);
      assert.match(question.explanation.conclusion, language === "hi" ? /कुल समय.*होगा/ : /ਕੁੱਲ ਸਮਾਂ.*ਹੋਵੇਗਾ/);
    }
    if (entry.solveMode === "findRequiredCycleRateForDeadline") {
      assert.match(question.explanation.opening, language === "hi" ? /समय-सीमा.*कुल बारियाँ/ : /ਸਮਾਂ-ਸੀਮਾ.*ਕੁੱਲ ਵਾਰੀਆਂ/);
      assert.match(question.explanation.conclusion, language === "hi" ? /जब भी .* की बारी/ : /ਜਦੋਂ ਵੀ .* ਦੀ ਵਾਰੀ/);
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
