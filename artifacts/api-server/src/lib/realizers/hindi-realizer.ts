import type {
  SeatingClue,
  SeatingQuestionPrompt,
  SeatingScenario,
} from "../reasoning/seating-engine";
import type {
  NativeRealizerInput,
  NativeRealizerResult,
} from "./types";
import {
  detectCoverageCategory,
  getCoveragePercent,
  validateNativeBundle,
} from "./coverage";
import {
  hindiSitVerb,
} from "./gender-utils";
import {
  localizeOptionText,
} from "./entity-registry";
import {
  primitiveFromSeatingClueType,
  parseSeatingExpression,
  semanticFromStudioRelation,
} from "./semantic-primitives";
import {
  diagnosePrimitiveSupport,
} from "./primitive-registry";
import {
  realizeSemanticSeatingClue,
} from "./templates";

function isSeatingScenario(
  value: unknown,
): value is SeatingScenario {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray(
        (value as SeatingScenario).clues,
      ) &&
      (value as SeatingScenario).prompt &&
      Array.isArray(
        (value as SeatingScenario)
          .arrangement,
      ),
  );
}

type StudioSeatingLogic = {
  nodes: Array<{
    entityId?: string;
    id?: string;
    gender?: string;
    position?: number;
  }>;
  edges: Array<{
    from?: string;
    to?: string;
    relation?: string;
  }>;
};

type ScenarioSeatingLogic = {
  domain?: string;
  subtype?: string;
  constraints?: Array<{
    expression?: string;
    type?: string;
  }>;
  content?: {
    options?: string[];
  };
};

function isStudioSeatingLogic(
  value: unknown,
): value is StudioSeatingLogic {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as any).nodes) &&
      Array.isArray((value as any).edges),
  );
}

function isScenarioSeatingLogic(
  value: unknown,
): value is ScenarioSeatingLogic {
  return Boolean(
    value &&
      typeof value === "object" &&
      String((value as any).domain ?? "")
        .toLowerCase()
        .includes("seating") &&
      Array.isArray(
        (value as any).constraints,
      ),
  );
}

function displayName(value: unknown) {
  return String(value ?? "")
    .replace(/^node_/, "")
    .trim();
}

function localOptions(options: string[]) {
  return options.map((option) =>
    localizeOptionText(option, "hi").normalize("NFC"),
  );
}

function expressionToHindi(
  expression: string,
) {
  return realizeSemanticSeatingClue(
    "hi",
    parseSeatingExpression(expression),
  );

  const offset = expression.match(
    /^(.+?)\s+(\d+)\s+(left|right)\s+of\s+(.+)$/i,
  );
  if (offset) {
    const [, person, distance, direction, anchor] =
      offset;
    return `${person}, ${anchor} के ${ordinal(Number(distance))} ${side(direction.toLowerCase() === "left" ? "left" : "right")} ${hindiSitVerb(person)}।`;
  }

  const notAdjacent = expression.match(
    /^(.+?)\s+not\s+adjacent\s+to\s+(.+)$/i,
  );
  if (notAdjacent) {
    return `${notAdjacent[1]} और ${notAdjacent[2]} एक-दूसरे के बगल में नहीं बैठे हैं।`;
  }

  const adjacent = expression.match(
    /^(.+?)\s+adjacent\s+to\s+(.+)$/i,
  );
  if (adjacent) {
    return `${adjacent[1]} और ${adjacent[2]} एक-दूसरे के बगल में बैठे हैं।`;
  }

  const notEnd = expression.match(
    /^(.+?)\s+not\s+at\s+end$/i,
  );
  if (notEnd) {
    return `${notEnd[1]} किसी भी छोर पर नहीं ${hindiSitVerb(notEnd[1])}।`;
  }

  const between = expression.match(
    /^(.+?)\s+between\s+(.+?)\s+and\s+(.+)$/i,
  );
  if (between) {
    return `${between[1]}, ${between[2]} और ${between[3]} के बीच ${hindiSitVerb(between[1])}।`;
  }

  const opposite = expression.match(
    /^(.+?)\s+opposite\s+(.+)$/i,
  );
  if (opposite) {
    return `${opposite[1]}, ${opposite[2]} के सामने ${hindiSitVerb(opposite[1])}।`;
  }

  return `शर्त: ${expression}`;
}

