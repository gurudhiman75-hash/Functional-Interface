import type { KnowledgeV1Difficulty } from "../../types";
import { HIS_CP024_FACTS_V1,HIS_CP024_FACT_BY_ID_V1,HIS_CP024_SOURCE_IDS_V1,HIS_CP024_SOURCES_V1 } from "./his-cp024-facts-v1";
import { HIS_CP024_QL_NAMES_V1,HIS_CP024_SPECS_V1 } from "./his-cp024-review-specs-v1";
import { HIS_CP024_EXPLANATION_NOTES_V1 } from "./his-cp024-explanation-notes-v1";
import { HIS_CP015_FACTS_V1 } from "../national-movement-1885-1919/his-cp015-facts-v1";
import { HIS_CP016_FACTS_V1 } from "../national-movement-1919-1947/his-cp016-facts-v1";

export type HisCp024ReviewQuestion={
  questionId:string;chapterId:"HIS-001";cpId:"HIS-CP-024";qlId:string;qlName:string;
  difficulty:KnowledgeV1Difficulty;stem:string;options:string[];correctIndex:number;
  canonicalAnswer:string;explanation:string;sourceIds:string[];sourceFactIds:string[];
  reviewOnly:true;runtimeRegistered:false
};

const difficulty=(ql:number):KnowledgeV1Difficulty=>ql<=3?"Easy":ql<=8?"Medium":"Hard";
const canonicalExplanation=(ids:readonly string[])=>ids.map(id=>{
  const f=HIS_CP024_FACT_BY_ID_V1.get(id);
  if(!f)throw new Error(`Unknown HIS-CP-024 fact ${id}`);
  return f[1];
}).join(" ");
const sourceIds=(ids:readonly string[])=>[...new Set(ids.flatMap(id=>HIS_CP024_FACT_BY_ID_V1.get(id)?.[2]??[]))];
const normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const SOURCE_LEAK=/\b(?:NIOS|NCERT|UNESCO|textbook|Ministry of Culture|Gandhi Heritage Portal|Publications Division)\b/i;
const META_WORDING=/(?:school-level|this CP|review batch|internal wording|source fact|checkpoint)/i;
const MECHANICAL_STEM=/(?:\bbest describ(?:e|es)\b|\bassociated with\b|which correctly identifies|^how did\b|^what was the usual relationship\b|^what was the main purpose\b|^what effect did\b)/i;

export function generateHisCp024ReviewBatchV1():HisCp024ReviewQuestion[]{
  return HIS_CP024_SPECS_V1.map((s,i)=>{
    const n=i+1;
    const [ql,stem,answer,distractors,factIds]=s;
    const base=[answer,...distractors];
    const shift=i%4;
    const options=[...base.slice(shift),...base.slice(0,shift)];
    const correctIndex=options.indexOf(answer);
    const note=HIS_CP024_EXPLANATION_NOTES_V1[n];
    if(!note)throw new Error(`Missing HIS-CP-024 explanation note ${n}`);
    const explanation=`${canonicalExplanation(factIds)} ${note}`.trim();
    return{
      questionId:`HIS-CP024-V1-${String(n).padStart(3,"0")}`,
      chapterId:"HIS-001",cpId:"HIS-CP-024",
      qlId:`HIS-024-QL-${String(ql).padStart(3,"0")}`,
      qlName:HIS_CP024_QL_NAMES_V1[ql],
      difficulty:difficulty(ql),stem,options,correctIndex,canonicalAnswer:answer,explanation,
      sourceIds:sourceIds(factIds),sourceFactIds:[...factIds],reviewOnly:true,runtimeRegistered:false
    };
  });
}

export const HIS_CP024_REVIEW_BATCH_V1=Object.freeze(generateHisCp024ReviewBatchV1().map(q=>Object.freeze(q)));
export const HIS_CP024_REQUIRED_FACTS_V1=Object.freeze([...new Set(HIS_CP024_REVIEW_BATCH_V1.flatMap(q=>q.sourceFactIds))].sort());

