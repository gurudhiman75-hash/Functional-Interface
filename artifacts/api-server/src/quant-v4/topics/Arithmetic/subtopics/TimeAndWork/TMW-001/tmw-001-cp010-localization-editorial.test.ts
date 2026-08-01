import { strict as assert } from "node:assert";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const internalIdentifierPattern = /find[A-Z]|TMW_|_[A-Z_]{3,}/;
const internalEnglishPattern = /Independent staged|Do not choose|Don't fall for/i;
const englishPattern = /\b(?:tank|reservoir|inlet|outlet|leak|stage|segment|cycle|threshold|litres?|hours?|water level|flow rate|full|empty|terminal|switch|drainage|completion|earlier|later|process full cycles)\b/i;
let rows = 0;

for (const entry of TMW_CP010_REGISTRY) {
  const seed = `tmw-cp010-localization-review:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp010LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
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
    assert.equal(/\d+ घंटे में|\d+ घंटे तक|\d+ ਘੰਟੇ ਵਿੱਚ|\d+ ਘੰਟੇ ਲਈ/.test(prose), false, `${entry.qlId}:${language}: uninflected hour phrase`);
    assert.equal(devanagariField, undefined, `${entry.qlId}:${language}: Devanagari leakage in ${devanagariField?.[0]}: ${devanagariField?.[1]}`);
    assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}: Gurmukhi leakage in ${gurmukhiField?.[0]}: ${gurmukhiField?.[1]}`);
    assert.equal(/पाइपें एक साथ चलते हैं|पाइपें चलती है|ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ|ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/.test(prose), false, `${entry.qlId}:${language}: pipe-group agreement`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.solution.answerText);
    assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);
    assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.ok(question.explanation.shortcut.title.startsWith(language === "hi" ? "10-सेकंड" : "10-ਸਕਿੰਟ"));

    if (entry.answerType === "SEGMENT") {
      assert.notEqual(question.solution.terminalSegmentIndex, undefined);
      assert.equal(/segment:|extra:/.test(question.solution.answerText), false);
    }
    if (entry.answerType === "COUNT") {
      assert.match(question.solution.answerText, language === "hi" ? /पूरे चक्र$/ : /ਪੂਰੇ ਚੱਕਰ$/);
    }
    if (entry.answerType === "CAPACITY") {
      assert.match(question.solution.answerText, language === "hi" ? /लीटर$/ : /ਲੀਟਰ$/);
    }
    if (entry.answerType === "FLOW_RATE") {
      assert.match(question.solution.answerText, language === "hi" ? /टंकी प्रति घंटा भराव/ : /ਟੈਂਕੀ ਪ੍ਰਤੀ ਘੰਟਾ ਭਰਾਅ/);
    }

    switch (entry.ruleId) {
      case "TMW_STAGE_EVENT_LEDGER":
        assert.match(question.explanation.opening, language === "hi" ? /अलग चरण.*शुद्ध दर/ : /ਵੱਖਰੇ ਪੜਾਅ.*ਸ਼ੁੱਧ ਦਰ/);
        break;
      case "TMW_CYCLE_ACCUMULATION":
        assert.match(question.explanation.opening, language === "hi" ? /एक चक्र.*अंतिम चक्र/ : /ਇੱਕ ਚੱਕਰ.*ਅੰਤਿਮ ਚੱਕਰ/);
        break;
      case "TMW_LEVEL_TRIGGER":
        assert.match(question.explanation.opening, language === "hi" ? /सेंसर.*स्तर/ : /ਸੈਂਸਰ.*ਪੱਧਰ/);
        break;
      case "TMW_STAGE_INVERSE":
        assert.match(question.explanation.opening, language === "hi" ? /अज्ञात.*समीकरण/ : /ਅਣਜਾਣ.*ਸਮੀਕਰਨ/);
        break;
      case "TMW_STAGED_PHYSICAL_FLOW":
        assert.match(question.explanation.opening, language === "hi" ? /शुद्ध आयतन/ : /ਸ਼ੁੱਧ ਆਇਤਨ/);
        break;
    }

    rows += 1;
  }
}

assert.equal(rows, 36);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-010", localizedEditorialRows: rows, status: "PASS" }, null, 2));
