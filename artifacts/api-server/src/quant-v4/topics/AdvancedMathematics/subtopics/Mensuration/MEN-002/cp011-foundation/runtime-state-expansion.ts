import {
  exactEquals,
  exactKey,
  formatExactMath,
  formatWithUnit,
  pi,
  rational,
} from "../foundation/exact";
import type { ExactValue } from "../foundation/types";
import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateExamStemMenCp011FoundationPrototype,
} from "./runtime-exam-stems";
import type {
  MenCp011ExamReadyPackage,
  MenCp011LearnerSolution,
} from "./runtime-exam-readiness";
import {
  expandMenCp011State,
  isMenCp011CatalogState,
  MEN_CP011_STATE_POOL_AUTHORITY,
  type MenCp011ScaleProfile,
} from "./state-pool";
import type {
  MenCp011Diagram,
  MenCp011Explanation,
  MenCp011Option,
  MenCp011PrototypeId,
  MenCp011State,
} from "./types";

export interface MenCp011StateExpandedPackage extends MenCp011ExamReadyPackage {
  statePoolAuthority: typeof MEN_CP011_STATE_POOL_AUTHORITY;
  stateScaleProfile: MenCp011ScaleProfile;
}

const ALLOWED_VISIBLE_TEX_COMMANDS = new Set([
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

function scaleExact(value: ExactValue, factor: bigint): ExactValue {
  switch (value.kind) {
    case "RATIONAL":
      return rational(value.numerator * factor, value.denominator);
    case "PI":
      return pi(
        value.coefficient.numerator * factor,
        value.coefficient.denominator,
      );
    case "SURD":
      return {
        ...value,
        coefficient: rational(
          value.coefficient.numerator * factor,
          value.coefficient.denominator,
        ),
      };
    case "PI_SURD":
      return {
        ...value,
        coefficient: rational(
          value.coefficient.numerator * factor,
          value.coefficient.denominator,
        ),
      };
  }
}

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function piPolicySentence(question: MenCp011ExamReadyPackage) {
  return question.piPolicy === "EXACT_PI"
    ? "Leave $\\pi$ in exact form."
    : "Use $\\pi=\\frac{22}{7}$.";
}

function piMath(state: MenCp011State) {
  return state.piPolicy === "EXACT_PI" ? "\\pi" : "\\frac{22}{7}";
}

function resultMath(state: MenCp011State, value: ExactValue) {
  const unit = state.target === "VOLUME" ? "\\text{ cm}^{3}" : "\\text{ cm}";
  return `${formatExactMath(value)}${unit}`;
}

function expandedStem(
  question: MenCp011ExamReadyPackage,
  state: MenCp011State,
) {
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
    `${MEN_CP011_STATE_POOL_AUTHORITY}|STEM|${question.prototypeId}|${question.seed}`,
  );
}

function trapBodyByCode(traps: readonly string[]) {
  const output = new Map<string, string>();
  for (const trap of traps) {
    const match = trap.match(/^Option [A-D] \((.+)\): (.+) \[([A-Z0-9_]+)\]$/);
    if (match) output.set(match[3]!, match[2]!);
  }
  return output;
}

function rebuildOptions(
  generated: MenCp011ExamReadyPackage,
  answerScale: bigint,
) {
  const options: MenCp011Option[] = generated.options.map((option) => {
    const value = scaleExact(option.value, answerScale);
    return {
      ...option,
      value,
      display: formatWithUnit(value, generated.unit),
    };
  });
  return {
    options,
    correctIndex: generated.correctIndex,
    exactAnswer: scaleExact(generated.exactAnswer, answerScale),
    answer: options[generated.correctIndex]!.display,
  };
}

function rebuildTraps(
  options: readonly MenCp011Option[],
  sourceTraps: readonly string[],
) {
  const bodies = trapBodyByCode(sourceTraps);
  return options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const code = option.misconceptionId;
      if (!code) throw new Error("Expanded MEN-CP-011 wrong option lost its misconception code.");
      const body = bodies.get(code);
      if (!body) throw new Error(`Expanded MEN-CP-011 trap body missing for ${code}.`);
      return `Option ${option.label} (${option.display}): ${body} [${code}]`;
    });
}

