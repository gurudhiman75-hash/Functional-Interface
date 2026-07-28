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
  keyRule:string;
  formula:string;
  givens:string[];
  standardSteps:string[];
  shortcutTitle:string;
  shortcutSteps:string[];
  commonTrap:{optionLabel:string;optionText:string;misconceptionId:string;explanation:string};
  conclusion:string;
  explanation:string[];
  distractorLabels:string[];
  validationStatus:"PASS"|"FAIL";
  validationErrors:string[];
  publiclyPublishable:false;
}

export function buildTmwCp006ReviewRows(seedsPerQl=3):TmwCp006ReviewRow[]{
  const rows:TmwCp006ReviewRow[]=[];
  for(const entry of TMW_CP006_REGISTRY){
    const seenStems=new Set<string>();let accepted=0,attempt=0;
    while(accepted<seedsPerQl&&attempt<120){
      const seed=`tmw-cp006-review:${entry.qlId}:${attempt++}`;
      const generated=runTmwCp006Pipeline({questionLanguageId:entry.qlId,seed});
      if(seenStems.has(generated.stem))continue;
      seenStems.add(generated.stem);accepted+=1;
      const trap=generated.explanation.commonTrap;
      rows.push({
        packageId:`${entry.qlId}:${seed}`,cpId:"TMW-CP-006",qlId:entry.qlId,solveMode:entry.solveMode,difficulty:entry.difficulty,seed,
        mathematicalFingerprint:generated.mathematicalFingerprint,context:generated.parameters.context.jobPhrase,stem:generated.stem,options:generated.options,
        correctIndex:generated.correctIndex,correctAnswer:generated.solution.answerText,keyRule:generated.explanation.opening,formula:generated.explanation.formula,
        givens:generated.explanation.givens,standardSteps:generated.explanation.steps,shortcutTitle:generated.explanation.shortcut.title,
        shortcutSteps:generated.explanation.shortcut.steps,commonTrap:trap,conclusion:generated.explanation.conclusion,
        explanation:[
          "KEY RULE & FORMULA",generated.explanation.opening,generated.explanation.formula,
          "STEP-BY-STEP SOLUTION",...generated.explanation.givens,...generated.explanation.steps,
          `EXAM SPEED SHORTCUT — ${generated.explanation.shortcut.title}`,...generated.explanation.shortcut.steps,
          `COMMON TRAP — ${trap.optionLabel}: ${trap.optionText}`,trap.explanation,
          generated.explanation.conclusion,
        ],
        distractorLabels:generated.optionAudit.map(option=>option.misconceptionId),validationStatus:generated.validation.valid?"PASS":"FAIL",
        validationErrors:generated.validation.errors,publiclyPublishable:false,
      });
    }
    if(accepted!==seedsPerQl)throw new Error(`${entry.qlId} could not produce ${seedsPerQl} distinct review stems`);
  }
  return rows;
}
