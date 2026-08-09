import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import { assertCp004LocalizedText } from "./cp004-localization-language-pack";
import type { IntCp004LocalizedLocale } from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_PRESENTATION_V5_VERSION =
  "INT-CP-004-HI-PA-PRESENTATION-v5" as const;

type ParsedTable = Readonly<{
  intro: string;
  rows: readonly (readonly [label: string, value: string])[];
  task: string;
}>;

function parseMarkdownTable(stem: string): ParsedTable {
  const lines = stem.split("\n");
  const start = lines.findIndex((line) => line.trimStart().startsWith("|"));
  if (start < 0) throw new Error("Expected a structured CP-004 Markdown table.");

  let end = start;
  while (end < lines.length && lines[end]?.trimStart().startsWith("|")) end += 1;

  const tableLines = lines.slice(start, end);
  if (tableLines.length < 3) throw new Error("CP-004 structured table is incomplete.");

  const rows = tableLines.slice(2).map((line) => {
    const cells = line
      .trim()
      .replace(/^\|/u, "")
      .replace(/\|$/u, "")
      .split("|")
      .map((cell) => cell.trim());
    if (cells.length !== 2 || !cells[0] || !cells[1]) {
      throw new Error(`Invalid CP-004 table row: ${line}`);
    }
    return Object.freeze([cells[0], cells[1]] as const);
  });

  return Object.freeze({
    intro: lines.slice(0, start).join("\n").trim(),
    rows: Object.freeze(rows),
    task: lines.slice(end).join("\n").trim(),
  });
}

function renderAccountRecord(
  parsed: ParsedTable,
  locale: IntCp004LocalizedLocale,
): string {
  const heading = locale === "hi-IN" ? "**खाता विवरण**" : "**ਖਾਤਾ ਵੇਰਵਾ**";
  const entries = parsed.rows
    .map(([label, value], index) => `${index + 1}. **${label}:** ${value}`)
    .join("\n");
  return `${parsed.intro}\n\n${heading}\n\n${entries}\n\n${parsed.task}`;
}

function renderSchemeRecord(
  parsed: ParsedTable,
  locale: IntCp004LocalizedLocale,
): string {
  const heading = locale === "hi-IN"
    ? "**योजना/चरण का विवरण**"
    : "**ਯੋਜਨਾ/ਪੜਾਅ ਦਾ ਵੇਰਵਾ**";
  const entries = parsed.rows
    .map(([label, value]) => `- **${label}:** ${value}`)
    .join("\n");
  return `${parsed.intro}\n\n${heading}\n\n${entries}\n\n${parsed.task}`;
}

export function remodelCp004LocalizedPresentationV5(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
  stem: string,
): string {
  let remodelled = stem;
  if (source.representation === "BALANCE_RECORD") {
    remodelled = renderAccountRecord(parseMarkdownTable(stem), locale);
  } else if (source.representation === "SCHEME_COMPARISON") {
    remodelled = renderSchemeRecord(parseMarkdownTable(stem), locale);
  }

  assertCp004LocalizedText(
    locale,
    remodelled,
    `${source.qlId}/${source.seed}/${locale}/presentation-v5`,
  );
  return remodelled;
}
