import {
  reconstructUniqueOrder,
  type RnkCp004Option,
} from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion as generateApprovedV7,
  type RnkCp004ExamReadyQuestion as RnkCp004V7Question,
  type RnkCp004RemodelV7PrototypeId,
} from './cp004-exam-ready-v14';

export {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V7_PROTOTYPE_IDS,
};
export type { RnkCp004RemodelV7PrototypeId };

export const RNK_CP004_SOURCE_INVERSE_VERSION = 'RNK_CP004_SOURCE_INVERSE_V1' as const;
export const RNK_CP004_ENGLISH_APPROVAL_ID = 'USER_APPROVED_2026_08_07' as const;

export type RnkCp004SourceInverseVariant =
  | 'CANONICAL'
  | 'ENTITY_AT_RANK_FROM_BOTTOM'
  | 'RANK_FROM_BOTTOM'
  | 'ORDER_LOWEST_TO_HIGHEST';

export type RnkCp004InverseCoverageClass =
  | 'SOURCE_INVERSE_PARAMETER'
  | 'ENDPOINT_PAIRED_AUTHORITY'
  | 'ABOVE_BELOW_PARAMETER'
  | 'PAIR_INPUT_SYMMETRY'
  | 'NO_MATERIAL_INVERSE';

export interface RnkCp004SourceInverseProfile {
  readonly version: typeof RNK_CP004_SOURCE_INVERSE_VERSION;
  readonly variant: RnkCp004SourceInverseVariant;
  readonly coverageClass: RnkCp004InverseCoverageClass;
  readonly authorityDecision: 'EXISTING_AUTHORITY_PARAMETER';
  readonly canonicalAnswerKey: string;
  readonly displayedAnswerKey: string;
  readonly rankReference: 'TOP' | 'BOTTOM' | null;
  readonly orderDirection: 'HIGHEST_TO_LOWEST' | 'LOWEST_TO_HIGHEST' | null;
  readonly permanentQlImpact: 'NONE';
}

export type RnkCp004SourceInverseQuestion = Omit<RnkCp004V7Question, 'reviewMetadata'> & {
  readonly reviewMetadata: Omit<RnkCp004V7Question['reviewMetadata'], 'examAuthenticityStatus'> & {
    readonly examAuthenticityStatus: 'MANUAL_ENGLISH_APPROVED';
    readonly englishManualApprovalId: typeof RNK_CP004_ENGLISH_APPROVAL_ID;
    readonly sourceInverseStatus: 'EXPANSION_ACTIVE';
    readonly sourceInverseProfile: RnkCp004SourceInverseProfile;
  };
};

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function replaceLastNonEmptyLine(stem: string, replacement: string): string {
  const lines = stem.split('\n');
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index].trim().length > 0) {
      lines[index] = replacement;
      return lines.join('\n');
    }
  }
  throw new Error('Stem has no question line');
}

function option(
  answerKey: string,
  label: string,
  misconceptionId: string,
  explanation: string,
): RnkCp004Option {
  return { answerKey, label, misconceptionId, explanation };
}

function placeCorrect(
  correct: RnkCp004Option,
  wrong: readonly RnkCp004Option[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (wrong.length !== 3) throw new Error(`Expected three distractors, found ${wrong.length}`);
  const output: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    output.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return output;
}

function solvedOrder(question: RnkCp004V7Question): readonly string[] {
  if (question.displayedEvidence.query.kind === 'MISSING_COMPARISON') {
    throw new Error('Source inverse transforms do not operate on incomplete comparison evidence');
  }
  return reconstructUniqueOrder(question.displayedEvidence.entities, question.displayedEvidence.clues);
}

function compactOptionAnalysis(
  options: readonly RnkCp004Option[],
  answerKey: string,
): readonly string[] {
  return options
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.answerKey !== answerKey)
    .map(({ item, index }) => `Option ${String.fromCharCode(65 + index)}: ${item.explanation.replace(/[.]+$/g, '')}.`);
}

function withLearnerExplanation(
  base: RnkCp004V7Question,
  stem: string,
  answerKey: string,
  answer: string,
  options: readonly RnkCp004Option[],
  lines: readonly string[],
  keyRule: string,
): RnkCp004V7Question {
  const optionAnalysis = compactOptionAnalysis(options, answerKey);
  return {
    ...base,
    stem,
    answerKey,
    answer,
    options,
    explanation: {
      ...base.explanation,
      mentalPicture: 'Read the same exact ranking in the direction requested by the question.',
      keyRule,
      stepByStepSolution: lines,
      optionAnalysis,
      conclusion: `Answer: ${answer}.`,
    },
    visibleExplanation: {
      ...base.visibleExplanation,
      lines,
      answer,
      optionAnalysis,
    },
  };
}

