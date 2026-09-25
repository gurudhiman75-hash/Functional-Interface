import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
import { generateDirectionQuestionHindi, generateDirectionQuestionPunjabi } from "./localization";

type AnyQuestion = Record<string, any>;
type LocaleKey = "English" | "Hindi" | "Punjabi";

const samples: ReadonlyArray<{
  label: LocaleKey;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  generate: (qlId: string, seed: number) => AnyQuestion;
}> = [
  { label: "English", locale: "en-IN", generate: (qlId, seed) => generateDirectionQuestion(qlId, seed) as AnyQuestion },
  { label: "Hindi", locale: "hi-IN", generate: (qlId, seed) => generateDirectionQuestionHindi(qlId, seed) as AnyQuestion },
  { label: "Punjabi", locale: "pa-IN", generate: (qlId, seed) => generateDirectionQuestionPunjabi(qlId, seed) as AnyQuestion },
];

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, out));
  else if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (key !== "svg") strings(nested, out);
    }
  }
  return out;
}

function renderExplanationStep(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object" || Array.isArray(value)) return String(value ?? "");
  const record = value as Record<string, unknown>;
  if (typeof record.statement === "string" && typeof record.result === "string") {
    return `${record.statement} → ${record.result}`;
  }
  if (typeof record.text === "string") return record.text;
  return strings(record).filter(Boolean).join(" — ");
}

function explanationLines(question: AnyQuestion): string[] {
  const e = question.explanation ?? {};
  const ordered = [
    e.given,
    ...(Array.isArray(e.steps) ? e.steps.map(renderExplanationStep) : []),
    e.resultLine,
    e.conclusion,
  ].filter(Boolean).map(renderExplanationStep).filter(Boolean);
  return ordered.length ? ordered : strings(e).filter(Boolean);
}

function renderQuestion(question: AnyQuestion, label: LocaleKey, ordinal: number): string {
  const options = (question.options ?? []).map((option: AnyQuestion, index: number) =>
    `${String.fromCharCode(65 + index)}. ${String(option.label ?? option.text ?? option.value ?? "")}`
  ).join("\n");
  const answer = String(question.options?.[question.correctIndex]?.label ?? question.correctAnswer ?? "");
  const explanation = explanationLines(question).map((line, index) => `${index + 1}. ${line}`).join("\n");
  const diagrams = [question.questionDiagram, question.explanationDiagram, question.explanation?.diagram]
    .filter(Boolean)
    .map((diagram: AnyQuestion) => String(diagram?.accessibleSummary ?? diagram?.ariaLabel ?? diagram?.title ?? "Diagram available"))
    .filter(Boolean);

  return [
    `### ${ordinal}. ${question.qlId} · ${question.checkpointId} · ${label}`,
    "",
    `- Difficulty: \`${question.difficulty}\``,
    `- Rule: \`${question.ruleId}\``,
    "",
    "**Question**",
    "",
    String(question.stem),
    "",
    "**Options**",
    "",
    options,
    "",
    `**Answer:** ${answer}`,
    "",
    "**Explanation**",
    "",
    explanation || "—",
    ...(diagrams.length ? ["", "**Diagram evidence**", "", ...diagrams.map((line) => `- ${line}`)] : []),
    "",
  ].join("\n");
}

export function buildDir001FinalAuditReviewPack() {
  const records: AnyQuestion[] = [];
  const sections: string[] = [];
  let ordinal = 1;

  for (const ql of DIR_001_QLS) {
    for (const sample of samples) {
      const seed = Number(ql.qlId.slice(-3)) * 17;
      const question = sample.generate(ql.qlId, seed);
      records.push(question);
      sections.push(renderQuestion(question, sample.label, ordinal));
      ordinal += 1;
    }
  }

  const checkpointCounts = Object.fromEntries(
    [...new Set(DIR_001_QLS.map((ql) => ql.checkpointId))].map((checkpointId) => [
      checkpointId,
      DIR_001_QLS.filter((ql) => ql.checkpointId === checkpointId).length,
    ]),
  );

  const summary = {
    packageId: "DIR-001",
    qlCount: DIR_001_QLS.length,
    qlRange: `${DIR_001_QLS[0]?.qlId}..${DIR_001_QLS.at(-1)?.qlId}`,
    checkpointCounts,
    locales: samples.map((sample) => sample.locale),
    markdownSamples: records.length,
    reviewOnly: true,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  } as const;

  const markdown = [
    "# DIR-001 Final Audit Review Pack",
    "",
    "Status: **audit review only — no Question Bank/test/public release is granted by this file**.",
    "",
    "## Coverage",
    "",
    `- Permanent QLs: **${summary.qlRange}** (${summary.qlCount})`,
    `- Checkpoints: **${Object.keys(checkpointCounts).length}**`,
    `- Languages: **English, Hindi, Punjabi**`,
    `- Review samples: **${records.length}** (one deterministic sample per QL per language)`,
    "",
    "## Review focus",
    "",
    "Check stems for real-exam naturalness, explanations for beginner clarity, distractors for plausibility, Hindi/Punjabi for native wording, and diagram descriptions for ambiguity or misleading geometry.",
    "",
    "---",
    "",
    sections.join("\n---\n\n"),
    "",
  ].join("\n");

  return { records, summary, markdown };
}

export function writeDir001FinalAuditReviewPack(outputDir = "dist/reasoning-v1/dir-001-final-audit-review") {
  const result = buildDir001FinalAuditReviewPack();
  const out = resolve(outputDir);
  mkdirSync(out, { recursive: true });
  writeFileSync(resolve(out, "DIR-001-FINAL-AUDIT-REVIEW.md"), result.markdown, "utf8");
  writeFileSync(resolve(out, "DIR-001-FINAL-AUDIT-REVIEW.jsonl"), result.records.map((record) => JSON.stringify(record)).join("\n") + "\n", "utf8");
  writeFileSync(resolve(out, "DIR-001-FINAL-AUDIT-SUMMARY.json"), JSON.stringify(result.summary, null, 2) + "\n", "utf8");
  return result.summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(writeDir001FinalAuditReviewPack(), null, 2));
}
