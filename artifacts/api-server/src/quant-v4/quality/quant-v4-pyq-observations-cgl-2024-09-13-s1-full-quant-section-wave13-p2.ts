import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_AUTHORITY =
  "QUANT-V4-CGL-2024-09-13-S1-FULL-QUANT-SECTION-WAVE13-P2" as const;

const SOURCE_URL = "https://cdn-images.prepp.in/public/image/SSC_CGL_2024_September_13_Tier_1_English_Question_Paper_and_Answer_Key_Shift_1__6747ee00c2591f76a8cfb008cc7c3904.pdf";
const SSC_PORTAL_SOURCE_URL = "https://sscportal.in/sites/default/files/ssc-cgl-tier-1-paper-2024-sep-13-shift-1.pdf";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-13-S1";

function observation(input: {
  q: number;
  sourceQuestionId: string;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2024-09-13-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-id-${input.sourceQuestionId}`,
    sourceLabel: `Prepp/SSC response-sheet mirror — SSC CGL Tier-I 2024, held 13 Sep 2024 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-13",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `PREPP-SSC-CGL-2024-09-13-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: `${input.notes} Source question ID ${input.sourceQuestionId}.`,
  });
}

// The response-sheet PDF numbers Quant locally as Q1-Q25. We normalize those
// positions to Q51-Q75 so the paper follows the same full-paper identity contract
// as the other 2024 complete-section evidence files.
export const QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, sourceQuestionId: "630680428139", packageId: "DI-001", topic: "Data Interpretation", subtopic: "Marks table — aggregate five subjects and convert to percentage", representation: "TABLE_MARKS_TOTAL_PERCENTAGE_MCQ", notes: "The five marks are 93, 90, 90, 95 and 78, totalling 446 out of 500; the percentage is 89.2%." }),
  observation({ q: 52, sourceQuestionId: "630680428985", packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Profit percentage — recover cost-price to selling-price ratio", representation: "PROFIT_PERCENT_CP_SP_RATIO_MCQ", notes: "A 250% profit makes selling price 350% of cost price, so CP:SP = 100:350 = 2:7." }),
  observation({ q: 53, sourceQuestionId: "630680285498", packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-003 — Circle chord, central angle and minor-arc length", representation: "CHORD_EQUAL_RADIUS_MINOR_ARC_LENGTH_MCQ", notes: "A chord equal to the radius subtends 60 degrees at the centre. The minor arc is one-sixth of the circumference." }),
  observation({ q: 54, sourceQuestionId: "630680526454", packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle congruence — correspondence of matching sides and angles", representation: "CONGRUENT_TRIANGLES_CORRESPONDING_PARTS_MCQ", notes: "From ΔPQR ≅ ΔABC, P↔A, Q↔B and R↔C. Hence PQ=AB=6 cm and ∠R=180°−70°−50°=60°." }),
  observation({ q: 55, sourceQuestionId: "630680395047", packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Weighted mixture — combine two unit costs in a stated ratio", representation: "TWO_PRICE_WEIGHTED_MIXTURE_UNIT_COST_MCQ", notes: "The two rice rates are ₹50/kg and ₹56/kg. Weighted in the ratio 7:8, the mixture rate is (7×50+8×56)/15 = ₹53.20/kg." }),
  observation({ q: 56, sourceQuestionId: "630680413537", packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — cyclic cubes when three terms sum to zero", representation: "CYCLIC_CUBES_OVER_PRODUCT_IDENTITY_MCQ", notes: "Let a=x−y, b=y−z and c=z−x. Since a+b+c=0, a³+b³+c³=3abc, so the ratio is 3 whenever the denominator is defined." }),
  observation({ q: 57, sourceQuestionId: "630680493820", packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — rate ratio with combined filling time", representation: "TWO_PIPES_RATE_MULTIPLE_COMBINED_TIME_MCQ", notes: "If the slower rate is r, the faster rate is 2.5r. Since 3.5r=1/20, the faster rate is 1/28 tank per minute." }),
  observation({ q: 58, sourceQuestionId: "630680397720", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric complementary angles — convert sin31° to cot59°", representation: "COMPLEMENTARY_ANGLE_SIN_TO_COT_PARAMETER_MCQ", notes: "cot59°=tan31°. With sin31°=α and an acute angle, cos31°=√(1−α²), giving α/√(1−α²)." }),
  observation({ q: 59, sourceQuestionId: "630680387769", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric equation — reciprocal 1±sinθ identity", representation: "RECIPROCAL_ONE_PLUS_MINUS_SIN_TO_COT_COSEC_MCQ", notes: "The left side is 2sec²θ. Thus 2sec²θ=4secθ and, in the acute domain, secθ=2 so θ=60°; cotθ+cosecθ=√3." }),
  observation({ q: 60, sourceQuestionId: "630680387364", packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Linear equations — two drink prices with a fixed item count and total", representation: "TWO_PRICE_ITEM_COUNT_TOTAL_LINEAR_SYSTEM_MCQ", notes: "Let coffee and tea counts be c and t. From c+t=7 and 40c+30t=240, t=4." }),
  observation({ q: 61, sourceQuestionId: "630680526457", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — solve a scalar equation at 30° and 60°", representation: "TRIG_EXACT_VALUES_SCALAR_PARAMETER_MCQ", notes: "cot30°=√3, tan³60°=3√3 and 2sin60°=√3, so 2√3·p=2√3 and p=1." }),
  observation({ q: 62, sourceQuestionId: "630680428055", packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Foundational percentage relation — one candidate has 110% of another candidate's votes", representation: "PERCENT_OF_OTHER_ELECTION_MARGIN_TOTAL_MCQ", notes: "R has 110% of S, so the 10% excess equals the 770-vote margin. S=7700, R=8470 and total valid votes=16170. This supplies PCT-001 whole-section support on a date outside the 25-Jul-2023 cluster." }),
  observation({ q: 63, sourceQuestionId: "630680194642", packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — three externally touching circles with a right triangle of centres", representation: "THREE_TANGENT_CIRCLES_RIGHT_TRIANGLE_CENTRES_MCQ", notes: "AC=r+2, BC=r+1 and AB=5. Since ∠ACB=90°, (r+2)²+(r+1)²=25, giving r=2 as the positive root." }),
  observation({ q: 64, sourceQuestionId: "630680150543", packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Successive discounts to one equivalent discount", representation: "TWO_SUCCESSIVE_DISCOUNTS_EQUIVALENT_RATE_MCQ", notes: "The retained fraction is 0.90×0.85=0.765, so the equivalent single discount is 23.5%." }),
  observation({ q: 65, sourceQuestionId: "630680381252", packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "BODMAS — nested brackets, division and 'of' operations", representation: "BODMAS_NESTED_OF_DIVISION_MCQ", notes: "Apply 'of' before division, then brackets and multiplication/division left to right under the exam convention; the expression evaluates to 100." }),
  observation({ q: 66, sourceQuestionId: "630680428006", packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar graph — compare average turnover across two years", representation: "BAR_GRAPH_TWO_YEAR_AVERAGE_TURNOVER_DIFFERENCE_MCQ", notes: "Read the five company turnovers for 2018-19 and 2019-20 from the source bar graph, average each year's total across the five companies, then take the difference." }),
  observation({ q: 67, sourceQuestionId: "630680108513", packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — least missing digit for divisibility by 6", representation: "MISSING_DIGIT_DIVISIBILITY_BY_6_LEAST_MCQ", notes: "The number already ends in an even digit. Its digit sum is 15+y, so divisibility by 3 requires y to be a multiple of 3; the least digit is 0." }),
  observation({ q: 68, sourceQuestionId: "630680915057", packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Linked ratios — combine A:B and B:C", representation: "CHAINED_THREE_TERM_RATIO_MCQ", notes: "A:B=6:8=3:4 and B:C=5:10=1:2. Matching B at 4 gives A:B:C=3:4:8." }),
  observation({ q: 69, sourceQuestionId: "630680523727", packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — aggregate three commodity groups across three months and compare by percentage", representation: "TABLE_MULTIROW_GROUP_TOTAL_PERCENTAGE_MCQ", notes: "Dry fruits+sugar+rice total 313 while tea+pulses+flour total 327. 313/327×100≈95.72%, which rounds to 96%; this also guards against relying on candidate-option ordering in response-sheet mirrors." }),
  observation({ q: 70, sourceQuestionId: "630680405107", packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — combined central angle from two percentage sectors", representation: "PIE_TWO_SECTOR_COMBINED_CENTRAL_ANGLE_MCQ", notes: "Apples and oranges are 20%+30%=50% of the circle, so their combined central angle is 180°." }),
  observation({ q: 71, sourceQuestionId: "630680285457", packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Linear equations — solve a three-variable simultaneous system", representation: "THREE_VARIABLE_LINEAR_SYSTEM_MCQ", notes: "Substitution verifies x=y=z=1 satisfies all three equations: 5x+4y−8z=1, 7x−9y+z=−1 and 2x+3y−4z=1." }),
  observation({ q: 72, sourceQuestionId: "630680428338", packageId: "TSD-002", topic: "Arithmetic — Time, Speed & Distance", subtopic: "TSD-CP-009 — Boats and streams from two journey-time equations", representation: "UPSTREAM_DOWNSTREAM_ROUND_TRIP_SYSTEM_STILL_WATER_MCQ", notes: "Let upstream and downstream speeds be u and d. The two journey equations determine still-water speed (u+d)/2=8 km/h, so in 12 hours the boat covers 96 km in still water." }),
  observation({ q: 73, sourceQuestionId: "630680809862", packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — partial principal repayment with deferred first-year interest", representation: "SIMPLE_INTEREST_PARTIAL_PRINCIPAL_REPAYMENT_TWO_YEAR_SETTLEMENT_MCQ", notes: "Track first-year simple interest on ₹6,23,305, reduce principal by ₹16,390 after year one, then add second-year interest on the remaining principal together with the unpaid first-year interest; the source settlement is ₹7,38,700." }),
  observation({ q: 74, sourceQuestionId: "630680397662", packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-003 — Perimeter of a circle after removing a quarter-sector", representation: "THREE_QUARTER_CIRCLE_REMAINING_PERIMETER_MCQ", notes: "Remaining perimeter is three-quarters of the circumference plus two radii: (3/4)×2π×21+42=99 cm using π=22/7." }),
  observation({ q: 75, sourceQuestionId: "630680421504", packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — recover cone height from radius and volume", representation: "CONE_VOLUME_GIVEN_RADIUS_FIND_HEIGHT_MCQ", notes: "Using V=(1/3)πr²h with V=46,200, r=70 and π=22/7 gives h=9 m." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_SOURCE_LIMITATIONS = Object.freeze({
  source: "Prepp response-sheet PDF with SSC Portal/Testbook corroboration — SSC CGL Tier-I 13 Sep 2024 Shift 1",
  sourceUrl: SOURCE_URL,
  corroborationUrl: SSC_PORTAL_SOURCE_URL,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-13",
  shift: "Shift 1",
  sourceSectionQuestionRange: "Quant-local Q1-Q25",
  normalizedQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2024_09_13_S1_FULL_QUANT_SECTION_WAVE13_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: true,
  productionPromotionAuthorized: false,
} as const);
