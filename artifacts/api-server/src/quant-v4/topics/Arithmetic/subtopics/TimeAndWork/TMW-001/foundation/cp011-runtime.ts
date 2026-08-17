import { rationalKey } from "./rational";
import { getTmwCp011RegistryEntry } from "./cp011-registry";
import { generateTmwCp011Parameters, solveTmwCp011, verifyTmwCp011 } from "./cp011-engine";
import { buildTmwCp011Options, selectTmwCp011Trap } from "./cp011-options";
import { buildTmwCp011Explanation, renderTmwCp011Stem } from "./cp011-presentation";
import type { TmwCp011GeneratedQuestion, TmwCp011Parameters } from "./cp011-types";

function fingerprint(p:TmwCp011Parameters){
 const copy:any={...p};delete copy.context;
 const normalise=(v:any):any=>Array.isArray(v)?v.map(normalise):v&&typeof v==="object"&&"numerator" in v&&"denominator" in v?rationalKey(v):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).sort().map(([k,x])=>[k,normalise(x)])):v;
 return JSON.stringify(normalise(copy));
}
function learnerText(q:TmwCp011GeneratedQuestion){return [q.stem,...q.options,q.solution.answerText,q.explanation.opening,q.explanation.formula,...q.explanation.givens,...q.explanation.steps,...q.explanation.shortcut.steps,q.explanation.commonTrap.explanation,q.explanation.conclusion].join("\n");}
export function validateTmwCp011Question(q:TmwCp011GeneratedQuestion){const errors:string[]=[];
 if(q.options.length!==4||new Set(q.options).size!==4)errors.push("options must be four unique values");
 if(q.options[q.correctIndex]!==q.solution.answerText)errors.push("correct option mismatch");
 if(q.explanation.steps.length<4)errors.push("standard working too brief");
 const text=learnerText(q);
 if(/TMW-QL-|TMW_CP_|misconceptionId|publiclyPublishable/.test(text))errors.push("internal identifier leaked");
 if(/Do not choose|Don't choose/i.test(text))errors.push("legacy trap command");
 const expectedTrapPrefix=`Don't fall for ${q.explanation.commonTrap.optionLabel} (${q.explanation.commonTrap.optionText})!`;
 if(!q.explanation.commonTrap.explanation.startsWith(expectedTrapPrefix))errors.push("direct trap advice missing");
 if(!q.explanation.opening.startsWith("Let's"))errors.push("teacher voice missing");
 if(/arithmetic progression|geometric progression|sum identity|inverse relation|recover the unknown parameter|substitute parameters/i.test(text))errors.push("academic jargon");
 if(/\b\d+\s+\d+\/\d+\s+days?\b|\b\d+\/\d+\s+days?\b/.test(text))errors.push("ASCII fractional time");
 if(/\+\s*-|--|−\s*-/.test(text))errors.push("awkward signed expression");
 if((text.match(/\\\(/g)||[]).length!==(text.match(/\\\)/g)||[]).length)errors.push("unbalanced MathJax");
 const outsideMath=text.replace(/\\\([\s\S]*?\\\)/g,"");if(/\\frac/.test(outsideMath))errors.push("raw LaTeX fraction outside MathJax");
 if(/undefined|null|NaN|Infinity|\{\{/.test(text))errors.push("unresolved value");
 if(q.publiclyPublishable!==false)errors.push("publication safety");
 return{valid:errors.length===0,errors};}
export function runTmwCp011Pipeline(qlId:string,seed:string):TmwCp011GeneratedQuestion{
 const entry=getTmwCp011RegistryEntry(qlId);const parameters=generateTmwCp011Parameters(entry,seed);const solution=solveTmwCp011(entry,parameters);verifyTmwCp011(entry,parameters,solution);
 const built=buildTmwCp011Options(entry,parameters,solution,seed);const trap=selectTmwCp011Trap(built.options,built.correctIndex);
 const q:TmwCp011GeneratedQuestion={archetypeId:"TMW-001",canonicalProblemId:"TMW-CP-011",questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:"en",seed,stem:renderTmwCp011Stem(entry,parameters,seed),parameters,solution,options:built.options.map(x=>x.text),optionAudit:built.options,correctIndex:built.correctIndex,explanation:buildTmwCp011Explanation(entry,parameters,solution,trap),mathematicalFingerprint:fingerprint(parameters),validation:{valid:true,errors:[]},publiclyPublishable:false};
 q.validation=validateTmwCp011Question(q);return q;
}
