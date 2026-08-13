import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
  type RnkCp004Difficulty,
  type RnkCp004Option,
  type RnkCp004Query,
} from './cp004-foundation';
import {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  RNK_CP004_REMODEL_V6_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV6,
  type RnkCp004ExamReadyQuestion as RnkCp004V6Question,
  type RnkCp004RemodelV6PrototypeId,
} from './cp004-exam-ready-v12';

export {
  RNK_CP004_DEFINITELY_TRUE_AUTHORITY_ID,
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
  countTopologicalOrders,
};

export const RNK_CP004_REMODEL_V7_PROTOTYPE_IDS = RNK_CP004_REMODEL_V6_PROTOTYPE_IDS;
export type RnkCp004RemodelV7PrototypeId = RnkCp004RemodelV6PrototypeId;
export const RNK_CP004_DIFFICULTY_MODEL_V3_ID = 'RNK_CP004_DIFFICULTY_V3' as const;

export type RnkCp004V7OptionRole =
  | RnkCp004V6Question['reviewMetadata']['optionRoleMetadata'][number]['role']
  | 'SAME_RANK_CONTRADICTION'
  | 'CANNOT_DETERMINE_CONTRADICTION';

export interface RnkCp004V7OptionRoleRecord {
  readonly answerKey: string;
  readonly role: RnkCp004V7OptionRole;
}

export interface RnkCp004DifficultyV3Components {
  readonly answerProofLoad: number;
  readonly irrelevantClueLoad: number;
  readonly reversedClueLoad: number;
  readonly entityScanLoad: number;
  readonly confirmatoryLoad: number;
  readonly fullReconstructionLoad: number;
  readonly optionCompetitionLoad: number;
  readonly taskLoad: number;
  readonly ambiguityLoad: number;
}

export interface RnkCp004DifficultyV3Record {
  readonly modelId: typeof RNK_CP004_DIFFICULTY_MODEL_V3_ID;
  readonly score: number;
  readonly label: RnkCp004Difficulty;
  readonly components: RnkCp004DifficultyV3Components;
  readonly reasons: readonly string[];
  readonly calibrationRules: readonly string[];
}

export interface RnkCp004EditorialDiversityProfile {
  readonly stemVariantId: string;
  readonly explanationVariantId: string;
  readonly distractorCount: 3;
  readonly optionCountInvariantSatisfied: true;
  readonly optionSemanticMode: 'STANDARD' | 'DIRECTION_ONLY' | 'EXACT_DISTANCE';
  readonly mockOptionHelpMode: 'COMPACT';
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004V6Question,
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
  readonly explanation: RnkCp004V6Question['explanation'];
  readonly visibleExplanation: RnkCp004V6Question['visibleExplanation'];
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: Omit<
    RnkCp004V6Question['reviewMetadata'],
    | 'generationVersion'
    | 'difficultyModel'
    | 'optionRoleMetadata'
    | 'examAuthenticityStatus'
  > & {
    readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V7';
    readonly difficultyModel: RnkCp004DifficultyV3Record;
    readonly optionRoleMetadata: readonly RnkCp004V7OptionRoleRecord[];
    readonly editorialDiversityProfile: RnkCp004EditorialDiversityProfile;
    readonly examAuthenticityStatus: 'TARGETED_REVIEW_PENDING';
  };
};

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
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

