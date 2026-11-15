import assert from "node:assert/strict";
import { test } from "node:test";
import { NativeReviewSnapshotCache } from "./native-review-snapshot-cache";

test("one native generation is shared by simultaneous review openings",async()=>{
  const cache=new NativeReviewSnapshotCache<{value:number}>(3,10000);
  let calls=0;
  const work=async()=>{calls++;await Promise.resolve();return {value:42};};
  const values=await Promise.all(Array.from({length:8},()=>cache.getOrCreate("item:v1",work)));
  assert.equal(calls,1);
  assert.ok(values.every(value=>value.value===42));
  await cache.getOrCreate("item:v1",work);
  assert.equal(calls,1);
});
test("an item revision is a separate immutable preview identity",async()=>{
  const cache=new NativeReviewSnapshotCache<number>();
  let calls=0;
  assert.equal(await cache.getOrCreate("item:v1",async()=>++calls),1);
  assert.equal(await cache.getOrCreate("item:v2",async()=>++calls),2);
  assert.equal(await cache.getOrCreate("item:v1",async()=>++calls),1);
});
test("failed regeneration is not cached and can be retried",async()=>{
  const cache=new NativeReviewSnapshotCache<string>();
  let calls=0;
  await assert.rejects(()=>cache.getOrCreate("item:v1",async()=>{calls++;throw new Error("invalid source");}));
  assert.equal(await cache.getOrCreate("item:v1",async()=>{calls++;return "ok";}),"ok");
  assert.equal(calls,2);
});
test("bounded cache evicts older questions and supports explicit invalidation",async()=>{
  const cache=new NativeReviewSnapshotCache<number>(2);
  let calls=0;
  for(const key of ["a","b","c"])await cache.getOrCreate(key,async()=>++calls);
  assert.equal(cache.size,2);
  assert.equal(await cache.getOrCreate("a",async()=>++calls),4);
  cache.invalidate("a");
  assert.equal(await cache.getOrCreate("a",async()=>++calls),5);
});
test("TTL forces regeneration after expiry",async()=>{
  const cache=new NativeReviewSnapshotCache<number>(3,0);
  let calls=0;
  await cache.getOrCreate("a",async()=>++calls);
  await cache.getOrCreate("a",async()=>++calls);
  assert.equal(calls,2);
});
