import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch } from './question-studio-integration';
import { permanentQlForMisCandidate } from './MIS-PERMANENT-QL-REGISTRY';
import { MIS_CP005_CANDIDATE_IDS } from './MIS-CP-005/generator';
import { MIS_CP006_CANDIDATE_IDS } from './MIS-CP-006/generator';
import { MIS_CP007_CANDIDATE_IDS } from './MIS-CP-007/generator';
import { MIS_CP008_CANDIDATE_IDS } from './MIS-CP-008/generator';
import { MIS_CP009_CANDIDATE_IDS } from './MIS-CP-009/generator';

const candidates=[
  ...MIS_CP005_CANDIDATE_IDS,...MIS_CP006_CANDIDATE_IDS,...MIS_CP007_CANDIDATE_IDS,
  ...MIS_CP008_CANDIDATE_IDS,...MIS_CP009_CANDIDATE_IDS,
];
const qls=new Set<string>();
const englishExplanation=/\b(The same|Multiply|Add|Subtract|Result|Centre|Figure|Now apply|So,|Top row|Bottom row|Left column|Right column|One diagonal|Other diagonal)\b/i;

for(const candidateId of candidates){
  const seed='mis-l10n-wave2:'+candidateId;
  const en=(await generateMis001QuestionStudioBatch({packageId:'MIS-001',patternId:candidateId,language:'en',count:1,seed})).questions[0] as any;
  for(const language of ['hi','pa'] as const){
    const q=(await generateMis001QuestionStudioBatch({packageId:'MIS-001',patternId:candidateId,language,count:1,seed})).questions[0] as any;
    assert.equal(q.answer,en.answer,candidateId+' answer drift '+language);
    assert.equal(q.correctIndex,en.correctIndex,candidateId+' correct-index drift '+language);
    assert.deepEqual(q.options,en.options,candidateId+' option drift '+language);
    assert.equal(q.structuralFingerprint,en.structuralFingerprint,candidateId+' structure drift '+language);
    assert.equal(q.numericFingerprint,en.numericFingerprint,candidateId+' numeric drift '+language);
    assert.deepEqual(q.figures,en.figures,candidateId+' figure payload drift '+language);
    assert.deepEqual(q.hiddenCompleteStructure,en.hiddenCompleteStructure,candidateId+' hidden structure drift '+language);
    assert.equal(q.qlId,permanentQlForMisCandidate(candidateId),candidateId+' permanent QL drift');
    assert.ok(q.explanation.includes(String(q.canonicalAnswer)),candidateId+' localized explanation omits answer');
    assert.ok(!englishExplanation.test(q.explanation),candidateId+' English explanation leaked into '+language+': '+q.explanation);
    assert.ok(language==='hi' ? /[\u0900-\u097F]/.test(q.stem) : /[\u0A00-\u0A7F]/.test(q.stem),candidateId+' localized stem script missing');
    assert.ok(language==='hi' ? /[\u0900-\u097F]/.test(q.explanation) : /[\u0A00-\u0A7F]/.test(q.explanation),candidateId+' localized explanation script missing');
    if(q.qlId) qls.add(q.qlId);
  }
}
assert.equal(candidates.length,34);
assert.equal(qls.size,15);

await assert.rejects(
  ()=>generateMis001QuestionStudioBatch({packageId:'MIS-001',canonicalProblemId:'MIS-CP-010',language:'hi',count:1,seed:'wave2-boundary'}),
  /CP001-CP009/,
);

console.log('MIS-001 localization wave 2 audit passed: 34 runtime patterns / 15 permanent QLs across CP005-CP009.');
