import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  OPS_APPROVED_CANDIDATE_IDS,
  generateApprovedOpsQuestion,
} from "./approved-teaching-canonical";
import {
  localizeApprovedOpsQuestion,
  type ApprovedOpsLocale,
  type LocalizedApprovedOpsQuestion,
} from "./approved-localization-entry";

const REVIEW_SEEDS = [0, 1, 2, 3, 5] as const;
const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly ApprovedOpsLocale[];

type ReviewRecord = LocalizedApprovedOpsQuestion & { reviewId: string };

const TEXT = {
  "hi-IN": {
    language: "Hindi",
    title: "OPS-001 स्वीकृत V3 हिंदी समीक्षा",
    count: "155 प्रश्न: 31 स्वीकृत प्रश्न-प्रकार × 5 निश्चित समीक्षा बीज।",
    instruction: "पहले प्रश्न और विकल्प जाँचें। फिर समाधान खोलकर चिह्न-बदलाव, क्रिया-क्रम, तर्क और विकल्प-चयन की जाँच करें।",
    search: "प्रश्न, प्रकार या समाधान खोजें",
    allCp: "सभी CP",
    allContracts: "सभी प्रश्न-प्रकार",
    open: "सभी समाधान खोलें",
    close: "सभी समाधान बंद करें",
    print: "प्रिंट / PDF",
    questionNatural: "प्रश्न स्वाभाविक है",
    symbolsCorrect: "चिह्न सही हैं",
    replacementVisible: "बदलाव स्पष्ट है",
    bodmasCorrect: "क्रिया-क्रम सही है",
    optionJustified: "विकल्प सिद्ध है",
    explanationTeaches: "समाधान समझाता है",
    notes: "समीक्षक टिप्पणी",
    summary: "उत्तर और स्वीकृत V3 समाधान",
    answer: "सही विकल्प",
    method: "विधि",
    solver: "सॉल्वर",
    eligible: "संभावित",
    survivors: "सही बचे",
    visible: "दिख रहे हैं",
  },
  "pa-IN": {
    language: "Punjabi",
    title: "OPS-001 ਮਨਜ਼ੂਰਸ਼ੁਦਾ V3 ਪੰਜਾਬੀ ਸਮੀਖਿਆ",
    count: "155 ਸਵਾਲ: 31 ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਸਵਾਲ-ਕਿਸਮਾਂ × 5 ਨਿਰਧਾਰਤ ਸਮੀਖਿਆ ਬੀਜ।",
    instruction: "ਪਹਿਲਾਂ ਸਵਾਲ ਅਤੇ ਵਿਕਲਪ ਜਾਂਚੋ। ਫਿਰ ਹੱਲ ਖੋਲ੍ਹ ਕੇ ਚਿੰਨ੍ਹ-ਬਦਲਾਅ, ਕਿਰਿਆ-ਕ੍ਰਮ, ਤਰਕ ਅਤੇ ਵਿਕਲਪ-ਚੋਣ ਦੀ ਜਾਂਚ ਕਰੋ।",
    search: "ਸਵਾਲ, ਕਿਸਮ ਜਾਂ ਹੱਲ ਲੱਭੋ",
    allCp: "ਸਾਰੇ CP",
    allContracts: "ਸਾਰੀਆਂ ਸਵਾਲ-ਕਿਸਮਾਂ",
    open: "ਸਾਰੇ ਹੱਲ ਖੋਲ੍ਹੋ",
    close: "ਸਾਰੇ ਹੱਲ ਬੰਦ ਕਰੋ",
    print: "ਪ੍ਰਿੰਟ / PDF",
    questionNatural: "ਸਵਾਲ ਸੁਭਾਵਿਕ ਹੈ",
    symbolsCorrect: "ਚਿੰਨ੍ਹ ਸਹੀ ਹਨ",
    replacementVisible: "ਬਦਲਾਅ ਸਪਸ਼ਟ ਹੈ",
    bodmasCorrect: "ਕਿਰਿਆ-ਕ੍ਰਮ ਸਹੀ ਹੈ",
    optionJustified: "ਵਿਕਲਪ ਸਾਬਤ ਹੈ",
    explanationTeaches: "ਹੱਲ ਸਮਝਾਉਂਦਾ ਹੈ",
    notes: "ਸਮੀਖਿਅਕ ਟਿੱਪਣੀ",
    summary: "ਉੱਤਰ ਅਤੇ ਮਨਜ਼ੂਰਸ਼ੁਦਾ V3 ਹੱਲ",
    answer: "ਸਹੀ ਵਿਕਲਪ",
    method: "ਵਿਧੀ",
    solver: "ਸਾਲਵਰ",
    eligible: "ਸੰਭਵ",
    survivors: "ਸਹੀ ਬਚੇ",
    visible: "ਦਿਖ ਰਹੇ ਹਨ",
  },
} as const;

