import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  inferQuantTopicCluster,
} from "../quant";
import {
  createAveragesScenario,
} from "./averages-scenarios";
import {
  createAlgebraScenario,
} from "./algebra-scenarios";
import {
  createCoordinateGeometryScenario,
} from "./coordinate-geometry-scenarios";
import {
  createEquationsScenario,
} from "./equations-scenarios";
import {
  createFundamentalsScenario,
} from "./fundamentals-scenarios";
import {
  createFunctionsScenario,
} from "./functions-scenarios";
import {
  createGeometryScenario,
} from "./geometry-scenarios";
import {
  createMixtureAlligationScenario,
} from "./mixture-alligation-scenarios";
import {
  createMensurationScenario,
} from "./mensuration-scenarios";
import {
  createNumberSystemScenario,
} from "./number-system-scenarios";
import {
  createPercentageScenario,
} from "./percentage-scenarios";
import {
  createPermutationCombinationScenario,
} from "./permutation-combination-scenarios";
import {
  createProgressionsScenario,
} from "./progressions-scenarios";
import {
  createProbabilityScenario,
} from "./probability-scenarios";
import {
  createProfitLossScenario,
} from "./profit-loss-scenarios";
import {
  createRatioProportionScenario,
} from "./ratio-proportion-scenarios";
import {
  createSetTheoryScenario,
} from "./set-theory-scenarios";
import {
  createSimplificationScenario,
} from "./simplification-scenarios";
import {
  createSimpleCompoundInterestScenario,
} from "./simple-compound-interest-scenarios";
import {
  createSpeedDistanceScenario,
} from "./speed-distance-scenarios";
import {
  createTimeWorkScenario,
  type QuantProceduralScenario,
} from "./time-work-scenarios";
import {
  createTrigonometryScenario,
} from "./trigonometry-scenarios";
import {
  normalizeQuantMathText,
  normalizeQuantOptionValue,
  normalizeQuantReasoningSteps,
} from "./mathjax";

export type {
  QuantProceduralScenario,
} from "./time-work-scenarios";

function normalizeQuantProceduralScenario(
  scenario: QuantProceduralScenario | null,
) {
  if (!scenario) {
    return null;
  }

  return {
    ...scenario,
    text: normalizeQuantMathText(
      scenario.text,
    )!,
    formula: normalizeQuantMathText(
      scenario.formula,
    ),
    explanation: normalizeQuantMathText(
      scenario.explanation,
    ),
    reasoningSteps:
      normalizeQuantReasoningSteps(
        scenario.reasoningSteps,
      ),
    customOptionBundle:
      scenario.customOptionBundle
        ? {
            ...scenario.customOptionBundle,
            options:
              scenario.customOptionBundle.options.map(
                normalizeQuantOptionValue,
              ),
          }
        : undefined,
  };
}

