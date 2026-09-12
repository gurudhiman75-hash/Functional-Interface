import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_AUTHORITY =
  "QUANT-V4-CGL-2022-12-01-S1-FULL-QUANT-SECTION-WAVE3-P2" as const;

const SOURCE_FILE_ID = "file_000000001f7c81fa88b2b54e92daf8aa";
const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-01-S1";

function observation(input: {
  q: number;
  page: 3 | 4;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2022-12-01-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `library://${SOURCE_FILE_ID}#page=${input.page}&question=${input.q}`,
    sourceLabel: `30 Yearwise SSC CGL Solved Paper (English) 2022 — SSC CGL Tier-I, held 01 Dec 2022 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2022-12-01",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `YEARWISE-SSC-CGL-2022-P${input.page}-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    q: 51, page: 3, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-005 — False weight combined with stated selling loss",
    representation: "FALSE_WEIGHT_WITH_STATED_LOSS_RATE_MCQ",
    notes: "A stated 12.5% loss gives CP:SP=8:7, while delivering 28 g for 36 g gives effective value ratio 7:9; combined CP:SP=8:9, so actual gain is 12.5%.",
  }),
  observation({
    q: 52, page: 3, packageId: "NUM-001", topic: "Arithmetic — Number System",
    subtopic: "NUM-CP-002 — HCF-LCM divisibility structure",
    representation: "HCF_GIVEN_IMPOSSIBLE_LCM_MCQ",
    notes: "If HCF is 12, the LCM must be a multiple of 12. Among 72, 60, 90 and 84, only 90 is not divisible by 12.",
  }),
  observation({
    q: 53, page: 3, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle tangents — externally touching circles and common tangent angle",
    representation: "EXTERNALLY_TOUCHING_CIRCLES_COMMON_TANGENT_ANGLE_MCQ",
    notes: "The tangent-contact triangle has a right angle at the circles' touching point. With angle PAB=40°, angle ABP=50°.",
  }),
  observation({
    q: 54, page: 3, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion",
    subtopic: "RAP-CP-004 — Mean proportional",
    representation: "MEAN_PROPORTIONAL_TWO_NUMBERS_MCQ",
    notes: "The mean proportional Q satisfies Q²=169×144, so Q=13×12=156.",
  }),
  observation({
    q: 55, page: 3, packageId: "PCT-002", topic: "Arithmetic — Percentage",
    subtopic: "Successive percentage change — product/area effect",
    representation: "RECTANGLE_DIMENSION_INCREASE_TO_AREA_PERCENT_MCQ",
    notes: "Area multiplier is 1.08×1.05=1.134, so the area increases by 13.4%.",
  }),
  observation({
    q: 56, page: 3, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — exact standard-angle expression simplification",
    representation: "STANDARD_ANGLE_TRIG_FRACTION_SIMPLIFICATION_MCQ",
    notes: "Substitute cos45°=1/√2, sec30°=2/√3 and cosec30°=2, then simplify exactly to the source option (3√2−√6)/8.",
  }),
  observation({
    q: 57, page: 3, packageId: "NUM-001", topic: "Arithmetic — Number System",
    subtopic: "NUM-CP-004 — Algebraic divisibility of powers",
    representation: "POWER_MINUS_ONE_DIVISOR_MCQ",
    notes: "49^15−1=7^30−1. Since the exponent 30 is even, x^30−1 is divisible by x+1 at x=7, so 8 is a divisor.",
  }),
  observation({
    q: 58, page: 3, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-007 — Race lead chaining",
    representation: "TWO_STAGE_RACE_LEAD_COMPOSITION_MCQ",
    notes: "When Anil runs 1500 m, Bakul runs 1350 m. Bakul's 75 m lead over Charles scales to 67.5 m over 1350 m, so Anil's total lead is 217.5 m.",
  }),
  observation({
    q: 59, page: 3, packageId: "INT-001", topic: "Arithmetic — Interest",
    subtopic: "Simple interest — rate from principal, time and amount",
    representation: "SI_RATE_FROM_AMOUNT_PRINCIPAL_TIME_MCQ",
    notes: "Interest is ₹1,225 on ₹2,500 for 8 years, so r=1225×100/(2500×8)=6.125% p.a.",
  }),
  observation({
    q: 60, page: 3, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — single-column average",
    representation: "TABLE_COLUMN_AVERAGE_MCQ",
    notes: "Printer Z produced 210, 160 and 218 pages; average=(210+160+218)/3=196.",
  }),
  observation({
    q: 61, page: 3, packageId: "AVG-001", topic: "Arithmetic — Average",
    subtopic: "AVG-CP-003 — Excluding extreme observations and reconstructing values",
    representation: "EXCLUDE_HIGHEST_LOWEST_AVERAGE_WITH_DIFFERENCE_MCQ",
    notes: "Total of all 27 innings is 1269 and the remaining 25 total 1050, so high+low=219. With high−low=157, highest score is 188.",
  }),
  observation({
    q: 62, page: 3, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-004 — Worker leaves after joint work",
    representation: "TWO_WORKERS_ONE_LEAVES_AFTER_INITIAL_DAYS_MCQ",
    notes: "P+Q complete 1/3 in two days. P alone completes the remaining 2/3 in 10 days, so total time is 12 days.",
  }),
  observation({
    q: 63, page: 3, packageId: "DI-005", topic: "Data Interpretation",
    subtopic: "Pie chart — selected sectors versus whole",
    representation: "PIE_SELECTED_SECTORS_PERCENT_LESS_THAN_TOTAL_MCQ",
    notes: "B+C+F+H account for 27+18+7+14=66% of all trucks, which is 34% less than the 100% total.",
  }),
  observation({
    q: 64, page: 3, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-002 — Quadratic-to-reciprocal power identity",
    representation: "QUADRATIC_TO_RECIPROCAL_CUBIC_EXPRESSION_MCQ",
    notes: "x²−5x+1=0 gives x+1/x=5. Reciprocal-cube transformation gives x³+1/x³=110; the displayed normalized expression evaluates to 23.",
  }),
  observation({
    q: 65, page: 3, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — right-triangle sine and cosine reconstruction",
    representation: "RIGHT_TRIANGLE_SIN_PLUS_COS_MCQ",
    notes: "For the 8-15-17 right triangle at angle α, sinα=8/17 and cosα=15/17, so their sum is 23/17.",
  }),
  observation({
    q: 66, page: 3, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-004 — Sum-of-cubes identity parameter recovery",
    representation: "SUM_OF_CUBES_RATIO_PARAMETER_MCQ",
    notes: "17³+7³=(17+7)(17²−17×7+7²)=24(338−119). Matching the denominator form identifies k=17×7=119.",
  }),
  observation({
    q: 67, page: 3, packageId: "MEN-001", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-003 — Circle circumference and radius recovery",
    representation: "TWO_CIRCUMFERENCES_TO_RADIUS_DIFFERENCE_MCQ",
    notes: "2π(r2−r1)=352−198=154. Using π=22/7 gives r2−r1=24.5 cm.",
  }),
  observation({
    q: 68, page: 4, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle chord theorem — central angle and equal radii",
    representation: "CHORD_FROM_RADIUS_AND_60_DEGREE_CENTRAL_ANGLE_MCQ",
    notes: "OA=OB=10 and central angle AOB=60°, so triangle AOB is equilateral and chord AB=10 cm.",
  }),
  observation({
    q: 69, page: 4, packageId: "MEN-002", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-012 — Recasting and volume conservation",
    representation: "CUBOID_RECAST_TO_EQUAL_SPHERES_COUNT_MCQ",
    notes: "Equating the 88×63×42 cuboid volume to N spheres of radius 4.2 cm with π=22/7 gives N=750.",
  }),
  observation({
    q: 70, page: 4, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — direct category ratio",
    representation: "TABLE_DIRECT_CATEGORY_RATIO_MCQ",
    notes: "Factories P and R manufacture 100 and 150 spoons respectively, so P:R=2:3.",
  }),
  observation({
    q: 71, page: 4, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "Triangle side-angle relation — cosine rule",
    representation: "TWO_SIDES_INCLUDED_ANGLE_TO_THIRD_SIDE_MCQ",
    notes: "BC²=12²+10²−2×12×10×cos60°=124, hence BC=√124≈11.13 cm.",
  }),
  observation({
    q: 72, page: 4, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — Pythagorean reciprocal identity simplification",
    representation: "TAN_COT_SEC_COSEC_SQUARE_IDENTITY_MCQ",
    notes: "The expression tan²θ+cot²θ−sec²θ·cosec²θ is identically −2; the source verifies it at θ=45°.",
  }),
  observation({
    q: 73, page: 4, packageId: "DI-003", topic: "Data Interpretation",
    subtopic: "Grouped bar chart — two-period aggregate ratio",
    representation: "GROUPED_BAR_TWO_PERIOD_AGGREGATE_RATIO_MCQ",
    notes: "Branch 1 totals 80+105=185 and branch 4 totals 85+95=180, so the ratio is 185:180=37:36.",
  }),
  observation({
    q: 74, page: 4, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-004 — Difference-of-cubes identity parameter recovery",
    representation: "DIFFERENCE_OF_CUBES_RATIO_PARAMETER_MCQ",
    notes: "17³−7³=(17−7)(17²+17×7+7²)=10(338+119). With the outer factor 4 and quotient 40, p=17×7=119.",
  }),
  observation({
    q: 75, page: 4, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-002 — Successive discounts and discount-amount comparison",
    representation: "SINGLE_DISCOUNT_VS_SUCCESSIVE_DISCOUNTS_AMOUNT_DIFFERENCE_MCQ",
    notes: "Successive 25% and 5% discounts equal 28.75%; compared with 30%, the gap is 1.25% of ₹3,840=₹48.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: `${SOURCE_FILE_ID} — 30 Yearwise SSC CGL Solved Paper (English) 2022.pdf`,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2022-12-01",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2022_S1_FULL_QUANT_SECTION_WAVE3_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  exactPaperDuplicatesReused: 0,
  frequencyCalibrationAllowed: false,
} as const);
