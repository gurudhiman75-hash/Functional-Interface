export const RNK_CP004_PROTOTYPE_IDS = [
  'RNK-CP004-PROT-HIGHEST-ENTITY',
  'RNK-CP004-PROT-LOWEST-ENTITY',
  'RNK-CP004-PROT-ENTITY-AT-EXACT-RANK',
  'RNK-CP004-PROT-RANK-OF-NAMED-ENTITY',
  'RNK-CP004-PROT-MIDDLE-ENTITY',
  'RNK-CP004-PROT-COMPLETE-ORDER',
  'RNK-CP004-PROT-RELATIVE-ORDER-OF-PAIR',
  'RNK-CP004-PROT-IMMEDIATE-NEIGHBOUR',
  'RNK-CP004-PROT-VALID-RANK-STATEMENT',
  'RNK-CP004-PROT-MISSING-COMPARISON',
] as const;

export type RnkCp004PrototypeId = (typeof RNK_CP004_PROTOTYPE_IDS)[number];
export type RnkCp004AnswerSemantic = 'ENTITY' | 'RANK' | 'ORDER' | 'RELATION';
export type RnkCp004Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export const RNK_CP004_NAMES = [
  'Aman', 'Ananya', 'Gurpreet', 'Harleen', 'Ishaan', 'Jaspreet',
  'Karan', 'Mehak', 'Navdeep', 'Pooja', 'Riya', 'Simran',
] as const;

export interface RnkCp004Comparison {
  readonly higher: string;
  readonly lower: string;
}

export type RnkCp004Query =
  | { readonly kind: 'HIGHEST_ENTITY' }
  | { readonly kind: 'LOWEST_ENTITY' }
  | { readonly kind: 'ENTITY_AT_EXACT_RANK'; readonly rankFromTop: number }
  | { readonly kind: 'RANK_OF_NAMED_ENTITY'; readonly target: string }
  | { readonly kind: 'MIDDLE_ENTITY' }
  | { readonly kind: 'COMPLETE_ORDER' }
  | { readonly kind: 'RELATIVE_ORDER_OF_PAIR'; readonly first: string; readonly second: string }
  | { readonly kind: 'IMMEDIATE_NEIGHBOUR'; readonly target: string; readonly direction: 'ABOVE' | 'BELOW' }
  | { readonly kind: 'VALID_RANK_STATEMENT'; readonly candidates: readonly RnkCp004Comparison[] }
  | { readonly kind: 'MISSING_COMPARISON'; readonly candidates: readonly RnkCp004Comparison[] };

export interface RnkCp004Evidence {
  readonly entities: readonly string[];
  readonly clues: readonly RnkCp004Comparison[];
  readonly query: RnkCp004Query;
}

