import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
  type RnkCp004Option,
} from './cp004-foundation';
import {
  RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID,
} from './cp004-exam-ready-v5';
import {
  RNK_CP004_REMODEL_V4_PROTOTYPE_IDS,
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV4,
  type RnkCp004ExamReadyQuestion as RnkCp004V4Question,
  type RnkCp004RemodelV4PrototypeId,
} from './cp004-exam-ready-v6';

export { countTopologicalOrders, RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID };

export const RNK_CP004_REMODEL_V5_PROTOTYPE_IDS = RNK_CP004_REMODEL_V4_PROTOTYPE_IDS;
export type RnkCp004RemodelV5PrototypeId = RnkCp004RemodelV4PrototypeId;

export const RNK_CP004_DIFFICULTY_MODEL_ID = 'RNK_CP004_DIFFICULTY_V1' as const;

export type RnkCp004OptionRole =
  | 'CORRECT_MULTI_STATEMENT_CONCLUSION'
  | 'TRUE_DIRECT_SINGLE_CLUE'
  | 'FALSE_REVERSE_OF_DIRECT_CLUE'
  | 'FALSE_REVERSE_OF_TRANSITIVE_CONCLUSION'
  | 'STANDARD_DISTRACTOR';

export interface RnkCp004OptionRoleRecord {
  readonly answerKey: string;
  readonly role: RnkCp004OptionRole;
}

export interface RnkCp004EdgeContract {
  readonly coreReductionEdges: number;
  readonly displayedAdjacentEdges: number;
  readonly displayedNonAdjacentEdges: number;
  readonly addedConfirmatoryNonAdjacentEdges: number;
}

export interface RnkCp004ProofCountingContract {
  readonly mode: 'ORDINARY' | 'OPTION_AUGMENTATION';
  readonly shortestBaseClueProof: number;
  readonly selectedOptionRelations: 0 | 1;
  readonly completedProofRelations: number;
}

export interface RnkCp004DifficultyModelRecord {
  readonly modelId: typeof RNK_CP004_DIFFICULTY_MODEL_ID;
  readonly score: number;
  readonly label: RnkCp004V4Question['difficulty'];
  readonly components: RnkCp004V4Question['reviewMetadata']['difficultyProfile'];
}

export interface RnkCp004LearnerRendererContract {
  readonly disclosureComponent: 'NATIVE_COLLAPSED';
  readonly defaultOpen: false;
  readonly learnerLabel: 'Why are the other options wrong?';
  readonly accessibilityLabel: 'Show why the other options are wrong';
  readonly rawHtmlAllowed: false;
  readonly adminClueNotesVisibleToLearner: false;
  readonly requiredWidthTargets: readonly [360, 390, 430];
}

export type RnkCp004ExamReadyQuestion = Omit<
  RnkCp004V4Question,
  | 'displayedEvidence'
  | 'answer'
  | 'options'
  | 'explanation'
  | 'visibleExplanation'
  | 'mathematicalFingerprint'
  | 'reviewMetadata'
> & {
  readonly displayedEvidence: RnkCp004V4Question['displayedEvidence'];
  readonly answer: string;
  readonly options: readonly RnkCp004Option[];
  readonly explanation: RnkCp004V4Question['explanation'];
  readonly visibleExplanation: Omit<
    RnkCp004V4Question['visibleExplanation'],
    'verificationNote'
  > & {
    readonly optionAnalysisDisplay: 'NATIVE_COLLAPSED';
  };
  readonly mathematicalFingerprint: string;
  readonly reviewMetadata: Omit<
    RnkCp004V4Question['reviewMetadata'],
    'generationVersion'
  > & {
    readonly generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V5';
    readonly edgeContract: RnkCp004EdgeContract;
    readonly proofCountingContract: RnkCp004ProofCountingContract;
    readonly difficultyModel: RnkCp004DifficultyModelRecord;
    readonly optionRoleMetadata: readonly RnkCp004OptionRoleRecord[];
    readonly adminClueRoleNotes: readonly string[];
    readonly learnerRendererContract: RnkCp004LearnerRendererContract;
  };
};

