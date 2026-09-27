import { createHash } from 'node:crypto';

import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
} from './cp004-foundation';
import {
  buildRnkCp004PermanentRuntime,
  type RnkCp004PermanentQuestion,
} from './cp004-permanent-runtime-v1';
import type { RnkCp004LocalizedLocale } from './cp004-localization-review-v1';
import {
  localizeRnkCp004PermanentQuestionV3,
  type RnkCp004LocalizedReviewQuestionV3,
} from './cp004-localization-review-v3';

export const RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION =
  'RNK_CP004_HI_PA_LOCALIZATION_REVIEW_V4' as const;
export const RNK_CP004_LOCALIZATION_REVIEW_V4_AUTHORITY =
  'RNK_CP004_HI_PA_MISSING_COMPARISON_PEDAGOGY_V4' as const;

export type RnkCp004LocalizedReviewQuestionV4 = Omit<
  RnkCp004LocalizedReviewQuestionV3,
  'localizationMetadata' | 'localizationProof'
> & {
  readonly localizationMetadata: Omit<
    RnkCp004LocalizedReviewQuestionV3['localizationMetadata'],
    'version'
  > & Readonly<{
    version: typeof RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION;
    missingComparisonPedagogyOverlay: 'TWO_BLOCK_BRIDGE_REASONING_V4';
    v3RuntimeContractBaselinePreserved: true;
  }>;
  readonly localizationProof: Omit<
    RnkCp004LocalizedReviewQuestionV3['localizationProof'],
    'authority'
  > & Readonly<{
    authority: typeof RNK_CP004_LOCALIZATION_REVIEW_V4_AUTHORITY;
    v3LocalizationFingerprint: string;
    missingComparisonPedagogyCoverage: 'EXECUTABLE_PROVED';
  }>;
};

type AnyQuestion = Record<string, any>;
type AnyOption = Record<string, any>;

function native(locale: RnkCp004LocalizedLocale, hi: string, pa: string): string {
  return locale === 'hi-IN' ? hi : pa;
}

function sha256(value: unknown): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : JSON.stringify(value), 'utf8')
    .digest('hex');
}

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function localName(
  localized: RnkCp004LocalizedReviewQuestionV3,
  canonicalName: string,
): string {
  const index = localized.canonicalNames.indexOf(canonicalName);
  if (index < 0) throw new Error(`CP004 V4 cannot localize canonical name ${canonicalName}`);
  return localized.localizedNames[index]!;
}

function localOrder(
  localized: RnkCp004LocalizedReviewQuestionV3,
  order: readonly string[],
): string {
  return order.map((name) => localName(localized, name)).join(' > ');
}

function bridgeFor(canonical: AnyQuestion): RnkCp004Comparison {
  const query = canonical.displayedEvidence.query;
  if (query.kind !== 'MISSING_COMPARISON') throw new Error('CP004 V4 expected missing-comparison query');
  const bridge = query.candidates.find(
    (candidate: RnkCp004Comparison) => relationKey(candidate) === canonical.answerKey,
  );
  if (!bridge) throw new Error(`CP004 V4 cannot find canonical bridge ${canonical.answerKey}`);
  return bridge;
}

function solvedOrderWithBridge(canonical: AnyQuestion): readonly string[] {
  const bridge = bridgeFor(canonical);
  return reconstructUniqueOrder(
    canonical.displayedEvidence.entities,
    [...canonical.displayedEvidence.clues, bridge],
  );
}

