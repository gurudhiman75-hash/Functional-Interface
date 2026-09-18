import fs from "node:fs";
import path from "node:path";

import { HIS_CP001_REVIEW_BATCH_V1 } from "./prehistory-harappan/his-cp001-review-v1";
import { HIS_CP001_FACTS_V1 } from "./prehistory-harappan/his-cp001-facts-v1";
import { HIS_CP002_REVIEW_BATCH_V1 } from "./vedic-age/his-cp002-review-v1";
import { HIS_CP002_FACTS_V1 } from "./vedic-age/his-cp002-facts-v1";
import { HIS_CP003_REVIEW_BATCH_V1 } from "./mahajanapadas-jainism-buddhism/his-cp003-review-v1";
import { HIS_CP003_FACTS_V1 } from "./mahajanapadas-jainism-buddhism/his-cp003-facts-v1";
import { HIS_CP004_REVIEW_BATCH_V1 } from "./mauryan-empire/his-cp004-review-v1";
import { HIS_CP004_FACTS_V1 } from "./mauryan-empire/his-cp004-facts-v1";
import { HIS_CP005_REVIEW_BATCH_V1 } from "./post-mauryan-sangam/his-cp005-review-v1";
import { HIS_CP005_FACTS_V1 } from "./post-mauryan-sangam/his-cp005-facts-v1";
import { HIS_CP006_REVIEW_BATCH_V1 } from "./gupta-post-gupta/his-cp006-review-v1";
import { HIS_CP006_FACTS_V1 } from "./gupta-post-gupta/his-cp006-facts-v1";
import { HIS_CP007_REVIEW_BATCH_V1 } from "./early-medieval-south-india/his-cp007-review-v1";
import { HIS_CP007_FACTS_V1 } from "./early-medieval-south-india/his-cp007-facts-v1";
import { HIS_CP008_REVIEW_BATCH_V1 } from "./delhi-sultanate/his-cp008-review-v1";
import { HIS_CP008_FACTS_V1 } from "./delhi-sultanate/his-cp008-facts-v1";
import { HIS_CP009_REVIEW_BATCH_V1 } from "./vijayanagara-bahmani-regional/his-cp009-review-v1";
import { HIS_CP009_FACTS_V1 } from "./vijayanagara-bahmani-regional/his-cp009-facts-v1";
import { HIS_CP010_REVIEW_BATCH_V1 } from "./mughal-empire/his-cp010-review-v1";
import { HIS_CP010_FACTS_V1 } from "./mughal-empire/his-cp010-facts-v1";
import { HIS_CP011_REVIEW_BATCH_V1 } from "./marathas-sikhs-eighteenth-century/his-cp011-review-v1";
import { HIS_CP011_FACTS_V1 } from "./marathas-sikhs-eighteenth-century/his-cp011-facts-v1";
import { HIS_CP012_REVIEW_BATCH_V1 } from "./europeans-british-expansion/his-cp012-review-v1";
import { HIS_CP012_FACTS_V1 } from "./europeans-british-expansion/his-cp012-facts-v1";
import { HIS_CP013_REVIEW_BATCH_V1 } from "./british-administration-economic-policies/his-cp013-review-v1";
import { HIS_CP013_FACTS_V1 } from "./british-administration-economic-policies/his-cp013-facts-v1";
import { HIS_CP014_REVIEW_BATCH_V1 } from "./revolt-1857-social-reform/his-cp014-review-v1";
import { HIS_CP014_FACTS_V1 } from "./revolt-1857-social-reform/his-cp014-facts-v1";
import { HIS_CP015_REVIEW_BATCH_V1 } from "./national-movement-1885-1919/his-cp015-review-v1";
import { HIS_CP015_FACTS_V1 } from "./national-movement-1885-1919/his-cp015-facts-v1";
import { HIS_CP016_REVIEW_BATCH_V1 } from "./national-movement-1919-1947/his-cp016-review-v1";
import { HIS_CP016_FACTS_V1 } from "./national-movement-1919-1947/his-cp016-facts-v1";

type Q = {
  questionId:string; cpId:string; qlId:string; qlName:string; difficulty:string;
  stem:string; options:string[]|readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceFactIds:string[]|readonly string[]; sourceIds:string[]|readonly string[];
};
type F = readonly [string,string,readonly string[]];

