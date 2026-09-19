import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP005_ADJECTIVES,CP005_ADVERBS } from "./CP005-authorities";
import { CP005_FAMILIES,getCP005BreadthReport } from "./generator";

const breadth=getCP005BreadthReport();
const typeSeeds=(kind:"adj"|"adv")=>{
 const items=kind==="adj"?CP005_ADJECTIVES:CP005_ADVERBS;
 const seen=new Set<string>(),seeds:number[]=[];
 items.forEach((a,i)=>{if(!seen.has(a.type)){seen.add(a.type);seeds.push(i+1);}});
 return seeds;
};
function fillSeeds(base:number[],count:number,cap:number,stride:number){
 const out=[...base];
 for(let i=0;out.length<count;i++){const s=1+((i*stride)%cap);if(!out.includes(s))out.push(s);}
 return out.slice(0,count);
}
const specs:{difficulty:PunjabiDifficulty;familyId:string;seeds:number[]}[]=[
 {difficulty:"Easy",familyId:"F01",seeds:fillSeeds(typeSeeds("adj"),14,breadth.capacities.F01,17)},
 {difficulty:"Easy",familyId:"F02",seeds:fillSeeds(typeSeeds("adj"),13,breadth.capacities.F02,19)},
 {difficulty:"Easy",familyId:"F04",seeds:fillSeeds(typeSeeds("adv"),13,breadth.capacities.F04,13)},
 {difficulty:"Medium",familyId:"F03",seeds:fillSeeds(typeSeeds("adj"),13,breadth.capacities.F03,23)},
 {difficulty:"Medium",familyId:"F05",seeds:fillSeeds(typeSeeds("adv"),13,breadth.capacities.F05,17)},
 {difficulty:"Medium",familyId:"F06",seeds:fillSeeds([],14,breadth.capacities.F06,997)},
 {difficulty:"Hard",familyId:"F07",seeds:fillSeeds([],20,breadth.capacities.F07,1009)},
 {difficulty:"Hard",familyId:"F08",seeds:Array.from({length:20},(_,i)=>i+1)},
];
const out:string[]=[
 "# PUN-001 CP005 Retrofit Review — ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ","",
 "Status: HUMAN REVIEW PENDING","",
 "Authority inventory: 151 adjective + 111 adverb sentence authorities = 262 atomic authorities.","",
 "Adverb taxonomy: time, place, manner, repetition/frequency and degree. Noisy legacy conjunction/particle/response buckets remain quarantined.","",
 "Governed semantic breadth: 101,241 combinations before option-order permutations.",""
];
const seen=new Set<string>(),adjTypes=new Set<string>(),advTypes=new Set<string>(),outcomes=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");let n=0;
 for(const spec of specs.filter(x=>x.difficulty===difficulty)){
  const family=CP005_FAMILIES.find(f=>f.familyId===spec.familyId)!;
  for(const seed of spec.seeds){
   n++;const q=family.generate(seed,difficulty);
   if(seen.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);seen.add(q.metadata.fingerprint);
   for(const id of q.metadata.authorityIds){
    const a=CP005_ADJECTIVES.find(x=>x.id===id);if(a)adjTypes.add(a.type);
    const v=CP005_ADVERBS.find(x=>x.id===id);if(v)advTypes.add(v.type);
   }
   if(spec.familyId==="F08")outcomes.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+n+" — "+spec.familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(seen.size!==120)throw new Error("Expected 120 review questions, got "+seen.size);
if(adjTypes.size!==5)throw new Error("Review must cover all five adjective types");
if(advTypes.size!==5)throw new Error("Review must cover all five adverb types");
if(outcomes.size!==4)throw new Error("F08 review must cover all four truth outcomes");
writeFileSync("PUN-001-CP005-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP005-RETROFIT-REVIEW.md with 120 unique questions");
