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
  generateMenCp011FoundationPrototype as generateStateExpandedMenCp011FoundationPrototype,
  type MenCp011StateExpandedPackage,
} from "./runtime-state-expansion";
import {
  getMenCp011MeasurementProfiles,
  menCp011CalculationValues,
  menCp011ExpectedAnswerUnit,
  MEN_CP011_MEASUREMENT_AUTHORITY,
  selectMenCp011MeasurementProfile,
  type MenCp011AnswerUnit,
  type MenCp011LinearUnit,
  type MenCp011MeasurementProfile,
  type MenCp011MeasurementProfileId,
} from "./measurement-profiles";
import { isMenCp011CatalogState } from "./state-pool";
import type {
  MenCp011Diagram,
  MenCp011Explanation,
  MenCp011Option,
  MenCp011PrototypeId,
  MenCp011State,
} from "./types";
import type { MenCp011LearnerSolution } from "./runtime-exam-readiness";

export interface MenCp011MeasuredState
  extends Omit<MenCp011State, "unit" | "materialVolume"> {
  unit: MenCp011AnswerUnit;
  materialVolume: ExactValue;
  measurementProfileId: MenCp011MeasurementProfileId;
  radialUnit: MenCp011LinearUnit;
  heightUnit: MenCp011LinearUnit;
  calculationUnit: MenCp011LinearUnit;
}