type Package = { cpId:string; questions:readonly Q[]; facts:readonly F[] };
const packages:Package[] = [
  {cpId:"HIS-CP-001",questions:HIS_CP001_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP001_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-002",questions:HIS_CP002_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP002_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-003",questions:HIS_CP003_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP003_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-004",questions:HIS_CP004_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP004_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-005",questions:HIS_CP005_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP005_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-006",questions:HIS_CP006_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP006_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-007",questions:HIS_CP007_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP007_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-008",questions:HIS_CP008_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP008_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-009",questions:HIS_CP009_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP009_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-010",questions:HIS_CP010_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP010_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-011",questions:HIS_CP011_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP011_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-012",questions:HIS_CP012_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP012_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-013",questions:HIS_CP013_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP013_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-014",questions:HIS_CP014_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP014_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-015",questions:HIS_CP015_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP015_FACTS_V1 as readonly F[]},
  {cpId:"HIS-CP-016",questions:HIS_CP016_REVIEW_BATCH_V1 as readonly Q[],facts:HIS_CP016_FACTS_V1 as readonly F[]},
];

const norm=(s:string)=>s.toLowerCase().normalize("NFKD").replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g," ").trim();
const sentenceCount=(s:string)=>(s.match(/[.!?](?:\s|$)/g)??[]).length;
const SOURCE_META=/\b(?:nios|ncert|unesco|textbook|school[- ]level|this cp|review batch|canonical fact|source fact|in the nios account|nios (?:places|records|notes|lists))\b/i;
const DIRECT_RECALL=/^(?:who\b|where\b|when\b|in which year\b|by which year\b|which year\b|which ruler\b|which person\b|which city\b|which state\b|which dynasty\b|which language\b|which script\b|which battle\b|which act\b|who founded\b|who wrote\b|who composed\b|who succeeded\b|who served\b|what was\b|what is\b)/i;
const CATEGORICAL_DISTRACTOR=/\b(?:only|every|all|none|never|completely|complete|permanently|immediately|entirely)\b/i;
const ALL_TRUE=/^(?:1,\s*2\s+and\s+3|1,\s*2,\s*3\s+and\s+4|both\s+1\s+and\s+2\s+are\s+correct)$/i;
const stop=new Set("which what who where when why how the a an of in on at to from for with and or was were is are did does do this that these those following statement statements correct best about most main major one two three into under after before during its their his her as by".split(" "));
const tokens=(s:string)=>new Set(norm(s).split(" ").filter(x=>x.length>=4&&!stop.has(x)));
const jaccard=(a:Set<string>,b:Set<string>)=>{let inter=0;for(const x of a)if(b.has(x))inter++;const union=a.size+b.size-inter;return union?inter/union:0;};
const template=(s:string)=>{
  const n=norm(s);
  if(n.startsWith("consider the")) return "CONSIDER_STATEMENTS";
  if(/^which sequence\b/.test(n)||/^arrange\b/.test(n)) return "SEQUENCE";
  if(/^which (?:pair|set|combination)\b/.test(n)) return "MATCHING_SET";
  if(/^which statement\b/.test(n)||/^which option\b/.test(n)||/^which comparison\b/.test(n)) return "INTERPRETIVE_CHOICE";
  if(/^who\b/.test(n)) return "WHO";
  if(/^what\b/.test(n)) return "WHAT";
  if(/^where\b/.test(n)) return "WHERE";
  if(/^when\b|^in which year\b|^by which year\b/.test(n)) return "WHEN_YEAR";
  if(/^why\b/.test(n)) return "WHY";
  if(/^how\b/.test(n)) return "HOW";
  if(/^which\b/.test(n)) return "WHICH";
  return "OTHER";
};

const allQuestions=packages.flatMap(p=>p.questions.map(q=>({p,q})));
const exactStemMap=new Map<string,{cpId:string;questionId:string;stem:string}[]>();
for(const {p,q} of allQuestions){const k=norm(q.stem);const a=exactStemMap.get(k)??[];a.push({cpId:p.cpId,questionId:q.questionId,stem:q.stem});exactStemMap.set(k,a);}
const exactDuplicates=[...exactStemMap.values()].filter(v=>v.length>1);

