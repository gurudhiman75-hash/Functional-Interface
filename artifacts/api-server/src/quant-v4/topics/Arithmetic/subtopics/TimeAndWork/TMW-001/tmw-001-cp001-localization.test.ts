import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const generatedByLanguage: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stemsByLanguage: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };
const correctPositions: Record<TmwLocalizedLanguage, Set<number>> = { hi: new Set(), pa: new Set() };

function learnerText(question: any): string {
  return [
    question.stem,
    ...question.options,
    question.solution.answerText,
    question.explanation.opening,
    question.explanation.formula,
    ...question.explanation.steps,
    question.explanation.shortcut.title,
    ...question.explanation.shortcut.steps,
    question.explanation.commonTrap.optionLabel,
    question.explanation.commonTrap.optionText,
    question.explanation.commonTrap.explanation,
    question.explanation.conclusion,
  ].join("\n");
}

for (const entry of TMW_CP001_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp001-localization:${entry.qlId}:${index}`;
    const english = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    assert.equal(english.validation.valid, true, `${entry.qlId}: English source invalid: ${english.validation.errors.join(" | ")}`);

    for (const language of languages) {
      const first = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const replay = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const text = learnerText(first);

      assert.deepEqual(first, replay, `${entry.qlId}:${language}: deterministic replay failed`);
      assert.equal(first.validation.valid, true, `${entry.qlId}:${language}: ${first.validation.errors.join(" | ")}`);
      assert.equal(first.language, language);
      assert.equal(first.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(first.sourceLanguage, "en");
      assert.equal(first.editorialStatus, "PENDING");
      assert.equal(first.publiclyPublishable, false);

      assert.equal(first.archetypeId, english.archetypeId);
      assert.equal(first.canonicalProblemId, english.canonicalProblemId);
      assert.equal(first.questionLanguageId, english.questionLanguageId);
      assert.equal(first.solveMode, english.solveMode);
      assert.equal(first.seed, english.seed);
      assert.deepEqual(first.parameters, english.parameters);
      assert.deepEqual(first.solution.answer, english.solution.answer);
      assert.equal(first.solution.answerType, english.solution.answerType);
      assert.equal(first.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(first.solution.workedLatex, english.solution.workedLatex);
      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.equal(first.correctIndex, english.correctIndex);

      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.solution.answerText, first.options[first.correctIndex]);
      assert.equal(first.optionAudit.length, english.optionAudit.length);
      for (let optionIndex = 0; optionIndex < first.optionAudit.length; optionIndex += 1) {
        assert.deepEqual(first.optionAudit[optionIndex]!.value, english.optionAudit[optionIndex]!.value);
        assert.equal(first.optionAudit[optionIndex]!.misconceptionId, english.optionAudit[optionIndex]!.misconceptionId);
        assert.equal(first.optionAudit[optionIndex]!.text, first.options[optionIndex]);
      }
      assert.equal(first.optionAudit[first.correctIndex]!.misconceptionId, "CORRECT");

      const trap = first.explanation.commonTrap;
      assert.notEqual(trap.misconceptionId, "CORRECT");
      assert.ok(first.options.includes(trap.optionText));
      assert.notEqual(trap.optionText, first.solution.answerText);
      assert.ok(trap.optionLabel.startsWith(language === "hi" ? "विकल्प " : "ਚੋਣ "));
      assert.ok(trap.explanation.includes(trap.optionText));

      assert.ok(first.stem.endsWith("?"));
      assert.ok(first.explanation.formula.startsWith("\\("));
      assert.ok(first.explanation.steps.length >= 3);
      assert.ok(first.explanation.shortcut.steps.length >= 1);
      assert.ok(first.explanation.conclusion.length > 10);
      assert.equal(/undefined|null|NaN|Infinity|\{\{|\$\{/.test(text), false);
      assert.equal(/Don't fall for|Do not choose|English only|the generated|find[A-Z]/i.test(text), false);
      assert.equal(/\bOption [A-D]\b/.test(text), false);
      assert.equal(/\bof the work\b|\bper (?:day|hour|minute|shift)\b/i.test(text), false);
      assert.equal((text.match(/\\\(/g) ?? []).length, (text.match(/\\\)/g) ?? []).length);
      if (language === "hi") assert.ok(/[\u0900-\u097F]/.test(first.stem));
      else assert.ok(/[\u0A00-\u0A7F]/.test(first.stem));

      generatedByLanguage[language] += 1;
      stemsByLanguage[language].add(first.stem);
      correctPositions[language].add(first.correctIndex);
    }
  }
}

for (const language of languages) {
  assert.equal(generatedByLanguage[language], 400);
  assert.ok(stemsByLanguage[language].size > 150, `${language}: insufficient stem diversity`);
  assert.deepEqual([...correctPositions[language]].sort(), [0, 1, 2, 3]);
}

assert.throws(
  () => runTmwCp001Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown", language: "hi" }),
  /Unknown TMW-001 question language/,
);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-001",
  qls: TMW_CP001_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: generatedByLanguage.hi,
  punjabiCandidates: generatedByLanguage.pa,
  hindiDistinctStems: stemsByLanguage.hi.size,
  punjabiDistinctStems: stemsByLanguage.pa.size,
  status: "PASS",
}, null, 2));
