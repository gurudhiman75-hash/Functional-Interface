// Production-only compute worker startup facade.
// With approval OFF, starts a health-only, no-generation HTTP server and
// requires no worker token, Neon URL or Google credential secret.
import {createServer} from "node:http";
import {assertProductionWorkerCanaryEnvironment} from "./production-canary-worker-scope.mjs";

const env=process.env;
if(env.EXAMTREE_API_RUNTIME!=="cloud-run" ||
   env.EXAMTREE_API_STAGING!=="false" ||
   env.K_SERVICE!=="examtree-universal-prod" ||
   env.DATABASE_URL ||
   env.EXAMTREE_QUESTION_STUDIO_STAGING_TASK_ACCEPTANCE_APPROVED==="true") {
  throw new Error("QS_PRODUCTION_WORKER_ENVIRONMENT_INVALID");
}
const port=Number(env.PORT??8080);
if(!Number.isInteger(port) || port<1 || port>65535) {
  throw new Error("QS_PRODUCTION_WORKER_PORT_INVALID");
}
if(env.EXAMTREE_QS_PRODUCTION_WORKER_APPROVED!=="true") {
  const server=createServer((req,res)=>{
    const isHealth=req.method==="GET"&&req.url==="/health";
    res.writeHead(isHealth?200:503,{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store",
      "x-content-type-options":"nosniff",
    });
    res.end(JSON.stringify(isHealth
      ?{status:"ok",service:"qs-universal-prod",ready:false}
      :{code:"QS_PRODUCTION_WORKER_DISABLED"}));
  });
  server.listen(port,"0.0.0.0",()=>console.info("QS_PRODUCTION_WORKER_DISABLED_READY"));
} else {
  // Required for every approved production worker launch; never general mode.
  assertProductionWorkerCanaryEnvironment(env);
  if((env.QUESTION_STUDIO_WORKER_TOKEN?.trim().length??0)<32) {
    throw new Error("QS_PRODUCTION_WORKER_TOKEN_UNAVAILABLE");
  }
  await import("./universal-question-studio-worker-service.mjs");
}
