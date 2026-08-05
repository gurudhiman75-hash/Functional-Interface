import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateApprovedMenCp011FoundationPrototype,
} from "./runtime-approved-diagram";
import type {
  MenCp011Diagram,
  MenCp011Explanation,
  MenCp011Option,
  MenCp011Package,
  MenCp011PrototypeId,
  MenCp011State,
} from "./types";

export type MenCp011DiagramRole = "PROMPT" | "SOLUTION";

export interface MenCp011LearnerSolution {
  formula: string;
  steps: string[];
  finalAnswer: string;
  shortcut: string;
  wrongOptionAnalysis: string[];
}

export interface MenCp011RenderSurfaces {
  attempt: {
    diagram: null;
    diagramPolicy: "HIDDEN_FOR_TEXT_COMPLETE_ITEM";
    exposesInternalCodes: false;
  };
  practice: {
    diagram: MenCp011Diagram;
    diagramPolicy: "OPTIONAL_PROMPT_DIAGRAM";
    exposesInternalCodes: false;
  };
  solution: {
    diagram: MenCp011Diagram;
    explanation: MenCp011LearnerSolution;
    exposesInternalCodes: false;
  };
  admin: {
    diagram: MenCp011Diagram;
    explanation: MenCp011Explanation;
    trapCodes: string[];
    verification: MenCp011Package["verification"];
    exposesInternalCodes: true;
  };
  responsiveDiagramPolicy: {
    width: "100%";
    minWidthPx: 0;
    height: "auto";
    compactLegendOnMobile: true;
  };
}

export interface MenCp011ExamReadyPackage extends MenCp011Package {
  optionPermutationSeed: string;
  diagram: MenCp011Diagram;
  solutionDiagram: MenCp011Diagram;
  learnerSolution: MenCp011LearnerSolution;
  renderSurfaces: MenCp011RenderSurfaces;
}

type ValidationCheck = MenCp011Package["validation"]["checks"][number];

