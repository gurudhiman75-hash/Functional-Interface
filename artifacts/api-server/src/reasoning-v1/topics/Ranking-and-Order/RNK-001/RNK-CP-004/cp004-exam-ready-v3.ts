import {
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
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV2,
  type RnkCp004ExamReadyQuestion as RnkCp004V1Question,
} from './cp004-exam-ready-v2';

export { countTopologicalOrders } from './cp004-exam-ready-v2';

export type RnkCp004ExplanationMode =
  | 'ENDPOINT_MINIMAL'
  | 'POSITION_LINE'
  | 'PAIR_PATH'
  | 'NEIGHBOUR_HIGHLIGHT'
  | 'OPTION_CONTRADICTION'
  | 'TRANSITIVE_PROOF'
  | 'BLOCK_BRIDGE';

export interface RnkCp004VisibleExplanation {
  readonly mode: RnkCp004ExplanationMode;
  readonly lines: readonly string[];
  readonly optionAnalysis?: readonly string[];
  readonly answer: string;
}

export interface RnkCp004ReasoningFeatures {
  readonly entityCount: number;
  readonly essentialClueCount: number;
  readonly redundantClueCount: number;
  readonly shortestProofClueCount: number;
  readonly disconnectedBlockCount: number;
  readonly featureScore: number;
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004V1Question,
  | 'stem'
  | 'displayedEvidence'
  | 'answer'
  | 'options'
  | 'correctIndex'
  | 'difficulty'
  | 'explanation'
  | 'mathematicalFingerprint'
  | 'reviewMetadata'
> & {
  readonly stem: string;
  readonly displayedEvidence: RnkCp004Evidence;
  readonly answer: string;
  readonly options: readonly RnkCp004Option[];
  readonly correctIndex: number;
  readonly difficulty: RnkCp004Difficulty;
  readonly explanation: RnkCp004V1Question['explanation'];
  readonly visibleExplanation: RnkCp004VisibleExplanation;
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: Omit<RnkCp004V1Question['reviewMetadata'], 'generationVersion'> & {
    readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V2';
    readonly explanationMode: RnkCp004ExplanationMode;
    readonly normalizedSemanticFingerprint: string;
    readonly reasoningFeatures: RnkCp004ReasoningFeatures;
    readonly validatorBaseOrderCount: number | null;
  };
};

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
}

function indexMap(order: readonly string[]): ReadonlyMap<string, number> {
  return new Map(order.map((entity, index) => [entity, index]));
}

function solvedOrder(evidence: RnkCp004Evidence, answerKey: string): readonly string[] {
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === answerKey);
  if (!bridge) throw new Error('Missing comparison answer is absent from candidates');
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function isUnique(entities: readonly string[], clues: readonly RnkCp004Comparison[]): boolean {
  try {
    reconstructUniqueOrder(entities, clues);
    return true;
  } catch {
    return false;
  }
}

function redundantClueCount(evidence: RnkCp004Evidence): number {
  if (evidence.query.kind === 'MISSING_COMPARISON') return 0;
  return evidence.clues.filter((_, index) =>
    isUnique(evidence.entities, evidence.clues.filter((__, other) => other !== index)),
  ).length;
}

function reduceRedundantClues(evidence: RnkCp004Evidence): RnkCp004Evidence {
  if (evidence.query.kind === 'MISSING_COMPARISON') return evidence;
  const budget = evidence.query.kind === 'COMPLETE_ORDER' || evidence.query.kind === 'VALID_RANK_STATEMENT' ? 1 : 0;
  const clues = [...evidence.clues];
  while (true) {
    const removable = clues
      .map((_, index) => index)
      .filter((index) => isUnique(evidence.entities, clues.filter((_, other) => other !== index)));
    if (removable.length <= budget) break;
    clues.splice(removable[removable.length - 1], 1);
  }
  return { ...evidence, clues };
}