function relationKey(clue: RnkCp004Comparison): string {
  return `${clue.higher}>${clue.lower}`;
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
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

function solvedOrder(question: RnkCp004V4Question): readonly string[] {
  const evidence = question.displayedEvidence;
  if (evidence.query.kind !== 'MISSING_COMPARISON') {
    return reconstructUniqueOrder(evidence.entities, evidence.clues);
  }
  const bridge = evidence.query.candidates.find((candidate) => relationKey(candidate) === question.answerKey);
  if (!bridge) throw new Error(`Missing bridge for ${question.reviewMetadata.stableQuestionId}`);
  return reconstructUniqueOrder(evidence.entities, [...evidence.clues, bridge]);
}

function optionFrom(
  answerKey: string,
  misconceptionId: string,
  explanation: string,
): RnkCp004Option {
  return {
    answerKey,
    label: relationLabel(answerKey),
    misconceptionId,
    explanation,
  };
}

function placeCorrect(
  correct: RnkCp004Option,
  wrong: readonly RnkCp004Option[],
  correctIndex: number,
): readonly RnkCp004Option[] {
  if (wrong.length !== 3) throw new Error(`Expected three distractors, found ${wrong.length}`);
  const options: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    options.push(index === correctIndex ? correct : wrong[wrongIndex++]);
  }
  return options;
}

function conclusionOptions(
  base: RnkCp004V4Question,
): {
  readonly evidence: RnkCp004V4Question['displayedEvidence'];
  readonly options: readonly RnkCp004Option[];
  readonly roles: readonly RnkCp004OptionRoleRecord[];
} {
  const evidence = base.displayedEvidence;
  if (evidence.query.kind !== 'VALID_RANK_STATEMENT') {
    return {
      evidence,
      options: base.options,
      roles: base.options.map((option) => ({ answerKey: option.answerKey, role: 'STANDARD_DISTRACTOR' as const })),
    };
  }

  const correctPath = (() => {
    const [higher, lower] = base.answerKey.split('>');
    return shortestPath(evidence.clues, higher, lower);
  })();
  if (!correctPath || correctPath.length < 3) {
    throw new Error(`Correct conclusion lacks a multi-clue path at ${base.reviewMetadata.stableQuestionId}`);
  }

  const directRole = base.reviewMetadata.clueRoleProfile.roles.find((role) =>
    role.proofRole === 'ESSENTIAL_FOR_FULL_ORDER'
      && role.edgeDistanceClass === 'ADJACENT'
      && relationKey(evidence.clues[role.index]) !== base.answerKey);
  if (!directRole) throw new Error(`No direct-true distractor is available at ${base.reviewMetadata.stableQuestionId}`);
  const direct = evidence.clues[directRole.index];
  const remaining = evidence.clues.filter((_, index) => index !== directRole.index);
  if (shortestPath(remaining, direct.higher, direct.lower)) {
    throw new Error(`Direct-true distractor also has a multi-clue proof at ${base.reviewMetadata.stableQuestionId}`);
  }

  const directKey = relationKey(direct);
  const directReverseKey = `${direct.lower}>${direct.higher}`;
  const [correctHigher, correctLower] = base.answerKey.split('>');
  const transitiveReverseKey = `${correctLower}>${correctHigher}`;

  const correct = optionFrom(
    base.answerKey,
    'CORRECT_MULTI_STATEMENT_CONCLUSION',
    `This conclusion follows through ${correctPath.length - 1} displayed comparison links`,
  );
  const wrong = [
    optionFrom(
      directKey,
      'TRUE_DIRECT_SINGLE_CLUE',
      'This relation is true, but it is stated directly and does not require two or more statements',
    ),
    optionFrom(
      directReverseKey,
      'FALSE_REVERSE_OF_DIRECT_CLUE',
      `This reverses the displayed relation ${direct.higher} > ${direct.lower}`,
    ),
    optionFrom(
      transitiveReverseKey,
      'FALSE_REVERSE_OF_TRANSITIVE_CONCLUSION',
      `This reverses the multi-statement path ${correctPath.join(' > ')}`,
    ),
  ];
  const options = placeCorrect(correct, wrong, base.correctIndex);
  const candidates = options.map((option) => {
    const [higher, lower] = option.answerKey.split('>');
    return { higher, lower };
  });
  return {
    evidence: {
      ...evidence,
      query: {
        kind: 'VALID_RANK_STATEMENT',
        candidates,
      },
    },
    options,
    roles: options.map((option): RnkCp004OptionRoleRecord => ({
      answerKey: option.answerKey,
      role: option.misconceptionId as RnkCp004OptionRole,
    })),
  };
}

