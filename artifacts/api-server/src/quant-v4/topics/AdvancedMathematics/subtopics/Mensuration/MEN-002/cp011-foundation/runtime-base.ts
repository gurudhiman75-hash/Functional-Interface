import {
  exactEquals,
  exactKey,
  formatExactMath,
  formatWithUnit,
  integerSquareRoot,
  isPositive,
  pi,
  rational,
  subtract,
} from "../foundation/exact";
import type { ExactPi, ExactRational, ExactValue } from "../foundation/types";
import { getMenCp011FoundationDefinition } from "./registry";
import type {
  MenCp011Diagram,
  MenCp011Explanation,
  MenCp011Option,
  MenCp011Package,
  MenCp011PiPolicy,
  MenCp011PrototypeId,
  MenCp011State,
  MenCp011SurfaceLedgerEntry,
} from "./types";

interface Candidate {
  value: ExactValue;
  misconceptionId: string | null;
  explanation: string;
}

const DIMENSION_STATES = [
  { outerRadius: 5n, innerRadius: 3n, height: 14n },
  { outerRadius: 7n, innerRadius: 4n, height: 21n },
  { outerRadius: 9n, innerRadius: 5n, height: 14n },
  { outerRadius: 10n, innerRadius: 6n, height: 7n },
  { outerRadius: 12n, innerRadius: 7n, height: 14n },
  { outerRadius: 14n, innerRadius: 9n, height: 21n },
  { outerRadius: 15n, innerRadius: 8n, height: 14n },
  { outerRadius: 18n, innerRadius: 11n, height: 7n },
] as const;

const LABELS = ["A", "B", "C", "D"] as const;

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

function piPolicyFor(seed: string): MenCp011PiPolicy {
  return hashText(`pi:${seed}`) % 2 === 0 ? "EXACT_PI" : "PI_22_OVER_7";
}

function piFactorMath(policy: MenCp011PiPolicy) {
  return policy === "EXACT_PI" ? "\\pi" : "\\frac{22}{7}";
}

function volumeFromCoefficient(policy: MenCp011PiPolicy, coefficient: bigint): ExactValue {
  return policy === "EXACT_PI"
    ? pi(coefficient)
    : rational(22n * coefficient, 7n);
}

function subtractVolumes(
  policy: MenCp011PiPolicy,
  outer: ExactValue,
  inner: ExactValue,
): ExactValue {
  if (policy === "EXACT_PI") {
    if (outer.kind !== "PI" || inner.kind !== "PI") {
      throw new Error("Exact-pi volume subtraction requires two pi values.");
    }
    const coefficient = subtract(outer.coefficient, inner.coefficient);
    return pi(coefficient.numerator, coefficient.denominator);
  }
  if (outer.kind !== "RATIONAL" || inner.kind !== "RATIONAL") {
    throw new Error("Declared 22/7 volume subtraction requires rational values.");
  }
  return subtract(outer, inner);
}

function recoverVolumeCoefficient(value: ExactValue, policy: MenCp011PiPolicy) {
  if (policy === "EXACT_PI") {
    if (value.kind !== "PI" || value.coefficient.denominator !== 1n) {
      throw new Error("The inverse exact-pi state must have an integral pi coefficient.");
    }
    return value.coefficient.numerator;
  }
  if (value.kind !== "RATIONAL") {
    throw new Error("The inverse 22/7 state must have a rational material volume.");
  }
  const numerator = value.numerator * 7n;
  const denominator = value.denominator * 22n;
  if (numerator % denominator !== 0n) {
    throw new Error("The generated material volume does not recover an integral pi-free coefficient.");
  }
  return numerator / denominator;
}

function classifyDifficulty(prototypeId: MenCp011PrototypeId) {
  switch (prototypeId) {
    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME": return "Easy" as const;
    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS": return "Medium" as const;
    case "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS": return "Medium" as const;
    case "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": return "Hard" as const;
  }
}

