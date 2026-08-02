
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { BLR_CP006_CONTRACTS } from "./cp006-model";
import { buildBlrCp006Telemetry, generateBlrCp006FrozenBank } from "./cp006-runtime";

const outputDir = resolve(process.argv[2] ?? "cp006-final-freeze-output");
mkdirSync(outputDir, { recursive: true });

const bank = generateBlrCp006FrozenBank();
const summary = buildBlrCp006Telemetry(bank);

const jsonl = bank.map((question) => JSON.stringify(question)).join("\n") + "\n";
writeFileSync(resolve(outputDir, "blr-cp006-final-freeze-records.jsonl"), jsonl, "utf8");
writeFileSync(
  resolve(outputDir, "blr-cp006-permanent-contracts.json"),
  JSON.stringify(BLR_CP006_CONTRACTS, null, 2) + "\n",
  "utf8",
);
writeFileSync(
  resolve(outputDir, "blr-cp006-final-freeze-summary.json"),
  JSON.stringify(summary, null, 2) + "\n",
  "utf8",
);

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const csvHeaders = [
  "itemId",
  "qlId",
  "solveAuthority",
  "sourcePrototypeId",
  "seed",
  "keyStyle",
  "scenarioId",
  "topologyId",
  "sharedPrompt",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "answer",
  "decodedStatements",
  "coreConcept",
  "decodingAudit",
  "graphAudit",
  "conclusion",
  "examShortcut",
  "commonTraps",
  "optionAnalysis",
  "familyTree",
  "semanticFingerprint",
];
const csvRows = bank.map((question) => [
  question.itemId,
  question.qlId,
  question.solveAuthority,
  question.sourcePrototypeId,
  question.seed,
  question.keyStyle,
  question.scenarioId,
  question.topologyId,
  question.sharedPrompt,
  question.stem,
  ...question.options.map((option) => option.text),
  question.correctIndex,
  question.answer,
  question.decodedStatements,
  question.explanation.coreConcept,
  question.explanation.decodingAudit,
  question.explanation.graphAudit,
  question.explanation.conclusion,
  question.explanation.examShortcut,
  question.explanation.commonTraps,
  question.explanation.optionAnalysis,
  question.explanation.familyTree,
  question.metadata.semanticFingerprint,
]);
writeFileSync(
  resolve(outputDir, "blr-cp006-final-freeze-records.csv"),
  [
    csvHeaders.map(csvCell).join(","),
    ...csvRows.map((row) => row.map(csvCell).join(",")),
  ].join("\n") + "\n",
  "utf8",
);

const freezeMarkdown = `# BLR-CP-006 — Final English Discovery Freeze

Status: **structurally saturated and frozen for English review runtime only**.

## Scope

BLR-CP-006 decodes a supplied kinship code, converts every adjacent coded pair into a directed family assertion, closes the decoded family graph and answers relation, person, gender and pair queries.

## Frozen inventory

\`\`\`text
approved English review questions          ${summary.recordCount}
source prototypes                           ${summary.prototypeCount}
frozen solve authorities                     ${summary.authorityCount}
permanent QLs                                ${summary.permanentQlCount}
source topologies                            ${summary.topologyCount}
decoded statement instances                 ${summary.statementCount}
full learner-item signatures unique         ${summary.uniqueSignatureCount} / ${summary.recordCount}
\`\`\`

Prototype and question counts were discovered through source, boundary, inverse, edge, answer-contract and CP-007 ownership audits. They were not established as quotas.

## Permanent allocation

\`\`\`text
BLR-QL-026  RESOLVE_CODED_RELATION
BLR-QL-027  IDENTIFY_PERSON_FROM_CODED_GRAPH
BLR-QL-028  DETERMINE_GENDER_FROM_CODED_GRAPH
BLR-QL-029  SELECT_CODED_RELATION_PAIR
BLR-QL-030  RESOLVE_CODED_FAMILY_SET_RELATION
\`\`\`

Next available chapter identity: \`BLR-QL-031\`.

## Key decisions

- direct, reverse, two-link, three-link, endpoint and internal-person relation queries merge under one decoded-relation authority;
- person identification, gender and pair selection remain separate because their answer contracts and option validators differ;
- multi-statement family sets remain separate because every decoded statement must be retained in one connected graph and audited as a set;
- symbol, letter and neutral-word tokens are presentation parameters, not different solve authorities;
- arithmetic precedence is forbidden;
- one token has one meaning within a question;
- every fixed gender comes from a decoded gender-bearing relation, never from a name or letter label;
- expression construction, missing-token and correct/incorrect coded-statement tasks belong to CP-007.

## Verification

Every one of the ${summary.recordCount} questions is independently re-solved from its exported graph without calling the production relation resolver. The proof also covers unique code tokens, explicit direction, deterministic replay, four unique options, diagnostic misconception codes, family-tree parity, all answer positions and all three code-token styles.

## Release boundary

\`\`\`text
English permanent review runtime          available
Question Studio                          disabled
Question Bank                            disabled
mock tests                               disabled
Hindi/Punjabi localisation               not started
public publication                       disabled
production staging                       disabled
merge                                    not authorised
\`\`\`
`;
writeFileSync(
  resolve(outputDir, "BLR-CP-006-FINAL-DISCOVERY-FREEZE.md"),
  freezeMarkdown,
  "utf8",
);

