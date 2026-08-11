import {
  listPrb001QuestionEntries,
  runPrb001Pipeline,
  type Prb001CanonicalProblemId,
} from "./PRB-001";
import {
  getPrb001NativeEditorialEntry,
  localizePrb001NativeBindingValue,
} from "./PRB-001/native-editorial";
import {
  listPrb002QuestionEntries,
  runPrb002Pipeline,
  type Prb002CanonicalProblemId,
} from "./PRB-002";
import {
  getPrb002NativeEditorialEntry,
  localizePrb002NativeBindingValue,
} from "./PRB-002/native-editorial";
import type { ProbabilityNativeLanguage } from "./multilingual-foundation";
import {
  assertProbabilityNativeTextValid,
  getProbabilityNativeTerm,
} from "./native-language-primitives";
import { renderProbabilityMathText } from "./shared/math-text";
import { renderNativeStudentFacingStem } from "./shared/native-exam-style-bridge";
import { renderNativeStudentFacingStem } from "./shared/native-exam-style-bridge";
import { renderNativeStudentFacingStem } from "./shared/native-exam-style-bridge";
import { renderNativeStudentFacingStem } from "./shared/native-exam-style-bridge";
import { rational, rationalText } from "./shared/rational";
import type {
  ProbabilityCanonicalProblemId,
  ProbabilityGenerationInput,
  ProbabilityPackageId,
  ProbabilityQuestion,
  ProbabilityVisual,
  ValidationCheck,
  ValidationResult,
} from "./shared/types";

export const PROBABILITY_NATIVE_PREVIEW_STATUS =
  "DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW" as const;

export type ProbabilityNativePreviewStatus = typeof PROBABILITY_NATIVE_PREVIEW_STATUS;

export type ProbabilityNativePresentation = Readonly<{
  language: ProbabilityNativeLanguage;
  localizedQuestionId: string;
  localizedExplanationId: string;
  sourceQuestionId: string;
  sourceExplanationId: string;
  qlId: string;
  eventWording: string;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: Readonly<{
    lines: readonly string[];
    wordCount: number;
    visuals: readonly ProbabilityVisual[];
  }>;
  validation: ValidationResult;
  localizationStatus: ProbabilityNativePreviewStatus;
  questionStudioEnabled: false;
  publiclyPublishable: false;
}>;

export type ProbabilityMultilingualPreview = Readonly<{
  source: ProbabilityQuestion;
  presentation: ProbabilityNativePresentation;
  parity: Readonly<{
    sourceLanguage: "en";
    targetLanguage: ProbabilityNativeLanguage;
    sourceSeed: string;
    sourceQuestionLanguageId: string;
    parameterFingerprint: string;
    mathematicalFingerprint: string;
    optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX";
    answerKeyAuthority: "ENGLISH_RUNTIME";
    solverAuthority: "ENGLISH_RUNTIME";
    mockPolicyAuthority: "ENGLISH_RUNTIME";
    exactOptionsPreserved: true;
    answerPreserved: true;
    correctIndexPreserved: true;
  }>;
}>;

type NativeEditorial = Readonly<{
  qlId: string;
  eventWording: string;
  stemTemplate: string;
  explanation: Readonly<{
    approach: string;
    workingLead: string;
    keyPoint: string;
    answerLabel: string;
  }>;
}>;

type NativeBindingLocalizer = (
  key: string,
  value: unknown,
  language: ProbabilityNativeLanguage,
  qlId: string,
) => string;

function sourceExplanationId(source: ProbabilityQuestion): string {
  return source.explanation.explanationId;
}

function scalar(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value ?? "");
}

