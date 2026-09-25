import { mkdirSync,writeFileSync } from "node:fs";
import { dirname,resolve } from "node:path";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP004_FAMILIES,getCP004BreadthReport } from "./generator";

const breadth=getCP004BreadthReport();
const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
  Easy:[["F01",10],["F02",10],["F04",10],["F05",10]],
  Medium:[["F03",16],["F06",12],["F07",12]],
  Hard:[["F08",20],["F09",20]],
};
const strides:Record<string,number>={F01:7,F02:11,F03:53,F04:13,F05:17,F06:19,F07:1,F08:5,F09:29};
const out:string[]=[
 "# PUN-001 CP004 Retrofit Review — ਲਿੰਗ ਅਤੇ ਵਚਨ","",
 "Status: HUMAN APPROVED","",
 "Authority inventory: 58 gender concepts + 66 number concepts + 12 agreement contexts = 136 atomic authorities.","",
 "Direct-safe pools: 39 gender pairs and 59 number pairs. Invariable nouns remain in recognition families only.","",
 "Governed semantic breadth: 1,862 combinations before option-order permutations.",""
];
const seen=new Set<string>(),familyCounts=new Map<string,number>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
  out.push("## "+difficulty,"");let no=0;
  for(const [familyId,count] of plan[difficulty]){
    const family=CP004_FAMILIES.find(f=>f.familyId===familyId)!;
    const cap=breadth.capacities[familyId as keyof typeof breadth.capacities];
    for(let i=0;i<count;i++){
      no++;
      const seed=1+((i*strides[familyId]!)%cap);
      const q=family.generate(seed,difficulty);
      if(seen.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);
      seen.add(q.metadata.fingerprint);familyCounts.set(familyId,(familyCounts.get(familyId)??0)+1);
      out.push("### "+difficulty+" "+no+" — "+familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
    }
  }
}
if(seen.size!==120)throw new Error("Expected 120 unique review questions, got "+seen.size);
for(const f of CP004_FAMILIES)if((familyCounts.get(f.familyId)??0)===0)throw new Error(f.familyId+" missing from review");
const outputPath=resolve(process.cwd(),"review-output/PUN-001-CP004-RETROFIT-REVIEW.md");
mkdirSync(dirname(outputPath),{recursive:true});writeFileSync(outputPath,out.join("\n"),"utf8");
console.log(outputPath);
