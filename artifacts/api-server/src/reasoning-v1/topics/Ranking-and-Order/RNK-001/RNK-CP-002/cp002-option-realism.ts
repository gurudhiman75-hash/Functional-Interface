import type {
  RnkCp002DisplayedEvidence,
  RnkCp002Option,
} from './cp002-model';

interface WrongOptionSeed {
  readonly value: number;
  readonly misconceptionId: string;
  readonly explanation: string;
}

function assembleOptions(
  answer: number,
  correctIndex: number,
  wrongSeeds: readonly WrongOptionSeed[],
): readonly RnkCp002Option[] {
  const used = new Set<number>([answer]);
  const wrong: RnkCp002Option[] = [];

  for (const seed of wrongSeeds) {
    if (!Number.isInteger(seed.value) || seed.value < 0 || used.has(seed.value)) continue;
    used.add(seed.value);
    wrong.push({
      value: seed.value,
      label: String(seed.value),
      misconceptionId: seed.misconceptionId,
      explanation: seed.explanation,
    });
  }

  let distance = 1;
  while (wrong.length < 3) {
    for (const value of [answer - distance, answer + distance]) {
      if (wrong.length >= 3) break;
      if (value < 0 || used.has(value)) continue;
      used.add(value);
      wrong.push({
        value,
        label: String(value),
        misconceptionId: 'NEARBY_ARITHMETIC_MISS',
        explanation: `This nearby value does not satisfy the displayed relation; the exact result is ${answer}.`,
      });
    }
    distance += 1;
  }

  const options: RnkCp002Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({
        value: answer,
        label: String(answer),
        misconceptionId: 'CORRECT',
        explanation: 'This value satisfies the displayed relation exactly.',
      });
    } else {
      options.push(wrong[wrongIndex]);
      wrongIndex += 1;
    }
  }
  return options;
}

function nearRankOptions(answer: number, correctIndex: number): readonly RnkCp002Option[] {
  return assembleOptions(answer, correctIndex, [
    {
      value: answer - 1,
      misconceptionId: 'STOPPED_ONE_PLACE_EARLY',
      explanation: 'This stops one position before completing the stated offset.',
    },
    {
      value: answer + 1,
      misconceptionId: 'MOVED_ONE_PLACE_TOO_FAR',
      explanation: 'This moves one position beyond the stated offset.',
    },
    {
      value: answer + 2,
      misconceptionId: 'COUNTED_AN_EXTRA_PLACE',
      explanation: 'This counts an additional place while applying the positional offset.',
    },
  ]);
}

function nearBetweenOptions(answer: number, correctIndex: number): readonly RnkCp002Option[] {
  return assembleOptions(answer, correctIndex, [
    {
      value: answer + 1,
      misconceptionId: 'USED_POSITION_GAP',
      explanation: 'This gives the common-end position gap and counts one named endpoint among those between.',
    },
    {
      value: answer + 2,
      misconceptionId: 'COUNTED_BOTH_ENDPOINTS',
      explanation: 'This includes both named people in the between-count.',
    },
    {
      value: answer - 1,
      misconceptionId: 'SUBTRACTED_ONE_EXTRA',
      explanation: 'This subtracts one more position after already removing the endpoint adjustment.',
    },
  ]);
}

export function refineCp002OptionRealism(
  evidence: RnkCp002DisplayedEvidence,
  answer: number,
  correctIndex: number,
  baseOptions: readonly RnkCp002Option[],
): readonly RnkCp002Option[] {
  if (evidence.kind === 'SAME_END_TWO_RANKS' && evidence.requested === 'POSITION_GAP') {
    return assembleOptions(answer, correctIndex, [
      {
        value: answer - 1,
        misconceptionId: 'USED_BETWEEN_COUNT',
        explanation: 'This subtracts 1 and gives the number strictly between the two positions, not their position difference.',
      },
      {
        value: answer + 1,
        misconceptionId: 'ADDED_ENDPOINT',
        explanation: 'A position difference needs no endpoint adjustment.',
      },
      {
        value: answer + 2,
        misconceptionId: 'COUNTED_BOTH_ENDPOINTS',
        explanation: 'This adds both named endpoints to the position difference.',
      },
    ]);
  }

  if (evidence.kind === 'SECOND_RANK_FROM_RELATIVE_OFFSET') {
    return nearRankOptions(answer, correctIndex);
  }

  if (evidence.kind === 'BETWEEN_FROM_MIXED_END_RANKS') {
    return nearBetweenOptions(answer, correctIndex);
  }

  if (evidence.kind === 'TOTAL_FROM_MIXED_END_RANKS_KNOWN_ORDER') {
    const wrongSeeds: readonly WrongOptionSeed[] = evidence.direction === 'TOWARD_END'
      ? [
          {
            value: answer + 1,
            misconceptionId: 'ADDED_EXTRA_ENDPOINT',
            explanation: 'This adds one extra member after the valid known-order total is complete.',
          },
          {
            value: answer - 1,
            misconceptionId: 'REMOVED_ONE_ENDPOINT',
            explanation: 'This removes one named endpoint even though both end-ranks already include the named people correctly.',
          },
          {
            value: answer - 2,
            misconceptionId: 'REMOVED_BOTH_ENDPOINTS',
            explanation: 'This subtracts both named endpoints from a branch that requires no such subtraction.',
          },
        ]
      : [
          {
            value: answer + 2,
            misconceptionId: 'FORGOT_ENDPOINT_PAIR',
            explanation: 'This subtracts the between-count but forgets to remove the two named endpoints.',
          },
          {
            value: answer + 1,
            misconceptionId: 'SUBTRACTED_ONE_ENDPOINT',
            explanation: 'This removes only one named endpoint instead of both.',
          },
          {
            value: answer - 1,
            misconceptionId: 'SUBTRACTED_ONE_EXTRA',
            explanation: 'This subtracts one more member after applying the correct reversed-order equation.',
          },
        ];
    return assembleOptions(answer, correctIndex, wrongSeeds);
  }

  return baseOptions;
}
