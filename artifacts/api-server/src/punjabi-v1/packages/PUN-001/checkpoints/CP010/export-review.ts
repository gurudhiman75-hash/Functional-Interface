import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP010_AUTHORITIES,CP010_DOMAINS,cp010ItemsInDomain } from "./CP010-authorities";
import { CP010_FAMILIES } from "./engine";

const domainFirstSeeds=CP010_DOMAINS.map(domain=>CP010_AUTHORITIES.findIndex(a=>a.domain===domain)+1);
const directSeeds=[...domainFirstSeeds];
for(let i=0;directSeeds.length<20;i++){
 const seed=1+((i*17)%CP010_AUTHORITIES.length);
 if(!directSeeds.includes(seed))directSeeds.push(seed);
}

const orderedPairs:{firstId:string;secondId:string;domain:string}[]=[];
for(const domain of CP010_DOMAINS){
 const items=cp010ItemsInDomain(domain);
 for(const first of items)for(const second of items)if(first.id!==second.id)orderedPairs.push({firstId:first.id,secondId:second.id,domain});
}
const pairSeeds:number[]=[];
for(const domain of CP010_DOMAINS){
 const idx=orderedPairs.findIndex(p=>p.domain===domain);
 pairSeeds.push(idx+1);
 const idx2=orderedPairs.findIndex((p,j)=>j>idx&&p.domain===domain);
 pairSeeds.push(idx2+1);
}

const specs:{difficulty:PunjabiDifficulty;familyId:string;seeds:number[]}[]=[
 {difficulty:"Easy",familyId:"F01",seeds:directSeeds},
 {difficulty:"Easy",familyId:"F02",seeds:directSeeds},
 {difficulty:"Medium",familyId:"F03",seeds:domainFirstSeeds},
 {difficulty:"Medium",familyId:"F04",seeds:domainFirstSeeds},
 {difficulty:"Medium",familyId:"F05",seeds:pairSeeds.slice(0,10)},
 {difficulty:"Medium",familyId:"F06",seeds:domainFirstSeeds},
 {difficulty:"Hard",familyId:"F07",seeds:pairSeeds.slice(0,20)},
 {difficulty:"Hard",familyId:"F08",seeds:pairSeeds.slice(0,20).map((s,i)=>(s-1)*4+(i%4)+1)},
];

const desired:Record<string,number>={F01:20,F02:20,F03:10,F04:10,F05:10,F06:10,F07:20,F08:20};
const out:string[]=[
 "# PUN-001 CP010 Retrofit Review — ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ","",
 "Status: HUMAN REVIEW PENDING","",
 "Authority inventory: 177 exhaustive one-word substitution concepts across 10 organic semantic domains.","",
 "Governed breadth: 25,293 semantic combinations before option-order permutations.","",
 "The review intentionally covers all 10 domains and all 8 operation families.",""
];
const fingerprints=new Set<string>(),domainCoverage=new Set<string>(),f08Outcomes=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");
 let number=0;
 for(const spec of specs.filter(s=>s.difficulty===difficulty)){
  const family=CP010_FAMILIES.find(f=>f.familyId===spec.familyId)!;
  const seeds=spec.seeds.slice(0,desired[spec.familyId]);
  for(const seed of seeds){
   number++;
   const q=family.generate(seed,difficulty);
   if(fingerprints.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);
   fingerprints.add(q.metadata.fingerprint);
   const primary=CP010_AUTHORITIES.find(a=>a.id===q.metadata.authorityIds[0]);
   if(primary)domainCoverage.add(primary.domain);
   if(spec.familyId==="F08")f08Outcomes.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+number+" — "+spec.familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(fingerprints.size!==120)throw new Error("Expected 120 unique review questions, got "+fingerprints.size);
if(domainCoverage.size!==CP010_DOMAINS.length)throw new Error("Review must cover all 10 domains; got "+domainCoverage.size);
if(f08Outcomes.size!==4)throw new Error("F08 review must expose all four truth outcomes");
writeFileSync("PUN-001-CP010-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP010-RETROFIT-REVIEW.md with "+fingerprints.size+" unique questions across "+domainCoverage.size+" domains");