function surfaceLedger(): readonly MenCp011SurfaceLedgerEntry[] {
  return [
    {
      surfaceId: "OUTER_CURVED",
      shapeOwner: "OUTER_CYLINDER",
      kind: "CURVED",
      location: "OUTER",
      status: "EXPOSED",
      contributionSign: 1,
      reason: "The outside curved wall is exposed.",
    },
    {
      surfaceId: "INNER_CURVED",
      shapeOwner: "INNER_VOID",
      kind: "CURVED",
      location: "INNER",
      status: "EXPOSED",
      contributionSign: 1,
      reason: "The drilled cylindrical wall is the exposed inside surface.",
    },
    {
      surfaceId: "NEAR_ANNULAR_END",
      shapeOwner: "MATERIAL_RING",
      kind: "PLANE",
      location: "CUT",
      status: "EXPOSED",
      contributionSign: 1,
      reason: "The near open end exposes an annular metal face.",
    },
    {
      surfaceId: "FAR_ANNULAR_END",
      shapeOwner: "MATERIAL_RING",
      kind: "PLANE",
      location: "CUT",
      status: "EXPOSED",
      contributionSign: 1,
      reason: "The far open end exposes an annular metal face.",
    },
  ] as const;
}

function createState(prototypeId: MenCp011PrototypeId, seed: string): MenCp011State {
  const definition = getMenCp011FoundationDefinition(prototypeId);
  const dimensions = choose(DIMENSION_STATES, `dimensions:${prototypeId}:${seed}`);
  const outerRadius = dimensions.outerRadius;
  const innerRadius = dimensions.innerRadius;
  const height = dimensions.height;
  const thickness = outerRadius - innerRadius;
  const ringCoefficient = outerRadius ** 2n - innerRadius ** 2n;
  const piPolicy = piPolicyFor(`${prototypeId}:${seed}`);
  return {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    permanentQlId: null,
    waveId: "MEN-CP-011-FOUNDATION-WAVE-01",
    prototypeId,
    solveMode: definition.solveMode,
    target: definition.target,
    representation: definition.representation,
    seed,
    difficulty: classifyDifficulty(prototypeId),
    piPolicy,
    unit: definition.target === "LENGTH" ? "cm" : "cm³",
    outerRadius,
    innerRadius,
    height,
    thickness,
    outerDiameter: 2n * outerRadius,
    innerDiameter: 2n * innerRadius,
    ringCoefficient,
    materialVolume: volumeFromCoefficient(piPolicy, height * ringCoefficient),
    surfaceLedger: surfaceLedger(),
  };
}

function policySentence(policy: MenCp011PiPolicy) {
  return policy === "EXACT_PI"
    ? "Leave $\\pi$ in exact form."
    : "Use $\\pi=\\frac{22}{7}$.";
}

function dimension(value: bigint) {
  return `$${value}\\text{ cm}$`;
}

function createStem(state: MenCp011State) {
  const policy = policySentence(state.piPolicy);
  const R = dimension(state.outerRadius);
  const r = dimension(state.innerRadius);
  const h = dimension(state.height);
  const D = dimension(state.outerDiameter);
  const d = dimension(state.innerDiameter);
  const t = dimension(state.thickness);
  const V = formatWithUnit(state.materialVolume, "cm³");

  const variants: Record<MenCp011PrototypeId, readonly string[]> = {
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME": [
      `A hollow metallic pipe has outer radius ${R}, inner radius ${r}, and length ${h}. Find the volume of metal used. ${policy}`,
      `A cylindrical tube is ${h} long. Its outer and inner radii are ${R} and ${r}. What volume of material forms the tube? ${policy}`,
      `The outside radius of a pipe is ${R}, the inside radius is ${r}, and its length is ${h}. Determine the metal volume. ${policy}`,
      `A smaller cylindrical void of radius ${r} runs through a solid cylinder of radius ${R} and height ${h}. Find the remaining material volume. ${policy}`,
    ],
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS": [
      `A hollow pipe has outer diameter ${D}, inner diameter ${d}, and length ${h}. Find the volume of metal used. ${policy}`,
      `The external and internal diameters of a cylindrical tube are ${D} and ${d}. If its length is ${h}, determine its material volume. ${policy}`,
      `A tube of length ${h} measures ${D} across the outside and ${d} across the hollow opening. What volume of metal does it contain? ${policy}`,
      `Find the metal volume of a hollow cylinder whose outer diameter is ${D}, inner diameter is ${d}, and height is ${h}. ${policy}`,
    ],
    "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS": [
      `A pipe has outer radius ${R}, uniform thickness ${t}, and length ${h}. Find the volume of metal used. ${policy}`,
      `The outside radius of a cylindrical tube is ${R}. Its wall is ${t} thick and its length is ${h}. Determine the material volume. ${policy}`,
      `A hollow cylinder is ${h} long, has outer radius ${R}, and has uniform radial thickness ${t}. What is the volume of its metal wall? ${policy}`,
      `A pipe of length ${h} has outer radius ${R} and wall thickness ${t}. Calculate the metal remaining after the central void is removed. ${policy}`,
    ],
    "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": [
      `A hollow pipe has outer radius ${R}, length ${h}, and metal volume ${V}. Find its inner radius. ${policy}`,
      `The outer radius and length of a cylindrical tube are ${R} and ${h}. If the tube contains ${V} of metal, determine the radius of the hollow opening. ${policy}`,
      `A pipe uses ${V} of metal. Its outside radius is ${R} and its length is ${h}. What is the inner radius? ${policy}`,
      `The material volume of a hollow cylinder is ${V}; its outer radius is ${R} and height is ${h}. Find the radius of the central cylindrical void. ${policy}`,
    ],
  };
  return choose(variants[state.prototypeId], `stem:${state.prototypeId}:${state.seed}`);
}

