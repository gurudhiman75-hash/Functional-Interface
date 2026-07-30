import type { MenCp007PermanentPackage } from "./types";

type NaturalLanguageInput = Pick<
  MenCp007PermanentPackage,
  "qlId" | "seed" | "stem" | "answer" | "explanation"
>;

const CONCEPT_LEADS: Readonly<Record<string, string>> = {
  "MEN-002-QL-001": "Volume tells us how much space a cube occupies. Since all three dimensions are equal to the side, the side is multiplied three times.",
  "MEN-002-QL-002": "A cube has six equal square faces. Total surface area counts all six faces, while lateral surface area counts only the four side faces.",
  "MEN-002-QL-003": "Equal volume means the cube and the cuboid occupy the same amount of space. Find that common volume first and then take the cube root.",
  "MEN-002-QL-004": "A face diagonal lies on one square face of the cube, while a space diagonal runs through the inside of the cube from one corner to the opposite corner.",
  "MEN-002-QL-005": "The diagonal formula can be worked backwards to find the side. Use the positive value because a length cannot be negative.",
  "MEN-002-QL-006": "The given surface-area information must first be converted into the area of one square face. The side is then the positive square root of that face area.",
  "MEN-002-QL-007": "When the side of a cube changes, surface area follows the square of the side and volume follows the cube of the side.",
  "MEN-002-QL-008": "Before multiplying dimensions, write every length in the same unit. After finding the volume, convert cubic centimetres to litres when required.",
  "MEN-002-QL-009": "A cuboid's volume is length × breadth × height. Divide the volume by the product of the two known dimensions to find the missing one.",
  "MEN-002-QL-010": "A closed cuboid has three pairs of equal rectangular faces. Add the areas of one face from each pair and then multiply by 2.",
  "MEN-002-QL-011": "The lateral area comes from the four side faces. For total surface area, the top and bottom must be separated before the missing height is found.",
  "MEN-002-QL-012": "The diagonal of a rectangular face is the hypotenuse of a right triangle whose other two sides are the face dimensions.",
  "MEN-002-QL-013": "Use Pythagoras on the rectangular face. Subtract the square of the known side from the square of the diagonal, then take the positive square root.",
  "MEN-002-QL-014": "The longest straight rod that fits inside a cuboid is its space diagonal, found from the squares of all three dimensions.",
  "MEN-002-QL-015": "Work backwards from the space diagonal. After subtracting the squares of the two known dimensions, take the positive square root.",
  "MEN-002-QL-016": "Multiplying the areas of three adjacent faces gives the square of the cuboid's volume. Taking the positive square root gives the volume.",
  "MEN-002-QL-017": "Choose the two face areas that contain the required dimension and divide by the face area that does not contain it. This gives the square of the required dimension.",
  "MEN-002-QL-018": "The perimeter gives the sum of the two base sides, while the area gives their product. The correct factor pair must satisfy both conditions.",
  "MEN-002-QL-019": "Write the related dimensions as ratio parts multiplied by a common value. Use the volume to find that common value and then the required dimension.",
  "MEN-002-QL-020": "Treat each percentage change as a multiplication factor. Multiply the factors for length, breadth and height to find the overall volume change.",
  "MEN-002-QL-021": "If the old and new cuboids have equal volume, their products length × breadth × height are equal. Use the known new dimensions to find the missing one.",
  "MEN-002-QL-022": "Find the cube volume and cuboid volume separately in the same unit. The required difference is the larger volume minus the smaller volume.",
  "MEN-002-QL-023": "A cuboid has four edges of each of its three dimensions. Therefore, total edge length is four times the sum of length, breadth and height.",
  "MEN-002-QL-024": "A cube has twelve equal edges. Dividing the total edge length by 12 gives the side.",
  "MEN-002-QL-025": "Painting cost depends on area, not volume. First find the surface that is painted and then multiply by the rate per square unit.",
  "MEN-002-QL-026": "The painting rate is the total cost divided by the area painted. The area must be found before the rate is calculated.",
  "MEN-002-QL-027": "Material cost depends on volume. Find the solid's volume first and then multiply by the cost per cubic unit.",
  "MEN-002-QL-028": "A wire frame follows all twelve edges of the cuboid. Find the total edge length and then apply the rate per metre.",
  "MEN-002-QL-029": "A cube frame uses twelve equal edge lengths. Divide the total cost by the total wire length to find the rate.",
  "MEN-002-QL-030": "A prism's volume is its base area multiplied by its length or height. Find the base area using the correct polygon formula first.",
  "MEN-002-QL-031": "For a prism, height equals volume divided by base area. The units also confirm the result: cubic units divided by square units give a length.",
  "MEN-002-QL-032": "Base area equals volume divided by prism height. Cubic units divided by length units give square units.",
  "MEN-002-QL-033": "When the side faces of a right prism are opened out, they form a rectangle. Its width is the base perimeter and its height is the prism height.",
  "MEN-002-QL-034": "From lateral surface area = base perimeter × height, divide by the base perimeter to find the height.",
  "MEN-002-QL-035": "From lateral surface area = base perimeter × height, divide by the height to find the base perimeter.",
  "MEN-002-QL-036": "A closed prism has two equal bases. Remove the lateral area from the total surface area, then divide the remaining area by 2.",
  "MEN-002-QL-037": "Remove the two base areas from the total surface area. The remaining lateral area divided by height gives the base perimeter.",
  "MEN-002-QL-038": "Convert all dimensions to the same unit, count how many complete small solids fit in each direction, and multiply the three counts.",
  "MEN-002-QL-039": "Only complete cubes can be cut. Find how many complete cubes fit, calculate the volume they use, and subtract it from the original volume.",
  "MEN-002-QL-040": "Find the unused volume first. Divide it by the original volume and multiply by 100, keeping the calculation exact until the final rounding step.",
  "MEN-002-QL-041": "Find how many cubes lie in one horizontal layer. The total number of layers then gives the cuboid's height.",
  "MEN-002-QL-042": "A block may be rotated, so every distinct orientation must be checked. Count only whole-number fits in each direction.",
  "MEN-002-QL-043": "If a length is divided into n equal parts, only n − 1 internal cuts are needed in that direction. Add the cuts required in all three directions.",
};

