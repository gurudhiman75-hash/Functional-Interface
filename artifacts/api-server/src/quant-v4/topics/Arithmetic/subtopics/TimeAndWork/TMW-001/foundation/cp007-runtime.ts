import { getTmwCp007Entry } from "./cp007-registry";
import { buildTmwCp007Options } from "./cp007-options";
import { buildTmwCp007Parameters } from "./cp007-parameters";
import { explainTmwCp007Target, isTmwCp007ExamStyleStem, renderTmwCp007ExamStem, tmwCp007ExamShortcut, tmwCp007FriendlyTrap, tmwCp007PlainEnglishOpening } from "./cp007-exam-language";
import { tmwCp007CommonTrap, tmwCp007Conclusion, tmwCp007Givens, tmwCp007Shortcut, wrapTmwCp007Math } from "./cp007-presentation";
import { isValidTmwCp007Answer, solveTmwCp007, verifyTmwCp007 } from "./cp007-solver";
import { rationalKey, toLatex } from "./rational";
import type { TmwCp007GeneratedQuestion, TmwCp007Parameters, TmwCp007RegistryEntry, TmwCp007Solution } from "./cp007-types";

function fingerprint(p:TmwCp007Parameters):string{
  const crew=(values:TmwCp007Parameters["crewA"]):string=>values.map(rationalKey).join(":");
  const optional=(value:{numerator:number;denominator:number}|undefined):string=>value?rationalKey(value):"-";
  return [crew(p.crewA),crew(p.crewB),rationalKey(p.workA),rationalKey(p.workB),rationalKey(p.daysA),rationalKey(p.daysB),optional(p.totalCrewCount),optional(p.targetCrewRate),String(p.targetCategoryIndex??"-"),String(p.sourceCategoryIndex??"-"),String(p.replacementCategoryIndex??"-"),(p.pairwiseCrews??[]).map(crew=>crew.map(rationalKey).join(":")).join(","),(p.pairwiseRates??[]).map(rationalKey).join(","),p.context.categories.map(category=>rationalKey(category.efficiency)).join(":")].join("|");
}
function requiresUnitBearingOptions(answerType:string):boolean{return ["COUNT","TIME","RATE","COUNT_PAIR","WORK","RESOURCE_TIME"].includes(answerType);}
function displayText(raw:string):string{
  return raw
    .replace(/\bautomatic lines\b/g,"automated bottling lines")
    .replace(/\bautomatic line\b/g,"automated bottling line")
    .replace(/\bsemi-automatic lines\b/g,"semi-automatic bottling lines")
    .replace(/\bsemi-automatic line\b/g,"semi-automatic bottling line")
    .replace(/\bmanual stations\b/g,"manual bottling stations")
    .replace(/\bmanual station\b/g,"manual bottling station")
    .replace(/\bheavy machines\b/g,"heavy-duty machines")
    .replace(/\bheavy machine\b/g,"heavy-duty machine");
}
function displayCategory(raw:string):string{return displayText(raw);}
function polishStem(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters,raw:string):string{
  const c=p.context.categories;
  let stem=raw;
  if(entry.solveMode==="findTwoCategoryEfficiencyRatio")stem=stem.replace("the same production assignment",p.context.jobPhrase);
  if(entry.solveMode==="findThreeCategoryEfficiencyRatio"){
    stem=stem.replace(/\b1 ([^.]+?) match the output of\b/,"1 $1 matches the output of");
    stem=stem.replace(/Find the efficiency ratio [^.]+\./,`What is the efficiency ratio of one ${displayCategory(c[0].singular)} to one ${displayCategory(c[1].singular)} to one ${displayCategory(c[2].singular)}?`);
  }
  if(entry.solveMode==="findMixedCrewCompletionTime")stem=stem.replace("One unit of the three categories can produce",`One ${displayCategory(c[0].singular)}, one ${displayCategory(c[1].singular)} and one ${displayCategory(c[2].singular)} can produce`);
  if(entry.solveMode==="findHeterogeneousGroupRate")stem=stem.replace("During one operating period at","At").replace("One unit of the three categories produces",`One ${displayCategory(c[0].singular)}, one ${displayCategory(c[1].singular)} and one ${displayCategory(c[2].singular)} produce`);
  stem=stem.replace("individual category efficiencies","individual efficiencies");
  stem=stem.replace("per-unit efficiencies","individual work rates");
  stem=stem.replace("the three category efficiencies","their individual efficiencies");
  stem=stem.replace("What is the smallest possible positive-integer composition?","What is the smallest possible combination of the two types?");
  if(entry.solveMode==="findIntegerCrewCompositionUnderConstraints")stem=stem.replace("One member of the two categories produces",`One ${displayCategory(c[0].singular)} and one ${displayCategory(c[1].singular)} produce`);
  return displayText(stem);
}
function restoreOpeningMathJax(value:string):string{return value.replace("(n_Ae_A=n_Be_B)","\\(n_Ae_A=n_Be_B\\)");}
function balancedInlineMath(value:string):boolean{return (value.match(/\\\(/g)??[]).length===(value.match(/\\\)/g)??[]).length;}
function buildOpening(entry:TmwCp007RegistryEntry,p:TmwCp007Parameters):string{
  const c=p.context.categories;
  if(entry.solveMode==="findCrewCompositionFromTwoOutputFacts")return `Let \\(x\\) be the number of ${displayCategory(c[0].plural)} and \\(y\\) the number of ${displayCategory(c[1].plural)} in the first team. Convert each output record into a per-${p.context.categories.every(category=>category.resourceTimeUnit.endsWith("hours"))?"hour":"day"} equation; subtracting the equations isolates \\(x\\), after which \\(y\\) follows.`;
  if(entry.solveMode==="findIntegerCrewCompositionUnderConstraints")return `Let \\(x\\) and \\(y\\) be the numbers of ${displayCategory(c[0].plural)} and ${displayCategory(c[1].plural)}. Use the headcount equation \\(x+y=N\\) together with the weighted-rate equation \\(e_Ax+e_By=R\\), then solve for the two whole-number counts.`;
  return restoreOpeningMathJax(tmwCp007PlainEnglishOpening(entry,p));
}
function polishSolution(solution:TmwCp007Solution):TmwCp007Solution{return {...solution,answerText:displayText(solution.answerText)};}

