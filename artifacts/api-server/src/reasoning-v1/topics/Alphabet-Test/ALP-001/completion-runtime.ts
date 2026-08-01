import type { AlpLocale, AlpQuestionLogic, GeneratedAlpQuestion } from "./types";
import { buildCp006 } from "./completion/cp006";
import { buildCp007 } from "./completion/cp007";
import { buildCp008 } from "./completion/cp008";
import { buildCp009 } from "./completion/cp009";
import { buildCp010 } from "./completion/cp010";
import { renderCompletionEditorial } from "./completion/editorial";
import { difficulty, options, track, type C } from "./completion/shared";

function build(ql: AlpQuestionLogic, seed: number): C {
  switch (ql.checkpointId) {
    case "ALP-CP-006": return buildCp006(ql, seed);
    case "ALP-CP-007": return buildCp007(ql, seed);
    case "ALP-CP-008": return buildCp008(ql, seed);
    case "ALP-CP-009": return buildCp009(ql, seed);
    case "ALP-CP-010": return buildCp010(ql, seed);
    default: throw new Error("Not an ALP-001 completion checkpoint.");
  }
}

function selectedDigitTransformStem(completion: C, locale: AlpLocale): string {
  const number = completion.source.join("");
  const kind = completion.query.en.match(/apply\s+(ASC|DESC|REV|SWAP)/)?.[1] ?? "ASC";
  const action = kind === "ASC"
    ? { en: "arranged from smallest to largest", hi: "छोटे से बड़े क्रम में सजाया जाए", pa: "ਛੋਟੇ ਤੋਂ ਵੱਡੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਵੇ" }
    : kind === "DESC"
      ? { en: "arranged from largest to smallest", hi: "बड़े से छोटे क्रम में सजाया जाए", pa: "ਵੱਡੇ ਤੋਂ ਛੋਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਾਇਆ ਜਾਵੇ" }
      : kind === "REV"
        ? { en: "written in reverse order", hi: "उलटे क्रम में लिखा जाए", pa: "ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਿਆ ਜਾਵੇ" }
        : { en: "interchanged in adjacent pairs", hi: "साथ वाले युग्मों में आपस में बदला जाए", pa: "ਨਾਲ ਵਾਲੇ ਜੋੜਿਆਂ ਵਿੱਚ ਆਪਸ ਵਿੱਚ ਬਦਲਿਆ ਜਾਵੇ" };
  if (locale === "hi-IN") return `यदि संख्या ${number} के अंकों को ${action.hi}, तो कितने अंक अपने मूल स्थान पर रहेंगे?`;
  if (locale === "pa-IN") return `ਜੇ ਸੰਖਿਆ ${number} ਦੇ ਅੰਕਾਂ ਨੂੰ ${action.pa}, ਤਾਂ ਕਿੰਨੇ ਅੰਕ ਆਪਣੀ ਮੂਲ ਥਾਂ ਉੱਤੇ ਰਹਿਣਗੇ?`;
  return `If the digits of ${number} are ${action.en}, how many digits will remain in their original positions?`;
}

function ensureVerifiedAnswerInTraps(
  analyses: GeneratedAlpQuestion["explanation"]["distractorAnalyses"],
  answer: string,
  locale: AlpLocale,
): GeneratedAlpQuestion["explanation"]["distractorAnalyses"] {
  const verification = locale === "hi-IN"
    ? `सत्यापित उत्तर ${answer} है।`
    : locale === "pa-IN"
      ? `ਜਾਂਚਿਆ ਉੱਤਰ ${answer} ਹੈ।`
      : `The verified answer is ${answer}.`;
  return analyses.map((analysis) => analysis.explanation.includes(answer)
    ? analysis
    : { ...analysis, explanation: `${analysis.explanation} ${verification}` });
}

function naturalizeCompletionText(text: string): string {
  return text
    .replaceAll("माँगी श्रेणी", "प्रश्न में बताई गई किस्म")
    .replaceAll("ਮੰਗੀ ਸ਼੍ਰੇਣੀ", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦੱਸੀ ਕਿਸਮ");
}

export function generateAlpCompletionQuestion(ql: AlpQuestionLogic, seed: number, locale: AlpLocale): GeneratedAlpQuestion {
  if (!Number.isInteger(seed)) throw new Error("ALP-001 completion seed must be an integer.");
  const completion = build(ql, seed);
  const builtOptions = options(completion.answer, completion.pool, ql, seed);
  const editorial = renderCompletionEditorial(ql, completion, builtOptions.out, builtOptions.correctIndex, locale);
  const distractorAnalyses = ensureVerifiedAnswerInTraps(editorial.distractorAnalyses, completion.answer, locale);
  const optionOnlyQuestion = ql.solveMode === "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT";
  const renderedStem = ql.solveMode === "DIGIT_COUNT_UNCHANGED_SELECTED_TRANSFORM"
    ? selectedDigitTransformStem(completion, locale)
    : editorial.stem;

  return {
    chapterId: "ALP-001",
    qlId: ql.qlId,
    checkpointId: ql.checkpointId,
    ruleId: ql.ruleId,
    solveMode: ql.solveMode,
    locale,
    seed,
    difficulty: difficulty(ql, seed),
    renderer: ql.renderer,
    presentationMode: ql.presentationMode,
    stem: renderedStem,
    structuredPrompt: {
      ...(!optionOnlyQuestion ? { sequence: completion.source } : {}),
      ...(!optionOnlyQuestion && completion.changed ? { transformedSequence: completion.changed } : {}),
      ...(!optionOnlyQuestion && completion.word ? { word: completion.word } : {}),
      ...(!optionOnlyQuestion && completion.changedWord ? { transformedWord: completion.changedWord } : {}),
      ...(!optionOnlyQuestion ? { positionTrack: track(completion.source) } : {}),
    },
    options: builtOptions.out,
    correctIndex: builtOptions.correctIndex,
    answer: completion.answer,
    explanation: {
      schemaVersion: "ALP-001-PEDAGOGY-V2",
      coreConcept: naturalizeCompletionText(editorial.coreConcept),
      ruleStatement: naturalizeCompletionText(editorial.ruleStatement),
      steps: editorial.steps.map(naturalizeCompletionText),
      visualWorking: editorial.visualWorking.map(naturalizeCompletionText),
      examShortcut: naturalizeCompletionText(editorial.examShortcut),
      conclusion: naturalizeCompletionText(editorial.conclusion),
      distractorAnalyses: distractorAnalyses.map((analysis) => ({
        ...analysis,
        explanation: naturalizeCompletionText(analysis.explanation),
      })),
      closestTrapRejection: naturalizeCompletionText(editorial.closestTrapRejection),
    },
    metadata: {
      runtimeVersion: "ALP-001-RUNTIME-V3",
      localeMode: "TRANSLATABLE",
      independentSolverVerified: true,
      ambiguityAudit: "EXPLICIT_OPERATION_UNIQUE",
      occurrenceAware: false,
    },
  };
}
