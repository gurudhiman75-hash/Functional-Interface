import test, {after,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const requireApi=createRequire(path.resolve('artifacts/api-server/package.json'));
const {build}=requireApi('esbuild');
const express=requireApi('express');
const base=path.resolve('artifacts/api-server/dist'); await mkdir(base,{recursive:true});
const dir=await mkdtemp(path.join(base,'chapter-route-test-'));
const run='4f54a84b-f143-4892-8dbc-38a39dc82111';
const engines=['quant-v4','reasoning-v1','language-v1','knowledge-v1'];
const ids=['TRG-002','OPS-001','ENG-001','COM-001'];
const manifest={source:'canonical-question-studio-engine-registry',schemaVersion:1,packages:engines.map((engineId,i)=>({
  engineId,packageId:ids[i],enabled:true,cpIds:[`${ids[i]}-CP-001`],supportedLanguages:['en'],
  supportedRuntimeModes:['review-only'],reviewSurfaceRequired:true,manualApprovalRequired:true,
  productionReleaseAuthorized:false,automaticStudentPublication:false,publiclyPublishable:false,
}))};
const state={manifest,commits:0,launches:0,rows:[],query:'',values:[],launchFailure:false};
globalThis.__chapterRouteTest=state;
const mocks={
  '../lib/db':`export const sqlClient=(strings,...values)=>{const s=globalThis.__chapterRouteTest;s.query=strings.join('?');s.values=values;return Promise.resolve(s.rows);};`,
  '../lib/admin-rbac':`export const requireAdminPermission=permission=>(req,res,next)=>{if(permission!=='content.generation.run'||req.get('x-permission')==='denied')return res.status(403).json({code:'DENIED'});next();};`,
  '../question-studio/async-enqueue-foundation':`export async function recordQuestionStudioEnqueueIntent(input,channel){const s=globalThis.__chapterRouteTest;s.commits++;s.channel=channel;s.input=input;return {id:'${run}',publicCode:'GEN-TEST',status:'queued',reused:false,retryAfterSeconds:3};}`,
  'node:fs':`export const existsSync=()=>true;export const readFileSync=()=>JSON.stringify(globalThis.__chapterRouteTest.manifest);`,
};
await build({entryPoints:['artifacts/api-server/src/routes/admin-question-studio-async-production-chapters.ts'],
  bundle:true,platform:'node',format:'esm',packages:'external',outfile:path.join(dir,'route.mjs'),
  plugins:[{name:'isolated-boundaries',setup(build){
    build.onResolve({filter:/.*/},args=>Object.hasOwn(mocks,args.path)?{path:args.path,namespace:'fixture'}:undefined);
    build.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:mocks[args.path],loader:'js'}));
  }}]});
