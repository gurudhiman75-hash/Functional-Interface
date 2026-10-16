// OFFLINE TEST ONLY. Mirrors the production universal compute executor without
// network, credentials, persistence or publication. Never imported by the API.
import {parentPort} from "node:worker_threads";
import {executeUniversalStudioCompute} from "./universal-executor";
import type {UniversalStudioComputeInput} from "./universal-executor";

if(!parentPort)throw new Error("Coverage audit requires an isolated worker thread");
const port=parentPort;
function present(value:unknown):boolean{
 return value!==undefined&&value!==null&&String(value).trim()!=="";
}
port.on("message",async data=>{
 if(data?.type!=="compute"||!Number.isInteger(data?.id))return;
 try{
  const input=data.input as UniversalStudioComputeInput;
  const batch=await executeUniversalStudioCompute(input);
  port.postMessage({
   type:"result",id:data.id,ok:true,
   batch:{
    packageId:batch.packageId,engineId:batch.engineId,
    questionChecks:batch.questions.map(q=>({
     hasStem:present(q.stem)||present(q.text),
     optionCount:Array.isArray(q.options)?q.options.length:0,
     hasAnswer:[q.correctIndex,q.correct,q.answer,q.correctOption,q.answerKey].some(present),
     hasExplanation:typeof q.explanation==="string"&&q.explanation.trim().length>0,
    })),
   }
  });
 }catch(error){
  const failure=error as {code?:unknown;message?:unknown};
  port.postMessage({
   type:"result",id:data.id,ok:false,
   error:{
    code:typeof failure.code==="string"?failure.code:"UNIVERSAL_COMPUTE_FAILED",
    message:error instanceof Error?error.message:"Compute failed",
   }
  });
 }
});
port.postMessage({type:"ready"});