const nearDuplicates:{a:string;b:string;cpA:string;cpB:string;score:number;stemA:string;stemB:string}[]=[];
for(let i=0;i<allQuestions.length;i++){
  const A=allQuestions[i]!; const ta=tokens(A.q.stem); if(ta.size<4)continue;
  for(let j=i+1;j<allQuestions.length;j++){
    const B=allQuestions[j]!; if(norm(A.q.stem)===norm(B.q.stem))continue;
    const tb=tokens(B.q.stem); if(tb.size<4)continue;
    const score=jaccard(ta,tb);
    if(score>=0.86)nearDuplicates.push({a:A.q.questionId,b:B.q.questionId,cpA:A.p.cpId,cpB:B.p.cpId,score:Number(score.toFixed(3)),stemA:A.q.stem,stemB:B.q.stem});
  }
}
nearDuplicates.sort((a,b)=>b.score-a.score);

const packageReports=packages.map(p=>{
  const factMap=new Map(p.facts.map(f=>[f[0],f[1]]));
  const used=new Map<string,number>();
  for(const q of p.questions)for(const id of q.sourceFactIds)used.set(id,(used.get(id)??0)+1);
  const missingFacts=p.facts.map(f=>f[0]).filter(id=>!used.has(id));
  const overusedFacts=[...used.entries()].filter(([,n])=>n>=3).sort((a,b)=>b[1]-a[1]);
  const difficultyCounts:Record<string,number>={Easy:0,Medium:0,Hard:0};
  const directRecall:Record<string,string[]>={Easy:[],Medium:[],Hard:[]};
  const templateCounts:Record<string,number>={};
  const answerPositions=[0,0,0,0];
  const shortExplanations:string[]=[]; const oneSentenceExplanations:string[]=[]; const mechanicalExplanations:string[]=[];
  const metaLeaks:{id:string;where:string;text:string}[]=[]; const longStems:{id:string;len:number}[]=[];
  const allTrueHard:string[]=[]; const weakHardCandidates:string[]=[]; const answerLengthGiveaway:string[]=[]; const categoricalDistractorQuestions:string[]=[];
  let stemChars=0, explanationChars=0;
  for(const q of p.questions){
    difficultyCounts[q.difficulty]=(difficultyCounts[q.difficulty]??0)+1;
    if(q.correctIndex>=0&&q.correctIndex<4)answerPositions[q.correctIndex]++;
    stemChars+=q.stem.length; explanationChars+=q.explanation.length;
    templateCounts[template(q.stem)]=(templateCounts[template(q.stem)]??0)+1;
    if(DIRECT_RECALL.test(q.stem)) (directRecall[q.difficulty]??=[]).push(q.questionId);
    if(q.stem.length>190)longStems.push({id:q.questionId,len:q.stem.length});
    if(q.explanation.length<140)shortExplanations.push(q.questionId);
    if(sentenceCount(q.explanation)<2)oneSentenceExplanations.push(q.questionId);
    const expected=q.sourceFactIds.map(id=>factMap.get(id)).filter(Boolean).join(" ");
    if(expected&&norm(expected)===norm(q.explanation))mechanicalExplanations.push(q.questionId);
    if(SOURCE_META.test(q.stem))metaLeaks.push({id:q.questionId,where:"stem",text:q.stem});
    if(SOURCE_META.test(q.explanation))metaLeaks.push({id:q.questionId,where:"explanation",text:q.explanation});
    if(q.difficulty==="Hard"&&ALL_TRUE.test(q.canonicalAnswer.trim()))allTrueHard.push(q.questionId);
    if(q.difficulty==="Hard"){
      const arrows=(q.canonicalAnswer.match(/→/g)??[]).length;
      if(DIRECT_RECALL.test(q.stem)||ALL_TRUE.test(q.canonicalAnswer.trim())||(template(q.stem)==="SEQUENCE"&&arrows<=1))weakHardCandidates.push(q.questionId);
    }
    const correctLen=q.canonicalAnswer.length;
    const wrong=q.options.filter((_,i)=>i!==q.correctIndex).map(o=>String(o).length);
    const maxWrong=Math.max(1,...wrong), avgWrong=wrong.reduce((a,b)=>a+b,0)/Math.max(1,wrong.length);
    if(correctLen>Math.max(maxWrong*1.65,avgWrong*1.9)&&correctLen>=35)answerLengthGiveaway.push(q.questionId);
    if(q.options.some((o,i)=>i!==q.correctIndex&&CATEGORICAL_DISTRACTOR.test(String(o))))categoricalDistractorQuestions.push(q.questionId);
  }
  return {
    cpId:p.cpId,questionCount:p.questions.length,factCount:p.facts.length,usedFactCount:used.size,missingFacts,overusedFacts,
    difficultyCounts,answerPositions,avgStemChars:Number((stemChars/p.questions.length).toFixed(1)),avgExplanationChars:Number((explanationChars/p.questions.length).toFixed(1)),
    shortExplanationCount:shortExplanations.length,oneSentenceExplanationCount:oneSentenceExplanations.length,mechanicalExplanationCount:mechanicalExplanations.length,
    shortExplanations,oneSentenceExplanations,mechanicalExplanations,metaLeaks,longStems,
    directRecallCounts:{Easy:directRecall.Easy.length,Medium:directRecall.Medium.length,Hard:directRecall.Hard.length},directRecall,
    templateCounts,allTrueHardCount:allTrueHard.length,allTrueHard,weakHardCandidateCount:weakHardCandidates.length,weakHardCandidates,
    answerLengthGiveawayCount:answerLengthGiveaway.length,answerLengthGiveaway,
    categoricalDistractorQuestionCount:categoricalDistractorQuestions.length,categoricalDistractorQuestions,
  };
});

