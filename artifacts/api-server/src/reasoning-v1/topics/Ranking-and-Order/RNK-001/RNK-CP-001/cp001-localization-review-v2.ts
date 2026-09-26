import { createHash } from 'node:crypto';

import type { RnkCp001PermanentQuestion } from './cp001-permanent-runtime';
import {
  localizeRnkCp001PermanentQuestion,
  type RnkCp001LocalizedLocale,
  type RnkCp001LocalizedReviewQuestion,
} from './cp001-localization-review-v1';
import { RNK_CP001_PERMANENT_QL_IDS, generateRnkCp001PermanentQuestion } from './cp001-permanent-runtime';

export const RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION =
  'RNK_CP001_HI_PA_LOCALIZATION_REVIEW_V2' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_V2_AUTHORITY =
  'RNK_CP001_HI_PA_NATIVE_EDITORIAL_REVIEW_V2' as const;
export const RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL =
  'NATIVE_CONTEXT_GRAMMAR_AND_EVIDENCE_ONLY_EXPLANATION_V2' as const;

type ContextId = RnkCp001LocalizedReviewQuestion['contextId'];
type LocalizedExplanation = RnkCp001LocalizedReviewQuestion['explanation'];

export type RnkCp001LocalizedReviewQuestionV2 = Omit<
  RnkCp001LocalizedReviewQuestion,
  'stem' | 'explanation' | 'reviewMetadata' | 'localizationProof'
> & {
  readonly stem: string;
  readonly explanation: LocalizedExplanation;
  readonly reviewMetadata: Omit<RnkCp001LocalizedReviewQuestion['reviewMetadata'], 'localization'> & {
    readonly localization: Readonly<{
      version: typeof RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION;
      locale: RnkCp001LocalizedLocale;
      learnerTextLocalized: true;
      humanLanguageReviewRequired: true;
      editorialVersion: typeof RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL;
    }>;
  };
  readonly localizationProof: Omit<
    RnkCp001LocalizedReviewQuestion['localizationProof'],
    'authority' | 'localizationFingerprint'
  > & {
    readonly authority: typeof RNK_CP001_LOCALIZATION_REVIEW_V2_AUTHORITY;
    readonly localizationFingerprint: string;
    readonly editorialVersion: typeof RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL;
  };
};

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function repairNativeStem(stem: string, locale: RnkCp001LocalizedLocale): string {
  if (locale === 'hi-IN') {
    return stem
      .replaceAll('1वें स्थान पर', 'पहले स्थान पर')
      .replaceAll('2वें स्थान पर', 'दूसरे स्थान पर')
      .replaceAll('3वें स्थान पर', 'तीसरे स्थान पर')
      .replaceAll('4वें स्थान पर', 'चौथे स्थान पर')
      .replace(/(^|[^0-9])1 व्यक्ति हैं/gu, '$1एक व्यक्ति है')
      .replace(/(^|[^0-9])1 अभ्यर्थी हैं/gu, '$1एक अभ्यर्थी है')
      .replace(/(^|[^0-9])0 व्यक्ति हैं/gu, '$1कोई व्यक्ति नहीं है')
      .replace(/(^|[^0-9])0 अभ्यर्थी हैं/gu, '$1कोई अभ्यर्थी नहीं है');
  }
  return stem
    .replaceAll("1ਵੇਂ ਸਥਾਨ 'ਤੇ", "ਪਹਿਲੇ ਸਥਾਨ 'ਤੇ")
    .replaceAll("2ਵੇਂ ਸਥਾਨ 'ਤੇ", "ਦੂਜੇ ਸਥਾਨ 'ਤੇ")
    .replaceAll("3ਵੇਂ ਸਥਾਨ 'ਤੇ", "ਤੀਜੇ ਸਥਾਨ 'ਤੇ")
    .replaceAll("4ਵੇਂ ਸਥਾਨ 'ਤੇ", "ਚੌਥੇ ਸਥਾਨ 'ਤੇ")
    .replaceAll('ਸਥਾਨ ਤੇ', "ਸਥਾਨ 'ਤੇ")
    .replace(/(^|[^0-9])1 ਵਿਅਕਤੀ ਹਨ/gu, '$1ਇੱਕ ਵਿਅਕਤੀ ਹੈ')
    .replace(/(^|[^0-9])1 ਉਮੀਦਵਾਰ ਹਨ/gu, '$1ਇੱਕ ਉਮੀਦਵਾਰ ਹੈ')
    .replace(/(^|[^0-9])0 ਵਿਅਕਤੀ ਹਨ/gu, '$1ਕੋਈ ਵਿਅਕਤੀ ਨਹੀਂ ਹੈ')
    .replace(/(^|[^0-9])0 ਉਮੀਦਵਾਰ ਹਨ/gu, '$1ਕੋਈ ਉਮੀਦਵਾਰ ਨਹੀਂ ਹੈ');
}

