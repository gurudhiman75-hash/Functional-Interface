import { getTmwCp007Entry } from "./cp007-registry";
import { buildTmwCp007Options } from "./cp007-options";
import { buildTmwCp007Parameters } from "./cp007-parameters";
import { explainTmwCp007Target, isTmwCp007ExamStyleStem, renderTmwCp007ExamStem, tmwCp007ExamShortcut, tmwCp007FriendlyTrap, tmwCp007PlainEnglishOpening } from "./cp007-exam-language";
import { tmwCp007CommonTrap, tmwCp007Conclusion, tmwCp007Givens, tmwCp007Shortcut, wrapTmwCp007Math } from "./cp007-presentation";
import { isValidTmwCp007Answer, solveTmwCp007, verifyTmwCp007 } from "./cp007-solver";
import { rationalKey } from "./rational";
import type { TmwCp007GeneratedQuestion, TmwCp007Parameters, TmwCp007RegistryEntry } from "./cp007-types";

function fingerprint(p:TmwCp007Parameters):string{
  const crew=(values:TmwCp007Parameters["crewA"]):string=>values.map(rationalKey).join(":");
  const optional=(value:{numerator:number;denominator:number}|undefined):string=>value?rationalKey(value):"-";
  return [crew(p.crewA),crew(p.crewB),rationalKey(p.workA),rationalKey(p.workB),rationalKey(p.daysA),rationalKey(p.daysB),optional(p.totalCrewCount),optional(p.targetCrewRate),String(p.targetCategoryIndex??"-"),String(p.sourceCategoryIndex??"-"),String(p.replacementCategoryIndex??"-"),(p.pairwiseCrews??[]).map(crew=>crew.map(rationalKey).join(":")).join(","),(p.pairwiseRates??[]).map(rationalKey).join(",")].join("|");
}
function requiresUnitBearingOptions(answerType:string):boolean{return ["COUNT","TIME","RATE","COUNT_PAIR","WORK","RESOURCE_TIME"].includes(answerType);}
function displayCategory(raw:string):string{
  const replacements:Record<string,string>={
    "automatic line":"automated bottling line","automatic lines":"automated bottling lines",
    "semi-automatic line":"semi-automatic bottling line","semi-automatic lines":"semi-automatic bottling lines",
    "manual station":"manual bottling station","manual stations":"manual bottling stations",
    "heavy machine":"heavy-duty machine","heavy machines":"heavy-duty machines",
  };
  return replacements[raw]??raw;
}
function polishStem(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,raw:string):string{
  const c=p.context.categories;
  let stem=raw;
  if(entry.solveMode==="findTwoCategoryEfficiencyRatio")stem=stem.replace("the same production assignment",p.context.jobPhrase);
  if(entry.solveMode==="findThreeCategoryEfficiencyRatio"){
    stem=stem.replace(/\b1 ([^.]+?) match the output of\b/,"1 $1 matches the output of");
    stem=stem.replace(/Find the efficiency ratio ([^.]+)\./,"What is the efficiency ratio of one $1?");
  }
  if(entry.solveMode==="findMixedCrewCompletionTime")stem=stem.replace("One unit of the three categories can produce",`One ${displayCategory(c[0].singular)}, one ${displayCategory(c[1].singular)} and one ${displayCategory(c[2].singular)} can produce`);
  if(entry.solveMode==="findHeterogeneousGroupRate")stem=stem.replace("During one operating period at","At").replace("One unit of the three categories produces",`One ${displayCategory(c[0].singular)}, one ${displayCategory(c[1].singular)} and one ${displayCategory(c[2].singular)} produce`);
  stem=stem.replace("individual category efficiencies","individual efficiencies");
  stem=stem.replace("per-unit efficiencies","individual work rates");
  stem=stem.replace("the three category efficiencies","their individual efficiencies");
  stem=stem.replace("What is the smallest possible positive-integer composition?","What is the smallest possible combination of the two types?");
  if(entry.solveMode==="findIntegerCrewCompositionUnderConstraints")stem=stem.replace("One member of the two categories produces",`One ${displayCategory(c[0].singular)} and one ${displayCategory(c[1].singular)} produce`);
  return stem;
}

export function runTmwCp007Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp007GeneratedQuestion{
  if(input.language&&input.language!=="en")throw new Error("TMW-CP-007 is English only at the current runtime-proof stage");
  const entry=getTmwCp007Entry(input.questionLanguageId),parameters=buildTmwCp007Parameters(entry,input.seed),solution=solveTmwCp007(entry,parameters),optionSet=buildTmwCp007Options(entry,parameters,solution,input.seed),stem=polishStem(entry,parameters,renderTmwCp007ExamStem(entry,parameters)),formula=wrapTmwCp007Math(solution.formulaLatex),steps=solution.workedLatex.map(wrapTmwCp007Math),shortcut=tmwCp007ExamShortcut(tmwCp007Shortcut(entry,parameters,solution)),commonTrap=tmwCp007FriendlyTrap(tmwCp007CommonTrap(optionSet.options,optionSet.correctIndex)),errors:string[]=[];
  const givens=[...tmwCp007Givens(entry,parameters),explainTmwCp007Target(entry,parameters,solution)];
  const opening=tmwCp007PlainEnglishOpening(entry,parameters);
  const explanationText=[opening,formula,...givens,...steps,shortcut.title,...shortcut.steps,commonTrap.optionLabel,commonTrap.optionText,commonTrap.explanation].join(" ");
  if(!verifyTmwCp007(entry,parameters,solution))errors.push("Independent heterogeneous-crew invariant check disagrees with the canonical solver");
  if(!isValidTmwCp007Answer(solution))errors.push("Answer is not positive");
  if(!stem.trim())errors.push("Stem is empty");
  if(!isTmwCp007ExamStyleStem(stem))errors.push("Stem does not contain an approved realistic exam scenario");
  if(/^(?:\d|How many |A crew containing|Group A contains|A crew has)/.test(stem))errors.push("Stem begins with a mechanical template phrase");
  if(/\b1\s+[^.]{0,60}\bmatch\b/.test(stem))errors.push("Stem contains a singular-subject verb error");
  if(/production assignment|One unit of the three categories|positive-integer composition|per-unit efficiencies|individual category efficiencies/.test(stem))errors.push("Stem contains a rejected mechanical phrase");
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
