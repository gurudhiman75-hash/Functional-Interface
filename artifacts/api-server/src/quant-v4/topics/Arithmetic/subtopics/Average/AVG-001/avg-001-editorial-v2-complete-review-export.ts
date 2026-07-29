import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyAvg001EditorialV2CompleteCandidate } from "./foundation/editorial-v2-complete";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

function csv(value: unknown) {
  const text = Array.isArray(value) ? value.join("\n") : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const rows = getAvg001QuestionEntries()
  .filter((entry) => entry.active)
  .map((entry) => {
    const seed = `avg-001-editorial-v2-review:${entry.qlId}`;
    const original = runAvg001Pipeline({ questionLanguageId: entry.qlId, seed, language: "en" });
    const candidate = applyAvg001EditorialV2CompleteCandidate(original);
    return {
      qlId: entry.qlId,
      cpId: entry.cpId,
      solveMode: entry.solveMode,
      difficulty: entry.difficulty,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
      originalStem: original.stem,
      revisedStem: candidate.stem,
      revisedOptions: candidate.options,
      optionMisconceptionTags:
        candidate.traceability.editorialV2OptionTags ??
        candidate.traceability.cp005OptionTags ??
        "embedded in explanation",
      correctIndex: candidate.correctIndex,
      revisedAnswer: candidate.answer,
      revisedExplanation: candidate.explanation.lines,
      mathematicalFingerprint: candidate.mathematicalFingerprint,
      validation: candidate.validation.valid ? "PASS" : "FAIL",
      releaseCandidate: candidate.traceability.releaseCandidate,
      chapterCandidate: candidate.traceability.avg001EditorialV2Complete,
    };
  });

const headers = Object.keys(rows[0]!);
const output = [
  headers.map(csv).join(","),
  ...rows.map((row) => headers.map((header) => csv(row[header as keyof typeof row])).join(",")),
].join("\n");

const target = join(
  process.cwd(),
  "src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001/avg-001-editorial-v2-complete-review.csv",
);
writeFileSync(target, output, "utf8");
console.log(JSON.stringify({ target, rows: rows.length, status: "PASS" }, null, 2));
