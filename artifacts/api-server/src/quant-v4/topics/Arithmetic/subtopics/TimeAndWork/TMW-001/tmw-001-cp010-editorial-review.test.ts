import { strict as assert } from "node:assert";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { runTmwCp010LocalizedPipeline } from "./foundation/cp010-localized-runtime";
import type {
  TmwCp010MisconceptionId,
  TmwCp010SolveMode,
} from "./foundation/cp010-types";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const seedsPerQl = 12;
let reviewedPackages = 0;
const shortcutTitles: Record<TmwLocalizedLanguage, Set<string>> = {
  hi: new Set<string>(),
  pa: new Set<string>(),
};

const openingMarkers: Record<TmwCp010SolveMode, readonly [RegExp, RegExp]> = {
  findCompletionAfterDelayedActivation: [/देरी तक.*भरा भाग.*नई संयुक्त दर/, /ਦੇਰੀ ਤੱਕ.*ਭਰਿਆ ਹਿੱਸਾ.*ਨਵੀਂ ਸਾਂਝੀ ਦਰ/],
  findCompletionAfterDelayedDeactivation: [/बंद होने के समय तक.*बची हुई पाइपों/, /ਬੰਦ ਹੋਣ ਦੇ ਸਮੇਂ ਤੱਕ.*ਬਚੀਆਂ ਪਾਈਪਾਂ/],
  findCompletionWithMultipleStaggeredEvents: [/हर पाइप के खुलने या बंद होने.*शेष भाग/, /ਹਰ ਪਾਈਪ ਦੇ ਖੁੱਲ੍ਹਣ ਜਾਂ ਬੰਦ ਹੋਣ.*ਬਾਕੀ ਹਿੱਸਾ/],
  findCompletionWithInterruptedFlow: [/काम शून्य.*कुल समय/, /ਕੰਮ ਸਿਫ਼ਰ.*ਕੁੱਲ ਸਮੇਂ/],
  findCompletionFromPartialLevelAndStages: [/प्रारंभिक भरे भाग.*लक्ष्य तक बचा भाग/, /ਸ਼ੁਰੂਆਤੀ ਭਰੇ ਹਿੱਸੇ.*ਟੀਚੇ ਤੱਕ ਬਾਕੀ ਹਿੱਸਾ/],
  findFinalLevelAfterStagedSchedule: [/स्तर परिवर्तन = शुद्ध दर × अवधि/, /ਪੱਧਰ ਬਦਲਾਅ = ਸ਼ੁੱਧ ਦਰ × ਮਿਆਦ/],
  findCompletionAfterThresholdSwitch: [/दिए स्तर पर बदलती.*बदली हुई दर/, /ਦਿੱਤੇ ਪੱਧਰ ਉੱਤੇ ਬਦਲਦੀ.*ਬਦਲੀ ਦਰ/],
  findEventTimeFromKnownCompletion: [/पहली अवधि को अज्ञात.*कुल ज्ञात समय/, /ਪਹਿਲੀ ਮਿਆਦ ਨੂੰ ਅਣਜਾਣ.*ਕੁੱਲ ਪਤਾ ਸਮੇਂ/],
  findRequiredFinalStageRate: [/शेष भाग ÷ अंतिम समय/, /ਬਾਕੀ ਹਿੱਸਾ ÷ ਅੰਤਿਮ ਸਮੇਂ/],
  findCapacityFromStagedPhysicalFlows: [/प्रति घंटा शुद्ध प्रवाह ×.*कुल क्षमता/, /ਪ੍ਰਤੀ ਘੰਟਾ ਸ਼ੁੱਧ ਪ੍ਰਵਾਹ ×.*ਕੁੱਲ ਸਮਰੱਥਾ/],
  findCompletionWithAlternatingPipes: [/एक पूरा चक्र.*बचा भाग/, /ਇੱਕ ਪੂਰਾ ਚੱਕਰ.*ਬਾਕੀ ਹਿੱਸਾ/],
  findCompletionWithPeriodicSchedule: [/दोहराई जाने वाली.*अधूरे अंतिम चक्र/, /ਦੁਹਰਾਈ ਜਾਣ ਵਾਲੀ.*ਅਧੂਰੇ ਅੰਤਿਮ ਚੱਕਰ/],
  findAutomaticLevelControlCompletion: [/ऊपरी और निचले स्तर.*वापसी चक्र/, /ਉੱਪਰਲੇ ਅਤੇ ਹੇਠਲੇ ਪੱਧਰ.*ਵਾਪਸੀ ਚੱਕਰ/],
  findCompletionFromArbitraryCyclePhase: [/दिए शुरुआती हिस्से.*घुमे हुए क्रम/, /ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਹਿੱਸੇ.*ਘੁੰਮਾਏ ਕ੍ਰਮ/],
  findFullCycleCountToBoundary: [/अगला पूरा चक्र सीमा पार/, /ਅਗਲਾ ਪੂਰਾ ਚੱਕਰ ਸੀਮਾ ਪਾਰ/],
  findTerminalActiveSegment: [/जिस हिस्से के भीतर लक्ष्य पहली बार पूरा/, /ਜਿਸ ਹਿੱਸੇ ਦੇ ਅੰਦਰ ਟੀਚਾ ਪਹਿਲੀ ਵਾਰ ਪੂਰਾ/],
  findBoundaryEventTimeUnderSchedule: [/अंतिम चक्र के हर हिस्से.*सीमा/, /ਅੰਤਿਮ ਚੱਕਰ ਦੇ ਹਰ ਹਿੱਸੇ.*ਸੀਮਾ/],
  findScheduleAdjustmentForDeadline: [/नई समय-सीमा.*पुराने समय से तुलना/, /ਨਵੀਂ ਸਮਾਂ-ਸੀਮਾ.*ਪੁਰਾਣੇ ਸਮੇਂ ਨਾਲ ਤੁਲਨਾ/],
};

