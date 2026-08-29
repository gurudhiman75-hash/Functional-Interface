import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQuestionFromPool, type StaScenarioPoolByQl } from "./generator.ts";
import { STA_QL002_HINDI_REVIEW_COPY, STA_QL002_PUNJABI_REVIEW_COPY } from "./localization-ql002-copy.ts";
import { STA_QL001_HI_PA_FREEZE_V2_MANIFEST } from "./localization-ql001-freeze-manifest.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";
import type { StaAnswerSet, StaOption, StaQuestion, StaRenderedCandidate } from "./types.ts";

export interface StaQl002LocalizedLifecycle {
  readonly maturity: "PERMANENT_QL_SEMANTIC_FREEZE";
  readonly permanentQlCount: 4;
  readonly englishCorpusStatus: "FROZEN_V2";
  readonly ql001HindiPunjabiStatus: "FROZEN_V2";
  readonly ql001FreezeId: "STA-001-QL001-HI-PA-v2-frozen";
  readonly ql002HindiPunjabiStatus: "REVIEW_CANDIDATE_V1";
  readonly localizedQlIds: readonly ["STA-QL-001", "STA-QL-002"];
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface StaQl002LocalizedQuestion extends Omit<StaQuestion, "locale" | "statement" | "candidates" | "options" | "explanation" | "lifecycle"> {
  readonly locale: StaLocalizedLocale;
  readonly statement: string;
  readonly candidates: readonly [StaRenderedCandidate, StaRenderedCandidate] | readonly [StaRenderedCandidate, StaRenderedCandidate, StaRenderedCandidate];
  readonly options: readonly [StaOption, StaOption, StaOption, StaOption];
  readonly answerSet: StaAnswerSet;
  readonly explanation: string;
  readonly lifecycle: StaQl002LocalizedLifecycle;
}

export const STA_QL002_LOCALIZATION_LIFECYCLE: StaQl002LocalizedLifecycle = {
  maturity: "PERMANENT_QL_SEMANTIC_FREEZE",
  permanentQlCount: 4,
  englishCorpusStatus: "FROZEN_V2",
  ql001HindiPunjabiStatus: "FROZEN_V2",
  ql001FreezeId: STA_QL001_HI_PA_FREEZE_V2_MANIFEST.freezeId,
  ql002HindiPunjabiStatus: "REVIEW_CANDIDATE_V1",
  localizedQlIds: ["STA-QL-001", "STA-QL-002"],
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
};

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL002_HINDI_REVIEW_COPY : STA_QL002_PUNJABI_REVIEW_COPY;
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
  candidates: StaQl002LocalizedQuestion["candidates"],
  rationales: readonly string[],
  answerSet: StaAnswerSet,
): string {
  const lines: string[] = [];
  candidates.forEach((candidate, index) => {
    const implicit = candidate.oracle.classification === "IMPLICIT";
    if (locale === "hi-IN") {
      lines.push(`पूर्वधारणा ${candidate.label} ${implicit ? "निहित है" : "निहित नहीं है"}: ${rationales[index]}`);
    } else {
      lines.push(`ਧਾਰਨਾ ${candidate.label} ${implicit ? "ਨਿਹਿਤ ਹੈ" : "ਨਿਹਿਤ ਨਹੀਂ ਹੈ"}: ${rationales[index]}`);
    }
  });
  const choice = localizedAnswerSet(answerSet, candidates.length as 2 | 3, locale);
  lines.push(locale === "hi-IN" ? `इसलिए सही विकल्प है: ${choice}।` : `ਇਸ ਲਈ ਸਹੀ ਵਿਕਲਪ ਹੈ: ${choice}।`);
  return lines.join("\n\n");
}

export function generateStaQl002LocalizedQuestion(seed: string, locale: StaLocalizedLocale): StaQl002LocalizedQuestion {
  const english = generateStaQuestionFromPool(
    seed,
    "STA-QL-002",
    STA_ENGLISH_CORPUS_BY_QL as unknown as StaScenarioPoolByQl,
  );
  const sourceScenario = STA_ENGLISH_CORPUS_BY_QL["STA-QL-002"].find((scenario) => scenario.scenarioId === english.scenarioId);
  if (!sourceScenario) throw new Error(`${english.scenarioId}: missing frozen English QL002 scenario`);

  const copy = bundleFor(locale)[english.scenarioId];
  if (!copy) throw new Error(`${english.scenarioId}: missing ${locale} QL002 localization copy`);

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
  }) as unknown as StaQl002LocalizedQuestion["candidates"];

  const options = english.options.map((option) => ({
    ...option,
    display: localizedAnswerSet(option.semanticAnswerSet, localizedCandidates.length as 2 | 3, locale),
  })) as unknown as readonly [StaOption, StaOption, StaOption, StaOption];

  return {
    ...english,
    locale,
    statement,
    candidates: localizedCandidates,
    options,
    explanation: localizedExplanation(locale, localizedCandidates, rationales, english.answerSet),
    lifecycle: STA_QL002_LOCALIZATION_LIFECYCLE,
  };
}
