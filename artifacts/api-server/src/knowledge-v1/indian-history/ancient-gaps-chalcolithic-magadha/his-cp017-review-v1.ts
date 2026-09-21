import type { KnowledgeV1Difficulty } from "../../types";
import { HIS_CP017_FACTS_V1,HIS_CP017_FACT_BY_ID_V1,HIS_CP017_SOURCE_IDS_V1,HIS_CP017_SOURCES_V1 } from "./his-cp017-facts-v1";
import { HIS_CP017_QL_NAMES_V1,HIS_CP017_SPECS_V1 } from "./his-cp017-review-specs-v1";
import { HIS_CP017_EXPLANATION_NOTES_V1,HIS_CP017_FULL_EXPLANATION_OVERRIDES_V1 } from "./his-cp017-explanation-notes-v1";
import { HIS_CP001_FACTS_V1 } from "../prehistory-harappan/his-cp001-facts-v1";
import { HIS_CP003_FACTS_V1 } from "../mahajanapadas-jainism-buddhism/his-cp003-facts-v1";
import { HIS_CP004_FACTS_V1 } from "../mauryan-empire/his-cp004-facts-v1";

export type HisCp017ReviewQuestion={
  questionId:string;chapterId:"HIS-001";cpId:"HIS-CP-017";qlId:string;qlName:string;
  difficulty:KnowledgeV1Difficulty;stem:string;options:string[];correctIndex:number;
  canonicalAnswer:string;explanation:string;sourceIds:string[];sourceFactIds:string[];
  reviewOnly:true;runtimeRegistered:false
};

const difficulty=(ql:number):KnowledgeV1Difficulty=>ql<=3?"Easy":ql<=8?"Medium":"Hard";
const canonicalExplanation=(ids:readonly string[])=>ids.map(id=>{
  const f=HIS_CP017_FACT_BY_ID_V1.get(id);
  if(!f)throw new Error(`Unknown HIS-CP-017 fact ${id}`);
  return f[1];
}).join(" ");
const sourceIds=(ids:readonly string[])=>[...new Set(ids.flatMap(id=>HIS_CP017_FACT_BY_ID_V1.get(id)?.[2]??[]))];
const normalize=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const SOURCE_LEAK=/\b(?:NIOS|NCERT|UNESCO|textbook)\b/i;
const META_WORDING=/(?:school-level|this CP|review batch|internal wording|source fact|checkpoint)/i;
const AWKWARD_STEM=/(?:\bbest describ(?:e|es)\b|\bassociated with\b|associated with which phase of the:|commonly called the:|what happened regarding|which correctly identifies)/i;

export function generateHisCp017ReviewBatchV1():HisCp017ReviewQuestion[]{
  return HIS_CP017_SPECS_V1.map((s,i)=>{
    const n=i+1;
    const [ql,stem,answer,distractors,factIds]=s;
    const base=[answer,...distractors];
    const shift=i%4;
    const options=[...base.slice(shift),...base.slice(0,shift)];
    const correctIndex=options.indexOf(answer);
    const explanation=HIS_CP017_FULL_EXPLANATION_OVERRIDES_V1[n]
      ?? `${canonicalExplanation(factIds)} ${HIS_CP017_EXPLANATION_NOTES_V1[n]??""}`.trim();
    return{
      questionId:`HIS-CP017-V1-${String(n).padStart(3,"0")}`,
      chapterId:"HIS-001",cpId:"HIS-CP-017",
      qlId:`HIS-017-QL-${String(ql).padStart(3,"0")}`,
      qlName:HIS_CP017_QL_NAMES_V1[ql],
      difficulty:difficulty(ql),stem,options,correctIndex,canonicalAnswer:answer,explanation,
      sourceIds:sourceIds(factIds),sourceFactIds:[...factIds],reviewOnly:true,runtimeRegistered:false
    };
  });
}

export const HIS_CP017_REVIEW_BATCH_V1=Object.freeze(generateHisCp017ReviewBatchV1().map(q=>Object.freeze(q)));
export const HIS_CP017_REQUIRED_FACTS_V1=Object.freeze([...new Set(HIS_CP017_REVIEW_BATCH_V1.flatMap(q=>q.sourceFactIds))].sort());

