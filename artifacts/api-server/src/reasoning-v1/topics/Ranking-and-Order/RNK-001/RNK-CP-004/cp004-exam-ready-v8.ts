import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
  type RnkCp004Option,
  type RnkCp004Query,
} from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V5_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV5,
  type RnkCp004ExamReadyQuestion as RnkCp004V5Question,
  type RnkCp004RemodelV5PrototypeId,
} from './cp004-exam-ready-v7';

export { countTopologicalOrders, RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID };

export const RNK_CP004_REMODEL_V6_PROTOTYPE_IDS = RNK_CP004_REMODEL_V5_PROTOTYPE_IDS;
export type RnkCp004RemodelV6PrototypeId = RnkCp004RemodelV5PrototypeId;

export const RNK_CP004_DIFFICULTY_MODEL_V2_ID = 'RNK_CP004_DIFFICULTY_V2' as const;
export const RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID = 'DEFINITELY-TRUE-RELATION' as const;

export type RnkCp004ContextFamily =
  | 'SELECTION_TEST'
  | 'MERIT_LIST'
  | 'COMPETITION_STANDINGS'
  | 'PERFORMANCE_REVIEW'
  | 'INTERVIEW_SHORTLIST'
  | 'NEUTRAL_RANKING';

export type RnkCp004ExplanationDepth = 'DIRECT' | 'SEGMENT_BUILDING' | 'FULL_POSITIONAL';

export type RnkCp004V6OptionRole =
  | 'CORRECT'
  | 'ADJACENT_RANK_ERROR'
  | 'TOP_BOTTOM_CONVERSION_ERROR'
  | 'REVERSE_DIRECTION'
  | 'CORRECT_DIRECTION_WRONG_GAP'
  | 'WRONG_DIRECTION_PLAUSIBLE_GAP'
  | 'CORRECT_DEFINITELY_TRUE_TRANSITIVE'
  | 'FALSE_REVERSE_TRANSITIVE'
  | 'FALSE_CONTRADICTS_DIRECT'
  | 'FALSE_OTHER_CONTRADICTION'
  | 'NUMBER_BETWEEN_CONFUSION'
  | 'INCLUSIVE_COUNT_CONFUSION'
  | 'STANDARD_DISTRACTOR';

export interface RnkCp004V6OptionRoleRecord {
  readonly answerKey: string;
  readonly role: RnkCp004V6OptionRole;
}

export interface RnkCp004LanguageProfile {
  readonly contextFamily: RnkCp004ContextFamily;
  readonly clueTemplateIds: readonly string[];
  readonly reversedClueCount: number;
  readonly maximumPhraseRepeat: number;
  readonly mixedContext: false;
}

export interface RnkCp004DifficultyV2Components {
  readonly entityLoad: number;
  readonly essentialClueLoad: number;
  readonly reversedClueLoad: number;
  readonly disconnectedBlockLoad: number;
  readonly nonAdjacentLoad: number;
  readonly exactPositionLoad: number;
  readonly confirmatoryLoad: number;
  readonly optionCompetitionLoad: number;
  readonly shortestProofLoad: number;
  readonly taskLoad: number;
}

