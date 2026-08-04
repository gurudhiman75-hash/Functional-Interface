import {
  RNK_CP004_PROTOTYPE_IDS,
  generateRnkCp004Question,
  hashText,
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
  type RnkCp004Evidence,
  type RnkCp004Option,
  type RnkCp004PrototypeId,
  type RnkCp004Question,
  type RnkCp004Query,
} from './cp004-foundation';

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;
const REVIEW_CORRECT_INDEX_SEQUENCE = [
  1, 2, 3, 0, 2, 0,
  3, 1, 0, 3, 1, 2,
  1, 3, 2, 0, 2, 1,
  0, 3, 2, 1, 3, 0,
  2, 3, 1, 0, 1, 0,
  3, 0, 2, 1, 3, 1,
  2, 3, 2, 0, 3, 0,
  1, 2, 3, 1, 2, 0,
  1, 0, 2, 3, 2, 1,
  0, 1, 3, 2, 3, 0,
] as const;

export interface RnkCp004ReviewMetadata {
  readonly stableQuestionId: string;
  readonly authorityCandidateId: string;
  readonly competency: string;
  readonly intendedExamFamilies: readonly ['SSC', 'BANKING', 'PUNJAB_STATE'];
  readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V1';
  readonly reviewStatus: 'REVIEW_PENDING';
  readonly answerDirectlyStatedInClue: boolean;
  readonly immediateNeighbourDirectEdgeRequired: boolean;
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004Question,
  | 'stem'
  | 'displayedEvidence'
  | 'answerKey'
  | 'answer'
  | 'options'
  | 'correctIndex'
  | 'difficulty'
  | 'explanation'
  | 'mathematicalFingerprint'
> & {
  readonly stem: string;
  readonly displayedEvidence: RnkCp004Evidence;
  readonly answerKey: string;
  readonly answer: string;
  readonly options: readonly RnkCp004Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp004Difficulty;
  readonly explanation: RnkCp004Question['explanation'];
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: RnkCp004ReviewMetadata;
};

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function relationLabel(key: string): string {
  if (key.startsWith('SAME_RANK:')) {
    const [first, second] = key.slice('SAME_RANK:'.length).split('|');
    return `${first} and ${second} have the same rank`;
  }
  if (key.startsWith('CANNOT_DETERMINE:')) {
    const [first, second] = key.slice('CANNOT_DETERMINE:'.length).split('|');
    return `The relative order of ${first} and ${second} cannot be determined`;
  }
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
}

function orderKey(order: readonly string[]): string {
  return order.join('|');
}

function orderLabel(key: string): string {
  return key.split('|').join(' > ');
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function formatAnswer(key: string, semantic: RnkCp004Question['answerSemantic']): string {
  if (semantic === 'ORDER') return orderLabel(key);
  if (semantic === 'RELATION') return relationLabel(key);
  return key;
}

function indexMap(order: readonly string[]): ReadonlyMap<string, number> {
  return new Map(order.map((entity, index) => [entity, index]));
}

function isDirectClue(clues: readonly RnkCp004Comparison[], higher: string, lower: string): boolean {
  return clues.some((clue) => clue.higher === higher && clue.lower === lower);
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

export function countTopologicalOrders(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
): number {
  const entityIndex = new Map(entities.map((entity, index) => [entity, index]));
  if (entityIndex.size !== entities.length) return 0;
  const prerequisites = Array.from({ length: entities.length }, () => 0);
  for (const clue of clues) {
    const higher = entityIndex.get(clue.higher);
    const lower = entityIndex.get(clue.lower);
    if (higher === undefined || lower === undefined || higher === lower) return 0;
    prerequisites[lower] |= 1 << higher;
  }
  const fullMask = (1 << entities.length) - 1;
  const memo = new Map<number, number>();
  const visit = (mask: number): number => {
    if (mask === fullMask) return 1;
    const cached = memo.get(mask);
    if (cached !== undefined) return cached;
    let total = 0;
    for (let index = 0; index < entities.length; index += 1) {
      const bit = 1 << index;
      if ((mask & bit) !== 0) continue;
      if ((prerequisites[index] & mask) === prerequisites[index]) {
        total += visit(mask | bit);
      }
    }
    memo.set(mask, total);
    return total;
  };
  return visit(0);
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
    const componentSet = new Set(component);
    const componentClues = evidence.clues.filter(
      (clue) => componentSet.has(clue.higher) && componentSet.has(clue.lower),
    );
    blocks.push([...reconstructUniqueOrder(component, componentClues)]);
  }
  return blocks.sort((left, right) => left.join('|').localeCompare(right.join('|')));
}

function chooseIndirectPair(
  order: readonly string[],
  clues: readonly RnkCp004Comparison[],
  seed: number,
): readonly [string, string] {
  const pool: Array<readonly [string, string]> = [];
  for (let higherIndex = 0; higherIndex < order.length - 2; higherIndex += 1) {
    for (let lowerIndex = higherIndex + 2; lowerIndex < order.length; lowerIndex += 1) {
      const higher = order[higherIndex];
      const lower = order[lowerIndex];
      if (!isDirectClue(clues, higher, lower)) pool.push([higher, lower]);
    }
  }
  if (pool.length === 0) throw new Error('No indirect pair is available for the relation query');
  const chosen = pool[hashText(`pair:${seed}:${order.join('|')}`) % pool.length];
  return hashText(`pair-direction:${seed}`) % 2 === 0
    ? chosen
    : [chosen[1], chosen[0]];
}

function buildTransitiveCandidates(
  order: readonly string[],
  clues: readonly RnkCp004Comparison[],
  seed: number,
): readonly RnkCp004Comparison[] {
  const correctStart = hashText(`statement-correct:${seed}:${order.join('|')}`) % (order.length - 2);
  const correctEnd = correctStart + 2 + (hashText(`statement-distance:${seed}`) % (order.length - correctStart - 2));
  const correct = { higher: order[correctStart], lower: order[correctEnd] };
  if (isDirectClue(clues, correct.higher, correct.lower)) {
    throw new Error('Transitive statement unexpectedly duplicates a direct clue');
  }
  const falsePool: RnkCp004Comparison[] = [];
  for (let lowerIndex = 1; lowerIndex < order.length; lowerIndex += 1) {
    for (let higherIndex = 0; higherIndex < lowerIndex; higherIndex += 1) {
      falsePool.push({ higher: order[lowerIndex], lower: order[higherIndex] });
    }
  }
  const offset = hashText(`statement-false:${seed}:${order.join('|')}`) % falsePool.length;
  const rotated = [...falsePool.slice(offset), ...falsePool.slice(0, offset)];
  const candidates = [correct];
  for (const candidate of rotated) {
    if (!candidates.some((existing) => relationKey(existing) === relationKey(candidate))) {
      candidates.push(candidate);
    }
    if (candidates.length === 4) break;
  }
  return candidates;
}

function reviewedEvidence(raw: RnkCp004Question, order: readonly string[]): RnkCp004Evidence {
  const query = raw.displayedEvidence.query;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const [first, second] = chooseIndirectPair(order, raw.displayedEvidence.clues, raw.seed);
    return {
      ...raw.displayedEvidence,
      query: { kind: 'RELATIVE_ORDER_OF_PAIR', first, second },
    };
  }
  if (query.kind === 'VALID_RANK_STATEMENT') {
    return {
      ...raw.displayedEvidence,
      query: {
        kind: 'VALID_RANK_STATEMENT',
        candidates: buildTransitiveCandidates(order, raw.displayedEvidence.clues, raw.seed),
      },
    };
  }
  return raw.displayedEvidence;
}

function correctIndexFor(prototypeId: RnkCp004PrototypeId, seed: number): number {
  const prototypeIndex = RNK_CP004_PROTOTYPE_IDS.indexOf(prototypeId);
  const seedIndex = REVIEW_SEEDS.indexOf(seed as (typeof REVIEW_SEEDS)[number]);
  if (prototypeIndex >= 0 && seedIndex >= 0) {
    return REVIEW_CORRECT_INDEX_SEQUENCE[prototypeIndex * REVIEW_SEEDS.length + seedIndex];
  }
  return hashText(`cp004-reviewed-correct:${prototypeId}:${seed}`) % 4;
}

interface OptionCandidate {
  readonly key: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

function placeOptions(
  correct: OptionCandidate,
  wrong: readonly OptionCandidate[],
  correctIndex: number,
  semantic: RnkCp004Question['answerSemantic'],
): readonly RnkCp004Option[] {
  if (wrong.length !== 3) throw new Error(`Expected three reviewed distractors, found ${wrong.length}`);
  const result: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    const candidate = index === correctIndex ? correct : wrong[wrongIndex++];
    result.push({
      answerKey: candidate.key,
      label: formatAnswer(candidate.key, semantic),
      misconceptionId: candidate.misconceptionId,
      explanation: candidate.explanation,
    });
  }
  return result;
}

function entityOptions(
  order: readonly string[],
  answerKey: string,
  query: RnkCp004Query,
  correctIndex: number,
): readonly RnkCp004Option[] {
  const answerIndex = order.indexOf(answerKey);
  const wrong: OptionCandidate[] = [];
  const add = (key: string, misconceptionId: string, explanation: string): void => {
    if (key !== answerKey && !wrong.some((candidate) => candidate.key === key)) {
      wrong.push({ key, misconceptionId, explanation });
    }
  };
  if (query.kind === 'HIGHEST_ENTITY') {
    add(order[1], 'CHOSE_SECOND_HIGHEST', `${order[1]} is second, not highest`);
    add(order[order.length - 1], 'REVERSED_RANKING_DIRECTION', `${order[order.length - 1]} is lowest, so this reverses the ranking direction`);
    add(order[Math.min(2, order.length - 1)], 'STOPPED_CHAIN_EARLY', 'This choice comes from stopping before the top endpoint is found');
  } else if (query.kind === 'LOWEST_ENTITY') {
    add(order[order.length - 2], 'CHOSE_SECOND_LOWEST', `${order[order.length - 2]} is second from the bottom, not lowest`);
    add(order[0], 'REVERSED_RANKING_DIRECTION', `${order[0]} is highest, so this reverses the ranking direction`);
    add(order[Math.max(0, order.length - 3)], 'STOPPED_CHAIN_EARLY', 'This choice comes from stopping before the bottom endpoint is found');
  } else {
    if (answerIndex > 0) add(order[answerIndex - 1], 'OFF_BY_ONE_ABOVE', `${order[answerIndex - 1]} is one position above the required place`);
    if (answerIndex < order.length - 1) add(order[answerIndex + 1], 'OFF_BY_ONE_BELOW', `${order[answerIndex + 1]} is one position below the required place`);
    add(order[order.length - answerIndex - 1], 'COUNTED_FROM_BOTTOM', 'This is obtained by counting from the bottom instead of the top');
  }
  for (const entity of order) add(entity, 'USED_WRONG_CHAIN_POSITION', `${entity} occupies another position in the reconstructed order`);
  return placeOptions(
    { key: answerKey, misconceptionId: 'CORRECT', explanation: `${answerKey} occupies the exact requested position` },
    wrong.slice(0, 3),
    correctIndex,
    'ENTITY',
  );
}

function rankOptions(order: readonly string[], answerKey: string, correctIndex: number): readonly RnkCp004Option[] {
  const answer = Number(answerKey);
  const wrong: OptionCandidate[] = [];
  const add = (value: number, misconceptionId: string, explanation: string): void => {
    const key = String(value);
    if (value >= 1 && value <= order.length && key !== answerKey && !wrong.some((candidate) => candidate.key === key)) {
      wrong.push({ key, misconceptionId, explanation });
    }
  };
  add(order.length - answer + 1, 'TOP_BOTTOM_CONFUSION', 'This is the target’s rank from the bottom, not from the top');
  add(answer - 1, 'OFF_BY_ONE', 'This counts one position too few');
  add(answer + 1, 'OFF_BY_ONE', 'This counts one position too many');
  for (let value = 1; value <= order.length; value += 1) add(value, 'USED_WRONG_CHAIN_POSITION', 'This rank belongs to another person in the order');
  return placeOptions(
    { key: answerKey, misconceptionId: 'CORRECT', explanation: `The target occupies position ${answerKey} from the top` },
    wrong.slice(0, 3),
    correctIndex,
    'RANK',
  );
}

function firstViolatedClue(
  candidateOrder: readonly string[],
  clues: readonly RnkCp004Comparison[],
): RnkCp004Comparison | null {
  const positions = indexMap(candidateOrder);
  return clues.find((clue) => positions.get(clue.higher)! >= positions.get(clue.lower)!) ?? null;
}

function orderOptions(
  order: readonly string[],
  clues: readonly RnkCp004Comparison[],
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  const candidates: readonly (readonly string[])[] = [
    [...order].reverse(),
    order.map((entity, index) => index === Math.floor(order.length / 2) - 1
      ? order[Math.floor(order.length / 2)]
      : index === Math.floor(order.length / 2)
        ? order[Math.floor(order.length / 2) - 1]
        : entity),
    [order[0], ...order.slice(2, -1), order[1], order[order.length - 1]],
    [order[order.length - 1], ...order.slice(1, -1), order[0]],
  ];
  const wrong: OptionCandidate[] = [];
  for (const candidate of candidates) {
    const key = orderKey(candidate);
    if (key === answerKey || wrong.some((item) => item.key === key)) continue;
    const violated = firstViolatedClue(candidate, clues);
    wrong.push({
      key,
      misconceptionId: violated ? 'VIOLATES_DISPLAYED_CLUE' : 'INVALID_COMPLETE_ORDER',
      explanation: violated
        ? `It places ${violated.lower} above ${violated.higher}, contradicting the clue that ${violated.higher} ranks above ${violated.lower}`
        : 'It does not reproduce the uniquely reconstructed order',
    });
    if (wrong.length === 3) break;
  }
  return placeOptions(
    { key: answerKey, misconceptionId: 'CORRECT', explanation: 'This order satisfies every displayed comparison' },
    wrong,
    correctIndex,
    'ORDER',
  );
}

function relativeOptions(
  evidence: RnkCp004Evidence,
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'RELATIVE_ORDER_OF_PAIR') throw new Error('Expected pair relation query');
  const first = evidence.query.first;
  const second = evidence.query.second;
  const [higher, lower] = answerKey.split('>');
  return placeOptions(
    {
      key: answerKey,
      misconceptionId: 'CORRECT',
      explanation: `The comparison chain places ${higher} before ${lower}`,
    },
    [
      {
        key: `${lower}>${higher}`,
        misconceptionId: 'RELATION_REVERSED',
        explanation: `This reverses the established order of ${higher} and ${lower}`,
      },
      {
        key: `SAME_RANK:${first}|${second}`,
        misconceptionId: 'ASSUMED_EQUAL_RANK',
        explanation: 'A strict ranking gives different positions to the two people',
      },
      {
        key: `CANNOT_DETERMINE:${first}|${second}`,
        misconceptionId: 'IGNORED_TRANSITIVE_PATH',
        explanation: 'Their relation is determined by the displayed comparison path',
      },
    ],
    correctIndex,
    'RELATION',
  );
}

