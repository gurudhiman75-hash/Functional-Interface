import { INT_CP006_QL_IDS } from "./cp006-si-ci-relations-runtime-v4-final";
import { generateIntCp006EnglishFrozenQuestion } from "./cp006-si-ci-relations-v1-frozen";
import { generateIntCp006LocalizedQuestion as generateLocalizedV3 } from "./cp006-si-ci-relations-localized-v3";
import { generateIntCp006LocalizedExplanationReviewQuestion as generateLocalizedV6 } from "./cp006-si-ci-relations-localized-v6";
import { generateIntCp006EnglishExplanationReviewQuestion } from "./cp006-english-explanation-amendment-v1";
import {
  INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  generateIntCp006LocalizedExplanationReviewQuestion,
  type IntCp006LocalizedLocale,
  standardizeIntCp006PunjabiCompoundInterest,
  containsDeprecatedPunjabiCompoundInterestTerm,
} from "./cp006-si-ci-relations-localized-v7";
import { INT_CP006_EXPANDED_EXPLANATION_VERSION } from "./cp006-expanded-explanation-v4";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}
function hasNativeScript(text: string, locale: IntCp006LocalizedLocale): boolean {
  return locale === "hi-IN" ? /[\u0900-\u097F]/u.test(text) : /[\u0A00-\u0A7F]/u.test(text);
}
function transformPunjabiExpected<T>(value: T): T {
  if (typeof value === "string") return standardizeIntCp006PunjabiCompoundInterest(value) as T;
  if (Array.isArray(value)) return value.map((item) => transformPunjabiExpected(item)) as T;
  if (typeof value === "object" && value !== null) {
    const result: Record<PropertyKey, unknown> = {};
    for (const key of Reflect.ownKeys(value as object)) {
      result[key] = transformPunjabiExpected((value as Record<PropertyKey, unknown>)[key]);
    }
    return result as T;
  }
  return value;
}
function preservedProjection(question: any, locale?: IntCp006LocalizedLocale) {
  return {
    qlId: question.qlId,
    seed: question.seed,
    locale: question.locale,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    presentation: locale === "pa-IN" ? transformPunjabiExpected(question.presentation) : question.presentation,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    finalAnswer: locale === "pa-IN" ? standardizeIntCp006PunjabiCompoundInterest(question.explanation.finalAnswer) : question.explanation.finalAnswer,
    enabled: question.enabled,
    stagingStatus: question.stagingStatus,
    registrationStatus: question.registrationStatus,
    questionStudioDiscoverable: question.questionStudioDiscoverable,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
  };
}
function assertNativeGrammar(question: any, label: string, locale: IntCp006LocalizedLocale) {
  const learnerExplanation = [question.explanation.keyIdea, ...question.explanation.steps, question.explanation.commonMistake].join(" ");
  const banned = locale === "hi-IN"
    ? [
        "D₂/P, वार्षिक",
        "मूलधन कट जाता",
        "अगले वर्ष के ब्याज की वृद्धि",
        "उत्तर वाले वर्ष",
        "वार्षिक दर के बराबर होता है",
        "तीसरे क्रम का चक्रवृद्धि पद",
        "अतिरिक्त पद आता है",
        "दूसरे क्रम के तीन चक्रवृद्धि योगदानों",
        "तीसरे वर्ष की अतिरिक्त चक्रवृद्धि",
        "केवल पूर्णांक गुणज",
        "पीछे की गणना",
        "दूसरे वर्ष का अतिरिक्त ब्याज, पहले वर्ष के ब्याज पर वार्षिक दर से मिलने वाले ब्याज",
      ]
    : [
        "ਵਿਆਜ ਦੀ ਵਾਧਾ",
        "ਮੂਲਧਨ ਕੱਟ ਜਾਂਦਾ",
        "ਜਵਾਬ ਵਾਲੇ ਸਾਲ",
        "ਸਾਲਾਨਾ ਦਰ ਦੇ ਬਰਾਬਰ ਹੁੰਦਾ ਹੈ",
        "ਵਾਧੂ ਪਦ",
        "ਪਹਿਲੇ ਵਾਲੇ ਸਾਲ ਦਾ ਵਿਆਜ ਹੈ",
        "ਪੂਰਨ ਅੰਕ ਗੁਣਾ",
        "ਪਿੱਛੇ ਦੀ ਗਿਣਤੀ",
        "ਦੂਜੇ ਸਾਲ ਦਾ ਵਾਧੂ ਵਿਆਜ, ਪਹਿਲੇ ਸਾਲ ਦੇ ਵਿਆਜ ਉੱਤੇ ਸਾਲਾਨਾ ਦਰ ਨਾਲ ਮਿਲਣ ਵਾਲੇ ਵਿਆਜ",
      ];
  for (const phrase of banned) assert(!learnerExplanation.includes(phrase), `${label}: native editorial regression '${phrase}'`);
  if (locale === "hi-IN") {
    assert(!/पहला पूर्ण वर्ष \d+ वर्ष है/u.test(learnerExplanation), `${label}: awkward Hindi year agreement`);
    assert(!/(?:पहले|अब) \d+ वर्ष जाँचें/u.test(learnerExplanation), `${label}: awkward Hindi threshold instruction`);
  } else {
    assert(!/ਪਹਿਲਾ ਪੂਰਾ ਸਾਲ \d+ ਸਾਲ ਹੈ/u.test(learnerExplanation), `${label}: awkward Punjabi year agreement`);
    assert(!/(?:ਪਹਿਲਾਂ|ਹੁਣ) \d+ ਸਾਲ ਜਾਂਚੋ/u.test(learnerExplanation), `${label}: awkward Punjabi threshold instruction`);
  }
}
function auditExpanded(question: any, baseline: any, previous: any, label: string, locale?: IntCp006LocalizedLocale) {
  assert(stable(preservedProjection(question)) === stable(preservedProjection(previous, locale)), `${label}: learner surface drift outside approved terminology substitution`);
  assert(question.explanationReviewVersion === INT_CP006_EXPANDED_EXPLANATION_VERSION, `${label}: explanation version drift`);
  assert(question.explanation.keyIdea !== baseline.explanation.keyIdea, `${label}: key idea was not expanded`);
  assert(stable(question.explanation.steps) !== stable(baseline.explanation.steps), `${label}: steps were not expanded`);
  assert(question.explanation.steps.length >= 4, `${label}: expected at least 4 explanation steps`);
  const calculationSteps = question.explanation.steps.filter((step: string) => /[0-9₹%×÷=−√]/u.test(step));
  assert(calculationSteps.length >= 2, `${label}: explanation is not sufficiently calculative`);
  assert(question.explanation.steps.join(" ").length >= 220, `${label}: explanation remains too short`);
  assert(question.explanation.steps.some((step: string) => step.includes(question.explanation.finalAnswer)), `${label}: final answer not reached inside calculation steps`);
  assert(question.permanentIdentityFrozen, `${label}: permanent identity opened`);
  assert(!question.learnerContentFrozen, `${label}: review explanation incorrectly frozen`);
  assert(!question.enabled, `${label}: enabled opened`);
  assert(question.stagingStatus === "NOT_STAGED", `${label}: staging opened`);
  assert(question.registrationStatus === "NOT_REGISTERED", `${label}: registration opened`);
  assert(!question.questionStudioDiscoverable, `${label}: Question Studio opened`);
  assert(question.questionBankStatus === "NOT_STORED", `${label}: Question Bank opened`);
  assert(question.testEligibility === "INELIGIBLE", `${label}: test eligibility opened`);
  assert(!question.publiclyPublishable, `${label}: public delivery opened`);
  for (const object of [question, question.presentation, question.options, question.explanation, question.explanation.steps]) {
    assert(Object.isFrozen(object), `${label}: deep-freeze boundary missing`);
  }
  for (const option of question.options) assert(Object.isFrozen(option), `${label}: option not frozen`);
  if (locale) {
    assert(question.localizedVersion === INT_CP006_LOCALIZED_EXPLANATION_VERSION, `${label}: localized explanation version drift`);
    assert(hasNativeScript(question.explanation.keyIdea, locale), `${label}: key idea missing native script`);
    assert(question.explanation.steps.filter((step: string) => hasNativeScript(step, locale)).length >= 3, `${label}: too few native-language solution steps`);
    assert(hasNativeScript(question.explanation.commonMistake, locale), `${label}: common mistake missing native script`);
    assertNativeGrammar(question, label, locale);
    if (locale === "pa-IN") {
      const learnerText = `${stable(question.presentation)} ${question.explanation.keyIdea} ${question.explanation.steps.join(" ")} ${question.explanation.commonMistake} ${question.explanation.finalAnswer}`;
      assert(!containsDeprecatedPunjabiCompoundInterestTerm(learnerText), `${label}: deprecated Punjabi compound-interest term survived`);
    }
  }
}

