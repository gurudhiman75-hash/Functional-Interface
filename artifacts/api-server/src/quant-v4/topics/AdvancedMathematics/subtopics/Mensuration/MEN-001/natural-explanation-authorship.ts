import type { Men001Parameters, Men001SolverResult } from "./types";

export interface Men001NaturalExplanationProfile {
  opening: string;
  conclusion: string;
}

const MEN_001_NATURAL_EXPLANATION_PROFILES: Record<string, Men001NaturalExplanationProfile> = {
  "MEN-001-QL-001": {
    opening: "Because the field’s height is measured at right angles to its base, the usual triangle-area formula applies directly.",
    conclusion: "The triangular field therefore covers {answer}.",
  },
  "MEN-001-QL-002": {
    opening: "For the metal sheet, the given base and perpendicular height describe half of the matching rectangle.",
    conclusion: "So the metal sheet has an area of {answer}.",
  },
  "MEN-001-QL-003": {
    opening: "The banner’s height corresponds to the stated base, so the two measurements can be used together without any further construction.",
    conclusion: "Hence the banner occupies {answer}.",
  },
  "MEN-001-QL-004": {
    opening: "Here the area and base are known, so the triangle formula is rearranged to recover the perpendicular height.",
    conclusion: "The plot’s corresponding height is therefore {answer}.",
  },
  "MEN-001-QL-005": {
    opening: "The glass pane’s area fixes the product of its base and perpendicular height, leaving only the height to be found.",
    conclusion: "Thus the perpendicular height of the pane is {answer}.",
  },
  "MEN-001-QL-006": {
    opening: "Since the park’s area and perpendicular height are given, doubling the area first isolates the missing base cleanly.",
    conclusion: "The base of the triangular park is {answer}.",
  },
  "MEN-001-QL-007": {
    opening: "The panel’s base is the unknown part of the triangle-area relation, so the formula is solved backwards.",
    conclusion: "Therefore the triangular panel has base {answer}.",
  },
  "MEN-001-QL-008": {
    opening: "No perpendicular height is supplied for this plot, but all three sides are known, making Heron’s formula the natural route.",
    conclusion: "The triangular plot encloses {answer}.",
  },
  "MEN-001-QL-009": {
    opening: "For this metal plate, the three side lengths are sufficient to compute the area through the semiperimeter.",
    conclusion: "The area of the triangular plate is therefore {answer}.",
  },
  "MEN-001-QL-010": {
    opening: "The enclosure is a 15–20–25 triangle, and Heron’s formula confirms its area directly from the boundary lengths.",
    conclusion: "So the enclosure contains {answer}.",
  },
  "MEN-001-QL-011": {
    opening: "The garden is right-angled, so its two perpendicular sides already serve as the base and height.",
    conclusion: "The right-triangular garden therefore covers {answer}.",
  },
  "MEN-001-QL-012": {
    opening: "Because the board’s stated sides meet at a right angle, its area is half their product.",
    conclusion: "Hence the board has an area of {answer}.",
  },
  "MEN-001-QL-013": {
    opening: "An equilateral tile has a fixed area relation involving √3, so the exact surd should be preserved.",
    conclusion: "The tile’s exact area is {answer}.",
  },
  "MEN-001-QL-014": {
    opening: "For the equilateral park, all dimensions are controlled by its side length, so the standard exact formula is enough.",
    conclusion: "Thus the park covers exactly {answer}.",
  },
  "MEN-001-QL-015": {
    opening: "The given equilateral area can be matched with (√3/4)a² to recover the side before finding the perimeter.",
    conclusion: "The perimeter of the plot is therefore {answer}.",
  },
  "MEN-001-QL-016": {
    opening: "All three sides of an equilateral frame are equal, so the perimeter is shared equally among them.",
    conclusion: "Each side of the frame measures {answer}.",
  },
  "MEN-001-QL-017": {
    opening: "Dropping a perpendicular from the apex splits this isosceles plot into two congruent right triangles.",
    conclusion: "The isosceles plot therefore has area {answer}.",
  },
  "MEN-001-QL-018": {
    opening: "The altitude of this isosceles plate bisects its base, which gives a small right triangle for finding the height.",
    conclusion: "So the plate’s area is {answer}.",
  },
  "MEN-001-QL-019": {
    opening: "The perpendicular height bisects the 30 m base, allowing Pythagoras to be used on either half.",
    conclusion: "The required height is {answer}.",
  },
  "MEN-001-QL-020": {
    opening: "The side ratio first has to be converted into actual side lengths; only then can the field’s area be found.",
    conclusion: "The triangular field therefore covers {answer}.",
  },
  "MEN-001-QL-021": {
    opening: "The perimeter fixes the scale of the 5:5:6 ratio, after which Heron’s formula gives the sheet’s area.",
    conclusion: "Hence the triangular sheet has area {answer}.",
  },
  "MEN-001-QL-022": {
    opening: "The 3:4:5 ratio contains twelve equal parts altogether, so the plot’s perimeter determines one part.",
    conclusion: "The largest side of the plot is {answer}.",
  },
  "MEN-001-QL-023": {
    opening: "The frame’s perimeter distributes across the 13:14:15 ratio, and the smallest share corresponds to thirteen parts.",
    conclusion: "Therefore the smallest side is {answer}.",
  },
  "MEN-001-QL-024": {
    opening: "The levelling charge depends on area, so the plot’s triangular area must be found before applying the rate.",
    conclusion: "The total levelling cost is {answer}.",
  },
  "MEN-001-QL-025": {
    opening: "A triangle’s perimeter is simply the total length of its three sides, so no area formula is involved here.",
    conclusion: "The frame has perimeter {answer}.",
  },
  "MEN-001-QL-026": {
    opening: "The board is right-angled, making its hypotenuse the side opposite the right angle in Pythagoras’ theorem.",
    conclusion: "The hypotenuse is {answer}.",
  },
  "MEN-001-QL-027": {
    opening: "With the hypotenuse and one perpendicular side known, the other side comes from subtracting squares, not ordinary lengths.",
    conclusion: "The missing perpendicular side is {answer}.",
  },
  "MEN-001-QL-028": {
    opening: "The altitude of an equilateral triangle forms a 30–60–90 triangle, giving an exact √3 expression.",
    conclusion: "Its exact perpendicular height is {answer}.",
  },
  "MEN-001-QL-029": {
    opening: "The √3 factor in the stated area matches the equilateral-area formula, so the side can be recovered exactly.",
    conclusion: "Each side of the field is {answer}.",
  },
  "MEN-001-QL-101": {
    opening: "The plot is rectangular, so its area comes from multiplying the two perpendicular dimensions.",
    conclusion: "The rectangular plot therefore covers {answer}.",
  },
  "MEN-001-QL-102": {
    opening: "For the metal sheet, length and breadth give the full rectangular surface directly.",
    conclusion: "So the sheet has an area of {answer}.",
  },
  "MEN-001-QL-103": {
    opening: "The garden’s boundary contains two lengths and two widths, so both dimensions must be counted twice.",
    conclusion: "The total boundary length is {answer}.",
  },
  "MEN-001-QL-104": {
    opening: "The floor’s area is already known, so dividing by the breadth isolates the missing length.",
    conclusion: "The floor is {answer} long.",
  },
  "MEN-001-QL-105": {
    opening: "Half of the frame’s perimeter equals one length plus one breadth, which makes the breadth easy to isolate.",
    conclusion: "The breadth of the frame is {answer}.",
  },
  "MEN-001-QL-106": {
    opening: "The perimeter first reveals the missing breadth; the field’s area can then be calculated from both sides.",
    conclusion: "The rectangular field therefore has area {answer}.",
  },
  "MEN-001-QL-107": {
    opening: "The board’s diagonal and sides form a right triangle, so the unknown side is found through Pythagoras.",
    conclusion: "The other side of the board is {answer}.",
  },
  "MEN-001-QL-108": {
    opening: "A square has equal length and breadth, so its area is the side multiplied by itself.",
    conclusion: "The tile covers {answer}.",
  },
  "MEN-001-QL-109": {
    opening: "All four sides of the park are equal, so the perimeter is four times one side.",
    conclusion: "The square park has perimeter {answer}.",
  },
  "MEN-001-QL-110": {
    opening: "The side of a square is the positive square root of its area.",
    conclusion: "Each side of the sheet is {answer}.",
  },
  "MEN-001-QL-111": {
    opening: "A square diagonal of a√2 corresponds to side a, so the side can be read before finding the area.",
    conclusion: "The square has area {answer}.",
  },
  "MEN-001-QL-112": {
    opening: "The √2 in the diagonal identifies the square’s side immediately, after which all four sides are added.",
    conclusion: "The field’s perimeter is {answer}.",
  },
  "MEN-001-QL-113": {
    opening: "Only the perpendicular height contributes to a parallelogram’s area; the sloping side is irrelevant.",
    conclusion: "The parallelogram covers {answer}.",
  },
  "MEN-001-QL-114": {
    opening: "The plate’s base and perpendicular height determine the complete parallelogram area.",
    conclusion: "So the plate has area {answer}.",
  },
  "MEN-001-QL-115": {
    opening: "The missing height is obtained by dividing the parallelogram’s area by its base.",
    conclusion: "The corresponding perpendicular height is {answer}.",
  },
  "MEN-001-QL-116": {
    opening: "Here the base is the unknown factor in area = base × perpendicular height.",
    conclusion: "The parallelogram’s base is {answer}.",
  },
  "MEN-001-QL-117": {
    opening: "A parallelogram has two pairs of equal opposite sides, so its perimeter is twice the sum of adjacent sides.",
    conclusion: "Its perimeter is {answer}.",
  },
  "MEN-001-QL-118": {
    opening: "A rhombus is split into four right triangles by its perpendicular diagonals, giving half the product of the diagonals.",
    conclusion: "The rhombus has area {answer}.",
  },
  "MEN-001-QL-119": {
    opening: "The rhombus-area formula is rearranged because one diagonal and the area are already known.",
    conclusion: "The missing diagonal is {answer}.",
  },
  "MEN-001-QL-120": {
    opening: "The diagonals of a rhombus bisect each other at right angles, so their halves form a right triangle with a side of the rhombus.",
    conclusion: "Each side of the rhombus is {answer}.",
  },
  "MEN-001-QL-121": {
    opening: "Half of each diagonal forms the legs of a right triangle; once the side is found, it is counted four times.",
    conclusion: "The rhombus-shaped field has perimeter {answer}.",
  },
  "MEN-001-QL-122": {
    opening: "A trapezium’s area uses the average of its parallel sides multiplied by the perpendicular height.",
    conclusion: "The trapezium-shaped plot covers {answer}.",
  },
  "MEN-001-QL-123": {
    opening: "For this plate, the two parallel sides are first averaged and then multiplied by the height.",
    conclusion: "The plate therefore has area {answer}.",
  },
  "MEN-001-QL-124": {
    opening: "The area formula is solved backwards to obtain the perpendicular distance between the parallel sides.",
    conclusion: "The trapezium’s height is {answer}.",
  },
  "MEN-001-QL-125": {
    opening: "The known parallel side is removed only after using the area and height to recover the sum of both parallel sides.",
    conclusion: "The other parallel side is {answer}.",
  },
  "MEN-001-QL-126": {
    opening: "The kite’s perpendicular diagonals divide it into triangles, so its area is half their product.",
    conclusion: "The kite has area {answer}.",
  },
  "MEN-001-QL-127": {
    opening: "With the kite’s area and one diagonal known, the second diagonal follows by rearranging the area formula.",
    conclusion: "The missing diagonal is {answer}.",
  },
  "MEN-001-QL-128": {
    opening: "The given diagonal divides the quadrilateral into two triangles that share the same base.",
    conclusion: "The quadrilateral therefore has area {answer}.",
  },
  "MEN-001-QL-129": {
    opening: "A square’s four sides are equal, so one side is one quarter of the perimeter.",
    conclusion: "The frame’s side length is {answer}.",
  },
  "MEN-001-QL-130": {
    opening: "A rhombus is also a parallelogram, so base × perpendicular height gives its area.",
    conclusion: "The rhombus-shaped plot covers {answer}.",
  },
  "MEN-001-QL-131": {
    opening: "The kite has two sides of each given length, so both adjacent pairs must be counted twice.",
    conclusion: "The kite’s perimeter is {answer}.",
  },
  "MEN-001-QL-132": {
    opening: "Unlike its area, a trapezium’s perimeter requires all four side lengths to be added.",
    conclusion: "The trapezium has perimeter {answer}.",
  },
  "MEN-001-QL-201": {
    opening: "The track’s boundary is a full circumference, so the radius is used in 2πr.",
    conclusion: "The circular track is {answer} around.",
  },
  "MEN-001-QL-202": {
    opening: "For the plate, the required boundary length is the circumference of the circle.",
    conclusion: "The plate’s boundary measures {answer}.",
  },
  "MEN-001-QL-203": {
    opening: "Because the wheel’s diameter is given directly, πd is the shortest route to its circumference.",
    conclusion: "The wheel’s circumference is {answer}.",
  },
  "MEN-001-QL-204": {
    opening: "The garden’s surface is a full circle, so its area is found from πr².",
    conclusion: "The circular garden covers {answer}.",
  },
  "MEN-001-QL-205": {
    opening: "The sheet’s radius determines its full circular area through πr².",
    conclusion: "The circular sheet has area {answer}.",
  },
  "MEN-001-QL-206": {
    opening: "The field’s circumference is known, so dividing by 2π recovers the radius.",
    conclusion: "The radius of the field is {answer}.",
  },
  "MEN-001-QL-207": {
    opening: "The tile’s area gives r² after division by π; the positive square root then gives the radius.",
    conclusion: "The tile’s radius is {answer}.",
  },
  "MEN-001-QL-208": {
    opening: "The circumference first gives the radius, which can then be used in the circle-area formula.",
    conclusion: "The circle’s area is {answer}.",
  },
  "MEN-001-QL-209": {
    opening: "A semicircle occupies exactly half the area of the corresponding full circle.",
    conclusion: "The window has area {answer}.",
  },
  "MEN-001-QL-210": {
    opening: "The total boundary of a semicircle includes both the curved half-circumference and the straight diameter.",
    conclusion: "The semicircular boundary measures {answer}.",
  },
  "MEN-001-QL-211": {
    opening: "A quadrant is one quarter of a circle, so only one fourth of πr² is required.",
    conclusion: "The quadrant covers {answer}.",
  },
  "MEN-001-QL-212": {
    opening: "The quadrant’s perimeter consists of a quarter-circle arc together with two radii.",
    conclusion: "Its complete perimeter is {answer}.",
  },
  "MEN-001-QL-213": {
    opening: "The arc occupies the same fraction of the circumference as 72° occupies of 360°.",
    conclusion: "The corresponding arc length is {answer}.",
  },
  "MEN-001-QL-214": {
    opening: "A 180° arc is exactly half of the circle’s circumference.",
    conclusion: "The arc length is {answer}.",
  },
  "MEN-001-QL-215": {
    opening: "The sector is a 180° half-circle, so its area is half of the full circle’s area.",
    conclusion: "The sector has area {answer}.",
  },
  "MEN-001-QL-216": {
    opening: "A 90° sector is one quarter of the circular field.",
    conclusion: "The sector therefore covers {answer}.",
  },
  "MEN-001-QL-217": {
    opening: "The sector’s perimeter includes its arc and the two radii that bound it.",
    conclusion: "The sector’s complete perimeter is {answer}.",
  },
  "MEN-001-QL-218": {
    opening: "The central angle has the same fraction of 360° as the arc has of the full circumference.",
    conclusion: "The arc subtends an angle of {answer}.",
  },
  "MEN-001-QL-219": {
    opening: "The sector’s share of the full circle area gives its share of the full 360° angle.",
    conclusion: "The central angle is {answer}.",
  },
  "MEN-001-QL-220": {
    opening: "The ring is the part left after removing the inner circle from the outer circle.",
    conclusion: "The circular ring has area {answer}.",
  },
  "MEN-001-QL-221": {
    opening: "This path is an annulus, so its area is the difference between the two circular areas.",
    conclusion: "The circular path covers {answer}.",
  },
  "MEN-001-QL-222": {
    opening: "Adding the ring area to the inner circle area recovers the outer circle area, from which the outer radius follows.",
    conclusion: "The outer radius is {answer}.",
  },
  "MEN-001-QL-223": {
    opening: "Each complete turn moves the wheel forward by one circumference.",
    conclusion: "After six revolutions, the wheel travels {answer}.",
  },
  "MEN-001-QL-224": {
    opening: "Since circumference equals π times diameter, the diameter is found by dividing the track length by π.",
    conclusion: "The track’s diameter is {answer}.",
  },
  "MEN-001-QL-225": {
    opening: "The plate’s area first gives the radius squared; doubling the recovered radius gives the diameter.",
    conclusion: "The plate’s diameter is {answer}.",
  },
  "MEN-001-QL-226": {
    opening: "The known arc and central angle fix the circle’s circumference fraction, allowing the radius to be isolated.",
    conclusion: "The circle’s radius is {answer}.",
  },
  "MEN-001-QL-227": {
    opening: "The sector occupies a known fraction of the full circle, so its area can be scaled up before taking the square root.",
    conclusion: "The circle containing the sector has radius {answer}.",
  },
  "MEN-001-QL-228": {
    opening: "The ring area and outer radius together determine the area of the missing inner circle.",
    conclusion: "The inner radius is {answer}.",
  },
  "MEN-001-QL-229": {
    opening: "The number of complete turns is the travelled distance divided by the distance covered in one turn.",
    conclusion: "The wheel makes {answer}.",
  },
  "MEN-001-QL-230": {
    opening: "The distance per revolution gives the circumference, and the circumference then gives the radius.",
    conclusion: "The wheel’s radius is {answer}.",
  },
  "MEN-001-QL-301": {
    opening: "The outside path enlarges both the length and breadth of the garden by twice the path width.",
    conclusion: "The path occupies {answer}.",
  },
  "MEN-001-QL-302": {
    opening: "The border lies outside the photograph, so the outer dimensions increase on both sides before the photograph area is removed.",
    conclusion: "The added border has area {answer}.",
  },
  "MEN-001-QL-303": {
    opening: "Because the path runs inside the park, the inner rectangle is smaller by twice the width in each direction.",
    conclusion: "The inside path covers {answer}.",
  },
  "MEN-001-QL-304": {
    opening: "The outer square includes the lawn plus a path on all four sides, so the side increases by twice the width.",
    conclusion: "The outside path has area {answer}.",
  },
  "MEN-001-QL-305": {
    opening: "The inside path is the difference between the whole courtyard and the smaller central square.",
    conclusion: "The path covers {answer}.",
  },
  "MEN-001-QL-306": {
    opening: "The outside circular path forms a ring between the garden radius and the larger outer radius.",
    conclusion: "The circular path occupies {answer}.",
  },
  "MEN-001-QL-307": {
    opening: "The path lies inside the park, so its area is the outer circle minus the smaller unpaved circle.",
    conclusion: "The inside path covers {answer}.",
  },
  "MEN-001-QL-308": {
    opening: "The paving charge applies only to the outside path, so its area must be separated from the garden first.",
    conclusion: "The paving cost is {answer}.",
  },
  "MEN-001-QL-309": {
    opening: "The circular path is an annular region; once its area is known, the stated rate gives the cost.",
    conclusion: "The total cost of laying the path is {answer}.",
  },
  "MEN-001-QL-310": {
    opening: "The unknown width changes the outer side of the square by 2x, so the given path area determines x.",
    conclusion: "The path is {answer} wide.",
  },
  "MEN-001-QL-311": {
    opening: "The number of tiles is the floor area divided by the area covered by one tile.",
    conclusion: "The floor requires {answer}.",
  },
  "MEN-001-QL-312": {
    opening: "Since square tiles cover the hall without gaps, the exact area quotient gives the tile count.",
    conclusion: "The hall needs {answer}.",
  },
  "MEN-001-QL-313": {
    opening: "First find how many tiles cover the floor; the purchase cost then follows from the price of one tile.",
    conclusion: "The total tile cost is {answer}.",
  },
  "MEN-001-QL-314": {
    opening: "The flooring rate is charged per square metre, so the room area is calculated before applying the rate.",
    conclusion: "The flooring will cost {answer}.",
  },
  "MEN-001-QL-315": {
    opening: "Fencing follows the complete rectangular boundary, so the perimeter is multiplied by the rate per metre.",
    conclusion: "The fencing cost is {answer}.",
  },
  "MEN-001-QL-316": {
    opening: "The gate is deliberately left open, so its width must be removed from the park’s full perimeter before costing.",
    conclusion: "The required fencing costs {answer}.",
  },
  "MEN-001-QL-317": {
    opening: "One round uses the plot’s perimeter; five complete rounds use five times that boundary length.",
    conclusion: "The required wire length is {answer}.",
  },
  "MEN-001-QL-318": {
    opening: "The fence follows the circular boundary, so the circumference is first found and then charged at the given rate.",
    conclusion: "The circular park can be fenced for {answer}.",
  },
  "MEN-001-QL-319": {
    opening: "The enclosure’s full perimeter exceeds the used wire by exactly the width of the unfenced gate.",
    conclusion: "The gate is {answer} wide.",
  },
  "MEN-001-QL-320": {
    opening: "Only the inside border is tiled, so the central untiled rectangle is removed before dividing by one tile’s area.",
    conclusion: "The border requires {answer}.",
  },
  "MEN-001-QL-321": {
    opening: "The uncovered portion is what remains after subtracting the mat’s area from the whole floor.",
    conclusion: "The visible floor area is {answer}.",
  },
  "MEN-001-QL-322": {
    opening: "Paint is applied to the wall but not to the door, so the door area is removed before the painting rate is used.",
    conclusion: "The painting cost is {answer}.",
  },
  "MEN-001-QL-323": {
    opening: "The paving tiles cover only the outside path, not the garden itself, so the border area is divided by one tile’s area.",
    conclusion: "The path requires {answer}.",
  },
  "MEN-001-QL-324": {
    opening: "Each fencing round uses the whole perimeter, and the total length for three rounds is then charged at the stated rate.",
    conclusion: "The three-round fencing cost is {answer}.",
  },
  "MEN-001-QL-325": {
    opening: "The outside path creates a larger rectangle whose dimensions are each increased by 2x.",
    conclusion: "The uniform path is {answer} wide.",
  },
  "MEN-001-QL-326": {
    opening: "An inside path leaves a smaller central rectangle, with both dimensions reduced by 2x.",
    conclusion: "The path width is {answer}.",
  },
  "MEN-001-QL-327": {
    opening: "The outside path forms an annulus, so the given ring area determines the difference between the outer and inner radii.",
    conclusion: "The circular path is {answer} wide.",
  },
  "MEN-001-QL-328": {
    opening: "Here the outer radius is fixed and the path removes a ring from inside, leaving a smaller central circle.",
    conclusion: "The inside path has width {answer}.",
  },
  "MEN-001-QL-329": {
    opening: "The two roads overlap at the centre, so their rectangular areas are added and the common rectangle is subtracted once.",
    conclusion: "Together, the roads occupy {answer}.",
  },
  "MEN-001-QL-330": {
    opening: "After finding the combined road area with overlap corrected, that area is removed from the whole field.",
    conclusion: "The part of the field left unused is {answer}.",
  },
  "MEN-001-QL-331": {
    opening: "The uncovered area is the whole floor minus the combined area of all the tiles already laid.",
    conclusion: "The floor still has {answer} uncovered.",
  },
  "MEN-001-QL-332": {
    opening: "The flooring rate is the total charge spread evenly over every square metre of area.",
    conclusion: "The flooring rate is {answer}.",
  },
  "MEN-001-QL-333": {
    opening: "The complete boundary provides the number of metres over which the total fencing cost is spread.",
    conclusion: "The fencing rate is {answer}.",
  },
  "MEN-001-QL-334": {
    opening: "The path area is found by removing the inner courtyard from the outer rectangle, then dividing by one tile’s area.",
    conclusion: "The inside path requires {answer}.",
  },
};

function clean(line: string) {
  return line.trim().replace(/\s+/g, " ");
}

function renderConclusion(template: string, solver: Men001SolverResult) {
  return template.replace("{answer}", solver.answer);
}

export function authorMen001ExplanationLines(
  originalLines: readonly string[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
): string[] {
  const profile = MEN_001_NATURAL_EXPLANATION_PROFILES[parameters.questionLanguageId];
  if (!profile) {
    throw new Error(`MEN-001 requires a human-authored explanation profile for ${parameters.questionLanguageId}.`);
  }
  const cleaned = originalLines.map(clean).filter(Boolean);
  if (cleaned.length < 2) {
    throw new Error(`${parameters.questionLanguageId} produced too little verified explanation content.`);
  }
  const working = cleaned.slice(1, -1);
  return [profile.opening, ...working, renderConclusion(profile.conclusion, solver)];
}

export function getMen001NaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return MEN_001_NATURAL_EXPLANATION_PROFILES[questionLanguageId];
}

export function getMen001NaturalExplanationProfileIds() {
  return Object.keys(MEN_001_NATURAL_EXPLANATION_PROFILES);
}
