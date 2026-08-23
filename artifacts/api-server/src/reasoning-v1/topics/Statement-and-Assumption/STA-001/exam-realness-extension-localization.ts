import { generateStaQl004ExamRealnessEnglishQuestion, STA_QL004_EXAM_REALNESS_EXTENSION } from "./exam-realness-extension.ts";
import { STA_QL004_EXAM_REALNESS_HINDI_COPY, STA_QL004_EXAM_REALNESS_PUNJABI_COPY } from "./exam-realness-extension-copy.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";
import type { StaAnswerSet, StaOption, StaQuestion, StaRenderedCandidate } from "./types.ts";

export interface StaQl004ExamRealnessLifecycle {
  readonly englishBaseFreezeId: "STA-001-EN-v2-frozen";
  readonly extensionStatus: "REVIEW_CANDIDATE_V1";
  readonly frozenBaseUntouched: true;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface StaQl004ExamRealnessLocalizedQuestion extends Omit<StaQuestion, "locale" | "statement" | "candidates" | "options" | "explanation" | "lifecycle"> {
  readonly locale: StaLocalizedLocale;
  readonly statement: string;
  readonly candidates: readonly [StaRenderedCandidate, StaRenderedCandidate] | readonly [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate];
  readonly options: readonly [StaOption, StaOption, StaOption, StaOption];
  readonly answerSet: StaAnswerSet;
  readonly explanation: string;
  readonly lifecycle: StaQl004ExamRealnessLifecycle;
}

export const STA_QL004_EXAM_REALNESS_LIFECYCLE: StaQl004ExamRealnessLifecycle = {
  englishBaseFreezeId: "STA-001-EN-v2-frozen",
  extensionStatus: "REVIEW_CANDIDATE_V1",
  frozenBaseUntouched: true,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_EXAM_REALNESS_HINDI_COPY : STA_QL004_EXAM_REALNESS_PUNJABI_COPY;
}

function variantIndex(source: readonly string[], rendered: string, context: string): number {
  const index = source.indexOf(rendered);
  if (index < 0) throw new Error(`${context}: rendered variant missing from exam-realness authority`);
  return index;
}

function roman(index: number): "I" | "II" | "III" {
  if (index === 0) return "I";
  if (index === 1) return "II";
  return "III";
}

function localizedAnswerSet(answer: StaAnswerSet, candidateCount: 2 | 3, locale: StaLocalizedLocale): string {
  const labels = answer.map(roman);
  if (locale === "hi-IN") {
    if (candidateCount === 2) {
      if (answer.length === 0) return "न तो I, न II";
      if (answer.length === 2) return "I और II दोनों";
      return `केवल ${labels[0]}`;
    }
    if (answer.length === 0) return "I, II और III में से कोई नहीं";
    if (answer.length === 3) return "I, II और III सभी";
    if (answer.length === 1) return `केवल ${labels[0]}`;
    return `केवल ${labels[0]} और ${labels[1]}`;
  }
  if (candidateCount === 2) {
    if (answer.length === 0) return "ਨਾ I, ਨਾ II";
    if (answer.length === 2) return "I ਅਤੇ II ਦੋਵੇਂ";
    return `ਕੇਵਲ ${labels[0]}`;
  }
  if (answer.length === 0) return "I, II ਅਤੇ III ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
  if (answer.length === 3) return "I, II ਅਤੇ III ਸਾਰੇ";
  if (answer.length === 1) return `ਕੇਵਲ ${labels[0]}`;
  return `ਕੇਵਲ ${labels[0]} ਅਤੇ ${labels[1]}`;
}

function localizeQuestion(seed: string, locale: StaLocalizedLocale): StaQl004ExamRealnessLocalizedQuestion {
  const english = generateStaQl004ExamRealnessEnglishQuestion(seed);
  const sourceScenario = STA_QL004_EXAM_REALNESS_EXTENSION.find((scenario) => scenario.scenarioId === english.scenarioId);
  if (!sourceScenario) throw new Error(`${english.scenarioId}: missing exam-realness source scenario`);
  const copy = bundleFor(locale)[english.scenarioId];
  if (!copy) throw new Error(`${english.scenarioId}: missing ${locale} exam-realness copy`);

  const statementIndex = variantIndex(sourceScenario.statementVariants, english.statement, `${english.scenarioId}:statement`);
  const statement = copy.statementVariants[statementIndex];
  if (!statement) throw new Error(`${english.scenarioId}: missing ${locale} statement variant ${statementIndex}`);

  const rationales: string[] = [];
  const candidates = english.candidates.map((rendered) => {
    const sourceCandidate = sourceScenario.candidates.find((candidate) => candidate.candidateId === rendered.candidateId);
    if (!sourceCandidate) throw new Error(`${english.scenarioId}:${rendered.candidateId}: missing source candidate`);
    const candidateCopy = copy.candidates[rendered.candidateId];
    if (!candidateCopy) throw new Error(`${english.scenarioId}:${rendered.candidateId}: missing ${locale} candidate copy`);
    const textIndex = variantIndex(sourceCandidate.textVariants, rendered.text, `${english.scenarioId}:${rendered.candidateId}`);
    const text = candidateCopy.textVariants[textIndex];
    if (!text) throw new Error(`${english.scenarioId}:${rendered.candidateId}: missing ${locale} text variant ${textIndex}`);
    rationales.push(candidateCopy.rationale);
    return { ...rendered, text };
  }) as unknown as StaQl004ExamRealnessLocalizedQuestion["candidates"];

  const options = english.options.map((option) => ({
    ...option,
    display: localizedAnswerSet(option.semanticAnswerSet, candidates.length as 2 | 3, locale),
  })) as unknown as readonly [StaOption, StaOption, StaOption, StaOption];

  const lines = candidates.map((candidate, index) => {
    const implicit = candidate.oracle.classification === "IMPLICIT";
    return locale === "hi-IN"
      ? `पूर्वधारणा ${candidate.label} ${implicit ? "निहित है" : "निहित नहीं है"}: ${rationales[index]}`
      : `ਧਾਰਨਾ ${candidate.label} ${implicit ? "ਨਿਹਿਤ ਹੈ" : "ਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationales[index]}`;
  });
  const choice = localizedAnswerSet(english.answerSet, candidates.length as 2 | 3, locale);
  lines.push(locale === "hi-IN" ? `इसलिए सही विकल्प है: ${choice}।` : `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${choice}।`);

  return {
    ...english,
    locale,
    statement,
    candidates,
    options,
    explanation: lines.join("\n\n"),
    lifecycle: STA_QL004_EXAM_REALNESS_LIFECYCLE,
  };
}

export function generateStaQl004ExamRealnessLocalizedQuestion(seed: string, locale: StaLocalizedLocale): StaQl004ExamRealnessLocalizedQuestion {
  return localizeQuestion(seed, locale);
}
