import {
  auditCp011DistributionWave1Coverage as auditBaseCoverage,
  getCp011DistributionWave1Entries,
  runPnc002Cp011DistributionWave1Pipeline as runBasePipeline,
  type Cp011DistributionWave1CoverageAudit,
  type Cp011DistributionWave1Difficulty,
  type Cp011DistributionWave1Entry,
  type Cp011DistributionWave1QuestionPackage,
} from "./cp011-distribution-wave1-runtime";

export type {
  Cp011DistributionWave1CoverageAudit,
  Cp011DistributionWave1Difficulty,
  Cp011DistributionWave1Entry,
  Cp011DistributionWave1QuestionPackage,
};
export { getCp011DistributionWave1Entries };

function normalizeMathJax(value: string): string {
  return value
    .replace(/\u0008inom/g, String.raw`\binom`)
    .replace(/\u000crac/g, String.raw`\frac`)
    .replace(/sum_/g, String.raw`\sum_`)
    .replace(/!,/g, String.raw`!\,`);
}

function commandContract(questionLanguageId: string, mathJax: string): boolean {
  const requiresBinomial = new Set(["PNC-QL-221", "PNC-QL-224", "PNC-QL-225"]);
  const requiresFraction = questionLanguageId === "PNC-QL-223";
  const requiresSum = new Set(["PNC-QL-227", "PNC-QL-228"]);
  const requiresStirlingSpacing = new Set(["PNC-QL-220", "PNC-QL-221", "PNC-QL-222", "PNC-QL-225"]);
  return (!requiresBinomial.has(questionLanguageId) || mathJax.includes(String.raw`\binom`))
    && (!requiresFraction || mathJax.includes(String.raw`\frac`))
    && (!requiresSum.has(questionLanguageId) || mathJax.includes(String.raw`\sum`))
    && (!requiresStirlingSpacing.has(questionLanguageId) || mathJax.includes(String.raw`\,S`));
}

export function runPnc002Cp011DistributionWave1Pipeline(input: {
  questionLanguageId?: string;
  difficulty?: Cp011DistributionWave1Difficulty;
  seed?: string;
  language?: "en" | "hi" | "pa";
} = {}): Cp011DistributionWave1QuestionPackage {
  const generated = runBasePipeline(input);
  const originalMathJax = generated.solver.mathJax;
  const mathJax = normalizeMathJax(originalMathJax);
  const explanation = {
    ...generated.explanation,
    lines: generated.explanation.lines.map((line) => line.replace(originalMathJax, mathJax)),
  };
  const visible = [generated.stem, ...generated.options, ...explanation.lines, mathJax];
  const noControlCharacters = visible.every((value) => !/[\u0000-\u001F\u007F]/.test(value));
  const noCollapsedCommands = !/(^|[^\\])sum_/.test(mathJax) && !/!,/.test(mathJax);
  const commandsPresent = commandContract(generated.questionLanguageId, mathJax);
  const addedChecks = [
    {
      name: "reviewed-tex-no-control-characters",
      passed: noControlCharacters,
      message: "Reviewed TeX and learner-visible text must contain no control characters",
    },
    {
      name: "reviewed-tex-no-collapsed-commands",
      passed: noCollapsedCommands,
      message: "TeX commands and spacing must retain their leading backslashes",
    },
    {
      name: "reviewed-tex-command-contract",
      passed: commandsPresent,
      message: "Each formula must expose the TeX command required by its solve contract",
    },
  ];
  const checks = [...generated.validation.checks, ...addedChecks];
  return {
    ...generated,
    solver: { ...generated.solver, mathJax },
    explanation,
    validation: { valid: checks.every((item) => item.passed), checks },
    traceability: {
      ...generated.traceability,
      texEscapeReview: "CONTROL_CHARACTER_AND_COMMAND_CONTRACT_ENFORCED",
    },
  };
}

export function auditCp011DistributionWave1Coverage(): Cp011DistributionWave1CoverageAudit {
  const base = auditBaseCoverage();
  const invalidRuntimeSamples = [...base.invalidRuntimeSamples];
  for (const entry of getCp011DistributionWave1Entries()) {
    try {
      const sample = runPnc002Cp011DistributionWave1Pipeline({
        questionLanguageId: entry.qlId,
        seed: `cp011-distribution-wave1-reviewed-audit:${entry.qlId}`,
      });
      if (!sample.validation.valid) {
        invalidRuntimeSamples.push(`${entry.qlId}: ${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
      }
    } catch (error) {
      invalidRuntimeSamples.push(`${entry.qlId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return {
    ...base,
    passed: base.passed && invalidRuntimeSamples.length === 0,
    invalidRuntimeSamples,
  };
}
