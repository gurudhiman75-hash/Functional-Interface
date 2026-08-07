import { strict as assert } from "node:assert";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const titles: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const englishPattern = /\b(?:tank|reservoir|inlet|outlet|leak|stage|segment|cycle|threshold|litres?|hours?|water level|flow rate|terminal|switch|drainage|completion|earlier|later|process full cycles)\b/i;
let rows = 0;

for (const entry of TMW_CP010_REGISTRY) {
  const seed = `tmw-cp010-localization-review:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp010LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
    const fields: Array<[string, string]> = [
      ["stem", question.stem],
      ...question.options.map((value, index): [string, string] => [`option-${index + 1}`, value]),
      ["opening", question.explanation.opening],
      ...question.explanation.givens.map((value, index): [string, string] => [`given-${index + 1}`, value]),
      ...question.explanation.steps.map((value, index): [string, string] => [`worked-step-${index + 1}`, value]),
      ["shortcut-title", question.explanation.shortcut.title],
      ...question.explanation.shortcut.steps.map((value, index): [string, string] => [`shortcut-step-${index + 1}`, value]),
      ["trap", question.explanation.commonTrap.explanation],
      ["conclusion", question.explanation.conclusion],
    ];
    const prose = fields.map(([, value]) => value).join("\n");
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
    assert.equal(englishField, undefined, `${entry.qlId}:${language}: English wording in ${englishField?.[0]}: ${englishField?.[1]}`);
    assert.equal(/find[A-Z]|TMW_|Independent staged|Do not choose|Don't fall for/i.test(`${prose}\n${question.explanation.formula}`), false);
    assert.equal(/कार्यक्रम|चिह्न सहित|अंतिम सक्रिय खंड|टर्मिनल खंड|ਕਾਰਜਕ੍ਰਮ|ਚਿੰਨ੍ਹ ਸਮੇਤ|ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ|ਟਰਮੀਨਲ ਖੰਡ/.test(prose), false);
    assert.equal(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ/.test(prose), false);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false);
    assert.equal(/\d+ घंटे में|\d+ घंटे तक|\d+ ਘੰਟੇ ਵਿੱਚ|\d+ ਘੰਟੇ ਲਈ/.test(prose), false);
    assert.equal(devanagariField, undefined, `${entry.qlId}:${language}: Devanagari leakage in ${devanagariField?.[0]}`);
    assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}: Gurmukhi leakage in ${gurmukhiField?.[0]}`);
    assert.equal(/पाइपें एक साथ चलते हैं|पाइपें चलती है|ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ|ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/.test(prose), false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.solution.answerText);
    assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);
    assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.ok(question.explanation.conclusion.includes(question.solution.answerText));

    if (entry.answerType === "SEGMENT") {
      assert.notEqual(question.solution.terminalSegmentIndex, undefined);
      assert.equal(/segment:|extra:/i.test(question.solution.answerText), false);
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

    titles[language].add(question.explanation.shortcut.title);
    rows += 1;
  }
}

assert.equal(rows, 36);
assert.equal(titles.hi.size, 18);
assert.equal(titles.pa.size, 18);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-010", localizedEditorialRows: rows, distinctHindiShortcutTitles: titles.hi.size, distinctPunjabiShortcutTitles: titles.pa.size, status: "PASS" }, null, 2));