const embedded = JSON.stringify(bank).replaceAll("</", "<\\/");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BLR-CP-006 Coded Relations Review</title>
<style>
:root{color-scheme:light dark;--bg:#f3f6f9;--card:#fff;--text:#17212b;--muted:#607080;--line:#d7dfe7;--accent:#145da8;--soft:#eaf3ff;--good:#14733f;--node:#fff}
@media(prefers-color-scheme:dark){:root{--bg:#0e151b;--card:#18212a;--text:#eef3f7;--muted:#a8b4bf;--line:#3b4854;--accent:#80bdff;--soft:#172d43;--good:#7cdda0;--node:#202c37}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);padding:12px 16px;box-shadow:0 2px 10px #0002}
h1{font-size:1.2rem;margin:0 0 8px}.controls{display:grid;grid-template-columns:160px 1fr auto auto;gap:8px}
input,select,button{font:inherit;padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)}
.stats{margin-top:8px;color:var(--muted);font-size:.88rem}main{max-width:1120px;margin:auto;padding:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px #0001}
.meta{font-size:.82rem;color:var(--muted);overflow-wrap:anywhere}.badge{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:2px 7px;margin:0 4px 5px 0}
.prompt{white-space:pre-wrap;background:var(--soft);border-left:4px solid var(--accent);padding:12px;border-radius:8px;line-height:1.52}
.stem{font-weight:750;margin:14px 0 8px;font-size:1.06rem}.options{display:grid;gap:7px}.option{border:1px solid var(--line);padding:9px 11px;border-radius:8px}.option.correct{border-color:var(--good);color:var(--good);font-weight:750}
details{margin-top:12px}summary{cursor:pointer;font-weight:700}.solution{border-top:1px solid var(--line);margin-top:9px;padding-top:9px}.solution h4{margin:12px 0 5px}.solution ul,.solution ol{margin-top:5px}
.diagram{border:1px solid var(--line);border-radius:10px;margin-top:14px;overflow:hidden}.diagram-head{font-weight:700;padding:9px 11px;border-bottom:1px solid var(--line)}.diagram-scroll{overflow-x:auto;padding:8px}
svg{display:block;min-width:680px;width:100%;height:auto}.edge{stroke:var(--muted);stroke-width:2;fill:none}.path{stroke:var(--accent);stroke-width:4}.node{fill:var(--node);stroke:var(--line);stroke-width:2}.node.path{stroke:var(--accent);stroke-width:4}.name{fill:var(--text);font-size:14px;font-weight:700;text-anchor:middle}.gender{fill:var(--muted);font-size:11px;text-anchor:middle}.gen{fill:var(--muted);font-size:12px;font-weight:700}.legend{padding:0 12px 10px;color:var(--muted);font-size:.82rem}
.ascii{white-space:pre;overflow:auto;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:10px;font:12px/1.4 ui-monospace,monospace}
#more{width:100%;margin-bottom:24px}@media(max-width:700px){.controls{grid-template-columns:1fr 1fr}.controls input{grid-column:1/-1}}
</style>
</head>
<body>
<header>
<h1>BLR-CP-006 — Coded Relation Decoding Review</h1>
<div class="controls">
<select id="ql"><option value="">All QLs</option></select>
<input id="search" placeholder="Search token, stem, answer or prototype…">
<button id="answers">Reveal answers</button>
<button id="diagrams">Hide diagrams</button>
</div>
<div class="stats" id="stats"></div>
</header>
<main><div id="cards"></div><button id="more">Load 25 more</button></main>
<script>
const DATA=${embedded};let visible=25,reveal=false,showDiagrams=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ql=document.getElementById('ql'),search=document.getElementById('search'),cards=document.getElementById('cards'),stats=document.getElementById('stats'),more=document.getElementById('more'),answers=document.getElementById('answers'),diagrams=document.getElementById('diagrams');
[...new Set(DATA.map(x=>x.qlId))].sort().forEach(x=>ql.insertAdjacentHTML('beforeend','<option>'+esc(x)+'</option>'));
function filtered(){const term=search.value.trim().toLowerCase();return DATA.filter(x=>(!ql.value||x.qlId===ql.value)&&(!term||[x.sharedPrompt,x.stem,x.answer,x.sourcePrototypeId,...x.options.map(o=>o.text)].join(' ').toLowerCase().includes(term)))}
function generations(tree){return [...new Set(tree.nodes.map(n=>n.generation))].sort((a,b)=>b-a)}
function diagram(tree){
 const gens=generations(tree),w=900,row=145,top=48,h=top+gens.length*row+45,pos=new Map(),path=new Set(tree.query.pathPersonIds||[]);
 gens.forEach((g,ri)=>{const nodes=tree.nodes.filter(n=>n.generation===g);const gap=w/(nodes.length+1);nodes.forEach((n,i)=>pos.set(n.id,{x:gap*(i+1),y:top+ri*row}))});
 const edges=tree.edges.map(e=>{const a=pos.get(e.sourceId),b=pos.get(e.targetId);if(!a||!b)return'';const p=path.has(e.sourceId)&&path.has(e.targetId)?' path':'';if(e.type==='marriage')return '<line class="edge'+p+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"/>';const mid=(a.y+b.y)/2;return '<path class="edge'+p+'" d="M '+a.x+' '+a.y+' V '+mid+' H '+b.x+' V '+b.y+'"/>'}).join('');
 const labels=gens.map((g,i)=>'<text class="gen" x="10" y="'+(top+i*row+4)+'">Generation '+g+'</text>').join('');
 const nodes=tree.nodes.map(n=>{const p=pos.get(n.id),pc=path.has(n.id)?' path':'';return '<g><rect class="node'+pc+'" x="'+(p.x-42)+'" y="'+(p.y-27)+'" width="84" height="54" rx="9"/><text class="name" x="'+p.x+'" y="'+(p.y-2)+'">'+esc(n.label)+'</text><text class="gender" x="'+p.x+'" y="'+(p.y+15)+'">'+esc(n.gender)+'</text></g>'}).join('');
 return '<div class="diagram"><div class="diagram-head">'+esc(tree.title)+'</div><div class="diagram-scroll"><svg viewBox="0 0 '+w+' '+h+'">'+labels+edges+nodes+'</svg></div><div class="legend">Marriage, parent-child and sibling links are decoded from the supplied key. Highlight = query path.</div><details><summary>ASCII fallback</summary><pre class="ascii">'+esc(tree.asciiFallback)+'</pre></details></div>'
}
function list(items,ordered=false){return items?.length?'<'+(ordered?'ol':'ul')+'>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</'+(ordered?'ol':'ul')+'>':''}
function card(x,i){const opts=x.options.map((o,j)=>'<div class="option '+(reveal&&o.isCorrect?'correct':'')+'">'+String.fromCharCode(65+j)+'. '+esc(o.text)+'</div>').join('');const analyses=x.explanation.optionAnalysis.map(a=>a.optionLabel+'. '+a.optionText+' — '+a.explanation);return '<article class="card"><div class="meta"><span class="badge">'+esc(x.qlId)+'</span><span class="badge">'+esc(x.solveAuthority)+'</span><span class="badge">'+esc(x.keyStyle)+'</span><br>Review '+(i+1)+' · '+esc(x.itemId)+' · '+esc(x.sourcePrototypeId)+'</div><div class="prompt">'+esc(x.sharedPrompt)+'</div>'+(showDiagrams?diagram(x.explanation.familyTree):'')+'<div class="stem">'+esc(x.stem)+'</div><div class="options">'+opts+'</div><details '+(reveal?'open':'')+'><summary>Answer and explanation</summary><div class="solution"><h4>Correct answer</h4><p><strong>'+esc(x.answer)+'</strong></p><h4>Core concept</h4>'+list(x.explanation.coreConcept)+'<h4>Token-by-token decoding</h4>'+list(x.explanation.decodingAudit,true)+'<h4>Graph audit</h4>'+list(x.explanation.graphAudit,true)+'<h4>Conclusion</h4><p>'+esc(x.explanation.conclusion)+'</p><h4>Exam shortcut</h4><p>'+esc(x.explanation.examShortcut)+'</p><h4>Common traps</h4>'+list(x.explanation.commonTraps)+'<h4>Option analysis</h4>'+list(analyses)+'</div></details></article>'}
function render(reset=true){if(reset)visible=25;const rows=filtered(),shown=rows.slice(0,visible);cards.innerHTML=shown.map(card).join('');stats.textContent='Showing '+shown.length+' of '+rows.length+' matching questions · ${summary.recordCount} total · ${summary.statementCount} decoded statements';more.style.display=visible<rows.length?'block':'none'}
ql.onchange=()=>render();search.oninput=()=>render();more.onclick=()=>{visible+=25;render(false)};answers.onclick=()=>{reveal=!reveal;answers.textContent=reveal?'Hide answers':'Reveal answers';render(false)};diagrams.onclick=()=>{showDiagrams=!showDiagrams;diagrams.textContent=showDiagrams?'Hide diagrams':'Show diagrams';render(false)};render();
</script>
</body></html>`;
writeFileSync(
  resolve(outputDir, "blr-cp006-final-freeze-review.html"),
  html,
  "utf8",
);

console.log(JSON.stringify({
  outputDir,
  ...summary,
  files: [
    "blr-cp006-final-freeze-summary.json",
    "blr-cp006-permanent-contracts.json",
    "blr-cp006-final-freeze-records.jsonl",
    "blr-cp006-final-freeze-records.csv",
    "blr-cp006-final-freeze-review.html",
    "BLR-CP-006-FINAL-DISCOVERY-FREEZE.md",
  ],
}, null, 2));