function solvedOrder(question: RnkCp004V6Question): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === question.answerKey);
  if (!bridge) throw new Error(`Missing bridge at ${question.reviewMetadata.stableQuestionId}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function ordinal(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function countLabel(value: number, singular: string, plural = `${singular}s`): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function directionOnlyOptions(
  base: RnkCp004V6Question,
  order: readonly string[],
): { readonly options: readonly RnkCp004Option[]; readonly roles: readonly RnkCp004V7OptionRoleRecord[] } | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR'
    || base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return null;

  const firstIndex = order.indexOf(query.first);
  const secondIndex = order.indexOf(query.second);
  const higher = firstIndex < secondIndex ? query.first : query.second;
  const lower = higher === query.first ? query.second : query.first;
  const correct = option(
    `${higher}>${lower}`,
    `${higher} ranks higher than ${lower}`,
    'CORRECT',
    `The relevant comparison chain places ${higher} above ${lower}`,
  );
  const wrong = [
    option(
      `${lower}>${higher}`,
      `${lower} ranks higher than ${higher}`,
      'REVERSE_DIRECTION',
      `This reverses the established order ${higher} > ${lower}`,
    ),
    option(
      `SAME:${query.first}=${query.second}`,
      `${query.first} and ${query.second} have the same rank`,
      'SAME_RANK_CONTRADICTION',
      'All people have different ranks, so a tie is impossible',
    ),
    option(
      `UNDETERMINED:${query.first}:${query.second}`,
      `The relative positions of ${query.first} and ${query.second} cannot be determined`,
      'CANNOT_DETERMINE_CONTRADICTION',
      'The displayed comparisons determine one exact order, including this pair',
    ),
  ];
  const options = placeCorrect(correct, wrong, base.correctIndex);
  return {
    options,
    roles: options.map((item) => ({
      answerKey: item.answerKey,
      role: item.misconceptionId as RnkCp004V7OptionRole,
    })),
  };
}

function exactDistanceOptions(
  base: RnkCp004V6Question,
  order: readonly string[],
): { readonly options: readonly RnkCp004Option[]; readonly roles: readonly RnkCp004V7OptionRoleRecord[] } | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR'
    || base.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return null;

  const firstRank = order.indexOf(query.first) + 1;
  const secondRank = order.indexOf(query.second) + 1;
  const higher = firstRank < secondRank ? query.first : query.second;
  const lower = higher === query.first ? query.second : query.first;
  const difference = Math.abs(firstRank - secondRank);
  const between = difference - 1;
  const inclusive = difference + 1;
  if (difference < 2) throw new Error(`Exact-distance target is too close at ${base.reviewMetadata.stableQuestionId}`);

  const correct = option(
    base.answerKey,
    `${higher} is ${countLabel(difference, 'place')} above ${lower}`,
    'CORRECT',
    `${higher} and ${lower} are at ranks ${Math.min(firstRank, secondRank)} and ${Math.max(firstRank, secondRank)}`,
  );
  const wrong = [
    option(
      `REVERSED:${lower}>${higher}:${difference}`,
      `${lower} is ${countLabel(difference, 'place')} above ${higher}`,
      'REVERSE_DIRECTION',
      `The gap is ${difference}, but ${higher} has the higher rank`,
    ),
    option(
      `BETWEEN:${higher}>${lower}:${between}`,
      `${higher} is ${countLabel(between, 'place')} above ${lower}`,
      'NUMBER_BETWEEN_CONFUSION',
      `${countLabel(between, 'person')} lie${between === 1 ? 's' : ''} between them; the rank difference is ${difference}`,
    ),
    option(
      `INCLUSIVE:${higher}>${lower}:${inclusive}`,
      `${higher} is ${countLabel(inclusive, 'place')} above ${lower}`,
      'INCLUSIVE_COUNT_CONFUSION',
      `${inclusive} counts both endpoints; the rank difference is ${difference}`,
    ),
  ];
  const options = placeCorrect(correct, wrong, base.correctIndex);
  return {
    options,
    roles: options.map((item) => ({
      answerKey: item.answerKey,
      role: item.misconceptionId as RnkCp004V7OptionRole,
    })),
  };
}

const STEM_VARIANTS: Record<RnkCp004Query['kind'], readonly ((query: any) => string)[]> = {
  HIGHEST_ENTITY: [
    () => 'Who ranked first?',
    () => 'Who obtained the top position?',
    () => 'Which person was placed highest?',
    () => 'Who secured the highest rank?',
  ],
  LOWEST_ENTITY: [
    () => 'Who finished last in the ranking?',
    () => 'Who occupied the bottom position?',
    () => 'Which person was placed lowest?',
    () => 'Who received the lowest rank?',
  ],
  ENTITY_AT_EXACT_RANK: [
    (query) => `Who stood ${ordinal(query.rankFromTop)} from the top?`,
    (query) => `Which person occupied rank ${query.rankFromTop}?`,
    (query) => `Who was placed ${ordinal(query.rankFromTop)} in the final order?`,
  ],
  RANK_OF_NAMED_ENTITY: [
    (query) => `What was ${query.target}'s position from the top?`,
    (query) => `At what rank from the top was ${query.target} placed?`,
    (query) => `Which rank did ${query.target} hold from the top?`,
  ],
  MIDDLE_ENTITY: [
    () => 'Who occupied the middle rank?',
    () => 'Which person was in the middle position?',
    () => 'Who stood exactly in the middle of the order?',
  ],
  COMPLETE_ORDER: [
    () => 'Which option gives the correct complete ranking from highest to lowest?',
    () => 'Which of the following is the correct final order?',
    () => 'Select the arrangement that satisfies all the comparisons.',
  ],
  RELATIVE_ORDER_OF_PAIR: [
    (query) => `Who ranks higher between ${query.first} and ${query.second}?`,
    (query) => `Which statement correctly compares ${query.first} and ${query.second}?`,
    (query) => `What can be concluded about the relative ranks of ${query.first} and ${query.second}?`,
  ],
  IMMEDIATE_NEIGHBOUR: [
    (query) => `Who is immediately ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`,
    (query) => `Which person occupies the position directly ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target}?`,
    (query) => `Who stands just ${query.direction === 'ABOVE' ? 'above' : 'below'} ${query.target} in the ranking?`,
  ],
  VALID_RANK_STATEMENT: [
    () => 'Which statement must be true?',
    () => 'Which of the following relations is definitely correct?',
    () => 'Which conclusion necessarily follows from the comparisons?',
  ],
  MISSING_COMPARISON: [
    () => 'Which additional statement fixes one unique complete order?',
    () => 'Which extra comparison is sufficient to determine the full ranking uniquely?',
    () => 'Which additional information makes the complete ranking certain?',
  ],
};

