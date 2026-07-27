import { TMW_CP007_REGISTRY } from "./cp007-registry";
import { runTmwCp007Pipeline } from "./cp007-runtime";

export interface TmwCp007ReviewRow {
  packageId:string;cpId:"TMW-CP-007";qlId:string;solveMode:string;difficulty:string;seed:string;mathematicalFingerprint:string;context:string;stem:string;options:string[];correctIndex:number;correctAnswer:string;keyRule:string;formula:string;givens:string[];standardSteps:string[];shortcutTitle:string;shortcutSteps:string[];commonTrap:{optionLabel:string;optionText:string;misconceptionId:string;explanation:string};conclusion:string;distractorLabels:string[];validationStatus:"PASS"|"FAIL";validationErrors:string[];publiclyPublishable:false;
}

export function buildTmwCp007ReviewRows(seedsPerQl=3):TmwCp007ReviewRow[]{
  const rows:TmwCp007ReviewRow[]=[];
  for(const entry of TMW_CP007_REGISTRY)for(let index=0;index<seedsPerQl;index+=1){
    const seed=`tmw-cp007-review:${entry.qlId}:${index}`,generated=runTmwCp007Pipeline({questionLanguageId:entry.qlId,seed});
    rows.push({packageId:`${entry.qlId}:${seed}`,cpId:"TMW-CP-007",qlId:entry.qlId,solveMode:entry.solveMode,difficulty:entry.difficulty,seed,mathematicalFingerprint:generated.mathematicalFingerprint,context:generated.parameters.context.jobPhrase,stem:generated.stem,options:generated.options,correctIndex:generated.correctIndex,correctAnswer:generated.solution.answerText,keyRule:generated.explanation.opening,formula:generated.explanation.formula,givens:generated.explanation.givens,standardSteps:generated.explanation.steps,shortcutTitle:generated.explanation.shortcut.title,shortcutSteps:generated.explanation.shortcut.steps,commonTrap:generated.explanation.commonTrap,conclusion:generated.explanation.conclusion,distractorLabels:generated.optionAudit.map(option=>option.misconceptionId),validationStatus:generated.validation.valid?"PASS":"FAIL",validationErrors:generated.validation.errors,publiclyPublishable:false});
  }
  return rows;
}
