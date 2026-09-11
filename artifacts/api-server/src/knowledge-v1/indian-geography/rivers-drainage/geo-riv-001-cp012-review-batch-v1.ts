import { GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1 } from "./geo-riv-001-cp012-facts";
import { generateGeoRiv001Cp012ReviewV1, GEO_RIV_001_CP012_QL_IDS_V1, geoRiv001Cp012RawRiver } from "./geo-riv-001-cp012-review-generator-v1";
import type { GeoRiv001Cp012ReviewQuestion } from "./geo-riv-001-cp012-review-types";

const ROWS=GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1;
const RIVERS=[...new Set(ROWS.map((r)=>r.river))];
function truePair(city:string,riverDisplay:string){ const river=geoRiv001Cp012RawRiver(riverDisplay); return ROWS.some((r)=>r.city===city&&r.river===river); }
function pairParts(text:string){ const [city="",river=""]=text.split(" — ").map((x)=>x.trim()); return {city,river}; }
function force(q:GeoRiv001Cp012ReviewQuestion,i:number):GeoRiv001Cp012ReviewQuestion{ const others=q.options.filter((_,x)=>x!==q.correctIndex); const options=[...others]; options.splice(i,0,q.canonicalAnswer); return {...q,options,correctIndex:i}; }
function signature(q:GeoRiv001Cp012ReviewQuestion){ return `${q.stem}|${q.canonicalAnswer}|${[...q.options].sort().join("|")}`; }

const generated:GeoRiv001Cp012ReviewQuestion[]=[];
for(const qlId of GEO_RIV_001_CP012_QL_IDS_V1){ const qs:GeoRiv001Cp012ReviewQuestion[]=[]; const seen=new Set<string>(); for(let a=1;a<=500&&qs.length<6;a++){ const q=generateGeoRiv001Cp012ReviewV1(qlId,`review-${qlId}-${String(a).padStart(3,"0")}`); const s=signature(q); if(seen.has(s)) continue; seen.add(s); qs.push(q); } if(qs.length!==6) throw new Error(`Unable to build six CP012 questions for ${qlId}`); generated.push(...qs); }
export const GEO_RIV_001_CP012_REVIEW_BATCH_V1=Object.freeze(generated.map((q,i)=>Object.freeze(force(q,i%4))));

function evalClaim(text:string){ const m=text.match(/^(.+?) is situated on (River .+)\.$/); if(!m) return null; return truePair(m[1],m[2]); }
function statementLines(stem:string){ return stem.split("\n").map((x)=>x.replace(/^(?:I{1,2}|\d+)\.\s*/,"").trim()).filter((x)=>/ is situated on River /.test(x)); }
function expectedTwo(v:boolean[]){ return v[0]&&v[1]?"Both I and II are correct":v[0]?"Only I is correct":v[1]?"Only II is correct":"Neither I nor II is correct"; }
function expectedCount(n:number){ return ["None","One","Two","Three"][n]??""; }
function hasBareRiver(text:string){ for(const r of RIVERS){ const e=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); if(new RegExp(`(?<!River )\\b${e}\\b`).test(text)) return true; } return false; }

function semantic(q:GeoRiv001Cp012ReviewQuestion,issues:string[]){
  if(q.qlId.endsWith("101")){ const city=q.stem.match(/^(.+?) is situated on the banks of/)?.[1]??""; const truth=q.options.map((r)=>truePair(city,r)); if(truth.filter(Boolean).length!==1||!truth[q.correctIndex]) issues.push(`QL101_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("102")){ const river=q.stem.match(/situated on (River .+)\?$/)?.[1]??""; const truth=q.options.map((c)=>truePair(c,river)); if(truth.filter(Boolean).length!==1||!truth[q.correctIndex]) issues.push(`QL102_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("103")||q.qlId.endsWith("104")){ const truth=q.options.map((o)=>{const p=pairParts(o);return truePair(p.city,p.river);}); if(q.qlId.endsWith("103")?(truth.filter(Boolean).length!==1||!truth[q.correctIndex]):(truth.filter(Boolean).length!==3||truth[q.correctIndex])) issues.push(`PAIR_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("105")){ const city=q.stem.match(/associated with (.+?), /)?.[1]??""; const truth=q.options.map((r)=>truePair(city,r)); if(truth.filter(Boolean).length!==1||!truth[q.correctIndex]) issues.push(`QL105_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("106")){ const river=q.stem.match(/associated with (River .+)\?$/)?.[1]??""; const truth=q.options.map((o)=>{const [a,b]=o.split(" and ");return !!a&&!!b&&truePair(a,river)&&truePair(b,river);}); if(truth.filter(Boolean).length!==1||!truth[q.correctIndex]) issues.push(`QL106_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("107")){ const vals=statementLines(q.stem).map(evalClaim); if(vals.length!==2||vals.some((x)=>x===null)||q.canonicalAnswer!==expectedTwo(vals as boolean[])) issues.push(`QL107_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("108")){ const vals=statementLines(q.stem).map(evalClaim); if(vals.length!==3||vals.some((x)=>x===null)||q.canonicalAnswer!==expectedCount((vals as boolean[]).filter(Boolean).length)) issues.push(`QL108_TRUTH:${q.questionId}`); }
  if(q.qlId.endsWith("109")){ const allTrue=(o:string)=>o.split("; ").every((p)=>{const x=pairParts(p);return truePair(x.city,x.river);}); const truth=q.options.map(allTrue); if(truth.filter(Boolean).length!==1||!truth[q.correctIndex]) issues.push(`QL109_TRUTH:${q.questionId}`); }
}

export function auditGeoRiv001Cp012ReviewBatchV1(){ const issues:string[]=[]; const qlCounts:Record<string,number>={}; const difficultyCounts={Easy:0,Medium:0,Hard:0}; const answerPositions:Record<number,number>={0:0,1:0,2:0,3:0}; const ids=new Set<string>(); for(const q of GEO_RIV_001_CP012_REVIEW_BATCH_V1){ if(ids.has(q.questionId))issues.push(`DUPLICATE_ID:${q.questionId}`);ids.add(q.questionId);qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;if(q.options.length!==4||new Set(q.options).size!==4)issues.push(`OPTIONS:${q.questionId}`);if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push(`ANSWER_ALIGNMENT:${q.questionId}`);if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push(`PROVENANCE:${q.questionId}`);if(!q.reviewOnly||q.runtimeRegistered)issues.push(`LIFECYCLE:${q.questionId}`);if(hasBareRiver(q.stem)||q.options.some(hasBareRiver)||hasBareRiver(q.explanation))issues.push(`RIVER_PREFIX:${q.questionId}`);if(/in this corpus|sourceFact|review-only|exam trap|shortcut/i.test(q.explanation))issues.push(`MACHINE_LANGUAGE:${q.questionId}`);semantic(q,issues); }
  if(GEO_RIV_001_CP012_REVIEW_BATCH_V1.length!==54)issues.push(`QUESTION_COUNT:${GEO_RIV_001_CP012_REVIEW_BATCH_V1.length}`);for(const id of GEO_RIV_001_CP012_QL_IDS_V1)if(qlCounts[id]!==6)issues.push(`QL_COUNT:${id}:${qlCounts[id]??0}`);if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==24||difficultyCounts.Hard!==12)issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);if(answerPositions[0]!==14||answerPositions[1]!==14||answerPositions[2]!==13||answerPositions[3]!==13)issues.push(`ANSWER_POSITIONS:${JSON.stringify(answerPositions)}`);return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_RIV_001_CP012_REVIEW_BATCH_V1.length,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)}); }