export interface RnkCp004DifficultyV2Record {
  readonly modelId: typeof RNK_CP004_DIFFICULTY_MODEL_V2_ID;
  readonly score: number;
  readonly label: RnkCp004Difficulty;
  readonly components: RnkCp004DifficultyV2Components;
  readonly reasons: readonly string[];
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004V5Question,
  | 'stem'
  | 'answer'
  | 'options'
  | 'difficulty'
  | 'explanation'
  | 'visibleExplanation'
  | 'mathematicalFingerprint'
  | 'reviewMetadata'
> & {
  readonly stem: string;
  readonly answer: string;
  readonly options: readonly RnkCp004Option[];
  readonly difficulty: RnkCp004Difficulty;
  readonly explanation: RnkCp004V5Question['explanation'];
  readonly visibleExplanation: RnkCp004V5Question['visibleExplanation'];
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: Omit<
    RnkCp004V5Question['reviewMetadata'],
    | 'generationVersion'
    | 'difficultyModel'
    | 'optionRoleMetadata'
    | 'authorityCandidateId'
    | 'competency'
  > & {
    readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V6';
    readonly authorityCandidateId: string;
    readonly competency: string;
    readonly languageProfile: RnkCp004LanguageProfile;
    readonly explanationDepth: RnkCp004ExplanationDepth;
    readonly difficultyModel: RnkCp004DifficultyV2Record;
    readonly optionRoleMetadata: readonly RnkCp004V6OptionRoleRecord[];
    readonly examAuthenticityStatus: 'REVIEW_PENDING';
  };
};

type Phrase = (higher: string, lower: string) => string;

interface ContextConfig {
  readonly intro: (count: number) => string;
  readonly direct: readonly Phrase[];
  readonly reversed: readonly Phrase[];
}

const CONTEXT_FAMILIES: readonly RnkCp004ContextFamily[] = [
  'SELECTION_TEST',
  'MERIT_LIST',
  'COMPETITION_STANDINGS',
  'PERFORMANCE_REVIEW',
  'INTERVIEW_SHORTLIST',
  'NEUTRAL_RANKING',
];

const CONTEXT_CONFIG: Record<RnkCp004ContextFamily, ContextConfig> = {
  SELECTION_TEST: {
    intro: (count) => `${count} candidates received different ranks in a selection test.`,
    direct: [
      (higher, lower) => `${higher} secured a better rank than ${lower}.`,
      (higher, lower) => `${higher} was ranked above ${lower}.`,
      (higher, lower) => `${higher} was placed ahead of ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} secured a lower rank than ${higher}.`,
      (higher, lower) => `${lower} was ranked below ${higher}.`,
      (higher, lower) => `${lower} was placed after ${higher}.`,
    ],
  },
  MERIT_LIST: {
    intro: (count) => `${count} candidates occupied different positions in a merit list.`,
    direct: [
      (higher, lower) => `${higher} appeared above ${lower} in the merit list.`,
      (higher, lower) => `${higher} held a better position than ${lower}.`,
      (higher, lower) => `${higher} was placed higher than ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} appeared below ${higher} in the merit list.`,
      (higher, lower) => `${lower} held a lower position than ${higher}.`,
      (higher, lower) => `${lower} was placed below ${higher}.`,
    ],
  },
  COMPETITION_STANDINGS: {
    intro: (count) => `${count} participants finished at different positions in a competition.`,
    direct: [
      (higher, lower) => `${higher} finished ahead of ${lower}.`,
      (higher, lower) => `${higher} secured a better finishing position than ${lower}.`,
      (higher, lower) => `${higher} was placed above ${lower} in the final standings.`,
    ],
    reversed: [
      (higher, lower) => `${lower} finished behind ${higher}.`,
      (higher, lower) => `${lower} secured a lower finishing position than ${higher}.`,
      (higher, lower) => `${lower} was placed below ${higher} in the final standings.`,
    ],
  },
  PERFORMANCE_REVIEW: {
    intro: (count) => `${count} employees received distinct performance ranks.`,
    direct: [
      (higher, lower) => `${higher} was rated above ${lower}.`,
      (higher, lower) => `${higher} received a better performance rank than ${lower}.`,
      (higher, lower) => `${higher} was placed higher than ${lower} in the assessment.`,
    ],
    reversed: [
      (higher, lower) => `${lower} was rated below ${higher}.`,
      (higher, lower) => `${lower} received a lower performance rank than ${higher}.`,
      (higher, lower) => `${lower} was placed below ${higher} in the assessment.`,
    ],
  },
  INTERVIEW_SHORTLIST: {
    intro: (count) => `${count} applicants received different positions in an interview shortlist.`,
    direct: [
      (higher, lower) => `${higher} was placed above ${lower} in the shortlist.`,
      (higher, lower) => `${higher} received a better shortlist position than ${lower}.`,
      (higher, lower) => `${higher} ranked higher than ${lower} after the interview.`,
    ],
    reversed: [
      (higher, lower) => `${lower} was placed below ${higher} in the shortlist.`,
      (higher, lower) => `${lower} received a lower shortlist position than ${higher}.`,
      (higher, lower) => `${lower} ranked below ${higher} after the interview.`,
    ],
  },
  NEUTRAL_RANKING: {
    intro: (count) => `${count} people were ranked from highest to lowest, with no ties.`,
    direct: [
      (higher, lower) => `${higher} ranks above ${lower}.`,
      (higher, lower) => `${higher} is ranked higher than ${lower}.`,
      (higher, lower) => `${higher} holds a better position than ${lower}.`,
    ],
    reversed: [
      (higher, lower) => `${lower} ranks below ${higher}.`,
      (higher, lower) => `${lower} is ranked lower than ${higher}.`,
      (higher, lower) => `${lower} holds a lower position than ${higher}.`,
    ],
  },
};

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
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

function option(
  answerKey: string,
  label: string,
  misconceptionId: string,
  explanation: string,
): RnkCp004Option {
  return { answerKey, label, misconceptionId, explanation };
}

function solvedOrder(question: RnkCp004V5Question): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === question.answerKey);
  if (!bridge) throw new Error(`Missing bridge at ${question.reviewMetadata.stableQuestionId}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
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

function contextFamily(prototypeId: RnkCp004RemodelV6PrototypeId, seed: number): RnkCp004ContextFamily {
  const prototypeIndex = RNK_CP004_REMODEL_V6_PROTOTYPE_IDS.indexOf(prototypeId);
  return CONTEXT_FAMILIES[Math.abs(seed + prototypeIndex * 7) % CONTEXT_FAMILIES.length];
}

function reversedClueIndexes(
  clueCount: number,
  difficulty: RnkCp004Difficulty,
  seed: number,
): ReadonlySet<number> {
  const required = difficulty === 'HARD' ? Math.min(2, clueCount) : difficulty === 'MEDIUM' ? 1 : 0;
  const selected = new Set<number>();
  let cursor = Math.abs(seed * 3 + clueCount) % Math.max(1, clueCount);
  while (selected.size < required) {
    selected.add(cursor);
    cursor = (cursor + 2) % clueCount;
  }
  return selected;
}

function queryText(query: RnkCp004Query, prototypeId: RnkCp004RemodelV6PrototypeId): string {
  switch (query.kind) {
    case 'HIGHEST_ENTITY': return 'Who secured the highest rank?';
    case 'LOWEST_ENTITY': return 'Who was placed lowest?';
    case 'ENTITY_AT_EXACT_RANK': return `Who is ${ordinal(query.rankFromTop)} from the top?`;
    case 'RANK_OF_NAMED_ENTITY': return `What is ${query.target}'s rank from the top?`;
    case 'MIDDLE_ENTITY': return 'Who occupies the middle position?';
    case 'COMPLETE_ORDER': return 'Which option shows the complete order from highest to lowest?';
    case 'RELATIVE_ORDER_OF_PAIR':
      return prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID
        ? `Which option correctly gives the rank difference and direction between ${query.first} and ${query.second}?`
        : `Which statement correctly describes the relative position of ${query.first} and ${query.second}?`;
    case 'IMMEDIATE_NEIGHBOUR':
      return `Who is ranked immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`;
    case 'VALID_RANK_STATEMENT': return 'Which of the following statements is definitely true?';
    case 'MISSING_COMPARISON': return 'Which additional information is sufficient to fix the complete order uniquely?';
  }
}

