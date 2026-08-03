import { generateRnkCp003Question } from './cp003-foundation';
import { generateRnkCp003ReviewedSourceQuestion } from './cp003-source-wave-reviewed';
import {
  RNK_CP003_PERMANENT_QL_IDS,
  authorityForCp003Ql,
  type RnkCp003AnyPrototypeId,
  type RnkCp003PermanentQlId,
} from './cp003-consolidation';
import type { RnkCp003PrototypeId } from './cp003-model';
import type { RnkCp003SourcePrototypeId } from './cp003-source-wave';

export interface RnkCp003PermanentLifecycle {
  readonly reviewStatus: 'APPROVED';
  readonly questionStudioDiscoverable: false;
  readonly questionBankStatus: 'NOT_STORED';
  readonly testEligibility: 'INELIGIBLE';
  readonly publiclyPublishable: false;
}

export type RnkCp003PermanentQuestion = Record<string, unknown> & {
  readonly packageId: 'RNK-001';
  readonly checkpointId: 'RNK-CP-003';
  readonly prototypeId: RnkCp003AnyPrototypeId;
  readonly permanentQlId: RnkCp003PermanentQlId;
  readonly seed: number;
  readonly correctIndex: number;
  readonly options: readonly Record<string, unknown>[];
  readonly lifecycle: RnkCp003PermanentLifecycle;
};

const SOURCE_PROTOTYPES = new Set<RnkCp003AnyPrototypeId>([
  'RNK-CP003-PROT-TARGET-RANK-AFTER-ANOTHER-PERSON-MOVES',
  'RNK-CP003-PROT-ORIGINAL-TARGET-RANK-BEFORE-ANOTHER-PERSON-MOVED',
  'RNK-CP003-PROT-FINAL-RANK-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE',
  'RNK-CP003-PROT-ORIGINAL-RANK-FROM-FINAL-AFTER-MOVEMENT-AND-MEMBERSHIP-CHANGE',
]);

function generateByPrototype(prototypeId: RnkCp003AnyPrototypeId, seed: number): Record<string, unknown> {
  return SOURCE_PROTOTYPES.has(prototypeId)
    ? generateRnkCp003ReviewedSourceQuestion(prototypeId as RnkCp003SourcePrototypeId, seed) as unknown as Record<string, unknown>
    : generateRnkCp003Question(prototypeId as RnkCp003PrototypeId, seed) as unknown as Record<string, unknown>;
}

export function generateRnkCp003PermanentQuestion(
  qlId: RnkCp003PermanentQlId,
  seed: number,
): RnkCp003PermanentQuestion {
  const authority = authorityForCp003Ql(qlId);
  const prototypeId = authority.prototypes[Math.abs(seed) % authority.prototypes.length];
  const base = generateByPrototype(prototypeId, seed);
  return {
    ...base,
    permanentQlId: qlId,
    lifecycle: {
      reviewStatus: 'APPROVED',
      questionStudioDiscoverable: false,
      questionBankStatus: 'NOT_STORED',
      testEligibility: 'INELIGIBLE',
      publiclyPublishable: false,
    },
  } as RnkCp003PermanentQuestion;
}

export { RNK_CP003_PERMANENT_QL_IDS };
