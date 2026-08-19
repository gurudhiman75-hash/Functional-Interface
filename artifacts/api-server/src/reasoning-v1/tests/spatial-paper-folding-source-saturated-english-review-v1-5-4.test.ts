import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4,
  generatePfcTpfSourceSaturatedEnglishReviewV1_5_4,
  renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_4,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5-4";
import {
  PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  minimumPatternOptionDistanceV1_5,
} from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5";
import { generatePfcTpfSourceSaturatedEnglishReviewV1_5_3 } from "../foundation/spatial/paper-folding-source-saturated-english-review-v1-5-3";

const prior = generatePfcTpfSourceSaturatedEnglishReviewV1_5_3();
const questions = generatePfcTpfSourceSaturatedEnglishReviewV1_5_4();
assert.equal(questions.length, 48);
assert.deepEqual(questions.map((q) => q.semanticFingerprint), prior.map((q) => q.semanticFingerprint));
assert.deepEqual(questions.map((q) => q.correctOptionId), prior.map((q) => q.correctOptionId));

for (const question of questions) {
  if (question.taskKind === "REVERSE_INFERENCE") continue;
  const distance = minimumPatternOptionDistanceV1_5(question);
  assert.ok(distance + 1e-9 >= PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE, `${question.reviewQuestionId} regressed below geometry separation at ${distance.toFixed(3)}.`);
}

const q46 = questions.find((q) => q.sourceId === "TPF-W2-HORIZONTAL-CROSSING-POLYGON");
assert.ok(q46);
assert.equal(q46!.correctOptionId, "D");
assert.equal((q46!.options.find((o) => o.optionId === "A")!.svg.match(/<(?:line|polygon|polyline)\b/g) ?? []).length, 0);
assert.equal((q46!.options.find((o) => o.optionId === "A")!.svg.match(/<circle\b/g) ?? []).length, 1);
assert.equal(q46!.options.find((o) => o.optionId === "D")!.svg, prior.find((q) => q.sourceId === q46!.sourceId)!.options.find((o) => o.optionId === "D")!.svg);

const GRID = 120;
export const PFC_TPF_REVIEW_V1_5_4_MIN_COARSE_VISIBLE_DISTANCE = 0.18;
const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
function num(tag: string, name: string): number | null {
  const match = tag.match(new RegExp(`\\b${name}="(-?\\d+(?:\\.\\d+)?)"`));
  return match ? Number(match[1]) : null;
}
function paint(set: Set<number>, x: number, y: number, radius = 1): void {
  const gx = Math.max(0, Math.min(GRID - 1, Math.round(x * (GRID - 1) / 100)));
  const gy = Math.max(0, Math.min(GRID - 1, Math.round(y * (GRID - 1) / 100)));
  for (let dx = -radius; dx <= radius; dx += 1) {
    for (let dy = -radius; dy <= radius; dy += 1) {
      const xx = gx + dx, yy = gy + dy;
      if (xx >= 0 && xx < GRID && yy >= 0 && yy < GRID) set.add(yy * GRID + xx);
    }
  }
}
function segment(set: Set<number>, x1: number, y1: number, x2: number, y2: number): void {
  const steps = Math.max(8, Math.ceil(Math.hypot(x2 - x1, y2 - y1) * 2));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    paint(set, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 1);
  }
}
function visibleMask(svg: string): Set<number> {
  const set = new Set<number>();
  for (const tag of svg.match(/<line\b[^>]*\/?\s*>/g) ?? []) {
    if (/\bstroke="(?:white|#fff)"/i.test(tag)) continue;
    const x1=num(tag,"x1"),y1=num(tag,"y1"),x2=num(tag,"x2"),y2=num(tag,"y2");
    if ([x1,y1,x2,y2].some((v)=>v===null)) continue;
    segment(set,x1!,y1!,x2!,y2!);
  }
  for (const tag of svg.match(/<(?:polygon|polyline)\b[^>]*\/?\s*>/g) ?? []) {
    const values=tag.match(/\bpoints="([^"]+)"/)?.[1]?.match(NUMBER_RE)?.map(Number) ?? [];
    const points: Array<[number,number]> = [];
    for(let i=0;i+1<values.length;i+=2) points.push([values[i],values[i+1]]);
    for(let i=0;i+1<points.length;i+=1) segment(set,...points[i],...points[i+1]);
    if(tag.startsWith("<polygon") && points.length>2) segment(set,...points.at(-1)!,...points[0]);
  }
  for (const tag of svg.match(/<circle\b[^>]*\/?\s*>/g) ?? []) {
    const cx=num(tag,"cx"),cy=num(tag,"cy"),r=num(tag,"r");
    if(cx===null||cy===null||r===null||r>10) continue;
    if(/\bfill="(?:#111|black)"/i.test(tag)) {
      for(let x=cx-r;x<=cx+r;x+=0.7) for(let y=cy-r;y<=cy+r;y+=0.7) if(Math.hypot(x-cx,y-cy)<=r) paint(set,x,y,0);
    } else {
      for(let deg=0;deg<360;deg+=4){const rad=deg*Math.PI/180;paint(set,cx+r*Math.cos(rad),cy+r*Math.sin(rad),1);}
    }
  }
  return set;
}
function jaccardDistance(a:Set<number>,b:Set<number>):number {
  const union=new Set([...a,...b]); if(union.size===0)return 0;
  let intersection=0; for(const value of a) if(b.has(value)) intersection+=1;
  return 1-intersection/union.size;
}
function minVisibleDistance(question: typeof questions[number]): number {
  const masks=question.options.map((o)=>visibleMask(o.svg));
  let minimum=1;
  for(let i=0;i<masks.length;i+=1) for(let j=i+1;j<masks.length;j+=1) minimum=Math.min(minimum,jaccardDistance(masks[i],masks[j]));
  return minimum;
}