export function createQuantProceduralScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
  options: {
    targetDifficultyScore?: number;
  } = {},
): QuantProceduralScenario | null {
  if (
    pattern.id.startsWith(
      "registry-percentage",
    ) ||
    pattern.topic === "percentage" ||
    pattern.subtopic === "percentage"
  ) {
    return normalizeQuantProceduralScenario(
      createPercentageScenario(
        pattern,
        difficulty,
        motif,
        options,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-simplification",
    ) ||
    pattern.id.startsWith(
      "registry-sim-",
    ) ||
    pattern.topic === "simplification" ||
    pattern.subtopic === "simplification"
  ) {
    return normalizeQuantProceduralScenario(
      createSimplificationScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-mensuration",
    ) ||
    pattern.subtopic === "mensuration"
  ) {
    return normalizeQuantProceduralScenario(
      createMensurationScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-trig",
    ) ||
    pattern.id.startsWith(
      "registry-trigonometry",
    ) ||
    pattern.topic === "trigonometry" ||
    pattern.subtopic === "trigonometry"
  ) {
    return normalizeQuantProceduralScenario(
      createTrigonometryScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-equations",
    ) ||
    pattern.id.startsWith(
      "registry-eqn-",
    ) ||
    pattern.topic === "equations" ||
    pattern.subtopic === "equations"
  ) {
    return normalizeQuantProceduralScenario(
      createEquationsScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-progressions",
    ) ||
    pattern.id.startsWith(
      "registry-prog-",
    ) ||
    pattern.topic === "progressions" ||
    pattern.subtopic === "progressions"
  ) {
    return normalizeQuantProceduralScenario(
      createProgressionsScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-probability",
    ) ||
    pattern.id.startsWith(
      "registry-prob-",
    ) ||
    pattern.topic === "probability" ||
    pattern.subtopic === "probability"
  ) {
    return normalizeQuantProceduralScenario(
      createProbabilityScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-functions",
    ) ||
    pattern.id.startsWith(
      "registry-func-",
    ) ||
    pattern.topic === "functions" ||
    pattern.subtopic === "functions"
  ) {
    return normalizeQuantProceduralScenario(
      createFunctionsScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-coordinate",
    ) ||
    pattern.id.startsWith(
      "registry-coord-",
    ) ||
    pattern.topic ===
      "coordinate-geometry" ||
    pattern.subtopic ===
      "coordinate-geometry"
  ) {
    return normalizeQuantProceduralScenario(
      createCoordinateGeometryScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  if (
    pattern.id.startsWith(
      "registry-set-theory",
    ) ||
    pattern.id.startsWith(
      "registry-set-",
    ) ||
    pattern.topic === "set-theory" ||
    pattern.subtopic === "set-theory"
  ) {
    return normalizeQuantProceduralScenario(
      createSetTheoryScenario(
        pattern,
        difficulty,
        motif,
      ),
    );
  }

  const topicCluster =
    inferQuantTopicCluster(pattern);

  switch (topicCluster) {
    case "simplification":
      return normalizeQuantProceduralScenario(
        createSimplificationScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "averages":
      return normalizeQuantProceduralScenario(
        createAveragesScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "algebra":
    case "algebra-basics":
      return normalizeQuantProceduralScenario(
        createAlgebraScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "equations":
      return normalizeQuantProceduralScenario(
        createEquationsScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "fundamentals":
      return normalizeQuantProceduralScenario(
        createFundamentalsScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "functions":
      return normalizeQuantProceduralScenario(
        createFunctionsScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "coordinate-geometry":
      return normalizeQuantProceduralScenario(
        createCoordinateGeometryScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "set-theory":
      return normalizeQuantProceduralScenario(
        createSetTheoryScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "geometry":
      return normalizeQuantProceduralScenario(
        createGeometryScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "mixture-alligation":
      return normalizeQuantProceduralScenario(
        createMixtureAlligationScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "mensuration":
      return normalizeQuantProceduralScenario(
        createMensurationScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "permutation-combination":
      return normalizeQuantProceduralScenario(
        createPermutationCombinationScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "progressions":
      return normalizeQuantProceduralScenario(
        createProgressionsScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "probability":
      return normalizeQuantProceduralScenario(
        createProbabilityScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "trigonometry":
      return normalizeQuantProceduralScenario(
        createTrigonometryScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "number-system":
      return normalizeQuantProceduralScenario(
        createNumberSystemScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "percentage":
      return normalizeQuantProceduralScenario(
        createPercentageScenario(
          pattern,
          difficulty,
          motif,
          options,
        ),
      );
    case "profit-loss":
      return normalizeQuantProceduralScenario(
        createProfitLossScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "ratio-proportion":
      return normalizeQuantProceduralScenario(
        createRatioProportionScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "si-ci":
      return normalizeQuantProceduralScenario(
        createSimpleCompoundInterestScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "speed-time-distance":
      return normalizeQuantProceduralScenario(
        createSpeedDistanceScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    case "time-work":
      return normalizeQuantProceduralScenario(
        createTimeWorkScenario(
          pattern,
          difficulty,
          motif,
        ),
      );
    default:
      return null;
  }
}
