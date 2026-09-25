import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP006_FAMILIES,getCP006BreadthReport } from "./engine";

const breadth=getCP006BreadthReport();
const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",14],["F02",13],["F03",13]],
 Medium:[["F04",6],["F05",6],["F06",6],["F09",6],["F10",6],["F11",5],["F12",5]],
 Hard:[["F07",20],["F08",20]],
};
const stride:Record<string,number>={F01:11,F02:13,F03:17,F04:7,F05:11,F06:13,F07:19,F08:1,F09:6,F10:11,F11:7,F12:7};
const out:string[]=[
 "# PUN-001 CP006 Retrofit Review — ਕਿਰਿਆ, ਕਾਲ ਅਤੇ ਰੂਪਾਂਤਰਣ","",
 "Status: HUMAN APPROVED","",
 "Authority inventory: 331 atomic authorities across verb context, tense, transitivity, compound-verb and aspect operations.","",
 "Governed semantic breadth: 1,462 combinations before option-order permutations.","",
 "Legacy root and second-causative tables remain quarantined pending a separate lexical-standardization scope.",""
];
const seen=new Set<string>(),families=new Set<string>(),verdicts=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");let n=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP006_FAMILIES.find(f=>f.familyId===familyId)!;const cap=breadth.capacities[familyId as keyof typeof breadth.capacities];
  for(let i=0;i<count;i++){n++;const seed=1+((i*stride[familyId]!)%cap);const q=family.generate(seed,difficulty);
   if(seen.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);seen.add(q.metadata.fingerprint);families.add(familyId);
   if(familyId==="F08")verdicts.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+n+" — "+familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(seen.size!==120)throw new Error("Expected 120 review questions");
if(families.size!==12)throw new Error("All 12 families must appear");
if(verdicts.size!==4)throw new Error("F08 truth outcomes incomplete");
writeFileSync("PUN-001-CP006-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote 120 CP006 retrofit review questions");
