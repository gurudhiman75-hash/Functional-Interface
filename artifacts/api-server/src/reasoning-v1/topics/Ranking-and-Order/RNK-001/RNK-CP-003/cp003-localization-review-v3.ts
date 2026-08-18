import { createHash } from 'node:crypto';

import type {
  RnkCp003LocalizedLocale,
  RnkCp003LocalizedReviewQuestion,
} from './cp003-localization-review-v1';
import {
  buildRnkCp003LocalizedReviewBankV2,
  localizeRnkCp003PermanentQuestionV2,
} from './cp003-localization-review-v2';

export const RNK_CP003_LOCALIZATION_REVIEW_V3_VERSION =
  'RNK_CP003_HI_PA_LOCALIZATION_REVIEW_V3' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_V3_AUTHORITY =
  'RNK_CP003_HI_PA_STRUCTURED_TRANSFORMATION_REVIEW_V3' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL =
  'RNK_CP003_ARTIFACT_REVIEW_CASE_ORIGIN_MEMBERSHIP_V3' as const;

type AnyQuestion = Record<string, any>;
type AnyEvidence = Record<string, any> & { readonly kind: string };

interface NativeContext {
  readonly groupLocative: string;
  readonly members: string;
  readonly memberSingular: string;
  readonly start: string;
  readonly end: string;
}

const HI_CONTEXTS: Readonly<Record<string, NativeContext>> = {
  MERIT_LIST: {
    groupLocative: 'योग्यता सूची',
    members: 'अभ्यर्थी',
    memberSingular: 'अभ्यर्थी',
    start: 'ऊपर से',
    end: 'नीचे से',
  },
  HORIZONTAL_ROW: {
    groupLocative: 'पंक्ति',
    members: 'व्यक्ति',
    memberSingular: 'व्यक्ति',
    start: 'बाएँ से',
    end: 'दाएँ से',
  },
  QUEUE: {
    groupLocative: 'कतार',
    members: 'व्यक्ति',
    memberSingular: 'व्यक्ति',
    start: 'आगे से',
    end: 'पीछे से',
  },
  RACE_ORDER: {
    groupLocative: 'दौड़ के अंतिम क्रम',
    members: 'धावक',
    memberSingular: 'धावक',
    start: 'आगे से',
    end: 'पीछे से',
  },
};

const PA_CONTEXTS: Readonly<Record<string, NativeContext>> = {
  MERIT_LIST: {
    groupLocative: 'ਯੋਗਤਾ ਸੂਚੀ',
    members: 'ਉਮੀਦਵਾਰ',
    memberSingular: 'ਉਮੀਦਵਾਰ',
    start: 'ਉੱਪਰੋਂ',
    end: 'ਹੇਠੋਂ',
  },
  HORIZONTAL_ROW: {
    groupLocative: 'ਕਤਾਰ',
    members: 'ਵਿਅਕਤੀ',
    memberSingular: 'ਵਿਅਕਤੀ',
    start: 'ਖੱਬੇ ਪਾਸੋਂ',
    end: 'ਸੱਜੇ ਪਾਸੋਂ',
  },
  QUEUE: {
    groupLocative: 'ਲਾਈਨ',
    members: 'ਵਿਅਕਤੀ',
    memberSingular: 'ਵਿਅਕਤੀ',
    start: 'ਅੱਗੋਂ',
    end: 'ਪਿੱਛੋਂ',
  },
  RACE_ORDER: {
    groupLocative: 'ਦੌੜ ਦੇ ਅੰਤਿਮ ਕ੍ਰਮ',
    members: 'ਦੌੜਾਕ',
    memberSingular: 'ਦੌੜਾਕ',
    start: 'ਅੱਗੋਂ',
    end: 'ਪਿੱਛੋਂ',
  },
};

