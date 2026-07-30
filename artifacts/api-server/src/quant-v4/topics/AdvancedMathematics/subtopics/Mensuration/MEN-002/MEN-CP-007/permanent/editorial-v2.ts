import type { MenCp007PermanentPackage } from "./types";
import {
  applyMenCp007NaturalLanguage,
  getMenCp007NaturalLanguageProfileCount,
} from "./natural-language";

const SHORTCUT_LEADS: Readonly<Record<string, string>> = {
  "MEN-002-QL-001": "Multiply the side three times. Do not multiply by the number of faces, because volume measures space rather than surface area.",
  "MEN-002-QL-002": "First find one square face, $a^2$. Multiply by $6$ for total surface area or by $4$ for lateral surface area.",
  "MEN-002-QL-003": "Find the common volume first, then take its cube root to obtain the cube's side.",
  "MEN-002-QL-004": "Choose the correct diagonal: $a\\sqrt{2}$ across one face and $a\\sqrt{3}$ through the cube.",
  "MEN-002-QL-005": "Divide a face diagonal by $\\sqrt{2}$ or a space diagonal by $\\sqrt{3}$. Matching square-root factors often cancel immediately.",
  "MEN-002-QL-006": "Find the area of one square face first: divide TSA by $6$, divide LSA by $4$, or divide TSA–LSA by $2$. Then take the square root.",
  "MEN-002-QL-007": "Use the cube scaling pattern: side ratio $r$, surface-area ratio $r^2$, and volume ratio $r^3$.",
  "MEN-002-QL-008": "Convert every dimension to the same unit before multiplying. Convert cubic centimetres to litres only after the volume is known.",
  "MEN-002-QL-009": "Divide the volume by the product of the two known dimensions. The quotient is the missing side.",
  "MEN-002-QL-010": "Calculate $lb$, $lh$ and $bh$ once. Double their sum for TSA, or use $2h(l+b)$ for LSA.",
  "MEN-002-QL-011": "For LSA, divide by $2(l+b)$. For TSA, first subtract the top and bottom area $2lb$, then divide by $2(l+b)$.",
  "MEN-002-QL-012": "Check whether the two face dimensions form a familiar Pythagorean pair before calculating the square root.",
  "MEN-002-QL-013": "Use $b=\\sqrt{d^2-l^2}$, taking the positive root because breadth is a length.",
  "MEN-002-QL-014": "The longest rod is the space diagonal, so use $d=\\sqrt{l^2+b^2+h^2}$.",
  "MEN-002-QL-015": "Square the space diagonal, subtract the squares of the two known dimensions, and take the positive square root.",
  "MEN-002-QL-016": "Multiply the three adjacent face areas and take one square root, because $(lb)(bh)(hl)=V^2$.",
  "MEN-002-QL-017": "To find a dimension, multiply the two face areas containing it and divide by the face area that does not contain it. Then take the positive square root.",
  "MEN-002-QL-018": "Half the perimeter gives the sum of the base sides. Choose the factor pair of the area that has this sum.",
  "MEN-002-QL-019": "Write the related dimensions as ratio parts times $k$. After using the volume, solve for $k$ and then the required dimension.",
  "MEN-002-QL-020": "Convert each percentage change into a factor: for example, a $20\\%$ increase gives $1.20$ and a $10\\%$ decrease gives $0.90$. Multiply the three factors and compare the result with $1$.",
  "MEN-002-QL-021": "Set the old and new volumes equal. Divide the old volume by the two known new dimensions.",
  "MEN-002-QL-022": "Find both volumes in the same unit. Subtract the smaller volume from the larger volume according to the question.",
  "MEN-002-QL-023": "A cuboid has four edges of each dimension, so total edge length is $4(l+b+h)$.",
  "MEN-002-QL-024": "A cube has twelve equal edges, so divide the total edge length by $12$.",
  "MEN-002-QL-025": "Find the area that is actually painted, then multiply by the rate per square metre.",
  "MEN-002-QL-026": "Find the painted area first, then divide the total cost by that area.",
  "MEN-002-QL-027": "Find the solid's volume first and multiply by the material cost per cubic metre.",
  "MEN-002-QL-028": "Use total wire length $4(l+b+h)$ and then multiply by the rate per metre.",
  "MEN-002-QL-029": "A cube frame uses $12a$ metres of wire. Divide the total cost by this length.",
  "MEN-002-QL-030": "Find the base area using the stated polygon formula, then multiply by the prism height or length.",
  "MEN-002-QL-031": "Divide volume by base area. The units reduce from cubic units to a length.",
  "MEN-002-QL-032": "Divide volume by prism height. The units reduce from cubic units to square units.",
  "MEN-002-QL-033": "Use $LSA=Ph$. Add two base areas only when total surface area is required.",
  "MEN-002-QL-034": "The lateral surface area is the base perimeter repeated through the prism height. Divide LSA by the base perimeter: $h=LSA/P$.",
  "MEN-002-QL-035": "The lateral surface area equals base perimeter × height. Divide LSA by the prism height: $P=LSA/h$.",
  "MEN-002-QL-036": "Subtract the lateral area from TSA and divide the remaining area by $2$ to find one base area.",
  "MEN-002-QL-037": "Subtract both base areas from TSA, then divide the remaining lateral area by the prism height.",
  "MEN-002-QL-038": "Convert to common units, count the complete fits in all three directions, and multiply those counts.",
  "MEN-002-QL-039": "Count only complete cubes. Subtract their total used volume from the original cuboid volume.",
  "MEN-002-QL-040": "Find the unused volume, divide by the original volume, multiply by $100$, and round only the final percentage.",
  "MEN-002-QL-041": "Divide the total cube count by the number in one horizontal layer. Multiply the number of layers by one cube edge.",
  "MEN-002-QL-042": "Check every distinct orientation of the block. In each direction, count only complete whole-number fits.",
  "MEN-002-QL-043": "For $n$ equal parts along a direction, the number of internal cuts is $n-1$. Add the cuts for all three directions.",
};

