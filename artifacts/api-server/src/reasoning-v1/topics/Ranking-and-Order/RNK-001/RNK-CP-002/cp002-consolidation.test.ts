import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  generateRnkCp002Question,
  RNK_CP002_PROTOTYPE_IDS,
} from './cp002-foundation';
import {
  generateReviewedRnkCp002SourceQuestion,
} from './cp002-source-wave-reviewed';
import {
  RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS,
} from './cp002-source-wave';
import {
  authorityForRnkCp002Prototype,
  RNK_CP002_AUTHORITIES,
  RNK_CP002_AUTHORITY_IDS,
  RNK_CP002_DISCOVERY_PROTOTYPE_IDS,
  type RnkCp002AuthorityId,
} from './cp002-consolidation';

const SEEDS = 240;
const authorityCounts = new Map<RnkCp002AuthorityId, number>();
for (const authorityId of RNK_CP002_AUTHORITY_IDS) authorityCounts.set(authorityId, 0);
let replayChecks = 0;
let equationChecks = 0;

assert.equal(RNK_CP002_DISCOVERY_PROTOTYPE_IDS.length, 13);
assert.equal(new Set(RNK_CP002_DISCOVERY_PROTOTYPE_IDS).size, 13);
assert.equal(RNK_CP002_AUTHORITIES.length, 8);
assert.deepEqual(RNK_CP002_AUTHORITIES.map((item) => item.authorityId), [...RNK_CP002_AUTHORITY_IDS]);

const owned = RNK_CP002_AUTHORITIES.flatMap((item) => item.sourcePrototypeIds);
assert.equal(owned.length, 13);
assert.equal(new Set(owned).size, 13);
assert.deepEqual([...owned].sort(), [...RNK_CP002_DISCOVERY_PROTOTYPE_IDS].sort());

for (const prototypeId of RNK_CP002_PROTOTYPE_IDS) {
  const authority = authorityForRnkCp002Prototype(prototypeId);
  for (let seed = 0; seed < SEEDS; seed += 1) {
    const question = generateRnkCp002Question(prototypeId, seed);
    authorityCounts.set(authority.authorityId, authorityCounts.get(authority.authorityId)! + 1);
    replayChecks += 1;

    switch (authority.authorityId) {
      case 'RNK-CP002-AUTH-01-PEOPLE-BETWEEN-NORMALIZED-POSITIONS':
        assert.equal(question.answer, question.normalizedState.betweenCount);
        break;
      case 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS':
        assert.equal(question.answer, question.normalizedState.positionGap);
        break;
      case 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION':
        assert.ok(question.answer === question.normalizedState.secondRankFromStart || question.answer === question.normalizedState.secondRankFromEnd);
        break;
      case 'RNK-CP002-AUTH-05-TOTAL-FROM-MIXED-ENDS-KNOWN-ORDER':
        assert.equal(question.answer, question.normalizedState.total);
        break;
      case 'RNK-CP002-AUTH-06-EXTREME-TOTAL-UNKNOWN-ORDER':
        assert.equal(typeof question.answer, 'number');
        break;
      default:
        throw new Error(`Base prototype ${prototypeId} mapped to incompatible ${authority.authorityId}`);
    }
    equationChecks += 1;
  }
}

for (const prototypeId of RNK_CP002_SOURCE_WAVE_PROTOTYPE_IDS) {
  const authority = authorityForRnkCp002Prototype(prototypeId);
  for (let seed = 0; seed < SEEDS; seed += 1) {
    const question = generateReviewedRnkCp002SourceQuestion(prototypeId, seed);
    authorityCounts.set(authority.authorityId, authorityCounts.get(authority.authorityId)! + 1);
    replayChecks += 1;
    const evidence = question.displayedEvidence;

    switch (authority.authorityId) {
      case 'RNK-CP002-AUTH-02-POSITION-GAP-NORMALIZED-POSITIONS':
        assert.ok(evidence.kind === 'POSITION_GAP_MIXED_END' || evidence.kind === 'OFFSET_FROM_SAME_END');
        assert.equal(Number(question.answer), question.normalizedState!.positionGap);
        break;
      case 'RNK-CP002-AUTH-03-TARGET-RANK-FROM-REFERENCE-AND-SEPARATION':
        assert.equal(evidence.kind, 'TARGET_RANK_FROM_BETWEEN');
        assert.ok(Number(question.answer) >= 1);
        break;
      case 'RNK-CP002-AUTH-04-COMPARE-NORMALIZED-POSITIONS':
        assert.ok(evidence.kind === 'COMPARE_SAME_END' || evidence.kind === 'COMPARE_MIXED_END');
        assert.ok(question.answer === question.firstName || question.answer === question.secondName);
        break;
      case 'RNK-CP002-AUTH-07-EXACT-TOTAL-OR-INDETERMINATE':
        assert.equal(evidence.kind, 'EXACT_TOTAL_OR_INDETERMINATE');
        assert.equal(question.answer, evidence.lowTotalValid ? 'Cannot be determined' : String(evidence.highTotal));
        break;
      case 'RNK-CP002-AUTH-08-PROPOSED-TOTAL-ORDER-STATUS':
        assert.equal(evidence.kind, 'PROPOSED_TOTAL_ORDER_STATUS');
        assert.ok([
          'The first person is nearer the start end',
          'The second person is nearer the start end',
          'The proposed total is impossible',
        ].includes(question.answer));
        break;
      default:
        throw new Error(`Source prototype ${prototypeId} mapped to incompatible ${authority.authorityId}`);
    }
    equationChecks += 1;
  }
}

assert.equal(replayChecks, 3120);
assert.equal(equationChecks, 3120);
for (const [authorityId, count] of authorityCounts) assert.ok(count > 0, `${authorityId} is unreachable`);

const summary = {
  packageId: 'RNK-001',
  checkpointId: 'RNK-CP-002',
  discoveryPrototypeCount: RNK_CP002_DISCOVERY_PROTOTYPE_IDS.length,
  authorityCount: RNK_CP002_AUTHORITIES.length,
  replayChecks,
  equationChecks,
  authorityCounts: Object.fromEntries(authorityCounts),
  ownershipRows: RNK_CP002_AUTHORITIES.map((item) => ({
    authorityId: item.authorityId,
    title: item.title,
    governingContract: item.governingContract,
    answerSemantic: item.answerSemantic,
    sourcePrototypeIds: item.sourcePrototypeIds,
  })),
  permanentQlCount: 0,
  conclusion: 'PASS_CP002_EIGHT_AUTHORITY_CONSOLIDATION',
};

const outputDirectory = process.argv[2];
if (outputDirectory) {
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(join(outputDirectory, 'cp002-consolidation-audit.json'), `${JSON.stringify(summary, null, 2)}\n`);
}
console.log(JSON.stringify(summary, null, 2));