function validStatementOptions(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'VALID_RANK_STATEMENT') throw new Error('Expected conclusion query');
  const positions = indexMap(order);
  const correct = evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey)!;
  const wrong = evidence.query.candidates
    .filter((candidate) => relationKey(candidate) !== answerKey)
    .map((candidate) => ({
      key: relationKey(candidate),
      misconceptionId: 'RELATION_REVERSED',
      explanation: `${candidate.higher} appears below ${candidate.lower} in the reconstructed order`,
    }));
  if (!(positions.get(correct.higher)! < positions.get(correct.lower)!)) throw new Error('Invalid reviewed conclusion answer');
  return placeOptions(
    {
      key: answerKey,
      misconceptionId: 'CORRECT',
      explanation: `The transitive comparison path proves that ${correct.higher} ranks above ${correct.lower}`,
    },
    wrong,
    correctIndex,
    'RELATION',
  );
}

function missingComparisonOptions(
  evidence: RnkCp004Evidence,
  answerKey: string,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'MISSING_COMPARISON') throw new Error('Expected sufficiency query');
  const wrong = evidence.query.candidates
    .filter((candidate) => relationKey(candidate) !== answerKey)
    .map((candidate) => {
      const count = countTopologicalOrders(evidence.entities, [...evidence.clues, candidate]);
      return {
        key: relationKey(candidate),
        misconceptionId: count === 0 ? 'CONTRADICTS_BASE_ORDER' : 'TRUE_BUT_INSUFFICIENT',
        explanation: count === 0
          ? 'This comparison contradicts the existing blocks, so no valid ranking remains'
          : `This comparison still permits ${count} complete orders, so it is not sufficient`,
      };
    });
  return placeOptions(
    {
      key: answerKey,
      misconceptionId: 'CORRECT',
      explanation: 'This comparison joins the open ends of the two blocks and leaves exactly one complete order',
    },
    wrong,
    correctIndex,
    'RELATION',
  );
}