function candidatesFor(state: MenCp011State): Candidate[] {
  const outerOnly = volumeFromCoefficient(
    state.piPolicy,
    state.height * state.outerRadius ** 2n,
  );
  const innerOnly = volumeFromCoefficient(
    state.piPolicy,
    state.height * state.innerRadius ** 2n,
  );
  const thicknessSquare = volumeFromCoefficient(
    state.piPolicy,
    state.height * state.thickness ** 2n,
  );

  switch (state.prototypeId) {
    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME":
      return [
        { value: state.materialVolume, misconceptionId: null, explanation: "" },
        {
          value: outerOnly,
          misconceptionId: "USED_OUTER_SOLID_VOLUME_ONLY",
          explanation: "using the complete outer cylinder and forgetting to subtract the inner empty cylinder",
        },
        {
          value: innerOnly,
          misconceptionId: "CALCULATED_INNER_VOID_ONLY",
          explanation: "calculating only the empty inner cylinder instead of the metal remaining",
        },
        {
          value: thicknessSquare,
          misconceptionId: "SUBTRACTED_RADII_BEFORE_SQUARING",
          explanation: "using $\\pi h(R-r)^2$ instead of $\\pi h(R^2-r^2)$",
        },
      ];

    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS":
      return [
        { value: state.materialVolume, misconceptionId: null, explanation: "" },
        {
          value: volumeFromCoefficient(
            state.piPolicy,
            state.height * (state.outerDiameter ** 2n - state.innerDiameter ** 2n),
          ),
          misconceptionId: "USED_DIAMETERS_AS_RADII",
          explanation: "substituting both diameters directly as radii, making the ring cross-section four times too large",
        },
        {
          value: outerOnly,
          misconceptionId: "USED_OUTER_SOLID_VOLUME_ONLY",
          explanation: "halving the outer diameter correctly but keeping the entire outer cylinder",
        },
        {
          value: innerOnly,
          misconceptionId: "CALCULATED_INNER_VOID_ONLY",
          explanation: "halving the inner diameter and reporting only the hollow-space volume",
        },
      ];

    case "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS":
      return [
        { value: state.materialVolume, misconceptionId: null, explanation: "" },
        {
          value: outerOnly,
          misconceptionId: "USED_OUTER_SOLID_VOLUME_ONLY",
          explanation: "using the full outer cylinder without removing the inner void",
        },
        {
          value: volumeFromCoefficient(
            state.piPolicy,
            state.height * (state.outerRadius ** 2n - state.thickness ** 2n),
          ),
          misconceptionId: "USED_THICKNESS_AS_INNER_RADIUS",
          explanation: "treating wall thickness as the inner radius instead of first using $r=R-t$",
        },
        {
          value: innerOnly,
          misconceptionId: "CALCULATED_INNER_VOID_ONLY",
          explanation: "finding the derived inner radius correctly but reporting the hollow-space volume",
        },
      ];

    case "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME":
      return [
        { value: rational(state.innerRadius), misconceptionId: null, explanation: "" },
        {
          value: rational(state.thickness),
          misconceptionId: "RETURNED_THICKNESS_INSTEAD_OF_INNER_RADIUS",
          explanation: "returning $R-r$, the wall thickness, instead of the required inner radius",
        },
        {
          value: rational(state.innerDiameter),
          misconceptionId: "RETURNED_INNER_DIAMETER",
          explanation: "doubling the recovered inner radius and reporting the inner diameter",
        },
        {
          value: rational(state.outerRadius),
          misconceptionId: "USED_OUTER_RADIUS_AS_INNER_RADIUS",
          explanation: "copying the given outer radius without using the material-volume evidence",
        },
      ];
  }
}

