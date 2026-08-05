import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
  type RnkCp004Evidence,
  type RnkCp004Option,
  type RnkCp004Query,
} from './cp004-foundation';
import {
  countTopologicalOrders,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V3_PROTOTYPE_IDS,
  generateRnkCp004ExamReadyQuestion as generateV3,
  type RnkCp004ExamReadyQuestion as RnkCp004V3Question,
  type RnkCp004RemodelV3PrototypeId,
} from './cp004-exam-ready-v5';

export { countTopologicalOrders } from './cp004-exam-ready-v5';

export const RNK_CP004_REMODEL_V4_PROTOTYPE_IDS = RNK_CP004_REMODEL_V3_PROTOTYPE_IDS;
export type RnkCp004RemodelV4PrototypeId = RnkCp004RemodelV3PrototypeId;

export type RnkCp004ProofRole =
  | 'ESSENTIAL_FOR_FULL_ORDER'
  | 'ESSENTIAL_FOR_BLOCK_ORDER'
  | 'CONFIRMATORY'
  | 'REDUNDANT_OTHER';

export type RnkCp004EdgeDistanceClass = 'ADJACENT' | 'NON_ADJACENT';

export interface RnkCp004ClueRoleRecord {
  readonly index: number;
  readonly clueKey: string;
  readonly edgeDistanceClass: RnkCp004EdgeDistanceClass;
  readonly proofRole: RnkCp004ProofRole;
}

export interface RnkCp004ClueRoleProfile {
  readonly statementCount: number;
  readonly essentialForFullOrder: number | null;
  readonly essentialForBlockOrder: number | null;
  readonly confirmatory: number;
  readonly redundantOther: number;
  readonly accountedStatementCount: number;
  readonly invariantSatisfied: boolean;
  readonly roles: readonly RnkCp004ClueRoleRecord[];
}

export interface RnkCp004CoreTopologyProfile {
  readonly transitiveReductionFamily: 'TOTAL_ORDER_CHAIN' | 'TWO_ORDERED_BLOCKS';
  readonly transitiveReductionEdgeCount: number;
  readonly addedEdgeProfile: 'NONE' | 'CONFIRMATORY_NON_ADJACENT' | 'CONFIRMATORY_MIXED';
  readonly adjacentDisplayedEdges: number;
  readonly nonAdjacentDisplayedEdges: number;
}

export interface RnkCp004DifficultyProfile {
  readonly shortestAnswerProofClues: number;
  readonly irrelevantClueCount: number;
  readonly taskWeight: number;
  readonly optionClosenessWeight: number;
  readonly entityWeight: number;
  readonly featureScore: number;
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004V3Question,
  'difficulty' | 'explanation' | 'visibleExplanation' | 'mathematicalFingerprint' | 'reviewMetadata'
> & {
  readonly difficulty: RnkCp004Difficulty;
  readonly explanation: RnkCp004V3Question['explanation'];
  readonly visibleExplanation: RnkCp004V3Question['visibleExplanation'] & {
    readonly optionAnalysisDisplay: 'COLLAPSED';
    readonly verificationNote?: string;
  };
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: Omit<RnkCp004V3Question['reviewMetadata'], 'generationVersion' | 'reasoningFeatures'> & {
    readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V4';
    readonly clueRoleProfile: RnkCp004ClueRoleProfile;
    readonly coreTopologyProfile: RnkCp004CoreTopologyProfile;
    readonly shortestAnswerProofClues: number;
    readonly difficultyProfile: RnkCp004DifficultyProfile;
    readonly reasoningFeatures: RnkCp004V3Question['reviewMetadata']['reasoningFeatures'];
  };
};

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
}

