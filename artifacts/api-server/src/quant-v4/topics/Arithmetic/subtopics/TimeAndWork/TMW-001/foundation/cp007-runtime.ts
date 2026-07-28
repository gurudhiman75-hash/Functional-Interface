import { getTmwCp007Entry } from "./cp007-registry";
import { buildTmwCp007Options } from "./cp007-options";
import { buildTmwCp007Parameters } from "./cp007-parameters";
import { explainTmwCp007Target, isTmwCp007ExamStyleStem, renderTmwCp007ExamStem, tmwCp007ExamShortcut, tmwCp007FriendlyTrap, tmwCp007PlainEnglishOpening } from "./cp007-exam-language";
import { tmwCp007Conclusion, tmwCp007Givens, tmwCp007Shortcut, wrapTmwCp007Math } from "./cp007-presentation";
import { isValidTmwCp007Answer, solveTmwCp007, verifyTmwCp007 } from "./cp007-solver";
import { rationalKey } from "./rational";
import type { TmwCp007GeneratedQuestion, TmwCp007Parameters } from "./cp007-types";

function fingerprint(p:TmwCp007Parameters):string{
  const crew=(values:TmwCp007Parameters["crewA"]):string=>values.map(rationalKey).join(":");
  const optional=(value:{numerator:number;denominator:number}|undefined):string=>value?rationalKey(value):"-";
  return [crew(p.crewA),crew(p.crewB),rationalKey(p.workA),rationalKey(p.workB),rationalKey(p.daysA),rationalKey(p.daysB),optional(p.totalCrewCount),optional(p.targetCrewRate),String(p.targetCategoryIndex??"-"),String(p.sourceCategoryIndex??"-"),String(p.replacementCategoryIndex??"-"),(p.pairwiseCrews??[]).map(crew=>crew.map(rationalKey).join(":")).join(","),(p.pairwiseRates??[]).map(rationalKey).join(",")].join("|");
}
function requiresUnitBearingOptions(answerType:string):boolean{return ["COUNT","TIME","RATE","COUNT_PAIR","WORK","RESOURCE_TIME"].includes(answerType);}

export function runTmwCp007Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp007GeneratedQuestion{
  if(input.language&&input.language!=="en")throw new Error("TMW-CP-007 is English only at the current runtime-proof stage");
  const entry=getTmwCp007Entry(input.questionLanguageId),parameters=buildTmwCp007Parameters(entry,input.seed),solution=solveTmwCp007(entry,parameters),optionSet=buildTmwCp007Options(entry,parameters,solution,input.seed),stem=renderTmwCp007ExamStem(entry,parameters),formula=wrapTmwCp007Math(solution.formulaLatex),steps=solution.workedLatex.map(wrapTmwCp007Math),shortcut=tmwCp007ExamShortcut(tmwCp007Shortcut(entry,parameters,solution)),commonTrap=tmwCp007FriendlyTrap(tmwCp007CommonTrap(optionSet.options,optionSet.correctIndex)),errors:string[]=[];
  const givens=[...tmwCp007Givens(entry,parameters),explainTmwCp007Target(entry,parameters,solution)];
  const opening=tmwCp007PlainEnglishOpening(entry,parameters);
  const explanationText=[opening,formula,...givens,...steps,shortcut.title,...shortcut.steps,commonTrap.optionLabel,commonTrap.optionText,commonTrap.explanation].join(" ");
  if(!verifyTmwCp007(entry,parameters,solution))errors.push("Independent heterogeneous-crew invariant check disagrees with the canonical solver");
  if(!isValidTmwCp007Answer(solution))errors.push("Answer is not positive");
  if(!stem.trim())errors.push("Stem is empty");
  if(!isTmwCp007ExamStyleStem(stem))errors.push("Stem does not contain an approved realistic exam scenario");
  if(/^(?:\d|How many |A crew containing|Group A contains|A crew has)/.test(stem))errors.push("Stem begins with a mechanical template phrase");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
  if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
  if(new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Options are not textually unique");
  if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
  if(optionSet.options[optionSet.correctIndex]?.key!==solution.answerKey)errors.push("Correct option does not match the solved answer");
  if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
  if(requiresUnitBearingOptions(entry.answerType)&&optionSet.options.some(option=>/^[-+]?\d+(?:\s+\d+\/\d+|\/\d+)?$/.test(option.text.trim())))errors.push("A unit-bearing answer option is missing its contextual unit");
  if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
  if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
  if(givens.length<2)errors.push("Explanation does not define the supplied data and answer target");
  if(!shortcut.title.startsWith("10-Second ")||shortcut.steps.length<2)errors.push("Exam shortcut is incomplete");
  if(commonTrap.optionText===solution.answerText)errors.push("Common trap points to the correct answer");
  if(!commonTrap.explanation.startsWith(`Do not choose ${commonTrap.optionLabel}`))errors.push("Common-trap warning is not student-friendly or option-specific");
  if(/[A-Z]{3,}_[A-Z_]{3,}/.test(commonTrap.explanation))errors.push("Learner-facing trap warning leaks an internal misconception identifier");
  if(/(^|[^\\])\$/.test(explanationText))errors.push("Explanation uses unsupported dollar-sign MathJax delimiters");
  return {archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-007",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening,formula,givens,steps,shortcut,commonTrap,conclusion:tmwCp007Conclusion(entry,parameters,solution.answerText)},mathematicalFingerprint:`${entry.solveMode}|${fingerprint(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
