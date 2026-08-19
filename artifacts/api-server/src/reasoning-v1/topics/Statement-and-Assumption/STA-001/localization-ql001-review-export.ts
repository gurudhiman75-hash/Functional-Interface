import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { STA_ENGLISH_CORPUS_BY_QL } from "./english-corpus/index.ts";
import { generateStaQl001LocalizedQuestion } from "./localization-ql001.ts";
import { STA_QL001_HINDI_REVIEW_COPY, STA_QL001_PUNJABI_REVIEW_COPY } from "./localization-ql001-copy.ts";
import type { StaLocalizedLocale, StaLocalizedQuestion, StaLocalizationBundle } from "./localization-types.ts";

const OUTPUT_DIR = process.env.STA_QL001_LOCALIZATION_REVIEW_OUTPUT_DIR ?? "/tmp/sta-001-ql001-hi-pa-review-v1";
const EXAMPLES_PER_AUTHORITY = Number(process.env.STA_QL001_LOCALIZATION_EXAMPLES_PER_AUTHORITY ?? 2);
const MAX_SEARCH = 100_000;

function bundleFor(locale: StaLocalizedLocale): StaLocalizationBundle {
  return locale === "hi-IN" ? STA_QL001_HINDI_REVIEW_COPY : STA_QL001_PUNJABI_REVIEW_COPY;
}

function collect(locale: StaLocalizedLocale): StaLocalizedQuestion[] {
  const expectedIds = STA_ENGLISH_CORPUS_BY_QL["STA-QL-001"].map((scenario) => scenario.scenarioId);
  const baseByScenario = new Map<string, StaLocalizedQuestion>();

  for (let index = 0; index < MAX_SEARCH && baseByScenario.size < expectedIds.length; index += 1) {
    const question = generateStaQl001LocalizedQuestion(`sta-ql001-native-review:${locale}:${index}`, locale);
    if (!baseByScenario.has(question.scenarioId)) baseByScenario.set(question.scenarioId, question);
  }

  const bundle = bundleFor(locale);
  return expectedIds.flatMap((scenarioId) => {
    const base = baseByScenario.get(scenarioId);
    if (!base) throw new Error(`${locale}:${scenarioId}: no deterministic review seed found`);
    const copy = bundle[scenarioId];
    if (!copy) throw new Error(`${locale}:${scenarioId}: missing localization copy`);
    if (copy.statementVariants.length < EXAMPLES_PER_AUTHORITY) {
      throw new Error(`${locale}:${scenarioId}: requested ${EXAMPLES_PER_AUTHORITY} stems but only ${copy.statementVariants.length} are authored`);
    }

    return copy.statementVariants.slice(0, EXAMPLES_PER_AUTHORITY).map((statement) => ({
      ...base,
      statement,
    }));
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function questionHtml(question: StaLocalizedQuestion, index: number): string {
  const assumptions = question.candidates.map((candidate) => `<li><strong>${candidate.label}.</strong> ${escapeHtml(candidate.text)}</li>`).join("");
  const options = question.options.map((option, optionIndex) => `<li class="${optionIndex === question.answerIndex ? "correct" : ""}">${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option.display)}</li>`).join("");
  return `<article><div class="meta">${index + 1}. ${question.qlId} · ${question.scenarioId} · ${question.difficulty}</div><p class="stem">${escapeHtml(question.statement)}</p><ol class="assumptions">${assumptions}</ol><ol class="options">${options}</ol><details><summary>Explanation</summary><div class="explanation">${escapeHtml(question.explanation).replaceAll("\n\n", "<br><br>")}</div></details></article>`;
}

function page(title: string, rows: readonly StaLocalizedQuestion[]): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>body{font-family:system-ui,-apple-system,"Noto Sans Devanagari","Noto Sans Gurmukhi",sans-serif;max-width:980px;margin:0 auto;padding:24px;line-height:1.55;background:#fff;color:#111}h1{font-size:1.6rem}article{border:1px solid #ddd;border-radius:10px;padding:18px;margin:18px 0}.meta{font-size:.8rem;color:#666}.stem{font-weight:650}.assumptions,.options{padding-left:28px}.correct{font-weight:750}details{margin-top:12px}.explanation{margin-top:10px;white-space:normal}.lock{background:#f4f4f4;padding:10px;border-radius:8px}</style></head><body><h1>${escapeHtml(title)}</h1><p class="lock">Review candidate only. English V2 remains frozen. Question Studio, Question Bank, mocks/tests and publication remain closed.</p>${rows.map(questionHtml).join("\n")}</body></html>`;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const hindi = collect("hi-IN");
const punjabi = collect("pa-IN");
const combined = { lifecycle: hindi[0]!.lifecycle, hindi, punjabi };

writeFileSync(join(OUTPUT_DIR, "STA-QL001-HINDI-REVIEW-V1.json"), `${JSON.stringify(hindi, null, 2)}\n`, "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-QL001-PUNJABI-REVIEW-V1.json"), `${JSON.stringify(punjabi, null, 2)}\n`, "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-QL001-HINDI-REVIEW-V1.html"), page("STA-QL-001 Hindi Review Candidate V1", hindi), "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-QL001-PUNJABI-REVIEW-V1.html"), page("STA-QL-001 Punjabi Review Candidate V1", punjabi), "utf8");
writeFileSync(join(OUTPUT_DIR, "STA-QL001-HI-PA-REVIEW-V1.json"), `${JSON.stringify(combined, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  outputDir: OUTPUT_DIR,
  authoritiesPerLanguage: STA_ENGLISH_CORPUS_BY_QL["STA-QL-001"].length,
  examplesPerAuthority: EXAMPLES_PER_AUTHORITY,
  hindiQuestions: hindi.length,
  punjabiQuestions: punjabi.length,
  uniqueHindiStems: new Set(hindi.map((question) => question.statement)).size,
  uniquePunjabiStems: new Set(punjabi.map((question) => question.statement)).size,
  status: hindi[0]!.lifecycle.hindiPunjabiStatus,
}, null, 2));
