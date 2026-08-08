import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { MAL_CP005_BOUNDARY_LEDGER, MAL_CP005_DISCOVERY_REGISTRY } from "./foundation/cp005-discovery-registry";
import { generateMalCp005DiscoveryQuestion, malCp005DiscoveryStable, verifyMalCp005DiscoveryQuestion } from "./foundation/cp005-discovery-runtime";
import { MAL_CP005_DISCOVERY_PROTOTYPE_IDS, type MalCp005DiscoveryQuestion } from "./foundation/cp005-types";

function fail(message:string):never { throw new Error(message); }
function assert(condition:unknown,message:string):asserts condition { if(!condition)fail(message); }

function parseDisplayedPercent(text:string):number {
  const match=text.match(/^(-?\d+)(?: (\d+)\/(\d+))?%$/u);
  if(!match) fail(`Cannot parse displayed percentage: ${text}`);
  const whole=Number(match[1]); const numerator=match[2]?Number(match[2]):0; const denominator=match[3]?Number(match[3]):1;
  return whole + Math.sign(whole || 1) * numerator/denominator;
}

assert(MAL_CP005_DISCOVERY_PROTOTYPE_IDS.length===12,"Expected twelve CP-005 Wave 01 discovery prototypes.");
assert(MAL_CP005_DISCOVERY_REGISTRY.length===12,"CP-005 registry count changed.");
assert(MAL_CP005_BOUNDARY_LEDGER.length===6,"CP-005 boundary ledger count changed.");
assert(MAL_CP005_BOUNDARY_LEDGER.some(x=>x.currentVerdict==="REASSIGN_PNL_CP005"),"False-weight ownership boundary is missing.");
assert(MAL_CP005_BOUNDARY_LEDGER.some(x=>x.currentVerdict==="MAL_CP001_CP005_BOUNDARY"),"CP-001/CP-005 blend boundary is missing.");
assert(MAL_CP005_BOUNDARY_LEDGER.some(x=>x.currentVerdict==="MAL_CP003_CP005_BOUNDARY"),"CP-003/CP-005 replacement boundary is missing.");
assert(MAL_CP005_BOUNDARY_LEDGER.some(x=>x.currentVerdict==="MAL_CP005_PNL_BOUNDARY"),"CP-005/PNL commercial boundary is missing.");

const seedsPerPrototype=200;
let generatedCount=0; let deterministicCount=0; let independentVerificationCount=0;
const answerPositionCounts=[0,0,0,0]; const fingerprints=new Set<string>(); const stems=new Set<string>(); const answers=new Set<string>();
const reviewRows:MalCp005DiscoveryQuestion[]=[]; const reviewFingerprintsByPrototype=new Map<string,Set<string>>(); const diversityByPrototype=new Map<string,Set<string>>(); const misconceptionCounts=new Map<string,number>();

for(const prototypeId of MAL_CP005_DISCOVERY_PROTOTYPE_IDS){
  const prototypeFingerprints=new Set<string>(); const reviewFingerprints=new Set<string>(); diversityByPrototype.set(prototypeId,prototypeFingerprints); reviewFingerprintsByPrototype.set(prototypeId,reviewFingerprints);
  for(let index=0;index<seedsPerPrototype;index+=1){
    const seed=`cp005-discovery:${prototypeId}:${index}`; const first=generateMalCp005DiscoveryQuestion(prototypeId,seed); const second=generateMalCp005DiscoveryQuestion(prototypeId,seed);
    assert(malCp005DiscoveryStable(first)===malCp005DiscoveryStable(second),`${prototypeId}/${seed}: generation is not deterministic.`); deterministicCount+=1;
    assert(first.validation.ok,`${prototypeId}/${seed}: ${first.validation.errors.join("; ")}`);
    const independent=verifyMalCp005DiscoveryQuestion(first); assert(independent.ok,`${prototypeId}/${seed}: ${independent.errors.join("; ")}`); independentVerificationCount+=1;
    assert(first.archetypeId==="MAL-001","Wrong archetype identity."); assert(first.canonicalProblemId==="MAL-CP-005","Wrong CP identity."); assert(first.permanentQlId===null,"Permanent QL leaked into discovery."); assert(first.language==="en","Non-English output escaped."); assert(first.maturity==="DISCOVERY_PROTOTYPE","Discovery maturity changed."); assert(first.allocationStatus==="UNALLOCATED_OPEN_DISCOVERY","Allocation status changed.");
    assert(!first.active&&!first.publiclyPublishable&&!first.questionStudioDiscoverable&&!first.questionBankWritable&&!first.testEligible,"A CP-005 delivery flag became enabled.");
    assert(first.sourceEvidenceStatus==="REFERENCE_AND_LEGACY_RECOVERED_PENDING_FIXTURE_NORMALIZATION","CP-005 source maturity was overstated."); assert(first.sourceEvidenceIds.length>=5,"Source trace is incomplete.");
    assert(first.stem.endsWith("?"),"Stem is not interrogative."); assert(first.options.length===4,"Question does not have four options."); assert(new Set(first.options).size===4,"Options are not unique."); assert(first.options[first.correctIndex]===first.answer,"Correct option does not match answer."); assert(first.optionAudit.filter(x=>x.isCorrect).length===1,"Option audit must contain exactly one correct answer."); assert(new Set(first.optionAudit.map(x=>x.misconceptionId)).size===4,"Distractor authorities are not distinct.");
    assert(first.commercialLedger.rows.length>=1,"Commercial ledger is empty."); assert(first.explanation.calculation.length>=2,"Explanation is too shallow."); assert(first.explanation.conclusion.includes(first.answer),"Conclusion omits canonical answer.");
    if(first.answerSemantic==="ADULTERANT_PERCENT_OF_MIXTURE") assert(first.options.every(option=>{const value=parseDisplayedPercent(option);return value>=0&&value<=100;}),"A final-mixture percentage option lies outside 0% to 100%.");
    assert(!/false weight|short measure|short weight/iu.test(JSON.stringify({stem:first.stem,explanation:first.explanation,ledger:first.commercialLedger})),"PNL-owned false-quantity content entered CP-005 learner output.");
    for(const option of first.optionAudit)misconceptionCounts.set(option.misconceptionId,(misconceptionCounts.get(option.misconceptionId)??0)+1);
    prototypeFingerprints.add(first.mathematicalFingerprint); fingerprints.add(first.mathematicalFingerprint); stems.add(first.stem); answers.add(first.answer); answerPositionCounts[first.correctIndex]+=1; generatedCount+=1; if(reviewFingerprints.size<5&&!reviewFingerprints.has(first.mathematicalFingerprint)){reviewFingerprints.add(first.mathematicalFingerprint);reviewRows.push(first);}
  }
}

