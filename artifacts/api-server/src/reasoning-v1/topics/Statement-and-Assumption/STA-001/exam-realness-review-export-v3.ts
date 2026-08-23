import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { STA_QL004_HINDI_REVIEW_COPY, STA_QL004_PUNJABI_REVIEW_COPY } from "./localization-ql004-copy.ts";
import { editorializeStaQl004LocalizedText } from "./localization-ql004-editorial-v2.ts";
import {
  examRealizeStaQl004Statement,
  generateStaQl004LocalizedQuestionV3,
  STA_QL004_EXAM_REALNESS_VERSION,
  type StaQl004LocalizedQuestionV3,
} from "./localization-ql004-exam-realness-v3.ts";
import {
  generateStaFourAssumptionBankQuestion,
  STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION,
  type StaExamLocale,
  type StaFourAssumptionBankQuestion,
} from "./exam-format-four-assumption.ts";
import type { StaLocalizedLocale, StaLocalizationBundle } from "./localization-types.ts";

const OUTPUT_DIR = process.env.STA_EXAM_REALNESS_V3_REVIEW_OUTPUT_DIR ?? "/tmp/sta-001-exam-realness-v3-review";
const EXAMPLES_PER_AUTHORITY = Number(process.env.STA_QL004_EXAM_REALNESS_EXAMPLES_PER_AUTHORITY ?? 2);
const FOUR_ASSUMPTION_EXAMPLES_PER_LOCALE = Number(process.env.STA_FOUR_ASSUMPTION_REVIEW_EXAMPLES_PER_LOCALE ?? 12);
const MAX_SEARCH = 100_000;

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL004_HINDI_REVIEW_COPY : STA_QL004_PUNJABI_REVIEW_COPY;
}

function collectQl004(locale: StaLocalizedLocale): StaQl004LocalizedQuestionV3[] {
  const expectedIds = STA_ENGLISH_CORPUS_BY_QL["STA-QL-004"].map((scenario) => scenario.scenarioId);
  const baseByScenario = new Map<string, StaQl004LocalizedQuestionV3>();
  for (let index = 0; index < MAX_SEARCH && baseByScenario.size < expectedIds.length; index += 1) {
    const question = generateStaQl004LocalizedQuestionV3(`sta-ql004-exam-realness-review-v3:${locale}:${index}`, locale);
    if (!baseByScenario.has(question.scenarioId)) baseByScenario.set(question.scenarioId, question);
  }
  const bundle = bundleFor(locale);
  return expectedIds.flatMap((scenarioId) => {
    const base = baseByScenario.get(scenarioId);
    if (!base) throw new Error(`${locale}:${scenarioId}: no deterministic V3 review seed found`);
    const copy = bundle[scenarioId];
    if (!copy) throw new Error(`${locale}:${scenarioId}: missing localization copy`);
    if (copy.statementVariants.length < EXAMPLES_PER_AUTHORITY) {
      throw new Error(`${locale}:${scenarioId}: insufficient authored statement variants`);
    }
    return copy.statementVariants.slice(0, EXAMPLES_PER_AUTHORITY).map((statement) => ({
      ...base,
      statement: examRealizeStaQl004Statement(locale, editorializeStaQl004LocalizedText(locale, statement)),
    }));
  });
}

