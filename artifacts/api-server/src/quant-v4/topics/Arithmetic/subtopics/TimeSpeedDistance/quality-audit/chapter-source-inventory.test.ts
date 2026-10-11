import assert from "node:assert/strict";
import { TSD_CHAPTER_SOURCE_INVENTORY } from "./chapter-source-inventory";
for(const [level,total] of [[1,85],[2,60],[3,50]] as const){
 const rows=TSD_CHAPTER_SOURCE_INVENTORY.filter(r=>r.level===level);
 assert.equal(rows.length,total);
 assert.deepEqual(rows.map(r=>r.question),Array.from({length:total},(_,i)=>i+1));
 for(const row of rows){assert.ok(row.model && row.owner && row.note);assert.ok(["MAPPED","EXTENSION","QUARANTINE","OTHER"].includes(row.disposition));}
}
assert.equal(TSD_CHAPTER_SOURCE_INVENTORY.length,195);
console.log("PASS:195 individually mapped chapter source questions; mapping is explicitly distinct from learner-runtime certification.");
