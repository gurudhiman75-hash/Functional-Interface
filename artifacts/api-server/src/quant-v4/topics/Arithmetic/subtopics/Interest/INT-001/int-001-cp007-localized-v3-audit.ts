import assert from "node:assert/strict";
import { generateIntCp007EnglishFrozenQuestion } from "./cp007-scheme-equivalence-english-v8-frozen";
import { generateIntCp007LocalizedReviewQuestion as generateV2 } from "./cp007-scheme-equivalence-localized-v2";
import {
  INT_CP007_LOCALIZED_VERSION,
  INT_CP007_LOCALIZED_V3_SUPERSEDES,
  containsDeprecatedPunjabiCompoundInterestTerm,
  generateIntCp007LocalizedReviewQuestion as generateV3,
} from "./cp007-scheme-equivalence-localized-v3";
import { INT_CP007_QL_IDS } from "./cp007-scheme-equivalence-runtime-v3-final";

const LOCALES = Object.freeze(["hi-IN", "pa-IN"] as const);

function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? `${item}n` : item);
}

function learnerText(question: any): string {
  return [question.presentation.markdown, question.presentation.prompt, ...question.options.map((o: any) => o.text), question.explanation.keyIdea, ...question.explanation.steps, question.explanation.finalAnswer, question.explanation.commonMistake].join("\n");
}

function preservedPayload(question: any): unknown {
  return {
    id: question.id,
    runtimeVersion: question.runtimeVersion,
    checkpointId: question.checkpointId,
    qlId: question.qlId,
    locale: question.locale,
    seed: question.seed,
    mathematicalState: question.mathematicalState,
    answerSemantic: question.answerSemantic,
    options: question.options,
    correctIndex: question.correctIndex,
    correctAnswer: question.correctAnswer,
    sourceEnglishFreezeId: question.sourceEnglishFreezeId,
    sourceEnglishFreezeApproval: question.sourceEnglishFreezeApproval,
    enabled: question.enabled,
    stagingStatus: question.stagingStatus,
    registrationStatus: question.registrationStatus,
    questionStudioDiscoverable: question.questionStudioDiscoverable,
    questionBankStatus: question.questionBankStatus,
    testEligibility: question.testEligibility,
    publiclyPublishable: question.publiclyPublishable,
    permanentIdentityFrozen: question.permanentIdentityFrozen,
    learnerContentFrozen: question.learnerContentFrozen,
  };
}

const mathSegments = (text: string): string[] => text.match(/\$[^$]+\$/gu) ?? [];
const stripMath = (text: string): string => text.replace(/\$[^$]+\$/gu, " ");
const DEVANAGARI_CONTENT_RE = /[\u0900-\u0963\u0966-\u097F]/u;

const BANNED_HI = Object.freeze([
  "के लिए के अनुसार",
  "जिसमें ब्याज हर वर्ष मूलधन में जुड़ता है लागू है",
  "दो प्रारंभिक मूलधन",
  "समान दिखने वाली दरों पर भी",
  "भविष्य राशि",
  "पहला आगे निकलने वाला वर्ष साबित",
  "तो $P$ और इसलिए",
  "और $20\\%$ मिलता है",
]);
const BANNED_PA = Object.freeze([
  "ਲਈ ਅਨੁਸਾਰ",
  "ਜਿਸ ਵਿੱਚ ਵਿਆਜ ਹਰ ਸਾਲ ਮੂਲ ਵਿੱਚ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ ਲਾਗੂ ਹੈ",
  "ਦੋ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ",
  "ਇੱਕੋ ਜਿਹੀਆਂ ਲੱਗਣ ਵਾਲੀਆਂ ਦਰਾਂ ਤੇ ਵੀ",
  "ਭਵਿੱਖੀ ਰਕਮ",
  "ਸਾਲ ਸਾਬਤ ਕਰਨ ਲਈ",
  "ਤਾਂ $P$ ਅਤੇ ਇਸ ਲਈ",
]);
const BANNED_ENGLISH = Object.freeze([
  "Scheme ", "Plan ", "simple interest", "compound interest", "growth factor", "maturity amount",
  "present principal", "future value", "Common mistake", "Cannot be determined", "undefined", "null",
]);

let questions = 0;
let deterministicChecks = 0;
let preservationChecks = 0;
let changedQuestions = 0;
let mathReuseChecks = 0;
let nativeLanguageChecks = 0;
let terminologyChecks = 0;
let editorialChecks = 0;
let targetedExplanationChecks = 0;
let lifecycleChecks = 0;
let deepFreezeChecks = 0;
const changedByQl = new Map<string, number>();

assert.equal(INT_CP007_LOCALIZED_V3_SUPERSEDES, "INT-CP-007-HI-PA-v2-native-review");

