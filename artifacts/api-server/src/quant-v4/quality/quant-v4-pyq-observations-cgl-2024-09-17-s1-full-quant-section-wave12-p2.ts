import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_AUTHORITY =
  "QUANT-V4-CGL-2024-09-17-S1-FULL-QUANT-SECTION-WAVE12-P2" as const;

const SOURCE_URL = "https://www.unlockias.in/ssc-cgl-question-paper/ssc-cgl-2024-tier-1-17-september-shift-1";
const COMPANION_SOURCE_URL = "https://www.scribd.com/document/833468946/Ssc-Cgl-2024-17-September-2024-Shift-1";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-17-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2024-09-17-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#quant-question-${input.q}`,
    sourceLabel: `SSC CGL Tier-I 2024 — 17 Sep 2024 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-17",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `SSC-CGL-2024-09-17-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 1, packageId: "TRG-001", topic: "Advanced Mathematics — Trigonometry", subtopic: "Complementary-angle transformation with cosecant and cosine", representation: "TRIG_COMPLEMENTARY_COSEC_COS_MCQ", notes: "Use cos66°=sin24° and cos24°=m/n to rewrite the expression in terms of m,n." }),
  observation({ q: 2, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — percentage share to absolute production", representation: "PIE_PERCENT_TO_ABSOLUTE_VALUE_MCQ", notes: "Rice is 25% of total annual production 8600 tonnes, so read the pie share and convert it to an absolute value." }),
  observation({ q: 3, packageId: "RAP-002", topic: "Arithmetic — Ratio & Proportion", subtopic: "Linked ratios — combine A:B and B:C", representation: "LINKED_RATIO_COMMON_TERM_MCQ", notes: "Equalize the common B term in 6:8 and 7:10 to form A:B:C." }),
  observation({ q: 4, packageId: "PNL-001", topic: "Arithmetic — Profit, Loss & Discount", subtopic: "Markup followed by discount — net loss percentage", representation: "MARKUP_DISCOUNT_NET_PL_MCQ", notes: "Marked price is 120% of cost; after 30% discount selling price is 84% of cost, giving a 16% loss." }),
  observation({ q: 5, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Average of squares of first n natural numbers", representation: "AVERAGE_FIRST_N_SQUARES_MCQ", notes: "Use n(n+1)(2n+1)/6, then divide the sum of squares by n for n=47." }),
  observation({ q: 6, packageId: "ALG-001", topic: "Advanced Mathematics — Algebra", subtopic: "Reciprocal identities — cubic difference from square sum", representation: "RECIPROCAL_CUBE_DIFFERENCE_FROM_SQUARE_SUM_MCQ", notes: "From x²+x⁻²=83 obtain (x−1/x)²=81 and x−1/x=9 because x>1; then use the cubic identity." }),
  observation({ q: 7, packageId: "MEN-002", topic: "Advanced Mathematics — Mensuration", subtopic: "Cylinder — capacity from circumference and height", representation: "CYLINDER_CIRCUMFERENCE_HEIGHT_VOLUME_MCQ", notes: "Circumference 44 cm gives radius 7 cm; cylinder volume is πr²h and convert cubic centimetres to litres." }),
  observation({ q: 8, packageId: "GEO-001", topic: "Advanced Mathematics — Geometry", subtopic: "Triangle area comparison — isosceles Heron area versus right triangle", representation: "TRIANGLE_AREA_COMPARISON_HERON_RIGHT_MCQ", notes: "Find the area of the 10-20-20 triangle with Heron's formula and subtract the right-triangle area using hypotenuse 13 and leg 12." }),
  observation({ q: 9, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest equivalence — solve unknown rate", representation: "EQUAL_SIMPLE_INTEREST_UNKNOWN_RATE_MCQ", notes: "Set 7200×16×3 equal to 9600×x×4 after cancelling the common 100 factor." }),
  observation({ q: 10, packageId: "PNL-001", topic: "Arithmetic — Profit & Loss", subtopic: "Table-based commercial arithmetic — total profit across items", representation: "MULTI_ITEM_TABLE_TOTAL_PROFIT_MCQ", notes: "Compute profit for each item from its cost price and stated profit rate, then add the item-wise profits." }),
  observation({ q: 11, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Collection ratio — adding one category changes ratio", representation: "RATIO_AFTER_ADDITION_TOTAL_COUNT_MCQ", notes: "Initial gold:non-gold is 1:4; after adding 20 gold coins it becomes 2:3. Solve the original scale factor and then total coins." }),
  observation({ q: 12, packageId: "MEN-001", topic: "Advanced Mathematics — Mensuration", subtopic: "Sector — central angle from area and radius", representation: "SECTOR_AREA_RADIUS_TO_ANGLE_MCQ", notes: "Use sector area=(θ/360)πr² with area 16π and radius 8." }),
  observation({ q: 13, packageId: "SAP", topic: "Arithmetic — Simplification", subtopic: "Direct numerical simplification under standard operation precedence", representation: "DIRECT_SIMPLIFICATION_MCQ", notes: "The source presents a direct simplification item; retain it under the simplification package rather than forcing it into an unrelated arithmetic family." }),
  observation({ q: 14, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Two travellers — faster traveller turns back and meets slower traveller", representation: "OUT_AND_BACK_MEETING_POINT_MCQ", notes: "Both start from P toward Q over 72 km at 8 and 10 km/h; after reaching Q the faster traveller reverses. Use equal elapsed time to locate meeting point R." }),
  observation({ q: 15, packageId: "ALG-002", topic: "Advanced Mathematics — Algebra", subtopic: "Pair of linear equations — condition for no solution", representation: "LINEAR_EQUATIONS_NO_SOLUTION_PARAMETER_MCQ", notes: "For no solution, coefficient ratios of x and y must match while the constant ratio differs; solve for k." }),
  observation({ q: 16, packageId: "GEO-002", topic: "Advanced Mathematics — Geometry", subtopic: "Circle tangents — angle between tangents and central angle", representation: "TWO_TANGENTS_EXTERNAL_ANGLE_TO_CENTRAL_ANGLE_MCQ", notes: "For tangents AP and AQ, ∠PAQ + ∠POQ = 180°, so the 40° external angle determines the central angle." }),
  observation({ q: 17, packageId: "TMW-001", topic: "Arithmetic — Time & Work", subtopic: "Pipes and cisterns — fill rates with an outlet", representation: "TWO_INLETS_ONE_OUTLET_TIMED_OPERATION_MCQ", notes: "Combine rates 1/15 and 1/25 with outlet rate −1/40 and use the stated operating condition to determine the required time." }),
  observation({ q: 18, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — average manufactured quantity for a selected year", representation: "TABLE_SELECTED_YEAR_AVERAGE_MCQ", notes: "Read X,Y,Z production for 2022 from the table and average the three values." }),
  observation({ q: 19, packageId: "PNL-001", topic: "Arithmetic — Profit & Loss", subtopic: "Damaged stock — revised selling price for target profit", representation: "SPOILAGE_REMAINING_STOCK_TARGET_PROFIT_MCQ", notes: "Recover original cost per kg from the 12% profit selling price, account for one-fifth spoilage, and spread the target 5% total profit over the remaining stock." }),
  observation({ q: 20, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility by 6 — missing digit", representation: "MISSING_DIGIT_DIVISIBILITY_BY_6_MCQ", notes: "The number already ends in an even digit; choose the least k making the digit sum divisible by 3." }),
  observation({ q: 21, packageId: "TRG-001", topic: "Advanced Mathematics — Trigonometry", subtopic: "Given secant — derive cosecant and cotangent", representation: "SEC_TO_COSEC_COT_EXPRESSION_MCQ", notes: "With secθ=29/20 in the first quadrant, use the 20-21-29 triangle and evaluate 3cosecθ+3cotθ." }),
  observation({ q: 22, packageId: "TRG-001", topic: "Advanced Mathematics — Trigonometry", subtopic: "Given tangent — evaluate sin-cos product", representation: "TAN_TO_SIN_COS_PRODUCT_MCQ", notes: "tanA=1 in an acute right triangle implies A=45°; evaluate 4sinAcosA." }),
  observation({ q: 23, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Multi-series graph — compare aggregate company production", representation: "MULTI_SERIES_GRAPH_AGGREGATE_PERCENT_MCQ", notes: "Sum P,Q,R for company C and compare that total as a percentage of company A's combined production." }),
  observation({ q: 24, packageId: "MEN-001", topic: "Advanced Mathematics — Mensuration", subtopic: "Circle arc length — angle when arc is half circumference", representation: "ARC_FRACTION_OF_CIRCUMFERENCE_TO_ANGLE_MCQ", notes: "Arc length is proportional to central angle; half the circumference corresponds to 180°." }),
  observation({ q: 25, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Successive workforce and wage changes — payroll percentage change", representation: "SUCCESSIVE_COUNT_RATE_TOTAL_CHANGE_MCQ", notes: "Total payroll multiplier is 1.20×0.82=0.984, so the overall wage bill decreases by 1.6%." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_SOURCE_LIMITATIONS = Object.freeze({
  source: "UnlockIAS candidate-response-sheet reconstruction, cross-checked against a full-paper transcription",
  sourceUrl: SOURCE_URL,
  companionSourceUrl: COMPANION_SOURCE_URL,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-17",
  shift: "Shift 1",
  sectionQuestionRange: "Q1-Q25",
  newObservationCount: QUANT_V4_CGL_2024_09_17_S1_FULL_QUANT_SECTION_WAVE12_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  stabilityExpansionEvidence: true,
  candidateResponseSheetDerived: true,
  officialSscHostedCopy: false,
  productionPromotionAuthorized: false,
} as const);
