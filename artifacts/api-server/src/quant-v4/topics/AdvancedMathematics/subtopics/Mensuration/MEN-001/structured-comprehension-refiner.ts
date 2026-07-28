import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters } from "./types";

type StepSection = Extract<Men001ExplanationSection, { kind: "STEP" }>;
type ShortcutSection = Extract<Men001ExplanationSection, { kind: "EXAM_SHORTCUT" }>;

function areaDirective(mode: string) {
  if (mode === "convertSquareCentimetresToSquareMetres") {
    return "This is an area conversion, so divide the cm² value by 10,000. Dividing by only 100 would convert a length, not an area.";
  }
  if (mode === "convertSquareMetresToSquareCentimetres") {
    return "This is an area conversion, so multiply the m² value by 10,000. The factor is 100 × 100 because area has two dimensions.";
  }
  if (/MixedLengthUnits|SideUnitConversion/.test(mode)) {
    return "Convert every length to the required unit first. Then use those converted measurements in the area formula, so the final answer has the correct square unit.";
  }
  if (/AreaAfterLinearScaling|OriginalAreaFromScaledArea|MapArea|ActualAreaFromMap|ActualPlotArea|PercentageDimensionChanges/.test(mode)) {
    return "Area changes in both dimensions. Apply the squared scale factor—or both percentage multipliers—to the original area, then simplify.";
  }
  if (/CircleAreaFromSquareWire/.test(mode)) {
    return "Use the radius found from the conserved wire length in A = πr². The original square's area is not the required area.";
  }
  if (/SquareAreaFrom.*Wire|SquareAreaFromRectangleWire/.test(mode)) {
    return "Use the square side found from the conserved wire length, then calculate A = s². Do not use the original shape's area.";
  }
  if (/AreaDifference.*SamePerimeter/.test(mode)) {
    return "Calculate both enclosed areas from the common perimeter, keep the same square unit, and subtract the smaller area from the larger one.";
  }
  if (/MaximumRectangleAreaForFixedPerimeter/.test(mode)) {
    return "For a fixed rectangular perimeter, the square encloses the greatest area. Divide the perimeter by 4 to get the side, then square it.";
  }
  if (/RightTriangle|Isosceles|TriangleAreaBaseHeight|TriangleAreaFromLegs/.test(mode)) {
    return "Use the perpendicular base and height in A = ½bh. The sloping side can be used only after it helps you find the perpendicular height.";
  }
  if (/Heron|TriangleAreaFromThreeSides|TriangleAreaFromSideRatio/.test(mode)) {
    return "Use the three actual side lengths in Heron's formula. When they form a Pythagorean Triplet, the two shorter sides may be used directly as base and height.";
  }
  if (/EquilateralTriangleArea|EquilateralSideFromArea/.test(mode)) {
    return "Use A = (√3/4)a² for an equilateral triangle. Keep the √3 factor and solve only for the positive side length when the area is given.";
  }
  if (/RectangleArea|FloorArea|Rectangular.*Area/.test(mode)) {
    return "Multiply the rectangle's length by its breadth. Make sure both measurements use the same unit before multiplying.";
  }
  if (/SquareArea/.test(mode)) {
    return "A square has equal sides, so calculate side × side = side². The result must be written in a square unit.";
  }
  if (/ParallelogramArea|RhombusAreaFromBaseHeight/.test(mode)) {
    return "Multiply the base by the perpendicular height. A sloping side is not a height unless it meets the base at 90°.";
  }
  if (/RhombusAreaFromDiagonals|KiteAreaFromDiagonals|QuadrilateralAreaFromDiagonal/.test(mode)) {
    return "Use one-half of the product of the perpendicular diagonals. Keep the ½ factor before multiplying.";
  }
  if (/TrapeziumArea/.test(mode)) {
    return "Add the two parallel sides, multiply by the perpendicular height, and divide by 2.";
  }
  if (/CircleArea|AreaFromCircumference|InscribedCircleArea/.test(mode)) {
    return "Use A = πr² with the radius, not the diameter. Squaring the radius gives the area inside the circle.";
  }
  if (/SemicircleArea/.test(mode)) {
    return "Find the full circle area πr², then divide by 2 because a semicircle is exactly half a circle.";
  }
  if (/QuadrantArea/.test(mode)) {
    return "Find the full circle area πr², then divide by 4 because a quadrant is one quarter of a circle.";
  }
  if (/SectorArea/.test(mode)) {
    return "Multiply the full circle area πr² by θ/360. This keeps only the fraction of the circle covered by the central angle.";
  }
  if (/AnnulusArea|CircleMinusSquare|SquareMinusCircle|ShadedArea|Remaining.*Area|Uncovered.*Area/.test(mode)) {
    return "Find the complete outer area and the removed inner area separately, then subtract inner from outer. Both values must use the same square unit.";
  }
  if (/HexagonArea/.test(mode)) {
    return "A regular hexagon is made of six equilateral triangles. Use A = (3√3/2)a², or calculate one triangle and multiply by 6.";
  }
  if (/CompositeArea|LShapeArea|UnionArea|CrossRoadArea|StadiumCompositeArea|TwoRectangleCompositeArea/.test(mode)) {
    return "Split the figure into simple non-overlapping parts. Add included parts and subtract any cut-out or overlapping part exactly once.";
  }
  if (/TilesRequired/.test(mode)) {
    return "Find the complete area to be covered and the area of one tile in the same square unit. The number of tiles is total area ÷ one-tile area.";
  }
  return "Use the area formula that matches this shape, substitute the measurements in the same unit, and simplify to a square-unit answer.";
}

