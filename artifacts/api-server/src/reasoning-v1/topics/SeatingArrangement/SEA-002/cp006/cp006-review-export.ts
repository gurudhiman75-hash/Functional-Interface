import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint, cp006ReviewContentFingerprint } from "./cp006-review-corpus.ts";

const corpus=buildCp006EnglishReviewCorpus();
const fingerprint=cp006EnglishReviewFingerprint(corpus);
const outputDir=process.env.CP006_REVIEW_OUTPUT_DIR??"/tmp/cp006-english-review";
mkdirSync(outputDir,{recursive:true});

const serializable=corpus.map((caselet)=>({
  caseletId:caselet.caseletId,
  blueprintAuthorityId:caselet.blueprintAuthorityId,
  seed:caselet.seed,
  seatCountPerRow:caselet.state.seatCountPerRow,
  contentFingerprint:cp006ReviewContentFingerprint(caselet),
  setupText:caselet.setupText,
  clueTexts:caselet.clueTexts,
  children:caselet.children.map((child)=>({
    questionOrder:child.questionOrder,
    queryContractId:child.queryContractId,
    text:child.text,
    options:child.options.map((option)=>({value:option.value,isCorrect:option.isCorrect,explanation:option.explanation})),
    answer:child.answer,
    explanation:child.explanation,
  })),
  sharedExplanation:caselet.sharedExplanation,
  diagramText:caselet.diagramText,
  diagramSvg:caselet.diagram.svg,
}));

const manifest={
  packageId:"SEA-002",
  checkpointId:"SEA-CP-006",
  locale:"en-IN",
  caseletCount:corpus.length,
  reviewFingerprint:fingerprint,
  decisionStatus:"AWAITING_SIGNED_REVIEW",
  lifecycle:{permanentQlAllocated:false,englishFrozen:false,localizationFrozen:false,questionStudioRegistered:false,questionBankWritable:false,mockTestEligible:false,publiclyPublishable:false},
};

writeFileSync(join(outputDir,"cp006-english-review-100.json"),JSON.stringify({manifest,caselets:serializable},null,2));
writeFileSync(join(outputDir,"cp006-english-review-manifest.json"),JSON.stringify(manifest,null,2));

function h(value:string):string { return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }
const cards=serializable.map((caselet,index)=>{
  const questions=caselet.children.map((child)=>`<section class="question"><h4>Q${child.questionOrder}. ${h(child.text)}</h4><ol type="A">${child.options.map((option)=>`<li>${h(option.value)}${option.isCorrect?' <strong>✓ correct</strong>':''}<div class="option-note">${h(option.explanation)}</div></li>`).join("")}</ol><p><strong>Answer:</strong> ${h(child.answer)}</p><p><strong>Explanation:</strong> ${h(child.explanation)}</p></section>`).join("");
  return `<article class="caselet"><h2>${index+1}. ${h(caselet.caseletId)}</h2><div class="meta">${h(caselet.blueprintAuthorityId)} · ${caselet.seatCountPerRow}+${caselet.seatCountPerRow} · ${h(caselet.seed)}</div><p>${h(caselet.setupText)}</p><h3>Clues</h3><ol>${caselet.clueTexts.map((clue)=>`<li>${h(clue)}</li>`).join("")}</ol><div class="diagram">${caselet.diagramSvg}</div><pre>${h(caselet.diagramText)}</pre><h3>Questions</h3>${questions}<details><summary>Shared solution</summary><pre>${h(caselet.sharedExplanation)}</pre></details><div class="fingerprint">content: ${h(caselet.contentFingerprint)}</div></article>`;
}).join("\n");

const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SEA-CP-006 English Review — 100 caselets</title><style>body{font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:1100px;margin:auto;padding:24px;line-height:1.45;background:#f5f6f8;color:#171717}.caselet{background:white;border:1px solid #ddd;border-radius:12px;padding:22px;margin:0 0 24px}.meta,.fingerprint{color:#666;font-size:13px}.question{border-top:1px solid #eee;margin-top:18px;padding-top:10px}.option-note{font-size:13px;color:#555;margin:2px 0 6px}pre{white-space:pre-wrap;background:#fafafa;padding:12px;border-radius:8px}.diagram{overflow:auto}.diagram svg{max-width:100%;height:auto}strong{font-weight:700}</style></head><body><h1>SEA-002 / SEA-CP-006 — English Review</h1><p><strong>100 caselets · en-IN · review fingerprint ${h(fingerprint)}</strong></p><p>This artifact is content-pinned. Permanent QL allocation and English freeze remain locked until the exact fingerprint receives a signed ACCEPT review.</p>${cards}</body></html>`;
writeFileSync(join(outputDir,"cp006-english-review-100.html"),html);

console.log("CP006_REVIEW_EXPORT",outputDir);
console.log("caselets",corpus.length);
console.log("review fingerprint",fingerprint);
