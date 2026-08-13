import {
  type RnkCp002AnswerSemantic,
  type RnkCp002ContextVocabulary,
  type RnkCp002Difficulty,
  type RnkCp002DisplayedEvidence,
  type RnkCp002NormalizedState,
  type RnkCp002Option,
  type RnkCp002PrototypeId,
  type RnkDirection,
  type RnkSide,
  solveCp002Independently,
} from './cp002-model';

function ordinal(value: number): string {
  const modulo100 = value % 100;
  if (modulo100 >= 11 && modulo100 <= 13) return `${value}th`;
  const modulo10 = value % 10;
  if (modulo10 === 1) return `${value}st`;
  if (modulo10 === 2) return `${value}nd`;
  if (modulo10 === 3) return `${value}rd`;
  return `${value}th`;
}

function sidePhrase(side: RnkSide, context: RnkCp002ContextVocabulary): string {
  return side === 'START' ? context.startPhrase : context.endPhrase;
}

function relationFor(direction: RnkDirection, context: RnkCp002ContextVocabulary): string {
  return direction === 'TOWARD_START' ? context.towardStartRelation : context.towardEndRelation;
}

function relativeClause(subject: string, offset: number, direction: RnkDirection, object: string, context: RnkCp002ContextVocabulary): string {
  const placeWord = offset === 1 ? 'place' : 'places';
  if (context.id === 'MERIT_LIST') return `${subject} is ranked ${offset} ${placeWord} ${direction === 'TOWARD_START' ? 'above' : 'below'} ${object}`;
  if (context.id === 'HORIZONTAL_ROW') return `${subject} stands ${offset} ${placeWord} ${direction === 'TOWARD_START' ? 'to the left of' : 'to the right of'} ${object}`;
  return `${subject} stands ${offset} ${placeWord} ${direction === 'TOWARD_START' ? 'ahead of' : 'behind'} ${object}`;
}

function directionLabel(direction: RnkDirection, context: RnkCp002ContextVocabulary): string {
  if (context.id === 'MERIT_LIST') return direction === 'TOWARD_START' ? 'toward the top' : 'toward the bottom';
  if (context.id === 'HORIZONTAL_ROW') return direction === 'TOWARD_START' ? 'toward the left' : 'toward the right';
  return direction === 'TOWARD_START' ? 'toward the front' : 'toward the back';
}

function memberCountPhrase(count: number, context: RnkCp002ContextVocabulary): string {
  if (count === 0) return `no ${context.memberPlural}`;
  if (count === 1) return `one ${context.memberSingular}`;
  return `${count} ${context.memberPlural}`;
}

function thereAreMembers(count: number, context: RnkCp002ContextVocabulary): string {
  return `There ${count === 1 ? 'is' : 'are'} ${memberCountPhrase(count, context)}`;
}

export function stemForCp002(
  prototypeId: RnkCp002PrototypeId,
  evidence: RnkCp002DisplayedEvidence,
  context: RnkCp002ContextVocabulary,
  firstName: string,
  secondName: string,
): string {
  if (evidence.kind === 'SAME_END_TWO_RANKS') {
    const phrase = sidePhrase(evidence.side, context);
    const ask = evidence.requested === 'BETWEEN_COUNT'
      ? `How many ${context.memberPlural} are between ${firstName} and ${secondName}?`
      : 'What is the difference between their positions?';
    return `${firstName} is ${ordinal(evidence.firstRank)} ${phrase}, while ${secondName} is ${ordinal(evidence.secondRank)} ${phrase} in the same ${context.group}. ${ask}`;
  }
  if (evidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET') {
    const phrase = sidePhrase(evidence.side, context);
    return `${firstName} is ${ordinal(evidence.firstRank)} ${phrase} in a ${context.group}. ${relativeClause(secondName, evidence.offset, evidence.direction, firstName, context)}. What is ${secondName}'s rank ${phrase}?`;
  }
  if (evidence.kind === 'BETWEEN_FROM_MIXED_END_RANKS') {
    return `A ${context.group} has ${evidence.total} ${context.memberPlural}. ${firstName} is ${ordinal(evidence.firstRankFromStart)} ${context.startPhrase}, and ${secondName} is ${ordinal(evidence.secondRankFromEnd)} ${context.endPhrase}. How many ${context.memberPlural} are between them?`;
  }
  if (evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER') {
    return `${firstName} is ${ordinal(evidence.firstRankFromStart)} ${context.startPhrase}, and ${secondName} is ${ordinal(evidence.secondRankFromEnd)} ${context.endPhrase}. ${secondName} is ${relationFor(evidence.direction, context)} ${firstName}, with ${memberCountPhrase(evidence.betweenCount, context)} between them. How many ${context.memberPlural} are in the ${context.group}?`;
  }
  return `${firstName} is ${ordinal(evidence.firstRankFromStart)} ${context.startPhrase}, and ${secondName} is ${ordinal(evidence.secondRankFromEnd)} ${context.endPhrase}. ${thereAreMembers(evidence.betweenCount, context)} between them, but their relative order is not stated. What is the ${evidence.requestedExtreme.toLowerCase()} possible number of ${context.memberPlural} in the ${context.group}?`;
}

