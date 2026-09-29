import { createHash } from 'node:crypto';

export const RNK_BANKING_FIVE_OPTION_ADAPTER_VERSION =
  'RNK_001_BANKING_FIVE_OPTION_DELIVERY_ADAPTER_V1' as const;

export type RnkDeliveryLocale = 'en-IN' | 'hi-IN' | 'pa-IN';

type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any>;

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function noneLabel(locale: RnkDeliveryLocale): string {
  if (locale === 'hi-IN') return 'इनमें से कोई नहीं';
  if (locale === 'pa-IN') return 'ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ';
  return 'None of these';
}

function noneExplanation(locale: RnkDeliveryLocale): string {
  if (locale === 'hi-IN') {
    return 'यह विकल्प सही नहीं है क्योंकि सही उत्तर पहले चार विकल्पों में मौजूद है।';
  }
  if (locale === 'pa-IN') {
    return 'ਇਹ ਚੋਣ ਸਹੀ ਨਹੀਂ ਹੈ ਕਿਉਂਕਿ ਸਹੀ ਜਵਾਬ ਪਹਿਲੀਆਂ ਚਾਰ ਚੋਣਾਂ ਵਿੱਚ ਮੌਜੂਦ ਹੈ।';
  }
  return 'This option is not correct because the correct answer is present among the first four options.';
}

function correctIndex(question: AnyQuestion): number {
  const value = Number.isInteger(question.correctIndex)
    ? question.correctIndex
    : question.answerIndex;
  if (!Number.isInteger(value) || value < 0 || value > 3) {
    throw new Error(`RNK banking adapter expected canonical correct index 0..3, found ${String(value)}`);
  }
  return value;
}

function appendNoneOption(
  options: readonly unknown[],
  locale: RnkDeliveryLocale,
): readonly unknown[] {
  const label = noneLabel(locale);
  if (options.length !== 4) {
    throw new Error(`RNK banking adapter requires exactly four canonical options, found ${options.length}`);
  }

  const first = options[0];
  if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
    const none: AnyOption = {
      label,
      answerKey: '__RNK_DELIVERY_NONE_OF_THESE__',
      misconceptionId: 'DELIVERY_NONE_OF_THESE_FALSE',
      explanation: noneExplanation(locale),
      deliveryOnly: true,
      canonicalOption: false,
    };
    return [...options, none];
  }

  return [...options, label];
}

export function adaptRnkQuestionForBankingFiveOptions(
  question: AnyQuestion,
  locale: RnkDeliveryLocale,
): AnyQuestion {
  const canonicalCorrectIndex = correctIndex(question);
  const options = appendNoneOption(question.options, locale);
  const sourceFingerprint = String(
    question.permanentRuntimeFingerprint
      ?? question.mathematicalFingerprint
      ?? question.canonicalSemanticFingerprint
      ?? sha256({ stem: question.stem, options: question.options, answer: question.answer }),
  );
  const deliveryFingerprint = sha256({
    version: RNK_BANKING_FIVE_OPTION_ADAPTER_VERSION,
    locale,
    sourceFingerprint,
    options,
    canonicalCorrectIndex,
    answer: question.answer,
  });

  return {
    ...question,
    options,
    correctIndex: Number.isInteger(question.correctIndex)
      ? canonicalCorrectIndex
      : question.correctIndex,
    answerIndex: Number.isInteger(question.answerIndex)
      ? canonicalCorrectIndex
      : question.answerIndex,
    bankingFiveOptionDelivery: {
      version: RNK_BANKING_FIVE_OPTION_ADAPTER_VERSION,
      locale,
      sourceOptionCount: 4,
      deliveredOptionCount: 5,
      fifthOptionKind: 'NONE_OF_THESE_KNOWN_FALSE',
      canonicalCorrectIndex,
      deliveredCorrectIndex: canonicalCorrectIndex,
      correctAnswerMoved: false,
      canonicalOptionsMutated: false,
      mathematicalAuthorityChanged: false,
      newQlAllocated: false,
      questionStudioActivationGranted: false,
      sourceFingerprint,
      deliveryFingerprint,
    },
  };
}
