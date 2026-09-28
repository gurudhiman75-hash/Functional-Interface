import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { generateDiDeliveryNoveltyMix } from "./di-delivery-novelty-mix-v1";

function esc(value:unknown){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

function explanation(q:any){
  if(typeof q.explanation==="string") return q.explanation;
  if(q.richExplanation) return [q.richExplanation.keyIdea,...(q.richExplanation.steps??[])].join(" ");
  return String(q.explanation??"");
}

function stimulusHtml(q:any){
  const svgs=Array.isArray(q.stimulusSvgs)?q.stimulusSvgs:[];
  if(svgs.length) return `<div class="stimuli">${svgs.map((svg:string)=>`<div class="stimulus">${svg}</div>`).join("")}</div>`;
  if(q.stimulus){
    return `<details class="raw"><summary>Stimulus data</summary><pre>${esc(JSON.stringify(q.stimulus,null,2))}</pre></details>`;
  }
  return "";
}

const profiles=[
  {id:"SSC_CGL_TIER_I",label:"SSC CGL Tier I",seed:"DI-MIX-FULL-REVIEW-SSC"},
  {id:"BANKING_PRELIMS",label:"Banking Prelims",seed:"DI-MIX-FULL-REVIEW-PRELIMS"},
  {id:"BANKING_MAINS",label:"Banking Mains",seed:"DI-MIX-FULL-REVIEW-MAINS"},
] as const;

const sections:string[]=[];
for(const profile of profiles){
  const result=await generateDiDeliveryNoveltyMix({
    examProfile:profile.id,
    language:"en",
    count:20,
    seed:profile.seed,
  });
  const mix=result.generationContext.noveltyMix;
  const counts=mix.actualCounts;
  const sourceCounts=new Map<string,number>();
  for(const q of result.questions){
    sourceCounts.set(q.noveltySourceMode,(sourceCounts.get(q.noveltySourceMode)??0)+1);
  }
  sections.push(`
    <section class="profile">
      <h2>${esc(profile.label)}</h2>
      <div class="summary">
        <span><b>Questions:</b> ${result.questions.length}</span>
        <span><b>Standard:</b> ${counts.STANDARD}</span>
        <span><b>Fresh/Familiar:</b> ${counts.FRESH_FAMILIAR}</span>
        <span><b>Higher Novelty:</b> ${counts.HIGHER_NOVELTY}</span>
      </div>
      <p class="sources"><b>Source distribution:</b> ${esc([...sourceCounts.entries()].map(([k,v])=>`${k} × ${v}`).join(" · "))}</p>
      ${result.questions.map((q:any,index:number)=>`
        <article class="question tier-${esc(q.noveltyTier)}">
          <div class="review-meta">
            <span>Q${index+1}</span>
            <span class="tier">${esc(q.noveltyTier)}</span>
            <span>${esc(q.noveltySourceMode)}</span>
            <span>${esc(q.difficultyLabel??q.difficulty??"")}</span>
          </div>
          ${stimulusHtml(q)}
          <p class="stem">${esc(q.stem??q.text)}</p>
          <ol type="A">${(q.options??[]).map((o:string)=>`<li>${esc(o)}</li>`).join("")}</ol>
          <details>
            <summary>Reviewer answer & explanation</summary>
            <p><b>Answer:</b> ${esc(q.answer??q.options?.[q.correctIndex])}</p>
            <p><b>Explanation:</b> ${esc(explanation(q))}</p>
            <p class="meta"><b>Source CP:</b> ${esc(q.canonicalProblemId)} · <b>Package:</b> ${esc(q.packageId)} · <b>Task:</b> ${esc(q.taskKind)}</p>
          </details>
        </article>
      `).join("")}
    </section>
  `);
}

const html=`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Examtree DI Mix — Full Batch Review V3</title>
<style>
body{font-family:Arial,sans-serif;max-width:1180px;margin:28px auto;padding:0 18px;line-height:1.45;color:#1f2937}
h1{margin-bottom:6px}.intro{color:#64748b;margin-top:0}.profile{margin:44px 0}.summary{display:flex;flex-wrap:wrap;gap:14px;background:#f8fafc;border:1px solid #e2e8f0;padding:12px;border-radius:10px}
.sources{font-size:13px;color:#475569}.question{border:1px solid #dbe2ea;border-radius:10px;padding:16px;margin:16px 0;background:white}
.review-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#475569;margin-bottom:12px}.review-meta span{background:#f1f5f9;border-radius:999px;padding:3px 8px}
.tier-STANDARD{border-left:5px solid #94a3b8}.tier-FRESH_FAMILIAR{border-left:5px solid #f59e0b}.tier-HIGHER_NOVELTY{border-left:5px solid #8b5cf6}
.stem{font-size:16px;font-weight:600}.stimuli{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;margin:12px 0}.stimulus{overflow:auto;border:1px solid #e2e8f0;border-radius:8px;padding:8px}.stimulus svg{max-width:100%;height:auto}
details{margin-top:10px}.raw pre{white-space:pre-wrap;font-size:11px}.meta{font-size:12px;color:#64748b}
</style>
</head>
<body>
<h1>Examtree DI Chapter Delivery Mix — Full Batch Review V3</h1>
<p class="intro">Reviewer-only view. Tier/source labels and answer panels are not learner-facing. Each profile contains a deterministic 20-question chapter mix.</p>
${sections.join("")}
</body>
</html>`;

const out=process.argv[2]||"/tmp/DI-MIX-FULL-BATCH-REVIEW-V3.html";
mkdirSync(dirname(out),{recursive:true});
writeFileSync(out,html);
console.log(out);
