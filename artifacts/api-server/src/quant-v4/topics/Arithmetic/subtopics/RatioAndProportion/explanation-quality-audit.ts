import { strict as assert } from "node:assert";
import fs from "node:fs";

export interface ExplanationAuditPackage {
  canonicalProblemId: string;
  questionLanguageId: string;
  difficultyBand: "Easy" | "Medium" | "Hard";
  stem: string;
  answer: string;
  parameters: { taskKind: string };
  explanation: { lines: string[] };
}

export interface ExplanationAuditConfig {
  packageId: string;
  cpIds: readonly string[];
  qlIds(cpId: string): string[];
  generate(cpId: string, qlId: string, seed: string): ExplanationAuditPackage;
  reportPath: string;
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function meaningfulLines(lines: string[]) {
  return lines.filter((line) => normalize(line).replace(/[$\\{}]/g, "").length >= 4);
}

function markdownCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

export function runExplanationQualityAudit(config: ExplanationAuditConfig) {
  const packages: ExplanationAuditPackage[] = [];
  for (const cpId of config.cpIds) {
    for (const qlId of config.qlIds(cpId)) {
      packages.push(config.generate(cpId, qlId, `${config.packageId.toLowerCase()}-explanation-audit:${qlId}`));
    }
  }

  const counters = {
    questionCount: packages.length,
    shortExplanationCount: 0,
    genericExplanationCount: 0,
    missingConceptStatementCount: 0,
    missingMethodReasonCount: 0,
    missingIntermediateStepCount: 0,
    missingFinalContextCount: 0,
    formulaOnlyExplanationCount: 0,
    repeatedExplanationShellCount: 0,
    explanationStemMismatchCount: 0,
    missingNumericSubstitutionCount: 0,
    missingIntermediateValueCount: 0,
    missingDecisiveCalculationCount: 0,
    missingRequestedQuantityCalculationCount: 0,
    genericExplanationShellCount: 0,
  };
  const weak: string[] = [];
  const shells = new Map<string, Set<string>>();
  const genericPattern = /apply (?:the )?formula|use the method|generic|fallback|put values|shortcut check|this question uses/i;
  const artificialHeadingPattern = /(?:^|\n)(?:concept|problem|why this method works|intermediate interpretation|method(?:\s+\d+)?|extraction|step\s+\d+|quick check|final answer)\s*:/im;

  for (const pkg of packages) {
    const lines = meaningfulLines(pkg.explanation.lines);
    const text = lines.join("\n");
    const failures: string[] = [];

    if (lines.length < 3) {
      counters.shortExplanationCount += 1;
      failures.push("fewer than 3 meaningful lines");
    }
    if (genericPattern.test(text) || artificialHeadingPattern.test(text)) {
      counters.genericExplanationCount += 1;
      failures.push("robotic or audit-style explanation language");
    }
    if (!lines.some((line) => /[a-z]{3,}/i.test(line.replace(/\$\$[\s\S]*?\$\$/g, "")))) {
      counters.missingConceptStatementCount += 1;
      failures.push("missing concise prose guidance");
    }
    if (!lines.some((line) => /(?:=|\\times|\\div|\\frac|ratio|total|share|unit|difference|product)/i.test(line))) {
      counters.missingMethodReasonCount += 1;
      failures.push("missing visible method or relation");
    }
    if (!lines.slice(0, -1).some((line) => /\d|\$\$|\\frac|\\times|equation|unit|ratio|value/i.test(line))) {
      counters.missingIntermediateStepCount += 1;
      failures.push("missing intermediate value");
    }

    const numericLines = lines.filter((line) => /\d/.test(line));
    if (numericLines.length < 1) {
      counters.missingNumericSubstitutionCount += 1;
      failures.push("missing numeric substitution");
    }
    if (!lines.slice(0, -1).some((line) => /(?:=|\\times|\\div|\\frac|\btotal\b)/i.test(line))) {
      counters.missingDecisiveCalculationCount += 1;
      failures.push("missing decisive calculation");
    }
    if (!lines.slice(0, -1).some((line) => /\d|\btotal\b|\bshare\b|\bresult\b|\bunit\b/i.test(line))) {
      counters.missingIntermediateValueCount += 1;
      failures.push("missing intermediate value evidence");
    }

    const answerValue = normalize(pkg.answer).replace(/[\s$\\{}]/g, "");
    const explanationValueText = normalize(text).replace(/[\s$\\{}]/g, "");
    if (answerValue && !explanationValueText.includes(answerValue)) {
      counters.missingRequestedQuantityCalculationCount += 1;
      failures.push("final calculation does not state requested value");
    }
    if (!/(?:so|therefore|hence),?.*(?:answer|ratio|value|age|time|share|count|quantity|percentage|receives|is|are|was|were|savings|income|profit|total|fund|number|coins?|litres?|volume|amount|votes?|years?|seconds?|metres?|meters?|kilometres?|kilometers?|should be added)/i.test(text)) {
      counters.missingFinalContextCount += 1;
      failures.push("missing natural final context");
    }
    if (lines.every((line) => /^\s*\$\$[\s\S]*\$\$\s*$/.test(line))) {
      counters.formulaOnlyExplanationCount += 1;
      failures.push("formula-only explanation");
    }

    const stemWords = new Set(normalize(pkg.stem).match(/[a-z]{4,}/g) ?? []);
    const explanationWords = normalize(text).match(/[a-z]{4,}/g) ?? [];
    if (
      explanationWords.length > 0
      && !explanationWords.some((word) => stemWords.has(word))
      && !/ratio|value|quantity|age|profit|work|distance|votes|population/i.test(text)
    ) {
      counters.explanationStemMismatchCount += 1;
      failures.push("explanation/stem mismatch");
    }

    const shell = normalize(text);
    const taskKinds = shells.get(shell) ?? new Set<string>();
    taskKinds.add(pkg.parameters.taskKind);
    shells.set(shell, taskKinds);

    if (failures.length) weak.push(`${pkg.canonicalProblemId}/${pkg.questionLanguageId}: ${failures.join(", ")}`);
  }

  counters.repeatedExplanationShellCount = [...shells.values()].filter((taskKinds) => taskKinds.size > 1).length;
  counters.genericExplanationShellCount = counters.repeatedExplanationShellCount;
  const reviewedCommit = process.env.RAP_REVIEWED_COMMIT ?? "8450deef2e06cc9e031b6d3221b7e54d226199b1";
  const reviewedDate = new Date().toISOString().slice(0, 10);
  const report = [
    `# ${config.packageId} Explanation Quality Report`,
    "",
    `Reviewed commit: \`${reviewedCommit}\``,
    `Reviewed date: \`${reviewedDate}\``,
    "",
    "## Counters",
    "",
    ...Object.entries(counters).map(([key, value]) => `- ${key}: \`${value}\``),
    "",
    "## Runtime Samples",
    "",
    "| CP | QL | Difficulty | Stem | Explanation |",
    "|---|---|---|---|---|",
    ...config.cpIds.flatMap((cpId) => packages.filter((pkg) => pkg.canonicalProblemId === cpId).slice(0, 2)
      .map((pkg) => `| ${cpId} | ${pkg.questionLanguageId} | ${pkg.difficultyBand} | ${markdownCell(pkg.stem)} | ${markdownCell(pkg.explanation.lines.join("<br>"))} |`)),
    "",
    "## Remaining Weak Explanations",
    "",
    ...(weak.length ? weak.map((item) => `- ${item}`) : ["- None detected by the automated audit."]),
    "",
    "## Manual Review Recommendation",
    "",
    "Automated checks verify concise structure and arithmetic visibility, but a human reviewer must still judge whether each explanation sounds natural.",
    "",
  ].join("\n");
  fs.writeFileSync(config.reportPath, report, "utf8");

  for (const [key, value] of Object.entries(counters)) {
    if (key !== "questionCount") assert.equal(value, 0, `${config.packageId} ${key} must be zero.`);
  }
  console.log(JSON.stringify(counters, null, 2));
  console.log(`${config.packageId} explanation-quality audit passed.`);
  return counters;
}