function shortestPath(
  clues: readonly RnkCp004Comparison[],
  start: string,
  end: string,
): readonly string[] | null {
  const outgoing = new Map<string, string[]>();
  for (const clue of clues) {
    const next = outgoing.get(clue.higher) ?? [];
    next.push(clue.lower);
    outgoing.set(clue.higher, next);
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
  return blocks.sort((left, right) => left.join('|').localeCompare(right.join('|')));
}

function setupText(entityCount: number, seed: number): string {
  const variants = [
    `${entityCount} candidates have distinct ranks from highest to lowest.`,
    `A ranking list contains ${entityCount} candidates, with rank 1 as the highest.`,
    `${entityCount} people occupy different positions in a ranking from highest to lowest.`,
    `The following ${entityCount} candidates are placed in a strict highest-to-lowest order.`,
  ];
  return variants[hashText(`setup:${seed}:${entityCount}`) % variants.length];
}

function renderClue(clue: RnkCp004Comparison, index: number, seed: number): string {
  const variant = hashText(`clue:${seed}:${index}:${relationKey(clue)}`) % 4;
  if (variant === 0) return `${clue.higher} ranks above ${clue.lower}.`;
  if (variant === 1) return `${clue.lower} is below ${clue.higher} in the ranking.`;
  if (variant === 2) return `${clue.higher} has a higher position than ${clue.lower}.`;
  return `${clue.higher} is placed ahead of ${clue.lower}.`;
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
    case 'HIGHEST_ENTITY': return 'Who ranks highest?';
    case 'LOWEST_ENTITY': return 'Who ranks lowest?';
    case 'ENTITY_AT_EXACT_RANK': return `Who is ${ordinal(query.rankFromTop)} from the top?`;
    case 'RANK_OF_NAMED_ENTITY': return `What is ${query.target}’s rank from the top?`;
    case 'MIDDLE_ENTITY': return 'Who occupies the middle position?';
    case 'COMPLETE_ORDER': return 'Which option gives the correct complete order from highest to lowest?';
    case 'RELATIVE_ORDER_OF_PAIR': return `Which option correctly describes the positions of ${query.first} and ${query.second}?`;
    case 'IMMEDIATE_NEIGHBOUR': return `Who ranks immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`;
    case 'VALID_RANK_STATEMENT': return 'Which conclusion can be derived from two or more of the statements?';
    case 'MISSING_COMPARISON': return 'Which additional statement joins the blocks into one unique complete order?';
  }
}

function stemFor(evidence: RnkCp004Evidence, seed: number): string {
  return `${setupText(evidence.entities.length, seed)}\n\n${evidence.clues
    .map((clue, index) => `- ${renderClue(clue, index, seed)}`)
    .join('\n')}\n\n${queryText(evidence.query)}`;
}

