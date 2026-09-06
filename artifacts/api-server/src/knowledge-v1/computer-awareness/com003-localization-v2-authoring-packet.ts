import fs from "node:fs";
import path from "node:path";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import { COM003_LOCALIZATION_MIGRATION_ROWS_V1 } from "./com003-localization-migration-delta-v1";
import {
  findCom003LegacyLocalizedRelationV1,
  lookupCom003AnswerTranslationV1,
  lookupCom003OptionTranslationV1,
  type Com003LocalizationLanguageV2,
} from "./com003-localization-translation-memory-v1";

export type Com003LocalizationV2AuthoringQuestion = {
  questionId: string;
  qlId: string;
  cpId: string;
  examSurfaceFamily: string;
  surfaceMode: string;
  targetFactId: string;
  english: {
    stem: string;
    options: readonly string[];
    correctIndex: number;
    canonicalAnswer: string;
    explanation: string;
  };
  migrationAction: string;
  languages: Record<Com003LocalizationLanguageV2, {
    optionMemory: ReturnType<typeof lookupCom003OptionTranslationV1>[];
    answerMemory: ReturnType<typeof lookupCom003AnswerTranslationV1>;
    legacySemanticCandidates: Array<{
      sourceQuestionId: string;
      stem: string;
      options: string[];
      canonicalAnswer: string;
      explanation: string;
    }>;
    authoringStatus: "STEM_EXPLANATION_REQUIRED";
  }>;
};

const migrationById = new Map(COM003_LOCALIZATION_MIGRATION_ROWS_V1.map((row) => [row.currentQuestionId, row]));

function languagePacket(q: (typeof COM003_ENGLISH_REVIEW_CORPUS_V16_2)[number], language: Com003LocalizationLanguageV2) {
  return {
    optionMemory: q.options.map((option) => lookupCom003OptionTranslationV1(language, option)),
    answerMemory: lookupCom003AnswerTranslationV1(language, q.canonicalAnswer),
    legacySemanticCandidates: findCom003LegacyLocalizedRelationV1(language, q.qlId, q.targetFactId, q.canonicalAnswer).map((item) => ({
      sourceQuestionId: item.sourceQuestionId,
      stem: item.stem,
      options: [...item.options],
      canonicalAnswer: item.canonicalAnswer,
      explanation: item.explanation,
    })),
    authoringStatus: "STEM_EXPLANATION_REQUIRED" as const,
  };
}

export const COM003_LOCALIZATION_V2_AUTHORING_PACKET: readonly Com003LocalizationV2AuthoringQuestion[] = Object.freeze(
  COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((q) => {
    const migration = migrationById.get(q.questionId);
    if (!migration) throw new Error(`COM-003 V2 authoring packet missing migration row ${q.questionId}`);
    return {
      questionId: q.questionId,
      qlId: q.qlId,
      cpId: q.cpId,
      examSurfaceFamily: q.examSurfaceFamily,
      surfaceMode: q.surfaceMode,
      targetFactId: q.targetFactId,
      english: {
        stem: q.stem,
        options: q.options,
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
      },
      migrationAction: migration.localizationAction,
      languages: {
        hi: languagePacket(q, "hi"),
        pa: languagePacket(q, "pa"),
      },
    };
  }),
);

export function auditCom003LocalizationV2AuthoringPacket() {
  const issues: string[] = [];
  if (COM003_LOCALIZATION_V2_AUTHORING_PACKET.length !== 228) issues.push(`COUNT:${COM003_LOCALIZATION_V2_AUTHORING_PACKET.length}`);
  for (const item of COM003_LOCALIZATION_V2_AUTHORING_PACKET) {
    for (const language of ["hi", "pa"] as const) {
      if (item.languages[language].optionMemory.length !== 4) issues.push(`OPTION_COUNT:${language}:${item.questionId}`);
      if (item.languages[language].authoringStatus !== "STEM_EXPLANATION_REQUIRED") issues.push(`STATUS:${language}:${item.questionId}`);
    }
  }
  return {
    valid: issues.length === 0,
    questions: COM003_LOCALIZATION_V2_AUTHORING_PACKET.length,
    localizedOutputsToAuthor: COM003_LOCALIZATION_V2_AUTHORING_PACKET.length * 2,
    sourceAuthority: "COM003_ENGLISH_REVIEW_CORPUS_V16_2" as const,
    translationMemoryAuthority: "COM-003-LOCALIZATION-TRANSLATION-MEMORY-V1" as const,
    governance: "AUTHORING_PACKET_NOT_RUNTIME" as const,
    issues,
  };
}