function groupedEndpointAnalysis(
  base: RnkCp004V4Question,
  order: readonly string[],
): readonly string[] | null {
  const query = base.displayedEvidence.query;
  if (query.kind !== 'HIGHEST_ENTITY' && query.kind !== 'LOWEST_ENTITY') return null;
  const wrong = base.options
    .filter((option) => option.answerKey !== base.answerKey)
    .map((option) => `${option.label} (${order.indexOf(option.answerKey) + 1}${ordinalSuffix(order.indexOf(option.answerKey) + 1)})`);
  return [
    `The other options are ${wrong.join(', ')} in the completed order, so none is ${query.kind === 'HIGHEST_ENTITY' ? 'highest' : 'lowest'}.`,
  ];
}

function ordinalSuffix(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  if (value % 10 === 1) return 'st';
  if (value % 10 === 2) return 'nd';
  if (value % 10 === 3) return 'rd';
  return 'th';
}

function pairOptionAnalysis(
  question: RnkCp004V4Question,
  options: readonly RnkCp004Option[],
  order: readonly string[],
): readonly string[] | null {
  const query = question.displayedEvidence.query;
  if (query.kind !== 'RELATIVE_ORDER_OF_PAIR') return null;
  const firstIndex = order.indexOf(query.first);
  const secondIndex = order.indexOf(query.second);
  const higher = firstIndex < secondIndex ? query.first : query.second;
  const lower = higher === query.first ? query.second : query.first;

  if (question.prototypeId === RNK_CP004_EXACT_RANK_DIFFERENCE_PROTOTYPE_ID) {
    return options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.answerKey !== question.answerKey)
      .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`);
  }

  const path = shortestPath(question.displayedEvidence.clues, higher, lower);
  if (!path || path.length < 3) {
    throw new Error(`Direction-only pair lacks a visible intermediate at ${question.reviewMetadata.stableQuestionId}`);
  }
  return [
    `The reverse-direction option contradicts ${path.join(' > ')}.`,
    `${path[1]} lies between ${higher} and ${lower}, so the immediate-neighbour options are false.`,
  ];
}

function optionAnalysis(
  base: RnkCp004V4Question,
  options: readonly RnkCp004Option[],
  order: readonly string[],
): readonly string[] {
  if (base.displayedEvidence.query.kind === 'VALID_RANK_STATEMENT') {
    return options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.answerKey !== base.answerKey)
      .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`);
  }
  return groupedEndpointAnalysis(base, order)
    ?? pairOptionAnalysis(base, options, order)
    ?? base.visibleExplanation.optionAnalysis
    ?? options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => option.answerKey !== base.answerKey)
      .map(({ option, index }) => `Option ${String.fromCharCode(65 + index)}: ${option.explanation}.`);
}

function adminClueRoleNotes(base: RnkCp004V4Question): readonly string[] {
  return base.reviewMetadata.clueRoleProfile.roles
    .filter((role) => role.proofRole === 'CONFIRMATORY')
    .map((role) => `${role.clueKey} is confirmatory and is not required by the minimal full-order proof.`);
}

function proofCountingContract(base: RnkCp004V4Question): RnkCp004ProofCountingContract {
  const shortestBaseClueProof = base.reviewMetadata.shortestAnswerProofClues;
  if (base.displayedEvidence.query.kind === 'MISSING_COMPARISON') {
    return {
      mode: 'OPTION_AUGMENTATION',
      shortestBaseClueProof,
      selectedOptionRelations: 1,
      completedProofRelations: shortestBaseClueProof + 1,
    };
  }
  return {
    mode: 'ORDINARY',
    shortestBaseClueProof,
    selectedOptionRelations: 0,
    completedProofRelations: shortestBaseClueProof,
  };
}

