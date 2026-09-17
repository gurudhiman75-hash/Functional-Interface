import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP006_FAMILIES, getCP006BreadthReport } from "./engine";

const plan: readonly [PunjabiDifficulty,number][]=[["Easy",40],["Medium",40],["Hard",40]];
const strides:Record<string,number>={F01:5,F02:7,F03:11,F04:5,F05:5,F06:13,F07:7,F08:29,F09:5};
const offsets:Record<PunjabiDifficulty,number>={Easy:0,Medium:3,Hard:0};
const breadth=getCP006BreadthReport();
const out:string[]=["# PUN-001 CP006 Review — ਕਿਰਿਆ, ਕਾਲ ਅਤੇ ਰੂਪਾਂਤਰਣ","","Status: HUMAN REVIEW PENDING","","Review selection is stratified across family capacity; direct identification distractors are sentence-grounded wherever the operation permits.",""];
const fingerprints=new Set<string>();
const f08Verdicts=new Set<string>();
const familyCounts=new Map<string,number>();

for(const [difficulty,count] of plan){
 out.push(`## ${difficulty}`,"");
 const eligible=CP006_FAMILIES.filter(f=>f.targetDifficulties.includes(difficulty));
 const used=new Map<string,number>();
 for(let i=0;i<count;i++){
  const family=eligible[i%eligible.length]!;
  const occurrence=used.get(family.familyId)??0;used.set(family.familyId,occurrence+1);
  const cap=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
  const stride=strides[family.familyId]!;
  const seed=1+(((occurrence+offsets[difficulty])*stride)%cap);
  const q=family.generate(seed,difficulty);
  if(fingerprints.has(q.metadata.fingerprint))throw new Error(`Duplicate review fingerprint ${q.metadata.fingerprint}`);
  fingerprints.add(q.metadata.fingerprint);familyCounts.set(family.familyId,(familyCounts.get(family.familyId)??0)+1);
  if(family.familyId==="F08")f08Verdicts.add(q.options[q.correctIndex]!);
  out.push(`### ${difficulty} ${i+1} — ${family.familyId}`,"",q.stem,"",...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`,"",`**Explanation:** ${q.explanation}`,"");
 }
}
if(fingerprints.size!==120)throw new Error(`Expected 120 unique review questions, got ${fingerprints.size}`);
if(f08Verdicts.size!==4)throw new Error(`F08 review must expose all four truth outcomes; got ${[...f08Verdicts].join(", ")}`);
for(const family of CP006_FAMILIES)if((familyCounts.get(family.familyId)??0)===0)throw new Error(`${family.familyId} missing from review pack`);
writeFileSync("PUN-001-CP006-REVIEW.md",out.join("\n"),"utf8");
console.log(`Wrote PUN-001-CP006-REVIEW.md with ${fingerprints.size} unique questions; all ${CP006_FAMILIES.length} families represented; ${f08Verdicts.size} F08 truth outcomes`);