for (const qlId of INT_CP007_QL_IDS) {
  for (let index = 0; index < 200; index += 1) {
    const seed = `int-cp007-localized-v3-${qlId}-${index}`;
    const english = generateIntCp007EnglishFrozenQuestion(qlId, seed) as any;
    const englishMath = new Set(mathSegments(learnerText(english)));

    for (const locale of LOCALES) {
      const before = generateV2(qlId, seed, locale) as any;
      const after = generateV3(qlId, seed, locale) as any;
      const replay = generateV3(qlId, seed, locale) as any;
      const beforeText = learnerText(before);
      const afterText = learnerText(after);
      const proseOnly = stripMath(afterText);

      assert.equal(stableJson(replay), stableJson(after), `${qlId}/${seed}/${locale}: V3 replay is not deterministic`);
      deterministicChecks += 1;
      assert.equal(stableJson(preservedPayload(after)), stableJson(preservedPayload(before)), `${qlId}/${seed}/${locale}: V3 changed protected semantics/lifecycle`);
      preservationChecks += 1;

      if (afterText !== beforeText) {
        changedQuestions += 1;
        changedByQl.set(qlId, (changedByQl.get(qlId) ?? 0) + 1);
      }

      for (const segment of mathSegments(afterText)) {
        assert.ok(englishMath.has(segment) || segment === "$x$" || segment === "$P$", `${qlId}/${seed}/${locale}: V3 math is not reused from approved English: ${segment}`);
        mathReuseChecks += 1;
      }
      assert.ok(!stripMath(after.explanation.steps.join("\n")).includes("="), `${qlId}/${seed}/${locale}: raw equation leaked outside LaTeX`);
      assert.ok(!afterText.includes("$undefined$"), `${qlId}/${seed}/${locale}: undefined math leaked`);
      assert.ok(!afterText.includes("undefined"), `${qlId}/${seed}/${locale}: undefined text leaked`);
      assert.ok(!afterText.includes("  "), `${qlId}/${seed}/${locale}: doubled whitespace`);
      editorialChecks += 4;

      for (const banned of BANNED_ENGLISH) {
        assert.ok(!proseOnly.includes(banned), `${qlId}/${seed}/${locale}: English learner phrase leaked: ${banned}`);
        nativeLanguageChecks += 1;
      }
      const languageBans = locale === "hi-IN" ? BANNED_HI : BANNED_PA;
      for (const banned of languageBans) {
        assert.ok(!afterText.includes(banned), `${qlId}/${seed}/${locale}: V3 retained blocked editorial phrase: ${banned}`);
        editorialChecks += 1;
      }

      if (locale === "hi-IN") {
        assert.match(proseOnly, DEVANAGARI_CONTENT_RE, `${qlId}/${seed}: Hindi content lacks Devanagari`);
        assert.ok(!/[\u0A00-\u0A7F]/u.test(proseOnly), `${qlId}/${seed}: Gurmukhi leaked into Hindi`);
      } else {
        assert.match(proseOnly, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi content lacks Gurmukhi`);
        assert.ok(!DEVANAGARI_CONTENT_RE.test(proseOnly), `${qlId}/${seed}: Devanagari letters/digits leaked into Punjabi`);
        assert.ok(!containsDeprecatedPunjabiCompoundInterestTerm(proseOnly), `${qlId}/${seed}: deprecated Punjabi CI term leaked`);
        terminologyChecks += 1;
      }
      nativeLanguageChecks += 2;

      if (qlId === "INT-QL-111") {
        const step = after.explanation.steps[4] as string;
        assert.equal(mathSegments(step).length, 1, `${qlId}/${seed}/${locale}: V3 final rate step must contain one non-duplicated math result`);
        assert.ok(!/और\s+\$|ਅਤੇ\s+\$/u.test(step), `${qlId}/${seed}/${locale}: duplicate rate result connective remains`);
        targetedExplanationChecks += 2;
      }
      if (qlId === "INT-QL-115") {
        const step = after.explanation.steps[3] as string;
        const math = mathSegments(step);
        assert.equal(math.length, 3, `${qlId}/${seed}/${locale}: V3 principal equation step must contain variable, equation and solved result`);
        assert.ok(math[1]?.includes("\\times"), `${qlId}/${seed}/${locale}: V3 missing principal-times-factor equation`);
        assert.ok(math[2]?.includes("\\frac"), `${qlId}/${seed}/${locale}: V3 missing solved principal fraction`);
        targetedExplanationChecks += 3;
      }

      assert.equal(after.localizedVersion, INT_CP007_LOCALIZED_VERSION);
      assert.equal(after.permanentIdentityFrozen, true);
      assert.equal(after.learnerContentFrozen, false);
      assert.equal(after.enabled, false);
      assert.equal(after.stagingStatus, "NOT_STAGED");
      assert.equal(after.registrationStatus, "NOT_REGISTERED");
      assert.equal(after.questionStudioDiscoverable, false);
      assert.equal(after.questionBankStatus, "NOT_STORED");
      assert.equal(after.testEligibility, "INELIGIBLE");
      assert.equal(after.publiclyPublishable, false);
      lifecycleChecks += 10;

      assert.ok(Object.isFrozen(after));
      assert.ok(Object.isFrozen(after.presentation));
      assert.ok(Object.isFrozen(after.options));
      assert.ok(Object.isFrozen(after.explanation));
      assert.ok(Object.isFrozen(after.explanation.steps));
      deepFreezeChecks += 5;
      questions += 1;
    }
  }
}

for (const qlId of INT_CP007_QL_IDS) assert.ok((changedByQl.get(qlId) ?? 0) > 0, `${qlId}: V3 did not exercise editorial polish`);

console.log(JSON.stringify({
  localizedVersion: INT_CP007_LOCALIZED_VERSION,
  supersedes: INT_CP007_LOCALIZED_V3_SUPERSEDES,
  qls: INT_CP007_QL_IDS.length,
  locales: LOCALES,
  questions,
  deterministicChecks,
  preservationChecks,
  changedQuestions,
  changedByQl: Object.fromEntries(changedByQl),
  mathReuseChecks,
  nativeLanguageChecks,
  terminologyChecks,
  editorialChecks,
  targetedExplanationChecks,
  lifecycleChecks,
  deepFreezeChecks,
  permanentIdentityFrozen: true,
  learnerContentFrozen: false,
  learnerDeliveryAuthorized: false,
}, null, 2));
console.log("PASS_INT_CP007_LOCALIZED_V3_AUDIT");
