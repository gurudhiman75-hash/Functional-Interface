import { strict as assert } from "node:assert";
import { equals } from "./foundation/rational";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { runTmwCp006Pipeline } from "./foundation/cp006-runtime";

function normalize(value:string):string{return value.toLowerCase().replace(/\\\([^)]*\\\)/g,"<math>").replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g,"<n>").replace(/[^a-z<>]+/g," ").trim();}
function optionIndex(label:string):number{return "ABCD".indexOf(label.replace("Option ",""));}
const exactStemOwner=new Map<string,string>(),normalizedStemOwner=new Map<string,string>(),exactExplanationOwner=new Map<string,string>();
const contexts=new Set<string>(),resourceKinds=new Set<string>(),shortcutTitles=new Set<string>();
let audited=0,invalid=0,unresolved=0,malformedMath=0,unwrappedMath=0,optionFailures=0,genericExplanationHits=0,genericConclusionHits=0,controlCharacterHits=0,grammarHits=0,jargonHits=0,weakExplanationHits=0,discreteAnswerHits=0,changeCountHits=0,dimensionVisibilityHits=0,resourceTimeUnitHits=0,hiddenRateExplanationHits=0,resourceTimeRedundancyHits=0,missingGivensHits=0,missingShortcutHits=0,trapMappingHits=0,trapCorrectOptionHits=0,dollarDelimiterHits=0,mdhDefinitionHits=0,personDaysShortcutHits=0,batchGridHits=0,genericTrapHits=0;