export interface MenCp011UnitRepresentationPackage
  extends Omit<MenCp011StateExpandedPackage, "state" | "unit"> {
  state: MenCp011MeasuredState;
  unit: MenCp011AnswerUnit;
  measurementAuthority: typeof MEN_CP011_MEASUREMENT_AUTHORITY;
  measurementProfile: MenCp011MeasurementProfile;
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

function volumeFromCoefficient(
  state: Pick<MenCp011State, "piPolicy">,
  coefficient: bigint,
): ExactValue {
  return state.piPolicy === "EXACT_PI"
    ? pi(coefficient)
    : rational(22n * coefficient, 7n);
}

function piMath(state: Pick<MenCp011State, "piPolicy">) {
  return state.piPolicy === "EXACT_PI" ? "\\pi" : "\\frac{22}{7}";
}

function unitMath(unit: MenCp011LinearUnit, power = 1) {
  return power === 1
    ? `\\text{ ${unit}}`
    : `\\text{ ${unit}}^{${power}}`;
}

function resultMath(state: MenCp011MeasuredState, value: ExactValue) {
  const unit = state.unit === "cm³"
    ? "\\text{ cm}^{3}"
    : state.unit === "m³"
      ? "\\text{ m}^{3}"
      : state.unit === "cm"
        ? "\\text{ cm}"
        : "\\text{ m}";
  return `${formatExactMath(value)}${unit}`;
}

function dimension(value: bigint, unit: MenCp011LinearUnit) {
  return `$${value}\\text{ ${unit}}$`;
}

function piPolicySentence(question: MenCp011StateExpandedPackage) {
  return question.piPolicy === "EXACT_PI"
    ? "Leave $\\pi$ in exact form."
    : "Use $\\pi=\\frac{22}{7}$.";
}

function expandedStem(
  question: MenCp011StateExpandedPackage,
  state: MenCp011MeasuredState,
) {
  const R = dimension(state.outerRadius, state.radialUnit);
  const r = dimension(state.innerRadius, state.radialUnit);
  const h = dimension(state.height, state.heightUnit);
  const D = dimension(state.outerDiameter, state.radialUnit);
  const d = dimension(state.innerDiameter, state.radialUnit);
  const t = dimension(state.thickness, state.radialUnit);
  const V = formatWithUnit(state.materialVolume, state.unit === "m" ? "m³" : "cm³");
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
      `A hollow pipe has outer radius ${R}, length ${h}, and metal volume ${V}. Find its inner radius in ${state.radialUnit}. ${policy}`,
      `The outer radius and length of a cylindrical tube are ${R} and ${h}. If it contains ${V} of metal, determine the bore radius in ${state.radialUnit}. ${policy}`,
      `A pipe uses ${V} of metal. Its outside radius is ${R} and its length is ${h}. What is the inner radius in ${state.radialUnit}? ${policy}`,
      `The material volume of a hollow cylinder is ${V}; its outer radius is ${R} and height is ${h}. Find the radius of the central void in ${state.radialUnit}. ${policy}`,
      `A machine sleeve of length ${h} has outer radius ${R} and material volume ${V}. Determine its internal radius in ${state.radialUnit}. ${policy}`,
      `A uniform tube has external radius ${R}, axial length ${h}, and metal volume ${V}. Calculate the radius of its bore in ${state.radialUnit}. ${policy}`,
      `The wall material of a pipe occupies ${V}. If the pipe is ${h} long with outer radius ${R}, find the inner radius in ${state.radialUnit}. ${policy}`,
      `A hollow bush has height ${h}, outside radius ${R}, and solid-material volume ${V}. Determine the inside radius in ${state.radialUnit}. ${policy}`,
      `A cylindrical pipe section has outer radius ${R}, length ${h}, and metal volume ${V}. Find the radius of the hollow passage in ${state.radialUnit}. ${policy}`,
      `A tube of length ${h} and outer radius ${R} is made from ${V} of metal. Calculate its inner radius in ${state.radialUnit}. ${policy}`,
      `A cylinder of radius ${R} and height ${h} is bored so that ${V} of material remains. Find the bore radius in ${state.radialUnit}. ${policy}`,
      `The outside radius of a hollow component is ${R}. Its height is ${h} and material volume is ${V}. What is its inner radius in ${state.radialUnit}? ${policy}`,
    ],
  };

  return choose(
    variants[question.prototypeId],
    `${MEN_CP011_MEASUREMENT_AUTHORITY}|STEM|${question.prototypeId}|${question.seed}`,
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

function customUnitTrap(
  profile: MenCp011MeasurementProfile,
  generated: MenCp011StateExpandedPackage,
) {
  if (generated.target !== "VOLUME" || !profile.mixedUnits) return null;
  if (profile.id === "RADIAL_CM_LENGTH_M_TO_CM3") {
    return {
      value: generated.exactAnswer,
      misconceptionId: "OMITTED_MIXED_LENGTH_CONVERSION",
      explanation: "leaving the pipe length in metres while treating the radii as centimetres, so the required multiplication of the length by 100 is missing",
    };
  }
  return {
    value: scaleExact(generated.exactAnswer, 100n),
    misconceptionId: "USED_LINEAR_UNIT_CONVERSION_FOR_AREA",
    explanation: "using only one factor of 100 when metre-based radii are squared; the annular area needs the factor $100^2=10,000$",
  };
}

function rebuildOptions(
  generated: MenCp011StateExpandedPackage,
  profile: MenCp011MeasurementProfile,
  outputUnit: MenCp011AnswerUnit,
) {
  const answerScale = generated.target === "VOLUME"
    ? profile.volumeScaleFromNominalState
    : 1n;
  const options: MenCp011Option[] = generated.options.map((option) => {
    const value = scaleExact(option.value, answerScale);
    return {
      ...option,
      value,
      display: formatWithUnit(value, outputUnit),
    };
  });

  const unitTrap = customUnitTrap(profile, generated);
  if (unitTrap) {
    const wrongIndices = options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !option.isCorrect)
      .map(({ index }) => index);
    const replacementIndex = wrongIndices[
      hashText(`${MEN_CP011_MEASUREMENT_AUTHORITY}|UNIT-TRAP|${generated.seed}`) % wrongIndices.length
    ]!;
    const retainedKeys = new Set(
      options
        .filter((_, index) => index !== replacementIndex)
        .map((option) => exactKey(option.value)),
    );
    if (retainedKeys.has(exactKey(unitTrap.value))) {
      throw new Error(`${generated.prototypeId} produced a duplicate Phase 2B unit distractor for ${generated.seed}.`);
    }
    options[replacementIndex] = {
      ...options[replacementIndex]!,
      value: unitTrap.value,
      display: formatWithUnit(unitTrap.value, outputUnit),
      misconceptionId: unitTrap.misconceptionId,
    };
  }

  const exactAnswer = scaleExact(generated.exactAnswer, answerScale);
  return {
    options,
    exactAnswer,
    answer: options[generated.correctIndex]!.display,
    correctIndex: generated.correctIndex,
    unitTrap,
  };
}

