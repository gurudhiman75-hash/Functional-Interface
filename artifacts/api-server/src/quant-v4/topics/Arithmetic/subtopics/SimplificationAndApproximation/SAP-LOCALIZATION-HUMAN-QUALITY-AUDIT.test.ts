import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateQuestion } from "../../../../question-studio-generation-engine";
import { SAP_QUESTION_STUDIO_QLS } from "./question-studio-adapter";

const INLINE_MATH = /\\\([\s\S]*?\\\)/gu;
const DEVANAGARI = /[\u0900-\u0963\u0970-\u097F]/u;
const GURMUKHI = /[\u0A01-\u0A74]/u;
const LATIN = /\b[A-Za-z]{3,}\b/u;
const HI_BAD = /(?:ज्ञात कीजिए सटीक मान का|क्या है मान का|कौन-सा मान ऊपर|का 2 −|है है|हैं है|निम्न संबंध में\s*\?|रअइसएड|पूरा सटीक समानता|कौन-सा संबंध है सही यदि एक|एक मान है बताया|पहला हर दिए गए|से लेते हुए प्रत्येक|के बीच होना ज्ञात)/u;
const PA_BAD = /(?:ਕੱਢੋ ਸਟੀਕ ਮੁੱਲ ਦਾ|ਕੀ ਹੈ ਮੁੱਲ ਦਾ|ਉੱਪਰ 400|ਦਾ 2 −|ਹੈ ਹੈ|ਹਨ ਹੈ|ਹੇਠਾਂ ਦਿੱਤੇ ਸੰਬੰਧ ਵਿੱਚ\s*\?|ਰਅਇਸਏਡ|ਪੂਰਾ ਸਟੀਕ ਸਮਾਨਤਾ|ਕਿਹੜਾ ਸੰਬੰਧ ਹੈ ਸਹੀ ਜੇ ਇੱਕ|ਇੱਕ ਮੁੱਲ ਹੈ ਦੱਸਿਆ|ਪਹਿਲਾ ਹਰ ਦਿੱਤੇ|ਨਾਲ ਲੈਂਦੇ ਹੋਏ ਹਰ|ਵਿਚਕਾਰ ਹੋਣਾ ਪਤਾ|ਕੱਢੋ ਪੂਰਨ ਅੰਕ\s*[□?]:)/u;
const BAD_MATH_SPACING = /(?:\\times\?|\\div\?|\\le\?|\\ge\?|<\?|>\?|=\?)/u;
const OUTPUT = resolve(process.cwd(), "dist/quant-v4/sap-localization-human-quality");
mkdirSync(OUTPUT, { recursive: true });

function outsideMath(value: string) {
  return value.replace(INLINE_MATH, " ");
}

function learnerText(question: any) {
  return [question.text, ...(question.options ?? []), question.explanation ?? ""].join("\n");
}

