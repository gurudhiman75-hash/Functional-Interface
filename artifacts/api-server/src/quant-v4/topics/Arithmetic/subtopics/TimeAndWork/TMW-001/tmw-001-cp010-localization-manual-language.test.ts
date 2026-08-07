import { strict as assert } from "node:assert";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const rawMixedFractionPattern = /\b\d+\s+\d+\/\d+\b/;
let checked = 0;

for (const entry of TMW_CP010_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp010-localization:${entry.qlId}:${index}`;
    for (const language of languages) {
      const question = runTmwCp010LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const fields: Array<[string, string]> = [
        ["stem", question.stem],
        ...question.options.map((value, optionIndex): [string, string] => [`option-${optionIndex + 1}`, value]),
        ["opening", question.explanation.opening],
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

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${index}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.editorialStatus, "PENDING");
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText));
      assert.equal(/find[A-Z]|TMW_|Independent staged|Do not choose|Don't fall for/i.test(`${prose}\n${question.explanation.formula}`), false);
      assert.equal(/\b(?:tank|reservoir|inlet|outlet|leak|stage|segment|cycle|threshold|litres?|hours?|water level|flow rate|terminal|switch|drainage|completion|earlier|later|process full cycles)\b/i.test(prose), false);
      assert.equal(/कार्यक्रम|चिह्न सहित|अंतिम सक्रिय खंड|टर्मिनल खंड|ਕਾਰਜਕ੍ਰਮ|ਚਿੰਨ੍ਹ ਸਮੇਤ|ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ|ਟਰਮੀਨਲ ਖੰਡ/.test(prose), false);
      assert.equal(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ/.test(prose), false);
      assert.equal(mixedFractionField, undefined, `${entry.qlId}:${language}:${index}: raw mixed fraction in ${mixedFractionField?.[0]}`);
      assert.equal(/\d+ घंटे में|\d+ घंटे तक|\d+ ਘੰਟੇ ਵਿੱਚ|\d+ ਘੰਟੇ ਲਈ/.test(prose), false);
      assert.equal(devanagariField, undefined, `${entry.qlId}:${language}:${index}: Devanagari leakage in ${devanagariField?.[0]}`);
      assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}:${index}: Gurmukhi leakage in ${gurmukhiField?.[0]}`);
      assert.equal(/पाइपें एक साथ चलते हैं|पाइपें चलती है|ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ|ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/.test(prose), false);
      checked += 1;
    }
  }
}

assert.equal(checked, 720);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-010",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
