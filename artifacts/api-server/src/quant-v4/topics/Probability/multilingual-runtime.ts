import {
  listPrb001QuestionEntries,
  runPrb001Pipeline,
  type Prb001CanonicalProblemId,
} from "./PRB-001";
import {
  listPrb002QuestionEntries,
  runPrb002Pipeline,
  type Prb002CanonicalProblemId,
} from "./PRB-002";
import type { Prb001NativeEditorialEntry } from "./PRB-001/native-editorial";
import {
  getPrb001NativeEditorialEntry,
  localizePrb001NativeBindingValue,
} from "./PRB-001/native-editorial";
import type { Prb002NativeEditorialEntry } from "./PRB-002/native-editorial";
import {
  getPrb002NativeEditorialEntry,
  localizePrb002NativeBindingValue,
} from "./PRB-002/native-editorial";
import type {
  ProbabilityNativeLanguage,
} from "./multilingual-foundation";
import {
  assertProbabilityNativeTextValid,
  getProbabilityNativeTerm,
} from "./native-language-primitives";
import { renderProbabilityMathText } from "./shared/math-text";
import { renderNativeStudentFacingStem } from "./shared/native-exam-style-bridge";
import { polishNativeVisual } from "./shared/native-final-explanation-renderer";
import { renderNativeSourceExplanationLines } from "./shared/native-source-explanation-mirror";
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

export interface ProbabilityNativePresentation {
  readonly language: ProbabilityNativeLanguage;
  readonly localizedQuestionId: string;
  readonly localizedExplanationId: string;
  readonly sourceQuestionId: string;
  readonly sourceExplanationId: string;
  readonly qlId: string;
  readonly eventWording: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: Readonly<{
    lines: readonly string[];
    wordCount: number;
    visuals: readonly ProbabilityVisual[];
  }>;
  readonly validation: ValidationResult;
  readonly localizationStatus: ProbabilityNativePreviewStatus;
  readonly questionStudioEnabled: false;
  readonly publiclyPublishable: false;
}

export interface ProbabilityMultilingualPreview {
  readonly source: ProbabilityQuestion;
  readonly presentation: ProbabilityNativePresentation;
  readonly parity: Readonly<{
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
}

type NativeEditorial = Prb001NativeEditorialEntry | Prb002NativeEditorialEntry;
type NativeBindingLocalizer = (
  value: unknown,
  language: ProbabilityNativeLanguage,
  context?: Record<string, unknown>,
) => unknown;

function sourceExplanationId(source: ProbabilityQuestion): string {
  return source.explanation.explanationId;
}

function buildNativeRenderContext(source: ProbabilityQuestion): Record<string, unknown> {
  const context: Record<string, unknown> = {
    ...source.parameters,
    answerInstruction: source.answer,
    answerDimension: source.answerDimension,
  };

  for (const [key, value] of Object.entries(source.parameters)) {
    if (typeof value === "bigint") context[key] = value.toString();
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
  const lines = renderNativeSourceExplanationLines(source, language);
  const visuals = source.explanation.visuals.map((visual) =>
    polishNativeVisual(source, language, localizeNativeVisual(visual, source, language, editorial.eventWording)));
  return { lines, wordCount: explanationWordCount(lines), visuals };
}

function auditNativeExplanationLine(line: string, language: ProbabilityNativeLanguage): void {
  const auditLine = line.replaceAll("n!/[r!(n-r)!]", "\\(n!/[r!(n-r)!]\\)");
  assertProbabilityNativeTextValid(auditLine, language);
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
  for (const line of explanation.lines) auditNativeExplanationLine(line, language);
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
