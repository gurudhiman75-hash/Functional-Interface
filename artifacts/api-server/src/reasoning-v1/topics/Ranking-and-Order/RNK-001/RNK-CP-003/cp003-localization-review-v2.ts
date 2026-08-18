import { createHash } from 'node:crypto';

import {
  buildRnkCp003LocalizedReviewBank,
  localizeRnkCp003PermanentQuestion,
  type RnkCp003LocalizedLocale,
  type RnkCp003LocalizedReviewQuestion,
} from './cp003-localization-review-v1';

export const RNK_CP003_LOCALIZATION_REVIEW_V2_VERSION =
  'RNK_CP003_HI_PA_LOCALIZATION_REVIEW_V2' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_V2_AUTHORITY =
  'RNK_CP003_HI_PA_STRUCTURED_TRANSFORMATION_REVIEW_V2' as const;
export const RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL =
  'RNK_CP003_EDITORIAL_GENDER_PLURAL_MOVEMENT_V2' as const;

type AnyQuestion = Record<string, any>;
type AnyEvidence = Record<string, any> & { readonly kind: string };

interface CompactContext {
  readonly group: string;
  readonly members: string;
  readonly start: string;
  readonly end: string;
}

const HI_CONTEXTS: Readonly<Record<string, CompactContext>> = {
  MERIT_LIST: { group: 'योग्यता सूची', members: 'अभ्यर्थी', start: 'ऊपर से', end: 'नीचे से' },
  HORIZONTAL_ROW: { group: 'पंक्ति', members: 'व्यक्ति', start: 'बाएँ से', end: 'दाएँ से' },
  QUEUE: { group: 'कतार', members: 'व्यक्ति', start: 'आगे से', end: 'पीछे से' },
  RACE_ORDER: { group: 'दौड़ का अंतिम क्रम', members: 'धावक', start: 'आगे से', end: 'पीछे से' },
};

const PA_CONTEXTS: Readonly<Record<string, CompactContext>> = {
  MERIT_LIST: { group: 'ਯੋਗਤਾ ਸੂਚੀ', members: 'ਉਮੀਦਵਾਰ', start: 'ਉੱਪਰੋਂ', end: 'ਹੇਠੋਂ' },
  HORIZONTAL_ROW: { group: 'ਕਤਾਰ', members: 'ਵਿਅਕਤੀ', start: 'ਖੱਬੇ ਪਾਸੋਂ', end: 'ਸੱਜੇ ਪਾਸੋਂ' },
  QUEUE: { group: 'ਲਾਈਨ', members: 'ਵਿਅਕਤੀ', start: 'ਅੱਗੋਂ', end: 'ਪਿੱਛੋਂ' },
  RACE_ORDER: { group: 'ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ', members: 'ਦੌੜਾਕ', start: 'ਅੱਗੋਂ', end: 'ਪਿੱਛੋਂ' },
};

