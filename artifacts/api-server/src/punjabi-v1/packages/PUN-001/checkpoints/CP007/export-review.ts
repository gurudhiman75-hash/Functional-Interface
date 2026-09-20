import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP007_KARAK_AUTHORITIES,CP007_SAMBANDHAK_AUTHORITIES,CP007_VISMIK_AUTHORITIES,CP007_YOJAK_AUTHORITIES } from "./CP007-authorities";
import { CP007_FAMILIES,getCP007BreadthReport } from "./engine";

const breadth=getCP007BreadthReport();
function seedByKinds(items:readonly {kind:string}[]){const seen=new Set<string>(),out:number[]=[];items.forEach((x,i)=>{if(!seen.has(x.kind)){seen.add(x.kind);out.push(i+1);}});return out;}
function seedByContexts(items:readonly {context:string}[]){const seen=new Set<string>(),out:number[]=[];items.forEach((x,i)=>{if(!seen.has(x.context)){seen.add(x.context);out.push(i+1);}});return out;}
function fill(base:number[],count:number,cap:number,stride:number){const out=[...base];for(let i=0;out.length<count;i++){const s=1+((i*stride)%cap);if(!out.includes(s))out.push(s);}return out.slice(0,count);}
const specs:{difficulty:PunjabiDifficulty;familyId:string;seeds:number[]}[]=[
 {difficulty:"Easy",familyId:"F01",seeds:fill(seedByKinds(CP007_KARAK_AUTHORITIES),14,breadth.capacities.F01,11)},
 {difficulty:"Easy",familyId:"F02",seeds:fill(seedByKinds(CP007_KARAK_AUTHORITIES),13,breadth.capacities.F02,13)},
 {difficulty:"Easy",familyId:"F05",seeds:fill(seedByKinds(CP007_YOJAK_AUTHORITIES),13,breadth.capacities.F05,5)},
 {difficulty:"Medium",familyId:"F03",seeds:fill(seedByKinds(CP007_KARAK_AUTHORITIES),10,breadth.capacities.F03,17)},
 {difficulty:"Medium",familyId:"F04",seeds:Array.from({length:9},(_,i)=>i+1)},
 {difficulty:"Medium",familyId:"F06",seeds:fill(seedByKinds(CP007_YOJAK_AUTHORITIES),9,breadth.capacities.F06,7)},
 {difficulty:"Medium",familyId:"F07",seeds:fill(seedByContexts(CP007_VISMIK_AUTHORITIES),12,breadth.capacities.F07,5)},
 {difficulty:"Hard",familyId:"F08",seeds:fill([],20,breadth.capacities.F08,109)},
 {difficulty:"Hard",familyId:"F09",seeds:Array.from({length:20},(_,i)=>i+1)}
];
const out:string[]=[
 "# PUN-001 CP007 Retrofit Review — ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ ਅਤੇ ਵਿਸਮਿਕ","",
 "Status: HUMAN REVIEW PENDING","",
 "Authority inventory: 95 ਕਾਰਕ + 9 ਸੰਬੰਧਕ + 23 ਯੋਜਕ + 37 contextual ਵਿਸਮਿਕ = 164 atomic authorities.","",
 "The approved three-way ਸੰਬੰਧਕ taxonomy remains deliberately narrow; donor records using other classification dimensions are not mixed into it.","",
 "Governed semantic breadth: 3,390 combinations before option-order permutations.",""
];
const seen=new Set<string>(),families=new Set<string>(),verdicts=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){
 out.push("## "+difficulty,"");let n=0;
 for(const spec of specs.filter(x=>x.difficulty===difficulty)){
  const family=CP007_FAMILIES.find(f=>f.familyId===spec.familyId)!;
  for(const seed of spec.seeds){n++;const q=family.generate(seed,difficulty);if(seen.has(q.metadata.fingerprint))throw new Error("Duplicate review fingerprint "+q.metadata.fingerprint);seen.add(q.metadata.fingerprint);families.add(spec.familyId);if(spec.familyId==="F09")verdicts.add(q.options[q.correctIndex]!);
   out.push("### "+difficulty+" "+n+" — "+spec.familyId,"",q.stem,"",...q.options.map((o,j)=>String.fromCharCode(65+j)+". "+o),"","**Answer:** "+String.fromCharCode(65+q.correctIndex)+". "+q.options[q.correctIndex],"","**Explanation:** "+q.explanation,"");
  }
 }
}
if(seen.size!==120)throw new Error("Expected 120 review questions, got "+seen.size);
if(families.size!==9)throw new Error("All 9 families must appear");
if(verdicts.size!==4)throw new Error("F09 must show all four truth outcomes");
writeFileSync("PUN-001-CP007-RETROFIT-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote 120 CP007 retrofit review questions");