function explanationFor(
  state: MenCp011State,
  traps: string[],
): MenCp011Explanation {
  const R = state.outerRadius;
  const r = state.innerRadius;
  const h = state.height;
  const t = state.thickness;
  const D = state.outerDiameter;
  const d = state.innerDiameter;
  const piFactor = piMath(state);
  const volume = resultMath(state, state.materialVolume);
  const keyRule = "Think of a thick solid rod with a smaller cylinder drilled straight through the centre. The metal remaining equals outer cylinder volume minus inner empty-cylinder volume: $V=\\pi R^2h-\\pi r^2h=\\pi h(R^2-r^2)$. Here, $R$ is outer radius, $r$ is inner radius, $h$ is pipe length, and $t=R-r$ is radial wall thickness.";

  switch (state.prototypeId) {
    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME":
      return {
        keyRule,
        steps: [
          {
            title: "Find the Metal Ring Cross-section",
            body: "Subtract the inner circular area coefficient from the outer one. Unit check: $R^2-r^2$ is a cross-sectional area in $\\text{cm}^2$.",
            equation: `$$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Extend the Ring through the Pipe Length",
            body: "Multiply the ring area by length and the declared value of $\\pi$. Unit check: $\\text{cm}^2\\times\\text{cm}=\\text{cm}^3$.",
            equation: `$$V=${piFactor}\\times${h}\\times${state.ringCoefficient}=${volume}$$`,
          },
        ],
        shortcut: `⚡ Exam speed: $R^2-r^2=(R-r)(R+r)=(${R}-${r})(${R}+${r})=${t}\\times${R + r}=${state.ringCoefficient}$ before multiplying by $${piFactor}h$.`,
        traps,
      };

    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS":
      return {
        keyRule,
        steps: [
          {
            title: "Convert Diameters to Radii",
            body: "Halve each diameter before using a cylinder formula. Unit check: diameter and radius are both lengths in $\\text{cm}$.",
            equation: `$$R=\\frac{${D}}{2}=${R}\\text{ cm},\\qquad r=\\frac{${d}}{2}=${r}\\text{ cm}$$`,
          },
          {
            title: "Find the Ring Cross-section",
            body: "Subtract the squared radii. Unit check: the difference is an area in $\\text{cm}^2$.",
            equation: `$$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Find the Material Volume",
            body: "Multiply the annular cross-section by length and the declared value of $\\pi$. Unit check: area times length gives $\\text{cm}^3$.",
            equation: `$$V=${piFactor}\\times${h}\\times${state.ringCoefficient}=${volume}$$`,
          },
        ],
        shortcut: "⚡ Exam speed: use $R^2-r^2=\\frac{D^2-d^2}{4}$ after checking that both stated measurements are diameters.",
        traps,
      };

    case "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS":
      return {
        keyRule,
        steps: [
          {
            title: "Recover the Inner Radius",
            body: "Radial thickness is removed once from the outer radius. Unit check: $R$ and $t$ are lengths in $\\text{cm}$.",
            equation: `$$r=R-t=${R}-${t}=${r}\\text{ cm}$$`,
          },
          {
            title: "Find the Ring Cross-section",
            body: "Use the outer and recovered inner radii. Unit check: $R^2-r^2$ is measured in $\\text{cm}^2$.",
            equation: `$$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Find the Material Volume",
            body: "Multiply by pipe length and the declared $\\pi$ policy. Unit check: area times length gives $\\text{cm}^3$.",
            equation: `$$V=${piFactor}\\times${h}\\times${state.ringCoefficient}=${volume}$$`,
          },
        ],
        shortcut: `⚡ Exam speed: with $r=R-t$, use $R^2-r^2=t(2R-t)=${t}(2\\times${R}-${t})=${state.ringCoefficient}$.`,
        traps,
      };

    case "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME":
      return {
        keyRule,
        steps: [
          {
            title: "Remove the Common $\\pi h$ Factor",
            body: "Divide the material-volume evidence by $\\pi h$ to recover $R^2-r^2$. Unit check: $\\text{cm}^3\\div\\text{cm}=\\text{cm}^2$.",
            equation: `$$R^2-r^2=\\frac{V}{${piFactor}h}=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Isolate the Inner Radius Squared",
            body: "Subtract the recovered ring coefficient from $R^2$. Unit check: both terms are square centimetres.",
            equation: `$$r^2=${R}^2-${state.ringCoefficient}=${r ** 2n}\\text{ cm}^2$$`,
          },
          {
            title: "Take the Positive Physical Root",
            body: "A radius must be positive and smaller than the outer radius. Unit check: the square root of $\\text{cm}^2$ is $\\text{cm}$.",
            equation: `$$r=\\sqrt{${r ** 2n}}=${r}\\text{ cm}$$`,
          },
        ],
        shortcut: "⚡ Exam speed: cancel the declared $\\pi$ factor and pipe length first, then recognise the perfect square for $r^2$.",
        traps,
      };
  }
}

