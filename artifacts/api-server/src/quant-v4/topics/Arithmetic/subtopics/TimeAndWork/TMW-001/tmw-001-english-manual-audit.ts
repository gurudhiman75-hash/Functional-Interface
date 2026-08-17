import { writeFileSync } from "node:fs";
import { TMW_ENGLISH_ADAPTERS, tmwEnglishLearnerText } from "./foundation/english-freeze-adapter";

interface Finding{cpId:string;qlId:string;code:string;detail:string;}
const findings:Finding[]=[];
const questions:any[]=[];

function add(cpId:string,qlId:string,code:string,detail:string):void{findings.push({cpId,qlId,code,detail});}
function textOf(value:unknown):string{return typeof value==="string"?value:"";}

for(const adapter of TMW_ENGLISH_ADAPTERS){
  for(const entry of adapter.registry){
    let question:any|undefined;
    let lastError="";
    for(let attempt=0;attempt<100;attempt+=1){
      try{
        const candidate=adapter.run(entry.qlId,`english-manual-audit-${entry.qlId}-${attempt}`);
        if(candidate.validation?.valid){question=candidate;break;}
        lastError=Array.isArray(candidate.validation?.errors)?candidate.validation.errors.join("; "):"candidate validation failed";
      }catch(error){lastError=error instanceof Error?error.message:String(error);}
    }
    if(!question){add(adapter.cpId,entry.qlId,"NO_VALID_CANDIDATE",`No valid English candidate was generated in 100 attempts. Last error: ${lastError}`);continue;}
    questions.push(question);
    const learner=tmwEnglishLearnerText(question);
    const options=Array.isArray(question.options)?question.options:[];
    const correct=question.solution?.answerText??options[question.correctIndex];
    const trap=question.explanation?.commonTrap;

    if(options.length!==4||new Set(options).size!==4)add(adapter.cpId,entry.qlId,"OPTION_CONTRACT","Manual delivery does not contain four unique options.");
    if(options[question.correctIndex]!==correct)add(adapter.cpId,entry.qlId,"ANSWER_ALIGNMENT","Correct option does not equal the canonical answer text.");
    if(!trap?.optionText||!options.includes(trap.optionText))add(adapter.cpId,entry.qlId,"TRAP_NOT_OPTION_LINKED","Common-trap text is not one of the delivered distractors.");
    if(trap?.optionText===correct)add(adapter.cpId,entry.qlId,"TRAP_POINTS_TO_ANSWER","Common trap points to the correct answer.");
    if(trap?.optionLabel&&trap?.optionText&&!textOf(trap.explanation).startsWith(`${trap.optionLabel} (${trap.optionText}) reflects this trap:`))add(adapter.cpId,entry.qlId,"TRAP_NOT_DIAGNOSTIC","Common trap is not written as an option-specific diagnosis.");

    const banned:[RegExp,string][]=[
      [/Don't fall for/i,"command-style trap"],
      [/Do not choose/i,"command-style option advice"],
      [/(?:^|\n|[.!?]\s+)Do not\b/,"negative command"],
      [/(?:^|\n|[.!?]\s+)Don't\b/,"negative command"],
      [/;\s*do not\b/i,"negative command"],
      [/\bgenerated\b/i,"generation language"],
      [/Independent (?:heterogeneous-crew )?invariant/i,"internal invariant language"],
      [/\bfind[A-Z][A-Za-z]+\b/,"camelCase solve-mode identifier"],
      [/\bis the correct answer\b/i,"generic correct-answer conclusion"],
      [/[A-Z]{3,}_[A-Z_]{3,}/,"internal identifier"],
    ];
    for(const [pattern,label] of banned)if(pattern.test(learner))add(adapter.cpId,entry.qlId,"LEARNER_LANGUAGE",`${label}: ${pattern}`);
  }
}

const byId=new Map(questions.map(question=>[question.questionLanguageId,question]));
const q104=byId.get("TMW-QL-104");
if(!q104)add("TMW-CP-005","TMW-QL-104","TARGETED_ROW_MISSING","Periodic machine-output row is missing.");
else{
  const q104Text=tmwEnglishLearnerText(q104);
  if(!/Machine A/.test(q104.stem)||/Painter [ABC] runs|Typist [ABC] runs|Operator [ABC] runs/i.test(q104Text))add("TMW-CP-005","TMW-QL-104","MACHINE_CONTEXT","Periodic output still uses a human-as-machine context.");
  if(!/cycle|repetition/i.test(textOf(q104.explanation?.commonTrap?.explanation)))add("TMW-CP-005","TMW-QL-104","CYCLE_DIAGNOSTIC","Periodic output trap does not diagnose a cycle-count error.");
}

const q146=byId.get("TMW-QL-146");
if(!q146||!/known individual payment as though it were the complete payment pool/i.test(textOf(q146?.explanation?.commonTrap?.explanation)))add("TMW-CP-008","TMW-QL-146","INVERSE_POOL_DIAGNOSIS","Known-share inverse-pool trap remains misleading.");

const q147=byId.get("TMW-QL-147");
if(!q147||/Do not choose|Don't fall for/i.test(tmwEnglishLearnerText(q147))||!/second contribution ratio is unnecessary/i.test(textOf(q147?.explanation?.opening)))add("TMW-CP-008","TMW-QL-147","RESIDUAL_GUIDANCE","Residual-payment guidance is not diagnostic and direct.");

const q174=byId.get("TMW-QL-174");
if(!q174)add("TMW-CP-009","TMW-QL-174","TARGETED_ROW_MISSING","Boundary-decision row is missing.");
else{
  if(/^Therefore,\s*(?:Yes|No)\s+—/i.test(textOf(q174.explanation?.conclusion)))add("TMW-CP-009","TMW-QL-174","DECISION_CONCLUSION","Decision conclusion repeats the option label.");
  if(q174.options.some((option:string)=>/^Yes\s+—.*in\s+.+/.test(option)&&/does not reach/i.test(textOf(q174.solution?.answerText))))add("TMW-CP-009","TMW-QL-174","DECISION_DISTRACTOR","A yes-option contradicts its own stated boundary time.");
}

const cp011=questions.filter(question=>question.canonicalProblemId==="TMW-CP-011");
if(cp011.length===0)add("TMW-CP-011","TMW-QL-193","CP011_MISSING","CP-011 rows are missing from the corpus.");
for(const question of cp011){
  const text=tmwEnglishLearnerText(question);
  if(/correct answer|Don't fall for|Do not choose/i.test(text))add("TMW-CP-011",question.questionLanguageId,"CP011_GENERIC_LANGUAGE","CP-011 retains generic or command-style teacher language.");
}

const report={
  summary:{rows:questions.length,qls:new Set(questions.map(question=>question.questionLanguageId)).size,checkpoints:new Set(questions.map(question=>question.canonicalProblemId)).size,findings:findings.length},
  findings,
};
writeFileSync("dist/quant-v4/tmw-001-english-manual-audit.json",JSON.stringify(report,null,2));
console.log(JSON.stringify(report.summary,null,2));
if(report.summary.rows!==211||report.summary.qls!==211||report.summary.checkpoints!==11||findings.length!==0)process.exitCode=1;