const OPENERS = [
  "Exam-speed method:",
  "Fast exam route:",
  "Time-saving check:",
  "Quick calculation route:",
] as const;

const NUMERIC_BRIDGES = [
  "With the given values,",
  "For the numbers in this question,",
  "Substituting the current values,",
  "Using this question's data,",
] as const;

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function cleanMathTypography(text: string) {
  return text
    .replace(/\\sqrt2\b/g, "\\sqrt{2}")
    .replace(/\\sqrt3\b/g, "\\sqrt{3}")
    .replace(/\\text\{ cm\}\^2/g, "\\text{ cm}^{2}")
    .replace(/\\text\{ cm\}\^3/g, "\\text{ cm}^{3}")
    .replace(/\\text\{ m\}\^2/g, "\\text{ m}^{2}")
    .replace(/\\text\{ m\}\^3/g, "\\text{ m}^{3}")
    .replace(/Shortest\\ side/g, "\\text{Shortest side}")
    .replace(/Longer\\ side/g, "\\text{Longer side}")
    .replace(/Waste\\%/g, "\\text{Waste percentage}")
    .replace(/(^|[=$])Cost=/g, "$1\\text{Cost}=")
    .replace(/(^|[=$])Rate=/g, "$1\\text{Rate}=")
    .replace(/(^|[=$])Maximum=/g, "$1\\text{Maximum}=")
    .replace(/(^|[=$])Cuts=/g, "$1\\text{Cuts}=")
    .replace(/\bcubical\b/gi, "cube-shaped")
    .replace(/\bconstant base area\b/gi, "base area");
}

function inlineEquation(equation: string | undefined) {
  if (!equation) return null;
  const cleaned = cleanMathTypography(equation.trim());
  if (cleaned.startsWith("$$") && cleaned.endsWith("$$")) {
    return `$${cleaned.slice(2, -2).trim()}$`;
  }
  return cleaned;
}

function workedEquation(
  qlId: string,
  steps: MenCp007PermanentPackage["explanation"]["steps"],
) {
  if (qlId === "MEN-002-QL-042") {
    const orientationEquation = steps
      .map((step) => inlineEquation(step.equation))
      .find((equation) => equation?.includes("\\lfloor"));
    if (orientationEquation) return orientationEquation;
  }

  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const equation = inlineEquation(steps[index]?.equation);
    if (equation) return equation;
  }
  return null;
}

export function applyMenCp007EnglishEditorialV2(
  question: Pick<
    MenCp007PermanentPackage,
    "qlId" | "seed" | "stem" | "answer" | "sourcePrototypeId" | "explanation"
  >,
) {
  const lead = SHORTCUT_LEADS[question.qlId];
  if (!lead) throw new Error(`Missing MEN-CP-007 English V2 shortcut authority for ${question.qlId}.`);

  const selector = hashText(`${question.qlId}:${question.seed}:${question.sourcePrototypeId}`);
  const opener = OPENERS[selector % OPENERS.length]!;
  const bridge = NUMERIC_BRIDGES[Math.floor(selector / OPENERS.length) % NUMERIC_BRIDGES.length]!;
  const steps = question.explanation.steps.map((step) => ({
    ...step,
    title: cleanMathTypography(step.title),
    body: cleanMathTypography(step.body),
    ...(step.equation ? { equation: cleanMathTypography(step.equation) } : {}),
  }));
  const numericalEquation = workedEquation(question.qlId, steps);
  const numericClose = numericalEquation
    ? `${bridge} ${numericalEquation}.`
    : `${bridge} the correct result is ${cleanMathTypography(question.answer)}.`;

  const naturalized = applyMenCp007NaturalLanguage({
    qlId: question.qlId,
    seed: question.seed,
    stem: cleanMathTypography(question.stem),
    answer: cleanMathTypography(question.answer),
    explanation: {
      keyRule: cleanMathTypography(question.explanation.keyRule),
      steps,
      shortcut: `${opener} ${lead} ${numericClose}`,
      traps: question.explanation.traps.map(cleanMathTypography),
    },
  });

  return {
    stem: naturalized.stem,
    explanation: naturalized.explanation,
    editorialLayoutId: "MEN-CP007-EN-EDITORIAL-V2" as const,
    editorialStatus: "PENDING_PRODUCT_REVIEW" as const,
  };
}

export function getMenCp007ShortcutAuthorityCount() {
  return Object.keys(SHORTCUT_LEADS).length;
}

export function getMenCp007NaturalLanguageAuthorityCount() {
  return getMenCp007NaturalLanguageProfileCount();
}
