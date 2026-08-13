import {
  RNK_CP004_PROTOTYPE_IDS,
  hashText,
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
  type RnkCp004Evidence,
  type RnkCp004Option,
  type RnkCp004PrototypeId,
  type RnkCp004Query,
} from './cp004-foundation';
import {
  generateRnkCp004ExamReadyQuestion as generateOriginalEvidence,
} from './cp004-exam-ready-v2';
import {
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV2,
  type RnkCp004ExamReadyQuestion as RnkCp004V2Question,
  type RnkCp004ExplanationMode as RnkCp004V2ExplanationMode,
} from './cp004-exam-ready-v4';

export { countTopologicalOrders } from './cp004-exam-ready-v4';

export const RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID =
  'RNK-CP004-PROT-EXACT-RANK-DIFFERENCE-OF-PAIR' as const;

export const RNK_CP004_REMODEL_V3_PROTOTYPE_IDS = [
  ...RNK_CP004_PROTOTYPE_IDS,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
] as const;

export type RnkCp004RemodelV3PrototypeId =
  (typeof RNK_CP004_REMODEL_V3_PROTOTYPE_IDS)[number];

export type RnkCp004RemodelV3ExplanationMode =
  | RnkCp004V2ExplanationMode
  | 'CHAIN_BUILD'
  | 'PAIR_DIRECTION'
  | 'PAIR_DISTANCE';

export interface RnkCp004ProofMetrics {
  readonly shortestDirectionalPathClues: number | null;
  readonly shortestExactPositionProofClues: number | null;
  readonly fullOrderProofClues: number | null;
}

