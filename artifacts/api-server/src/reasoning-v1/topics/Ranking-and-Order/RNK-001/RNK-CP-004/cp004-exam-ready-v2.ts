import {
  generateRnkCp004Question,
  hashText,
  reconstructUniqueOrder,
  solveCp004Independently,
  type RnkCp004Comparison,
  type RnkCp004Evidence,
  type RnkCp004Option,
  type RnkCp004PrototypeId,
} from './cp004-foundation';
import {
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV1,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready';

export { countTopologicalOrders } from './cp004-exam-ready';
export type { RnkCp004ExamReadyQuestion } from './cp004-exam-ready';

const REVIEW_SEEDS = [0, 1, 2, 7, 31, 97] as const;
const VALID_REVIEW_INDEX_SEQUENCE = [1, 0, 2, 3, 2, 1] as const;

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
}

function isDirectClue(clues: readonly RnkCp004Comparison[], comparison: RnkCp004Comparison): boolean {
  return clues.some(
    (clue) => clue.higher === comparison.higher && clue.lower === comparison.lower,
  );
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

function buildCandidates(
  order: readonly string[],
  clues: readonly RnkCp004Comparison[],
  seed: number,
): readonly RnkCp004Comparison[] {
  const truePool: RnkCp004Comparison[] = [];
  for (let higherIndex = 0; higherIndex < order.length - 2; higherIndex += 1) {
    for (let lowerIndex = higherIndex + 2; lowerIndex < order.length; lowerIndex += 1) {
      const candidate = { higher: order[higherIndex], lower: order[lowerIndex] };
      if (!isDirectClue(clues, candidate)) truePool.push(candidate);
    }
  }
  if (truePool.length === 0) throw new Error('No non-direct transitive conclusion is available');
  const correct = truePool[hashText(`statement-v2:${seed}:${order.join('|')}`) % truePool.length];
  const falsePool: RnkCp004Comparison[] = [];
  for (let lowerIndex = 1; lowerIndex < order.length; lowerIndex += 1) {
    for (let higherIndex = 0; higherIndex < lowerIndex; higherIndex += 1) {
      falsePool.push({ higher: order[lowerIndex], lower: order[higherIndex] });
    }
  }
  const offset = hashText(`statement-v2-false:${seed}:${order.join('|')}`) % falsePool.length;
  const rotated = [...falsePool.slice(offset), ...falsePool.slice(0, offset)];
  return [correct, ...rotated.slice(0, 3)];
}

function correctIndex(seed: number): number {
  const seedIndex = REVIEW_SEEDS.indexOf(seed as (typeof REVIEW_SEEDS)[number]);
  if (seedIndex >= 0) return VALID_REVIEW_INDEX_SEQUENCE[seedIndex];
  return hashText(`cp004-reviewed-v2-correct:VALID:${seed}`) % 4;
}

function renderClue(clue: RnkCp004Comparison, index: number, seed: number): string {
  const variant = (index + Math.abs(seed)) % 4;
  if (variant === 0) return `${clue.higher} ranks above ${clue.lower}.`;
  if (variant === 1) return `${clue.lower} is ranked below ${clue.higher}.`;
  if (variant === 2) return `${clue.higher} has a better rank than ${clue.lower}.`;
  return `${clue.higher} is placed before ${clue.lower} in the ranking.`;
}

function placeOptions(
  candidates: readonly RnkCp004Comparison[],
  answerKey: string,
  order: readonly string[],
  index: number,
): readonly RnkCp004Option[] {
  const positions = new Map(order.map((entity, position) => [entity, position]));
  const correct = candidates.find((candidate) => relationKey(candidate) === answerKey)!;
  const correctOption: RnkCp004Option = {
    answerKey,
    label: relationLabel(answerKey),
    misconceptionId: 'CORRECT',
    explanation: `The transitive comparison path proves that ${correct.higher} ranks above ${correct.lower}`,
  };
  const wrong = candidates
    .filter((candidate) => relationKey(candidate) !== answerKey)
    .map((candidate): RnkCp004Option => ({
      answerKey: relationKey(candidate),
      label: relationLabel(relationKey(candidate)),
      misconceptionId: 'RELATION_REVERSED',
      explanation: `${candidate.higher} appears below ${candidate.lower} in the reconstructed order`,
    }));
  if (!(positions.get(correct.higher)! < positions.get(correct.lower)!)) {
    throw new Error('Invalid V2 conclusion answer');
  }
  const options: RnkCp004Option[] = [];
  let wrongIndex = 0;
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    options.push(optionIndex === index ? correctOption : wrong[wrongIndex++]);
  }
  return options;
}