function renderStem(
  base: RnkCp004V5Question,
  family: RnkCp004ContextFamily,
): { readonly stem: string; readonly profile: RnkCp004LanguageProfile } {
  const config = CONTEXT_CONFIG[family];
  const reversed = reversedClueIndexes(base.displayedEvidence.clues.length, base.difficulty, base.seed);
  const templateIds: string[] = [];
  const rendered = base.displayedEvidence.clues.map((clue, index) => {
    const isReversed = reversed.has(index);
    const pool = isReversed ? config.reversed : config.direct;
    const templateIndex = (index + base.seed) % pool.length;
    templateIds.push(`${family}:${isReversed ? 'R' : 'D'}${templateIndex}`);
    return pool[templateIndex](clue.higher, clue.lower);
  });
  const repeats = new Map<string, number>();
  for (const id of templateIds) repeats.set(id, (repeats.get(id) ?? 0) + 1);
  const maximumPhraseRepeat = Math.max(...repeats.values());
  return {
    stem: [
      config.intro(base.displayedEvidence.entities.length),
      '',
      ...rendered.map((clue) => `- ${clue}`),
      '',
      queryText(base.displayedEvidence.query, base.prototypeId),
    ].join('\n'),
    profile: {
      contextFamily: family,
      clueTemplateIds: templateIds,
      reversedClueCount: reversed.size,
      maximumPhraseRepeat,
      mixedContext: false,
    },
  };
}

function distinctValues(values: readonly number[], minimum: number, maximum: number): number[] {
  const output: number[] = [];
  for (const value of values) {
    if (value >= minimum && value <= maximum && !output.includes(value)) output.push(value);
  }
  for (let value = minimum; output.length < 4 && value <= maximum; value += 1) {
    if (!output.includes(value)) output.push(value);
  }
  return output;
}

function rankOfNamedOptions(
  base: RnkCp004V5Question,
  order: readonly string[],
): { readonly options: readonly RnkCp004Option[]; readonly roles: readonly RnkCp004V6OptionRoleRecord[] } | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'RANK_OF_NAMED_ENTITY') return null;
  const topRank = order.indexOf(query.target) + 1;
  const bottomRank = order.length - topRank + 1;
  const wrongRanks = distinctValues([topRank - 1, topRank + 1, bottomRank, topRank - 2, topRank + 2], 1, order.length)
    .filter((value) => value !== topRank)
    .slice(0, 3);
  const correct = option(String(topRank), String(topRank), 'CORRECT', `${query.target} is ${ordinal(topRank)} from the top`);
  const wrong = wrongRanks.map((value) => option(
    String(value),
    String(value),
    value === bottomRank && bottomRank !== topRank ? 'TOP_BOTTOM_CONVERSION_ERROR' : 'ADJACENT_RANK_ERROR',
    value === bottomRank && bottomRank !== topRank
      ? `${value} is ${query.target}'s rank from the bottom, not from the top`
      : `${query.target} is ${ordinal(topRank)} from the top, not ${ordinal(value)}`,
  ));
  const options = placeCorrect(correct, wrong, base.correctIndex);
  return {
    options,
    roles: options.map((item) => ({
      answerKey: item.answerKey,
      role: item.misconceptionId as RnkCp004V6OptionRole,
    })),
  };
}

