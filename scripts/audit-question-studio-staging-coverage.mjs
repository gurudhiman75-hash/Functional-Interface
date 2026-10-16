#!/usr/bin/env node
// READ ONLY. Compare built admin discovery vs isolated Cloud Tasks receiver metadata.
// A catalog registration is NOT proof of successful remote generation.
import {readFileSync, writeFileSync, appendFileSync} from "node:fs";
import {resolve} from "node:path";
const [uiFile, taskFile, output="/tmp/qs-staging-coverage.md"]=process.argv.slice(2);
if (!uiFile || !taskFile) throw Error("Usage: node scripts/audit-question-studio-staging-coverage.mjs <unified-admin.json> <async-task.json> [report.md]");
const ui=JSON.parse(readFileSync(resolve(uiFile),"utf8"));
const task=JSON.parse(readFileSync(resolve(taskFile),"utf8"));
if (!Array.isArray(ui.packages)||!Array.isArray(task.packages)) throw Error("Missing package catalog");
const uiPackages=new Map(ui.packages.map(p=>[p.packageId,p]));
const taskPackages=new Map(task.packages.map(p=>[p.packageId,p]));
const allIds=[...new Set([...uiPackages.keys(),...taskPackages.keys()])].sort();
const smoke={ "TRG-002":"1 + 3-question compute smoke","NUM-001":"3-question compute smoke","OPS-001":"1-question compute smoke","ENG-001":"1-question compute smoke","COM-001":"1-question compute smoke" };
const issues=[];
const rows=allIds.map(id=>{
 const u=uiPackages.get(id),t=taskPackages.get(id);
 const item=u||t;
 const reasons=[];
 if (!u) reasons.push("Not in admin discovery");
 if (!t) reasons.push("Not in task receiver catalog");
 if (u&&t) {
  for(const key of ["engineId","enabled","difficultyFilterSupported","lifecycleStage"]) {
   if(JSON.stringify(u[key]??null)!==JSON.stringify(t[key]??null))reasons.push("Registry/receiver mismatch: "+key);
  }
  for(const key of ["cpIds","dynamicCandidateCpIds","supportedLanguages","supportedRuntimeModes","supportedDifficulties"]) {
   const a=u[key]??[], b=t[key]??[];
   if(JSON.stringify(a)!==JSON.stringify(b))reasons.push("Registry/receiver mismatch: "+key);
  }
 }
 if(item.enabled&&!((item.cpIds?.length??0)+(item.dynamicCandidateCpIds?.length??0))) reasons.push("Enabled package with no CPs");
 if(item.enabled&&(!item.supportedLanguages||!item.supportedLanguages.length))reasons.push("Enabled package with no supported languages");
 if(item.enabled&&item.difficultyFilterSupported!==false&&!(item.supportedDifficulties?.length))reasons.push("Difficulty filter enabled but no declared difficulties");
 if(item.enabled&&item.runtimeMode&&item.supportedRuntimeModes?.length&&!item.supportedRuntimeModes.includes(item.runtimeMode))reasons.push("Runtime mode not supported by package");
 if(reasons.length)issues.push({id,reasons});
 return {id,engine:item.engineId??"unknown",subject:u?.subject||"Not in UI",chapter:u?.chapter||"",enabled:!!item.enabled,
  cpCount:new Set([...(item.cpIds??[]),...(item.dynamicCandidateCpIds??[])]).size,lang:(item.supportedLanguages??[]).join(","),
  difficultyFilter:item.difficultyFilterSupported!==false, runtime:u?.runtimeMode||"",verified:smoke[id]??"",gap:reasons.join("; ")};
});
const active=rows.filter(r=>r.enabled);
const stats=new Map();
for(const r of rows){const key=r.engine+" / "+r.subject;const v=stats.get(key)||{all:0,enabled:0,smoke:0,cp:0};v.all++;if(r.enabled)v.enabled++;if(r.verified)v.smoke++;v.cp+=r.cpCount;stats.set(key,v)}
const lines=[
 "# Examtree Question Studio isolated staging coverage audit",
 "",
 "Scope: built canonical four-engine UI discovery versus isolated async task receiver registry. Read-only registry inspection; NOT an authenticated browser or universal worker execution test.",
 "",
 "## Summary",
 "",
 "- Admin registered packages: **"+ui.packages.length+"**; enabled: **"+ui.packages.filter(p=>p.enabled).length+"**",
 "- Async task receiver registered packages: **"+task.packages.length+"**; enabled: **"+task.packages.filter(p=>p.enabled).length+"**",
 "- Smoke-test package names in existing staging verifier: **"+Object.keys(smoke).length+"** (compute only, not end-to-end)",
 "- Registry/metadata issues: **"+issues.length+"**",
 "",
 "| Engine / subject | Registered | Enabled | In scripted compute smoke | Declared CP total* |",
 "|---|---:|---:|---:|---:|",
 ...[...stats.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`| ${k} | ${v.all} | ${v.enabled} | ${v.smoke} | ${v.cp} |`),
 "",
 "*CP totals are summed per package; shared CPs may be counted in more than one package.",
 "",
 "## Interpretation",
 "",
 "- `registered`: present in the build-time catalog; not evidence of runtime execution.",
 "- `smoke listed`: selected for documented 1/3 compute-only checks. The audit does not rerun those.",
 "- `not smoke tested`: **not a claim that generation fails**; it is a verification gap.",
 "- Full end-to-end acceptance (login -> enqueue -> Cloud Tasks -> signed receiver -> question/answer/explanation -> Neon review) remains **unverified for the full catalog**.",
 "",
 "## Chapter/package matrix",
 "",
 "| Package | Subject | Chapter | Engine | Enabled | CPs | Languages | Difficulty filter | Runtime | Compute smoke listed | Registry issue |",
 "|---|---|---|---|---|---:|---|---|---|---|---|",
 ...rows.map(r=>`| ${r.id} | ${r.subject.replaceAll("|","/")} | ${r.chapter.replaceAll("|","/")} | ${r.engine} | ${r.enabled?"Yes":"No"} | ${r.cpCount} | ${r.lang} | ${r.difficultyFilter?"Yes":"No"} | ${r.runtime||"Default"} | ${r.verified||"No"} | ${r.gap||"None"} |`),
 "",
 "## Priorities",
 "",
 "1. Correct registry disagreements and packages without an eligible selector.",
 "2. Validate 1-question compute execution across enabled packages with the package's real runtime and difficulty authority; do not bypass lifecycle limits.",
 "3. Extend to 3-question determinism, answer/explanation completeness, EN/HI/PA parity where declared.",
 "4. Verify isolated queue + task receiver + review commit in a disposable staging DB only after safety approval; paused queue and production gates stay unchanged.",
 "5. Separate *discoverable* from *remote compute verified* and *end-to-end staging verified* in the admin UI.",
 "",
];
const report=lines.join("\n");writeFileSync(resolve(output),report);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,report);
console.log("QS_AUDIT_CATALOG "+JSON.stringify({ui:ui.packages.length,task:task.packages.length,enabled:active.length,smokeListed:Object.keys(smoke).length,metadataIssues:issues.length}));
for(const [k,v] of [...stats.entries()].sort(([a],[b])=>a.localeCompare(b)))console.log("QS_AUDIT_SUBJECT "+k+" "+JSON.stringify(v));
for(const i of issues)console.log("QS_AUDIT_ISSUE "+i.id+" "+i.reasons.join("; "));
console.log("QS_AUDIT_REPORT_PATH "+output);
