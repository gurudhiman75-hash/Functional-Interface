import { generateMalCp006Wave02FinalAuthorityV2 } from "./foundation/cp006-wave02-final-authority-v2";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const lines=["# MAL-CP-006 Wave 02 — Final 20Q Learner Review V2",""];
let n=0;
for(const id of MAL_CP006_WAVE02_PROTOTYPE_IDS){
  const label=id.includes("INVERSE")?"Inverse transfer-return":"Changed-source chain";
  for(let i=0;i<10;i++){
    const q=generateMalCp006Wave02FinalAuthorityV2(id,`wave02-final-v2-review:${id}:${i}`);
    lines.push(`## ${++n}. ${label}`,"",q.stem,"");
    q.options.forEach((option,index)=>lines.push(`${String.fromCharCode(65+index)}. ${option}`));
    lines.push("",`**Answer:** ${q.answer}`,"","**Solution**");
    q.explanation.forEach((line,index)=>lines.push(`${index+1}. ${line}`));
    lines.push("",`**Common mistake:** ${q.commonMistake}`,"","---","");
  }
}
console.log(lines.join("\n"));