function transformEntityAtRankFromBottom(base: RnkCp004V7Question): RnkCp004V7Question {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'ENTITY_AT_EXACT_RANK') throw new Error('Bottom-rank entity transform requires an exact-rank query');
  const order = solvedOrder(base);
  const rankFromBottom = order.length - query.rankFromTop + 1;
  const target = base.answerKey;
  const options = base.options.map((item) => {
    const rank = order.length - order.indexOf(item.answerKey);
    return {
      ...item,
      explanation: item.answerKey === target
        ? `${item.label} is ${ordinal(rankFromBottom)} from the bottom`
        : `${item.label} is ${ordinal(rank)} from the bottom, not ${ordinal(rankFromBottom)}`,
    };
  });
  const stem = replaceLastNonEmptyLine(base.stem, `Who stood ${ordinal(rankFromBottom)} from the bottom?`);
  const lines = [
    `Complete order from highest to lowest: ${order.join(' > ')}`,
    `Counting upward from the bottom, ${target} is in position ${rankFromBottom}.`,
    `Therefore, ${target} is ${ordinal(rankFromBottom)} from the bottom.`,
  ];
  return withLearnerExplanation(
    base,
    stem,
    base.answerKey,
    base.answer,
    options,
    lines,
    'For a rank from the bottom, count upward from the lowest position or use n − top rank + 1.',
  );
}

function distinctRanks(values: readonly number[], maximum: number, excluded: number): number[] {
  const output: number[] = [];
  for (const value of values) {
    if (value >= 1 && value <= maximum && value !== excluded && !output.includes(value)) output.push(value);
  }
  for (let value = 1; output.length < 3 && value <= maximum; value += 1) {
    if (value !== excluded && !output.includes(value)) output.push(value);
  }
  if (output.length < 3) throw new Error('Unable to build three rank distractors');
  return output.slice(0, 3);
}

function transformRankFromBottom(base: RnkCp004V7Question): RnkCp004V7Question {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'RANK_OF_NAMED_ENTITY') throw new Error('Bottom-rank transform requires a named-rank query');
  const order = solvedOrder(base);
  const topRank = order.indexOf(query.target) + 1;
  const bottomRank = order.length - topRank + 1;
  const wrongRanks = distinctRanks(
    [topRank, bottomRank - 1, bottomRank + 1, bottomRank - 2, bottomRank + 2],
    order.length,
    bottomRank,
  );
  const correct = option(
    String(bottomRank),
    String(bottomRank),
    'CORRECT',
    `${query.target} is ${ordinal(bottomRank)} from the bottom`,
  );
  const wrong = wrongRanks.map((rank) => option(
    String(rank),
    String(rank),
    rank === topRank && topRank !== bottomRank ? 'TOP_BOTTOM_CONVERSION_ERROR' : 'ADJACENT_RANK_ERROR',
    rank === topRank && topRank !== bottomRank
      ? `${rank} is ${query.target}'s rank from the top, not from the bottom`
      : `${query.target} is ${ordinal(bottomRank)} from the bottom, not ${ordinal(rank)}`,
  ));
  const options = placeCorrect(correct, wrong, base.correctIndex);
  const answer = options[base.correctIndex].label;
  const stem = replaceLastNonEmptyLine(base.stem, `What is ${query.target}'s rank from the bottom?`);
  const lines = [
    `Complete order from highest to lowest: ${order.join(' > ')}`,
    `${query.target} is ${ordinal(topRank)} from the top in a group of ${order.length}.`,
    `Rank from the bottom = ${order.length} − ${topRank} + 1 = ${bottomRank}.`,
  ];
  return withLearnerExplanation(
    base,
    stem,
    String(bottomRank),
    answer,
    options,
    lines,
    'Rank from bottom = total people − rank from top + 1.',
  );
}

function reverseOrderKey(key: string): string {
  const values = key.split('|');
  if (values.length < 2) throw new Error(`Unexpected complete-order answer key: ${key}`);
  return [...values].reverse().join('|');
}

function transformOrderLowestToHighest(base: RnkCp004V7Question): RnkCp004V7Question {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'COMPLETE_ORDER') throw new Error('Reverse-order transform requires a complete-order query');
  const order = solvedOrder(base);
  const expected = [...order].reverse();
  const expectedKey = expected.join('|');
  const options = base.options.map((item) => {
    const candidate = item.answerKey.split('|').reverse();
    const reversedKey = candidate.join('|');
    const mismatch = candidate.findIndex((entity, index) => entity !== expected[index]);
    return option(
      reversedKey,
      candidate.join(' > '),
      item.misconceptionId,
      reversedKey === expectedKey
        ? 'This matches the complete order from lowest to highest'
        : `The order first differs at position ${mismatch + 1}; ${expected[mismatch]} should appear there`,
    );
  });
  const answer = options[base.correctIndex].label;
  const stem = replaceLastNonEmptyLine(base.stem, 'Which option gives the correct complete ranking from lowest to highest?');
  const lines = [
    `First establish the order from highest to lowest: ${order.join(' > ')}`,
    `Reverse that sequence because the question asks from lowest to highest: ${expected.join(' > ')}`,
    'Choose the option that matches this reversed order exactly.',
  ];
  return withLearnerExplanation(
    base,
    stem,
    expectedKey,
    answer,
    options,
    lines,
    'Once the exact order is known, reverse the sequence when the requested presentation direction is lowest to highest.',
  );
}

