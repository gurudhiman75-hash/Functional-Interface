import {
  detectCoverageCategory,
} from "./coverage";
import type {
  NativeRealizerInput,
  RealizerLanguage,
  RealizationCoverageCategory,
} from "./types";

type SeatingSnapshot = {
  participants: string[];
  arrangement: string[];
  direction: "North" | "Centre";
  layout: "linear" | "circular";
  generatedClues: string[];
};

type TraceStep = {
  clue: string;
  placement: string;
};

type TemplateSet = {
  headers: {
    setup: string;
    steps: string;
    visual: string;
    conclusion: string;
  };
  seatingSetup: (
    names: string,
    count: number,
    direction: SeatingSnapshot["direction"],
    layout: SeatingSnapshot["layout"],
  ) => string;
  quantSetup: string;
  step: (
    index: number,
    clue: string,
    placement: string,
  ) => string;
  missingStep: (
    index: number,
    name: string,
    position: string,
  ) => string;
  visual: (visual: string) => string;
  final: (answer: string) => string;
  quantVisual: (answer: string) => string;
};

const TESTBOOK_STYLE_TEMPLATES: Record<
  RealizerLanguage,
  TemplateSet
> = {
  en: {
    headers: {
      setup: "The Setup",
      steps: "Deductive Steps",
      visual: "The Visual Anchor",
      conclusion: "The Final Conclusion",
    },
    seatingSetup: (
      names,
      count,
      direction,
      layout,
    ) =>
      `${count} persons (${names}) are sitting ${layout === "linear" ? "in a straight line" : "around a circular table"} facing ${direction}.`,
    quantSetup:
      "First, identify the Missing Piece and keep the base value clear before doing the calculation.",
    step: (index, clue, placement) =>
      `${index}) Clue: ${clue}. Placement: This tells us that ${placement}.`,
    missingStep: (index, name, position) =>
      `${index}) Clue: Now only one person (${name}) and one seat remain. Placement: Therefore, ${name} sits at ${position}.`,
    visual: (visual) => visual,
    final: (answer) =>
      `Hence, the correct answer is ${answer}.`,
    quantVisual: (answer) =>
      `Missing Piece -> ${answer}`,
  },
  hi: {
    headers: {
      setup: "सेटअप",
      steps: "हल के चरण",
      visual: "अंतिम व्यवस्था",
      conclusion: "अंतिम निष्कर्ष",
    },
    seatingSetup: (
      names,
      count,
      direction,
      layout,
    ) =>
      `${count} व्यक्ति (${names}) ${layout === "linear" ? "एक सीधी पंक्ति में" : "एक वृत्ताकार मेज के चारों ओर"} ${direction === "North" ? "उत्तर" : "केंद्र"} की ओर मुँह करके बैठे हैं।`,
    quantSetup:
      "पहले Missing Piece को पकड़ते हैं और हिसाब लगाने से पहले आधार संख्या साफ रखते हैं।",
    step: (index, clue, placement) =>
      `${index}) संकेत: ${clue}. बैठक: इसका अर्थ है कि ${placement}।`,
    missingStep: (index, name, position) =>
      `${index}) संकेत: अब केवल एक व्यक्ति (${name}) और एक सीट बचती है। बैठक: इसलिए ${name}, ${position} पर बैठेगा।`,
    visual: (visual) => visual,
    final: (answer) =>
      `इसलिए सही उत्तर ${answer} है।`,
    quantVisual: (answer) =>
      `Missing Piece -> ${answer}`,
  },
  pa: {
    headers: {
      setup: "ਸੈਟਅੱਪ",
      steps: "ਹੱਲ ਦੇ ਕਦਮ",
      visual: "ਅੰਤਿਮ ਵਿਵਸਥਾ",
      conclusion: "ਅੰਤਿਮ ਨਤੀਜਾ",
    },
    seatingSetup: (
      names,
      count,
      direction,
      layout,
    ) =>
      `${count} ਵਿਅਕਤੀ (${names}) ${layout === "linear" ? "ਇੱਕ ਸਿੱਧੀ ਰੇਖਾ ਵਿੱਚ" : "ਇੱਕ ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ"} ${direction === "North" ? "ਉੱਤਰ" : "ਕੇਂਦਰ"} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ।`,
    quantSetup:
      "ਪਹਿਲਾਂ Missing Piece ਨੂੰ ਫੜੀਏ ਅਤੇ ਹਿਸਾਬ ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਗਿਣਤੀ ਸਾਫ ਰੱਖੀਏ।",
    step: (index, clue, placement) =>
      `${index}) ਇਸ਼ਾਰਾ: ${clue}. ਬੈਠਕ: ਇਸ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ${placement}।`,
    missingStep: (index, name, position) =>
      `${index}) ਇਸ਼ਾਰਾ: ਹੁਣ ਸਿਰਫ਼ ਇੱਕ ਵਿਅਕਤੀ (${name}) ਅਤੇ ਇੱਕ ਸੀਟ ਬਚਦੀ ਹੈ। ਬੈਠਕ: ਇਸ ਲਈ ${name}, ${position} ਤੇ ਬੈਠਦਾ ਹੈ।`,
    visual: (visual) => visual,
    final: (answer) =>
      `ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${answer} ਹੈ।`,
    quantVisual: (answer) =>
      `Missing Piece -> ${answer}`,
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value &&
    typeof value === "object" &&
    !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((item) => String(item).trim())
        .filter(Boolean)
    : [];
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function getNestedRecords(input: NativeRealizerInput) {
  const question = input.question as any;
  const logic = asRecord(input.logic);
  const debug = asRecord(question.debugMetadata);
  const procedural = asRecord(
    debug.proceduralScenario,
  );
  return {
    question,
    logic,
    debug,
    procedural,
  };
}

function extractSeatingSnapshot(
  input: NativeRealizerInput,
): SeatingSnapshot | null {
  const {
    logic,
    procedural,
  } = getNestedRecords(input);
  const candidates = [logic, procedural];
  const source = candidates.find(
    (candidate) =>
      asStringArray(candidate.participants).length ||
      asStringArray(candidate.arrangement).length ||
      typeof candidate.finalArrangement === "string",
  );

  if (!source) return null;

  const arrangement =
    asStringArray(source.arrangement).length > 0
      ? asStringArray(source.arrangement)
      : typeof source.finalArrangement === "string"
        ? source.finalArrangement
            .split(/\s*[|,]\s*/u)
            .map((item) =>
              item
                .replace(/[\[\]]/g, "")
                .trim(),
            )
            .filter(Boolean)
        : [];

  const participantFromNodes = Array.isArray(source.nodes)
    ? source.nodes
        .map((node: any) =>
          String(
            node.entityId ?? node.id ?? "",
          ).trim(),
        )
        .filter(Boolean)
    : [];

  const participants = unique([
    ...asStringArray(source.participants),
    ...participantFromNodes,
    ...arrangement,
  ]);

  if (!participants.length && !arrangement.length) {
    return null;
  }

  const arrangementType = String(
    source.arrangementType ??
      source.subtype ??
      input.patternId ??
      "",
  ).toLowerCase();
  const orientationType = String(
    source.orientationType ??
      source.facing ??
      "",
  ).toLowerCase();
  const layout =
    arrangementType.includes("circular") ||
    arrangementType.includes("ring")
      ? "circular"
      : "linear";
  const direction =
    layout === "circular" ||
    orientationType.includes("centre") ||
    orientationType.includes("center") ||
    orientationType.includes("in")
      ? "Centre"
      : "North";

  return {
    participants,
    arrangement,
    direction,
    layout,
    generatedClues: [
      ...asStringArray(source.generatedClues),
      ...(Array.isArray(source.clues)
        ? source.clues.map((clue: any) =>
            String(
              clue.text ??
                clue.clue ??
                clue.statement ??
                clue.expression ??
                "",
            ),
          )
        : []),
    ].filter(Boolean),
  };
}

function cleanStepText(text: string) {
  return text
    .replace(/^step\s*\d+\s*[:.)-]?\s*/iu, "")
    .replace(/\bvariable\b/giu, "Missing Piece")
    .replace(/\bhidden quantity\b/giu, "Missing Piece")
    .replace(/\bhidden number\b/giu, "Missing Piece")
    .replace(/\bconstraint\b/giu, "clue")
    .replace(/\bnegative clue\b/giu, "No-Go Zone")
    .replace(/\binference\b/giu, "This tells us")
    .replace(/\bbackwardly\b/giu, "by Rewinding the Story")
    .replace(/\s+/g, " ")
    .trim();
}

function collectTraceSteps(
  input: NativeRealizerInput,
): TraceStep[] {
  const {
    question,
    logic,
    procedural,
  } = getNestedRecords(input);
  const rawSteps = [
    ...(Array.isArray(question.reasoningSteps)
      ? question.reasoningSteps
      : []),
    ...(Array.isArray(question.inferenceTrace?.steps)
      ? question.inferenceTrace.steps
      : []),
    ...(Array.isArray(question.deductionArray)
      ? question.deductionArray
      : []),
    ...(Array.isArray(question.inferenceTrace?.deductionArray)
      ? question.inferenceTrace.deductionArray
      : []),
    ...(Array.isArray(logic.solverTraceExport?.steps)
      ? logic.solverTraceExport.steps
      : []),
    ...(Array.isArray(procedural.solverTraceExport?.steps)
      ? procedural.solverTraceExport.steps
      : []),
    ...(Array.isArray(logic.reasoningSteps)
      ? logic.reasoningSteps
      : []),
    ...(Array.isArray(procedural.reasoningSteps)
      ? procedural.reasoningSteps
      : []),
  ];

  const steps = rawSteps
    .map((entry): TraceStep | null => {
      const text =
        typeof entry === "string"
          ? entry
          : String(
              entry?.statement ??
                entry?.deduction ??
                entry?.text ??
                entry?.mathjax ??
                "",
            );
      const cleaned = cleanStepText(text);
      if (!cleaned) return null;
      return {
        clue: cleaned,
        placement: cleaned,
      };
    })
    .filter(
      (step): step is TraceStep =>
        step !== null,
    );

  return unique(
    steps.map(
      (step) =>
        `${step.clue}|||${step.placement}`,
    ),
  )
    .map((packed) => {
      const [clue, placement] =
        packed.split("|||");
      return {
        clue: clue ?? "",
        placement: placement ?? "",
      };
    })
    .slice(0, 5);
}

function getAnswerText(input: NativeRealizerInput) {
  return String(
    input.question.options?.[
      input.question.correct
    ] ?? "",
  ).trim();
}

function formatPosition(
  index: number,
  language: RealizerLanguage,
) {
  const seatNumber = index + 1;
  if (language === "hi") {
    return `सीट ${seatNumber}`;
  }
  if (language === "pa") {
    return `ਸੀਟ ${seatNumber}`;
  }
  return `Seat ${seatNumber}`;
}

function buildMissingPlayerStep(
  snapshot: SeatingSnapshot,
  existingCount: number,
  language: RealizerLanguage,
) {
  if (!snapshot.arrangement.length) return null;

  const mentioned = new Set(
    snapshot.generatedClues
      .join(" ")
      .split(/[^A-Za-z\u0900-\u097F\u0A00-\u0A7F]+/u)
      .filter(Boolean),
  );
  const missing = snapshot.participants.filter(
    (name) => !mentioned.has(name),
  );

  if (missing.length !== 1) return null;

  const name = missing[0]!;
  const seatIndex =
    snapshot.arrangement.indexOf(name);
  if (seatIndex < 0) return null;

  return TESTBOOK_STYLE_TEMPLATES[
    language
  ].missingStep(
    existingCount + 1,
    name,
    formatPosition(seatIndex, language),
  );
}

function renderSection(
  header: string,
  body: string,
) {
  return `${header}\n${body}`;
}

function renderSeatingExplanation(
  input: NativeRealizerInput,
  language: RealizerLanguage,
) {
  const template =
    TESTBOOK_STYLE_TEMPLATES[language];
  const snapshot =
    extractSeatingSnapshot(input);
  const answer = getAnswerText(input);

  if (!snapshot) return null;

  const names =
    snapshot.participants.join(", ");
  const steps = collectTraceSteps(input);
  const stepLines =
    steps.length > 0
      ? steps.map((step, index) =>
          template.step(
            index + 1,
            step.clue,
            step.placement,
          ),
        )
      : [
          template.step(
            1,
            snapshot.generatedClues[0] ??
              "Start with the clearest fixed clue",
            "we get the first confirmed placement",
          ),
        ];

  const missingStep = buildMissingPlayerStep(
    snapshot,
    stepLines.length,
    language,
  );
  if (missingStep) {
    stepLines.push(missingStep);
  }

  const arrangement =
    snapshot.arrangement.length > 0
      ? `[${snapshot.arrangement.join(" | ")}]`
      : `[${snapshot.participants.join(" | ")}]`;

  return [
    renderSection(
      template.headers.setup,
      template.seatingSetup(
        names,
        snapshot.participants.length ||
          snapshot.arrangement.length,
        snapshot.direction,
        snapshot.layout,
      ),
    ),
    renderSection(
      template.headers.steps,
      stepLines.join("\n"),
    ),
    renderSection(
      template.headers.visual,
      template.visual(arrangement),
    ),
    renderSection(
      template.headers.conclusion,
      template.final(answer),
    ),
  ].join("\n\n");
}

function extractNumbers(text: string) {
  return (
    text.match(/[-+]?\d+(?:\.\d+)?%?/gu) ??
    []
  );
}

function renderQuantExplanation(
  input: NativeRealizerInput,
  language: RealizerLanguage,
) {
  const template =
    TESTBOOK_STYLE_TEMPLATES[language];
  const answer = getAnswerText(input);
  const numbers = extractNumbers(
    input.question.text,
  );
  const steps = collectTraceSteps(input);
  const stepLines =
    steps.length > 0
      ? steps.map((step, index) =>
          template.step(
            index + 1,
            step.clue,
            step.placement,
          ),
        )
      : [
          template.step(
            1,
            numbers.length
              ? `Use the given values ${numbers.join(", ")}`
              : "Start with the value given in the question",
            "the Missing Piece can be found directly",
          ),
        ];

  return [
    renderSection(
      template.headers.setup,
      template.quantSetup,
    ),
    renderSection(
      template.headers.steps,
      stepLines.join("\n"),
    ),
    renderSection(
      template.headers.visual,
      template.quantVisual(answer),
    ),
    renderSection(
      template.headers.conclusion,
      template.final(answer),
    ),
  ].join("\n\n");
}

export function realizeExplanation(
  input: NativeRealizerInput,
  language: RealizerLanguage,
) {
  const category: RealizationCoverageCategory =
    detectCoverageCategory(input);
  const text =
    category === "seating"
      ? renderSeatingExplanation(
          input,
          language,
        ) ??
        renderQuantExplanation(input, language)
      : renderQuantExplanation(input, language);

  return text.normalize("NFC");
}
