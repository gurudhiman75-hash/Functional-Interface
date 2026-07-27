import { getTmwCp006Entry } from "./cp006-registry";
import { buildTmwCp006Options } from "./cp006-options";
import { buildTmwCp006Parameters } from "./cp006-parameters";
import { buildTmwCp006CommonTrap, buildTmwCp006Givens, buildTmwCp006Shortcut } from "./cp006-learning";
import { tmwCp006KeyRule } from "./cp006-key-rule";
import { renderTmwCp006Stem, tmwCp006Conclusion, tmwCp006ExplanationOpening } from "./cp006-presentation";
import { polishTmwCp006Solution } from "./cp006-solution-polish";
import { isPositiveCp006Answer, solveTmwCp006, verifyTmwCp006 } from "./cp006-solver";
import { rationalKey } from "./rational";
import type { TmwCp006GeneratedQuestion, TmwCp006Parameters } from "./cp006-types";

function stateKey(p:TmwCp006Parameters):string{
  const state=(s:TmwCp006Parameters["stateA"]):string=>[s.resources,s.days,s.hoursPerDay,s.efficiency,s.work].map(rationalKey).join(":");
  const optional=(value:{numerator:number;denominator:number}|undefined):string=>value?rationalKey(value):"-";
  return [state(p.stateA),state(p.stateB),optional(p.elapsedDays),optional(p.completedFraction),optional(p.absentPercent),optional(p.initialPopulation),optional(p.changedPopulation),optional(p.elapsedBeforePopulationChange),optional(p.initialBatchResources),optional(p.batchAddition),(p.dimensionsA??[]).map(rationalKey).join(","),(p.dimensionsB??[]).map(rationalKey).join(",")].join("|");
}
function inlineMath(latex:string):string{return `\\(${latex}\\)`;}
function balancedInlineMath(value:string):boolean{return (value.match(/\\\(/g)??[]).length===(value.match(/\\\)/g)??[]).length;}

export function runTmwCp006Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp006GeneratedQuestion{
  if(input.language&&input.language!=="en")throw new Error("TMW-CP-006 is English only at the current runtime-proof stage");
  const entry=getTmwCp006Entry(input.questionLanguageId);
  const parameters=buildTmwCp006Parameters(entry,input.seed);
  const rawSolution=solveTmwCp006(entry,parameters);
  const solution=polishTmwCp006Solution(entry,parameters,rawSolution);
  const optionSet=buildTmwCp006Options(entry,parameters,solution,input.seed);
  const stem=renderTmwCp006Stem(entry,parameters);
  const formula=inlineMath(solution.formulaLatex),steps=solution.workedLatex.map(inlineMath),errors:string[]=[];
  const explanation={
    opening:`${tmwCp006KeyRule(entry)} ${tmwCp006ExplanationOpening(entry)}`,
    formula,
    givens:buildTmwCp006Givens(entry,parameters),
    steps,
    shortcut:buildTmwCp006Shortcut(entry,parameters,solution),
    commonTrap:buildTmwCp006CommonTrap(entry,optionSet.options),
    conclusion:tmwCp006Conclusion(entry,parameters,solution.answerText),
  };
  const explanationText=[explanation.opening,explanation.formula,...explanation.givens,...explanation.steps,explanation.shortcut.title,...explanation.shortcut.steps,explanation.commonTrap.optionLabel,explanation.commonTrap.optionText,explanation.commonTrap.explanation,explanation.conclusion].join(" ");
  if(!verifyTmwCp006(entry,parameters,solution))errors.push("Independent invariant check disagrees with the canonical solver");
  if(!isPositiveCp006Answer(solution))errors.push("Answer is not positive");
  if(!stem.trim())errors.push("Stem is empty");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
  if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
  if(new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Options are not textually unique");
  if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
  if(optionSet.options[optionSet.correctIndex]?.text!==solution.answerText)errors.push("Correct option does not match the solved answer");
  if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
  if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
  if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
  if(explanation.givens.length<1)errors.push("Explanation does not identify the generated givens");
  if(!explanation.shortcut.title.trim()||explanation.shortcut.steps.length<1)errors.push("Explanation does not contain an exam shortcut");
  if(!optionSet.options.some(option=>option.text===explanation.commonTrap.optionText&&option.misconceptionId===explanation.commonTrap.misconceptionId))errors.push("Common-trap callout is not tied to an actual distractor");
  if(!balancedInlineMath(explanationText))errors.push("Explanation contains unbalanced inline MathJax delimiters");
  if(/(^|[^\\])\$/.test(explanationText))errors.push("Explanation uses unsupported dollar-sign MathJax delimiters");
  return {
    archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-006",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,
    stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,
    explanation,
    mathematicalFingerprint:`${entry.solveMode}|${stateKey(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false,
  };
}
