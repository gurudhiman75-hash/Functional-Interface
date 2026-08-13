import { RNK_CP003_PROTOTYPE_IDS, type RnkCp003PrototypeId } from './cp003-model';
import {
  RNK_CP003_SOURCE_PROTOTYPE_IDS,
  type RnkCp003SourcePrototypeId,
} from './cp003-source-wave';

export type RnkCp003AnyPrototypeId = RnkCp003PrototypeId | RnkCp003SourcePrototypeId;

export const RNK_CP003_PERMANENT_QL_IDS = [
  'RNK-QL-018',
  'RNK-QL-019',
  'RNK-QL-020',
  'RNK-QL-021',
  'RNK-QL-022',
  'RNK-QL-023',
  'RNK-QL-024',
  'RNK-QL-025',
  'RNK-QL-026',
] as const;

export type RnkCp003PermanentQlId = (typeof RNK_CP003_PERMANENT_QL_IDS)[number];

export interface RnkCp003Authority {
  readonly qlId: RnkCp003PermanentQlId;
  readonly authorityId: string;
  readonly title: string;
  readonly prototypes: readonly RnkCp003AnyPrototypeId[];
  readonly answerSemantics: readonly string[];
  readonly mergeSplitReason: string;
}

export const RNK_CP003_AUTHORITIES: readonly RnkCp003Authority[] = [
  {
    qlId: 'RNK-QL-018',
    authorityId: 'INTERCHANGE_RANKS_DIRECT_OR_INVERSE',
    title: 'ranks before or after two people interchange positions',
    prototypes: [
      'RNK-CP003-PROT-FINAL-RANKS-AFTER-INTERCHANGE',
      'RNK-CP003-PROT-ORIGINAL-RANKS-FROM-FINAL-INTERCHANGE',
    ],
    answerSemantics: ['RANK_PAIR'],
    mergeSplitReason: 'Direct and inverse questions replay the same two-position swap; query time is a generated direction parameter.',
  },
  {
    qlId: 'RNK-QL-019',
    authorityId: 'TOTAL_FROM_INTERCHANGE_RANK_CHANGE',
    title: 'total group size from interchange-driven rank change',
    prototypes: ['RNK-CP003-PROT-TOTAL-FROM-INTERCHANGE-RANK-CHANGE'],
    answerSemantics: ['TOTAL'],
    mergeSplitReason: 'The answer is group cardinality rather than a transformed rank, so this remains a separate solver contract.',
  },
  {
    qlId: 'RNK-QL-020',
    authorityId: 'OWN_RANK_BEFORE_OR_AFTER_SINGLE_MOVEMENT',
    title: 'own rank before or after one movement',
    prototypes: [
      'RNK-CP003-PROT-FINAL-RANK-AFTER-SINGLE-MOVEMENT',
      'RNK-CP003-PROT-ORIGINAL-RANK-FROM-FINAL-AND-MOVEMENT',
    ],
    answerSemantics: ['RANK'],
    mergeSplitReason: 'Forward and reverse questions use the same signed movement equation; requested time is a parameter.',
  },
  {
    qlId: 'RNK-QL-021',
    authorityId: 'PEOPLE_PASSED_FROM_RANK_CHANGE',
    title: 'people passed or overtaken from a rank change',
    prototypes: ['RNK-CP003-PROT-PEOPLE-PASSED-FROM-RANK-CHANGE'],
    answerSemantics: ['COUNT'],
    mergeSplitReason: 'This asks for movement distance rather than a rank and has count-specific distractors.',
  },
  {
    qlId: 'RNK-QL-022',
    authorityId: 'TARGET_RANK_AFTER_INSERTION',
    title: 'target rank after one person is inserted',
    prototypes: ['RNK-CP003-PROT-TARGET-RANK-AFTER-INSERTION'],
    answerSemantics: ['RANK'],
    mergeSplitReason: 'Insertion increases the total and shifts the target only when the new person enters before it.',
  },
  {
    qlId: 'RNK-QL-023',
    authorityId: 'TARGET_RANK_AFTER_REMOVAL',
    title: 'target rank after another person is removed',
    prototypes: ['RNK-CP003-PROT-TARGET-RANK-AFTER-REMOVAL'],
    answerSemantics: ['RANK'],
    mergeSplitReason: 'Removal decreases the total, has target-deletion invalidity, and owns different misconception states from insertion.',
  },
  {
    qlId: 'RNK-QL-024',
    authorityId: 'OWN_RANK_AFTER_SEQUENTIAL_MOVES',
    title: 'final rank after two sequential movements',
    prototypes: ['RNK-CP003-PROT-FINAL-RANK-AFTER-SEQUENTIAL-MOVES'],
    answerSemantics: ['RANK'],
    mergeSplitReason: 'Intermediate-rank validity and operation order create a material two-stage solver contract.',
  },
  {
    qlId: 'RNK-QL-025',
    authorityId: 'TARGET_RANK_EFFECT_OF_ANOTHER_PERSON_MOVE',
    title: 'another person’s rank before or after a mover crosses them',
    prototypes: [
      'RNK-CP003-PROT-TARGET-RANK-AFTER-ANOTHER-PERSON-MOVES',
      'RNK-CP003-PROT-ORIGINAL-TARGET-RANK-BEFORE-ANOTHER-PERSON-MOVED',
    ],
    answerSemantics: ['RANK'],
    mergeSplitReason: 'Direct and inverse forms share the same crossing test: the target changes by one only when crossed.',
  },
  {
    qlId: 'RNK-QL-026',
    authorityId: 'OWN_RANK_WITH_MOVEMENT_AND_MEMBERSHIP_CHANGE',
    title: 'own rank before or after movement combined with joining or leaving',
    prototypes: [
      'RNK-CP003-PROT-FINAL-RANK-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE',
      'RNK-CP003-PROT-ORIGINAL-RANK-FROM-FINAL-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE',
    ],
    answerSemantics: ['RANK'],
    mergeSplitReason: 'Direct and inverse queries replay the same ordered two-operation ledger; operation order and membership kind remain parameters.',
  },
] as const;

export const RNK_CP003_ALL_DISCOVERY_PROTOTYPES: readonly RnkCp003AnyPrototypeId[] = [
  ...RNK_CP003_PROTOTYPE_IDS,
  ...RNK_CP003_SOURCE_PROTOTYPE_IDS,
];

export function authorityForCp003Prototype(prototypeId: RnkCp003AnyPrototypeId): RnkCp003Authority {
  const authority = RNK_CP003_AUTHORITIES.find((candidate) => candidate.prototypes.includes(prototypeId));
  if (!authority) throw new Error(`No CP-003 authority owns ${prototypeId}`);
  return authority;
}

export function authorityForCp003Ql(qlId: RnkCp003PermanentQlId): RnkCp003Authority {
  const authority = RNK_CP003_AUTHORITIES.find((candidate) => candidate.qlId === qlId);
  if (!authority) throw new Error(`Unknown CP-003 permanent QL ${qlId}`);
  return authority;
}
