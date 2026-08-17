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
      const row = `${entry.qlId}:${language}:${index}`;

      assert.deepEqual(first, second, `${row}: nondeterministic localized package`);
      assert.equal(first.validation.valid, true, `${row}:${first.validation.errors.join(" | ")}`);
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
      assert.equal(/undefined|null|NaN|Infinity|find[A-Z]|TMW_|Do not|Don't/i.test(learnerText), false, `${row}: internal wording`);
      assert.equal(/\b(?:operator|technician|clerk|machine|crew|team|inspector|typist|painter|recorder|surveyor|assembler)\b/i.test(learnerText), false, `${row}: actor leakage`);
      assert.equal(/\b(?:customer-record|equipment overhaul|loan-application|printing order|road-marking|packaging order|quality-inspection|manuscript-typing|school-building|warehouse inventory|field survey|electronics-assembly)\b/i.test(learnerText), false, `${row}: context leakage`);
      assert.equal(/\b(?:\d+\s+)?\d+\/\d+\s+(?:दिन|ਦਿਨ|घंट|ਘੰਟ)/.test(learnerText), false, `${row}: raw fractional time`);
      assert.equal(/(?:काम|बैच|सेट|ऑर्डर|मरम्मत|सर्वेक्षण) को (?:अकेले|\d+)|(?:ਕੰਮ|ਬੈਚ|ਸੈੱਟ|ਆਰਡਰ|ਮੁਰੰਮਤ|ਸਰਵੇਖਣ) ਨੂੰ (?:ਇਕੱਲੇ|\d+)/.test(first.stem), false, `${row}: duplicated task case`);
      assert.equal(/(?:मशीन|टीम|दल) [ABC].*(?:अकेले शुरू करता|चला जाता|काम करता है|रुक गया)|(?:ਮਸ਼ੀਨ|ਟੀਮ) [ABC].*(?:ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ|ਚਲਾ ਜਾਂਦਾ|ਕੰਮ ਕਰਦਾ ਹੈ|ਰੁਕ ਗਿਆ)/.test(first.stem), false, `${row}: context-unsafe gender`);
      assert.equal(/दिए गए बदलाव को केवल संबंधित चरण|ਦਿੱਤੇ ਬਦਲਾਅ ਨੂੰ ਸਿਰਫ਼ ਸੰਬੰਧਿਤ ਪੜਾਅ/.test(first.explanation.shortcut.steps.join(" ")), false, `${row}: generic shortcut`);
      assert.equal(/भागीदारी (?:शुरू|समाप्त)|ਭਾਗੀਦਾਰੀ (?:ਸ਼ੁਰੂ|ਖਤਮ)/.test(learnerText), false, `${row}: bureaucratic participation wording`);
      assert.equal(language === "hi" ? /[\u0900-\u097F]/.test(learnerText) : /[\u0A00-\u0A7F]/.test(learnerText), true);

      if (first.solution.answerType === "FRACTION") {
        assert.equal(first.options.every((option) => option.includes(language === "hi" ? "काम का" : "ਕੰਮ ਦਾ")), true);
      }
      if (first.solution.answerType === "RATE") {
        assert.equal(first.options.every((option) => option.includes(language === "hi" ? "पूरे काम का" : "ਪੂਰੇ ਕੰਮ ਦਾ")), true);
        assert.equal(first.options.every((option) => option.includes(language === "hi" ? "भाग" : "ਹਿੱਸਾ")), true);
        assert.equal(first.options.every((option) => option.includes(language === "hi" ? "प्रति" : "ਪ੍ਰਤੀ")), true);
      }
      if (first.solution.answerType === "COUNT") {
        assert.equal(first.options.every((option) => option.endsWith(language === "hi" ? "कर्मचारी" : "ਕਰਮਚਾਰੀ")), true);
      }
      if (joinModes.has(entry.solveMode)) {
        assert.match(
          first.stem,
          language === "hi" ? /जुड़|काम में लगा|काम में लगाया/ : /ਜੁੜ|ਕੰਮ ਵਿੱਚ ਲਾ|ਕੰਮ ਵਿੱਚ ਲਾਇਆ/,
          `${row}: join event is not explicit`,
        );
      }
      if (leaveModes.has(entry.solveMode)) {
        assert.match(
          first.stem,
          language === "hi" ? /काम से हटा|चले जाते|गए/ : /ਕੰਮ ਤੋਂ ਹਟਾ|ਚਲੇ ਜਾਂਦੇ|ਗਏ/,
          `${row}: leave event is not explicit`,
        );
      }
      if (entry.solveMode === "findCompletionWithIdleInterval") {
        assert.match(first.stem, language === "hi" ? /रुका/ : /ਰੁਕਿਆ/);
        assert.match(first.explanation.shortcut.steps.join(" "), language === "hi" ? /रुका हुआ समय अलग जोड़ें/ : /ਰੁਕਿਆ ਹੋਇਆ ਸਮਾਂ ਵੱਖ ਜੋੜੋ/);
      }
      if (entry.solveMode === "findCompletionWithNegativeWorkerActivatedLater") {
        assert.match(first.explanation.opening, language === "hi" ? /बिगाड़ की दर.*शुद्ध दर/ : /ਖਰਾਬੀ ਦੀ ਦਰ.*ਸ਼ੁੱਧ ਦਰ/);
        assert.match(first.explanation.shortcut.title, language === "hi" ? /काम की दर − बिगाड़ की दर/ : /ਕੰਮ ਦੀ ਦਰ − ਖਰਾਬੀ ਦੀ ਦਰ/);
      }
      if (entry.solveMode === "findCompletionWithChangedDailyHours") {
        assert.match(first.stem, language === "hi" ? /यदि .* प्रतिदिन|प्रति घंटे की उत्पादकता/ : /ਜੇ .* ਹਰ ਰੋਜ਼|ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਕਤਾ/);
      }
      if (entry.solveMode === "findRemainingWorkAfterInitialPhase") {
        assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /पूरा हुआ भाग.*बचा हुआ/ : /ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ.*ਬਾਕੀ ਹਿੱਸਾ/);
      }
      if (entry.solveMode === "findUnknownFinalPhaseDuration") {
        assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /शुरुआती चरण की अवधि.*अंतिम चरण/ : /ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਦੀ ਮਿਆਦ.*ਆਖ਼ਰੀ ਪੜਾਅ/);
      }
      if (entry.solveMode === "findEventTimeAtSpecifiedCompletionFraction") {
        assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /पूरे काम.*लक्षित भाग/ : /ਸਾਰੇ ਕੰਮ.*ਟੀਚੇ ਵਾਲੇ ਹਿੱਸੇ/);
      }
      if (entry.solveMode === "findWorkerCountRemovedAfterPartialProgress") {
        assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /शुरुआती कुल.*अंतिम संख्या का अंतर/ : /ਸ਼ੁਰੂਆਤੀ ਕੁੱਲ.*ਆਖ਼ਰੀ ਗਿਣਤੀ ਦਾ ਅੰਤਰ/);
      }
      if (entry.solveMode === "findDelayAfterWorkerLeaves") {
        assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /जाने का समय.*कुल समय का अंतर/ : /ਜਾਣ ਦਾ ਸਮਾਂ.*ਕੁੱਲ ਸਮੇਂ ਦਾ ਅੰਤਰ/);
      }
      if (entry.solveMode === "findEarlyCompletionAfterWorkerJoins") {
        assert.match(first.explanation.commonTrap.explanation, language === "hi" ? /जुड़ने का समय.*कुल समय की बचत/ : /ਜੁੜਨ ਦਾ ਸਮਾਂ.*ਕੁੱਲ ਸਮੇਂ ਦੀ ਬਚਤ/);
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