function buildOptions(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  semantic: RnkCp004Question['answerSemantic'],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind === 'RELATIVE_ORDER_OF_PAIR') return relativeOptions(evidence, answerKey, correctIndex);
  if (evidence.query.kind === 'VALID_RANK_STATEMENT') return validStatementOptions(evidence, order, answerKey, correctIndex);
  if (evidence.query.kind === 'MISSING_COMPARISON') return missingComparisonOptions(evidence, answerKey, correctIndex);
  if (semantic === 'ENTITY') return entityOptions(order, answerKey, evidence.query, correctIndex);
  if (semantic === 'RANK') return rankOptions(order, answerKey, correctIndex);
  if (semantic === 'ORDER') return orderOptions(order, evidence.clues, answerKey, correctIndex);
  throw new Error(`Unsupported reviewed option contract for ${evidence.query.kind}`);
}

function renderClue(clue: RnkCp004Comparison, index: number, seed: number): string {
  const variant = (index + Math.abs(seed)) % 4;
  if (variant === 0) return `${clue.higher} ranks above ${clue.lower}.`;
  if (variant === 1) return `${clue.lower} is ranked below ${clue.higher}.`;
  if (variant === 2) return `${clue.higher} has a better rank than ${clue.lower}.`;
  return `${clue.higher} is placed before ${clue.lower} in the ranking.`;
}