export interface RnkCp004TopologyProfile {
  readonly adjacentClueCount: number;
  readonly nonAdjacentClueCount: number;
  readonly family: 'CHAIN_BACKBONE' | 'CHAIN_WITH_NON_ADJACENT_VERIFICATION' | 'TWO_ORDERED_BLOCKS';
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004V2Question,
  | 'prototypeId'
  | 'stem'
  | 'answer'
  | 'options'
  | 'correctIndex'
  | 'difficulty'
  | 'explanation'
  | 'visibleExplanation'
  | 'mathematicalFingerprint'
  | 'reviewMetadata'
> & {
  readonly prototypeId: RnkCp004RemodelV3PrototypeId;
  readonly stem: string;
  readonly answer: string;
  readonly options: readonly RnkCp004Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp004Difficulty;
  readonly explanation: RnkCp004V2Question['explanation'];
  readonly visibleExplanation: {
    readonly mode: RnkCp004RemodelV3ExplanationMode;
    readonly lines: readonly string[];
    readonly optionAnalysis?: readonly string[];
    readonly answer: string;
  };
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: Omit<
    RnkCp004V2Question['reviewMetadata'],
    'generationVersion' | 'competency' | 'explanationMode' | 'reasoningFeatures'
  > & {
    readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V3';
    readonly competency: string;
    readonly explanationMode: RnkCp004RemodelV3ExplanationMode;
    readonly proofMetrics: RnkCp004ProofMetrics;
    readonly topologyProfile: RnkCp004TopologyProfile;
    readonly reasoningFeatures: RnkCp004V2Question['reviewMetadata']['reasoningFeatures'] & {
      readonly nonAdjacentClueCount: number;
      readonly topologyWeight: number;
      readonly taskWeight: number;
    };
  };
};

interface OptionCandidate {
  readonly key: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
}

function orderKey(order: readonly string[]): string {
  return order.join('|');
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function indexMap(order: readonly string[]): ReadonlyMap<string, number> {
  return new Map(order.map((entity, index) => [entity, index]));
}

function directClue(
  clues: readonly RnkCp004Comparison[],
  higher: string,
  lower: string,
): RnkCp004Comparison | null {
  return clues.find((clue) => clue.higher === higher && clue.lower === lower) ?? null;
}

function shortestPath(
  clues: readonly RnkCp004Comparison[],
  start: string,
  end: string,
): readonly string[] | null {
  const outgoing = new Map<string, string[]>();
  for (const clue of clues) {
    const values = outgoing.get(clue.higher) ?? [];
    values.push(clue.lower);
    outgoing.set(clue.higher, values);
  }
  const queue: string[][] = [[start]];
  const visited = new Set<string>([start]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];
    if (current === end) return path;
    for (const next of outgoing.get(current) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  return null;
}

function solvedOrder(evidence: RnkCp004Evidence, answerKey: string): readonly string[] {
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey);
  if (!bridge) throw new Error('Missing-comparison answer is absent from candidates');
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function connectedBlocks(evidence: RnkCp004Evidence): readonly (readonly string[])[] {
  const neighbours = new Map(evidence.entities.map((entity) => [entity, new Set<string>()]));
  for (const clue of evidence.clues) {
    neighbours.get(clue.higher)!.add(clue.lower);
    neighbours.get(clue.lower)!.add(clue.higher);
  }
  const unseen = new Set(evidence.entities);
  const blocks: string[][] = [];
  while (unseen.size > 0) {
    const first = unseen.values().next().value as string;
    const queue = [first];
    unseen.delete(first);
    const component: string[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);
      for (const neighbour of neighbours.get(current) ?? []) {
        if (unseen.delete(neighbour)) queue.push(neighbour);
      }
    }
    const set = new Set(component);
    const clues = evidence.clues.filter((clue) => set.has(clue.higher) && set.has(clue.lower));
    blocks.push([...reconstructUniqueOrder(component, clues)]);
  }
  return blocks;
}

function addNonAdjacentVerificationClue(
  reduced: RnkCp004Evidence,
  original: RnkCp004Evidence,
  order: readonly string[],
  seed: number,
): RnkCp004Evidence {
  if (reduced.query.kind === 'MISSING_COMPARISON') return reduced;
  const positions = indexMap(order);
  const existing = new Set(reduced.clues.map(relationKey));
  const candidates = original.clues.filter((clue) => {
    if (existing.has(relationKey(clue))) return false;
    return Math.abs(positions.get(clue.higher)! - positions.get(clue.lower)!) > 1;
  });
  if (candidates.length === 0) return reduced;
  const chosen = candidates[hashText(`v3-skip:${seed}:${order.join('|')}`) % candidates.length];
  return { ...reduced, clues: [...reduced.clues, chosen] };
}

function rebuildMissingCandidates(
  evidence: RnkCp004Evidence,
  answerKey: string,
  seed: number,
): RnkCp004Evidence {
  if (evidence.query.kind !== 'MISSING_COMPARISON') return evidence;
  const correct = evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey);
  if (!correct) throw new Error('Missing-comparison correct bridge is absent');
  const blocks = connectedBlocks(evidence);
  if (blocks.length !== 2) throw new Error(`Expected two ordered blocks, found ${blocks.length}`);
  const pool: RnkCp004Comparison[] = [];
  for (const first of blocks[0]) {
    for (const second of blocks[1]) {
      for (const candidate of [
        { higher: first, lower: second },
        { higher: second, lower: first },
      ]) {
        if (relationKey(candidate) === answerKey) continue;
        const count = countTopologicalOrders(evidence.entities, [...evidence.clues, candidate]);
        if (count > 1 && !pool.some((item) => relationKey(item) === relationKey(candidate))) {
          pool.push(candidate);
        }
      }
    }
  }
  if (pool.length < 3) throw new Error(`Not enough consistent-but-insufficient bridge distractors: ${pool.length}`);
  const offset = hashText(`v3-missing:${seed}:${answerKey}`) % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  return {
    ...evidence,
    query: {
      kind: 'MISSING_COMPARISON',
      candidates: [correct, ...rotated.slice(0, 3)],
    },
  };
}

function setupText(entityCount: number, seed: number): string {
  const variants = [
    `${entityCount} candidates have distinct ranks from highest to lowest.`,
    `A ranking list contains ${entityCount} candidates, with rank 1 as the highest.`,
    `${entityCount} people occupy different positions in a ranking from highest to lowest.`,
    `The following ${entityCount} candidates are placed in a strict highest-to-lowest order.`,
  ];
  return variants[hashText(`v3-setup:${seed}:${entityCount}`) % variants.length];
}

function renderClue(clue: RnkCp004Comparison, index: number, seed: number): string {
  const variant = hashText(`v3-clue:${seed}:${index}:${relationKey(clue)}`) % 4;
  if (variant === 0) return `${clue.higher} ranks above ${clue.lower}.`;
  if (variant === 1) return `${clue.lower} is below ${clue.higher} in the ranking.`;
  if (variant === 2) return `${clue.higher} has a higher position than ${clue.lower}.`;
  return `${clue.higher} is placed ahead of ${clue.lower}.`;
}

function queryText(
  query: RnkCp004Query,
  prototypeId: RnkCp004RemodelV3PrototypeId,
): string {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Exact-distance authority requires a pair query');
    return `Which option correctly gives the rank difference and direction between ${query.first} and ${query.second}?`;
  }
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'Who ranks highest?';
    case 'LOWEST_ENTITY': return 'Who ranks lowest?';
    case 'ENTITY_AT_EXACT_RANK': return `Who is ${ordinal(query.rankFromTop)} from the top?`;
    case 'RANK_OF_NAMED_ENTITY': return `What is ${query.target}’s rank from the top?`;
    case 'MIDDLE_ENTITY': return 'Who occupies the middle position?';
    case 'COMPLETE_ORDER': return 'Which option gives the correct complete order from highest to lowest?';
    case 'RELATIVE_ORDER_OF_PAIR': return `Which statement correctly describes the relative order of ${query.first} and ${query.second}?`;
    case 'IMMEDIATE_NEIGHBOUR': return `Who ranks immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`;
    case 'VALID_RANK_STATEMENT': return 'Which conclusion can be derived from two or more of the statements?';
    case 'MISSING_COMPARISON': return 'Which additional statement is sufficient to determine the complete order uniquely?';
  }
}