function relativePairOptions(
  base: RnkCp004V5Question,
  order: readonly string[],
): { readonly options: readonly RnkCp004Option[]; readonly roles: readonly RnkCp004V6OptionRoleRecord[] } | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR' || base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return null;
  const first = order.indexOf(query.first);
  const second = order.indexOf(query.second);
  const higher = first < second ? query.first : query.second;
  const lower = higher === query.first ? query.second : query.first;
  const difference = Math.abs(first - second);
  const wrongGap = difference === 2 ? 3 : difference - 1;
  const correct = option(`${higher}>${lower}`, `${higher} ranks higher than ${lower}`, 'CORRECT', `The decisive path places ${higher} above ${lower}`);
  const wrong = [
    option(`${lower}>${higher}`, `${lower} ranks higher than ${higher}`, 'REVERSE_DIRECTION', `This reverses the proven order ${higher} > ${lower}`),
    option(`GAP:${higher}>${lower}:${wrongGap}`, `${higher} is ${wrongGap} rank positions above ${lower}`, 'CORRECT_DIRECTION_WRONG_GAP', `Their rank difference is ${difference}, not ${wrongGap}`),
    option(`GAP:${lower}>${higher}:${difference}`, `${lower} is ${difference} rank positions above ${higher}`, 'WRONG_DIRECTION_PLAUSIBLE_GAP', `The gap is plausible, but the direction is reversed`),
  ];
  const options = placeCorrect(correct, wrong, base.correctIndex);
  return {
    options,
    roles: options.map((item) => ({ answerKey: item.answerKey, role: item.misconceptionId as RnkCp004V6OptionRole })),
  };
}

function definitelyTrueOptions(
  base: RnkCp004V5Question,
): {
  readonly evidence: RnkCp004V5Question['displayedEvidence'];
  readonly options: readonly RnkCp004Option[];
  readonly roles: readonly RnkCp004V6OptionRoleRecord[];
} | null {
  const evidence = base.displayedEvidence;
  if (evidence.query.kind !== 'VALID_RANK_STATEMENT') return null;
  const [correctHigher, correctLower] = base.answerKey.split('>');
  const path = shortestPath(evidence.clues, correctHigher, correctLower);
  if (!path || path.length < 3) throw new Error(`Definitely-true answer lacks a transitive proof at ${base.seed}`);
  const directClues = evidence.clues.filter((clue) => relationKey(clue) !== base.answerKey);
  if (directClues.length < 2) throw new Error(`Insufficient direct contradictions at ${base.seed}`);
  const reverseCorrect = `${correctLower}>${correctHigher}`;
  const reverseFirst = `${directClues[0].lower}>${directClues[0].higher}`;
  const secondSource = directClues.find((clue) => `${clue.lower}>${clue.higher}` !== reverseFirst) ?? directClues[1];
  const reverseSecond = `${secondSource.lower}>${secondSource.higher}`;
  const correct = option(base.answerKey, `${correctHigher} ranks above ${correctLower}`, 'CORRECT_DEFINITELY_TRUE_TRANSITIVE', `This follows from ${path.join(' > ')}`);
  const wrong = [
    option(reverseCorrect, `${correctLower} ranks above ${correctHigher}`, 'FALSE_REVERSE_TRANSITIVE', `This reverses the inferred chain ${path.join(' > ')}`),
    option(reverseFirst, `${directClues[0].lower} ranks above ${directClues[0].higher}`, 'FALSE_CONTRADICTS_DIRECT', `This contradicts the direct comparison ${directClues[0].higher} > ${directClues[0].lower}`),
    option(reverseSecond, `${secondSource.lower} ranks above ${secondSource.higher}`, 'FALSE_OTHER_CONTRADICTION', `This contradicts the direct comparison ${secondSource.higher} > ${secondSource.lower}`),
  ];
  const options = placeCorrect(correct, wrong, base.correctIndex);
  const candidates = options.map((item) => {
    const [higher, lower] = item.answerKey.split('>');
    return { higher, lower };
  });
  return {
    evidence: { ...evidence, query: { kind: 'VALID_RANK_STATEMENT', candidates } },
    options,
    roles: options.map((item) => ({ answerKey: item.answerKey, role: item.misconceptionId as RnkCp004V6OptionRole })),
  };
}

