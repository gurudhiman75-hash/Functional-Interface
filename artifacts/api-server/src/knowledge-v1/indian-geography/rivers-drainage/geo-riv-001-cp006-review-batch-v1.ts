import { GEO_RIV_001_CP006_ROWS_V1 } from "./geo-riv-001-cp006-facts";
import { GEO_RIV_001_CP006_QL_IDS_V1, generateGeoRiv001Cp006ReviewV1 } from "./geo-riv-001-cp006-review-generator-v1";
import type { GeoRiv001Cp006ReviewQuestion } from "./geo-riv-001-cp006-review-types";

const ROWS=GEO_RIV_001_CP006_ROWS_V1;
const RIVERS=ROWS.map(r=>r.river);
const TRIBS=ROWS.flatMap(r=>r.tributaries.map(t=>({parent:r.river,...t})));
const raw=(s:string)=>s.replace(/^River\s+/,"");
function signature(q:GeoRiv001Cp006ReviewQuestion){return `${q.stem}::${q.canonicalAnswer}`}
function sourceTruth(river:string,value:string){const r=ROWS.find(x=>x.river===river);return Boolean(r&&(r.sourcePlace===value||r.sourceRegion===value||r.sourceState===value))}
function tributaryTruth(name:string,parent:string,bank?:string){return TRIBS.some(t=>t.name===name&&t.parent===parent&&(!bank||t.bank.replace(" ","-")===bank))}
function forcePosition(q:GeoRiv001Cp006ReviewQuestion,target:number):GeoRiv001Cp006ReviewQuestion{const correct=q.options[q.correctIndex],d=q.options.filter((_,i)=>i!==q.correctIndex),options=[...d];options.splice(target,0,correct);return{...q,options,correctIndex:target}}
function buildBatch(){const out:GeoRiv001Cp006ReviewQuestion[]=[];let global=0;for(const ql of GEO_RIV_001_CP006_QL_IDS_V1){const seen=new Set<string>();for(let slot=0;slot<6;slot+=1){let found:GeoRiv001Cp006ReviewQuestion|undefined;for(let attempt=0;attempt<8000;attempt+=1){const q=generateGeoRiv001Cp006ReviewV1(ql,`cp006-${ql}-${slot}-${attempt}`);if(seen.has(signature(q)))continue;found=q;break}if(!found)throw new Error(`CP006 could not materialize ${ql}/${slot}`);seen.add(signature(found));out.push(forcePosition(found,global%4));global++}}return out}
export const GEO_RIV_001_CP006_REVIEW_BATCH_V1=Object.freeze(buildBatch());

function claimTruth(text:string):boolean|null{let m=text.match(/^River (.+?) originates near (.+)\.$/);if(m)return ROWS.some(r=>r.river===m![1]&&r.sourcePlace===m![2]);m=text.match(/^River (.+?) rises in the (.+)\.$/);if(m)return ROWS.some(r=>r.river===m![1]&&r.sourceRegion===m![2]);m=text.match(/^River (.+?) is a tributary of River (.+?)\.$/);if(m)return tributaryTruth(m[1],m[2]);m=text.match(/^River (.+?) is a (left-bank|right-bank) tributary of River (.+?)\.$/);if(m)return tributaryTruth(m[1],m[3],m[2]);return null}
function q51Truth(text:string){const [riverText,value]=text.split(" — ");return sourceTruth(raw(riverText),value)}
function q52Truth(text:string){const [tributary,parent,bank]=text.split(" — ");return tributaryTruth(raw(tributary),raw(parent),bank)}
function bareRiver(text:string,name:string){const exempt=[`${name} Basin`,`${name} Dam`,`${name} Reservoir`,`${name} Range`];let clean=text.split(`River ${name}`).join("");for(const phrase of exempt)clean=clean.split(phrase).join("");return clean.includes(name)}

