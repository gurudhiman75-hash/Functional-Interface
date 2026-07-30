import assert from "node:assert/strict";

import { runPnlCp001DynamicPipeline } from "./CP-001/cp001-dynamic-runtime";
import { generatePnlCp003Case } from "./CP-003/cp003-dynamic-cases";
import { runPnlCp003DynamicPipeline } from "./CP-003/cp003-dynamic-runtime";

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

function proseParagraphs(
  explanationLines: readonly string[],
): readonly string[] {
  const full = explanationLines.join("\n\n");
  const editorial = full.split(
    /\n\n\*\*(?:Generated-value check|Working with these values):\*\*/,
  )[0]!;
  return editorial
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => {
      const prose = paragraph
        .replace(/\\\[[\s\S]*?\\\]/g, "")
        .replace(/\\\([\s\S]*?\\\)/g, "")
        .replace(/\\[A-Za-z]+(?:\{[^}]*\})?/g, " ")
        .replace(/[^A-Za-z' -]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      return prose.length >= 5 && prose.some((word) => word.length >= 4);
    })
    .map(normalize);
}

function firstSentence(explanationLines: readonly string[]): string {
  const full = explanationLines.join(" ").replace(/\s+/g, " ").trim();
  return normalize(full.match(/^(.+?[.!?])(?:\s|$)/)?.[1] ?? full);
}

function assertClusterUnique(
  qlIds: readonly string[],
  runner: (qlId: string) => ReturnType<typeof runPnlCp003DynamicPipeline>,
): void {
  const paragraphOwners = new Map<string, Set<string>>();
  const openingOwners = new Map<string, Set<string>>();
  for (const qlId of qlIds) {
    const pkg = runner(qlId);
    const opening = firstSentence(pkg.explanation.lines);
    openingOwners.set(
      opening,
      new Set([...(openingOwners.get(opening) ?? []), qlId]),
    );
    for (const paragraph of proseParagraphs(pkg.explanation.lines)) {
      paragraphOwners.set(
        paragraph,
        new Set([...(paragraphOwners.get(paragraph) ?? []), qlId]),
      );
    }
  }
  for (const [opening, owners] of openingOwners) {
    assert.equal(
      owners.size,
      1,
      `Editorial opening is shared by ${[...owners].join(", ")}: ${opening}`,
    );
  }
  for (const [paragraph, owners] of paragraphOwners) {
    assert.equal(
      owners.size,
      1,
      `Editorial paragraph is shared by ${[...owners].join(", ")}: ${paragraph}`,
    );
  }
}

assertClusterUnique(
  ["PNL-QL-024", "PNL-QL-025", "PNL-QL-026", "PNL-QL-027"],
  (qlId) =>
    runPnlCp001DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed: "pnl-cp001-fraction-prose-regression",
    }) as ReturnType<typeof runPnlCp003DynamicPipeline>,
);

assertClusterUnique(
  ["PNL-QL-071", "PNL-QL-077", "PNL-QL-088", "PNL-QL-093"],
  (qlId) =>
    runPnlCp003DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed: "pnl-cp003-overall-prose-regression",
    }),
);

assertClusterUnique(
  ["PNL-QL-075", "PNL-QL-080", "PNL-QL-081", "PNL-QL-092"],
  (qlId) =>
    runPnlCp003DynamicPipeline({
      questionLanguageId: qlId,
      language: "en",
      seed: "pnl-cp003-inverse-prose-regression",
    }),
);

const expectedSufficiencyAnswers = new Set([
  "Both statements together are required",
  "Statement 1 alone is sufficient",
  "Statement 2 alone is sufficient",
  "Either statement alone is sufficient",
]);
const observedSufficiencyAnswers = new Set<string>();

function hasPurchaseData(statement: string): boolean {
  return /\bbought\b|total purchase cost/i.test(statement);
}

function hasSalesData(statement: string): boolean {
  return /\bsold\b|selling\s+\d+\s+units\s+brought in/i.test(statement);
}

for (let index = 0; index < 96; index += 1) {
  const seed = `pnl-ql092-contract-${index + 1}`;
  const generated = generatePnlCp003Case("PNL-QL-092", seed);
  const pkg = runPnlCp003DynamicPipeline({
    questionLanguageId: "PNL-QL-092",
    language: "en",
    seed,
  });

  const targetRate = String(generated.context.targetRatePercent);
  const targetDirection = String(generated.context.targetDirection);
  assert.match(
    pkg.stem,
    new RegExp(
      `overall ${targetRate.replace(".", "\\.")}% ${targetDirection}`,
      "i",
    ),
    `QL-092 stem target must match generated context for ${seed}.`,
  );
  assert.match(
    pkg.explanation.lines.join("\n\n"),
    /Test Statement I and Statement II separately/,
  );
  assert.doesNotMatch(
    pkg.explanation.lines.join("\n\n"),
    /required price per remaining unit is (?:Statement|Either|Both)/i,
  );

  const statementOne = String(generated.context.statementOne);
  const statementTwo = String(generated.context.statementTwo);
  assert.notEqual(
    statementOne,
    statementTwo,
    `QL-092 statements must not be duplicated for ${seed}.`,
  );
  const oneComplete =
    hasPurchaseData(statementOne) && hasSalesData(statementOne);
  const twoComplete =
    hasPurchaseData(statementTwo) && hasSalesData(statementTwo);
  const onePurchaseOnly =
    hasPurchaseData(statementOne) && !hasSalesData(statementOne);
  const twoSalesOnly =
    !hasPurchaseData(statementTwo) && hasSalesData(statementTwo);
  const oneIrrelevant =
    !hasPurchaseData(statementOne) && !hasSalesData(statementOne);
  const twoIrrelevant =
    !hasPurchaseData(statementTwo) && !hasSalesData(statementTwo);

  observedSufficiencyAnswers.add(pkg.answer);
  switch (pkg.answer) {
    case "Both statements together are required":
      assert.ok(
        onePurchaseOnly && twoSalesOnly,
        `Invalid BOTH pattern for ${seed}.`,
      );
      break;
    case "Statement 1 alone is sufficient":
      assert.ok(
        oneComplete && twoIrrelevant,
        `Invalid ONE pattern for ${seed}.`,
      );
      break;
    case "Statement 2 alone is sufficient":
      assert.ok(
        oneIrrelevant && twoComplete,
        `Invalid TWO pattern for ${seed}.`,
      );
      break;
    case "Either statement alone is sufficient":
      assert.ok(
        oneComplete && twoComplete,
        `Invalid EITHER pattern for ${seed}.`,
      );
      break;
    default:
      assert.fail(`Unexpected QL-092 answer: ${pkg.answer}`);
  }
}

assert.deepEqual(observedSufficiencyAnswers, expectedSufficiencyAnswers);

console.log(
  JSON.stringify(
    {
      status: "PASS_PNL_ENGLISH_PROSE_CLUSTER_REGRESSION",
      diversifiedQlCount: 12,
      ql092Seeds: 96,
      ql092AnswerClasses: [...observedSufficiencyAnswers].sort(),
    },
    null,
    2,
  ),
);
