import type { MenCp009QuestionV2 } from "./runtime";

export const MEN_CP_009_STUDENT_VIEW_AUTHORITY =
  "MEN-CP009-STUDENT-VIEW-V3" as const;

export interface MenCp009StudentOption {
  label: "A" | "B" | "C" | "D";
  display: string;
  isCorrect: boolean;
}

export interface MenCp009StudentView {
  authority: typeof MEN_CP_009_STUDENT_VIEW_AUTHORITY;
  permanentQlId: string;
  familyId: string;
  solveMode: string;
  seed: string;
  difficulty: string;
  target: string;
  stem: string;
  options: MenCp009StudentOption[];
  correctIndex: number;
  answer: string;
  explanationLines: string[];
  showDiagram: false;
  diagramReason: string;
  sourceValidationPassed: boolean;
  sourceVerificationPassed: boolean;
}

function replaceFractions(value: string): string {
  let text = value;
  // Braced fractions used by the exact formatter.
  for (let pass = 0; pass < 4; pass += 1) {
    text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2");
  }
  // Compact forms such as \\frac43 used by a few handwritten formula strings.
  text = text.replace(/\\frac\s*([0-9])\s*([0-9])/g, "$1/$2");
  return text;
}

export function toPlainStudentMath(value: unknown): string {
  let text = String(value ?? "");
  text = text.replace(/\$([^$]+)\$/g, "$1");
  text = replaceFractions(text);
  text = text
    .replace(/\\text\{([^{}]+)\}/g, "$1")
    .replace(/\\pi/g, "π")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "×")
    .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
    .replace(/\^\{?2\}?/g, "²")
    .replace(/\^\{?3\}?/g, "³")
    .replace(/_\{?1\}?/g, "₁")
    .replace(/_\{?2\}?/g, "₂")
    .replace(/\\,/g, "")
    .replace(/\\;/g, " ")
    .replace(/\\!/g, "")
    .replace(/\\/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text;
}

function stripGenericTrailer(value: string): string {
  const trailer = /\s*(?:calculate carefully(?:\s+and\s+(?:select|choose)\s+the\s+correct\s+(?:answer|option))?|(?:choose|select)\s+the\s+correct\s+(?:answer|option)|determine\s+the\s+required\s+value|find\s+the\s+requested\s+measure)\.?\s*$/i;
  let stem = value.trim();

  // Strip repeatedly so stacked generic trailers cannot survive.
  while (trailer.test(stem)) {
    stem = stem.replace(trailer, "").trim();
  }

  return stem;
}

function naturaliseStem(rawStem: string): string {
  let stem = toPlainStudentMath(rawStem);

  stem = stem
    .replace(/\s*Leave the answer in terms of π\.\s*/gi, " ")
    .replace(/\s*Use π\s*=\s*22\/7\.\s*/gi, " Take π = 22/7. ")
    .replace(/\s*Use π\s*=\s*3\.14\.\s*/gi, " Take π = 3.14. ")
    .replace(/Find only its curved area\./gi, "Find its curved surface area.")
    .replace(/Find its total area including the base\./gi, "Find its total surface area.")
    .replace(/\s+in the simplest form/gi, "")
    .replace(/,\s*first to second/gi, ", in the order given")
    .replace(/\s+\./g, ".")
    .replace(/\s+/g, " ")
    .trim();

  return stripGenericTrailer(stem);
}