function realizeScenarioSeatingHindi(
  logic: ScenarioSeatingLogic,
  input: NativeRealizerInput,
) {
  const semanticClues = (logic.constraints ?? [])
    .map((constraint) =>
      String(
        constraint.expression ?? "",
      ).trim(),
    )
    .filter(Boolean)
    .map(parseSeatingExpression);
  const clues = semanticClues.map((clue) =>
    realizeSemanticSeatingClue("hi", clue),
  );

  const options =
    input.question.options.length === 4
      ? input.question.options
      : (logic.content?.options ?? []);

  return {
    question: [
      `निम्नलिखित बैठने की व्यवस्था ${logic.subtype ? `(${logic.subtype}) ` : ""}को ध्यान से पढ़िए और प्रश्न का उत्तर दीजिए:`,
      ...clues.map(
        (clue, index) =>
          `${index + 1}. ${clue}`,
      ),
      "इन शर्तों के आधार पर सही विकल्प चुनिए।",
    ].join("\n").normalize("NFC"),
    options: localOptions(options.slice(0, 4)),
    explanation: [
      "दी गई बैठने की शर्तों को क्रम से लागू करने पर एक वैध व्यवस्था मिलती है।",
      `अतः सही उत्तर ${input.question.options[input.question.correct] ?? ""} है।`,
    ].join("\n").normalize("NFC"),
  };
}

function studioRelationToHindi(
  edge: StudioSeatingLogic["edges"][number],
) {
  const from = displayName(edge.from);
  const to = displayName(edge.to);
  return realizeSemanticSeatingClue(
    "hi",
    semanticFromStudioRelation(
      edge.relation,
      from,
      to,
    ),
  );

  switch (edge.relation) {
    case "IMMEDIATE_LEFT":
      return `${from}, ${to} के ठीक बाईं ओर ${hindiSitVerb(from)}।`;
    case "IMMEDIATE_RIGHT":
      return `${from}, ${to} के ठीक दाईं ओर ${hindiSitVerb(from)}।`;
    case "SECOND_TO_LEFT":
      return `${from}, ${to} के दूसरे बाईं ओर ${hindiSitVerb(from)}।`;
    case "SECOND_TO_RIGHT":
      return `${from}, ${to} के दूसरे दाईं ओर ${hindiSitVerb(from)}।`;
    case "OPPOSITE":
      return `${from}, ${to} के सामने ${hindiSitVerb(from)}।`;
    case "BETWEEN":
      return `${from}, ${to} के बीच दी गई शर्त के अनुसार ${hindiSitVerb(from)}।`;
    default:
      return `${from} और ${to} के बीच ${edge.relation ?? "संबंध"} की शर्त लागू होती है।`;
  }
}

function realizeStudioSeatingHindi(
  logic: StudioSeatingLogic,
  input: NativeRealizerInput,
) {
  const clues = logic.edges.length
    ? logic.edges.map(
        studioRelationToHindi,
      )
    : [
        "दिए गए व्यक्तियों की व्यवस्था स्थानों के अनुसार निर्धारित है।",
      ];
  const finalArrangement = logic.nodes
    .slice()
    .sort(
      (a, b) =>
        (a.position ?? 0) -
        (b.position ?? 0),
    )
    .map((node) =>
      displayName(
        node.entityId ?? node.id,
      ),
    )
    .filter(Boolean)
    .join(", ");

  return {
    question: [
      "निम्नलिखित जानकारी को ध्यान से पढ़िए और प्रश्न का उत्तर दीजिए:",
      ...clues.map(
        (clue, index) =>
          `${index + 1}. ${clue}`,
      ),
      "इस व्यवस्था के आधार पर सही उत्तर चुनिए।",
    ].join("\n").normalize("NFC"),
    options: localOptions(input.question.options),
    explanation: [
      "दी गई संरचनात्मक शर्तों को उसी तर्क-वस्तु से लागू किया गया है।",
      finalArrangement
        ? `अंतिम व्यवस्था: ${finalArrangement}`
        : "अंतिम व्यवस्था तर्क-वस्तु में दी गई स्थितियों से मिलती है।",
      `अतः सही उत्तर ${input.question.options[input.question.correct] ?? ""} है।`,
    ].join("\n").normalize("NFC"),
  };
}

function side(value: "left" | "right") {
  return value === "left"
    ? "बाईं ओर"
    : "दाईं ओर";
}

function endSide(value: "left" | "right") {
  return value === "left"
    ? "बाएं"
    : "दाएं";
}

