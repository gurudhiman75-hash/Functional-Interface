import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyAvg001Cp004EditorialV2ReviewedCandidate } from "./foundation/cp004-editorial-v2-distractor-polish";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

function csv(value: unknown) {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const rows = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-004")
  .map((entry) => {
    const seed = `avg-cp004-editorial-v2-review:${entry.qlId}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const candidate = applyAvg001Cp004EditorialV2ReviewedCandidate(original);
    return {
      qlId: entry.qlId,
      solveMode: entry.solveMode,
      difficulty: entry.difficulty,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
      originalStem: original.stem,
      revisedStem: candidate.stem,
      revisedOptions: candidate.options,
      correctIndex: candidate.correctIndex,
      revisedAnswer: candidate.answer,
      revisedExplanation: candidate.explanation.lines,
      mathematicalFingerprint: candidate.mathematicalFingerprint,
      validation: candidate.validation.valid ? "PASS" : "FAIL",
      releaseCandidate: candidate.traceability.releaseCandidate,
      semanticUnit: candidate.traceability.semanticAnswerUnit,
      distractorAnalysisVersion: candidate.traceability.cp004DistractorAnalysisV2,
    };
  });

const headers = Object.keys(rows[0]!);
const output = [
  headers.map(csv).join(","),
  ...rows.map((row) => headers.map((header) => csv(row[header as keyof typeof row])).join(",")),
].join("\n");

const target = join(
  process.cwd(),
  "src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-cp004-editorial-v2-review.csv",
);
writeFileSync(target, output, "utf8");
console.log(JSON.stringify({ target, rows: rows.length, status: "PASS" }, null, 2));