export function auditGeoRiv001Cp006ReviewBatchV1(){const issues:string[]=[];const qs=GEO_RIV_001_CP006_REVIEW_BATCH_V1,positions=[0,0,0,0],qlCounts=new Map<string,number>(),qlSigs=new Map<string,Set<string>>();for(const q of qs){positions[q.correctIndex]++;qlCounts.set(q.qlId,(qlCounts.get(q.qlId)??0)+1);if(!qlSigs.has(q.qlId))qlSigs.set(q.qlId,new Set());qlSigs.get(q.qlId)!.add(signature(q));if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push(`ANSWER:${q.questionId}`);if(new Set(q.options).size!==4)issues.push(`OPTIONS:${q.questionId}`);if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push(`PROVENANCE:${q.questionId}`);if(!q.reviewOnly||q.runtimeRegistered)issues.push(`LIFECYCLE:${q.questionId}`);for(const r of [...RIVERS,...TRIBS.map(t=>t.name)])for(const t of [q.stem,...q.options,q.explanation])if(bareRiver(t,r))issues.push(`UNPREFIXED_RIVER:${q.questionId}:${r}`);
 if(q.qlId.endsWith("046")){const m=q.stem.match(/^Which of the following is the source location associated with River (.+?)\?$/),r=m&&ROWS.find(x=>x.river===m[1]);if(!r||q.canonicalAnswer!==r.sourcePlace)issues.push(`SEM046:${q.questionId}`)}
 if(q.qlId.endsWith("047")){const m=q.stem.match(/originates near (.+?) in the (.+?)\?/),r=m&&ROWS.find(x=>x.sourcePlace===m[1]&&x.sourceRegion===m[2]);if(!r||q.canonicalAnswer!==`River ${r.river}`)issues.push(`SEM047:${q.questionId}`)}
 if(q.qlId.endsWith("048")){const m=q.stem.match(/^River (.+?) drains into/),r=m&&ROWS.find(x=>x.river===m[1]);if(!r||q.canonicalAnswer!==r.mouth)issues.push(`SEM048:${q.questionId}`)}
 if(q.qlId.endsWith("049")){const m=q.stem.match(/^River (.+?) is a tributary/),t=m&&TRIBS.find(x=>x.name===m[1]);if(!t||q.canonicalAnswer!==`River ${t.parent}`)issues.push(`SEM049:${q.questionId}`)}
 if(q.qlId.endsWith("050")){const m=q.stem.match(/a (left-bank|right-bank) tributary of River (.+?)\?/);if(!m||q.options.filter(o=>tributaryTruth(raw(o),m[2],m[1])).length!==1)issues.push(`SEM050:${q.questionId}`)}
 if(q.qlId.endsWith("051")&&q.options.filter(q51Truth).length!==1)issues.push(`SEM051:${q.questionId}`);
 if(q.qlId.endsWith("052")&&q.options.filter(x=>!q52Truth(x)).length!==1)issues.push(`SEM052:${q.questionId}`);
 if(q.qlId.endsWith("053")){const cs=q.stem.split("\n").filter(x=>/^I{1,2}\. /.test(x)).map(x=>claimTruth(x.replace(/^I{1,2}\. /,"")));if(cs.some(x=>x===null))issues.push(`PARSE053:${q.questionId}`);const key=cs[0]&&cs[1]?"Both I and II are correct":cs[0]?"Only I is correct":cs[1]?"Only II is correct":"Neither I nor II is correct";if(q.canonicalAnswer!==key)issues.push(`SEM053:${q.questionId}`)}
 if(q.qlId.endsWith("054")){const cs=q.stem.split("\n").filter(x=>/^\d\. /.test(x)).map(x=>claimTruth(x.replace(/^\d\. /,"")));if(cs.some(x=>x===null))issues.push(`PARSE054:${q.questionId}`);const key=["None","One","Two","Three"][cs.filter(Boolean).length];if(q.canonicalAnswer!==key)issues.push(`SEM054:${q.questionId}`)}
 }
 for(const ql of GEO_RIV_001_CP006_QL_IDS_V1){if(qlCounts.get(ql)!==6)issues.push(`QL_COUNT:${ql}:${qlCounts.get(ql)??0}`);if(qlSigs.get(ql)?.size!==6)issues.push(`QL_DIVERSITY:${ql}:${qlSigs.get(ql)?.size??0}`)}if(qs.length!==54)issues.push(`TOTAL:${qs.length}`);if(positions.join(",")!=="14,14,13,13")issues.push(`POSITIONS:${positions.join(",")}`);const difficulty=qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]??0)+1,a),{} as Record<string,number>);return{valid:issues.length===0,issues,total:qs.length,positions,difficulty,qlCounts:Object.fromEntries(qlCounts),riverCount:ROWS.length,tributaryCount:TRIBS.length}}
