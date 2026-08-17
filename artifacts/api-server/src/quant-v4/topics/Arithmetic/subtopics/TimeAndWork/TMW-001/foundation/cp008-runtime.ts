import { getTmwCp008Entry } from "./cp008-registry";
import { buildTmwCp008Parameters, solveTmwCp008, validTmwCp008Solution, verifyTmwCp008 } from "./cp008-engine";
import { buildTmwCp008Options } from "./cp008-options";
import { renderTmwCp008Stem, tmwCp008CommonTrap, tmwCp008Conclusion, tmwCp008Givens, tmwCp008Opening, tmwCp008Shortcut } from "./cp008-presentation";
import { equals, formatRational, rational, rationalKey } from "./rational";
import type { Rational } from "./types";
import type { TmwCp008GeneratedQuestion, TmwCp008Parameters } from "./cp008-types";
function inline(value:string):string{return `\\(${value}\\)`;}
function balanced(value:string):boolean{return (value.match(/\\\(/g)??[]).length===(value.match(/\\\)/g)??[]).length;}
function fingerprint(p:TmwCp008Parameters):string{const role=(x:TmwCp008Parameters["context"]["roles"][number])=>[x.count,x.efficiency,x.days,x.hoursPerDay,x.output,x.baselineOutput,x.defectiveOutput].map(rationalKey).join(":");return[...p.context.roles.map(role),rationalKey(p.totalPayment),String(p.targetIndex??"-"),(p.selectedIndices??[]).join(","),(p.contributionWeights??[]).map(rationalKey).join(","),(p.reportedPayments??[]).map(rationalKey).join(","),(p.knownPaymentIndices??[]).join(","),p.eventKind??"-",p.factorTarget??"-",p.pieceRate?rationalKey(p.pieceRate):"-",p.bonusPool?rationalKey(p.bonusPool):"-"].join("|");}
function moneyAnswer(answerType:string):boolean{return answerType==="MONEY"||answerType==="MONEY_TRIPLE";}
function singularOutputUnit(p:TmwCp008Parameters):string{return p.context.outputUnit==="square metres"?"square metre":p.context.outputUnit.replace(/s$/ ,"");}
function rateText(p:TmwCp008Parameters,value:Rational):string{return `${formatRational(value)} ${equals(value,rational(1))?singularOutputUnit(p):p.context.outputUnit} per hour`;}
function polishStem(p:TmwCp008Parameters,raw:string):string{const c=p.context.roles,target=p.targetIndex??0,other=target===0?1:0;let stem=raw;if(p.eventKind==="HANDOFF")stem=stem.replace(`Their relative efficiencies are ${formatRational(c[0].efficiency)} and ${formatRational(c[1].efficiency)}.`,`Their individual work rates are ${rateText(p,c[0].efficiency)} and ${rateText(p,c[1].efficiency)}.`);if(p.factorTarget==="TIME")stem=stem.replace(`Their efficiencies are ${formatRational(c[target].efficiency)} and ${formatRational(c[other].efficiency)}, and they work equal daily hours.`,`Their individual work rates are ${rateText(p,c[target].efficiency)} and ${rateText(p,c[other].efficiency)}, and they work equal daily hours.`);return stem;}
export function runTmwCp008Pipeline(input:{questionLanguageId:string;seed:string;language?:"en"|"hi"|"pa"}):TmwCp008GeneratedQuestion{
 if(input.language&&input.language!=="en")throw new Error("TMW-CP-008 is English only at the current runtime-proof stage");
 const entry=getTmwCp008Entry(input.questionLanguageId),parameters=buildTmwCp008Parameters(entry,input.seed),solution=solveTmwCp008(entry,parameters),optionSet=buildTmwCp008Options(entry,parameters,solution,input.seed),stem=polishStem(parameters,renderTmwCp008Stem(entry,parameters)),formula=inline(solution.formulaLatex),steps=solution.workedLatex.map(inline),shortcut=tmwCp008Shortcut(entry,parameters,solution),commonTrap=tmwCp008CommonTrap(optionSet.options,optionSet.correctIndex),opening=tmwCp008Opening(entry),givens=tmwCp008Givens(entry,parameters),conclusion=tmwCp008Conclusion(entry,parameters,solution.answerText),errors:string[]=[];
 const learnerText=[stem,opening,formula,...givens,...steps,shortcut.title,...shortcut.steps,commonTrap.optionLabel,commonTrap.optionText,commonTrap.explanation,conclusion].join(" ");
 if(!verifyTmwCp008(entry,parameters,solution))errors.push("Independent contribution invariant disagrees with canonical solver");
 if(!validTmwCp008Solution(solution))errors.push("Answer is not a positive admissible value");
 if(!stem.trim())errors.push("Stem is empty");
 if(!/warehouse|bank|painting|factory/i.test(stem))errors.push("Stem lacks an approved realistic work setting");
 if(/^(?:Find|Calculate|A and B|Two workers|The wages)/.test(stem))errors.push("Stem begins with a mechanical template phrase");
 if(/capital|investment|partnership profit/i.test(stem))errors.push("Stem crosses into partnership ownership");
 if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(stem))errors.push("Stem contains an unresolved placeholder");
 if(optionSet.options.length!==4||new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push("Option package is not four unique choices");
 if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push("Correct option position is invalid");
 if(optionSet.options[optionSet.correctIndex]?.key!==solution.answerKey)errors.push("Correct option does not match solved answer");
 if(optionSet.options.filter(option=>option.misconceptionId==="CORRECT").length!==1)errors.push("Option audit does not contain exactly one correct answer");
 if(moneyAnswer(entry.answerType)&&optionSet.options.some(option=>option.text.split(", ").some(part=>!part.startsWith("₹"))))errors.push("Money option lacks the required ₹ unit");
 if(moneyAnswer(entry.answerType)&&/[£$€]/.test(learnerText))errors.push("Indian-exam learner text uses an inconsistent currency");
 if(!/^\\\(.+\\\)$/.test(formula)||steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push("Formula or standard step lacks literal inline MathJax");
 if(!balanced(learnerText))errors.push("Learner text has unbalanced inline MathJax");
 if(givens.length<2)errors.push("Explanation does not identify givens and target");
 if(steps.length<3)errors.push("Standard working is too brief to show the required arithmetic");
 if(!shortcut.title.startsWith("10-Second ")||shortcut.steps.length<2)errors.push("Exam shortcut is incomplete");
 if(commonTrap.optionText===solution.answerText)errors.push("Common trap points to the correct answer");
 if(!commonTrap.explanation.startsWith(`${commonTrap.optionLabel} (`)||/Do not choose/i.test(commonTrap.explanation))errors.push("Common trap is not diagnostic and option-specific");
 if(/[A-Z]{3,}_[A-Z_]{3,}/.test(commonTrap.explanation))errors.push("Learner-facing trap leaks an internal misconception ID");
 if(!/contribution|piece-rate|bonus|accepted net/i.test(opening))errors.push("Core concept does not explain the payment basis in plain English");
 return{archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-008",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening,formula,givens,steps,shortcut,commonTrap,conclusion},mathematicalFingerprint:`${entry.solveMode}|${fingerprint(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
