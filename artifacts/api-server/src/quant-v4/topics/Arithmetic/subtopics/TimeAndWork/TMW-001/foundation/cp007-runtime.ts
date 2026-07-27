import { getTmwCp007Entry } from "./cp007-registry";
import { buildTmwCp007Options } from "./cp007-options";
import { buildTmwCp007Parameters } from "./cp007-parameters";
import { renderTmwCp007Stem, tmwCp007CommonTrap, tmwCp007Conclusion, tmwCp007Givens, tmwCp007Opening, tmwCp007Shortcut, wrapTmwCp007Math } from "./cp007-presentation";
import { isValidTmwCp007Answer, solveTmwCp007, verifyTmwCp007 } from "./cp007-solver";
import { rationalKey } from "./rational";
import type { TmwCp007GeneratedQuestion, TmwCp007Parameters } from "./cp007-types";

function fingerprint(p:TmwCp007Parameters):string{
  const crew=(values:TmwCp007Parameters["crewA"]):string=>values.map(rationalKey).join(":");
  const optional=(value:{numerator:number;denominator:number}|undefined):string=>value?rationalKey(value):"-";
  return [crew(p.crewA),crew(p.crewB),rationalKey(p.workA),rationalKey(p.workB),rationalKey(p.daysA),rationalKey(p.daysB),optional(p.totalCrewCount),optional(p.targetCrewRate),String(p.targetCategoryIndex??"-"),String(p.sourceCategoryIndex??"-"),String(p.replacementCategoryIndex??"-"),(p.pairwiseCrews??[]).map(crew=>crew.map(rationalKey).join(":")).join(","),(p.pairwiseRates??[]).map(rationalKey).join(",")].join("|");
}

export function runTmwCp007Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp007GeneratedQuestion{
  if(input.language&&input.language!=="en")throw new Error("TMW-CP-007 is English only at the current runtime-proof stage");
  const entry=getTmwCp007Entry(input.questionLanguageId),parameters=buildTmwCp007Parameters(entry,input.seed),solution=solveTmwCp007(entry,parameters),optionSet=buildTmwCp007Options(entry,parameters,solution,input.seed),stem=renderTmwCp007Stem(entry,parameters),formula=wrapTmwCp007Math(solution.formulaLatex),steps=solution.workedLatex.map(wrapTmwCp007Math),shortcut=tmwCp007Shortcut(entry,parameters,solution),commonTrap=tmwCp007CommonTrap(optionSet.options,optionSet.correctIndex),errors:string[]=[];
  if(!verifyTmwCp007(entry,parameters,solution))errors.push("Independent heterogeneous-crew invariant check disagrees with the canonical solver");
  if(!isValidTmwCp007Answer(solution))errors.push("Answer is not positive");
  if(!stem.trim())errors.push("Stem is empty");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
  if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
  if(new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Options are not textually unique");
  if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
  if(optionSet.options[optionSet.correctIndex]?.key!==solution.answerKey)errors.push("Correct option does not match the solved answer");
  if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
  if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
  if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
  if(shortcut.steps.length<2)errors.push("Exam shortcut is incomplete");
  if(commonTrap.optionText===solution.answerText)errors.push("Common trap points to the correct answer");
  return {archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-007",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening:tmwCp007Opening(entry),formula,givens:tmwCp007Givens(entry,parameters),steps,shortcut,commonTrap,conclusion:tmwCp007Conclusion(entry,parameters,solution.answerText)},mathematicalFingerprint:`${entry.solveMode}|${fingerprint(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
