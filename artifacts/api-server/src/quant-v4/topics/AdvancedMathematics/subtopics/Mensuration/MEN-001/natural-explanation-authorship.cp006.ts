import type { Men001NaturalExplanationProfile } from "./natural-explanation-authorship";

const PROFILES: Record<string, Men001NaturalExplanationProfile> = {
  "MEN-001-QL-401": {
    opening: "The tape reading is in centimetres, while the answer is required in metres, so only a linear unit conversion is needed.",
    conclusion: "The tape length is {answer}.",
  },
  "MEN-001-QL-402": {
    opening: "The ribbon is measured in metres and must be expressed in the smaller centimetre unit.",
    conclusion: "The ribbon measures {answer}.",
  },
  "MEN-001-QL-403": {
    opening: "Because the measurement is an area, the centimetre-to-metre conversion factor must be squared rather than used once.",
    conclusion: "The sheet has area {answer}.",
  },
  "MEN-001-QL-404": {
    opening: "Square metres and square centimetres differ by the square of the linear factor 100.",
    conclusion: "The floor section covers {answer}.",
  },
  "MEN-001-QL-405": {
    opening: "The platform dimensions use different units, so they must be made consistent before calculating area.",
    conclusion: "The platform area is {answer}.",
  },
  "MEN-001-QL-406": {
    opening: "A perimeter sum is meaningful only after the length and width have been written in the same unit.",
    conclusion: "The frame perimeter is {answer}.",
  },
  "MEN-001-QL-407": {
    opening: "The area is already in square metres, so the centimetre breadth must be converted before the missing length is recovered.",
    conclusion: "The rectangle's missing length is {answer}.",
  },
  "MEN-001-QL-408": {
    opening: "The side is given in centimetres but the courtyard area is requested in square metres, making the order of conversion important.",
    conclusion: "The courtyard covers {answer}.",
  },
  "MEN-001-QL-409": {
    opening: "A uniform enlargement multiplies every boundary segment by the same linear factor.",
    conclusion: "The enlarged figure has perimeter {answer}.",
  },
  "MEN-001-QL-410": {
    opening: "The figure is enlarged in two independent directions, so its area follows the square of the linear scale factor.",
    conclusion: "The similar figure has area {answer}.",
  },
  "MEN-001-QL-411": {
    opening: "For similar figures, the ratio of their perimeters is the same as the ratio of corresponding lengths.",
    conclusion: "The larger figure uses a linear scale factor of {answer}.",
  },
  "MEN-001-QL-412": {
    opening: "The areas of similar figures contain the square of the linear scale factor, so the area ratio must be square-rooted.",
    conclusion: "The linear scale factor is {answer}.",
  },
  "MEN-001-QL-413": {
    opening: "The stated area belongs to the enlarged figure, so the square-law multiplier must be reversed.",
    conclusion: "The original figure had area {answer}.",
  },
  "MEN-001-QL-414": {
    opening: "Increasing every length changes both dimensions involved in area, so the area increase is not merely the stated linear percentage.",
    conclusion: "The area increases by {answer}.",
  },
  "MEN-001-QL-415": {
    opening: "After the uniform reduction, each dimension retains the same fraction of its original value and those fractions multiply in the area.",
    conclusion: "The area decreases by {answer}.",
  },
  "MEN-001-QL-416": {
    opening: "The rectangle's length and breadth change in opposite directions, so their percentage factors must be multiplied.",
    conclusion: "The rectangle's area increases by {answer}.",
  },
  "MEN-001-QL-417": {
    opening: "The original area can be adjusted directly by the separate length-increase and breadth-decrease factors.",
    conclusion: "The rectangle's new area is {answer}.",
  },
  "MEN-001-QL-418": {
    opening: "Each centimetre on the map represents a fixed number of metres on the ground.",
    conclusion: "The actual separation is {answer}.",
  },
  "MEN-001-QL-419": {
    opening: "The real distance must be divided into groups of the distance represented by one map centimetre.",
    conclusion: "The required map length is {answer}.",
  },
  "MEN-001-QL-420": {
    opening: "Map area is affected by the scale in both directions, so the linear scale must be squared.",
    conclusion: "The plot's actual area is {answer}.",
  },
  "MEN-001-QL-421": {
    opening: "To move from actual land area back to map area, the squared scale enlargement must be undone.",
    conclusion: "The field occupies {answer} on the map.",
  },
  "MEN-001-QL-422": {
    opening: "The plan gives two map dimensions, so each is converted to an actual length before their product is taken.",
    conclusion: "The rectangular plot has actual area {answer}.",
  },
  "MEN-001-QL-423": {
    opening: "The square and rectangle use the same wire, so their perimeters are equal even though their dimensions differ.",
    conclusion: "The reshaped rectangle has length {answer}.",
  },
  "MEN-001-QL-424": {
    opening: "The rectangle's complete boundary becomes four equal sides when the wire is reshaped into a square.",
    conclusion: "Each side of the square is {answer}.",
  },
  "MEN-001-QL-425": {
    opening: "The square perimeter becomes the circle circumference, with no wire gained or lost during reshaping.",
    conclusion: "The circle has radius {answer}.",
  },
  "MEN-001-QL-426": {
    opening: "The circular circumference supplies the complete boundary of the new square.",
    conclusion: "The square side is {answer}.",
  },
  "MEN-001-QL-427": {
    opening: "The rectangle perimeter is conserved and becomes the full circumference of the circle.",
    conclusion: "The reshaped circle has radius {answer}.",
  },
  "MEN-001-QL-428": {
    opening: "The square boundary is redistributed equally among the three sides of an equilateral triangle.",
    conclusion: "Each side of the triangle measures {answer}.",
  },
  "MEN-001-QL-429": {
    opening: "The same wire is shared equally among six sides after the square becomes a regular hexagon.",
    conclusion: "Each hexagon side measures {answer}.",
  },
  "MEN-001-QL-430": {
    opening: "The rectangle perimeter first determines the side of the square formed from the same wire.",
    conclusion: "The reshaped square encloses {answer}.",
  },
  "MEN-001-QL-431": {
    opening: "Both figures have the same perimeter, so their areas can be compared after the square side is recovered from that common boundary.",
    conclusion: "The square gains {answer} of area over the rectangle.",
  },
  "MEN-001-QL-432": {
    opening: "Among all rectangles with a fixed perimeter, equal length and breadth produce the greatest area.",
    conclusion: "The greatest possible enclosed area is {answer}.",
  },
  "MEN-001-QL-433": {
    opening: "The circle and square share one perimeter, but their different shapes enclose different areas.",
    conclusion: "The circle encloses {answer} more area than the square.",
  },
  "MEN-001-QL-434": {
    opening: "The circle's circumference becomes the rectangle perimeter, and the known length leaves the breadth to be recovered.",
    conclusion: "The rectangle's breadth is {answer}.",
  },
  "MEN-001-QL-435": {
    opening: "The square perimeter fixes the radius of the circle formed from the same wire before its area can be calculated.",
    conclusion: "The reshaped circle encloses {answer}.",
  },
  "MEN-001-QL-436": {
    opening: "The circular circumference fixes the side of the square formed from the same wire before its area is found.",
    conclusion: "The reshaped square encloses {answer}.",
  },
};

export function getMen001Cp006NaturalExplanationProfile(
  questionLanguageId: string,
): Men001NaturalExplanationProfile | undefined {
  return PROFILES[questionLanguageId];
}

export function getMen001Cp006NaturalExplanationProfileIds() {
  return Object.keys(PROFILES);
}
