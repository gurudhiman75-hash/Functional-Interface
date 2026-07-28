import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyAvg001Cp005EditorialV2FinalCandidate } from "./foundation/cp005-editorial-v2-final";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

function csv(value: unknown) {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const rows = getAvg001QuestionEntries()
  .filter((entry) => entry.cpId === "AVG-CP-005")
  .map((entry) => {
    const seed = `avg-cp005-editorial-v2-review:${entry.qlId}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const candidate = applyAvg001Cp005EditorialV2FinalCandidate(original);
    return {
      qlId: entry.qlId,
      solveMode: entry.solveMode,
      difficulty: entry.difficulty,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
      originalStem: original.stem,
      revisedStem: candidate.stem,
      revisedOptions: candidate.options,
      optionMisconceptionTags: candidate.traceability.cp005OptionTags,
      correctIndex: candidate.correctIndex,
      revisedAnswer: candidate.answer,
      revisedExplanation: candidate.explanation.lines,
      mathematicalFingerprint: candidate.mathematicalFingerprint,
      validation: candidate.validation.valid ? "PASS" : "FAIL",
      releaseCandidate: candidate.traceability.releaseCandidate,
    };
  });

const headers = Object.keys(rows[0]!);
const output = [
  headers.map(csv).join(","),
  ...rows.map((row) => headers.map((header) => csv(row[header as keyof typeof row])).join(",")),
].join("\n");

const target = join(
  process.cwd(),
  "src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-cp005-editorial-v2-review.csv",
);
writeFileSync(target, output, "utf8");
console.log(JSON.stringify({ target, rows: rows.length, status: "PASS" }, null, 2));