function contextWords(
  contextId: ContextId,
  locale: RnkCp001LocalizedLocale,
): Readonly<{
  startRank: string;
  endRank: string;
  beforeCount: string;
  afterCount: string;
  members: string;
  group: string;
}> {
  if (locale === 'hi-IN') {
    if (contextId === 'MERIT_LIST') {
      return {
        startRank: 'ऊपर से स्थान',
        endRank: 'नीचे से स्थान',
        beforeCount: 'ऊपर अभ्यर्थी',
        afterCount: 'नीचे अभ्यर्थी',
        members: 'अभ्यर्थी',
        group: 'योग्यता सूची',
      };
    }
    if (contextId === 'HORIZONTAL_ROW') {
      return {
        startRank: 'बाएँ से स्थान',
        endRank: 'दाएँ से स्थान',
        beforeCount: 'बाएँ व्यक्ति',
        afterCount: 'दाएँ व्यक्ति',
        members: 'व्यक्ति',
        group: 'पंक्ति',
      };
    }
    return {
      startRank: 'आगे से स्थान',
      endRank: 'पीछे से स्थान',
      beforeCount: 'आगे व्यक्ति',
      afterCount: 'पीछे व्यक्ति',
      members: 'व्यक्ति',
      group: 'कतार',
    };
  }

  if (contextId === 'MERIT_LIST') {
    return {
      startRank: 'ਉੱਪਰੋਂ ਸਥਾਨ',
      endRank: 'ਹੇਠੋਂ ਸਥਾਨ',
      beforeCount: 'ਉੱਪਰ ਉਮੀਦਵਾਰ',
      afterCount: 'ਹੇਠਾਂ ਉਮੀਦਵਾਰ',
      members: 'ਉਮੀਦਵਾਰ',
      group: 'ਯੋਗਤਾ ਸੂਚੀ',
    };
  }
  if (contextId === 'HORIZONTAL_ROW') {
    return {
      startRank: 'ਖੱਬੇ ਪਾਸੋਂ ਸਥਾਨ',
      endRank: 'ਸੱਜੇ ਪਾਸੋਂ ਸਥਾਨ',
      beforeCount: 'ਖੱਬੇ ਵਿਅਕਤੀ',
      afterCount: 'ਸੱਜੇ ਵਿਅਕਤੀ',
      members: 'ਵਿਅਕਤੀ',
      group: 'ਕਤਾਰ',
    };
  }
  return {
    startRank: 'ਅੱਗੋਂ ਸਥਾਨ',
    endRank: 'ਪਿੱਛੋਂ ਸਥਾਨ',
    beforeCount: 'ਅੱਗੇ ਵਿਅਕਤੀ',
    afterCount: 'ਪਿੱਛੇ ਵਿਅਕਤੀ',
    members: 'ਵਿਅਕਤੀ',
    group: 'ਲਾਈਨ',
  };
}

function stateOf(question: RnkCp001LocalizedReviewQuestion): Readonly<{
  total: number;
  rankFromStart: number;
  rankFromEnd: number;
  beforeCount: number;
  afterCount: number;
}> {
  return question.normalizedState as {
    readonly total: number;
    readonly rankFromStart: number;
    readonly rankFromEnd: number;
    readonly beforeCount: number;
    readonly afterCount: number;
  };
}