function escapeHtml(value: unknown): string {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}
function letter(index: number): string { return String.fromCharCode(65 + index); }
function record(question: LocalizedApprovedOpsQuestion): ReviewRecord {
  return { ...question, reviewId: `${question.candidateId}-${question.locale}-S${String(question.seed).padStart(3, "0")}` };
}

function renderCard(item: ReviewRecord, ordinal: number): string {
  const t = TEXT[item.locale];
  const options = item.options.map((option, index) => `<li><b>${letter(index)}.</b> ${escapeHtml(option.value)}</li>`).join("");
  const steps = item.explanation.steps.map((step, index) => `<li><strong>${index + 1}. ${escapeHtml(step.label)}</strong><div class="trace"><span>${escapeHtml(step.expression)}</span><span class="arrow">→</span><span>${escapeHtml(step.result)}</span></div></li>`).join("");
  return `<article class="card" data-cp="${escapeHtml(item.checkpointId)}" data-candidate="${escapeHtml(item.candidateId)}"><header><span><b>#${ordinal} ${escapeHtml(item.reviewId)}</b></span><span>${escapeHtml(item.checkpointId)} · ${escapeHtml(item.taskKind)}</span></header><section class="question"><h2>${escapeHtml(item.stem)}</h2><ol class="options">${options}</ol></section><section class="checks"><label><input type="checkbox"> ${t.questionNatural}</label><label><input type="checkbox"> ${t.symbolsCorrect}</label><label><input type="checkbox"> ${t.replacementVisible}</label><label><input type="checkbox"> ${t.bodmasCorrect}</label><label><input type="checkbox"> ${t.optionJustified}</label><label><input type="checkbox"> ${t.explanationTeaches}</label></section><label class="notes">${t.notes}<textarea rows="3"></textarea></label><details><summary>${t.summary}</summary><p class="answer"><b>${t.answer}: ${letter(item.correctIndex)} — ${escapeHtml(item.answer)}</b></p><p><b>${t.method}:</b> ${escapeHtml(item.explanation.ruleStatement)}</p><ol class="steps">${steps}</ol><p class="conclusion"><b>${escapeHtml(item.explanation.conclusion)}</b></p><p class="proof">${t.solver}: ${escapeHtml(item.proof.solverRoute)} · ${t.eligible} ${item.proof.eligibleCandidateCount} · ${t.survivors} ${item.proof.survivingCandidateCount}</p></details></article>`;
}