function rebuildTraps(
  options: readonly MenCp011Option[],
  sourceTraps: readonly string[],
  unitTrap: ReturnType<typeof customUnitTrap>,
) {
  const bodies = trapBodyByCode(sourceTraps);
  if (unitTrap) bodies.set(unitTrap.misconceptionId, unitTrap.explanation);
  return options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const code = option.misconceptionId;
      if (!code) throw new Error("A Phase 2B wrong option lost its misconception code.");
      const body = bodies.get(code);
      if (!body) throw new Error(`No Phase 2B trap explanation was found for ${code}.`);
      return `Option ${option.label} (${option.display}): This result comes from ${body}. [${code}]`;
    });
}

function conversionStep(
  state: MenCp011MeasuredState,
  profile: MenCp011MeasurementProfile,
  calculation: ReturnType<typeof menCp011CalculationValues>,
) {
  if (profile.conversionFocus === "NONE") return null;
  if (profile.conversionFocus === "CONVERT_HEIGHT_M_TO_CM") {
    return {
      title: "Convert the Pipe Length to Centimetres",
      body: "The radial measurements are in centimetres, so convert the metre length before using area × length. Unit check: $1\\text{ m}=100\\text{ cm}$.",
      equation: `$$h=${state.height}\\text{ m}=${calculation.height}\\text{ cm}$$`,
    };
  }

  const conversionEquation = state.representation === "DIAMETERS"
    ? `D=${state.outerDiameter}\\text{ m}=${calculation.outerDiameter}\\text{ cm},\\qquad d=${state.innerDiameter}\\text{ m}=${calculation.innerDiameter}\\text{ cm}`
    : state.representation === "OUTER_RADIUS_AND_THICKNESS"
      ? `R=${state.outerRadius}\\text{ m}=${calculation.outerRadius}\\text{ cm},\\qquad t=${state.thickness}\\text{ m}=${calculation.thickness}\\text{ cm}`
      : state.representation === "INVERSE_INNER_RADIUS"
        ? `R=${state.outerRadius}\\text{ m}=${calculation.outerRadius}\\text{ cm}`
        : `R=${state.outerRadius}\\text{ m}=${calculation.outerRadius}\\text{ cm},\\qquad r=${state.innerRadius}\\text{ m}=${calculation.innerRadius}\\text{ cm}`;
  return {
    title: "Convert the Radial Measurements to Centimetres",
    body: "The pipe length and requested volume are in centimetre units. Convert every supplied radial length before squaring. Unit check: multiplying a radius by 100 makes its squared area factor $100^2=10,000$.",
    equation: `$$${conversionEquation}$$`,
  };
}