export function rnkCp001NativeVisibleGivens(
  question: RnkCp001LocalizedReviewQuestion,
): string {
  const locale = question.locale;
  const state = stateOf(question);
  const words = contextWords(question.contextId, locale);
  const prototype = question.reviewMetadata.sourcePrototypeId;
  const prefix = locale === 'hi-IN' ? 'दिए गए तथ्य' : 'ਦਿੱਤੇ ਤੱਥ';
  const middle = locale === 'hi-IN' ? 'ठीक बीच में' : 'ਬਿਲਕੁਲ ਵਿਚਕਾਰ';

  const join = (...parts: readonly string[]): string => `${prefix}: ${parts.join(', ')}।`;

  switch (prototype) {
    case 'RNK-CP001-PROT-OPPOSITE-END-RANK': {
      const evidence = question.displayedEvidence as unknown as {
        readonly knownSide: 'START' | 'END';
        readonly knownRank: number;
        readonly total: number;
      };
      return join(
        `${locale === 'hi-IN' ? 'कुल' : 'ਕੁੱਲ'} = ${evidence.total}`,
        `${evidence.knownSide === 'START' ? words.startRank : words.endRank} = ${evidence.knownRank}`,
      );
    }
    case 'RNK-CP001-PROT-TOTAL-FROM-TWO-END-RANKS':
      return join(`${words.startRank} = ${state.rankFromStart}`, `${words.endRank} = ${state.rankFromEnd}`);
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-RANK':
      return join(`${words.startRank} = ${state.rankFromStart}`);
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK':
      return join(`${words.endRank} = ${state.rankFromEnd}`);
    case 'RNK-CP001-PROT-COUNT-AFTER-FROM-TOTAL-AND-RANK':
      return join(`${locale === 'hi-IN' ? 'कुल' : 'ਕੁੱਲ'} = ${state.total}`, `${words.startRank} = ${state.rankFromStart}`);
    case 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK':
      return join(`${locale === 'hi-IN' ? 'कुल' : 'ਕੁੱਲ'} = ${state.total}`, `${words.endRank} = ${state.rankFromEnd}`);
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-BEFORE':
      return join(`${words.beforeCount} = ${state.beforeCount}`);
    case 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER':
      return join(`${words.afterCount} = ${state.afterCount}`);
    case 'RNK-CP001-PROT-RANK-FROM-COUNT-AFTER-AND-TOTAL':
      return join(`${locale === 'hi-IN' ? 'कुल' : 'ਕੁੱਲ'} = ${state.total}`, `${words.afterCount} = ${state.afterCount}`);
    case 'RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL':
      return join(`${locale === 'hi-IN' ? 'कुल' : 'ਕੁੱਲ'} = ${state.total}`, `${words.beforeCount} = ${state.beforeCount}`);
    case 'RNK-CP001-PROT-MIDDLE-RANK-FROM-TOTAL':
      return join(`${locale === 'hi-IN' ? 'कुल' : 'ਕੁੱਲ'} = ${state.total}`, middle);
    case 'RNK-CP001-PROT-TOTAL-FROM-MIDDLE-RANK':
      return join(`${words.startRank} = ${state.rankFromStart}`, middle);
    case 'RNK-CP001-PROT-TOTAL-FROM-BEFORE-AFTER-COUNTS':
      return join(`${words.beforeCount} = ${state.beforeCount}`, `${words.afterCount} = ${state.afterCount}`);
    default:
      throw new Error(`Unsupported CP001 V2 visible-givens prototype: ${prototype}`);
  }
}