function partialOrderBlocks(canonical: AnyQuestion): readonly (readonly string[])[] {
  const entities = [...canonical.displayedEvidence.entities] as string[];
  const clues = canonical.displayedEvidence.clues as readonly RnkCp004Comparison[];
  const neighbours = new Map<string, Set<string>>(
    entities.map((entity) => [entity, new Set<string>()]),
  );
  for (const clue of clues) {
    neighbours.get(clue.higher)!.add(clue.lower);
    neighbours.get(clue.lower)!.add(clue.higher);
  }

  const seen = new Set<string>();
  const components: string[][] = [];
  for (const start of entities) {
    if (seen.has(start)) continue;
    const component: string[] = [];
    const stack = [start];
    seen.add(start);
    while (stack.length > 0) {
      const current = stack.pop()!;
      component.push(current);
      for (const next of neighbours.get(current) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          stack.push(next);
        }
      }
    }
    components.push(component);
  }

  const finalOrder = solvedOrderWithBridge(canonical);
  return components
    .map((component) => {
      const memberSet = new Set(component);
      const componentClues = clues.filter(
        (clue) => memberSet.has(clue.higher) && memberSet.has(clue.lower),
      );
      return reconstructUniqueOrder(component, componentClues);
    })
    .sort((left, right) => finalOrder.indexOf(left[0]!) - finalOrder.indexOf(right[0]!));
}

function missingStem(
  v3: RnkCp004LocalizedReviewQuestionV3,
  locale: RnkCp004LocalizedLocale,
): string {
  const sections = v3.stem.split('\n\n');
  if (sections.length < 2) throw new Error('CP004 V4 missing-comparison stem shape changed');
  sections[0] = locale === 'hi-IN'
    ? sections[0]!
      .replace(/नीचे दी गई तुलनाओं से उनका क्रम तय करें।/u, 'नीचे दी गई तुलनाएँ अभी पूरा क्रम निर्धारित नहीं करतीं।')
      .replace(/नीचे दी गई तुलनाओं से पूरा क्रम तय करें।/u, 'नीचे दी गई तुलनाएँ अभी पूरा क्रम निर्धारित नहीं करतीं।')
    : sections[0]!
      .replace(/ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਉਨ੍ਹਾਂ ਦਾ ਕ੍ਰਮ ਬਣਾਓ।/u, 'ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਹਾਲੇ ਪੂਰਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕਰਦੀਆਂ।')
      .replace(/ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਪੂਰਾ ਕ੍ਰਮ ਬਣਾਓ।/u, 'ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਹਾਲੇ ਪੂਰਾ ਕ੍ਰਮ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕਰਦੀਆਂ।');
  return sections.join('\n\n');
}

function missingOptionExplanation(
  optionIndex: number,
  correctIndex: number,
  label: string,
  locale: RnkCp004LocalizedLocale,
): string {
  if (optionIndex === correctIndex) {
    return native(
      locale,
      `“${label}” जोड़ने पर दोनों क्रम-खंड एक ही निश्चित पूरे क्रम में जुड़ जाते हैं`,
      `“${label}” ਜੋੜਨ ਉੱਤੇ ਦੋਵੇਂ ਕ੍ਰਮ-ਖੰਡ ਇੱਕੋ ਨਿਸ਼ਚਿਤ ਪੂਰੇ ਕ੍ਰਮ ਵਿੱਚ ਜੁੜ ਜਾਂਦੇ ਹਨ`,
    );
  }
  return native(
    locale,
    `“${label}” जोड़ने पर भी दोनों क्रम-खंडों की आपसी स्थिति पूरी तरह तय नहीं होती; इसलिए एक से अधिक क्रम संभव रहते हैं`,
    `“${label}” ਜੋੜਨ ਉੱਤੇ ਵੀ ਦੋਵੇਂ ਕ੍ਰਮ-ਖੰਡਾਂ ਦੀ ਆਪਸੀ ਸਥਿਤੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਹੁੰਦੀ; ਇਸ ਲਈ ਇੱਕ ਤੋਂ ਵੱਧ ਕ੍ਰਮ ਸੰਭਵ ਰਹਿੰਦੇ ਹਨ`,
  );
}

