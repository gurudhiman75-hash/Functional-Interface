import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { canonicalDigest } from "../../SEA-001/canonical.ts";
import { buildCp006EnglishReviewCorpus, cp006EnglishReviewFingerprint, cp006ReviewContentFingerprint } from "./cp006-review-corpus.ts";
import { cp006CorrectedRationaleMatch, localizeCp006PolishedReviewCaselet } from "./localization/language-fidelity-polish.ts";
import { SEA002_CP006_TRANSLATION_TARGET_LOCALES } from "./localization/readiness.ts";
import { SEA002_CP006_ENGLISH_FREEZE } from "./permanent/freeze.ts";

const corpus=buildCp006EnglishReviewCorpus();
const englishFingerprint=cp006EnglishReviewFingerprint(corpus);
if(!SEA002_CP006_ENGLISH_FREEZE.freezeActive) throw new Error("CP006 corrected English freeze is not active.");
if(englishFingerprint!==SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint) throw new Error(`CP006 localized export source drift: frozen=${SEA002_CP006_ENGLISH_FREEZE.approvedReviewFingerprint}, current=${englishFingerprint}`);

let canonicalCorrectedRationaleCount=0;
for(const caselet of corpus) for(const child of caselet.children) for(const option of child.options) if(cp006CorrectedRationaleMatch(option.explanation)) canonicalCorrectedRationaleCount+=1;
if(canonicalCorrectedRationaleCount!==84) throw new Error(`CP006 corrected rationale inventory drifted: ${canonicalCorrectedRationaleCount}`);

const localized=corpus.flatMap((canonical)=>SEA002_CP006_TRANSLATION_TARGET_LOCALES.map((locale)=>({canonical,localized:localizeCp006PolishedReviewCaselet(canonical,locale)})));
const localizedReviewFingerprint=canonicalDigest(localized.map(({localized:item})=>({locale:item.locale,canonicalCaseletId:item.canonicalCaseletId,canonicalParityFingerprint:item.canonicalParityFingerprint,canonicalContentFingerprint:item.canonicalContentFingerprint,presentationFingerprint:item.presentationFingerprint})));

const outputDir=process.env.CP006_LOCALIZED_REVIEW_OUTPUT_DIR??"/tmp/cp006-hi-pa-review-final";
mkdirSync(outputDir,{recursive:true});
const serializable=localized.map(({canonical,localized:item})=>({
  locale:item.locale,
  canonicalCaseletId:canonical.caseletId,
  blueprintAuthorityId:canonical.blueprintAuthorityId,
  permanentQlId:item.permanentQlId,
  seed:canonical.seed,
  seatCountPerRow:canonical.state.seatCountPerRow,
  canonicalContentFingerprint:cp006ReviewContentFingerprint(canonical),
  canonicalParityFingerprint:item.canonicalParityFingerprint,
  localizedPresentationFingerprint:item.presentationFingerprint,
  english:{
    setupText:canonical.setupText,clueTexts:canonical.clueTexts,diagramText:canonical.diagramText,sharedExplanation:canonical.sharedExplanation,
    children:canonical.children.map((child)=>({questionOrder:child.questionOrder,queryContractId:child.queryContractId,text:child.text,answer:child.answer,explanation:child.explanation,options:child.options.map((option)=>({value:option.value,isCorrect:option.isCorrect,misconceptionId:option.misconceptionId??null,explanation:option.explanation}))})),
  },
  localized:{
    setupText:item.setupText,clueTexts:item.clueTexts,diagramText:item.diagramText,sharedExplanation:item.sharedExplanation,teachingSkeleton:item.teachingSkeleton,
    children:item.children.map((child)=>({questionOrder:child.questionOrder,queryContractId:child.queryContractId,text:child.text,canonicalAnswer:child.canonicalAnswer,displayAnswer:child.displayAnswer,explanation:child.explanation,options:child.options.map((option)=>({displayValue:option.displayValue,isCorrect:option.isCorrect,misconceptionId:option.misconceptionId??null,explanation:option.explanation}))})),
  },
}));

const manifest={
  packageId:"SEA-002",checkpointId:"SEA-CP-006",canonicalLocale:"en-IN",targetLocales:SEA002_CP006_TRANSLATION_TARGET_LOCALES,
  canonicalCaseletCount:100,localizedCaseletCount:200,localizedChildQuestionCount:800,
  canonicalCorrectedRationaleCount:84,localizedCorrectedRationaleCount:168,
  englishFreezeFingerprint:englishFingerprint,localizedReviewFingerprint,
  renderer:"SEA002_CP006_EXPLANATION_PARITY_POSITION_V3_ERRATA_LANGUAGE_FIDELITY",
  decisionStatus:"EXECUTABLE_EXPLANATION_PARITY_HUMAN_REVIEW_REQUIRED",humanLanguageReview:"PENDING",multilingualFreeze:false,
  lifecycle:{permanentQlCount:4,englishFrozen:true,localizationFrozen:false,questionStudioRegistered:false,questionBankWritable:false,mockTestEligible:false,productionStaging:false,publiclyPublishable:false},
};
writeFileSync(join(outputDir,"cp006-hi-pa-review-200.json"),JSON.stringify({manifest,caselets:serializable},null,2));
writeFileSync(join(outputDir,"cp006-hi-pa-review-manifest.json"),JSON.stringify(manifest,null,2));

