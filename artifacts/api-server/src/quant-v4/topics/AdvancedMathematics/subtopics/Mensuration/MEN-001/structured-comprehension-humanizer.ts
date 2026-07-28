import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters, Men001SolverResult } from "./types";

type StepSection = Extract<Men001ExplanationSection, { kind: "STEP" }>;
type ShortcutSection = Extract<Men001ExplanationSection, { kind: "EXAM_SHORTCUT" }>;

const TARGET_CONCEPTS: Readonly<Record<string, string>> = {
  "MEN-001-QL-017": "In an isosceles triangle, a perpendicular drawn from the top vertex cuts the base into two equal halves. This creates two right-angled triangles, so Pythagoras gives the vertical height.",
  "MEN-001-QL-403": "A length conversion uses 1 m = 100 cm, but area has two dimensions. Therefore 1 m² = 100 cm × 100 cm = 10,000 cm².",
  "MEN-001-QL-414": "Area depends on two dimensions: length × breadth. When both dimensions increase, the two percentage changes multiply, so the area increase is more than simply adding the two percentages.",
  "MEN-001-QL-436": "When the same wire is bent from a circle into a square, no wire is added or removed. Therefore the circle's circumference and the square's perimeter are equal.",
};

const PYTHAGOREAN_MODE = /RightTriangle|Isosceles|Pythag|Diagonal|Rhombus|TriangleAreaFromSideRatio/i;
const SIDE_VALUE_KEY = /^(?:side|sideA|sideB|sideC|legA|legB|height|halfBase|base|equalSide|hypotenuse|diagonal|diagonalA|diagonalB|halfDiagonalA|halfDiagonalB|length|breadth|ratioA|ratioB|ratioC)$/i;