const CALCULATION_BRIDGES = [
  "Putting the given values into the formula gives the calculation below.",
  "Now substitute the measurements from the question.",
  "Using the values in this question, the calculation becomes:",
  "The numerical working is shown below.",
] as const;

const TRAP_OPENERS = [
  "This option is obtained by",
  "You may reach this option by",
  "This answer appears after",
  "This option comes from",
] as const;

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

function lowerFirst(text: string) {
  return text ? `${text[0]!.toLowerCase()}${text.slice(1)}` : text;
}

function simplifyLearnerLanguage(text: string) {
  return text
    .replace(/\bexceeds\b/gi, "is greater than")
    .replace(/\brepresents exactly two\b/gi, "accounts for the two equal")
    .replace(/\bturn the given\b/gi, "rewrite the given")
    .replace(/\breceives? (?:a )?multiplier\b/gi, "is multiplied by a factor")
    .replace(/\bdimension multipliers\b/gi, "change factors for the dimensions")
    .replace(/\bthe unwanted\b/gi, "the other")
    .replace(/\bunwanted\b/gi, "other")
    .replace(/\bisolating\b/gi, "separating")
    .replace(/\bisolate\b/gi, "find")
    .replace(/\bcontribution\b/gi, "part")
    .replace(/\bcontributions\b/gi, "parts")
    .replace(
      /The four vertical walls follow the whole rectangle\./gi,
      "If the four side faces are opened out, their widths together make the perimeter of the rectangular base, $2(l+b)$.",
    )
    .replace(
      /Halving TSA leaves one \$lb\$, one \$lh\$ and one \$bh\$ part\./gi,
      "Dividing the total surface area by 2 leaves the area of one length–breadth face, one length–height face and one breadth–height face.",
    )
    .replace(
      /A dimension is positive\./gi,
      "A length cannot be negative, so we take the positive square root.",
    )
    .replace(
      /The remaining factor is the height\./gi,
      "After the known surface-area part has been removed, the final division gives the height.",
    )
    .replace(
      /Each side face extends through the same height\./gi,
      "Every side face has the same prism height, so the opened side strip has that height throughout.",
    )
    .replace(
      /The widths of all side faces add to the full perimeter of the base\./gi,
      "When the side faces are placed next to one another, their widths add up to the full perimeter of the base.",
    )
    .replace(
      /The remaining factor is the missing side\./gi,
      "Dividing by the two known dimensions leaves the missing side.",
    )
    .replace(
      /The remaining factor is the prism height\./gi,
      "Dividing by the base area gives the prism height.",
    )
    .replace(/\s{2,}/g, " ")
    .trim();
}

