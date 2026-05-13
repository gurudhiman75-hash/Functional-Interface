import type {
  DifficultyLabel,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type { OptionResult } from "../shared";
import {
  createReasoningStep,
  ReasoningStep,
  shuffle,
} from "../shared";

type SvgPrimitive =
  | {
      kind: "triangle";
      x: number;
      y: number;
      rotation: number;
    }
  | {
      kind: "dot";
      x: number;
      y: number;
    }
  | {
      kind: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };

type AbstractScenario = {
  stem: string;
  correctAnswer: string;
  options: OptionResult;
  explanation: string;
  reasoningSteps: ReasoningStep[];
  figures: string[];
  structuralSignature: string;
};

export function rotatePrimitive(
  primitive: SvgPrimitive,
  degrees: number,
): SvgPrimitive {
  if (primitive.kind === "triangle") {
    return {
      ...primitive,
      rotation:
        (primitive.rotation + degrees) %
        360,
    };
  }

  return primitive;
}

export function flipPrimitive(
  primitive: SvgPrimitive,
  axis: "x" | "y",
): SvgPrimitive {
  if (primitive.kind === "dot") {
    return {
      ...primitive,
      x:
        axis === "x"
          ? 100 - primitive.x
          : primitive.x,
      y:
        axis === "y"
          ? 100 - primitive.y
          : primitive.y,
    };
  }

  if (primitive.kind === "triangle") {
    return {
      ...primitive,
      x:
        axis === "x"
          ? 100 - primitive.x
          : primitive.x,
      y:
        axis === "y"
          ? 100 - primitive.y
          : primitive.y,
      rotation:
        axis === "x"
          ? (360 -
              primitive.rotation) %
            360
          : (180 -
              primitive.rotation +
              360) %
            360,
    };
  }

  return {
    ...primitive,
    x1:
      axis === "x"
        ? 100 - primitive.x1
        : primitive.x1,
    x2:
      axis === "x"
        ? 100 - primitive.x2
        : primitive.x2,
    y1:
      axis === "y"
        ? 100 - primitive.y1
        : primitive.y1,
    y2:
      axis === "y"
        ? 100 - primitive.y2
        : primitive.y2,
  };
}

export function translatePrimitive(
  primitive: SvgPrimitive,
  dx: number,
  dy: number,
): SvgPrimitive {
  if (primitive.kind === "dot") {
    return {
      ...primitive,
      x: primitive.x + dx,
      y: primitive.y + dy,
    };
  }

  if (primitive.kind === "triangle") {
    return {
      ...primitive,
      x: primitive.x + dx,
      y: primitive.y + dy,
    };
  }

  return {
    ...primitive,
    x1: primitive.x1 + dx,
    y1: primitive.y1 + dy,
    x2: primitive.x2 + dx,
    y2: primitive.y2 + dy,
  };
}

export function renderAbstractSvg(
  primitives: SvgPrimitive[],
) {
  const parts = primitives.map(
    (primitive) => {
      if (primitive.kind === "dot") {
        return `<circle cx="${primitive.x}" cy="${primitive.y}" r="5" fill="#111827"/>`;
      }

      if (
        primitive.kind === "line"
      ) {
        return `<line x1="${primitive.x1}" y1="${primitive.y1}" x2="${primitive.x2}" y2="${primitive.y2}" stroke="#2563eb" stroke-width="5" stroke-linecap="round"/>`;
      }

      return `<polygon points="50,30 35,60 65,60" fill="#f97316" transform="translate(${primitive.x - 50} ${primitive.y - 45}) rotate(${primitive.rotation} 50 45)"/>`;
    },
  );

  return `<svg viewBox="0 0 100 100" role="img" aria-label="Abstract reasoning figure"><rect x="2" y="2" width="96" height="96" rx="8" fill="white" stroke="#94a3b8" stroke-width="3"/>${parts.join("")}</svg>`;
}

function buildOptions(
  correct: string,
  distractors: string[],
): OptionResult {
  const metadata: OptionMetadata[] = [
    {
      value: correct,
      isCorrect: true,
    },
  ];

  for (const value of distractors) {
    if (
      value !== correct &&
      !metadata.some(
        (entry) => entry.value === value,
      )
    ) {
      metadata.push({
        value,
        isCorrect: false,
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Tracked only one moving element or applied the wrong symmetry.",
        reasoningTrap:
          "Abstract visual transformation trap.",
      });
    }
  }

  const shuffled = shuffle(
    metadata.slice(0, 4),
  );

  return {
    options: shuffled.map(
      (entry) => entry.value,
    ),
    correct: shuffled.findIndex(
      (entry) => entry.isCorrect,
    ),
    optionMetadata: shuffled,
  };
}

function createSeriesScenario() {
  const corners = [
    { x: 25, y: 25 },
    { x: 75, y: 25 },
    { x: 75, y: 75 },
    { x: 25, y: 75 },
  ];
  const figures = corners.map(
    (corner, index) =>
      renderAbstractSvg([
        {
          kind: "triangle",
          ...corner,
          rotation: index * 90,
        },
        {
          kind: "dot",
          x:
            index % 2 === 0
              ? 50
              : 25,
          y:
            index % 2 === 0
              ? 50
              : 25,
        },
      ]),
  );
  const correct =
    renderAbstractSvg([
      {
        kind: "triangle",
        x: 25,
        y: 25,
        rotation: 0,
      },
      {
        kind: "dot",
        x: 50,
        y: 50,
      },
    ]);
  const options = buildOptions(
    correct,
    [
      renderAbstractSvg([
        {
          kind: "triangle",
          x: 75,
          y: 25,
          rotation: 90,
        },
        {
          kind: "dot",
          x: 25,
          y: 25,
        },
      ]),
      renderAbstractSvg([
        {
          kind: "triangle",
          x: 25,
          y: 75,
          rotation: 270,
        },
        {
          kind: "dot",
          x: 25,
          y: 25,
        },
      ]),
      renderAbstractSvg([
        {
          kind: "triangle",
          x: 50,
          y: 50,
          rotation: 180,
        },
        {
          kind: "dot",
          x: 50,
          y: 50,
        },
      ]),
    ],
  );

  return {
    stem:
      "Directions: Each problem figure changes according to a rule. Which answer figure continues the same series?",
    correctAnswer: correct,
    options,
    explanation:
      "The triangle moves clockwise one corner in each step and rotates by $90^\\circ$. The dot oscillates between the center and the top-left. Therefore the fifth figure returns the triangle to the top-left and the dot to the center.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Track the triangle's clockwise corner movement and $90^\\circ$ rotation.",
      ),
      createReasoningStep(
        "compare",
        "Track the dot's alternating center/top-left position.",
      ),
    ],
    figures,
    structuralSignature:
      "abs-series:triangle-clockwise-dot-oscillation",
  } satisfies AbstractScenario;
}