function expectedDiagramLabels(
  state: MenCp011State,
  role: "PROMPT" | "SOLUTION",
) {
  switch (state.representation) {
    case "DIAMETERS":
      return [
        `D = ${state.outerDiameter} cm`,
        `d = ${state.innerDiameter} cm`,
        `h = ${state.height} cm`,
      ];
    case "OUTER_RADIUS_AND_THICKNESS":
      return [
        `R = ${state.outerRadius} cm`,
        role === "PROMPT" ? "r = ?" : `r = ${state.innerRadius} cm`,
        `t = ${state.thickness} cm`,
        `h = ${state.height} cm`,
      ];
    case "INVERSE_INNER_RADIUS":
      return [
        `R = ${state.outerRadius} cm`,
        role === "PROMPT" ? "r = ?" : `r = ${state.innerRadius} cm`,
        `h = ${state.height} cm`,
      ];
    case "RADII":
      return [
        `R = ${state.outerRadius} cm`,
        `r = ${state.innerRadius} cm`,
        `h = ${state.height} cm`,
      ];
  }
}

function patchDiagram(
  source: MenCp011Diagram,
  baseState: MenCp011State,
  state: MenCp011State,
  role: "PROMPT" | "SOLUTION",
): MenCp011Diagram {
  const oldLabels = expectedDiagramLabels(baseState, role);
  const newLabels = expectedDiagramLabels(state, role);
  let svg = source.svg;
  oldLabels.forEach((oldLabel, index) => {
    svg = svg.replaceAll(oldLabel, newLabels[index]!);
  });
  return {
    ...source,
    svg,
    visibleLabels: newLabels,
  };
}

function naturalTrapReason(trap: string) {
  const match = trap.match(/^Option [A-D] \((.+)\): (.+) \[([A-Z0-9_]+)\]$/);
  return match?.[2] ?? "using a common but incorrect interpretation of the pipe dimensions";
}

