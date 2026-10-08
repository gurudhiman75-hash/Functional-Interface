import assert from 'node:assert/strict';
import { once } from 'node:events';
import { build } from 'esbuild';
import express from 'express';
let mode='owned';
globalThis.salesFixture = (strings, ...values) => {
 const query=strings.join('?');
 if(query.includes('SELECT u.id::text')) return [{id:'11111111-1111-4111-8111-111111111111'}];
 if(query.includes('SELECT e.id FROM commerce.entitlements')) return mode==='owned'?[{id:'entitlement'}]:[];
 if(query.includes('o.id::text AS "orderId"')) return [{productId:mode==='mismatch'?'another-product':'22222222-2222-4222-8222-222222222222',status:mode==='paid'?'paid':'payment_pending',expiresAt:mode==='expired'?'2000-01-01':null,providerOrderId:'provider',orderId:'order',orderNumber:'10',currency:'INR',totalMinor:100}];
 return [];
};
await build({entryPoints:['src/routes/canonical-commerce-checkout.ts'],outfile:'dist/sales-route-fixture.mjs',bundle:true,platform:'node',format:'esm',packages:'external',plugins:[{name:'fixtures',setup(b){
 b.onResolve({filter:/^\.\.\/lib\/db$/},()=>({path:'db',namespace:'fixture'}));
 b.onResolve({filter:/^\.\.\/middlewares\/auth$/},()=>({path:'auth',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},({path})=>({loader:'js',contents:path==='auth'?'export function authenticate(req,res,next){if(!req.headers["x-user"])return res.status(401).json({});req.user={id:req.headers["x-user"]};next();}':'export const sqlClient=async(...args)=>globalThis.salesFixture(...args);sqlClient.begin=fn=>fn(sqlClient);'}));
}}]});
process.env.RAZORPAY_KEY_ID='fixture';process.env.RAZORPAY_KEY_SECRET='fixture';
const {default:router}=await import('../dist/sales-route-fixture.mjs');
const app=express();app.use(express.json());app.use(router);const server=app.listen(0,'127.0.0.1');await once(server,'listening');
const request=async(user=true)=>{const res=await fetch(`http://127.0.0.1:${server.address().port}/commerce/orders`,{method:'POST',headers:{'content-type':'application/json',...(user?{'x-user':'student'}:{})},body:JSON.stringify({productId:'22222222-2222-4222-8222-222222222222',idempotencyKey:'stable-key-12345'})});return {status:res.status,body:await res.json()};};
try {
 assert.equal((await request(false)).status,401);
 assert.equal((await request()).body.code,'PRODUCT_ALREADY_OWNED');
 mode='expired';assert.equal((await request()).body.code,'CHECKOUT_CLOSED');
 mode='paid';assert.equal((await request()).body.code,'CHECKOUT_CLOSED');
 mode='mismatch';assert.equal((await request()).body.code,'IDEMPOTENCY_CONFLICT');
 mode='pending';const resumed=await request();assert.equal(resumed.status,200);assert.equal(resumed.body.providerOrderId,'provider');
 console.log('PASS: checkout authentication, owned package, expired/paid order, product mismatch and pending order reuse. No provider calls made.');
} finally {server.close();}
