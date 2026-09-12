import { deterministicPick, deterministicShuffle } from "../../deterministic";
import { assertKnowledgeQuestionValid } from "../../question-validation";
import type { KnowledgeFact, KnowledgeV1Difficulty } from "../../types";
import { GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1, GEO_RIV_001_CP012_FACTS_V1 } from "./geo-riv-001-cp012-facts";
import type { GeoRiv001Cp012ReviewQuestion } from "./geo-riv-001-cp012-review-types";

export const GEO_RIV_001_CP012_QL_IDS_V1 = Object.freeze([
  "GEO-RIV-001-QL-101","GEO-RIV-001-QL-102","GEO-RIV-001-QL-103","GEO-RIV-001-QL-104","GEO-RIV-001-QL-105","GEO-RIV-001-QL-106","GEO-RIV-001-QL-107","GEO-RIV-001-QL-108","GEO-RIV-001-QL-109",
] as const);

const QL_NAMES: Record<string,string> = {
  "GEO-RIV-001-QL-101":"City to river",
  "GEO-RIV-001-QL-102":"River to city",
  "GEO-RIV-001-QL-103":"Correctly matched city-river pair",
  "GEO-RIV-001-QL-104":"Incorrectly matched city-river pair",
  "GEO-RIV-001-QL-105":"City-state clue to river",
  "GEO-RIV-001-QL-106":"Cities sharing a river",
  "GEO-RIV-001-QL-107":"City-river Statement I and II",
  "GEO-RIV-001-QL-108":"Three-statement city-river count",
  "GEO-RIV-001-QL-109":"Match cities with rivers",
};

const ROWS = GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1;
const FACTS = GEO_RIV_001_CP012_FACTS_V1 as readonly KnowledgeFact[];
const CITIES = [...new Set(ROWS.map((r)=>r.city))];
const RIVERS = [...new Set(ROWS.map((r)=>r.river))];
function displayRiver(r:string){ return r.startsWith("River ") ? r : `River ${r}`; }
export function geoRiv001Cp012RawRiver(r:string){ return r.replace(/^River\s+/,""); }
function cityFacts(city:string){ return FACTS.filter((f)=>f.entity.label.en===city); }
function truePair(city:string, river:string){ return ROWS.some((r)=>r.city===city && r.river===river); }
function pair(city:string, river:string){ return `${city} — ${displayRiver(river)}`; }
function unique<T>(xs: readonly T[]){ return [...new Set(xs)]; }
function cityStateLabel(city:string,state:string){ return city===state ? city : `${city}, ${state}`; }
function cityPairs(cities: readonly string[]){ const pairs:string[]=[]; for(let i=0;i<cities.length;i+=1){ for(let j=i+1;j<cities.length;j+=1){ pairs.push(`${cities[i]} and ${cities[j]}`); } } return pairs; }

function build(args:{qlId:string;seed:string;stem:string;answer:string;pool:readonly string[];explanation:string;facts:readonly KnowledgeFact[];difficulty:KnowledgeV1Difficulty;solver:string;}):GeoRiv001Cp012ReviewQuestion{
  const distractors=deterministicShuffle(unique(args.pool.filter((x)=>x!==args.answer)),`${args.seed}:${args.qlId}:d`).slice(0,3);
  if(distractors.length!==3) throw new Error(`CP012 requires three distractors for ${args.qlId}`);
  const shuffled=deterministicShuffle([{text:args.answer,correct:true},...distractors.map((text)=>({text,correct:false}))],`${args.seed}:${args.qlId}:o`);
  const options=shuffled.map((x)=>x.text); const correctIndex=shuffled.findIndex((x)=>x.correct);
  assertKnowledgeQuestionValid({stem:args.stem,options,correctIndex,canonicalAnswer:args.answer,explanation:args.explanation});
  return {questionId:`GEO-RIV-001-CP012-V1-${args.qlId}-${args.seed}`,chapterId:"GEO-RIV-001",cpId:"GEO-RIV-001-CP012",qlId:args.qlId,qlName:QL_NAMES[args.qlId]??args.qlId,difficulty:args.difficulty,stem:args.stem,options,correctIndex,canonicalAnswer:args.answer,explanation:args.explanation,sourceIds:unique(args.facts.map((f)=>f.source.sourceId)),sourceFactIds:unique(args.facts.map((f)=>f.factId)),solverAuthority:args.solver,reviewOnly:true,runtimeRegistered:false};
}

const SINGLE_RIVER_CITIES=CITIES.filter((c)=>ROWS.filter((r)=>r.city===c).length===1);
const UNIQUE_RIVER_ROWS=ROWS.filter((r)=>ROWS.filter((x)=>x.river===r.river).length===1 && ROWS.filter((x)=>x.city===r.city).length===1);

