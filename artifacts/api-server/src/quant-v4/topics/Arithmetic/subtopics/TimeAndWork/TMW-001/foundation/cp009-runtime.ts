import { getTmwCp009Entry } from "./cp009-registry";
import { buildTmwCp009Parameters, solveTmwCp009, validTmwCp009Solution, verifyTmwCp009 } from "./cp009-engine";
import { buildTmwCp009Options } from "./cp009-options";
import { renderTmwCp009Stem, tmwCp009CommonTrap, tmwCp009Conclusion, tmwCp009Givens, tmwCp009Opening, tmwCp009Shortcut } from "./cp009-presentation";
import { rationalKey } from "./rational";
import type { TmwCp009GeneratedQuestion, TmwCp009Parameters } from "./cp009-types";
function inline(value:string):string{return `\\(${value}\\)`;}
function balanced(value:string):boolean{return (value.match(/\\\(/g)??[]).length===(value.match(/\\\)/g)??[]).length;}
function hasAsciiFractionalTime(value:string):boolean{return /\b(?:\d+\s+)?\d+\/\d+\s+hours?\b/i.test(value);}
function normaliseEqualityTerm(value:string):string{return value.replace(/\\(?:quad|;|,|!)/g,"").replace(/\\text\{[^}]*\}/g,"").replace(/[{}\s]/g,"").trim();}
function repeatsTerminalEquality(value:string):boolean{const terms=value.split("=");if(terms.length<3)return false;const previous=normaliseEqualityTerm(terms.at(-2)??""),last=normaliseEqualityTerm(terms.at(-1)??"");return previous.length>0&&previous===last;}
function fingerprint(p:TmwCp009Parameters):string{return[
 p.pipes.map(pipe=>`${pipe.kind}:${rationalKey(pipe.soloTime)}`).join(","),
 p.duration?rationalKey(p.duration):"-",p.initialLevel?rationalKey(p.initialLevel):"-",p.targetBoundary??"-",String(p.unknownPipeIndex??"-"),
 p.identicalPipeSoloTime?rationalKey(p.identicalPipeSoloTime):"-",p.targetCompletionTime?rationalKey(p.targetCompletionTime):"-",p.capacity?rationalKey(p.capacity):"-",
 p.physicalFlow?rationalKey(p.physicalFlow):"-",p.physicalTime?rationalKey(p.physicalTime):"-",p.sourceFlowUnit??"-",p.targetFlowUnit??"-",
 p.comparison?[p.comparison.flowA,p.comparison.timeA,p.comparison.flowB,p.comparison.timeB].map(rationalKey).join(":"):"-",
 p.originalTime?rationalKey(p.originalTime):"-",p.changedTime?rationalKey(p.changedTime):"-",p.decisionWindow?rationalKey(p.decisionWindow):"-",
 ].join("|");}
export function runTmwCp009Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp009GeneratedQuestion{
 if(input.language&&input.language!=="en")throw new Error("TMW-CP-009 is English only at the current runtime-proof stage");
 const entry=getTmwCp009Entry(input.questionLanguageId),parameters=buildTmwCp009Parameters(entry,input.seed),solution=solveTmwCp009(entry,parameters),optionSet=buildTmwCp009Options(entry,parameters,solution,input.seed),stem=renderTmwCp009Stem(entry,parameters),formula=inline(solution.formulaLatex),steps=solution.workedLatex.map(inline),opening=tmwCp009Opening(entry),givens=tmwCp009Givens(entry,parameters),shortcut=tmwCp009Shortcut(entry,parameters,solution),commonTrap=tmwCp009CommonTrap(optionSet.options,optionSet.correctIndex),conclusion=tmwCp009Conclusion(entry,parameters,solution.answerText),errors:string[]=[];
 const learner=[stem,...optionSet.options.map(option=>option.text),opening,formula,...givens,...steps,shortcut.title,...shortcut.steps,commonTrap.optionLabel,commonTrap.optionText,commonTrap.explanation,conclusion].join(" ");
 if(!verifyTmwCp009(entry,parameters,solution))errors.push("Independent signed-flow invariant disagrees with canonical solver");
 if(!validTmwCp009Solution(entry,solution))errors.push("Answer is not admissible for its answer contract");
 if(!stem.trim())errors.push("Stem is empty");
 if(!/tank|reservoir|supply pipe/i.test(stem))errors.push("Stem lacks a tank or reservoir context");
 if(!/initially|empty|full|same flow rate|capacity|flow rate|water level|originally/i.test(stem))errors.push("Stem does not establish the required initial or physical state");
 if(/opens later|closes after|after \d+ hours.*opens|alternate hours|periodic/i.test(stem))errors.push("Stem crosses into CP-010 staged or cyclic ownership");
 if(!/how long|in how much time|what fraction|how many|what is|what happens|will the tank|by what percentage/i.test(stem))errors.push("Stem target is not explicit");
 if(optionSet.options.length!==4||new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Option package is not four unique choices");
 if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
 if(optionSet.options[optionSet.correctIndex]?.key!==solution.answerKey)errors.push("Correct option does not match the canonical answer");
 if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option audit does not contain exactly one correct answer");
 if(!/^\\\(.+\\\)$/.test(formula)||steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Formula or standard step lacks literal inline MathJax");
 if(!balanced(learner))errors.push("Learner text has unbalanced inline MathJax");
 if(hasAsciiFractionalTime(learner))errors.push("Learner text contains an ASCII fractional time");
 if(entry.answerType==="TIME"&&solution.answerValues[0].denominator!==1&&(!solution.answerText.startsWith("\\(")||!solution.answerText.includes("\\frac")))errors.push("Fractional time answer is not MathJax formatted");
 if(givens.length<2)errors.push("Explanation does not identify givens and target");
 if(steps.length<3)errors.push("Standard working is too brief");
 if(solution.workedLatex.some(repeatsTerminalEquality))errors.push("Standard working repeats an identical terminal equality");
 if(!shortcut.title.startsWith("10-Second ")||shortcut.steps.length<2)errors.push("Exam shortcut is incomplete");
 if(commonTrap.optionText===solution.answerText)errors.push("Common trap points to the correct answer");
 if(!commonTrap.explanation.startsWith(`${commonTrap.optionLabel} (${commonTrap.optionText})`))errors.push("Common trap is not a direct option-specific diagnosis");
 if(/do not choose/i.test(commonTrap.explanation))errors.push("Common trap uses a negative command");
 if(/[A-Z]{3,}_[A-Z_]{3,}/.test(commonTrap.explanation))errors.push("Learner-facing trap leaks an internal misconception ID");
 if(!/rate|flow|capacity|level|efficiency/i.test(opening))errors.push("Core concept does not explain the governing pipe relation");
 if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(learner))errors.push("Learner text contains an unresolved placeholder");
 return{archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-009",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening,formula,givens,steps,shortcut,commonTrap,conclusion},mathematicalFingerprint:`${entry.solveMode}|${fingerprint(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