function createOptions(state: MenCp011State) {
  const candidates = candidatesFor(state);
  const keys = candidates.map((candidate) => exactKey(candidate.value));
  if (new Set(keys).size !== 4) {
    throw new Error(`${state.prototypeId} generated duplicate exact option values for ${state.seed}.`);
  }
  const correct = candidates[0]!;
  const wrong = candidates.slice(1);
  const correctIndex = hashText(`option-order:${state.prototypeId}:${state.seed}`) % 4;
  const ordered = [...wrong];
  ordered.splice(correctIndex, 0, correct);
  const options: MenCp011Option[] = ordered.map((candidate, index) => ({
    label: LABELS[index]!,
    value: candidate.value,
    display: formatWithUnit(candidate.value, state.unit),
    isCorrect: candidate.misconceptionId === null,
    misconceptionId: candidate.misconceptionId,
  }));
  const explanations = new Map(
    candidates.slice(1).map((candidate) => [exactKey(candidate.value), candidate.explanation]),
  );
  const traps = options
    .filter((option) => !option.isCorrect)
    .map((option) => {
      const explanation = explanations.get(exactKey(option.value));
      return `Option ${option.label} (${option.display}): This result comes from ${explanation}. [${option.misconceptionId}]`;
    });
  return { options, correctIndex, traps };
}

function resultMath(state: MenCp011State, value: ExactValue) {
  const unit = state.unit === "cm³" ? "\\text{ cm}^{3}" : "\\text{ cm}";
  return `${formatExactMath(value)}${unit}`;
}