function queryText(query: RnkCp004Query): string {
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'Who ranks highest?';
    case 'LOWEST_ENTITY': return 'Who ranks lowest?';
    case 'ENTITY_AT_EXACT_RANK': return `Who is ${ordinal(query.rankFromTop)} from the top?`;
    case 'RANK_OF_NAMED_ENTITY': return `What is ${query.target}’s rank from the top?`;
    case 'MIDDLE_ENTITY': return 'Who occupies the middle position?';
    case 'COMPLETE_ORDER': return 'Which option shows the complete order from highest to lowest?';
    case 'RELATIVE_ORDER_OF_PAIR': return `What is the relative order of ${query.first} and ${query.second}?`;
    case 'IMMEDIATE_NEIGHBOUR': return `Who ranks immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`;
    case 'VALID_RANK_STATEMENT': return 'Which of the following conclusions follows from the information?';
    case 'MISSING_COMPARISON': return 'The information does not determine a unique complete order. Which additional statement makes the order unique?';
  }
}

function stemFor(evidence: RnkCp004Evidence, seed: number): string {
  const heading = `${evidence.entities.length} candidates are ranked from highest to lowest.`;
  const clues = evidence.clues.map((clue, index) => `- ${renderClue(clue, index, seed)}`).join('\n');
  return `${heading}\n\n${clues}\n\n${queryText(evidence.query)}`;
}