function native(locale: RnkCp003LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function contextFor(contextId: string, locale: RnkCp003LocalizedLocale): CompactContext {
  const context = locale === 'hi-IN' ? HI_CONTEXTS[contextId] : PA_CONTEXTS[contextId];
  if (!context) throw new Error(`Unknown CP003 V2 context ${contextId}`);
  return context;
}

function ordinal(value: number, locale: RnkCp003LocalizedLocale): string {
  if (locale === 'hi-IN') {
    if (value === 1) return 'पहले स्थान पर';
    if (value === 2) return 'दूसरे स्थान पर';
    if (value === 3) return 'तीसरे स्थान पर';
    if (value === 4) return 'चौथे स्थान पर';
    return `${value}वें स्थान पर`;
  }
  if (value === 1) return "ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ";
  if (value === 2) return "ਦੂਜੇ ਸਥਾਨ 'ਤੇ";
  if (value === 3) return "ਤੀਜੇ ਸਥਾਨ 'ਤੇ";
  if (value === 4) return "ਚੌਥੇ ਸਥਾਨ 'ਤੇ";
  return `${value}ਵੇਂ ਸਥਾਨ 'ਤੇ`;
}

function rankPhrase(
  rank: number,
  side: 'START' | 'END',
  context: CompactContext,
  locale: RnkCp003LocalizedLocale,
): string {
  return `${side === 'START' ? context.start : context.end} ${ordinal(rank, locale)}`;
}

function sha256(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex');
}

export function repairRnkCp003EditorialText(
  text: string,
  locale: RnkCp003LocalizedLocale,
): string {
  if (locale === 'hi-IN') {
    return text
      .replaceAll('दोनों अपनी जगह बदल लेते हैं।', 'दोनों की जगहें आपस में बदल जाती हैं।')
      .replaceAll('ने अपनी जगह बदल ली।', 'की जगहें आपस में बदल गईं।')
      .replaceAll('स्थान बदलती है', 'स्थान खिसकती है')
      .replaceAll('नई दौड़ का अंतिम क्रम में', 'दौड़ के नए अंतिम क्रम में');
  }
  return text
    .replaceAll('ਦੋਵੇਂ ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲੈਂਦੇ ਹਨ।', 'ਦੋਵਾਂ ਦੀਆਂ ਥਾਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਜਾਂਦੀਆਂ ਹਨ।')
    .replaceAll('ਨੇ ਆਪਣੀਆਂ ਥਾਵਾਂ ਬਦਲ ਲਈਆਂ।', 'ਦੀਆਂ ਥਾਵਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਗਈਆਂ।')
    .replaceAll('ਸਥਾਨ ਬਦਲਦੀ ਹੈ', 'ਸਥਾਨ ਖਿਸਕਦੀ ਹੈ')
    .replaceAll('ਹੁੰਦੇ ਹੈ', 'ਹੁੰਦੇ ਹਨ')
    .replaceAll('ਜਾਂਦੇ ਹੈ', 'ਜਾਂਦੇ ਹਨ')
    .replaceAll('ਨਵੀਂ ਦੌੜ ਦਾ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ', 'ਦੌੜ ਦੇ ਨਵੇਂ ਅੰਤਿਮ ਕ੍ਰਮ ਵਿੱਚ');
}

function sourceMovementStem(
  question: RnkCp003LocalizedReviewQuestion,
  locale: RnkCp003LocalizedLocale,
): string | null {
  const evidence = question.displayedEvidence as AnyEvidence;
  const context = contextFor(String(question.contextId), locale);
  const first = question.localizedNames[0] ?? '';
  const second = question.localizedNames[1] ?? '';

  if (evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES') {
    const target = first;
    const mover = second;
    return native(
      locale,
      `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${target} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} है। ${mover} की स्थिति ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} से बदलकर ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} हो जाती है। ${target} की नई ${evidence.requestedSide === 'START' ? context.start : context.end} रैंक क्या होगी?`,
      `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${target} ${rankPhrase(evidence.targetOriginalRank, evidence.targetOriginalSide, context, locale)} ਹੈ। ${mover} ਦੀ ਸਥਿਤੀ ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} ਤੋਂ ਬਦਲ ਕੇ ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ${target} ਦੀ ਨਵੀਂ ${evidence.requestedSide === 'START' ? context.start : context.end} ਰੈਂਕ ਕੀ ਹੋਵੇਗੀ?`,
    );
  }

  if (evidence.kind === 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED') {
    const mover = first;
    const target = second;
    return native(
      locale,
      `${context.group} में कुल ${evidence.total} ${context.members} हैं। ${mover} की स्थिति ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} से बदलकर ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} हो जाती है। इसके बाद ${target} ${rankPhrase(evidence.targetFinalRank, evidence.targetFinalSide, context, locale)} है। ${target} की मूल ${evidence.requestedSide === 'START' ? context.start : context.end} रैंक क्या थी?`,
      `${context.group} ਵਿੱਚ ਕੁੱਲ ${evidence.total} ${context.members} ਹਨ। ${mover} ਦੀ ਸਥਿਤੀ ${rankPhrase(evidence.moverOriginalRankFromStart, 'START', context, locale)} ਤੋਂ ਬਦਲ ਕੇ ${rankPhrase(evidence.moverFinalRankFromStart, 'START', context, locale)} ਹੋ ਜਾਂਦੀ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ${target} ${rankPhrase(evidence.targetFinalRank, evidence.targetFinalSide, context, locale)} ਹੈ। ${target} ਦੀ ਮੂਲ ${evidence.requestedSide === 'START' ? context.start : context.end} ਰੈਂਕ ਕੀ ਸੀ?`,
    );
  }

  return null;
}

function repairExplanation(
  question: RnkCp003LocalizedReviewQuestion,
  locale: RnkCp003LocalizedLocale,
): RnkCp003LocalizedReviewQuestion['explanation'] {
  const evidence = question.displayedEvidence as AnyEvidence;
  const steps = question.explanation.stepByStepSolution.map((step) => repairRnkCp003EditorialText(step, locale));

  if (
    evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES'
    || evidence.kind === 'ORIGINAL_TARGET_RANK_BEFORE_ANOTHER_PERSON_MOVED'
  ) {
    const isDirect = evidence.kind === 'TARGET_RANK_AFTER_ANOTHER_PERSON_MOVES';
    const mover = isDirect ? question.localizedNames[1] : question.localizedNames[0];
    if (mover && steps.length > 1) {
      steps[1] = native(
        locale,
        `${mover} की संदर्भ स्थिति ${evidence.moverOriginalRankFromStart} से बदलकर ${evidence.moverFinalRankFromStart} हो जाती है।`,
        `${mover} ਦੀ ਹਵਾਲਾ ਸਥਿਤੀ ${evidence.moverOriginalRankFromStart} ਤੋਂ ਬਦਲ ਕੇ ${evidence.moverFinalRankFromStart} ਹੋ ਜਾਂਦੀ ਹੈ।`,
      );
    }
  }

  return {
    keyRule: repairRnkCp003EditorialText(question.explanation.keyRule, locale),
    stepByStepSolution: steps,
    examSpeedShortcut: repairRnkCp003EditorialText(question.explanation.examSpeedShortcut, locale),
    optionAnalysis: question.explanation.optionAnalysis.map((line) => repairRnkCp003EditorialText(line, locale)),
    conclusion: repairRnkCp003EditorialText(question.explanation.conclusion, locale),
  };
}

export function applyRnkCp003LocalizationEditorialV2(
  question: RnkCp003LocalizedReviewQuestion,
): RnkCp003LocalizedReviewQuestion {
  const locale = question.locale;
  const stem = sourceMovementStem(question, locale) ?? repairRnkCp003EditorialText(question.stem, locale);
  const options = question.options.map((option: AnyQuestion) => ({
    ...option,
    label: repairRnkCp003EditorialText(String(option.label), locale),
    explanation: repairRnkCp003EditorialText(String(option.explanation), locale),
  }));
  const explanation = repairExplanation(question, locale);
  const answer = typeof question.answer === 'string'
    ? repairRnkCp003EditorialText(question.answer, locale)
    : question.answer;
  const localizationFingerprint = sha256({
    version: RNK_CP003_LOCALIZATION_REVIEW_V2_VERSION,
    editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL,
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
      version: RNK_CP003_LOCALIZATION_REVIEW_V2_VERSION,
      editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL,
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP003_LOCALIZATION_REVIEW_V2_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP003_LOCALIZATION_REVIEW_V2_EDITORIAL,
    },
  } as RnkCp003LocalizedReviewQuestion;
}

export function localizeRnkCp003PermanentQuestionV2(
  question: AnyQuestion,
  locale: RnkCp003LocalizedLocale,
): RnkCp003LocalizedReviewQuestion {
  return applyRnkCp003LocalizationEditorialV2(localizeRnkCp003PermanentQuestion(question, locale));
}

export function buildRnkCp003LocalizedReviewBankV2(
  locale: RnkCp003LocalizedLocale,
  seedsPerQl = 192,
): readonly RnkCp003LocalizedReviewQuestion[] {
  return buildRnkCp003LocalizedReviewBank(locale, seedsPerQl).map(applyRnkCp003LocalizationEditorialV2);
}
