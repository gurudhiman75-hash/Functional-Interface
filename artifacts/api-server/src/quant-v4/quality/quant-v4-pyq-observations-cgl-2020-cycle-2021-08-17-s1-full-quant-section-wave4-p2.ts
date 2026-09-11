import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY =
  "QUANT-V4-CGL-2020-CYCLE-2021-08-17-S1-FULL-QUANT-SECTION-WAVE4-P2" as const;

const PAPER_ID = "SSC-CGL-2020-TIER-I-2021-08-17-S1";
const PAPER_URL = "https://cracku.in/ssc-cgl-17th-august-2021-shift-1-question-paper-solved?page=6";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2020-CYCLE-2021-08-17-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${PAPER_URL}#question-${input.q}`,
    sourceLabel: `Cracku solved SSC CGL Tier-I 2020-cycle paper — held 17 Aug 2021 Shift 1, Quantitative Aptitude Q${input.q}; held-date/shift identity independently corroborated by SSC Portal`,
    heldDate: "2021-08-17",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2020-CYCLE-2021-08-17-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    q: 51, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "Triangle similarity — area ratio from parallel corresponding sides",
    representation: "SIMILAR_TRIANGLES_AREA_FROM_SIDE_RATIO_MCQ",
    notes: "DE∥BC gives similar triangles ADE and ABC. Area ratio is (DE/BC)^2=(5/8)^2, so area ABC=45×64/25=115.2 cm².",
  }),
  observation({
    q: 52, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle tangents — equal tangents from external vertices around a triangle",
    representation: "TRIANGLE_EXTENDED_SIDES_COMMON_CIRCLE_TANGENT_LENGTH_MCQ",
    notes: "Tangent-length equalities from external points combine with the 5-6-7 triangle side lengths to give AQ=9 cm.",
  }),
  observation({
    q: 53, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-003 — Men/women efficiency system and equivalent workforce",
    representation: "TWO_WORKFORCE_COMPOSITIONS_TO_SINGLE_GENDER_TIME_MCQ",
    notes: "Two mixed workforce/time equations determine the relative daily work of one man and one woman; seven men alone require 22 days.",
  }),
  observation({
    q: 54, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "Triangle similarity — nested parallel-line proportionality",
    representation: "NESTED_PARALLELS_TRIANGLE_SIDE_RECOVERY_MCQ",
    notes: "DF∥AC and DE∥AF create two linked similarity ratios. With BE=4 and EF=6, the resulting side reconstruction gives BC=25 cm.",
  }),
  observation({
    q: 55, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation",
    subtopic: "BODMAS with of, nested brackets and fractional arithmetic",
    representation: "NESTED_BODMAS_OF_FRACTIONS_MCQ",
    notes: "Direct simplification task with 'of' precedence, nested brackets, division and fractions.",
  }),
  observation({
    q: 56, packageId: "PCT-002", topic: "Arithmetic — Percentage",
    subtopic: "Percentage composition — two-school pass/fail reverse reconstruction",
    representation: "TWO_GROUP_FAILURE_PERCENT_REVERSE_MCQ",
    notes: "School X has 20% failure; Y has 130% more candidates than X; overall pass rate is 90%. Solve the weighted failure balance for Y's failure percentage.",
  }),
  observation({
    q: 57, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Frequency table — count observations within an income interval",
    representation: "FREQUENCY_TABLE_RANGE_COUNT_MCQ",
    notes: "Read the daily-income frequency table and aggregate persons earning at least ₹200 but below ₹300.",
  }),
  observation({
    q: 58, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion",
    subtopic: "RAP-CP-002 — Combine pairwise ratios and distribute a total",
    representation: "PAIRWISE_SHARE_RATIOS_TOTAL_DISTRIBUTION_MCQ",
    notes: "A:B=9:8 and A:C=4:5 combine to A:B:C=36:32:45; distributing ₹31,866 gives B's share ₹9,024.",
  }),
  observation({
    q: 59, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — standard-angle squared-function evaluation",
    representation: "STANDARD_ANGLE_TRIG_SQUARED_EXPRESSION_MCQ",
    notes: "Substitute cot30°, cos30°, cosec60° and tan60° into the exact expression and simplify.",
  }),
  observation({
    q: 60, packageId: "INT-001", topic: "Arithmetic — Interest",
    subtopic: "Simple-interest amount to principal, then half-yearly compound amount",
    representation: "SI_PRINCIPAL_RECOVERY_TO_HALF_YEARLY_CI_MCQ",
    notes: "₹13,650 after two years at 15% simple interest gives principal ₹10,500; compound half-yearly for one year at 7.5% per half-year gives about ₹12,134.",
  }),
  observation({
    q: 61, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle tangent-chord theorem — angle reconstruction",
    representation: "TWO_TANGENT_CHORD_ANGLES_TO_INSCRIBED_ANGLE_MCQ",
    notes: "Use the tangent-chord theorem at A and B to reconstruct the relevant inscribed angle AQB.",
  }),
  observation({
    q: 62, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-001 — Loss stated as percentage of selling price, then target gain on cost",
    representation: "LOSS_ON_SP_TO_TARGET_GAIN_ON_CP_MCQ",
    notes: "At SP ₹640, loss is 15% of SP, so CP=₹736. A 15% gain on CP requires SP ₹846.40.",
  }),
  observation({
    q: 63, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — multi-institute multi-year aggregate ratio",
    representation: "TABLE_MULTI_CATEGORY_CROSS_YEAR_RATIO_MCQ",
    notes: "Aggregate vocational-course enrolment for A+C+E in 2015 and compare it with B+D in 2017.",
  }),
  observation({
    q: 64, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-002 — Marked price discount to absolute profit",
    representation: "MARKED_PRICE_DISCOUNT_TO_PROFIT_AMOUNT_MCQ",
    notes: "20% discount on ₹1,500 gives SP ₹1,200; against CP ₹991, profit is ₹209.",
  }),
  observation({
    q: 65, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — reciprocal identities and algebraic simplification",
    representation: "SEC_COSEC_RADICAL_TRIG_IDENTITY_SIMPLIFICATION_MCQ",
    notes: "Simplify the radical reciprocal-identity factor together with the rational sine/cosine factor for an acute angle.",
  }),
  observation({
    q: 66, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-002 — Symmetric sums and cubic identity reconstruction",
    representation: "SUM_SQUARES_SUM_CUBES_TO_XYZ_CUBE_ROOT_MCQ",
    notes: "Use x+y+z, x²+y²+z² and x³+y³+z³ with symmetric identities to recover xyz and then ∛xyz.",
  }),
  observation({
    q: 67, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-001 — Same-distance travel-time comparison under speed change",
    representation: "SAME_DISTANCE_TIME_GAPS_AFTER_SPEED_DOUBLING_MCQ",
    notes: "For 160 km, A takes 8 hours more than B; doubling A's speed leaves a 3-hour gap. Solve the two time equations for B's speed.",
  }),
  observation({
    q: 68, packageId: "MEN-002", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-008 — Cylinder dimensions from curved/base areas to volume",
    representation: "CYLINDER_CSA_BASE_AREA_TO_VOLUME_MCQ",
    notes: "Base area πr²=346.5 gives r, and curved area 2πrh=462 gives h; then compute πr²h.",
  }),
  observation({
    q: 69, packageId: "NUM-001", topic: "Arithmetic — Number System",
    subtopic: "NUM-CP-003 — Missing digits under divisibility by 72",
    representation: "TWO_MISSING_DIGITS_DIVISIBILITY_BY_72_MCQ",
    notes: "Divisibility by 72 combines divisibility by 8 and 9 for 94x29y6, with x≠y; evaluate 2x+3y after recovering the digits.",
  }),
  observation({
    q: 70, packageId: "AVG-001", topic: "Arithmetic — Average",
    subtopic: "AVG-CP-002 — Consecutive even-number average and subset recomposition",
    representation: "CONSECUTIVE_EVEN_AVERAGE_TO_MIXED_SUBSET_AVERAGE_MCQ",
    notes: "Eight consecutive even numbers have mean 17; recover the last three and combine them with 36 and 53 for the requested average.",
  }),
  observation({
    q: 71, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — cross-discipline aggregate percentage comparison",
    representation: "TABLE_CROSS_CATEGORY_PERCENT_MORE_MCQ",
    notes: "Compare Computer Science totals for institutes A+B with Arts totals for B+C and express the excess as a percentage of the Arts base.",
  }),
  observation({
    q: 72, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-001 — Complete-square non-negative identity to recover variables",
    representation: "SUM_OF_SQUARES_ZERO_STATE_TO_CUBIC_SUM_MCQ",
    notes: "Rearrangement gives (a−1)²+c²+4(b+2)²=0, hence a=1, b=−2, c=0 and a³+b³+c³=−7.",
  }),
  observation({
    q: 73, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — cross-year aggregate percent-more comparison",
    representation: "TABLE_AGGREGATE_PERCENT_MORE_APPROX_MCQ",
    notes: "Compare B+C+E enrolment in 2015 with A+D+F in 2016 and choose the closest percentage excess.",
  }),
  observation({
    q: 74, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — recover acute angle sums/differences from exact ratios",
    representation: "ANGLE_SUM_DIFFERENCE_FROM_COS_COT_MCQ",
    notes: "cos(A−B)=√3/2 gives A−B=30° and cot(A+B)=1/√3 gives A+B=60°; solve A,B and evaluate 2A−3B.",
  }),
  observation({
    q: 75, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-004 — Sum-of-cubes factorisation with radicals and coefficient comparison",
    representation: "RADICAL_SUM_OF_CUBES_FACTOR_COEFFICIENT_COMPARISON_MCQ",
    notes: "Recognize (3√2x)^3+(2√3y)^3, divide by the sum factor, then compare A=18, B=12, C=−6√6 and evaluate A²−(B²+C²)=−36.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS = Object.freeze({
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  sourcePaperPage: PAPER_URL,
  identityCorroboration: "https://sscportal.in/cgl/tier-1/papers/2020-mathematics-17-aug-2021-shift-1",
  paperId: PAPER_ID,
  examCycle: "SSC CGL 2020",
  heldDate: "2021-08-17",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2020_CYCLE_2021_08_17_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  exactPaperDuplicatesReused: 0,
  frequencyCalibrationAllowed: false,
} as const);