function learnerSolutionFor(
  state: MenCp011State,
  options: readonly MenCp011Option[],
  correctIndex: number,
  traps: readonly string[],
): MenCp011LearnerSolution {
  const R = state.outerRadius;
  const r = state.innerRadius;
  const h = state.height;
  const t = state.thickness;
  const piFactor = piMath(state);
  const answerMath = resultMath(
    state,
    state.target === "VOLUME" ? state.materialVolume : rational(state.innerRadius),
  );
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const matchingTrap = traps.find((trap) => trap.startsWith(`Option ${option.label} (`));
      return `Option ${option.label} (${option.display}) comes from ${naturalTrapReason(matchingTrap ?? "")}.`;
    });

  switch (state.prototypeId) {
    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME":
      return {
        formula: "$V=\\pi h(R^2-r^2)$",
        steps: [
          `$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$`,
          `$V=${piFactor}\\times${h}\\times${state.ringCoefficient}=${answerMath}$`,
        ],
        finalAnswer: options[correctIndex]!.display,
        shortcut: `Use $(R-r)(R+r)=${t}\\times${R + r}$ before multiplying by $\\pi h$.`,
        wrongOptionAnalysis,
      };

    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS":
      return {
        formula: "$R=D/2,\\ r=d/2,\\ V=\\pi h(R^2-r^2)$",
        steps: [
          `$R=${state.outerDiameter}/2=${R}\\text{ cm},\\quad r=${state.innerDiameter}/2=${r}\\text{ cm}$`,
          `$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$`,
          `$V=${piFactor}\\times${h}\\times${state.ringCoefficient}=${answerMath}$`,
        ],
        finalAnswer: options[correctIndex]!.display,
        shortcut: "You may use $(D^2-d^2)/4$ directly after confirming both values are diameters.",
        wrongOptionAnalysis,
      };

    case "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS":
      return {
        formula: "$r=R-t,\\quad V=\\pi h(R^2-r^2)$",
        steps: [
          `$r=${R}-${t}=${r}\\text{ cm}$`,
          `$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$`,
          `$V=${piFactor}\\times${h}\\times${state.ringCoefficient}=${answerMath}$`,
        ],
        finalAnswer: options[correctIndex]!.display,
        shortcut: `Use $R^2-(R-t)^2=t(2R-t)=${t}(2\\times${R}-${t})$.`,
        wrongOptionAnalysis,
      };

    case "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME":
      return {
        formula: "$r=\\sqrt{R^2-\\frac{V}{\\pi h}}$",
        steps: [
          `$R^2-r^2=V/(${piFactor}h)=${state.ringCoefficient}\\text{ cm}^2$`,
          `$r^2=${R}^2-${state.ringCoefficient}=${r ** 2n}\\text{ cm}^2$`,
          `$r=\\sqrt{${r ** 2n}}=${answerMath}$`,
        ],
        finalAnswer: options[correctIndex]!.display,
        shortcut: "Cancel the declared $\\pi$ factor and length first; then identify the positive square root.",
        wrongOptionAnalysis,
      };
  }
}

function verificationFor(state: MenCp011State, exactAnswer: ExactValue) {
  const reconstructed = state.target === "VOLUME"
    ? state.materialVolume
    : rational(state.innerRadius);
  return {
    valid: exactEquals(reconstructed, exactAnswer),
    method: state.target === "VOLUME"
      ? "independently reconstructed the expanded annular cross-section and multiplied it by the expanded length"
      : "independently recovered the expanded inner radius from the material-volume identity",
    reconstructed: exactKey(reconstructed),
  };
}

function visibleTexIsValid(question: MenCp011ExamReadyPackage) {
  const text = [
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
  if (text.includes("\\pih")) return false;
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) return false;
  const commands = [...text.matchAll(/\\([A-Za-z]+)/g)].map((match) => match[1]!);
  return commands.every((command) => ALLOWED_VISIBLE_TEX_COMMANDS.has(command));
}