function indexMap(order: readonly string[]): ReadonlyMap<string, number> {
  return new Map(order.map((entity, index) => [entity, index]));
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

function minimumSubsetSize(
  evidence: RnkCp004Evidence,
  predicate: (clues: readonly RnkCp004Comparison[]) => boolean,
): number {
  const indexes = evidence.clues.map((_, index) => index);
  for (let size = 0; size <= indexes.length; size += 1) {
    for (const selected of combinations(indexes, size)) {
      const selectedSet = new Set(selected);
      const clues = evidence.clues.filter((_, index) => selectedSet.has(index));
      if (predicate(clues)) return size;
    }
  }
  return evidence.clues.length;
}

function allTopologicalOrdersSatisfy(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
  predicate: (order: readonly string[]) => boolean,
): boolean {
  const entityIndex = new Map(entities.map((entity, index) => [entity, index]));
  const prerequisites = Array.from({ length: entities.length }, () => 0);
  for (const clue of clues) {
    const higher = entityIndex.get(clue.higher);
    const lower = entityIndex.get(clue.lower);
    if (higher === undefined || lower === undefined || higher === lower) return false;
    prerequisites[lower] |= 1 << higher;
  }
  const fullMask = (1 << entities.length) - 1;
  let sawOrder = false;
  const visit = (mask: number, order: string[]): boolean => {
    if (mask === fullMask) {
      sawOrder = true;
      return predicate(order);
    }
    for (let index = 0; index < entities.length; index += 1) {
      const bit = 1 << index;
      if ((mask & bit) !== 0) continue;
      if ((prerequisites[index] & mask) !== prerequisites[index]) continue;
      order.push(entities[index]);
      if (!visit(mask | bit, order)) return false;
      order.pop();
    }
    return true;
  };
  return visit(0, []) && sawOrder;
}

function connectedComponents(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
): readonly (readonly string[])[] {
  const neighbours = new Map(entities.map((entity) => [entity, new Set<string>()]));
  for (const clue of clues) {
    neighbours.get(clue.higher)?.add(clue.lower);
    neighbours.get(clue.lower)?.add(clue.higher);
  }
  const unseen = new Set(entities);
  const components: string[][] = [];
  while (unseen.size > 0) {
    const first = unseen.values().next().value as string;
    const queue = [first];
    const component: string[] = [];
    unseen.delete(first);
    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);
      for (const neighbour of neighbours.get(current) ?? []) {
        if (unseen.delete(neighbour)) queue.push(neighbour);
      }
    }
    components.push(component);
  }
  return components;
}

function hasTwoUniquelyOrderedBlocks(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
): boolean {
  const components = connectedComponents(entities, clues);
  if (components.length !== 2) return false;
  return components.every((component) => {
    const set = new Set(component);
    const localClues = clues.filter((clue) => set.has(clue.higher) && set.has(clue.lower));
    return countTopologicalOrders(component, localClues) === 1;
  });
}