function stemVariant(
  base: RnkCp004V6Question,
): { readonly stem: string; readonly id: string } {
  const query = base.displayedEvidence.query;
  const pool = STEM_VARIANTS[query.kind];
  let index = Math.abs(base.seed + RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.indexOf(base.prototypeId)) % pool.length;
  if (base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    const variants = [
      `How many places apart are ${query.kind === 'RELATIVE_ORDER_OF_PAIR' ? query.first : ''} and ${query.kind === 'RELATIVE_ORDER_OF_PAIR' ? query.second : ''}, and who ranks higher?`,
      `Which option correctly states the positional gap between ${query.kind === 'RELATIVE_ORDER_OF_PAIR' ? query.first : ''} and ${query.kind === 'RELATIVE_ORDER_OF_PAIR' ? query.second : ''}?`,
      `What is the rank difference between ${query.kind === 'RELATIVE_ORDER_OF_PAIR' ? query.first : ''} and ${query.kind === 'RELATIVE_ORDER_OF_PAIR' ? query.second : ''}?`,
    ];
    index = Math.abs(base.seed) % variants.length;
    return { stem: replaceLastNonEmptyLine(base.stem, variants[index]), id: `EXACT_DISTANCE_${index}` };
  }
  return {
    stem: replaceLastNonEmptyLine(base.stem, pool[index](query)),
    id: `${query.kind}_${index}`,
  };
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

function repairGrammar(text: string): string {
  return text
    .replace(/There are 1 people between them/g, 'There is 1 person between them')
    .replace(/1 people between them/g, '1 person between them')
    .replace(/1 people\b/g, '1 person')
    .replace(/1 persons\b/g, '1 person')
    .replace(/rank positions above/g, 'places above')
    .replace(/1 places above/g, '1 place above');
}

function compactMissingComparisonHelp(lines: readonly string[]): readonly string[] {
  return lines.map((line) => {
    const match = line.match(/^(Option [A-D]) still allows (.+?) and (.+?), so the ranking is not unique\.$/);
    if (!match) return repairGrammar(line);
    return `${match[1]} permits ${match[2]}; another valid interleaving also remains, so it is insufficient.`;
  });
}

function endpointHelp(
  base: RnkCp004V6Question,
  options: readonly RnkCp004Option[],
  order: readonly string[],
): readonly string[] | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'HIGHEST_ENTITY' && query.kind !== 'LOWEST_ENTITY') return null;
  return options
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.answerKey !== base.answerKey)
    .map(({ item, index }) => {
      const rank = order.indexOf(item.answerKey) + 1;
      return `Option ${String.fromCharCode(65 + index)}: ${item.label} is ${ordinal(rank)} in the completed order, not ${query.kind === 'HIGHEST_ENTITY' ? 'first' : 'last'}.`;
    });
}

