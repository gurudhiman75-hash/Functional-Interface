import assert from 'node:assert/strict';
import { once } from 'node:events';
import { build } from 'esbuild';
import express from 'express';
await build({entryPoints:['src/routes/index.ts'],outfile:'dist/commerce-public-mount-fixture.mjs',bundle:true,platform:'node',format:'esm',packages:'external',plugins:[{name:'mount-fixtures',setup(b){
 b.onResolve({filter:/^express$/},()=>({path:'express',external:true}));
 b.onResolve({filter:/^\.\/[^/]+$/},args=>{
   if(args.importer.endsWith('/routes/index.ts') && !['./canonical-commerce-checkout','./canonical-commerce-purchases'].includes(args.path))return {path:args.path,namespace:'mount'};
 });
 b.onResolve({filter:/^\.\.\/lib\/db$/},()=>({path:'db',namespace:'fixture'}));
 b.onResolve({filter:/^\.\.\/middlewares\/auth$/},()=>({path:'auth',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},({path})=>({loader:'js',contents:path==='auth'?'export function authenticate(req,res,next){return res.status(401).json({code:"AUTH_REQUIRED"});}':'export const sqlClient=async()=>[];sqlClient.begin=fn=>fn(sqlClient);'}));
 b.onLoad({filter:/.*/,namespace:'mount'},({path})=>({loader:'js',contents:`import {Router} from 'express';const router=Router();${path==='./mobile-push-devices'?'router.use((req,res)=>res.status(401).json({code:"UNRELATED_ROUTER_BLOCK"}));':''}export default router;`}));
}}]});
const {default:router}=await import('../dist/commerce-public-mount-fixture.mjs');
const app=express();app.use(express.json());app.use(router);const server=app.listen(0,'127.0.0.1');await once(server,'listening');
try {
 const base=`http://127.0.0.1:${server.address().port}`;
 const products=await fetch(base+'/commerce/products');assert.equal(products.status,200);assert.deepEqual((await products.json()).products,[]);
 const purchases=await fetch(base+'/commerce/purchases');assert.equal(purchases.status,401);assert.equal((await purchases.json()).code,'AUTH_REQUIRED');
 const order=await fetch(base+'/commerce/orders',{method:'POST',headers:{'content-type':'application/json'},body:'{}'});assert.equal(order.status,401);assert.equal((await order.json()).code,'AUTH_REQUIRED');
 console.log('PASS: actual API registry exposes public products before unrelated auth, while purchases and checkout remain authenticated.');
}finally{server.close();}