const failures: Array<{ qlId: string; language: string; seedKind: string; reasons: string[]; stem: string }> = [];
let checked = 0;

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  for (const seedKind of ["parity", "release"] as const) {
    const seed = seedKind === "parity"
      ? `sap-localization-parity:${descriptor.qlId}`
      : `sap-localization-release:${descriptor.qlId}`;
    for (const language of ["hi", "pa"] as const) {
      const result = await generateQuestion({
        packageId: "SAP",
        topic: "Arithmetic",
        subtopic: "Simplification & Approximation",
        questionLanguageId: descriptor.qlId,
        language,
        count: 1,
        seed,
      });
      const question = result.questions[0] as any;
      assert.ok(question, `${descriptor.qlId}/${language}/${seedKind}: question missing`);
      checked += 1;
      const reasons: string[] = [];
      const text = learnerText(question);
      const prose = outsideMath(text);
      if (question.traceability?.localizedHumanReviewPolish !== "SAP-HUMAN-REVIEW-POLISH-V8") reasons.push("V8 human-review trace missing");
      if (question.traceability?.localizedHumanReviewFinal !== "SAP-HUMAN-REVIEW-FINAL-V9") reasons.push("V9 final human-review trace missing");
      if (question.localizationValidation?.ok !== true) reasons.push("final localization validation failed");
      if (LATIN.test(prose)) reasons.push("Latin prose remains outside math");
      if (language === "hi" && GURMUKHI.test(prose)) reasons.push("Gurmukhi leaked into Hindi");
      if (language === "pa" && DEVANAGARI.test(prose.replace(/[।॥]/gu, ""))) reasons.push("Devanagari leaked into Punjabi");
      if ((language === "hi" ? HI_BAD : PA_BAD).test(prose)) reasons.push("known machine-translated phrase remains");
      if (BAD_MATH_SPACING.test(text)) reasons.push("unknown placeholder is glued to an operator");
      if (/है है|हैं है|ਹੈ ਹੈ|ਹਨ ਹੈ/u.test(text)) reasons.push("duplicated copula remains");
      if (/\?\s*\?/u.test(text)) reasons.push("duplicated unknown marker remains");
      if (descriptor.qlId === "SAP-QL-045" && /उत्तर को सरल भिन्न.*उत्तर को|ਉੱਤਰ ਨੂੰ ਸਰਲ ਭਿੰਨ.*ਉੱਤਰ ਨੂੰ/u.test(question.text)) reasons.push("QL045 duplicated answer-format instruction");
      if (descriptor.qlId === "SAP-QL-049" && /□%\s+(?:का|ਦਾ)\s+\d+/u.test(question.text)) reasons.push("QL049 retains unnatural percent-of order");
      if (descriptor.qlId === "SAP-QL-050" && /(?:1\/2|50%)\s+(?:का|ਦਾ)\s+[xy]/u.test(question.text)) reasons.push("QL050 retains unnatural of-order");
      if (descriptor.qlId === "SAP-QL-091") {
        if (language === "hi" && !/विधि A.*विधि B/u.test(question.text)) reasons.push("QL091 lost Route A/Route B context");
        if (language === "pa" && !/ਵਿਧੀ A.*ਵਿਧੀ B/u.test(question.text)) reasons.push("QL091 lost Route A/Route B context");
      }
      if (descriptor.qlId === "SAP-QL-178" && /(?:ऊपर|ਉੱਪਰ)\s+\d+.*(?:वर्गमूल|ਵਰਗਮੂਲ)/u.test(question.text)) reasons.push("QL178 retains English word order");
      if (question.options?.[question.correctIndex] !== question.answer) reasons.push("answer binding changed");
      if (
        question.questionBankStatus !== "WRITABLE"
        || question.questionBankWritable !== true
        || question.testEligibility !== "ELIGIBLE"
        || question.testEligible !== true
        || question.publiclyPublishable !== true
      ) reasons.push("standard Question Studio lifecycle changed");
      if (reasons.length) failures.push({ qlId: descriptor.qlId, language, seedKind, reasons, stem: String(question.text) });
    }
  }
}

const summary = {
  status: failures.length ? "BLOCKED_SAP_HUMAN_LANGUAGE_QUALITY" : "PASS_SAP_HUMAN_LANGUAGE_QUALITY",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  checkedLocalizedStates: checked,
  expectedLocalizedStates: SAP_QUESTION_STUDIO_QLS.length * 2 * 2,
  failureCount: failures.length,
  failedQlCount: new Set(failures.map((f) => f.qlId)).size,
  seedKinds: ["parity", "release"],
  languages: ["hi", "pa"],
  questionBankStatus: "WRITABLE",
  questionBankWritable: true,
  testEligibility: "ELIGIBLE",
  publiclyPublishable: true,
};

const jsonPath = resolve(OUTPUT, "sap-localization-human-quality.json");
const markdownPath = resolve(OUTPUT, "sap-localization-human-quality.md");
writeFileSync(jsonPath, `${JSON.stringify({ summary, failures }, null, 2)}\n`, "utf8");
writeFileSync(markdownPath, [
  "# SAP Hindi/Punjabi Human Language Quality Audit",
  "",
  `Status: **${summary.status}**`,
  `Checked localized states: **${summary.checkedLocalizedStates}**`,
  `Failures: **${summary.failureCount}** across **${summary.failedQlCount}** QLs`,
  "",
  ...(failures.length ? failures.map((f) => `- ${f.qlId}/${f.language}/${f.seedKind}: ${f.reasons.join(" | ")} :: ${f.stem}`) : ["- No human-language regression blockers found."]),
].join("\n") + "\n", "utf8");

console.log(JSON.stringify({ ...summary, jsonPath, markdownPath, preview: failures.slice(0, 30) }));
assert.equal(failures.length, 0, `${failures.length} localized states still fail the human-language regression gate.`);
