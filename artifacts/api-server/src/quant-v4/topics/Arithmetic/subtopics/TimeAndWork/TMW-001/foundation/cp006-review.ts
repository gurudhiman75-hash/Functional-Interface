import { TMW_CP006_REGISTRY } from "./cp006-registry";
import { runTmwCp006Pipeline } from "./cp006-runtime";

export interface TmwCp006ReviewRow {
  packageId:string;
  cpId:"TMW-CP-006";
  qlId:string;
  solveMode:string;
  difficulty:string;
  seed:string;
  mathematicalFingerprint:string;
  context:string;
  stem:string;
  options:string[];
  correctIndex:number;
  correctAnswer:string;
  formula:string;
  explanation:string[];
  distractorLabels:string[];
  validationStatus:"PASS"|"FAIL";
  validationErrors:string[];
  publiclyPublishable:false;
}

export function buildTmwCp006ReviewRows(seedsPerQl=3):TmwCp006ReviewRow[]{
  const rows:TmwCp006ReviewRow[]=[];
  for(const entry of TMW_CP006_REGISTRY){
    for(let index=0;index<seedsPerQl;index+=1){
      const seed=`tmw-cp006-review:${entry.qlId}:${index}`;
      const generated=runTmwCp006Pipeline({questionLanguageId:entry.qlId,seed});
      rows.push({
        packageId:`${entry.qlId}:${seed}`,cpId:"TMW-CP-006",qlId:entry.qlId,solveMode:entry.solveMode,difficulty:entry.difficulty,seed,
        mathematicalFingerprint:generated.mathematicalFingerprint,context:generated.parameters.context.jobPhrase,stem:generated.stem,options:generated.options,
        correctIndex:generated.correctIndex,correctAnswer:generated.solution.answerText,formula:generated.explanation.formula,
        explanation:[generated.explanation.opening,generated.explanation.formula,...generated.explanation.steps,generated.explanation.conclusion],
        distractorLabels:generated.optionAudit.map(option=>option.misconceptionId),validationStatus:generated.validation.valid?"PASS":"FAIL",
        validationErrors:generated.validation.errors,publiclyPublishable:false,
      });
    }
  }
  return rows;
}
