export const CLK_BANKING_FIVE_OPTION_DELIVERY_VERSION =
  'CLK_001_BANKING_FIVE_OPTION_DELIVERY_V1' as const;

export type ClockDeliveryLanguage = 'en' | 'hi' | 'pa';

function noneLabel(language: ClockDeliveryLanguage): string {
  if (language === 'hi') return 'इनमें से कोई नहीं';
  if (language === 'pa') return 'ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ';
  return 'None of these';
}

export function adaptClockOptionsForBanking(input: {
  options: readonly string[];
  correctIndex: number;
  language: ClockDeliveryLanguage;
}) {
  if (input.options.length !== 4) {
    throw new Error(
      'CLK-001 banking delivery requires exactly four canonical options, found ' +
      input.options.length +
      '.',
    );
  }
  if (!Number.isInteger(input.correctIndex) || input.correctIndex < 0 || input.correctIndex > 3) {
    throw new Error(
      'CLK-001 banking delivery expected canonical correct index 0..3, found ' +
      String(input.correctIndex) +
      '.',
    );
  }

  const fifth = noneLabel(input.language);
  if (input.options.includes(fifth)) {
    throw new Error('CLK-001 banking delivery would duplicate the fifth option label.');
  }

  return {
    options: [...input.options, fifth],
    correctIndex: input.correctIndex,
    metadata: {
      version: CLK_BANKING_FIVE_OPTION_DELIVERY_VERSION,
      sourceOptionCount: 4,
      deliveredOptionCount: 5,
      fifthOptionKind: 'NONE_OF_THESE_KNOWN_FALSE',
      canonicalCorrectIndex: input.correctIndex,
      deliveredCorrectIndex: input.correctIndex,
      correctAnswerMoved: false,
      canonicalOptionsMutated: false,
      mathematicalAuthorityChanged: false,
      newQlAllocated: false,
    },
  } as const;
}