function exactDistanceOptions(
  base: RnkCp004V5Question,
  order: readonly string[],
): { readonly options: readonly RnkCp004Option[]; readonly roles: readonly RnkCp004V6OptionRoleRecord[] } | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR' || base.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return null;
  const firstRank = order.indexOf(query.first) + 1;
  const secondRank = order.indexOf(query.second) + 1;
  const higher = firstRank < secondRank ? query.first : query.second;
  const lower = higher === query.first ? query.second : query.first;
  const difference = Math.abs(firstRank - secondRank);
  const between = difference - 1;
  const inclusive = difference + 1;
  const correctLabel = `The rank difference is ${difference}, with ${higher} ranked higher`;
  const correct = option(`${higher}>${lower}`, correctLabel, 'CORRECT', `${higher} and ${lower} are at ranks ${Math.min(firstRank, secondRank)} and ${Math.max(firstRank, secondRank)}`);
  const wrong = [
    option(`REVERSED:${lower}>${higher}:${difference}`, `The rank difference is ${difference}, with ${lower} ranked higher`, 'REVERSE_DIRECTION', `The difference is ${difference}, but ${higher} has the higher rank`),
    option(`BETWEEN:${higher}>${lower}:${between}`, `The rank difference is ${between}, with ${higher} ranked higher`, 'NUMBER_BETWEEN_CONFUSION', `${between} is the number of people between them, not the rank difference`),
    option(`INCLUSIVE:${higher}>${lower}:${inclusive}`, `The rank difference is ${inclusive}, with ${higher} ranked higher`, 'INCLUSIVE_COUNT_CONFUSION', `${inclusive} counts both endpoints; the rank difference is ${difference}`),
  ];
  const options = placeCorrect(correct, wrong, base.correctIndex);
  return {
    options,
    roles: options.map((item) => ({ answerKey: item.answerKey, role: item.misconceptionId as RnkCp004V6OptionRole })),
  };
}

function optionSet(
  base: RnkCp004V5Question,
  order: readonly string[],
): {
  readonly evidence: RnkCp004V5Question['displayedEvidence'];
  readonly options: readonly RnkCp004Option[];
  readonly roles: readonly RnkCp004V6OptionRoleRecord[];
} {
  const definitelyTrue = definitelyTrueOptions(base);
  if (definitelyTrue) return definitelyTrue;
  const specialised = rankOfNamedOptions(base, order)
    ?? relativePairOptions(base, order)
    ?? exactDistanceOptions(base, order);
  if (specialised) return { evidence: base.displayedEvidence, ...specialised };
  return {
    evidence: base.displayedEvidence,
    options: base.options,
    roles: base.options.map((item) => ({
      answerKey: item.answerKey,
      role: item.answerKey === base.answerKey ? 'CORRECT' : 'STANDARD_DISTRACTOR',
    })),
  };
}

function chainSegments(order: readonly string[]): readonly string[] {
  if (order.length <= 4) return [order.join(' > ')];
  const segments: string[] = [];
  for (let start = 0; start < order.length - 1; start += 2) {
    segments.push(order.slice(start, Math.min(order.length, start + 3)).join(' > '));
  }
  return segments;
}

function numberedRows(order: readonly string[], highlighted: ReadonlySet<string>): readonly string[] {
  const rows: string[] = [];
  for (let start = 0; start < order.length; start += 4) {
    rows.push(order.slice(start, start + 4).map((entity, offset) => {
      const item = `${start + offset + 1}. ${entity}`;
      return highlighted.has(entity) ? `**${item}**` : item;
    }).join('  ·  '));
  }
  return rows;
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
  const output: string[][] = [];
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
    output.push(component);
  }
  return output;
}