function fingerprintFor(evidence: RnkCp004Evidence): string {
  const clueKeys = evidence.clues.map(relationKey).sort();
  const query = evidence.query.kind === 'VALID_RANK_STATEMENT'
    ? { ...evidence.query, candidates: evidence.query.candidates.map(relationKey).sort() }
    : evidence.query;
  return `${evidence.entities.length}:${clueKeys.join(',')}:${JSON.stringify(query)}:ENGLISH_REMODEL_V2`;
}

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004PrototypeId,
  seed: number,
): RnkCp004ExamReadyQuestion {
  if (prototypeId !== 'RNK-CP004-PROT-VALID-RANK-STATEMENT') {
    return generateV1(prototypeId, seed);
  }

  const raw = generateRnkCp004Question(prototypeId, seed);
  const order = reconstructUniqueOrder(raw.displayedEvidence.entities, raw.displayedEvidence.clues);
  const candidates = buildCandidates(order, raw.displayedEvidence.clues, seed);
  const evidence: RnkCp004Evidence = {
    ...raw.displayedEvidence,
    query: { kind: 'VALID_RANK_STATEMENT', candidates },
  };
  const answerKey = solveCp004Independently(evidence);
  const answer = relationLabel(answerKey);
  const optionIndex = correctIndex(seed);
  const options = placeOptions(candidates, answerKey, order, optionIndex);
  const [higher, lower] = answerKey.split('>');
  const path = shortestPath(evidence.clues, higher, lower);
  const stem = `${evidence.entities.length} candidates are ranked from highest to lowest.\n\n${evidence.clues
    .map((clue, clueIndex) => `- ${renderClue(clue, clueIndex, seed)}`)
    .join('\n')}\n\nWhich of the following conclusions follows from the information?`;
  const score = evidence.entities.length - 5
    + Math.max(0, evidence.clues.length - (evidence.entities.length - 1))
    + 2;

  return {
    ...raw,
    stem,
    displayedEvidence: evidence,
    answerKey,
    answer,
    options,
    correctIndex: optionIndex,
    difficulty: score <= 2 ? 'EASY' : score <= 5 ? 'MEDIUM' : 'HARD',
    explanation: {
      mentalPicture: 'A conclusion follows only when a comparison path proves it.',
      keyRule: 'A correct conclusion may be transitive; it must be true in the unique reconstructed order and must not merely repeat a clue.',
      stepByStepSolution: [
        `The decisive path is ${path?.join(' > ') ?? order.join(' > ')}.`,
        `This proves that ${higher} ranks above ${lower}.`,
        'Each other option reverses the order of its named pair.',
      ],
      examSpeedShortcut: 'For each option, search for a short supporting path; reject it immediately if the path runs in the opposite direction.',
      optionAnalysis: options.map(
        (option, currentIndex) => `Option ${String.fromCharCode(65 + currentIndex)} (${option.label}): ${option.explanation}.`,
      ),
      conclusion: `Answer: ${answer}.`,
    },
    mathematicalFingerprint: fingerprintFor(evidence),
    reviewMetadata: {
      stableQuestionId: `RNK-CP004-P09-S${String(seed).padStart(4, '0')}`,
      authorityCandidateId: 'VALID_RANK_STATEMENT',
      competency: 'Identify a transitive conclusion that follows',
      intendedExamFamilies: ['SSC', 'BANKING', 'PUNJAB_STATE'],
      generationVersion: 'RNK_CP004_ENGLISH_REMODEL_V1',
      reviewStatus: 'REVIEW_PENDING',
      answerDirectlyStatedInClue: false,
      immediateNeighbourDirectEdgeRequired: false,
    },
  };
}
