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
  punjabiSitVerb,
} from "./gender-utils";
import {
  localizeOptionText,
} from "./entity-registry";
import {
  parseSeatingExpression,
  primitiveFromSeatingClueType,
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
    localizeOptionText(option, "pa").normalize("NFC"),
  );
}

function expressionToPunjabi(
  expression: string,
) {
  return realizeSemanticSeatingClue(
    "pa",
    parseSeatingExpression(expression),
  );

  const offset = expression.match(
    /^(.+?)\s+(\d+)\s+(left|right)\s+of\s+(.+)$/i,
  );
  if (offset) {
    const [, person, distance, direction, anchor] =
      offset;
    return `${person}, ${anchor} ਦੇ ${ordinal(Number(distance))} ${side(direction.toLowerCase() === "left" ? "left" : "right")} ${punjabiSitVerb(person)}।`;
  }

  const notAdjacent = expression.match(
    /^(.+?)\s+not\s+adjacent\s+to\s+(.+)$/i,
  );
  if (notAdjacent) {
    return `${notAdjacent[1]} ਅਤੇ ${notAdjacent[2]} ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਹੀਂ ਬੈਠੇ ਹਨ।`;
  }

  const adjacent = expression.match(
    /^(.+?)\s+adjacent\s+to\s+(.+)$/i,
  );
  if (adjacent) {
    return `${adjacent[1]} ਅਤੇ ${adjacent[2]} ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਬੈਠੇ ਹਨ।`;
  }

  const notEnd = expression.match(
    /^(.+?)\s+not\s+at\s+end$/i,
  );
  if (notEnd) {
    return `${notEnd[1]} ਕਿਸੇ ਵੀ ਕਿਨਾਰੇ ਤੇ ਨਹੀਂ ${punjabiSitVerb(notEnd[1])}।`;
  }

  const between = expression.match(
    /^(.+?)\s+between\s+(.+?)\s+and\s+(.+)$/i,
  );
  if (between) {
    return `${between[1]}, ${between[2]} ਅਤੇ ${between[3]} ਦੇ ਵਿਚਕਾਰ ${punjabiSitVerb(between[1])}।`;
  }

  const opposite = expression.match(
    /^(.+?)\s+opposite\s+(.+)$/i,
  );
  if (opposite) {
    return `${opposite[1]}, ${opposite[2]} ਦੇ ਸਾਹਮਣੇ ${punjabiSitVerb(opposite[1])}।`;
  }

  return `ਸ਼ਰਤ: ${expression}`;
}

function realizeScenarioSeatingPunjabi(
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
    realizeSemanticSeatingClue("pa", clue),
  );

  const options =
    input.question.options.length === 4
      ? input.question.options
      : (logic.content?.options ?? []);

  return {
    question: [
      `ਹੇਠਾਂ ਦਿੱਤੀ ਬੈਠਕ ਵਿਵਸਥਾ ${logic.subtype ? `(${logic.subtype}) ` : ""}ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ:`,
      ...clues.map(
        (clue, index) =>
          `${index + 1}. ${clue}`,
      ),
      "ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਦੇ ਆਧਾਰ ਤੇ ਸਹੀ ਵਿਕਲਪ ਚੁਣੋ।",
    ].join("\n").normalize("NFC"),
    options: localOptions(options.slice(0, 4)),
    explanation: [
      "ਦਿੱਤੀਆਂ ਬੈਠਕ ਸ਼ਰਤਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਕਰਨ ਤੇ ਇੱਕ ਉਚਿਤ ਵਿਵਸਥਾ ਮਿਲਦੀ ਹੈ।",
      `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${localizeOptionText(input.question.options[input.question.correct] ?? "", "pa")} ਹੈ।`,
    ].join("\n").normalize("NFC"),
  };
}