function formulaForFamily(familyId: string): string {
  switch (familyId) {
    case "SPHERE_SURFACE_FROM_RADIUS":
    case "SPHERE_SURFACE_FROM_DIAMETER":
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_SURFACE":
      return "Surface area of a sphere = 4πr².";
    case "SPHERE_VOLUME_FROM_RADIUS":
    case "SPHERE_VOLUME_FROM_DIAMETER":
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "SPHERE_DIAMETER_FROM_VOLUME":
      return "Volume of a sphere = 4/3 × πr³.";
    case "HEMISPHERE_CSA_FROM_RADIUS":
    case "HEMISPHERE_RADIUS_FROM_CSA":
      return "Curved surface area of a hemisphere = 2πr².";
    case "HEMISPHERE_TSA_FROM_RADIUS":
    case "HEMISPHERE_RADIUS_FROM_TSA":
      return "Total surface area of a hemisphere = 3πr².";
    case "HEMISPHERE_VOLUME_FROM_RADIUS":
    case "HEMISPHERE_RADIUS_FROM_VOLUME":
      return "Volume of a hemisphere = 2/3 × πr³.";
    case "HEMISPHERE_CAPACITY_LITRES":
      return "Capacity = 2/3 × πr³, and 1000 cm³ = 1 litre.";
    case "SPHERE_PAINTING_COST":
      return "Cost = 4πr² × rate.";
    case "HEMISPHERE_INNER_POLISHING_COST":
      return "Only the inner curved surface is polished, so area = 2πr².";
    case "SPHERE_SURFACE_RATIO":
    case "RADIUS_RATIO_FROM_SURFACE_RATIO":
    case "SPHERE_SURFACE_PERCENT_CHANGE":
      return "Surface area of a sphere is proportional to r².";
    case "SPHERE_VOLUME_RATIO":
    case "RADIUS_RATIO_FROM_VOLUME_RATIO":
    case "SPHERE_VOLUME_PERCENT_CHANGE":
      return "Volume of a sphere is proportional to r³.";
    case "SPHERE_HEMISPHERE_MEASURE_RATIO":
      return "Use the corresponding sphere and hemisphere formula; π and common powers cancel in the ratio.";
    case "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO":
    case "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO":
      return "For a sphere, and for hemisphere CSA, surface area : volume = 3 : r.";
    case "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO":
    case "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO":
      return "For a hemisphere, total surface area : volume = 9 : 2r.";
    default:
      return "Use the required mensuration formula.";
  }
}

function compactCalculation(question: MenCp009QuestionV2): string | null {
  if ("keyRule" in question.explanation) {
    const steps = question.explanation.steps;
    if (!steps.length) return null;
    const last = steps[steps.length - 1]!;
    const raw = last.equation || last.body;
    return toPlainStudentMath(raw)
      .replace(/^Exact cancellation gives\s*/i, "")
      .replace(/^Therefore,?\s*/i, "")
      .trim();
  }

  const steps = question.explanation.steps;
  if (!steps.length) return null;
  return toPlainStudentMath(steps[steps.length - 1]!)
    .replace(/^Therefore,?\s*/i, "")
    .trim();
}

function simpleExplanation(question: MenCp009QuestionV2, answer: string): string[] {
  const formula = formulaForFamily(question.familyId);
  const calculation = compactCalculation(question);
  const lines = [formula];

  if (calculation) lines.push(calculation);
  lines.push(`Answer: ${answer}`);

  const seen = new Set<string>();
  return lines
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => {
      if (!line || seen.has(line)) return false;
      seen.add(line);
      return true;
    })
    .slice(0, 4);
}

export function buildMenCp009StudentView(
  question: MenCp009QuestionV2,
): MenCp009StudentView {
  const answer = toPlainStudentMath(question.answer);
  const stem = naturaliseStem(question.stem);
  const options = question.options.map((option) => ({
    label: option.label,
    display: toPlainStudentMath(option.display),
    isCorrect: option.isCorrect,
  }));

  return {
    authority: MEN_CP_009_STUDENT_VIEW_AUTHORITY,
    permanentQlId: question.permanentQlId,
    familyId: question.familyId,
    solveMode: question.solveMode,
    seed: question.seed,
    difficulty: question.difficulty,
    target: question.target,
    stem,
    options,
    correctIndex: question.correctIndex,
    answer,
    explanationLines: simpleExplanation(question, answer),
    showDiagram: false,
    diagramReason:
      "CP-009 direct sphere/hemisphere items contain no spatial relationship that needs a diagram; generic shape drawings are intentionally omitted.",
    sourceValidationPassed: question.validation.valid,
    sourceVerificationPassed: question.verification.valid,
  };
}
