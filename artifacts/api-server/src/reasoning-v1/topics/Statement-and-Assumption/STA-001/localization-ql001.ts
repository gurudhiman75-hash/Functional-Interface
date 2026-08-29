import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import { STA_QL001_HINDI_REVIEW_COPY, STA_QL001_PUNJABI_REVIEW_COPY } from "./localization-ql001-copy.ts";
import type {
  StaLocalizedLifecycle,
  StaLocalizedLocale,
  StaLocalizedQuestion,
  StaLocalizationBundle,
} from "./localization-types.ts";
import type { StaAnswerSet, StaOption, StaRenderedCandidate } from "./types.ts";

export const STA_QL001_LOCALIZATION_LIFECYCLE: StaLocalizedLifecycle = {
  maturity: "PERMANENT_QL_SEMANTIC_FREEZE",
  permanentQlCount: 4,
  englishCorpusStatus: "FROZEN_V2",
  hindiPunjabiStatus: "QL001_REVIEW_CANDIDATE",
  localizedQlIds: ["STA-QL-001"],
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL001_HINDI_REVIEW_COPY : STA_QL001_PUNJABI_REVIEW_COPY;
}

function variantIndex(source: readonly string[], rendered: string, context: string): number {
  const index = source.indexOf(rendered);
  if (index < 0) throw new Error(`${context}: rendered English variant is not present in frozen authority`);
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

function localizedExplanation(
  locale: StaLocalizedLocale,
  candidates: StaLocalizedQuestion["candidates"],
  rationales: readonly string[],
  answerSet: StaAnswerSet,
): string {
  const candidateCount = candidates.length as 2 | 3;
  const lines = locale === "hi-IN"
    ? ["देखें कि बताए गए निर्देश को व्यवहार में पूरा करने के लिए कौन-सी मान्यताएँ वास्तव में आवश्यक हैं।"]
    : ["ਵੇਖੋ ਕਿ ਦਿੱਤੀ ਹਦਾਇਤ ਨੂੰ ਅਮਲ ਵਿੱਚ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿਹੜੀਆਂ ਮਾਨਤਾਵਾਂ ਅਸਲ ਵਿੱਚ ਲਾਜ਼ਮੀ ਹਨ।"];

  candidates.forEach((candidate, index) => {
    const implicit = candidate.oracle.classification === "IMPLICIT";
    if (locale === "hi-IN") {
      lines.push(`मान्यता ${candidate.label} ${implicit ? "अंतर्निहित है" : "अंतर्निहित नहीं है"}: ${rationales[index]}`);
    } else {
      lines.push(`ਮਾਨਤਾ ${candidate.label} ${implicit ? "ਅੰਤਰਿਨਿਹਿਤ ਹੈ" : "ਅੰਤਰਿਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationales[index]}`);
    }
  });

  const choice = localizedAnswerSet(answerSet, candidateCount, locale);
  lines.push(locale === "hi-IN" ? `इसलिए सही विकल्प है: ${choice}।` : `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${choice}।`);
  return lines.join("\n\n");
}

export function generateStaQl001LocalizedQuestion(seed: string, locale: StaLocalizedLocale): StaLocalizedQuestion {
  const english = generateStaQuestionFromPool(
    seed,
    "STA-QL-001",
    STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl,
  );
  const sourceScenario = STA_ENGLISH_CORPUS_BY_QL["STA-QL-001"].find((scenario) => scenario.scenarioId === english.scenarioId);
  if (!sourceScenario) throw new Error(`${english.scenarioId}: missing frozen English scenario`);

  const copy = bundleFor(locale)[english.scenarioId];
  if (!copy) throw new Error(`${english.scenarioId}: missing ${locale} localization copy`);

  const statementIndex = variantIndex(sourceScenario.statementVariants, english.statement, `${english.scenarioId}:statement`);
  const statement = copy.statementVariants[statementIndex];
  if (!statement) throw new Error(`${english.scenarioId}: missing ${locale} statement variant ${statementIndex}`);

  const rationales: string[] = [];
  const localizedCandidates = english.candidates.map((rendered) => {
    const sourceCandidate = sourceScenario.candidates.find((candidate) => candidate.candidateId === rendered.candidateId);
    if (!sourceCandidate) throw new Error(`${english.scenarioId}:${rendered.candidateId}: missing frozen candidate`);
    const candidateCopy = copy.candidates[rendered.candidateId];
    if (!candidateCopy) throw new Error(`${english.scenarioId}:${rendered.candidateId}: missing ${locale} candidate copy`);
    const textIndex = variantIndex(sourceCandidate.textVariants, rendered.text, `${english.scenarioId}:${rendered.candidateId}`);
    const text = candidateCopy.textVariants[textIndex];
    if (!text) throw new Error(`${english.scenarioId}:${rendered.candidateId}: missing ${locale} text variant ${textIndex}`);
    rationales.push(candidateCopy.rationale);
    return { ...rendered, text };
  }) as unknown as StaLocalizedQuestion["candidates"];

  const candidateCount = localizedCandidates.length as 2 | 3;
  const options = english.options.map((option) => ({
    ...option,
    display: localizedAnswerSet(option.semanticAnswerSet, candidateCount, locale),
  })) as unknown as readonly [StaOption, StaOption, StaOption, StaOption];

  return {
    ...english,
    locale,
    statement,
    candidates: localizedCandidates as readonly [StaRenderedCandidate, StaRenderedCandidate] | readonly [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate],
    options,
    explanation: localizedExplanation(locale, localizedCandidates, rationales, english.answerSet),
    lifecycle: STA_QL001_LOCALIZATION_LIFECYCLE,
  };
}