function h(value:string):string{return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");}
function languageName(locale:string):string{return locale==="hi-IN"?"Hindi":"Punjabi";}
const cards=serializable.map((caselet,index)=>{
  const questions=caselet.english.children.map((child,childIndex)=>{
    const target=caselet.localized.children[childIndex]!;
    const options=child.options.map((option,optionIndex)=>{const targetOption=target.options[optionIndex]!;return `<tr><td>${String.fromCharCode(65+optionIndex)}. ${h(option.value)}${option.isCorrect?" ✓":""}<div class="note">${h(option.explanation)}</div></td><td>${String.fromCharCode(65+optionIndex)}. ${h(targetOption.displayValue)}${targetOption.isCorrect?" ✓":""}<div class="note">${h(targetOption.explanation)}</div></td></tr>`;}).join("");
    return `<section class="question"><h4>Q${child.questionOrder} · ${h(child.queryContractId)}</h4><div class="cols"><div><b>English</b><p>${h(child.text)}</p></div><div><b>${languageName(caselet.locale)}</b><p>${h(target.text)}</p></div></div><table><thead><tr><th>English options / rationale</th><th>${languageName(caselet.locale)} options / rationale</th></tr></thead><tbody>${options}</tbody></table><div class="cols"><div><b>Answer:</b> ${h(child.answer)}<p>${h(child.explanation)}</p></div><div><b>Answer:</b> ${h(target.displayAnswer)}<p>${h(target.explanation)}</p></div></div></section>`;
  }).join("");
  return `<article class="caselet"><h2>${index+1}. ${h(caselet.canonicalCaseletId)} · ${languageName(caselet.locale)}</h2><div class="meta">${h(caselet.blueprintAuthorityId)} · ${h(caselet.permanentQlId)} · ${caselet.seatCountPerRow}+${caselet.seatCountPerRow}</div><h3>Setup</h3><div class="cols"><div><b>English</b><p>${h(caselet.english.setupText)}</p></div><div><b>${languageName(caselet.locale)}</b><p>${h(caselet.localized.setupText)}</p></div></div><h3>Clues</h3><div class="cols"><ol>${caselet.english.clueTexts.map((clue)=>`<li>${h(clue)}</li>`).join("")}</ol><ol>${caselet.localized.clueTexts.map((clue)=>`<li>${h(clue)}</li>`).join("")}</ol></div><h3>Arrangement</h3><div class="cols"><pre>${h(caselet.english.diagramText)}</pre><pre>${h(caselet.localized.diagramText)}</pre></div><h3>Questions and rationales</h3>${questions}<h3>Shared solution — teaching-path comparison</h3><div class="cols"><pre>${h(caselet.english.sharedExplanation)}</pre><pre>${h(caselet.localized.sharedExplanation)}</pre></div><div class="fingerprint">canonical: ${h(caselet.canonicalContentFingerprint)} · localized: ${h(caselet.localizedPresentationFingerprint)}</div></article>`;
}).join("\n");
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SEA-CP-006 Hindi/Punjabi Review</title><style>body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;max-width:1500px;margin:auto;padding:24px;line-height:1.45;background:#f5f6f8;color:#171717}.caselet{background:#fff;border:1px solid #ddd;border-radius:12px;padding:22px;margin:0 0 28px}.meta,.fingerprint,.note{color:#666;font-size:12px}.cols{display:grid;grid-template-columns:1fr 1fr;gap:18px}.question{border-top:1px solid #ddd;margin-top:20px;padding-top:12px}table{width:100%;border-collapse:collapse;margin:8px 0 16px}th,td{width:50%;text-align:left;vertical-align:top;border:1px solid #ddd;padding:9px}pre{white-space:pre-wrap;background:#fafafa;padding:12px;border-radius:8px;overflow:auto}@media(max-width:850px){.cols{grid-template-columns:1fr}th,td{display:block;width:auto}}</style></head><body><h1>SEA-002 / SEA-CP-006 — Hindi/Punjabi Review Candidate</h1><p><strong>100 Hindi + 100 Punjabi caselets · 800 child questions · 168 corrected-rationale translations</strong></p><p>Frozen English: <code>${h(englishFingerprint)}</code><br>Localized review: <code>${h(localizedReviewFingerprint)}</code></p><p>Errata fidelity and gender-neutral participant wording are applied. Human Hindi/Punjabi approval is still required. Multilingual freeze, Studio, Bank, mocks, staging and public delivery remain off.</p>${cards}</body></html>`;
writeFileSync(join(outputDir,"cp006-hi-pa-review-200.html"),html);

console.log("CP006_FINAL_LOCALIZED_REVIEW_EXPORT",outputDir);
console.log("canonical/localized caselets",100,200);
console.log("localized child questions",800);
console.log("canonical/localized corrected rationales",84,168);
console.log("English freeze fingerprint",englishFingerprint);
console.log("localized review fingerprint",localizedReviewFingerprint);
console.log("human language review","PENDING");
console.log("multilingual freeze",false);
