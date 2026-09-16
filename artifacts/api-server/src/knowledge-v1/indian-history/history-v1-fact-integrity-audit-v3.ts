import fs from "node:fs";
import path from "node:path";
import { HIS_CP001_FACTS_V1 as A } from "./prehistory-harappan/his-cp001-facts-v1";
import { HIS_CP002_FACTS_V1 as B } from "./vedic-age/his-cp002-facts-v1";
import { HIS_CP003_FACTS_V1 as C } from "./mahajanapadas-jainism-buddhism/his-cp003-facts-v1";
import { HIS_CP004_FACTS_V1 as D } from "./mauryan-empire/his-cp004-facts-v1";
import { HIS_CP005_FACTS_V1 as E } from "./post-mauryan-sangam/his-cp005-facts-v1";
import { HIS_CP006_FACTS_V1 as F } from "./gupta-post-gupta/his-cp006-facts-v1";
import { HIS_CP007_FACTS_V1 as G } from "./early-medieval-south-india/his-cp007-facts-v1";
import { HIS_CP008_FACTS_V1 as H } from "./delhi-sultanate/his-cp008-facts-v1";
import { HIS_CP009_FACTS_V1 as I } from "./vijayanagara-bahmani-regional/his-cp009-facts-v1";
import { HIS_CP010_FACTS_V1 as J } from "./mughal-empire/his-cp010-facts-v1";
import { HIS_CP011_FACTS_V1 as K } from "./marathas-sikhs-eighteenth-century/his-cp011-facts-v1";
import { HIS_CP012_FACTS_V1 as L } from "./europeans-british-expansion/his-cp012-facts-v1";
import { HIS_CP013_FACTS_V1 as M } from "./british-administration-economic-policies/his-cp013-facts-v1";
import { HIS_CP014_FACTS_V1 as N } from "./revolt-1857-social-reform/his-cp014-facts-v1";
import { HIS_CP015_FACTS_V1 as O } from "./national-movement-1885-1919/his-cp015-facts-v1";
import { HIS_CP016_FACTS_V1 as P } from "./national-movement-1919-1947/his-cp016-facts-v1";

