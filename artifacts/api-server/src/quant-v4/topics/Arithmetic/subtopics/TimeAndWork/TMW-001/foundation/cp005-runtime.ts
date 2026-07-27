import { getTmwCp005Entry } from "./cp005-registry";
import { buildTmwCp005Options } from "./cp005-options";
import { buildTmwCp005Parameters } from "./cp005-parameters";
import { renderTmwCp005Stem, tmwCp005Conclusion, tmwCp005ExplanationOpening } from "./cp005-presentation";
import { solveTmwCp005, verifyTmwCp005 } from "./cp005-solver";
import { rationalKey } from "./rational";
import type { Rational } from "./types";
import type { TmwCp005GeneratedQuestion, TmwCp005Parameters } from "./cp005-types";
function key(value:Rational|undefined):string{return value?rationalKey(value):"-";}
function fingerprint(p:TmwCp005Parameters,mode:string):string{return [mode,p.cycle.map(segment=>`${segment.label}:${rationalKey(segment.rate)}:${rationalKey(segment.duration)}`).join(";"),p.startOffset??0,p.givenCycles??"-",key(p.givenTime),key(p.targetWork),key(p.knownCompletionTime),p.knownTerminalLabel??"-",p.unknownSegmentIndex??"-",key(p.deadline),p.patternNumber??"-",p.timeUnit].join("|");}
function inlineMath(latex:string):string{return `\\(${latex}\\)`;}
export function runTmwCp005Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp005GeneratedQuestion{
 if(input.language&&input.language!=="en")throw new Error("TMW-CP-005 is English only at the current runtime-proof stage");
 const entry=getTmwCp005Entry(input.questionLanguageId),parameters=buildTmwCp005Parameters(entry,input.seed),solution=solveTmwCp005(entry,parameters),optionSet=buildTmwCp005Options(entry,parameters,solution,input.seed),stem=renderTmwCp005Stem(entry,parameters);
 const formula=inlineMath(solution.formulaLatex),steps=solution.workedLatex.map(inlineMath),errors:string[]=[];
 if(!verifyTmwCp005(entry,parameters,solution))errors.push("Independent verifier disagrees with canonical solver");
 if(!stem.trim())errors.push("Stem is empty");
 if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
 if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
 if(new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Options are not textually unique");
 if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct answer is missing from options");
 if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
 if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
 if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
 return {archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-005",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening:tmwCp005ExplanationOpening(entry),formula,steps,conclusion:tmwCp005Conclusion(entry,parameters,solution.answerText)},mathematicalFingerprint:fingerprint(parameters,entry.solveMode),validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