export function runTmwCp007Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp007GeneratedQuestion{
  if(input.language&&input.language!=="en")throw new Error("TMW-CP-007 is English only at the current runtime-proof stage");
  const entry=getTmwCp007Entry(input.questionLanguageId),parameters=buildTmwCp007Parameters(entry,input.seed),rawSolution=solveTmwCp007(entry,parameters),solution=polishSolution(rawSolution),rawOptionSet=buildTmwCp007Options(entry,parameters,rawSolution,input.seed),optionSet={...rawOptionSet,options:rawOptionSet.options.map(option=>({...option,text:displayText(option.text)}))},stem=polishStem(entry,parameters,renderTmwCp007ExamStem(entry,parameters)),formula=wrapTmwCp007Math(solution.formulaLatex),setup=wrapTmwCp007Math(parameters.context.categories.map((category,index)=>`e_${String.fromCharCode(65+index)}=${toLatex(category.efficiency)}`).join(",\\quad ")),check=wrapTmwCp007Math(`\\text{Independent heterogeneous-crew invariant verified for ${entry.solveMode}: }(${solution.answerValues.map(toLatex).join(",")})`),steps=[setup,...solution.workedLatex.map(wrapTmwCp007Math),check],rawShortcut=tmwCp007Shortcut(entry,parameters,solution),shortcut=tmwCp007ExamShortcut({...rawShortcut,title:displayText(rawShortcut.title),steps:rawShortcut.steps.map(displayText)}),commonTrap=tmwCp007FriendlyTrap(tmwCp007CommonTrap(optionSet.options,optionSet.correctIndex)),errors:string[]=[];
  const givens=[...tmwCp007Givens(entry,parameters).map(displayText),explainTmwCp007Target(entry,parameters,solution)];
  const opening=buildOpening(entry,parameters);
  const explanationText=[opening,formula,...givens,...steps,shortcut.title,...shortcut.steps,commonTrap.optionLabel,commonTrap.optionText,commonTrap.explanation].join(" ");
  if(!verifyTmwCp007(entry,parameters,rawSolution))errors.push("Independent heterogeneous-crew invariant check disagrees with the canonical solver");
  if(!isValidTmwCp007Answer(rawSolution))errors.push("Answer is not positive");
  if(!stem.trim())errors.push("Stem is empty");
  if(!isTmwCp007ExamStyleStem(stem))errors.push("Stem does not contain an approved realistic exam scenario");
  if(/^(?:\d|How many |A crew containing|Group A contains|A crew has)/.test(stem))errors.push("Stem begins with a mechanical template phrase");
  if(/\b1\s+[^.]{0,60}\bmatch\b/.test(stem))errors.push("Stem contains a singular-subject verb error");
  if(/production assignment|One unit of the three categories|positive-integer composition|per-unit efficiencies|individual category efficiencies/.test(stem))errors.push("Stem contains a rejected mechanical phrase");
  if(entry.solveMode==="findThreeCategoryEfficiencyRatio"&&/efficiency ratio of one [^?]*:[^?]*\?/.test(stem))errors.push("Three-category ratio question uses colon-separated nouns instead of natural order wording");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
  if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
  if(new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Options are not textually unique");
  if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
  if(optionSet.options[optionSet.correctIndex]?.key!==rawSolution.answerKey)errors.push("Correct option does not match the solved answer");
  if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
  if(requiresUnitBearingOptions(entry.answerType)&&optionSet.options.some(option=>/^[-+]?\d+(?:\s+\d+\/\d+|\/\d+)?$/.test(option.text.trim())))errors.push("A unit-bearing answer option is missing its contextual unit");
  if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
  if(steps.length<3)errors.push("Explanation does not provide setup, calculation and verification stages");
  if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
  if(entry.ruleId==="TMW_CATEGORY_EQUIVALENCE"&&!opening.includes("\\(n_Ae_A=n_Be_B\\)"))errors.push("Category-equivalence rule lacks literal inline MathJax");
  if(entry.solveMode==="findIntegerCrewCompositionUnderConstraints"&&(!opening.includes("\\(x+y=N\\)")||!opening.includes("weighted-rate equation")))errors.push("Constrained-composition explanation does not define count unknowns");
  if(!balancedInlineMath(explanationText))errors.push("Explanation contains unbalanced inline MathJax delimiters");
  if(givens.length<2)errors.push("Explanation does not define the supplied data and answer target");
  if(!shortcut.title.startsWith("10-Second ")||shortcut.steps.length<2)errors.push("Exam shortcut is incomplete");
  if(commonTrap.optionText===solution.answerText)errors.push("Common trap points to the correct answer");
  if(!commonTrap.explanation.startsWith(`Don't fall for ${commonTrap.optionLabel} (${commonTrap.optionText})!`))errors.push("Common-trap warning is not student-friendly or option-specific");
  if(/[A-Z]{3,}_[A-Z_]{3,}/.test(commonTrap.explanation))errors.push("Learner-facing trap warning leaks an internal misconception identifier");
  if(/(^|[^\\])\$/.test(explanationText))errors.push("Explanation uses unsupported dollar-sign MathJax delimiters");
  return {archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-007",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening,formula,givens,steps,shortcut,commonTrap,conclusion:displayText(tmwCp007Conclusion(entry,parameters,solution.answerText))},mathematicalFingerprint:`${entry.solveMode}|${fingerprint(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