const totals={
  questionCount:allQuestions.length,
  factCount:packages.reduce((n,p)=>n+p.facts.length,0),
  usedFactCount:packageReports.reduce((n,p)=>n+p.usedFactCount,0),
  missingFactCount:packageReports.reduce((n,p)=>n+p.missingFacts.length,0),
  shortExplanationCount:packageReports.reduce((n,p)=>n+p.shortExplanationCount,0),
  oneSentenceExplanationCount:packageReports.reduce((n,p)=>n+p.oneSentenceExplanationCount,0),
  mechanicalExplanationCount:packageReports.reduce((n,p)=>n+p.mechanicalExplanationCount,0),
  metaLeakCount:packageReports.reduce((n,p)=>n+p.metaLeaks.length,0),
  longStemCount:packageReports.reduce((n,p)=>n+p.longStems.length,0),
  mediumDirectRecallCount:packageReports.reduce((n,p)=>n+p.directRecallCounts.Medium,0),
  hardDirectRecallCount:packageReports.reduce((n,p)=>n+p.directRecallCounts.Hard,0),
  allTrueHardCount:packageReports.reduce((n,p)=>n+p.allTrueHardCount,0),
  weakHardCandidateCount:packageReports.reduce((n,p)=>n+p.weakHardCandidateCount,0),
  answerLengthGiveawayCount:packageReports.reduce((n,p)=>n+p.answerLengthGiveawayCount,0),
  categoricalDistractorQuestionCount:packageReports.reduce((n,p)=>n+p.categoricalDistractorQuestionCount,0),
  exactDuplicateStemGroups:exactDuplicates.length,
  nearDuplicatePairs:nearDuplicates.length,
};

const report={generatedAt:new Date().toISOString(),heuristicNotice:"Candidate flags are mechanical audit signals, not automatic editorial verdicts.",totals,packages:packageReports,exactDuplicates,nearDuplicates:nearDuplicates.slice(0,200)};
const outDir=path.resolve(process.cwd(),"dist/history-audit/HIS-001-V1-EXHAUSTIVE-AUDIT");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"history-v1-exhaustive-audit.json"),JSON.stringify(report,null,2));