function setupDirective(mode: string) {
  if (mode === "convertSquareCentimetresToSquareMetres") {
    return "Start from 1 m² = 10,000 cm². Therefore a cm² value is converted to m² by dividing by 10,000.";
  }
  if (mode === "convertSquareMetresToSquareCentimetres") {
    return "Start from 1 m² = 10,000 cm². Therefore an m² value is converted to cm² by multiplying by 10,000.";
  }
  if (/Wire/.test(mode)) {
    return "Write old perimeter = new perimeter before substituting numbers. The same wire length must appear on both sides of the equation.";
  }
  if (/Scale|Map/.test(mode)) {
    return /Area/.test(mode)
      ? "Write the area scale factor as k² before using the values, because both dimensions are scaled."
      : "Write the linear scale relation first; lengths and perimeters use k only once.";
  }
  return "Write the complete formula first, then place each given value in its correct position before simplifying.";
}

function inverseDirective(title: string, mode: string) {
  if (title === "Find the Height") {
    if (/MissingHeightFromAreaAndBase/.test(mode)) {
      return "From A = ½bh, multiply the area by 2 and divide by the base: h = 2A/b. This gives the perpendicular height.";
    }
    if (/ParallelogramHeight/.test(mode)) {
      return "From A = bh, divide the area by the base: h = A/b. Use the perpendicular height, not the sloping side.";
    }
    if (/TrapeziumHeight/.test(mode)) {
      return "From A = ½(a + b)h, multiply the area by 2 and divide by the sum of the parallel sides.";
    }
  }
  if (title === "Find the Base") {
    if (/MissingBaseFromAreaAndHeight/.test(mode)) {
      return "From A = ½bh, multiply the area by 2 and divide by the perpendicular height: b = 2A/h.";
    }
    if (/ParallelogramBase/.test(mode)) {
      return "From A = bh, divide the area by the perpendicular height: b = A/h.";
    }
  }
  if (title === "Find the Radius") {
    if (/RadiusFromCircumference/.test(mode)) {
      return "From C = 2πr, divide the circumference by 2π. Keep the positive value because a radius cannot be negative.";
    }
    if (/RadiusFromArea/.test(mode)) {
      return "From A = πr², divide the area by π and take the positive square root: r = √(A/π).";
    }
    if (/RadiusFromArcLength/.test(mode)) {
      return "Use L = (θ/360)2πr and solve for r. Divide by the angle fraction and by 2π.";
    }
    if (/RadiusFromSectorArea/.test(mode)) {
      return "Use A = (θ/360)πr², leave r² alone, and then take the positive square root.";
    }
  }
  return undefined;
}

