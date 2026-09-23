import fs from "node:fs";
import path from "node:path";

import { HIS_CP017_REVIEW_BATCH_V1 } from "./ancient-gaps-chalcolithic-magadha/his-cp017-review-v1";
import { HIS_CP017_FACTS_V1 } from "./ancient-gaps-chalcolithic-magadha/his-cp017-facts-v1";
import { HIS_CP018_REVIEW_BATCH_V1 } from "./ancient-intellectual-art-travellers/his-cp018-review-v1";
import { HIS_CP018_FACTS_V1 } from "./ancient-intellectual-art-travellers/his-cp018-facts-v1";
import { HIS_CP019_REVIEW_BATCH_V1 } from "./early-medieval-north-india/his-cp019-review-v1";
import { HIS_CP019_FACTS_V1 } from "./early-medieval-north-india/his-cp019-facts-v1";
import { HIS_CP020_REVIEW_BATCH_V1 } from "./medieval-economy-society/his-cp020-review-v1";
import { HIS_CP020_FACTS_V1 } from "./medieval-economy-society/his-cp020-facts-v1";
import { HIS_CP021_REVIEW_BATCH_V1 } from "./medieval-cultural-synthesis/his-cp021-review-v1";
import { HIS_CP021_FACTS_V1 } from "./medieval-cultural-synthesis/his-cp021-facts-v1";
import { HIS_CP022_REVIEW_BATCH_V1 } from "./popular-resistance-company-rule/his-cp022-review-v1";
import { HIS_CP022_FACTS_V1 } from "./popular-resistance-company-rule/his-cp022-facts-v1";
import { HIS_CP023_REVIEW_BATCH_V1 } from "./colonial-education-press-reform/his-cp023-review-v1";
import { HIS_CP023_FACTS_V1 } from "./colonial-education-press-reform/his-cp023-facts-v1";
import { HIS_CP024_REVIEW_BATCH_V1 } from "./national-movement-supplements/his-cp024-review-v1";
import { HIS_CP024_FACTS_V1 } from "./national-movement-supplements/his-cp024-facts-v1";

type Question = Readonly<{
  questionId:string;
  cpId:string;
  qlId:string;
  qlName:string;
  difficulty:"Easy"|"Medium"|"Hard";
  stem:string;
  options:readonly string[];
  correctIndex:number;
  canonicalAnswer:string;
  explanation:string;
  sourceFactIds:readonly string[];
  sourceIds:readonly string[];
}>;
type Fact = readonly [string,string,readonly string[]];

const packages = [
  ["HIS-CP-017",HIS_CP017_REVIEW_BATCH_V1,HIS_CP017_FACTS_V1],
  ["HIS-CP-018",HIS_CP018_REVIEW_BATCH_V1,HIS_CP018_FACTS_V1],
  ["HIS-CP-019",HIS_CP019_REVIEW_BATCH_V1,HIS_CP019_FACTS_V1],
  ["HIS-CP-020",HIS_CP020_REVIEW_BATCH_V1,HIS_CP020_FACTS_V1],
  ["HIS-CP-021",HIS_CP021_REVIEW_BATCH_V1,HIS_CP021_FACTS_V1],
  ["HIS-CP-022",HIS_CP022_REVIEW_BATCH_V1,HIS_CP022_FACTS_V1],
  ["HIS-CP-023",HIS_CP023_REVIEW_BATCH_V1,HIS_CP023_FACTS_V1],
  ["HIS-CP-024",HIS_CP024_REVIEW_BATCH_V1,HIS_CP024_FACTS_V1],
] as const;

const norm=(s:string)=>s.toLowerCase().normalize("NFKD").replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g," ").trim();
const sentenceCount=(s:string)=>(s.match(/[.!?](?:\s|$)/g)??[]).length;
const mechanicalStem=/\b(?:best describes?|associated with|which correctly identifies?)\b/i;
const sourceLeak=/\b(?:nios|ncert|review batch|canonical fact|source fact|this cp)\b/i;

const issues:string[]=[];
const reports:any[]=[];
const seenQuestionIds=new Set<string>();
const seenStems=new Map<string,string>();
let totalQuestions=0;
let totalFacts=0;

