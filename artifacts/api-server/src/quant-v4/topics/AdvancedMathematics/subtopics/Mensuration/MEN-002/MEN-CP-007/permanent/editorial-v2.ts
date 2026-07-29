import type { MenCp007PermanentPackage } from "./types";

const SHORTCUT_LEADS: Readonly<Record<string, string>> = {
  "MEN-002-QL-001": "Cube the edge directly; do not multiply by the number of faces.",
  "MEN-002-QL-002": "Square the edge once, then multiply by the number of included faces: $6$ for total area or $4$ for lateral area.",
  "MEN-002-QL-003": "Look for the exact cube root of the volume; an equal-volume cuboid only changes how the volume is supplied.",
  "MEN-002-QL-004": "Identify the diagonal before calculating: use $a\\sqrt{2}$ across one face and $a\\sqrt{3}$ through the cube.",
  "MEN-002-QL-005": "Divide the given diagonal by $\\sqrt{2}$ for a face diagonal or $\\sqrt{3}$ for a space diagonal; matching square-root factors cancel immediately.",
  "MEN-002-QL-006": "First turn the given surface information into one-face area: divide TSA by $6$, LSA by $4$, or TSA–LSA by $2$; then take the square root.",
  "MEN-002-QL-007": "Remember the power ladder for cubes: side uses power $1$, surface area power $2$, and volume power $3$; move between them by the matching root or power.",
  "MEN-002-QL-008": "Put every dimension in one unit before multiplying; convert cubic centimetres to litres only after the volume is known.",
  "MEN-002-QL-009": "Divide the volume by the product of the two known dimensions; the remaining factor is the missing side.",
  "MEN-002-QL-010": "Calculate the three different face areas once; double all three for TSA, or use only the four vertical faces for LSA.",
  "MEN-002-QL-011": "For LSA divide by $2(l+b)$; for TSA first remove the top and bottom term $2lb$, then divide by $2(l+b)$.",
  "MEN-002-QL-012": "Check for a familiar Pythagorean pair before taking a square root; many exam values form an exact triplet.",
  "MEN-002-QL-013": "Subtract the square of the known side from the square of the face diagonal, then take one positive square root.",
  "MEN-002-QL-014": "The longest rod is exactly the space diagonal, so add the squares of length, breadth and height before taking one root.",
  "MEN-002-QL-015": "Square the space diagonal, subtract the squares of the two known dimensions, and take the positive root of what remains.",
  "MEN-002-QL-016": "Multiply the three adjacent face areas and take one square root because their product is $V^2$.",
  "MEN-002-QL-017": "For direct face areas use $l^2=\\frac{(lb)(lh)}{bh}$; for a face-area ratio first recover the common area factor, then divide volume by the face opposite the required side.",
  "MEN-002-QL-018": "Half the perimeter gives the sum of the two base sides; choose the factor pair of the area with that sum.",
  "MEN-002-QL-019": "Write the two related dimensions as ratio terms times $k$; after dividing volume by height, solve the resulting $k^2$ equation.",
  "MEN-002-QL-020": "Use multipliers, not added percentages: multiply each factor $\\frac{100+p}{100}$ and compare the final multiplier with $1$.",
  "MEN-002-QL-021": "Equal volume means old length × breadth × height equals new length × breadth × height; divide the old volume by the two new known dimensions.",
  "MEN-002-QL-022": "Compute the cube and cuboid volumes separately in the same unit, then subtract in the direction stated by ‘exceeds’ or ‘less than’.",
  "MEN-002-QL-023": "A cuboid has four edges of each dimension, so add $l+b+h$ first and multiply the sum by $4$.",
  "MEN-002-QL-024": "All twelve cube edges are equal, so divide the total edge length by $12$ immediately.",
  "MEN-002-QL-025": "Find the required painted area first and then multiply by the per-square-metre rate; do not apply the rate to volume.",
  "MEN-002-QL-026": "Find the painted area first, then divide total cost by that area to obtain the rate per square metre.",
  "MEN-002-QL-027": "Find the solid volume first and multiply by the per-cubic-metre material rate.",
  "MEN-002-QL-028": "Use total edge length $4(l+b+h)$, then multiply by the wire rate per metre.",
  "MEN-002-QL-029": "A cube frame uses $12a$ metres of wire; divide the total cost by that length to get the rate.",
  "MEN-002-QL-030": "Find the base area using the stated polygon formula, then multiply by the prism length or height.",
  "MEN-002-QL-031": "For a right prism, divide volume by base area; cubic units divided by square units leave a length.",
  "MEN-002-QL-032": "Divide volume by prism height; cubic units divided by length units leave square units.",
  "MEN-002-QL-033": "Use $LSA=Ph$; add two base areas only when total surface area is requested.",
  "MEN-002-QL-034": "From $LSA=Ph$, divide the lateral area by the base perimeter to get height.",
  "MEN-002-QL-035": "From $LSA=Ph$, divide the lateral area by height to get the base perimeter.",
  "MEN-002-QL-036": "Remove the lateral part $Ph$ from TSA, then halve the remaining area because a closed prism has two equal bases.",
  "MEN-002-QL-037": "Remove both base areas from TSA, then divide the lateral area by height to get the base perimeter.",
  "MEN-002-QL-038": "Convert to common units, count complete fits along length, breadth and height, and multiply the three direction counts.",
  "MEN-002-QL-039": "Count only complete cubes, find their used volume, and subtract it from the original cuboid volume.",
  "MEN-002-QL-040": "Find wasted volume exactly as in the unused-volume question, then divide by the original volume and multiply by $100$.",
  "MEN-002-QL-041": "Divide the total number of cubes by the number in one horizontal layer, then multiply the number of layers by one cube edge.",
  "MEN-002-QL-042": "Test all six block orientations using whole-number fits along the three box dimensions; the volume quotient is only an upper bound.",
  "MEN-002-QL-043": "If there are $n$ equal parts along one direction, only $n-1$ internal grid planes are needed; add the three direction counts.",
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
    .replace(/(^|[=$])Cuts=/g, "$1\\text{Cuts}=");
}

function inlineEquation(equation: string | undefined) {
  if (!equation) return null;
  const cleaned = cleanMathTypography(equation.trim());
  if (cleaned.startsWith("$$") && cleaned.endsWith("$$")) {
    return `$${cleaned.slice(2, -2).trim()}$`;
  }
  return cleaned;
}

function finalWorkedEquation(steps: MenCp007PermanentPackage["explanation"]["steps"]) {
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
  const numericalEquation = finalWorkedEquation(steps);
  const numericClose = numericalEquation
    ? `${bridge} ${numericalEquation}, giving ${cleanMathTypography(question.answer)}.`
    : `${bridge} the correct result is ${cleanMathTypography(question.answer)}.`;

  return {
    stem: cleanMathTypography(question.stem)
      .replace(/\bA cubical packing box\b/g, "A cube-shaped packing box")
      .replace(/\bA cubical storage block\b/g, "A cube-shaped storage block"),
    explanation: {
      keyRule: cleanMathTypography(question.explanation.keyRule),
      steps,
      shortcut: `${opener} ${lead} ${numericClose}`,
      traps: question.explanation.traps.map(cleanMathTypography),
    },
    editorialLayoutId: "MEN-CP007-EN-EDITORIAL-V2" as const,
    editorialStatus: "PENDING_PRODUCT_REVIEW" as const,
  };
}

export function getMenCp007ShortcutAuthorityCount() {
  return Object.keys(SHORTCUT_LEADS).length;
}
