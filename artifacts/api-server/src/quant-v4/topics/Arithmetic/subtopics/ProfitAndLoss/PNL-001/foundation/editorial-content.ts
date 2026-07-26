export type QuestionStemBlock =
  | Readonly<{ type: "paragraph"; content: string }>
  | Readonly<{ type: "table"; caption?: string; columns: readonly string[]; rows: readonly (readonly string[])[] }>
  | Readonly<{ type: "caselet"; title?: string; paragraphs: readonly string[] }>
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

function escapeTableCell(value: string): string {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}

export function renderStructuredStemMarkdown(stem: StructuredQuestionStem): string {
  const parts: string[] = [];

  for (const block of stem.blocks) {
    switch (block.type) {
      case "paragraph":
        parts.push(block.content);
        break;
      case "table": {
        if (block.caption) parts.push(`**${block.caption}**`);
        parts.push(`| ${block.columns.map(escapeTableCell).join(" | ")} |`);
        parts.push(`| ${block.columns.map(() => "---").join(" | ")} |`);
        for (const row of block.rows) {
          parts.push(`| ${row.map(escapeTableCell).join(" | ")} |`);
        }
        break;
      }
      case "caselet":
        if (block.title) parts.push(`**${block.title}**`);
        parts.push(...block.paragraphs);
        break;
      case "statements":
        if (block.lead) parts.push(block.lead);
        block.statements.forEach((statement, index) => parts.push(`${index + 1}. ${statement}`));
        break;
      case "data_sufficiency":
        parts.push(block.question);
        block.statements.forEach((statement, index) => parts.push(`**Statement ${index + 1}:** ${statement}`));
        parts.push("Use the standard two-statement data-sufficiency answer scheme.");
        break;
      case "equation":
        parts.push(block.display === false ? `\\(${block.latex}\\)` : `\\[${block.latex}\\]`);
        break;
    }
  }

  parts.push(stem.prompt);
  return parts.filter(Boolean).join("\n\n");
}

export function renderFriendlyExplanationMarkdown(explanation: FriendlyExplanation): string {
  const parts: string[] = [explanation.opening, `**Key idea:** ${explanation.concept}`];

  explanation.steps.forEach((step, index) => {
    parts.push(`**Step ${index + 1}: ${step.title}**`);
    parts.push(step.body);
    if (step.equationLatex) parts.push(`\\[${step.equationLatex}\\]`);
  });

  parts.push(`**Conclusion:** ${explanation.conclusion}`);
  if (explanation.finalAnswerLatex) parts.push(`\\[\\boxed{${explanation.finalAnswerLatex}}\\]`);
  if (explanation.commonTrap) parts.push(`**Common mistake to avoid:** ${explanation.commonTrap}`);
  if (explanation.shortcut) parts.push(`**Quick check:** ${explanation.shortcut}`);

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
      if (block.rows.length === 0) errors.push("A table must have at least one data row.");
      for (const row of block.rows) {
        if (row.length !== block.columns.length) errors.push("Every table row must match the column count.");
      }
    }
    if (block.type === "caselet" && block.paragraphs.length < 2) {
      errors.push("A caselet must contain at least two paragraphs.");
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
