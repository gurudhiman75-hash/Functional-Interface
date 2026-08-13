import {
  generateRnkCp002Question,
  hashText,
  randomInt,
  RNK_CP002_CONTEXTS,
  type RnkCp002ContextVocabulary,
  type RnkCp002NormalizedState,
} from './cp002-foundation';

export const RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS = [
  'RNK-CP002-PROT-POSITION-GAP-MIXED-END-RANKS',
  'RNK-CP002-PROT-OFFSET-FROM-SAME-END-RANKS',
  'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER',
  'RNK-CP002-PROT-COMPARE-SAME-END-RANKS',
  'RNK-CP002-PROT-COMPARE-MIXED-END-RANKS-WITH-TOTAL',
  'RNK-CP002-PROT-EXACT-TOTAL-OR-INDETERMINATE-UNKNOWN-ORDER',
  'RNK-CP002-PROT-PROPOSED-TOTAL-COMPATIBLE-ORDER',
] as const;

export type RnkCp002SourceWavePrototypeId =
  (typeof RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS)[number];

export type RnkCp002SourceAnswerSemantic = 'RANK' | 'COUNT' | 'TOTAL_OR_INDETERMINATE' | 'PERSON' | 'ORDER_STATUS';

export interface RnkCp002SourceOption {
  readonly value: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export type RnkCp002SourceEvidence =
  | { readonly kind: 'POSITION_GAP_MIXED_END'; readonly total: number; readonly firstRankFromStart: number; readonly secondRankFromEnd: number }
  | { readonly kind: 'OFFSET_FROM_SAME_END'; readonly side: 'START' | 'END'; readonly firstRank: number; readonly secondRank: number }
  | { readonly kind: 'TARGET_RANK_FROM_BETWEEN'; readonly side: 'START' | 'END'; readonly referenceRank: number; readonly betweenCount: number; readonly direction: 'TOWARD_START' | 'TOWARD_END' }
  | { readonly kind: 'COMPARE_SAME_END'; readonly side: 'START' | 'END'; readonly firstRank: number; readonly secondRank: number; readonly requested: 'NEARER_SUPPLIED_END' | 'TOWARD_START' | 'TOWARD_END' }
  | { readonly kind: 'COMPARE_MIXED_END'; readonly total: number; readonly firstRankFromStart: number; readonly secondRankFromEnd: number; readonly requested: 'TOWARD_START' | 'TOWARD_END' }
  | { readonly kind: 'EXACT_TOTAL_OR_INDETERMINATE'; readonly firstRankFromStart: number; readonly secondRankFromEnd: number; readonly betweenCount: number; readonly highTotal: number; readonly lowTotal: number; readonly lowTotalValid: boolean }
  | { readonly kind: 'PROPOSED_TOTAL_ORDER_STATUS'; readonly firstRankFromStart: number; readonly secondRankFromEnd: number; readonly betweenCount: number; readonly proposedTotal: number; readonly highTotal: number; readonly lowTotal: number; readonly lowTotalValid: boolean };

export interface RnkCp002SourceQuestion {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-002';
  readonly prototypeId: RnkCp002SourceWavePrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly contextId: 'MERIT_LIST' | 'HORIZONTAL_ROW' | 'QUEUE';
  readonly firstName: string;
  readonly secondName: string;
  readonly stem: string;
  readonly displayedEvidence: RnkCp002SourceEvidence;
  readonly answerSemantic: RnkCp002SourceAnswerSemantic;
  readonly answer: string;
  readonly options: readonly RnkCp002SourceOption[];
  readonly correctIndex: number;
  readonly difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  readonly normalizedState: RnkCp002NormalizedState | null;
  readonly explanation: {
    readonly keyRule: string;
    readonly stepByStepSolution: readonly string[];
    readonly examSpeedShortcut: string;
    readonly optionAnalysis: readonly string[];
    readonly conclusion: string;
  };
  readonly mathematicalFingerprint: string;
  readonly lifecycle: {
    readonly reviewStatus: 'UNREVIEWED';
    readonly questionStudioDiscoverable: false;
    readonly questionBankStatus: 'NOT_STORED';
    readonly testEligibility: 'INELIGIBLE';
    readonly publiclyPublishable: false;
  };
}

const CANNOT_BE_DETERMINED = 'Cannot be determined';
const FIRST_BEFORE_SECOND = 'The first person is nearer the start end';
const SECOND_BEFORE_FIRST = 'The second person is nearer the start end';
const PROPOSED_TOTAL_IMPOSSIBLE = 'The proposed total is impossible';

function ordinal(value: number): string {
  const modulo100 = value % 100;
  if (modulo100 >= 11 && modulo100 <= 13) return `${value}th`;
  const modulo10 = value % 10;
  if (modulo10 === 1) return `${value}st`;
  if (modulo10 === 2) return `${value}nd`;
  if (modulo10 === 3) return `${value}rd`;
  return `${value}th`;
}

function contextFor(id: RnkCp002SourceQuestion['contextId']): RnkCp002ContextVocabulary {
  const context = RNK_CP002_CONTEXTS.find((item) => item.id === id);
  if (!context) throw new Error(`Unknown context ${id}`);
  return context;
}

function createRng(prototypeId: RnkCp002SourceWavePrototypeId, seed: number): () => number {
  let state = hashText(`${prototypeId}:${seed}`) || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function baseQuestion(prototypeId: RnkCp002SourceWavePrototypeId, seed: number) {
  const anchor = prototypeId === 'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER'
    ? 'RNK-CP002-PROT-SECOND-RANK-FROM-RELATIVE-OFFSET'
    : prototypeId === 'RNK-CP002-PROT-POSITION-GAP-MIXED-END-RANKS' || prototypeId === 'RNK-CP002-PROT-COMPARE-MIXED-END-RANKS-WITH-TOTAL'
      ? 'RNK-CP002-PROT-PEOPLE-BETWEEN-MIXED-END-RANKS'
      : 'RNK-CP002-PROT-POSITION-GAP-SAME-END-RANKS';
  return generateRnkCp002Question(anchor, seed);
}

function unknownOrderEvidence(seed: number, requireBothValid: boolean): {
  firstRankFromStart: number;
  secondRankFromEnd: number;
  betweenCount: number;
  highTotal: number;
  lowTotal: number;
  lowTotalValid: boolean;
} {
  const rng = createRng('RNK-CP002-PROT-EXACT-TOTAL-OR-INDETERMINATE-UNKNOWN-ORDER', seed);
  const betweenCount = randomInt(rng, 0, 8);
  let firstRankFromStart: number;
  let secondRankFromEnd: number;
  if (requireBothValid || Math.abs(seed) % 2 === 0) {
    firstRankFromStart = randomInt(rng, betweenCount + 2, betweenCount + 26);
    secondRankFromEnd = randomInt(rng, betweenCount + 2, betweenCount + 26);
  } else {
    if (rng() < 0.5) {
      firstRankFromStart = randomInt(rng, 1, betweenCount + 1);
      secondRankFromEnd = randomInt(rng, betweenCount + 2, betweenCount + 26);
    } else {
      firstRankFromStart = randomInt(rng, betweenCount + 2, betweenCount + 26);
      secondRankFromEnd = randomInt(rng, 1, betweenCount + 1);
    }
  }
  const highTotal = firstRankFromStart + secondRankFromEnd + betweenCount;
  const lowTotal = firstRankFromStart + secondRankFromEnd - betweenCount - 2;
  const lowTotalValid = firstRankFromStart >= betweenCount + 2 && secondRankFromEnd >= betweenCount + 2;
  return { firstRankFromStart, secondRankFromEnd, betweenCount, highTotal, lowTotal, lowTotalValid };
}

function option(
  value: string,
  misconceptionId: string,
  explanation: string,
): RnkCp002SourceOption {
  return { value, label: value, misconceptionId, explanation };
}

function arrangeOptions(
  answer: string,
  correctIndex: number,
  candidates: readonly RnkCp002SourceOption[],
): readonly RnkCp002SourceOption[] {
  const unique = new Map<string, RnkCp002SourceOption>();
  unique.set(answer, option(answer, 'CORRECT', 'This option satisfies every displayed positional condition.'));
  for (const candidate of candidates) if (!unique.has(candidate.value)) unique.set(candidate.value, candidate);
  let delta = 1;
  const numericAnswer = Number(answer);
  while (unique.size < 4 && Number.isFinite(numericAnswer)) {
    for (const value of [numericAnswer - delta, numericAnswer + delta]) {
      if (unique.size >= 4) break;
      if (value < 0) continue;
      const text = String(value);
      if (!unique.has(text)) unique.set(text, option(text, 'NEARBY_ARITHMETIC_MISS', `This nearby value does not satisfy the complete positional relation; the exact result is ${answer}.`));
    }
    delta += 1;
  }
  if (unique.size < 4) {
    for (const fallback of [CANNOT_BE_DETERMINED, FIRST_BEFORE_SECOND, SECOND_BEFORE_FIRST, PROPOSED_TOTAL_IMPOSSIBLE]) {
      if (unique.size >= 4) break;
      if (!unique.has(fallback)) unique.set(fallback, option(fallback, 'WRONG_CONTRACT_OUTCOME', 'This outcome does not match the displayed evidence.'));
    }
  }
  const correct = unique.get(answer)!;
  const wrong = [...unique.values()].filter((item) => item.value !== answer).slice(0, 3);
  const result: RnkCp002SourceOption[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) result.push(correct);
    else result.push(wrong[wrongIndex++]);
  }
  return result;
}

function comparisonAnswer(
  firstName: string,
  secondName: string,
  firstStart: number,
  secondStart: number,
  requested: 'TOWARD_START' | 'TOWARD_END',
): string {
  const firstWins = requested === 'TOWARD_START' ? firstStart < secondStart : firstStart > secondStart;
  return firstWins ? firstName : secondName;
}

function difficultyFor(prototypeId: RnkCp002SourceWavePrototypeId, seed: number): 'EASY' | 'MEDIUM' | 'HARD' {
  if (prototypeId.includes('EXACT-TOTAL') || prototypeId.includes('PROPOSED-TOTAL')) return 'HARD';
  if (prototypeId.includes('MIXED-END') || Math.abs(seed) % 3 === 2) return 'MEDIUM';
  return 'EASY';
}

export function generateRnkCp002SourceQuestion(
  prototypeId: RnkCp002SourceWavePrototypeId,
  seed: number,
): RnkCp002SourceQuestion {
  const rng = createRng(prototypeId, seed);
  const base = baseQuestion(prototypeId, seed);
  const context = contextFor(base.contextId);
  const correctIndex = hashText(`${prototypeId}:correct:${seed}`) % 4;
  const firstName = base.firstName;
  const secondName = base.secondName;
  let displayedEvidence: RnkCp002SourceEvidence;
  let answerSemantic: RnkCp002SourceAnswerSemantic;
  let answer: string;
  let stem: string;
  let keyRule: string;
  let steps: readonly string[];
  let shortcut: string;
  let candidates: readonly RnkCp002SourceOption[];
  let normalizedState: RnkCp002NormalizedState | null = base.normalizedState;

  switch (prototypeId) {
    case 'RNK-CP002-PROT-POSITION-GAP-MIXED-END-RANKS': {
      const state = base.normalizedState;
      displayedEvidence = { kind: 'POSITION_GAP_MIXED_END', total: state.total, firstRankFromStart: state.firstRankFromStart, secondRankFromEnd: state.secondRankFromEnd };
      answerSemantic = 'COUNT';
      answer = String(state.positionGap);
      stem = `A ${context.group} has ${state.total} ${context.memberPlural}. ${firstName} is ${ordinal(state.firstRankFromStart)} ${context.startPhrase}, and ${secondName} is ${ordinal(state.secondRankFromEnd)} ${context.endPhrase}. What is the difference between their positions?`;
      const secondStart = state.total - state.secondRankFromEnd + 1;
      keyRule = 'Convert the opposite-end rank to the same end, then take the absolute difference. A position gap does not use the extra minus 1.';
      steps = [`${secondName}'s rank ${context.startPhrase} = ${state.total} - ${state.secondRankFromEnd} + 1 = ${secondStart}.`, `Position gap = |${state.firstRankFromStart} - ${secondStart}|.`, `Therefore, the difference between their positions is ${state.positionGap}.`];
      shortcut = 'Normalize both ranks to one end and subtract; do not remove an endpoint.';
      candidates = [option(String(Math.max(0, state.positionGap - 1)), 'USED_BETWEEN_COUNT', 'This subtracts 1 and gives the number strictly between them.'), option(String(state.positionGap + 1), 'ADDED_ENDPOINT', 'A position gap needs no endpoint addition.'), option(String(state.positionGap + 2), 'COUNTED_BOTH_ENDPOINTS', 'This counts both named endpoints beyond the position gap.')];
      break;
    }
    case 'RNK-CP002-PROT-OFFSET-FROM-SAME-END-RANKS': {
      const state = base.normalizedState;
      const side = rng() < 0.5 ? 'START' : 'END';
      const firstRank = side === 'START' ? state.firstRankFromStart : state.firstRankFromEnd;
      const secondRank = side === 'START' ? state.secondRankFromStart : state.secondRankFromEnd;
      displayedEvidence = { kind: 'OFFSET_FROM_SAME_END', side, firstRank, secondRank };
      answerSemantic = 'COUNT';
      answer = String(state.positionGap);
      const phrase = side === 'START' ? context.startPhrase : context.endPhrase;
      stem = `${firstName} is ${ordinal(firstRank)} ${phrase}, while ${secondName} is ${ordinal(secondRank)} ${phrase} in the same ${context.group}. How many positions apart are they?`;
      keyRule = 'A positional offset between two ranks measured from the same end is their absolute difference.';
      steps = [`The displayed ranks are ${firstRank} and ${secondRank} from the same end.`, `Offset = |${firstRank} - ${secondRank}| = ${state.positionGap}.`, `Therefore, they are ${state.positionGap} positions apart.`];
      shortcut = 'Same-end offset: larger rank minus smaller rank.';
      candidates = [option(String(Math.max(0, state.positionGap - 1)), 'USED_BETWEEN_COUNT', 'This gives the people strictly between rather than the positional offset.'), option(String(state.positionGap + 1), 'ADDED_ONE', 'A raw offset needs no endpoint adjustment.'), option(String(state.positionGap + 2), 'ADDED_TWO', 'This adds both named endpoints unnecessarily.')];
      break;
    }
    case 'RNK-CP002-PROT-TARGET-RANK-FROM-BETWEEN-AND-ORDER': {
      const state = base.normalizedState;
      const side = base.displayedEvidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET' ? base.displayedEvidence.side : 'START';
      const referenceRank = side === 'START' ? state.firstRankFromStart : state.firstRankFromEnd;
      const targetRank = side === 'START' ? state.secondRankFromStart : state.secondRankFromEnd;
      displayedEvidence = { kind: 'TARGET_RANK_FROM_BETWEEN', side, referenceRank, betweenCount: state.betweenCount, direction: state.firstToSecondDirection };
      answerSemantic = 'RANK';
      answer = String(targetRank);
      const phrase = side === 'START' ? context.startPhrase : context.endPhrase;
      const directionText = state.firstToSecondDirection === 'TOWARD_START' ? context.towardStartRelation : context.towardEndRelation;
      stem = `${firstName} is ${ordinal(referenceRank)} ${phrase} in a ${context.group}. ${secondName} is ${directionText} ${firstName}, with ${state.betweenCount === 0 ? `no ${context.memberPlural}` : `${state.betweenCount} ${context.memberPlural}`} between them. What is ${secondName}'s rank ${phrase}?`;
      const separation = state.betweenCount + 1;
      keyRule = 'Convert the people-between count into a position gap by adding 1, then move in the stated direction using the chosen end-numbering.';
      steps = [`Position gap = ${state.betweenCount} + 1 = ${separation}.`, `Start from rank ${referenceRank} ${phrase} and move ${separation} positions in the stated direction.`, `Therefore, ${secondName}'s rank ${phrase} is ${targetRank}.`];
      shortcut = 'People between plus 1 gives the offset; then check whether rank numbers increase or decrease.';
      candidates = [option(String(Math.max(1, targetRank - 1)), 'FORGOT_BETWEEN_TO_GAP', 'This uses the between-count as the movement and stops one place early.'), option(String(targetRank + 1), 'MOVED_ONE_TOO_FAR', 'This moves one place beyond the required target.'), option(String(referenceRank), 'DID_NOT_MOVE', 'This leaves both people at the same rank.')];
      break;
    }
    case 'RNK-CP002-PROT-COMPARE-SAME-END-RANKS': {
      const state = base.normalizedState;
      const side = rng() < 0.5 ? 'START' : 'END';
      const firstRank = side === 'START' ? state.firstRankFromStart : state.firstRankFromEnd;
      const secondRank = side === 'START' ? state.secondRankFromStart : state.secondRankFromEnd;
      const requested = (['NEARER_SUPPLIED_END', 'TOWARD_START', 'TOWARD_END'] as const)[Math.abs(seed) % 3];
      displayedEvidence = { kind: 'COMPARE_SAME_END', side, firstRank, secondRank, requested };
      answerSemantic = 'PERSON';
      const requestedDirection = requested === 'NEARER_SUPPLIED_END' ? (side === 'START' ? 'TOWARD_START' : 'TOWARD_END') : requested;
      answer = comparisonAnswer(firstName, secondName, state.firstRankFromStart, state.secondRankFromStart, requestedDirection);
      const phrase = side === 'START' ? context.startPhrase : context.endPhrase;
      const ask = requested === 'NEARER_SUPPLIED_END' ? `Who is nearer the ${side === 'START' ? 'start' : 'end'} end?` : `Who is nearer the ${requested === 'TOWARD_START' ? 'start' : 'end'} end?`;
      stem = `${firstName} is ${ordinal(firstRank)} ${phrase}, and ${secondName} is ${ordinal(secondRank)} ${phrase} in the same ${context.group}. ${ask}`;
      keyRule = 'Compare ranks only after identifying the requested physical end. Smaller numbers are nearer the end from which those ranks are counted.';
      steps = [`Both ranks are measured ${phrase}.`, `Interpret the requested physical end, reversing the comparison when it is opposite the supplied numbering end.`, `${answer} is nearer the requested end.`];
      shortcut = 'Same-end ranks: smaller is nearer that end; larger is nearer the opposite end.';
      candidates = [option(answer === firstName ? secondName : firstName, 'REVERSED_COMPARISON', 'This selects the person nearer the opposite physical end.'), option('Both are equally placed', 'ASSUMED_EQUAL', 'The two ranks are distinct.'), option(CANNOT_BE_DETERMINED, 'IGNORED_COMMON_END', 'Both ranks use the same end, so the comparison is determinate.')];
      break;
    }
    case 'RNK-CP002-PROT-COMPARE-MIXED-END-RANKS-WITH-TOTAL': {
      const state = base.normalizedState;
      const requested = Math.abs(seed) % 2 === 0 ? 'TOWARD_START' : 'TOWARD_END';
      displayedEvidence = { kind: 'COMPARE_MIXED_END', total: state.total, firstRankFromStart: state.firstRankFromStart, secondRankFromEnd: state.secondRankFromEnd, requested };
      answerSemantic = 'PERSON';
      answer = comparisonAnswer(firstName, secondName, state.firstRankFromStart, state.secondRankFromStart, requested);
      stem = `A ${context.group} has ${state.total} ${context.memberPlural}. ${firstName} is ${ordinal(state.firstRankFromStart)} ${context.startPhrase}, while ${secondName} is ${ordinal(state.secondRankFromEnd)} ${context.endPhrase}. Who is nearer the ${requested === 'TOWARD_START' ? 'start' : 'end'} end?`;
      const secondStart = state.total - state.secondRankFromEnd + 1;
      keyRule = 'Mixed-end ranks must be converted to one common end before the two positions are compared.';
      steps = [`${secondName}'s common start-side rank = ${state.total} - ${state.secondRankFromEnd} + 1 = ${secondStart}.`, `Compare ${firstName}'s ${state.firstRankFromStart} with ${secondName}'s ${secondStart} from the same end.`, `${answer} is nearer the requested end.`];
      shortcut = 'Normalize first, compare second; never compare opposite-end rank numbers directly.';
      candidates = [option(answer === firstName ? secondName : firstName, 'COMPARED_UNNORMALIZED_RANKS', 'This compares the two displayed numbers without converting them to a common end.'), option('Both are equally placed', 'ASSUMED_EQUAL', 'The hidden positions are distinct.'), option(CANNOT_BE_DETERMINED, 'IGNORED_TOTAL', 'The known total makes mixed-end normalization possible.')];
      break;
    }
    case 'RNK-CP002-PROT-EXACT-TOTAL-OR-INDETERMINATE-UNKNOWN-ORDER': {
      const evidence = unknownOrderEvidence(seed, false);
      displayedEvidence = { kind: 'EXACT_TOTAL_OR_INDETERMINATE', ...evidence };
      answerSemantic = 'TOTAL_OR_INDETERMINATE';
      answer = evidence.lowTotalValid ? CANNOT_BE_DETERMINED : String(evidence.highTotal);
      normalizedState = null;
      stem = `${firstName} is ${ordinal(evidence.firstRankFromStart)} ${context.startPhrase}, and ${secondName} is ${ordinal(evidence.secondRankFromEnd)} ${context.endPhrase}. There ${evidence.betweenCount === 1 ? 'is one' : 'are'} ${evidence.betweenCount === 0 ? `no ${context.memberPlural}` : evidence.betweenCount === 1 ? context.memberSingular : `${evidence.betweenCount} ${context.memberPlural}`} between them, but their relative order is not stated. How many ${context.memberPlural} are in the ${context.group}?`;
      keyRule = 'Unknown relative order creates a high-total branch and, only when both supplied ranks clear the between-count boundary, a low-total branch.';
      steps = [`High-order total = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount} = ${evidence.highTotal}.`, `Reversed-order candidate = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2 = ${evidence.lowTotal}; it is ${evidence.lowTotalValid ? 'valid' : 'invalid because a rank would fall before position 1'}.`, evidence.lowTotalValid ? `Two totals are valid, so the exact total ${CANNOT_BE_DETERMINED.toLowerCase()}.` : `Only ${evidence.highTotal} is valid, so the total is uniquely determined.`];
      shortcut = 'Compute both order branches, then reject any branch that puts either named person before position 1.';
      candidates = [option(String(evidence.highTotal), 'USED_HIGH_BRANCH_ONLY', 'This keeps only the arrangement where the start-ranked person comes first.'), option(String(evidence.lowTotal), evidence.lowTotalValid ? 'USED_LOW_BRANCH_ONLY' : 'ACCEPTED_INVALID_LOW_BRANCH', evidence.lowTotalValid ? 'This keeps only the reversed valid arrangement.' : 'This accepts a reversed arrangement that would force an impossible position.'), option(CANNOT_BE_DETERMINED, 'ASSUMED_TWO_VALID_TOTALS', 'This is correct only when both order branches are valid.'), option(String(evidence.firstRankFromStart + evidence.secondRankFromEnd - 1), 'IGNORED_BETWEEN_COUNT', 'This treats the two people like one target and ignores the stated gap.')];
      break;
    }
    case 'RNK-CP002-PROT-PROPOSED-TOTAL-COMPATIBLE-ORDER': {
      const statusVariant = Math.abs(seed) % 3;
      const evidence = unknownOrderEvidence(seed + 1000, statusVariant === 1);
      const proposedTotal = statusVariant === 0 ? evidence.highTotal : statusVariant === 1 ? evidence.lowTotal : evidence.highTotal + randomInt(rng, 1, 4);
      displayedEvidence = { kind: 'PROPOSED_TOTAL_ORDER_STATUS', ...evidence, proposedTotal };
      answerSemantic = 'ORDER_STATUS';
      answer = proposedTotal === evidence.highTotal ? FIRST_BEFORE_SECOND : evidence.lowTotalValid && proposedTotal === evidence.lowTotal ? SECOND_BEFORE_FIRST : PROPOSED_TOTAL_IMPOSSIBLE;
      normalizedState = null;
      stem = `${firstName} is ${ordinal(evidence.firstRankFromStart)} ${context.startPhrase}, and ${secondName} is ${ordinal(evidence.secondRankFromEnd)} ${context.endPhrase}, with ${evidence.betweenCount === 0 ? `no ${context.memberPlural}` : `${evidence.betweenCount} ${context.memberPlural}`} between them. If the ${context.group} has ${proposedTotal} ${context.memberPlural}, which conclusion is correct?`;
      keyRule = 'A proposed total is compatible only if it equals one of the valid order-branch totals.';
      steps = [`If ${firstName} is nearer the start end, total = ${evidence.highTotal}.`, `If ${secondName} is nearer the start end, total = ${evidence.lowTotal}, and that branch is ${evidence.lowTotalValid ? 'valid' : 'invalid'}.`, `${proposedTotal} therefore implies: ${answer}.`];
      shortcut = 'Match the proposed total against the two branch formulas; no match means impossible.';
      candidates = [option(FIRST_BEFORE_SECOND, 'FORCED_HIGH_ORDER', 'This is valid only when the proposed total equals the high-order branch.'), option(SECOND_BEFORE_FIRST, 'FORCED_LOW_ORDER', 'This is valid only when the reversed branch is valid and matches the proposed total.'), option('Both orders are possible', 'ASSUMED_SAME_TOTAL_FOR_BOTH', 'The two order branches produce different totals.'), option(PROPOSED_TOTAL_IMPOSSIBLE, 'REJECTED_VALID_TOTAL', 'This is correct only when the proposed total matches neither valid branch.')];
      break;
    }
  }

  const options = arrangeOptions(answer, correctIndex, candidates);
  const optionAnalysis = options.map((item, index) => `Option ${index + 1} (${item.label}): ${item.explanation}`);
  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-002',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    contextId: base.contextId,
    firstName,
    secondName,
    stem,
    displayedEvidence,
    answerSemantic,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(prototypeId, seed),
    normalizedState,
    explanation: {
      keyRule,
      stepByStepSolution: steps,
      examSpeedShortcut: shortcut,
      optionAnalysis,
      conclusion: `Therefore, the required answer is ${answer}.`,
    },
    mathematicalFingerprint: `${displayedEvidence.kind}:${JSON.stringify(displayedEvidence)}`,
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}

export const RNK_CP002_SOURCE_CONSTANTS = {
  CANNOT_BE_DETERMINED,
  FIRST_BEFORE_SECOND,
  SECOND_BEFORE_FIRST,
  PROPOSED_TOTAL_IMPOSSIBLE,
} as const;
