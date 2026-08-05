import { formatWithUnit } from "../foundation/exact";
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

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function choose<T>(items: readonly T[], key: string) {
  return items[hashText(key) % items.length]!;
}

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function piPolicySentence(question: MenCp011ExamReadyPackage) {
  return question.piPolicy === "EXACT_PI"
    ? "Leave $\\pi$ in exact form."
    : "Use $\\pi=\\frac{22}{7}$.";
}

function diversifiedStem(question: MenCp011ExamReadyPackage) {
  const state = question.state;
  const R = dimension(state.outerRadius);
  const r = dimension(state.innerRadius);
  const h = dimension(state.height);
  const D = dimension(state.outerDiameter);
  const d = dimension(state.innerDiameter);
  const t = dimension(state.thickness);
  const V = formatWithUnit(state.materialVolume, "cm³");
  const policy = piPolicySentence(question);

  const variants: Record<MenCp011PrototypeId, readonly string[]> = {
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME": [
      `A hollow metallic pipe has outer radius ${R}, inner radius ${r}, and length ${h}. Find the volume of metal used. ${policy}`,
      `A cylindrical tube is ${h} long. Its external and internal radii are ${R} and ${r}. Determine the volume of material in the tube. ${policy}`,
      `The outside radius of a pipe is ${R}, the bore radius is ${r}, and the pipe is ${h} long. Calculate its metal volume. ${policy}`,
      `A central cylindrical hole of radius ${r} is drilled through a cylinder of radius ${R} and height ${h}. Find the remaining volume. ${policy}`,
      `A hollow machine sleeve has outer radius ${R}, inner radius ${r}, and axial length ${h}. What is the volume of the sleeve material? ${policy}`,
      `The cross-section of a ${h}-long tube is an annulus with outer radius ${R} and inner radius ${r}. Find the material volume. ${policy}`,
      `A metal bush of length ${h} has outside radius ${R} and inside radius ${r}. Determine the volume of metal in it. ${policy}`,
      `A pipe section has radii ${R} externally and ${r} internally. If its length is ${h}, find the volume occupied by the pipe wall. ${policy}`,
      `A hollow cylindrical component has height ${h}, outer radius ${R}, and inner radius ${r}. Calculate the volume of solid material. ${policy}`,
      `The outer and inner radii of a uniform tube are ${R} and ${r}; its length is ${h}. Find outer-cylinder volume minus bore volume. ${policy}`,
      `A metal cylinder of radius ${R} and height ${h} contains a coaxial hollow of radius ${r}. Find the metal left in the cylinder. ${policy}`,
      `A uniform pipe is ${h} long with outer radius ${R} and inner radius ${r}. What volume of metal forms the pipe? ${policy}`,
    ],
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS": [
      `A hollow pipe has outer diameter ${D}, inner diameter ${d}, and length ${h}. Find the volume of metal used. ${policy}`,
      `The external and internal diameters of a cylindrical tube are ${D} and ${d}. If its length is ${h}, determine its material volume. ${policy}`,
      `A tube of length ${h} measures ${D} across the outside and ${d} across the bore. What volume of metal does it contain? ${policy}`,
      `Find the metal volume of a hollow cylinder whose outer diameter is ${D}, inner diameter is ${d}, and height is ${h}. ${policy}`,
      `A machine sleeve has outside diameter ${D}, inside diameter ${d}, and length ${h}. Calculate the volume of its material. ${policy}`,
      `A pipe section is ${h} long. Its external diameter is ${D} and its bore diameter is ${d}. Find the pipe-wall volume. ${policy}`,
      `The circular outer and inner diameters of a hollow bush are ${D} and ${d}. For length ${h}, determine the metal volume. ${policy}`,
      `A hollow cylindrical component has height ${h}, outside diameter ${D}, and inside diameter ${d}. Find its solid-material volume. ${policy}`,
      `A metal tube has outer diameter ${D} and inner diameter ${d}. If its axial length is ${h}, calculate the volume remaining after the bore is removed. ${policy}`,
      `The outside and inside measurements across a pipe are ${D} and ${d}. The pipe is ${h} long. Find its material volume. ${policy}`,
      `A cylinder of outer diameter ${D} and length ${h} has a coaxial hole of diameter ${d}. Determine the volume of metal left. ${policy}`,
      `A uniform hollow pipe is ${h} in length, with external diameter ${D} and internal diameter ${d}. What is the volume of metal used? ${policy}`,
    ],
    "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS": [
      `A pipe has outer radius ${R}, uniform wall thickness ${t}, and length ${h}. Find the volume of metal used. ${policy}`,
      `The outside radius of a cylindrical tube is ${R}. Its wall is ${t} thick and its length is ${h}. Determine the material volume. ${policy}`,
      `A hollow cylinder is ${h} long, has outer radius ${R}, and has radial thickness ${t}. What is the volume of its metal wall? ${policy}`,
      `A pipe of length ${h} has outer radius ${R} and wall thickness ${t}. Calculate the metal remaining after the bore is formed. ${policy}`,
      `A machine sleeve has outside radius ${R}, thickness ${t}, and axial length ${h}. Find the volume of sleeve material. ${policy}`,
      `A uniform tube is ${h} long. Its external radius is ${R} and its wall thickness is ${t}. Determine the metal volume. ${policy}`,
      `The outer radius and radial thickness of a pipe are ${R} and ${t}. If its length is ${h}, find the volume occupied by the wall. ${policy}`,
      `A hollow bush has outer radius ${R}, wall thickness ${t}, and height ${h}. Calculate its solid-material volume. ${policy}`,
      `A cylindrical pipe section of length ${h} has outside radius ${R} and uniform thickness ${t}. Find its material volume. ${policy}`,
      `A metal tube has radius ${R} measured to the outside and thickness ${t}. For length ${h}, determine the volume of metal. ${policy}`,
      `The outside radius of a hollow component is ${R}; its wall is ${t} thick and its height is ${h}. Find the remaining material volume. ${policy}`,
      `A uniform pipe of length ${h} has outer radius ${R} and radial wall thickness ${t}. What volume of metal is used? ${policy}`,
    ],
    "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": [
      `A hollow pipe has outer radius ${R}, length ${h}, and metal volume ${V}. Find its inner radius. ${policy}`,
      `The outer radius and length of a cylindrical tube are ${R} and ${h}. If it contains ${V} of metal, determine the bore radius. ${policy}`,
      `A pipe uses ${V} of metal. Its outside radius is ${R} and its length is ${h}. What is the inner radius? ${policy}`,
      `The material volume of a hollow cylinder is ${V}; its outer radius is ${R} and height is ${h}. Find the radius of the central void. ${policy}`,
      `A machine sleeve of length ${h} has outer radius ${R} and material volume ${V}. Determine its internal radius. ${policy}`,
      `A uniform tube has external radius ${R}, axial length ${h}, and metal volume ${V}. Calculate the radius of its bore. ${policy}`,
      `The wall material of a pipe occupies ${V}. If the pipe is ${h} long with outer radius ${R}, find the inner radius. ${policy}`,
      `A hollow bush has height ${h}, outside radius ${R}, and solid-material volume ${V}. Determine the inside radius. ${policy}`,
      `A cylindrical pipe section has outer radius ${R}, length ${h}, and metal volume ${V}. Find the radius of the hollow passage. ${policy}`,
      `A tube of length ${h} and outer radius ${R} is made from ${V} of metal. Calculate its inner radius. ${policy}`,
      `A cylinder of radius ${R} and height ${h} is bored so that ${V} of material remains. Find the bore radius. ${policy}`,
      `The outside radius of a hollow component is ${R}. Its height is ${h} and material volume is ${V}. What is its inner radius? ${policy}`,
    ],
  };

  return choose(
    variants[question.prototypeId],
    `MEN-CP011-STEM-V2|${question.prototypeId}|${question.seed}`,
  );
}

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