function solvedOrder(question: RnkCp004V3Question): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === question.answerKey);
  if (!bridge) throw new Error(`Missing bridge for ${question.reviewMetadata.stableQuestionId}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function edgeDistanceClass(
  evidence: RnkCp004Evidence,
  clue: RnkCp004Comparison,
  finalOrder: readonly string[],
): RnkCp004EdgeDistanceClass {
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    const positions = indexMap(finalOrder);
    return Math.abs(positions.get(clue.higher)! - positions.get(clue.lower)!) === 1
      ? 'ADJACENT'
      : 'NON_ADJACENT';
  }
  const component = connectedComponents(evidence.entities, evidence.clues)
    .find((values) => values.includes(clue.higher) && values.includes(clue.lower));
  if (!component) return 'NON_ADJACENT';
  const set = new Set(component);
  const localClues = evidence.clues.filter((item) => set.has(item.higher) && set.has(item.lower));
  const localOrder = reconstructUniqueOrder(component, localClues);
  return Math.abs(localOrder.indexOf(clue.higher) - localOrder.indexOf(clue.lower)) === 1
    ? 'ADJACENT'
    : 'NON_ADJACENT';
}

function clueRoleProfile(
  evidence: RnkCp004Evidence,
  finalOrder: readonly string[],
): RnkCp004ClueRoleProfile {
  const missing = evidence.query.kind === 'MISSING_COMPARISON';
  const roles = evidence.clues.map((clue, index): RnkCp004ClueRoleRecord => {
    const remaining = evidence.clues.filter((_, other) => other !== index);
    const remainsValid = missing
      ? hasTwoUniquelyOrderedBlocks(evidence.entities, remaining)
      : countTopologicalOrders(evidence.entities, remaining) === 1;
    return {
      index,
      clueKey: relationKey(clue),
      edgeDistanceClass: edgeDistanceClass(evidence, clue, finalOrder),
      proofRole: remainsValid
        ? 'CONFIRMATORY'
        : missing
          ? 'ESSENTIAL_FOR_BLOCK_ORDER'
          : 'ESSENTIAL_FOR_FULL_ORDER',
    };
  });
  const essentialForFullOrder = missing
    ? null
    : roles.filter((role) => role.proofRole === 'ESSENTIAL_FOR_FULL_ORDER').length;
  const essentialForBlockOrder = missing
    ? roles.filter((role) => role.proofRole === 'ESSENTIAL_FOR_BLOCK_ORDER').length
    : null;
  const confirmatory = roles.filter((role) => role.proofRole === 'CONFIRMATORY').length;
  const redundantOther = roles.filter((role) => role.proofRole === 'REDUNDANT_OTHER').length;
  const accountedStatementCount = (essentialForFullOrder ?? 0)
    + (essentialForBlockOrder ?? 0)
    + confirmatory
    + redundantOther;
  return {
    statementCount: evidence.clues.length,
    essentialForFullOrder,
    essentialForBlockOrder,
    confirmatory,
    redundantOther,
    accountedStatementCount,
    invariantSatisfied: accountedStatementCount === evidence.clues.length,
    roles,
  };
}

function shortestAnswerProofClues(
  question: RnkCp004V3Question,
  order: readonly string[],
): number {
  const evidence = question.displayedEvidence;
  const query = evidence.query;
  const expectedPositions = indexMap(order);

  if (query.kind === 'MISSING_COMPARISON') {
    return minimumSubsetSize(evidence, (clues) => {
      if (countTopologicalOrders(evidence.entities, clues) <= 1) return false;
      const uniqueCandidates = query.candidates.filter(
        (candidate) => countTopologicalOrders(evidence.entities, [...clues, candidate]) === 1,
      );
      return uniqueCandidates.length === 1 && relationKey(uniqueCandidates[0]) === question.answerKey;
    });
  }

  return minimumSubsetSize(evidence, (clues) => {
    if (query.kind === 'COMPLETE_ORDER') {
      return countTopologicalOrders(evidence.entities, clues) === 1;
    }
    if (query.kind === 'HIGHEST_ENTITY') {
      return allTopologicalOrdersSatisfy(evidence.entities, clues, (candidate) => candidate[0] === question.answerKey);
    }
    if (query.kind === 'LOWEST_ENTITY') {
      return allTopologicalOrdersSatisfy(
        evidence.entities,
        clues,
        (candidate) => candidate[candidate.length - 1] === question.answerKey,
      );
    }
    if (query.kind === 'ENTITY_AT_EXACT_RANK') {
      return allTopologicalOrdersSatisfy(
        evidence.entities,
        clues,
        (candidate) => candidate[query.rankFromTop - 1] === question.answerKey,
      );
    }
    if (query.kind === 'RANK_OF_NAMED_ENTITY') {
      const expectedRank = Number(question.answerKey);
      return allTopologicalOrdersSatisfy(
        evidence.entities,
        clues,
        (candidate) => candidate.indexOf(query.target) + 1 === expectedRank,
      );
    }
    if (query.kind === 'MIDDLE_ENTITY') {
      const middle = (evidence.entities.length - 1) / 2;
      return allTopologicalOrdersSatisfy(
        evidence.entities,
        clues,
        (candidate) => candidate[middle] === question.answerKey,
      );
    }
    if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
      const expectedFirst = expectedPositions.get(query.first)!;
      const expectedSecond = expectedPositions.get(query.second)!;
      if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
        const expectedDifference = Math.abs(expectedFirst - expectedSecond);
        return allTopologicalOrdersSatisfy(evidence.entities, clues, (candidate) => {
          const first = candidate.indexOf(query.first);
          const second = candidate.indexOf(query.second);
          return Math.abs(first - second) === expectedDifference
            && (first < second) === (expectedFirst < expectedSecond);
        });
      }
      return allTopologicalOrdersSatisfy(evidence.entities, clues, (candidate) =>
        (candidate.indexOf(query.first) < candidate.indexOf(query.second)) === (expectedFirst < expectedSecond));
    }
    if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
      return allTopologicalOrdersSatisfy(evidence.entities, clues, (candidate) => {
        const target = candidate.indexOf(query.target);
        const answer = candidate.indexOf(question.answerKey);
        return query.direction === 'ABOVE' ? answer === target - 1 : answer === target + 1;
      });
    }
    if (query.kind === 'VALID_RANK_STATEMENT') {
      if (clues.length < 2) return false;
      const [higher, lower] = question.answerKey.split('>');
      return allTopologicalOrdersSatisfy(
        evidence.entities,
        clues,
        (candidate) => candidate.indexOf(higher) < candidate.indexOf(lower),
      );
    }
    return false;
  });
}

function taskWeight(query: RnkCp004Query, prototypeId: RnkCp004RemodelV4PrototypeId): number {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 2;
  const weights: Record<RnkCp004Query['kind'], number> = {
    HIGHEST_ENTITY: 0,
    LOWEST_ENTITY: 0,
    ENTITY_AT_EXACT_RANK: 1,
    RANK_OF_NAMED_ENTITY: 1,
    MIDDLE_ENTITY: 1,
    COMPLETE_ORDER: 2,
    RELATIVE_ORDER_OF_PAIR: 0,
    IMMEDIATE_NEIGHBOUR: 2,
    VALID_RANK_STATEMENT: 1,
    MISSING_COMPARISON: 3,
  };
  return weights[query.kind];
}

function optionClosenessWeight(query: RnkCp004Query, prototypeId: RnkCp004RemodelV4PrototypeId): number {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 2;
  if (query.kind === 'COMPLETE_ORDER' || query.kind === 'MISSING_COMPARISON') return 2;
  if (query.kind === 'IMMEDIATE_NEIGHBOUR' || query.kind === 'VALID_RANK_STATEMENT') return 1;
  return 0;
}

function difficultyProfile(
  question: RnkCp004V3Question,
  shortestAnswerProof: number,
): { difficulty: RnkCp004Difficulty; profile: RnkCp004DifficultyProfile } {
  const evidence = question.displayedEvidence;
  const irrelevantClueCount = Math.max(0, evidence.clues.length - shortestAnswerProof);
  const task = taskWeight(evidence.query, question.prototypeId);
  const option = optionClosenessWeight(evidence.query, question.prototypeId);
  const entityWeight = Math.max(0, evidence.entities.length - 5);
  const featureScore = Number((
    shortestAnswerProof * 1.5
    + Math.min(irrelevantClueCount, 4) * 0.4
    + entityWeight
    + task
    + option
  ).toFixed(2));
  const difficulty: RnkCp004Difficulty = featureScore <= 7
    ? 'EASY'
    : featureScore <= 12
      ? 'MEDIUM'
      : 'HARD';
  return {
    difficulty,
    profile: {
      shortestAnswerProofClues: shortestAnswerProof,
      irrelevantClueCount,
      taskWeight: task,
      optionClosenessWeight: option,
      entityWeight,
      featureScore,
    },
  };
}

function coreTopologyProfile(
  clueRoles: RnkCp004ClueRoleProfile,
): RnkCp004CoreTopologyProfile {
  const adjacentDisplayedEdges = clueRoles.roles
    .filter((role) => role.edgeDistanceClass === 'ADJACENT').length;
  const nonAdjacentDisplayedEdges = clueRoles.roles.length - adjacentDisplayedEdges;
  const confirmatoryRoles = clueRoles.roles.filter((role) => role.proofRole === 'CONFIRMATORY');
  const confirmatoryNonAdjacent = confirmatoryRoles
    .filter((role) => role.edgeDistanceClass === 'NON_ADJACENT').length;
  const addedEdgeProfile = confirmatoryRoles.length === 0
    ? 'NONE'
    : confirmatoryNonAdjacent === confirmatoryRoles.length
      ? 'CONFIRMATORY_NON_ADJACENT'
      : 'CONFIRMATORY_MIXED';
  return {
    transitiveReductionFamily: clueRoles.essentialForFullOrder === null
      ? 'TWO_ORDERED_BLOCKS'
      : 'TOTAL_ORDER_CHAIN',
    transitiveReductionEdgeCount:
      clueRoles.essentialForFullOrder ?? clueRoles.essentialForBlockOrder ?? 0,
    addedEdgeProfile,
    adjacentDisplayedEdges,
    nonAdjacentDisplayedEdges,
  };
}

function enumerateTopologicalOrders(
  entities: readonly string[],
  clues: readonly RnkCp004Comparison[],
  limit = 2,
): readonly (readonly string[])[] {
  const index = new Map(entities.map((entity, entityIndex) => [entity, entityIndex]));
  const prerequisites = Array.from({ length: entities.length }, () => 0);
  for (const clue of clues) prerequisites[index.get(clue.lower)!] |= 1 << index.get(clue.higher)!;
  const fullMask = (1 << entities.length) - 1;
  const output: string[][] = [];
  const visit = (mask: number, order: string[]): void => {
    if (output.length >= limit) return;
    if (mask === fullMask) {
      output.push([...order]);
      return;
    }
    for (let entityIndex = 0; entityIndex < entities.length; entityIndex += 1) {
      const bit = 1 << entityIndex;
      if ((mask & bit) !== 0) continue;
      if ((prerequisites[entityIndex] & mask) !== prerequisites[entityIndex]) continue;
      order.push(entities[entityIndex]);
      visit(mask | bit, order);
      order.pop();
      if (output.length >= limit) return;
    }
  };
  visit(0, []);
  return output;
}

function compactOptionAnalysis(question: RnkCp004V3Question, order: readonly string[]): readonly string[] {
  const query = question.displayedEvidence.query;
  if (query.kind === 'COMPLETE_ORDER' && question.visibleExplanation.optionAnalysis) {
    return question.visibleExplanation.optionAnalysis;
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const first = order.indexOf(query.first);
    const second = order.indexOf(query.second);
    const higher = first < second ? query.first : query.second;
    const lower = higher === query.first ? query.second : query.first;
    const difference = Math.abs(first - second);
    if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
      return [
        `The reverse-direction option wrongly places ${lower} above ${higher}.`,
        `The other numerical options are off by one because the rank difference is ${difference}.`,
      ];
    }
    return [
      `The reverse-direction option contradicts the decisive path from ${higher} to ${lower}.`,
      `The immediate-neighbour options are false because ${difference - 1} candidate(s) lie between them.`,
    ];
  }
  if (query.kind === 'MISSING_COMPARISON') {
    const wrong = question.options
      .map((option, index) => ({ option, index }))
      .find(({ option }) => option.answerKey !== question.answerKey);
    if (!wrong) return [];
    const [higher, lower] = wrong.option.answerKey.split('>');
    const candidate = { higher, lower };
    const orders = enumerateTopologicalOrders(
      question.displayedEvidence.entities,
      [...question.displayedEvidence.clues, candidate],
      2,
    );
    const letter = String.fromCharCode(65 + wrong.index);
    const proof = orders.length >= 2
      ? `Option ${letter} still permits both ${orders[0].join(' > ')} and ${orders[1].join(' > ')}, so it is insufficient.`
      : `Option ${letter} does not produce one unique order.`;
    return [proof, 'The remaining wrong options also leave more than one valid interleaving.'];
  }
  return question.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.answerKey !== question.answerKey)
    .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`);
}