function numberParameter(parameters: Record<string, unknown>, key: string): number | undefined {
  const value = parameters[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function buildNativeRenderContext(source: ProbabilityQuestion): Record<string, string> {
  const parameters = source.parameters;
  const context: Record<string, string> = Object.fromEntries(
    Object.entries(parameters).map(([key, value]) => [key, scalar(value)]),
  );
  context.answer = source.answer;

  const evidence = (source.solver.evidence ?? {}) as Record<string, unknown>;
  const totalOutcomeCount = evidence.totalOutcomeCount;
  const favourableOutcomeCount = evidence.favourableOutcomeCount;
  if (totalOutcomeCount !== undefined) context.totalOutcomes = String(totalOutcomeCount);
  if (favourableOutcomeCount !== undefined) context.favourableOutcomes = String(favourableOutcomeCount);

  if (totalOutcomeCount !== undefined && favourableOutcomeCount !== undefined) {
    context.probability = rationalText(rational(BigInt(String(favourableOutcomeCount)), BigInt(String(totalOutcomeCount))));
  }

  const probabilityNumerator = numberParameter(parameters, "probabilityNumerator");
  const probabilityDenominator = numberParameter(parameters, "probabilityDenominator");
  if (probabilityNumerator !== undefined && probabilityDenominator !== undefined) {
    context.probability = rationalText(rational(probabilityNumerator, probabilityDenominator));
  }

  const givenNumerator = numberParameter(parameters, "givenNumerator");
  const givenDenominator = numberParameter(parameters, "givenDenominator");
  if (givenNumerator !== undefined && givenDenominator !== undefined) {
    context.givenProbability = rationalText(rational(givenNumerator, givenDenominator));
  }

  const red = numberParameter(parameters, "red");
  const blue = numberParameter(parameters, "blue");
  if (red !== undefined && blue !== undefined) context.urnTotal = String(red + blue);

  const men = numberParameter(parameters, "men");
  const women = numberParameter(parameters, "women");
  if (men !== undefined && women !== undefined) context.population = String(men + women);

  const total = numberParameter(parameters, "total");
  const aCount = numberParameter(parameters, "aCount");
  const bCount = numberParameter(parameters, "bCount");
  const overlap = numberParameter(parameters, "overlap");
  if (total !== undefined && aCount !== undefined) context.pA = rationalText(rational(aCount, total));
  if (total !== undefined && bCount !== undefined) context.pB = rationalText(rational(bCount, total));
  if (total !== undefined && overlap !== undefined) {
    context.pIntersection = rationalText(rational(overlap, total));
    if (aCount !== undefined && bCount !== undefined) {
      context.pUnion = rationalText(rational(aCount + bCount - overlap, total));
    }
  }

  const aNumerator = numberParameter(parameters, "aNumerator");
  const aDenominator = numberParameter(parameters, "aDenominator");
  if (aNumerator !== undefined && aDenominator !== undefined) {
    context.pA = rationalText(rational(aNumerator, aDenominator));
  }
  const bNumerator = numberParameter(parameters, "bNumerator");
  const bDenominator = numberParameter(parameters, "bDenominator");
  if (bNumerator !== undefined && bDenominator !== undefined) {
    context.pB = rationalText(rational(bNumerator, bDenominator));
  }

  return context;
}

function resolveNativeEditorial(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): Readonly<{
  editorial: NativeEditorial;
  localizeBinding: NativeBindingLocalizer;
}> {
  if (source.packageId === "PRB-001") {
    return {
      editorial: getPrb001NativeEditorialEntry(source.questionLanguageId, language),
      localizeBinding: localizePrb001NativeBindingValue,
    };
  }
  return {
    editorial: getPrb002NativeEditorialEntry(source.questionLanguageId, language),
    localizeBinding: localizePrb002NativeBindingValue,
  };
}

function renderNativeStem(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string {
  const stem = renderProbabilityMathText(renderNativeStudentFacingStem(source, language));
  assertProbabilityNativeTextValid(stem, language);
  return stem;
}

function localizedEquation(source: ProbabilityQuestion): string {
  const equation = String(source.solver.equation ?? source.answer).trim();
  if (!equation) return `\\(${source.answer}\\)`;
  return `\\(${equation}\\)`;
}

function explanationWordCount(lines: readonly string[]): number {
  return lines.join(" ").trim().split(/\s+/u).filter(Boolean).length;
}

function nativeReplacementLabel(source: ProbabilityQuestion, language: ProbabilityNativeLanguage): string {
  const policy = source.experiment.replacementPolicy;
  if (policy === "WITH_REPLACEMENT") return getProbabilityNativeTerm("WITH_REPLACEMENT", language);
  if (policy === "WITHOUT_REPLACEMENT") return getProbabilityNativeTerm("WITHOUT_REPLACEMENT", language);
  return language === "hi" ? "पुनःस्थापन लागू नहीं" : "ਵਾਪਸ ਰੱਖਣ ਦੀ ਸ਼ਰਤ ਲਾਗੂ ਨਹੀਂ";
}

function localizePatternLeaf(value: string, language: ProbabilityNativeLanguage): string {
  if (!/^[HT]+$/u.test(value)) return value;
  const head = getProbabilityNativeTerm("HEAD", language);
  const tail = getProbabilityNativeTerm("TAIL", language);
  return [...value].map((token) => token === "H" ? head : tail).join("-");
}

function localizeNativeVisual(
  visual: ProbabilityVisual,
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  eventWording: string,
): ProbabilityVisual {
  const data: Record<string, unknown> = { ...visual.data };
  if ("event" in data) data.event = eventWording;
  if ("replacementPolicy" in data) data.replacementPolicy = nativeReplacementLabel(source, language);
  if (Array.isArray(data.leaves)) data.leaves = data.leaves.map((item) => localizePatternLeaf(String(item), language));

  let title: string;
  let altText: string;
  switch (visual.strategyId) {
    case "TWO_DICE_OUTCOME_GRID":
      title = language === "hi" ? "दो पासों के क्रमित परिणाम" : "ਦੋ ਪਾਸਿਆਂ ਦੇ ਕ੍ਰਮਿਤ ਨਤੀਜੇ";
      altText = language === "hi"
        ? `6 × 6 क्रमित पासा-परिणामों का ग्रिड, जिसमें ${eventWording} दर्शाया गया है।`
        : `6 × 6 ਕ੍ਰਮਿਤ ਪਾਸਾ-ਨਤੀਜਿਆਂ ਦਾ ਗ੍ਰਿਡ, ਜਿਸ ਵਿੱਚ ${eventWording} ਦਰਸਾਇਆ ਗਿਆ ਹੈ।`;
      break;
    case "COIN_OUTCOME_TREE": {
      const tosses = String(data.tosses ?? "");
      const leaves = Array.isArray(data.leaves) ? data.leaves.length : "";
      title = language === "hi" ? "सिक्का परिणाम वृक्ष" : "ਸਿੱਕਾ ਨਤੀਜਾ ਦਰੱਖਤ";
      altText = language === "hi"
        ? `${tosses} सिक्का उछालों के ${leaves} क्रमित परिणामों का शाखा-वृक्ष।`
        : `${tosses} ਸਿੱਕਾ ਉਛਾਲਾਂ ਦੇ ${leaves} ਕ੍ਰਮਿਤ ਨਤੀਜਿਆਂ ਦਾ ਸ਼ਾਖਾ-ਦਰੱਖਤ।`;
      break;
    }
    case "SUCCESSIVE_DRAW_TREE":
      title = language === "hi" ? "क्रमिक ड्रॉ प्रायिकता वृक्ष" : "ਲਗਾਤਾਰ ਡਰਾਅ ਸੰਭਾਵਨਾ ਦਰੱਖਤ";
      altText = language === "hi"
        ? `दो चरणों का ड्रॉ-वृक्ष; शर्त: ${nativeReplacementLabel(source, language)}।`
        : `ਦੋ ਪੜਾਅਵਾਂ ਦਾ ਡਰਾਅ-ਦਰੱਖਤ; ਸ਼ਰਤ: ${nativeReplacementLabel(source, language)}।`;
      break;
    case "VENN_EVENT_REGIONS":
      title = language === "hi" ? "दो घटनाओं का क्षेत्र मॉडल" : "ਦੋ ਘਟਨਾਵਾਂ ਦਾ ਖੇਤਰ ਮਾਡਲ";
      altText = language === "hi"
        ? `दो वृत्तों का वेन मॉडल, जिसमें ${eventWording} से संबंधित क्षेत्र दिखाए गए हैं।`
        : `ਦੋ ਚੱਕਰਾਂ ਦਾ ਵੇਨ ਮਾਡਲ, ਜਿਸ ਵਿੱਚ ${eventWording} ਨਾਲ ਸੰਬੰਧਿਤ ਖੇਤਰ ਦਰਸਾਏ ਗਏ ਹਨ।`;
      break;
    case "CARD_DECK_SUMMARY":
      title = language === "hi" ? "मानक ताश-गड्डी सारांश" : "ਮਿਆਰੀ ਤਾਸ਼-ਗੱਡੀ ਸਾਰ";
      altText = language === "hi"
        ? "52 पत्तों की मानक गड्डी की आवश्यक गणनाओं का सारांश।"
        : "52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਗੱਡੀ ਦੀਆਂ ਲੋੜੀਂਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਸਾਰ।";
      break;
    case "URN_COMPOSITION_DISPLAY":
      title = language === "hi" ? "बैग में गेंदों की संरचना" : "ਬੈਗ ਵਿੱਚ ਗੇਂਦਾਂ ਦੀ ਬਣਤਰ";
      altText = language === "hi"
        ? `${String(data.red ?? "")} लाल और ${String(data.blue ?? "")} नीली गेंदों वाला चयन-चित्र।`
        : `${String(data.red ?? "")} ਲਾਲ ਅਤੇ ${String(data.blue ?? "")} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਵਾਲਾ ਚੋਣ-ਚਿੱਤਰ।`;
      break;
    default:
      throw new Error(`ML-05 native visual is fail-closed for strategy ${visual.strategyId}.`);
  }

  assertProbabilityNativeTextValid(title, language);
  assertProbabilityNativeTextValid(altText, language);
  return { ...visual, title, altText, data };
}

function renderNativeExplanation(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  editorial: NativeEditorial,
): ProbabilityNativePresentation["explanation"] {
  const approachLabel = getProbabilityNativeTerm("APPROACH", language);
  const workingLabel = getProbabilityNativeTerm("WORKING", language);
  const keyPointLabel = getProbabilityNativeTerm("KEY_POINT", language);
  const finalAnswerLabel = getProbabilityNativeTerm("FINAL_ANSWER", language);
  const lines = [
    `${approachLabel}: ${editorial.explanation.approach}`,
    `${workingLabel}: ${editorial.explanation.workingLead}`,
    `${workingLabel}: ${localizedEquation(source)}`,
    `${keyPointLabel}: ${editorial.explanation.keyPoint}`,
    `${finalAnswerLabel}: ${source.answer}`,
  ].map(renderProbabilityMathText);

  for (const line of lines) assertProbabilityNativeTextValid(line, language);
  const visuals = source.explanation.visuals.map((visual) =>
    localizeNativeVisual(visual, source, language, editorial.eventWording));
  return { lines, wordCount: explanationWordCount(lines), visuals };
}

function buildNativeValidation(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
  stem: string,
  explanation: ProbabilityNativePresentation["explanation"],
  options: readonly string[],
  correctIndex: number,
  answer: string,
): ValidationResult {
  const checks: ValidationCheck[] = [
    {
      name: "english-source-validation",
      passed: source.validation.valid,
      message: source.validation.valid ? "English authority is valid." : "English authority failed validation.",
      blocker: true,
    },
    {
      name: "native-stem-script-and-placeholder-audit",
      passed: true,
      message: `${language} stem passed native script and unresolved-placeholder audit.`,
      blocker: true,
    },
    {
      name: "native-explanation-script-audit",
      passed: true,
      message: `${language} explanation passed native script audit.`,
      blocker: true,
    },
    {
      name: "option-byte-parity",
      passed: options.length === source.options.length && options.every((option, index) => option === source.options[index]),
      message: "Native preview preserves English-runtime options byte-for-byte.",
      blocker: true,
    },
    {
      name: "answer-key-parity",
      passed: correctIndex === source.correctIndex && answer === source.answer && options[correctIndex] === source.options[source.correctIndex],
      message: "Native preview preserves the English-runtime answer and correct index.",
      blocker: true,
    },
    {
      name: "native-release-lock",
      passed: true,
      message: "Native preview remains draft-only; Question Studio and public publication are disabled.",
      blocker: true,
    },
  ];

  // The assertions above guarantee these checks before a preview can be returned.
  assertProbabilityNativeTextValid(stem, language);
  for (const line of explanation.lines) assertProbabilityNativeTextValid(line, language);
  for (const visual of explanation.visuals) {
    assertProbabilityNativeTextValid(visual.title, language);
    assertProbabilityNativeTextValid(visual.altText, language);
  }
  return { valid: checks.every((check) => check.passed || !check.blocker), checks };
}

export function renderProbabilityNativePreview(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): ProbabilityMultilingualPreview {
  if (source.language !== "en") {
    throw new Error("ML-05 requires an English Probability source question.");
  }
  if (!source.validation.valid) {
    throw new Error(`ML-05 refuses to localize invalid English source ${source.questionLanguageId}.`);
  }

  const { editorial } = resolveNativeEditorial(source, language);
  if (editorial.qlId !== source.questionLanguageId) {
    throw new Error(`ML-05 editorial/source QL mismatch for ${source.questionLanguageId}/${language}.`);
  }

  const stem = renderNativeStem(source, language);
  const options = Object.freeze([...source.options]);
  const answer = source.answer;
  const correctIndex = source.correctIndex;
  const explanation = renderNativeExplanation(source, language, editorial);
  const validation = buildNativeValidation(source, language, stem, explanation, options, correctIndex, answer);
  if (!validation.valid) {
    throw new Error(`ML-05 native preview parity validation failed for ${source.questionLanguageId}/${language}.`);
  }

  const englishExplanationId = sourceExplanationId(source);
  const presentation: ProbabilityNativePresentation = {
    language,
    localizedQuestionId: `${source.questionId}-${language}`,
    localizedExplanationId: `${englishExplanationId}-${language}`,
    sourceQuestionId: source.questionId,
    sourceExplanationId: englishExplanationId,
    qlId: source.questionLanguageId,
    eventWording: editorial.eventWording,
    stem,
    options,
    correctIndex,
    answer,
    explanation,
    validation,
    localizationStatus: PROBABILITY_NATIVE_PREVIEW_STATUS,
    questionStudioEnabled: false,
    publiclyPublishable: false,
  };

  return {
    source,
    presentation,
    parity: {
      sourceLanguage: "en",
      targetLanguage: language,
      sourceSeed: source.seed,
      sourceQuestionLanguageId: source.questionLanguageId,
      parameterFingerprint: source.parameterFingerprint,
      mathematicalFingerprint: source.mathematicalFingerprint,
      optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX",
      answerKeyAuthority: "ENGLISH_RUNTIME",
      solverAuthority: "ENGLISH_RUNTIME",
      mockPolicyAuthority: "ENGLISH_RUNTIME",
      exactOptionsPreserved: true,
      answerPreserved: true,
      correctIndexPreserved: true,
    },
  };
}

export function runProbabilityNativePreview(
  packageId: ProbabilityPackageId,
  cpId: ProbabilityCanonicalProblemId,
  language: ProbabilityNativeLanguage,
  input: Omit<ProbabilityGenerationInput, "language"> = {},
): ProbabilityMultilingualPreview {
  const source = packageId === "PRB-001"
    ? runPrb001Pipeline(cpId as Prb001CanonicalProblemId, { ...input, language: "en" })
    : runPrb002Pipeline(cpId as Prb002CanonicalProblemId, { ...input, language: "en" });
  if (source.packageId !== packageId || source.canonicalProblemId !== cpId) {
    throw new Error(`ML-05 source routing mismatch for ${packageId}/${cpId}.`);
  }
  return renderProbabilityNativePreview(source, language);
}

export function listProbabilityMl05QlEntries(): readonly Readonly<{
  packageId: ProbabilityPackageId;
  cpId: ProbabilityCanonicalProblemId;
  qlId: string;
}>[] {
  return [
    ...listPrb001QuestionEntries().map((entry) => ({
      packageId: "PRB-001" as const,
      cpId: entry.cpId,
      qlId: entry.qlId,
    })),
    ...listPrb002QuestionEntries().map((entry) => ({
      packageId: "PRB-002" as const,
      cpId: entry.cpId,
      qlId: entry.qlId,
    })),
  ];
}