export function auditHisCp024ReviewBatchV1(){
  const issues:string[]=[];
  const ids=new Set<string>(),semantic=new Set<string>();
  const qlCounts:Record<string,number>={};
  const answerPositions=[0,0,0,0];
  const difficultyCounts={Easy:0,Medium:0,Hard:0};
  const priorFacts=[...HIS_CP015_FACTS_V1,...HIS_CP016_FACTS_V1] as readonly (readonly [string,string,readonly string[]])[];
  const priorText=new Map(priorFacts.map(f=>[normalize(f[1]),f[0]] as const));

  for(const f of HIS_CP024_FACTS_V1){
    for(const s of f[2])if(!HIS_CP024_SOURCE_IDS_V1.has(s))issues.push(`UNKNOWN_SOURCE:${f[0]}:${s}`);
    const old=priorText.get(normalize(f[1]));
    if(old)issues.push(`V1_FACT_DUPLICATE:${f[0]}:${old}`);
    if(SOURCE_LEAK.test(f[1]))issues.push(`SOURCE_LEAK_FACT:${f[0]}`);
  }

  for(const q of HIS_CP024_REVIEW_BATCH_V1){
    if(ids.has(q.questionId))issues.push(`DUPLICATE_ID:${q.questionId}`);ids.add(q.questionId);
    const key=JSON.stringify([q.qlId,normalize(q.stem),[...q.options].map(normalize).sort(),normalize(q.canonicalAnswer)]);
    if(semantic.has(key))issues.push(`DUPLICATE_SEMANTIC:${q.questionId}`);semantic.add(key);
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]++;
    if(q.options.length!==4||new Set(q.options.map(normalize)).size!==4)issues.push(`BAD_OPTIONS:${q.questionId}`);
    if(q.correctIndex<0||q.options[q.correctIndex]!==q.canonicalAnswer)issues.push(`BAD_ANSWER:${q.questionId}`);else answerPositions[q.correctIndex]++;
    if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push(`MISSING_PROVENANCE:${q.questionId}`);
    if(SOURCE_LEAK.test(q.stem)||SOURCE_LEAK.test(q.explanation))issues.push(`SOURCE_LEAK:${q.questionId}`);
    if(META_WORDING.test(q.stem)||META_WORDING.test(q.explanation))issues.push(`META_WORDING:${q.questionId}`);
    if(MECHANICAL_STEM.test(q.stem))issues.push(`MECHANICAL_STEM:${q.questionId}`);
    if(q.stem.length>240)issues.push(`STEM_TOO_LONG:${q.questionId}:${q.stem.length}`);
    if(q.explanation.length<155)issues.push(`EXPLANATION_TOO_SHORT:${q.questionId}:${q.explanation.length}`);
    if(q.explanation.length>900)issues.push(`EXPLANATION_TOO_LONG:${q.questionId}:${q.explanation.length}`);
    if((q.explanation.match(/[.!?](?:\s|$)/g)??[]).length<2)issues.push(`EXPLANATION_NEEDS_CONTEXT:${q.questionId}`);
    if(q.difficulty==="Hard"&&q.sourceFactIds.length<2)issues.push(`WEAK_HARD_SINGLE_FACT:${q.questionId}`);
    if(!q.reviewOnly||q.runtimeRegistered)issues.push(`LIFECYCLE_BREACH:${q.questionId}`);
  }

  for(let i=1;i<=10;i++){const q=`HIS-024-QL-${String(i).padStart(3,"0")}`;if(qlCounts[q]!==6)issues.push(`QL_COUNT:${q}:${qlCounts[q]??0}`);}
  if(HIS_CP024_REVIEW_BATCH_V1.length!==60)issues.push(`QUESTION_COUNT:${HIS_CP024_REVIEW_BATCH_V1.length}`);
  if(HIS_CP024_FACTS_V1.length!==60)issues.push(`FACT_COUNT:${HIS_CP024_FACTS_V1.length}`);
  if(HIS_CP024_REQUIRED_FACTS_V1.length!==60)issues.push(`FACT_COVERAGE:${HIS_CP024_REQUIRED_FACTS_V1.length}/60`);
  if(Object.keys(HIS_CP024_EXPLANATION_NOTES_V1).length!==60)issues.push(`EXPLANATION_NOTE_COUNT:${Object.keys(HIS_CP024_EXPLANATION_NOTES_V1).length}`);
  if(Math.max(...answerPositions)-Math.min(...answerPositions)>1)issues.push(`ANSWER_POSITION_IMBALANCE:${answerPositions.join(",")}`);
  return{valid:issues.length===0,questionCount:HIS_CP024_REVIEW_BATCH_V1.length,semanticCount:semantic.size,canonicalFactCount:HIS_CP024_FACTS_V1.length,requiredFactCount:HIS_CP024_REQUIRED_FACTS_V1.length,sourceCount:HIS_CP024_SOURCES_V1.length,qlCounts,difficultyCounts,answerPositions,issues};
}
