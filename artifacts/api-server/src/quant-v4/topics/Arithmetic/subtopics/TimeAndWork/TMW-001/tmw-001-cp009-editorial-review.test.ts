import { strict as assert } from "node:assert";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import type {
  TmwCp009MisconceptionId,
  TmwCp009SolveMode,
} from "./foundation/cp009-types";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const seedsPerQl = 12;
let reviewedPackages = 0;
const shortcutTitles: Record<TmwLocalizedLanguage, Set<string>> = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};

const openingMarkers: Record<TmwCp009SolveMode, readonly [RegExp, RegExp]> = {
  findFillTimeFromPositiveInlets: [/समय उलटकर.*भरने की दर.*दरें जोड़ें/, /ਸਮੇਂ ਨੂੰ ਉਲਟ.*ਭਰਨ ਦਰ.*ਦਰਾਂ ਜੋੜੋ/],
  findFillTimeFromMixedPipes: [/भरने वाली पाइपों की दरें जोड़ें.*निकासी.*घटाएँ/, /ਭਰਨ ਵਾਲੀਆਂ ਪਾਈਪਾਂ ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ.*ਨਿਕਾਸੀ.*ਘਟਾਓ/],
  findEmptyTimeFromMixedPipes: [/निकासी और रिसाव की दरें जोड़ें.*भरने वाली.*घटाएँ/, /ਨਿਕਾਸੀ ਅਤੇ ਰਿਸਾਅ ਦੀਆਂ ਦਰਾਂ ਜੋੜੋ.*ਭਰਨ ਵਾਲੀਆਂ.*ਘਟਾਓ/],
  findNetFractionChangedInGivenTime: [/शुद्ध दर.*खुले रहने के समय से गुणा/, /ਸ਼ੁੱਧ ਦਰ.*ਖੁੱਲ੍ਹੀਆਂ ਰਹਿਣ ਦੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ/],
  findMissingInletTime: [/आवश्यक शुद्ध भराव दर.*अज्ञात भरने वाली पाइप/, /ਲੋੜੀਂਦੀ ਸ਼ੁੱਧ ਭਰਨ ਦਰ.*ਅਣਜਾਣ ਭਰਨ ਵਾਲੀ ਪਾਈਪ/],
  findMissingOutletOrLeakTime: [/अज्ञात निकासी पाइप या रिसाव की दर अलग/, /ਅਣਜਾਣ ਨਿਕਾਸੀ ਪਾਈਪ ਜਾਂ ਰਿਸਾਅ ਦੀ ਦਰ ਵੱਖ/],
  findIdenticalPipeCountForTargetTime: [/आवश्यक संख्या = एक पाइप का समय ÷ लक्ष्य समय/, /ਲੋੜੀਂਦੀ ਗਿਣਤੀ = ਇੱਕ ਪਾਈਪ ਦਾ ਸਮਾਂ ÷ ਟੀਚਾ ਸਮਾਂ/],
  findTankCapacityFromFlowAndTime: [/क्षमता = प्रवाह दर × भरने का समय/, /ਸਮਰੱਥਾ = ਪ੍ਰਵਾਹ ਦਰ × ਭਰਨ ਸਮਾਂ/],
  findFlowRateFromCapacityAndTime: [/कुल क्षमता.*समय से भाग/, /ਕੁੱਲ ਸਮਰੱਥਾ.*ਸਮੇਂ ਨਾਲ ਭਾਗ/],
  findTimeFromCapacityAndNetFlow: [/समय = टंकी की क्षमता ÷ शुद्ध भराव प्रवाह/, /ਸਮਾਂ = ਟੈਂਕੀ ਦੀ ਸਮਰੱਥਾ ÷ ਸ਼ੁੱਧ ਭਰਨ ਪ੍ਰਵਾਹ/],
  convertFlowUnits: [/प्रति मिनट.*प्रति घंटा.*60 से गुणा/, /ਪ੍ਰਤੀ ਮਿੰਟ.*ਪ੍ਰਤੀ ਘੰਟਾ.*60 ਨਾਲ ਗੁਣਾ/],
  findTimeFromInitialLevelToBoundary: [/1 − प्रारंभिक भाग.*प्रारंभिक भरा भाग/, /1 − ਸ਼ੁਰੂਆਤੀ ਹਿੱਸਾ.*ਸ਼ੁਰੂਆਤੀ ਭਰਿਆ ਹਿੱਸਾ/],
  findFinalLevelAfterGivenTime: [/प्रारंभिक भरे भाग.*शुद्ध परिवर्तन जोड़ें/, /ਸ਼ੁਰੂਆਤੀ ਭਰੇ ਹਿੱਸੇ.*ਸ਼ੁੱਧ ਬਦਲਾਅ ਜੋੜੋ/],
  compareTankCapacities: [/क्षमता = उसकी प्रवाह दर × उसका भरने का समय/, /ਸਮਰੱਥਾ = ਉਸ ਦੀ ਪ੍ਰਵਾਹ ਦਰ × ਉਸ ਦਾ ਭਰਨ ਸਮਾਂ/],
  findReducedPipeEfficiencyFromChangedTime: [/दक्षता समय के उलट अनुपात/, /ਦੱਖਤਾ ਸਮੇਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ/],
  findBlockagePercentFromChangedTime: [/अवरोध प्रतिशत = 100% − बची हुई दक्षता/, /ਰੁਕਾਵਟ ਪ੍ਰਤੀਸ਼ਤ = 100% − ਬਚੀ ਹੋਈ ਦੱਖਤਾ/],
  findNetRateDirection: [/संख्या देखकर दिशा तय न करें.*कुल दर/, /ਗਿਣਤੀ ਵੇਖ ਕੇ ਦਿਸ਼ਾ ਤੈਅ ਨਾ ਕਰੋ.*ਕੁੱਲ.*ਦਰ/],
  findBoundaryEventFeasibility: [/दिशा सही हो.*समय.*उपलब्ध समय से तुलना/, /ਦਿਸ਼ਾ ਸਹੀ ਹੋਵੇ.*ਸਮਾਂ.*ਉਪਲਬਧ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ/],
};

