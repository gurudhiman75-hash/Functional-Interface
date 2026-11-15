import assert from "node:assert/strict";
import { test } from "node:test";
import { nativeSourceHash,nativeSourceQuestion,nativeIdentityHash,readPersistedNativeSnapshot,
  type PersistedNativeSnapshot } from "./persisted-native-review-format";

const source=()=>({
  language:"en",packageId:"MAL-001",canonicalProblemId:"MAL-CP-002",
  questionLanguageId:"MAL-QL-021",seed:"fixed-seed:CP:1",difficulty:"Medium",
  text:"Milk and water in ratio 3:2; determine milk.",explanation:"Simple method.",
  options:["12 litres","18 litres","20 litres","25 litres"],correctIndex:1,
});
function snapshot(payload:ReturnType<typeof source>):PersistedNativeSnapshot{
  return {schemaVersion:1,sourceHash:nativeSourceHash(nativeSourceQuestion(payload)),
    identityHash:nativeIdentityHash(payload),sourceVerified:true,
    generatedAt:"2026-11-15T00:00:00.000Z",
    variants:[{language:"hi",status:"verified",stem:"दूध और पानी का अनुपात...",
      explanation:"समाधान",options:["12 लीटर","18 लीटर","20 लीटर","25 लीटर"],correctIndex:1},
      {language:"pa",status:"blocked",reason:"parity mismatch"}]};
}
test("native snapshot of exact generation version reads without running engine",()=>{
  const payload=source();
  assert.deepEqual(readPersistedNativeSnapshot({...payload,nativeReviewSnapshot:snapshot(payload)})?.variants.map(v=>v.language),["hi","pa"]);
});
test("English stem option correct answer and explanation changes invalidate native snapshot",()=>{
  const payload=source(),snap=snapshot(payload);
  for(const diff of [
    {text:"New English source"},
    {options:["12 litres","19 litres","20 litres","25 litres"]},
    {correctIndex:2},
    {explanation:"Different explanation"},
  ])assert.equal(readPersistedNativeSnapshot({...payload,...diff,nativeReviewSnapshot:snap}),null);
});
test("CP QL seed difficulty language and package identity changes invalidate snapshot",()=>{
  const payload=source(),snap=snapshot(payload);
  for(const diff of [
    {canonicalProblemId:"MAL-CP-003"},
    {questionLanguageId:"MAL-QL-020"},
    {seed:"new-seed"},{difficulty:"Hard"},{language:"hi"},{packageId:"AVG-001"},
  ])assert.equal(readPersistedNativeSnapshot({...payload,...diff,nativeReviewSnapshot:snap}),null);
});
test("unverified or malformed native snapshots never gain trusted status",()=>{
  const payload=source(),snap=snapshot(payload);
  assert.equal(readPersistedNativeSnapshot({...payload,nativeReviewSnapshot:{...snap,sourceVerified:false}}),null);
  assert.equal(readPersistedNativeSnapshot({...payload,nativeReviewSnapshot:{...snap,variants:[{language:"fr",status:"verified"}]}}),null);
  assert.equal(readPersistedNativeSnapshot({...payload,nativeReviewSnapshot:{...snap,variants:[{language:"hi",status:"verified",stem:"x"}]}}),null);
});
