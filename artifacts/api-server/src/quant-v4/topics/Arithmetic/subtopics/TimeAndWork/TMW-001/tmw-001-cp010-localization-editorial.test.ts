import { strict as assert } from "node:assert";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const titles: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
let rows = 0;

for (const entry of TMW_CP010_REGISTRY) {
  const seed = `tmw-cp010-localization-review:${entry.qlId}`;
  for (const language of languages) {
    const question = runTmwCp010LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
    const prose = [
      question.stem,
      ...question.options,
      question.explanation.opening,
      ...question.explanation.givens,
      ...question.explanation.steps,
      question.explanation.shortcut.title,
      ...question.explanation.shortcut.steps,
      question.explanation.commonTrap.explanation,
      question.explanation.conclusion,
    ].join("\n");

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${question.validation.errors.join(" | ")}`);
    assert.equal(question.publiclyPublishable, false, `${entry.qlId}:${language}: publishable`);
    assert.equal(question.editorialStatus, "PENDING", `${entry.qlId}:${language}: editorial status`);
    assert.equal(question.options.length, 4, `${entry.qlId}:${language}: option count`);
    assert.equal(new Set(question.options).size, 4, `${entry.qlId}:${language}: option uniqueness`);
    assert.equal(question.options[question.correctIndex], question.solution.answerText, `${entry.qlId}:${language}: answer option`);
    assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey, `${entry.qlId}:${language}: answer key`);
    assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText, `${entry.qlId}:${language}: trap differs`);
    assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${entry.qlId}:${language}: trap option linked`);
    assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${entry.qlId}:${language}: conclusion answer`);
    assert.equal(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ/.test(prose), false, `${entry.qlId}:${language}: generic shortcut`);
    assert.equal(/find[A-Z]|TMW_|Independent staged|Do not choose|Don't fall for/i.test(`${prose}\n${question.explanation.formula}`), false, `${entry.qlId}:${language}: internal wording`);

    if (entry.answerType === "SEGMENT") {
      assert.notEqual(question.solution.terminalSegmentIndex, undefined, `${entry.qlId}:${language}: segment index`);
      assert.equal(/segment:|extra:/i.test(question.solution.answerText), false, `${entry.qlId}:${language}: internal segment answer`);
    }
    if (entry.answerType === "COUNT") {
      assert.match(question.solution.answerText, language === "hi" ? /पूरे चक्र$/ : /ਪੂਰੇ ਚੱਕਰ$/, `${entry.qlId}:${language}: count answer`);
    }
    if (entry.answerType === "CAPACITY") {
      assert.match(question.solution.answerText, language === "hi" ? /लीटर$/ : /ਲੀਟਰ$/, `${entry.qlId}:${language}: capacity answer`);
    }
    if (entry.answerType === "FLOW_RATE") {
      assert.match(question.solution.answerText, language === "hi" ? /टंकी प्रति घंटा भराव/ : /ਟੈਂਕੀ ਪ੍ਰਤੀ ਘੰਟਾ ਭਰਾਅ/, `${entry.qlId}:${language}: flow answer`);
    }

    titles[language].add(question.explanation.shortcut.title);
    rows += 1;
  }
}

assert.equal(rows, 36);
assert.equal(titles.hi.size, 18);
assert.equal(titles.pa.size, 18);
console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-010", localizedEditorialRows: rows, distinctHindiShortcutTitles: titles.hi.size, distinctPunjabiShortcutTitles: titles.pa.size, status: "PASS" }, null, 2));