function validationFor(
  question: MenCp011ExamReadyPackage,
  baseState: MenCp011State,
  profile: MenCp011ScaleProfile,
) {
  const state = question.state;
  const expectedPromptLabels = expectedDiagramLabels(state, "PROMPT");
  const expectedSolutionLabels = expectedDiagramLabels(state, "SOLUTION");
  const trapByOption = new Map(question.options.map((option) => [option.label, option]));
  const trapAlignment = question.explanation.traps.every((trap) => {
    const match = trap.match(/^Option ([A-D]) \((.+)\):.*\[([A-Z0-9_]+)\]$/);
    if (!match) return false;
    const option = trapByOption.get(match[1] as MenCp011Option["label"]);
    return Boolean(
      option &&
      !option.isCorrect &&
      option.display === match[2] &&
      option.misconceptionId === match[3]
    );
  });
  const promptSafe = state.representation !== "OUTER_RADIUS_AND_THICKNESS" &&
    state.representation !== "INVERSE_INNER_RADIUS"
    ? true
    : question.diagram.visibleLabels.includes("r = ?") &&
      !question.diagram.svg.includes(`r = ${state.innerRadius} cm`) &&
      !question.stem.includes(`inner radius $${state.innerRadius}`);
  const learnerText = [
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
  const piPolicySafe = state.piPolicy === "EXACT_PI"
    ? question.stem.includes("exact form") && !question.stem.includes("22}{7")
    : question.stem.includes("22}{7");
  const checks = [
    {
      name: "Phase 2A state-pool membership",
      passed: isMenCp011CatalogState(state),
      message: "Every expanded question must belong to the frozen 72-state Phase 2A physical-state catalog.",
    },
    {
      name: "independent scale profile",
      passed:
        [1, 2, 3].includes(profile.radialScale) &&
        [1, 3, 4].includes(profile.heightScale) &&
        state.innerRadius * baseState.outerRadius ===
          baseState.innerRadius * state.outerRadius,
      message: "Radial and height scales must be selected independently while preserving the approved tube proportion.",
    },
    {
      name: "physical dimensions",
      passed:
        state.outerRadius > state.innerRadius &&
        state.innerRadius > 0n &&
        state.height > 0n &&
        state.thickness === state.outerRadius - state.innerRadius,
      message: "The expanded pipe must retain positive dimensions and a positive wall thickness.",
    },
    {
      name: "derived representations",
      passed:
        state.outerDiameter === 2n * state.outerRadius &&
        state.innerDiameter === 2n * state.innerRadius &&
        state.ringCoefficient === state.outerRadius ** 2n - state.innerRadius ** 2n,
      message: "Radius, diameter, thickness and annular-area representations must describe one physical pipe.",
    },
    {
      name: "exact answer reconstruction",
      passed: question.verification.valid,
      message: "The expanded exact answer must be reconstructed independently from the expanded state.",
    },
    {
      name: "four unique option values",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4 &&
        new Set(question.options.map((option) => option.display)).size === 4,
      message: "Scaling must preserve four unique dimensionally compatible options.",
    },
    {
      name: "correct option alignment",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true &&
        question.answer === question.options[question.correctIndex]?.display &&
        exactEquals(question.options[question.correctIndex]!.value, question.exactAnswer),
      message: "The answer, exact value and shuffled correct position must remain aligned after expansion.",
    },
    {
      name: "option trap alignment",
      passed: question.explanation.traps.length === 3 && trapAlignment,
      message: "Every transformed wrong option must retain its exact misconception explanation and code.",
    },
    {
      name: "prompt-safe expanded state",
      passed: promptSafe,
      message: "A derived inner radius must remain unknown in the expanded prompt and prompt diagram.",
    },
    {
      name: "prompt diagram label alignment",
      passed:
        expectedPromptLabels.length === question.diagram.visibleLabels.length &&
        expectedPromptLabels.every((label, index) =>
          question.diagram.visibleLabels[index] === label &&
          question.diagram.svg.includes(label)
        ),
      message: "The prompt diagram must display the expanded state and no stale base-fixture labels.",
    },
    {
      name: "solution diagram label alignment",
      passed:
        expectedSolutionLabels.length === question.solutionDiagram.visibleLabels.length &&
        expectedSolutionLabels.every((label, index) =>
          question.solutionDiagram.visibleLabels[index] === label &&
          question.solutionDiagram.svg.includes(label)
        ),
      message: "The solution diagram must display the expanded state and the recovered dimension where applicable.",
    },
    {
      name: "approved diagram topology retained",
      passed:
        question.diagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"') &&
        question.solutionDiagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"') &&
        question.diagram.svg.includes('data-responsive="true"') &&
        question.solutionDiagram.svg.includes('data-responsive="true"') &&
        question.renderSurfaces.responsiveDiagramPolicy.minWidthPx === 0,
      message: "State expansion must not regress the approved single-tube, responsive diagram contract.",
    },
    {
      name: "declared pi policy",
      passed: piPolicySafe,
      message: "The expanded stem and exact arithmetic must retain the same declared pi policy.",
    },
    {
      name: "visible TeX lint",
      passed: visibleTexIsValid(question),
      message: "Expanded learner and admin mathematics must use supported TeX with balanced delimiters and no malformed \\pih command.",
    },
    {
      name: "learner metadata isolation",
      passed:
        !/\[[A-Z0-9_]+\]/.test(learnerText) &&
        !/\b[PR]:-?\d/.test(learnerText) &&
        !/MEN-CP011-PROT|misconceptionId|statePoolAuthority/.test(learnerText),
      message: "Learner solutions must not expose trap codes, verifier tokens or state-pool metadata.",
    },
    {
      name: "render-surface separation",
      passed:
        question.renderSurfaces.attempt.diagram === null &&
        question.renderSurfaces.practice.diagram === question.diagram &&
        question.renderSurfaces.solution.diagram === question.solutionDiagram &&
        !question.renderSurfaces.solution.exposesInternalCodes &&
        question.renderSurfaces.admin.exposesInternalCodes,
      message: "Attempt, Practice, Solution and Admin surfaces must remain separated after expansion.",
    },
    {
      name: "lifecycle lock",
      passed:
        question.permanentQlId === null &&
        question.reviewStatus === "UNREVIEWED" &&
        question.questionBankStatus === "NOT_STORED" &&
        question.testEligibility === "INELIGIBLE" &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable,
      message: "Phase 2A expansion remains review-only and cannot enter product surfaces.",
    },
  ];
  return {
    valid: checks.every((check) => check.passed),
    checks,
  };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011StateExpandedPackage {
  const generated = generateExamStemMenCp011FoundationPrototype(prototypeId, seed);
  const expansion = expandMenCp011State(
    generated.state,
    `${prototypeId}|${seed}`,
  );
  const state: MenCp011State = {
    ...expansion.state,
    materialVolume: scaleExact(
      generated.state.materialVolume,
      expansion.volumeScale,
    ),
  };
  const rebuilt = rebuildOptions(generated, expansion.answerScale);
  const traps = rebuildTraps(rebuilt.options, generated.explanation.traps);
  const explanation = explanationFor(state, traps);
  const diagram = patchDiagram(
    generated.diagram,
    generated.state,
    state,
    "PROMPT",
  );
  const solutionDiagram = patchDiagram(
    generated.solutionDiagram,
    generated.state,
    state,
    "SOLUTION",
  );
  const learnerSolution = learnerSolutionFor(
    state,
    rebuilt.options,
    rebuilt.correctIndex,
    traps,
  );
  const verification = verificationFor(state, rebuilt.exactAnswer);
  const trapCodes = rebuilt.options
    .filter((option) => !option.isCorrect)
    .map((option) => option.misconceptionId!)
    .sort();

  const partial: MenCp011StateExpandedPackage = {
    ...generated,
    statePoolAuthority: MEN_CP011_STATE_POOL_AUTHORITY,
    stateScaleProfile: expansion.profile,
    state,
    stem: expandedStem(generated, state),
    options: rebuilt.options,
    correctIndex: rebuilt.correctIndex,
    answer: rebuilt.answer,
    exactAnswer: rebuilt.exactAnswer,
    explanation,
    diagram,
    solutionDiagram,
    learnerSolution,
    verification,
    validation: { valid: false, checks: [] },
    renderSurfaces: {
      ...generated.renderSurfaces,
      practice: {
        ...generated.renderSurfaces.practice,
        diagram,
      },
      solution: {
        ...generated.renderSurfaces.solution,
        diagram: solutionDiagram,
        explanation: learnerSolution,
      },
      admin: {
        ...generated.renderSurfaces.admin,
        diagram: solutionDiagram,
        explanation,
        trapCodes,
        verification,
      },
    },
  };

  return {
    ...partial,
    validation: validationFor(
      partial,
      generated.state,
      expansion.profile,
    ),
  };
}

export { classifyMenCp011Difficulty };
