import { strict as assert } from "node:assert";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;

for (const entry of TMW_CP006_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp006-editorial-review:${entry.qlId}:${index}`;
    for (const language of languages) {
      const row = `${entry.qlId}:${language}:${index}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: entry.qlId, seed, language });
      const prose = [
        question.stem,
        question.explanation.opening,
        ...(question.explanation.givens ?? []),
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.editorialStatus, "PENDING", `${row}: editorial lifecycle changed`);
      assert.equal(question.publiclyPublishable, false, `${row}: publication lock changed`);
      assert.equal(question.options.length, 4, `${row}: option count`);
      assert.equal(new Set(question.options).size, 4, `${row}: duplicate options`);
      assert.equal(question.options[question.correctIndex], question.solution.answerText, `${row}: answer/index mismatch`);
      assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${row}: trap option mismatch`);
      assert.equal(question.explanation.conclusion.includes(question.solution.answerText), true, `${row}: answer missing from conclusion`);
      assert.equal(/स्वतंत्र गुणक|अपरिवर्तनीय नियम|उत्पादक क्षमता संबंध|ਸੁਤੰਤਰ ਗੁਣਕ|ਅਪਰਿਵਰਤਨਸ਼ੀਲ ਨਿਯਮ|ਉਤਪਾਦਕ ਸਮਰੱਥਾ ਸੰਬੰਧ/.test(prose), false, `${row}: textbook rule wording`);
      assert.equal(/कुल उत्पादक क्षमता|ਬਦਲੀ ਵਿਵਸਥਾ|ਮੂਲ ਵਿਵਸਥਾ|बदली व्यवस्था|मूल व्यवस्था/.test(prose), false, `${row}: formal system wording`);
      assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${row}: uninflected time`);

      switch (entry.solveMode) {
        case "findRequiredResourceCount":
          assert.match(question.explanation.opening, language === "hi" ? /काम की मात्रा समान.*आवश्यक संख्या/ : /ਕੰਮ ਦੀ ਮਾਤਰਾ ਇੱਕੋ.*ਲੋੜੀਂਦੀ ਗਿਣਤੀ/, row);
          break;
        case "findRequiredDays":
          assert.match(question.explanation.opening, language === "hi" ? /एक दिन का काम.*आवश्यक दिन/ : /ਇੱਕ ਦਿਨ ਦਾ ਕੰਮ.*ਲੋੜੀਂਦੇ ਦਿਨ/, row);
          break;
        case "findRequiredDailyHours":
          assert.match(question.explanation.opening, language === "hi" ? /नई संख्या, दिन और दक्षता.*आवश्यक घंटे/ : /ਨਵੀਂ ਗਿਣਤੀ, ਦਿਨ ਅਤੇ ਦੱਖਤਾ.*ਲੋੜੀਂਦੇ ਘੰਟੇ/, row);
          break;
        case "findRelativeEfficiency":
          assert.match(question.explanation.opening, language === "hi" ? /दोनों स्थितियों में बराबर.*दक्षता/ : /ਦੋਵਾਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਬਰਾਬਰ.*ਦੱਖਤਾ/, row);
          break;
        case "findWorkQuantity":
          assert.match(question.explanation.opening, language === "hi" ? /प्रति इकाई प्रति पाली.*कुल उत्पादन/ : /ਪ੍ਰਤੀ ਇਕਾਈ ਪ੍ਰਤੀ ਸ਼ਿਫ਼ਟ.*ਕੁੱਲ ਉਤਪਾਦਨ/, row);
          break;
        case "findWorkQuantityRatio":
        case "findDimensionalWorkRatio":
          assert.match(question.explanation.conclusion, language === "hi" ? /काम का अनुपात/ : /ਕੰਮ ਦਾ ਅਨੁਪਾਤ/, row);
          break;
        case "findAdditionalWorkersForDeadline":
        case "findExtraWorkersFromPlannedVsActualProgress":
          assert.match(question.explanation.opening, language === "hi" ? /आवश्यक कुल संख्या.*मौजूदा संख्या घटाएँ/ : /ਲੋੜੀਂਦੀ ਕੁੱਲ ਗਿਣਤੀ.*ਮੌਜੂਦਾ ਗਿਣਤੀ ਘਟਾਓ/, row);
          assert.match(question.explanation.conclusion, language === "hi" ? /अतिरिक्त चाहिए/ : /ਵਾਧੂ ਚਾਹੀਦੇ/, row);
          break;
        case "findWorkersRemovedForDelay":
          assert.match(question.explanation.opening, language === "hi" ? /मूल संख्या.*बची संख्या का अंतर/ : /ਮੂਲ ਗਿਣਤੀ.*ਬਚੀ ਗਿਣਤੀ ਦਾ ਅੰਤਰ/, row);
          assert.match(question.explanation.conclusion, language === "hi" ? /हटाए जा सकते/ : /ਹਟਾਏ ਜਾ ਸਕਦੇ/, row);
          break;
        case "findOriginalWorkforceFromChangedSchedule":
          assert.match(question.explanation.opening, language === "hi" ? /मूल संख्या को अज्ञात.*कुल काम बराबर/ : /ਮੂਲ ਗਿਣਤੀ ਨੂੰ ਅਣਜਾਣ.*ਕੁੱਲ ਕੰਮ ਬਰਾਬਰ/, row);
          break;
        case "findRemainingDaysFromActualProgress":
          assert.match(
            question.explanation.opening,
            language === "hi"
              ? /शेष काम.*(?:1 − पूरा हुआ भाग|1 में से पूरा हुआ भाग घटाएँ)/
              : /ਬਾਕੀ ਕੰਮ.*(?:1 − ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ|1 ਵਿੱਚੋਂ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਘਟਾਓ)/,
            row,
          );
          break;
        case "findPercentWorkCompletedFromResourceHours":
          assert.match(question.explanation.opening, language === "hi" ? /संसाधन-घंटों.*100/ : /ਸਰੋਤ-ਘੰਟਿਆਂ.*100/, row);
          break;
        case "findPercentScheduleDelay":
          assert.match(question.explanation.opening, language === "hi" ? /देरी = नया समय − मूल समय/ : /ਦੇਰੀ = ਨਵਾਂ ਸਮਾਂ − ਮੂਲ ਸਮਾਂ/, row);
          break;
        case "findOvertimeHoursForDeadline":
          assert.match(
            question.explanation.opening,
            language === "hi"
              ? /कुल आवश्यक घंटे.*सामान्य घंटों का अंतर/
              : /(?:ਕੁੱਲ ਲੋੜੀਂਦੇ ਘੰਟੇ|ਲੋੜੀਂਦੇ ਕੁੱਲ ਘੰਟਿਆਂ).*ਆਮ ਘੰਟਿਆਂ ਦਾ ਅੰਤਰ/,
            row,
          );
          break;
        case "findShiftCountForProductionTarget":
          assert.match(question.explanation.opening, language === "hi" ? /एक पाली.*लक्ष्य उत्पादन/ : /ਇੱਕ ਸ਼ਿਫ਼ਟ.*ਟੀਚਾ ਉਤਪਾਦਨ/, row);
          break;
        case "findWorkersForChangedDimensions":
        case "findDaysForChangedDimensions":
          assert.match(question.explanation.opening, language === "hi" ? /नए.*काम.*आयाम|आयामों.*नए काम/ : /ਨਵੇਂ.*ਕੰਮ.*ਮਾਪ|ਮਾਪਾਂ.*ਨਵੇਂ ਕੰਮ/, row);
          break;
        case "findResourceDurationAfterPopulationChange":
          assert.match(question.explanation.opening, language === "hi" ? /व्यक्ति-दिन.*बचा भंडार/ : /ਵਿਅਕਤੀ-ਦਿਨਾਂ.*ਬਚਿਆ ਭੰਡਾਰ/, row);
          break;
        case "findCompletionTimeAfterAbsenteeism":
          assert.match(question.explanation.opening, language === "hi" ? /वास्तव में उपस्थित.*व्यक्ति-दिन/ : /ਅਸਲ ਵਿੱਚ ਹਾਜ਼ਰ.*ਵਿਅਕਤੀ-ਦਿਨਾਂ/, row);
          break;
        case "findCompletionWithBatchWorkerAdditions":
          assert.match(question.explanation.opening, language === "hi" ? /हर दिन.*संख्या.*योग/ : /ਹਰ ਦਿਨ.*ਗਿਣਤੀ.*ਜੋੜ/, row);
          break;
        case "findEquivalentResourceTime":
          assert.match(question.explanation.opening, language === "hi" ? /सभी वास्तविक गुणकों.*संसाधन-समय/ : /ਸਾਰੇ ਅਸਲ ਗੁਣਕਾਂ.*ਸਰੋਤ-ਸਮਾਂ/, row);
          break;
      }

      switch (question.explanation.commonTrap.misconceptionId) {
        case "BASELINE_STATE_REUSED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /पुरानी स्थिति.*दोबारा/ : /ਪੁਰਾਣੀ ਸਥਿਤੀ.*ਮੁੜ/, row);
          break;
        case "DIRECT_INVERSE_PROPORTION_CONFUSED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /सीधे और उलटे संबंध/ : /ਸਿੱਧੇ ਅਤੇ ਉਲਟੇ ਸੰਬੰਧ/, row);
          break;
        case "WORK_RATIO_OMITTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /काम का अनुपात.*नहीं/ : /ਕੰਮ ਦਾ ਅਨੁਪਾਤ.*ਨਹੀਂ/, row);
          break;
        case "HOURS_FACTOR_OMITTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /घंटों का बदलाव/ : /ਘੰਟਿਆਂ ਦਾ ਬਦਲਾਅ/, row);
          break;
        case "EFFICIENCY_FACTOR_OMITTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /दक्षता का बदलाव/ : /ਦੱਖਤਾ ਦਾ ਬਦਲਾਅ/, row);
          break;
        case "TOTAL_REPORTED_AS_CHANGE":
          if (entry.solveMode === "findOvertimeHoursForDeadline") {
            assert.match(
              question.explanation.commonTrap.explanation,
              language === "hi"
                ? /अतिरिक्त घंटों.*प्रतिदिन आवश्यक कुल घंटे/
                : /ਵਾਧੂ ਘੰਟਿਆਂ.*ਹਰ ਦਿਨ ਦੇ ਕੁੱਲ ਲੋੜੀਂਦੇ ਘੰਟੇ/,
              row,
            );
          } else {
            assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अंतर के बजाय.*कुल संख्या/ : /ਅੰਤਰ ਦੀ ਥਾਂ.*ਕੁੱਲ ਗਿਣਤੀ/, row);
          }
          break;
        case "CHANGE_REPORTED_AS_TOTAL":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /कुल संख्या के बजाय/ : /ਕੁੱਲ ਗਿਣਤੀ ਦੀ ਥਾਂ/, row);
          break;
        case "ELAPSED_PERIOD_IGNORED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /बीते समय/ : /ਬੀਤੇ ਸਮੇਂ/, row);
          break;
        case "COMPLETED_USED_AS_REMAINING":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /1 − पूरा हुआ भाग/ : /1 − ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ/, row);
          break;
        case "PERCENT_NOT_CONVERTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /100 से भाग/ : /100 ਨਾਲ ਭਾਗ/, row);
          break;
        case "DIMENSION_FACTOR_OMITTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /बदलता आयाम छोड़/ : /ਬਦਲਦਾ ਮਾਪ ਛੱਡ/, row);
          break;
        case "ABSENTEES_TREATED_AS_PRESENT":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अनुपस्थित लोगों/ : /ਗੈਰਹਾਜ਼ਰ ਲੋਕਾਂ/, row);
          break;
        case "ARITHMETIC_SERIES_IGNORED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /हर दिन बदलती संख्या/ : /ਹਰ ਦਿਨ ਬਦਲਦੀ ਗਿਣਤੀ/, row);
          break;
        case "PLAUSIBLE_SCALE_ERROR":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /गुणक.*गलत दिशा/ : /ਗੁਣਕ.*ਗਲਤ ਦਿਸ਼ਾ/, row);
          break;
      }

      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(reviewedPackages, 528);
assert.equal(hindiPackages, 264);
assert.equal(punjabiPackages, 264);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-006",
  qlRange: "TMW-QL-106..TMW-QL-127",
  qls: 22,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  remediatedQls: 22,
  remediatedPackages: reviewedPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
