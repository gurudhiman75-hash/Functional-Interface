import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtemp, mkdir, rm} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const requireApi=createRequire(path.resolve('artifacts/api-server/package.json'));
const {build}=requireApi('esbuild');
const base=path.resolve('artifacts/api-server/dist');
await mkdir(base,{recursive:true});
const dir=await mkdtemp(path.join(base,'chapter-launch-test-'));
after(()=>rm(dir,{recursive:true,force:true}));
await build({entryPoints:['artifacts/api-server/src/question-studio/prod-chapter-dispatch-launch.ts'],
  bundle:true,platform:'node',format:'esm',outfile:path.join(dir,'launch.mjs')});
const {launchProductionChapterDispatch:launch,enqueueAndDispatchChapter:enqueue,
  assertChapterDispatchLaunchApproved:approved,CHAPTER_DISPATCH_JOB:job}=await import(pathToFileURL(path.join(dir,'launch.mjs')));
const run='4f54a84b-f143-4892-8dbc-38a39dc82111';
const env=()=>({EXAMTREE_API_RUNTIME:'cloud-run',EXAMTREE_API_STAGING:'false',
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED:'true',
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_ROUTE_APPROVED:'true',
  EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_LAUNCH_APPROVED:'true',
  EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED:'true',
  EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED:'true',
  EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:new Date(Date.now()+3600000).toISOString()});
const receipt={id:run,publicCode:'GEN-TEST',status:'queued',reused:false,retryAfterSeconds:3};

test('only the fixed existing job and exact run UUID are submitted; no approval overrides',async()=>{
  for(const project of ['sarbedutech','1083299267005']){
    const seen=[];
    await launch(run,{env:env(),request:async(url,options)=>{
      seen.push([url,options]);
      return Response.json(seen.length===1?{access_token:'a'.repeat(40)}:
        {name:`projects/${project}/locations/asia-south1/operations/test`});
    }});
    assert.equal(seen.length,2);
    assert.equal(seen[0][1].headers['Metadata-Flavor'],'Google');
    assert.equal(seen[1][0],`https://run.googleapis.com/v2/${job}:run`);
    assert.equal(seen[1][1].method,'POST');
    assert.equal(seen[1][1].redirect,'error');
    assert.deepEqual(JSON.parse(seen[1][1].body),{overrides:{containerOverrides:[{env:[{
      name:'EXAMTREE_QS_PRODUCTION_CHAPTER_DISPATCH_RUN_ID',value:run}]}]}});
  }
});
test('all gates, expiry, environment and UUID fail before any network call',async()=>{
  for(const key of Object.keys(env())){
    const invalid=env(); delete invalid[key];
    assert.throws(()=>approved(invalid),/DISABLED/,key);
  }
  for(const patch of [{EXAMTREE_API_STAGING:'true'},
    {EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:new Date(Date.now()-1000).toISOString()},
    {EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT:new Date(Date.now()+25*3600000).toISOString()}]){
    await assert.rejects(launch(run,{env:{...env(),...patch},request:()=>assert.fail('network forbidden')}),/DISABLED/);
  }
  await assert.rejects(launch('../../other-job',{env:env(),request:()=>assert.fail('network forbidden')}),/RUN_ID_INVALID/);
});
test('metadata, permission, timeout and operation failures expose only a safe error',async()=>{
  for(const response of [new Response('secret-provider-error',{status:403}),
    Response.json({error:{message:'secret'}}),Response.json({name:'projects/other/operations/x'})]){
    let calls=0;
    await assert.rejects(launch(run,{env:env(),request:async()=>++calls===1
      ?Response.json({access_token:'a'.repeat(40)}):response}),/^Error: QS_CHAPTER_DISPATCH_LAUNCH_UNAVAILABLE$/);
  }
  await assert.rejects(launch(run,{env:env(),request:async()=>{throw Error('private token');}}),/LAUNCH_UNAVAILABLE/);
  await assert.rejects(launch(run,{env:env(),request:async()=>Response.json({access_token:'short'})}),/LAUNCH_UNAVAILABLE/);
});
test('expiry is rechecked after metadata and prevents execution',async()=>{
  const config=env(); let calls=0;
  await assert.rejects(launch(run,{env:config,request:async()=>{
    calls++; config.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT=new Date(Date.now()-1).toISOString();
    return Response.json({access_token:'a'.repeat(40)});
  }}),/DISABLED/);
  assert.equal(calls,1);
});
test('enqueue commit precedes launch; DB failure never starts an execution',async()=>{
  const order=[];
  assert.equal((await enqueue(async()=>{order.push('commit');return receipt;},async id=>{
    assert.equal(id,run);order.push('launch');})).dispatchRequested,true);
  assert.deepEqual(order,['commit','launch']);
  await assert.rejects(enqueue(async()=>{throw Error('rollback');},async()=>assert.fail('must not launch')),/rollback/);
});
test('lost launch acknowledgement returns durable receipt; retries reuse exact run',async()=>{
  const pending=await enqueue(async()=>receipt,async()=>{throw Error('timeout');});
  assert.equal(pending.id,run); assert.equal(pending.dispatchRequested,false);
  const retried=await enqueue(async()=>({...receipt,reused:true}),async id=>assert.equal(id,run));
  assert.equal(retried.reused,true); assert.equal(retried.dispatchRequested,true);
  for(const status of ['running','review','cancelled','failed','approved']){
    const completed=await enqueue(async()=>({...receipt,status}),async()=>assert.fail('terminal/claimed run'));
    assert.equal(completed.dispatchRequested,false);
  }
});