interface OptionCandidate {
  readonly key: string;
  readonly label: string;
  readonly misconceptionId: string;
  readonly explanation: string;
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

function positionDescription(entity: string, order: readonly string[]): string {
  return `${entity} is ${ordinal(order.indexOf(entity) + 1)} from the top`;
}

function factualEntityOptions(
  base: RnkCp004V1Question,
  evidence: RnkCp004Evidence,
  order: readonly string[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind === 'IMMEDIATE_NEIGHBOUR') {
    const targetIndex = order.indexOf(evidence.query.target);
    const answerIndex = evidence.query.direction === 'ABOVE' ? targetIndex - 1 : targetIndex + 1;
    const answer = order[answerIndex];
    const candidateIndexes = [
      evidence.query.direction === 'ABOVE' ? targetIndex + 1 : targetIndex - 1,
      evidence.query.direction === 'ABOVE' ? targetIndex - 2 : targetIndex + 2,
      evidence.query.direction === 'ABOVE' ? targetIndex + 2 : targetIndex - 2,
      0,
      order.length - 1,
    ];
    const wrongEntities: string[] = [];
    for (const index of candidateIndexes) {
      if (index < 0 || index >= order.length) continue;
      const entity = order[index];
      if (entity !== answer && entity !== evidence.query.target && !wrongEntities.includes(entity)) wrongEntities.push(entity);
      if (wrongEntities.length === 3) break;
    }
    const describe = (entity: string): string => {
      const difference = order.indexOf(entity) - targetIndex;
      const distance = Math.abs(difference);
      const direction = difference < 0 ? 'above' : 'below';
      return `${entity} is ${distance} position${distance === 1 ? '' : 's'} ${direction} ${evidence.query.target}, so it is not immediately ${evidence.query.direction.toLowerCase()} the target`;
    };
    return placeOptions(
      { key: answer, label: answer, misconceptionId: 'CORRECT', explanation: `${answer} is directly ${evidence.query.direction.toLowerCase()} ${evidence.query.target}` },
      wrongEntities.map((entity) => ({ key: entity, label: entity, misconceptionId: 'NOT_REQUESTED_ADJACENT_POSITION', explanation: describe(entity) })),
      correctIndex,
    );
  }

  const correct = base.answerKey;
  const wrong = base.options
    .filter((option) => option.answerKey !== correct)
    .slice(0, 3)
    .map((option): OptionCandidate => ({
      key: option.answerKey,
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: `${positionDescription(option.answerKey, order)}; ${positionDescription(correct, order).replace(correct, 'the correct person')}`,
    }));
  return placeOptions(
    { key: correct, label: base.answer, misconceptionId: 'CORRECT', explanation: positionDescription(correct, order) },
    wrong,
    correctIndex,
  );
}

function factualRankOptions(
  base: RnkCp004V1Question,
  evidence: RnkCp004Evidence,
  order: readonly string[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'RANK_OF_NAMED_ENTITY') return base.options;
  const actual = order.indexOf(evidence.query.target) + 1;
  const wrong = base.options
    .filter((option) => option.answerKey !== base.answerKey)
    .slice(0, 3)
    .map((option): OptionCandidate => ({
      key: option.answerKey,
      label: option.label,
      misconceptionId: option.misconceptionId,
      explanation: `${evidence.query.target} is not at position ${option.answerKey}; the order places the target at position ${actual}`,
    }));
  return placeOptions(
    { key: base.answerKey, label: base.answer, misconceptionId: 'CORRECT', explanation: `${evidence.query.target} is at position ${actual} from the top` },
    wrong,
    correctIndex,
  );
}

function pairOptions(
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
  const distance = Math.abs(firstIndex - secondIndex);
  const direction = firstIndex < secondIndex ? 'above' : 'below';
  const opposite = direction === 'above' ? 'below' : 'above';
  const correctLabel = `${first} ranks ${distance} positions ${direction} ${second}`;
  return placeOptions(
    { key: answerKey, label: correctLabel, misconceptionId: 'CORRECT', explanation: `${first} is at position ${firstIndex + 1} and ${second} is at position ${secondIndex + 1}` },
    [
      { key: `PAIR:${first}|${second}|${opposite}|${distance}`, label: `${first} ranks ${distance} positions ${opposite} ${second}`, misconceptionId: 'RELATION_REVERSED', explanation: `This reverses their order; ${first} is position ${firstIndex + 1} and ${second} is position ${secondIndex + 1}` },
      { key: `PAIR:${first}|${second}|${direction}|${distance - 1}`, label: `${first} ranks ${distance - 1} position${distance - 1 === 1 ? '' : 's'} ${direction} ${second}`, misconceptionId: 'DISTANCE_OFF_BY_ONE', explanation: `Their positions differ by ${distance}, not ${distance - 1}` },
      { key: `PAIR:${first}|${second}|${direction}|${distance + 1}`, label: `${first} ranks ${distance + 1} positions ${direction} ${second}`, misconceptionId: 'DISTANCE_OFF_BY_ONE', explanation: `Their positions differ by ${distance}, not ${distance + 1}` },
    ],
    correctIndex,
  );
}

function conclusionOptions(
  base: RnkCp004V1Question,
  evidence: RnkCp004Evidence,
  order: readonly string[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'VALID_RANK_STATEMENT') throw new Error('Expected conclusion query');
  const positions = indexMap(order);
  const correct = evidence.query.candidates.find((candidate) => relationKey(candidate) === base.answerKey)!;
  const wrong = evidence.query.candidates
    .filter((candidate) => relationKey(candidate) !== base.answerKey)
    .map((candidate): OptionCandidate => ({
      key: relationKey(candidate),
      label: relationLabel(relationKey(candidate)),
      misconceptionId: 'RELATION_REVERSED',
      explanation: `${candidate.higher} is ${ordinal(positions.get(candidate.higher)! + 1)}, while ${candidate.lower} is ${ordinal(positions.get(candidate.lower)! + 1)}; the proposed direction is reversed`,
    }));
  return placeOptions(
    { key: base.answerKey, label: relationLabel(base.answerKey), misconceptionId: 'CORRECT', explanation: `The comparison path places ${correct.higher} above ${correct.lower}` },
    wrong,
    correctIndex,
  );
}

function missingOptions(
  base: RnkCp004V1Question,
  evidence: RnkCp004Evidence,
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind !== 'MISSING_COMPARISON') throw new Error('Expected missing comparison query');
  const correct = evidence.query.candidates.find((candidate) => relationKey(candidate) === base.answerKey)!;
  const wrong = evidence.query.candidates
    .filter((candidate) => relationKey(candidate) !== base.answerKey)
    .map((candidate): OptionCandidate => {
      const count = countTopologicalOrders(evidence.entities, [...evidence.clues, candidate]);
      return {
        key: relationKey(candidate),
        label: relationLabel(relationKey(candidate)),
        misconceptionId: count === 0 ? 'CONTRADICTS_BASE_ORDER' : 'TRUE_BUT_INSUFFICIENT',
        explanation: count === 0
          ? 'This contradicts one of the fixed blocks, so no valid complete order remains'
          : 'This still leaves more than one way to place the two blocks, so the order is not unique',
      };
    });
  return placeOptions(
    { key: base.answerKey, label: relationLabel(base.answerKey), misconceptionId: 'CORRECT', explanation: `${correct.higher} is the open end of the upper block and ${correct.lower} is the open start of the lower block` },
    wrong,
    correctIndex,
  );
}