function explanationFor(state: MenCp011State, traps: string[]): MenCp011Explanation {
  const R = state.outerRadius;
  const r = state.innerRadius;
  const h = state.height;
  const t = state.thickness;
  const D = state.outerDiameter;
  const d = state.innerDiameter;
  const piMath = piFactorMath(state.piPolicy);
  const volume = resultMath(state, state.materialVolume);

  const keyRule = "Think of a thick solid rod with a smaller cylinder drilled straight through the centre. The metal remaining equals outer cylinder volume minus inner empty-cylinder volume: $V=\\pi R^2h-\\pi r^2h=\\pi h(R^2-r^2)$. Here, $R$ is outer radius, $r$ is inner radius, $h$ is pipe length, and $t=R-r$ is radial wall thickness.";

  switch (state.prototypeId) {
    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME":
      return {
        keyRule,
        steps: [
          {
            title: "Find the Metal Ring Cross-section",
            body: `Subtract the inner circular area coefficient from the outer one. Unit check: $R^2-r^2$ is a cross-sectional area in $\\text{cm}^2$.`,
            equation: `$$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Extend the Ring through the Pipe Length",
            body: `Multiply the ring area by length and the declared value of $\\pi$. Unit check: $\\text{cm}^2\\times\\text{cm}=\\text{cm}^3$.`,
            equation: `$$V=${piMath}\\times${h}\\text{ cm}\\times${state.ringCoefficient}\\text{ cm}^2=${volume}$$`,
          },
        ],
        shortcut: `⚡ Exam speed: use $R^2-r^2=(R-r)(R+r)=(${R}-${r})(${R}+${r})=${t}\\times${R + r}=${state.ringCoefficient}$ before multiplying by $${piMath}h$.`,
        traps,
      };

    case "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS":
      return {
        keyRule,
        steps: [
          {
            title: "Convert Diameters to Radii",
            body: `Halve each stated diameter before using a cylinder formula. Unit check: diameter and radius are both lengths in $\\text{cm}$.`,
            equation: `$$R=\\frac{${D}}{2}=${R}\\text{ cm},\\qquad r=\\frac{${d}}{2}=${r}\\text{ cm}$$`,
          },
          {
            title: "Find the Ring Cross-section",
            body: `Subtract the squared radii. Unit check: the difference is an area in $\\text{cm}^2$.`,
            equation: `$$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Find the Material Volume",
            body: `Multiply the cross-sectional ring area by pipe length and $\\pi$. Unit check: $\\text{cm}^2\\times\\text{cm}=\\text{cm}^3$.`,
            equation: `$$V=${piMath}\\times${h}\\text{ cm}\\times${state.ringCoefficient}\\text{ cm}^2=${volume}$$`,
          },
        ],
        shortcut: `⚡ Exam speed: either halve both diameters first or use $R^2-r^2=\\frac{D^2-d^2}{4}$; never substitute a diameter directly as a radius.`,
        traps,
      };

    case "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS":
      return {
        keyRule,
        steps: [
          {
            title: "Recover the Inner Radius",
            body: `Radial thickness is removed once from the outer radius. Unit check: $R$ and $t$ are lengths in $\\text{cm}$.`,
            equation: `$$r=R-t=${R}-${t}=${r}\\text{ cm}$$`,
          },
          {
            title: "Find the Ring Cross-section",
            body: `Use the outer and recovered inner radii. Unit check: $R^2-r^2$ is measured in $\\text{cm}^2$.`,
            equation: `$$R^2-r^2=${R}^2-${r}^2=${state.ringCoefficient}\\text{ cm}^2$$`,
          },
          {
            title: "Find the Material Volume",
            body: `Multiply by pipe length and the declared $\\pi$ policy. Unit check: area times length gives $\\text{cm}^3$.`,
            equation: `$$V=${piMath}\\times${h}\\text{ cm}\\times${state.ringCoefficient}\\text{ cm}^2=${volume}$$`,
          },
        ],
        shortcut: `⚡ Exam speed: with $r=R-t$, write $R^2-r^2=(R-r)(R+r)=t(2R-t)=${t}(2\\times${R}-${t})=${state.ringCoefficient}$.`,
        traps,
      };

    case "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": {
      const coefficient = recoverVolumeCoefficient(state.materialVolume, state.piPolicy);
      const recoveredRing = coefficient / h;
      const innerSquared = R ** 2n - recoveredRing;
      return {
        keyRule,
        steps: [
          {
            title: "Remove the Common $\\pi h$ Factor",
            body: `Divide the material-volume evidence by $\\pi h$ to recover $R^2-r^2$. Unit check: $\\text{cm}^3\\div\\text{cm}=\\text{cm}^2$.`,
            equation: `$$R^2-r^2=\\frac{V}{${piMath}h}=\\frac{${formatExactMath(state.materialVolume)}}{${piMath}\\times${h}}=${recoveredRing}\\text{ cm}^2$$`,
          },
          {
            title: "Isolate the Inner Radius Squared",
            body: `Subtract the recovered ring coefficient from $R^2$. Unit check: both terms are square centimetres.`,
            equation: `$$r^2=R^2-${recoveredRing}=${R}^2-${recoveredRing}=${innerSquared}\\text{ cm}^2$$`,
          },
          {
            title: "Take the Positive Physical Root",
            body: `A radius must be positive and smaller than the outer radius. Unit check: the square root of $\\text{cm}^2$ is $\\text{cm}$.`,
            equation: `$$r=\\sqrt{${innerSquared}}=${r}\\text{ cm}$$`,
          },
        ],
        shortcut: `⚡ Exam speed: cancel the declared $\\pi$ factor and the length first, then recognise the perfect square for $r^2$; reject the negative root because a physical radius is positive.`,
        traps,
      };
    }
  }
}