function explanationVariation(
  base: RnkCp004V6Question,
  lines: readonly string[],
): { readonly lines: readonly string[]; readonly id: string } {
  const variant = Math.abs(base.seed + 2 * RNK_CP004_REMODEL_V7_PROTOTYPE_IDS.indexOf(base.prototypeId)) % 3;
  const replacements: readonly Record<string, string>[] = [
    {},
    {
      'Form the segments:': 'Link the useful comparisons:',
      'Complete order:': 'Final order:',
      'The shortest relevant chain is:': 'Only this chain is needed:',
      'Existing block 1:': 'First ordered block:',
      'Existing block 2:': 'Second ordered block:',
      'Numbering from the top:': 'Assign ranks from the top:',
    },
    {
      'Form the segments:': 'Build the order in short parts:',
      'Complete order:': 'Combined ranking:',
      'The shortest relevant chain is:': 'The decisive chain is:',
      'Existing block 1:': 'Ordered group 1:',
      'Existing block 2:': 'Ordered group 2:',
      'Numbering from the top:': 'Mark the positions from the top:',
    },
  ];
  const map = replacements[variant];
  const varied = lines.map((rawLine) => {
    let line = repairGrammar(rawLine);
    for (const [source, target] of Object.entries(map)) {
      if (line.startsWith(source)) line = `${target}${line.slice(source.length)}`;
    }
    return line;
  });
  return { lines: varied, id: `EXPLANATION_${variant}` };
}

function requiresFullReconstruction(
  query: RnkCp004Query,
  prototypeId: RnkCp004RemodelV7PrototypeId,
): boolean {
  return query.kind === 'ENTITY_AT_EXACT_RANK'
    || query.kind === 'RANK_OF_NAMED_ENTITY'
    || query.kind === 'MIDDLE_ENTITY'
    || query.kind === 'COMPLETE_ORDER'
    || query.kind === 'IMMEDIATE_NEIGHBOUR'
    || prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID;
}

function taskLoad(
  query: RnkCp004Query,
  prototypeId: RnkCp004RemodelV7PrototypeId,
): number {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 1.2;
  const loads: Record<RnkCp004Query['kind'], number> = {
    HIGHEST_ENTITY: 0.3,
    LOWEST_ENTITY: 0.3,
    ENTITY_AT_EXACT_RANK: 0.8,
    RANK_OF_NAMED_ENTITY: 0.9,
    MIDDLE_ENTITY: 0.6,
    COMPLETE_ORDER: 1,
    RELATIVE_ORDER_OF_PAIR: 0.4,
    IMMEDIATE_NEIGHBOUR: 1,
    VALID_RANK_STATEMENT: 2,
    MISSING_COMPARISON: 2.5,
  };
  return loads[query.kind];
}

function optionCompetitionLoad(
  query: RnkCp004Query,
  prototypeId: RnkCp004RemodelV7PrototypeId,
): number {
  if (prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) return 0.7;
  if (query.kind === 'COMPLETE_ORDER' || query.kind === 'VALID_RANK_STATEMENT') return 0.7;
  if (query.kind === 'MISSING_COMPARISON') return 0.8;
  if (query.kind === 'RELATIVE_ORDER_OF_PAIR') return 0.3;
  return 0.3;
}

