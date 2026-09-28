import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch } from './question-studio-integration';
import { permanentQlForMisCandidate } from './MIS-PERMANENT-QL-REGISTRY';
import { MIS_CP010_CANDIDATE_IDS } from './MIS-CP-010/generator';
import { MIS_CP011_CANDIDATE_IDS } from './MIS-CP-011/generator';
import { MIS_CP012_CANDIDATE_IDS } from './MIS-CP-012/generator';
import { MIS_CP013_CANDIDATE_IDS } from './MIS-CP-013/generator';
import { MIS_CP014_CANDIDATE_IDS } from './MIS-CP-014/generator';
import { MIS_CP015_CANDIDATE_IDS } from './MIS-CP-015/generator';

const candidates=[...MIS_CP010_CANDIDATE_IDS,...MIS_CP011_CANDIDATE_IDS,...MIS_CP012_CANDIDATE_IDS,...MIS_CP013_CANDIDATE_IDS,...MIS_CP014_CANDIDATE_IDS,...MIS_CP015_CANDIDATE_IDS];
const qls=new Set<string>();
const leak=/\b(The same|This is|Use the|Multiply|Add the|Subtract|Figure|Group|Now apply|Testing the missing|Target total|missing corner|So,)\b/i;

for(const candidateId of candidates){
  for(const seedSuffix of ['a','b']){
    const seed='mis-l10n-wave3:'+candidateId+':'+seedSuffix;
    const en=(await generateMis001QuestionStudioBatch({packageId:'MIS-001',patternId:candidateId,language:'en',count:1,seed})).questions[0] as any;
    for(const language of ['hi','pa'] as const){
      const q=(await generateMis001QuestionStudioBatch({packageId:'MIS-001',patternId:candidateId,language,count:1,seed})).questions[0] as any;
      assert.equal(q.answer,en.answer,candidateId+' answer drift');
      assert.equal(q.correctIndex,en.correctIndex,candidateId+' correct-index drift');
      assert.deepEqual(q.options,en.options,candidateId+' option drift');
      assert.equal(q.structuralFingerprint,en.structuralFingerprint,candidateId+' structure drift');
      assert.equal(q.numericFingerprint,en.numericFingerprint,candidateId+' numeric drift');
      assert.deepEqual(q.figures,en.figures,candidateId+' figure drift');
      assert.deepEqual(q.hiddenCompleteStructure,en.hiddenCompleteStructure,candidateId+' hidden math drift');
      assert.equal(q.qlId,permanentQlForMisCandidate(candidateId),candidateId+' QL drift');
      assert.ok(q.explanation.includes(String(q.canonicalAnswer)));
      assert.ok(!leak.test(q.explanation),candidateId+' English leakage in '+language+': '+q.explanation);
      assert.ok(language==='hi'?/[\u0900-\u097F]/.test(q.stem):/[\u0A00-\u0A7F]/.test(q.stem));
      assert.ok(language==='hi'?/[\u0900-\u097F]/.test(q.explanation):/[\u0A00-\u0A7F]/.test(q.explanation));
      if(q.qlId)qls.add(q.qlId);
    }
  }
}
assert.equal(candidates.length,21);
assert.equal(qls.size,19);

console.log('MIS-001 localization wave 3 audit passed: 21 runtime patterns / 19 permanent QLs across CP010-CP015.');
