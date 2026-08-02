import { strict as assert } from "node:assert";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmwCp011LocalizedPipeline } from "./foundation/cp011-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const internalPattern = /find[A-Z]|TMW_|misconceptionId|publiclyPublishable/;
const englishPattern = /\b(?:output|rate|target|worker|crew|day|days|total|threshold|table|deadline|increase|decrease|multiplier|files|components|booklets|cartons|sections|crates|arithmetic|geometric|sequence)\b/i;
let rows = 0;

for (const entry of TMW_CP_011_REGISTRY) {
  const seed = `tmw-cp011-localization-review:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp011LocalizedPipeline({
      questionLanguageId: entry.qlId,
      seed,
      language,
    });
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
    const outsideMath = prose.replace(/\\\([\s\S]*?\\\)/g, "");
    const internalField = fields.find(([, value]) => internalPattern.test(value));
    const englishField = fields.find(([, value]) => englishPattern.test(value.replace(/\\\([\s\S]*?\\\)/g, "")));
    const devanagariField = language === "pa"
      ? fields.find(([, value]) => /[\u0900-\u097F]/.test(value.replace(/\\\([\s\S]*?\\\)/g, "")))
      : undefined;
    const gurmukhiField = language === "hi"
      ? fields.find(([, value]) => /[\u0A00-\u0A7F]/.test(value.replace(/\\\([\s\S]*?\\\)/g, "")))
      : undefined;

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.editorialStatus, "PENDING");
    assert.equal(internalField, undefined, `${entry.qlId}:${language}: internal wording in ${internalField?.[0]}: ${internalField?.[1]}`);
    assert.equal(englishField, undefined, `${entry.qlId}:${language}: English wording in ${englishField?.[0]}: ${englishField?.[1]}`);
    assert.equal(devanagariField, undefined, `${entry.qlId}:${language}: Devanagari leakage in ${devanagariField?.[0]}: ${devanagariField?.[1]}`);
    assert.equal(gurmukhiField, undefined, `${entry.qlId}:${language}: Gurmukhi leakage in ${gurmukhiField?.[0]}: ${gurmukhiField?.[1]}`);
    assert.equal(/\b\d+\s+\d+\/\d+\b/.test(outsideMath), false, `${entry.qlId}:${language}: raw mixed fraction`);
    assert.equal((prose.match(/\\\(/g) ?? []).length, (prose.match(/\\\)/g) ?? []).length, `${entry.qlId}:${language}: unbalanced MathJax`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.solution.answerText);
    assert.equal(question.optionAudit[question.correctIndex]?.misconceptionId, "CORRECT");
    assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true);
    assert.ok(question.explanation.shortcut.title.startsWith(language === "hi" ? "10-सेकंड" : "10-ਸਕਿੰਟ"));
    assert.match(question.explanation.conclusion, language === "hi" ? /^अतः सही उत्तर/ : /^ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ/);

    switch (entry.answerType) {
      case "TIME":
        assert.match(question.solution.answerText, language === "hi" ? /दिन|\\text\{दिन\}/ : /ਦਿਨ|\\text\{ਦਿਨ\}/);
        break;
      case "DAY_INDEX":
        assert.match(question.solution.answerText, language === "hi" ? /^दिन \d+ के बाद$/ : /^ਦਿਨ \d+ ਤੋਂ ਬਾਅਦ$/);
        break;
      case "RATE":
        assert.match(question.solution.answerText, language === "hi" ? /प्रतिदिन$/ : /ਹਰ ਦਿਨ$/);
        break;
      case "RATE_CHANGE":
        assert.match(question.solution.answerText, language === "hi" ? /बढ़ोतरी|कमी/ : /ਵਾਧਾ|ਘਾਟ/);
        break;
      case "OUTPUT":
      case "MULTIPLIER":
        assert.ok(question.solution.answerText.length > 0);
        break;
    }

    switch (entry.ruleId) {
      case "TMW_ARITHMETIC_RATE_SUM":
        assert.match(question.explanation.opening, language === "hi" ? /पहली और अंतिम दर/ : /ਪਹਿਲੀ ਅਤੇ ਆਖਰੀ ਦਰ/);
        break;
      case "TMW_GEOMETRIC_RATE_SUM":
        assert.match(question.explanation.opening, language === "hi" ? /गुणक/ : /ਗੁਣਕ/);
        break;
      case "TMW_VARIABLE_COMPLETION":
        assert.match(question.explanation.opening, language === "hi" ? /पूरे दिनों.*अगले दिन/ : /ਪੂਰੇ ਦਿਨਾਂ.*ਅਗਲੇ ਦਿਨ/);
        break;
      case "TMW_THRESHOLD_SWITCH":
        assert.match(question.explanation.opening, language === "hi" ? /दो अलग चरणों/ : /ਦੋ ਵੱਖਰੇ ਪੜਾਅਾਂ/);
        break;
      case "TMW_CREW_SCHEDULE":
        assert.match(question.explanation.opening, language === "hi" ? /श्रमिक.*प्रति श्रमिक/ : /ਮਜ਼ਦੂਰ.*ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ/);
        break;
      case "TMW_COMBINED_SEQUENCE":
        assert.match(question.explanation.opening, language === "hi" ? /दोनों.*कुल/ : /ਦੋਵੇਂ.*ਕੁੱਲ/);
        break;
      case "TMW_SIGNED_SEQUENCE":
        assert.match(question.explanation.opening, language === "hi" ? /शुद्ध काम/ : /ਸ਼ੁੱਧ ਕੰਮ/);
        break;
      case "TMW_EXPLICIT_RATE_TABLE":
        assert.match(question.explanation.opening, language === "hi" ? /तालिका.*दिनक्रम/ : /ਸਾਰਣੀ.*ਦਿਨਕ੍ਰਮ/);
        break;
      case "TMW_DEADLINE_ADJUSTMENT":
        assert.match(question.explanation.opening, language === "hi" ? /कमी.*बराबर बाँटें/ : /ਘਾਟ.*ਬਰਾਬਰ ਵੰਡੋ/);
        break;
    }

    rows += 1;
  }
}

assert.equal(rows, 38);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  localizedEditorialRows: rows,
  status: "PASS",
}, null, 2));