function studioRelationToPunjabi(
  edge: StudioSeatingLogic["edges"][number],
) {
  const from = displayName(edge.from);
  const to = displayName(edge.to);
  return realizeSemanticSeatingClue(
    "pa",
    semanticFromStudioRelation(
      edge.relation,
      from,
      to,
    ),
  );

  switch (edge.relation) {
    case "IMMEDIATE_LEFT":
      return `${from}, ${to} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਪਾਸੇ ${punjabiSitVerb(from)}।`;
    case "IMMEDIATE_RIGHT":
      return `${from}, ${to} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ ${punjabiSitVerb(from)}।`;
    case "SECOND_TO_LEFT":
      return `${from}, ${to} ਦੇ ਦੂਜੇ ਖੱਬੇ ਪਾਸੇ ${punjabiSitVerb(from)}।`;
    case "SECOND_TO_RIGHT":
      return `${from}, ${to} ਦੇ ਦੂਜੇ ਸੱਜੇ ਪਾਸੇ ${punjabiSitVerb(from)}।`;
    case "OPPOSITE":
      return `${from}, ${to} ਦੇ ਸਾਹਮਣੇ ${punjabiSitVerb(from)}।`;
    case "BETWEEN":
      return `${from}, ${to} ਦੇ ਵਿਚਕਾਰ ਦਿੱਤੀ ਸ਼ਰਤ ਅਨੁਸਾਰ ${punjabiSitVerb(from)}।`;
    default:
      return `${from} ਅਤੇ ${to} ਵਿਚਕਾਰ ${edge.relation ?? "ਸੰਬੰਧ"} ਦੀ ਸ਼ਰਤ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।`;
  }
}

function realizeStudioSeatingPunjabi(
  logic: StudioSeatingLogic,
  input: NativeRealizerInput,
) {
  const clues = logic.edges.length
    ? logic.edges.map(
        studioRelationToPunjabi,
      )
    : [
        "ਦਿੱਤੇ ਗਏ ਵਿਅਕਤੀਆਂ ਦੀ ਵਿਵਸਥਾ ਸਥਾਨਾਂ ਅਨੁਸਾਰ ਨਿਰਧਾਰਤ ਹੈ।",
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
      "ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ:",
      ...clues.map(
        (clue, index) =>
          `${index + 1}. ${clue}`,
      ),
      "ਇਸ ਵਿਵਸਥਾ ਦੇ ਆਧਾਰ ਤੇ ਸਹੀ ਉੱਤਰ ਚੁਣੋ।",
    ].join("\n").normalize("NFC"),
    options: localOptions(input.question.options),
    explanation: [
      "ਦਿੱਤੀਆਂ ਸੰਰਚਨਾਤਮਕ ਸ਼ਰਤਾਂ ਨੂੰ ਉਸੇ ਤਰਕ-ਵਸਤੂ ਤੋਂ ਲਾਗੂ ਕੀਤਾ ਗਿਆ ਹੈ।",
      finalArrangement
        ? `ਅੰਤਿਮ ਵਿਵਸਥਾ: ${finalArrangement}`
        : "ਅੰਤਿਮ ਵਿਵਸਥਾ ਤਰਕ-ਵਸਤੂ ਵਿੱਚ ਦਿੱਤੀਆਂ ਸਥਿਤੀਆਂ ਤੋਂ ਮਿਲਦੀ ਹੈ।",
      `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${input.question.options[input.question.correct] ?? ""} ਹੈ।`,
    ].join("\n").normalize("NFC"),
  };
}

function side(value: "left" | "right") {
  return value === "left"
    ? "ਖੱਬੇ ਪਾਸੇ"
    : "ਸੱਜੇ ਪਾਸੇ";
}

function endSide(value: "left" | "right") {
  return value === "left"
    ? "ਖੱਬੇ"
    : "ਸੱਜੇ";
}

function ordinal(distance: number) {
  if (distance === 1) return "ਪਹਿਲੇ";
  if (distance === 2) return "ਦੂਜੇ";
  if (distance === 3) return "ਤੀਜੇ";
  return `${distance}ਵੇਂ`;
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
      return "ਉੱਪਰ";
    case "below":
      return "ਹੇਠਾਂ";
    case "after":
      return "ਬਾਅਦ";
    case "before":
      return "ਪਹਿਲਾਂ";
  }
}

