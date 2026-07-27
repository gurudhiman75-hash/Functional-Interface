import { strict as assert } from "node:assert";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { runTmwCp007Pipeline } from "./foundation/cp007-runtime";

function normalize(value:string):string{return value.toLowerCase().replace(/\\\([^)]*\\\)/g,"<math>").replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g,"<n>").replace(/[^a-z<>]+/g," ").trim();}
const exactStemOwner=new Map<string,string>(),normalizedStemOwner=new Map<string,string>(),contexts=new Set<string>(),categoryFamilies=new Set<string>();
let audited=0,invalid=0,unresolved=0,malformedMath=0,unwrappedMath=0,optionFailures=0,genericExplanationHits=0,controlCharacterHits=0,grammarHits=0,jargonHits=0,weakExplanationHits=0,discreteAnswerHits=0,missingGivensHits=0,missingShortcutHits=0,trapMappingHits=0,correctTrapHits=0,genericTrapHits=0,dollarDelimiterHits=0,collapsedLatexHits=0,unitMismatchHits=0,zeroCoefficientHits=0,perPersonHits=0,machineCrewHits=0;
for(const entry of TMW_CP007_REGISTRY)for(let index=0;index<12;index+=1){
  const generated=runTmwCp007Pipeline({questionLanguageId:entry.qlId,seed:`tmw-cp007-audit:${entry.qlId}:${index}`});audited+=1;contexts.add(generated.parameters.context.jobPhrase);categoryFamilies.add(generated.parameters.context.categories.map(category=>category.singular).join("|"));
  if(!generated.validation.valid)invalid+=1;
  const explanation=[generated.explanation.opening,...generated.explanation.givens,generated.explanation.formula,...generated.explanation.steps,generated.explanation.shortcut.title,...generated.explanation.shortcut.steps,generated.explanation.commonTrap.explanation,generated.explanation.conclusion].join(" ");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}|undefined|NaN/.test(generated.stem+explanation))unresolved+=1;
  if((explanation.match(/\\\(/g)??[]).length!==(explanation.match(/\\\)/g)??[]).length)malformedMath+=1;
  if(!/^\\\(.+\\\)$/.test(generated.explanation.formula)||generated.explanation.steps.some(step=>!/^\\\(.+\\\)$/.test(step)))unwrappedMath+=1;
  if(generated.options.length!==4||new Set(generated.options).size!==4||generated.correctIndex<0||generated.options[generated.correctIndex]!==generated.solution.answerText)optionFailures+=1;
  if(/now calculate carefully|use the formula|therefore we calculate|simply apply/i.test(explanation))genericExplanationHits+=1;
  if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(generated.stem+explanation))controlCharacterHits+=1;
  if(/\b1 [^,.]+ do the same work|\b1 (?:men|women|children|workers|machines|printers|lines)\b|\ba a\b|\ban a\b/i.test(generated.stem))grammarHits+=1;
  if(/canonical|state vector|dispatch|parameter|topology|runtime|solver/i.test(generated.explanation.opening))jargonHits+=1;
  if(generated.explanation.steps.length<2)weakExplanationHits+=1;
  if(["COUNT","COUNT_PAIR","RESOURCE_TIME"].includes(entry.answerType)&&generated.solution.answerValues.some(value=>value.denominator!==1))discreteAnswerHits+=1;
  if(generated.explanation.givens.length<2)missingGivensHits+=1;
  if(generated.explanation.shortcut.steps.length<2)missingShortcutHits+=1;
  const trap=generated.explanation.commonTrap,trapIndex=generated.options.indexOf(trap.optionText);if(trapIndex<0||trap.optionLabel!==`Option ${String.fromCharCode(65+trapIndex)}`||generated.optionAudit[trapIndex]?.misconceptionId!==trap.misconceptionId)trapMappingHits+=1;
  if(trap.optionText===generated.solution.answerText||trapIndex===generated.correctIndex)correctTrapHits+=1;
  if(trap.misconceptionId==="PLAUSIBLE_SCALE_ERROR")genericTrapHits+=1;
  if(/\$\$|(?<!\\)\$[^$]+\$/.test(explanation))dollarDelimiterHits+=1;
  if(/(?:^|[^\\])(?:frac|times|text|quad|Rightarrow|mathbf|begin|end|sum|mathbb)(?:\{|\s|_)/.test(generated.explanation.formula+generated.explanation.steps.join(" ")))collapsedLatexHits+=1;
  if(entry.solveMode==="findMixedCrewCompletionTime"&&generated.parameters.context.outputUnit!=="work units"&&/work units per/i.test(generated.stem))unitMismatchHits+=1;
  if(/(?:^|[+,(])0e_[ABC]/.test(generated.explanation.steps.join(" ")))zeroCoefficientHits+=1;
  if(/per-person|one-person/i.test(generated.stem+explanation))perPersonHits+=1;
  const learnerProse=[generated.stem,generated.explanation.opening,...generated.explanation.givens,generated.explanation.shortcut.title,...generated.explanation.shortcut.steps,generated.explanation.commonTrap.explanation,generated.explanation.conclusion].join(" ");
  if(generated.parameters.context.categories.every(category=>category.resourceTimeUnit.endsWith("hours"))&&/\bcrew\b/i.test(learnerProse))machineCrewHits+=1;
  const exactOwner=exactStemOwner.get(generated.stem);if(exactOwner&&exactOwner!==entry.qlId)throw new Error(`Exact cross-QL stem collision: ${exactOwner} / ${entry.qlId}`);exactStemOwner.set(generated.stem,entry.qlId);
  const normalized=normalize(generated.stem),normalizedOwner=normalizedStemOwner.get(normalized);if(normalizedOwner&&normalizedOwner!==entry.qlId)throw new Error(`Normalised cross-QL stem collision: ${normalizedOwner} / ${entry.qlId}`);normalizedStemOwner.set(normalized,entry.qlId);
}
assert.equal(invalid,0);assert.equal(unresolved,0);assert.equal(malformedMath,0);assert.equal(unwrappedMath,0);assert.equal(optionFailures,0);assert.equal(genericExplanationHits,0);assert.equal(controlCharacterHits,0);assert.equal(grammarHits,0);assert.equal(jargonHits,0);assert.equal(weakExplanationHits,0);assert.equal(discreteAnswerHits,0);assert.equal(missingGivensHits,0);assert.equal(missingShortcutHits,0);assert.equal(trapMappingHits,0);assert.equal(correctTrapHits,0);assert.equal(genericTrapHits,0);assert.equal(dollarDelimiterHits,0);assert.equal(collapsedLatexHits,0);assert.equal(unitMismatchHits,0);assert.equal(zeroCoefficientHits,0);assert.equal(perPersonHits,0);assert.equal(machineCrewHits,0);assert.ok(contexts.size>=6);assert.ok(categoryFamilies.size>=6);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-007",qlCount:16,seedsPerQl:12,audited,invalid,unresolved,malformedMath,unwrappedMath,optionFailures,genericExplanationHits,controlCharacterHits,grammarHits,jargonHits,weakExplanationHits,discreteAnswerHits,missingGivensHits,missingShortcutHits,trapMappingHits,correctTrapHits,genericTrapHits,dollarDelimiterHits,collapsedLatexHits,unitMismatchHits,zeroCoefficientHits,perPersonHits,machineCrewHits,distinctContexts:contexts.size,distinctCategoryFamilies:categoryFamilies.size,exactCrossQlStemCollisions:0,normalizedCrossQlStemCollisions:0,status:"PASS"},null,2));
