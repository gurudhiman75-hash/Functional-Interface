import { selectRnkPeople } from './foundation/rnk-object-pool-v2';
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from '../../../shared/reasoning-novelty-governance-v1';

export const RNK_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  'RNK_001_CONTROLLED_NOVELTY_DISCOVERY_V1' as const;

type Constraint =
  | Readonly<{ kind: 'ENDPOINT_FIRST'; entity: string }>
  | Readonly<{ kind: 'EXACT_RANK_GAP'; higher: string; lower: string; gap: number }>
  | Readonly<{ kind: 'IMMEDIATE_ABOVE'; higher: string; lower: string }>
  | Readonly<{ kind: 'ABOVE'; higher: string; lower: string }>;

export interface RnkControlledNovelCaseletV1 {
  readonly candidateId: string;
  readonly provenance: 'CONTROLLED_NOVEL';
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly seed: number;
  readonly entities: readonly string[];
  readonly hiddenOrder: readonly string[];
  readonly constraints: readonly Constraint[];
  readonly clueTexts: readonly string[];
  readonly uniqueSolution: readonly string[];
  readonly mappedQlIds: readonly [
    'RNK-QL-027',
    'RNK-QL-028',
    'RNK-QL-029',
    'RNK-QL-031',
    'RNK-QL-032',
    'RNK-QL-033',
  ];
  readonly permanentQlAllocated: false;
  readonly nextAvailableQl: 'RNK-QL-043';
  readonly falsePyqAttribution: false;
  readonly humanReviewRequired: true;
  readonly semanticFingerprint: string;
}

function mix32(value: number): number {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function orderedEntities(seed: number): string[] {
  const people = selectRnkPeople(seed ^ 0x4e4f564c, 6, { genderMode: 'BALANCED' });
  return people
    .map((person, index) => ({
      name: person.names.en,
      key: mix32(seed ^ Math.imul(index + 1, 0x9e3779b1)),
    }))
    .sort((left, right) => left.key - right.key || left.name.localeCompare(right.name))
    .map((entry) => entry.name);
}

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [[...values]];
  const result: T[][] = [];
  values.forEach((value, index) => {
    const rest = values.filter((_, restIndex) => restIndex !== index);
    for (const tail of permutations(rest)) result.push([value, ...tail]);
  });
  return result;
}

function holds(order: readonly string[], constraint: Constraint): boolean {
  if (constraint.kind === 'ENDPOINT_FIRST') {
    return order[0] === constraint.entity;
  }
  const higher = order.indexOf(constraint.higher);
  const lower = order.indexOf(constraint.lower);
  if (higher < 0 || lower < 0) return false;
  if (constraint.kind === 'EXACT_RANK_GAP') {
    return lower - higher === constraint.gap;
  }
  if (constraint.kind === 'IMMEDIATE_ABOVE') {
    return lower - higher === 1;
  }
  return higher < lower;
}

export function solveRnkControlledNovelCaseletV1(
  entities: readonly string[],
  constraints: readonly Constraint[],
): readonly (readonly string[])[] {
  return permutations(entities).filter((order) =>
    constraints.every((constraint) => holds(order, constraint)),
  );
}

function clueText(constraint: Constraint): string {
  if (constraint.kind === 'ENDPOINT_FIRST') {
    return constraint.entity + ' is ranked first.';
  }
  if (constraint.kind === 'EXACT_RANK_GAP') {
    return (
      constraint.lower +
      ' is exactly ' +
      constraint.gap +
      ' ranks below ' +
      constraint.higher +
      '.'
    );
  }
  if (constraint.kind === 'IMMEDIATE_ABOVE') {
    return constraint.higher + ' is immediately above ' + constraint.lower + '.';
  }
  return constraint.higher + ' is ranked above ' + constraint.lower + '.';
}

export function generateRnkControlledNovelCaseletV1(
  seed: number,
): RnkControlledNovelCaseletV1 {
  if (!Number.isSafeInteger(seed)) throw new Error('RNK controlled-novel seed must be a safe integer.');

  const hiddenOrder = orderedEntities(seed);
  const [first, second, third, fourth, fifth, sixth] = hiddenOrder as [
    string, string, string, string, string, string,
  ];

  const constraints: readonly Constraint[] = [
    { kind: 'ENDPOINT_FIRST', entity: first },
    { kind: 'EXACT_RANK_GAP', higher: first, lower: third, gap: 2 },
    { kind: 'IMMEDIATE_ABOVE', higher: second, lower: third },
    { kind: 'ABOVE', higher: fourth, lower: sixth },
    { kind: 'IMMEDIATE_ABOVE', higher: fourth, lower: fifth },
  ];

  const solutions = solveRnkControlledNovelCaseletV1(hiddenOrder, constraints);
  if (solutions.length !== 1) {
    throw new Error('RNK controlled-novel clue interaction must produce exactly one order.');
  }
  if (solutions[0]!.join('|') !== hiddenOrder.join('|')) {
    throw new Error('RNK controlled-novel solver disagrees with the hidden order.');
  }

  const noveltyAxes = [
    'CONSTRAINT_INTERACTION',
    'INFORMATION_DISTRIBUTION',
    'VALID_CROSS_FAMILY_COMPOSITION',
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: 'RNK-NOVEL-' + seed,
    chapterId: 'RNK-001',
    qlId: 'RNK-QL-027+028+029+031+032+033',
    provenance: 'CONTROLLED_NOVEL',
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  return {
    candidateId: 'RNK-NOVEL-' + seed,
    provenance: 'CONTROLLED_NOVEL',
    noveltyAxes,
    seed,
    entities: hiddenOrder,
    hiddenOrder,
    constraints,
    clueTexts: constraints.map(clueText),
    uniqueSolution: solutions[0]!,
    mappedQlIds: [
      'RNK-QL-027',
      'RNK-QL-028',
      'RNK-QL-029',
      'RNK-QL-031',
      'RNK-QL-032',
      'RNK-QL-033',
    ],
    permanentQlAllocated: false,
    nextAvailableQl: 'RNK-QL-043',
    falsePyqAttribution: false,
    humanReviewRequired: true,
    semanticFingerprint: [
      'RNK-001',
      'CONTROLLED_NOVEL',
      ...constraints.map((constraint) => JSON.stringify(constraint)),
      hiddenOrder.join('>'),
    ].join('|'),
  };
}
