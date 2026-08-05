import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;

for (const entry of TMW_CP005_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp005-editorial-review:${entry.qlId}:${index}`;
    for (const language of languages) {
      const row = `${entry.qlId}:${language}:${index}`;
      const question = runTmw001ChapterPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const prose = [
        question.stem,
        question.explanation.opening,
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
      assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${row}: trap is not linked to an option`);
      assert.equal(/दिया गया कार्य:|दिया गया काम:|ਦਿੱਤਾ ਗਿਆ ਕੰਮ:/.test(question.stem), false, `${row}: mechanical task header\n${question.stem}`);
      assert.equal(/काम की जिम्मेदारी|ਕੰਮ ਦੀ ਜ਼ਿੰਮੇਵਾਰੀ/.test(question.stem), false, `${row}: bureaucratic responsibility wording\n${question.stem}`);
      assert.equal(/अंतिम सक्रिय बारी|अगली सक्रिय दर|चक्र की अवस्था|अज्ञात सक्रिय समय|शुद्ध चक्र-काम|ਆਖ਼ਰੀ ਸਰਗਰਮ ਵਾਰੀ|ਅਗਲੀ ਸਰਗਰਮ ਦਰ|ਚੱਕਰ ਦੀ ਸਥਿਤੀ|ਅਣਜਾਣ ਸਰਗਰਮ ਸਮੇਂ|ਸ਼ੁੱਧ ਚੱਕਰ-ਕੰਮ/.test(prose), false, `${row}: technical cycle wording\n${prose}`);
      assert.equal(/अंतिम आवश्यक चक्र या अधूरी बारी|ਆਖ਼ਰੀ ਲੋੜੀਂਦੇ ਚੱਕਰ ਜਾਂ ਅਧੂਰੀ ਵਾਰੀ/.test(question.explanation.commonTrap.explanation), false, `${row}: generic trap remained`);
      assert.equal(/हानिकारक प्रक्रिया|नुकसान वाली प्रक्रिया|ਨੁਕਸਾਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ/.test(question.stem), false, `${row}: technical negative-work label`);
      assert.equal(/\d+ दिन में|\d+ ਦਿਨ ਵਿੱਚ|\d+ घंटा में|\d+ ਘੰਟਾ ਵਿੱਚ/.test(prose), false, `${row}: uninflected time`);

      switch (entry.solveMode) {
        case "findCompletionTimeForTwoAgentAlternationStartingA":
        case "findCompletionTimeForTwoAgentAlternationStartingB":
          assert.match(question.explanation.opening, language === "hi" ? /दो.*बारियों|दो-दिन/ : /ਦੋ.*ਵਾਰੀਆਂ|ਦੋ-ਦਿਨਾਂ/, row);
          break;
        case "findCompletionTimeForMultiDayCycle":
          assert.match(question.explanation.opening, language === "hi" ? /दिए गए पूरे क्रम|अगली अवधि/ : /ਦਿੱਤੇ ਪੂਰੇ ਕ੍ਰਮ|ਅਗਲੀ ਮਿਆਦ/, row);
          break;
        case "findCompletionTimeForThreeAgentCycle":
          assert.match(question.explanation.opening, language === "hi" ? /तीन बारियों|तीन-दिन/ : /ਤਿੰਨ ਵਾਰੀਆਂ|ਤਿੰਨ-ਦਿਨਾਂ/, row);
          break;
        case "findCompletionDayAndTerminalFraction":
          assert.match(question.explanation.opening, language === "hi" ? /अंतिम दिन का आवश्यक भाग/ : /ਆਖ਼ਰੀ ਦਿਨ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ/, row);
          break;
        case "findTerminalAgent":
          assert.match(question.explanation.conclusion, language === "hi" ? /की बारी में पूरा होगा/ : /ਦੀ ਵਾਰੀ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ/, row);
          break;
        case "findStartingAgentFromCompletionCondition":
          assert.match(question.explanation.opening, language === "hi" ? /दोनों क्रम अलग.*अंतिम बारी/ : /ਦੋਵੇਂ ਕ੍ਰਮ ਵੱਖ.*ਆਖ਼ਰੀ ਵਾਰੀ/, row);
          assert.match(question.explanation.conclusion, language === "hi" ? /कुल समय और अंतिम बारी/ : /ਕੁੱਲ ਸਮਾਂ ਅਤੇ ਆਖ਼ਰੀ ਵਾਰੀ/, row);
          break;
        case "findUnknownRateFromAlternatingCompletion":
          assert.match(question.explanation.opening, language === "hi" ? /कितने-कितने दिन.*कुल दिनों से भाग/ : /ਕਿੰਨੇ-ਕਿੰਨੇ ਦਿਨ.*ਕੁੱਲ ਦਿਨਾਂ ਨਾਲ ਭਾਗ/, row);
          break;
        case "findUnknownTimeFromAlternatingCompletion":
          assert.match(question.explanation.opening, language === "hi" ? /दर का उलटा/ : /ਦਰ ਦਾ ਉਲਟ/, row);
          assert.match(question.explanation.conclusion, language === "hi" ? /अकेले काम करने का कुल समय.*होगा/ : /ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਦਾ ਕੁੱਲ ਸਮਾਂ.*ਹੋਵੇਗਾ/, row);
          break;
        case "findCompletionWhenHelperWorksEveryNthDay":
          assert.match(question.explanation.opening, language === "hi" ? /सहायता वाले दिन.*अतिरिक्त काम/ : /ਮਦਦ ਵਾਲੇ ਦਿਨ.*ਵਾਧੂ ਕੰਮ/, row);
          break;
        case "findCompletionWhenAgentRestsEveryNthDay":
          assert.match(question.explanation.opening, language === "hi" ? /विश्राम वाले दिन केवल समय/ : /ਆਰਾਮ ਵਾਲੇ ਦਿਨ ਸਿਰਫ਼ ਸਮਾਂ/, row);
          break;
        case "findCompletionWithWeekendOrHolidayPattern":
          assert.match(question.explanation.opening, language === "hi" ? /पाँच काम वाले दिन.*दो बिना काम/ : /ਪੰਜ ਕੰਮ ਵਾਲੇ ਦਿਨ.*ਦੋ ਬਿਨਾਂ ਕੰਮ/, row);
          break;
        case "findCompletionWithUnequalShiftDurations":
          assert.match(question.explanation.opening, language === "hi" ? /पाली के घंटों.*अधूरी पाली/ : /ਸ਼ਿਫ਼ਟ ਦੇ ਘੰਟਿਆਂ.*ਅਧੂਰੀ ਸ਼ਿਫ਼ਟ/, row);
          break;
        case "findCompletionWithTwoDaysOnOneDayOffPattern":
          assert.match(question.explanation.opening, language === "hi" ? /तीन बीते दिनों.*पहले दो दिन काम/ : /ਤਿੰਨ ਬੀਤੇ ਦਿਨਾਂ.*ਪਹਿਲੇ ਦੋ ਦਿਨ ਕੰਮ/, row);
          break;
        case "findCompletionWithPeriodicNegativeWork":
          assert.match(question.explanation.opening, language === "hi" ? /बिगाड़ वाले दिन.*घटाएँ.*वास्तविक काम/ : /ਖਰਾਬੀ ਵਾਲੇ ਦਿਨ.*ਘਟਾਓ.*ਅਸਲ ਕੰਮ/, row);
          break;
        case "findCompletionWithRepeatedJoinLeaveCycle":
          assert.match(question.explanation.opening, language === "hi" ? /अकेली बारी.*संयुक्त बारी/ : /ਇਕੱਲੀ ਵਾਰੀ.*ਸਾਂਝੀ ਵਾਰੀ/, row);
          break;
        case "findCycleCountToReachSpecifiedFraction":
          assert.match(question.explanation.opening, language === "hi" ? /लक्षित काम के भाग.*भाग दें/ : /ਟੀਚੇ ਵਾਲੇ ਕੰਮ ਦੇ ਹਿੱਸੇ.*ਭਾਗ ਦਿਓ/, row);
          break;
        case "findTimeFromArbitraryCyclePhase":
          assert.match(question.explanation.opening, language === "hi" ? /प्रश्न में दी गई बारी/ : /ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਵਾਰੀ/, row);
          break;
        case "findExactBoundaryCompletion":
          assert.match(question.explanation.opening, language === "hi" ? /कोई अतिरिक्त अधूरी बारी नहीं/ : /ਕੋਈ ਵਾਧੂ ਅਧੂਰੀ ਵਾਰੀ ਨਹੀਂ/, row);
          break;
        case "findCompletionWithinCycleSegment":
          assert.match(question.explanation.opening, language === "hi" ? /खंड एक-एक करके.*केवल आवश्यक समय/ : /ਖੰਡ ਇੱਕ-ਇੱਕ ਕਰਕੇ.*ਸਿਰਫ਼ ਲੋੜੀਂਦਾ ਸਮਾਂ/, row);
          break;
        case "findOutputUnderPeriodicMachineSchedule":
          assert.match(question.explanation.opening, language === "hi" ? /प्रति घंटा उत्पादन.*चलने के घंटे/ : /ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਨ.*ਚੱਲਣ ਦੇ ਘੰਟੇ/, row);
          break;
        case "findRequiredCycleRateForDeadline":
          assert.match(question.explanation.opening, language === "hi" ? /समय-सीमा.*कुल बारियाँ/ : /ਸਮਾਂ-ਸੀਮਾ.*ਕੁੱਲ ਵਾਰੀਆਂ/, row);
          assert.match(question.explanation.conclusion, language === "hi" ? /जब भी .* की बारी/ : /ਜਦੋਂ ਵੀ .* ਦੀ ਵਾਰੀ/, row);
          break;
      }

      switch (question.explanation.commonTrap.misconceptionId) {
        case "WRONG_STARTING_AGENT":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /पहली बारी उलट/ : /ਪਹਿਲੀ ਵਾਰੀ ਉਲਟ/, row);
          break;
        case "REST_DAY_TREATED_AS_WORK":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /समय बीतता है, काम शून्य/ : /ਸਮਾਂ ਬੀਤਦਾ ਹੈ, ਕੰਮ ਸਿਫ਼ਰ/, row);
          break;
        case "NEGATIVE_RATE_ADDED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /घटाने के बजाय जोड़/ : /ਘਟਾਉਣ ਦੀ ਥਾਂ ਜੋੜ/, row);
          break;
        case "RECIPROCAL_NOT_TAKEN":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /उलटा नहीं लेता/ : /ਉਲਟ ਨਹੀਂ ਲੈਂਦੀ/, row);
          break;
        case "SHIFT_DURATION_IGNORED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /वास्तविक घंटों/ : /ਅਸਲ ਘੰਟਿਆਂ/, row);
          break;
        case "DEADLINE_TREATED_AS_CYCLE_COUNT":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /दिनों को चक्रों की संख्या/ : /ਦਿਨਾਂ ਨੂੰ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ/, row);
          break;
      }

      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(TMW_CP005_REGISTRY.length, 24);
assert.equal(reviewedPackages, 576);
assert.equal(hindiPackages, 288);
assert.equal(punjabiPackages, 288);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-005",
  qlRange: "TMW-QL-082..TMW-QL-105",
  qls: TMW_CP005_REGISTRY.length,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  remediatedQls: TMW_CP005_REGISTRY.length,
  remediatedPackages: reviewedPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