function clueToPunjabi(clue: SeatingClue) {
  switch (clue.type) {
    case "absolute":
      return `${clue.person} ਸਥਾਨ ${clue.index + 1} ਤੇ ${punjabiSitVerb(clue.person)}।`;
    case "end":
      return `${clue.person} ${endSide(clue.side)} ਕਿਨਾਰੇ ਤੇ ${punjabiSitVerb(clue.person)}।`;
    case "adjacent":
      return clue.ordered
        ? `${clue.left}, ${clue.right} ਦੇ ਬਿਲਕੁਲ ਨਾਲ ${punjabiSitVerb(clue.left)}।`
        : `${clue.left} ਅਤੇ ${clue.right} ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਬੈਠੇ ਹਨ।`;
    case "not-adjacent":
      return `${clue.left} ਅਤੇ ${clue.right} ਇੱਕ-ਦੂਜੇ ਦੇ ਨਾਲ ਨਹੀਂ ਬੈਠੇ ਹਨ।`;
    case "offset":
      return `${clue.person}, ${clue.anchor} ਦੇ ${ordinal(clue.distance)} ${side(clue.direction)} ${punjabiSitVerb(clue.person)}।`;
    case "distance-gap":
      return `${clue.left} ਅਤੇ ${clue.right} ਦੇ ਵਿਚਕਾਰ ${clue.gap} ਸਥਾਨ ਹੈ।`;
    case "between":
      return `${clue.middle}, ${clue.first} ਅਤੇ ${clue.second} ਦੇ ਵਿਚਕਾਰ ${punjabiSitVerb(clue.middle)}।`;
    case "adjacent-both":
      return `${clue.middle}, ${clue.first} ਅਤੇ ${clue.second} ਦੋਵਾਂ ਦੇ ਨਾਲ ${punjabiSitVerb(clue.middle)}।`;
    case "not-end":
      return `${clue.person} ਕਿਸੇ ਵੀ ਕਿਨਾਰੇ ਤੇ ਨਹੀਂ ${punjabiSitVerb(clue.person)}।`;
    case "opposite":
      return `${clue.left}, ${clue.right} ਦੇ ਸਾਹਮਣੇ ${punjabiSitVerb(clue.left)}।`;
    case "not-opposite":
      return `${clue.left}, ${clue.right} ਦੇ ਸਾਹਮਣੇ ਨਹੀਂ ${punjabiSitVerb(clue.left)}।`;
    case "same-row":
      return `${clue.left} ਅਤੇ ${clue.right} ਇੱਕੋ ਕਤਾਰ ਵਿੱਚ ਹਨ।`;
    case "different-row":
      return `${clue.left} ਅਤੇ ${clue.right} ਵੱਖ-ਵੱਖ ਕਤਾਰਾਂ ਵਿੱਚ ਹਨ।`;
    case "facing":
      return `${clue.left}, ${clue.right} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ${punjabiSitVerb(clue.left)}।`;
    case "not-facing":
      return `${clue.left}, ${clue.right} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਨਹੀਂ ${punjabiSitVerb(clue.left)}।`;
    case "slot-fixed":
      return `${clue.entity}, ${clue.slotLabel} ਤੇ ਹੈ।`;
    case "slot-gap":
      return `${clue.left} ਅਤੇ ${clue.right} ਦੇ ਵਿਚਕਾਰ ${clue.gap} ਸਥਾਨਾਂ ਦਾ ਅੰਤਰ ਹੈ।`;
    case "slot-parity":
      return `${clue.entity} ${clue.parity === "even" ? "ਸਮ" : "ਵਿਸਮ"} ਨੰਬਰ ਵਾਲੇ ਸਥਾਨ ਤੇ ਹੈ।`;
    case "slot-immediate":
      return `${clue.upper}, ${clue.lower} ਦੇ ਬਿਲਕੁਲ ${axisPhrase(clue.axis)} ਹੈ।`;
    case "slot-not":
      return `${clue.entity}, ${clue.slotLabel} ਤੇ ਨਹੀਂ ਹੈ।`;
    case "attribute":
      return `${clue.entity} ਦਾ ${clue.attribute} ${clue.value} ਹੈ।`;
  }
}

function arrangementNarrativePa(
  scenario: SeatingScenario,
) {
  const segments =
    scenario.arrangement.map(
      (person, index) => {
        const slot =
          scenario.seatLabels[index] ??
          `ਸਥਾਨ ${index + 1}`;
        return `${slot}: ${person}`;
      },
    );

  return `ਅੰਤਿਮ ਵਿਵਸਥਾ ਇਸ ਤਰ੍ਹਾਂ ਬਣਦੀ ਹੈ — ${segments.join(" · ")}।`;
}