function q101(seed:string){ const city=deterministicPick(SINGLE_RIVER_CITIES,`${seed}:c`); const row=ROWS.find((r)=>r.city===city)!; return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[0],seed,stem:`${city} is situated on the banks of which of the following rivers?`,answer:displayRiver(row.river),pool:RIVERS.map(displayRiver),explanation:`${city} is situated on the banks of ${displayRiver(row.river)} in ${row.state}.`,facts:cityFacts(city),difficulty:"Easy",solver:"CITY_TO_RIVER_RELATION"}); }
function q102(seed:string){ const row=deterministicPick(UNIQUE_RIVER_ROWS,`${seed}:r`); return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[1],seed,stem:`Which of the following cities is situated on ${displayRiver(row.river)}?`,answer:row.city,pool:CITIES,explanation:`${row.city} is situated on ${displayRiver(row.river)} in ${row.state}.`,facts:cityFacts(row.city),difficulty:"Easy",solver:"UNIQUE_RIVER_TO_CITY"}); }
function q103(seed:string){ const selected=deterministicShuffle(ROWS.filter((r)=>r.city!=="Prayagraj"),`${seed}:rows`).slice(0,4); const target=deterministicPick([0,1,2,3] as const,`${seed}:t`); const opts=selected.map((r,i)=> i===target?pair(r.city,r.river):pair(r.city,deterministicPick(RIVERS.filter((x)=>!truePair(r.city,x)),`${seed}:w:${i}`))); const row=selected[target]; return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[2],seed,stem:"Select the correctly matched city–river pair.",answer:opts[target],pool:opts,explanation:`${row.city} is situated on ${displayRiver(row.river)} in ${row.state}.`,facts:selected.flatMap((r)=>cityFacts(r.city)),difficulty:"Medium",solver:"MATCHED_CITY_RIVER_VERIFIER"}); }
function q104(seed:string){ const selected=deterministicShuffle(ROWS.filter((r)=>r.city!=="Prayagraj"),`${seed}:rows`).slice(0,4); const target=deterministicPick([0,1,2,3] as const,`${seed}:t`); const wrongRiver=deterministicPick(RIVERS.filter((x)=>!truePair(selected[target].city,x)),`${seed}:w`); const opts=selected.map((r,i)=> i===target?pair(r.city,wrongRiver):pair(r.city,r.river)); const row=selected[target]; return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[3],seed,stem:"Which one of the following city–river pairs is incorrectly matched?",answer:opts[target],pool:opts,explanation:`${row.city} is situated on ${displayRiver(row.river)}, not ${displayRiver(wrongRiver)}.`,facts:selected.flatMap((r)=>cityFacts(r.city)),difficulty:"Medium",solver:"MATCHED_CITY_RIVER_VERIFIER"}); }
function q105(seed:string){ const city=deterministicPick(SINGLE_RIVER_CITIES,`${seed}:c`); const row=ROWS.find((r)=>r.city===city)!; const label=cityStateLabel(city,row.state); return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[4],seed,stem:`Which river is associated with ${label}?`,answer:displayRiver(row.river),pool:RIVERS.map(displayRiver),explanation:`${label} is situated on ${displayRiver(row.river)}.`,facts:cityFacts(city),difficulty:"Easy",solver:"CITY_STATE_TO_RIVER"}); }

const SHARED_RIVER_GROUPS=[...new Set(RIVERS)].map((river)=>({river,cities:unique(ROWS.filter((r)=>r.river===river).map((r)=>r.city))})).filter((g)=>g.cities.length>=2);
function q106(seed:string){ const group=deterministicPick(SHARED_RIVER_GROUPS,`${seed}:g`); const truePairs=cityPairs(group.cities); const answer=deterministicPick(truePairs,`${seed}:pair`); const [firstCity,secondCity]=answer.split(" and "); const wrong:string[]=[]; for(let i=0;i<CITIES.length;i+=1){ for(let j=i+1;j<CITIES.length;j+=1){ const candidate=`${CITIES[i]} and ${CITIES[j]}`; if(truePairs.includes(candidate)) continue; wrong.push(candidate); }} return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[5],seed,stem:`Which pair of cities is correctly associated with ${displayRiver(group.river)}?`,answer,pool:wrong,explanation:`Both ${firstCity} and ${secondCity} are associated with ${displayRiver(group.river)}.`,facts:group.cities.flatMap(cityFacts),difficulty:"Medium",solver:"SHARED_RIVER_CITY_PAIR"}); }

