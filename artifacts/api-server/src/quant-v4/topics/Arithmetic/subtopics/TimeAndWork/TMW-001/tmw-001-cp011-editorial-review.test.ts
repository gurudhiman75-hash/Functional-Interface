import { strict as assert } from "node:assert";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";
import { runTmwCp011LocalizedPipeline } from "./foundation/cp011-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const titles: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const openings: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;
let openAutomatedFindings = 0;

for (const entry of TMW_CP_011_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp011-editorial:${entry.qlId}:${index}`;
    const english = runTmwCp011Pipeline(entry.qlId, seed);
    assert.equal(english.validation.valid, true, `${entry.qlId}:en:${english.validation.errors.join(" | ")}`);

    for (const language of languages) {
      const question = runTmwCp011LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const context = `${entry.qlId}:${language}:seed-${index}`;
      const learnerText = [
        question.stem,
        ...question.options,
        question.explanation.opening,
        ...question.explanation.givens,
        ...question.explanation.steps,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n").replace(/\\\([\s\S]*?\\\)/g, "");
      const findings: string[] = [];

      if (!question.validation.valid) findings.push(...question.validation.errors);
      if (/10-सेकंड|10-ਸਕਿੰਟ|सही नियम लिखें|ਸਹੀ ਨਿਯਮ ਲਿਖੋ/.test(learnerText)) findings.push("generic teaching wording");
      if (/find[A-Z]|TMW_|misconceptionId|publiclyPublishable/.test(learnerText)) findings.push("internal wording");
      if (/\b(?:output|rate|target|worker|crew|day|days|total|threshold|table|deadline|increase|decrease|multiplier|arithmetic|geometric|sequence)\b/i.test(learnerText)) findings.push("English instructional wording");
      if (language === "hi" && /[\u0A00-\u0A7F]/.test(learnerText)) findings.push("Gurmukhi leakage");
      if (language === "pa" && /[\u0900-\u0963\u0966-\u097F]/.test(learnerText)) findings.push("Devanagari leakage");
      if (!question.explanation.commonTrap.explanation.includes(question.explanation.commonTrap.optionText)) findings.push("trap option not named");
      if (!question.explanation.conclusion.includes(question.solution.answerText)) findings.push("conclusion omits answer");
      if (question.explanation.shortcut.steps.length !== 2) findings.push("shortcut step count");
      openAutomatedFindings += findings.length;
      assert.deepEqual(findings, [], `${context}: ${findings.join(" | ")}`);

      assert.deepEqual(question.parameters, english.parameters, `${context}: parameter parity`);
      assert.deepEqual(question.solution.answer, english.solution.answer, `${context}: answer parity`);
      assert.equal(question.solution.answerType, english.solution.answerType, `${context}: answer type parity`);
      assert.equal(question.solution.answerKey, english.solution.answerKey, `${context}: answer key parity`);
      assert.equal(question.solution.formulaLatex, english.solution.formulaLatex, `${context}: formula parity`);
      assert.deepEqual(question.solution.workedLatex, english.solution.workedLatex, `${context}: worked math parity`);
      assert.deepEqual(question.optionAudit.map((option) => option.value), english.optionAudit.map((option) => option.value), `${context}: option value parity`);
      assert.deepEqual(question.optionAudit.map((option) => option.misconceptionId), english.optionAudit.map((option) => option.misconceptionId), `${context}: misconception parity`);
      assert.equal(question.correctIndex, english.correctIndex, `${context}: correct index parity`);
      assert.equal(question.mathematicalFingerprint, english.mathematicalFingerprint, `${context}: fingerprint parity`);
      assert.equal(question.options[question.correctIndex], question.solution.answerText, `${context}: localized answer mismatch`);
      assert.equal(question.publiclyPublishable, false, `${context}: publishable`);
      assert.equal(question.editorialStatus, "PENDING", `${context}: editorial status`);

      titles[language].add(question.explanation.shortcut.title);
      openings[language].add(question.explanation.opening);
      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(reviewedPackages, 456);
assert.equal(hindiPackages, 228);
assert.equal(punjabiPackages, 228);
assert.equal(titles.hi.size, 19);
assert.equal(titles.pa.size, 19);
assert.equal(openings.hi.size, 19);
assert.equal(openings.pa.size, 19);
assert.equal(openAutomatedFindings, 0);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  qlRange: "TMW-QL-193..TMW-QL-211",
  qls: 19,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  distinctHindiShortcutTitles: titles.hi.size,
  distinctPunjabiShortcutTitles: titles.pa.size,
  openAutomatedFindings,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