function reviewedOptions(
  base: RnkCp004V1Question,
  evidence: RnkCp004Evidence,
  order: readonly string[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (evidence.query.kind === 'RELATIVE_ORDER_OF_PAIR') return pairOptions(evidence, order, base.answerKey, correctIndex);
  if (evidence.query.kind === 'VALID_RANK_STATEMENT') return conclusionOptions(base, evidence, order, correctIndex);
  if (evidence.query.kind === 'MISSING_COMPARISON') return missingOptions(base, evidence, correctIndex);
  if (base.answerSemantic === 'ENTITY') return factualEntityOptions(base, evidence, order, correctIndex);
  if (base.answerSemantic === 'RANK') return factualRankOptions(base, evidence, order, correctIndex);
  return base.options.map((option) => ({ ...option }));
}

function answerText(base: RnkCp004V1Question, options: readonly RnkCp004Option[], correctIndex: number): string {
  return options[correctIndex]?.label ?? base.answer;
}

function visibleExplanationFor(
  evidence: RnkCp004Evidence,
  order: readonly string[],
  answerKey: string,
  answer: string,
  options: readonly RnkCp004Option[],
): RnkCp004VisibleExplanation {
  const query = evidence.query;
  const chain = order.join(' > ');
  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    const endpoint = query.kind === 'HIGHEST_ENTITY' ? order[0] : order[order.length - 1];
    return {
      mode: 'ENDPOINT_MINIMAL',
      lines: [chain, `${endpoint} is at the ${query.kind === 'HIGHEST_ENTITY' ? 'start' : 'end'} of the chain, so ${endpoint} ranks ${query.kind === 'HIGHEST_ENTITY' ? 'highest' : 'lowest'}.`],
      answer,
    };
  }
  if (query.kind === 'ENTITY_AT_EXACT_RANK' || query.kind === 'RANK_OF_NAMED_ENTITY' || query.kind === 'MIDDLE_ENTITY') {
    const numbered = order.map((entity, index) => `${index + 1}. ${entity}`).join('  |  ');
    let extraction: string;
    if (query.kind === 'ENTITY_AT_EXACT_RANK') extraction = `${order[query.rankFromTop - 1]} is at position ${query.rankFromTop}.`;
    else if (query.kind === 'RANK_OF_NAMED_ENTITY') extraction = `${query.target} is at position ${order.indexOf(query.target) + 1} from the top.`;
    else extraction = `${order[(order.length - 1) / 2]} occupies the middle position ${(order.length + 1) / 2}.`;
    return { mode: 'POSITION_LINE', lines: [numbered, extraction], answer };
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const [higher, lower] = answerKey.split('>');
    const path = shortestPath(evidence.clues, higher, lower);
    return { mode: 'PAIR_PATH', lines: [`Decisive path: ${path?.join(' > ') ?? chain}`, answer], answer };
  }
  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    const target = order.indexOf(query.target);
    const start = Math.max(0, target - 2);
    const end = Math.min(order.length, target + 3);
    return { mode: 'NEIGHBOUR_HIGHLIGHT', lines: [`Local order: ${order.slice(start, end).join(' > ')}`, `${answer} is directly ${query.direction.toLowerCase()} ${query.target}.`], answer };
  }
  if (query.kind === 'COMPLETE_ORDER') {
    return {
      mode: 'OPTION_CONTRADICTION',
      lines: [`Complete order: ${chain}`],
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
        `Path: ${path?.join(' > ') ?? chain}`,
        `A conclusion may follow directly from one clue or indirectly through a valid path. Here, the path proves that ${higher} ranks above ${lower}.`,
      ],
      answer,
    };
  }
  const blocks = connectedBlocks(evidence);
  const bridge = query.candidates.find((candidate) => relationKey(candidate) === answerKey)!;
  return {
    mode: 'BLOCK_BRIDGE',
    lines: [
      `Fixed blocks: ${blocks.map((block) => block.join(' > ')).join('  |  ')}`,
      `Bridge the bottom of the upper block to the top of the lower block: ${relationLabel(answerKey)}.`,
      `Unique order: ${chain}`,
    ],
    optionAnalysis: options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.answerKey !== answerKey)
      .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`),
    answer,
  };
}

function internalExplanation(
  visible: RnkCp004VisibleExplanation,
  options: readonly RnkCp004Option[],
): RnkCp004V1Question['explanation'] {
  return {
    mentalPicture: `Internal proof mode: ${visible.mode}`,
    keyRule: 'Proof data is stored structurally; the student renderer displays only the reasoning needed for this item.',
    stepByStepSolution: [...visible.lines],
    examSpeedShortcut: '',
    optionAnalysis: options.map((option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`),
    conclusion: `Answer: ${visible.answer}.`,
  };
}