function native(locale: RnkCp003LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function contextFor(contextId: string, locale: RnkCp003LocalizedLocale): NativeContext {
  const context = locale === 'hi-IN' ? HI_CONTEXTS[contextId] : PA_CONTEXTS[contextId];
  if (!context) throw new Error(`Unknown CP003 V3 context ${contextId}`);
  return context;
}

function ordinalBare(value: number, locale: RnkCp003LocalizedLocale): string {
  if (locale === 'hi-IN') {
    if (value === 1) return 'पहले स्थान';
    if (value === 2) return 'दूसरे स्थान';
    if (value === 3) return 'तीसरे स्थान';
    if (value === 4) return 'चौथे स्थान';
    return `${value}वें स्थान`;
  }
  if (value === 1) return 'ਪਹਿਲੇ ਸਥਾਨ';
  if (value === 2) return 'ਦੂਜੇ ਸਥਾਨ';
  if (value === 3) return 'ਤੀਜੇ ਸਥਾਨ';
  if (value === 4) return 'ਚੌਥੇ ਸਥਾਨ';
  return `${value}ਵੇਂ ਸਥਾਨ`;
}

function sideText(side: 'START' | 'END', context: NativeContext): string {
  return side === 'START' ? context.start : context.end;
}

function rankAt(
  rank: number,
  side: 'START' | 'END',
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): string {
  return native(
    locale,
    `${sideText(side, context)} ${ordinalBare(rank, locale)} पर`,
    `${sideText(side, context)} ${ordinalBare(rank, locale)} 'ਤੇ`,
  );
}

function rankFrom(
  rank: number,
  side: 'START' | 'END',
  context: NativeContext,
  locale: RnkCp003LocalizedLocale,
): string {
  return native(
    locale,
    `${sideText(side, context)} ${ordinalBare(rank, locale)} से`,
    `${sideText(side, context)} ${ordinalBare(rank, locale)} ਤੋਂ`,
  );
}

function sha256(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex');
}

export function repairRnkCp003ArtifactTextV3(
  text: string,
  locale: RnkCp003LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    return text
      .replaceAll('दौड़ का अंतिम क्रम में', 'दौड़ के अंतिम क्रम में')
      .replaceAll('नई दौड़ का अंतिम क्रम में', 'दौड़ के नए अंतिम क्रम में');
  }
  return text
    .replaceAll('ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ', 'ਦੌੜ ਦੇ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ')
    .replaceAll('ਨਵੀਂ ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ', 'ਦੌੜ ਦੇ ਨਵੇਂ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ');
}