function humanizeSolverDeductionPa(
  raw: string,
) {
  const t = raw.trim();

  if (
    t.includes(
      "Anchored the first reliable relation",
    )
  ) {
    return "ਸਭ ਤੋਂ ਸਾਫ਼ ਸੰਕੇਤ ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ ਜੋ ਕਿਸੇ ਵਿਅਕਤੀ ਜਾਂ ਸਥਾਨ ਨੂੰ ਪੱਕਾ ਕਰਦਾ ਹੈ, ਅਤੇ ਉਸੇ ਨੂੰ ਅਧਾਰ ਮੰਨ ਕੇ ਅੱਗੇ ਵਧੋ।";
  }

  if (
    t.includes(
      "Propagated row and neighbour relations",
    )
  ) {
    return "ਖੱਬੇ-ਸੱਜੇ ਕ੍ਰਮ ਅਤੇ ਗੁਆਂਢ ਵਾਲੇ ਸੰਕੇਤਾਂ ਨਾਲ ਕਤਾਰ ਨੂੰ ਅੱਗੇ ਵਧਾਓ; ਪਹਿਲਾਂ ਲਿਖੀਆਂ ਸਥਿਤੀਆਂ ਨਾਲ ਟਕਰਾਅ ਨ ਆਉਣ ਦਿਓ।";
  }

  if (
    t.includes(
      "Accepted arrangement after applying the remaining",
    )
  ) {
    return "ਆਖਰੀ ਸੰਬੰਧਿਤ ਸੰਕੇਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਸਿਰਫ਼ ਇੱਕ ਹੀ ਪੂਰੀ ਵਿਵਸਥਾ ਬਚਦੀ ਹੈ।";
  }

  if (
    t.includes(
      "remove rotational symmetry",
    )
  ) {
    const match =
      /^Anchored (.+?) at seat/.exec(
        t,
      );
    const name =
      match?.[1]?.trim() ??
      "ਇੱਕ ਵਿਅਕਤੀ";

    return `ਗੋਲ ਮੇਜ਼ ਉੱਤੇ ${name} ਨੂੰ ਹਵਾਲਾ ਸਥਾਨ ਤੇ ਰੱਖ ਕੇ ਘੁੰਮਾਅ-ਸਮਾਨ ਦੁਹਰਾਅ ਹਟਾਇਆ ਜਾਂਦਾ ਹੈ।`;
  }

  if (t.startsWith("Branching on")) {
    const match =
      /^Branching on (.+?) at seat (\d+)\.$/.exec(
        t,
      );
    if (match) {
      return `${match[1]} ਨੂੰ ਸਥਾਨ ${match[2]} ਤੇ ਅਜ਼ਮਾਓ; ਜੇ ਅਗਲਾ ਕੋਈ ਸੰਕੇਤ ਅਸੰਭਵ ਹੋ ਜਾਵੇ ਤਾਂ ਇਹ ਸੰਭਾਵਨਾ ਰੱਦ ਕਰਕੇ ਅਗਲੀ ਜਾਂਚ ਕਰੋ।`;
    }
  }

  if (
    t.includes("Detected contradiction") &&
    t.includes("pruning the branch")
  ) {
    const match =
      /Detected contradiction for (.+?) at seat (\d+)/.exec(
        t,
      );
    if (match) {
      return `ਸਥਾਨ ${match[2]} ਤੇ ${match[1]} ਰੱਖਣ ਨਾਲ ਪਹਿਲਾਂ ਦੇ ਸੰਕੇਤ ਟੁੱਟ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਇਹ ਵਿਕਲਪ ਖਾਰਜ ਹੈ।`;
    }
  }

  if (t.includes("Propagated")) {
    return "ਇਸ ਪੜਾਅ ਤੇ ਕਈ ਸੰਕੇਤ ਪਹਿਲਾਂ ਹੀ ਪੂਰੇ ਹੁੰਦੇ ਹਨ, ਇਸ ਲਈ ਅੰਸ਼ਿਕ ਚਿੱਤਰ ਸਪਸ਼ਟ ਹੋ ਜਾਂਦਾ ਹੈ।";
  }

  if (
    t.includes(
      "Accepted canonical arrangement",
    )
  ) {
    return "ਸਾਰੇ ਸੰਕੇਤ ਬਿਨਾਂ ਵਿਰੋਧ ਦੇ ਪੂਰੇ ਹੁੰਦੇ ਹਨ, ਇਸ ਲਈ ਅੰਤਿਮ ਕ੍ਰਮ ਮਨਜ਼ੂਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।";
  }

  if (
    t.includes(
      "mirror-equivalent arrangement",
    )
  ) {
    return "ਸਮਮਿਤੀ ਕਰਕੇ ਦੂਜਾ ਰੂਪ ਦਿਖ ਸਕਦਾ ਹੈ, ਪਰ ਤਰਕ ਅਨੁਸਾਰ ਉਹੀ ਇੱਕ ਉੱਤਰ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।";
  }

  return t;
}

