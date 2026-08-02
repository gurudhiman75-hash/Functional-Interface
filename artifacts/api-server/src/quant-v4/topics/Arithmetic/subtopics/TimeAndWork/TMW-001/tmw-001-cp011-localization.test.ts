import { strict as assert } from "node:assert";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmwCp011Pipeline } from "./foundation/cp011-runtime";
import { runTmwCp011LocalizedPipeline } from "./foundation/cp011-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const stems: Record<TmwLocalizedLanguage, Set<string>> = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};
let hindiCandidates = 0;
let punjabiCandidates = 0;

function crossScriptDetail(question: ReturnType<typeof runTmwCp011LocalizedPipeline>): string {
  const fields: Array<[string, string]> = [
    ["stem", question.stem],
    ...question.options.map((value, index): [string, string] => [`option-${index + 1}`, value]),
    ["opening", question.explanation.opening],
    ["formula", question.explanation.formula],
    ...question.explanation.givens.map((value, index): [string, string] => [`given-${index + 1}`, value]),
    ...question.explanation.steps.map((value, index): [string, string] => [`step-${index + 1}`, value]),
    ["shortcut-title", question.explanation.shortcut.title],
    ...question.explanation.shortcut.steps.map((value, index): [string, string] => [`shortcut-${index + 1}`, value]),
    ["trap", question.explanation.commonTrap.explanation],
    ["conclusion", question.explanation.conclusion],
  ];
  const foreign = question.language === "pa" ? /[\u0900-\u0963\u0966-\u097F]/ : /[\u0A00-\u0A7F]/;
  const hit = fields.find(([, value]) => foreign.test(value.replace(/\\\([\s\S]*?\\\)/g, "")));
  return hit ? `${hit[0]}=${JSON.stringify(hit[1])}` : "no-field-found";
}

for (const entry of TMW_CP_011_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `runtime-${entry.qlId}-${index}`;
    const english = runTmwCp011Pipeline(entry.qlId, seed);
    assert.equal(english.validation.valid, true, `${entry.qlId}:en:${english.validation.errors.join(" | ")}`);

    for (const language of languages) {
      const localized = runTmwCp011LocalizedPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });

      assert.equal(
        localized.validation.valid,
        true,
        `${entry.qlId}:${language}:${localized.validation.errors.join(" | ")}; ${crossScriptDetail(localized)}`,
      );
      assert.equal(localized.questionLanguageId, english.questionLanguageId);
      assert.equal(localized.solveMode, english.solveMode);
      assert.equal(localized.seed, english.seed);
      assert.deepEqual(localized.parameters, english.parameters);
      assert.deepEqual(localized.solution.answer, english.solution.answer);
      assert.equal(localized.solution.answerType, english.solution.answerType);
      assert.equal(localized.solution.answerKey, english.solution.answerKey);
      assert.equal(localized.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(localized.solution.workedLatex, english.solution.workedLatex);
      assert.deepEqual(
        localized.optionAudit.map((option) => option.value),
        english.optionAudit.map((option) => option.value),
      );
      assert.deepEqual(
        localized.optionAudit.map((option) => option.misconceptionId),
        english.optionAudit.map((option) => option.misconceptionId),
      );
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.equal(localized.options.length, 4);
      assert.equal(new Set(localized.options).size, 4);
      assert.equal(localized.options[localized.correctIndex], localized.solution.answerText);
      assert.equal(localized.optionAudit[localized.correctIndex]?.misconceptionId, "CORRECT");
      assert.equal(localized.publiclyPublishable, false);
      assert.equal(localized.editorialStatus, "PENDING");
      assert.equal(localized.sourceLanguage, "en");
      assert.equal(localized.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.ok(localized.stem.trim().length > 0);
      assert.ok(localized.explanation.givens.length >= 2);
      assert.ok(localized.explanation.steps.length >= 4);
      assert.ok(localized.explanation.shortcut.steps.length >= 2);
      assert.notEqual(localized.explanation.commonTrap.optionText, localized.solution.answerText);
      assert.equal(localized.options.includes(localized.explanation.commonTrap.optionText), true);

      stems[language].add(localized.stem);
      if (language === "hi") hindiCandidates += 1;
      else punjabiCandidates += 1;
    }
  }
}

assert.equal(TMW_CP_011_REGISTRY.length, 19);
assert.equal(hindiCandidates, 380);
assert.equal(punjabiCandidates, 380);
assert.ok(stems.hi.size >= 180);
assert.ok(stems.pa.size >= 180);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  qls: TMW_CP_011_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates,
  punjabiCandidates,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