assert(generatedCount===2400,`Expected 2,400 packages, received ${generatedCount}.`); assert(deterministicCount===2400,"Determinism count mismatch."); assert(independentVerificationCount===2400,"Independent verification count mismatch."); assert(reviewRows.length===60,"Expected 60 distinct review rows."); assert([...reviewFingerprintsByPrototype.values()].every(set=>set.size===5),"Each prototype must contribute five distinct review states.");
assert([...diversityByPrototype.values()].every(set=>set.size>=8),`A prototype has insufficient exact-state diversity: ${JSON.stringify(Object.fromEntries([...diversityByPrototype].map(([k,v])=>[k,v.size])))}`);
assert(fingerprints.size>=100,`Chapter-wide exact-state diversity too low: ${fingerprints.size}.`); assert(stems.size>=100,`Stem diversity too low: ${stems.size}.`); assert(answers.size>=25,`Answer diversity too low: ${answers.size}.`); assert(answerPositionCounts.every(count=>count>=450),`Answer positions are imbalanced: ${answerPositionCounts.join(", ")}.`);
assert(!misconceptionCounts.has("ARITHMETIC_SLIP")&&!misconceptionCounts.has("PLAUSIBLE")&&!misconceptionCounts.has("NEARBY_VALUE"),"Generic distractor authority entered CP-005.");

const outputDirectory=resolve(process.cwd(),"dist/quant-v4"); mkdirSync(outputDirectory,{recursive:true}); const jsonPath=resolve(outputDirectory,"mal-cp005-wave01-review.json"); const markdownPath=resolve(outputDirectory,"mal-cp005-wave01-review.md");
writeFileSync(jsonPath,`${JSON.stringify({status:"PASS_MAL_CP005_WAVE01_OPEN_EXECUTABLE_DISCOVERY",permanentQlCount:0,frozenSolveModeCount:0,questionStudioDiscoverable:false,generatedCount,deterministicCount,independentVerificationCount,distinctMathematicalFingerprintCount:fingerprints.size,distinctStemCount:stems.size,distinctAnswerCount:answers.size,answerPositionCounts,boundaryLedger:MAL_CP005_BOUNDARY_LEDGER,reviewRows},(_key,value)=>typeof value==="bigint"?value.toString():value,2)}\n`,"utf8");
const markdown:string[]=["# MAL-CP-005 Wave 01 — Open Executable Discovery Review","","> These are source-recovered English prototypes. They are not permanent QLs and are unavailable to Question Studio, the Question Bank, tests and public delivery.","",`Generated packages: **${generatedCount}**`,`Review rows: **${reviewRows.length}**`,"Permanent QLs: **0**",""];
for(const q of reviewRows){markdown.push(`## ${q.prototypeId} — ${q.seed}`,"",q.stem,"",...q.options.map((option,index)=>`${String.fromCharCode(65+index)}. ${option}${index===q.correctIndex?" **✓**":""}`),"",`**Answer:** ${q.answer}`,"",`**Concept:** ${q.explanation.concept}`,"",...q.explanation.calculation.map(step=>`- ${step}`),"",`**Check:** ${q.explanation.verification}`,"",`**Common mistake:** ${q.explanation.commonMistake}`,"","---","");}
writeFileSync(markdownPath,`${markdown.join("\n")}\n`,"utf8");
console.log(JSON.stringify({status:"PASS_MAL_CP005_WAVE01_OPEN_EXECUTABLE_DISCOVERY",canonicalProblemId:"MAL-CP-005",executablePrototypeCount:MAL_CP005_DISCOVERY_PROTOTYPE_IDS.length,boundaryCount:MAL_CP005_BOUNDARY_LEDGER.length,permanentQlCount:0,generatedCount,deterministicCount,independentVerificationCount,distinctMathematicalFingerprintCount:fingerprints.size,distinctStemCount:stems.size,distinctAnswerCount:answers.size,answerPositionCounts,reviewRowCount:reviewRows.length},null,2));