function reasoningFeatures(evidence: RnkCp004Evidence, order: readonly string[]): RnkCp004ReasoningFeatures {
  const redundant = redundantClueCount(evidence);
  const essential = evidence.clues.length - redundant;
  let shortestProof = essential;
  if (evidence.query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const positions = indexMap(order);
    const higher = positions.get(evidence.query.first)! < positions.get(evidence.query.second)!
      ? evidence.query.first
      : evidence.query.second;
    const lower = higher === evidence.query.first ? evidence.query.second : evidence.query.first;
    shortestProof = Math.max(1, (shortestPath(evidence.clues, higher, lower)?.length ?? 2) - 1);
  } else if (evidence.query.kind === 'VALID_RANK_STATEMENT') {
    const answer = solveCp004Independently(evidence).split('>');
    shortestProof = Math.max(1, (shortestPath(evidence.clues, answer[0], answer[1])?.length ?? 2) - 1);
  } else if (evidence.query.kind === 'IMMEDIATE_NEIGHBOUR') {
    shortestProof = 1;
  }
  const blocks = evidence.query.kind === 'MISSING_COMPARISON' ? connectedBlocks(evidence).length : 1;
  const queryWeight: Record<RnkCp004Query['kind'], number> = {
    HIGHEST_ENTITY: 0,
    LOWEST_ENTITY: 0,
    ENTITY_AT_EXACT_RANK: 1,
    RANK_OF_NAMED_ENTITY: 1,
    MIDDLE_ENTITY: 1,
    COMPLETE_ORDER: 3,
    RELATIVE_ORDER_OF_PAIR: 2,
    IMMEDIATE_NEIGHBOUR: 2,
    VALID_RANK_STATEMENT: 3,
    MISSING_COMPARISON: 5,
  };
  const featureScore = (evidence.entities.length - 5) + essential + redundant + shortestProof + queryWeight[evidence.query.kind] + (blocks - 1) * 2;
  return {
    entityCount: evidence.entities.length,
    essentialClueCount: essential,
    redundantClueCount: redundant,
    shortestProofClueCount: shortestProof,
    disconnectedBlockCount: blocks,
    featureScore,
  };
}