function stemFor(
  evidence: RnkCp004Evidence,
  seed: number,
  prototypeId: RnkCp004RemodelV3PrototypeId,
): string {
  return `${setupText(evidence.entities.length, seed)}\n\n${evidence.clues
    .map((clue, index) => `- ${renderClue(clue, index, seed)}`)
    .join('\n')}\n\n${queryText(evidence.query, prototypeId)}`;
}

function placeOptions(
  correct: OptionCandidate,
  wrong: readonly OptionCandidate[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (wrong.length !== 3) throw new Error(`Expected three distractors, found ${wrong.length}`);
  const options: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    const candidate = index === correctIndex ? correct : wrong[wrongIndex++];
    options.push({
      answerKey: candidate.key,
      label: candidate.label,
      misconceptionId: candidate.misconceptionId,
      explanation: candidate.explanation,
    });
  }
  return options;
}

function pairDirectionOptions(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Expected pair query');
  const first = evidence.query.first;
  const second = evidence.query.second;
  const firstIndex = order.indexOf(first);
  const secondIndex = order.indexOf(second);
  const firstHigher = firstIndex < secondIndex;
  const correctLabel = firstHigher
    ? `${first} ranks above ${second}`
    : `${first} ranks below ${second}`;
  const reverseLabel = firstHigher
    ? `${first} ranks below ${second}`
    : `${first} ranks above ${second}`;
  const higher = firstHigher ? first : second;
  const lower = firstHigher ? second : first;
  return placeOptions(
    {
      key: answerKey,
      label: correctLabel,
      misconceptionId: 'CORRECT',
      explanation: `${higher} appears before ${lower} on the decisive comparison path`,
    },
    [
      {
        key: `PAIR_DIRECTION_REVERSED:${first}|${second}`,
        label: reverseLabel,
        misconceptionId: 'RELATION_REVERSED',
        explanation: `This reverses the established direction between ${first} and ${second}`,
      },
      {
        key: `PAIR_IMMEDIATE_CORRECT_DIRECTION:${higher}|${lower}`,
        label: `${higher} ranks immediately above ${lower}`,
        misconceptionId: 'ASSUMED_ADJACENCY',
        explanation: `${higher} is above ${lower}, but ${Math.abs(firstIndex - secondIndex) - 1} candidate(s) lie between them`,
      },
      {
        key: `PAIR_IMMEDIATE_REVERSED:${lower}|${higher}`,
        label: `${lower} ranks immediately above ${higher}`,
        misconceptionId: 'REVERSED_AND_ASSUMED_ADJACENCY',
        explanation: `This reverses their direction and also incorrectly makes them adjacent`,
      },
    ],
    correctIndex,
  );
}

function pairDistanceOptions(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Expected pair query');
  const first = evidence.query.first;
  const second = evidence.query.second;
  const firstRank = order.indexOf(first) + 1;
  const secondRank = order.indexOf(second) + 1;
  const distance = Math.abs(firstRank - secondRank);
  const higher = firstRank < secondRank ? first : second;
  const lower = higher === first ? second : first;
  const correctLabel = `The rank difference is ${distance}, with ${higher} ranked higher`;
  return placeOptions(
    {
      key: answerKey,
      label: correctLabel,
      misconceptionId: 'CORRECT',
      explanation: `${higher} is rank ${Math.min(firstRank, secondRank)} and ${lower} is rank ${Math.max(firstRank, secondRank)}`,
    },
    [
      {
        key: `PAIR_DISTANCE_REVERSED:${first}|${second}|${distance}`,
        label: `The rank difference is ${distance}, with ${lower} ranked higher`,
        misconceptionId: 'RELATION_REVERSED',
        explanation: `The difference is ${distance}, but ${higher}, not ${lower}, has the higher rank`,
      },
      {
        key: `PAIR_DISTANCE_LOW:${first}|${second}|${distance - 1}`,
        label: `The rank difference is ${distance - 1}, with ${higher} ranked higher`,
        misconceptionId: 'DISTANCE_OFF_BY_ONE',
        explanation: `${Math.max(firstRank, secondRank)} − ${Math.min(firstRank, secondRank)} = ${distance}, not ${distance - 1}`,
      },
      {
        key: `PAIR_DISTANCE_HIGH:${first}|${second}|${distance + 1}`,
        label: `The rank difference is ${distance + 1}, with ${higher} ranked higher`,
        misconceptionId: 'DISTANCE_OFF_BY_ONE',
        explanation: `${Math.max(firstRank, secondRank)} − ${Math.min(firstRank, secondRank)} = ${distance}, not ${distance + 1}`,
      },
    ],
    correctIndex,
  );
}