const LABELS = ["A", "B", "C", "D"] as const;
const ALLOWED_TEX_COMMANDS = new Set([
  "pi",
  "frac",
  "text",
  "times",
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

function randomFromSeed(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: string) {
  const output = [...items];
  const random = randomFromSeed(hashText(seed));
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

function fixMalformedTex(text: string) {
  return text.replace(/\\pih\b/g, "\\pi h");
}

function lintTex(text: string) {
  if (text.includes("\\pih")) return false;
  if ((text.match(/\$/g) ?? []).length % 2 !== 0) return false;
  const commands = [...text.matchAll(/\\([A-Za-z]+)/g)].map((match) => match[1]!);
  return commands.every((command) => ALLOWED_TEX_COMMANDS.has(command));
}

function repairExplanation(explanation: MenCp011Explanation): MenCp011Explanation {
  return {
    keyRule: fixMalformedTex(explanation.keyRule),
    steps: explanation.steps.map((step) => ({
      ...step,
      title: fixMalformedTex(step.title),
      body: fixMalformedTex(step.body),
      equation: step.equation ? fixMalformedTex(step.equation) : undefined,
    })),
    shortcut: fixMalformedTex(explanation.shortcut),
    traps: explanation.traps.map(fixMalformedTex),
  };
}

function trapBodyByCode(traps: readonly string[]) {
  const output = new Map<string, string>();
  for (const trap of traps) {
    const match = trap.match(/^Option [A-D] \((.+)\): (.+) \[([A-Z0-9_]+)\]$/);
    if (!match) continue;
    output.set(match[3]!, match[2]!);
  }
  return output;
}

function permuteOptions(
  base: MenCp011Package,
  repairedExplanation: MenCp011Explanation,
  permutationSeed: string,
) {
  const trapBodies = trapBodyByCode(repairedExplanation.traps);
  const ordered = shuffle(base.options, permutationSeed);
  const options: MenCp011Option[] = ordered.map((option, index) => ({
    ...option,
    label: LABELS[index]!,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) {
    throw new Error("MEN-CP-011 option permutation lost the correct option.");
  }
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const code = option.misconceptionId;
      if (!code) throw new Error("A wrong MEN-CP-011 option is missing its misconception code.");
      const body = trapBodies.get(code);
      if (!body) throw new Error(`No trap explanation was found for ${code}.`);
      return `Option ${option.label} (${option.display}): ${body} [${code}]`;
    });
  return {
    options,
    correctIndex,
    answer: options[correctIndex]!.display,
    explanation: { ...repairedExplanation, traps },
  };
}

function expectedDiagramLabels(state: MenCp011State, role: MenCp011DiagramRole) {
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

function legendFor(state: MenCp011State) {
  switch (state.representation) {
    case "DIAMETERS":
      return "D = Outer diameter · d = Inner diameter · h = Height · O = Centre";
    case "OUTER_RADIUS_AND_THICKNESS":
      return "R = Outer radius · r = Inner radius · t = Wall thickness · h = Height · O = Centre";
    case "INVERSE_INNER_RADIUS":
    case "RADII":
      return "R = Outer radius · r = Inner radius · h = Height · O = Centre";
  }
}

function svgLabelBox(
  x: number,
  y: number,
  text: string,
  anchor: "middle" | "start" | "end" = "middle",
) {
  const width = Math.max(68, Math.round(text.length * 8.1 + 20));
  const rectX = anchor === "middle" ? x - width / 2 : anchor === "start" ? x : x - width;
  const textX = anchor === "middle" ? x : anchor === "start" ? x + 10 : x - 10;
  return `<g data-label-placement="detached">
    <rect x="${rectX}" y="${y}" width="${width}" height="25" rx="6" fill="#ffffff" stroke="#93a4b8" stroke-width="1.2"/>
    <text x="${textX}" y="${y + 17}" text-anchor="${anchor}" font-size="15" font-weight="700" fill="#173c7a">${text}</text>
  </g>`;
}

function pointOnEllipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  degrees: number,
) {
  const radians = degrees * Math.PI / 180;
  return {
    x: cx + rx * Math.cos(radians),
    y: cy - ry * Math.sin(radians),
  };
}

function dimensionMarkup(
  state: MenCp011State,
  role: MenCp011DiagramRole,
  markerId: string,
  geometry: {
    cx: number;
    topCy: number;
    outerRx: number;
    outerRy: number;
    innerRx: number;
    innerRy: number;
  },
) {
  const { cx, topCy, outerRx, outerRy, innerRx, innerRy } = geometry;
  const labels = expectedDiagramLabels(state, role);
  const outerLabel = labels[0]!;
  const innerLabel = labels[1]!;
  const blue = "#1d4ed8";
  const guide = "#8ea3b8";

  if (state.representation === "DIAMETERS") {
    const outerY = topCy - outerRy - 36;
    const innerY = topCy + outerRy + 34;
    return `<g data-dimension-group="diameters" data-scope="top-face-clear">
      <line x1="${cx - outerRx}" y1="${topCy}" x2="${cx - outerRx}" y2="${outerY}" stroke="${guide}" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line x1="${cx + outerRx}" y1="${topCy}" x2="${cx + outerRx}" y2="${outerY}" stroke="${guide}" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line data-dimension="outer-diameter" data-orientation="horizontal" x1="${cx - outerRx}" y1="${outerY}" x2="${cx + outerRx}" y2="${outerY}" stroke="${blue}" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${svgLabelBox(cx, outerY - 32, outerLabel)}
      <line x1="${cx - innerRx}" y1="${topCy}" x2="${cx - innerRx}" y2="${innerY}" stroke="${guide}" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line x1="${cx + innerRx}" y1="${topCy}" x2="${cx + innerRx}" y2="${innerY}" stroke="${guide}" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line data-dimension="inner-diameter" data-orientation="horizontal" x1="${cx - innerRx}" y1="${innerY}" x2="${cx + innerRx}" y2="${innerY}" stroke="${blue}" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${svgLabelBox(cx, innerY + 9, innerLabel)}
    </g>`;
  }

  const outerEnd = { x: cx + outerRx, y: topCy };
  const innerEnd = pointOnEllipse(cx, topCy, innerRx, innerRy, 145);
  const outerLabelX = cx + Math.round(outerRx * 0.52);
  const outerLabelY = topCy - outerRy - 42;
  const innerLabelX = cx - Math.round(innerRx * 0.48);
  const innerLabelY = topCy - innerRy - 42;

  let markup = `<g data-dimension-group="radii" data-scope="centre-connected">
    <circle data-role="top-centre" cx="${cx}" cy="${topCy}" r="3.5" fill="${blue}"/>
    <text data-role="centre-label" x="${cx - 14}" y="${topCy - 9}" font-size="14" font-weight="700" fill="#173c7a">O</text>
    <line data-dimension="outer-radius" data-orientation="centre-connected" x1="${cx}" y1="${topCy}" x2="${outerEnd.x}" y2="${outerEnd.y}" stroke="${blue}" stroke-width="2.4" marker-end="url(#${markerId})"/>
    <line data-role="outer-radius-label-leader" x1="${outerLabelX}" y1="${outerLabelY + 25}" x2="${cx + Math.round(outerRx * 0.55)}" y2="${topCy - 2}" stroke="${guide}" stroke-width="1.4"/>
    ${svgLabelBox(outerLabelX, outerLabelY, outerLabel)}
    <line data-dimension="inner-radius" data-orientation="centre-connected" x1="${cx}" y1="${topCy}" x2="${innerEnd.x.toFixed(1)}" y2="${innerEnd.y.toFixed(1)}" stroke="${blue}" stroke-width="2.4" marker-end="url(#${markerId})"/>
    <line data-role="inner-radius-label-leader" x1="${innerLabelX}" y1="${innerLabelY + 25}" x2="${((cx + innerEnd.x) / 2).toFixed(1)}" y2="${((topCy + innerEnd.y) / 2).toFixed(1)}" stroke="${guide}" stroke-width="1.4"/>
    ${svgLabelBox(innerLabelX, innerLabelY, innerLabel)}
  </g>`;

  if (state.representation === "OUTER_RADIUS_AND_THICKNESS") {
    const thicknessLabel = labels.find((label) => label.startsWith("t ="))!;
    const innerThicknessEnd = pointOnEllipse(cx, topCy, innerRx, innerRy, 215);
    const outerThicknessEnd = pointOnEllipse(cx, topCy, outerRx, outerRy, 215);
    const labelX = outerThicknessEnd.x - 54;
    const labelY = outerThicknessEnd.y + 24;
    markup += `<g data-dimension-group="thickness" data-scope="top-rim-clear">
      <line data-dimension="wall-thickness" data-orientation="radial" data-alignment="top-rim" x1="${innerThicknessEnd.x.toFixed(1)}" y1="${innerThicknessEnd.y.toFixed(1)}" x2="${outerThicknessEnd.x.toFixed(1)}" y2="${outerThicknessEnd.y.toFixed(1)}" stroke="${blue}" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      <line data-role="thickness-label-leader" x1="${labelX + 24}" y1="${labelY}" x2="${((innerThicknessEnd.x + outerThicknessEnd.x) / 2).toFixed(1)}" y2="${((innerThicknessEnd.y + outerThicknessEnd.y) / 2).toFixed(1)}" stroke="${guide}" stroke-width="1.4"/>
      ${svgLabelBox(labelX, labelY, thicknessLabel)}
    </g>`;
  }

  return markup;
}

function diagramFor(state: MenCp011State, role: MenCp011DiagramRole): MenCp011Diagram {
  const markerId = `arrow-exam-ready-${role.toLowerCase()}-${state.prototypeId.replaceAll("_", "-")}-${state.seed.replace(/[^A-Za-z0-9-]/g, "-")}`;
  const labels = expectedDiagramLabels(state, role);
  const heightLabel = labels.at(-1) ?? `h = ${state.height} cm`;
  const cx = 320;
  const topCy = 126;
  const bottomCy = 314;
  const outerRx = 148;
  const outerRy = 46;
  const radiusRatio = Number(state.innerRadius) / Number(state.outerRadius);
  const innerRx = Math.max(70, Math.min(124, Math.round(outerRx * radiusRatio)));
  const innerRy = Math.max(23, Math.min(39, Math.round(outerRy * radiusRatio)));
  const dimensionX = cx + outerRx + 92;
  const heightLabelX = dimensionX + 62;
  const dimensions = dimensionMarkup(state, role, markerId, {
    cx,
    topCy,
    outerRx,
    outerRy,
    innerRx,
    innerRy,
  });
  const derivedInnerRadiusHidden =
    role === "PROMPT" &&
    (state.representation === "OUTER_RADIUS_AND_THICKNESS" ||
      state.representation === "INVERSE_INNER_RADIUS");
  const legend = legendFor(state);

  const svg = `<svg class="men-cp011-diagram" data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2" data-diagram-role="${role}" data-responsive="true" data-derived-inner-radius="${derivedInnerRadiusHidden ? "hidden" : "revealed"}" data-closure="uncut-wall" viewBox="0 0 780 455" role="img" aria-label="ExamTree hollow cylindrical tube diagram">
  <title>Hollow cylindrical tube — ${role === "PROMPT" ? "question" : "solution"} view</title>
  <desc>A single uncut hollow cylindrical tube on a white background, not to scale. Radius guides begin at centre O and end at the measured boundary. Numeric labels are detached from dimension lines.</desc>
  <defs>
    <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="#1d4ed8"/></marker>
  </defs>
  <rect data-background="white" x="0" y="0" width="780" height="455" fill="#ffffff"/>
  <text x="390" y="20" text-anchor="middle" font-size="12" fill="#64748b">concept sketch · not to scale</text>
  <g data-view="single-closed-tube" data-object="hollow-cylinder" data-closure="uncut-wall">
    <ellipse data-region="top-outer-ellipse" cx="${cx}" cy="${topCy}" rx="${outerRx}" ry="${outerRy}" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <ellipse data-region="top-inner-ellipse" cx="${cx}" cy="${topCy}" rx="${innerRx}" ry="${innerRy}" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <line data-region="outer-left-wall" x1="${cx - outerRx}" y1="${topCy}" x2="${cx - outerRx}" y2="${bottomCy}" stroke="#111827" stroke-width="3"/>
    <line data-region="outer-right-wall" x1="${cx + outerRx}" y1="${topCy}" x2="${cx + outerRx}" y2="${bottomCy}" stroke="#111827" stroke-width="3"/>
    <line data-region="hidden-inner-left-wall" x1="${cx - innerRx}" y1="${topCy + 4}" x2="${cx - innerRx}" y2="${bottomCy}" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    <line data-region="hidden-inner-right-wall" x1="${cx + innerRx}" y1="${topCy + 4}" x2="${cx + innerRx}" y2="${bottomCy}" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    <ellipse data-region="bottom-outer-ellipse" cx="${cx}" cy="${bottomCy}" rx="${outerRx}" ry="${outerRy}" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <ellipse data-region="bottom-inner-hidden-ellipse" cx="${cx}" cy="${bottomCy}" rx="${innerRx}" ry="${innerRy}" fill="none" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    ${dimensions}
    <g data-dimension-group="height" data-position="outside-right">
      <line x1="${cx + outerRx}" y1="${topCy}" x2="${dimensionX}" y2="${topCy}" stroke="#8ea3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line x1="${cx + outerRx}" y1="${bottomCy}" x2="${dimensionX}" y2="${bottomCy}" stroke="#8ea3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
      <line data-dimension="pipe-length" data-orientation="vertical" x1="${dimensionX}" y1="${topCy}" x2="${dimensionX}" y2="${bottomCy}" stroke="#1d4ed8" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      ${svgLabelBox(heightLabelX, Math.round((topCy + bottomCy) / 2) - 13, heightLabel)}
    </g>
  </g>
  <g data-region="variable-legend" data-mobile-policy="collapse">
    <rect x="80" y="405" width="620" height="36" rx="8" fill="#ffffff" stroke="#1d4ed8" stroke-width="1.8"/>
    <text x="390" y="428" text-anchor="middle" font-size="14" font-weight="600" fill="#111827">${legend}</text>
  </g>
</svg>`;

  return {
    kind: "HOLLOW_CYLINDER",
    svg,
    accessibleText:
      role === "PROMPT"
        ? "Prompt-safe ExamTree hollow tube diagram. The centre O and all given dimensions are shown. Any inner radius that must be derived remains symbolic as r equals question mark. Labels are detached from measurement lines and the diagram is responsive."
        : "Solution ExamTree hollow tube diagram. The centre O, outer and inner boundaries, derived inner radius, wall thickness where relevant, and outside height are shown with detached labels.",
    visibleLabels: labels,
    notToScale: true,
  };
}

function studentWrongOptionAnalysis(traps: readonly string[]) {
  return traps.map((trap) => trap.replace(/\s*\[[A-Z0-9_]+\]$/, ""));
}

function learnerSolutionFor(
  question: MenCp011Package,
  explanation: MenCp011Explanation,
): MenCp011LearnerSolution {
  const state = question.state;
  const piMath = state.piPolicy === "EXACT_PI" ? "\\pi" : "\\frac{22}{7}";
  const R = state.outerRadius;
  const r = state.innerRadius;
  const h = state.height;
  const t = state.thickness;
  const ring = state.ringCoefficient;

  switch (state.representation) {
    case "RADII":
      return {
        formula: "$V=\\pi h(R^2-r^2)$",
        steps: [
          `$R^2-r^2=${R}^2-${r}^2=${ring}$`,
          `$V=${piMath}\\times${h}\\times${ring}=${question.answer}$`,
        ],
        finalAnswer: question.answer,
        shortcut: explanation.shortcut,
        wrongOptionAnalysis: studentWrongOptionAnalysis(explanation.traps),
      };
    case "DIAMETERS":
      return {
        formula: "$V=\\pi h(R^2-r^2)$",
        steps: [
          `$R=${state.outerDiameter}/2=${R}\\text{ cm},\\quad r=${state.innerDiameter}/2=${r}\\text{ cm}$`,
          `$V=${piMath}\\times${h}\\times(${R}^2-${r}^2)=${question.answer}$`,
        ],
        finalAnswer: question.answer,
        shortcut: explanation.shortcut,
        wrongOptionAnalysis: studentWrongOptionAnalysis(explanation.traps),
      };
    case "OUTER_RADIUS_AND_THICKNESS":
      return {
        formula: "$V=\\pi h(R^2-r^2)$ with $r=R-t$",
        steps: [
          `$r=R-t=${R}-${t}=${r}\\text{ cm}$`,
          `$V=${piMath}\\times${h}\\times(${R}^2-${r}^2)=${question.answer}$`,
        ],
        finalAnswer: question.answer,
        shortcut: explanation.shortcut,
        wrongOptionAnalysis: studentWrongOptionAnalysis(explanation.traps),
      };
    case "INVERSE_INNER_RADIUS":
      return {
        formula: "$r^2=R^2-\\frac{V}{\\pi h}$",
        steps: explanation.steps.map((step) => step.equation ?? step.body),
        finalAnswer: question.answer,
        shortcut: explanation.shortcut,
        wrongOptionAnalysis: studentWrongOptionAnalysis(explanation.traps),
      };
  }
}

function trapCodes(traps: readonly string[]) {
  return traps.map((trap) => {
    const match = trap.match(/\[([A-Z0-9_]+)\]$/);
    if (!match) throw new Error("MEN-CP-011 admin trap is missing its code.");
    return match[1]!;
  });
}

function learnerSolutionText(solution: MenCp011LearnerSolution) {
  return [
    solution.formula,
    ...solution.steps,
    solution.finalAnswer,
    solution.shortcut,
    ...solution.wrongOptionAnalysis,
  ].join("\n");
}

function texText(question: MenCp011ExamReadyPackage) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
    learnerSolutionText(question.learnerSolution),
  ].join("\n");
}

function rebuildValidation(
  base: MenCp011Package,
  question: Omit<MenCp011ExamReadyPackage, "validation">,
): MenCp011Package["validation"] {
  const replacedChecks = new Set([
    "four exact positive options",
    "four displayed options",
    "one correct option",
    "exam-speed shortcut",
    "option trap alignment",
    "unit-aware diagram",
    "no invented inverse dimension",
    "approved single-tube topology",
    "top-face measurement geometry",
    "learner-text cleanliness",
  ]);
  const retained = base.validation.checks.filter((check) => !replacedChecks.has(check.name));
  const promptSvg = question.diagram.svg;
  const solutionSvg = question.solutionDiagram.svg;
  const state = question.state;
  const promptMustHideDerivedInner =
    state.representation === "OUTER_RADIUS_AND_THICKNESS" ||
    state.representation === "INVERSE_INNER_RADIUS";
  const promptIntegrity =
    !promptMustHideDerivedInner ||
    (
      question.diagram.visibleLabels.includes("r = ?") &&
      !question.diagram.visibleLabels.includes(`r = ${state.innerRadius} cm`) &&
      !promptSvg.includes(`r = ${state.innerRadius} cm`)
    );
  const solutionParity =
    !promptMustHideDerivedInner ||
    (
      question.solutionDiagram.visibleLabels.includes(`r = ${state.innerRadius} cm`) &&
      solutionSvg.includes(`r = ${state.innerRadius} cm`)
    );
  const optionKeys = question.options.map((option) => `${option.display}|${option.misconceptionId ?? "CORRECT"}`);
  const adminTrapAlignment = question.options
    .filter((option) => !option.isCorrect)
    .every((option) =>
      question.explanation.traps.some((trap) =>
        trap.startsWith(`Option ${option.label} (${option.display}):`) &&
        trap.endsWith(`[${option.misconceptionId}]`),
      ),
    );
  const learnerText = learnerSolutionText(question.learnerSolution);
  const learnerWordCount = learnerText.trim().split(/\s+/).filter(Boolean).length;
  const allTex = texText({ ...question, validation: { valid: true, checks: [] } });

  const checks: ValidationCheck[] = [
    {
      name: "independent option permutation",
      passed:
        question.optionPermutationSeed.startsWith("MEN-CP011-OPTION-PERMUTATION-V2|") &&
        question.options.length === 4 &&
        new Set(optionKeys).size === 4 &&
        question.correctIndex >= 0 &&
        question.options[question.correctIndex]?.isCorrect === true &&
        question.answer === question.options[question.correctIndex]?.display,
      message: "Option placement must be generated by its own V2 seed namespace after the canonical options are created.",
    },
    {
      name: "admin trap alignment after permutation",
      passed: question.explanation.traps.length === 3 && adminTrapAlignment,
      message: "Every shuffled wrong option must retain the correct admin misconception code and displayed option label.",
    },
    {
      name: "prompt diagram derived-value safety",
      passed:
        question.diagram.svg.includes('data-diagram-role="PROMPT"') &&
        question.diagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"') &&
        promptIntegrity,
      message: "A prompt diagram may show only dimensions explicitly given in the stem; derived inner radius values must remain hidden.",
    },
    {
      name: "solution diagram reveal parity",
      passed:
        question.solutionDiagram.svg.includes('data-diagram-role="SOLUTION"') &&
        question.solutionDiagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_EXAM_READY_V2"') &&
        solutionParity,
      message: "The solution diagram may reveal the derived inner radius only after submission and must match the canonical state.",
    },
    {
      name: "centre-connected de-overlapped dimensions",
      passed:
        promptSvg.includes('data-label-placement="detached"') &&
        solutionSvg.includes('data-label-placement="detached"') &&
        (
          state.representation === "DIAMETERS" ||
          (
            promptSvg.includes('data-scope="centre-connected"') &&
            promptSvg.includes('data-role="top-centre"') &&
            promptSvg.includes('data-role="centre-label"')
          )
        ),
      message: "Radius guides must begin at centre O and numeric labels must be detached from measurement lines.",
    },
    {
      name: "responsive diagram contract",
      passed:
        promptSvg.includes('data-responsive="true"') &&
        solutionSvg.includes('data-responsive="true"') &&
        !/\bwidth="\d+/.test(promptSvg.match(/^<svg[^>]+>/)?.[0] ?? "") &&
        question.renderSurfaces.responsiveDiagramPolicy.minWidthPx === 0,
      message: "The SVG must be viewBox-driven with no fixed minimum width requirement for mobile rendering.",
    },
    {
      name: "attempt solution admin separation",
      passed:
        question.renderSurfaces.attempt.diagram === null &&
        question.renderSurfaces.practice.diagram === question.diagram &&
        question.renderSurfaces.solution.diagram === question.solutionDiagram &&
        question.renderSurfaces.admin.exposesInternalCodes &&
        !question.renderSurfaces.solution.exposesInternalCodes,
      message: "Attempt, practice, solution and admin data must be exposed through separate rendering contracts.",
    },
    {
      name: "learner metadata isolation",
      passed:
        !/\[[A-Z0-9_]+\]/.test(learnerText) &&
        !/\b[PR]:-?\d/.test(learnerText) &&
        question.renderSurfaces.admin.trapCodes.length === 3,
      message: "Trap codes and verifier tokens must remain admin metadata and must not appear in learner-facing solution text.",
    },
    {
      name: "concise learner solution",
      passed: learnerWordCount <= 180 && question.learnerSolution.steps.length >= 2,
      message: "The default learner solution must remain concise, while detailed teaching content stays available to admin and learning surfaces.",
    },
    {
      name: "tex lint",
      passed: lintTex(allTex),
      message: "Visible TeX must use supported commands, balanced delimiters and must never contain the invalid command \\pih.",
    },
  ];

  const combined = [...retained, ...checks];
  return { valid: combined.every((check) => check.passed), checks: combined };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011ExamReadyPackage {
  const base = generateApprovedMenCp011FoundationPrototype(prototypeId, seed);
  const repairedExplanation = repairExplanation(base.explanation);
  const optionPermutationSeed = `MEN-CP011-OPTION-PERMUTATION-V2|${seed}`;
  const permuted = permuteOptions(base, repairedExplanation, optionPermutationSeed);
  const promptDiagram = diagramFor(base.state, "PROMPT");
  const solutionDiagram = diagramFor(base.state, "SOLUTION");
  const partialForLearner = {
    ...base,
    options: permuted.options,
    correctIndex: permuted.correctIndex,
    answer: permuted.answer,
    explanation: permuted.explanation,
  };
  const learnerSolution = learnerSolutionFor(partialForLearner, permuted.explanation);
  const renderSurfaces: MenCp011RenderSurfaces = {
    attempt: {
      diagram: null,
      diagramPolicy: "HIDDEN_FOR_TEXT_COMPLETE_ITEM",
      exposesInternalCodes: false,
    },
    practice: {
      diagram: promptDiagram,
      diagramPolicy: "OPTIONAL_PROMPT_DIAGRAM",
      exposesInternalCodes: false,
    },
    solution: {
      diagram: solutionDiagram,
      explanation: learnerSolution,
      exposesInternalCodes: false,
    },
    admin: {
      diagram: solutionDiagram,
      explanation: permuted.explanation,
      trapCodes: trapCodes(permuted.explanation.traps),
      verification: base.verification,
      exposesInternalCodes: true,
    },
    responsiveDiagramPolicy: {
      width: "100%",
      minWidthPx: 0,
      height: "auto",
      compactLegendOnMobile: true,
    },
  };
  const partial: Omit<MenCp011ExamReadyPackage, "validation"> = {
    ...base,
    options: permuted.options,
    correctIndex: permuted.correctIndex,
    answer: permuted.answer,
    explanation: permuted.explanation,
    optionPermutationSeed,
    diagram: promptDiagram,
    solutionDiagram,
    learnerSolution,
    renderSurfaces,
  };
  return {
    ...partial,
    validation: rebuildValidation(base, partial),
  };
}

export { classifyMenCp011Difficulty };