const trapMarkers: Record<Exclude<TmwCp009MisconceptionId, "CORRECT">, readonly [RegExp, RegExp]> = {
  OTHER_PIPES_IGNORED: [/एक या अधिक पाइपों का प्रभाव छोड़ दिया/, /ਇੱਕ ਜਾਂ ਵੱਧ ਪਾਈਪਾਂ ਦਾ ਅਸਰ ਛੱਡ ਦਿੱਤਾ/],
  PIPE_TIMES_ADDED: [/अकेले समय सीधे नहीं जोड़े/, /ਇਕੱਲੇ ਸਮੇਂ ਸਿੱਧੇ ਨਹੀਂ ਜੋੜੇ/],
  OUTFLOW_ADDED_AS_INFLOW: [/जोड़ने के बजाय घटानी/, /ਜੋੜਨ ਦੀ ਬਜਾਏ ਘਟਾਉਣੀ/],
  INFLOW_SUBTRACTED_FROM_OUTFLOW_WRONGLY: [/माँगी दिशा के अनुसार शुद्ध भराव या शुद्ध निकासी/, /ਮੰਗੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਸ਼ੁੱਧ ਭਰਨ ਜਾਂ ਸ਼ੁੱਧ ਨਿਕਾਸੀ/],
  TIME_USED_AS_RATE: [/दर 1 ÷ अकेले समय/, /ਦਰ 1 ÷ ਇਕੱਲਾ ਸਮਾਂ/],
  DURATION_IGNORED: [/खुले समय से गुणा करना जरूरी/, /ਖੁੱਲ੍ਹੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਲਾਜ਼ਮੀ/],
  INITIAL_LEVEL_IGNORED: [/प्रारंभिक भरे भाग.*शामिल/, /ਸ਼ੁਰੂਆਤੀ ਭਰੇ ਹਿੱਸੇ.*ਸ਼ਾਮਲ/],
  REMAINING_LEVEL_IGNORED: [/1 − प्रारंभिक भरा भाग/, /1 − ਸ਼ੁਰੂਆਤੀ ਭਰਿਆ ਹਿੱਸਾ/],
  KNOWN_PIPE_SIGN_IGNORED: [/ज्ञात पाइप की दिशा गलत/, /ਪਤਾ ਪਾਈਪ ਦੀ ਦਿਸ਼ਾ ਗਲਤ/],
  COUNT_RATIO_REVERSED: [/एक-पाइप समय ÷ लक्ष्य समय/, /ਇੱਕ-ਪਾਈਪ ਸਮਾਂ ÷ ਟੀਚਾ ਸਮਾਂ/],
  CAPACITY_REPORTED_AS_FLOW: [/कुल मात्रा के स्थान पर दर/, /ਕੁੱਲ ਮਾਤਰਾ ਦੀ ਥਾਂ ਦਰ/],
  CAPACITY_FLOW_TIME_REVERSED: [/क्षमता = प्रवाह × समय/, /ਸਮਰੱਥਾ = ਪ੍ਰਵਾਹ × ਸਮਾਂ/],
  FLOW_UNIT_NOT_CONVERTED: [/60 के संबंध से इकाई बदलनी/, /60 ਦੇ ਸੰਬੰਧ ਨਾਲ ਇਕਾਈ ਬਦਲਣੀ/],
  RATIO_ORDER_REVERSED: [/क्रम उलट दिया जाए/, /ਕ੍ਰਮ ਉਲਟ ਦਿੱਤਾ ਜਾਵੇ/],
  TIME_EFFICIENCY_INVERSION_MISSED: [/समयों का क्रम उलटना/, /ਸਮਿਆਂ ਦਾ ਕ੍ਰਮ ਉਲਟਣਾ/],
  BLOCKAGE_REPORTED_AS_REMAINING_EFFICIENCY: [/बची हुई दक्षता देता है, अवरोध नहीं/, /ਬਚੀ ਹੋਈ ਦੱਖਤਾ ਦਿੰਦਾ ਹੈ, ਰੁਕਾਵਟ ਨਹੀਂ/],
  DIRECTION_FROM_PIPE_COUNT: [/दिशा पाइपों की संख्या से नहीं/, /ਦਿਸ਼ਾ ਪਾਈਪਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਨਹੀਂ/],
  BOUNDARY_TIME_NOT_CHECKED: [/वास्तविक समय उपलब्ध अवधि के भीतर/, /ਅਸਲ ਸਮਾਂ ਉਪਲਬਧ ਮਿਆਦ ਦੇ ਅੰਦਰ/],
  PLAUSIBLE_SCALE_ERROR: [/पैमाना गलत लगाया/, /ਪੈਮਾਨਾ ਗਲਤ ਲਾਇਆ/],
};