function completeOrderOptions(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  const swapIndexes = [0, Math.max(1, Math.floor(order.length / 2) - 1), order.length - 2];
  const wrong: OptionCandidate[] = [];
  for (const swapIndex of swapIndexes) {
    const candidate = [...order];
    [candidate[swapIndex], candidate[swapIndex + 1]] = [candidate[swapIndex + 1], candidate[swapIndex]];
    const higher = order[swapIndex];
    const lower = order[swapIndex + 1];
    const clue = directClue(evidence.clues, higher, lower);
    if (!clue) throw new Error(`Adjacent backbone clue missing for ${higher}>${lower}`);
    wrong.push({
      key: orderKey(candidate),
      label: candidate.join(' > '),
      misconceptionId: `LOCAL_SWAP_AT_${swapIndex + 1}`,
      explanation: `It places ${lower} above ${higher}, contradicting the clue ${higher} > ${lower}`,
    });
  }
  return placeOptions(
    {
      key: answerKey,
      label: order.join(' > '),
      misconceptionId: 'CORRECT',
      explanation: 'This order satisfies every displayed comparison',
    },
    wrong,
    correctIndex,
  );
}

function missingOptions(
  evidence: RnkCp004Evidence,
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'MISSING_COMPARISON') throw new Error('Expected missing-comparison query');
  const correct = evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey)!;
  const wrong = evidence.query.candidates
    .filter((candidate) => relationKey(candidate) !== answerKey)
    .map((candidate): OptionCandidate => ({
      key: relationKey(candidate),
      label: relationLabel(relationKey(candidate)),
      misconceptionId: 'CONSISTENT_BUT_INSUFFICIENT',
      explanation: 'This comparison is consistent, but the two blocks can still be interleaved in more than one way',
    }));
  return placeOptions(
    {
      key: answerKey,
      label: relationLabel(answerKey),
      misconceptionId: 'CORRECT',
      explanation: `${correct.higher} and ${correct.lower} are the boundary members whose comparison fixes the placement of the two blocks`,
    },
    wrong,
    correctIndex,
  );
}

function reviewedOptions(
  base: RnkCp004V2Question,
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  correctIndex: number,
  prototypeId: RnkCp004RemodelV3PrototypeId,
): readonly RnkCp004Option[] {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return pairDistanceOptions(evidence, order, answerKey, correctIndex);
  }
  if (evidence.query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    return pairDirectionOptions(evidence, order, answerKey, correctIndex);
  }
  if (evidence.query.kind === 'COMPLETE_ORDER') {
    return completeOrderOptions(evidence, order, answerKey, correctIndex);
  }
  if (evidence.query.kind === 'MISSING_COMPARISON') {
    return missingOptions(evidence, answerKey, correctIndex);
  }
  if (base.options[correctIndex]?.answerKey === answerKey) return base.options.map((option) => ({ ...option }));
  const correct = base.options.find((option) => option.answerKey === answerKey);
  if (!correct) throw new Error(`Correct option missing at ${prototypeId}:${base.seed}`);
  const wrong = base.options.filter((option) => option.answerKey !== answerKey);
  const options: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return options;
}

function chainFragments(order: readonly string[]): readonly string[] {
  const fragments: string[] = [];
  for (let start = 0; start < order.length - 1; start += 2) {
    fragments.push(order.slice(start, Math.min(order.length, start + 3)).join(' > '));
  }
  return fragments;
}

function numberedOrder(order: readonly string[]): readonly string[] {
  return order.map((entity, index) => `${index + 1}. ${entity}`);
}