function missingExplanation(
  canonical: AnyQuestion,
  v3: RnkCp004LocalizedReviewQuestionV3,
  options: readonly AnyOption[],
  answer: string,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV3['explanation'] {
  const blocks = partialOrderBlocks(canonical);
  if (blocks.length !== 2) {
    throw new Error(`CP004 V4 expected two missing-comparison blocks, found ${blocks.length}`);
  }
  const finalOrder = solvedOrderWithBridge(canonical);
  const firstBlock = localOrder(v3, blocks[0]!);
  const secondBlock = localOrder(v3, blocks[1]!);
  const finalChain = localOrder(v3, finalOrder);
  const steps = [
    native(
      locale,
      `दी गई तुलनाओं से अभी दो अलग क्रम-खंड बनते हैं: ${firstBlock} तथा ${secondBlock}।`,
      `ਦਿੱਤੀਆਂ ਤੁਲਨਾਵਾਂ ਤੋਂ ਹਾਲੇ ਦੋ ਵੱਖਰੇ ਕ੍ਰਮ-ਖੰਡ ਬਣਦੇ ਹਨ: ${firstBlock} ਅਤੇ ${secondBlock}।`,
    ),
    native(
      locale,
      'दोनों खंडों के भीतर का क्रम तय है, लेकिन उनके बीच की आपसी स्थिति अभी तय नहीं है।',
      'ਦੋਵੇਂ ਖੰਡਾਂ ਦੇ ਅੰਦਰਲਾ ਕ੍ਰਮ ਤੈਅ ਹੈ, ਪਰ ਦੋਵਾਂ ਖੰਡਾਂ ਦੀ ਆਪਸੀ ਸਥਿਤੀ ਹਾਲੇ ਤੈਅ ਨਹੀਂ ਹੈ।',
    ),
    native(
      locale,
      `“${answer}” जोड़ने पर दोनों खंड एक ही निश्चित क्रम में जुड़ते हैं: ${finalChain}।`,
      `“${answer}” ਜੋੜਨ ਉੱਤੇ ਦੋਵੇਂ ਖੰਡ ਇੱਕੋ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਵਿੱਚ ਜੁੜਦੇ ਹਨ: ${finalChain}।`,
    ),
  ];
  const optionAnalysis = options.map((option, index) => native(
    locale,
    `विकल्प ${index + 1}: ${option.explanation}।`,
    `ਚੋਣ ${index + 1}: ${option.explanation}।`,
  ));

  return {
    mentalPicture: native(
      locale,
      'दिए गए संबंधों को पहले दो अलग क्रम-खंडों के रूप में देखिए; फिर वह तुलना खोजिए जो दोनों को एक निश्चित क्रम में जोड़ती है।',
      'ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਨੂੰ ਪਹਿਲਾਂ ਦੋ ਵੱਖਰੇ ਕ੍ਰਮ-ਖੰਡਾਂ ਵਜੋਂ ਵੇਖੋ; ਫਿਰ ਉਹ ਤੁਲਨਾ ਲੱਭੋ ਜੋ ਦੋਵਾਂ ਨੂੰ ਇੱਕ ਨਿਸ਼ਚਿਤ ਕ੍ਰਮ ਵਿੱਚ ਜੋੜਦੀ ਹੈ।',
    ),
    keyRule: native(
      locale,
      'पहले अलग-अलग क्रम-खंड बनाइए; फिर वही विकल्प चुनिए जो दोनों खंडों की आपसी स्थिति भी केवल एक ही तरह तय कर दे।',
      'ਪਹਿਲਾਂ ਵੱਖਰੇ ਕ੍ਰਮ-ਖੰਡ ਬਣਾਓ; ਫਿਰ ਉਹੀ ਚੋਣ ਚੁਣੋ ਜੋ ਦੋਵਾਂ ਖੰਡਾਂ ਦੀ ਆਪਸੀ ਸਥਿਤੀ ਵੀ ਕੇਵਲ ਇੱਕ ਹੀ ਤਰੀਕੇ ਨਾਲ ਤੈਅ ਕਰੇ।',
    ),
    stepByStepSolution: steps,
    examSpeedShortcut: native(
      locale,
      'दोनों खंडों के भीतर का क्रम पहले से तय है; केवल उस तुलना पर ध्यान दें जो दोनों खंडों को आपस में जोड़कर एक ही क्रम छोड़ती है।',
      'ਦੋਵੇਂ ਖੰਡਾਂ ਦੇ ਅੰਦਰਲਾ ਕ੍ਰਮ ਪਹਿਲਾਂ ਹੀ ਤੈਅ ਹੈ; ਕੇਵਲ ਉਸ ਤੁਲਨਾ ਉੱਤੇ ਧਿਆਨ ਦਿਓ ਜੋ ਦੋਵਾਂ ਖੰਡਾਂ ਨੂੰ ਆਪਸ ਵਿੱਚ ਜੋੜ ਕੇ ਇੱਕੋ ਕ੍ਰਮ ਛੱਡਦੀ ਹੈ।',
    ),
    optionAnalysis,
    conclusion: native(locale, `सही उत्तर: ${answer}।`, `ਸਹੀ ਜਵਾਬ: ${answer}।`),
  };
}

function v4Fingerprint(question: AnyQuestion): string {
  return sha256({
    version: RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION,
    canonicalSemanticFingerprint: question.localizationProof.canonicalSemanticFingerprint,
    locale: question.locale,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option: AnyOption) => ({
      answerKey: option.answerKey,
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: option.explanation,
    })),
    explanation: question.explanation,
    visibleExplanation: question.visibleExplanation,
  });
}