function compactPositionLines(
  question: RnkCp004V3Question,
  order: readonly string[],
): readonly string[] {
  if (question.visibleExplanation.mode !== 'POSITION_LINE') return question.visibleExplanation.lines;
  const query = question.displayedEvidence.query;
  let highlighted: string | null = null;
  if (query.kind === 'ENTITY_AT_EXACT_RANK') highlighted = order[query.rankFromTop - 1];
  else if (query.kind === 'RANK_OF_NAMED_ENTITY') highlighted = query.target;
  else if (query.kind === 'MIDDLE_ENTITY') highlighted = order[(order.length - 1) / 2];
  const rows: string[] = [];
  for (let start = 0; start < order.length; start += 4) {
    rows.push(order.slice(start, start + 4).map((entity, offset) => {
      const item = `${start + offset + 1}. ${entity}`;
      return entity === highlighted ? `**${item}**` : item;
    }).join('  ·  '));
  }
  const extraction = question.visibleExplanation.lines[question.visibleExplanation.lines.length - 1];
  return [
    `Join the clues to obtain: ${order.join(' > ')}`,
    'Ranked order:',
    ...rows,
    extraction,
  ];
}

function verificationNote(profile: RnkCp004ClueRoleProfile): string | undefined {
  const confirmatory = profile.roles.filter((role) => role.proofRole === 'CONFIRMATORY');
  if (confirmatory.length === 0) return undefined;
  const labels = confirmatory.slice(0, 2).map((role) => relationLabel(role.clueKey));
  return confirmatory.length === 1
    ? `The extra clue “${labels[0]}” confirms the completed order but is not required to construct it.`
    : `The extra clues “${labels.join('” and “')}” confirm the completed order but are not required to construct it.`;
}