function edgeContract(base: RnkCp004V4Question): RnkCp004EdgeContract {
  const topology = base.reviewMetadata.coreTopologyProfile;
  const addedConfirmatoryNonAdjacentEdges = base.reviewMetadata.clueRoleProfile.roles.filter((role) =>
    role.proofRole === 'CONFIRMATORY' && role.edgeDistanceClass === 'NON_ADJACENT').length;
  return {
    coreReductionEdges: topology.transitiveReductionEdgeCount,
    displayedAdjacentEdges: topology.adjacentDisplayedEdges,
    displayedNonAdjacentEdges: topology.nonAdjacentDisplayedEdges,
    addedConfirmatoryNonAdjacentEdges,
  };
}

function internalExplanation(
  base: RnkCp004V4Question,
  options: readonly RnkCp004Option[],
  lines: readonly string[],
  optionAudit: readonly string[],
  answer: string,
): RnkCp004V4Question['explanation'] {
  return {
    mentalPicture: `Internal proof mode: ${base.visibleExplanation.mode}`,
    keyRule: 'The learner view shows only the decisive proof. Distractor help uses a native collapsed component, while clue-role notes remain admin-only.',
    stepByStepSolution: [...lines],
    examSpeedShortcut: '',
    optionAnalysis: options.map(
      (option, index) => `Option ${String.fromCharCode(65 + index)} (${option.label}): ${option.explanation}.`,
    ),
    conclusion: `Answer: ${answer}.`,
  };
}

export function optionSatisfiesRnkCp004Authority(
  question: RnkCp004ExamReadyQuestion,
  answerKey: string,
): boolean {
  const query = question.displayedEvidence.query;
  if (query.kind !== 'VALID_RANK_STATEMENT') return answerKey === question.answerKey;
  const [higher, lower] = answerKey.split('>');
  const direct = question.displayedEvidence.clues.some((clue) => relationKey(clue) === answerKey);
  if (direct) return false;
  const path = shortestPath(question.displayedEvidence.clues, higher, lower);
  return Boolean(path && path.length >= 3);
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004RemodelV5PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const base = generateV4(prototypeId, seed, correctIndexOverride);
  const order = solvedOrder(base);
  const conclusion = conclusionOptions(base);
  const options = conclusion.options;
  const answer = options[base.correctIndex].label;
  const optionAudit = optionAnalysis(base, options, order);
  const visibleExplanation = {
    ...base.visibleExplanation,
    optionAnalysis: optionAudit,
    optionAnalysisDisplay: 'NATIVE_COLLAPSED' as const,
    answer,
  };
  delete (visibleExplanation as { verificationNote?: string }).verificationNote;

  const standardRoles = conclusion.roles.some((role) => role.role !== 'STANDARD_DISTRACTOR')
    ? conclusion.roles
    : options.map((option) => ({
      answerKey: option.answerKey,
      role: 'STANDARD_DISTRACTOR' as const,
    }));

  return {
    ...base,
    displayedEvidence: conclusion.evidence,
    answer,
    options,
    explanation: internalExplanation(base, options, visibleExplanation.lines, optionAudit, answer),
    visibleExplanation,
    mathematicalFingerprint: `${base.mathematicalFingerprint}:ENGLISH_REMODEL_V5:${standardRoles.map((role) => role.role).join('|')}`,
    reviewMetadata: {
      ...base.reviewMetadata,
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V5',
      edgeContract: edgeContract(base),
      proofCountingContract: proofCountingContract(base),
      difficultyModel: {
        modelId: RNK_CP004_DIFFICULTY_MODEL_ID,
        score: base.reviewMetadata.difficultyProfile.featureScore,
        label: base.difficulty,
        components: base.reviewMetadata.difficultyProfile,
      },
      optionRoleMetadata: standardRoles,
      adminClueRoleNotes: adminClueRoleNotes(base),
      learnerRendererContract: {
        disclosureComponent: 'NATIVE_COLLAPSED',
        defaultOpen: false,
        learnerLabel: 'Why are the other options wrong?',
        accessibilityLabel: 'Show why the other options are wrong',
        rawHtmlAllowed: false,
        adminClueNotesVisibleToLearner: false,
        requiredWidthTargets: [360, 390, 430],
      },
      normalizedSemanticFingerprint: `${base.reviewMetadata.normalizedSemanticFingerprint}|V5_OPTION_ROLES:${standardRoles.map((role) => role.role).join('>')}`,
    },
  };
}
