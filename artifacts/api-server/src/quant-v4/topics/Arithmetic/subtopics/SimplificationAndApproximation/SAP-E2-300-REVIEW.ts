import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 } from "./SAP-002/SAP-CP-011/runtime-final";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 } from "./SAP-002/SAP-CP-012/runtime-release";
import type { SapE2Package } from "./SAP-E2-TYPES";

interface Family { readonly id: string; readonly target: number; readonly salt: number; readonly generate: (seed: number) => SapE2Package; }
const cp011Targets = [20,12,12,20,3,3,5,5,2,4,2,2] as const;
const cp012Targets = [20,20,18,30,25,20,15,38,8,4,4,8] as const;
const cp011: Family[] = SAP_CP011_E2_STRUCTURES.map((id,i) => ({ id, target: cp011Targets[i]!, salt: i + 3, generate: seed => generateSapCp011E2(id, seed) }));
const cp012: Family[] = SAP_CP012_E2_STRUCTURES.map((id,i) => ({ id, target: cp012Targets[i]!, salt: i + 31, generate: seed => generateSapCp012E2(id, seed) }));
assert.equal(cp011.reduce((s,f)=>s+f.target,0),90);
assert.equal(cp012.reduce((s,f)=>s+f.target,0),210);

const remaining = new Map([...cp011,...cp012].map(f => [f.id,f.target]));
const usedSeeds = new Map<string, Set<number>>();
let c11=0,c12=0;
function choose(pool: readonly Family[], start: number, avoid: string, allowAvoid: boolean): { family: Family; index: number } | null {
  for (let k=0;k<pool.length;k++) {
    const i=(start+k)%pool.length, f=pool[i]!;
    if ((remaining.get(f.id)??0)>0 && (allowAvoid || f.id!==avoid)) return {family:f,index:i};
  }
  return null;
}
function nextFamily(pool: readonly Family[], cursor: "11"|"12", avoid: string): Family {
  const start = cursor === "11" ? c11 : c12;
  const picked = choose(pool,start,avoid,false) ?? choose(pool,start,avoid,true);
  if (!picked) throw new Error(`No family remaining in CP${cursor}`);
  const {family,index}=picked;
  remaining.set(family.id,(remaining.get(family.id)??0)-1);
  if (cursor === "11") c11=(index+1)%pool.length; else c12=(index+1)%pool.length;
  return family;
}
function seedFor(f: Family, correctIndex: number): number {
  const set=usedSeeds.get(f.id)??new Set<number>();
  usedSeeds.set(f.id,set);
  const start=(set.size*7+f.salt*3)%25;
  for (let probe=0;probe<25;probe++) {
    const slot=(start+probe)%25;
    const seed=correctIndex+1+4*slot;
    if (!set.has(seed)) { set.add(seed); return seed; }
  }
  throw new Error(`${f.id}: no unused seed in answer-position bucket ${correctIndex}`);
}

interface ReviewRecord extends SapE2Package { readonly questionId: string; }
const records: ReviewRecord[]=[];
for (let i=0;i<300;i++) {
  const inCp011=[2,5,8].includes(i%10);
  const avoid=records.at(-1)?.structureId ?? "";
  const f=nextFamily(inCp011?cp011:cp012,inCp011?"11":"12",avoid);
  const correctIndex=i%4;
  const seed=seedFor(f,correctIndex);
  const q=f.generate(seed);
  assert.equal(q.correctIndex,correctIndex,`${f.id}/${seed}: answer-position mismatch`);
  records.push(Object.freeze({...q,questionId:`SAP-E2-${String(i+1).padStart(3,"0")}`}));
}
assert.equal(records.length,300);
assert.equal(new Set(records.map(r=>r.stem)).size,300);
assert.equal(new Set(records.map(r=>r.canonicalPayloadKey)).size,300);
assert.equal(records.filter(r=>r.checkpointId==="SAP-CP-011").length,90);
assert.equal(records.filter(r=>r.checkpointId==="SAP-CP-012").length,210);
for (const f of [...cp011,...cp012]) assert.equal(records.filter(r=>r.structureId===f.id).length,f.target,`${f.id}: wrong weight`);

const cp011Theory = records.filter(r => ["CP011-E2-ABSOLUTE-ERROR","CP011-E2-PERCENTAGE-ERROR","CP011-E2-OVER-UNDER-DIRECTION","CP011-E2-COMPARE-ESTIMATE-ACCURACY","CP011-E2-COMPOSED-ROUNDING-BOUND","CP011-E2-OPTION-WITHIN-TOLERANCE","CP011-E2-GUARANTEED-NEAREST-FROM-INTERVAL","CP011-E2-AMBIGUOUS-OPTION-DIAGNOSIS"].includes(r.structureId)).length;
const cp012BandTheory = records.filter(r => ["CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE","CP012-E2-COUNT-ADMISSIBLE-INTEGERS","CP012-E2-OUTCOME-CLASSIFICATION","CP012-E2-ROUNDED-OPERAND-SYNTHESIS"].includes(r.structureId)).length;
assert.equal(cp011Theory,26);
assert.equal(cp012BandTheory,24);

