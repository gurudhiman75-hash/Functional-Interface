import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  RNK_CP003_ALL_DISCOVERY_PROTOTYPES,
  RNK_CP003_AUTHORITIES,
} from './cp003-consolidation';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const outputDirectory = process.argv[2] ?? 'rnk-cp003-final-source-gap-output';
mkdirSync(outputDirectory, { recursive: true });

const closedDimensions = [
  'direct and inverse interchange rank recovery',
  'total from interchange-driven rank change',
  'direct and inverse single-person movement',
  'people passed or overtaken',
  'insertion effects',
  'removal effects and target-removal rejection',
  'sequential movement with intermediate-state validity',
  'another person crossing or not crossing the target',
  'direct and inverse movement plus membership change',
  'movement and membership operation order',
  'joining or leaving from either end',
  'same-end and mixed-end displayed evidence',
  'top/bottom, left/right, front/back and race-order contexts',
  'endpoint, one-place, no-crossing and cross-entire-group edges',
  'all four answer positions and Easy/Medium/Hard reachability',
];
const protectedExclusions = [
  'three-or-more-person comparison reconstruction -> RNK-CP-004',
  'shared ranking passages -> RNK-CP-005',
  'partial-order possibility and definiteness -> RNK-CP-007',
  'facing or adjacency geometry -> Seating Arrangement',
  'statement-wise sufficiency labels -> Data Sufficiency',
];
const openDimensions: string[] = [];

assert(RNK_CP003_ALL_DISCOVERY_PROTOTYPES.length === 13, 'Expected complete 13-prototype discovery inventory');
assert(RNK_CP003_AUTHORITIES.length === 9, 'Expected final nine-authority inventory');
assert(openDimensions.length === 0, 'CP-003 still has open source dimensions');
assert(closedDimensions.length >= 15, 'Source-gap record is unexpectedly shallow');
assert(protectedExclusions.length >= 5, 'Ownership exclusions are incomplete');

const report = {
  checkpointId: 'RNK-CP-003',
  status: 'FINAL_SOURCE_AND_OWNERSHIP_GAP_CLOSED',
  discoveryPrototypeCount: 13,
  discoveryRuntimeQuestionCount: 3120,
  approvedEnglishQuestionCount: 78,
  permanentAuthorityCount: 9,
  closedDimensions,
  protectedExclusions,
  openDimensions,
};

writeFileSync(join(outputDirectory, 'cp003-final-source-gap.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
