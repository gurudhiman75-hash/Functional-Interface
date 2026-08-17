import { getTmwCp006Entry } from "./cp006-registry";
import { buildTmwCp006Options } from "./cp006-options";
import { buildTmwCp006Parameters } from "./cp006-parameters";
import { buildTmwCp006CommonTrap, buildTmwCp006Givens, buildTmwCp006Shortcut } from "./cp006-learning";
import { tmwCp006KeyRule } from "./cp006-key-rule";
import { renderTmwCp006ExamStem, tmwCp006ExamShortcut, tmwCp006FriendlyTrap, tmwCp006PlainEnglishBridge } from "./cp006-exam-language";
import { tmwCp006Conclusion } from "./cp006-presentation";
import { polishTmwCp006Solution } from "./cp006-solution-polish";
import { isPositiveCp006Answer, solveTmwCp006, verifyTmwCp006 } from "./cp006-solver";
import { multiply, rationalKey, toLatex } from "./rational";
import { localizeTmwCp006Question } from "./localization-cp006";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import type { Rational } from "./types";
import type { TmwCp006GeneratedQuestion, TmwCp006Parameters, TmwCp006RegistryEntry } from "./cp006-types";

function stateKey(p:TmwCp006Parameters):string{
  const state=(s:TmwCp006Parameters["stateA"]):string=>[s.resources,s.days,s.hoursPerDay,s.efficiency,s.work].map(rationalKey).join(":");
  const optional=(value:{numerator:number;denominator:number}|undefined):string=>value?rationalKey(value):"-";
  return [state(p.stateA),state(p.stateB),optional(p.elapsedDays),optional(p.completedFraction),optional(p.absentPercent),optional(p.initialPopulation),optional(p.changedPopulation),optional(p.elapsedBeforePopulationChange),optional(p.initialBatchResources),optional(p.batchAddition),(p.dimensionsA??[]).map(rationalKey).join(","),(p.dimensionsB??[]).map(rationalKey).join(",")].join("|");
}
function inlineMath(latex:string):string{return `\\(${latex}\\)`;}
function balancedInlineMath(value:string):boolean{return (value.match(/\\\(/g)??[]).length===(value.match(/\\\)/g)??[]).length;}
function requiresUnitBearingOptions(answerType:string):boolean{return ["COUNT","TIME","HOURS","WORK","SHIFT","RESOURCE_TIME"].includes(answerType);}
function hasApprovedScenarioOpening(stem:string):boolean{return /^(?:At |A contractor |A project manager |A supervisor |A relief camp |A department |A team |The |For capacity planning )/.test(stem);}
function capacity(state:TmwCp006Parameters["stateA"]):Rational{return multiply(multiply(multiply(state.resources,state.days),state.hoursPerDay),state.efficiency);}
function polishStem(entry:TmwCp006RegistryEntry,raw:string):string{
  let stem=raw.replace(/^The the /,"The ");
  if(entry.solveMode==="findAdditionalWorkersForDeadline"||entry.solveMode==="findWorkersRemovedForDelay")stem=stem.replace(/^A contractor at /,"A project manager at ");
  if(entry.solveMode==="findExtraWorkersFromPlannedVsActualProgress")stem=stem.replace(/^A contractor assigned /,"A project manager assigned ");
  if(entry.solveMode==="findCompletionWithBatchWorkerAdditions")stem=stem.replace(/^A contractor at /,"A supervisor at ");
  if(entry.solveMode==="findDimensionalWorkRatio")stem=stem.replace("The first has ","The first job has dimensions of ").replace("while the second has ","while the second has dimensions of ");
  return stem;
}

