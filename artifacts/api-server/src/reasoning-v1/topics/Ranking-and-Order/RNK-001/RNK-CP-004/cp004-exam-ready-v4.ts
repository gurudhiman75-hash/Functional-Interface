import {
  reconstructUniqueOrder,
  type RnkCp004Comparison,
  type RnkCp004Evidence,
  type RnkCp004PrototypeId,
} from './cp004-foundation';
import {
  countTopologicalOrders,
  generateRnkCp004ExamReadyQuestion as generateV3,
  type RnkCp004ExamReadyQuestion,
} from './cp004-exam-ready-v3';

export { countTopologicalOrders } from './cp004-exam-ready-v3';
export type { RnkCp004ExamReadyQuestion } from './cp004-exam-ready-v3';

function relationKey(comparison: RnkCp004Comparison): string {
  return `${comparison.higher}>${comparison.lower}`;
}

function relationLabel(key: string): string {
  const [higher, lower] = key.split('>');
  return `${higher} ranks above ${lower}`;
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

export function generateRnkCp004ExamReadyQuestion(
  prototypeId: RnkCp004PrototypeId,
  seed: number,
  correctIndexOverride?: number,
): RnkCp004ExamReadyQuestion {
  const question = generateV3(prototypeId, seed, correctIndexOverride);
  const query = question.displayedEvidence.query;
  if (query.kind !== 'MISSING_COMPARISON') return question;

  const bridge = query.candidates.find((candidate) => relationKey(candidate) === question.answerKey);
  if (!bridge) throw new Error(`Bridge answer missing at ${prototypeId}:${seed}`);
  const blocks = connectedBlocks(question.displayedEvidence);
  const upper = blocks.find((block) => block.includes(bridge.higher));
  const lower = blocks.find((block) => block.includes(bridge.lower));
  if (!upper || !lower || upper === lower) throw new Error(`Bridge does not join two blocks at ${prototypeId}:${seed}`);
  const finalOrder = reconstructUniqueOrder(
    question.displayedEvidence.entities,
    [...question.displayedEvidence.clues, bridge],
  );
  const lines = [
    `Fixed blocks: upper ${upper.join(' > ')}  |  lower ${lower.join(' > ')}`,
    `Join the bottom of the upper block to the top of the lower block: ${relationLabel(question.answerKey)}.`,
    `Unique order: ${finalOrder.join(' > ')}`,
  ];

  return {
    ...question,
    visibleExplanation: {
      ...question.visibleExplanation,
      lines,
    },
    explanation: {
      ...question.explanation,
      stepByStepSolution: lines,
    },
  };
}
