import { writeFileSync } from "node:fs";
import { CP005_FAMILIES, getCP005BreadthReport } from "./generator";
import type { PunjabiDifficulty } from "../../../../core/types";

const plan: readonly [PunjabiDifficulty, number][] = [["Easy",40],["Medium",40],["Hard",40]];
const strides: Record<string,number> = { F01:7, F02:11, F03:13, F04:7, F05:9, F06:37, F07:43, F08:113 };
const offsets: Record<PunjabiDifficulty,number> = { Easy:0, Medium:7, Hard:13 };
const breadth=getCP005BreadthReport();
const out:string[]=["# PUN-001 CP005 Review — ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ","","Status: HUMAN REVIEW PENDING","","Review selection is stratified across family capacity; consecutive seed clustering is intentionally avoided.",""];
const fingerprints=new Set<string>();
const hardVerdicts=new Set<string>();

for (const [difficulty,count] of plan) {
  out.push(`## ${difficulty}`,"");
  const eligible=CP005_FAMILIES.filter((f)=>f.targetDifficulties.includes(difficulty));
  const familyUse=new Map<string,number>();
  for (let i=0;i<count;i++) {
    const family=eligible[i%eligible.length]!;
    const occurrence=familyUse.get(family.familyId)??0;
    familyUse.set(family.familyId,occurrence+1);
    const capacity=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
    const stride=strides[family.familyId]!;
    const seed=1+(((occurrence+offsets[difficulty])*stride)%capacity);
    const q=family.generate(seed,difficulty);
    if (fingerprints.has(q.metadata.fingerprint)) throw new Error(`Duplicate review fingerprint ${q.metadata.fingerprint}`);
    fingerprints.add(q.metadata.fingerprint);
    if (family.familyId==="F08") hardVerdicts.add(q.options[q.correctIndex]!);
    out.push(`### ${difficulty} ${i+1} — ${family.familyId}`,"",q.stem,"",...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`,"",`**Explanation:** ${q.explanation}`,"");
  }
}

if (fingerprints.size!==120) throw new Error(`Expected 120 unique review questions, got ${fingerprints.size}`);
if (hardVerdicts.size!==4) throw new Error(`F08 review must expose all four truth outcomes; got ${[...hardVerdicts].join(", ")}`);
writeFileSync("PUN-001-CP005-REVIEW.md",out.join("\n"),"utf8");
console.log(`Wrote PUN-001-CP005-REVIEW.md with ${fingerprints.size} unique questions and ${hardVerdicts.size} F08 truth outcomes`);