for(const entry of TMW_CP006_REGISTRY){
  for(let index=0;index<12;index+=1){
    const generated=runTmwCp006Pipeline({questionLanguageId:entry.qlId,seed:`tmw-cp006-audit:${entry.qlId}:${index}`});
    audited+=1;contexts.add(generated.parameters.context.jobPhrase);resourceKinds.add(generated.parameters.context.resourcePlural);shortcutTitles.add(generated.explanation.shortcut.title);
    if(!generated.validation.valid)invalid+=1;
    const trap=generated.explanation.commonTrap;
    const explanation=[generated.explanation.opening,generated.explanation.formula,...generated.explanation.givens,...generated.explanation.steps,generated.explanation.shortcut.title,...generated.explanation.shortcut.steps,trap.optionLabel,trap.optionText,trap.misconceptionId,trap.explanation,generated.explanation.conclusion].join(" ");
    if(/\{\{[^}]+\}\}|\$\{[^}]+\}|undefined|NaN/.test(generated.stem+explanation))unresolved+=1;
    if((explanation.match(/\\\(/g)??[]).length!==(explanation.match(/\\\)/g)??[]).length)malformedMath+=1;
    if(!/^\\\(.+\\\)$/.test(generated.explanation.formula)||generated.explanation.steps.some(step=>!/^\\\(.+\\\)$/.test(step)))unwrappedMath+=1;
    if(generated.options.length!==4||new Set(generated.options).size!==4||generated.correctIndex<0||generated.options[generated.correctIndex]!==generated.solution.answerText)optionFailures+=1;
    if(/now calculate carefully|use the formula|therefore we calculate|simply apply/i.test(explanation))genericExplanationHits+=1;
    if(/therefore,? (?:the )?required answer is/i.test(generated.explanation.conclusion))genericConclusionHits+=1;
    if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(generated.stem+explanation))controlCharacterHits+=1;
    if(/\ba a\b|\ban a\b|\b1 (?:days|hours|shifts|workers|machines)\b|\b0 (?:workers|machines|days|hours)\b/i.test(generated.stem))grammarHits+=1;
    if(/canonical|state vector|dispatch|parameter|topology|runtime|solver/i.test(generated.explanation.opening))jargonHits+=1;
    if(generated.explanation.steps.length<2)weakExplanationHits+=1;
    if(generated.explanation.givens.length<1)missingGivensHits+=1;
    if(!generated.explanation.shortcut.title.trim()||generated.explanation.shortcut.steps.length<1)missingShortcutHits+=1;
    if(["COUNT","SHIFT","RESOURCE_TIME"].includes(entry.answerType)&&generated.solution.answer.denominator!==1)discreteAnswerHits+=1;
    if(entry.solveMode==="findAdditionalWorkersForDeadline"&&equals(generated.solution.answer,generated.parameters.stateB.resources))changeCountHits+=1;
    if(entry.solveMode==="findWorkersRemovedForDelay"&&equals(generated.solution.answer,generated.parameters.stateB.resources))changeCountHits+=1;
    if(entry.solveMode==="findExtraWorkersFromPlannedVsActualProgress"&&equals(generated.solution.answer,generated.parameters.stateB.resources))changeCountHits+=1;
    if(entry.ruleId==="TMW_DIMENSIONAL_WORK")for(const label of generated.parameters.dimensionLabels??[])if(!generated.stem.includes(label))dimensionVisibilityHits+=1;
    if(entry.solveMode==="findWorkQuantity"&&/[EH]_[12]/.test(generated.explanation.formula))hiddenRateExplanationHits+=1;
    if(entry.solveMode==="findEquivalentResourceTime"){
      const expectsHours=generated.parameters.context.resourceTimeUnit.endsWith("hours");
      if(expectsHours&&!/\bhours?\b/i.test(generated.stem))resourceTimeUnitHits+=1;
      if(!expectsHours&&!/\bdays?\b/i.test(generated.stem))resourceTimeUnitHits+=1;
      if(/\\times\s*1(?:\D|$)/.test(generated.explanation.steps.join(" ")))resourceTimeRedundancyHits+=1;
    }
    const trapIndex=optionIndex(trap.optionLabel);
    if(trapIndex<0||generated.options[trapIndex]!==trap.optionText||generated.optionAudit[trapIndex]?.misconceptionId!==trap.misconceptionId)trapMappingHits+=1;
    if(trapIndex===generated.correctIndex||trap.misconceptionId==="CORRECT")trapCorrectOptionHits+=1;
    if(trap.misconceptionId==="PLAUSIBLE_SCALE_ERROR")genericTrapHits+=1;
    if(/(^|[^\\])\$/.test(explanation))dollarDelimiterHits+=1;
    if(["findRequiredResourceCount","findRequiredDays","findRequiredDailyHours","findRelativeEfficiency"].includes(entry.solveMode)){
      if(!/MDH\/W/.test(generated.explanation.opening)||!["N","D","H","E","W"].every(symbol=>generated.explanation.opening.includes(`\\(${symbol}\\)`)))mdhDefinitionHits+=1;
    }
    if(entry.solveMode==="findResourceDurationAfterPopulationChange"&&!/person-days/i.test(generated.explanation.shortcut.title+" "+generated.explanation.shortcut.steps.join(" ")))personDaysShortcutHits+=1;
    if(entry.solveMode==="findCompletionWithBatchWorkerAdditions"){
      const shortcut=generated.explanation.shortcut.title+" "+generated.explanation.shortcut.steps.join(" ");
      if(!/Daily AP work grid/i.test(shortcut)||!/Day 1:/i.test(shortcut)||!/Running/i.test(shortcut))batchGridHits+=1;
    }
    const exactOwner=exactStemOwner.get(generated.stem);if(exactOwner&&exactOwner!==entry.qlId)throw new Error(`Exact cross-QL stem collision: ${exactOwner} / ${entry.qlId}`);exactStemOwner.set(generated.stem,entry.qlId);
    const normalized=normalize(generated.stem),normalizedOwner=normalizedStemOwner.get(normalized);if(normalizedOwner&&normalizedOwner!==entry.qlId)throw new Error(`Normalised cross-QL stem collision: ${normalizedOwner} / ${entry.qlId}: ${normalized}`);normalizedStemOwner.set(normalized,entry.qlId);
    const explanationOwner=exactExplanationOwner.get(explanation);if(explanationOwner&&explanationOwner!==entry.qlId)throw new Error(`Exact cross-QL explanation duplicate: ${explanationOwner} / ${entry.qlId}`);exactExplanationOwner.set(explanation,entry.qlId);
  }
}
assert.equal(invalid,0);assert.equal(unresolved,0);assert.equal(malformedMath,0);assert.equal(unwrappedMath,0);assert.equal(optionFailures,0);assert.equal(genericExplanationHits,0);assert.equal(genericConclusionHits,0);assert.equal(controlCharacterHits,0);assert.equal(grammarHits,0);assert.equal(jargonHits,0);assert.equal(weakExplanationHits,0);assert.equal(missingGivensHits,0);assert.equal(missingShortcutHits,0);assert.equal(discreteAnswerHits,0);assert.equal(changeCountHits,0);assert.equal(dimensionVisibilityHits,0);assert.equal(resourceTimeUnitHits,0);assert.equal(hiddenRateExplanationHits,0);assert.equal(resourceTimeRedundancyHits,0);assert.equal(trapMappingHits,0);assert.equal(trapCorrectOptionHits,0);assert.equal(dollarDelimiterHits,0);assert.equal(mdhDefinitionHits,0);assert.equal(personDaysShortcutHits,0);assert.equal(batchGridHits,0);assert.equal(genericTrapHits,0);
assert.ok(contexts.size>=8);assert.ok(resourceKinds.size>=5);assert.ok(shortcutTitles.size>=10);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-006",qlCount:22,seedsPerQl:12,audited,invalid,unresolved,malformedMath,unwrappedMath,optionFailures,genericExplanationHits,genericConclusionHits,controlCharacterHits,grammarHits,jargonHits,weakExplanationHits,missingGivensHits,missingShortcutHits,discreteAnswerHits,changeCountHits,dimensionVisibilityHits,resourceTimeUnitHits,hiddenRateExplanationHits,resourceTimeRedundancyHits,trapMappingHits,trapCorrectOptionHits,dollarDelimiterHits,mdhDefinitionHits,personDaysShortcutHits,batchGridHits,genericTrapHits,distinctContexts:contexts.size,distinctResourceKinds:resourceKinds.size,distinctShortcutTitles:shortcutTitles.size,exactCrossQlStemCollisions:0,normalizedCrossQlStemCollisions:0,exactCrossQlExplanationDuplicates:0,status:"PASS"},null,2));