type Candidate = { value: number; id: string; explanation: string };

function misconceptionCandidates(evidence: RnkCp002DisplayedEvidence): Candidate[] {
  if (evidence.kind === 'SAME_END_TWO_RANKS') {
    const gap = Math.abs(evidence.firstRank - evidence.secondRank);
    return evidence.requested === 'BETWEEN_COUNT'
      ? [
          { value: gap, id: 'COUNTED_ONE_ENDPOINT', explanation: 'This uses the raw position gap and counts one endpoint among those between.' },
          { value: gap + 1, id: 'COUNTED_BOTH_ENDPOINTS', explanation: 'This counts both named people as if they were between themselves.' },
          { value: Math.max(0, gap - 2), id: 'SUBTRACTED_TWO', explanation: 'Only one is removed from the rank difference, not two.' },
        ]
      : [
          { value: Math.max(0, gap - 1), id: 'USED_BETWEEN_COUNT', explanation: 'This is the strict between-count, not the raw position difference.' },
          { value: gap + 1, id: 'ADDED_ENDPOINT', explanation: 'A position difference needs no endpoint adjustment.' },
          { value: evidence.firstRank + evidence.secondRank, id: 'ADDED_RANKS', explanation: 'Adding ranks does not measure their distance.' },
        ];
  }
  if (evidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET') {
    return [
      { value: evidence.firstRank + evidence.offset, id: 'ALWAYS_ADDED', explanation: 'This adds without checking how rank numbers change from the chosen end.' },
      { value: evidence.firstRank - evidence.offset, id: 'ALWAYS_SUBTRACTED', explanation: 'This subtracts without checking how rank numbers change from the chosen end.' },
      { value: evidence.offset, id: 'REPORTED_OFFSET', explanation: 'The offset is not the second person’s rank.' },
    ];
  }
  if (evidence.kind === 'BETWEEN_FROM_MIXED_END_RANKS') {
    const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
    const gap = Math.abs(evidence.firstRankFromStart - secondStart);
    return [
      { value: gap, id: 'FORGOT_MINUS_ONE', explanation: 'This gives the common-end position gap but still counts one named endpoint.' },
      { value: Math.abs(evidence.firstRankFromStart - evidence.secondRankFromEnd) - 1, id: 'UNNORMALIZED_RANKS', explanation: 'Opposite-end ranks cannot be compared directly.' },
      { value: evidence.total - evidence.firstRankFromStart - evidence.secondRankFromEnd, id: 'SUBTRACTED_FROM_TOTAL', explanation: 'This ignores how the two end-ranks overlap.' },
    ];
  }
  if (evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER') {
    const sum = evidence.firstRankFromStart + evidence.secondRankFromEnd;
    return [
      { value: sum + evidence.betweenCount + 1, id: 'EXTRA_ENDPOINT', explanation: 'This adds an extra endpoint beyond the valid total equation.' },
      { value: sum + evidence.betweenCount - 1, id: 'REMOVED_ENDPOINT', explanation: 'This removes a named person unnecessarily.' },
      { value: sum - evidence.betweenCount, id: 'INCOMPLETE_BRANCH', explanation: 'This does not complete either known-order equation.' },
    ];
  }
  const high = evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount;
  const low = evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2;
  return [
    { value: evidence.requestedExtreme === 'MAXIMUM' ? low : high, id: 'OTHER_EXTREME', explanation: 'This is the other valid arrangement, not the requested extreme.' },
    { value: evidence.firstRankFromStart + evidence.secondRankFromEnd - 1, id: 'IGNORED_BETWEEN', explanation: 'This ignores the stated between-count.' },
    { value: high + 1, id: 'EXTRA_ENDPOINT', explanation: 'This adds one beyond the larger valid arrangement.' },
  ];
}

