import { strict as assert } from "node:assert";
import { completionTrace, cycleWork } from "./foundation/cp005-engine";
import { add, multiply, rational, subtract, toLatex } from "./foundation/rational";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { runTmwCp005Pipeline } from "./foundation/cp005-runtime";
function normalize(value:string):string{return value.toLowerCase().replace(/\\\([^)]*\\\)/g,"<math>").replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g,"<n>").replace(/[^a-z<>]+/g," ").trim();}
type Generated=ReturnType<typeof runTmwCp005Pipeline>;
function expectedFinalTurn(generated:Generated):{hasWorkBeforeFinal:boolean;workBeforeFinalLatex:string;remainingForFinalLatex:string;finalRateLatex:string;finalDurationLatex:string;finalTimeLatex:string;terminalFractionLatex:string}{
 const p=generated.parameters,trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0),fullCycleWork=multiply(cycleWork(p.cycle),rational(trace.fullCycles)),remainingAfterFullCycles=subtract(p.totalWork,fullCycleWork),length=p.cycle.length,start=((p.startOffset??0)%length+length)%length;
 let index=start,guard=0,workBeforeFinal=rational(0),hasWorkBeforeFinal=false;
 while(index!==trace.terminalIndex){if(guard++>=length)throw new Error("Audit final-cycle traversal exceeded one cycle");const segment=p.cycle[index];workBeforeFinal=add(workBeforeFinal,multiply(segment.rate,segment.duration));hasWorkBeforeFinal=true;index=(index+1)%length;}
 const remainingForFinal=subtract(remainingAfterFullCycles,workBeforeFinal),finalSegment=p.cycle[trace.terminalIndex],finalTime=multiply(trace.terminalFraction,finalSegment.duration);
 return {hasWorkBeforeFinal,workBeforeFinalLatex:toLatex(workBeforeFinal),remainingForFinalLatex:toLatex(remainingForFinal),finalRateLatex:toLatex(finalSegment.rate),finalDurationLatex:toLatex(finalSegment.duration),finalTimeLatex:toLatex(finalTime),terminalFractionLatex:toLatex(trace.terminalFraction)};
}
const exactStemOwner=new Map<string,string>(),normalizedStemOwner=new Map<string,string>(),exactExplanationOwner=new Map<string,string>();
const contextPhrases=new Set<string>(),contextActors=new Set<string>();
const completionModes=new Set(["findCompletionTimeForTwoAgentAlternationStartingA","findCompletionTimeForTwoAgentAlternationStartingB","findCompletionTimeForMultiDayCycle","findCompletionTimeForThreeAgentCycle","findCompletionWhenHelperWorksEveryNthDay","findCompletionWhenAgentRestsEveryNthDay","findCompletionWithWeekendOrHolidayPattern","findCompletionWithUnequalShiftDurations","findCompletionWithTwoDaysOnOneDayOffPattern","findCompletionWithPeriodicNegativeWork","findCompletionWithRepeatedJoinLeaveCycle","findTimeFromArbitraryCyclePhase","findCompletionWithinCycleSegment"]);
const finalTurnModes=new Set([...completionModes,"findCompletionDayAndTerminalFraction","findTerminalAgent"]);
const inverseModes=new Set(["findUnknownRateFromAlternatingCompletion","findUnknownTimeFromAlternatingCompletion","findRequiredCycleRateForDeadline"]);
let audited=0,invalid=0,unresolved=0,malformedMath=0,unwrappedMath=0,optionFailures=0,genericExplanationHits=0,controlCharacterHits=0,assignmentWordHits=0,grammarHits=0,ordinalHits=0,jargonOpeningHits=0,missingCompletionDerivations=0,missingInverseDerivations=0,incorrectFinalTurnArithmetic=0,missingPreFinalWorkDerivations=0,boundaryExplanationHits=0,missingFinalBlockFraction=0,missingNextDayFraction=0;
for(const entry of TMW_CP005_REGISTRY){
 for(let index=0;index<12;index++){
  const generated=runTmwCp005Pipeline({questionLanguageId:entry.qlId,seed:`tmw-cp005-audit:${entry.qlId}:${index}`});
  audited+=1;contextPhrases.add(generated.parameters.context.jobPhrase);contextActors.add(generated.parameters.context.actorA);
  if(!generated.validation.valid)invalid+=1;
  const explanation=[generated.explanation.opening,generated.explanation.formula,...generated.explanation.steps,generated.explanation.conclusion].join(" "),stepText=generated.explanation.steps.join(" ");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(generated.stem+explanation))unresolved+=1;
  if((explanation.match(/\\\(/g)??[]).length!==(explanation.match(/\\\)/g)??[]).length)malformedMath+=1;
  if(!/^\\\(.+\\\)$/.test(generated.explanation.formula)||generated.explanation.steps.some(step=>!/^\\\(.+\\\)$/.test(step)))unwrappedMath+=1;
  if(generated.options.length!==4||new Set(generated.options).size!==4||generated.correctIndex<0||generated.options[generated.correctIndex]!==generated.solution.answerText)optionFailures+=1;
  if(/now calculate carefully|use the formula|therefore we calculate/i.test(explanation))genericExplanationHits+=1;
  if(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(generated.stem+explanation))controlCharacterHits+=1;
  assignmentWordHits+=(generated.stem.match(/\bassignment\b/gi)??[]).length;
  grammarHits+=(generated.stem.match(/\b1 (?:days|hours|cycles)\b|\ba 8-hour\b/gi)??[]).length;
  ordinalHits+=(generated.stem.match(/\b(?:1th|2th|3th)\b/gi)??[]).length;
  if(/terminal|phase|reconstruct|cycle position/i.test(generated.explanation.opening))jargonOpeningHits+=1;
  if(completionModes.has(entry.solveMode)&&(!/W_\{remaining/.test(stepText)||!/t_\{final\}/.test(stepText)))missingCompletionDerivations+=1;
  if(inverseModes.has(entry.solveMode)&&(!/W_\{known\}/.test(stepText)||!/W_\{remaining\}/.test(stepText)||!/t_x/.test(stepText)))missingInverseDerivations+=1;
  if(finalTurnModes.has(entry.solveMode)){
   const expected=expectedFinalTurn(generated),division=`\\frac{${expected.remainingForFinalLatex}}{${expected.finalRateLatex}}=${expected.finalTimeLatex}`;
   if(!stepText.includes(division))incorrectFinalTurnArithmetic+=1;
   if(expected.hasWorkBeforeFinal){
    const hasWorkLine=stepText.includes("W_{before\\ final\\ turn}=")&&stepText.includes(`=${expected.workBeforeFinalLatex}`),hasRemainingLine=/W_\{left\\ for\\ (?:final|next)\\ worker\}=/.test(stepText)&&stepText.includes(`=${expected.remainingForFinalLatex}`);
    if(!hasWorkLine||!hasRemainingLine)missingPreFinalWorkDerivations+=1;
   }
   if(entry.solveMode==="findCompletionWithinCycleSegment"){
    const fraction=`\\text{fraction of final block}=\\frac{${expected.finalTimeLatex}}{${expected.finalDurationLatex}}=${expected.terminalFractionLatex}`;
    if(!stepText.includes(fraction))missingFinalBlockFraction+=1;
   }
   if(entry.solveMode==="findCompletionDayAndTerminalFraction"&&!stepText.includes(`\\text{fraction of next day}=${expected.terminalFractionLatex}`))missingNextDayFraction+=1;
  }
  if(entry.solveMode==="findExactBoundaryCompletion"&&(/t_\{final\}|W_\{remaining/.test(stepText+generated.explanation.formula)))boundaryExplanationHits+=1;
  const exactOwner=exactStemOwner.get(generated.stem);if(exactOwner&&exactOwner!==entry.qlId)throw new Error(`Exact cross-QL stem collision: ${exactOwner} / ${entry.qlId}`);exactStemOwner.set(generated.stem,entry.qlId);
  const normalized=normalize(generated.stem),normalizedOwner=normalizedStemOwner.get(normalized);if(normalizedOwner&&normalizedOwner!==entry.qlId)throw new Error(`Normalised cross-QL stem collision: ${normalizedOwner} / ${entry.qlId}: ${normalized}`);normalizedStemOwner.set(normalized,entry.qlId);
  const explanationOwner=exactExplanationOwner.get(explanation);if(explanationOwner&&explanationOwner!==entry.qlId)throw new Error(`Exact cross-QL explanation duplicate: ${explanationOwner} / ${entry.qlId}`);exactExplanationOwner.set(explanation,entry.qlId);
 }
}
assert.equal(invalid,0);assert.equal(unresolved,0);assert.equal(malformedMath,0);assert.equal(unwrappedMath,0);assert.equal(optionFailures,0);assert.equal(genericExplanationHits,0);assert.equal(controlCharacterHits,0);assert.equal(assignmentWordHits,0);assert.equal(grammarHits,0);assert.equal(ordinalHits,0);assert.equal(jargonOpeningHits,0);assert.equal(missingCompletionDerivations,0);assert.equal(missingInverseDerivations,0);assert.equal(incorrectFinalTurnArithmetic,0);assert.equal(missingPreFinalWorkDerivations,0);assert.equal(boundaryExplanationHits,0);assert.equal(missingFinalBlockFraction,0);assert.equal(missingNextDayFraction,0);
assert.ok(contextPhrases.size>=10);assert.ok(contextActors.size>=10);
console.log(JSON.stringify({chapter:"TMW-001",checkpoint:"TMW-CP-005",qlCount:24,seedsPerQl:12,audited,invalid,unresolved,malformedMath,unwrappedMath,optionFailures,genericExplanationHits,controlCharacterHits,assignmentWordHits,grammarHits,ordinalHits,jargonOpeningHits,missingCompletionDerivations,missingInverseDerivations,incorrectFinalTurnArithmetic,missingPreFinalWorkDerivations,boundaryExplanationHits,missingFinalBlockFraction,missingNextDayFraction,distinctContextPhrases:contextPhrases.size,distinctContextActors:contextActors.size,exactCrossQlStemCollisions:0,normalizedCrossQlStemCollisions:0,exactCrossQlExplanationDuplicates:0,status:"PASS"},null,2));
