import fs from "node:fs";
import path from "node:path";

import { generateDi001QuestionStudioBatch, DI001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-001/question-studio-adapter";
import { generateDi002QuestionStudioBatch, DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-002/question-studio-adapter";
import { generateDi003QuestionStudioBatch, DI003_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, DI003_SINGLE_CANONICAL_PROBLEM_ID, DI003_STACKED_CANONICAL_PROBLEM_ID } from "./DI-003/question-studio-adapter";
import { generateDi004QuestionStudioBatch, DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, DI004_SINGLE_CANONICAL_PROBLEM_ID, DI004_MULTI_CANONICAL_PROBLEM_ID } from "./DI-004/question-studio-adapter";
import { generateDi005QuestionStudioBatch, DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID, DI005_COMPARATIVE_CANONICAL_PROBLEM_ID, DI005_DONUT_CANONICAL_PROBLEM_ID } from "./DI-005/question-studio-adapter";
import { generateDi006QuestionStudioBatch, DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, DI006_ADVANCED_CANONICAL_PROBLEM_ID } from "./DI-006/question-studio-adapter";
import { generateDi007QuestionStudioBatch, DI007_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-007/question-studio-adapter";
import { generateDi008QuestionStudioBatch, DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, DI008_ADVANCED_CANONICAL_PROBLEM_ID } from "./DI-008/question-studio-adapter";
import { generateDi009QuestionStudioBatch, DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-009/question-studio-adapter";
import { generateDi010QuestionStudioBatch, DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-010/question-studio-adapter";
import { generateDi011QuestionStudioBatch, DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-011/question-studio-adapter";
import { generateDi012QuestionStudioBatch, DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-012/question-studio-adapter";
import { generateDi013QuestionStudioBatch, DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-013/question-studio-adapter";
import { generateDi014QuestionStudioBatch, DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID } from "./DI-014/question-studio-adapter";

const SAMPLE_QUESTIONS_PER_MODE = 120;

type ModeSpec = {
  cpId: string;
  mode: string;
  canonicalProblemId: string;
  examProfile: string;
  generate: (request: any) => Promise<any>;
};

const MODES: ModeSpec[] = [
  { cpId:"DI-001", mode:"BASIC_TABLE", canonicalProblemId:DI001_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"SSC_CGL_TIER_I", generate:generateDi001QuestionStudioBatch },
  { cpId:"DI-002", mode:"ADVANCED_TABLE", canonicalProblemId:DI002_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi002QuestionStudioBatch },
  { cpId:"DI-003", mode:"GROUPED_BAR", canonicalProblemId:DI003_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi003QuestionStudioBatch },
  { cpId:"DI-003", mode:"SINGLE_BAR", canonicalProblemId:DI003_SINGLE_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi003QuestionStudioBatch },
  { cpId:"DI-003", mode:"STACKED_BAR", canonicalProblemId:DI003_STACKED_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi003QuestionStudioBatch },
  { cpId:"DI-004", mode:"TWO_SERIES_LINE", canonicalProblemId:DI004_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi004QuestionStudioBatch },
  { cpId:"DI-004", mode:"SINGLE_LINE", canonicalProblemId:DI004_SINGLE_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi004QuestionStudioBatch },
  { cpId:"DI-004", mode:"THREE_SERIES_LINE", canonicalProblemId:DI004_MULTI_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi004QuestionStudioBatch },
  { cpId:"DI-005", mode:"HIDDEN_SECTOR_PIE", canonicalProblemId:DI005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi005QuestionStudioBatch },
  { cpId:"DI-005", mode:"FULLY_VISIBLE_PIE", canonicalProblemId:DI005_FULLY_VISIBLE_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi005QuestionStudioBatch },
  { cpId:"DI-005", mode:"COMPARATIVE_DOUBLE_PIE", canonicalProblemId:DI005_COMPARATIVE_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi005QuestionStudioBatch },
  { cpId:"DI-005", mode:"RING_DONUT", canonicalProblemId:DI005_DONUT_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi005QuestionStudioBatch },
  { cpId:"DI-006", mode:"BASE_CASELET", canonicalProblemId:DI006_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_PRELIMS", generate:generateDi006QuestionStudioBatch },
  { cpId:"DI-006", mode:"ADVANCED_CASELET", canonicalProblemId:DI006_ADVANCED_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi006QuestionStudioBatch },
  { cpId:"DI-007", mode:"SINGLE_MISSING", canonicalProblemId:DI007_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi007QuestionStudioBatch },
  { cpId:"DI-008", mode:"BUSINESS_ARITHMETIC", canonicalProblemId:DI008_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi008QuestionStudioBatch },
  { cpId:"DI-008", mode:"ADVANCED_ARITHMETIC", canonicalProblemId:DI008_ADVANCED_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi008QuestionStudioBatch },
  { cpId:"DI-009", mode:"HISTOGRAM", canonicalProblemId:DI009_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"SSC_CGL_TIER_I", generate:generateDi009QuestionStudioBatch },
  { cpId:"DI-010", mode:"FREQUENCY_POLYGON", canonicalProblemId:DI010_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"SSC_CGL_TIER_I", generate:generateDi010QuestionStudioBatch },
  { cpId:"DI-011", mode:"MIXED_MULTI_CHART", canonicalProblemId:DI011_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi011QuestionStudioBatch },
  { cpId:"DI-012", mode:"ADVANCED_MISSING_VARIABLE", canonicalProblemId:DI012_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi012QuestionStudioBatch },
  { cpId:"DI-013", mode:"RADAR_WEB", canonicalProblemId:DI013_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi013QuestionStudioBatch },
  { cpId:"DI-014", mode:"RADAR_PIE_HYBRID", canonicalProblemId:DI014_QUESTION_STUDIO_CANONICAL_PROBLEM_ID, examProfile:"BANKING_MAINS", generate:generateDi014QuestionStudioBatch },
];

function normalizeFrame(text:string) {
  return text
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/\b\d+(?:\.\d+)?%?\b/g, "<n>")
    .replace(/\b(?:branch|centre|center|course|product|plant|unit|team|dept|department|category|segment|group|period|year|month|session|region|section|channel|batch)\s+[a-z0-9]+\b/gi, "<entity>")
    .replace(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|q[1-6]|p[1-6])\b/gi, "<period>")
    .replace(/\s+/g, " ")
    .trim();
}
function stimulusFingerprint(stimulus:any) {
  const scrub=(value:any):any=>{
    if(Array.isArray(value)) return value.map(scrub);
    if(value && typeof value==="object"){
      const out:any={};
      for(const [k,v] of Object.entries(value)){
        if(["title","instruction","description"].includes(k)) continue;
        out[k]=scrub(v);
      }
      return out;
    }
    return value;
  };
  return JSON.stringify(scrub(stimulus));
}
function explanationText(q:any){
  if(typeof q.explanation==="string") return q.explanation;
  if(q.richExplanation){
    return [q.richExplanation.keyIdea,...(q.richExplanation.steps??[])].join(" ");
  }
  if(q.explanation?.steps) return [q.explanation.keyIdea,...q.explanation.steps].join(" ");
  return String(q.explanation??"");
}
function taskKind(q:any){return String(q.taskKind??q.kind??q.metadata?.taskKind??"UNKNOWN");}
function dominantShare(values:string[]){
  const map=new Map<string,number>();
  for(const v of values) map.set(v,(map.get(v)??0)+1);
  return Math.max(...map.values())/values.length;
}
function scoreMode(row:any){
  const stateScore=Math.min(100,row.stimulusUniqueRatio*100);
  const exactStemScore=Math.min(100,row.exactStemUniqueRatio*100);
  const frameScore=Math.max(0,100-(row.dominantFrameShare*100-10)*1.4);
  const taskScore=Math.min(100,row.taskFamilyCount*9);
  const explanationScore=Math.min(100,row.explanationUniqueRatio*100);
  return Math.round(stateScore*.30+exactStemScore*.15+frameScore*.25+taskScore*.20+explanationScore*.10);
}

const modeReports:any[]=[];
for(const spec of MODES){
  const result=await spec.generate({
    canonicalProblemId:spec.canonicalProblemId,
    examProfile:spec.examProfile,
    language:"en",
    count:SAMPLE_QUESTIONS_PER_MODE,
    seed:`DI-NOVELTY-AUDIT-V1:${spec.cpId}:${spec.mode}`,
  });
  const questions=result.questions;
  const stems=questions.map((q:any)=>String(q.stem??q.text??""));
  const frames=stems.map(normalizeFrame);
  const explanations=questions.map(explanationText);
  const stimuli=questions.map((q:any)=>stimulusFingerprint(q.stimulus));
  const tasks=questions.map(taskKind);
  const exactStemUnique=new Set(stems).size;
  const frameUnique=new Set(frames).size;
  const explanationUnique=new Set(explanations).size;
  const stimulusUnique=new Set(stimuli).size;
  const taskFamilyCount=new Set(tasks).size;
  const report:any={
    cpId:spec.cpId,
    mode:spec.mode,
    sampleQuestions:questions.length,
    exactStemUnique,
    exactStemUniqueRatio:exactStemUnique/questions.length,
    normalizedFrameUnique:frameUnique,
    dominantFrameShare:Number(dominantShare(frames).toFixed(3)),
    explanationUnique,
    explanationUniqueRatio:explanationUnique/questions.length,
    stimulusUnique,
    stimulusUniqueRatio:stimulusUnique/questions.length,
    taskFamilyCount,
    taskFamilies:[...new Set(tasks)].sort(),
    exactDuplicateStemCount:questions.length-exactStemUnique,
  };
  report.distinctivenessScore=scoreMode(report);
  report.repetitionRisk=report.distinctivenessScore>=90?"LOW":report.distinctivenessScore>=80?"MODERATE":report.distinctivenessScore>=70?"ELEVATED":"HIGH";
  modeReports.push(report);
}

const cpIds=[...new Set(modeReports.map(r=>r.cpId))];
const cpReports=cpIds.map(cpId=>{
  const rows=modeReports.filter(r=>r.cpId===cpId);
  const weighted=rows.reduce((s,r)=>s+r.distinctivenessScore,0)/rows.length;
  const min=Math.min(...rows.map(r=>r.distinctivenessScore));
  const modes=rows.length;
  const taskFamilies=new Set(rows.flatMap(r=>r.taskFamilies)).size;
  const architectureBonus=Math.min(8,(modes-1)*3);
  const cpScore=Math.min(100,Math.round(weighted+architectureBonus));
  return {
    cpId,
    modeCount:modes,
    taskFamilyCount:taskFamilies,
    averageModeScore:Number(weighted.toFixed(1)),
    weakestModeScore:min,
    distinctivenessScore:cpScore,
    repetitionRisk:cpScore>=90?"LOW":cpScore>=82?"MODERATE":cpScore>=74?"ELEVATED":"HIGH",
    weakestMode:rows.slice().sort((a,b)=>a.distinctivenessScore-b.distinctivenessScore)[0]!.mode,
  };
}).sort((a,b)=>a.distinctivenessScore-b.distinctivenessScore);

const report={
  authority:"DI-NOVELTY-REPETITION-AUDIT-V1",
  generatedAt:new Date().toISOString(),
  sampleQuestionsPerMode:SAMPLE_QUESTIONS_PER_MODE,
  modeCount:MODES.length,
  totalQuestions:MODES.length*SAMPLE_QUESTIONS_PER_MODE,
  interpretation:{
    score:"Measured current distinctiveness, not future novelty potential.",
    lowRisk:"90-100",
    moderateRisk:"82-89",
    elevatedRisk:"74-81",
    highRisk:"below 74",
    guardrail:"Do not treat number swaps as novelty. Structural mode/task/state diversity matters more than raw seed count.",
  },
  cpReports,
  modeReports,
  priority:cpReports.slice(0,6),
};

const cwd=process.cwd();
const outputDir=cwd.endsWith(`${path.sep}artifacts${path.sep}api-server`)
  ? path.resolve(cwd,"dist/quant-v4")
  : path.resolve(cwd,"artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir,{recursive:true});
const jsonPath=path.join(outputDir,"di-novelty-repetition-audit-v1.json");
const mdPath=path.join(outputDir,"di-novelty-repetition-audit-v1.md");
fs.writeFileSync(jsonPath,JSON.stringify(report,null,2)+"\n");

const md=[
  "# DI Novelty / Repetition Audit V1",
  "",
  `Sample: **${report.totalQuestions} questions** across **${report.modeCount} active modes** (${SAMPLE_QUESTIONS_PER_MODE} per mode).`,
  "",
  "## CP result",
  "",
  "| CP | Modes | Task families | Score | Risk | Weakest mode |",
  "| --- | ---: | ---: | ---: | --- | --- |",
  ...cpReports.map(r=>`| ${r.cpId} | ${r.modeCount} | ${r.taskFamilyCount} | **${r.distinctivenessScore}/100** | ${r.repetitionRisk} | ${r.weakestMode} |`),
  "",
  "## Mode detail",
  "",
  "| CP | Mode | Score | Risk | Unique stems | Frames | Dominant frame | Unique stimuli | Task families |",
  "| --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |",
  ...modeReports.sort((a,b)=>a.distinctivenessScore-b.distinctivenessScore).map(r=>`| ${r.cpId} | ${r.mode} | **${r.distinctivenessScore}/100** | ${r.repetitionRisk} | ${r.exactStemUnique}/${r.sampleQuestions} | ${r.normalizedFrameUnique} | ${Math.round(r.dominantFrameShare*100)}% | ${r.stimulusUnique}/${r.sampleQuestions} | ${r.taskFamilyCount} |`),
  "",
  "## Rule",
  "",
  "State variation alone is not counted as novelty. A mode is penalized when one normalized learner frame dominates even if every seed has different numbers.",
  "",
].join("\n");
fs.writeFileSync(mdPath,md+"\n");

console.log("DI_NOVELTY_AUDIT_V1 "+JSON.stringify({
  totalQuestions:report.totalQuestions,
  modeCount:report.modeCount,
  cpReports:report.cpReports,
  weakestModes:modeReports.slice().sort((a,b)=>a.distinctivenessScore-b.distinctivenessScore).slice(0,8).map(r=>({cpId:r.cpId,mode:r.mode,score:r.distinctivenessScore,risk:r.repetitionRisk,frames:r.normalizedFrameUnique,dominantFrameShare:r.dominantFrameShare,stimulusUnique:r.stimulusUnique,taskFamilyCount:r.taskFamilyCount})),
}));
console.log(`Artifacts: ${jsonPath} ${mdPath}`);