function visibleExplanationFor(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  answer: string,
  options: readonly RnkCp004Option[],
  prototypeId: RnkCp004RemodelV3PrototypeId,
): RnkCp004ExamReadyQuestion['visibleExplanation'] {
  const query = evidence.query;
  const chain = order.join(' > ');
  const fragments = chainFragments(order);

  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    const endpoint = query.kind === 'HIGHEST_ENTITY' ? order[0] : order[order.length - 1];
    return {
      mode: 'CHAIN_BUILD',
      lines: [
        'Build the chain in parts:',
        ...fragments,
        `Joining the parts gives: ${chain}`,
        `${endpoint} is ${query.kind === 'HIGHEST_ENTITY' ? 'first' : 'last'} in the order, so ${endpoint} ranks ${query.kind === 'HIGHEST_ENTITY' ? 'highest' : 'lowest'}.`,
      ],
      answer,
    };
  }

  if (query.kind === 'ENTITY_AT_EXACT_RANK' || query.kind === 'RANK_OF_NAMED_ENTITY' || query.kind === 'MIDDLE_ENTITY') {
    const lines = [
      'Join the comparison links:',
      ...fragments,
      'Complete ranked order:',
      ...numberedOrder(order),
    ];
    if (query.kind === 'ENTITY_AT_EXACT_RANK') {
      lines.push(`${order[query.rankFromTop - 1]} is at position ${query.rankFromTop}.`);
    } else if (query.kind === 'RANK_OF_NAMED_ENTITY') {
      lines.push(`${query.target} is ${ordinal(order.indexOf(query.target) + 1)} from the top.`);
    } else {
      const middle = (order.length + 1) / 2;
      lines.push(`There are ${order.length} candidates, so the middle position is (${order.length} + 1) ÷ 2 = ${middle}.`);
      lines.push(`${order[middle - 1]} is at position ${middle}.`);
    }
    return { mode: 'POSITION_LINE', lines, answer };
  }

  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Exact-distance explanation requires pair query');
    const firstRank = order.indexOf(query.first) + 1;
    const secondRank = order.indexOf(query.second) + 1;
    const distance = Math.abs(firstRank - secondRank);
    const higher = firstRank < secondRank ? query.first : query.second;
    return {
      mode: 'PAIR_DISTANCE',
      lines: [
        `After arranging all candidates: ${chain}`,
        `${query.first} is rank ${firstRank} and ${query.second} is rank ${secondRank}.`,
        `${Math.max(firstRank, secondRank)} − ${Math.min(firstRank, secondRank)} = ${distance}.`,
        `Therefore, the rank difference is ${distance}, with ${higher} ranked higher.`,
      ],
      answer,
    };
  }

  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const positions = indexMap(order);
    const higher = positions.get(query.first)! < positions.get(query.second)! ? query.first : query.second;
    const lower = higher === query.first ? query.second : query.first;
    const path = shortestPath(evidence.clues, higher, lower);
    return {
      mode: 'PAIR_DIRECTION',
      lines: [
        `Use only the decisive path: ${path?.join(' > ') ?? chain}`,
        `${higher} appears before ${lower}, so ${higher} ranks above ${lower}.`,
      ],
      answer,
    };
  }

  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    const targetIndex = order.indexOf(query.target);
    const answerIndex = query.direction === 'ABOVE' ? targetIndex - 1 : targetIndex + 1;
    const neighbour = order[answerIndex];
    const start = Math.max(0, Math.min(targetIndex, answerIndex) - 1);
    const end = Math.min(order.length, Math.max(targetIndex, answerIndex) + 2);
    return {
      mode: 'NEIGHBOUR_HIGHLIGHT',
      lines: [
        `After arranging everyone: ${chain}`,
        `Relevant segment: ${order.slice(start, end).join(' > ')}`,
        `${neighbour} is directly ${query.direction.toLowerCase()} ${query.target}.`,
      ],
      answer,
    };
  }

  if (query.kind === 'COMPLETE_ORDER') {
    return {
      mode: 'OPTION_CONTRADICTION',
      lines: [
        'Join the comparison links:',
        ...fragments,
        `Complete order: ${chain}`,
      ],
      optionAnalysis: options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => option.answerKey !== answerKey)
        .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`),
      answer,
    };
  }

  if (query.kind === 'VALID_RANK_STATEMENT') {
    const [higher, lower] = answerKey.split('>');
    const path = shortestPath(evidence.clues, higher, lower);
    return {
      mode: 'TRANSITIVE_PROOF',
      lines: [
        'The question asks for a conclusion that needs at least two statements.',
        `Decisive path: ${path?.join(' > ') ?? chain}`,
        `Therefore, ${higher} ranks above ${lower}.`,
      ],
      answer,
    };
  }

  const blocks = connectedBlocks(evidence);
  const bridge = query.candidates.find((candidate) => relationKey(candidate) === answerKey)!;
  const firstBlock = blocks.find((block) => block.includes(bridge.higher));
  const secondBlock = blocks.find((block) => block.includes(bridge.lower));
  if (!firstBlock || !secondBlock || firstBlock === secondBlock) throw new Error('Bridge does not connect two blocks');
  return {
    mode: 'BLOCK_BRIDGE',
    lines: [
      `Block 1: ${firstBlock.join(' > ')}`,
      `Block 2: ${secondBlock.join(' > ')}`,
      `${relationLabel(answerKey)} places Block 1 completely above Block 2.`,
      `Unique order: ${chain}`,
    ],
    optionAnalysis: [
      'The other three comparisons are consistent, but each still allows more than one way to interleave the two blocks.',
    ],
    answer,
  };
}

function internalExplanation(
  visible: RnkCp004ExamReadyQuestion['visibleExplanation'],
  options: readonly RnkCp004Option[],
): RnkCp004V2Question['explanation'] {
  return {
    mentalPicture: `Internal proof mode: ${visible.mode}`,
    keyRule: 'The internal proof remains structured; the learner view shows the few decisive steps that construct and read the order.',
    stepByStepSolution: [...visible.lines],
    examSpeedShortcut: '',
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Answer: ${visible.answer}.`,
  };
}