export function localizeRnkCp004PermanentQuestionV4(
  canonicalQuestion: RnkCp004PermanentQuestion | AnyQuestion,
  locale: RnkCp004LocalizedLocale,
): RnkCp004LocalizedReviewQuestionV4 {
  const canonical = canonicalQuestion as AnyQuestion;
  const v3 = localizeRnkCp004PermanentQuestionV3(canonicalQuestion, locale);

  let stem = v3.stem;
  let options = v3.options as readonly AnyOption[];
  let explanation = v3.explanation;
  let visibleExplanation = v3.visibleExplanation;

  if (canonical.displayedEvidence.query.kind === 'MISSING_COMPARISON') {
    stem = missingStem(v3, locale);
    options = v3.options.map((option: AnyOption, index: number) => ({
      ...option,
      explanation: missingOptionExplanation(index, canonical.correctIndex, option.label, locale),
    }));
    explanation = missingExplanation(canonical, v3, options, v3.answer, locale);
    visibleExplanation = {
      ...v3.visibleExplanation,
      lines: explanation.stepByStepSolution,
      answer: v3.answer,
      optionAnalysis: explanation.optionAnalysis,
    };
  }

  const localized = {
    ...v3,
    stem,
    options,
    explanation,
    visibleExplanation,
    localizationMetadata: {
      ...v3.localizationMetadata,
      version: RNK_CP004_LOCALIZATION_REVIEW_V4_VERSION,
      missingComparisonPedagogyOverlay: 'TWO_BLOCK_BRIDGE_REASONING_V4',
      v3RuntimeContractBaselinePreserved: true,
    },
    localizationProof: {
      ...v3.localizationProof,
      authority: RNK_CP004_LOCALIZATION_REVIEW_V4_AUTHORITY,
      v3LocalizationFingerprint: v3.localizationProof.localizationFingerprint,
      missingComparisonPedagogyCoverage: 'EXECUTABLE_PROVED',
      localizationFingerprint: '',
    },
  } as unknown as RnkCp004LocalizedReviewQuestionV4;

  return {
    ...localized,
    localizationProof: {
      ...localized.localizationProof,
      localizationFingerprint: v4Fingerprint(localized),
    },
  };
}

export function buildRnkCp004LocalizedReviewBankV4(
  locale: RnkCp004LocalizedLocale,
): readonly RnkCp004LocalizedReviewQuestionV4[] {
  return buildRnkCp004PermanentRuntime().map((question) =>
    localizeRnkCp004PermanentQuestionV4(question, locale));
}
