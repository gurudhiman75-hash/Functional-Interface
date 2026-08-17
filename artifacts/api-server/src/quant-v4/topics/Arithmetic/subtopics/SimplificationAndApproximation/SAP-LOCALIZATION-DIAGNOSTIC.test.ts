import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateQuestion } from "../../../../question-studio-generation-engine";
import { SAP_QUESTION_STUDIO_QLS } from "./question-studio-adapter";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/sap-localization-diagnostic");
mkdirSync(outputDirectory, { recursive: true });

const failures: Array<{
  qlId: string;
  cpId: string;
  language: "hi" | "pa";
  validationErrors: string[];
  stem: string;
  options: string[];
  answer: string;
  explanation: string;
}> = [];

const rows: Array<{
  qlId: string;
  cpId: string;
  language: "hi" | "pa";
  valid: boolean;
  stem: string;
  explanation: string;
}> = [];

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  for (const language of ["hi", "pa"] as const) {
    const result = await generateQuestion({
      packageId: "SAP",
      topic: "Arithmetic",
      subtopic: "Simplification & Approximation",
      questionLanguageId: descriptor.qlId,
      language,
      count: 1,
      seed: `sap-localization-parity:${descriptor.qlId}`,
    });
    const question = result.questions[0] as any;
    const valid = question?.localizationValidation?.ok === true;
    const validationErrors = [...(question?.localizationValidation?.errors ?? [])].map(String);
    const row = {
      qlId: descriptor.qlId,
      cpId: descriptor.checkpointId,
      language,
      valid,
      stem: String(question?.text ?? ""),
      explanation: String(question?.explanation ?? ""),
    };
    rows.push(row);
    if (!valid) {
      failures.push({
        qlId: descriptor.qlId,
        cpId: descriptor.checkpointId,
        language,
        validationErrors,
        stem: String(question?.text ?? ""),
        options: [...(question?.options ?? [])].map(String),
        answer: String(question?.answer ?? ""),
        explanation: String(question?.explanation ?? ""),
      });
    }
  }
}

const byCheckpoint: Record<string, number> = {};
for (const failure of failures) byCheckpoint[failure.cpId] = (byCheckpoint[failure.cpId] ?? 0) + 1;

const summary = {
  status: failures.length ? "SAP_LOCALIZATION_AUTHORED_GAPS_FOUND" : "SAP_LOCALIZATION_AUTHORED_GAPS_NONE",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  localizedCount: rows.length,
  failureCount: failures.length,
  failedQlCount: new Set(failures.map((failure) => failure.qlId)).size,
  byCheckpoint,
};

const jsonPath = resolve(outputDirectory, "sap-localization-diagnostic.json");
const markdownPath = resolve(outputDirectory, "sap-localization-diagnostic.md");
writeFileSync(jsonPath, `${JSON.stringify({ summary, failures, rows }, null, 2)}\n`, "utf8");
writeFileSync(markdownPath, [
  "# SAP Authored Localization Diagnostic",
  "",
  `Status: **${summary.status}**`,
  `Failures: **${summary.failureCount}** localized QL/language cases across **${summary.failedQlCount}** QLs.`,
  "",
  ...failures.map((failure) => [
    `## ${failure.qlId} · ${failure.language} · ${failure.cpId}`,
    "",
    `Errors: ${failure.validationErrors.join(" | ") || "unknown"}`,
    "",
    `Stem: ${failure.stem}`,
    "",
    `Options: ${failure.options.join(" | ")}`,
    "",
    `Answer: ${failure.answer}`,
    "",
    `Explanation: ${failure.explanation.replaceAll("\n", " ")}`,
    "",
  ].join("\n")),
].join("\n"), "utf8");

console.log(JSON.stringify({ ...summary, jsonPath, markdownPath, preview: failures.slice(0, 20) }));