function ratioFormsRightTriangle(parameters: Men001Parameters) {
  const ratios = [
    parameters.values.ratioA,
    parameters.values.ratioB,
    parameters.values.ratioC,
  ].filter((value): value is number => typeof value === "number");
  if (ratios.length !== 3) return false;
  const [a, b, c] = [...ratios].sort((left, right) => left - right);
  return a ** 2 + b ** 2 === c ** 2;
}

function shortcutFor(parameters: Men001Parameters) {
  const mode = parameters.solveMode;
  if (/TriangleAreaBaseHeight|RightTriangleAreaFromLegs/.test(mode)) {
    return "Halve an even base or height before multiplying. This removes the 1/2 immediately and keeps the arithmetic small.";
  }
  if (/MissingHeightFromAreaAndBase|MissingBaseFromAreaAndHeight/.test(mode)) {
    return "From A = 1/2 bh, double the area first and then divide by the known perpendicular measurement.";
  }
  if (/Isosceles/.test(mode)) {
    return "Look for a Pythagorean Triplet in half-base, height and equal side. If one appears, read the height without expanding a square root.";
  }
  if (/TriangleAreaFromSideRatio/.test(mode)) {
    return ratioFormsRightTriangle(parameters)
      ? "Pythagorean Triplet spotted: after scaling the ratio, use the two shorter sides directly in A = 1/2 bh."
      : "This side ratio is not right-angled, so keep the three actual sides and complete Heron's formula without using a base-height shortcut.";
  }
  if (/Heron/.test(mode)) {
    return "Test the largest side with a² + b² = c². If the triangle is not right-angled, complete Heron's formula from the three sides.";
  }
  if (/EquilateralTriangleArea/.test(mode)) {
    return "Square the side first, then multiply by √3/4. Keeping the coefficient separate reduces arithmetic mistakes.";
  }
  if (/RectangleArea|FloorArea/.test(mode)) {
    return "For a rectangle, multiply the two perpendicular sides directly. Convert units before multiplying, not after.";
  }
  if (/SquareArea/.test(mode) && !/Wire/.test(mode)) {
    return "For a square, one multiplication is enough: A = s². Do not confuse side² with perimeter 4s.";
  }
  if (/RectanglePerimeter/.test(mode)) {
    return "Add length and breadth first, then double once: P = 2(l + b). This avoids counting one pair of sides twice.";
  }
  if (/SquarePerimeter|RegularHexagonSideFromPerimeter|EquilateralSideFromPerimeter/.test(mode)) {
    return "A regular figure has equal sides, so divide its perimeter by the number of sides—or multiply one side by that count.";
  }
  if (/Parallelogram/.test(mode)) {
    return "Use the perpendicular height, not the sloping side. Once base and height are identified, multiply them directly.";
  }
  if (/Rhombus|Kite|QuadrilateralAreaFromDiagonal/.test(mode)) {
    return "Pair the perpendicular diagonals and apply the 1/2 factor before multiplying. Halving one even diagonal first is fastest.";
  }
  if (/Trapezium/.test(mode)) {
    return "Add the parallel sides first, halve that sum, and then multiply by the perpendicular height.";
  }
  if (/CircleCircumference/.test(mode)) {
    return "Use C = πd when the diameter is known and C = 2πr when the radius is known. Choose the form that avoids an extra conversion.";
  }
  if (/CircleArea|AreaFromCircumference/.test(mode)) {
    return "Make sure you have the radius, then square it before multiplying by π. If circumference is given, recover r first.";
  }
  if (/RadiusFromArea/.test(mode)) {
    return "Divide the area by π before taking the square root. Never take the square root before removing π.";
  }
  if (/Semicircle|Quadrant|Sector/.test(mode)) {
    return "Start with the full-circle formula, then apply the fraction 1/2, 1/4 or θ/360 only once.";
  }
  if (/Scale|Map/.test(mode)) {
    return /Area/.test(mode)
      ? "Quick rule: lengths use k, but areas use k². Square the linear factor before applying it to area."
      : "Quick rule: a length or perimeter uses the linear scale factor k only once.";
  }
  if (/AreaPercent|PercentageDimensionChanges/.test(mode)) {
    return "For equal change p% in both dimensions, use 2p ± p²/100. For different changes, multiply their percentage factors.";
  }
  if (/Wire/.test(mode)) {
    return "Write old perimeter = new perimeter first. Cancel common factors before solving for the new side or radius.";
  }
  if (/Path|Border|Shaded|Remaining|Uncovered|Annulus/.test(mode)) {
    return "Calculate outer area − inner area directly. Label the two areas before subtracting so they are not reversed.";
  }
  if (/Tile/.test(mode)) {
    return "Convert units before finding either area, then use number of tiles = total area ÷ area of one tile.";
  }
  if (/Cost|Rate/.test(mode)) {
    return "Finish the geometry first. Apply the money rate only to the final area or boundary length, using the rate's matching unit.";
  }
  if (/Revolution|Wheel/.test(mode)) {
    return "One revolution covers one circumference. Divide total distance by πd, or multiply revolutions by πd, depending on what is unknown.";
  }
  if (/Composite|LShape|Union|CrossRoad|Stadium/.test(mode)) {
    return "Choose a decomposition with the fewest pieces. Add non-overlapping parts and subtract any overlap or cut-out only once.";
  }
  if (/convertSquareCentimetres|convertSquareMetres/.test(mode)) {
    return "Remember the squared conversion: 1 m² = 10,000 cm². Use 10,000, never 100, for area.";
  }
  if (/convertCentimetres|convertMetres|MixedLengthUnits|SideUnitConversion/.test(mode)) {
    return "Convert all lengths to one unit before using the formula. Linear units use a factor of 100 between metres and centimetres.";
  }
  return "Identify exactly what the question asks for, write its matching formula, and simplify with the unit visible at every stage.";
}

