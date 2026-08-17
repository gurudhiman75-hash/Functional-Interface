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
      const context = `${entry.qlId}:${language}:seed-${index}`;
      const describeField = (field: [string, string] | undefined): string =>
        field === undefined ? "none" : `${field[0]}=${JSON.stringify(field[1])}`;
      const firstMatchingField = (pattern: RegExp): [string, string] | undefined =>
        fields.find(([, value]) => pattern.test(value));
      const mixedFractionField = firstMatchingField(rawMixedFractionPattern);
      const devanagariField = language === "pa"
        ? firstMatchingField(/[\u0900-\u0963\u0966-\u097F]/)
        : undefined;
      const gurmukhiField = language === "hi"
        ? firstMatchingField(/[\u0A00-\u0A7F]/)
        : undefined;
      const internalTokenField = firstMatchingField(/find[A-Z]|TMW_|Independent staged|Do not choose|Don't fall for/i);
      const englishLeakageField = firstMatchingField(/\b(?:tank|reservoir|inlet|outlet|leak|stage|segment|cycle|threshold|litres?|hours?|water level|flow rate|terminal|switch|drainage|completion|earlier|later|process full cycles)\b/i);
      const technicalTranslationField = firstMatchingField(/कार्यक्रम|चिह्न सहित|अंतिम सक्रिय खंड|टर्मिनल खंड|ਕਾਰਜਕ੍ਰਮ|ਚਿੰਨ੍ਹ ਸਮੇਤ|ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ|ਟਰਮੀਨਲ ਖੰਡ/);
      const countdownTitleField = firstMatchingField(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ/);
      const awkwardDurationField = firstMatchingField(/\d+ घंटे में|\d+ घंटे तक|\d+ ਘੰਟੇ ਵਿੱਚ|\d+ ਘੰਟੇ ਲਈ/);
      const agreementField = firstMatchingField(/पाइपें एक साथ चलते हैं|पाइपें चलती है|ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ|ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/);

      assert.equal(question.validation.valid, true, `${context}: validation errors=${question.validation.errors.join(" | ")}`);
      assert.equal(question.publiclyPublishable, false, `${context}: publiclyPublishable must remain false`);
      assert.equal(question.editorialStatus, "PENDING", `${context}: editorialStatus must remain PENDING`);
      assert.equal(question.options.length, 4, `${context}: expected four options`);
      assert.equal(new Set(question.options).size, 4, `${context}: options must be distinct: ${JSON.stringify(question.options)}`);
      assert.equal(question.options[question.correctIndex], question.solution.answerText, `${context}: correct option does not equal answer text`);
      assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey, `${context}: correct option audit key mismatch`);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText, `${context}: trap option duplicates the correct answer`);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${context}: conclusion omits answer ${JSON.stringify(question.solution.answerText)}`);
      assert.equal(internalTokenField, undefined, `${context}: internal/generator wording in ${describeField(internalTokenField)}; formula=${JSON.stringify(question.explanation.formula)}`);
      assert.equal(englishLeakageField, undefined, `${context}: English leakage in ${describeField(englishLeakageField)}`);
      assert.equal(technicalTranslationField, undefined, `${context}: technical/literal translation in ${describeField(technicalTranslationField)}`);
      assert.equal(countdownTitleField, undefined, `${context}: generic countdown shortcut in ${describeField(countdownTitleField)}`);
      assert.equal(mixedFractionField, undefined, `${context}: raw mixed fraction in ${describeField(mixedFractionField)}`);
      assert.equal(awkwardDurationField, undefined, `${context}: awkward duration wording in ${describeField(awkwardDurationField)}`);
      assert.equal(devanagariField, undefined, `${context}: Devanagari leakage in ${describeField(devanagariField)}`);
      assert.equal(gurmukhiField, undefined, `${context}: Gurmukhi leakage in ${describeField(gurmukhiField)}`);
      assert.equal(agreementField, undefined, `${context}: grammatical agreement defect in ${describeField(agreementField)}`);
      checked += 1;
    }
  }
}

assert.equal(checked, 720, `Expected 720 localized packages, checked ${checked}`);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-010",
  localizedManualLanguagePackages: checked,
  status: "PASS",
}, null, 2));
