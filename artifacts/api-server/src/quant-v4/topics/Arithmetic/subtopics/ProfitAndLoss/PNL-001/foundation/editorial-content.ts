export type QuestionStemBlock =
  | Readonly<{ type: "paragraph"; content: string }>
  | Readonly<{
      type: "table";
      caption?: string;
      columns: readonly string[];
      rows?: readonly (readonly string[])[];
      rowSource?: string;
    }>
  | Readonly<{
      type: "caselet";
      title?: string;
      paragraphs?: readonly string[];
      paragraphSource?: string;
    }>
  | Readonly<{ type: "statements"; lead?: string; statements: readonly string[] }>
  | Readonly<{
      type: "data_sufficiency";
      question: string;
      statements: readonly string[];
      answerScheme: "STANDARD_TWO_STATEMENT";
    }>
  | Readonly<{ type: "equation"; latex: string; display?: boolean }>;

export type StructuredQuestionStem = Readonly<{
  contextFamily: string;
  blocks: readonly QuestionStemBlock[];
  prompt: string;
}>;

export type ExplanationStep = Readonly<{
  title: string;
  body: string;
  equationLatex?: string;
}>;

export type FriendlyExplanation = Readonly<{
  opening: string;
  concept: string;
  steps: readonly ExplanationStep[];
  conclusion: string;
  finalAnswerLatex?: string;
  commonTrap?: string;
  shortcut?: string;
}>;

export type EditorialDifficulty = "Easy" | "Medium" | "Hard";

export type StructuredEditorialEntry = Readonly<{
  stem: StructuredQuestionStem;
  explanation: FriendlyExplanation;
  difficulty: EditorialDifficulty;
  difficultyRationale: string;
}>;

export type EditorialRenderContext = Readonly<Record<string, unknown>>;

function escapeTableCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
}

export function interpolateEditorialText(template: string, context: EditorialRenderContext = {}): string {
  return template.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (full, key: string) => {
    if (!(key in context)) return full;
    return stringifyValue(context[key]);
  });
}

export function normalizeEditorialProse(value: string): string {
  return value
    .replaceAll("×", " multiplied by ")
    .replaceAll("÷", " divided by ")
    .replaceAll("²", " squared")
    .replaceAll("³", " cubed")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function prose(template: string, context: EditorialRenderContext): string {
  return normalizeEditorialProse(interpolateEditorialText(template, context));
}

function resolveRows(block: Extract<QuestionStemBlock, { type: "table" }>, context: EditorialRenderContext): readonly (readonly string[])[] {
  if (block.rows) return block.rows;
  if (!block.rowSource) return [];
  const value = context[block.rowSource];
  if (!Array.isArray(value)) return [];
  return value.map((row) => Array.isArray(row) ? row.map(stringifyValue) : [stringifyValue(row)]);
}

function resolveParagraphs(block: Extract<QuestionStemBlock, { type: "caselet" }>, context: EditorialRenderContext): readonly string[] {
  if (block.paragraphs) return block.paragraphs;
  if (!block.paragraphSource) return [];
  const value = context[block.paragraphSource];
  if (Array.isArray(value)) return value.map(stringifyValue);
  if (value !== undefined && value !== null) return [stringifyValue(value)];
  return [];
}

export function renderStructuredStemMarkdown(
  stem: StructuredQuestionStem,
  context: EditorialRenderContext = {},
): string {
  const parts: string[] = [];

  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(prose(block.content, context));
        break;
      case "table": {
        if (block.caption) parts.push(`**${prose(block.caption, context)}**`);
        const columns = block.columns.map((column) => prose(column, context));
        const rows = resolveRows(block, context);
        parts.push(`| ${columns.map(escapeTableCell).join(" | ")} |`);
        parts.push(`| ${columns.map(() => "---").join(" | ")} |`);
        if (rows.length === 0 && block.rowSource) {
          parts.push(`| ${[`{${block.rowSource}}`, ...columns.slice(1).map(() => "")].map(escapeTableCell).join(" | ")} |`);
        } else {
          for (const row of rows) {
            const normalized = columns.map((_, index) => prose(row[index] ?? "", context));
            parts.push(`| ${normalized.map(escapeTableCell).join(" | ")} |`);
          }
        }
        break;
      }
      case "caselet": {
        if (block.title) parts.push(`**${prose(block.title, context)}**`);
        const paragraphs = resolveParagraphs(block, context);
        if (paragraphs.length === 0 && block.paragraphSource) parts.push(`{${block.paragraphSource}}`);
        else parts.push(...paragraphs.map((paragraph) => prose(paragraph, context)));
        break;
      }
      case "statements":
        if (block.lead) parts.push(prose(block.lead, context));
        block.statements.forEach((statement, index) => parts.push(`${index + 1}. ${prose(statement, context)}`));
        break;
      case "data_sufficiency":
        parts.push(prose(block.question, context));
        block.statements.forEach((statement, index) => parts.push(`**Statement ${index + 1}:** ${prose(statement, context)}`));
        parts.push("Use the standard two-statement data-sufficiency answer scheme.");
        break;
      case "equation": {
        const latex = interpolateEditorialText(block.latex, context);
        parts.push(block.display === false ? `\\(${latex}\\)` : `\\[${latex}\\]`);
        break;
      }
    }
  }

  parts.push(prose(stem.prompt, context));
  return parts.filter(Boolean).join("\n\n");
}