function buildEnglishQuestion(input:{questionLanguageId:string;seed:string}):TmwCp006GeneratedQuestion{
  const entry=getTmwCp006Entry(input.questionLanguageId);
  const parameters=buildTmwCp006Parameters(entry,input.seed);
  const rawSolution=solveTmwCp006(entry,parameters);
  const solution=polishTmwCp006Solution(entry,parameters,rawSolution);
  const optionSet=buildTmwCp006Options(entry,parameters,solution,input.seed);
  const stem=polishStem(entry,renderTmwCp006ExamStem(entry,parameters));
  const formula=inlineMath(solution.formulaLatex);
  const setup=inlineMath(`C_1=N_1D_1H_1E_1=${toLatex(capacity(parameters.stateA))},\\quad C_2=N_2D_2H_2E_2=${toLatex(capacity(parameters.stateB))}`);
  const check=inlineMath(`\\text{Independent invariant verified for ${entry.solveMode}: }x=${toLatex(solution.answer)}`);
  const steps=[setup,...solution.workedLatex.map(inlineMath),check],errors:string[]=[];
  const rawShortcut=buildTmwCp006Shortcut(entry,parameters,solution);
  const rawTrap=buildTmwCp006CommonTrap(entry,optionSet.options);
  const explanation={
    opening:`${tmwCp006KeyRule(entry)} ${tmwCp006PlainEnglishBridge(entry,parameters)}`,
    formula,
    givens:buildTmwCp006Givens(entry,parameters),
    steps,
    shortcut:tmwCp006ExamShortcut(rawShortcut),
    commonTrap:tmwCp006FriendlyTrap(rawTrap),
    conclusion:tmwCp006Conclusion(entry,parameters,solution.answerText),
  };
  const explanationText=[explanation.opening,explanation.formula,...explanation.givens,...explanation.steps,explanation.shortcut.title,...explanation.shortcut.steps,explanation.commonTrap.optionLabel,explanation.commonTrap.optionText,explanation.commonTrap.explanation,explanation.conclusion].join(" ");
  if(!verifyTmwCp006(entry,parameters,solution))errors.push("Independent invariant check disagrees with the canonical solver");
  if(!isPositiveCp006Answer(solution))errors.push("Answer is not positive");
  if(!stem.trim())errors.push("Stem is empty");
  if(!hasApprovedScenarioOpening(stem))errors.push("Stem does not use an approved scenario-led opening");
  if(/^(?:\d|One team|Each |The available food|Find the equivalent)/.test(stem))errors.push("Stem begins with a mechanical template phrase");
  if(/The the |contractor at a (?:bank verification centre|quality-control department)/i.test(stem))errors.push("Stem contains a context-role or duplicated-article defect");
  if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
  if(optionSet.options.length!==4)errors.push("Question does not contain exactly four options");
  if(new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Options are not textually unique");
  if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
  if(optionSet.options[optionSet.correctIndex]?.text!==solution.answerText)errors.push("Correct option does not match the solved answer");
  if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option contract does not contain exactly one correct answer");
  if(requiresUnitBearingOptions(entry.answerType)&&optionSet.options.some(option=>/^[-+]?\d+(?:\s+\d+\/\d+|\/\d+)?$/.test(option.text.trim())))errors.push("A unit-bearing answer option is missing its contextual unit");
  if(!/^\\\(.+\\\)$/.test(formula))errors.push("Explanation formula lacks inline MathJax delimiters");
  if(steps.length<3)errors.push("Explanation does not provide setup, calculation and verification stages");
  if(steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Explanation step lacks inline MathJax delimiters");
  if(explanation.givens.length<1)errors.push("Explanation does not identify the generated givens");
  if(!explanation.shortcut.title.startsWith("10-Second ")||explanation.shortcut.steps.length<1)errors.push("Explanation does not contain the approved exam shortcut");
  if(!optionSet.options.some(option=>option.text===explanation.commonTrap.optionText&&option.misconceptionId===explanation.commonTrap.misconceptionId))errors.push("Common-trap callout is not tied to an actual distractor");
  if(!explanation.commonTrap.explanation.startsWith(`Don't fall for ${explanation.commonTrap.optionLabel} (${explanation.commonTrap.optionText})!`))errors.push("Common-trap warning is not student-friendly or option-specific");
  if(/[A-Z]{3,}_[A-Z_]{3,}/.test(explanation.commonTrap.explanation))errors.push("Learner-facing trap warning leaks an internal misconception identifier");
  if(!balancedInlineMath(explanationText))errors.push("Explanation contains unbalanced inline MathJax delimiters");
  if(/(^|[^\\])\$/.test(explanationText))errors.push("Explanation uses unsupported dollar-sign MathJax delimiters");
  if(entry.solveMode==="findCompletionWithBatchWorkerAdditions"){
    if(/\(n-1\)b/.test(solution.formulaLatex))errors.push("AP formula uses b instead of the defined common-difference symbol d");
    if(/resource-days/.test(solution.workedLatex.join(" ")))errors.push("AP explanation uses a generic resource-day unit instead of the generated context unit");
  }
  return {
    archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-006",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,
    stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,
    explanation,
    mathematicalFingerprint:`${entry.solveMode}|${stateKey(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false,
  };
}

export function runTmwCp006Pipeline(input:{questionLanguageId:string;seed:string;language:TmwLocalizedLanguage}):TmwLocalizedQuestion;
export function runTmwCp006Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"}):TmwCp006GeneratedQuestion;
export function runTmwCp006Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|TmwLocalizedLanguage}):TmwCp006GeneratedQuestion|TmwLocalizedQuestion{
  const english=buildEnglishQuestion(input);
  if(!input.language||input.language==="en")return english;
  return localizeTmwCp006Question(english,input.language);
}
