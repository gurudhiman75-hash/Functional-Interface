import { getTmwCp010Entry } from './cp010-registry';
import { buildTmwCp010Parameters } from './cp010-parameters';
import { solveTmwCp010, validTmwCp010Solution, validateTmwCp010PhysicalState, verifyTmwCp010 } from './cp010-engine';
import { buildTmwCp010Options } from './cp010-options';
import { renderTmwCp010Stem } from './cp010-stems';
import { tmwCp010Conclusion, tmwCp010Givens, tmwCp010Opening, tmwCp010Shortcut } from './cp010-learning';
import { tmwCp010CommonTrap } from './cp010-traps';
import { rationalKey } from './rational';
import { inline } from './cp010-presentation-helpers';
import { remediateTmwCp010CriticalParameters } from './critical-remediation-r1';
import type { TmwCp010GeneratedQuestion, TmwCp010Parameters, TmwCp010RegistryEntry, TmwCp010Shortcut } from './cp010-types';
function balanced(value:string){return (value.match(/\\\(/g)??[]).length===(value.match(/\\\)/g)??[]).length;}
function fingerprint(p:TmwCp010Parameters):string{return[rationalKey(p.initialLevel),p.targetBoundary??'-',p.targetLevel?rationalKey(p.targetLevel):'-',p.thresholdLevel?rationalKey(p.thresholdLevel):'-',(p.stages??[]).map(stage=>`${stage.duration?rationalKey(stage.duration):'∞'}:${stage.pipes.map(pipe=>`${pipe.kind}:${rationalKey(pipe.soloTime)}`).join(',')}`).join(';'),(p.cycle??[]).map(segment=>`${rationalKey(segment.duration)}:${segment.pipes.map(pipe=>`${pipe.kind}:${rationalKey(pipe.soloTime)}`).join(',')}`).join(';'),String(p.startingCycleIndex??'-'),p.knownCompletionTime?rationalKey(p.knownCompletionTime):'-',String(p.unknownStageIndex??'-'),(p.physicalStages??[]).map(stage=>`${rationalKey(stage.duration)}:${rationalKey(stage.netFlowLitresPerHour)}`).join(';'),p.capacityFraction?rationalKey(p.capacityFraction):'-',p.levelControl?`${rationalKey(p.levelControl.lower)}:${rationalKey(p.levelControl.upper)}:${p.levelControl.targetUpperHits}`:'-',p.requiredDeadline?rationalKey(p.requiredDeadline):'-',p.adjustmentBaseDuration?rationalKey(p.adjustmentBaseDuration):'-',p.adjustmentDirection??'-'].join('|');}
function distinctShortcut(entry:TmwCp010RegistryEntry,shortcut:TmwCp010Shortcut):TmwCp010Shortcut{
 switch(entry.solveMode){
  case'findCompletionAfterDelayedActivation':return{title:'10-Second Delayed-Opening Ledger',steps:['Use only the initially active pipes during the delay before the new inlet opens.','Carry that exact level into the faster post-opening stage and add both durations.']};
  case'findCompletionAfterDelayedDeactivation':return{title:'10-Second Delayed-Closing Ledger',steps:['Use the initial combined flow only until the stated pipe closes.','Carry the event level into the reduced-flow stage and time the remaining level separately.']};
  case'findCompletionWithAlternatingPipes':return{title:'10-Second Alternating-Pair Cycle',steps:['Keep the first and second pipe turns in their stated alternating order.','Repeat complete pairs, then calculate only the required fraction of the terminal turn.']};
  case'findCompletionWithPeriodicSchedule':return{title:'10-Second Periodic Multi-Segment Cycle',steps:['Add every distinct segment in the full periodic schedule before repeating it.','After safe full cycles, replay the terminal schedule segment by segment to the boundary.']};
  default:return shortcut;
 }
}
export function runTmwCp010Pipeline(input:{questionLanguageId:string;seed:string;language?:'en'|'hi'|'pa'}):TmwCp010GeneratedQuestion{
 if(input.language&&input.language!=='en')throw new Error('TMW-CP-010 is English only at the current runtime-proof stage');
 const entry=getTmwCp010Entry(input.questionLanguageId),rawParameters=buildTmwCp010Parameters(entry,input.seed),parameters=remediateTmwCp010CriticalParameters(entry,rawParameters),solution=solveTmwCp010(entry,parameters),optionSet=buildTmwCp010Options(entry,parameters,solution,input.seed),stem=renderTmwCp010Stem(entry,parameters),formula=inline(solution.formulaLatex),steps=solution.workedLatex.map(inline),opening=tmwCp010Opening(entry),givens=tmwCp010Givens(entry,parameters),shortcut=distinctShortcut(entry,tmwCp010Shortcut(entry,parameters,solution)),commonTrap=tmwCp010CommonTrap(optionSet.options,optionSet.correctIndex),conclusion=tmwCp010Conclusion(entry,parameters,solution.answerText),errors:string[]=[];
 const learner=[stem,...optionSet.options.map(option=>option.text),opening,formula,...givens,...steps,shortcut.title,...shortcut.steps,commonTrap.optionLabel,commonTrap.optionText,commonTrap.explanation,conclusion].join(' ');
 if(!validateTmwCp010PhysicalState(parameters))errors.push('Generated tank state leaves the physical range from empty to full');
 if(!verifyTmwCp010(entry,parameters,solution))errors.push('Independent staged/cycle invariant disagrees with canonical solver');
 if(!validTmwCp010Solution(entry,solution))errors.push('Answer is not admissible for its answer contract');
 if(!stem.trim())errors.push('Stem is empty');
 if(!/tank|reservoir/i.test(stem))errors.push('Stem lacks a tank or reservoir context');
 if(!/initially|starts|starting at|starts from/i.test(stem))errors.push('Stem does not establish the initial state or phase');
 if(!/after|schedule|cycle|switch|interruption|staged|controller|segment|interval|change|during the first|for the first/i.test(stem))errors.push('Stem lacks the staged, cyclic or level-triggered ownership cue');
 if(!/how long|what fraction|what is the total time|what is its capacity|what fraction of the tank per hour|after how many hours|how many complete cycles|in which segment|at what time|by how many hours/i.test(stem))errors.push('Stem target is not explicit');
 if(/all pipes are opened together.*continuously/i.test(stem))errors.push('Stem collapses into CP-009 simultaneous ownership');
 if(/can [^.]+ operate together|would empty [^.]+ continue\b|can [^.]+ continue\b/i.test(stem))errors.push('Stem contains a capability-to-schedule grammar collision');
 if(optionSet.options.length!==4||new Set(optionSet.options.map(option=>option.text)).size!==4)errors.push('Option package is not four unique choices');
 if(optionSet.correctIndex<0||optionSet.correctIndex>3)errors.push('Correct option position is invalid');
 if(optionSet.options[optionSet.correctIndex]?.key!==solution.answerKey)errors.push('Correct option does not match the canonical answer');
 if(optionSet.options.filter(option=>option.misconceptionId==='CORRECT').length!==1)errors.push('Option audit does not contain exactly one correct answer');
 if(!/^\\\(.+\\\)$/.test(formula)||steps.some(step=>!/^\\\(.+\\\)$/.test(step)))errors.push('Formula or standard step lacks literal inline MathJax');
 if(!balanced(learner))errors.push('Learner text has unbalanced inline MathJax');
 if(/\b\d+\s+\d+\/\d+\s+hours?\b|\b\d+\/\d+\s+hours?\b/i.test(learner))errors.push('Learner text contains an ASCII fractional time');
 if(/\+\s*-|--|−\s*−/.test(learner))errors.push('Learner text contains an awkward signed expression');
 if(/\b(?:[2-9]|\d{2,})\s+full\b/.test(stem))errors.push('Learner text contains an impossible level above a full tank');
 if(entry.solveMode==='findScheduleAdjustmentForDeadline'&&!/(earlier|later)/i.test(solution.answerText))errors.push('Deadline adjustment answer omits direction');
 if(givens.length<2)errors.push('Explanation does not identify givens and target');
 if(steps.length<3)errors.push('Standard working is too brief');
 if(!shortcut.title.startsWith('10-Second ')||shortcut.steps.length<2)errors.push('Exam shortcut is incomplete');
 if(commonTrap.optionText===solution.answerText)errors.push('Common trap points to the correct answer');
 if(!commonTrap.explanation.startsWith(`${commonTrap.optionLabel} (${commonTrap.optionText})`))errors.push('Common trap is not option-specific');
 if(/do not choose/i.test(commonTrap.explanation))errors.push('Common trap uses a negative command');
 if(/[A-Z]{3,}_[A-Z_]{3,}/.test(commonTrap.explanation))errors.push('Learner-facing trap leaks an internal misconception ID');
 if(!/stage|cycle|threshold|flow|event|level|volume/i.test(opening))errors.push('Core concept does not explain the governing staged/cycle relation');
 if(/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(learner))errors.push('Learner text contains an unresolved placeholder');
 return{archetypeId:'TMW-001',canonicalProblemId:'TMW-CP-010',questionLanguageId:entry.qlId,solveMode:entry.solveMode,language:'en',seed:input.seed,stem,parameters,solution,options:optionSet.options.map(option=>option.text),optionAudit:optionSet.options,correctIndex:optionSet.correctIndex,explanation:{opening,formula,givens,steps,shortcut,commonTrap,conclusion},mathematicalFingerprint:`${entry.solveMode}|${fingerprint(parameters)}`,validation:{valid:errors.length===0,errors},publiclyPublishable:false};
}