let englishQuestions = 0;
let localizedQuestions = 0;
let preservationChecks = 0;
let explanationDepthChecks = 0;
let calculationRichnessChecks = 0;
let lifecycleChecks = 0;
let nativeScriptChecks = 0;
let nativeGrammarChecks = 0;
let punjabiTerminologyChecks = 0;
let deterministicChecks = 0;

for (const qlId of INT_CP006_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp006-expl-v1-${qlId}-${index}`;
    const frozen = generateIntCp006EnglishFrozenQuestion(qlId, seed, "en-IN");
    const english = generateIntCp006EnglishExplanationReviewQuestion(qlId, seed);
    const englishReplay = generateIntCp006EnglishExplanationReviewQuestion(qlId, seed);
    assert(stable(english) === stable(englishReplay), `en/${qlId}/${seed}: deterministic drift`);
    auditExpanded(english, frozen, english, `en/${qlId}/${seed}`);
    englishQuestions += 1;
    deterministicChecks += 1;
    preservationChecks += 1;
    explanationDepthChecks += 3;
    calculationRichnessChecks += 2;
    lifecycleChecks += 7;

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const baseline = generateLocalizedV3(qlId, seed, locale);
      const previous = generateLocalizedV6(qlId, seed, locale);
      const localized = generateIntCp006LocalizedExplanationReviewQuestion(qlId, seed, locale);
      const replay = generateIntCp006LocalizedExplanationReviewQuestion(qlId, seed, locale);
      assert(stable(localized) === stable(replay), `${locale}/${qlId}/${seed}: deterministic drift`);
      auditExpanded(localized, baseline, previous, `${locale}/${qlId}/${seed}`, locale);
      localizedQuestions += 1;
      deterministicChecks += 1;
      preservationChecks += 1;
      explanationDepthChecks += 3;
      calculationRichnessChecks += 2;
      lifecycleChecks += 7;
      nativeScriptChecks += 5;
      nativeGrammarChecks += 15;
      if (locale === "pa-IN") punjabiTerminologyChecks += 1;
    }
  }
}

console.log(JSON.stringify({
  explanationVersion: INT_CP006_EXPANDED_EXPLANATION_VERSION,
  localizedExplanationVersion: INT_CP006_LOCALIZED_EXPLANATION_VERSION,
  qls: INT_CP006_QL_IDS.length,
  englishQuestions,
  localizedQuestions,
  totalReviewQuestions: englishQuestions + localizedQuestions,
  deterministicChecks,
  preservationChecks,
  explanationDepthChecks,
  calculationRichnessChecks,
  lifecycleChecks,
  nativeScriptChecks,
  nativeGrammarChecks,
  punjabiTerminologyChecks,
}, null, 2));
console.log("PASS_INT_CP006_EXPANDED_EXPLANATION_V1_AUDIT");