function explanationDepth(
  base: RnkCp004V5Question,
): RnkCp004ExplanationDepth {
  const query = base.displayedEvidence.query;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR' && base.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 'DIRECT';
  if ((query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') && base.difficulty === 'EASY') return 'DIRECT';
  if (
    query.kind === 'ENTITY_AT_EXACT_RANK'
    || query.kind === 'RANK_OF_NAMED_ENTITY'
    || query.kind === 'MIDDLE_ENTITY'
    || query.kind === 'COMPLETE_ORDER'
    || query.kind === 'IMMEDIATE_NEIGHBOUR'
    || query.kind === 'MISSING_COMPARISON'
    || base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID
  ) return 'FULL_POSITIONAL';
  return 'SEGMENT_BUILDING';
}

function explanationLines(
  base: RnkCp004V5Question,
  evidence: RnkCp004V5Question['displayedEvidence'],
  order: readonly string[],
  answerKey: string,
): readonly string[] {
  const query = evidence.query;
  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    if (base.difficulty === 'EASY') {
      return [
        `Arrange the candidates: ${order.join(' > ')}`,
        `${answerKey} is ${query.kind === 'HIGHEST_ENTITY' ? 'first' : 'last'} in the order. Therefore, ${answerKey} ranks ${query.kind === 'HIGHEST_ENTITY' ? 'highest' : 'lowest'}.`,
      ];
    }
    return [
      'Form the connected segments:',
      ...chainSegments(order),
      `Combining them gives: ${order.join(' > ')}`,
      `${answerKey} is ${query.kind === 'HIGHEST_ENTITY' ? 'first' : 'last'}, so ${answerKey} ranks ${query.kind === 'HIGHEST_ENTITY' ? 'highest' : 'lowest'}.`,
    ];
  }
  if (query.kind === 'ENTITY_AT_EXACT_RANK') {
    const target = order[query.rankFromTop - 1];
    return [
      `Combine the comparison segments: ${chainSegments(order).join('  |  ')}`,
      `Complete order: ${order.join(' > ')}`,
      'Numbering from the top:',
      ...numberedRows(order, new Set([target])),
      `${target} is ${ordinal(query.rankFromTop)} from the top.`,
    ];
  }
  if (query.kind === 'RANK_OF_NAMED_ENTITY') {
    const topRank = order.indexOf(query.target) + 1;
    const bottomRank = order.length - topRank + 1;
    return [
      `Complete order: ${order.join(' > ')}`,
      'Numbering from the top:',
      ...numberedRows(order, new Set([query.target])),
      `${query.target} is ${ordinal(topRank)} from the top and ${ordinal(bottomRank)} from the bottom. The question asks for the rank from the top, so the answer is ${topRank}.`,
    ];
  }
  if (query.kind === 'MIDDLE_ENTITY') {
    const middleRank = (order.length + 1) / 2;
    const middle = order[middleRank - 1];
    return [
      `Complete order: ${order.join(' > ')}`,
      `There are ${order.length} people, so the middle position is (${order.length} + 1) ÷ 2 = ${middleRank}.`,
      ...numberedRows(order, new Set([middle])),
      `${middle} occupies the middle position.`,
    ];
  }
  if (query.kind === 'COMPLETE_ORDER') {
    return [
      'Form the segments:',
      ...chainSegments(order),
      `Complete order: ${order.join(' > ')}`,
      'The correct option is the one that matches this order exactly.',
    ];
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') {
    const first = order.indexOf(query.first);
    const second = order.indexOf(query.second);
    const higher = first < second ? query.first : query.second;
    const lower = higher === query.first ? query.second : query.first;
    if (base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
      const higherRank = Math.min(first, second) + 1;
      const lowerRank = Math.max(first, second) + 1;
      const difference = lowerRank - higherRank;
      return [
        `Complete order: ${order.join(' > ')}`,
        `${higher} is ${ordinal(higherRank)} and ${lower} is ${ordinal(lowerRank)}.`,
        `Rank difference = ${lowerRank} − ${higherRank} = ${difference}.`,
        `There are ${difference - 1} people between them, but the question asks for rank difference. Therefore, the difference is ${difference}, with ${higher} ranked higher.`,
      ];
    }
    const path = shortestPath(evidence.clues, higher, lower);
    if (!path) throw new Error(`Pair path missing at ${base.seed}`);
    return [
      `The shortest relevant chain is: ${path.join(' > ')}`,
      `${higher} appears above ${lower}. Therefore, ${higher} ranks higher than ${lower}.`,
    ];
  }
  if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    const targetIndex = order.indexOf(query.target);
    const answerIndex = query.direction === 'ABOVE' ? targetIndex - 1 : targetIndex + 1;
    const start = Math.max(0, Math.min(targetIndex, answerIndex) - 1);
    const end = Math.min(order.length, Math.max(targetIndex, answerIndex) + 2);
    const local = order.slice(start, end).join(' > ');
    return [
      `Complete order: ${order.join(' > ')}`,
      `Relevant part: ${local}`,
      `${order[answerIndex]} is immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}.`,
    ];
  }
  if (query.kind === 'VALID_RANK_STATEMENT') {
    const [higher, lower] = answerKey.split('>');
    const path = shortestPath(evidence.clues, higher, lower);
    if (!path || path.length < 3) throw new Error(`Definitely-true proof is not transitive at ${base.seed}`);
    return [
      `From the relevant comparisons: ${path.join(' > ')}`,
      `${higher} must be ranked above ${lower}. Therefore, “${higher} ranks above ${lower}” is definitely true.`,
    ];
  }
  const bridge = query.candidates.find((candidate) => relationKey(candidate) === answerKey);
  if (!bridge) throw new Error(`Missing bridge at ${base.seed}`);
  const blocks = connectedComponents(evidence.entities, evidence.clues).map((component) => {
    const set = new Set(component);
    const localClues = evidence.clues.filter((clue) => set.has(clue.higher) && set.has(clue.lower));
    return reconstructUniqueOrder(component, localClues);
  }).sort((left, right) => {
    if (left.includes(bridge.higher)) return -1;
    if (right.includes(bridge.higher)) return 1;
    return 0;
  });
  return [
    `Existing block 1: ${blocks[0].join(' > ')}`,
    `Existing block 2: ${blocks[1].join(' > ')}`,
    `${bridge.higher} > ${bridge.lower} connects the bottom of the upper block to the top of the lower block.`,
    `Complete order: ${order.join(' > ')}`,
  ];
}