const esc=(v:unknown)=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

export function buildCom003LocalizationV2AuthoringPacketHtml(){
 const audit=auditCom003LocalizationV2AuthoringPacket();
 if(!audit.valid) throw new Error(audit.issues.join(", "));
 const sections=COM003_LOCALIZATION_V2_AUTHORING_PACKET.map((q,i)=>{
  const lang=(code:"hi"|"pa",label:string)=>{
    const m=q.languages[code];
    const options=m.optionMemory.map((o,j)=>`<li><b>${esc(q.english.options[j])}</b> → ${o.status==="UNIQUE"?esc(o.selected):`<span class="warntext">${esc(o.status)}: ${esc(o.candidates.join(" | "))}</span>`}</li>`).join("");
    const candidates=m.legacySemanticCandidates.slice(0,3).map(c=>`<details><summary>${esc(c.sourceQuestionId)}</summary><p><b>Stem:</b> ${esc(c.stem)}</p><p><b>Explanation:</b> ${esc(c.explanation)}</p></details>`).join("") || "<p class=\"warntext\">No exact legacy fact/answer semantic candidate.</p>";
    return `<div class="lang"><h4>${label}</h4><p><b>Answer memory:</b> ${m.answerMemory.status} ${m.answerMemory.selected?`→ ${esc(m.answerMemory.selected)}`:""}</p><ol>${options}</ol>${candidates}</div>`;
  };
  return `<article><div class="meta">#${i+1} · ${esc(q.qlId)} · ${esc(q.examSurfaceFamily)} · ${esc(q.targetFactId)} · ${esc(q.migrationAction)}</div><h3>${esc(q.english.stem)}</h3><p><b>EN explanation:</b> ${esc(q.english.explanation)}</p><div class="langs">${lang("hi","Hindi authoring memory")}${lang("pa","Punjabi authoring memory")}</div></article>`;
 }).join("");
 return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>COM-003 Localization V2 Authoring Packet</title><style>:root{font-family:Inter,Arial,sans-serif;color:#172033;background:#f4f6f8}body{margin:0}.wrap{max-width:1180px;margin:auto;padding:24px 18px 60px}.hero,article{background:#fff;border:1px solid #dfe4ea;border-radius:13px;padding:18px;margin:12px 0}.hero h1{margin:0}.meta{font-size:12px;color:#5c6a7f;font-weight:700}.langs{display:grid;grid-template-columns:1fr 1fr;gap:12px}.lang{background:#f7f8fa;border-radius:9px;padding:12px}.lang h4{margin-top:0}.warntext{color:#9a3412;font-weight:700}details{margin:7px 0;background:#fff;padding:7px;border-radius:6px}li{margin:5px 0}@media(max-width:800px){.langs{grid-template-columns:1fr}}</style></head><body><main class="wrap"><div class="hero"><h1>COM-003 — Localization V2 Authoring Packet</h1><p>228 V16.2 English questions · 456 HI/PA learner outputs to author · translation memory is seed-only.</p><p><b>Rule:</b> old Hindi/Punjabi stems and explanations are references, not authority. Every new localized output must follow the V16.2 target fact, answer, surface family and explanation semantics.</p></div>${sections}</main></body></html>`;
}

export function writeCom003LocalizationV2AuthoringPacket(outputDir=path.resolve("dist/com003-localization-v2-authoring")){
 fs.mkdirSync(outputDir,{recursive:true});
 const json=path.join(outputDir,"COM-003-Localization-V2-Authoring-Packet.json");
 const html=path.join(outputDir,"COM-003-Localization-V2-Authoring-Packet.html");
 fs.writeFileSync(json,JSON.stringify(COM003_LOCALIZATION_V2_AUTHORING_PACKET,null,2),"utf8");
 fs.writeFileSync(html,buildCom003LocalizationV2AuthoringPacketHtml(),"utf8");
 return {json,html};
}

if(process.argv[1]?.includes("authoring")) console.log("[COM003-LOCALIZATION-V2-AUTHORING-PACKET]",writeCom003LocalizationV2AuthoringPacket());