type Claim={city:string;text:string;truth:boolean;explanation:string;facts:KnowledgeFact[]};
function claim(seed:string,truth:boolean,excludedCities:readonly string[]=[]):Claim{ const candidates=SINGLE_RIVER_CITIES.filter((city)=>!excludedCities.includes(city)); const city=deterministicPick(candidates,`${seed}:c`); const row=ROWS.find((r)=>r.city===city)!; const river=truth?row.river:deterministicPick(RIVERS.filter((x)=>!truePair(city,x)),`${seed}:w`); return {city,text:`${city} is situated on ${displayRiver(river)}.`,truth,explanation:truth?`${city} is situated on ${displayRiver(row.river)}.`:`${city} is situated on ${displayRiver(row.river)}, not ${displayRiver(river)}.`,facts:cityFacts(city)}; }
const TWO=["Both I and II are correct","Only I is correct","Only II is correct","Neither I nor II is correct"];
const TWO_CONCLUSIONS=["both I and II are correct","only I is correct","only II is correct","neither I nor II is correct"];
function q107(seed:string){ const mode=deterministicPick([0,1,2,3] as const,`${seed}:m`); const a=claim(`${seed}:1`,mode===0||mode===1); const b=claim(`${seed}:2`,mode===0||mode===2,[a.city]); return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[6],seed,stem:`Consider the following statements:\nI. ${a.text}\nII. ${b.text}\nWhich of the statements given above is/are correct?`,answer:TWO[mode],pool:TWO,explanation:`Statement I: ${a.explanation} Statement II: ${b.explanation} Therefore, ${TWO_CONCLUSIONS[mode]}.`,facts:[...a.facts,...b.facts],difficulty:"Medium",solver:"STATEMENT_COMPOSITION_VERIFIER"}); }
const COUNT=["None","One","Two","Three"];
function q108(seed:string){ const n=deterministicPick([0,1,2,3] as const,`${seed}:n`); const flags=deterministicShuffle([0,1,2].map((i)=>i<n),`${seed}:f`); const first=claim(`${seed}:1`,flags[0]); const second=claim(`${seed}:2`,flags[1],[first.city]); const third=claim(`${seed}:3`,flags[2],[first.city,second.city]); const cs=[first,second,third]; const word=COUNT[n]; const conclusion=n===0?"Therefore, none of the statements is correct.":n===1?"Therefore, one statement is correct.":n===2?"Therefore, two statements are correct.":"Therefore, all three statements are correct."; return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[7],seed,stem:`Consider the following city–river statements:\n${cs.map((c,i)=>`${i+1}. ${c.text}`).join("\n")}\nHow many of the statements given above are correct?`,answer:word,pool:COUNT,explanation:`${cs.map((c,i)=>`${i+1}. ${c.explanation}`).join(" ")} ${conclusion}`,facts:cs.flatMap((c)=>c.facts),difficulty:"Hard",solver:"STATEMENT_COMPOSITION_VERIFIER"}); }
function q109(seed:string){
  const candidates=deterministicShuffle(ROWS.filter((r)=>r.city!=="Prayagraj"),`${seed}:rows`);
  const selected:typeof candidates[number][]=[];
  const usedRivers=new Set<string>();
  for(const row of candidates){ if(usedRivers.has(row.river)) continue; selected.push(row); usedRivers.add(row.river); if(selected.length===3) break; }
  if(selected.length!==3) throw new Error("CP012 QL109 requires three distinct rivers");
  const correct=selected.map((r)=>pair(r.city,r.river)).join("; ");
  const mapping=(indexes:number[])=>selected.map((r,i)=>pair(r.city,selected[indexes[i]].river)).join("; ");
  const alternatives=[correct,mapping([1,2,0]),mapping([2,0,1]),mapping([1,0,2])];
  return build({qlId:GEO_RIV_001_CP012_QL_IDS_V1[8],seed,stem:"Which option correctly matches all three cities with their rivers?",answer:correct,pool:alternatives,explanation:`The correct matches are: ${selected.map((r)=>`${r.city} — ${displayRiver(r.river)}`).join("; ")}.`,facts:selected.flatMap((r)=>cityFacts(r.city)),difficulty:"Hard",solver:"THREE_PAIR_MATCH_VERIFIER"});
}

export function generateGeoRiv001Cp012ReviewV1(qlId:string,seed:string){ switch(qlId){case GEO_RIV_001_CP012_QL_IDS_V1[0]:return q101(seed);case GEO_RIV_001_CP012_QL_IDS_V1[1]:return q102(seed);case GEO_RIV_001_CP012_QL_IDS_V1[2]:return q103(seed);case GEO_RIV_001_CP012_QL_IDS_V1[3]:return q104(seed);case GEO_RIV_001_CP012_QL_IDS_V1[4]:return q105(seed);case GEO_RIV_001_CP012_QL_IDS_V1[5]:return q106(seed);case GEO_RIV_001_CP012_QL_IDS_V1[6]:return q107(seed);case GEO_RIV_001_CP012_QL_IDS_V1[7]:return q108(seed);case GEO_RIV_001_CP012_QL_IDS_V1[8]:return q109(seed);default:throw new Error(`Unsupported CP012 QL ${qlId}`);} }
