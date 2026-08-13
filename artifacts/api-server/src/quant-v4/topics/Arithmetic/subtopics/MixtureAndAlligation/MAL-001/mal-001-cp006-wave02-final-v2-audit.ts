import { generateMalCp006Wave02FinalAuthorityV2 } from "./foundation/cp006-wave02-final-authority-v2";
import { MAL_CP006_WAVE02_PROTOTYPE_IDS } from "./foundation/cp006-source-fixtures-wave02";

const failures:string[]=[];
const positions=[0,0,0,0];
let generated=0,passed=0,witness=false;
const diversity:Record<string,{states:Set<string>;shapes:Set<number>}>= {};
for(const id of MAL_CP006_WAVE02_PROTOTYPE_IDS){
  diversity[id]={states:new Set(),shapes:new Set()};
  for(let i=0;i<240;i++){
    const q=generateMalCp006Wave02FinalAuthorityV2(id,`wave02-final-v2:${id}:${i}`);
    const q2=generateMalCp006Wave02FinalAuthorityV2(id,`wave02-final-v2:${id}:${i}`);
    generated++;
    diversity[id].states.add(q.stateKey); diversity[id].shapes.add(q.stemShape);
    const text=[q.stem,...q.explanation,q.commonMistake].join(" ");
    const ok=q.validation.ok&&JSON.stringify(q)===JSON.stringify(q2)&&q.stem.endsWith("?")&&q.explanation.length===4&&q.options.length===4&&new Set(q.options).size===4&&q.options[q.correctIndex]===q.answer&&!text.includes("x²")&&!text.includes("→")&&q.permanentQlId===null&&q.permanentSolveModeId===null&&!q.active&&!q.publiclyPublishable&&!q.questionStudioDiscoverable&&!q.questionBankWritable&&!q.testEligible;
    if(ok)passed++;else failures.push(`${id}:${i}:${q.validation.errors.join("|")}`);
    positions[q.correctIndex]++;
    if(q.stateKey==="220:4:3:20"&&q.answer==="64 litres"&&q.stem.includes("11:4"))witness=true;
  }
  if(diversity[id].states.size!==16)failures.push(`${id}:states`);
  if(diversity[id].shapes.size!==4)failures.push(`${id}:shapes`);
}
if(!witness)failures.push("direct chain witness");
const report={status:failures.length?"FAIL_MAL_CP006_WAVE02_FINAL_V2":"PASS_MAL_CP006_WAVE02_FINAL_V2",generated,passed,answerPositions:positions,directChainWitness:witness,prototypes:Object.fromEntries(Object.entries(diversity).map(([k,v])=>[k,{states:v.states.size,stemShapes:v.shapes.size}])),alligation:"NOT_A_CP006_CORE_SOLVE_MODE",permanentQls:0,permanentSolveModes:0,failures};
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