function explanationFor(
  state: MenCp011MeasuredState,
  profile: MenCp011MeasurementProfile,
  traps: string[],
): MenCp011Explanation {
  const calculation = menCp011CalculationValues(profile, state);
  const piFactor = piMath(state);
  const calcUnit = profile.calculationUnit;
  const result = resultMath(
    state,
    state.target === "VOLUME" ? state.materialVolume : rational(state.innerRadius),
  );
  const steps: MenCp011Explanation["steps"] = [];
  const conversion = conversionStep(state, profile, calculation);
  if (conversion) steps.push(conversion);

  const keyRule = "Picture the pipe as a solid outer cylinder with a smaller coaxial cylinder removed. First express every length in one unit. Then use $V=\\pi h(R^2-r^2)$. Here, $R$ is the outer radius, $r$ is the inner radius, $h$ is the pipe length and $t=R-r$ is the radial wall thickness.";

  if (state.representation === "DIAMETERS") {
    steps.push({
      title: "Convert Diameters to Radii",
      body: `Halve both diameters in the common calculation unit. Unit check: diameter and radius are lengths in $\\text{${calcUnit}}$.`,
      equation: `$$R=\\frac{${calculation.outerDiameter}}{2}=${calculation.outerRadius}${unitMath(calcUnit)},\\qquad r=\\frac{${calculation.innerDiameter}}{2}=${calculation.innerRadius}${unitMath(calcUnit)}$$`,
    });
  } else if (state.representation === "OUTER_RADIUS_AND_THICKNESS") {
    steps.push({
      title: "Recover the Inner Radius",
      body: `Subtract the radial wall thickness once from the outer radius. Unit check: both values are lengths in $\\text{${calcUnit}}$.`,
      equation: `$$r=R-t=${calculation.outerRadius}-${calculation.thickness}=${calculation.innerRadius}${unitMath(calcUnit)}$$`,
    });
  }

  if (state.target === "VOLUME") {
    steps.push(
      {
        title: "Find the Annular Cross-section",
        body: `Subtract the inner circular area coefficient from the outer one. Unit check: $R^2-r^2$ is measured in $\\text{${calcUnit}}^2$.`,
        equation: `$$R^2-r^2=${calculation.outerRadius}^2-${calculation.innerRadius}^2=${calculation.ringCoefficient}${unitMath(calcUnit, 2)}$$`,
      },
      {
        title: "Extend the Ring through the Pipe Length",
        body: `Multiply the annular area by the common-unit pipe length and the declared value of $\\pi$. Unit check: $\\text{${calcUnit}}^2\\times\\text{${calcUnit}}=\\text{${calcUnit}}^3$.`,
        equation: `$$V=${piFactor}\\times${calculation.height}\\times${calculation.ringCoefficient}=${result}$$`,
      },
    );
  } else {
    steps.push(
      {
        title: "Remove the Common $\\pi h$ Factor",
        body: `Divide the material volume by $\\pi h$ after all supplied lengths are in the calculation unit. Unit check: volume divided by length gives $\\text{${calcUnit}}^2$.`,
        equation: `$$R^2-r^2=\\frac{V}{${piFactor}\\times${calculation.height}}=${calculation.ringCoefficient}${unitMath(calcUnit, 2)}$$`,
      },
      {
        title: "Recover the Inner Radius",
        body: `Subtract the ring coefficient from $R^2$ and take the positive physical root. Unit check: $\\sqrt{\\text{${calcUnit}}^2}=\\text{${calcUnit}}$.`,
        equation: `$$r=\\sqrt{${calculation.outerRadius}^2-${calculation.ringCoefficient}}=${calculation.innerRadius}${unitMath(calcUnit)}$$`,
      },
    );
    if (profile.radialFactorToCalculationUnit !== 1n) {
      steps.push({
        title: "Return to the Requested Radius Unit",
        body: "The question asks for metres, so divide the recovered centimetre radius by 100. Unit check: $100\\text{ cm}=1\\text{ m}$.",
        equation: `$$r=${calculation.innerRadius}\\text{ cm}=${state.innerRadius}\\text{ m}=${result}$$`,
      });
    }
  }

  const shortcut = profile.conversionFocus === "CONVERT_HEIGHT_M_TO_CM"
    ? `⚡ Exam speed: convert only $h$ by $\\times100$, then use $(R-r)(R+r)=${calculation.innerRadius === calculation.outerRadius ? 0 : calculation.outerRadius - calculation.innerRadius}\\times${calculation.outerRadius + calculation.innerRadius}$.`
    : profile.conversionFocus === "CONVERT_RADIAL_M_TO_CM_AND_SQUARE"
      ? "⚡ Exam speed: convert each radial length by $\\times100$ before squaring; the annular area therefore carries $100^2=10,000$, not merely 100."
      : `⚡ Exam speed: use $R^2-r^2=(R-r)(R+r)=(${calculation.outerRadius}-${calculation.innerRadius})(${calculation.outerRadius}+${calculation.innerRadius})$ before multiplying by $${piFactor}h$.`;

  return { keyRule, steps, shortcut, traps };
}

