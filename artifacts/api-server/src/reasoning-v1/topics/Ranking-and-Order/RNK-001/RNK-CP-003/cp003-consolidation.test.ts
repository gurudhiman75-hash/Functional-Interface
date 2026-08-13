import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_ALL_DISCOVERY_PROTOTYPES,
  RNK_CP003_AUTHORITIES,
  RNK_CP003_PERMANENT_QL_IDS,
  authorityForCp003Prototype,
} from './cp003-consolidation';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp003-consolidation-output';
mkdirSync(outputDirectory, { recursive: true });

assert(RNK_CP003_ALL_DISCOVERY_PROTOTYPES.length === 13, 'Expected 13 CP-003 discovery prototypes');
assert(new Set(RNK_CP003_ALL_DISCOVERY_PROTOTYPES).size === 13, 'Duplicate discovery prototype');
assert(RNK_CP003_AUTHORITIES.length === 9, 'Expected nine consolidated authorities');
assert(RNK_CP003_PERMANENT_QL_IDS.length === 9, 'Expected nine permanent QL IDs');
assert(new Set(RNK_CP003_PERMANENT_QL_IDS).size === 9, 'Duplicate permanent QL ID');
assert(RNK_CP003_PERMANENT_QL_IDS[0] === 'RNK-QL-018', 'Unexpected first CP-003 QL');
assert(RNK_CP003_PERMANENT_QL_IDS.at(-1) === 'RNK-QL-026', 'Unexpected last CP-003 QL');

const ownership = new Map<string, string>();
for (const authority of RNK_CP003_AUTHORITIES) {
  assert(authority.prototypes.length >= 1, `${authority.qlId} owns no prototypes`);
  assert(authority.mergeSplitReason.length >= 60, `${authority.qlId} lacks a meaningful merge/split reason`);
  for (const prototypeId of authority.prototypes) {
    assert(!ownership.has(prototypeId), `${prototypeId} is owned by more than one authority`);
    ownership.set(prototypeId, authority.qlId);
    assert(authorityForCp003Prototype(prototypeId).qlId === authority.qlId, `Lookup mismatch for ${prototypeId}`);
  }
}

assert(ownership.size === RNK_CP003_ALL_DISCOVERY_PROTOTYPES.length, 'Not every prototype is owned exactly once');
for (const prototypeId of RNK_CP003_ALL_DISCOVERY_PROTOTYPES) {
  assert(ownership.has(prototypeId), `Unowned prototype ${prototypeId}`);
}

const report = {
  checkpointId: 'RNK-CP-003',
  status: 'NINE_AUTHORITY_CONSOLIDATION_PROVED',
  discoveryPrototypeCount: RNK_CP003_ALL_DISCOVERY_PROTOTYPES.length,
  authorityCount: RNK_CP003_AUTHORITIES.length,
  permanentRange: 'RNK-QL-018..026',
  nextAvailableQlId: 'RNK-QL-027',
  authorities: RNK_CP003_AUTHORITIES,
  mergeDecisions: {
    directInverseInterchange: 'MERGED',
    directInverseSingleMovement: 'MERGED',
    insertionRemoval: 'SPLIT',
    directInverseOtherPersonEffect: 'MERGED',
    directInverseMovementMembership: 'MERGED',
  },
};

writeFileSync(join(outputDirectory, 'cp003-consolidation.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