function conclusionPa(
  prompt: SeatingQuestionPrompt,
  answerDisplay: string,
) {
  switch (prompt.type) {
    case "neighbor-left":
      return `ਇਸ ਲਈ ${prompt.anchor} ਦੇ ਤੁਰੰਤ ਖੱਬੇ ਪਾਸੇ ${answerDisplay} ${punjabiSitVerb(answerDisplay)}।`;
    case "neighbor-right":
      return `ਇਸ ਲਈ ${prompt.anchor} ਦੇ ਤੁਰੰਤ ਸੱਜੇ ਪਾਸੇ ${answerDisplay} ${punjabiSitVerb(answerDisplay)}।`;
    case "relative":
      return `ਇਸ ਲਈ ${prompt.anchor} ਤੋਂ ਗਿਣ ਕੇ ਲੋੜੀਂਦੀ ਥਾਂ ਤੇ ${answerDisplay} ${punjabiSitVerb(answerDisplay)}।`;
    case "opposite":
      return `ਇਸ ਲਈ ${prompt.anchor} ਦੇ ਸਾਹਮਣੇ ${answerDisplay} ${punjabiSitVerb(answerDisplay)}।`;
    case "facing":
      return `ਇਸ ਲਈ ${prompt.anchor} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ${answerDisplay} ${punjabiSitVerb(answerDisplay)}।`;
    case "slot-occupant":
      return `ਇਸ ਲਈ ${prompt.anchor} ਤੇ ${answerDisplay} ${punjabiSitVerb(answerDisplay)}।`;
    case "entity-slot":
      return `ਇਸ ਲਈ ${prompt.anchor} ਲਈ ਸਹੀ ਵਿਕਲਪ ${answerDisplay} ਹੈ।`;
  }
}

function buildPunjabiSeatingExplanation(
  scenario: SeatingScenario,
) {
  const answerDisplay =
    localizeOptionText(
      scenario.prompt.correctAnswer,
      "pa",
    ).normalize("NFC");
  const parts: string[] = [
    "ਸੰਕੇਤਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਲਾਗੂ ਕਰੋ: ਜਿੱਥੇ ਸਿਰਫ਼ ਇੱਕ ਹੀ ਸੰਭਾਵਨਾ ਬਚੇ, ਉਸਨੂੰ ਲਿਖ ਕੇ ਅੱਗੇ ਵਧੋ ਅਤੇ ਵਿਰੋਧਾਭਾਸ ਵਾਲੇ ਵਿਕਲਪ ਹਟਾਉਂਦੇ ਰਹੋ।",
    arrangementNarrativePa(scenario),
  ];
  const steps =
    scenario.solverInferenceSteps ?? [];

  if (steps.length > 0) {
    parts.push(
      [
        "ਮੁੱਖ ਤਰਕ-ਕ੍ਰਮ:",
        ...steps.map(
          (step, index) =>
            `${index + 1}) ${humanizeSolverDeductionPa(step.deduction)}`,
        ),
      ].join("\n"),
    );
  } else {
    parts.push(
      "ਸਾਰੇ ਸੰਕੇਤ ਮਿਲ ਕੇ ਸਿਰਫ਼ ਇੱਕ ਹੀ ਪੂਰੀ ਵਿਵਸਥਾ ਦਿੰਦੇ ਹਨ।",
    );
  }

  parts.push(
    conclusionPa(
      scenario.prompt,
      answerDisplay,
    ),
  );

  return parts.join("\n\n");
}

