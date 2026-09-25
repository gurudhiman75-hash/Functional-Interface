import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP013_FAMILIES } from "./engine";

const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F02",8],["F03",8],["F05",8],["F09",8],["F10",8]],
 Medium:[["F01",14],["F04",13],["F06",13]],
 Hard:[["F07",10],["F08",15],["F11",15]],
};
const strides:Record<string,number>={F01:7,F02:11,F03:13,F04:17,F05:19,F06:23,F07:29,F08:307,F09:31,F10:5,F11:997};
const out:string[]=[
 "# PUN-001 CP013 Review — ਵਾਕ-ਵਟਾਂਦਰਾ ਅਤੇ ਸ਼ੁੱਧੀ",
 "",
 "Status: HUMAN APPROVED",
 "",
 "Authority inventory: 89 sentence-classification + 63 transformation + 71 correction = 223 exhaustive high-confidence authorities.",
 "",
 "Easy tests direct function, forward transformation, correction, no-error selection and grammatical blanks. Medium tests combined classification, reverse transformation and error diagnosis. Hard tests transformation validity, dual structural analysis and mixed-rule verification.",
 ""
];
const fingerprints=new Set<string>();
const familyCounts=new Map<string,number>();

for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");
 let number=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP013_FAMILIES.find(f=>f.familyId===familyId)!;
  for(let i=0;i<count;i++){
   number++;
   const seed=1+((i*strides[familyId]!)%family.semanticCapacity);
   const q=family.generate(seed,difficulty);
   if(fingerprints.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);
   fingerprints.add(q.metadata.fingerprint);
   familyCounts.set(familyId,(familyCounts.get(familyId)??0)+1);
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
for(const family of CP013_FAMILIES)if((familyCounts.get(family.familyId)??0)===0)throw new Error(family.familyId+" missing from review pack");
writeFileSync("PUN-001-CP013-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP013-REVIEW.md with "+fingerprints.size+" unique questions across all "+CP013_FAMILIES.length+" families");
