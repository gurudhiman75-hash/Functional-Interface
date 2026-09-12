import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY =
  "QUANT-V4-CGL-2024-09-09-S2-FULL-QUANT-SECTION-WAVE10-P2" as const;

const SOURCE_URL = "https://sscportal.in/sites/default/files/ssc-cgl-tier-1-paper-2024-sep-09-shift-2.pdf";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-09-S2";

function observation(input: { q: number; packageId: string; topic: string; subtopic: string; representation: string; notes: string; }): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2024-09-09-S2-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#quant-q${input.q}`,
    sourceLabel: `SSC Portal copy of SSC CGL Tier-I 2024 candidate paper — 9 Sep 2024 Shift 2, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-09",
    shift: "Shift 2",
    paperId: PAPER_ID,
    questionRef: `SSC-CGL-2024-09-09-S2-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 1, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratios — derive secant from tangent", representation: "TRIG_TAN_TO_SEC_STANDARD_IDENTITY_MCQ", notes: "Given tan t=1/3, use sec²t=1+tan²t to obtain sec t=√10/3." }),
  observation({ q: 2, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle congruency — SAS/RHS recognition", representation: "TRIANGLE_CONGRUENCY_CRITERION_MCQ", notes: "Two right triangles share QR and have PQ=SR; identify the valid congruence statement and criterion." }),
  observation({ q: 3, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — a³+b³+c³−3abc factorisation", representation: "CUBIC_IDENTITY_NUMERIC_SIMPLIFICATION_MCQ", notes: "Use a³+b³+c³−3abc=(a+b+c)(a²+b²+c²−ab−bc−ca), so the quotient collapses to a+b+c." }),
  observation({ q: 4, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — category expenditure from percentage", representation: "PIE_PERCENT_TO_ABSOLUTE_EXPENDITURE_MCQ", notes: "Read the Food share from the chart and apply it to monthly income ₹54,000." }),
  observation({ q: 5, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Sequential transactions — loss followed by gain", representation: "SUCCESSIVE_BUY_SELL_LOSS_GAIN_NET_AMOUNT_MCQ", notes: "₹42,000 is reduced by 20%, then the resulting amount gains 30%; compare the final amount with the original cost." }),
  observation({ q: 6, packageId: "ALG-001", topic: "Arithmetic / Algebra", subtopic: "Ages — two time-shift equations", representation: "AGES_TWO_TIME_RELATIONS_LINEAR_SYSTEM_MCQ", notes: "Translate seven-years-ago and four-years-hence age relations into two linear equations and solve the present-age sum." }),
  observation({ q: 7, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — compare two principal-rate-time cases", representation: "TWO_SIMPLE_INTEREST_CASES_DIFFERENCE_MCQ", notes: "Compute simple interest separately for ₹5,000 at 15% for 3 years and ₹8,000 at 12% for 4 years, then take the positive difference." }),
  observation({ q: 8, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circle tangents — centre/tangent angle relation", representation: "TWO_TANGENTS_CENTRE_ANGLE_BISECTOR_MCQ", notes: "Radii to tangency points are perpendicular to PA and PB; symmetry of the two tangent triangles gives ∠POA." }),
  observation({ q: 9, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Overlapping period averages", representation: "OVERLAPPING_AVERAGES_COMMON_DAY_MCQ", notes: "The first 16-day and last 16-day totals double-count January 16; subtract the 31-day total to recover that day's temperature." }),
  observation({ q: 10, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — direct percentage comparison", representation: "TABLE_CELL_PERCENT_OF_CELL_MCQ", notes: "Read November wages for Sunil and Rahul from the table and compute Sunil/Rahul×100." }),
  observation({ q: 11, packageId: "ALG-001", topic: "Arithmetic / Algebra", subtopic: "Ages — simultaneous linear relations and ratio", representation: "AGES_LINEAR_SYSTEM_THEN_TIME_SHIFT_RATIO_MCQ", notes: "Solve A=3B, C=B+5 and A+B+C=75, then form the requested past/future age ratio." }),
  observation({ q: 12, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric algebra — difference of cubes", representation: "TRIG_CUBIC_FACTOR_IDENTITY_MCQ", notes: "Factor sin³A−cos³A by sinA−cosA and use sin²A+cos²A=1, yielding 1+sinA cosA." }),
  observation({ q: 13, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Right isosceles triangle — area to hypotenuse", representation: "RIGHT_ISOSCELES_AREA_TO_HYPOTENUSE_MCQ", notes: "If each leg is a, a²/2=50 gives a=10 and hypotenuse 10√2." }),
  observation({ q: 14, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Cylinder — volume from radius and height", representation: "CYLINDER_VOLUME_DIRECT_MCQ", notes: "Use πr²h with r=8, h=14 and π=22/7 to obtain 2816 cm³." }),
  observation({ q: 15, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Income, expenditure and savings — changed bases", representation: "INCOME_EXPENDITURE_CHANGE_SAVINGS_PERCENT_INCREASE_MCQ", notes: "Original saving is 20% of ₹16,000; increase income by 20% and expenditure by 10%, then compare new and old savings." }),
  observation({ q: 16, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Marked price discount — loss percentage", representation: "MARKUP_DISCOUNT_TO_LOSS_PERCENT_MCQ", notes: "Set cost to 100, marked price to 126, apply 32% discount and compare selling price with cost." }),
  observation({ q: 17, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Circular track — same-direction relative speed", representation: "CIRCULAR_TRACK_RELATIVE_SPEED_MEETING_TIME_MCQ", notes: "Convert the speed difference 18 km/h to m/s and divide track length 1635 m by relative speed." }),
  observation({ q: 18, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle angles — one angle equals mean of other two", representation: "TRIANGLE_ANGLE_MEAN_CONDITION_MCQ", notes: "Combine the mean relation with angle sum 180° to identify the valid angle set." }),
  observation({ q: 19, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "Sector area from radius and arc length", representation: "SECTOR_AREA_FROM_RADIUS_ARC_LENGTH_MCQ", notes: "Use sector area = 1/2 × radius × arc length for r=15.75 cm and arc=11 cm." }),
  observation({ q: 20, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar graph — aggregate ratio across selected years", representation: "BAR_GRAPH_MULTI_YEAR_AGGREGATE_RATIO_MCQ", notes: "Sum the requested Institute B years and divide by the requested Institute A years, then simplify." }),
  observation({ q: 21, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — central angle from production share", representation: "PIE_SHARE_TO_CENTRAL_ANGLE_MCQ", notes: "Read type-D production share and convert percentage to degrees of a 360° circle." }),
  observation({ q: 22, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Inverse variation", representation: "INVERSE_VARIATION_CONSTANT_PRODUCT_MCQ", notes: "xy is constant; 2×6=3×y gives y=4." }),
  observation({ q: 23, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility and remainder by 9", representation: "DIGIT_SUM_REMAINDER_MOD9_MCQ", notes: "Use the digit-sum rule modulo 9 to get the remainder of 28735429 on division by 9." }),
  observation({ q: 24, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Decimal simplification — order of operations", representation: "DECIMAL_BODMAS_SIMPLIFICATION_MCQ", notes: "Apply division and multiplication before addition/subtraction in 21−4.9÷7+3.9×0.4+0.9." }),
  observation({ q: 25, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — staged opening and closing", representation: "MULTI_PIPE_STAGED_OPERATION_MCQ", notes: "Accumulate tank fractions over the stated intervals as N/S start, N closes, M opens, and S closes 15 minutes before completion." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS = Object.freeze({
  source: "SSC Portal mirror of candidate response paper; paper itself identifies SSC CGL Tier-I, 09/09/2024, 12:30 PM-1:30 PM",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-09",
  shift: "Shift 2",
  sectionQuestionRange: "Q1-Q25 within Quantitative Aptitude section",
  newObservationCount: QUANT_V4_CGL_2024_09_09_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  stabilityExpansionEvidence: true,
  officialSscHostedCopy: false,
  productionPromotionAuthorized: false,
} as const);