function finishSentence(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  if (!text) return text;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function plainTeacherSentence(value: string) {
  let text = value.trim().replace(/\s+/g, " ");
  text = text
    .replace(/the governing relation/gi, "the formula")
    .replace(/the relevant (?:area or perimeter |area |perimeter |circle |diagonal |path-area )?relation/gi, "the formula")
    .replace(/rearrange(?:d)? the formula and isolate the ([^.]+)/gi, "use the formula backwards to find the $1")
    .replace(/rearrange(?:d)? the given relation and isolate the ([^.]+)/gi, "use the given formula backwards to find the $1")
    .replace(/isolate the ([^.]+)/gi, "find the $1")
    .replace(/is recovered/gi, "can be found")
    .replace(/are recovered/gi, "can be found")
    .replace(/fixes the/gi, "determines the")
    .replace(/supplies the complete boundary of/gi, "becomes the full boundary of")
    .replace(/must be squared rather than used once/gi, "must be used in both dimensions, so it is squared")
    .replace(/two independent linear dimensions/gi, "length and breadth")
    .replace(/the requested result/gi, "the answer")
    .replace(/the required quantity/gi, "the value asked for")
    .replace(/the stated measures/gi, "the measurements in the question")
    .replace(/evaluate the displayed/gi, "put the known values into the displayed")
    .replace(/evaluate the/gi, "calculate the")
    .replace(/apply the/gi, "use the");
  return finishSentence(text);
}

function wireConcept(mode: string) {
  if (/SquareSideFromCircularWire|SquareAreaFromCircularWire/.test(mode)) {
    return "The wire length stays unchanged when the circle is reshaped into a square. Set the circle's circumference equal to the square's perimeter, then find the side before calculating any area.";
  }
  if (/CircleRadiusFromSquareWire|CircleAreaFromSquareWire/.test(mode)) {
    return "The square and the new circle are made from the same wire, so their boundary lengths are equal. Use square perimeter = circle circumference before finding the circle's radius or area.";
  }
  if (/RectangleWire/.test(mode)) {
    return "Reshaping changes the figure, not the wire length. Equate the old perimeter and the new perimeter, then solve for the missing rectangle measurement.";
  }
  return "The shape changes, but the total wire length does not. Write one equation that makes the old boundary equal to the new boundary.";
}

function conceptFor(
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  existing: string | undefined,
) {
  const targeted = TARGET_CONCEPTS[parameters.questionLanguageId];
  if (targeted) return targeted;

  if (parameters.questionLanguageId === "MEN-001-QL-020") {
    const triplet = findPythagoreanTriplet(parameters, solver);
    const ratios = [parameters.values.ratioA, parameters.values.ratioB, parameters.values.ratioC]
      .filter((value): value is number => typeof value === "number");
    const ratioLabel = ratios.length === 3 ? ratios.join(" : ") : "the given side ratio";
    if (triplet) {
      return `The side ratio ${ratioLabel} forms a right-angled Pythagorean Triplet. Use the perimeter to scale the ratio, then use the two shorter sides as perpendicular base and height.`;
    }
    return `The side ratio ${ratioLabel} gives relative lengths only. Use the perimeter to find the actual sides; because this state is not right-angled, use Heron's formula for the area.`;
  }

  const mode = parameters.solveMode;
  if (/Wire/.test(mode)) return wireConcept(mode);
  if (/SquareCentimetresToSquareMetres|SquareMetresToSquareCentimetres/.test(mode)) {
    return "Area uses two directions, so the centimetre-to-metre conversion is applied twice. That is why 1 m² equals 100 × 100 = 10,000 cm².";
  }
  if (/AreaPercent.*UniformScaling/.test(mode)) {
    return "Area is length × breadth. When both dimensions change by the same percentage, their multipliers are multiplied, which creates a compounding effect.";
  }
  if (/AreaPercent|PercentageDimensionChanges/.test(mode)) {
    return "The two dimensions of the figure change separately. Convert each percentage change into a multiplier and multiply them to see the true change in area.";
  }
  if (/Isosceles/.test(mode)) {
    return "The perpendicular height of an isosceles triangle cuts the base into two equal halves. One half forms a right-angled triangle, so Pythagoras can be used.";
  }
  if (/TriangleAreaFromSideRatioAndPerimeter/.test(mode)) {
    return "The ratio gives only relative side lengths. Use the perimeter to find the value of one ratio part, then multiply to obtain the actual sides before finding the area.";
  }
  if (/Heron|TriangleAreaFromThreeSides/.test(mode)) {
    return "No perpendicular height is given, but all three sides are known. Heron's formula finds the area from those sides after calculating the semiperimeter, which is half the perimeter.";
  }
  if (/RightTriangle|Pythag|Diagonal|RhombusSide/.test(mode)) {
    return "The measurements form a right-angled triangle. The side opposite the 90° angle is the hypotenuse, so use a² + b² = c² to find the missing length.";
  }
  if (/Map|Scale|Similar/.test(mode)) {
    return /Area/.test(mode)
      ? "A map or similar figure changes in both length and breadth. Therefore lengths use the scale factor once, while areas use the square of the scale factor."
      : "Lengths and perimeters are one-dimensional, so they use the scale factor once. Do not square it unless the question asks about area.";
  }
  if (/Path|Border|Shaded|Remaining|Composite/.test(mode)) {
    return "Break the figure into simple parts. Find the complete outer area first, then add or subtract the inner parts according to what is actually covered or left visible.";
  }
  if (/Tile/.test(mode)) {
    return "A tile question compares two areas: the total region and the area covered by one tile. Keep both in the same square unit, then divide total area by one-tile area.";
  }
  if (/Cost|Rate/.test(mode)) {
    return "First find the required geometric area or boundary length. Only after that should the stated money rate be multiplied or divided.";
  }
  if (/Revolution/.test(mode)) {
    return "One complete wheel revolution covers one circumference. Compare the total distance with the distance covered in one revolution.";
  }
  if (/Sector|Arc|Quadrant|Semicircle/.test(mode)) {
    return "A sector, quadrant or semicircle is a fraction of a full circle. Find the full-circle measure first, then take the fraction shown by the angle or shape.";
  }

  return plainTeacherSentence(existing ?? "Choose the formula that matches the shape and the value asked for, then use the given measurements in that formula.");
}

function stepDirective(title: string, mode: string, existing: string | undefined) {
  switch (title) {
    case "Identify the Measurements":
      return "Mark the base and the perpendicular height that belongs to it. The height must meet the base at 90°.";
    case "Substitute and Calculate":
      return "Put the base and perpendicular height into A = ½bh. Cancel the ½ first when one measurement is even, then multiply.";
    case "Apply Pythagoras":
      return "First identify the hypotenuse—the side opposite the 90° angle. Use a² + b² = c² and subtract the known square to find the missing perpendicular length.";
    case "Calculate the Area":
      return "Use the perpendicular measurements found above in the correct area formula, then simplify and keep the square unit.";
    case "Add the Ratio Parts":
      return "Add the ratio numbers to find how many equal parts make the whole perimeter.";
    case "Find One Ratio Unit":
      return "Divide the perimeter by the total number of ratio parts. This gives the actual length represented by one part.";
    case "Find the Actual Side Lengths":
      return "Multiply each ratio number by the value of one part to obtain the three real side lengths.";
    case "Find the Semiperimeter":
      return "Add the three sides and divide by 2. Heron's formula uses this half-perimeter value, called s.";
    case "Apply Heron's Formula":
      return "Use A = √[s(s − a)(s − b)(s − c)]. Each bracket compares the semiperimeter with one side of the triangle.";
    case "Convert the Units":
      return /Square/.test(mode)
        ? "Because this is an area conversion, use the squared factor. Divide by 10,000 for cm² → m², or multiply by 10,000 for m² → cm²."
        : "Write every length in the same unit before using the formula. A linear conversion uses 100 between metres and centimetres.";
    case "Account for Both Dimensions":
      return "Change both length and breadth. Area is their product, so the two percentage multipliers must be multiplied, not simply added.";
    case "Apply the Percentage Change":
      return "Turn each percentage into a multiplier, such as 120% = 1.2, and apply it to the matching dimension.";
    case "Find the New Area Percentage":
      return "Multiply the changed length percentage by the changed breadth percentage. The result shows the new area as a percentage of the original.";
    case "Find the Percentage Increase":
      return "Compare the new area percentage with the original 100%. The amount above 100% is the percentage increase.";
    case "Find the Percentage Decrease":
      return "Compare the remaining area percentage with 100%. The missing part is the percentage decrease.";
    case "Find the Wire Length":
      return "The wire is the full boundary of the original shape. Calculate that complete perimeter or circumference first.";
    case "Find the Side of the Square":
      return "The same wire now makes four equal sides. Divide the total wire length by 4 to get one side.";
    case "Calculate the Enclosed Area":
      return "Now square the side of the new square. This gives the area enclosed after reshaping the wire.";
    case "Calculate the Boundary":
    case "Calculate the Perimeter":
      return "Trace the complete outside edge and include every side or round stated in the question. Do not use an area formula for a boundary.";
    case "Calculate the Circumference":
      return "Use C = 2πr when the radius is known, or C = πd when the diameter is known. This gives the distance around the circle.";
    case "Find the Radius":
      return "Put the known circle measurement into the matching formula and divide until r is left. If a diameter is given, remember that r = d/2.";
    case "Find the Diameter":
      return "Find the radius from the given circle formula, then double it because the diameter passes across the whole circle.";
    case "Find the Base":
      return /Triangle/.test(mode)
        ? "In A = ½bh, multiply the area by 2 and divide by the perpendicular height. The remaining value is the base."
        : "The base is multiplied by the perpendicular height in the area formula. Divide the known area by the height to find the base.";
    case "Find the Height":
      return /Triangle/.test(mode)
        ? "In A = ½bh, multiply the area by 2 and divide by the base. The result is the perpendicular height."
        : "The perpendicular height is the factor paired with the base. Divide the known area by the base.";
    case "Find the Length":
      return "Use the given area or perimeter formula backwards. Substitute the known measurement, then divide or subtract to find the length.";
    case "Find the Breadth":
      return "Use the given area or perimeter formula backwards. Substitute the known length, then divide or subtract to find the breadth.";
    case "Find the Side":
      return /Area/.test(mode)
        ? "A square's side is the positive square root of its area. For other regular figures, divide the perimeter equally among the sides."
        : "Use the perimeter or area formula backwards to find one side, keeping only the positive physical value.";
    case "Find the Diagonal":
      return "The diagonal forms a right-angled triangle with the sides. Use Pythagoras and take the positive square root.";
    case "Area of the Rectangle":
      return "Multiply length by breadth because those two sides meet at a right angle.";
    case "Area of the Square":
      return "All sides of a square are equal, so its area is side × side = side².";
    case "Area of the Circle":
      return "Use A = πr². The radius is squared because area measures the surface inside the circle.";
    case "Find the Semicircle's Radius":
      return "The attached straight side is the semicircle's diameter. Divide it by 2 to get the radius before using the circle formula.";
    case "Area of the Semicircle":
      return "First find the full circle's area with πr², then divide by 2 because only half of the circle is present.";
    case "Area of the Outer Figure":
      return "Find the area enclosed by the complete outside boundary before removing any inner part.";
    case "Area of the Inner Figure":
      return "Find the inner area separately. This is the part that will be removed from the outer area.";
    case "Find the Path Area":
    case "Find the Border Area":
      return "Subtract the inner area from the outer area. The difference is exactly the path or border region.";
    case "Find the Remaining Area":
      return "Start with the complete area and subtract every part that is covered, cut out or excluded.";
    case "Area of One Tile":
      return "Multiply the tile's length and breadth after converting them to the same unit as the floor or path.";
    case "Find the Number of Tiles":
      return "Divide the total area to be covered by the area of one tile. The square units cancel, leaving a count.";
    case "Calculate the Cost":
      return "First confirm the correct area or boundary length, then multiply it by the stated rate. Keep the currency already used in the question.";
    case "Calculate the Rate":
      return "Divide the total cost by the matching area or boundary length. The unit tells you whether the rate is per metre or per square metre.";
    case "Calculate the Cost or Rate":
      return /Rate/.test(mode)
        ? "First find the complete area or boundary length, then divide the stated total cost by that measure to obtain the rate per matching unit."
        : "First find the complete area or boundary length, then multiply it by the stated rate to obtain the total cost in the currency used by the question.";
    case "Apply the Scale Relation":
      return /Area/.test(mode)
        ? "Use the square of the linear scale factor because area changes in both length and breadth."
        : "Use the linear scale factor once because a length or perimeter has only one dimension.";
    case "Take the Positive Square Root":
      return "Take the positive root only. A physical length or scale factor cannot be negative.";
    case "Add the Two Areas":
    case "Combine the Results":
      return "The component regions do not overlap, so add their areas to obtain the complete figure.";
    case "Calculate the Area Difference":
      return "Find both areas using the same unit, then subtract the smaller area from the larger one.";
    case "Find the Width":
      return "Write the path or border area in terms of the unknown width, then solve the resulting equation and keep the positive width.";
    default:
      return plainTeacherSentence(existing ?? "Put the known values into the formula and simplify one line at a time.");
  }
}

function humanizeStep(section: StepSection, parameters: Men001Parameters): StepSection {
  const first = section.paragraphs[0];
  const directive = stepDirective(section.title, parameters.solveMode, first);
  const additional = section.paragraphs
    .slice(1)
    .map(plainTeacherSentence)
    .filter((paragraph) => paragraph && paragraph !== directive);
  return {
    ...section,
    paragraphs: [...new Set([directive, ...additional])],
  };
}

function gcd(left: number, right: number): number {
  let a = Math.abs(Math.round(left));
  let b = Math.abs(Math.round(right));
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}

function findPythagoreanTriplet(parameters: Men001Parameters, solver: Men001SolverResult) {
  if (!PYTHAGOREAN_MODE.test(parameters.solveMode)) return undefined;
  const values = Object.entries({ ...parameters.values, ...solver.workingValues })
    .filter(([key, value]) => SIDE_VALUE_KEY.test(key) && typeof value === "number" && Number.isInteger(value) && value > 0)
    .map(([, value]) => value as number);
  const unique = [...new Set(values)];
  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      for (let k = j + 1; k < unique.length; k += 1) {
        const ordered = [unique[i]!, unique[j]!, unique[k]!].sort((a, b) => a - b);
        if (ordered[0]! ** 2 + ordered[1]! ** 2 !== ordered[2]! ** 2) continue;
        const divisor = ordered.reduce((current, value) => gcd(current, value));
        return {
          actual: ordered,
          reduced: ordered.map((value) => value / divisor),
        };
      }
    }
  }
  return undefined;
}

