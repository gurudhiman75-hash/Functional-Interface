import fs from "node:fs";
import path from "node:path";
import { MEN_CP_010_DISCOVERY_V2_CANDIDATES, auditMenCp010DiscoveryV2, generateMenCp010DiscoveryV2Probe } from "./discovery-v2";
const audit = auditMenCp010DiscoveryV2();
const review = [] as ReturnType<typeof generateMenCp010DiscoveryV2Probe>[];
const usedReviewStems = new Set<string>();
for (const candidate of MEN_CP_010_DISCOVERY_V2_CANDIDATES.filter((row) => row.executable)) {
  for (let position=0; position<4; position+=1) {
    let selected: ReturnType<typeof generateMenCp010DiscoveryV2Probe> | null = null;
    for (let n=0; n<500; n+=1) {
      const q=generateMenCp010DiscoveryV2Probe(candidate.id,`review:${position}:${String(n).padStart(3,"0")}`);
      const key=`${candidate.id}::${q.stem}`;
      if(q.correctIndex===position && !usedReviewStems.has(key)) { selected=q; usedReviewStems.add(key); break; }
    }
    if(!selected) throw new Error(`Could not build unique balanced review for ${candidate.id}/${position}`);
    review.push(selected);
  }
}
if(review.some((q)=>q.options.some((o)=>o.value.includes("×")))) throw new Error("Generic multiplicative fallback option leaked into review.");
const out=path.resolve(process.cwd(),"dist/quant-v4"); fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,"men-cp010-discovery-wave02.json"),JSON.stringify({audit,review},null,2));
const lines=["# MEN-CP-010 Discovery Wave 02 Review","",`- Candidate rows: ${audit.candidateCount}`,`- Executable candidates: ${audit.executableCandidateCount}`,`- Provisional retained clusters: ${audit.provisionalRetainedClusterCount}`,`- Permanent QLs: ${audit.permanentQlCount}`,"",...review.flatMap((q,i)=>[`## ${i+1}. ${q.candidateId}`,"",q.stem,"",...q.options.map(o=>`- ${o.label}. ${o.value}${o.isCorrect?" **✓**":""}`),"",`**Answer:** ${q.answer}`,`**Verification:** ${q.verification.method}`,""])];
fs.writeFileSync(path.join(out,"men-cp010-discovery-wave02.md"),lines.join("\n"));
console.log(JSON.stringify({audit,reviewRecords:review.length,correctPositions:{A:review.filter(q=>q.correctIndex===0).length,B:review.filter(q=>q.correctIndex===1).length,C:review.filter(q=>q.correctIndex===2).length,D:review.filter(q=>q.correctIndex===3).length}},null,2));