export function buildCp002Options(evidence: RnkCp002DisplayedEvidence, answer: number, semantic: RnkCp002AnswerSemantic, correctIndex: number): readonly RnkCp002Option[] {
  const minimum = semantic === 'COUNT' ? 0 : 1;
  const used = new Set<number>([answer]);
  const wrong: RnkCp002Option[] = [];
  for (const candidate of misconceptionCandidates(evidence)) {
    if (!Number.isInteger(candidate.value) || candidate.value < minimum || used.has(candidate.value)) continue;
    used.add(candidate.value);
    wrong.push({ value: candidate.value, label: String(candidate.value), misconceptionId: candidate.id, explanation: candidate.explanation });
  }
  let distance = 1;
  while (wrong.length < 3) {
    for (const value of [answer - distance, answer + distance]) {
      if (wrong.length >= 3) break;
      if (value < minimum || used.has(value)) continue;
      used.add(value);
      wrong.push({ value, label: String(value), misconceptionId: 'NEARBY_ARITHMETIC_MISS', explanation: `This nearby value does not satisfy the displayed two-person relation; the exact result is ${answer}.` });
    }
    distance += 1;
  }
  const options: RnkCp002Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push({ value: answer, label: String(answer), misconceptionId: 'CORRECT', explanation: 'This value satisfies the displayed relation exactly.' });
    else options.push(wrong[wrongIndex++]);
  }
  return options;
}