function calculation(question: RnkCp001LocalizedReviewQuestion): string {
  const state = stateOf(question);
  switch (question.qlId) {
    case 'RNK-QL-001': {
      const evidence = question.displayedEvidence as unknown as { readonly knownRank: number };
      return `${state.total} - ${evidence.knownRank} + 1 = ${question.answer}`;
    }
    case 'RNK-QL-002': return `${state.rankFromStart} + ${state.rankFromEnd} - 1 = ${question.answer}`;
    case 'RNK-QL-003': {
      const rank = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-COUNT-AFTER-FROM-END-RANK'
        ? state.rankFromEnd : state.rankFromStart;
      return `${rank} - 1 = ${question.answer}`;
    }
    case 'RNK-QL-004': {
      const rank = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-COUNT-BEFORE-FROM-TOTAL-END-RANK'
        ? state.rankFromEnd : state.rankFromStart;
      return `${state.total} - ${rank} = ${question.answer}`;
    }
    case 'RNK-QL-005': {
      const count = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-AFTER'
        ? state.afterCount : state.beforeCount;
      return `${count} + 1 = ${question.answer}`;
    }
    case 'RNK-QL-006': {
      const count = question.reviewMetadata.sourcePrototypeId === 'RNK-CP001-PROT-END-RANK-FROM-COUNT-BEFORE-AND-TOTAL'
        ? state.beforeCount : state.afterCount;
      return `${state.total} - ${count} = ${question.answer}`;
    }
    case 'RNK-QL-007': return `(${state.total} + 1) ÷ 2 = ${question.answer}`;
    case 'RNK-QL-008': return `2 × ${state.rankFromStart} - 1 = ${question.answer}`;
    case 'RNK-QL-009': return `${state.beforeCount} + ${state.afterCount} + 1 = ${question.answer}`;
  }
}

function renderExplanationV2(
  question: RnkCp001LocalizedReviewQuestion,
): LocalizedExplanation {
  const calc = calculation(question);
  const locale = question.locale;
  const givens = rnkCp001NativeVisibleGivens(question);
  const second = locale === 'hi-IN'
    ? `अब संबंधित नियम लगाएँ: ${calc}।`
    : `ਹੁਣ ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ: ${calc}।`;
  const third = locale === 'hi-IN'
    ? `इसलिए आवश्यक उत्तर ${question.answer} है।`
    : `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਉੱਤਰ ${question.answer} ਹੈ।`;
  const shortcut = locale === 'hi-IN'
    ? `तेज़ तरीका: केवल प्रश्न में दिए गए छोर या पक्ष के मान लें और सीधे ${calc} करें।`
    : `ਤੇਜ਼ ਤਰੀਕਾ: ਸਿਰਫ਼ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੇ ਸਿਰੇ ਜਾਂ ਪਾਸੇ ਦੇ ਮਾਨ ਲਵੋ ਅਤੇ ਸਿੱਧਾ ${calc} ਕਰੋ।`;

  return {
    ...question.explanation,
    stepByStepSolution: [givens, second, third],
    examSpeedShortcut: shortcut,
  };
}

export function localizeRnkCp001V1QuestionToV2(
  question: RnkCp001LocalizedReviewQuestion,
): RnkCp001LocalizedReviewQuestionV2 {
  const stem = repairNativeStem(question.stem, question.locale);
  const explanation = renderExplanationV2(question);
  const localizationFingerprint = sha256({
    version: RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION,
    permanentQlId: question.permanentQlId,
    seed: question.seed,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    targetName: question.targetName,
    stem,
    options: question.options,
    explanation,
  });

  return {
    ...question,
    stem,
    explanation,
    reviewMetadata: {
      ...question.reviewMetadata,
      localization: {
        version: RNK_CP001_LOCALIZATION_REVIEW_V2_VERSION,
        locale: question.locale,
        learnerTextLocalized: true,
        humanLanguageReviewRequired: true,
        editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL,
      },
    },
    localizationProof: {
      ...question.localizationProof,
      authority: RNK_CP001_LOCALIZATION_REVIEW_V2_AUTHORITY,
      localizationFingerprint,
      editorialVersion: RNK_CP001_LOCALIZATION_REVIEW_V2_EDITORIAL,
    },
  };
}

export function localizeRnkCp001PermanentQuestionV2(
  question: RnkCp001PermanentQuestion,
  locale: RnkCp001LocalizedLocale,
): RnkCp001LocalizedReviewQuestionV2 {
  return localizeRnkCp001V1QuestionToV2(localizeRnkCp001PermanentQuestion(question, locale));
}

export function buildRnkCp001LocalizedReviewBankV2(
  locale: RnkCp001LocalizedLocale,
  seedsPerQl = 128,
): readonly RnkCp001LocalizedReviewQuestionV2[] {
  return RNK_CP001_PERMANENT_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, seed) =>
      localizeRnkCp001PermanentQuestionV2(generateRnkCp001PermanentQuestion(qlId, seed), locale),
    ),
  );
}
