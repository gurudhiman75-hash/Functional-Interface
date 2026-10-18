#!/usr/bin/env node
// Combine the 12 isolated, compute-only Question Studio shards from GitHub Actions.
// The script does not import a database client or access any cloud credentials.
import {existsSync, readFileSync, appendFileSync} from "node:fs";
import {resolve, join} from "node:path";
const dir=resolve(process.argv[2]??"/tmp/qs-universal-all-artifacts");
const shards=Number(process.argv[3]??12);
if (!Number.isSafeInteger(shards)||shards<2||shards>32) throw Error("Expected shard count 2..32");
const errors=[];
const seen=new Set();
const subjects=new Map();
let total=null, tested=0, passed=0, failed=0, durations=0;
for (let shard=0;shard<shards;shard++){
 const file=join(dir,`qs-universal-offline-compute-all-${shard}`,"qs-universal-compute-report.json");
 if(!existsSync(file)){errors.push(`Missing audit artifact for shard ${shard}`);continue;}
 let report;
 try{report=JSON.parse(readFileSync(file,"utf8"));}
 catch(error){errors.push(`Malformed JSON for shard ${shard}`);continue;}
 if(report.runType!=="offline-compute-only"||report.wave!=="all"||
    report.shard!==shard||report.shards!==shards||report.selection!=="chapter"||
    !Array.isArray(report.results)){
   errors.push(`Invalid report identity for shard ${shard}`);continue;
 }
 if(!Number.isSafeInteger(report.catalogTotal)||report.catalogTotal<1||
    (total!==null && report.catalogTotal!==total)) errors.push(`Catalog total mismatch at shard ${shard}`);
 else total=report.catalogTotal;
 if(report.selected!==report.results.length||
    report.passed+report.failed!==report.selected) errors.push(`Count mismatch on shard ${shard}`);
 for(const item of report.results){
   if(typeof item.packageId!=="string"||!item.packageId||
      !["passed","failed"].includes(item.status)){
     errors.push(`Invalid package row in shard ${shard}`);continue;
   }
   if(seen.has(item.packageId))errors.push(`Duplicate package across shards: ${item.packageId}`);
   seen.add(item.packageId);
   tested++;
   if(item.status==="passed")passed++;else {
     failed++;
     errors.push(`Generation failed: ${item.packageId} (${item.code??"UNKNOWN"})`);
   }
   const key=typeof item.subject==="string"?item.subject:"Unknown";
   const current=subjects.get(key)??{total:0,passed:0};
   current.total++;if(item.status==="passed")current.passed++;
   subjects.set(key,current);
 }
 durations+=Number(report.durationMs)||0;
}
if(total===null||tested!==total||seen.size!==total)
 errors.push(`Incomplete catalog coverage: unique=${seen.size}; expected=${total??"unknown"}`);
const summary=[
  "## Question Studio full registered-catalog offline audit",
  "",
  `**${passed} passed / ${tested} tested** across ${shards} shards; registered and enabled: **${total??"unknown"}**.`,
  "",
  "| Subject | Packages tested | Passed |",
  "|---|---:|---:|",
  ...[...subjects.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([key,v])=>`| ${key.replaceAll("|","/")} | ${v.total} | ${v.passed} |`),
  "",
  errors.length?"**FAIL:** "+errors.length+" issue(s).":"**PASS:** every enabled catalog package generated one structurally valid review candidate.",
  ...errors.slice(0,40).map(x=>"- "+x),
  "",
  "Scope: offline deterministic *compute-only* checks. No Cloud Run, Cloud Tasks, Neon, admin login, QA of mathematical truth, or student publication. No claim of full CP/language/difficulty coverage.",
  "",
].join("\n");
console.log(summary);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary+"\n");
if(errors.length)process.exitCode=1;
