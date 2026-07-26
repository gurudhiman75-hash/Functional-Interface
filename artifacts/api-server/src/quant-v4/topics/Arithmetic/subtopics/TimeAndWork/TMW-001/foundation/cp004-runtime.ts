import { getTmwCp004Entry } from "./cp004-registry";
import { buildTmwCp004Options } from "./cp004-options";
import { buildTmwCp004Parameters } from "./cp004-parameters";
import { renderTmwCp004Stem, tmwCp004Conclusion, tmwCp004ExplanationOpening } from "./cp004-presentation";
import { solveTmwCp004, verifyTmwCp004 } from "./cp004-solver";
import { rationalKey } from "./rational";
import type { Rational } from "./types";
import type { TmwCp004GeneratedQuestion, TmwCp004Parameters } from "./cp004-types";

function key(v:Rational|undefined):string{return v?rationalKey(v):"-";}
function fingerprint(p:TmwCp004Parameters,mode:string):string{return [
 mode,key(p.timeA),key(p.timeB),key(p.timeC),key(p.rateA),key(p.rateB),key(p.rateC),
 key(p.durationA),key(p.durationB),key(p.durationC),key(p.totalCompletionTime),key(p.idleDuration),
 key(p.targetFraction),key(p.deadline),key(p.originalDailyHours),key(p.changedDailyHours),
 key(p.efficiencyMultiplier),key(p.perWorkerTime),p.initialWorkerCount??"-",p.changedWorkerCount??"-",p.timeUnit,
].join("|");}
function inlineMath(latex:string):string{return `\\(${latex}\\)`;}

export function runTmwCp004Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp004GeneratedQuestion{
 if(input.language&&input.language!=="en")throw new Error("TMW-CP-004 is English only at the current runtime-proof stage");
 const entry=getTmwCp004Entry(input.questionLanguageId),parameters=buildTmwCp004Parameters(entry,input.seed),solution=solveTmwCp004(entry,parameters),optionSet=buildTmwCp004Options(entry,parameters,solution,input.seed),stem=renderTmwCp004Stem(entry,parameters);
 const formula=inlineMath(solution.formulaLatex),steps=solution.workedLatex.map(inlineMath),errors:string[]=[];
 if(!verifyTmwCp004(entry,parameters,solution))errors.push("Independent verifier disagrees with canonical solver");
 if(!stem.trim())errors.push("Stem is empty");
 if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
 if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
 if(new Set(optionSet.options.map(x=>x.text)).size!==4)errors.push("Options are not textually unique");
 if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct answer is missing from options");
 if(optionSet.options.filter(x=>x.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
 if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
 if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
 return {archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-004",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(x=>x.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening:tmwCp004ExplanationOpening(entry),formula,steps,conclusion:tmwCp004Conclusion(entry,parameters,solution.answerText)},mathematicalFingerprint:fingerprint(parameters,entry.solveMode),validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