function combinations(values: readonly number[], size: number): readonly (readonly number[])[] {
  const output: number[][] = [];
  const choose = (start: number, selected: number[]): void => {
    if (selected.length === size) {
      output.push([...selected]);
      return;
    }
    for (let index = start; index <= values.length - (size - selected.length); index += 1) {
      selected.push(values[index]);
      choose(index + 1, selected);
      selected.pop();
    }
  };
  choose(0, []);
  return output;
}

function allTopologicalOrdersSatisfy(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
  predicate: (order: readonly string[]) => boolean,
): boolean {
  const index = new Map(entities.map((entity, entityIndex) => [entity, entityIndex]));
  const prerequisites = Array.from({ length: entities.length }, () => 0);
  for (const clue of clues) {
    prerequisites[index.get(clue.lower)!] |= 1 << index.get(clue.higher)!;
  }
  const fullMask = (1 << entities.length) - 1;
  let sawOrder = false;
  const visit = (mask: number, order: string[]): boolean => {
    if (mask === fullMask) {
      sawOrder = true;
      return predicate(order);
    }
    for (let entityIndex = 0; entityIndex < entities.length; entityIndex += 1) {
      const bit = 1 << entityIndex;
      if ((mask & bit) !== 0) continue;
      if ((prerequisites[entityIndex] & mask) !== prerequisites[entityIndex]) continue;
      order.push(entities[entityIndex]);
      if (!visit(mask | bit, order)) return false;
      order.pop();
    }
    return true;
  };
  return visit(0, []) && sawOrder;
}

function minimumSubsetSize(
  evidence: RnkCp004Evidence,
  predicate: (clues: readonly RnkCp004Comparison[]) => boolean,
): number | null {
  const indexes = evidence.clues.map((_, index) => index);
  for (let size = 0; size <= indexes.length; size += 1) {
    for (const selected of combinations(indexes, size)) {
      const selectedSet = new Set(selected);
      const clues = evidence.clues.filter((_, index) => selectedSet.has(index));
      if (predicate(clues)) return size;
    }
  }
  return null;
}

function proofMetrics(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  prototypeId: RnkCp004RemodelV3PrototypeId,
): RnkCp004ProofMetrics {
  if (evidence.query.kind === 'MISSING_COMPARISON') {
    return {
      shortestDirectionalPathClues: null,
      shortestExactPositionProofClues: null,
      fullOrderProofClues: null,
    };
  }

  const fullOrderProofClues = minimumSubsetSize(
    evidence,
    (clues) => countTopologicalOrders(evidence.entities, clues) === 1,
  );

  let shortestDirectionalPathClues: number | null = null;
  let shortestExactPositionProofClues: number | null = null;

  if (evidence.query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const positions = indexMap(order);
    const higher = positions.get(evidence.query.first)! < positions.get(evidence.query.second)!
      ? evidence.query.first
      : evidence.query.second;
    const lower = higher === evidence.query.first ? evidence.query.second : evidence.query.first;
    shortestDirectionalPathClues = Math.max(1, (shortestPath(evidence.clues, higher, lower)?.length ?? 2) - 1);

    if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
      const expectedDifference = Math.abs(positions.get(evidence.query.first)! - positions.get(evidence.query.second)!);
      shortestExactPositionProofClues = minimumSubsetSize(
        evidence,
        (clues) => allTopologicalOrdersSatisfy(
          evidence.entities,
          clues,
          (candidateOrder) => {
            const candidatePositions = indexMap(candidateOrder);
            const first = candidatePositions.get(evidence.query.first)!;
            const second = candidatePositions.get(evidence.query.second)!;
            return Math.abs(first - second) === expectedDifference
              && (first < second) === (positions.get(evidence.query.first)! < positions.get(evidence.query.second)!);
          },
        ),
      );
    }
  }

  if (evidence.query.kind === 'VALID_RANK_STATEMENT') {
    const [higher, lower] = answerKey.split('>');
    shortestDirectionalPathClues = Math.max(1, (shortestPath(evidence.clues, higher, lower)?.length ?? 2) - 1);
  }

  if (evidence.query.kind === 'IMMEDIATE_NEIGHBOUR') {
    const targetIndex = order.indexOf(evidence.query.target);
    const answer = evidence.query.direction === 'ABOVE' ? order[targetIndex - 1] : order[targetIndex + 1];
    shortestExactPositionProofClues = minimumSubsetSize(
      evidence,
      (clues) => allTopologicalOrdersSatisfy(
        evidence.entities,
        clues,
        (candidateOrder) => {
          const candidateTarget = candidateOrder.indexOf(evidence.query.target);
          const candidateAnswer = candidateOrder.indexOf(answer);
          return evidence.query.direction === 'ABOVE'
            ? candidateAnswer === candidateTarget - 1
            : candidateAnswer === candidateTarget + 1;
        },
      ),
    );
  }

  return {
    shortestDirectionalPathClues,
    shortestExactPositionProofClues,
    fullOrderProofClues,
  };
}

