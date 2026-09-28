import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch } from './question-studio-integration';
import { permanentQlForMisCandidate } from './MIS-PERMANENT-QL-REGISTRY';
import { MIS_CP016_CANDIDATE_IDS } from './MIS-CP-016/generator';
import { MIS_CP017_CANDIDATE_IDS } from './MIS-CP-017/generator';
import { MIS_CP018_CANDIDATE_IDS } from './MIS-CP-018/generator';
import { MIS_CP019_CANDIDATE_IDS } from './MIS-CP-019/generator';
import { MIS_CP020_CANDIDATE_IDS } from './MIS-CP-020/generator';
import { MIS_CP021_CANDIDATE_IDS } from './MIS-CP-021/generator';
import { MIS_CP022_CANDIDATE_IDS } from './MIS-CP-022/generator';
import { MIS_CP023_CANDIDATE_IDS } from './MIS-CP-023/generator';
import { MIS_CP024_CANDIDATE_IDS } from './MIS-CP-024/generator';
import { MIS_CP025_CANDIDATE_IDS } from './MIS-CP-025/generator';
import { MIS_CP026_CANDIDATE_IDS } from './MIS-CP-026/generator';
import { MIS_CP027_CANDIDATE_IDS } from './MIS-CP-027/generator';
import { MIS_CP028_CANDIDATE_IDS } from './MIS-CP-028/generator';

const candidates=[...MIS_CP016_CANDIDATE_IDS,...MIS_CP017_CANDIDATE_IDS,...MIS_CP018_CANDIDATE_IDS,...MIS_CP019_CANDIDATE_IDS,...MIS_CP020_CANDIDATE_IDS,...MIS_CP021_CANDIDATE_IDS,...MIS_CP022_CANDIDATE_IDS,...MIS_CP023_CANDIDATE_IDS,...MIS_CP024_CANDIDATE_IDS,...MIS_CP025_CANDIDATE_IDS,...MIS_CP026_CANDIDATE_IDS,...MIS_CP027_CANDIDATE_IDS,...MIS_CP028_CANDIDATE_IDS];
const qls=new Set<string>();
const leak=/\b(The same|Multiply|Subtract|Add the|Take the|Figure|Row|Pair|Target|Product of digits|Source row|Now apply|So,)\b/i;

for(const candidateId of candidates){
 const seed='mis-l10n-wave4:'+candidateId;
 const en=(await generateMis001QuestionStudioBatch({packageId:'MIS-001',patternId:candidateId,language:'en',count:1,seed})).questions[0] as any;
 for(const language of ['hi','pa'] as const){
  const q=(await generateMis001QuestionStudioBatch({packageId:'MIS-001',patternId:candidateId,language,count:1,seed})).questions[0] as any;
  assert.equal(q.answer,en.answer,candidateId+' answer drift');
  assert.equal(q.correctIndex,en.correctIndex,candidateId+' correct index drift');
  assert.deepEqual(q.options,en.options,candidateId+' options drift');
  assert.equal(q.structuralFingerprint,en.structuralFingerprint,candidateId+' structure drift');
  assert.equal(q.numericFingerprint,en.numericFingerprint,candidateId+' numeric drift');
  assert.deepEqual(q.figures,en.figures,candidateId+' figures drift');
  assert.deepEqual(q.hiddenCompleteStructure,en.hiddenCompleteStructure,candidateId+' hidden math drift');
  assert.equal(q.qlId,permanentQlForMisCandidate(candidateId),candidateId+' QL drift');
  assert.ok(q.explanation.includes(String(q.canonicalAnswer)),candidateId+' explanation missing answer');
  assert.ok(!leak.test(q.explanation),candidateId+' English leakage in '+language+': '+q.explanation);
  assert.ok(language==='hi'?/[\u0900-\u097F]/.test(q.stem):/[\u0A00-\u0A7F]/.test(q.stem),candidateId+' localized stem script missing');
  assert.ok(language==='hi'?/[\u0900-\u097F]/.test(q.explanation):/[\u0A00-\u0A7F]/.test(q.explanation),candidateId+' localized explanation script missing');
  if(q.qlId)qls.add(q.qlId);
 }
}
assert.equal(candidates.length,23);
assert.equal(qls.size,22);
assert.equal(permanentQlForMisCandidate('MIS-CAND-095'),null);
console.log('MIS-001 localization wave 4 audit passed: 23 runtime patterns / 22 permanent QLs across CP016-CP028; source-thin MIS-CAND-095 remains unallocated.');
