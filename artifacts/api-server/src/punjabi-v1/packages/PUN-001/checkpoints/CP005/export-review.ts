import { writeFileSync } from "node:fs";
import { CP005_FAMILIES } from "./generator";
import type { PunjabiDifficulty } from "../../../../core/types";

const plan: readonly [PunjabiDifficulty, number][] = [["Easy",40],["Medium",40],["Hard",40]];
let seed=1;
const out:string[]=["# PUN-001 CP005 Review — ਵਿਸ਼ੇਸ਼ਣ ਅਤੇ ਕਿਰਿਆ-ਵਿਸ਼ੇਸ਼ਣ","","Status: HUMAN REVIEW PENDING",""];
for (const [difficulty,count] of plan) {
  out.push(`## ${difficulty}`,"");
  const eligible=CP005_FAMILIES.filter((f)=>f.targetDifficulties.includes(difficulty));
  for (let i=0;i<count;i++) {
    const family=eligible[i%eligible.length]!;
    const q=family.generate(seed++,difficulty);
    out.push(`### ${difficulty} ${i+1} — ${family.familyId}`,"",q.stem,"",...q.options.map((o,j)=>`${String.fromCharCode(65+j)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`,"",`**Explanation:** ${q.explanation}`,"");
  }
}
writeFileSync("PUN-001-CP005-REVIEW.md",out.join("\n"),"utf8");
console.log("Wrote PUN-001-CP005-REVIEW.md with 120 questions");