function decisiveFragments(order: readonly string[]): readonly string[] {
  if (order.length <= 5) return [order.join(' > ')];
  const split = Math.ceil(order.length / 2);
  return [
    order.slice(0, split + 1).join(' > '),
    order.slice(split).join(' > '),
  ];
}

function explanationFor(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answer: string,
  options: readonly RnkCp004Option[],
): RnkCp004Question['explanation'] {
  const query = evidence.query;
  const chain = order.join(' > ');
  let mentalPicture: string;
  let keyRule: string;
  let steps: string[];
  let shortcut: string;

  if (query.kind === 'HIGHEST_ENTITY') {
    mentalPicture = 'The highest-ranked person is the starting point of the comparison chain.';
    keyRule = 'A unique exact order must be consistent and have only one possible top-to-bottom arrangement.';
    steps = [
      `Useful chain fragments: ${decisiveFragments(order).join(' and ')}.`,
      `Combining them gives ${chain}.`,
      `${order[0]} has nobody above them, so ${order[0]} ranks highest.`,
    ];
    shortcut = 'Track only who can have nobody above them; stop once every other person is shown below that candidate.';
  } else if (query.kind === 'LOWEST_ENTITY') {
    mentalPicture = 'The lowest-ranked person is the ending point of the comparison chain.';
    keyRule = 'A unique exact order must be consistent and have only one possible top-to-bottom arrangement.';
    steps = [
      `Useful chain fragments: ${decisiveFragments(order).join(' and ')}.`,
      `Combining them gives ${chain}.`,
      `${order[order.length - 1]} has nobody below them, so that person ranks lowest.`,
    ];
    shortcut = 'Follow the arrows downward until one person has no further lower-ranked person.';
  } else if (query.kind === 'ENTITY_AT_EXACT_RANK') {
    mentalPicture = 'Place the people on one top-to-bottom rank line, then count to the requested position.';
    keyRule = 'Count positions from the stated end only after the unique order has been established.';
    steps = [
      `Join the decisive fragments: ${decisiveFragments(order).join(' and ')}.`,
      `The unique order is ${chain}.`,
      `Counting from the top, position ${query.rankFromTop} is occupied by ${order[query.rankFromTop - 1]}.`,
    ];
    shortcut = 'After the chain is stable, write position numbers only up to the requested rank.';
  } else if (query.kind === 'RANK_OF_NAMED_ENTITY') {
    mentalPicture = `Locate ${query.target} on the unique top-to-bottom rank line.`;
    keyRule = 'A person’s numerical rank is their position when the unique order is counted from the requested end.';
    steps = [
      `The connected comparison chain is ${chain}.`,
      `${query.target} is at position ${order.indexOf(query.target) + 1} from the top.`,
      `Therefore, ${query.target}’s rank is ${answer}.`,
    ];
    shortcut = `Stop counting as soon as you reach ${query.target}; the remaining names are irrelevant.`;
  } else if (query.kind === 'MIDDLE_ENTITY') {
    const middle = (order.length + 1) / 2;
    mentalPicture = 'The middle person has the same number of people above and below.';
    keyRule = `For an odd group of ${order.length}, the middle position is (${order.length} + 1) / 2 = ${middle}.`;
    steps = [
      `The unique order is ${chain}.`,
      `The middle position is ${middle}.`,
      `${order[middle - 1]} occupies that position.`,
    ];
    shortcut = 'Find the middle position first, then count only to that place in the chain.';
  } else if (query.kind === 'COMPLETE_ORDER') {
    mentalPicture = 'Each clue is a directed link; the complete answer must satisfy every link.';
    keyRule = 'A valid complete order must respect all displayed comparisons, not merely most of them.';
    steps = [
      `Join the comparison fragments: ${decisiveFragments(order).join(' and ')}.`,
      `The unique complete order is ${chain}.`,
      'Check the options against the displayed clues; only one preserves every comparison.',
    ];
    shortcut = 'Reject an option as soon as it reverses even one displayed comparison.';
  } else if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const [higher, lower] = answer.split(' ranks above ');
    const path = shortestPath(evidence.clues, higher, lower);
    mentalPicture = `Trace only the comparison path connecting ${query.first} and ${query.second}.`;
    keyRule = 'If a chain leads from one person to another, the first person ranks above the second by transitivity.';
    steps = [
      `The shortest decisive path is ${path?.join(' > ') ?? chain}.`,
      `${higher} appears before ${lower} on that path.`,
      `Therefore, ${answer}.`,
    ];
    shortcut = 'Do not reconstruct unrelated parts of the order; follow the shortest path between the named pair.';
  } else if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    mentalPicture = `The required person must be directly next to ${query.target} in the final order.`;
    keyRule = 'A direct comparison establishes direction, but the complete unique chain confirms that nobody lies between the two people.';
    steps = [
      `The unique order is ${chain}.`,
      `${query.target} is at position ${order.indexOf(query.target) + 1}.`,
      `The person directly ${query.direction === 'ABOVE' ? 'before' : 'after'} ${query.target} is ${answer}.`,
    ];
    shortcut = `Locate ${query.target} and inspect only the adjacent position ${query.direction === 'ABOVE' ? 'above' : 'below'} it.`;
  } else if (query.kind === 'VALID_RANK_STATEMENT') {
    const [higher, lower] = answer.split(' ranks above ');
    const path = shortestPath(evidence.clues, higher, lower);
    mentalPicture = 'A conclusion follows only when a comparison path proves it.';
    keyRule = 'A correct conclusion may be transitive; it must be true in the unique reconstructed order and must not merely repeat a clue.';
    steps = [
      `The decisive path is ${path?.join(' > ') ?? chain}.`,
      `This proves that ${higher} ranks above ${lower}.`,
      'Each other option reverses the order of its named pair.',
    ];
    shortcut = 'For each option, search for a short supporting path; reject it immediately if the path runs in the opposite direction.';
  } else {
    const blocks = connectedBlocks(evidence);
    const baseCount = countTopologicalOrders(evidence.entities, evidence.clues);
    const answerComparison = query.candidates.find((candidate) => relationKey(candidate) === solveCp004Independently(evidence))!;
    const finalOrder = reconstructUniqueOrder(evidence.entities, [...evidence.clues, answerComparison]);
    mentalPicture = 'The clues form separate ordered blocks whose relative placement is still open.';
    keyRule = 'The correct added comparison must keep the clues consistent and reduce the number of valid complete orders to exactly one.';
    steps = [
      `The base clues form these blocks: ${blocks.map((block) => block.join(' > ')).join(' and ')}.`,
      `Before adding a statement, ${baseCount} complete orders are possible.`,
      `Testing the options shows that only ${relationLabel(relationKey(answerComparison))} leaves exactly one order.`,
      `After adding it, the unique order is ${finalOrder.join(' > ')}.`,
    ];
    shortcut = 'Join the open end of the upper block to the open start of the lower block; then verify that no alternative interleaving remains.';
  }

  return {
    mentalPicture,
    keyRule,
    stepByStepSolution: steps,
    examSpeedShortcut: shortcut,
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Answer: ${answer}.`,
  };
}

function difficultyFor(evidence: RnkCp004Evidence, order: readonly string[]): RnkCp004Difficulty {
  const query = evidence.query;
  let score = evidence.entities.length - 5;
  score += Math.max(0, evidence.clues.length - (evidence.entities.length - 1));
  if (query.kind === 'COMPLETE_ORDER') score += 2;
  if (query.kind === 'MISSING_COMPARISON') score += 4;
  if (query.kind === 'VALID_RANK_STATEMENT') score += 2;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    score += Math.max(1, Math.abs(order.indexOf(query.first) - order.indexOf(query.second)) - 1);
  }
  if (query.kind === 'IMMEDIATE_NEIGHBOUR' || query.kind === 'MIDDLE_ENTITY') score += 1;
  if (score <= 2) return 'EASY';
  if (score <= 5) return 'MEDIUM';
  return 'HARD';
}

function competencyFor(query: RnkCp004Query): string {
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'Identify the highest entity from a unique comparison order';
    case 'LOWEST_ENTITY': return 'Identify the lowest entity from a unique comparison order';
    case 'ENTITY_AT_EXACT_RANK': return 'Identify the entity at a stated rank';
    case 'RANK_OF_NAMED_ENTITY': return 'Determine a named entity’s exact rank';
    case 'MIDDLE_ENTITY': return 'Identify the middle entity in an odd-sized order';
    case 'COMPLETE_ORDER': return 'Reconstruct and validate the complete order';
    case 'RELATIVE_ORDER_OF_PAIR': return 'Infer the relative order of a named pair';
    case 'IMMEDIATE_NEIGHBOUR': return 'Identify an immediate rank neighbour';
    case 'VALID_RANK_STATEMENT': return 'Identify a transitive conclusion that follows';
    case 'MISSING_COMPARISON': return 'Choose an additional comparison that makes the order unique';
  }
}

function fingerprintFor(evidence: RnkCp004Evidence): string {
  const clueKeys = evidence.clues.map(relationKey).sort();
  const query = evidence.query.kind === 'VALID_RANK_STATEMENT' || evidence.query.kind === 'MISSING_COMPARISON'
    ? { ...evidence.query, candidates: evidence.query.candidates.map(relationKey).sort() }
    : evidence.query;
  return `${evidence.entities.length}:${clueKeys.join(',')}:${JSON.stringify(query)}:ENGLISH_REMODEL_V1`;
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004PrototypeId,
  seed: number,
): RnkCp004ExamReadyQuestion {
  const raw = generateRnkCp004Question(prototypeId, seed);
  const rawOrder = raw.displayedEvidence.query.kind === 'MISSING_COMPARISON'
    ? reconstructUniqueOrder(
        raw.displayedEvidence.entities,
        [
          ...raw.displayedEvidence.clues,
          raw.displayedEvidence.query.candidates.find(
            (candidate) => relationKey(candidate) === raw.answerKey,
          )!,
        ],
      )
    : reconstructUniqueOrder(raw.displayedEvidence.entities, raw.displayedEvidence.clues);
  const evidence = reviewedEvidence(raw, rawOrder);
  const answerKey = solveCp004Independently(evidence);
  const solvedOrder = evidence.query.kind === 'MISSING_COMPARISON'
    ? reconstructUniqueOrder(
        evidence.entities,
        [...evidence.clues, evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey)!],
      )
    : reconstructUniqueOrder(evidence.entities, evidence.clues);
  const answer = formatAnswer(answerKey, raw.answerSemantic);
  const correctIndex = correctIndexFor(prototypeId, seed);
  const options = buildOptions(evidence, solvedOrder, answerKey, raw.answerSemantic, correctIndex);
  const explanation = explanationFor(evidence, solvedOrder, answer, options);
  const prototypeIndex = RNK_CP004_PROTOTYPE_IDS.indexOf(prototypeId) + 1;
  const answerComparison = answerKey.includes('>') ? answerKey.split('>') : null;
  const answerDirectlyStatedInClue = answerComparison !== null
    && isDirectClue(evidence.clues, answerComparison[0], answerComparison[1]);

  return {
    ...raw,
    stem: stemFor(evidence, seed),
    displayedEvidence: evidence,
    answerKey,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(evidence, solvedOrder),
    explanation,
    mathematicalFingerprint: fingerprintFor(evidence),
    reviewMetadata: {
      stableQuestionId: `RNK-CP004-P${String(prototypeIndex).padStart(2, '0')}-S${String(seed).padStart(4, '0')}`,
      authorityCandidateId: prototypeId.replace('RNK-CP004-PROT-', ''),
      competency: competencyFor(evidence.query),
      intendedExamFamilies: ['SSC', 'BANKING', 'PUNJAB_STATE'],
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V1',
      reviewStatus: 'REVIEW_PENDING',
      answerDirectlyStatedInClue,
      immediateNeighbourDirectEdgeRequired: evidence.query.kind === 'IMMEDIATE_NEIGHBOUR',
    },
  };
}