function defaultVariant(base: RnkCp004V7Question): RnkCp004SourceInverseVariant {
  if (Math.abs(base.seed) % 2 === 0) return 'CANONICAL';
  switch (base.displayedEvidence.query.kind) {
    case 'ENTITY_AT_EXACT_RANK': return 'ENTITY_AT_RANK_FROM_BOTTOM';
    case 'RANK_OF_NAMED_ENTITY': return 'RANK_FROM_BOTTOM';
    case 'COMPLETE_ORDER': return 'ORDER_LOWEST_TO_HIGHEST';
    default: return 'CANONICAL';
  }
}

function coverageClass(question: RnkCp004V7Question): RnkCp004InverseCoverageClass {
  switch (question.displayedEvidence.query.kind) {
    case 'HIGHEST_ENTITY':
    case 'LOWEST_ENTITY':
      return 'ENDPOINT_PAIRED_AUTHORITY';
    case 'ENTITY_AT_EXACT_RANK':
    case 'RANK_OF_NAMED_ENTITY':
    case 'COMPLETE_ORDER':
      return 'SOURCE_INVERSE_PARAMETER';
    case 'IMMEDIATE_NEIGHBOUR':
      return 'ABOVE_BELOW_PARAMETER';
    case 'RELATIVE_ORDER_OF_PAIR':
      return 'PAIR_INPUT_SYMMETRY';
    default:
      return 'NO_MATERIAL_INVERSE';
  }
}

function validateOverride(
  base: RnkCp004V7Question,
  variant: RnkCp004SourceInverseVariant,
): void {
  const kind = base.displayedEvidence.query.kind;
  if (variant === 'CANONICAL') return;
  if (variant === 'ENTITY_AT_RANK_FROM_BOTTOM' && kind === 'ENTITY_AT_EXACT_RANK') return;
  if (variant === 'RANK_FROM_BOTTOM' && kind === 'RANK_OF_NAMED_ENTITY') return;
  if (variant === 'ORDER_LOWEST_TO_HIGHEST' && kind === 'COMPLETE_ORDER') return;
  throw new Error(`Variant ${variant} is not valid for ${kind}`);
}

export function generateRnkCp004SourceInverseQuestion(
  prototypeId: RnkCp004RemodelV7PrototypeId,
  seed: number,
  correctIndexOverride?: number,
  variantOverride?: RnkCp004SourceInverseVariant,
): RnkCp004SourceInverseQuestion {
  const base = generateApprovedV7(prototypeId, seed, correctIndexOverride);
  const canonicalAnswerKey = base.answerKey;
  const variant = variantOverride ?? defaultVariant(base);
  validateOverride(base, variant);

  let transformed: RnkCp004V7Question = base;
  if (variant === 'ENTITY_AT_RANK_FROM_BOTTOM') transformed = transformEntityAtRankFromBottom(base);
  if (variant === 'RANK_FROM_BOTTOM') transformed = transformRankFromBottom(base);
  if (variant === 'ORDER_LOWEST_TO_HIGHEST') transformed = transformOrderLowestToHighest(base);

  const rankReference = variant === 'ENTITY_AT_RANK_FROM_BOTTOM' || variant === 'RANK_FROM_BOTTOM'
    ? 'BOTTOM'
    : transformed.displayedEvidence.query.kind === 'ENTITY_AT_EXACT_RANK'
      || transformed.displayedEvidence.query.kind === 'RANK_OF_NAMED_ENTITY'
      ? 'TOP'
      : null;
  const orderDirection = transformed.displayedEvidence.query.kind === 'COMPLETE_ORDER'
    ? variant === 'ORDER_LOWEST_TO_HIGHEST' ? 'LOWEST_TO_HIGHEST' : 'HIGHEST_TO_LOWEST'
    : null;

  return {
    ...transformed,
    mathematicalFingerprint: `${transformed.mathematicalFingerprint}:${RNK_CP004_SOURCE_INVERSE_VERSION}:${variant}`,
    reviewMetadata: {
      ...transformed.reviewMetadata,
      examAuthenticityStatus: 'MANUAL_ENGLISH_APPROVED',
      englishManualApprovalId: RNK_CP004_ENGLISH_APPROVAL_ID,
      sourceInverseStatus: 'EXPANSION_ACTIVE',
      sourceInverseProfile: {
        version: RNK_CP004_SOURCE_INVERSE_VERSION,
        variant,
        coverageClass: coverageClass(base),
        authorityDecision: 'EXISTING_AUTHORITY_PARAMETER',
        canonicalAnswerKey,
        displayedAnswerKey: transformed.answerKey,
        rankReference,
        orderDirection,
        permanentQlImpact: 'NONE',
      },
      normalizedSemanticFingerprint: `${transformed.reviewMetadata.normalizedSemanticFingerprint}|${RNK_CP004_SOURCE_INVERSE_VERSION}:${variant}`,
    },
  };
}
