import { strict as assert } from "node:assert";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
function normalize(value:string):string{return value.toLowerCase().replace(/\\\([^)]*\\\)/g,"<math>").replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g,"<n>").replace(/[^a-z<>]+/g," ").trim();}
const exactStemOwner=new Map<string,string>(),normalizedStemOwner=new Map<string,string>(),exactExplanationOwner=new Map<string,string>();
const contextPhrases=new Set<string>(),contextActors=new Set<string>();
let audited=0,invalid=0,unresolved=0,malformedMath=0,unwrappedMath=0,optionFailures=0,genericExplanationHits=0,controlCharacterHits=0,assignmentWordHits=0,grammarHits=0;
for(const entry of TMW_CP005_REGISTRY){
 for(let index=0;index<12;index++){
  const generated=runTmwCp005Pipeline({questionLanguageId:entry.qlId,seed:`tmw-cp005-audit:${entry.qlId}:${index}`});
  audited+=1;contextPhrases.add(generated.parameters.context.jobPhrase);contextActors.add(generated.parameters.context.actorA);
  if(!generated.validation.valid)invalid+=1;
  const explanation=[generated.explanation.opening,generated.explanation.formula,...generated.explanation.steps,generated.explanation.conclusion].join(" ");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(generated.stem+explanation))unresolved+=1;
  if((explanation.match(/\\\(/g)??[]).length!==(explanation.match(/\\\)/g)??[]).length)malformedMath+=1;
  if(!/^\\\(.+\\\)$/.test(generated.explanation.formula)||generated.explanation.steps.some(step=>!/^\\\(.+\\\)$/.test(step)))unwrappedMath+=1;
  if(generated.options.length!==4||new Set(generated.options).size!==4||generated.correctIndex<0||generated.options[generated.correctIndex]!==generated.solution.answerText)optionFailures+=1;
  if(/now calculate carefully|use the formula|therefore we calculate/i.test(explanation))genericExplanationHits+=1;
  if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(generated.stem+explanation))controlCharacterHits+=1;
  assignmentWordHits+=(generated.stem.match(/\bassignment\b/gi)??[]).length;
  grammarHits+=(generated.stem.match(/\b1 (?:days|hours|cycles)\b|\ba 8-hour\b/gi)??[]).length;
  const exactOwner=exactStemOwner.get(generated.stem);if(exactOwner&&exactOwner!==entry.qlId)throw new Error(`Exact cross-QL stem collision: ${exactOwner} / ${entry.qlId}`);exactStemOwner.set(generated.stem,entry.qlId);
  const normalized=normalize(generated.stem),normalizedOwner=normalizedStemOwner.get(normalized);if(normalizedOwner&&normalizedOwner!==entry.qlId)throw new Error(`Normalised cross-QL stem collision: ${normalizedOwner} / ${entry.qlId}: ${normalized}`);normalizedStemOwner.set(normalized,entry.qlId);
  const explanationOwner=exactExplanationOwner.get(explanation);if(explanationOwner&&explanationOwner!==entry.qlId)throw new Error(`Exact cross-QL explanation duplicate: ${explanationOwner} / ${entry.qlId}`);exactExplanationOwner.set(explanation,entry.qlId);
 }
}
assert.equal(invalid,0);assert.equal(unresolved,0);assert.equal(malformedMath,0);assert.equal(unwrappedMath,0);assert.equal(optionFailures,0);assert.equal(genericExplanationHits,0);assert.equal(controlCharacterHits,0);assert.equal(assignmentWordHits,0);assert.equal(grammarHits,0);
assert.ok(contextPhrases.size>=10);assert.ok(contextActors.size>=10);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-005",qlCount:24,seedsPerQl:12,audited,invalid,unresolved,malformedMath,unwrappedMath,optionFailures,genericExplanationHits,controlCharacterHits,assignmentWordHits,grammarHits,distinctContextPhrases:contextPhrases.size,distinctContextActors:contextActors.size,exactCrossQlStemCollisions:0,normalizedCrossQlStemCollisions:0,exactCrossQlExplanationDuplicates:0,status:"PASS"},null,2));