const trapMarkers: Record<Exclude<TmwCp010MisconceptionId, "CORRECT">, readonly [RegExp, RegExp]> = {
  PRE_EVENT_STAGE_IGNORED: [/बदलाव से पहले भी पाइप काम/, /ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਵੀ ਪਾਈਪਾਂ ਕੰਮ/],
  POST_EVENT_STAGE_IGNORED: [/बदलाव के बाद बचा भाग/, /ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਹਿੱਸਾ/],
  EVENT_TIME_ADDED_TWICE: [/समय दोबारा जोड़/, /ਸਮਾਂ ਮੁੜ ਜੋੜ/],
  PIPE_SIGN_IGNORED: [/भरने वाली पाइप.*निकासी और रिसाव/, /ਭਰਨ ਵਾਲੀ ਪਾਈਪ.*ਨਿਕਾਸੀ ਅਤੇ ਰਿਸਾਅ/],
  INITIAL_LEVEL_IGNORED: [/प्रारंभिक भरे भाग/, /ਸ਼ੁਰੂਆਤੀ ਭਰੇ ਹਿੱਸੇ/],
  IDLE_INTERVAL_IGNORED: [/काम शून्य.*कुल बीता समय/, /ਕੰਮ ਸਿਫ਼ਰ.*ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ/],
  THRESHOLD_SWITCH_IGNORED: [/दिए स्तर पर बदलती/, /ਦਿੱਤੇ ਪੱਧਰ ਉੱਤੇ ਬਦਲਦੀ/],
  CYCLE_ORDER_REVERSED: [/क्रम उलटने.*अंतिम अधूरा चक्र/, /ਕ੍ਰਮ ਉਲਟਣ.*ਅੰਤਿਮ ਅਧੂਰਾ ਚੱਕਰ/],
  ONE_FULL_CYCLE_TOO_MANY: [/अगला पूरा चक्र सीमा पार/, /ਅਗਲਾ ਪੂਰਾ ਚੱਕਰ ਸੀਮਾ ਪਾਰ/],
  ONE_FULL_CYCLE_TOO_FEW: [/एक और पूरा चक्र सीमा से पहले/, /ਇੱਕ ਹੋਰ ਪੂਰਾ ਚੱਕਰ ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ/],
  TERMINAL_FRACTION_IGNORED: [/अंतिम चक्र के बीच/, /ਅੰਤਿਮ ਚੱਕਰ ਦੇ ਵਿਚਕਾਰ/],
  WRONG_TERMINAL_SEGMENT: [/पहली बार पूरा नहीं/, /ਪਹਿਲੀ ਵਾਰ ਪੂਰਾ ਨਹੀਂ/],
  BOUNDARY_TIME_NOT_CHECKED: [/हर हिस्से के भीतर जाँचना/, /ਹਰ ਹਿੱਸੇ ਦੇ ਅੰਦਰ ਜਾਂਚਣਾ/],
  PHYSICAL_STAGE_OMITTED: [/एक चरण की भरी या निकली मात्रा छोड़/, /ਇੱਕ ਪੜਾਅ ਦੀ ਭਰੀ ਜਾਂ ਨਿਕਲੀ ਮਾਤਰਾ ਛੱਡ/],
  INVERSE_STAGE_NOT_ISOLATED: [/अज्ञात समय या दर.*अकेला/, /ਅਣਜਾਣ ਸਮਾਂ ਜਾਂ ਦਰ.*ਇਕੱਲਾ/],
  STAGE_DURATION_COMPLEMENT_USED: [/माँगी गई अवधि.*पूरक/, /ਮੰਗੀ ਮਿਆਦ.*ਪੂਰਕ/],
  ORIGINAL_EVENT_TIME_REPORTED: [/पुराना बदलाव-समय सीधे उत्तर नहीं/, /ਪੁਰਾਣਾ ਬਦਲਾਅ ਸਮਾਂ ਸਿੱਧਾ ਉੱਤਰ ਨਹੀਂ/],
  PHYSICAL_DURATION_IGNORED: [/दर को उसकी अवधि से गुणा/, /ਦਰ ਨੂੰ ਉਸ ਦੀ ਮਿਆਦ ਨਾਲ ਗੁਣਾ/],
  COMPLEMENT_LEVEL_REPORTED: [/1 − सही स्तर/, /1 − ਸਹੀ ਪੱਧਰ/],
  CONTROL_CYCLE_COUNT_IGNORED: [/वापसी गिनती छोड़/, /ਵਾਪਸੀ ਗਿਣਤੀ ਛੱਡ/],
  RATE_TIME_RECIPROCAL_ERROR: [/समय = काम ÷ दर/, /ਸਮਾਂ = ਕੰਮ ÷ ਦਰ/],
  PLAUSIBLE_SCALE_ERROR: [/पैमाना गलत लगाया/, /ਪੈਮਾਨਾ ਗਲਤ ਲਾਇਆ/],
};