function enumerateOrders(
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
    }
  };
  visit(0, []);
  return output;
}

function optionAnalysis(
  base: RnkCp004V5Question,
  evidence: RnkCp004V5Question['displayedEvidence'],
  options: readonly RnkCp004Option[],
  order: readonly string[],
): readonly string[] {
  const query = evidence.query;
  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    const wrong = options.filter((item) => item.answerKey !== base.answerKey);
    return [`The other options occupy lower positions in the completed order, so none is ${query.kind === 'HIGHEST_ENTITY' ? 'highest' : 'lowest'}.`];
  }
  if (query.kind === 'RANK_OF_NAMED_ENTITY') {
    const topRank = order.indexOf(query.target) + 1;
    const bottomRank = order.length - topRank + 1;
    return options
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.answerKey !== base.answerKey)
      .map(({ item, index }) => Number(item.answerKey) === bottomRank && bottomRank !== topRank
        ? `Option ${String.fromCharCode(65 + index)} gives ${query.target}'s rank from the bottom; the question asks for the top rank.`
        : `Option ${String.fromCharCode(65 + index)} is incorrect because ${query.target} is ${ordinal(topRank)} from the top.`);
  }
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR' || query.kind === 'VALID_RANK_STATEMENT') {
    return options
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.answerKey !== base.answerKey)
      .map(({ item, index }) => `Option ${String.fromCharCode(65 + index)}: ${item.explanation}.`);
  }
  if (query.kind === 'MISSING_COMPARISON') {
    return options
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.answerKey !== base.answerKey)
      .map(({ item, index }) => {
        const [higher, lower] = item.answerKey.split('>');
        const candidate = { higher, lower };
        const orders = enumerateOrders(evidence.entities, [...evidence.clues, candidate], 2);
        if (orders.length === 0) {
          return `Option ${String.fromCharCode(65 + index)} contradicts the existing comparisons, so it cannot complete the ranking.`;
        }
        if (orders.length === 1) {
          throw new Error(`Wrong missing-comparison option unexpectedly creates one order at ${base.seed}`);
        }
        return `Option ${String.fromCharCode(65 + index)} still allows ${orders[0].join(' > ')} and ${orders[1].join(' > ')}, so the ranking is not unique.`;
      });
  }
  if (base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return options
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.answerKey !== base.answerKey)
      .map(({ item, index }) => `Option ${String.fromCharCode(65 + index)}: ${item.explanation}.`);
  }
  return base.visibleExplanation.optionAnalysis ?? options
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.answerKey !== base.answerKey)
    .map(({ item, index }) => `Option ${String.fromCharCode(65 + index)}: ${item.explanation}.`);
}

function taskLoad(query: RnkCp004Query, prototypeId: RnkCp004RemodelV6PrototypeId): number {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 2.4;
  const loads: Record<RnkCp004Query['kind'], number> = {
    HIGHEST_ENTITY: 0.4,
    LOWEST_ENTITY: 0.4,
    ENTITY_AT_EXACT_RANK: 1.3,
    RANK_OF_NAMED_ENTITY: 1.5,
    MIDDLE_ENTITY: 1.2,
    COMPLETE_ORDER: 2,
    RELATIVE_ORDER_OF_PAIR: 0.7,
    IMMEDIATE_NEIGHBOUR: 1.6,
    VALID_RANK_STATEMENT: 2,
    MISSING_COMPARISON: 3.6,
  };
  return loads[query.kind];
}

