import assert from 'node:assert/strict';
import { MIS_PERMANENT_QL_IDS, MIS_PERMANENT_QL_ALLOCATION_STATE, permanentQlForMisCandidate } from './MIS-PERMANENT-QL-REGISTRY';
import { MIS_LOCALIZATION_WAVE1_STATE } from './localization-wave1';
import { MIS_LOCALIZATION_WAVE2_STATE } from './localization-wave2';
import { MIS_LOCALIZATION_WAVE3_STATE } from './localization-wave3';
import { MIS_LOCALIZATION_WAVE4_STATE } from './localization-wave4';
import { MIS_001_CHECKPOINT_IDS, MIS_001_QUESTION_STUDIO_PACKAGE } from './question-studio-integration';

const waves=[MIS_LOCALIZATION_WAVE1_STATE,MIS_LOCALIZATION_WAVE2_STATE,MIS_LOCALIZATION_WAVE3_STATE,MIS_LOCALIZATION_WAVE4_STATE] as const;
const coveredCheckpoints=new Set(waves.flatMap(w=>[...w.checkpoints]));
assert.equal(coveredCheckpoints.size,28);
for(const cp of MIS_001_CHECKPOINT_IDS) assert.ok(coveredCheckpoints.has(cp),cp+' missing from localization coverage');

const metadata=MIS_001_QUESTION_STUDIO_PACKAGE.metadata as any;
assert.equal(metadata.runtimePatternCount,112);
assert.equal(metadata.semanticAuthorityCount,75);
assert.equal(metadata.permanentQlCount,73);
assert.equal(metadata.permanentQlAllocation,true);
assert.equal(metadata.localizationCoverageComplete,true);
assert.equal(MIS_PERMANENT_QL_IDS.length,73);
assert.equal(new Set(MIS_PERMANENT_QL_IDS).size,73);
assert.equal(MIS_PERMANENT_QL_ALLOCATION_STATE.localizationStatus,'HI_PA_IMPLEMENTED_REVIEW_PENDING');

assert.equal(permanentQlForMisCandidate('MIS-CAND-034'),null);
assert.equal(permanentQlForMisCandidate('MIS-CAND-095'),null);
assert.equal(permanentQlForMisCandidate('MIS-CAND-035'),permanentQlForMisCandidate('MIS-CAND-011'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-079'),permanentQlForMisCandidate('MIS-CAND-001'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-109'),permanentQlForMisCandidate('MIS-CAND-003'));
assert.equal(permanentQlForMisCandidate('MIS-CAND-110'),permanentQlForMisCandidate('MIS-CAND-016'));

assert.deepEqual(MIS_001_QUESTION_STUDIO_PACKAGE.supportedLanguages,['en','hi','pa']);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.questionBankWritable,false);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.testEligible,false);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.mockTestEligible,false);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable,false);
assert.equal(MIS_001_QUESTION_STUDIO_PACKAGE.productionReleaseAuthorized,false);

console.log('MIS-001 chapter localization accounting audit passed: 112 runtime patterns / 73 permanent QLs / 28 checkpoints; 2 source-thin holds remain unallocated.');