for (const entry of TMW_CP010_REGISTRY) {
  for (let seedIndex = 0; seedIndex < seedsPerQl; seedIndex += 1) {
    const seed = `tmw-cp010-editorial-review:${entry.qlId}:${seedIndex}`;
    for (const language of languages) {
      const question = runTmwCp010LocalizedPipeline({
        questionLanguageId: entry.qlId,
        seed,
        language,
      });
      const learnerProse = [
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
      const allText = `${learnerProse}\n${question.explanation.formula}`;

      assert.equal(question.validation.valid, true, `${entry.qlId}:${language}:${seedIndex}:${question.validation.errors.join(" | ")}`);
      assert.equal(question.editorialStatus, "PENDING");
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.solution.answerText);
      assert.equal(question.optionAudit[question.correctIndex]?.key, question.solution.answerKey);
      assert.notEqual(question.explanation.commonTrap.optionText, question.solution.answerText);
      assert.ok(question.explanation.conclusion.includes(question.solution.answerText), `${entry.qlId}:${language}:${seedIndex}: conclusion answer`);

      assert.equal(/कार्यक्रम|चिह्न सहित|अंतिम सक्रिय खंड|टर्मिनल खंड|ਘਟਨਾ ਸਮਾਂ|ਕਾਰਜਕ੍ਰਮ|ਚਿੰਨ੍ਹ ਸਮੇਤ|ਅੰਤਿਮ ਸਰਗਰਮ ਖੰਡ|ਟਰਮੀਨਲ ਖੰਡ/.test(learnerProse), false, `${entry.qlId}:${language}:${seedIndex}: technical wording`);
      assert.equal(/10-सेकंड|10 सेकंड|10-ਸਕਿੰਟ|10 ਸਕਿੰਟ|त्वरित नियम|ਤੁਰੰਤ ਨਿਯਮ/.test(learnerProse), false, `${entry.qlId}:${language}:${seedIndex}: generic shortcut`);
      assert.equal(/find[A-Z]|TMW_|Independent staged|Do not choose|Don't fall for/i.test(allText), false, `${entry.qlId}:${language}:${seedIndex}: internal wording`);
      assert.equal(/\b(?:tank|reservoir|inlet|outlet|leak|stage|segment|cycle|threshold|litres?|hours?|water level|flow rate|terminal|switch|drainage|completion|earlier|later|process full cycles)\b/i.test(learnerProse), false, `${entry.qlId}:${language}:${seedIndex}: English leakage`);
      assert.equal(/\b\d+\s+\d+\/\d+\b/.test(learnerProse), false, `${entry.qlId}:${language}:${seedIndex}: raw mixed fraction`);
      assert.equal(/\d+ घंटे में|\d+ घंटे तक|\d+ ਘੰਟੇ ਵਿੱਚ|\d+ ਘੰਟੇ ਲਈ/.test(learnerProse), false, `${entry.qlId}:${language}:${seedIndex}: uninflected duration`);
      assert.equal(/पाइपें एक साथ चलते हैं|पाइपें चलती है|ਪਾਈਪਾਂ ਇਕੱਠੇ ਚੱਲਦੇ ਹਨ|ਪਾਈਪਾਂ ਚੱਲਦੀ ਹੈ/.test(learnerProse), false, `${entry.qlId}:${language}:${seedIndex}: pipe agreement`);

      const openingMarker = openingMarkers[entry.solveMode][language === "hi" ? 0 : 1];
      assert.match(question.explanation.opening, openingMarker, `${entry.qlId}:${language}:${seedIndex}: solve-mode opening`);
      const trapId = question.explanation.commonTrap.misconceptionId;
      const trapMarker = trapMarkers[trapId][language === "hi" ? 0 : 1];
      assert.match(question.explanation.commonTrap.explanation, trapMarker, `${entry.qlId}:${language}:${seedIndex}: misconception trap`);

      if (entry.answerType === "SEGMENT") {
        assert.notEqual(question.solution.terminalSegmentIndex, undefined);
        assert.equal(/segment:|extra:/i.test(question.solution.answerText), false);
      }
      if (entry.answerType === "COUNT") {
        assert.match(question.solution.answerText, language === "hi" ? /पूरे चक्र$/ : /ਪੂਰੇ ਚੱਕਰ$/);
      }
      if (entry.answerType === "CAPACITY") {
        assert.match(question.solution.answerText, language === "hi" ? /लीटर$/ : /ਲੀਟਰ$/);
      }
      if (entry.answerType === "FLOW_RATE") {
        assert.match(question.solution.answerText, language === "hi" ? /टंकी प्रति घंटा भराव/ : /ਟੈਂਕੀ ਪ੍ਰਤੀ ਘੰਟਾ ਭਰਾਅ/);
      }

      shortcutTitles[language].add(question.explanation.shortcut.title);
      reviewedPackages += 1;
    }
  }
}

assert.equal(TMW_CP010_REGISTRY.length, 18);
assert.equal(reviewedPackages, 432);
assert.equal(shortcutTitles.hi.size, 18);
assert.equal(shortcutTitles.pa.size, 18);
console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-010",
  qlRange: "TMW-QL-175..TMW-QL-192",
  qls: TMW_CP010_REGISTRY.length,
  seedsPerQl,
  reviewedPackages,
  hindiPackages: reviewedPackages / 2,
  punjabiPackages: reviewedPackages / 2,
  distinctHindiShortcutTitles: shortcutTitles.hi.size,
  distinctPunjabiShortcutTitles: shortcutTitles.pa.size,
  openAutomatedFindings: 0,
  reviewVerdict: "ASSISTANT_EDITORIAL_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
}, null, 2));
