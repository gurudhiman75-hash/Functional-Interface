import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { validateTmwLearnerExplanationV2 } from "./foundation/learner-explanation-contract";
import { TMW_R4_SOURCE_GAP_REGISTRY } from "./foundation/source-gap-r4-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LANGUAGES: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const SAMPLE_SEEDS = Array.from({ length: 12 }, (_, index) => String(index));
const POSITION_SEEDS = Array.from({ length: 64 }, (_, index) => String(index));

function visible(question: any): string {
  return [question.stem, ...(question.options ?? []), question.learnerExplanation?.method ?? "", ...(question.learnerExplanation?.solution ?? []), question.learnerExplanation?.answer ?? ""].join(" ");
}

function assertSourceSemantic(question: any): void {
  const qlId = question.questionLanguageId as string;
  const text = visible(question);
  switch (qlId) {
    case "TMW-QL-212":
      assert(/more efficient|अधिक दक्ष|ਵੱਧ ਦੱਖ/i.test(text), `${qlId}: relative-efficiency cue missing`);
      break;
    case "TMW-QL-213":
      assert(/of a job|काम का|ਕੰਮ ਦਾ/i.test(text) && /\\frac/.test(text), `${qlId}: partial-work facts missing`);
      break;
    case "TMW-QL-214":
      assert(/pages|पृष्ठ|ਸਫ਼ੇ/i.test(text), `${qlId}: explicit-output target missing`);
      break;
    case "TMW-QL-215":
      assert(/before the job is completed|काम पूरा होने से|ਕੰਮ ਮੁਕੰਮਲ ਹੋਣ ਤੋਂ/i.test(text), `${qlId}: end-relative event cue missing`);
      break;
    case "TMW-QL-216":
      assert(/then A leaves|फिर A चला जाता|ਫਿਰ A ਚਲਾ ਜਾਂਦਾ/i.test(text), `${qlId}: combined-then-solo stage missing`);
      break;
    case "TMW-QL-217":
      assert(/more workers|कर्मचारी और|ਕਰਮਚਾਰੀ ਹੋਰ/i.test(text) && /earlier|कम समय|ਘੱਟ ਸਮੇਂ/i.test(text), `${qlId}: delta-workforce/delta-time contract missing`);
      break;
    case "TMW-QL-218":
      assert(/workers leave|कर्मचारी चले जाते|ਕਰਮਚਾਰੀ ਚਲੇ ਜਾਂਦੇ/i.test(text), `${qlId}: workforce leave event missing`);
      break;
    case "TMW-QL-219":
      assert(/men|पुरुष|ਮਰਦ/i.test(text) && /women|महिल|ਔਰਤ/i.test(text) && /crew changes|दल बदल|ਟੀਮ ਬਦਲ/i.test(text), `${qlId}: heterogeneous in-job replacement missing`);
      break;
    case "TMW-QL-220":
      assert(/paid|भुगतान|ਭੁਗਤਾਨ/i.test(text) && /together|साथ|ਮਿਲ ਕੇ/i.test(text), `${qlId}: wage-share to joint-time contract missing`);
      break;
    case "TMW-QL-221":
      assert(/A\+B\+C/i.test(text) && /B\+C\+D/i.test(text) && /A\+D/i.test(text), `${qlId}: overlapping pipe subsets missing`);
      break;
    case "TMW-QL-222":
      assert(/same rate as B and C together|उतनी ही तेज़ी|ਉਨੀ ਹੀ ਦਰ/i.test(text), `${qlId}: subgroup-equivalence constraint missing`);
      break;
    case "TMW-QL-223":
      assert(/A\+B/i.test(text) && /B\+C/i.test(text) && /A\+C/i.test(text) && /ratio|अनुपात|ਅਨੁਪਾਤ/i.test(text), `${qlId}: pairwise-time ratio target missing`);
      break;
    case "TMW-QL-224":
      assert(/men|पुरुष|ਮਰਦ/i.test(text) && /women|महिल|ਔਰਤ/i.test(text), `${qlId}: mixed-crew linear-system context missing`);
      break;
    case "TMW-QL-225":
      assert(/another|भाग और|ਹੋਰ/i.test(text) && /additional women|अतिरिक्त महिल|ਵਾਧੂ ਔਰਤ/i.test(text), `${qlId}: staged heterogeneous progress target missing`);
      break;
    case "TMW-QL-226":
      assert(/helper C|सहायक C|ਸਹਾਇਕ C/i.test(text) && /share|हिस्सा|ਹਿੱਸਾ/i.test(text), `${qlId}: helper contribution/payment target missing`);
      break;
    case "TMW-QL-227":
      assert(/had worked together from the start|शुरू से साथ|ਸ਼ੁਰੂ ਤੋਂ ਮਿਲ/i.test(text), `${qlId}: hypothetical combined-time target missing`);
      break;
    case "TMW-QL-228":
      assert(/dropped out|काम छोड़ते|ਕੰਮ ਛੱਡਦੇ/i.test(text), `${qlId}: daily attrition schedule missing`);
      break;
    case "TMW-QL-229":
      assert(/half the job|आधा काम|ਅੱਧਾ ਕੰਮ/i.test(text) && /more efficient|अधिक दक्ष|ਵੱਧ ਦੱਖ/i.test(text), `${qlId}: half-handoff inverse contract missing`);
      break;
  }
}