function stemPolicyIsValid(question: MenCp011ExamReadyPackage) {
  return question.piPolicy === "EXACT_PI"
    ? question.stem.includes("exact form") && !question.stem.includes("22}{7")
    : question.stem.includes("22}{7");
}

function stemPromptIntegrityIsValid(question: MenCp011ExamReadyPackage) {
  if (
    question.state.representation !== "OUTER_RADIUS_AND_THICKNESS" &&
    question.state.representation !== "INVERSE_INNER_RADIUS"
  ) {
    return true;
  }
  return !question.stem.includes(`r = ${question.state.innerRadius}`) &&
    !question.stem.includes(`inner radius $${question.state.innerRadius}`);
}

function revalidateVisibleText(
  question: MenCp011ExamReadyPackage,
): MenCp011ExamReadyPackage["validation"] {
  const texValid = visibleTexIsValid(question);
  const checks = question.validation.checks.map((check) => {
    if (check.name === "tex lint") {
      return {
        ...check,
        passed: texValid,
        message: "Visible TeX must use supported MathJax commands, including valid arithmetic and spacing commands such as \\div, \\quad and \\qquad, while rejecting \\pih, unknown commands and unbalanced delimiters.",
      };
    }
    if (check.name === "declared pi policy") {
      return {
        ...check,
        passed: stemPolicyIsValid(question),
        message: "The diversified exam-style stem and exact arithmetic must use the same declared pi policy.",
      };
    }
    return check;
  });
  checks.push({
    name: "diversified stem prompt integrity",
    passed: stemPromptIntegrityIsValid(question),
    message: "Diversified exam-style stems must not reveal an inner radius that the student is expected to derive.",
  });
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
    stem: diversifiedStem(generated),
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
    validation: revalidateVisibleText(withCompatibility),
  };
}

export { classifyMenCp011Difficulty };
export type {
  MenCp011DiagramRole,
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
  MenCp011RenderSurfaces,
} from "./runtime-exam-readiness";