for(const [cpId,rawQuestions,rawFacts] of packages){
  const questions=rawQuestions as readonly Question[];
  const facts=rawFacts as readonly Fact[];
  totalQuestions+=questions.length;
  totalFacts+=facts.length;

  const factIds=new Set(facts.map(f=>f[0]));
  const usedFacts=new Set<string>();
  const difficulties={Easy:0,Medium:0,Hard:0};
  const answerPositions=[0,0,0,0];
  const qlCounts=new Map<string,number>();
  const cpIssues:string[]=[];

  if(questions.length!==60) cpIssues.push(`expected 60 questions, found ${questions.length}`);
  if(facts.length!==60) cpIssues.push(`expected 60 canonical facts, found ${facts.length}`);

  for(const q of questions){
    if(q.cpId!==cpId) cpIssues.push(`${q.questionId}: cpId is ${q.cpId}`);
    if(seenQuestionIds.has(q.questionId)) cpIssues.push(`${q.questionId}: duplicate questionId across V2`);
    seenQuestionIds.add(q.questionId);

    const stemKey=norm(q.stem);
    const previous=seenStems.get(stemKey);
    if(previous) cpIssues.push(`${q.questionId}: exact duplicate stem of ${previous}`);
    else seenStems.set(stemKey,q.questionId);

    difficulties[q.difficulty]++;
    if(q.correctIndex<0||q.correctIndex>3) cpIssues.push(`${q.questionId}: invalid correctIndex ${q.correctIndex}`);
    else answerPositions[q.correctIndex]++;
    if(q.options.length!==4) cpIssues.push(`${q.questionId}: expected 4 options, found ${q.options.length}`);
    if(q.options[q.correctIndex]!==q.canonicalAnswer) cpIssues.push(`${q.questionId}: canonicalAnswer does not match correct option`);

    qlCounts.set(q.qlId,(qlCounts.get(q.qlId)??0)+1);

    if(q.stem.length>190) cpIssues.push(`${q.questionId}: stem exceeds 190 characters`);
    if(mechanicalStem.test(q.stem)) cpIssues.push(`${q.questionId}: mechanical stem wording`);
    if(sourceLeak.test(q.stem)||sourceLeak.test(q.explanation)) cpIssues.push(`${q.questionId}: learner-facing source/meta leakage`);
    if(q.explanation.length<120) cpIssues.push(`${q.questionId}: explanation under 120 characters`);
    if(sentenceCount(q.explanation)<2) cpIssues.push(`${q.questionId}: explanation has fewer than 2 sentences`);

    for(const factId of q.sourceFactIds){
      if(!factIds.has(factId)) cpIssues.push(`${q.questionId}: unknown source fact ${factId}`);
      usedFacts.add(factId);
    }
  }

  if(difficulties.Easy!==18||difficulties.Medium!==30||difficulties.Hard!==12){
    cpIssues.push(`difficulty split is ${difficulties.Easy}/${difficulties.Medium}/${difficulties.Hard}, expected 18/30/12`);
  }
  if(answerPositions.some(n=>n!==15)){
    cpIssues.push(`answer positions are ${answerPositions.join("/")}, expected 15/15/15/15`);
  }
  if(qlCounts.size!==10||[...qlCounts.values()].some(n=>n!==6)){
    cpIssues.push(`QL distribution must be 10 QLs × 6 questions; found ${qlCounts.size} QLs with counts ${[...qlCounts.entries()].map(([id,n])=>`${id}=${n}`).join(", ")}`);
  }
  const unusedFacts=[...factIds].filter(id=>!usedFacts.has(id));
  if(unusedFacts.length) cpIssues.push(`unused facts: ${unusedFacts.join(", ")}`);

  reports.push({
    cpId,
    questions:questions.length,
    facts:facts.length,
    representedFacts:usedFacts.size,
    difficulty:difficulties,
    answerPositions,
    qls:qlCounts.size,
    issues:cpIssues,
  });
  for(const issue of cpIssues) issues.push(`${cpId}: ${issue}`);
}

if(totalQuestions!==480) issues.push(`V2 total questions expected 480, found ${totalQuestions}`);
if(totalFacts!==480) issues.push(`V2 total canonical facts expected 480, found ${totalFacts}`);

const result={
  valid:issues.length===0,
  v1FrozenQuestions:954,
  v1FrozenFacts:899,
  v2Questions:totalQuestions,
  v2Facts:totalFacts,
  chapterQuestions:954+totalQuestions,
  chapterFacts:899+totalFacts,
  cpCount:packages.length,
  reports,
  issues,
};

const outDir=path.resolve(process.cwd(),"dist/history-audit/HIS-001-V2-EXPANSION-AUDIT");
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"history-v2-expansion-audit.json"),JSON.stringify(result,null,2));

const md=[
  "# HIS-001 History V2 — Expansion Qualification Audit",
  "",
  `Status: **${result.valid?"PASS":"FAIL"}**`,
  "",
  `- V1 frozen questions: **${result.v1FrozenQuestions}**`,
  `- V2 supplemental questions: **${result.v2Questions}**`,
  `- Full English chapter questions: **${result.chapterQuestions}**`,
  `- V1 frozen canonical facts: **${result.v1FrozenFacts}**`,
  `- V2 supplemental canonical facts: **${result.v2Facts}**`,
  `- Full English chapter canonical facts: **${result.chapterFacts}**`,
  `- Supplemental CPs: **HIS-CP-017 through HIS-CP-024**`,
  "",
  "## CP matrix",
  "",
  "| CP | Questions | Facts represented | E/M/H | Answer positions | Issues |",
  "|---|---:|---:|---|---|---:|",
  ...reports.map(r=>`| ${r.cpId} | ${r.questions} | ${r.representedFacts}/${r.facts} | ${r.difficulty.Easy}/${r.difficulty.Medium}/${r.difficulty.Hard} | ${r.answerPositions.join("/")} | ${r.issues.length} |`),
  "",
  "## Qualification rules",
  "",
  "- 60 questions and 60 canonical facts per supplemental CP.",
  "- Every canonical fact represented.",
  "- Difficulty split 18 Easy / 30 Medium / 12 Hard.",
  "- Correct-answer positions balanced 15/15/15/15.",
  "- 10 QLs × 6 questions per CP.",
  "- Four options and canonical-answer parity.",
  "- No exact duplicate substantive stems across CP017–CP024; standard exam instruction stems may repeat.",
  "- No mechanical filler phrases: “best describe”, “associated with”, “which correctly identifies”.",
  "- Explanations at least 120 characters and at least two sentences.",
  "- No learner-facing source/meta leakage.",
  "",
  ...(issues.length?["## Issues","",...issues.map(i=>`- ${i}`), ""]:["## Issues","","None.",""]),
];
fs.writeFileSync(path.join(outDir,"history-v2-expansion-audit.md"),md.join("\n"));

console.log(JSON.stringify(result,null,2));
if(!result.valid) process.exitCode=1;
