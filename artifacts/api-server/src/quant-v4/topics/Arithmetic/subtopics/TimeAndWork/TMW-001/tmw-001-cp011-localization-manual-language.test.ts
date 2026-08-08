import { strict as assert } from "node:assert";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmwCp011LocalizedPipeline } from "./foundation/cp011-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const titles: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const internalPattern = /find[A-Z]|TMW_|misconceptionId|publiclyPublishable/;
const englishPattern = /\b(?:output|rate|target|worker|crew|day|days|total|threshold|table|deadline|increase|decrease|multiplier|files|components|booklets|cartons|sections|crates|arithmetic|geometric|sequence)\b/i;
const genericPattern = /10-सेकंड|10-ਸਕਿੰਟ|सही नियम लिखें|ठीक नियम लिखो|ਸਹੀ ਨਿਯਮ ਲਿਖੋ|एक ही दिन की दर सभी दिनों|ਇੱਕੋ ਦਿਨ ਦੀ ਦਰ ਸਾਰੇ ਦਿਨਾਂ|संबंधित औसत, अवधि या दर|ਸੰਬੰਧਿਤ ਔਸਤ, ਮਿਆਦ ਜਾਂ ਦਰ/;
const unexplainedTeachingSymbolPattern = /(?<![A-Za-z0-9_])(?:AP|GP|[adknqrtG])(?![A-Za-z0-9_])/;
let checked = 0;

for (const entry of TMW_CP_011_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `runtime-${entry.qlId}-${index}`;
    for (const language of languages) {
      const question = runTmwCp011LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
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
      const context = `${entry.qlId}:${language}:seed-${index}`;
      const cleanField = ([name, value]: [string, string]): [string, string] => [name, value.replace(/\\\([\s\S]*?\\\)/g, "")];
      const proseFields = fields.map(cleanField);
      const find = (pattern: RegExp): [string, string] | undefined => proseFields.find(([, value]) => pattern.test(value));
      const describe = (field: [string, string] | undefined): string => field ? `${field[0]}=${JSON.stringify(field[1])}` : "none";
      const internal = find(internalPattern);
      const english = find(englishPattern);
      const generic = find(genericPattern);
      const unexplainedTeachingSymbol = find(unexplainedTeachingSymbolPattern);
      const devanagari = language === "pa" ? find(/[\u0900-\u0963\u0966-\u097F]/) : undefined;
      const gurmukhi = language === "hi" ? find(/[\u0A00-\u0A7F]/) : undefined;
      const rawMixed = find(/\b\d+\s+\d+\/\d+\b/);
      const malformedPunjabi = language === "pa" ? find(/ਪੜਾਅਾਂ|ਦਰਾਂਵਾਂ|ਦਿਨਾਂਵਾਂ/) : undefined;
      const malformedHindi = language === "hi" ? find(/हैैं|हैंं|दिनोंों|दरेंें/) : undefined;

      assert.equal(question.validation.valid, true, `${context}: ${question.validation.errors.join(" | ")}`);
      assert.equal(question.publiclyPublishable, false, `${context}: publishable`);
      assert.equal(question.editorialStatus, "PENDING", `${context}: editorial status`);
      assert.equal(internal, undefined, `${context}: internal wording in ${describe(internal)}`);
      assert.equal(english, undefined, `${context}: English wording in ${describe(english)}`);
      assert.equal(generic, undefined, `${context}: generic wording in ${describe(generic)}`);
      assert.equal(unexplainedTeachingSymbol, undefined, `${context}: unexplained teaching symbol in ${describe(unexplainedTeachingSymbol)}`);
      assert.equal(devanagari, undefined, `${context}: Devanagari leakage in ${describe(devanagari)}`);
      assert.equal(gurmukhi, undefined, `${context}: Gurmukhi leakage in ${describe(gurmukhi)}`);
      assert.equal(rawMixed, undefined, `${context}: raw mixed fraction in ${describe(rawMixed)}`);
      assert.equal(malformedPunjabi, undefined, `${context}: malformed Punjabi in ${describe(malformedPunjabi)}`);
      assert.equal(malformedHindi, undefined, `${context}: malformed Hindi in ${describe(malformedHindi)}`);
      assert.equal(question.options.length, 4, `${context}: option count`);
      assert.equal(new Set(question.options).size, 4, `${context}: duplicate options`);
      assert.equal(question.options[question.correctIndex], question.solution.answerText, `${context}: answer mismatch`);
      assert.equal(question.optionAudit[question.correctIndex]?.misconceptionId, "CORRECT", `${context}: audit mismatch`);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText, `${context}: trap equals answer`);
      assert.ok(question.explanation.commonTrap.explanation.includes(question.explanation.commonTrap.optionText), `${context}: trap option not named`);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${context}: conclusion omits answer`);
      assert.equal(question.explanation.shortcut.steps.length, 2, `${context}: shortcut step count`);
      titles[language].add(question.explanation.shortcut.title);
      checked += 1;
    }
  }
}

assert.equal(checked, 760);
assert.equal(titles.hi.size, 19);
assert.equal(titles.pa.size, 19);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  localizedManualLanguagePackages: checked,
  distinctHindiShortcutTitles: titles.hi.size,
  distinctPunjabiShortcutTitles: titles.pa.size,
  status: "PASS",
}, null, 2));