export function calculationForCp002(evidence: RnkCp002DisplayedEvidence, context: RnkCp002ContextVocabulary, firstName: string, secondName: string): { keyRule: string; steps: readonly string[]; shortcut: string } {
  if (evidence.kind === 'SAME_END_TWO_RANKS') {
    const gap = Math.abs(evidence.firstRank - evidence.secondRank);
    if (evidence.requested === 'BETWEEN_COUNT') return {
      keyRule: 'Members strictly between two ranks from the same end equal the absolute rank difference minus 1.',
      steps: [`The two ranks are ${evidence.firstRank} and ${evidence.secondRank} from the same end.`, `Position gap = |${evidence.firstRank} - ${evidence.secondRank}| = ${gap}.`, `Members between = ${gap} - 1 = ${gap - 1}.`],
      shortcut: 'Same end: subtract the smaller rank from the larger, then subtract 1.',
    };
    return {
      keyRule: 'The difference between two positions from the same end is the absolute difference of their ranks.',
      steps: [`The two ranks are ${evidence.firstRank} and ${evidence.secondRank}.`, `Position difference = |${evidence.firstRank} - ${evidence.secondRank}|.`, `Therefore, the positions differ by ${gap}.`],
      shortcut: 'For a position gap, take the absolute rank difference; do not subtract 1.',
    };
  }
  if (evidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET') {
    const adds = (evidence.side === 'START' && evidence.direction === 'TOWARD_END') || (evidence.side === 'END' && evidence.direction === 'TOWARD_START');
    const result = evidence.firstRank + (adds ? evidence.offset : -evidence.offset);
    return {
      keyRule: `Using ranks ${sidePhrase(evidence.side, context)}, moving ${directionLabel(evidence.direction, context)} makes the rank number ${adds ? 'larger' : 'smaller'}.`,
      steps: [`${firstName}'s rank is ${evidence.firstRank} ${sidePhrase(evidence.side, context)}.`, `${relativeClause(secondName, evidence.offset, evidence.direction, firstName, context)}, so use ${evidence.firstRank} ${adds ? '+' : '-'} ${evidence.offset}.`, `${secondName}'s rank is ${result} ${sidePhrase(evidence.side, context)}.`],
      shortcut: 'Decide whether rank numbers grow or shrink in the stated direction before applying the offset.',
    };
  }
  if (evidence.kind === 'BETWEEN_FROM_MIXED_END_RANKS') {
    const secondStart = evidence.total - evidence.secondRankFromEnd + 1;
    const gap = Math.abs(evidence.firstRankFromStart - secondStart);
    return {
      keyRule: 'For mixed-end ranks, convert one person to the other end before comparing positions.',
      steps: [`${secondName}'s rank ${context.startPhrase} = ${evidence.total} - ${evidence.secondRankFromEnd} + 1 = ${secondStart}.`, `Common-end position gap = |${evidence.firstRankFromStart} - ${secondStart}| = ${gap}.`, `Members between = ${gap} - 1 = ${gap - 1}.`],
      shortcut: 'Normalize both ranks to one end, then use absolute difference minus 1.',
    };
  }
  if (evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER') {
    const sum = evidence.firstRankFromStart + evidence.secondRankFromEnd;
    const total = solveCp002Independently(evidence);
    const branch = evidence.direction === 'TOWARD_END' ? `${sum} + ${evidence.betweenCount}` : `${sum} - ${evidence.betweenCount} - 2`;
    return {
      keyRule: evidence.direction === 'TOWARD_END'
        ? 'When the start-ranked person comes first, total = start rank + end rank + members between.'
        : 'When the end-ranked person comes first, total = start rank + end rank − members between − 2.',
      steps: [`Start-side rank + end-side rank = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} = ${sum}.`, `The stated order selects ${branch}.`, `Therefore, total ${context.memberPlural} = ${total}.`],
      shortcut: 'Known order selects the branch: add the between-count when the start-ranked person comes first; otherwise subtract the gap and both endpoints.',
    };
  }
  const high = evidence.firstRankFromStart + evidence.secondRankFromEnd + evidence.betweenCount;
  const low = evidence.firstRankFromStart + evidence.secondRankFromEnd - evidence.betweenCount - 2;
  const answer = evidence.requestedExtreme === 'MAXIMUM' ? high : low;
  return {
    keyRule: 'Without relative order, evaluate both valid mixed-end arrangements and choose the requested extreme.',
    steps: [`Arrangement 1 total = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} + ${evidence.betweenCount} = ${high}.`, `Arrangement 2 total = ${evidence.firstRankFromStart} + ${evidence.secondRankFromEnd} - ${evidence.betweenCount} - 2 = ${low}.`, `The ${evidence.requestedExtreme.toLowerCase()} valid total is ${answer}.`],
    shortcut: 'Unknown order gives two totals: sum plus between, and sum minus between minus 2.',
  };
}

export function difficultyForCp002(prototypeId: RnkCp002PrototypeId, state: RnkCp002NormalizedState, context: RnkCp002ContextVocabulary, evidence: RnkCp002DisplayedEvidence): RnkCp002Difficulty {
  let score = 0;
  if (state.total >= 30) score += 1;
  if (state.positionGap >= 8) score += 1;
  if (context.id !== 'MERIT_LIST') score += 1;
  if (prototypeId.includes('MIXED-END')) score += 1;
  if (prototypeId.includes('EXTREME-TOTAL')) score += 2;
  if (evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER' && evidence.direction === 'TOWARD_START') score += 1;
  if (score <= 1) return 'EASY';
  if (score <= 3) return 'MEDIUM';
  return 'HARD';
}

export function fingerprintForCp002(evidence: RnkCp002DisplayedEvidence): string {
  if (evidence.kind === 'SAME_END_TWO_RANKS') return `${evidence.kind}:${evidence.requested}:${evidence.side}:${evidence.firstRank}:${evidence.secondRank}`;
  if (evidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET') return `${evidence.kind}:${evidence.side}:${evidence.firstRank}:${evidence.offset}:${evidence.direction}`;
  if (evidence.kind === 'BETWEEN_FROM_MIXED_END_RANKS') return `${evidence.kind}:${evidence.total}:${evidence.firstRankFromStart}:${evidence.secondRankFromEnd}`;
  if (evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER') return `${evidence.kind}:${evidence.firstRankFromStart}:${evidence.secondRankFromEnd}:${evidence.betweenCount}:${evidence.direction}`;
  return `${evidence.kind}:${evidence.firstRankFromStart}:${evidence.secondRankFromEnd}:${evidence.betweenCount}:${evidence.requestedExtreme}`;
}
