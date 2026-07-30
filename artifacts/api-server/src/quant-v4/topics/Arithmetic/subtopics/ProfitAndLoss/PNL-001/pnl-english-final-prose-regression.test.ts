import assert from "node:assert/strict";

import { runPnlCp001DynamicPipeline } from "./CP-001/cp001-dynamic-runtime";
import { runPnlCp002DynamicPipeline } from "./CP-002/cp002-dynamic-runtime";
import { runPnlCp003DynamicPipeline } from "./CP-003/cp003-dynamic-runtime";
import { runPnlCp004DynamicPipeline } from "./CP-004/cp004-dynamic-runtime";
import { runPnlCp005DynamicPipeline } from "./CP-005/cp005-dynamic-runtime";
import { runPnlCp006DynamicPipeline } from "./CP-006/cp006-dynamic-runtime";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/₹\s*[\d,.]+(?:\.\d+)?/g, "₹#")
    .replace(/\b\d+(?:\.\d+)?%/g, "#%")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/\b(?:x|y|n|r|q|d|c|s|m)\b/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function explanationText(pkg: { explanation: { lines: readonly string[] } }): string {
  return pkg.explanation.lines.join("\n\n");
}

function opening(pkg: { explanation: { lines: readonly string[] } }): string {
  const value = explanationText(pkg).replace(/\s+/g, " ").trim();
  return normalize(value.match(/^(.+?[.!?])(?:\s|$)/)?.[1] ?? value);
}

function lastEditorialSentence(pkg: {
  explanation: { lines: readonly string[] };
}): string {
  const editorial = explanationText(pkg)
    .split(/\n\n\*\*(?:Generated-value check|Working with these values):\*\*/)[0]!
    .replace(/\s+/g, " ")
    .trim();
  const sentences = editorial.match(/[^.!?]+[.!?]+/g) ?? [];
  return normalize(sentences.at(-1)?.trim() ?? editorial);
}

function meaningfulParagraphs(pkg: {
  explanation: { lines: readonly string[] };
}): readonly string[] {
  return explanationText(pkg)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => {
      const words = paragraph
        .replace(/\\\[[\s\S]*?\\\]/g, "")
        .replace(/\\\([\s\S]*?\\\)/g, "")
        .replace(/\\[A-Za-z]+(?:\{[^}]*\})?/g, " ")
        .replace(/[^A-Za-z' -]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      return words.length >= 5 && words.some((word) => word.length >= 4);
    })
    .map(normalize);
}

const runners = {
  cp001: (qlId: string, seed: string) =>
    runPnlCp001DynamicPipeline({ questionLanguageId: qlId, language: "en", seed }),
  cp002: (qlId: string, seed: string) =>
    runPnlCp002DynamicPipeline({ questionLanguageId: qlId, language: "en", seed }),
  cp003: (qlId: string, seed: string) =>
    runPnlCp003DynamicPipeline({ questionLanguageId: qlId, language: "en", seed }),
  cp004: (qlId: string, seed: string) =>
    runPnlCp004DynamicPipeline({ questionLanguageId: qlId, language: "en", seed }),
  cp005: (qlId: string, seed: string) =>
    runPnlCp005DynamicPipeline({ questionLanguageId: qlId, language: "en", seed }),
  cp006: (qlId: string, seed: string) =>
    runPnlCp006DynamicPipeline({ questionLanguageId: qlId, language: "en", seed }),
};

const openingGroups = [
  { runner: runners.cp002, qlIds: ["PNL-QL-042", "PNL-QL-043", "PNL-QL-044"] },
  { runner: runners.cp002, qlIds: ["PNL-QL-047", "PNL-QL-048", "PNL-QL-066"] },
  { runner: runners.cp002, qlIds: ["PNL-QL-040", "PNL-QL-057", "PNL-QL-065"] },
  { runner: runners.cp002, qlIds: ["PNL-QL-046", "PNL-QL-056", "PNL-QL-064"] },
  { runner: runners.cp001, qlIds: ["PNL-QL-003", "PNL-QL-004", "PNL-QL-035"] },
] as const;