for (const entry of TMW_CP009_REGISTRY) {
  for (let seedIndex = 0; seedIndex < seedsPerQl; seedIndex += 1) {
    const seed = `tmw-cp009-editorial-review:${entry.qlId}:${seedIndex}`;
    for (const language of languages) {
      const question = runTmwCp009LocalizedPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const prose = [
        question.stem,
        ...question.options,
        question.explanation.opening,
        question.explanation.formula,
        ...question.explanation.givens,
        ...question.explanation.steps,
        question.explanation.shortcut.title,
        ...question.explanation.shortcut.steps,
        question.explanation.commonTrap.explanation,
        question.explanation.conclusion,
      ].join("\n");

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${seedIndex}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.editorialStatus, "PENDING");
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${entry.qlId}:${language}:${seedIndex}: conclusion answer`);

      assert.equal(/पाइप अभिलेख|हस्ताक्षरित|परिमाण|ਪਾਈਪ ਰਿਕਾਰਡ|ਚਿੰਨ੍ਹਿਤ|ਪਰਿਮਾਣ/.test(prose), false, `${entry.qlId}:${language}:${seedIndex}: technical wording`);
      assert.equal(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ|त्वरित नियम|ਤੁਰੰਤ ਨਿਯਮ/.test(prose), false, `${entry.qlId}:${language}:${seedIndex}: generic shortcut`);
      assert.equal(/find[A-Z]|TMW_|Independent signed-flow|Don't fall for|Do not choose/i.test(prose), false, `${entry.qlId}:${language}:${seedIndex}: internal wording`);
      assert.equal(/\b(?:tank|reservoir|inlet|outlet|leak|litres|hours?|water level|flow rate|full|empty)\b/i.test(prose), false, `${entry.qlId}:${language}:${seedIndex}: English leakage`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(prose), false, `${entry.qlId}:${language}:${seedIndex}: raw mixed fraction`);
      assert.equal(/\d+ घंटे में|\d+ ਘੰਟੇ ਵਿੱਚ/.test(prose), false, `${entry.qlId}:${language}:${seedIndex}: uninflected duration`);
      assert.equal(/टंकी का टंकी का|ਟੈਂਕੀ ਦਾ ਟੈਂਕੀ ਦਾ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}:${seedIndex}: duplicated fraction subject`);
      assert.equal(/संख्या .*पाइपें है|ਗਿਣਤੀ .*ਪਾਈਪਾਂ ਹੈ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}:${seedIndex}: duplicated count noun`);
      assert.equal(/स्तर .*भरी होगा|ਪੱਧਰ .*ਭਰੀ ਹੋਵੇਗਾ/.test(question.explanation.conclusion), false, `${entry.qlId}:${language}:${seedIndex}: level agreement`);

      const openingMarker = openingMarkers[entry.solveMode][language === "hi" ? 0 : 1];
      assert.match(question.explanation.opening, openingMarker, `${entry.qlId}:${language}:${seedIndex}: solve-mode opening`);
      const trapId = question.explanation.commonTrap.misconceptionId;
      const trapMarker = trapMarkers[trapId][language === "hi" ? 0 : 1];
      assert.match(question.explanation.commonTrap.explanation, trapMarker, `${entry.qlId}:${language}:${seedIndex}: misconception trap`);

      if (entry.answerType === "FLOW_RATE") {
        assert.match(question.solution.answerText, language === "hi" ? /लीटर प्रति (?:घंटा|मिनट)$/ : /ਲੀਟਰ ਪ੍ਰਤੀ (?:ਘੰਟਾ|ਮਿੰਟ)$/);
      }
      if (entry.answerType === "CAPACITY") {
        assert.match(question.solution.answerText, language === "hi" ? /लीटर$/ : /ਲੀਟਰ$/);
      }
      if (entry.answerType === "DIRECTION") {
        assert.match(question.explanation.opening, language === "hi" ? /धनात्मक.*ऋणात्मक.*शून्य/ : /ਧਨਾਤਮਕ.*ਰਿਣਾਤਮਕ.*ਸਿਫ਼ਰ/);
      }
      if (entry.answerType === "DECISION") {
        assert.match(question.solution.answerText, language === "hi" ? /^(हाँ|नहीं)/ : /^(ਹਾਂ|ਨਹੀਂ)/);
        assert.equal(question.solution.answerValues.length, 3);
      }

      shortcutTitles[language].add(question.explanation.shortcut.title);
      reviewedPackages += 1;
    }
  }
}

assert.equal(TMW_CP009_REGISTRY.length, 18);
assert.equal(reviewedPackages, 432);
assert.equal(shortcutTitles.hi.size, 18);
assert.equal(shortcutTitles.pa.size, 18);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-009",
  qlRange: "TMW-QL-157..TMW-QL-174",
  qls: TMW_CP009_REGISTRY.length,
  seedsPerQl,
  reviewedPackages,
  hindiPackages: reviewedPackages / 2,
  punjabiPackages: reviewedPackages / 2,
  distinctHindiShortcutTitles: shortcutTitles.hi.size,
  distinctPunjabiShortcutTitles: shortcutTitles.pa.size,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
}, null, 2));
