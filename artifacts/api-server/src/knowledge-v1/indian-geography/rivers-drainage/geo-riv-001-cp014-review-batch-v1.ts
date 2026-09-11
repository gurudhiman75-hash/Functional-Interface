import { GEO_RIV_001_CP010_PROJECT_ROWS_V1 } from "./geo-riv-001-cp010-facts";
import { GEO_RIV_001_CP011_BASIN_ROWS_V1 } from "./geo-riv-001-cp011-facts";
import { GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1 } from "./geo-riv-001-cp012-facts";
import { GEO_RIV_001_CP013_CLASS_LABEL, GEO_RIV_001_CP013_ROWS_V1, geoRiv001Cp013HasClass, type GeoRiv001Cp013Class } from "./geo-riv-001-cp013-facts";
import { GEO_RIV_001_CP014_QL_IDS_V1, generateGeoRiv001Cp014ReviewV1 } from "./geo-riv-001-cp014-review-generator-v1";
import type { GeoRiv001Cp014ReviewQuestion } from "./geo-riv-001-cp014-review-types";

const CITY=GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1,PROJECT=GEO_RIV_001_CP010_PROJECT_ROWS_V1,BASIN=GEO_RIV_001_CP011_BASIN_ROWS_V1,CLASS=GEO_RIV_001_CP013_ROWS_V1;
const RIVERS=[...new Set([...CITY.map(x=>x.river),...PROJECT.map(x=>x.river),...BASIN.map(x=>x.river),...CLASS.map(x=>x.river)])];
const raw=(s:string)=>s.replace(/^River\s+/,"");
const CLASS_ENTRIES=Object.entries(GEO_RIV_001_CP013_CLASS_LABEL) as [GeoRiv001Cp013Class,string][];
const classFrom=(s:string)=>CLASS_ENTRIES.find(([,v])=>v.toLowerCase()===s.trim().toLowerCase())?.[0];
function signature(q:GeoRiv001Cp014ReviewQuestion){return `${q.stem}::${q.canonicalAnswer}`;}
function buildBatch(){const out:GeoRiv001Cp014ReviewQuestion[]=[];let global=0;for(const ql of GEO_RIV_001_CP014_QL_IDS_V1){const seen=new Set<string>();for(let slot=0;slot<6;slot+=1){const target=global%4;let found:GeoRiv001Cp014ReviewQuestion|undefined;for(let attempt=0;attempt<7000;attempt+=1){const q=generateGeoRiv001Cp014ReviewV1(ql,`cp014-${ql}-${slot}-${attempt}`);if(q.correctIndex!==target||seen.has(signature(q)))continue;found=q;break;}if(!found)throw new Error(`CP014 could not build ${ql}/${slot}`);seen.add(signature(found));out.push(found);global++;}}return out;}
export const GEO_RIV_001_CP014_REVIEW_BATCH_V1=Object.freeze(buildBatch());

function cityTruth(city:string,r:string){return CITY.some(x=>x.city===city&&x.river===r)}
function projectTruth(project:string,r:string){return PROJECT.some(x=>x.project===project&&x.river===r)}
function basinTruth(r:string,b:string,parent:string){return BASIN.some(x=>x.river===r&&x.basin===b&&x.parentRiver===parent)}
function chain121(text:string){const [city,rv,cl]=text.split(" — ");const c=classFrom(cl);return Boolean(c)&&cityTruth(city,raw(rv))&&geoRiv001Cp013HasClass(raw(rv),c!)}
function chain122(text:string){const [p,rv,state]=text.split(" — ");return PROJECT.some(x=>x.project===p&&x.river===raw(rv)&&x.states.includes(state))}
function chain123(text:string){const [p,rv,res]=text.split(" — ");return PROJECT.some(x=>x.project===p&&x.river===raw(rv)&&x.reservoir===res)}
function chain124(text:string){const [rv,basin,parentText]=text.split(" — ");return basinTruth(raw(rv),basin,raw(parentText.replace(/ system$/,"")))}
function chain126(text:string,targetRiver:string){const [city,project]=text.split(" and ");return cityTruth(city,targetRiver)&&projectTruth(project,targetRiver)}
function chain127(text:string){const [city,project,rv]=text.split(" — ");const r=raw(rv);return cityTruth(city,r)&&projectTruth(project,r)}
function bareRiver(text:string,name:string){return text.split(`River ${name}`).join("").includes(name)}
function claimTruth(text:string):boolean|null{let m=text.match(/^(.+?) is situated on River ([A-Za-z]+)\.$/);if(m)return cityTruth(m[1],m[2]);m=text.match(/^(.+? Dam) is built on River ([A-Za-z]+)\.$/);if(m)return projectTruth(m[1],m[2]);m=text.match(/^River ([A-Za-z]+) belongs to the (.+ Basin)\.$/);if(m)return BASIN.some(x=>x.river===m![1]&&x.basin===m![2]);m=text.match(/^River ([A-Za-z]+) is (?:a|an) (.+)\.$/);if(m){const c=classFrom(m[2]);return c?geoRiv001Cp013HasClass(m[1],c):null}return null}