function naturalizeStem(stem: string) {
  return simplifyLearnerLanguage(stem)
    .replace(
      /the total surface area is greater than the lateral surface area by/gi,
      "the total surface area is",
    )
    .replace(
      /(the total surface area is )(\$[^$]+\$)(\. Find)/i,
      "$1$2 more than the lateral surface area$3",
    );
}

function naturalizeKeyRule(qlId: string, keyRule: string) {
  const lead = CONCEPT_LEADS[qlId];
  if (!lead) throw new Error(`Missing MEN-CP-007 learner-language concept lead for ${qlId}.`);
  const cleaned = simplifyLearnerLanguage(keyRule);
  return cleaned.startsWith(lead) ? cleaned : `${lead} ${cleaned}`;
}

function naturalizeStepBody(
  body: string,
  equation: string | undefined,
  answer: string,
  stepIndex: number,
  stepCount: number,
  selector: number,
) {
  let cleaned = simplifyLearnerLanguage(body);
  if (equation && !/calculation below|substitut|numerical working|calculation becomes/i.test(cleaned)) {
    const bridge = CALCULATION_BRIDGES[(selector + stepIndex) % CALCULATION_BRIDGES.length]!;
    cleaned = `${cleaned} ${bridge}`;
  }
  if (stepIndex === stepCount - 1 && !cleaned.includes(answer)) {
    cleaned = `${cleaned} Therefore, the required answer is ${answer}.`;
  }
  return cleaned;
}

function naturalizeTrap(trap: string, index: number, selector: number) {
  const match = trap.match(/^(Option [A-D] \(.+\)):\s*(?:Common mistake:\s*)?(.*)$/);
  if (!match) return simplifyLearnerLanguage(trap);

  const option = match[1]!;
  let reason = simplifyLearnerLanguage(match[2]!)
    .replace(/^dividing by twice the base area rather than separating the vertical-face term/i,
      "dividing by twice the base area instead of first separating the area of the four side faces")
    .replace(/^halving the lateral area but not dividing by the half the base perimeter \$l\+b\$/i,
      "halving the lateral area but stopping before dividing by the sum $l+b$")
    .replace(/^dividing by the rectangular base area instead of the base perimeter/i,
      "dividing by the base area $lb$ instead of the base perimeter $2(l+b)$")
    .replace(/^reporting a ratio without forming/i,
      "stopping at a ratio instead of forming")
    .replace(/^combining the face areas in the order that gives/i,
      "combining the face areas in an order that finds");

  reason = lowerFirst(reason.replace(/[.!?]+$/, ""));
  const opener = TRAP_OPENERS[(selector + index) % TRAP_OPENERS.length]!;
  return `${option}: ${opener} ${reason}.`;
}

export function applyMenCp007NaturalLanguage(question: NaturalLanguageInput) {
  const selector = hashText(`${question.qlId}:${question.seed}`);
  const steps = question.explanation.steps.map((step, index, all) => ({
    ...step,
    title: simplifyLearnerLanguage(step.title),
    body: naturalizeStepBody(
      step.body,
      step.equation,
      question.answer,
      index,
      all.length,
      selector,
    ),
  }));

  return {
    stem: naturalizeStem(question.stem),
    explanation: {
      keyRule: naturalizeKeyRule(question.qlId, question.explanation.keyRule),
      steps,
      shortcut: simplifyLearnerLanguage(question.explanation.shortcut),
      traps: question.explanation.traps.map((trap, index) =>
        naturalizeTrap(trap, index, selector),
      ),
    },
  };
}

export function getMenCp007NaturalLanguageProfileCount() {
  return Object.keys(CONCEPT_LEADS).length;
}