function rewrittenStem(
  question: RnkCp003LocalizedReviewQuestion,
): string {
  const locale = question.locale;
  const evidence = question.displayedEvidence as AnyEvidence;
  const context = contextFor(String(question.contextId), locale);
  const first = question.localizedNames[0] ?? '';
  const second = question.localizedNames[1] ?? '';

  switch (evidence.kind) {
    case 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE':
      return native(
        locale,
        `${context.groupLocative} में शुरू में ${first} ${rankAt(evidence.firstOriginalRankFromStart, 'START', context, locale)} है, जबकि ${second} ${rankAt(evidence.secondOriginalRankFromEnd, 'END', context, locale)} है। जगह बदलने के बाद ${first} की नई स्थिति ${rankAt(evidence.firstFinalRankFromStart, 'START', context, locale)} हो जाती है। ${context.groupLocative} में कुल कितने ${context.members} हैं?`,
        `${context.groupLocative} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${first} ${rankAt(evidence.firstOriginalRankFromStart, 'START', context, locale)} ਹੈ, ਜਦਕਿ ${second} ${rankAt(evidence.secondOriginalRankFromEnd, 'END', context, locale)} ਹੈ। ਥਾਂ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ${first} ਦੀ ਨਵੀਂ ਸਥਿਤੀ ${rankAt(evidence.firstFinalRankFromStart, 'START', context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ${context.groupLocative} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ${context.members} ਹਨ?`,
      );

    case 'PEOPLE_PASSED_FROM_RANK_CHANGE':
      return native(
        locale,
        `${context.groupLocative} में कुल ${evidence.total} ${context.members} हैं। ${first} की स्थिति ${rankFrom(evidence.originalRank, evidence.originalSide, context, locale)} बदलकर ${rankAt(evidence.finalRank, evidence.finalSide, context, locale)} हो जाती है। इस बदलाव में ${first} ने कितने लोगों को पार किया या कितने लोगों ने ${first} को पार किया?`,
        `${context.groupLocative} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${first} ਦੀ ਸਥਿਤੀ ${rankFrom(evidence.originalRank, evidence.originalSide, context, locale)} ਬਦਲ ਕੇ ${rankAt(evidence.finalRank, evidence.finalSide, context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ਇਸ ਬਦਲਾਅ ਵਿੱਚ ${first} ਨੇ ਕਿੰਨੇ ਲੋਕਾਂ ਨੂੰ ਪਾਰ ਕੀਤਾ ਜਾਂ ਕਿੰਨੇ ਲੋਕਾਂ ਨੇ ${first} ਨੂੰ ਪਾਰ ਕੀਤਾ?`,
      );

    case 'TARGET_RANK_AFTER_INSERTION':
      return native(
        locale,
        `${context.groupLocative} में शुरू में ${evidence.totalBefore} ${context.members} हैं। ${first} ${rankAt(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। एक नया ${context.memberSingular} जुड़ता है। जुड़ने के बाद उसकी स्थिति ${rankAt(evidence.insertedFinalRank, evidence.insertedFinalSide, context, locale)} होती है। ${first} की नई ${sideText(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.groupLocative} ਵਿੱਚ ਸ਼ੁਰੂ ਵਿੱਚ ${evidence.totalBefore} ${context.members} ਹਨ। ${first} ${rankAt(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ਇੱਕ ਨਵਾਂ ${context.memberSingular} ਸ਼ਾਮਲ ਹੁੰਦਾ ਹੈ। ਸ਼ਾਮਲ ਹੋਣ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਸਥਿਤੀ ${rankAt(evidence.insertedFinalRank, evidence.insertedFinalSide, context, locale)} ਹੁੰਦੀ ਹੈ। ${first} ਦੀ ਨਵੀਂ ${sideText(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );

    case 'TARGET_RANK_AFTER_REMOVAL':
      return native(
        locale,
        `${context.groupLocative} में ${evidence.totalBefore} ${context.members} हैं। ${first} ${rankAt(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। जो ${context.memberSingular} ${rankAt(evidence.removedOriginalRank, evidence.removedOriginalSide, context, locale)} है, उसे हटा दिया जाता है। ${first} की नई ${sideText(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.groupLocative} ਵਿੱਚ ${evidence.totalBefore} ${context.members} ਹਨ। ${first} ${rankAt(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ਜੋ ${context.memberSingular} ${rankAt(evidence.removedOriginalRank, evidence.removedOriginalSide, context, locale)} ਹੈ, ਉਸ ਨੂੰ ਹਟਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ${first} ਦੀ ਨਵੀਂ ${sideText(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );

    case 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES': {
      const target = first;
      const mover = second;
      return native(
        locale,
        `${context.groupLocative} में कुल ${evidence.total} ${context.members} हैं। ${target} ${rankAt(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। ${mover} की स्थिति ${rankFrom(evidence.moverOriginalRankFromStart, 'START', context, locale)} बदलकर ${rankAt(evidence.moverFinalRankFromStart, 'START', context, locale)} हो जाती है। ${target} की नई ${sideText(evidence.requestedSide, context)} रैंक क्या होगी?`,
        `${context.groupLocative} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${target} ${rankAt(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ${mover} ਦੀ ਸਥਿਤੀ ${rankFrom(evidence.moverOriginalRankFromStart, 'START', context, locale)} ਬਦਲ ਕੇ ${rankAt(evidence.moverFinalRankFromStart, 'START', context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ${target} ਦੀ ਨਵੀਂ ${sideText(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
      );
    }

    case 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED': {
      const mover = first;
      const target = second;
      return native(
        locale,
        `${context.groupLocative} में कुल ${evidence.total} ${context.members} हैं। ${mover} की स्थिति ${rankFrom(evidence.moverOriginalRankFromStart, 'START', context, locale)} बदलकर ${rankAt(evidence.moverFinalRankFromStart, 'START', context, locale)} हो जाती है। इसके बाद ${target} ${rankAt(evidence.targetFinalRank, evidence.targetFinalSide, context, locale)} है। ${target} की मूल ${sideText(evidence.requestedSide, context)} रैंक क्या थी?`,
        `${context.groupLocative} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${mover} ਦੀ ਸਥਿਤੀ ${rankFrom(evidence.moverOriginalRankFromStart, 'START', context, locale)} ਬਦਲ ਕੇ ${rankAt(evidence.moverFinalRankFromStart, 'START', context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ${target} ${rankAt(evidence.targetFinalRank, evidence.targetFinalSide, context, locale)} ਹੈ। ${target} ਦੀ ਮੂਲ ${sideText(evidence.requestedSide, context)} ਰੈਂਕ ਕੀ ਸੀ?`,
      );
    }

    default:
      return repairRnkCp003ArtifactTextV3(question.stem, locale);
  }
}

export function applyRnkCp003LocalizationEditorialV3(
  question: RnkCp003LocalizedReviewQuestion,
): RnkCp003LocalizedReviewQuestion {
  const locale = question.locale;
  const stem = rewrittenStem(question);
  const options = question.options.map((option: AnyQuestion) => ({
    ...option,
    label: repairRnkCp003ArtifactTextV3(String(option.label), locale),
    explanation: repairRnkCp003ArtifactTextV3(String(option.explanation), locale),
  }));
  const explanation = {
    keyRule: repairRnkCp003ArtifactTextV3(question.explanation.keyRule, locale),
    stepByStepSolution: question.explanation.stepByStepSolution.map((line) => repairRnkCp003ArtifactTextV3(line, locale)),
    examSpeedShortcut: repairRnkCp003ArtifactTextV3(question.explanation.examSpeedShortcut, locale),
    optionAnalysis: question.explanation.optionAnalysis.map((line) => repairRnkCp003ArtifactTextV3(line, locale)),
    conclusion: repairRnkCp003ArtifactTextV3(question.explanation.conclusion, locale),
  };
  const answer = typeof question.answer === 'string'
    ? repairRnkCp003ArtifactTextV3(question.answer, locale)
    : question.answer;
  const localizationFingerprint = sha256({
    version: RNK_CP003_LOCALIZATION_REVIEW_V3_VERSION,
    editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL,
    locale,
    permanentQlId: question.permanentQlId,
    prototypeId: question.prototypeId,
    seed: question.seed,
    stem,
    answer,
    options: options.map((option: AnyQuestion) => ({
      answerKey: option.answerKey,
      answer: option.answer,
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: option.explanation,
    })),
    explanation,
  });

  return {
    ...question,
    stem,
    answer,
    options,
    explanation,
    localizationMetadata: {
      ...question.localizationMetadata,
      version: RNK_CP003_LOCALIZATION_REVIEW_V3_VERSION,
      editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL,
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP003_LOCALIZATION_REVIEW_V3_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V3_EDITORIAL,
    },
  } as RnkCp003LocalizedReviewQuestion;
}

export function localizeRnkCp003PermanentQuestionV3(
  question: AnyQuestion,
  locale: RnkCp003LocalizedLocale,
): RnkCp003LocalizedReviewQuestion {
  return applyRnkCp003LocalizationEditorialV3(localizeRnkCp003PermanentQuestionV2(question, locale));
}

export function buildRnkCp003LocalizedReviewBankV3(
  locale: RnkCp003LocalizedLocale,
  seedsPerQl = 192,
): readonly RnkCp003LocalizedReviewQuestion[] {
  return buildRnkCp003LocalizedReviewBankV2(locale, seedsPerQl).map(applyRnkCp003LocalizationEditorialV3);
}