const router=(await import(pathToFileURL(path.join(dir,'route.mjs')))).default;
const app=express(); app.use(express.json());
app.use((req,res,next)=>{if(req.get('x-auth')!=='missing'){
  req.user={id:'firebase-admin'};req.adminSession={user:{id:'6dc5559d-7233-43fc-b531-f681ce8e6398'}};
}next();});
app.use(router);
const server=app.listen(0,'127.0.0.1'); await new Promise(resolve=>server.once('listening',resolve));
const root=`http://127.0.0.1:${server.address().port}`;
const localFetch=globalThis.fetch;
const config={EXAMTREE_API_RUNTIME:'cloud-run',EXAMTREE_API_STAGING:'false',
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED:'true',
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED:'true',
  EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED:'true',
  EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED:'true',EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED:'true',
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON:JSON.stringify({mode:'all-eligible-chapters',reviewOnly:true,chapterWide:true}),
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:new Date(Date.now()+3600000).toISOString()};
const previous=Object.fromEntries(Object.keys(config).map(key=>[key,process.env[key]]));
beforeEach(()=>{
  Object.assign(process.env,config);Object.assign(state,{commits:0,launches:0,rows:[],launchFailure:false,query:'',values:[]});
  globalThis.fetch=async(url,options)=>{
    if(String(url).startsWith('http://metadata.google.internal/'))return Response.json({access_token:'x'.repeat(40)});
    assert.equal(url,'https://run.googleapis.com/v2/projects/sarbedutech/locations/asia-south1/jobs/examtree-qs-chapter-dispatch-prod:run');
    assert.equal(JSON.parse(options.body).overrides.containerOverrides[0].env[0].value,run);
    state.launches++;
    return state.launchFailure?new Response('private failure',{status:403}):Response.json({name:'projects/sarbedutech/locations/asia-south1/operations/test'});
  };
});
after(async()=>{
  globalThis.fetch=localFetch;delete globalThis.__chapterRouteTest;
  for(const [key,value] of Object.entries(previous)){if(value===undefined)delete process.env[key];else process.env[key]=value;}
  await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});
});
const input=(i=0,count=1)=>({request:{engineId:engines[i],packageId:ids[i],language:'en',difficulty:'Mixed',count,runtimeMode:'review-only'},count,selectedCpIds:[]});
const post=(body,headers={},endpoint='/runs/async-production-chapter')=>localFetch(root+endpoint,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':'chapter-test-123',...headers},body:JSON.stringify(body)});

test('all four engines enqueue 1 and 20 canonical chapter questions then start existing dispatcher',async()=>{
  for(let i=0;i<4;i++)for(const count of [1,20]){
    const response=await post(input(i,count));assert.equal(response.status,202);
    const receipt=await response.json();assert.equal(receipt.id,run);assert.equal(receipt.dispatchRequested,true);
    assert.equal(state.channel,'chapter_review');assert.equal(state.input.compute.count,count);
  }
  assert.equal(state.commits,8);assert.equal(state.launches,8);
});
test('RBAC, identity, release gate, scope, count and seed denial have no enqueue or network side effects',async()=>{
  assert.equal((await post(input(),{'x-permission':'denied'})).status,403);
  assert.equal((await post(input(),{'x-auth':'missing'})).status,403);
  for(const count of [0,21,1.5])assert.equal((await post(input(0,count))).status,403);
  const unknown=input();unknown.request.packageId='UNKNOWN-001';assert.equal((await post(unknown)).status,403);
  const dynamic=input();dynamic.selectedCpIds=['DYNAMIC-001'];assert.equal((await post(dynamic)).status,403);
  const seeded=input();seeded.request.seed='chosen';assert.equal((await post(seeded)).status,400);
  delete process.env.EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED;
  assert.equal((await post(input())).status,503);
  assert.equal(state.commits,0);assert.equal(state.launches,0);
});
test('Run API denial preserves receipt for admin recovery instead of losing committed run',async()=>{
  state.launchFailure=true;const response=await post(input());assert.equal(response.status,202);
  const receipt=await response.json();assert.equal(receipt.id,run);assert.equal(receipt.dispatchRequested,false);
  assert.equal(state.commits,1);
});
test('saved-run retry checks owner query, channel and immutable seeded scope; never creates a new run',async()=>{
  const snapshot={...input(3,20),queueVersion:1};snapshot.request.seed=`qs-async:${run}`;
  state.rows=[{status:'queued',snapshot}];
  const endpoint=`/runs/${run}/dispatch-production-chapter`;
  const response=await post({}, {},endpoint);assert.equal(response.status,202);
  assert.match(state.query,/requested_by=/);assert.match(state.query,/requestedByFirebaseUid/);
  assert.match(state.query,/chapter_review_queued\.v1/);assert.equal(state.values[2],'firebase-admin');
  assert.equal(state.commits,0);assert.equal(state.launches,1);
  state.rows=[];assert.equal((await post({}, {},endpoint)).status,404);
  state.rows=[{status:'queued',snapshot:{...snapshot,selectedCpIds:['UNKNOWN-001']}}];
  assert.equal((await post({}, {},endpoint)).status,403);assert.equal(state.launches,1);
  state.rows=[{status:'review',snapshot}];assert.equal((await post({}, {},endpoint)).status,200);
  assert.equal(state.launches,1);
});
