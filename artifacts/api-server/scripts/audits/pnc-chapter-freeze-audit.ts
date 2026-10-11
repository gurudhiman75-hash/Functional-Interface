import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync,readFileSync,readdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {generatePncReviewBatch} from '../../src/question-studio/quant-pnc-review';
import {pncSourceReviewRows} from '../../src/question-studio/quant-pnc-source-review';
import {completeSourceCatalogue} from '../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/complete-source-catalogue';
import {theoryIllustrations,theoryCorrections} from '../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/source-review/theory-illustrations';
const root=resolve('../..'),out=resolve(root,'docs/audits/pnc-source-review');mkdirSync(out,{recursive:true});
const source=completeSourceCatalogue();assert.equal(source.length,699);
for(const language of ['en','hi','pa']){
 const rows=source.filter(q=>q.language===language);assert.equal(rows.length,233);
 const exercises=rows.filter(q=>!q.id.startsWith('WORKED'));assert.equal(exercises.length,187);
 for(const q of rows){assert.equal(q.options[q.correctIndex],q.answer);assert.equal(new Set(q.options).size,4);assert.ok(q.explanation.join(' ').includes(q.answer));}
}
let coreChecks=0;const samples:unknown[]=[],positions=[0,0,0,0];
for(let ql=1;ql<=269;ql++)for(let seed=0;seed<12;seed++){
 let englishAnswer:string|undefined;
 for(const language of ['en','hi','pa']){
  const r={packageId:ql<=106?'PNC-001':'PNC-002',questionLanguageId:`PNC-QL-${String(ql).padStart(3,'0')}`,language,seed:`chapter-freeze:${seed}`,count:1};
  const result=generatePncReviewBatch(r)!;assert.deepEqual(result,generatePncReviewBatch(r));const q=result.questions[0];
  assert.equal(q.publiclyPublishable,false);assert.equal(q.questionBankWritable,false);assert.equal(q.testEligible,false);assert.equal(q.mockTestEligible,false);assert.equal(q.answer,q.options![q.correctIndex!]);assert.equal(new Set(q.options).size,4);assert.ok(q.explanation!.length>20);assert.ok(!/\{[A-Za-z_]+\}/.test(q.stem!));assert.doesNotThrow(()=>JSON.stringify(q));
  if(language==='en')englishAnswer=q.answer;else {assert.deepEqual(String(q.answer).match(/[0-9][0-9,]*(?:\.[0-9]+)?/g),String(englishAnswer).match(/[0-9][0-9,]*(?:\.[0-9]+)?/g));assert.ok(language==='hi'?/[\u0900-\u097f]/.test(q.stem!):/[\u0a00-\u0a7f]/.test(q.stem!));}
  positions[q.correctIndex!]++;coreChecks++;if(seed===0)samples.push(q);
 }
}
const candidates=pncSourceReviewRows();assert.equal(candidates.length,948);
for(const q of candidates){assert.equal(q.publiclyPublishable,false);assert.equal(q.questionBankWritable,false);assert.equal(q.testEligible,false);assert.equal(q.mockTestEligible,false);assert.equal(new Set(q.options).size,4);assert.equal(q.options![q.correctIndex!],q.answer);assert.doesNotThrow(()=>JSON.stringify(q));}
const walk=(path:string):string[]=>readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(path,e.name)):/\.(?:ts|json)$/.test(e.name)?[resolve(path,e.name)]:[]);
const paths=[...walk(resolve('src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination')),resolve('src/question-studio/quant-pnc-review.ts'),resolve('src/question-studio/quant-pnc-source-review.ts'),resolve('src/question-studio/engines/quant-v4-adapter.ts'),resolve('scripts/audits/pnc-chapter-freeze-audit.ts'),resolve('scripts/audits/verify-pnc-freeze.ts'),resolve(root,'.github/workflows/pnc-chapter-review-integration.yml')].sort();
const contentHashes=Object.fromEntries(paths.map(p=>[relative(root,p),createHash('sha256').update(readFileSync(p)).digest('hex')]));
const summary={chapter:'Permutation & Combination',status:'TECHNICAL_REVIEW_FROZEN',auditScope:'Source mathematical coverage, authored learner content, localization candidates and unified review integration',coreQLs:269,coreLanguageSurfaces:807,coreSeedLanguageChecks:coreChecks,sourceExercises:187,workedProblems:46,theoryAndInlineTasks:16,sourceLanguageSurfaces:699,registeredSourceRows:candidates.length,unassessedExercises:0,unimplementedExerciseModels:0,sourceCoverageClosed:true,allAuthoredLanguages:['en','hi','pa'],coreCorrectPositionDistribution:positions,liveVerification:'DEFERRED_BY_USER',nativeHumanApproval:{'PNC-001':'NOT_RECORDED; AUTHORED_REVIEW_CANDIDATES','PNC-002':'PNC-002-HI-PA-v1-APPROVED-COMPLETE',sourceSupplement:'NOT_RECORDED; AUTHORED_REVIEW_CANDIDATES'},publicationApproval:false,publiclyPublishable:false,questionBankWritable:false,testEligible:false,mockTestEligible:false,contentHashes};
writeFileSync(resolve(out,'PNC-CHAPTER-FREEZE-20261011.json'),JSON.stringify(summary,null,2)+'\n');
writeFileSync(resolve('dist/pnc-freeze-learner-samples.json'),JSON.stringify({core:samples,source,theoryIllustrations,theoryCorrections},null,2)+'\n');
const chosen:unknown[]=[],seen=new Set<string>();for(const raw of samples){const q=raw as Record<string,unknown>,key=`${q.canonicalProblemId}:${q.language}`;if(seen.has(key))continue;seen.add(key);chosen.push(Object.fromEntries(['qlId','canonicalProblemId','language','stem','options','correctIndex','answer','explanation'].map(k=>[k,q[k]])));}
const sourceKeys=new Set(['I-039','I-060','I-067','II-002','II-008','II-016','III-002','III-013','III-030','III-031','III-040','III-041','III-045','III-050','WORKED-023','WORKED-028','WORKED-029','WORKED-038','WORKED-043']);
writeFileSync(resolve(out,'PNC-FROZEN-LEARNER-SAMPLES-20261011.json'),JSON.stringify({sampleScope:'One core QL per CP/language plus source edge cases; complete 807+699 surface export reproducible via pnc-chapter-freeze-audit.ts.',core:chosen,source:source.filter(q=>sourceKeys.has(q.id.split(':')[0])),theoryIllustrations,theoryCorrections},null,2)+'\n');
console.log(JSON.stringify({...summary,contentHashes:`${paths.length} files`},null,2));