export function renderFriendlyExplanationMarkdown(
  explanation: FriendlyExplanation,
  context: EditorialRenderContext = {},
): string {
  const parts: string[] = [
    prose(explanation.opening, context),
    `**Key idea:** ${prose(explanation.concept, context)}`,
  ];

  explanation.steps.forEach((step, index) => {
    parts.push(`**Step ${index + 1}: ${prose(step.title, context)}**`);
    parts.push(prose(step.body, context));
    if (step.equationLatex) parts.push(`\\[${interpolateEditorialText(step.equationLatex, context)}\\]`);
  });

  parts.push(`**Conclusion:** ${prose(explanation.conclusion, context)}`);
  if (explanation.finalAnswerLatex) {
    parts.push(`\\[\\boxed{${interpolateEditorialText(explanation.finalAnswerLatex, context)}}\\]`);
  }
  if (explanation.commonTrap) {
    parts.push(`**Common mistake to avoid:** ${prose(explanation.commonTrap, context)}`);
  }
  if (explanation.shortcut) parts.push(`**Quick check:** ${prose(explanation.shortcut, context)}`);

  return parts.filter(Boolean).join("\n\n");
}

export function validateStructuredEditorialEntry(entry: StructuredEditorialEntry): readonly string[] {
  const errors: string[] = [];

  if (!entry.stem.contextFamily.trim()) errors.push("A context family is required.");
  if (entry.stem.blocks.length === 0) errors.push("At least one structured stem block is required.");
  if (!entry.stem.prompt.trim()) errors.push("A final question prompt is required.");
  if (!entry.explanation.opening.trim()) errors.push("A friendly opening is required.");
  if (!entry.explanation.concept.trim()) errors.push("A key concept is required.");
  if (entry.explanation.steps.length === 0) errors.push("At least one explanation step is required.");
  if (!entry.explanation.conclusion.trim()) errors.push("A conclusion is required.");
  if (!entry.difficultyRationale.trim()) errors.push("A difficulty rationale is required.");

  for (const block of entry.stem.blocks) {
    if (block.type === "table") {
      if (block.columns.length < 2) errors.push("A table must have at least two columns.");
      if (!block.rows && !block.rowSource) errors.push("A table needs static rows or a runtime row source.");
      if (block.rows) {
        if (block.rows.length === 0) errors.push("A static table must have at least one data row.");
        for (const row of block.rows) {
          if (row.length !== block.columns.length) errors.push("Every table row must match the column count.");
        }
      }
    }
    if (block.type === "caselet") {
      if (!block.paragraphs && !block.paragraphSource) errors.push("A caselet needs paragraphs or a runtime paragraph source.");
      if (block.paragraphs && block.paragraphs.length < 2) errors.push("A static caselet must contain at least two paragraphs.");
    }
    if ((block.type === "statements" || block.type === "data_sufficiency") && block.statements.length < 2) {
      errors.push("Statement-based content must contain at least two statements.");
    }
  }

  if (entry.difficulty === "Medium" && entry.explanation.steps.length < 2) {
    errors.push("A Medium explanation must contain at least two steps.");
  }
  if (entry.difficulty === "Hard") {
    if (entry.explanation.steps.length < 2) errors.push("A Hard explanation must contain at least two steps.");
    if (!entry.explanation.commonTrap) errors.push("A Hard explanation must identify a common mistake.");
  }

  return errors;
}