function renderHtml(records: readonly ReviewRecord[], locale: ApprovedOpsLocale): string {
  const t = TEXT[locale];
  const cps = [...new Set(records.map((item) => item.checkpointId))].sort();
  const candidates = [...new Set(records.map((item) => item.candidateId))].sort();
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t.title}</title><style>:root{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.55;color:#18181b;background:#f4f4f5}body{margin:0}.toolbar{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid #d4d4d8;padding:10px 14px;display:flex;flex-wrap:wrap;gap:8px}.toolbar input,.toolbar select,.toolbar button{padding:8px;border:1px solid #a1a1aa;border-radius:6px;background:#fff}main{max-width:1080px;margin:auto;padding:20px}.hero,.card{background:#fff;border:1px solid #d4d4d8;border-radius:10px;margin-bottom:18px}.hero{padding:18px}.pass{background:#ecfdf5;border-left:5px solid #10b981;padding:10px}.card{overflow:hidden;break-inside:avoid}.card header{padding:10px 14px;background:#fafafa;border-bottom:1px solid #e4e4e7;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;color:#52525b}.question{padding:14px}.question h2{font-size:1.08rem;margin-top:0}.options{list-style:none;padding:0;display:grid;gap:7px}.options li{border:1px solid #e4e4e7;border-radius:7px;padding:8px}.checks{padding:0 14px 12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:7px}.notes{display:block;padding:0 14px 14px;font-weight:700}.notes textarea{display:block;width:100%;box-sizing:border-box;margin-top:4px}details{border-top:1px solid #e4e4e7;padding:12px 14px;background:#fafafa}summary{font-weight:700;cursor:pointer}.answer{background:#ecfdf5;border-left:4px solid #10b981;padding:8px}.steps li{margin-bottom:12px}.trace{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1.5fr);gap:8px;background:#fff;border:1px solid #e4e4e7;border-radius:6px;padding:8px;margin-top:4px}.arrow{font-weight:800}.conclusion{background:#fff;padding:8px}.proof{font-size:.85rem;color:#52525b}.hidden{display:none!important}@media(max-width:650px){main{padding:9px}.trace{grid-template-columns:1fr}.arrow{transform:rotate(90deg);width:max-content}}@media print{.toolbar{display:none}main{max-width:none;padding:0}.card{page-break-inside:avoid}details{display:block}details>*{display:block}}</style></head><body><div class="toolbar"><input id="search" placeholder="${t.search}"><select id="cp"><option value="">${t.allCp}</option>${cps.map((cp) => `<option>${cp}</option>`).join("")}</select><select id="candidate"><option value="">${t.allContracts}</option>${candidates.map((candidate) => `<option>${candidate}</option>`).join("")}</select><button onclick="toggleAll(true)">${t.open}</button><button onclick="toggleAll(false)">${t.close}</button><button onclick="window.print()">${t.print}</button><span id="count"></span></div><main><section class="hero"><h1>${t.title}</h1><p class="pass"><b>${t.count}</b></p><p>${t.instruction}</p></section>${records.map(renderCard).join("\n")}</main><script>const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),cp=document.getElementById('cp'),candidate=document.getElementById('candidate'),count=document.getElementById('count');function filter(){const q=search.value.trim().toLowerCase();let n=0;for(const card of cards){const ok=(!q||card.textContent.toLowerCase().includes(q))&&(!cp.value||card.dataset.cp===cp.value)&&(!candidate.value||card.dataset.candidate===candidate.value);card.classList.toggle('hidden',!ok);if(ok)n++}count.textContent=n+' ${t.visible}'}function toggleAll(open){document.querySelectorAll('details').forEach(x=>x.open=open)}search.addEventListener('input',filter);cp.addEventListener('change',filter);candidate.addEventListener('change',filter);filter();</script></body></html>`;
}