function ordinal(distance: number) {
  if (distance === 1) return "पहले";
  if (distance === 2) return "दूसरे";
  if (distance === 3) return "तीसरे";
  return `${distance}वें`;
}

function axisPhrase(
  axis:
    | "above"
    | "below"
    | "after"
    | "before",
) {
  switch (axis) {
    case "above":
      return "ऊपर";
    case "below":
      return "नीचे";
    case "after":
      return "बाद";
    case "before":
      return "पहले";
  }
}

function clueToHindi(clue: SeatingClue) {
  switch (clue.type) {
    case "absolute":
      return `${clue.person} स्थान ${clue.index + 1} पर ${hindiSitVerb(clue.person)}।`;
    case "end":
      return `${clue.person} ${endSide(clue.side)} छोर पर ${hindiSitVerb(clue.person)}।`;
    case "adjacent":
      return clue.ordered
        ? `${clue.left}, ${clue.right} के ठीक बगल में ${hindiSitVerb(clue.left)}।`
        : `${clue.left} और ${clue.right} एक-दूसरे के बगल में बैठे हैं।`;
    case "not-adjacent":
      return `${clue.left} और ${clue.right} एक-दूसरे के बगल में नहीं बैठे हैं।`;
    case "offset":
      return `${clue.person}, ${clue.anchor} के ${ordinal(clue.distance)} ${side(clue.direction)} ${hindiSitVerb(clue.person)}।`;
    case "distance-gap":
      return `${clue.left} और ${clue.right} के बीच ${clue.gap} स्थान है।`;
    case "between":
      return `${clue.middle}, ${clue.first} और ${clue.second} के बीच ${hindiSitVerb(clue.middle)}।`;
    case "adjacent-both":
      return `${clue.middle}, ${clue.first} और ${clue.second} दोनों के बगल में ${hindiSitVerb(clue.middle)}।`;
    case "not-end":
      return `${clue.person} किसी भी छोर पर नहीं ${hindiSitVerb(clue.person)}।`;
    case "opposite":
      return `${clue.left}, ${clue.right} के सामने ${hindiSitVerb(clue.left)}।`;
    case "not-opposite":
      return `${clue.left}, ${clue.right} के सामने नहीं ${hindiSitVerb(clue.left)}।`;
    case "same-row":
      return `${clue.left} और ${clue.right} एक ही पंक्ति में हैं।`;
    case "different-row":
      return `${clue.left} और ${clue.right} अलग-अलग पंक्तियों में हैं।`;
    case "facing":
      return `${clue.left}, ${clue.right} की ओर मुख करके ${hindiSitVerb(clue.left)}।`;
    case "not-facing":
      return `${clue.left}, ${clue.right} की ओर मुख करके नहीं ${hindiSitVerb(clue.left)}।`;
    case "slot-fixed":
      return `${clue.entity}, ${clue.slotLabel} पर है।`;
    case "slot-gap":
      return `${clue.left} और ${clue.right} के बीच ${clue.gap} स्थान का अंतर है।`;
    case "slot-parity":
      return `${clue.entity} ${clue.parity === "even" ? "सम" : "विषम"} क्रमांक वाले स्थान पर है।`;
    case "slot-immediate":
      return `${clue.upper}, ${clue.lower} के ठीक ${axisPhrase(clue.axis)} है।`;
    case "slot-not":
      return `${clue.entity}, ${clue.slotLabel} पर नहीं है।`;
    case "attribute":
      return `${clue.entity} का ${clue.attribute} ${clue.value} है।`;
  }
}

function promptToHindi(
  prompt: SeatingQuestionPrompt,
) {
  switch (prompt.type) {
    case "neighbor-left":
      return `${prompt.anchor} के ठीक बाईं ओर कौन बैठा है?`;
    case "neighbor-right":
      return `${prompt.anchor} के ठीक दाईं ओर कौन बैठा है?`;
    case "relative":
      return `${prompt.anchor} के ${ordinal(prompt.distance)} ${side(prompt.direction)} कौन बैठा है?`;
    case "opposite":
      return `${prompt.anchor} के सामने कौन बैठा है?`;
    case "facing":
      return `${prompt.anchor} की ओर मुख करके कौन बैठा है?`;
    case "slot-occupant":
      return `स्थान ${prompt.slotIndex + 1} पर कौन है?`;
    case "entity-slot":
      return `${prompt.anchor} किस स्थान पर है?`;
  }
}

