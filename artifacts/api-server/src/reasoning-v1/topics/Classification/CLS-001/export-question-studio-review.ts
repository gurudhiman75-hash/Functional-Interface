import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  CLS_001_QUESTION_STUDIO_LOCALES,
  CLS_001_QUESTION_STUDIO_QL_IDS,
  previewCls001QuestionStudioReview,
} from "./question-studio-review";

const outputDir = path.resolve(process.cwd(), "dist/reasoning-v1/cls-001/chapter-closeout");
const outputFile = path.join(outputDir, "cls-001-question-studio-review.md");

function record(value: unknown): Readonly<Record<string, unknown>> {
  return value !== null && typeof value === "object" ? value as Readonly<Record<string, unknown>> : {};
}

function show(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(show).join(" : ");
  if (value === null || value === undefined) return "";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const rows = CLS_001_QUESTION_STUDIO_QL_IDS.flatMap((qlId, qlIndex) =>
  CLS_001_QUESTION_STUDIO_LOCALES.map((locale, localeIndex) => {
    const seed = 400 + qlIndex * 43 + localeIndex * 13;
    return { qlId, locale, seed, preview: previewCls001QuestionStudioReview({ qlId, locale, seed }) };
  }),
);

const markdown = [
  "# CLS-001 Final Chapter Closeout — Question Studio Review",
  "",
  "Questions: 39",
  "Coverage: 13 permanent QLs × English/Hindi/Punjabi",
  "Mode: Question Studio review-only preview.",
  "Persistence / Question Bank / test / mock / student / public gates: CLOSED.",
  "CP008: ownership-only checkpoint with zero new QLs and zero generators.",
  "",
  ...rows.flatMap(({ qlId, locale, seed, preview }, index) => {
    const question = record(preview.question);
    const options = Array.isArray(question.options) ? question.options : [];
    const explanation = record(question.explanation);
    const coreConcept = Array.isArray(explanation.coreConcept) ? explanation.coreConcept : [];
    const steps = Array.isArray(explanation.stepByStep) ? explanation.stepByStep : [];
    const metadata = record(question.metadata);
    return [
      "## " + String(index + 1) + ". " + qlId + " · " + locale,
      "",
      "**Question:** " + show(question.stem),
      "",
      "**Options:**",
      ...options.map((option, optionIndex) => String.fromCharCode(65 + optionIndex) + ". " + show(option)),
      "",
      "**Answer:** " + show(question.answer),
      "",
      "### Explanation",
      ...coreConcept.map((line) => "- " + show(line)),
      ...steps.map((line, stepIndex) => String(stepIndex + 1) + ". " + show(line)),
      "",
      "<details>",
      "<summary>Closeout metadata</summary>",
      "",
      "- Seed: " + String(seed),
      "- Review only: " + String(preview.reviewOnly),
      "- Question Studio visible: " + String(preview.questionStudioVisible),
      "- Studio registration: " + show(metadata.questionStudioRegistrationStatus),
      "- Question Bank writable: " + String(metadata.questionBankWritable),
      "- Test eligible: " + String(metadata.testEligible),
      "- Mock eligible: " + String(metadata.mockTestEligible),
      "- Publicly publishable: " + String(metadata.publiclyPublishable),
      "",
      "</details>",
      "",
      "---",
      "",
    ];
  }),
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, markdown + "\n", "utf8");
console.log(JSON.stringify({ outputFile, questions: rows.length }, null, 2));
