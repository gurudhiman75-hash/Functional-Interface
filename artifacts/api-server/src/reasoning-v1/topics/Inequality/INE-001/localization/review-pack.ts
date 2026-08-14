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
export type IneLocalizedPackKind = "FULL_REVIEW" | "EXAM_FACING" | "GUIDED_ONLY";

interface ExportedPackArtifact {
  jsonPath: string;
  markdownPath: string;
  count: number;
}

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
  packKind: IneLocalizedPackKind = "FULL_REVIEW",
): string {
  const pack = ineLanguagePack(locale);
  const titles: Record<IneLocalizedPackKind, readonly [string, string]> = {
    FULL_REVIEW: ["संपूर्ण समीक्षा", "ਪੂਰੀ ਸਮੀਖਿਆ"],
    EXAM_FACING: ["परीक्षा-अभ्यास", "ਪ੍ਰੀਖਿਆ ਅਭਿਆਸ"],
    GUIDED_ONLY: ["निर्देशित अभ्यास", "ਸੇਧਿਤ ਅਭਿਆਸ"],
  };
  const intros: Record<IneLocalizedPackKind, readonly [string, string]> = {
    FULL_REVIEW: [
      "इस पैक में परीक्षा-अभ्यास और आंतरिक निर्देशित प्रश्न दोनों हैं। इसे सीधे मॉक टेस्ट के रूप में प्रकाशित न करें।",
      "ਇਸ ਪੈਕ ਵਿੱਚ ਪ੍ਰੀਖਿਆ ਅਭਿਆਸ ਅਤੇ ਅੰਦਰੂਨੀ ਸੇਧਿਤ ਸਵਾਲ ਦੋਵੇਂ ਹਨ। ਇਸ ਨੂੰ ਸਿੱਧਾ ਮੌਕ ਟੈਸਟ ਵਜੋਂ ਪ੍ਰਕਾਸ਼ਿਤ ਨਾ ਕਰੋ।",
    ],
    EXAM_FACING: [
      "यह चार-विकल्प वाला ExamTree परीक्षा-अभ्यास पैक है। यह SSC, पंजाब और अन्य सरकारी परीक्षाओं के अभ्यास के लिए है; पाँच-विकल्प वाले बैंकिंग इंटरफ़ेस की हूबहू नकल नहीं है।",
      "ਇਹ ਚਾਰ ਚੋਣਾਂ ਵਾਲਾ ExamTree ਪ੍ਰੀਖਿਆ ਅਭਿਆਸ ਪੈਕ ਹੈ। ਇਹ SSC, ਪੰਜਾਬ ਅਤੇ ਹੋਰ ਸਰਕਾਰੀ ਪ੍ਰੀਖਿਆਵਾਂ ਦੇ ਅਭਿਆਸ ਲਈ ਹੈ; ਪੰਜ ਚੋਣਾਂ ਵਾਲੇ ਬੈਂਕਿੰਗ ਇੰਟਰਫੇਸ ਦੀ ਹੂ-ਬ-ਹੂ ਨਕਲ ਨਹੀਂ ਹੈ।",
    ],
    GUIDED_ONLY: [
      "यह अवधारणा सीखने और आंतरिक अभ्यास का पैक है। इसमें तीन-विकल्प वाले प्रश्न भी हो सकते हैं और इसे मानक मॉक टेस्ट में शामिल नहीं करना है।",
      "ਇਹ ਧਾਰਨਾ ਸਿੱਖਣ ਅਤੇ ਅੰਦਰੂਨੀ ਅਭਿਆਸ ਦਾ ਪੈਕ ਹੈ। ਇਸ ਵਿੱਚ ਤਿੰਨ ਚੋਣਾਂ ਵਾਲੇ ਸਵਾਲ ਵੀ ਹੋ ਸਕਦੇ ਹਨ ਅਤੇ ਇਸ ਨੂੰ ਮਿਆਰੀ ਮੌਕ ਟੈਸਟ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਕਰਨਾ ਹੈ।",
    ],
  };
  const languageIndex = locale === "hi-IN" ? 0 : 1;
  const intro = intros[packKind][languageIndex];
  const optionStandard = packKind === "EXAM_FACING"
    ? "EXAMTREE_FOUR_OPTION"
    : packKind === "GUIDED_ONLY"
      ? "GUIDED_INTERNAL"
      : "MIXED_REVIEW_ONLY";
  const lines = [
    `# ${pack.title} — ${titles[packKind][languageIndex]}`,
    "",
    intro,
    "",
    `- ${pack.labels.question}: ${rows.length}`,
    `- Locale: ${locale}`,
    `- Pack type: ${packKind}`,
    `- Option standard: ${optionStandard}`,
    "",
  ];

  for (const [index, row] of rows.entries()) {
    lines.push(
      `## ${pack.labels.question} ${index + 1} — ${row.checkpointId} / ${row.authorityId}`,
      "",
      `- Source record: ${row.sourceRecordId}`,
      `- ${pack.labels.seed}: ${row.seed}`,
      `- ${pack.labels.difficulty}: ${row.difficulty}`,
      `- Content class: ${row.contentClass}`,
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
): Promise<Record<IneTranslatedLocale, Record<IneLocalizedPackKind, ExportedPackArtifact>>> {
  const englishRows = await loadIneEnglishClosureRows(chapterDirectory);
  await fs.mkdir(outputDirectory, { recursive: true });
  const result = {} as Record<IneTranslatedLocale, Record<IneLocalizedPackKind, ExportedPackArtifact>>;

  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const rows = buildIneLocalizedReviewRows(englishRows, locale);
    const language = locale === "hi-IN" ? "hindi" : "punjabi";
    const packRows: Record<IneLocalizedPackKind, LocalizedIneQuestion[]> = {
      FULL_REVIEW: rows,
      EXAM_FACING: rows.filter((row) => row.contentClass === "EXAM_FACING"),
      GUIDED_ONLY: rows.filter((row) => row.contentClass === "GUIDED_ONLY"),
    };
    const suffixes: Record<IneLocalizedPackKind, string> = {
      FULL_REVIEW: "review",
      EXAM_FACING: "exam-facing-review",
      GUIDED_ONLY: "guided-review",
    };
    result[locale] = {} as Record<IneLocalizedPackKind, ExportedPackArtifact>;

    for (const packKind of ["FULL_REVIEW", "EXAM_FACING", "GUIDED_ONLY"] as const) {
      const selectedRows = packRows[packKind];
      const jsonPath = path.join(outputDirectory, `ine-001-${language}-${suffixes[packKind]}.json`);
      const markdownPath = path.join(outputDirectory, `ine-001-${language}-${suffixes[packKind]}.md`);
      await Promise.all([
        fs.writeFile(jsonPath, `${JSON.stringify(selectedRows, null, 2)}\n`, "utf8"),
        fs.writeFile(markdownPath, `${renderIneLocalizedReviewMarkdown(selectedRows, locale, packKind)}\n`, "utf8"),
      ]);
      result[locale][packKind] = { jsonPath, markdownPath, count: selectedRows.length };
    }
  }
  return result;
}
