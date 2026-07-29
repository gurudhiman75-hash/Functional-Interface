import { TMW_CP_011_REGISTRY } from "./cp011-registry";
import { selectTmwCp011StemOpeningStyle, type TmwCp011StemOpeningStyle } from "./cp011-presentation";
import { runTmwCp011Pipeline } from "./cp011-runtime";

export function buildTmwCp011ReviewRows(perQl=3){
 const rows=TMW_CP_011_REGISTRY.flatMap(entry=>{
  const selected=[];const seen=new Set<string>();
  for(let i=0;i<500&&selected.length<perQl;i++){
   const q=runTmwCp011Pipeline(entry.qlId,`review-${entry.qlId}-${i}`);
   if(!q.validation.valid)throw new Error(`${entry.qlId}: ${q.validation.errors.join(", ")}`);
   if(seen.has(q.mathematicalFingerprint))continue;
   seen.add(q.mathematicalFingerprint);
   const openingStyle=selectTmwCp011StemOpeningStyle(entry,q.seed);
   selected.push({qlId:entry.qlId,solveMode:entry.solveMode,difficulty:entry.difficulty,openingStyle,stem:q.stem,options:q.options,correctIndex:q.correctIndex,correctAnswer:q.solution.answerText,keyRule:q.explanation.opening,formula:q.explanation.formula,givens:q.explanation.givens,standardSteps:q.explanation.steps,shortcutTitle:q.explanation.shortcut.title,shortcutSteps:q.explanation.shortcut.steps,commonTrap:q.explanation.commonTrap,conclusion:q.explanation.conclusion,validationStatus:"PASS",mathematicalFingerprint:q.mathematicalFingerprint});
  }
  if(selected.length!==perQl)throw new Error(`insufficient distinct states for ${entry.qlId}`);
  return selected;
 });
 const counts=new Map<TmwCp011StemOpeningStyle,number>();
 let longestRun=0,currentRun=0,previous:TmwCp011StemOpeningStyle|undefined;
 for(const row of rows){
  counts.set(row.openingStyle,(counts.get(row.openingStyle)??0)+1);
  currentRun=row.openingStyle===previous?currentRun+1:1;
  longestRun=Math.max(longestRun,currentRun);previous=row.openingStyle;
  if(row.openingStyle==="CONTEXT_FIRST"&&!row.stem.startsWith("At "))throw new Error(`${row.qlId}: review context-first stem mismatch`);
  if(row.openingStyle!=="CONTEXT_FIRST"&&row.stem.startsWith("At "))throw new Error(`${row.qlId}: review fixed At-prefix leakage`);
 }
 if(counts.size!==4)throw new Error("review stem-opening style coverage incomplete");
 const contextCount=counts.get("CONTEXT_FIRST")??0;
 if(contextCount*5>rows.length)throw new Error(`review context-first stems exceed 20%: ${contextCount}/${rows.length}`);
 if(longestRun>3)throw new Error(`review opening-style run too long: ${longestRun}`);
 return rows;
}
