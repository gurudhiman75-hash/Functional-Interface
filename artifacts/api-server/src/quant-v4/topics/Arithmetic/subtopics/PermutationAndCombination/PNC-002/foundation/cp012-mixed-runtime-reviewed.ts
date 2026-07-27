import {
  auditCp012Coverage as auditBaseCoverage,
  boundedIdenticalExact,
  derangementExact,
  distinctCapacityExact,
  getCp012Entries,
  gridPathExact,
  runPnc002Cp012Pipeline as runBasePipeline,
  twoColourEveryBoxNonEmptyExact,
  type Cp012Difficulty,
  type Cp012Entry,
  type Cp012QuestionPackage,
} from "./cp012-mixed-runtime";

export type { Cp012Difficulty, Cp012Entry, Cp012QuestionPackage };
export {
  boundedIdenticalExact,
  derangementExact,
  distinctCapacityExact,
  getCp012Entries,
  gridPathExact,
  twoColourEveryBoxNonEmptyExact,
};

function reviewedTexContract(value: string): boolean {
  return !/[\u0000-\u001F\u007F]/.test(value)
    && !/(^|[^\\])(binom|frac|sum|cap|quad|left|right)_?/.test(value)
    && (/\\[A-Za-z]+|D_|!/.test(value));
}

export function runPnc002Cp012Pipeline(input: {
  questionLanguageId?: string;
  difficulty?: Cp012Difficulty;
  seed?: string;
  language?: "en" | "hi" | "pa";
} = {}): Cp012QuestionPackage {
  const generated = runBasePipeline(input);
  const checks = generated.validation.checks.map((item) => item.name === "tex-command"
    ? {
      ...item,
      name: "reviewed-tex-command",
      passed: reviewedTexContract(generated.solver.mathJax),
      message: "MathJax must retain explicit backslashed commands without collapsed escapes",
    }
    : item);
  checks.push({
    name: "reviewed-visible-control-characters",
    passed: [generated.stem, ...generated.options, ...generated.explanation.lines, generated.solver.mathJax]
      .every((value) => !/[\u0000-\u001F\u007F]/.test(value)),
    message: "Learner-visible content must contain no control characters",
  });
  return {
    ...generated,
    validation: { valid: checks.every((item) => item.passed), checks },
    traceability: {
      ...generated.traceability,
      texEscapeReview: "GENERAL_BACKSLASH_COMMAND_CONTRACT_ENFORCED",
    },
  };
}

export function auditCp012Coverage(): ReturnType<typeof auditBaseCoverage> {
  const base = auditBaseCoverage();
  const invalidSamples = [...base.invalidSamples];
  for (const entry of getCp012Entries()) {
    try {
      const sample = runPnc002Cp012Pipeline({ questionLanguageId: entry.qlId, seed: `cp012-reviewed-audit:${entry.qlId}` });
      if (!sample.validation.valid) invalidSamples.push(`${entry.qlId}:${sample.validation.checks.filter((item) => !item.passed).map((item) => item.name).join(",")}`);
    } catch (error) {
      invalidSamples.push(`${entry.qlId}:${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { ...base, passed: base.passed && invalidSamples.length === 0, invalidSamples };
}
