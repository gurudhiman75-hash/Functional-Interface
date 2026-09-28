import assert from 'node:assert/strict';
import { generateMis001QuestionStudioBatch } from './question-studio-integration';
import { MIS_PERMANENT_QL_IDS } from './MIS-PERMANENT-QL-REGISTRY';

const seeds=['MIS-FINAL-CORPUS-A','MIS-FINAL-CORPUS-B'];
const languages=['en','hi','pa'] as const;
const englishCorpus:any[]=[];
const qlSeen=new Set<string>();
const candidateCoverage=new Set<string>();
const checkpointCoverage=new Set<string>();
const difficultyCoverage=new Set<string>();
const answerPositions=[0,0,0,0];

for(const seed of seeds){
  const batches=await Promise.all(languages.map(language=>generateMis001QuestionStudioBatch({
    packageId:'MIS-001',language,count:112,seed,
  })));
  const [en,hi,pa]=batches.map(x=>x.questions as any[]);
  assert.equal(en.length,112); assert.equal(hi.length,112); assert.equal(pa.length,112);

  for(let i=0;i<112;i++){
    const e=en[i]!,h=hi[i]!,p=pa[i]!;
    assert.equal(h.candidateId,e.candidateId); assert.equal(p.candidateId,e.candidateId);
    for(const q of [h,p]){
      assert.equal(q.answer,e.answer);
      assert.equal(q.correctIndex,e.correctIndex);
      assert.deepEqual(q.options,e.options);
      assert.equal(q.numericFingerprint,e.numericFingerprint);
      assert.equal(q.structuralFingerprint,e.structuralFingerprint);
      assert.equal(q.qlId,e.qlId);
      assert.deepEqual(q.hiddenCompleteStructure,e.hiddenCompleteStructure);
      assert.deepEqual(q.figures,e.figures);
      assert.ok(String(q.explanation).includes(String(q.canonicalAnswer)));
      assert.equal(q.validation.sameRuleFitsAllExamples,true);
      assert.equal(q.validation.exactlyOneIntendedRule,true);
      assert.equal(q.validation.exactlyOneCorrect,true);
      assert.equal(q.validation.fourUniqueOptions,true);
      assert.equal(q.validation.solverAgreement,true);
      assert.equal(q.validation.noDecimal,true);
    }
    assert.ok(/[\u0900-\u097F]/.test(String(h.stem)));
    assert.ok(/[\u0A00-\u0A7F]/.test(String(p.stem)));
    assert.ok(/[\u0900-\u097F]/.test(String(h.explanation)));
    assert.ok(/[\u0A00-\u0A7F]/.test(String(p.explanation)));

    englishCorpus.push(e);
    candidateCoverage.add(String(e.candidateId));
    checkpointCoverage.add(String(e.checkpointId));
    difficultyCoverage.add(String(e.difficulty));
    answerPositions[e.correctIndex]++;
    if(e.qlId) qlSeen.add(String(e.qlId));
  }
}

assert.equal(candidateCoverage.size,112);
assert.equal(checkpointCoverage.size,28);
assert.deepEqual([...difficultyCoverage].sort(),['Easy','Hard','Medium']);
assert.equal(qlSeen.size,73);
for(const ql of MIS_PERMANENT_QL_IDS) assert.ok(qlSeen.has(ql),ql+' absent from final corpus');
for(const count of answerPositions) assert.ok(count>=35,'answer-position imbalance: '+answerPositions.join(','));

const candidateNumericKeys=new Set(englishCorpus.map(q=>q.candidateId+'|'+q.numericFingerprint));
assert.ok(candidateNumericKeys.size>=130,'numeric diversity too low: '+candidateNumericKeys.size+' / '+englishCorpus.length);

const sourceThin=englishCorpus.filter(q=>q.sourceThin===true);
assert.ok(sourceThin.some(q=>q.candidateId==='MIS-CAND-034'));
assert.ok(sourceThin.some(q=>q.candidateId==='MIS-CAND-095'));
assert.ok(sourceThin.every(q=>q.qlId==null&&q.provisionalQl===true));

console.log('MIS-001 final corpus readiness audit passed.',{
  generatedPerLanguage:englishCorpus.length,
  runtimePatterns:candidateCoverage.size,
  checkpoints:checkpointCoverage.size,
  permanentQls:qlSeen.size,
  answerPositions,
  uniqueCandidateNumericKeys:candidateNumericKeys.size,
});