export function auditHisCp017ReviewBatchV1(){
  const issues:string[]=[];
  const ids=new Set<string>(),semantic=new Set<string>();
  const qlCounts:Record<string,number>={};
  const answerPositions=[0,0,0,0];
  const difficultyCounts={Easy:0,Medium:0,Hard:0};
  const v1Facts=[...HIS_CP001_FACTS_V1,...HIS_CP003_FACTS_V1,...HIS_CP004_FACTS_V1];
  const v1Text=new Map(v1Facts.map(f=>[normalize(f[1]),f[0]] as const));

  for(const f of HIS_CP017_FACTS_V1){
    for(const s of f[2])if(!HIS_CP017_SOURCE_IDS_V1.has(s))issues.push(`UNKNOWN_SOURCE:${f[0]}:${s}`);
    const old=v1Text.get(normalize(f[1]));
    if(old)issues.push(`V1_FACT_DUPLICATE:${f[0]}:${old}`);
  }

  for(const q of HIS_CP017_REVIEW_BATCH_V1){
    if(ids.has(q.questionId))issues.push(`DUPLICATE_ID:${q.questionId}`);
    ids.add(q.questionId);
    const key=JSON.stringify([q.qlId,normalize(q.stem),[...q.options].map(normalize).sort(),normalize(q.canonicalAnswer)]);
    if(semantic.has(key))issues.push(`DUPLICATE_SEMANTIC:${q.questionId}`);
    semantic.add(key);
    qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;
    difficultyCounts[q.difficulty]++;
    if(q.options.length!==4||new Set(q.options.map(normalize)).size!==4)issues.push(`BAD_OPTIONS:${q.questionId}`);
    if(q.correctIndex<0||q.options[q.correctIndex]!==q.canonicalAnswer)issues.push(`BAD_ANSWER:${q.questionId}`);
    else answerPositions[q.correctIndex]++;
    if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push(`MISSING_PROVENANCE:${q.questionId}`);
    if(SOURCE_LEAK.test(q.stem))issues.push(`SOURCE_NAME_IN_STEM:${q.questionId}`);
    if(SOURCE_LEAK.test(q.explanation))issues.push(`SOURCE_NAME_IN_EXPLANATION:${q.questionId}`);
    if(META_WORDING.test(q.stem))issues.push(`META_WORDING_IN_STEM:${q.questionId}`);
    if(META_WORDING.test(q.explanation))issues.push(`META_WORDING_IN_EXPLANATION:${q.questionId}`);
    if(AWKWARD_STEM.test(q.stem))issues.push(`AWKWARD_STEM:${q.questionId}`);
    if(q.stem.length>190)issues.push(`STEM_TOO_LONG:${q.questionId}:${q.stem.length}`);
    if(q.explanation.length<140)issues.push(`EXPLANATION_TOO_SHORT:${q.questionId}:${q.explanation.length}`);
    if(q.explanation.length>500)issues.push(`EXPLANATION_TOO_LONG:${q.questionId}:${q.explanation.length}`);
    if((q.explanation.match(/[.!?](?:\s|$)/g)??[]).length<2)issues.push(`EXPLANATION_NEEDS_CONTEXT:${q.questionId}`);
    if(q.explanation.trim()===canonicalExplanation(q.sourceFactIds).trim())issues.push(`MECHANICAL_EXPLANATION:${q.questionId}`);
    if(q.difficulty==="Hard"&&q.sourceFactIds.length<2)issues.push(`WEAK_HARD_SINGLE_FACT:${q.questionId}`);
    if(!q.reviewOnly||q.runtimeRegistered)issues.push(`LIFECYCLE_BREACH:${q.questionId}`);
  }

  for(let i=1;i<=10;i++){
    const q=`HIS-017-QL-${String(i).padStart(3,"0")}`;
    if(qlCounts[q]!==6)issues.push(`QL_COUNT:${q}:${qlCounts[q]??0}`);
  }
  if(HIS_CP017_REVIEW_BATCH_V1.length!==60)issues.push(`QUESTION_COUNT:${HIS_CP017_REVIEW_BATCH_V1.length}`);
  if(semantic.size!==60)issues.push(`SEMANTIC_COUNT:${semantic.size}`);
  if(HIS_CP017_REQUIRED_FACTS_V1.length!==HIS_CP017_FACTS_V1.length)issues.push(`FACT_COVERAGE:${HIS_CP017_REQUIRED_FACTS_V1.length}/${HIS_CP017_FACTS_V1.length}`);
  if(Math.max(...answerPositions)-Math.min(...answerPositions)>1)issues.push(`ANSWER_POSITION_IMBALANCE:${answerPositions.join(",")}`);

  return{
    valid:issues.length===0,questionCount:HIS_CP017_REVIEW_BATCH_V1.length,semanticCount:semantic.size,
    qlCounts,difficultyCounts,answerPositions,requiredFactCount:HIS_CP017_REQUIRED_FACTS_V1.length,
    sourceCount:HIS_CP017_SOURCES_V1.length,canonicalFactCount:HIS_CP017_FACTS_V1.length,issues
  };
}