export interface RnkCp004Option {
  readonly answerKey: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

export interface RnkCp004Question {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-004';
  readonly prototypeId: RnkCp004PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: 'en-IN';
  readonly stem: string;
  readonly displayedEvidence: RnkCp004Evidence;
  readonly answerSemantic: RnkCp004AnswerSemantic;
  readonly answerKey: string;
  readonly answer: string;
  readonly options: readonly RnkCp004Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp004Difficulty;
  readonly explanation: {
    readonly mentalPicture: string;
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

export function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(prototypeId: RnkCp004PrototypeId, seed: number): () => number {
  let state = (hashText(`${prototypeId}:${seed}:cp004`) || 0x9e3779b9) >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function randomInt(rng: () => number, minimum: number, maximum: number): number {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || maximum < minimum) {
    throw new Error(`Invalid integer range ${minimum}..${maximum}`);
  }
  return minimum + Math.floor(rng() * (maximum - minimum + 1));
}

function shuffled<T>(values: readonly T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomInt(rng, 0, index);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function orderKey(order: readonly string[]): string {
  return order.join('|');
}

function parseOrderKey(key: string): string[] {
  return key.split('|');
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
}

function orderLabel(key: string): string {
  return parseOrderKey(key).join(' > ');
}

export function reconstructUniqueOrder(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
): readonly string[] {
  if (new Set(entities).size !== entities.length) throw new Error('Duplicate entities');
  const entitySet = new Set(entities);
  const outgoing = new Map<string, Set<string>>();
  const indegree = new Map<string, number>();
  for (const entity of entities) {
    outgoing.set(entity, new Set());
    indegree.set(entity, 0);
  }
  for (const clue of clues) {
    if (!entitySet.has(clue.higher) || !entitySet.has(clue.lower)) throw new Error('Unknown entity in clue');
    if (clue.higher === clue.lower) throw new Error('Self comparison is invalid');
    const targets = outgoing.get(clue.higher)!;
    if (!targets.has(clue.lower)) {
      targets.add(clue.lower);
      indegree.set(clue.lower, indegree.get(clue.lower)! + 1);
    }
  }

  const order: string[] = [];
  const remainingIndegree = new Map(indegree);
  const available = entities.filter((entity) => remainingIndegree.get(entity) === 0).sort();
  while (available.length > 0) {
    if (available.length !== 1) throw new Error('Displayed comparisons do not determine one unique order');
    const current = available.shift()!;
    order.push(current);
    for (const lower of outgoing.get(current)!) {
      const next = remainingIndegree.get(lower)! - 1;
      remainingIndegree.set(lower, next);
      if (next === 0) {
        available.push(lower);
        available.sort();
      }
    }
  }
  if (order.length !== entities.length) throw new Error('Comparison cycle detected');
  return order;
}

function answerSemanticFor(query: RnkCp004Query): RnkCp004AnswerSemantic {
  if (query.kind === 'RANK_OF_NAMED_ENTITY') return 'RANK';
  if (query.kind === 'COMPLETE_ORDER') return 'ORDER';
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR' || query.kind === 'VALID_RANK_STATEMENT' || query.kind === 'MISSING_COMPARISON') return 'RELATION';
  return 'ENTITY';
}

export function solveCp004Independently(evidence: RnkCp004Evidence): string {
  const query = evidence.query;
  if (query.kind === 'MISSING_COMPARISON') {
    const sufficient = query.candidates.filter((candidate) => {
      try {
        reconstructUniqueOrder(evidence.entities, [...evidence.clues, candidate]);
        return true;
      } catch {
        return false;
      }
    });
    if (sufficient.length !== 1) throw new Error(`Expected one sufficient comparison, found ${sufficient.length}`);
    return relationKey(sufficient[0]);
  }

  const order = reconstructUniqueOrder(evidence.entities, evidence.clues);
  const index = new Map(order.map((entity, position) => [entity, position]));
  switch (query.kind) {
    case 'HIGHEST_ENTITY':
      return order[0];
    case 'LOWEST_ENTITY':
      return order[order.length - 1];
    case 'ENTITY_AT_EXACT_RANK':
      if (query.rankFromTop < 1 || query.rankFromTop > order.length) throw new Error('Requested rank is outside the order');
      return order[query.rankFromTop - 1];
    case 'RANK_OF_NAMED_ENTITY': {
      const position = index.get(query.target);
      if (position === undefined) throw new Error('Unknown target entity');
      return String(position + 1);
    }
    case 'MIDDLE_ENTITY':
      if (order.length % 2 === 0) throw new Error('Middle entity requires an odd-sized order');
      return order[(order.length - 1) / 2];
    case 'COMPLETE_ORDER':
      return orderKey(order);
    case 'RELATIVE_ORDER_OF_PAIR': {
      const first = index.get(query.first);
      const second = index.get(query.second);
      if (first === undefined || second === undefined || first === second) throw new Error('Invalid pair query');
      return first < second ? `${query.first}>${query.second}` : `${query.second}>${query.first}`;
    }
    case 'IMMEDIATE_NEIGHBOUR': {
      const targetIndex = index.get(query.target);
      if (targetIndex === undefined) throw new Error('Unknown neighbour target');
      const answerIndex = query.direction === 'ABOVE' ? targetIndex - 1 : targetIndex + 1;
      if (answerIndex < 0 || answerIndex >= order.length) throw new Error('Requested immediate neighbour does not exist');
      return order[answerIndex];
    }
    case 'VALID_RANK_STATEMENT': {
      const valid = query.candidates.filter((candidate) => index.get(candidate.higher)! < index.get(candidate.lower)!);
      if (valid.length !== 1) throw new Error(`Expected one valid rank statement, found ${valid.length}`);
      return relationKey(valid[0]);
    }
  }
}

function buildHiddenOrder(
  prototypeId: RnkCp004PrototypeId,
  rng: () => number,
  seed: number,
): readonly string[] {
  let count = randomInt(rng, 5, 8);
  if (prototypeId === 'RNK-CP004-PROT-MIDDLE-ENTITY') count = Math.abs(seed) % 2 === 0 ? 5 : 7;
  return shuffled(RNK_CP004_NAMES, rng).slice(0, count);
}

function adjacentChain(order: readonly string[]): RnkCp004Comparison[] {
  return Array.from({ length: order.length - 1 }, (_, index) => ({
    higher: order[index],
    lower: order[index + 1],
  }));
}

function buildCompleteClues(order: readonly string[], rng: () => number, seed: number): readonly RnkCp004Comparison[] {
  const clues = adjacentChain(order);
  const redundantCount = Math.abs(seed) % 3;
  for (let added = 0; added < redundantCount; added += 1) {
    const higherIndex = randomInt(rng, 0, order.length - 3);
    const lowerIndex = randomInt(rng, higherIndex + 2, order.length - 1);
    const candidate = { higher: order[higherIndex], lower: order[lowerIndex] };
    if (!clues.some((clue) => relationKey(clue) === relationKey(candidate))) clues.push(candidate);
  }
  return shuffled(clues, rng);
}

function candidateStatements(order: readonly string[], rng: () => number): readonly RnkCp004Comparison[] {
  const correctHigher = randomInt(rng, 0, order.length - 2);
  const correctLower = randomInt(rng, correctHigher + 1, order.length - 1);
  const correct = { higher: order[correctHigher], lower: order[correctLower] };
  const candidates: RnkCp004Comparison[] = [correct];
  const falsePool: RnkCp004Comparison[] = [];
  for (let low = 1; low < order.length; low += 1) {
    for (let high = 0; high < low; high += 1) falsePool.push({ higher: order[low], lower: order[high] });
  }
  for (const candidate of shuffled(falsePool, rng)) {
    if (!candidates.some((existing) => relationKey(existing) === relationKey(candidate))) candidates.push(candidate);
    if (candidates.length === 4) break;
  }
  return shuffled(candidates, rng);
}

function buildMissingComparisonEvidence(
  order: readonly string[],
  rng: () => number,
): Pick<RnkCp004Evidence, 'clues' | 'query'> {
  const split = randomInt(rng, 2, order.length - 2);
  const chain = adjacentChain(order);
  const missing = chain[split - 1];
  const clues = shuffled(chain.filter((_, index) => index !== split - 1), rng);
  const candidates: RnkCp004Comparison[] = [
    missing,
    { higher: order[0], lower: order[split] },
    { higher: order[split - 1], lower: order[order.length - 1] },
    { higher: order[split], lower: order[split - 1] },
  ];
  return { clues, query: { kind: 'MISSING_COMPARISON', candidates: shuffled(candidates, rng) } };
}

function buildEvidence(
  prototypeId: RnkCp004PrototypeId,
  order: readonly string[],
  rng: () => number,
): RnkCp004Evidence {
  if (prototypeId === 'RNK-CP004-PROT-MISSING-COMPARISON') {
    const missing = buildMissingComparisonEvidence(order, rng);
    return { entities: shuffled(order, rng), clues: missing.clues, query: missing.query };
  }

  const clues = buildCompleteClues(order, rng, hashText(order.join('|')));
  let query: RnkCp004Query;
  switch (prototypeId) {
    case 'RNK-CP004-PROT-HIGHEST-ENTITY':
      query = { kind: 'HIGHEST_ENTITY' };
      break;
    case 'RNK-CP004-PROT-LOWEST-ENTITY':
      query = { kind: 'LOWEST_ENTITY' };
      break;
    case 'RNK-CP004-PROT-ENTITY-AT-EXACT-RANK':
      query = { kind: 'ENTITY_AT_EXACT_RANK', rankFromTop: randomInt(rng, 2, order.length - 1) };
      break;
    case 'RNK-CP004-PROT-RANK-OF-NAMED-ENTITY':
      query = { kind: 'RANK_OF_NAMED_ENTITY', target: order[randomInt(rng, 0, order.length - 1)] };
      break;
    case 'RNK-CP004-PROT-MIDDLE-ENTITY':
      query = { kind: 'MIDDLE_ENTITY' };
      break;
    case 'RNK-CP004-PROT-COMPLETE-ORDER':
      query = { kind: 'COMPLETE_ORDER' };
      break;
    case 'RNK-CP004-PROT-RELATIVE-ORDER-OF-PAIR': {
      const firstIndex = randomInt(rng, 0, order.length - 2);
      const secondIndex = randomInt(rng, firstIndex + 1, order.length - 1);
      query = rng() < 0.5
        ? { kind: 'RELATIVE_ORDER_OF_PAIR', first: order[secondIndex], second: order[firstIndex] }
        : { kind: 'RELATIVE_ORDER_OF_PAIR', first: order[firstIndex], second: order[secondIndex] };
      break;
    }
    case 'RNK-CP004-PROT-IMMEDIATE-NEIGHBOUR': {
      const targetIndex = randomInt(rng, 1, order.length - 2);
      query = { kind: 'IMMEDIATE_NEIGHBOUR', target: order[targetIndex], direction: rng() < 0.5 ? 'ABOVE' : 'BELOW' };
      break;
    }
    case 'RNK-CP004-PROT-VALID-RANK-STATEMENT':
      query = { kind: 'VALID_RANK_STATEMENT', candidates: candidateStatements(order, rng) };
      break;
  }
  return { entities: shuffled(order, rng), clues, query };
}

function renderClue(clue: RnkCp004Comparison, index: number): string {
  if (index % 3 === 0) return `${clue.higher} is ranked above ${clue.lower}`;
  if (index % 3 === 1) return `${clue.lower} is ranked below ${clue.higher}`;
  return `${clue.higher} has a higher rank than ${clue.lower}`;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function queryText(query: RnkCp004Query): string {
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'Who is ranked highest?';
    case 'LOWEST_ENTITY': return 'Who is ranked lowest?';
    case 'ENTITY_AT_EXACT_RANK': return `Who is ranked ${ordinal(query.rankFromTop)} from the top?`;
    case 'RANK_OF_NAMED_ENTITY': return `What is ${query.target}'s rank from the top?`;
    case 'MIDDLE_ENTITY': return 'Who occupies the middle position?';
    case 'COMPLETE_ORDER': return 'Which option gives the complete order from highest to lowest?';
    case 'RELATIVE_ORDER_OF_PAIR': return `Which statement correctly compares ${query.first} and ${query.second}?`;
    case 'IMMEDIATE_NEIGHBOUR': return `Who is ranked immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`;
    case 'VALID_RANK_STATEMENT': return 'Which of the following statements is correct?';
    case 'MISSING_COMPARISON': return 'Which additional comparison is sufficient to determine one complete ranking?';
  }
}

function formatAnswer(key: string, semantic: RnkCp004AnswerSemantic): string {
  if (semantic === 'ORDER') return orderLabel(key);
  if (semantic === 'RELATION') return relationLabel(key);
  return key;
}

interface DistractorCandidate {
  readonly key: string;
  readonly misconceptionId: string;
  readonly explanation: string;
}

function entityDistractors(order: readonly string[], answerKey: string): DistractorCandidate[] {
  const answerIndex = order.indexOf(answerKey);
  const candidates: DistractorCandidate[] = [];
  const add = (key: string, misconceptionId: string, explanation: string): void => {
    if (key !== answerKey && !candidates.some((candidate) => candidate.key === key)) candidates.push({ key, misconceptionId, explanation });
  };
  add(order[0], 'CHOSE_HIGHEST_ENDPOINT', `${order[0]} is the highest endpoint, not the requested position`);
  add(order[order.length - 1], 'CHOSE_LOWEST_ENDPOINT', `${order[order.length - 1]} is the lowest endpoint, not the requested position`);
  if (answerIndex > 0) add(order[answerIndex - 1], 'OFF_BY_ONE_ABOVE', `${order[answerIndex - 1]} is one place above the required position`);
  if (answerIndex >= 0 && answerIndex < order.length - 1) add(order[answerIndex + 1], 'OFF_BY_ONE_BELOW', `${order[answerIndex + 1]} is one place below the required position`);
  for (const entity of order) add(entity, 'USED_WRONG_CHAIN_POSITION', `${entity} occupies a different position in the reconstructed chain`);
  return candidates.slice(0, 3);
}

function rankDistractors(order: readonly string[], answerKey: string): DistractorCandidate[] {
  const answer = Number(answerKey);
  const candidates: DistractorCandidate[] = [];
  const add = (value: number, misconceptionId: string, explanation: string): void => {
    const key = String(value);
    if (value >= 1 && value <= order.length && key !== answerKey && !candidates.some((candidate) => candidate.key === key)) {
      candidates.push({ key, misconceptionId, explanation });
    }
  };
  add(order.length - answer + 1, 'COUNTED_FROM_BOTTOM', 'This is the opposite-end rank, not the rank from the top');
  add(answer - 1, 'OFF_BY_ONE_ABOVE', 'This places the target one position too high');
  add(answer + 1, 'OFF_BY_ONE_BELOW', 'This places the target one position too low');
  for (let value = 1; value <= order.length; value += 1) add(value, 'USED_WRONG_CHAIN_POSITION', 'This rank belongs to another position in the chain');
  return candidates.slice(0, 3);
}

function orderDistractors(order: readonly string[], answerKey: string): DistractorCandidate[] {
  const candidates: DistractorCandidate[] = [];
  const add = (candidateOrder: readonly string[], misconceptionId: string, explanation: string): void => {
    const key = orderKey(candidateOrder);
    if (key !== answerKey && !candidates.some((candidate) => candidate.key === key)) candidates.push({ key, misconceptionId, explanation });
  };
  add([...order].reverse(), 'REVERSED_COMPLETE_ORDER', 'This reverses the highest-to-lowest direction');
  const swapped = [...order];
  const swapIndex = Math.max(0, Math.min(order.length - 2, Math.floor(order.length / 2) - 1));
  [swapped[swapIndex], swapped[swapIndex + 1]] = [swapped[swapIndex + 1], swapped[swapIndex]];
  add(swapped, 'SWAPPED_ADJACENT_ENTITIES', 'This breaks one direct comparison in the chain');
  add([...order.slice(1), order[0]], 'ROTATED_ORDER', 'This treats a linear ranking as if it were circular');
  const endpointSwap = [...order];
  [endpointSwap[0], endpointSwap[endpointSwap.length - 1]] = [endpointSwap[endpointSwap.length - 1], endpointSwap[0]];
  add(endpointSwap, 'SWAPPED_ENDPOINTS', 'This exchanges the highest and lowest entities');
  return candidates.slice(0, 3);
}

function relationDistractors(evidence: RnkCp004Evidence, answerKey: string): DistractorCandidate[] {
  const [higher, lower] = answerKey.split('>');
  const candidates: DistractorCandidate[] = [
    { key: `${lower}>${higher}`, misconceptionId: 'REVERSED_RELATION', explanation: `This reverses the reconstructed relation between ${higher} and ${lower}` },
  ];
  const pool = evidence.query.kind === 'VALID_RANK_STATEMENT' || evidence.query.kind === 'MISSING_COMPARISON'
    ? evidence.query.candidates
    : evidence.clues;
  for (const candidate of pool) {
    const key = relationKey(candidate);
    if (key !== answerKey && !candidates.some((existing) => existing.key === key)) {
      candidates.push({ key, misconceptionId: 'USED_UNSUPPORTED_COMPARISON', explanation: `${relationLabel(key)} does not satisfy the requested condition` });
    }
  }
  for (let first = 0; first < evidence.entities.length; first += 1) {
    for (let second = first + 1; second < evidence.entities.length; second += 1) {
      const key = `${evidence.entities[second]}>${evidence.entities[first]}`;
      if (key !== answerKey && !candidates.some((existing) => existing.key === key)) {
        candidates.push({ key, misconceptionId: 'ASSUMED_UNSTATED_COMPARISON', explanation: `${relationLabel(key)} contradicts or fails to complete the displayed chain` });
      }
      if (candidates.length >= 3) return candidates.slice(0, 3);
    }
  }
  return candidates.slice(0, 3);
}

function buildOptions(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  semantic: RnkCp004AnswerSemantic,
  correctIndex: number,
): readonly RnkCp004Option[] {
  const distractors = semantic === 'ENTITY'
    ? entityDistractors(order, answerKey)
    : semantic === 'RANK'
      ? rankDistractors(order, answerKey)
      : semantic === 'ORDER'
        ? orderDistractors(order, answerKey)
        : relationDistractors(evidence, answerKey);
  if (distractors.length !== 3) throw new Error(`Expected three distractors, found ${distractors.length}`);
  const correct: RnkCp004Option = {
    answerKey,
    label: formatAnswer(answerKey, semantic),
    misconceptionId: 'CORRECT',
    explanation: 'This follows the complete reconstructed order and answers the exact query',
  };
  const wrong = distractors.map((candidate) => ({
    answerKey: candidate.key,
    label: formatAnswer(candidate.key, semantic),
    misconceptionId: candidate.misconceptionId,
    explanation: candidate.explanation,
  }));
  const options: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push(correct);
    else options.push(wrong[wrongIndex++]);
  }
  return options;
}

function difficultyFor(evidence: RnkCp004Evidence): RnkCp004Difficulty {
  if (evidence.query.kind === 'COMPLETE_ORDER' || evidence.query.kind === 'MISSING_COMPARISON') return 'HARD';
  if (evidence.entities.length >= 7 || evidence.query.kind === 'VALID_RANK_STATEMENT' || evidence.query.kind === 'RANK_OF_NAMED_ENTITY') return 'MEDIUM';
  return 'EASY';
}

function explanationFor(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answer: string,
): RnkCp004Question['explanation'] {
  const chain = order.join(' > ');
  const query = evidence.query;
  let queryStep: string;
  if (query.kind === 'HIGHEST_ENTITY') queryStep = `The first person in the chain is ${order[0]}.`;
  else if (query.kind === 'LOWEST_ENTITY') queryStep = `The last person in the chain is ${order[order.length - 1]}.`;
  else if (query.kind === 'ENTITY_AT_EXACT_RANK') queryStep = `Counting from the left, position ${query.rankFromTop} is occupied by ${order[query.rankFromTop - 1]}.`;
  else if (query.kind === 'RANK_OF_NAMED_ENTITY') queryStep = `${query.target} appears at position ${order.indexOf(query.target) + 1} from the top.`;
  else if (query.kind === 'MIDDLE_ENTITY') queryStep = `There are ${order.length} people, so the middle position is ${(order.length + 1) / 2}, occupied by ${order[(order.length - 1) / 2]}.`;
  else if (query.kind === 'COMPLETE_ORDER') queryStep = 'The required highest-to-lowest order is the full chain itself.';
  else if (query.kind === 'RELATIVE_ORDER_OF_PAIR') queryStep = 'The name appearing earlier in the chain is ranked above the name appearing later.';
  else if (query.kind === 'IMMEDIATE_NEIGHBOUR') queryStep = `The required person is directly ${query.direction === 'ABOVE' ? 'before' : 'after'} ${query.target} in the chain.`;
  else if (query.kind === 'VALID_RANK_STATEMENT') queryStep = `Test each option against the chain; only ${answer} agrees with it.`;
  else queryStep = `Adding ${answer} joins the two displayed blocks into one unique chain.`;

  return {
    mentalPicture: 'Write every comparison as an arrow from the higher-ranked person to the lower-ranked person, then join the arrows into one line.',
    keyRule: 'For an exact ranking question, the displayed comparisons must produce one cycle-free order. Read the answer directly from that order.',
    stepByStepSolution: [
      'Convert each clue into a higher-to-lower arrow.',
      `Joining all compatible arrows gives: ${chain}.`,
      queryStep,
      `Therefore, the required answer is ${answer}.`,
    ],
    examSpeedShortcut: 'Start with the person who has nobody above them, extend the chain one comparison at a time, and answer only after the full line is stable.',
    optionAnalysis: [],
    conclusion: `Therefore, the correct answer is ${answer}.`,
  };
}

function fingerprintFor(evidence: RnkCp004Evidence): string {
  const clueKeys = evidence.clues.map(relationKey).sort();
  const query = evidence.query.kind === 'VALID_RANK_STATEMENT' || evidence.query.kind === 'MISSING_COMPARISON'
    ? { ...evidence.query, candidates: evidence.query.candidates.map(relationKey).sort() }
    : evidence.query;
  return `${evidence.entities.length}:${clueKeys.join(',')}:${JSON.stringify(query)}`;
}

export function generateRnkCp004Question(prototypeId: RnkCp004PrototypeId, seed: number): RnkCp004Question {
  const rng = createRng(prototypeId, seed);
  const hiddenOrder = buildHiddenOrder(prototypeId, rng, seed);
  const evidence = buildEvidence(prototypeId, hiddenOrder, rng);
  const answerSemantic = answerSemanticFor(evidence.query);
  const answerKey = solveCp004Independently(evidence);
  const solvedOrder = evidence.query.kind === 'MISSING_COMPARISON'
    ? reconstructUniqueOrder(evidence.entities, [...evidence.clues, evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey)!])
    : reconstructUniqueOrder(evidence.entities, evidence.clues);
  if (orderKey(solvedOrder) !== orderKey(hiddenOrder)) throw new Error(`Independent order mismatch at ${prototypeId}:${seed}`);
  const answer = formatAnswer(answerKey, answerSemantic);
  const correctIndex = hashText(`${prototypeId}:correct:${seed}`) % 4;
  const options = buildOptions(evidence, solvedOrder, answerKey, answerSemantic, correctIndex);
  const teaching = explanationFor(evidence, solvedOrder, answer);
  const clueText = evidence.clues.map((clue, index) => `${index + 1}. ${renderClue(clue, index)}.`).join(' ');
  const candidateText = evidence.query.kind === 'VALID_RANK_STATEMENT' || evidence.query.kind === 'MISSING_COMPARISON'
    ? ' Consider the answer choices as the proposed comparisons.'
    : '';
  const stem = `In a ranking of ${evidence.entities.length} people, the following comparisons are known: ${clueText}${candidateText} ${queryText(evidence.query)}`;
  const explanation = {
    ...teaching,
    optionAnalysis: options.map((option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`),
  };

  return {
    packageId: 'RNK-001',
    checkpointId: 'RNK-CP-004',
    prototypeId,
    permanentQlId: null,
    seed,
    locale: 'en-IN',
    stem,
    displayedEvidence: evidence,
    answerSemantic,
    answerKey,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(evidence),
    explanation,
    mathematicalFingerprint: fingerprintFor(evidence),
    lifecycle: {
      reviewStatus: 'UNREVIEWED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  };
}