function isGenericShortcut(paragraph: string) {
  return /Put the known values into the formula|find the required .* first, then substitute|substitute the measurements once|rearrange the formula.*then solve|Keep all lengths in one unit, cancel common factors|Write the formula before the numbers, cancel common factors/i.test(paragraph);
}

function refineStep(section: StepSection, mode: string): StepSection {
  const inverse = inverseDirective(section.title, mode);
  if (inverse) return { ...section, paragraphs: [inverse, ...section.paragraphs.slice(1)] };
  if (section.title === "Calculate the Area") {
    return { ...section, paragraphs: [areaDirective(mode), ...section.paragraphs.slice(1)] };
  }
  if (section.title === "Set Up the Numerical Calculation") {
    return { ...section, paragraphs: [setupDirective(mode), ...section.paragraphs.slice(1)] };
  }
  return section;
}

function refineShortcut(section: ShortcutSection, parameters: Men001Parameters): ShortcutSection {
  if (!section.paragraphs.some(isGenericShortcut)) return section;
  return { ...section, paragraphs: [shortcutFor(parameters)] };
}

export function refineMen001Comprehension(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
): Men001ExplanationSection[] {
  return sections.map((section): Men001ExplanationSection => {
    if (section.kind === "STEP") return refineStep(section, parameters.solveMode);
    if (section.kind === "EXAM_SHORTCUT") return refineShortcut(section, parameters);
    return section;
  });
}