function difficultyFor(features: RnkCp004ReasoningFeatures): RnkCp004Difficulty {
  if (features.featureScore <= 8) return 'EASY';
  if (features.featureScore <= 14) return 'MEDIUM';
  return 'HARD';
}

function normalizedQuery(evidence: RnkCp004Evidence, order: readonly string[]): string {
  const positions = indexMap(order);
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
): string {
  const positions = indexMap(order);
  const clues = evidence.clues
    .map((clue) => `${positions.get(clue.higher)}>${positions.get(clue.lower)}`)
    .sort()
    .join(',');
  const roles = options.map((option) => option.misconceptionId).sort().join(',');
  return `${evidence.entities.length}|${clues}|${normalizedQuery(evidence, order)}|${roles}`;
}

function mathematicalFingerprint(evidence: RnkCp004Evidence, normalized: string): string {
  return `${evidence.clues.map(relationKey).sort().join(',')}:${normalized}:ENGLISH_REMODEL_V2`;
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV2(prototypeId, seed);
  const evidence = reduceRedundantClues(base.displayedEvidence);
  const answerKey = solveCp004Independently(evidence);
  if (answerKey !== base.answerKey) throw new Error(`V2 answer changed during clue reduction at ${prototypeId}:${seed}`);
  const order = solvedOrder(evidence, answerKey);
  const correctIndex = correctIndexOverride ?? base.correctIndex;
  const options = reviewedOptions(base, evidence, order, correctIndex);
  const answer = answerText(base, options, correctIndex);
  const visibleExplanation = visibleExplanationFor(evidence, order, answerKey, answer, options);
  const features = reasoningFeatures(evidence, order);
  const normalized = normalizedFingerprint(evidence, order, options);
  const baseCount = evidence.query.kind === 'MISSING_COMPARISON'
    ? countTopologicalOrders(evidence.entities, evidence.clues)
    : null;

  return {
    ...base,
    stem: stemFor(evidence, seed),
    displayedEvidence: evidence,
    answerKey,
    answer,
    options,
    correctIndex,
    difficulty: difficultyFor(features),
    explanation: internalExplanation(visibleExplanation, options),
    visibleExplanation,
    mathematicalFingerprint: mathematicalFingerprint(evidence, normalized),
    reviewMetadata: {
      ...base.reviewMetadata,
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V2',
      explanationMode: visibleExplanation.mode,
      normalizedSemanticFingerprint: normalized,
      reasoningFeatures: features,
      validatorBaseOrderCount: baseCount,
    },
  };
}
