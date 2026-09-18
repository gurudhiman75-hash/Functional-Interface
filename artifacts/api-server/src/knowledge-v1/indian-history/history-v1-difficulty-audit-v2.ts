import fs from "node:fs";
import path from "node:path";
import { HIS_CP001_REVIEW_BATCH_V1 as A } from "./prehistory-harappan/his-cp001-review-v1";
import { HIS_CP002_REVIEW_BATCH_V1 as B } from "./vedic-age/his-cp002-review-v1";
import { HIS_CP003_REVIEW_BATCH_V1 as C } from "./mahajanapadas-jainism-buddhism/his-cp003-review-v1";
import { HIS_CP004_REVIEW_BATCH_V1 as D } from "./mauryan-empire/his-cp004-review-v1";
import { HIS_CP005_REVIEW_BATCH_V1 as E } from "./post-mauryan-sangam/his-cp005-review-v1";
import { HIS_CP006_REVIEW_BATCH_V1 as F } from "./gupta-post-gupta/his-cp006-review-v1";
import { HIS_CP007_REVIEW_BATCH_V1 as G } from "./early-medieval-south-india/his-cp007-review-v1";
import { HIS_CP008_REVIEW_BATCH_V1 as H } from "./delhi-sultanate/his-cp008-review-v1";
import { HIS_CP009_REVIEW_BATCH_V1 as I } from "./vijayanagara-bahmani-regional/his-cp009-review-v1";
import { HIS_CP010_REVIEW_BATCH_V1 as J } from "./mughal-empire/his-cp010-review-v1";
import { HIS_CP011_REVIEW_BATCH_V1 as K } from "./marathas-sikhs-eighteenth-century/his-cp011-review-v1";
import { HIS_CP012_REVIEW_BATCH_V1 as L } from "./europeans-british-expansion/his-cp012-review-v1";
import { HIS_CP013_REVIEW_BATCH_V1 as M } from "./british-administration-economic-policies/his-cp013-review-v1";
import { HIS_CP014_REVIEW_BATCH_V1 as N } from "./revolt-1857-social-reform/his-cp014-review-v1";
import { HIS_CP015_REVIEW_BATCH_V1 as O } from "./national-movement-1885-1919/his-cp015-review-v1";
import { HIS_CP016_REVIEW_BATCH_V1 as P } from "./national-movement-1919-1947/his-cp016-review-v1";

type Q={questionId:string;cpId:string;difficulty:string;stem:string;options:readonly string[];canonicalAnswer:string;sourceFactIds:readonly string[];explanation:string};
const packs:[string,readonly Q[]][]=[
["HIS-CP-001",A],["HIS-CP-002",B],["HIS-CP-003",C],["HIS-CP-004",D],
["HIS-CP-005",E],["HIS-CP-006",F],["HIS-CP-007",G],["HIS-CP-008",H],
["HIS-CP-009",I],["HIS-CP-010",J],["HIS-CP-011",K],["HIS-CP-012",L],
["HIS-CP-013",M],["HIS-CP-014",N],["HIS-CP-015",O],["HIS-CP-016",P],
] as any;
const direct=/^(?:who\b|where\b|when\b|in which year\b|by which year\b|which year\b|which ruler\b|which person\b|which city\b|which state\b|which dynasty\b|which language\b|which script\b|which battle\b|which act\b|who founded\b|who wrote\b|who composed\b|who succeeded\b|who served\b|what was\b|what is\b|the .+ was|.+ was founded|.+ was fought|.+ was annexed)/i;
const relation=/\b(?:compare|contrast|best explains|best describes|best reflects|correctly distinguishes|correctly links|combination|sequence|chronolog|statements?|matched|association|relationship|result|effect|cause|why|how)\b/i;
const truth=/\b(?:which (?:is|are) correct|both 1 and 2|1, 2 and 3|only 1|only 2)\b/i;
const rows=[] as any[];
for(const [cp,qs] of packs){
  const flagged=[] as any[];
  for(const q of qs){
    if(q.difficulty!=="Medium"&&q.difficulty!=="Hard")continue;
    const oneFact=q.sourceFactIds.length===1;
    const directStem=direct.test(q.stem);
    const relational=relation.test(q.stem)||truth.test(q.stem)||q.sourceFactIds.length>=2;
    const hardSingleFact=q.difficulty==="Hard"&&oneFact;
    const hardDirect=q.difficulty==="Hard"&&(directStem||oneFact)&&!relational;
    const mediumSingleDirect=q.difficulty==="Medium"&&oneFact&&directStem&&!relational;
    if(hardSingleFact||hardDirect||mediumSingleDirect){
      flagged.push({id:q.questionId,difficulty:q.difficulty,factCount:q.sourceFactIds.length,hardSingleFact,hardDirect,mediumSingleDirect,stem:q.stem,answer:q.canonicalAnswer,options:q.options});
    }
  }
  rows.push({cp,mediumSingleDirect:flagged.filter(x=>x.mediumSingleDirect).length,hardSingleFact:flagged.filter(x=>x.hardSingleFact).length,hardDirect:flagged.filter(x=>x.hardDirect).length,flagged});
}
const totals={mediumSingleDirect:rows.reduce((n,r)=>n+r.mediumSingleDirect,0),hardSingleFact:rows.reduce((n,r)=>n+r.hardSingleFact,0),hardDirect:rows.reduce((n,r)=>n+r.hardDirect,0)};
const out=path.resolve(process.cwd(),"dist/history-audit/HIS-001-V1-DIFFICULTY-AUDIT-V2");fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,"history-v1-difficulty-audit-v2.json"),JSON.stringify({totals,rows},null,2));
const md=["# HIS-001 History V1 — Difficulty Audit V2","","> Candidate flags are mechanical signals for manual editorial review; single-fact does not automatically mean a bad question.","",`- Medium single-fact direct-recall candidates: **${totals.mediumSingleDirect}**`,`- Hard single-fact candidates: **${totals.hardSingleFact}**`,`- Hard direct-recall candidates after relational exclusions: **${totals.hardDirect}**`,"","| CP | Medium single-direct | Hard single-fact | Hard direct |","|---|---:|---:|---:|"];
for(const r of rows)md.push(`| ${r.cp} | ${r.mediumSingleDirect} | ${r.hardSingleFact} | ${r.hardDirect} |`);
for(const r of rows){md.push("",`## ${r.cp}`,"");if(!r.flagged.length){md.push("No candidates.");continue;}for(const x of r.flagged)md.push(`- **${x.id} · ${x.difficulty} · facts=${x.factCount}** — ${x.stem}\n  - Answer: ${x.answer}`);}
fs.writeFileSync(path.join(out,"history-v1-difficulty-audit-v2.md"),md.join("\n"));
console.log(JSON.stringify({totals,summary:rows.map(({cp,mediumSingleDirect,hardSingleFact,hardDirect})=>({cp,mediumSingleDirect,hardSingleFact,hardDirect}))},null,2));