const md:string[]=[];
md.push("# HIS-001 History V1 — Mechanical Exhaustive Audit");
md.push("");
md.push(`Generated: ${report.generatedAt}`);
md.push("");
md.push("> Heuristic flags are audit candidates, not automatic editorial verdicts. They must be combined with factual/source review.");
md.push("");
md.push("## Chapter totals");
md.push("");
md.push(`- Questions: **${totals.questionCount}**`);
md.push(`- Canonical facts: **${totals.factCount}**; represented facts: **${totals.usedFactCount}**; unused facts: **${totals.missingFactCount}**`);
md.push(`- Explanations under 140 chars: **${totals.shortExplanationCount}**`);
md.push(`- Explanations with fewer than 2 sentences: **${totals.oneSentenceExplanationCount}**`);
md.push(`- Explanations mechanically equal to concatenated canonical fact text: **${totals.mechanicalExplanationCount}**`);
md.push(`- Source/meta learner-text leaks: **${totals.metaLeakCount}**`);
md.push(`- Stems over 190 chars: **${totals.longStemCount}**`);
md.push(`- Medium direct-recall heuristic: **${totals.mediumDirectRecallCount}**`);
md.push(`- Hard direct-recall heuristic: **${totals.hardDirectRecallCount}**`);
md.push(`- Hard all-statements-correct pattern: **${totals.allTrueHardCount}**`);
md.push(`- Weak-Hard candidates (heuristic): **${totals.weakHardCandidateCount}**`);
md.push(`- Correct-option length giveaway candidates: **${totals.answerLengthGiveawayCount}**`);
md.push(`- Questions with categorical wording in at least one distractor: **${totals.categoricalDistractorQuestionCount}**`);
md.push(`- Exact duplicate stem groups: **${totals.exactDuplicateStemGroups}**`);
md.push(`- Near-duplicate stem pairs (Jaccard >= 0.86): **${totals.nearDuplicatePairs}**`);
md.push("");
md.push("## CP matrix");
md.push("");
md.push("| CP | Q | Facts used/total | E/M/H | Short exp | <2 sent | Mechanical exp | Medium recall | Hard recall | All-true Hard | Weak Hard | Meta leaks |");
md.push("|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|");
for(const p of packageReports){md.push(`| ${p.cpId} | ${p.questionCount} | ${p.usedFactCount}/${p.factCount} | ${p.difficultyCounts.Easy}/${p.difficultyCounts.Medium}/${p.difficultyCounts.Hard} | ${p.shortExplanationCount} | ${p.oneSentenceExplanationCount} | ${p.mechanicalExplanationCount} | ${p.directRecallCounts.Medium} | ${p.directRecallCounts.Hard} | ${p.allTrueHardCount} | ${p.weakHardCandidateCount} | ${p.metaLeaks.length} |`);}
md.push("");
for(const p of packageReports){
  md.push(`## ${p.cpId}`); md.push("");
  md.push(`- Unused canonical facts: ${p.missingFacts.length? p.missingFacts.map(x=>`\`${x}\``).join(", "):"none"}`);
  md.push(`- Direct recall IDs — Medium: ${p.directRecall.Medium.length? p.directRecall.Medium.join(", "):"none"}`);
  md.push(`- Direct recall IDs — Hard: ${p.directRecall.Hard.length? p.directRecall.Hard.join(", "):"none"}`);
  md.push(`- Weak-Hard candidate IDs: ${p.weakHardCandidates.length?p.weakHardCandidates.join(", "):"none"}`);
  md.push(`- All-statements-correct Hard IDs: ${p.allTrueHard.length?p.allTrueHard.join(", "):"none"}`);
  md.push(`- Short explanation count: ${p.shortExplanationCount}; one-sentence count: ${p.oneSentenceExplanationCount}; mechanical count: ${p.mechanicalExplanationCount}`);
  if(p.metaLeaks.length) md.push(`- Meta/source leaks: ${p.metaLeaks.map(x=>`${x.id} (${x.where})`).join(", ")}`);
  if(p.answerLengthGiveaway.length) md.push(`- Correct-option length giveaway candidates: ${p.answerLengthGiveaway.join(", ")}`);
  if(p.overusedFacts.length) md.push(`- Facts used in 3+ questions: ${p.overusedFacts.slice(0,20).map(([id,n])=>`${id}×${n}`).join(", ")}`);
  md.push(`- Stem templates: ${Object.entries(p.templateCounts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${v}`).join(", ")}`);
  md.push("");
}
md.push("## Exact duplicate stems");md.push("");
if(!exactDuplicates.length)md.push("None.");else for(const g of exactDuplicates)md.push(`- ${g.map(x=>`${x.cpId}/${x.questionId}`).join("; ")} — ${g[0]!.stem}`);
md.push("");md.push("## Highest near-duplicate stem pairs");md.push("");
for(const d of nearDuplicates.slice(0,100))md.push(`- **${d.score}** ${d.cpA}/${d.a} ↔ ${d.cpB}/${d.b}\n  - ${d.stemA}\n  - ${d.stemB}`);
fs.writeFileSync(path.join(outDir,"history-v1-exhaustive-audit.md"),md.join("\n"));
console.log(JSON.stringify({outDir,totals,cpSummary:packageReports.map(p=>({cpId:p.cpId,q:p.questionCount,facts:`${p.usedFactCount}/${p.factCount}`,difficulty:p.difficultyCounts,short:p.shortExplanationCount,mechanical:p.mechanicalExplanationCount,mediumRecall:p.directRecallCounts.Medium,hardRecall:p.directRecallCounts.Hard,allTrueHard:p.allTrueHardCount,weakHard:p.weakHardCandidateCount,metaLeaks:p.metaLeaks.length}))},null,2));