function diagramFor(state: MenCp011State): MenCp011Diagram {
  const markerId = `arrow-${hashText(`${state.prototypeId}:${state.seed}`).toString(16)}`;
  const labels = state.representation === "DIAMETERS"
    ? [`D = ${state.outerDiameter} cm`, `d = ${state.innerDiameter} cm`, `h = ${state.height} cm`]
    : state.representation === "OUTER_RADIUS_AND_THICKNESS"
      ? [`R = ${state.outerRadius} cm`, `r = ${state.innerRadius} cm`, `t = ${state.thickness} cm`, `h = ${state.height} cm`]
      : state.representation === "INVERSE_INNER_RADIUS"
        ? [`R = ${state.outerRadius} cm`, "r = ?", `h = ${state.height} cm`]
        : [`R = ${state.outerRadius} cm`, `r = ${state.innerRadius} cm`, `h = ${state.height} cm`];
  const [outerLabel, innerLabel, ...remaining] = labels;
  const heightLabel = remaining.at(-1) ?? `h = ${state.height} cm`;
  const thicknessLabel = state.representation === "OUTER_RADIUS_AND_THICKNESS"
    ? labels.find((label) => label.startsWith("t ="))
    : undefined;
  const svg = `<svg class="men-cp011-diagram" viewBox="0 0 560 300" role="img" aria-label="Hollow cylindrical pipe with an outer material wall and an empty central cylindrical void">
  <title>Hollow cylindrical pipe</title>
  <desc>A concept sketch, not to scale, showing the outer boundary, concentric inner void and pipe length.</desc>
  <defs>
    <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#2457d6"/></marker>
  </defs>
  <path d="M135 65 L395 65 L455 110 L195 110 Z" fill="#dfe9ff" stroke="#204b9b" stroke-width="3"/>
  <path d="M135 65 L135 215 L195 255 L195 110" fill="#c7d8ff" stroke="#204b9b" stroke-width="3"/>
  <path d="M195 110 L455 110 L455 255 L195 255 Z" fill="#e8efff" stroke="#204b9b" stroke-width="3"/>
  <ellipse cx="195" cy="182" rx="60" ry="73" fill="#dfe9ff" stroke="#204b9b" stroke-width="3"/>
  <ellipse cx="195" cy="182" rx="31" ry="40" fill="#ffffff" stroke="#526477" stroke-width="3"/>
  <path d="M195 182 L252 182" stroke="#2457d6" stroke-width="2" marker-end="url(#${markerId})"/>
  <text x="270" y="176" font-size="15" font-weight="700" fill="#173c7a">${outerLabel}</text>
  <path d="M195 182 L225 182" stroke="#64748b" stroke-width="2" marker-end="url(#${markerId})"/>
  <text x="237" y="205" font-size="15" font-weight="700" fill="#334155">${innerLabel}</text>
  <path d="M208 274 L444 274" stroke="#2457d6" stroke-width="2" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
  <text x="326" y="294" text-anchor="middle" font-size="15" font-weight="700" fill="#173c7a">${heightLabel}</text>
  ${thicknessLabel ? `<text x="112" y="182" text-anchor="end" font-size="15" font-weight="700" fill="#8a4d00">${thicknessLabel}</text>` : ""}
  <text x="360" y="42" text-anchor="middle" font-size="14" fill="#5d6b82">material wall</text>
  <text x="195" y="187" text-anchor="middle" font-size="12" fill="#64748b">empty void</text>
  <text x="280" y="22" text-anchor="middle" font-size="13" fill="#5d6b82">concept sketch · not to scale</text>
</svg>`;
  return {
    kind: "HOLLOW_CYLINDER",
    svg,
    accessibleText: "A hollow cylindrical pipe. The shaded outer region is material and the concentric white centre is an empty cylindrical void.",
    visibleLabels: labels,
    notToScale: true,
  };
}

function independentVerification(state: MenCp011State, answer: ExactValue) {
  if (state.target === "VOLUME") {
    const outer = volumeFromCoefficient(
      state.piPolicy,
      state.height * state.outerRadius ** 2n,
    );
    const inner = volumeFromCoefficient(
      state.piPolicy,
      state.height * state.innerRadius ** 2n,
    );
    const reconstructed = subtractVolumes(state.piPolicy, outer, inner);
    return {
      valid: exactEquals(reconstructed, answer),
      method: "independently computed the complete outer cylinder and inner void, then subtracted the two exact volumes",
      reconstructed: exactKey(reconstructed),
    };
  }
  const recoveredCoefficient = recoverVolumeCoefficient(state.materialVolume, state.piPolicy);
  if (recoveredCoefficient % state.height !== 0n) {
    return {
      valid: false,
      method: "independently removed the declared pi factor and pipe length",
      reconstructed: "non-integral ring coefficient",
    };
  }
  const innerSquared = state.outerRadius ** 2n - recoveredCoefficient / state.height;
  const recoveredRadius = integerSquareRoot(innerSquared);
  const reconstructed = recoveredRadius === null ? rational(-1n) : rational(recoveredRadius);
  return {
    valid: exactEquals(reconstructed, answer),
    method: "independently recovered the cross-sectional ring area and took the positive integer square root",
    reconstructed: exactKey(reconstructed),
  };
}

