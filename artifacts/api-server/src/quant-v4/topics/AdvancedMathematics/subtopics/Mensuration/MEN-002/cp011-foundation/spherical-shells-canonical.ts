import {
  MEN_CP011_SHELL_PROTOTYPES,
  MEN_CP011_SPHERICAL_SHELLS_AUTHORITY,
  auditMenCp011ShellBatch,
  generateMenCp011ShellQuestion as generateDraftShellQuestion,
  generateMenCp011ShellReviewBatch as generateDraftShellReviewBatch,
  getMenCp011ShellDefinition,
  getMenCp011ShellPrototypeIds,
  type MenCp011ShellGenerationConstraints,
  type MenCp011ShellPackage,
  type MenCp011ShellPrototypeId,
} from "./spherical-shells.ts";

export const MEN_CP011_SPHERICAL_SHELLS_PRESENTATION_AUTHORITY =
  "MEN-CP011-SPHERICAL-SHELLS-MATHJAX-REPAIR-V1" as const;

export {
  MEN_CP011_SHELL_PROTOTYPES,
  MEN_CP011_SPHERICAL_SHELLS_AUTHORITY,
  auditMenCp011ShellBatch,
  getMenCp011ShellDefinition,
  getMenCp011ShellPrototypeIds,
};

export type {
  MenCp011ShellDefinition,
  MenCp011ShellDiagram,
  MenCp011ShellGenerationConstraints,
  MenCp011ShellLearnerSolution,
  MenCp011ShellLinearUnit,
  MenCp011ShellOption,
  MenCp011ShellPackage,
  MenCp011ShellPiPolicy,
  MenCp011ShellPrototypeId,
  MenCp011ShellSolveMode,
  MenCp011ShellState,
  MenCp011ShellVolumeUnit,
} from "./spherical-shells.ts";

function repairedShortcut(question: MenCp011ShellPackage) {
  const factor = question.state.shape === "HEMISPHERE"
    ? "\\frac{2}{3}"
    : "\\frac{4}{3}";
  return `Use $R^3-r^3=(R-r)(R^2+Rr+r^2)$. Here $R-r=${question.state.thickness}\\text{ ${question.state.unit}}$, so factor the cube difference before multiplying by $${factor}\\pi$.`;
}

function learnerText(question: MenCp011ShellPackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
}

function repairQuestion(
  draft: MenCp011ShellPackage,
): MenCp011ShellPackage {
  const shortcut = repairedShortcut(draft);
  const learnerSolution = {
    ...draft.learnerSolution,
    shortcut,
  };
  const explanation = {
    ...draft.explanation,
    shortcut,
  };
  const repairedBase: MenCp011ShellPackage = {
    ...draft,
    learnerSolution,
    explanation,
    renderSurfaces: {
      ...draft.renderSurfaces,
      solution: {
        ...draft.renderSurfaces.solution,
        explanation: learnerSolution,
      },
    },
  };
  const text = learnerText(repairedBase);
  const delimiterCheck = {
    name: "balanced learner MathJax delimiters",
    passed: (text.match(/\$/g) ?? []).length % 2 === 0,
    message:
      "Every learner-facing MathJax dollar delimiter must have a matching partner.",
  };
  const malformedPiCheck = {
    name: "separated pi multiplication",
    passed: !text.includes("\\pih"),
    message:
      "The malformed TeX command \\pih is forbidden; pi multiplication must remain separated.",
  };
  const checks = [
    ...draft.validation.checks.filter(
      (check) =>
        check.name !== delimiterCheck.name &&
        check.name !== malformedPiCheck.name,
    ),
    delimiterCheck,
    malformedPiCheck,
  ];
  return {
    ...repairedBase,
    validation: {
      valid: checks.every((check) => check.passed),
      checks,
    },
  };
}

export function generateMenCp011ShellQuestion(
  prototypeId: MenCp011ShellPrototypeId,
  seed: string,
  constraints: MenCp011ShellGenerationConstraints = {},
): MenCp011ShellPackage {
  return repairQuestion(
    generateDraftShellQuestion(prototypeId, seed, constraints),
  );
}

export function generateMenCp011ShellReviewBatch() {
  const draft = generateDraftShellReviewBatch();
  return {
    ...draft,
    records: draft.records.map(repairQuestion),
  };
}