function calibratedLabel(
  base: RnkCp004V6Question,
  score: number,
): { readonly label: RnkCp004Difficulty; readonly rules: readonly string[] } {
  const query = base.displayedEvidence.query;
  const features = base.reviewMetadata.reasoningFeatures;
  const entityCount = features.entityCount;
  const shortest = features.shortestProofClueCount;
  const reversed = base.reviewMetadata.languageProfile.reversedClueCount;
  const confirmatory = base.reviewMetadata.clueRoleProfile.confirmatory;
  const rules: string[] = [];
  let label: RnkCp004Difficulty = score <= 5.5 ? 'EASY' : score <= 8.5 ? 'MEDIUM' : 'HARD';

  if (query.kind === 'HIGHEST_ENTITY' || query.kind === 'LOWEST_ENTITY') {
    label = entityCount <= 6 ? 'EASY' : 'MEDIUM';
    rules.push('endpoint lookup: up to six entities Easy; seven or more Medium');
  } else if (query.kind === 'MIDDLE_ENTITY' && entityCount === 5) {
    label = 'EASY';
    rules.push('five-person middle position is an Easy SSC pattern');
  } else if (query.kind === 'RELATIVE_ORDER_OF_PAIR'
    && base.prototypeId !== RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    label = shortest <= 3 ? 'EASY' : 'MEDIUM';
    rules.push('direction-only pair difficulty follows the shortest decisive chain');
  } else if (query.kind === 'RANK_OF_NAMED_ENTITY') {
    label = entityCount <= 5 ? 'EASY' : 'MEDIUM';
    rules.push('named-rank chain capped at Medium without an additional transformation');
  } else if (query.kind === 'IMMEDIATE_NEIGHBOUR') {
    label = entityCount <= 5 ? 'EASY' : 'MEDIUM';
    rules.push('standard immediate-neighbour reconstruction capped at Medium');
  } else if (query.kind === 'COMPLETE_ORDER') {
    label = entityCount <= 5 ? 'EASY' : 'MEDIUM';
    rules.push('five-person complete order is Easy; longer direct orders are Medium');
  } else if (query.kind === 'VALID_RANK_STATEMENT') {
    label = 'MEDIUM';
    rules.push('definitely-true transitive inference has a Medium floor');
  } else if (query.kind === 'MISSING_COMPARISON') {
    label = entityCount >= 7 ? 'HARD' : 'MEDIUM';
    rules.push('unique-block bridging is Hard only for seven or more entities');
  } else if (base.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    label = entityCount >= 8 && reversed >= 2 && confirmatory > 0 ? 'HARD' : 'MEDIUM';
    rules.push('exact distance is Medium unless an eight-person chain adds reversed and confirmatory evidence');
  } else if (query.kind === 'ENTITY_AT_EXACT_RANK') {
    label = entityCount <= 5
      ? 'EASY'
      : entityCount >= 8 && reversed >= 2 && confirmatory > 0
        ? 'HARD'
        : 'MEDIUM';
    rules.push('exact-rank Hard label requires eight entities plus wording and redundancy burden');
  }

  return { label, rules };
}

function difficultyV3(
  base: RnkCp004V6Question,
): RnkCp004DifficultyV3Record {
  const query = base.displayedEvidence.query;
  const features = base.reviewMetadata.reasoningFeatures;
  const language = base.reviewMetadata.languageProfile;
  const clueCount = base.displayedEvidence.clues.length;
  const shortest = features.shortestProofClueCount;
  const distractorCount = base.options.length - 1;
  const components: RnkCp004DifficultyV3Components = {
    answerProofLoad: Number((shortest * 0.55).toFixed(2)),
    irrelevantClueLoad: Number((Math.max(0, clueCount - shortest) * 0.12).toFixed(2)),
    reversedClueLoad: Number((language.reversedClueCount * 0.45).toFixed(2)),
    entityScanLoad: Number((Math.max(0, features.entityCount - 5) * 0.15).toFixed(2)),
    confirmatoryLoad: Number((base.reviewMetadata.clueRoleProfile.confirmatory * 0.2).toFixed(2)),
    fullReconstructionLoad: requiresFullReconstruction(query, base.prototypeId) ? 0.4 : 0,
    optionCompetitionLoad: optionCompetitionLoad(query, base.prototypeId),
    taskLoad: taskLoad(query, base.prototypeId),
    ambiguityLoad: query.kind === 'MISSING_COMPARISON' ? 2 : 0,
  };
  const score = Number(Object.values(components).reduce((total, value) => total + value, 0).toFixed(2));
  const calibrated = calibratedLabel(base, score);
  const reasons = [
    `${shortest}-clue shortest answer proof`,
    `${clueCount - shortest} displayed clue(s) outside the shortest answer proof`,
    `${language.reversedClueCount} reversed-wording clue(s)`,
    `${base.reviewMetadata.clueRoleProfile.confirmatory} confirmatory clue(s)`,
    `${distractorCount} distractors across ${base.options.length} options`,
    ...(requiresFullReconstruction(query, base.prototypeId) ? ['complete positional reconstruction is required'] : []),
    ...(query.kind === 'MISSING_COMPARISON' ? ['two ordered blocks must be joined uniquely'] : []),
  ];
  return {
    modelId: RNK_CP004_DIFFICULTY_MODEL_V3_ID,
    score,
    label: calibrated.label,
    components,
    reasons,
    calibrationRules: calibrated.rules,
  };
}