function renderMarkdown(records: readonly ReviewRecord[], locale: ApprovedOpsLocale): string {
  const t = TEXT[locale];
  const lines = [`# ${t.title}`, "", t.count, ""];
  records.forEach((item, index) => {
    lines.push(`## ${index + 1}. ${item.reviewId} — ${item.checkpointId}`, "", `**${item.stem}**`, "");
    item.options.forEach((option, optionIndex) => lines.push(`${letter(optionIndex)}. ${option.value}`));
    lines.push("", `<details><summary>${t.summary}</summary>`, "", `**${t.answer}:** ${letter(item.correctIndex)} — ${item.answer}`, "", `**${t.method}:** ${item.explanation.ruleStatement}`, "");
    item.explanation.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. **${step.label}:** ${step.expression} → ${step.result}`));
    lines.push("", `**${item.explanation.conclusion}**`, "", "</details>", "");
  });
  return lines.join("\n");
}

function renderCsv(records: readonly ReviewRecord[]): string {
  const headers = ["reviewId","locale","candidateId","checkpointId","seed","stem","optionA","optionB","optionC","optionD","correctIndex","answer","ruleStatement","steps","conclusion","solveMode","solverRoute","metadataJson"];
  const rows = records.map((item) => [item.reviewId,item.locale,item.candidateId,item.checkpointId,item.seed,item.stem,...item.options.map((option)=>option.value),item.correctIndex,item.answer,item.explanation.ruleStatement,item.explanation.steps.map((step)=>`${step.label}: ${step.expression} -> ${step.result}`).join(" | "),item.explanation.conclusion,item.solveMode,item.proof.solverRoute,item.metadata]);
  return [headers.map(csvCell).join(","),...rows.map((row)=>row.map(csvCell).join(","))].join("\n");
}

async function main(): Promise<void> {
  const outputDir = resolve(process.argv[2] ?? "ops-001-approved-localized-review");
  await rm(outputDir,{recursive:true,force:true});
  await mkdir(outputDir,{recursive:true});
  const byLocale = new Map<ApprovedOpsLocale, ReviewRecord[]>();
  for (const locale of LOCALES) {
    const records = OPS_APPROVED_CANDIDATE_IDS.flatMap((candidateId)=>REVIEW_SEEDS.map((seed)=>record(localizeApprovedOpsQuestion(generateApprovedOpsQuestion(candidateId,seed),locale))));
    if(records.length!==155) throw new Error(`Expected 155 ${locale} records; found ${records.length}.`);
    byLocale.set(locale,records);
  }
  const hindi = byLocale.get("hi-IN")!;
  const punjabi = byLocale.get("pa-IN")!;
  const combined = [...hindi,...punjabi];
  await Promise.all([
    writeFile(resolve(outputDir,"OPS-001-HI-APPROVED-V3-155.html"),renderHtml(hindi,"hi-IN"),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-HI-APPROVED-V3-155.md"),renderMarkdown(hindi,"hi-IN"),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-PA-APPROVED-V3-155.html"),renderHtml(punjabi,"pa-IN"),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-PA-APPROVED-V3-155.md"),renderMarkdown(punjabi,"pa-IN"),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-HI-PA-APPROVED-V3-310.csv"),renderCsv(combined),"utf8"),
    writeFile(resolve(outputDir,"OPS-001-HI-PA-APPROVED-V3-310.json"),JSON.stringify({generatedAt:new Date().toISOString(),branch:"feat/ops-001-end-to-end-design",localizationVersion:"OPS_APPROVED_V3_ALL_31",candidateIds:OPS_APPROVED_CANDIDATE_IDS,reviewSeeds:REVIEW_SEEDS,counts:{hindi:hindi.length,punjabi:punjabi.length,total:combined.length},records:combined},null,2),"utf8"),
    writeFile(resolve(outputDir,"README.md"),"# OPS-001 Approved V3 Hindi/Punjabi Review\n\nOpen the Hindi or Punjabi HTML file first. Each contains 155 questions: 31 retained contracts × 5 deterministic review seeds. The dedicated runtime proof separately validates 3,100 localized questions (31 contracts × 50 seeds × 2 locales). Options, answers, correct index and solver proof remain identical to English.\n","utf8"),
  ]);
  console.log("OPS-001 approved localized review generated.",{hindi:hindi.length,punjabi:punjabi.length,total:combined.length,outputDir});
}

await main();
