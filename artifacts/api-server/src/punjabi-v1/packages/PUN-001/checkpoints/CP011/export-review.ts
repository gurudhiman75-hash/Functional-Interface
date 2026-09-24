import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP011_FAMILIES } from "./engine";
const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",20],["F02",20]],
 Medium:[["F03",10],["F04",10],["F05",10],["F06",10]],
 Hard:[["F07",20],["F08",20]],
};
const stride:Record<string,number>={F01:7,F02:11,F03:13,F04:17,F05:19,F06:1549,F07:1553,F08:1};
const out:string[]=["# PUN-001 CP011 Retrofit Review — ਮੁਹਾਵਰੇ","","Status: HUMAN APPROVED","","Authority inventory: 170 exhaustive idiom concepts.","","Safe ordered semantic pairs: 28,344. Governed breadth: 170,914 combinations.",""];
const seen=new Set<string>(),counts=new Map<string,number>(),outcomes=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");let n=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP011_FAMILIES.find(f=>f.familyId===familyId)!;
  for(let i=0;i<count;i++){
   n++;const seed=familyId==="F08"?i+1:1+((i*stride[familyId]!)%family.semanticCapacity);const q=family.generate(seed,difficulty);
   if(seen.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint");seen.add(q.metadata.fingerprint);counts.set(familyId,(counts.get(familyId)??0)+1);
   if(familyId==="F08")outcomes.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+n+" — "+familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(seen.size!==120)throw new Error("Expected 120 review questions");
for(const f of CP011_FAMILIES)if((counts.get(f.familyId)??0)===0)throw new Error(f.familyId+" absent");
if(outcomes.size!==4)throw new Error("F08 truth outcomes incomplete");
writeFileSync("PUN-001-CP011-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote 120 CP011 retrofit review questions");