function internalExplanation(
  base: RnkCp004V6Question,
  lines: readonly string[],
  options: readonly RnkCp004Option[],
  answer: string,
): RnkCp004V6Question['explanation'] {
  return {
    ...base.explanation,
    stepByStepSolution: [...lines],
    optionAnalysis: options.map(
      (item, index) => `Option ${String.fromCharCode(65 + index)} (${item.label}): ${repairGrammar(item.explanation)}.`,
    ),
    conclusion: `Answer: ${answer}.`,
  };
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV7PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV6(prototypeId, seed, correctIndexOverride);
  const order = solvedOrder(base);
  const directionOptions = directionOnlyOptions(base, order);
  const distanceOptions = exactDistanceOptions(base, order);
  const selected = directionOptions ?? distanceOptions;
  const options = (selected?.options ?? base.options).map((item) => ({
    ...item,
    label: repairGrammar(item.label),
    explanation: repairGrammar(item.explanation),
  }));
  const answer = options[base.correctIndex].label;
  const stem = stemVariant(base);
  const explanation = explanationVariation(base, base.visibleExplanation.lines);
  const endpoint = endpointHelp(base, options, order);
  const optionAnalysis = endpoint
    ?? (base.displayedEvidence.query.kind === 'MISSING_COMPARISON'
      ? compactMissingComparisonHelp(base.visibleExplanation.optionAnalysis ?? [])
      : (base.visibleExplanation.optionAnalysis ?? []).map(repairGrammar));
  const optionRoles: readonly RnkCp004V7OptionRoleRecord[] = selected?.roles
    ?? base.reviewMetadata.optionRoleMetadata.map((record) => ({
      answerKey: record.answerKey,
      role: record.role as RnkCp004V7OptionRole,
    }));
  const difficulty = difficultyV3({ ...base, options } as RnkCp004V6Question);
  const optionSemanticMode: RnkCp004EditorialDiversityProfile['optionSemanticMode'] = directionOptions
    ? 'DIRECTION_ONLY'
    : distanceOptions
      ? 'EXACT_DISTANCE'
      : 'STANDARD';

  return {
    ...base,
    stem: stem.stem,
    options,
    answer,
    difficulty: difficulty.label,
    explanation: internalExplanation(base, explanation.lines, options, answer),
    visibleExplanation: {
      ...base.visibleExplanation,
      lines: explanation.lines,
      answer,
      optionAnalysis,
      optionAnalysisDisplay: 'NATIVE_COLLAPSED',
    },
    mathematicalFingerprint: `${base.mathematicalFingerprint}:ENGLISH_REMODEL_V7:${stem.id}:${explanation.id}:${optionSemanticMode}`,
    reviewMetadata: {
      ...base.reviewMetadata,
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V7',
      difficultyModel: difficulty,
      optionRoleMetadata: optionRoles,
      editorialDiversityProfile: {
        stemVariantId: stem.id,
        explanationVariantId: explanation.id,
        distractorCount: 3,
        optionCountInvariantSatisfied: true,
        optionSemanticMode,
        mockOptionHelpMode: 'COMPACT',
      },
      examAuthenticityStatus: 'TARGETED_REVIEW_PENDING',
      difficultyProfile: {
        ...base.reviewMetadata.difficultyProfile,
        featureScore: difficulty.score,
      },
      reasoningFeatures: {
        ...base.reviewMetadata.reasoningFeatures,
        featureScore: difficulty.score,
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V7:${stem.id}:${explanation.id}:${optionSemanticMode}`,
    },
  };
}
