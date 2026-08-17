import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007LocalizedPipeline } from "./foundation/cp007-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
let reviewedPackages = 0;
let hindiPackages = 0;
let punjabiPackages = 0;

for (const entry of TMW_CP007_REGISTRY) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `tmw-cp007-editorial-review:${entry.qlId}:${index}`;
    for (const language of languages) {
      const row = `${entry.qlId}:${language}:${index}`;
      const question = runTmwCp007LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
      const explanationProse = [
        question.explanation.opening,
        ...question.explanation.givens,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");
      const learnerProse = [question.stem, ...question.options, explanationProse].join("\n");

      assert.equal(question.validation.valid, true, `${row}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.editorialStatus, "PENDING", `${row}: editorial lifecycle changed`);
      assert.equal(question.publiclyPublishable, false, `${row}: publication lock changed`);
      assert.equal(question.options.length, 4, `${row}: option count`);
      assert.equal(new Set(question.options).size, 4, `${row}: duplicate options`);
      assert.equal(question.options[question.correctIndex], question.solution.answerText, `${row}: answer/index mismatch`);
      assert.equal(question.options.includes(question.explanation.commonTrap.optionText), true, `${row}: trap option mismatch`);
      assert.equal(question.explanation.conclusion.includes(question.solution.answerText), true, `${row}: answer absent from conclusion`);
      assert.equal(/find[A-Z]|TMW_|_[A-Z_]{3,}|Independent heterogeneous/i.test(learnerProse), false, `${row}: internal wording`);
      assert.equal(/प्रति-संसाधन|सक्रिय श्रेणी|केवल सिरों की संख्या|अभिलेख|भारित दर|ਪ੍ਰਤੀ-ਸਰੋਤ|ਸਰਗਰਮ ਸ਼੍ਰੇਣੀ|ਅਭਿਲੇਖ|ਭਾਰਿਤ ਦਰ/.test(learnerProse), false, `${row}: technical editorial wording`);
      assert.equal(/दो अनुपात जोड़ें|ਦੋ ਅਨੁਪਾਤ ਜੋੜੋ/.test(learnerProse), false, `${row}: ratios described as addition`);

      switch (entry.solveMode) {
        case "findTwoCategoryEfficiencyRatio":
          assert.match(question.explanation.opening, language === "hi" ? /कुल काम-दर.*उलटा/ : /ਕੁੱਲ ਕੰਮ-ਦਰ.*ਉਲਟ/, row);
          break;
        case "findThreeCategoryEfficiencyRatio":
          assert.match(question.explanation.opening, language === "hi" ? /सामान्य श्रेणी.*संयुक्त अनुपात/ : /ਸਾਂਝੀ ਸ਼੍ਰੇਣੀ.*ਸਾਂਝਾ ਅਨੁਪਾਤ/, row);
          break;
        case "findMixedCrewCompletionTime":
          assert.match(question.explanation.opening, language === "hi" ? /सभी योगदान.*कुल काम/ : /ਸਾਰੇ ਯੋਗਦਾਨ.*ਕੁੱਲ ਕੰਮ/, row);
          break;
        case "findEquivalentCategoryCount":
          assert.match(question.explanation.opening, language === "hi" ? /कुल काम-दर.*एक सदस्य/ : /ਕੁੱਲ ਕੰਮ-ਦਰ.*ਇੱਕ ਮੈਂਬਰ/, row);
          break;
        case "findUnknownCategoryCountForTargetTime":
          assert.match(question.explanation.opening, language === "hi" ? /आवश्यक कुल दर.*ज्ञात समूह की दर घटाएँ/ : /ਲੋੜੀਂਦੀ ਕੁੱਲ ਦਰ.*ਜਾਣੇ ਸਮੂਹ ਦੀ ਦਰ ਘਟਾਓ/, row);
          assert.match(question.explanation.conclusion, language === "hi" ? /अतिरिक्त चाहिए/ : /ਵਾਧੂ ਚਾਹੀਦੇ/, row);
          break;
        case "findCrewCompositionFromTwoOutputFacts":
          assert.match(question.explanation.opening, language === "hi" ? /दोनों श्रेणियों.*दोनों समीकरण/ : /ਦੋਵਾਂ ਸ਼੍ਰੇਣੀਆਂ.*ਦੋਵੇਂ ਸਮੀਕਰਨ/, row);
          break;
        case "findCategoryRateFromWeightedCrewFacts":
          assert.match(question.explanation.opening, language === "hi" ? /हर दी गई स्थिति.*तीनों समीकरण/ : /ਹਰ ਦਿੱਤੀ ਸਥਿਤੀ.*ਤਿੰਨੇ ਸਮੀਕਰਨ/, row);
          break;
        case "findHeterogeneousGroupRate":
          assert.match(question.explanation.opening, language === "hi" ? /संख्या × एक सदस्य.*पूरे समूह/ : /ਗਿਣਤੀ × ਇੱਕ ਮੈਂਬਰ.*ਪੂਰੇ ਸਮੂਹ/, row);
          break;
        case "findCompletionAfterCategoryReplacement":
          assert.match(question.explanation.opening, language === "hi" ? /पुराने और बदले समूह.*पुरानी दर ÷ नई दर/ : /ਪੁਰਾਣੇ ਅਤੇ ਬਦਲੇ ਸਮੂਹ.*ਪੁਰਾਣੀ ਦਰ ÷ ਨਵੀਂ ਦਰ/, row);
          break;
        case "findMixedCrewOutput":
          assert.match(question.explanation.opening, language === "hi" ? /कुल दर.*समय से गुणा/ : /ਕੁੱਲ ਦਰ.*ਸਮੇਂ ਨਾਲ ਗੁਣਾ/, row);
          break;
        case "findEquivalentStandardResourceTime":
          assert.match(question.explanation.opening, language === "hi" ? /सदस्य-दिन.*समतुल्य संसाधन-समय/ : /ਮੈਂਬਰ-ਦਿਨਾਂ.*ਬਰਾਬਰ ਸਰੋਤ-ਸਮੇਂ/, row);
          break;
        case "findMinimumIntegerCrewComposition":
          assert.match(question.explanation.opening, language === "hi" ? /धनात्मक पूर्णांक.*सबसे कम कुल/ : /ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ.*ਸਭ ਤੋਂ ਘੱਟ ਕੁੱਲ/, row);
          break;
        case "findUnknownCategorySoloTime": {
          const givens = question.explanation.givens.join(" ");
          assert.match(question.explanation.opening, language === "hi" ? /ज्ञात सदस्य.*अज्ञात श्रेणी.*उलटा/ : /ਜਾਣੇ ਮੈਂਬਰ.*ਅਣਜਾਣ ਸ਼੍ਰੇਣੀ.*ਉਲਟ/, row);
          assert.equal(/e_B\s*=/.test(givens), false, `${row}: unknown rate leaked as a given`);
          assert.equal(givens.includes(question.solution.answerText), false, `${row}: answer leaked in givens`);
          assert.match(question.explanation.conclusion, language === "hi" ? /अकेले काम/ : /ਇਕੱਲਾ ਕੰਮ/, row);
          break;
        }
        case "findCategoryContributionFraction":
          assert.match(question.explanation.opening, language === "hi" ? /पूछी गई श्रेणी.*कुल योगदान/ : /ਪੁੱਛੀ ਗਈ ਸ਼੍ਰੇਣੀ.*ਕੁੱਲ ਯੋਗਦਾਨ/, row);
          break;
        case "compareTwoHeterogeneousCrews":
          assert.match(question.explanation.opening, language === "hi" ? /समूह A.*समूह B.*उसी क्रम/ : /ਸਮੂਹ A.*ਸਮੂਹ B.*ਉਸੇ ਕ੍ਰਮ/, row);
          assert.match(question.explanation.conclusion, /A : .*B/, row);
          break;
        case "findIntegerCrewCompositionUnderConstraints":
          assert.match(question.explanation.opening, language === "hi" ? /x \+ y.*दूसरा समीकरण/ : /x \+ y.*ਦੂਜਾ ਸਮੀਕਰਨ/, row);
          break;
      }

      switch (question.explanation.commonTrap.misconceptionId) {
        case "CATEGORY_RATES_ASSUMED_EQUAL":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /काम-दर अलग.*संख्या जोड़ने/ : /ਕੰਮ-ਦਰ ਵੱਖ.*ਗਿਣਤੀ ਜੋੜਨ/, row);
          break;
        case "COUNT_RATIO_NOT_INVERTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अनुपात.*उलटा/ : /ਅਨੁਪਾਤ.*ਉਲਟ/, row);
          break;
        case "CREW_RATE_NOT_SUMMED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /हर काम कर रही श्रेणी.*योगदान/ : /ਹਰ ਕੰਮ ਕਰ ਰਹੀ ਸ਼੍ਰੇਣੀ.*ਯੋਗਦਾਨ/, row);
          break;
        case "KNOWN_CATEGORY_OMITTED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /ज्ञात.*योगदान/ : /ਜਾਣੀਆਂ.*ਯੋਗਦਾਨ/, row);
          break;
        case "TOTAL_REPORTED_AS_REPLACEMENT":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अतिरिक्त संख्या.*कुल संख्या/ : /ਵਾਧੂ ਗਿਣਤੀ.*ਕੁੱਲ ਗਿਣਤੀ/, row);
          break;
        case "REPLACEMENT_RATIO_REVERSED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /पुरानी और नई दर.*उलटा/ : /ਪੁਰਾਣੀ ਅਤੇ ਨਵੀਂ ਦਰ.*ਉਲਟ/, row);
          break;
        case "TIME_RATE_INVERSION_MISSED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /अकेले.*उलटा/ : /ਇਕੱਲੇ.*ਉਲਟ/, row);
          break;
        case "CONTRIBUTION_USES_HEADCOUNT_ONLY":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /संख्या × एक सदस्य की दर/ : /ਗਿਣਤੀ × ਇੱਕ ਮੈਂਬਰ ਦੀ ਦਰ/, row);
          break;
        case "PAIR_ORDER_REVERSED":
          assert.match(question.explanation.commonTrap.explanation, entry.solveMode === "compareTwoHeterogeneousCrews"
            ? (language === "hi" ? /समूह A.*समूह B.*क्रम/ : /ਸਮੂਹ A.*ਸਮੂਹ B.*ਕ੍ਰਮ/)
            : (language === "hi" ? /पहली और दूसरी श्रेणी.*क्रम/ : /ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਸ਼੍ਰੇਣੀ.*ਕ੍ਰਮ/), row);
          break;
        case "INTEGER_CONSTRAINT_IGNORED":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /धनात्मक पूर्णांक/ : /ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ/, row);
          break;
        case "PLAUSIBLE_SCALE_ERROR":
          assert.match(question.explanation.commonTrap.explanation, language === "hi" ? /गलत पैमाने/ : /ਗਲਤ ਪੈਮਾਨੇ/, row);
          break;
      }

      reviewedPackages += 1;
      if (language === "hi") hindiPackages += 1;
      else punjabiPackages += 1;
    }
  }
}

assert.equal(reviewedPackages, 384);
assert.equal(hindiPackages, 192);
assert.equal(punjabiPackages, 192);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-007",
  qlRange: "TMW-QL-128..TMW-QL-143",
  qls: 16,
  seedsPerQl: 12,
  reviewedPackages,
  hindiPackages,
  punjabiPackages,
  remediatedQls: 16,
  remediatedPackages: reviewedPackages,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
  status: "PASS",
}, null, 2));
