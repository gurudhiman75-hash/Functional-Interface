import { strict as assert } from "node:assert";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const counts: Record<TmwLocalizedLanguage, number> = { hi: 0, pa: 0 };
const stems: Record<TmwLocalizedLanguage, Set<string>> = { hi: new Set(), pa: new Set() };

const joinModes = new Set([
  "findTotalTimeWhenOneStartsThenAnotherJoins",
  "findTotalTimeWithStaggeredJoins",
  "findTotalTimeWithJoinAndLeaveEvents",
  "findJoinTimeFromFinalCompletion",
  "findEarlyCompletionAfterWorkerJoins",
]);
const leaveModes = new Set([
  "findTotalTimeWhenTeamStartsThenOneLeaves",
  "findTotalTimeWithStaggeredExits",
  "findTotalTimeWithJoinAndLeaveEvents",
  "findLeaveTimeFromFinalCompletion",
  "findWorkerCountRemovedAfterPartialProgress",
  "findDelayAfterWorkerLeaves",
]);

for (const entry of TMW_CP004_REGISTRY) {
  for (let index = 0; index < 20; index += 1) {
    const seed = `tmw-cp004-localization:${entry.qlId}:${index}`;
    const english = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed });
    for (const language of languages) {
      const first = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed, language });
      const second = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed, language });
      assert.deepEqual(first, second);
      assert.equal(first.validation.valid, true, `${entry.qlId}:${language}:${first.validation.errors.join(" | ")}`);
      assert.equal(first.language, language);
      assert.equal(first.locale, language === "hi" ? "hi-IN" : "pa-IN");
      assert.equal(first.sourceLanguage, "en");
      assert.equal(first.editorialStatus, "PENDING");
      assert.equal(first.publiclyPublishable, false);
      assert.equal(first.canonicalProblemId, english.canonicalProblemId);
      assert.equal(first.questionLanguageId, english.questionLanguageId);
      assert.equal(first.solveMode, english.solveMode);
      assert.deepEqual(first.parameters, english.parameters);
      assert.equal(first.solution.answer.numerator, english.solution.answer.numerator);
      assert.equal(first.solution.answer.denominator, english.solution.answer.denominator);
      assert.equal(first.solution.answerType, english.solution.answerType);
      assert.equal(first.solution.formulaLatex, english.solution.formulaLatex);
      assert.deepEqual(first.solution.workedLatex, english.solution.workedLatex);
      assert.equal(first.correctIndex, english.correctIndex);
      assert.equal(first.mathematicalFingerprint, english.mathematicalFingerprint);
      assert.deepEqual(first.optionAudit.map((option) => option.value), english.optionAudit.map((option) => option.value));
      assert.deepEqual(
        first.optionAudit.map((option) => option.misconceptionId),
        english.optionAudit.map((option) => option.misconceptionId),
      );
      assert.equal(first.options.length, 4);
      assert.equal(new Set(first.options).size, 4);
      assert.equal(first.optionAudit[first.correctIndex]?.misconceptionId, "CORRECT");
      assert.ok(first.explanation.formula.startsWith("\\("));
      assert.equal(
        (first.explanation.formula.match(/\\\(/g) ?? []).length,
        (first.explanation.formula.match(/\\\)/g) ?? []).length,
      );
      assert.ok(first.explanation.steps.length >= 3);
      assert.ok(first.explanation.commonTrap.optionLabel.startsWith(language === "hi" ? "विकल्प" : "ਚੋਣ"));
      assert.ok(first.options.includes(first.explanation.commonTrap.optionText));
      assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");

      const learnerText = [
        first.stem,
        ...first.options,
        first.explanation.opening,
        first.explanation.shortcut.title,
        ...first.explanation.shortcut.steps,
        first.explanation.commonTrap.explanation,
        first.explanation.conclusion,
      ].join("\n");
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Do not|Don't/i.test(learnerText), false);
      assert.equal(/\b(?:operator|technician|clerk|machine|crew|team|inspector|typist|painter|recorder|surveyor|assembler)\b/i.test(learnerText), false, `${entry.qlId}:${language}: actor leakage`);
      assert.equal(/\b(?:customer-record|equipment overhaul|loan-application|printing order|road-marking|packaging order|quality-inspection|manuscript-typing|school-building|warehouse inventory|field survey|electronics-assembly)\b/i.test(learnerText), false, `${entry.qlId}:${language}: context leakage`);
      assert.equal(/\b(?:\d+\s+)?\d+\/\d+\s+(?:दिन|ਦਿਨ|घंट|ਘੰਟ)/.test(learnerText), false, `${entry.qlId}:${language}: raw fractional time`);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);

      if (first.solution.answerType === "FRACTION") {
        assert.equal(first.options.every((option) => option.includes(language === "hi" ? "काम का" : "ਕੰਮ ਦਾ")), true);
      }
      if (first.solution.answerType === "RATE") {
        assert.equal(first.options.every((option) => option.includes(language === "hi" ? "प्रति" : "ਪ੍ਰਤੀ")), true);
      }
      if (first.solution.answerType === "COUNT") {
        assert.equal(first.options.every((option) => option.endsWith(language === "hi" ? "कर्मचारी" : "ਕਰਮਚਾਰੀ")), true);
      }
      if (joinModes.has(entry.solveMode)) {
        assert.match(first.stem, language === "hi" ? /जुड़/ : /ਜੁੜ/);
      }
      if (leaveModes.has(entry.solveMode)) {
        assert.match(first.stem, language === "hi" ? /चला|गए|जाता/ : /ਚਲਾ|ਗਏ|ਜਾਂਦਾ/);
      }
      if (entry.solveMode === "findCompletionWithIdleInterval") {
        assert.match(first.stem, language === "hi" ? /रुका/ : /ਰੁਕਿਆ/);
        assert.match(first.explanation.shortcut.title, language === "hi" ? /रुका समय/ : /ਰੁਕਿਆ ਸਮਾਂ/);
      }
      if (entry.solveMode === "findCompletionWithNegativeWorkerActivatedLater") {
        assert.match(first.explanation.opening, language === "hi" ? /घटाकर शुद्ध दर/ : /ਘਟਾ ਕੇ ਸ਼ੁੱਧ ਦਰ/);
      }
      if (entry.solveMode === "findCompletionWithChangedDailyHours") {
        assert.match(first.stem, language === "hi" ? /प्रति घंटे की उत्पादकता/ : /ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਕਤਾ/);
      }
      if (entry.solveMode === "findWorkerCountAddedAfterPartialProgress" || entry.solveMode === "findWorkerCountRemovedAfterPartialProgress") {
        assert.match(first.stem, language === "hi" ? /कर्मचारी/ : /ਕਰਮਚਾਰੀ/);
      }

      counts[language] += 1;
      stems[language].add(first.stem);
    }
  }
}

assert.equal(counts.hi, 480);
assert.equal(counts.pa, 480);
assert.ok(stems.hi.size > 180, `Hindi stem diversity is ${stems.hi.size}`);
assert.ok(stems.pa.size > 180, `Punjabi stem diversity is ${stems.pa.size}`);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-004",
  qls: TMW_CP004_REGISTRY.length,
  seedsPerQl: 20,
  hindiCandidates: counts.hi,
  punjabiCandidates: counts.pa,
  hindiDistinctStems: stems.hi.size,
  punjabiDistinctStems: stems.pa.size,
  status: "PASS",
}, null, 2));