type Fct=readonly [id:string,text:string,sources:readonly string[]];
const packs:[string,readonly Fct[]][]=[
["HIS-CP-001",A],["HIS-CP-002",B],["HIS-CP-003",C],["HIS-CP-004",D],["HIS-CP-005",E],["HIS-CP-006",F],["HIS-CP-007",G],["HIS-CP-008",H],
["HIS-CP-009",I],["HIS-CP-010",J],["HIS-CP-011",K],["HIS-CP-012",L],["HIS-CP-013",M],["HIS-CP-014",N],["HIS-CP-015",O],["HIS-CP-016",P],
] as any;
const norm=(s:string)=>s.toLowerCase().normalize("NFKD").replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g," ").trim();
const stop=new Set("the a an of in on at to from for with and or was were is are did does do this that these those as by under after before during its their his her into while than had has have became become about around roughly mainly major important associated identified regarded known used called".split(" "));
const toks=(s:string)=>new Set(norm(s).split(" ").filter(x=>x.length>=4&&!stop.has(x)));
const jac=(a:Set<string>,b:Set<string>)=>{let i=0;for(const x of a)if(b.has(x))i++;const u=a.size+b.size-i;return u?i/u:0;};
const YEAR=/\b(?:1[0-9]{3}|20[0-9]{2}|[1-9][0-9]{2})\s*(?:bce|ce|bc|ad)?\b/i;
const FRAGILE=/\b(?:first|earliest|oldest|last|only|largest|greatest|most famous|most prominent|founder|founded|began|started|introduced|invented|decisive|main cause|principal|never|always)\b/i;
const META=/\b(?:nios|ncert|unesco|textbook|school[- ]level|standard school|in the .* account|this cp|review batch|canonical fact|source fact)\b/i;
const all=packs.flatMap(([cp,facts])=>facts.map(f=>({cp,id:f[0],text:f[1],sources:[...f[2]]})));
const cpRows=packs.map(([cp,facts])=>{
 const one=facts.filter(f=>f[2].length===1);
 const dates=facts.filter(f=>YEAR.test(f[1]));
 const fragile=facts.filter(f=>FRAGILE.test(f[1]));
 const fragileSingle=facts.filter(f=>f[2].length===1&&(YEAR.test(f[1])||FRAGILE.test(f[1])));
 const meta=facts.filter(f=>META.test(f[1]));
 return {cp,factCount:facts.length,singleSource:one.length,yearClaims:dates.length,fragileClaims:fragile.length,fragileSingleSource:fragileSingle.length,metaFacts:meta.map(f=>({id:f[0],text:f[1]})),fragileSingleFacts:fragileSingle.map(f=>({id:f[0],text:f[1],sources:f[2]}))};
});
const exactMap=new Map<string,typeof all>();for(const f of all){const k=norm(f.text);const a=exactMap.get(k)??[];a.push(f);exactMap.set(k,a);}const exact=[...exactMap.values()].filter(g=>new Set(g.map(x=>x.cp)).size>1);
const near:any[]=[];
for(let i=0;i<all.length;i++){const a=all[i]!,ta=toks(a.text);if(ta.size<4)continue;for(let j=i+1;j<all.length;j++){const b=all[j]!;if(a.cp===b.cp)continue;const tb=toks(b.text);if(tb.size<4)continue;const s=jac(ta,tb);if(s>=0.72&&norm(a.text)!==norm(b.text))near.push({score:Number(s.toFixed(3)),a:{cp:a.cp,id:a.id,text:a.text},b:{cp:b.cp,id:b.id,text:b.text}});}}
near.sort((a,b)=>b.score-a.score);
const totals={facts:all.length,singleSource:cpRows.reduce((n,r)=>n+r.singleSource,0),yearClaims:cpRows.reduce((n,r)=>n+r.yearClaims,0),fragileClaims:cpRows.reduce((n,r)=>n+r.fragileClaims,0),fragileSingleSource:cpRows.reduce((n,r)=>n+r.fragileSingleSource,0),metaFacts:cpRows.reduce((n,r)=>n+r.metaFacts.length,0),exactCrossCpDuplicateGroups:exact.length,nearCrossCpPairs:near.length};
const out=path.resolve(process.cwd(),"dist/history-audit/HIS-001-V1-FACT-INTEGRITY-AUDIT-V3");fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,"history-v1-fact-integrity-audit-v3.json"),JSON.stringify({totals,cpRows,exact,near:near.slice(0,200)},null,2));
const md=["# HIS-001 History V1 — Fact Integrity Audit V3","","> Fragile/single-source flags are verification priorities, not automatic factual errors.","",`- Facts: **${totals.facts}**`,`- Single-source facts: **${totals.singleSource}**`,`- Facts containing explicit year claims: **${totals.yearClaims}**`,`- Facts with fragile/superlative/foundation wording: **${totals.fragileClaims}**`,`- Date-or-fragile facts relying on one source: **${totals.fragileSingleSource}**`,`- Canonical facts containing source/meta wording: **${totals.metaFacts}**`,`- Exact cross-CP fact duplicates: **${totals.exactCrossCpDuplicateGroups}**`,`- Near cross-CP fact pairs (Jaccard >= .72): **${totals.nearCrossCpPairs}**`,"","| CP | Facts | Single source | Year claims | Fragile wording | Fragile + single source | Meta facts |","|---|---:|---:|---:|---:|---:|---:|"];
for(const r of cpRows)md.push(`| ${r.cp} | ${r.factCount} | ${r.singleSource} | ${r.yearClaims} | ${r.fragileClaims} | ${r.fragileSingleSource} | ${r.metaFacts.length} |`);
for(const r of cpRows){md.push("",`## ${r.cp}`,"");if(r.metaFacts.length){md.push("### Canonical meta/source wording");for(const f of r.metaFacts)md.push(`- \`${f.id}\` — ${f.text}`);}md.push("","### Fragile/date claims with only one source");for(const f of r.fragileSingleFacts)md.push(`- \`${f.id}\` — ${f.text}`);}
md.push("","## Cross-CP exact duplicate facts","");if(!exact.length)md.push("None.");else for(const g of exact)md.push(`- ${g.map(x=>`${x.cp}/${x.id}`).join(" ↔ ")} — ${g[0]!.text}`);
md.push("","## Highest near-overlap fact pairs","");for(const x of near.slice(0,100))md.push(`- **${x.score}** ${x.a.cp}/${x.a.id} ↔ ${x.b.cp}/${x.b.id}\n  - ${x.a.text}\n  - ${x.b.text}`);
fs.writeFileSync(path.join(out,"history-v1-fact-integrity-audit-v3.md"),md.join("\n"));
console.log(JSON.stringify({totals,summary:cpRows.map(({cp,factCount,singleSource,yearClaims,fragileClaims,fragileSingleSource,metaFacts})=>({cp,factCount,singleSource,yearClaims,fragileClaims,fragileSingleSource,metaFacts:metaFacts.length}))},null,2));