function expectedDiagramLabels(
  state: Pick<
    MenCp011State,
    | "representation"
    | "outerRadius"
    | "innerRadius"
    | "height"
    | "thickness"
    | "outerDiameter"
    | "innerDiameter"
  >,
  role: "PROMPT" | "SOLUTION",
  radialUnit: MenCp011LinearUnit,
  heightUnit: MenCp011LinearUnit,
) {
  switch (state.representation) {
    case "DIAMETERS":
      return [
        `D = ${state.outerDiameter} ${radialUnit}`,
        `d = ${state.innerDiameter} ${radialUnit}`,
        `h = ${state.height} ${heightUnit}`,
      ];
    case "OUTER_RADIUS_AND_THICKNESS":
      return [
        `R = ${state.outerRadius} ${radialUnit}`,
        role === "PROMPT" ? "r = ?" : `r = ${state.innerRadius} ${radialUnit}`,
        `t = ${state.thickness} ${radialUnit}`,
        `h = ${state.height} ${heightUnit}`,
      ];
    case "INVERSE_INNER_RADIUS":
      return [
        `R = ${state.outerRadius} ${radialUnit}`,
        role === "PROMPT" ? "r = ?" : `r = ${state.innerRadius} ${radialUnit}`,
        `h = ${state.height} ${heightUnit}`,
      ];
    case "RADII":
      return [
        `R = ${state.outerRadius} ${radialUnit}`,
        `r = ${state.innerRadius} ${radialUnit}`,
        `h = ${state.height} ${heightUnit}`,
      ];
  }
}

function patchDiagram(
  source: MenCp011Diagram,
  baseState: MenCp011State,
  measuredState: MenCp011MeasuredState,
  role: "PROMPT" | "SOLUTION",
) {
  const oldLabels = expectedDiagramLabels(baseState, role, "cm", "cm");
  const newLabels = expectedDiagramLabels(
    measuredState,
    role,
    measuredState.radialUnit,
    measuredState.heightUnit,
  );
  let svg = source.svg;
  oldLabels.forEach((oldLabel, index) => {
    svg = svg.replaceAll(oldLabel, newLabels[index]!);
  });
  return { ...source, svg, visibleLabels: newLabels };
}

function naturalTrapReason(trap: string) {
  const match = trap.match(/^Option [A-D] \((.+)\): (.+) \[([A-Z0-9_]+)\]$/);
  return match?.[2] ?? "using a common but incorrect interpretation of the pipe dimensions";
}

function learnerSolutionFor(
  state: MenCp011MeasuredState,
  explanation: MenCp011Explanation,
  options: readonly MenCp011Option[],
  correctIndex: number,
  traps: readonly string[],
): MenCp011LearnerSolution {
  const formula = state.target === "VOLUME"
    ? "$V=\\pi h(R^2-r^2)$"
    : "$r=\\sqrt{R^2-\\frac{V}{\\pi h}}$";
  const steps = explanation.steps
    .map((step) => step.equation)
    .filter((equation): equation is string => Boolean(equation))
    .map((equation) => equation.replace(/^\$\$/, "$").replace(/\$\$$/, "$"));
  const wrongOptionAnalysis = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const trap = traps.find((candidate) => candidate.startsWith(`Option ${option.label} (`));
      return `Option ${option.label} (${option.display}) comes from ${naturalTrapReason(trap ?? "")}.`;
    });
  return {
    formula,
    steps,
    finalAnswer: options[correctIndex]!.display,
    shortcut: explanation.shortcut.replace(/^⚡ Exam speed:\s*/, ""),
    wrongOptionAnalysis,
  };
}

