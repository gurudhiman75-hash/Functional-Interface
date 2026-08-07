import { strict as assert } from "node:assert";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmwCp011LocalizedPipeline } from "./foundation/cp011-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const titles: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const openings: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const internalPattern = /find[A-Z]|TMW_|misconceptionId|publiclyPublishable/;
const englishPattern = /\b(?:output|rate|target|worker|crew|day|days|total|threshold|table|deadline|increase|decrease|multiplier|files|components|booklets|cartons|sections|crates|arithmetic|geometric|sequence)\b/i;
const genericPattern = /10-सेकंड|10-ਸਕਿੰਟ|सही नियम लिखें|ठीक नियम लिखो|ਸਹੀ ਨਿਯਮ ਲਿਖੋ|संबंधित औसत, अवधि या दर|ਸੰਬੰਧਿਤ ਔਸਤ, ਮਿਆਦ ਜਾਂ ਦਰ/;
let rows = 0;

for (const entry of TMW_CP_011_REGISTRY) {
  const seed = `review-${entry.qlId}-0`;
  for (const language of languages) {
    const question = runTmwCp011LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
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
    const outsideMath = fields.map(([, value]) => value).join("\n").replace(/\\\([\s\S]*?\\\)/g, "");
    const context = `${entry.qlId}:${language}`;

    assert.equal(question.validation.valid, true, `${context}:${question.validation.errors.join(" | ")}`);
    assert.equal(question.publiclyPublishable, false, `${context}: publishable`);
    assert.equal(question.editorialStatus, "PENDING", `${context}: editorial status`);
    assert.equal(internalPattern.test(outsideMath), false, `${context}: internal wording`);
    assert.equal(englishPattern.test(outsideMath), false, `${context}: English instructional wording`);
    assert.equal(genericPattern.test(outsideMath), false, `${context}: generic teaching wording`);
    assert.ok(question.explanation.opening.length >= 70, `${context}: opening too brief`);
    assert.ok(question.explanation.steps[0]?.length >= 45, `${context}: worked lead too brief`);
    assert.equal(question.explanation.shortcut.steps.length, 2, `${context}: shortcut step count`);
    assert.ok(question.explanation.commonTrap.explanation.includes(question.explanation.commonTrap.optionText), `${context}: trap option not named`);
    assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${context}: conclusion omits answer`);
    assert.equal(question.options.length, 4, `${context}: option count`);
    assert.equal(new Set(question.options).size, 4, `${context}: duplicate options`);
    assert.equal(question.options[question.correctIndex], question.solution.answerText, `${context}: correct answer mismatch`);
    assert.equal(question.optionAudit[question.correctIndex]?.misconceptionId, "CORRECT", `${context}: correct audit mismatch`);

    titles[language].add(question.explanation.shortcut.title);
    openings[language].add(question.explanation.opening);
    rows += 1;
  }
}

assert.equal(rows, 38);
assert.equal(titles.hi.size, 19);
assert.equal(titles.pa.size, 19);
assert.equal(openings.hi.size, 19);
assert.equal(openings.pa.size, 19);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  localizedEditorialRows: rows,
  distinctHindiShortcutTitles: titles.hi.size,
  distinctPunjabiShortcutTitles: titles.pa.size,
  distinctHindiOpenings: openings.hi.size,
  distinctPunjabiOpenings: openings.pa.size,
  status: "PASS",
}, null, 2));