function createPaperCuttingScenario() {
  const correct =
    renderAbstractSvg([
      { kind: "dot", x: 25, y: 25 },
      { kind: "dot", x: 75, y: 25 },
      { kind: "dot", x: 25, y: 75 },
      { kind: "dot", x: 75, y: 75 },
    ]);
  const options = buildOptions(
    correct,
    [
      renderAbstractSvg([
        { kind: "dot", x: 50, y: 50 },
      ]),
      renderAbstractSvg([
        { kind: "dot", x: 25, y: 25 },
        { kind: "dot", x: 75, y: 25 },
      ]),
      renderAbstractSvg([
        { kind: "dot", x: 25, y: 25 },
        { kind: "dot", x: 50, y: 50 },
        { kind: "dot", x: 75, y: 75 },
      ]),
    ],
  );

  return {
    stem:
      "Directions: A square sheet is folded as described and a hole is punched. Which figure shows the paper when it is completely unfolded?",
    correctAnswer: correct,
    options,
    explanation:
      "Each fold creates a mirror copy of the punched hole. Two perpendicular folds create $2^2=4$ symmetric holes.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Apply vertical reflection for the first fold.",
      ),
      createReasoningStep(
        "transform",
        "Apply horizontal reflection for the second fold.",
      ),
    ],
    figures: [correct],
    structuralSignature:
      "abs-paper-cutting:two-fold-one-hole",
  } satisfies AbstractScenario;
}

function createEmbeddedScenario() {
  const correct =
    renderAbstractSvg([
      {
        kind: "triangle",
        x: 50,
        y: 45,
        rotation: 0,
      },
    ]);
  const complex =
    renderAbstractSvg([
      {
        kind: "line",
        x1: 20,
        y1: 20,
        x2: 80,
        y2: 80,
      },
      {
        kind: "line",
        x1: 80,
        y1: 20,
        x2: 20,
        y2: 80,
      },
      {
        kind: "triangle",
        x: 50,
        y: 45,
        rotation: 0,
      },
    ]);
  const options = buildOptions(
    correct,
    [
      renderAbstractSvg([
        {
          kind: "dot",
          x: 50,
          y: 50,
        },
      ]),
      renderAbstractSvg([
        {
          kind: "line",
          x1: 20,
          y1: 50,
          x2: 80,
          y2: 50,
        },
      ]),
      renderAbstractSvg([
        {
          kind: "triangle",
          x: 50,
          y: 45,
          rotation: 180,
        },
      ]),
    ],
  );

  return {
    stem:
      "Directions: Which answer figure contains the problem figure (same shape and orientation) as an embedded part?",
    correctAnswer: correct,
    options,
    explanation:
      "Ignore the crossing lines and search for an unchanged primitive. The upright triangle appears inside the complex pattern without rotation.",
    reasoningSteps: [
      createReasoningStep(
        "filter",
        "Separate distracting lines from stable embedded primitives.",
      ),
      createReasoningStep(
        "compare",
        "Match orientation and shape exactly.",
      ),
    ],
    figures: [complex],
    structuralSignature:
      "abs-embedded:upright-triangle",
  } satisfies AbstractScenario;
}

export function createAbstractReasoningScenario(
  motif: QuantMotif,
  _difficulty: DifficultyLabel,
) {
  if (motif.id === "abs-paper-cutting") {
    return createPaperCuttingScenario();
  }

  if (motif.id === "abs-embedded") {
    return createEmbeddedScenario();
  }

  return createSeriesScenario();
}