function visibleTexIsValid(question: MenCp011UnitRepresentationPackage) {
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

function validationFor(question: MenCp011UnitRepresentationPackage) {
  const state = question.state;
  const profile = question.measurementProfile;
  const calculation = menCp011CalculationValues(profile, state);
  const expectedVolume = volumeFromCoefficient(state, calculation.volumeCoefficient);
  const expectedAnswer = state.target === "VOLUME"
    ? expectedVolume
    : rational(state.innerRadius);
  const promptLabels = expectedDiagramLabels(
    state,
    "PROMPT",
    profile.radialUnit,
    profile.heightUnit,
  );
  const solutionLabels = expectedDiagramLabels(
    state,
    "SOLUTION",
    profile.radialUnit,
    profile.heightUnit,
  );
  const optionByLabel = new Map(question.options.map((option) => [option.label, option]));
  const trapAlignment = question.explanation.traps.every((trap) => {
    const match = trap.match(/^Option ([A-D]) \((.+)\):.*\[([A-Z0-9_]+)\]$/);
    if (!match) return false;
    const option = optionByLabel.get(match[1] as MenCp011Option["label"]);
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
      !question.diagram.svg.includes(`r = ${state.innerRadius} ${profile.radialUnit}`);
  const learnerText = [
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
  const unitTrapCode = profile.id === "RADIAL_CM_LENGTH_M_TO_CM3"
    ? "OMITTED_MIXED_LENGTH_CONVERSION"
    : profile.id === "RADIAL_M_LENGTH_CM_TO_CM3"
      ? "USED_LINEAR_UNIT_CONVERSION_FOR_AREA"
      : null;
  const unitTrapRequired = state.target === "VOLUME" && profile.mixedUnits;
  const conversionText = [
    ...question.explanation.steps.map((step) => `${step.title} ${step.body} ${step.equation ?? ""}`),
    ...question.learnerSolution.steps,
  ].join("\n");

  const checks = [
    {
      name: "Phase 2B measurement authority",
      passed:
        question.measurementAuthority === MEN_CP011_MEASUREMENT_AUTHORITY &&
        getMenCp011MeasurementProfiles().some((candidate) => candidate.id === profile.id),
      message: "Every question must derive from one of the four frozen Phase 2B measurement profiles.",
    },
    {
      name: "Phase 2A physical-state retention",
      passed: isMenCp011CatalogState(state),
      message: "Unit representation must not mutate the validated 72-state geometric authority.",
    },
    {
      name: "unit-profile state alignment",
      passed:
        state.measurementProfileId === profile.id &&
        state.radialUnit === profile.radialUnit &&
        state.heightUnit === profile.heightUnit &&
        state.calculationUnit === profile.calculationUnit &&
        state.unit === menCp011ExpectedAnswerUnit(profile, state.target) &&
        question.unit === state.unit,
      message: "Input, calculation and answer units must match the selected measurement profile.",
    },
    {
      name: "dimensional conversion factor",
      passed:
        calculation.volumeCoefficient ===
          state.height * state.ringCoefficient * profile.volumeScaleFromNominalState,
      message: "The volume factor must apply linear conversion to height and squared conversion to radial measurements.",
    },
    {
      name: "exact material-volume reconstruction",
      passed:
        exactEquals(state.materialVolume, expectedVolume) &&
        exactEquals(question.exactAnswer, expectedAnswer) &&
        question.verification.valid,
      message: "The exact solver and independent verifier must agree after unit conversion.",
    },
    {
      name: "four unique unit-compatible options",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4 &&
        new Set(question.options.map((option) => option.display)).size === 4 &&
        question.options.every((option) => option.display.includes(state.unit.replace("³", ""))),
      message: "All four options must remain unique and use the requested answer unit.",
    },
    {
      name: "correct option alignment",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true &&
        exactEquals(question.options[question.correctIndex]!.value, question.exactAnswer) &&
        question.answer === question.options[question.correctIndex]!.display,
      message: "The transformed exact answer must remain at the independently shuffled correct position.",
    },
    {
      name: "unit misconception coverage",
      passed:
        !unitTrapRequired ||
        question.options.some((option) => option.misconceptionId === unitTrapCode),
      message: "Mixed-unit volume questions must include the exact conversion mistake appropriate to the profile.",
    },
    {
      name: "option trap alignment",
      passed: question.explanation.traps.length === 3 && trapAlignment,
      message: "Every displayed wrong option must retain its exact natural-language diagnosis and public code.",
    },
    {
      name: "explicit mixed-unit conversion",
      passed:
        !profile.mixedUnits ||
        (/Convert/.test(conversionText) && /100/.test(conversionText)),
      message: "Mixed-unit questions must visibly convert supplied lengths before area or volume arithmetic.",
    },
    {
      name: "prompt-safe unknown dimension",
      passed: promptSafe,
      message: "A derived inner radius must remain unknown in the question diagram.",
    },
    {
      name: "prompt diagram unit alignment",
      passed:
        promptLabels.length === question.diagram.visibleLabels.length &&
        promptLabels.every((label, index) =>
          question.diagram.visibleLabels[index] === label && question.diagram.svg.includes(label)
        ),
      message: "Prompt diagram labels must match the selected radial and height units.",
    },
    {
      name: "solution diagram unit alignment",
      passed:
        solutionLabels.length === question.solutionDiagram.visibleLabels.length &&
        solutionLabels.every((label, index) =>
          question.solutionDiagram.visibleLabels[index] === label &&
          question.solutionDiagram.svg.includes(label)
        ),
      message: "Solution diagram labels must match the selected units and recovered value.",
    },
    {
      name: "approved diagram topology retained",
      passed:
        question.diagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"') &&
        question.solutionDiagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"') &&
        question.diagram.svg.includes('data-responsive="true"') &&
        question.renderSurfaces.responsiveDiagramPolicy.minWidthPx === 0,
      message: "Unit representation must not alter the approved responsive tube geometry.",
    },
    {
      name: "declared pi policy",
      passed: state.piPolicy === "EXACT_PI"
        ? question.stem.includes("exact form") && !question.stem.includes("22}{7")
        : question.stem.includes("22}{7"),
      message: "The stem and exact arithmetic must retain the same declared pi policy.",
    },
    {
      name: "visible TeX lint",
      passed: visibleTexIsValid(question),
      message: "All learner and admin mathematics must use supported TeX with balanced delimiters.",
    },
    {
      name: "learner metadata isolation",
      passed:
        !/\[[A-Z0-9_]+\]/.test(learnerText) &&
        !/\b[PR]:-?\d/.test(learnerText) &&
        !/MEN-CP011-PROT|measurementAuthority|measurementProfileId/.test(learnerText),
      message: "Learner solutions must not expose internal codes, verifier tokens or measurement metadata.",
    },
    {
      name: "render-surface separation",
      passed:
        question.renderSurfaces.attempt.diagram === null &&
        question.renderSurfaces.practice.diagram === question.diagram &&
        question.renderSurfaces.solution.diagram === question.solutionDiagram &&
        !question.renderSurfaces.solution.exposesInternalCodes &&
        question.renderSurfaces.admin.exposesInternalCodes,
      message: "Attempt, Practice, Solution and Admin surfaces must remain separated.",
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
      message: "Phase 2B packages remain review-only and unavailable to product surfaces.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011UnitRepresentationPackage {
  const generated = generateStateExpandedMenCp011FoundationPrototype(prototypeId, seed);
  const profile = selectMenCp011MeasurementProfile(`${prototypeId}|${seed}`);
  const outputUnit = menCp011ExpectedAnswerUnit(profile, generated.target);
  const calculation = menCp011CalculationValues(profile, generated.state);
  const state: MenCp011MeasuredState = {
    ...generated.state,
    unit: outputUnit,
    materialVolume: volumeFromCoefficient(generated.state, calculation.volumeCoefficient),
    measurementProfileId: profile.id,
    radialUnit: profile.radialUnit,
    heightUnit: profile.heightUnit,
    calculationUnit: profile.calculationUnit,
  };
  const rebuilt = rebuildOptions(generated, profile, outputUnit);
  const traps = rebuildTraps(
    rebuilt.options,
    generated.explanation.traps,
    rebuilt.unitTrap,
  );
  const explanation = explanationFor(state, profile, traps);
  const diagram = patchDiagram(generated.diagram, generated.state, state, "PROMPT");
  const solutionDiagram = patchDiagram(
    generated.solutionDiagram,
    generated.state,
    state,
    "SOLUTION",
  );
  const learnerSolution = learnerSolutionFor(
    state,
    explanation,
    rebuilt.options,
    rebuilt.correctIndex,
    traps,
  );
  const verificationAnswer = state.target === "VOLUME"
    ? state.materialVolume
    : rational(state.innerRadius);
  const verification = {
    valid: exactEquals(verificationAnswer, rebuilt.exactAnswer),
    method: profile.mixedUnits
      ? "independently converted all supplied lengths to the declared calculation unit before reconstructing the annular volume identity"
      : "independently reconstructed the annular volume identity in the stated common unit",
    reconstructed: exactKey(verificationAnswer),
  };
  const trapCodes = rebuilt.options
    .filter((option) => !option.isCorrect)
    .map((option) => option.misconceptionId!)
    .sort();

  const partial: MenCp011UnitRepresentationPackage = {
    ...generated,
    measurementAuthority: MEN_CP011_MEASUREMENT_AUTHORITY,
    measurementProfile: profile,
    state,
    unit: outputUnit,
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
      practice: { ...generated.renderSurfaces.practice, diagram },
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

  return { ...partial, validation: validationFor(partial) };
}

export { classifyMenCp011Difficulty };