function assertPackage(question: any, language: Tmw001ChapterLanguage, seed: string): void {
  const label = `${question.questionLanguageId}:${language}:${seed}`;
  assert(question.validation?.valid, `${label}: validation failed: ${(question.validation?.errors ?? []).join(" | ")}`);
  assert(question.publiclyPublishable === false, `${label}: publication lock changed`);
  assert(question.learnerExplanationVersion === "TMW_LEARNER_V2", `${label}: learner V2 missing`);
  assert(question.options?.length === 4, `${label}: expected four options`);
  assert(new Set(question.options).size === 4, `${label}: options are not unique`);
  assert(question.correctIndex >= 0 && question.correctIndex < 4, `${label}: invalid correct index`);
  assert(question.options[question.correctIndex] === question.solution.answerText, `${label}: correct option != solved answer`);
  assert(question.optionAudit?.filter((option: any) => option.misconceptionId === "CORRECT").length === 1, `${label}: exactly one CORRECT audit entry required`);
  assert(question.optionAudit?.filter((option: any) => option.misconceptionId !== "CORRECT").every((option: any) => option.misconceptionId && !/^WRONG_?\d*$/i.test(option.misconceptionId)), `${label}: distractors must be misconception-labelled`);
  assert(["CORE_EXAM_PATTERN", "UPPER_EXAM_PRACTICE", "ADVANCED_ENRICHMENT"].includes(question.examTier), `${label}: exam tier missing`);
  const learnerErrors = validateTmwLearnerExplanationV2(question.learnerExplanation);
  assert(learnerErrors.length === 0, `${label}: learner contract failed: ${learnerErrors.join(" | ")}`);
  assert(question.learnerExplanation.solution.length >= 2 && question.learnerExplanation.solution.length <= 5, `${label}: learner solution length invalid`);
  assert(question.learnerExplanation.solution.slice(0, -1).some((step: string) => /\\\([\s\S]*\d[\s\S]*\\\)/.test(step)), `${label}: no numeric calculation before conclusion`);
  if (question.answerType === "COUNT") assert(question.solution.answer.denominator === 1, `${label}: count answer is fractional`);
  if (language === "hi") assert(/[\u0900-\u097F]/.test(visible(question)), `${label}: Hindi output lacks Devanagari`);
  if (language === "pa") assert(/[\u0A00-\u0A7F]/.test(visible(question)), `${label}: Punjabi output lacks Gurmukhi`);
  assertSourceSemantic(question);
}

let sampledCases = 0;
for (const entry of TMW_R4_SOURCE_GAP_REGISTRY) {
  const fingerprints = new Set<string>();
  for (const seedSuffix of SAMPLE_SEEDS) {
    const parity: Array<{ key: string; fingerprint: string }> = [];
    for (const language of LANGUAGES) {
      const seed = `tmw-r4-source-gap:${entry.qlId}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: entry.qlId, language, seed });
      assertPackage(question, language, seed);
      parity.push({ key: question.solution.answerKey, fingerprint: question.mathematicalFingerprint });
      if (language === "en") fingerprints.add(question.mathematicalFingerprint);
      sampledCases += 1;
    }
    assert(new Set(parity.map((row) => row.key)).size === 1, `${entry.qlId}:${seedSuffix}: multilingual solved-answer parity failed`);
    assert(new Set(parity.map((row) => row.fingerprint)).size === 1, `${entry.qlId}:${seedSuffix}: multilingual mathematical-state parity failed`);
  }
  assert(fingerprints.size >= 3, `${entry.qlId}: only ${fingerprints.size} distinct mathematical fingerprints across ${SAMPLE_SEEDS.length} seeds`);

  const positions = new Set<number>();
  for (const seedSuffix of POSITION_SEEDS) {
    const seed = `tmw-r4-position:${entry.qlId}:${seedSuffix}`;
    const question = runTmw001ChapterPipeline({ questionLanguageId: entry.qlId, language: "en", seed });
    assert(question.validation?.valid, `${entry.qlId}:${seed}: position sweep generated invalid package`);
    positions.add(question.correctIndex);
  }
  assert(positions.size === 4, `${entry.qlId}: correct-answer position does not reach all A-D slots; reached ${[...positions].sort().join(",")}`);
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  remediation: "R4-source-gap-extension",
  qls: TMW_R4_SOURCE_GAP_REGISTRY.length,
  languages: LANGUAGES.length,
  sampledSeedsPerQl: SAMPLE_SEEDS.length,
  sampledCases,
  positionSeedsPerQl: POSITION_SEEDS.length,
  positionCases: TMW_R4_SOURCE_GAP_REGISTRY.length * POSITION_SEEDS.length,
  verdict: "PASS",
}, null, 2));