function tripletLabel(values: readonly number[]) {
  return values.join("–");
}

function humanizeShortcut(
  section: ShortcutSection,
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): ShortcutSection {
  const qlId = parameters.questionLanguageId;
  const triplet = findPythagoreanTriplet(parameters, solver);
  if (qlId === "MEN-001-QL-017" && triplet) {
    const reducedNote = tripletLabel(triplet.actual) === tripletLabel(triplet.reduced)
      ? ""
      : `, a scaled ${tripletLabel(triplet.reduced)} pattern`;
    return {
      ...section,
      paragraphs: [`Pythagorean Triplet spotted: ${tripletLabel(triplet.actual)}${reducedNote}. Read the perpendicular height immediately, then use the full base in the area formula.`],
    };
  }
  if (qlId === "MEN-001-QL-020" && triplet) {
    return {
      ...section,
      paragraphs: [`Pythagorean Triplet spotted: ${tripletLabel(triplet.actual)}. Use the two shorter sides directly as perpendicular base and height instead of applying Heron's formula.`],
    };
  }

  const targeted: Readonly<Record<string, string>> = {
    "MEN-001-QL-403": "Quick memory rule: length conversion uses 100, but area conversion uses 100² = 10,000. For cm² → m², divide by 10,000.",
    "MEN-001-QL-414": "For the same increase p% in both dimensions, use 2p + p²/100. The p²/100 term is the extra compounding effect that simple addition misses.",
    "MEN-001-QL-436": "For circle → square wire reshaping, go straight to s = πr/2. With π = 22/7, this becomes s = 11r/7; then square s for the area.",
  };
  if (targeted[qlId]) return { ...section, paragraphs: [targeted[qlId]!] };
  if (triplet) {
    const reducedNote = tripletLabel(triplet.actual) === tripletLabel(triplet.reduced)
      ? ""
      : `, which reduces to ${tripletLabel(triplet.reduced)}`;
    return {
      ...section,
      paragraphs: [
        `Pythagorean Triplet spotted: ${tripletLabel(triplet.actual)}${reducedNote}. Use the two shorter sides as the perpendicular legs and read the third side without calculating a square root.`,
      ],
    };
  }

  return {
    ...section,
    paragraphs: section.paragraphs.map((paragraph) => {
      const plain = plainTeacherSentence(paragraph)
        .replace(/^For a /, "For ")
        .replace(/^Remember the exam rule:/, "Quick rule:")
        .replace(/^Write one boundary-conservation equation first\./, "Write old perimeter = new perimeter first.")
        .replace(/^Rearrange the formula/, "Put the known values into the formula, then solve");
      return finishSentence(plain);
    }),
  };
}

export function humanizeMen001Comprehension(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): Men001ExplanationSection[] {
  return sections.map((section): Men001ExplanationSection => {
    if (section.kind === "KEY_RULE") {
      return {
        ...section,
        paragraphs: [conceptFor(parameters, solver, section.paragraphs[0])],
      };
    }
    if (section.kind === "STEP") return humanizeStep(section, parameters);
    if (section.kind === "EXAM_SHORTCUT") return humanizeShortcut(section, parameters, solver);
    if (section.kind === "COMMON_TRAPS") {
      return { ...section, paragraphs: section.paragraphs.map(plainTeacherSentence) };
    }
    return section;
  });
}