function collectFour(locale: StaExamLocale): StaFourAssumptionBankQuestion[] {
  const output: StaFourAssumptionBankQuestion[] = [];
  for (let index = 0; index < FOUR_ASSUMPTION_EXAMPLES_PER_LOCALE; index += 1) {
    output.push(generateStaFourAssumptionBankQuestion(`sta-bank-four-review:${locale}:${index}`, locale));
  }
  return output;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

interface HtmlQuestion {
  readonly qlId: string;
  readonly scenarioId: string;
  readonly difficulty: string;
  readonly statement: string;
  readonly candidates: readonly { readonly label: string; readonly text: string }[];
  readonly options: readonly { readonly display: string }[];
  readonly answerIndex: number;
  readonly explanation: string;
}

function questionHtml(question: HtmlQuestion, index: number): string {
  const assumptions = question.candidates.map((candidate) => `<li><strong>${candidate.label}.</strong> ${escapeHtml(candidate.text)}</li>`).join("");
  const options = question.options.map((option, optionIndex) => `<li class="${optionIndex === question.answerIndex ? "correct" : ""}">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option.display)}</li>`).join("");
  return `<article><div class="meta">${index + 1}. ${question.qlId} · ${question.scenarioId} · ${question.difficulty}</div><p class="stem">${escapeHtml(question.statement)}</p><ol class="assumptions">${assumptions}</ol><ol class="options">${options}</ol><details><summary>Explanation</summary><div class="explanation">${escapeHtml(question.explanation).replaceAll("\n\n", "<br><br>")}</div></details></article>`;
}

function page(title: string, note: string, rows: readonly HtmlQuestion[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;max-width:980px;margin:0 auto;padding:24px;line-height:1.55;background:#fff;color:#111}article{border:1px solid #ddd;border-radius:10px;padding:18px;margin:18px 0}.meta{font-size:.8rem;color:#666}.stem{font-weight:650}.assumptions,.options{padding-left:28px}.correct{font-weight:750}details{margin-top:12px}.explanation{margin-top:10px}.lock{background:#f4f4f4;padding:10px;border-radius:8px}</style></head><body><h1>${escapeHtml(title)}</h1><p class="lock">${escapeHtml(note)}</p>${rows.map(questionHtml).join("\n")}</body></html>`;
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const hindi = collectQl004("hi-IN");
const punjabi = collectQl004("pa-IN");
const fourEnglish = collectFour("en-IN");
const fourHindi = collectFour("hi-IN");
const fourPunjabi = collectFour("pa-IN");

const combined = {
  examRealnessVersion: STA_QL004_EXAM_REALNESS_VERSION,
  fourAssumptionFormatVersion: STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION,
  lifecycle: hindi[0]!.lifecycle,
  hindi,
  punjabi,
  fourAssumptionBanking: {
    english: fourEnglish,
    hindi: fourHindi,
    punjabi: fourPunjabi,
  },
};

writeFileSync(join(OUTPUT_DIR, "STA-QL004-HINDI-EXAM-REALNESS-V3.json"), `${JSON.stringify(hindi, null, 2)}\n`, "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-QL004-PUNJABI-EXAM-REALNESS-V3.json"), `${JSON.stringify(punjabi, null, 2)}\n`, "utf8");
writeFileSync(
  join(OUTPUT_DIR, "STA-QL004-HINDI-EXAM-REALNESS-V3.html"),
  page("STA-QL-004 Hindi Exam Realness V3", "V3 review candidate. QL001-QL003 remain FROZEN_V2. QL004 and all downstream product locks remain unfrozen/closed.", hindi),
  "utf8",
);
writeFileSync(
  join(OUTPUT_DIR, "STA-QL004-PUNJABI-EXAM-REALNESS-V3.html"),
  page("STA-QL-004 Punjabi Exam Realness V3", "V3 review candidate. QL001-QL003 remain FROZEN_V2. QL004 and all downstream product locks remain unfrozen/closed.", punjabi),
  "utf8",
);
writeFileSync(join(OUTPUT_DIR, "STA-BANK-FOUR-ASSUMPTION-ENGLISH-V1.json"), `${JSON.stringify(fourEnglish, null, 2)}\n`, "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-BANK-FOUR-ASSUMPTION-HINDI-V1.json"), `${JSON.stringify(fourHindi, null, 2)}\n`, "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-BANK-FOUR-ASSUMPTION-PUNJABI-V1.json"), `${JSON.stringify(fourPunjabi, null, 2)}\n`, "utf8");
writeFileSync(
  join(OUTPUT_DIR, "STA-BANK-FOUR-ASSUMPTION-TRILINGUAL-V1.html"),
  page(
    "STA Banking Four-Assumption Format V1",
    "Format-only coverage: four assumptions and five options, preserving STA-QL-004 semantic identity. Question Studio, Question Bank, test and publication locks remain false.",
    [...fourEnglish, ...fourHindi, ...fourPunjabi],
  ),
  "utf8",
);
writeFileSync(join(OUTPUT_DIR, "STA-EXAM-REALNESS-V3-COMBINED.json"), `${JSON.stringify(combined, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  examRealnessVersion: STA_QL004_EXAM_REALNESS_VERSION,
  outputDir: OUTPUT_DIR,
  ql004AuthoritiesPerLanguage: 16,
  examplesPerAuthority: EXAMPLES_PER_AUTHORITY,
  hindiQuestions: hindi.length,
  punjabiQuestions: punjabi.length,
  uniqueHindiStems: new Set(hindi.map((question) => question.statement)).size,
  uniquePunjabiStems: new Set(punjabi.map((question) => question.statement)).size,
  fourAssumptionFormatVersion: STA_BANK_FOUR_ASSUMPTION_FORMAT_VERSION,
  fourAssumptionExamplesPerLocale: FOUR_ASSUMPTION_EXAMPLES_PER_LOCALE,
  fourAssumptionEnglishScenarios: new Set(fourEnglish.map((question) => question.scenarioId)).size,
  fourAssumptionHindiScenarios: new Set(fourHindi.map((question) => question.scenarioId)).size,
  fourAssumptionPunjabiScenarios: new Set(fourPunjabi.map((question) => question.scenarioId)).size,
  ql004HindiPunjabiStatus: "REVIEW_CANDIDATE_V3",
  multilingualChapterFrozen: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
