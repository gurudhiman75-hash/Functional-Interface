import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateExamReadyMenCp011FoundationPrototype,
} from "./runtime-exam-readiness";
import type {
  MenCp011ExamReadyPackage,
} from "./runtime-exam-readiness";
import type {
  MenCp011Diagram,
  MenCp011PrototypeId,
} from "./types";

const SUPPORTED_VISIBLE_TEX_COMMANDS = new Set([
  "pi",
  "frac",
  "text",
  "times",
  "div",
  "quad",
  "qquad",
  "sqrt",
  "cdot",
  "left",
  "right",
]);

function preserveEmptyVoidCompatibility(diagram: MenCp011Diagram): MenCp011Diagram {
  if (diagram.svg.includes("empty void")) return diagram;
  return {
    ...diagram,
    svg: diagram.svg.replace(
      "</desc>",
      " The central empty void continues through the full tube height.</desc>",
    ),
  };
}

function visibleTexText(question: MenCp011ExamReadyPackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [
      step.title,
      step.body,
      step.equation ?? "",
    ]),
    question.explanation.shortcut,
    ...question.explanation.traps,
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
}

function visibleTexIsValid(question: MenCp011ExamReadyPackage) {
  const text = visibleTexText(question);
  if (text.includes("\\pih")) return false;
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) return false;
  const commands = [...text.matchAll(/\\([A-Za-z]+)/g)].map((match) => match[1]!);
  return commands.every((command) => SUPPORTED_VISIBLE_TEX_COMMANDS.has(command));
}

function revalidateVisibleTex(
  question: MenCp011ExamReadyPackage,
): MenCp011ExamReadyPackage["validation"] {
  const texValid = visibleTexIsValid(question);
  const checks = question.validation.checks.map((check) =>
    check.name === "tex lint"
      ? {
          ...check,
          passed: texValid,
          message: "Visible TeX must use supported MathJax commands, including valid arithmetic and spacing commands such as \\div, \\quad and \\qquad, while rejecting \\pih, unknown commands and unbalanced delimiters.",
        }
      : check,
  );
  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011ExamReadyPackage {
  const generated = generateExamReadyMenCp011FoundationPrototype(prototypeId, seed);
  const diagram = preserveEmptyVoidCompatibility(generated.diagram);
  const solutionDiagram = preserveEmptyVoidCompatibility(generated.solutionDiagram);
  const withCompatibility: MenCp011ExamReadyPackage = {
    ...generated,
    diagram,
    solutionDiagram,
    renderSurfaces: {
      ...generated.renderSurfaces,
      practice: {
        ...generated.renderSurfaces.practice,
        diagram,
      },
      solution: {
        ...generated.renderSurfaces.solution,
        diagram: solutionDiagram,
      },
      admin: {
        ...generated.renderSurfaces.admin,
        diagram: solutionDiagram,
      },
    },
  };
  return {
    ...withCompatibility,
    validation: revalidateVisibleTex(withCompatibility),
  };
}

export { classifyMenCp011Difficulty };
export type {
  MenCp011DiagramRole,
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
  MenCp011RenderSurfaces,
} from "./runtime-exam-readiness";