const positions=[0,0,0,0];
let hard=0,ssc=0,bank=0,last="",streak=0;
for (const r of records) {
  assert.equal(r.validation.ok,true,`${r.questionId}: ${r.validation.errors.join("; ")}`);
  assert.equal(r.options.length,4); assert.equal(new Set(r.options.map(o=>o.value)).size,4);
  assert.equal(r.options[r.correctIndex]?.value,r.canonicalAnswer);
  assert.ok(r.decisionCount>=2);
  assert.equal(r.lifecycle.permanentQlId,null); assert.equal(r.lifecycle.active,false); assert.equal(r.lifecycle.questionStudioDiscoverable,false); assert.equal(r.lifecycle.questionBankWritable,false); assert.equal(r.lifecycle.testEligible,false); assert.equal(r.lifecycle.publiclyPublishable,false);
  assert.doesNotMatch(r.stem,/For estimation, take|Using cancellation|using suitable approximation|oracle|runtime|prototype|canonical|machine policy|learner route|certified gap/i);
  assert.doesNotMatch(r.stem,/[√∛∜]/);
  assert.doesNotMatch(r.options.map(o=>o.value).join(" "),/Alternative\s+\d+/i);
  positions[r.correctIndex]!++;
  if(r.difficulty==="HARD")hard++;
  r.profile==="SSC"?ssc++:bank++;
  streak=r.structureId===last?streak+1:1; last=r.structureId; assert.ok(streak<2,`${r.questionId}: repeated structure`);
}
assert.deepEqual(positions,[75,75,75,75]);
assert.ok(hard>=100);

const summary=Object.freeze({reviewVersion:"SAP-E2-CP011-CP012-PRODUCTION-V2",questionCount:300,checkpoints:{cp011:90,cp012:210},profiles:{BANK:bank,SSC:ssc},structures:24,answerPositions:positions,hardQuestions:hard,cp011TheoryDiagnosticQuestions:cp011Theory,cp012BandDiagnosticQuestions:cp012BandTheory,lifecycle:"INACTIVE_HUMAN_REVIEW_CANDIDATE",permanentQlAllocation:"NONE"});
const outDir=path.join(process.cwd(),"artifacts/api-server/dist/quant-v4/sap-e2-review"); fs.mkdirSync(outDir,{recursive:true});
const md:string[]=["# SAP E2 — CP011 + CP012 — 300-Question Review V2","",`Questions: **300**`,`Mix: **CP011 90 / CP012 210**`,`Profiles: **Bank ${bank} / SSC ${ssc}**`,`A/B/C/D: **${positions.join(" / ")}**`,`Theory/diagnostic weight: **CP011 ${cp011Theory} / CP012 band-synthesis ${cp012BandTheory}**`,"","> Human review only. All E2 questions are inactive and unallocated.",""];
for(const r of records){md.push(`## ${r.questionId} — ${r.profile} — ${r.difficulty}`,"",r.stem,"");r.options.forEach((o,i)=>md.push(`${String.fromCharCode(65+i)}. ${o.value}`));md.push("",`**Correct:** ${String.fromCharCode(65+r.correctIndex)} — ${r.canonicalAnswer}`,"",`**Idea:** ${r.explanation.coreConcept}`,"","**Working:**");r.explanation.steps.forEach((s,i)=>md.push(`${i+1}. ${s}`));md.push("",`**Final:** ${r.explanation.finalAnswer}`,"");}
fs.writeFileSync(path.join(outDir,"SAP-E2-300-REVIEW.md"),md.join("\n"));
fs.writeFileSync(path.join(outDir,"SAP-E2-300-REVIEW.json"),JSON.stringify({summary,records},null,2));
fs.writeFileSync(path.join(outDir,"summary.json"),JSON.stringify(summary,null,2));
const esc=(s:string)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const cards=records.map(r=>`<section><h2>${r.questionId} — ${r.profile}</h2><p class="tag">${r.difficulty}</p><p class="stem">${esc(r.stem)}</p><ol type="A">${r.options.map(o=>`<li>${esc(o.value)}</li>`).join("")}</ol><div class="solution"><p><b>Correct:</b> ${String.fromCharCode(65+r.correctIndex)} — ${esc(r.canonicalAnswer)}</p><p><b>Idea:</b> ${esc(r.explanation.coreConcept)}</p><ol>${r.explanation.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><p><b>Final:</b> ${esc(r.explanation.finalAnswer)}</p></div></section>`).join("\n");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>SAP E2 300 Review V2</title><script>MathJax={tex:{inlineMath:[['\\\\(','\\\\)']]},svg:{fontCache:'global'}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script><style>body{font-family:Arial,sans-serif;max-width:1000px;margin:24px auto;padding:0 20px;line-height:1.55;background:#fafafa}header,section{background:#fff;border:1px solid #e2e2e2;border-radius:8px;padding:18px;margin:14px 0}h2{font-size:1rem}.tag{font-size:.8rem;font-weight:700;color:#555}.stem{font-size:1.05rem}.solution{border-top:1px dashed #ddd;margin-top:14px;padding-top:10px}li{margin:.25rem 0}</style></head><body><header><h1>SAP E2 — CP011 + CP012 Review V2</h1><p>300 questions · CP011 90 · CP012 210 · Bank ${bank} · SSC ${ssc} · A/B/C/D ${positions.join(" / ")}</p></header>${cards}</body></html>`;
fs.writeFileSync(path.join(outDir,"SAP-E2-300-REVIEW.html"),html);
console.log(JSON.stringify(summary));
