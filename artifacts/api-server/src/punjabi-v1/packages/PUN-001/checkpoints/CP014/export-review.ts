import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP014_FAMILIES } from "./engine";

const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",15],["F04",25]],
 Medium:[["F02",10],["F03",10],["F05",10],["F06",10]],
 Hard:[["F07",20],["F08",20]],
};
const strides:Record<string,number>={F01:1,F02:3,F03:5,F04:17,F05:19,F06:23,F07:13,F08:29};
const out:string[]=[
 "# PUN-001 CP014 Review — ਪਾਠ-ਬੋਧ ਅਤੇ ਪ੍ਰਬੰਧਕੀ ਅਨੁਵਾਦ",
 "",
 "Status: HUMAN REVIEW PENDING",
 "",
 "Authority inventory: 42 passage-question authorities + 215 distinct administrative terminology concepts = 257 atomic authorities.",
 "",
 "Easy tests factual retrieval and English-to-Punjabi terminology. Medium tests inference, title/summary, Punjabi-to-English terminology and mapping. Hard tests two-question passage resolution and two-statement terminology verification.",
 ""
];
const fingerprints=new Set<string>(),familyCounts=new Map<string,number>(),f08Outcomes=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");
 let number=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP014_FAMILIES.find(f=>f.familyId===familyId)!;
  for(let i=0;i<count;i++){
   number++;
   const seed=1+((i*strides[familyId]!)%family.semanticCapacity);
   const q=family.generate(seed,difficulty);
   if(fingerprints.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);
   fingerprints.add(q.metadata.fingerprint);
   familyCounts.set(familyId,(familyCounts.get(familyId)??0)+1);
   if(familyId==="F08")f08Outcomes.add(q.options[q.correctIndex]!);
   out.push(
    "### "+difficulty+" "+number+" — "+familyId,"",
    q.stem,"",
    ...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"",
    "**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"",
    "**Explanation:** "+q.explanation,""
   );
  }
 }
}
if(fingerprints.size!==120)throw new Error("Expected 120 unique review questions, got "+fingerprints.size);
for(const family of CP014_FAMILIES)if((familyCounts.get(family.familyId)??0)===0)throw new Error(family.familyId+" missing from review pack");
if(f08Outcomes.size!==4)throw new Error("F08 review must expose all four truth outcomes");
writeFileSync("PUN-001-CP014-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP014-REVIEW.md with "+fingerprints.size+" unique questions across all "+CP014_FAMILIES.length+" families");
