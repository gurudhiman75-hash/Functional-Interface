import { writeFileSync } from "node:fs";
import type { PunjabiDifficulty } from "../../../../core/types";
import { CP007_FAMILIES } from "./engine";

const plan:Record<PunjabiDifficulty,readonly [string,number][]>= {
 Easy:[["F01",14],["F02",14],["F05",12]],
 Medium:[["F03",12],["F04",8],["F06",10],["F07",10]],
 Hard:[["F08",20],["F09",20]],
};
const strides:Record<string,number>={F01:5,F02:7,F03:5,F04:2,F05:5,F06:7,F07:5,F08:17,F09:29};
const out:string[]=["# PUN-001 CP007 Review — ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ ਅਤੇ ਵਿਸਮਿਕ","","Status: HUMAN REVIEW PENDING","","Review selection is stratified across all nine audited families. Sentence-grounded choices are used wherever the operation allows them, and hard questions combine more than one authority.",""];
const fingerprints=new Set<string>();const familyCounts=new Map<string,number>();const f09Verdicts=new Set<string>();
for(const difficulty of ["Easy","Medium","Hard"] as PunjabiDifficulty[]){out.push(`## ${difficulty}`,"");let number=0;for(const [familyId,count] of plan[difficulty]){const family=CP007_FAMILIES.find(f=>f.familyId===familyId)!;for(let i=0;i<count;i++){number++;const cap=family.semanticCapacity,seed=1+((i*strides[familyId]!)%cap),q=family.generate(seed,difficulty);if(fingerprints.has(q.metadata.fingerprint))throw new Error(`Duplicate review fingerprint ${q.metadata.fingerprint}`);fingerprints.add(q.metadata.fingerprint);familyCounts.set(familyId,(familyCounts.get(familyId)??0)+1);if(familyId==="F09")f09Verdicts.add(q.options[q.correctIndex]!);out.push(`### ${difficulty} ${number} — ${familyId}`,"",q.stem,"",...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`,"",`**Explanation:** ${q.explanation}`,"");}}}
if(fingerprints.size!==120)throw new Error(`Expected 120 unique review questions, got ${fingerprints.size}`);for(const family of CP007_FAMILIES)if((familyCounts.get(family.familyId)??0)===0)throw new Error(`${family.familyId} missing from review pack`);if(f09Verdicts.size!==4)throw new Error(`F09 review must expose all four truth outcomes; got ${[...f09Verdicts].join(", ")}`);
writeFileSync("PUN-001-CP007-REVIEW.md",out.join("\n"),"utf8");console.log(`Wrote PUN-001-CP007-REVIEW.md with ${fingerprints.size} unique questions; all ${CP007_FAMILIES.length} families represented; ${f09Verdicts.size} F09 truth outcomes`);
