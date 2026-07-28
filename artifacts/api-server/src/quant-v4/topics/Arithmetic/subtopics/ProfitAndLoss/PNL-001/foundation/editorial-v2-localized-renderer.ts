import type {
  EditorialRenderContext,
  FriendlyExplanation,
  QuestionStemBlock,
  StructuredQuestionStem,
} from "./editorial-content";
import { interpolateEditorialText } from "./editorial-content";
import type { NativeEditorialLanguage } from "./editorial-v2-native-stems";

const LABELS = {
  hi: {
    statement: "कथन",
    dataFooter: "मानक दो-कथन डेटा-पर्याप्तता उत्तर-प्रणाली का उपयोग कीजिए।",
    keyIdea: "मुख्य विचार",
    step: "चरण",
    conclusion: "निष्कर्ष",
    commonTrap: "सामान्य गलती से बचें",
    quickCheck: "त्वरित जाँच",
    multiply: " से गुणा ",
    divide: " से भाग ",
    squared: " का वर्ग",
    cubed: " का घन",
  },
  pa: {
    statement: "ਕਥਨ",
    dataFooter: "ਮਿਆਰੀ ਦੋ-ਕਥਨ ਡਾਟਾ-ਪਰਯਾਪਤਤਾ ਉੱਤਰ-ਪ੍ਰਣਾਲੀ ਵਰਤੋ।",
    keyIdea: "ਮੁੱਖ ਵਿਚਾਰ",
    step: "ਪੜਾਅ",
    conclusion: "ਨਤੀਜਾ",
    commonTrap: "ਆਮ ਗਲਤੀ ਤੋਂ ਬਚੋ",
    quickCheck: "ਤੁਰੰਤ ਜਾਂਚ",
    multiply: " ਨਾਲ ਗੁਣਾ ",
    divide: " ਨਾਲ ਭਾਗ ",
    squared: " ਦਾ ਵਰਗ",
    cubed: " ਦਾ ਘਨ",
  },
} as const;

function labels(language: NativeEditorialLanguage) {
  return LABELS[language];
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

function nativeProse(
  template: string,
  context: EditorialRenderContext,
  language: NativeEditorialLanguage,
): string {
  const ui = labels(language);
  return interpolateEditorialText(template, context)
    .replaceAll("×", ui.multiply)
    .replaceAll("÷", ui.divide)
    .replaceAll("²", ui.squared)
    .replaceAll("³", ui.cubed)
    .replace(/\s{2,}/g, " ")
    .trim();
}

function escapeTableCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function resolveRows(
  block: Extract<QuestionStemBlock, { type: "table" }>,
  context: EditorialRenderContext,
): readonly (readonly string[])[] {
  if (block.rows) return block.rows;
  if (!block.rowSource) return [];
  const value = context[block.rowSource];
  if (!Array.isArray(value)) return [];
  return value.map((row) => Array.isArray(row) ? row.map(stringifyValue) : [stringifyValue(row)]);
}

function resolveParagraphs(
  block: Extract<QuestionStemBlock, { type: "caselet" }>,
  context: EditorialRenderContext,
): readonly string[] {
  if (block.paragraphs) return block.paragraphs;
  if (!block.paragraphSource) return [];
  const value = context[block.paragraphSource];
  if (Array.isArray(value)) return value.map(stringifyValue);
  if (value !== undefined && value !== null) return [stringifyValue(value)];
  return [];
}

export function renderLocalizedStructuredStemMarkdown(
  stem: StructuredQuestionStem,
  language: NativeEditorialLanguage,
  context: EditorialRenderContext = {},
): string {
  const ui = labels(language);
  const parts: string[] = [];

  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(nativeProse(block.content, context, language));
        break;
      case "table": {
        if (block.caption) parts.push(`**${nativeProse(block.caption, context, language)}**`);
        const columns = block.columns.map((column) => nativeProse(column, context, language));
        const rows = resolveRows(block, context);
        parts.push(`| ${columns.map(escapeTableCell).join(" | ")} |`);
        parts.push(`| ${columns.map(() => "---").join(" | ")} |`);
        if (rows.length === 0 && block.rowSource) {
          parts.push(`| ${[`{${block.rowSource}}`, ...columns.slice(1).map(() => "")].map(escapeTableCell).join(" | ")} |`);
        } else {
          for (const row of rows) {
            const normalized = columns.map((_, index) => nativeProse(row[index] ?? "", context, language));
            parts.push(`| ${normalized.map(escapeTableCell).join(" | ")} |`);
          }
        }
        break;
      }
      case "caselet": {
        if (block.title) parts.push(`**${nativeProse(block.title, context, language)}**`);
        const paragraphs = resolveParagraphs(block, context);
        if (paragraphs.length === 0 && block.paragraphSource) parts.push(`{${block.paragraphSource}}`);
        else parts.push(...paragraphs.map((paragraph) => nativeProse(paragraph, context, language)));
        break;
      }
      case "statements":
        if (block.lead) parts.push(nativeProse(block.lead, context, language));
        block.statements.forEach((statement, index) => parts.push(`${index + 1}. ${nativeProse(statement, context, language)}`));
        break;
      case "data_sufficiency":
        parts.push(nativeProse(block.question, context, language));
        block.statements.forEach((statement, index) => {
          parts.push(`**${ui.statement} ${index + 1}:** ${nativeProse(statement, context, language)}`);
        });
        parts.push(ui.dataFooter);
        break;
      case "equation": {
        const latex = interpolateEditorialText(block.latex, context);
        parts.push(block.display === false ? `\\(${latex}\\)` : `\\[${latex}\\]`);
        break;
      }
    }
  }

  parts.push(nativeProse(stem.prompt, context, language));
  return parts.filter(Boolean).join("\n\n");
}

export function renderLocalizedFriendlyExplanationMarkdown(
  explanation: FriendlyExplanation,
  language: NativeEditorialLanguage,
  context: EditorialRenderContext = {},
): string {
  const ui = labels(language);
  const parts: string[] = [
    nativeProse(explanation.opening, context, language),
    `**${ui.keyIdea}:** ${nativeProse(explanation.concept, context, language)}`,
  ];

  explanation.steps.forEach((step, index) => {
    parts.push(`**${ui.step} ${index + 1}: ${nativeProse(step.title, context, language)}**`);
    parts.push(nativeProse(step.body, context, language));
    if (step.equationLatex) parts.push(`\\[${interpolateEditorialText(step.equationLatex, context)}\\]`);
  });

  parts.push(`**${ui.conclusion}:** ${nativeProse(explanation.conclusion, context, language)}`);
  if (explanation.finalAnswerLatex) {
    parts.push(`\\[\\boxed{${interpolateEditorialText(explanation.finalAnswerLatex, context)}}\\]`);
  }
  if (explanation.commonTrap) {
    parts.push(`**${ui.commonTrap}:** ${nativeProse(explanation.commonTrap, context, language)}`);
  }
  if (explanation.shortcut) {
    parts.push(`**${ui.quickCheck}:** ${nativeProse(explanation.shortcut, context, language)}`);
  }

  return parts.filter(Boolean).join("\n\n");
}