function topologyProfile(
  evidence: RnkCp004Evidence,
  order: readonly string[],
): RnkCp004TopologyProfile {
  if (evidence.query.kind === 'MISSING_COMPARISON') {
    return {
      adjacentClueCount: evidence.clues.length,
      nonAdjacentClueCount: 0,
      family: 'TWO_ORDERED_BLOCKS',
    };
  }
  const positions = indexMap(order);
  let adjacent = 0;
  let nonAdjacent = 0;
  for (const clue of evidence.clues) {
    if (Math.abs(positions.get(clue.higher)! - positions.get(clue.lower)!) === 1) adjacent += 1;
    else nonAdjacent += 1;
  }
  return {
    adjacentClueCount: adjacent,
    nonAdjacentClueCount: nonAdjacent,
    family: nonAdjacent > 0 ? 'CHAIN_WITH_NON_ADJACENT_VERIFICATION' : 'CHAIN_BACKBONE',
  };
}

function taskWeight(
  query: RnkCp004Query,
  prototypeId: RnkCp004RemodelV3PrototypeId,
): number {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 5;
  const weights: Record<RnkCp004Query['kind'], number> = {
    HIGHEST_ENTITY: 0,
    LOWEST_ENTITY: 0,
    ENTITY_AT_EXACT_RANK: 1,
    RANK_OF_NAMED_ENTITY: 1,
    MIDDLE_ENTITY: 2,
    COMPLETE_ORDER: 4,
    RELATIVE_ORDER_OF_PAIR: 2,
    IMMEDIATE_NEIGHBOUR: 4,
    VALID_RANK_STATEMENT: 4,
    MISSING_COMPARISON: 7,
  };
  return weights[query.kind];
}

function difficultyFor(
  evidence: RnkCp004Evidence,
  topology: RnkCp004TopologyProfile,
  proof: RnkCp004ProofMetrics,
  prototypeId: RnkCp004RemodelV3PrototypeId,
): { difficulty: RnkCp004Difficulty; featureScore: number; topologyWeight: number; taskWeight: number } {
  const topologyWeight = topology.nonAdjacentClueCount * 2 + (topology.family === 'TWO_ORDERED_BLOCKS' ? 2 : 0);
  const task = taskWeight(evidence.query, prototypeId);
  const proofWeight = Math.max(0, (proof.fullOrderProofClues ?? 4) - 5)
    + Math.max(0, (proof.shortestExactPositionProofClues ?? 0) - 4);
  const featureScore = Math.max(0, evidence.entities.length - 5) + topologyWeight + task + proofWeight;
  if (featureScore <= 3) return { difficulty: 'EASY', featureScore, topologyWeight, taskWeight: task };
  if (featureScore <= 8) return { difficulty: 'MEDIUM', featureScore, topologyWeight, taskWeight: task };
  return { difficulty: 'HARD', featureScore, topologyWeight, taskWeight: task };
}

function normalizedQuery(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  prototypeId: RnkCp004RemodelV3PrototypeId,
): string {
  const positions = indexMap(order);
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const query = evidence.query;
    if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Exact-distance fingerprint requires pair query');
    return `${prototypeId}:${positions.get(query.first)}:${positions.get(query.second)}`;
  }
  const query = evidence.query;
  switch (query.kind) {
    case 'HIGHEST_ENTITY':
    case 'LOWEST_ENTITY':
    case 'MIDDLE_ENTITY':
    case 'COMPLETE_ORDER':
      return query.kind;
    case 'ENTITY_AT_EXACT_RANK': return `${query.kind}:${query.rankFromTop}`;
    case 'RANK_OF_NAMED_ENTITY': return `${query.kind}:${positions.get(query.target)}`;
    case 'RELATIVE_ORDER_OF_PAIR': return `${query.kind}:${positions.get(query.first)}:${positions.get(query.second)}`;
    case 'IMMEDIATE_NEIGHBOUR': return `${query.kind}:${positions.get(query.target)}:${query.direction}`;
    case 'VALID_RANK_STATEMENT':
    case 'MISSING_COMPARISON':
      return `${query.kind}:${query.candidates
        .map((candidate) => `${positions.get(candidate.higher)}>${positions.get(candidate.lower)}`)
        .sort()
        .join(',')}`;
  }
}