function promptToPunjabi(
  prompt: SeatingQuestionPrompt,
) {
  switch (prompt.type) {
    case "neighbor-left":
      return `${prompt.anchor} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਪਾਸੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
    case "neighbor-right":
      return `${prompt.anchor} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
    case "relative":
      return `${prompt.anchor} ਦੇ ${ordinal(prompt.distance)} ${side(prompt.direction)} ਕੌਣ ਬੈਠਾ ਹੈ?`;
    case "opposite":
      return `${prompt.anchor} ਦੇ ਸਾਹਮਣੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
    case "facing":
      return `${prompt.anchor} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
    case "slot-occupant":
      return `ਸਥਾਨ ${prompt.slotIndex + 1} ਤੇ ਕੌਣ ਹੈ?`;
    case "entity-slot":
      return `${prompt.anchor} ਕਿਹੜੇ ਸਥਾਨ ਤੇ ਹੈ?`;
  }
}

function romanClueMarkerForStemPa(
  index: number,
) {
  const markers = [
    "(i)",
    "(ii)",
    "(iii)",
    "(iv)",
    "(v)",
    "(vi)",
    "(vii)",
    "(viii)",
    "(ix)",
    "(x)",
  ];

  return markers[index] ?? `(${index + 1})`;
}

export function realizePunjabi(
  input: NativeRealizerInput,
): NativeRealizerResult {
  const coverageCategory =
    detectCoverageCategory(input);
  const coveragePercent =
    getCoveragePercent(
      "pa",
      coverageCategory,
    );

  if (!isSeatingScenario(input.logic)) {
    if (
      coverageCategory === "seating" &&
      isScenarioSeatingLogic(input.logic)
    ) {
      const bundle =
        realizeScenarioSeatingPunjabi(
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
          ["pa"],
        );
      const validation =
        validateNativeBundle(
          "pa",
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
            language: "pa",
            source: "native-realizer",
            coverageCategory,
            coveragePercent,
            validation,
            bundle,
          }
        : {
            supported: false,
            language: "pa",
            reason:
              "Punjabi seating scenario catch-all failed validation.",
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
        realizeStudioSeatingPunjabi(
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
          ["pa"],
        );
      const validation =
        validateNativeBundle(
          "pa",
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
            language: "pa",
            source: "native-realizer",
            coverageCategory,
            coveragePercent,
            validation,
            bundle,
          }
        : {
            supported: false,
            language: "pa",
            reason:
              "Punjabi seating catch-all failed validation.",
            coverageCategory,
            coveragePercent,
            validation,
          };
    }

    return {
      supported: false,
      language: "pa",
      reason:
        "No Punjabi native realizer is registered for this logic object.",
      coverageCategory,
      coveragePercent,
    };
  }

  const clues = input.logic.clues.map(
    clueToPunjabi,
  );
  const question = [
    "ਹੇਠਾਂ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ ਅਤੇ ਪ੍ਰਸ਼ਨ ਦਾ ਉੱਤਰ ਦਿਓ:",
    ...clues.map(
      (clue, index) =>
        `${romanClueMarkerForStemPa(
          index,
        )} ${clue}`,
    ),
    promptToPunjabi(input.logic.prompt),
  ].join("\n");

  const bundle = {
    question: question.normalize("NFC"),
    options: localOptions(input.question.options),
    explanation:
      buildPunjabiSeatingExplanation(
        input.logic,
      ),
  };
  const primitiveDiagnostics =
    diagnosePrimitiveSupport(
      input.logic.clues.map((clue) =>
        primitiveFromSeatingClueType(
          clue.type,
        ),
      ),
      ["pa"],
    );
  const validation = validateNativeBundle(
    "pa",
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
      language: "pa",
      reason:
        "Punjabi native realization failed validation.",
      coverageCategory,
      coveragePercent,
      validation,
    };
  }

  return {
    supported: true,
    language: "pa",
    source: "native-realizer",
    coverageCategory,
    coveragePercent,
    validation,
    bundle,
  };
}