export function realizeHindi(
  input: NativeRealizerInput,
): NativeRealizerResult {
  const coverageCategory =
    detectCoverageCategory(input);
  const coveragePercent =
    getCoveragePercent(
      "hi",
      coverageCategory,
    );

  if (!isSeatingScenario(input.logic)) {
    if (
      coverageCategory === "seating" &&
      isScenarioSeatingLogic(input.logic)
    ) {
      const bundle =
        realizeScenarioSeatingHindi(
          input.logic,
          input,
        );
      const primitiveDiagnostics =
        diagnosePrimitiveSupport(
          (input.logic.constraints ?? [])
            .map((constraint) =>
              String(
                constraint.expression ?? "",
              ).trim(),
            )
            .filter(Boolean)
            .map(parseSeatingExpression)
            .map((clue) => clue.primitive),
          ["hi"],
        );
      const validation =
        validateNativeBundle(
          "hi",
          bundle,
          {
            unsupported:
              primitiveDiagnostics.unsupported,
            missingTemplates:
              primitiveDiagnostics.missingTemplates,
          },
        );

      return validation.passed
        ? {
            supported: true,
            language: "hi",
            source: "native-realizer",
            coverageCategory,
            coveragePercent,
            validation,
            bundle,
          }
        : {
            supported: false,
            language: "hi",
            reason:
              "Hindi seating scenario catch-all failed validation.",
            coverageCategory,
            coveragePercent,
            validation,
          };
    }

    if (
      coverageCategory === "seating" &&
      isStudioSeatingLogic(input.logic)
    ) {
      const bundle =
        realizeStudioSeatingHindi(
          input.logic,
          input,
        );
      const primitiveDiagnostics =
        diagnosePrimitiveSupport(
          input.logic.edges.map((edge) =>
            semanticFromStudioRelation(
              edge.relation,
              displayName(edge.from),
              displayName(edge.to),
            ).primitive,
          ),
          ["hi"],
        );
      const validation =
        validateNativeBundle(
          "hi",
          bundle,
          {
            unsupported:
              primitiveDiagnostics.unsupported,
            missingTemplates:
              primitiveDiagnostics.missingTemplates,
          },
        );

      return validation.passed
        ? {
            supported: true,
            language: "hi",
            source: "native-realizer",
            coverageCategory,
            coveragePercent,
            validation,
            bundle,
          }
        : {
            supported: false,
            language: "hi",
            reason:
              "Hindi seating catch-all failed validation.",
            coverageCategory,
            coveragePercent,
            validation,
          };
    }

    return {
      supported: false,
      language: "hi",
      reason:
        "No Hindi native realizer is registered for this logic object.",
      coverageCategory,
      coveragePercent,
    };
  }

  const clues = input.logic.clues.map(
    clueToHindi,
  );
  const question = [
    "निम्नलिखित जानकारी को ध्यान से पढ़िए और प्रश्न का उत्तर दीजिए:",
    ...clues.map(
      (clue, index) =>
        `${index + 1}. ${clue}`,
    ),
    promptToHindi(input.logic.prompt),
  ].join("\n");

  const bundle = {
    question: question.normalize("NFC"),
    options: localOptions(input.question.options),
    explanation: [
      "दिए गए संकेतों को क्रम से लागू करने पर एक ही वैध व्यवस्था मिलती है।",
      `अंतिम व्यवस्था: ${input.logic.finalArrangement}`,
      `अतः सही उत्तर ${input.logic.prompt.correctAnswer} है।`,
    ].join("\n").normalize("NFC"),
  };
  const primitiveDiagnostics =
    diagnosePrimitiveSupport(
      input.logic.clues.map((clue) =>
        primitiveFromSeatingClueType(
          clue.type,
        ),
      ),
      ["hi"],
    );
  const validation = validateNativeBundle(
    "hi",
    bundle,
    {
      unsupported:
        primitiveDiagnostics.unsupported,
      missingTemplates:
        primitiveDiagnostics.missingTemplates,
    },
  );

  if (!validation.passed) {
    return {
      supported: false,
      language: "hi",
      reason:
        "Hindi native realization failed validation.",
      coverageCategory,
      coveragePercent,
      validation,
    };
  }

  return {
    supported: true,
    language: "hi",
    source: "native-realizer",
    coverageCategory,
    coveragePercent,
    validation,
    bundle,
  };
}