export function auditGeoRiv001Cp014ReviewBatchV1(){const qs=GEO_RIV_001_CP014_REVIEW_BATCH_V1,issues:string[]=[];const positions=[0,0,0,0],qlCounts=new Map<string,number>(),qlSigs=new Map<string,Set<string>>();for(const q of qs){positions[q.correctIndex]++;qlCounts.set(q.qlId,(qlCounts.get(q.qlId)??0)+1);if(!qlSigs.has(q.qlId))qlSigs.set(q.qlId,new Set());qlSigs.get(q.qlId)!.add(signature(q));if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push(`ANSWER:${q.questionId}`);if(!q.reviewOnly||q.runtimeRegistered)issues.push(`LIFECYCLE:${q.questionId}`);if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push(`PROVENANCE:${q.questionId}`);for(const r of RIVERS)for(const t of [q.stem,...q.options,q.explanation])if(bareRiver(t,r))issues.push(`UNPREFIXED_RIVER:${q.questionId}:${r}`);
 if(q.qlId.endsWith("119")){const cs=q.stem.split("\n").filter(x=>/^I{1,2}\. /.test(x)).map(x=>claimTruth(x.replace(/^I{1,2}\. /,"")));const key=cs[0]&&cs[1]?"Both I and II are correct":cs[0]?"Only I is correct":cs[1]?"Only II is correct":"Neither I nor II is correct";if(q.canonicalAnswer!==key)issues.push(`SEM119:${q.questionId}`)}
 if(q.qlId.endsWith("120")){const cs=q.stem.split("\n").filter(x=>/^\d\. /.test(x)).map(x=>claimTruth(x.replace(/^\d\. /,"")));const key=["None","One","Two","Three"][cs.filter(Boolean).length];if(q.canonicalAnswer!==key)issues.push(`SEM120:${q.questionId}`)}
 if(q.qlId.endsWith("121")&&q.options.filter(chain121).length!==1)issues.push(`SEM121:${q.questionId}`);
 if(q.qlId.endsWith("122")&&q.options.filter(chain122).length!==1)issues.push(`SEM122:${q.questionId}`);
 if(q.qlId.endsWith("123")&&q.options.filter(x=>!chain123(x)).length!==1)issues.push(`SEM123:${q.questionId}`);
 if(q.qlId.endsWith("124")&&q.options.filter(chain124).length!==1)issues.push(`SEM124:${q.questionId}`);
 if(q.qlId.endsWith("125")){const m=q.stem.match(/associated with (.+?) and is also classified as (?:a|an) (.+)\?$/);const c=m?classFrom(m[2]):undefined;const city=m?.[1];if(!city||!c||q.options.filter(o=>cityTruth(city,raw(o))&&geoRiv001Cp013HasClass(raw(o),c)).length!==1)issues.push(`SEM125:${q.questionId}`)}
 if(q.qlId.endsWith("126")){const m=q.stem.match(/associated with River ([A-Za-z]+)\?/);const r=m?.[1];if(!r||q.options.filter(o=>chain126(o,r)).length!==1)issues.push(`SEM126:${q.questionId}`)}
 if(q.qlId.endsWith("127")&&q.options.filter(chain127).length!==1)issues.push(`SEM127:${q.questionId}`);
 }
 for(const ql of GEO_RIV_001_CP014_QL_IDS_V1){if(qlCounts.get(ql)!==6)issues.push(`QL_COUNT:${ql}:${qlCounts.get(ql)??0}`);if(qlSigs.get(ql)?.size!==6)issues.push(`QL_DIVERSITY:${ql}`)}if(qs.length!==54)issues.push(`TOTAL:${qs.length}`);if(positions.join(",")!=="14,14,13,13")issues.push(`POSITIONS:${positions.join(",")}`);const difficulty=qs.reduce((a,q)=>(a[q.difficulty]=(a[q.difficulty]??0)+1,a),{} as Record<string,number>);return{valid:issues.length===0,issues,total:qs.length,positions,difficulty,qlCounts:Object.fromEntries(qlCounts),sourceCpIds:["CP010","CP011","CP012","CP013"]};}
