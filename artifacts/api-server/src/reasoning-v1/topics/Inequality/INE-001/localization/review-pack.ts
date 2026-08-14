import fs from "node:fs/promises";
import path from "node:path";
import { ineLanguagePack } from "./language-pack";
import { localizeIneQuestion } from "./runtime";
import type {
  IneEnglishReviewRow,
  IneTranslatedLocale,
  LocalizedIneQuestion,
} from "./types";

const CHECKPOINTS = Array.from({ length: 8 }, (_, index) => `INE-CP-${String(index + 1).padStart(3, "0")}`);

export async function loadIneEnglishClosureRows(chapterDirectory: string): Promise<IneEnglishReviewRow[]> {
  const groups = await Promise.all(
    CHECKPOINTS.map(async (checkpointId) => {
      const compact = checkpointId.replace("INE-CP-", "");
      const filePath = path.join(
        chapterDirectory,
        checkpointId,
        "review",
        `ine-cp${compact}-english-review.json`,
      );
      const rows = JSON.parse(await fs.readFile(filePath, "utf8")) as IneEnglishReviewRow[];
      return rows.map((row) => ({ ...row, checkpointId }));
    }),
  );
  return groups.flat();
}

export function buildIneLocalizedReviewRows(
  rows: readonly IneEnglishReviewRow[],
  locale: IneTranslatedLocale,
): LocalizedIneQuestion[] {
  return rows.map((row) => {
    if (!row.checkpointId) throw new Error(`Missing checkpoint for ${row.recordId ?? row.authorityId}`);
    return localizeIneQuestion(row, row.checkpointId, locale);
  });
}

function bulletSection(title: string, values: readonly string[]): string[] {
  if (values.length === 0) return [];
  return [`**${title}**`, "", ...values.map((value, index) => `${index + 1}. ${value}`), ""];
}

export function renderIneLocalizedReviewMarkdown(
  rows: readonly LocalizedIneQuestion[],
  locale: IneTranslatedLocale,
): string {
  const pack = ineLanguagePack(locale);
  const intro = locale === "hi-IN"
    ? "यह पैक भाषा, स्पष्टता और उत्तर-समानता की मानवीय समीक्षा के लिए है। स्थायी QL और Question Studio प्रकाशन अभी बंद हैं।"
    : "ਇਹ ਪੈਕ ਭਾਸ਼ਾ, ਸਪਸ਼ਟਤਾ ਅਤੇ ਉੱਤਰ-ਸਮਾਨਤਾ ਦੀ ਮਨੁੱਖੀ ਸਮੀਖਿਆ ਲਈ ਹੈ। ਸਥਾਈ QL ਅਤੇ Question Studio ਪ੍ਰਕਾਸ਼ਨ ਹਾਲੇ ਬੰਦ ਹਨ।";
  const lines = [
    `# ${pack.title}`,
    "",
    intro,
    "",
    `- ${pack.labels.question}: ${rows.length}`,
    `- Locale: ${locale}`,
    "",
  ];

  for (const [index, row] of rows.entries()) {
    lines.push(
      `## ${pack.labels.question} ${index + 1} — ${row.checkpointId} / ${row.authorityId}`,
      "",
      `- Source record: ${row.sourceRecordId}`,
      `- ${pack.labels.seed}: ${row.seed}`,
      `- ${pack.labels.difficulty}: ${row.difficulty}`,
      "",
      row.stem,
      "",
      ...bulletSection(pack.labels.statements, row.statements),
      ...bulletSection(pack.labels.conclusions, row.conclusions),
      ...bulletSection(pack.labels.codeKey, row.codeKey),
      ...bulletSection(pack.labels.evidence, row.evidence),
      ...bulletSection(pack.labels.options, row.options),
      `**${pack.labels.correct}:** ${row.correctIndex + 1}. ${row.correctOption}`,
      "",
      `**${pack.labels.explanation}:** ${row.explanation}`,
      "",
      "---",
      "",
    );
  }
  return lines.join("\n");
}

export async function exportIneLocalizedReviewPacks(
  chapterDirectory: string,
  outputDirectory: string,
): Promise<Record<IneTranslatedLocale, { jsonPath: string; markdownPath: string; count: number }>> {
  const englishRows = await loadIneEnglishClosureRows(chapterDirectory);
  await fs.mkdir(outputDirectory, { recursive: true });
  const result = {} as Record<IneTranslatedLocale, { jsonPath: string; markdownPath: string; count: number }>;

  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const rows = buildIneLocalizedReviewRows(englishRows, locale);
    const language = locale === "hi-IN" ? "hindi" : "punjabi";
    const jsonPath = path.join(outputDirectory, `ine-001-${language}-review.json`);
    const markdownPath = path.join(outputDirectory, `ine-001-${language}-review.md`);
    await Promise.all([
      fs.writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
      fs.writeFile(markdownPath, `${renderIneLocalizedReviewMarkdown(rows, locale)}\n`, "utf8"),
    ]);
    result[locale] = { jsonPath, markdownPath, count: rows.length };
  }
  return result;
}
