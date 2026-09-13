import { writeFileSync } from "node:fs";
import { STAT003_CONTRACTS, generateStat003Question } from "./frequency-central-tendency";
const lines:string[]=["# STAT-003 — Frequency Distribution & Central Tendency — English Review Pack","","Status: **PHASE-0 HUMAN REVIEW REQUIRED**","","This pack is generated from the actual STAT-003 runtime. It is not Question Bank/test/mock/public content.",""];
for(const [ci,contractId] of STAT003_CONTRACTS.entries()){
  lines.push(`## ${contractId}`,"");
  for(let i=1;i<=4;i++){
    const q=generateStat003Question({seed:`STAT-003-REVIEW-${ci+1}-${i}`,examProfile:"SSC_CGL_TIER_II",contractId});
    lines.push(`### Question ${ci*4+i} — ${q.difficulty}`,"",q.stem,"",...q.options.map((o,index)=>`${String.fromCharCode(65+index)}. ${o}`),"",`**Answer:** ${String.fromCharCode(65+q.correctIndex)}. ${q.answer}`,"",`**Explanation — key idea:** ${q.explanation.keyIdea}`,"",...q.explanation.steps.map((s,index)=>`${index+1}. ${s}`),"",`_Contract: ${q.contractId}; solve mode: ${q.solveMode}_`,"","---","");
  }
}
writeFileSync(process.argv[2]??"STAT-003-REVIEW.md",lines.join("\n"));
