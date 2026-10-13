import assert from "node:assert/strict";
import {
  createQuestionStudioTask, deliverQuestionStudioCloudTask,
  getQuestionStudioTaskConfig, QuestionStudioTaskTransportError,
} from "./async-cloud-tasks-transport";

const ENV = {
  EXAMTREE_QUESTION_STUDIO_TASK_PROJECT:"sarbedutech",
  EXAMTREE_QUESTION_STUDIO_TASK_REGION:"asia-south1",
  EXAMTREE_QUESTION_STUDIO_TASK_QUEUE:"qs_generation_staging",
  EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL:"https://examtree-api-1083299267005.asia-south1.run.app/internal/question-studio/async-task",
  EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE:"https://examtree-api-1083299267005.asia-south1.run.app",
  EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT:"qs-tasks@sarbedutech.iam.gserviceaccount.com",
};
const EVT={eventId:"11111111-1111-4111-8111-111111111111",runId:"22222222-2222-4222-8222-222222222222"};
const config=getQuestionStudioTaskConfig(ENV);
const one=createQuestionStudioTask(EVT,config);
const two=createQuestionStudioTask(EVT,config);
assert.deepEqual(one,two);
assert.equal(one.task.name,"projects/sarbedutech/locations/asia-south1/queues/qs_generation_staging/tasks/qs-11111111111141118111111111111111");
assert.equal(one.task.httpRequest.httpMethod,"POST");
assert.equal(one.task.httpRequest.oidcToken.audience,ENV.EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE);
assert.deepEqual(
  JSON.parse(Buffer.from(one.task.httpRequest.body,"base64").toString("utf8")),
  {runId:EVT.runId,queueVersion:1},
);
assert.equal(one.task.httpRequest.headers["Content-Type"],"application/json");
assert.ok(!JSON.stringify(one).includes("FIREBASE_ID_TOKEN"));
assert.ok(!JSON.stringify(one).includes("DATABASE_URL"));
assert.throws(()=>createQuestionStudioTask({...EVT,runId:"INVALID"},config),QuestionStudioTaskTransportError);
for(const change of [
  {EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL:"http://examtree-api.run.app/internal/question-studio/async-task"},
  {EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL:"https://example.com/internal/question-studio/async-task"},
  {EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL:"https://examtree-api.run.app/internal/question-studio/async-task?secret=x"},
  {EXAMTREE_QUESTION_STUDIO_TASK_HANDLER_URL:"https://examtree-api.run.app/api/admin/question-studio"},
  {EXAMTREE_QUESTION_STUDIO_TASK_AUDIENCE:"https://evil.run.app"},
  {EXAMTREE_QUESTION_STUDIO_TASK_SERVICE_ACCOUNT:"not-an-email"},
  {EXAMTREE_QUESTION_STUDIO_TASK_QUEUE:"bad/queue"},
]) {
  assert.throws(()=>getQuestionStudioTaskConfig({...ENV,...change}),QuestionStudioTaskTransportError);
}
let called: Array<{url:string;options:RequestInit|undefined}>=[];
const successFetch = async (input: RequestInfo|URL,options?:RequestInit): Promise<Response> => {
  called.push({url:String(input),options});
  if(called.length===1) return new Response(JSON.stringify({access_token:"test-valid-service-account-token-000000"}),{status:200});
  return new Response(JSON.stringify({name:one.task.name}),{status:200});
};
const sent=await deliverQuestionStudioCloudTask(EVT,config,successFetch as typeof fetch);
assert.equal(sent.alreadyExists,false);
assert.equal(sent.taskName,one.task.name);
assert.equal(called.length,2);
assert.equal(called[0].options?.headers && (called[0].options.headers as Record<string,string>)["Metadata-Flavor"],"Google");
assert.match(called[1].url,/cloudtasks.googleapis.com\/v2\/projects\/sarbedutech\/locations\/asia-south1\/queues\/qs_generation_staging\/tasks$/);
const header=called[1].options?.headers as Record<string,string>;
assert.match(header.Authorization,/^Bearer test-valid-service-account-token-/);
const body=JSON.parse(String(called[1].options?.body));
assert.equal(body.task.name,one.task.name);
assert.ok(!JSON.stringify(body).includes("test-valid-service-account-token"));
let n=0;
const conflict=async (_:RequestInfo|URL):Promise<Response> => {
  n++;
  return n===1?new Response(JSON.stringify({access_token:"another-valid-google-metadata-token-001"}),{status:200}):new Response("",{status:409});
};
const reused=await deliverQuestionStudioCloudTask(EVT,config,conflict as typeof fetch);
assert.equal(reused.alreadyExists,true);
let a=0;
const forbidden=async (_:RequestInfo|URL):Promise<Response>=>{
  a++;
  return a===1?new Response(JSON.stringify({access_token:"another-valid-google-metadata-token-001"}),{status:200}):new Response("sensitive API body",{status:403});
};
await assert.rejects(
  ()=>deliverQuestionStudioCloudTask(EVT,config,forbidden as typeof fetch),
  (err:unknown)=>err instanceof QuestionStudioTaskTransportError &&
    err.code==="TASK_CREATE_FAILED" && !err.message.includes("sensitive"),
);
console.log("PASS: deterministic Cloud Task names, OIDC identity, internal URL policy, 409 replay and token isolation");
