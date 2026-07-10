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
  };
  const weak: string[] = [];
  const shells = new Map<string, Set<string>>();
  const genericPattern = /apply (?:the )?formula|use the method|calculation\s*=|answer\s*=|generic|fallback|put values|shortcut check/i;

  for (const pkg of packages) {
    const lines = meaningfulLines(pkg.explanation.lines);
    const text = lines.join("\n");
    const minLines = pkg.difficultyBand === "Easy" ? 5 : 7;
    const failures: string[] = [];
    if (lines.length < minLines) { counters.shortExplanationCount += 1; failures.push(`fewer than ${minLines} meaningful steps`); }
    if (genericPattern.test(text)) { counters.genericExplanationCount += 1; failures.push("generic renderer language"); }
    if (!/(concept|problem):/i.test(text)) { counters.missingConceptStatementCount += 1; failures.push("missing concept statement"); }
    if (!/(why|because|method:)/i.test(text)) { counters.missingMethodReasonCount += 1; failures.push("missing method reason"); }
    if (!lines.slice(1, -1).some((line) => /\d|\$\$|\\frac|\\times|equation|unit|ratio|value/i.test(line))) {
      counters.missingIntermediateStepCount += 1; failures.push("missing intermediate value");
    }
    if (!/(final answer|therefore|hence).*(ratio|value|age|time|share|count|quantity|percentage|receives|is)/i.test(text)) {
      counters.missingFinalContextCount += 1; failures.push("missing final context");
    }
    if (lines.every((line) => /^\s*\$\$[\s\S]*\$\$\s*$/.test(line))) {
      counters.formulaOnlyExplanationCount += 1; failures.push("formula-only explanation");
    }
    const stemWords = new Set(normalize(pkg.stem).match(/[a-z]{4,}/g) ?? []);
    const explanationWords = normalize(text).match(/[a-z]{4,}/g) ?? [];
    if (explanationWords.length > 0 && !explanationWords.some((word) => stemWords.has(word)) && !/ratio|value|quantity|age|profit|work|distance|votes|population/i.test(text)) {
      counters.explanationStemMismatchCount += 1; failures.push("explanation/stem mismatch");
    }
    const shell = normalize(text);
    const taskKinds = shells.get(shell) ?? new Set<string>();
    taskKinds.add(pkg.parameters.taskKind);
    shells.set(shell, taskKinds);
    if (failures.length) weak.push(`${pkg.canonicalProblemId}/${pkg.questionLanguageId}: ${failures.join(", ")}`);
  }

  counters.repeatedExplanationShellCount = [...shells.values()].filter((taskKinds) => taskKinds.size > 1).length;
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
    "Automated checks cannot certify naturalness or exam realism. Review the generated English sample before freeze approval.",
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