function expectedDiagramLabels(state: MenCp011State) {
  switch (state.representation) {
    case "DIAMETERS":
      return [`D = ${state.outerDiameter} cm`, `d = ${state.innerDiameter} cm`, `h = ${state.height} cm`];
    case "OUTER_RADIUS_AND_THICKNESS":
      return [`R = ${state.outerRadius} cm`, `r = ${state.innerRadius} cm`, `t = ${state.thickness} cm`, `h = ${state.height} cm`];
    case "INVERSE_INNER_RADIUS":
      return [`R = ${state.outerRadius} cm`, "r = ?", `h = ${state.height} cm`];
    case "RADII":
      return [`R = ${state.outerRadius} cm`, `r = ${state.innerRadius} cm`, `h = ${state.height} cm`];
  }
}

function validatePackage(question: Omit<MenCp011Package, "validation">) {
  const state = question.state;
  const learnerText = [
    question.stem,
    ...question.options.map((option) => option.display),
    question.answer,
    question.explanation.keyRule,
    ...question.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
    question.explanation.shortcut,
    ...question.explanation.traps,
    question.diagram.accessibleText,
    ...question.diagram.visibleLabels,
  ].join("\n");
  const optionByLabel = new Map(question.options.map((option) => [option.label, option]));
  const trapAlignment = question.explanation.traps.every((trap) => {
    const match = trap.match(/^Option ([A-D]) \((.+)\):.*\[([A-Z0-9_]+)\]$/);
    if (!match) return false;
    const option = optionByLabel.get(match[1] as MenCp011Option["label"]);
    return Boolean(
      option &&
      !option.isCorrect &&
      match[2] === option.display &&
      match[3] === option.misconceptionId,
    );
  });
  const reconstructedMaterial = volumeFromCoefficient(
    state.piPolicy,
    state.height * (state.outerRadius ** 2n - state.innerRadius ** 2n),
  );
  const diagramLabels = expectedDiagramLabels(state);
  const diagramUnitSafe = question.diagram.visibleLabels.every((label) =>
    !/\d/.test(label) || /\bcm\b/.test(label),
  );
  const inverseDiagramSafe = state.representation !== "INVERSE_INNER_RADIUS" ||
    (question.diagram.visibleLabels.includes("r = ?") &&
      !question.diagram.visibleLabels.includes(`r = ${state.innerRadius} cm`));
  const policyConsistent = state.piPolicy === "EXACT_PI"
    ? question.stem.includes("exact form") && !question.stem.includes("22}{7")
    : question.stem.includes("22}{7");
  const checks = [
    {
      name: "physical inner-outer constraint",
      passed: state.innerRadius > 0n && state.outerRadius > state.innerRadius,
      message: "The inner radius must be positive and strictly smaller than the outer radius.",
    },
    {
      name: "thickness consistency",
      passed:
        state.thickness === state.outerRadius - state.innerRadius &&
        state.outerDiameter === 2n * state.outerRadius &&
        state.innerDiameter === 2n * state.innerRadius,
      message: "Radius, diameter and radial-thickness representations must describe one physical pipe.",
    },
    {
      name: "material-volume reconstruction",
      passed:
        state.ringCoefficient === state.outerRadius ** 2n - state.innerRadius ** 2n &&
        exactEquals(reconstructedMaterial, state.materialVolume),
      message: "Material volume must equal outer cylinder volume minus inner cylindrical void.",
    },
    {
      name: "surface-ledger consistency",
      passed:
        state.surfaceLedger.length === 4 &&
        new Set(state.surfaceLedger.map((entry) => entry.surfaceId)).size === 4 &&
        state.surfaceLedger.every((entry) => entry.status === "EXPOSED" && entry.contributionSign === 1),
      message: "The hollow pipe must retain distinct outer, inner and annular-end surface authorities.",
    },
    {
      name: "independent verifier",
      passed: question.verification.valid,
      message: "A materially separate exact reconstruction must agree with the declared answer.",
    },
    {
      name: "four exact positive options",
      passed:
        question.options.length === 4 &&
        new Set(question.options.map((option) => exactKey(option.value))).size === 4 &&
        question.options.every((option) => isPositive(option.value)),
      message: "Exactly four unique positive dimensionally compatible options are required.",
    },
    {
      name: "four displayed options",
      passed: new Set(question.options.map((option) => option.display)).size === 4,
      message: "All displayed options must remain unique after unit formatting.",
    },
    {
      name: "one correct option",
      passed:
        question.options.filter((option) => option.isCorrect).length === 1 &&
        question.options[question.correctIndex]?.isCorrect === true &&
        question.answer === question.options[question.correctIndex]?.display,
      message: "Exactly one option must be correct at the declared answer position.",
    },
    {
      name: "visual shape first",
      passed: /^(Think|Picture)\b/.test(question.explanation.keyRule),
      message: "The explanation must open with a physical mental picture before formula use.",
    },
    {
      name: "formula variable meanings",
      passed:
        question.explanation.keyRule.includes("$V=") &&
        question.explanation.keyRule.includes("Here, $R$") &&
        question.explanation.keyRule.includes("$t=R-r$"),
      message: "The governing operation and all pipe variables must be defined.",
    },
    {
      name: "unit-preserving every step",
      passed:
        question.explanation.steps.length >= 2 &&
        question.explanation.steps.every((step) => step.body.includes("Unit check:")),
      message: "Every worked step must state its dimensional meaning.",
    },
    {
      name: "exam-speed shortcut",
      passed:
        question.explanation.shortcut.startsWith("⚡ Exam speed:") &&
        (state.target === "LENGTH" || question.explanation.shortcut.includes("R^2-r^2")),
      message: "Every package needs a state-valid time-saving method.",
    },
    {
      name: "option trap alignment",
      passed:
        question.explanation.traps.length === 3 &&
        trapAlignment &&
        question.explanation.traps.every((trap) => !/FALLBACK_|UNCLASSIFIED|GENERAL_CALCULATION_ERROR/.test(trap)),
      message: "Each shuffled wrong option must carry its exact public misconception code.",
    },
    {
      name: "unit-aware diagram",
      passed:
        question.diagram.kind === "HOLLOW_CYLINDER" &&
        question.diagram.notToScale &&
        question.diagram.svg.includes("empty void") &&
        question.diagram.svg.includes("not to scale") &&
        diagramUnitSafe &&
        diagramLabels.every((label) => question.diagram.visibleLabels.includes(label)),
      message: "The deterministic diagram must match the canonical state and retain physical units.",
    },
    {
      name: "no invented inverse dimension",
      passed: inverseDiagramSafe,
      message: "An unknown inner radius must remain symbolic in the question diagram.",
    },
    {
      name: "declared pi policy",
      passed: policyConsistent,
      message: "Stem and exact arithmetic must use the same declared pi policy.",
    },
    {
      name: "state-derived difficulty",
      passed: question.difficulty === classifyDifficulty(question.prototypeId),
      message: "Difficulty must derive from the reasoning representation.",
    },
    {
      name: "learner-text cleanliness",
      passed:
        !/misconceptionId|MEN-CP011-PROT|FALLBACK_/.test(learnerText) &&
        !/[£€¥]/.test(learnerText) &&
        !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText),
      message: "Internal IDs, foreign currency and hidden control characters are forbidden in learner text.",
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
      message: "Foundation prototypes must remain review-only and unavailable to product surfaces.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011Package {
  if (!seed.trim()) throw new Error("MEN-CP-011 foundation generation requires a non-empty deterministic seed.");
  const state = createState(prototypeId, seed);
  const { options, correctIndex, traps } = createOptions(state);
  const exactAnswer = state.target === "VOLUME"
    ? state.materialVolume
    : rational(state.innerRadius);
  const explanation = explanationFor(state, traps);
  const diagram = diagramFor(state);
  const verification = independentVerification(state, exactAnswer);
  const partial = {
    packageId: "MEN-002" as const,
    canonicalProblemId: "MEN-CP-011" as const,
    permanentQlId: null,
    waveId: "MEN-CP-011-FOUNDATION-WAVE-01" as const,
    prototypeId,
    solveMode: state.solveMode,
    language: "en" as const,
    seed,
    difficulty: state.difficulty,
    target: state.target,
    piPolicy: state.piPolicy,
    stem: createStem(state),
    options,
    correctIndex,
    answer: options[correctIndex]!.display,
    exactAnswer,
    unit: state.unit,
    explanation,
    diagram,
    state,
    verification,
    reviewStatus: "UNREVIEWED" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
  };
  return { ...partial, validation: validatePackage(partial) };
}

export { classifyDifficulty as classifyMenCp011Difficulty };
