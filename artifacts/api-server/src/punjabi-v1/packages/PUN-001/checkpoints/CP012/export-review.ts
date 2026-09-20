import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP012_FAMILIES } from "./engine";

const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",14],["F02",13],["F03",13]],
 Medium:[["F04",14],["F05",13],["F06",13]],
 Hard:[["F07",20],["F08",20]],
};
const strides:Record<string,number>={F01:3,F02:5,F03:7,F04:9,F05:11,F06:13,F07:23,F08:29};
const out:string[]=[
 "# PUN-001 CP012 Review — ਅਖਾਣ / ਕਹਾਵਤਾਂ",
 "",
 "Status: HUMAN REVIEW PENDING",
 "",
 "The review is stratified across all eight audited families. Easy questions test meaning and forward completion; Medium uses reverse completion, authored situations and mapping; Hard requires two independent proverb judgments.",
 ""
];
const fingerprints=new Set<string>();
const familyCounts=new Map<string,number>();
const f08Verdicts=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push(`## ${difficulty}`,"");
 let number=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP012_FAMILIES.find(f=>f.familyId===familyId)!;
  for(let i=0;i<count;i++){
   number++;
   const seed=1+((i*strides[familyId]!)%family.semanticCapacity);
   const q=family.generate(seed,difficulty);
   if(fingerprints.has(q.metadata.fingerprint))throw new Error(`Duplicate review fingerprint ${q.metadata.fingerprint}`);
   fingerprints.add(q.metadata.fingerprint);
   familyCounts.set(familyId,(familyCounts.get(familyId)??0)+1);
   if(familyId==="F08")f08Verdicts.add(q.options[q.correctIndex]!);
   out.push(`### ${difficulty} ${number} — ${familyId}`,"",q.stem,"",...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`,"",`**Explanation:** ${q.explanation}`,"");
  }
 }
}
if(fingerprints.size!==120)throw new Error(`Expected 120 unique review questions, got ${fingerprints.size}`);
for(const family of CP012_FAMILIES)if((familyCounts.get(family.familyId)??0)===0)throw new Error(`${family.familyId} missing from review pack`);
if(f08Verdicts.size!==4)throw new Error(`F08 review must expose all four truth outcomes; got ${[...f08Verdicts].join(", ")}`);
writeFileSync("PUN-001-CP012-REVIEW.md",out.join("\n"),"utf8");
console.log(`Wrote PUN-001-CP012-REVIEW.md with ${fingerprints.size} unique questions; all ${CP012_FAMILIES.length} families represented; ${f08Verdicts.size} F08 truth outcomes`);