for (const [groupIndex, group] of openingGroups.entries()) {
  const values = group.qlIds.map((qlId) =>
    opening(group.runner(qlId, `pnl-final-opening-${groupIndex}-${qlId}`)),
  );
  assert.equal(
    new Set(values).size,
    values.length,
    `Opening group still shares prose: ${group.qlIds.join(", ")}`,
  );
}

const cp001Closings = ["PNL-QL-003", "PNL-QL-004", "PNL-QL-035"].map((qlId) => {
  const pkg = runners.cp001(qlId, `pnl-final-cp001-working-${qlId}`);
  const working = explanationText(pkg).split("**Working with these values:**")[1] ?? "";
  return normalize(working.split("**Final answer:**")[0] ?? working);
});
assert.equal(new Set(cp001Closings).size, 3, "CP-001 value-bound working remains cloned.");

const sellingPriceClosings = [
  runners.cp002("PNL-QL-057", "pnl-final-closing-057"),
  runners.cp004("PNL-QL-095", "pnl-final-closing-095"),
  runners.cp004("PNL-QL-096", "pnl-final-closing-096"),
  runners.cp004("PNL-QL-115", "pnl-final-closing-115"),
].map(lastEditorialSentence);
assert.equal(
  new Set(sellingPriceClosings).size,
  sellingPriceClosings.length,
  "Final-selling-price closings remain cloned.",
);

const percentageStepQls = [
  [runners.cp002, "PNL-QL-038"],
  [runners.cp002, "PNL-QL-068"],
  [runners.cp005, "PNL-QL-122"],
  [runners.cp006, "PNL-QL-154"],
  [runners.cp006, "PNL-QL-174"],
  [runners.cp006, "PNL-QL-177"],
] as const;
for (const [runner, qlId] of percentageStepQls) {
  const pkg = runner(qlId, `pnl-final-step-${qlId}`);
  assert.doesNotMatch(
    explanationText(pkg),
    /\*\*Step \d+: Convert to a percentage\*\*/,
    `${qlId} still uses the generic percentage step title.`,
  );
}

const inventoryStepQls = ["PNL-QL-074", "PNL-QL-082", "PNL-QL-089", "PNL-QL-094"];
const inventoryParagraphs = inventoryStepQls.map((qlId) =>
  meaningfulParagraphs(runners.cp003(qlId, `pnl-final-inventory-${qlId}`)),
);
for (const paragraphs of inventoryParagraphs) {
  assert.ok(
    !paragraphs.includes("multiply total quantity by unit cost price."),
    "Generic inventory cost step remains visible.",
  );
}

for (const qlId of ["PNL-QL-005", "PNL-QL-006", "PNL-QL-007", "PNL-QL-008"]) {
  const pkg = runners.cp001(qlId, `pnl-final-factor-${qlId}`);
  assert.doesNotMatch(
    explanationText(pkg),
    /Use 1\+r\/100 for profit or 1−r\/100 for loss\./,
    `${qlId} still shares the generic signed-factor step.`,
  );
}

const expectedFixedAnswers = new Map<string, typeof runners.cp001>([
  ["PNL-QL-035", runners.cp001],
  ["PNL-QL-067", runners.cp002],
  ["PNL-QL-070", runners.cp002],
  ["PNL-QL-090", runners.cp003],
  ["PNL-QL-117", runners.cp004],
  ["PNL-QL-147", runners.cp005],
  ["PNL-QL-184", runners.cp006],
]);
for (const [qlId, runner] of expectedFixedAnswers) {
  const answers = new Set(
    Array.from({ length: 48 }, (_, index) =>
      runner(qlId, `pnl-final-fixed-answer-${qlId}-${index + 1}`).answer,
    ),
  );
  assert.equal(answers.size, 1, `${qlId} is not a fixed-answer contract.`);
}

console.log(
  JSON.stringify(
    {
      status: "PASS_PNL_ENGLISH_FINAL_PROSE_REGRESSION",
      correctedOpeningGroups: openingGroups.length,
      correctedClosingPatterns: 2,
      correctedStepPatterns: 3,
      fixedAnswerContracts: [...expectedFixedAnswers.keys()],
    },
    null,
    2,
  ),
);
