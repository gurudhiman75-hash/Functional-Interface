import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP009_FAMILIES } from "./engine";

const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",14],["F02",13],["F03",13]],
 Medium:[["F04",10],["F05",15],["F06",15]],
 Hard:[["F07",20],["F08",20]],
};
const strides:Record<string,number>={F01:29,F02:17,F03:31,F04:1,F05:37,F06:41,F07:997,F08:1999};
const out:string[]=[
 "# PUN-001 CP009 Retrofit Review — ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ","",
 "Status: HUMAN REVIEW PENDING","",
 "Authority inventory: 98 synonym headwords + 110 unambiguous antonym concepts + 10 authored contexts = 218 exhaustive authorities.","",
 "Validated synonym edges: 378. Deep synonym authorities used by set families: 86.","",
 "Easy tests direct synonym, direct antonym and relation recognition. Medium tests all authored contexts plus deep synonym discrimination. Hard combines independent synonym/antonym judgments.",""
];
const fingerprints=new Set<string>(),familyCounts=new Map<string,number>(),f08Outcomes=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");
 let number=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP009_FAMILIES.find(f=>f.familyId===familyId)!;
  for(let i=0;i<count;i++){
   number++;
   const seed=1+((i*strides[familyId]!)%family.semanticCapacity);
   const q=family.generate(seed,difficulty);
   if(fingerprints.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);
   fingerprints.add(q.metadata.fingerprint);
   familyCounts.set(familyId,(familyCounts.get(familyId)??0)+1);
   if(familyId==="F08")f08Outcomes.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+number+" — "+familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(fingerprints.size!==120)throw new Error("Expected 120 unique review questions, got "+fingerprints.size);
for(const family of CP009_FAMILIES)if((familyCounts.get(family.familyId)??0)===0)throw new Error(family.familyId+" missing from review pack");
if(f08Outcomes.size!==4)throw new Error("F08 review must expose all four truth outcomes");
writeFileSync("PUN-001-CP009-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP009-RETROFIT-REVIEW.md with "+fingerprints.size+" unique questions");