function internalExplanation(
  visible: RnkCp004ExamReadyQuestion['visibleExplanation'],
  options: readonly RnkCp004Option[],
): RnkCp004V3Question['explanation'] {
  return {
    mentalPicture: `Internal proof mode: ${visible.mode}`,
    keyRule: 'Every displayed clue is classified, and the learner view uses progressive disclosure for distractor help.',
    stepByStepSolution: [
      ...visible.lines,
      ...(visible.verificationNote ? [visible.verificationNote] : []),
    ],
    examSpeedShortcut: '',
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Answer: ${visible.answer}.`,
  };
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV4PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV3(prototypeId, seed, correctIndexOverride);
  const order = solvedOrder(base);
  const roles = clueRoleProfile(base.displayedEvidence, order);
  if (!roles.invariantSatisfied) {
    throw new Error(`Clue accounting mismatch at ${prototypeId}:${seed}`);
  }
  const shortestAnswerProof = shortestAnswerProofClues(base, order);
  const difficulty = difficultyProfile(base, shortestAnswerProof);
  const topology = coreTopologyProfile(roles);
  const optionAnalysis = compactOptionAnalysis(base, order);
  const visibleExplanation = {
    ...base.visibleExplanation,
    lines: compactPositionLines(base, order),
    optionAnalysis,
    optionAnalysisDisplay: 'COLLAPSED' as const,
    verificationNote: verificationNote(roles),
  };
  const redundant = roles.confirmatory + roles.redundantOther;

  return {
    ...base,
    difficulty: difficulty.difficulty,
    visibleExplanation,
    explanation: internalExplanation(visibleExplanation, base.options),
    mathematicalFingerprint: `${base.mathematicalFingerprint}:ENGLISH_REMODEL_V4`,
    reviewMetadata: {
      ...base.reviewMetadata,
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V4',
      clueRoleProfile: roles,
      coreTopologyProfile: topology,
      shortestAnswerProofClues: shortestAnswerProof,
      difficultyProfile: difficulty.profile,
      reasoningFeatures: {
        ...base.reviewMetadata.reasoningFeatures,
        essentialClueCount:
          roles.essentialForFullOrder ?? roles.essentialForBlockOrder ?? 0,
        redundantClueCount: redundant,
        shortestProofClueCount: shortestAnswerProof,
        featureScore: difficulty.profile.featureScore,
      },
    },
  };
}