const tpf = questions.filter((q) => q.chapterCode === "TPF-001");
assert.equal(tpf.length,8);
let minimumCoarseVisibleDistance=1;
for(const question of tpf){
  const distance=minVisibleDistance(question);
  minimumCoarseVisibleDistance=Math.min(minimumCoarseVisibleDistance,distance);
  assert.ok(distance+1e-9>=PFC_TPF_REVIEW_V1_5_4_MIN_COARSE_VISIBLE_DISTANCE,`${question.reviewQuestionId} TPF options remain visually near-duplicate at coarse distance ${distance.toFixed(3)}.`);
}

const html = renderPfcTpfSourceSaturatedEnglishReviewHtmlV1_5_4(questions);
assert.ok(html.includes("PFC / TPF Source-Saturated English Learner Review V1.5.4"));
assert.ok(html.includes(PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4.authorityId));
assert.ok(!html.includes("data-perceptual-distractor"));
assert.ok(!html.includes("data-distinct-distractor"));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map((m)=>m[1]);
assert.equal(new Set(ids).size,ids.length);
const idSet=new Set(ids);
for(const ref of [...html.matchAll(/url\(#([^\)]+)\)/g)].map((m)=>m[1])) assert.ok(idSet.has(ref));

const evidence={
  authority:PFC_TPF_SOURCE_SATURATED_ENGLISH_REVIEW_AUTHORITY_V1_5_4,
  status:"PASS_PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_V1_5_4",
  reviewQuestionCount:questions.length,
  geometryDistanceGate:PFC_TPF_REVIEW_V1_5_MIN_PATTERN_DISTANCE,
  coarseVisibleDistanceGate:PFC_TPF_REVIEW_V1_5_4_MIN_COARSE_VISIBLE_DISTANCE,
  minimumTpfCoarseVisibleDistance:minimumCoarseVisibleDistance,
  q46CorrectOptionRetained:q46!.correctOptionId,
  q46NearDuplicateRemoved:true,
  retainedSemanticFingerprints:questions.map((q)=>q.semanticFingerprint),
  retainedCorrectOptionIds:questions.map((q)=>q.correctOptionId),
  governance:{humanLearnerReviewRequired:true,permanentQlIdsAssigned:false,englishFrozen:false,localizationAllowed:false,questionStudioAllowed:false,nextGate:"PFC_TPF_SOURCE_SATURATED_ENGLISH_LEARNER_REVIEW_DECISION"},
};
mkdirSync("dist/reasoning-v1/spatial",{recursive:true});
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-4-evidence.json",`${JSON.stringify(evidence,null,2)}\n`,"utf8");
writeFileSync("dist/reasoning-v1/spatial/spa-pfc-tpf-source-saturated-english-review-v1-5-4.html",html,"utf8");
console.log(JSON.stringify(evidence));