function normalizedFingerprint(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  options: readonly RnkCp004Option[],
  prototypeId: RnkCp004RemodelV3PrototypeId,
): string {
  const positions = indexMap(order);
  const clues = evidence.clues
    .map((clue) => `${positions.get(clue.higher)}>${positions.get(clue.lower)}`)
    .sort()
    .join(',');
  const layout = options.map((option) => option.misconceptionId).join('>');
  return `${evidence.entities.length}|${clues}|${normalizedQuery(evidence, order, prototypeId)}|${layout}`;
}

function competencyFor(
  query: RnkCp004Query,
  prototypeId: RnkCp004RemodelV3PrototypeId,
  fallback: string,
): string {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return 'Determine the exact rank difference and direction between two named entities';
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    return 'Infer which of two named entities ranks higher';
  }
  return fallback;
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV3PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const underlyingPrototype: RnkCp004PrototypeId =
    prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID
      ? 'RNK-CP004-PROT-RELATIVE-ORDER-OF-PAIR'
      : prototypeId;
  const base = generateV2(underlyingPrototype, seed, correctIndexOverride);
  const original = generateOriginalEvidence(underlyingPrototype, seed);
  const baseOrder = solvedOrder(base.displayedEvidence, base.answerKey);
  let evidence = addNonAdjacentVerificationClue(
    base.displayedEvidence,
    original.displayedEvidence,
    baseOrder,
    seed,
  );
  evidence = rebuildMissingCandidates(evidence, base.answerKey, seed);
  const answerKey = solveCp004Independently(evidence);
  if (answerKey !== base.answerKey) {
    throw new Error(`Remodel V3 answer changed at ${prototypeId}:${seed}`);
  }
  const order = solvedOrder(evidence, answerKey);
  const correctIndex = correctIndexOverride ?? base.correctIndex;
  const options = reviewedOptions(base, evidence, order, answerKey, correctIndex, prototypeId);
  const answer = options[correctIndex].label;
  const visibleExplanation = visibleExplanationFor(
    evidence,
    order,
    answerKey,
    answer,
    options,
    prototypeId,
  );
  const proof = proofMetrics(evidence, order, answerKey, prototypeId);
  const topology = topologyProfile(evidence, order);
  const difficulty = difficultyFor(evidence, topology, proof, prototypeId);
  const normalized = normalizedFingerprint(evidence, order, options, prototypeId);
  const stablePrototypeIndex = RNK_CP004_REMODEL_V3_PROTOTYPE_IDS.indexOf(prototypeId) + 1;

  return {
    ...base,
    prototypeId,
    stem: stemFor(evidence, seed, prototypeId),
    displayedEvidence: evidence,
    answerKey,
    answer,
    options,
    correctIndex,
    difficulty: difficulty.difficulty,
    explanation: internalExplanation(visibleExplanation, options),
    visibleExplanation,
    mathematicalFingerprint: `${evidence.clues.map(relationKey).sort().join(',')}:${normalized}:ENGLISH_REMODEL_V3`,
    reviewMetadata: {
      ...base.reviewMetadata,
      stableQuestionId: `RNK-CP004-P${String(stablePrototypeIndex).padStart(2, '0')}-S${String(seed).padStart(4, '0')}`,
      authorityCandidateId: prototypeId.replace('RNK-CP004-PROT-', ''),
      competency: competencyFor(evidence.query, prototypeId, base.reviewMetadata.competency),
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V3',
      explanationMode: visibleExplanation.mode,
      normalizedSemanticFingerprint: normalized,
      proofMetrics: proof,
      topologyProfile: topology,
      reasoningFeatures: {
        ...base.reviewMetadata.reasoningFeatures,
        shortestProofClueCount:
          proof.shortestExactPositionProofClues
          ?? proof.shortestDirectionalPathClues
          ?? proof.fullOrderProofClues
          ?? base.reviewMetadata.reasoningFeatures.shortestProofClueCount,
        featureScore: difficulty.featureScore,
        nonAdjacentClueCount: topology.nonAdjacentClueCount,
        topologyWeight: difficulty.topologyWeight,
        taskWeight: difficulty.taskWeight,
      },
      validatorBaseOrderCount: evidence.query.kind === 'MISSING_COMPARISON'
        ? countTopologicalOrders(evidence.entities, evidence.clues)
        : null,
    },
  };
}
