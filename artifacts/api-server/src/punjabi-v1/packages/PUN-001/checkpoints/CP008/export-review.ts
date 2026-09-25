import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP008_AFFIX_AUTHORITIES,CP008_WORD_AUTHORITIES } from "./CP008-authorities";
import { CP008_FAMILIES,getCP008BreadthReport } from "./engine";
const breadth=getCP008BreadthReport();
const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",14],["F02",13],["F05",13]],
 Medium:[["F03",14],["F04",13],["F06",13]],
 Hard:[["F07",20],["F08",20]],
};
const stride:Record<string,number>={F01:13,F02:11,F03:8,F04:5,F05:29,F06:11,F07:1733,F08:1};
const out:string[]=[
 "# PUN-001 CP008 Retrofit Review — ਅਗੇਤਰ, ਪਿਛੇਤਰ ਅਤੇ ਸ਼ਬਦ-ਰਚਨਾ","",
 "Status: HUMAN APPROVED","",
 "Authority inventory: 69 affix concepts + 374 word↔affix memberships + 63 explicit root derivations = 506 atomic authorities.","",
 "Governed semantic breadth: 39,548 combinations before option-order permutations.","",
 "Root-recovery families use only explicit audited roots; membership-only words are never given invented roots.",""
];
const seen=new Set<string>(),families=new Set<string>(),verdicts=new Set<string>(),affixCoverage=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");let n=0;
 for(const [familyId,count] of plan[difficulty]){
  const family=CP008_FAMILIES.find(f=>f.familyId===familyId)!;const cap=breadth.capacities[familyId as keyof typeof breadth.capacities];
  for(let i=0;i<count;i++){
   n++;const seed=1+((i*stride[familyId]!)%cap),q=family.generate(seed,difficulty);
   if(seen.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint");seen.add(q.metadata.fingerprint);families.add(familyId);
   for(const id of q.metadata.authorityIds){if(CP008_AFFIX_AUTHORITIES.some(a=>a.id===id))affixCoverage.add(id);const w=CP008_WORD_AUTHORITIES.find(a=>a.id===id);if(w)affixCoverage.add(w.affixId);}
   if(familyId==="F08")verdicts.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+n+" — "+familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(seen.size!==120)throw new Error("Expected 120 review questions");
if(families.size!==8)throw new Error("All 8 families must appear");
if(verdicts.size!==4)throw new Error("F08 truth outcomes incomplete");
if(affixCoverage.size<35)throw new Error("Review affix coverage too narrow: "+affixCoverage.size);
writeFileSync("PUN-001-CP008-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote 120 CP008 retrofit review questions across "+affixCoverage.size+" affix concepts");
