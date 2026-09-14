import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY =
  "QUANT-V4-CGL-2024-09-12-S1-FULL-QUANT-SECTION-WAVE12-P2" as const;

const SOURCE_URL = "https://cdn-images.prepp.in/public/image/SSC_CGL_2024_Tier_1_Shift_1_Question_Paper_with_Answer_Key_PDF_Sept_9_2024__5c6951ed6a7ba7f34e3c7ebce0222593.pdf";
const TESTBOOK_CORROBORATION_URL = "https://testbook.com/question-answer/textlet-t-frac25-text-then-the-val--6710cd6d432a14de6221703a";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-12-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2024-09-12-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#quant-q${input.q}`,
    sourceLabel: `Prepp question-paper mirror — SSC CGL Tier-I 2024, held 12 Sep 2024 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-12",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `PREPP-SSC-CGL-2024-09-12-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

// Q68 is deliberately not duplicated here. ALG-W1-S02 is the exact paper item
// (t = 2/5 expression evaluation) and is reused after its questionRef is
// normalized to this paper's Q68 position.
export const QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — complete a number to satisfy 8 and 5 simultaneously", representation: "MISSING_DIGIT_DIVISIBILITY_BY_8_AND_5_MCQ", notes: "A number of the form 72864* must end in 0 or 5 for divisibility by 5, while its last three digits must be divisible by 8. Testing the admissible terminal digit resolves the missing digit." }),
  observation({ q: 52, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — combine category values and compare across months by percentage", representation: "TABLE_COMBINED_CATEGORIES_PERCENT_MORE_MCQ", notes: "Read Q and S for May from the soap-sales table, combine them, and compare that total with P for July using percentage-more over the July P base." }),
  observation({ q: 53, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle geometry — altitude splits a triangle into two right triangles", representation: "TRIANGLE_ALTITUDE_PYTHAGOREAN_RELATION_MCQ", notes: "PS is perpendicular to QR, so Pythagoras applies separately in triangles PQS and PRS. Eliminating PS² identifies the relation among PQ, PR, QS and SR." }),
  observation({ q: 54, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "BODMAS — nested braces and decimal subtraction", representation: "NESTED_DECIMAL_BRACKETS_BODMAS_MCQ", notes: "Evaluate the innermost decimal difference first and then work outward through parentheses, braces and brackets in the stated expression." }),
  observation({ q: 55, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Linked income, expenditure and savings ratios", representation: "INCOME_EXPENDITURE_SAVINGS_LINKED_RATIOS_MCQ", notes: "Let incomes be 10x:12x:9x and expenditures 12y:15y:8y. Q saves 25% of income, so 15y=9x. Substitution gives savings in the ratio 14:15:21." }),
  observation({ q: 56, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Marks table — threshold qualification count", representation: "TABLE_MARKS_PERCENT_THRESHOLD_COUNT_MCQ", notes: "Convert the stated 40% Mathematics threshold to the corresponding mark cut-off and count the students in the table who meet or exceed it." }),
  observation({ q: 57, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle congruence — identify SAS correspondence", representation: "TRIANGLE_SAS_CONGRUENCE_CORRESPONDENCE_MCQ", notes: "Match the two given sides and their included angle in triangles ABC and DEF; the valid correspondence follows the SAS congruence criterion." }),
  observation({ q: 58, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — two inlets and one outlet closed before completion", representation: "PIPES_TWO_INLETS_ONE_OUTLET_CLOSED_BEFORE_FULL_MCQ", notes: "A and B fill at 1/10 and 1/20 tank per minute while C empties at 1/30. Model the interval with all three open and the final two minutes after C is closed." }),
  observation({ q: 59, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Linear integer equations — coin-count system", representation: "THREE_DENOMINATION_COIN_COUNT_INTEGER_SYSTEM_MCQ", notes: "Let the counts of ₹10, ₹5 and ₹2 coins be a,b,c. The equations a+b+c=25 and 10a+5b+2c=120, together with the source condition/options, give 8 ten-rupee coins." }),
  observation({ q: 60, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Mean proportional between two decimals", representation: "MEAN_PROPORTIONAL_DECIMALS_MCQ", notes: "From 28.9:x = x:36.1, x²=28.9×36.1=1043.29, so the positive mean proportional is 32.3." }),
  observation({ q: 61, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — combine two sectors from a stated total", representation: "PIE_TWO_SECTORS_FROM_TOTAL_MCQ", notes: "Education and Agriculture together account for 24%+12%=36% of the displayed 2910 startups; apply the source chart's integer-count convention to the combined sector." }),
  observation({ q: 62, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — recover cylinder radius from curved surface area and find volume", representation: "CYLINDER_CSA_TO_RADIUS_TO_VOLUME_MCQ", notes: "2πrh=1760 with h=20 gives r=14 (π=22/7). Then πr²h=12320 cubic units." }),
  observation({ q: 63, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Ratio distribution of a fixed amount", representation: "FIXED_AMOUNT_THREE_PART_RATIO_DERIVED_TARGET_MCQ", notes: "Split ₹1200 in the ratio 2:1:3 to obtain the three component amounts, then form the derived sum requested by the paper; the source target is ₹2200." }),
  observation({ q: 64, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Successive discounts on marked price", representation: "THREE_SUCCESSIVE_DISCOUNTS_SELLING_PRICE_MCQ", notes: "Apply the retained-price factors 0.80, 0.85 and 0.90 to ₹5000. The selling price is ₹3060." }),
  observation({ q: 65, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Grouped averages — recover remaining observations from partial totals and relations", representation: "PARTIAL_GROUP_AVERAGES_WITH_REMAINING_RELATIONS_MCQ", notes: "Twelve values average 48, the first five average 45 and the next four average 52. Convert each group to a total, isolate the last three values, then use the stated relations to obtain an average of 48.5 for the 11th and 12th values." }),
  observation({ q: 66, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — radical ratio in 1±sinθ", representation: "RADICAL_ONE_PLUS_MINUS_SIN_TO_SEC_PLUS_TAN_MCQ", notes: "Rationalising the positive acute-angle radical √((1+sinθ)/(1−sinθ)) gives (1+sinθ)/cosθ = secθ+tanθ." }),
  observation({ q: 67, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — simplify a cubic ratio expression", representation: "TRIG_CUBIC_FACTOR_IDENTITY_COMPOSITE_MCQ", notes: "Factor sinθ−2sin³θ and 2cos³θ−cosθ using cos2θ forms, simplify the ratio before cubing, and combine with cot/tan and sec²; the expression reduces to −1." }),
  observation({ q: 69, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Circular track — opposite-direction meeting count", representation: "CIRCULAR_TRACK_OPPOSITE_DIRECTION_CROSSING_COUNT_MCQ", notes: "Relative speed is 5+2=7 rounds per hour. In 1.5 hours the relative distance is 10.5 laps, producing 10 completed crossings after the start under the paper's counting convention." }),
  observation({ q: 70, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — direct common tangent for externally touching circles", representation: "EXTERNALLY_TOUCHING_CIRCLES_DIRECT_COMMON_TANGENT_MCQ", notes: "For radii 16 and 8, centre distance is 24. The direct common tangent is √(24²−(16−8)²)=16√2." }),
  observation({ q: 71, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal transformed value in a rational expression", representation: "RECIPROCAL_SUM_TO_RATIONAL_EXPRESSION_VALUE_MCQ", notes: "Divide numerator and denominator by x. With x+1/x=15, (7x²−9x+7)/(x²−x+1) becomes [7(15)−9]/[15−1]=96/14=48/7." }),
  observation({ q: 72, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — identify values closest to a multi-year average", representation: "TABLE_MULTIYEAR_AVERAGE_CLOSEST_YEARS_MCQ", notes: "The refrigerator figures 1800, 1890, 1910, 1940 and 1960 average to 1900; the closest values are 1890 and 1910, corresponding to 2012 and 2013." }),
  observation({ q: 73, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle angles — distribute 180° by a three-part ratio", representation: "TRIANGLE_ANGLE_RATIO_DIFFERENCE_MCQ", notes: "The ratio 17:13:15 totals 45 parts, so one part is 4°. The requested difference between the 17-part and 13-part angles is 16°." }),
  observation({ q: 74, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric equations — cosecant/cotangent identity", representation: "COSEC2_COT2_LINEAR_EQUATION_ANGLE_MCQ", notes: "Use cosec²θ=1+cot²θ in 2cosec²θ+3cot²θ=17. This gives cot²θ=3, so the intended acute angle is 30°." }),
  observation({ q: 75, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — amount multiple to time multiple", representation: "SIMPLE_INTEREST_AMOUNT_MULTIPLE_TIME_EXTRAPOLATION_MCQ", notes: "If the amount is 7P after 14 years, the simple interest earned is 6P in 14 years. To reach amount 18P requires interest 17P, so time=14×17/6=39⅔ years." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS = Object.freeze({
  source: "Prepp question-paper/answer-key text mirror — SSC CGL Tier-I 12 Sep 2024 Shift 1",
  sourceUrl: SOURCE_URL,
  sourceMirrorFilenameNote: "The public Prepp PDF filename contains 'Sept_9_2024'; paper identity and question content were cross-corroborated against dated Testbook/response-sheet mirrors for 12 Sep 2024 Shift 1 rather than inferred from the filename.",
  exactReusedQuestionCorroboration: TESTBOOK_CORROBORATION_URL,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-12",
  shift: "Shift 1",
  sectionQuestionRange: "normalized Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2024_09_12_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS.length,
  priorObservationReused: "ALG-W1-S02",
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: true,
  productionPromotionAuthorized: false,
} as const);
