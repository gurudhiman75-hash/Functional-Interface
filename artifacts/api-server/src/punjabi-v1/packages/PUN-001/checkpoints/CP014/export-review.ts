import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP014_FAMILIES } from "./engine";
import { CP014_ALL_PASSAGES } from "./CP014-passages";

const plan:Record<PunjabiDifficulty,readonly [string,number][]>={
 Easy:[["F01",12],["F04",12],["F11",16]],
 Medium:[["F02",8],["F03",8],["F05",4],["F06",4],["F09",8],["F10",4],["F12",4]],
 Hard:[["F07",16],["F08",8],["F13",16]],
};
const strides:Record<string,number>={F01:1,F02:3,F03:5,F04:17,F05:19,F06:23,F07:13,F08:29,F09:7,F10:11,F11:5,F12:7,F13:13};
const out:string[]=[
 "# PUN-001 CP014 Review — ਪਾਠ-ਬੋਧ ਅਤੇ ਨਿਯੰਤਰਿਤ ਅਨੁਵਾਦ",
 "",
 "Status: HUMAN APPROVED",
 "",
 "Authority inventory: 190 passage questions + 215 administrative terms + 30 contextual vocabulary + 30 supported-statement + 36 controlled sentence translations = 501 atomic authorities.",
 "",
 "Easy tests factual retrieval, administrative terminology and direct English-to-Punjabi sentence translation. Medium tests inference, title/summary, vocabulary in context, passage support, reverse controlled translation and terminology. Hard tests dual passage resolution, terminology verification and meaning-changing translation errors.",
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

out.push("## Complete passage authority appendix","");
for(const passage of CP014_ALL_PASSAGES){
 out.push("### "+passage.id+" — "+passage.title,"",passage.textPa,"");
 for(const q of passage.questions){
  out.push(
   "#### "+q.qId+" — "+q.type,"",
   q.questionStem,"",
   "A. "+q.correctAnswer,
   ...q.distractors.map((d,i)=>String.fromCharCode(66+i)+". "+d),"",
   "**Answer:** A. "+q.correctAnswer,"",
   "**Explanation:** "+q.explanationPa,""
  );
 }
}
writeFileSync("PUN-001-CP014-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP014-REVIEW.md with "+fingerprints.size+" generated questions plus complete "+CP014_ALL_PASSAGES.length+"-passage appendix");