function difficultyV2(
  base: RnkCp004V5Question,
  language: RnkCp004LanguageProfile,
  roles: readonly RnkCp004V6OptionRoleRecord[],
): RnkCp004DifficultyV2Record {
  const features = base.reviewMetadata.reasoningFeatures;
  const query = base.displayedEvidence.query;
  const exactPositionRequired = query.kind === 'ENTITY_AT_EXACT_RANK'
    || query.kind === 'RANK_OF_NAMED_ENTITY'
    || query.kind === 'MIDDLE_ENTITY'
    || query.kind === 'IMMEDIATE_NEIGHBOUR'
    || base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID;
  const competitiveRoles = roles.filter((role) => role.role !== 'CORRECT' && role.role !== 'STANDARD_DISTRACTOR').length;
  const components: RnkCp004DifficultyV2Components = {
    entityLoad: Math.max(0, features.entityCount - 4) * 0.3,
    essentialClueLoad: Math.max(0, features.essentialClueCount - 2) * 0.35,
    reversedClueLoad: language.reversedClueCount * 1.15,
    disconnectedBlockLoad: query.kind === 'MISSING_COMPARISON' ? 3.4 : 0,
    nonAdjacentLoad: (features.nonAdjacentClueCount ?? 0) * 0.55,
    exactPositionLoad: exactPositionRequired ? 1.5 : 0,
    confirmatoryLoad: features.redundantClueCount * 0.65,
    optionCompetitionLoad: competitiveRoles * 0.55,
    shortestProofLoad: features.shortestProofClueCount * 0.45,
    taskLoad: taskLoad(query, base.prototypeId),
  };
  const score = Number(Object.values(components).reduce((total, value) => total + value, 0).toFixed(2));
  const label: RnkCp004Difficulty = score <= 6.5 ? 'EASY' : score <= 11.5 ? 'MEDIUM' : 'HARD';
  const reasons = [
    `${features.entityCount} ranked entities`,
    `${features.essentialClueCount} essential comparisons`,
    `${language.reversedClueCount} reversed-wording clue(s)`,
    `${features.shortestProofClueCount}-clue shortest answer proof`,
    ...(query.kind === 'MISSING_COMPARISON' ? ['two disconnected ordered blocks and a uniqueness test'] : []),
    ...(exactPositionRequired ? ['exact position reconstruction is required'] : []),
    ...(features.redundantClueCount > 0 ? [`${features.redundantClueCount} confirmatory clue(s)`] : []),
    ...(competitiveRoles > 0 ? [`${competitiveRoles} misconception-based distractor(s)`] : []),
  ];
  return { modelId: RNK_CP004_DIFFICULTY_MODEL_V2_ID, score, label, components, reasons };
}

function competency(base: RnkCp004V5Question): string {
  if (base.displayedEvidence.query.kind === 'VALID_RANK_STATEMENT') {
    return 'Identify the one relation that must follow from the comparison chain';
  }
  return base.reviewMetadata.competency;
}

function authorityCandidateId(base: RnkCp004V5Question): string {
  return base.displayedEvidence.query.kind === 'VALID_RANK_STATEMENT'
    ? RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID
    : base.reviewMetadata.authorityCandidateId;
}

function internalExplanation(
  base: RnkCp004V5Question,
  lines: readonly string[],
  options: readonly RnkCp004Option[],
  answer: string,
): RnkCp004V5Question['explanation'] {
  return {
    mentalPicture: `Internal proof mode: ${base.visibleExplanation.mode}`,
    keyRule: 'Use the smallest sufficient reasoning display for the task, while retaining full graph and option validation in admin metadata.',
    stepByStepSolution: [...lines],
    examSpeedShortcut: '',
    optionAnalysis: options.map((item, index) => `Option ${String.fromCharCode(65 + index)} (${item.label}): ${item.explanation}.`),
    conclusion: `Answer: ${answer}.`,
  };
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV6PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV5(prototypeId, seed, correctIndexOverride);
  const order = solvedOrder(base);
  const selected = optionSet(base, order);
  const answer = selected.options[base.correctIndex].label;
  const family = contextFamily(prototypeId, seed);
  const rendered = renderStem(base, family);
  const difficulty = difficultyV2(base, rendered.profile, selected.roles);
  const lines = explanationLines(base, selected.evidence, order, base.answerKey);
  const audit = optionAnalysis(base, selected.evidence, selected.options, order);
  const depth = explanationDepth(base);

  return {
    ...base,
    displayedEvidence: selected.evidence,
    stem: rendered.stem,
    answer,
    options: selected.options,
    difficulty: difficulty.label,
    explanation: internalExplanation(base, lines, selected.options, answer),
    visibleExplanation: {
      ...base.visibleExplanation,
      lines,
      answer,
      optionAnalysis: audit,
      optionAnalysisDisplay: 'NATIVE_COLLAPSED',
    },
    mathematicalFingerprint: `${base.mathematicalFingerprint}:ENGLISH_REMODEL_V6:${family}:${selected.roles.map((role) => role.role).join('|')}`,
    reviewMetadata: {
      ...base.reviewMetadata,
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V6',
      authorityCandidateId: authorityCandidateId(base),
      competency: competency(base),
      languageProfile: rendered.profile,
      explanationDepth: depth,
      difficultyModel: difficulty,
      optionRoleMetadata: selected.roles,
      examAuthenticityStatus: 'REVIEW_PENDING',
      difficultyProfile: {
        ...base.reviewMetadata.difficultyProfile,
        featureScore: difficulty.score,
      },
      reasoningFeatures: {
        ...base.reviewMetadata.reasoningFeatures,
        featureScore: difficulty.score,
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V6_CONTEXT:${family}|V6_ROLES:${selected.roles.map((role) => role.role).join('>')}`,
    },
  };
}
