import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY =
  "QUANT-V4-CGL-2023-07-27-S1-FULL-QUANT-SECTION-WAVE4-P2" as const;

const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-27-S1";
const SOURCE_BASE = "https://cracku.in/ssc-cgl-tier-1-27th-july-2023-shift-1-question-paper-solved";

function observation(input: {
  q: number;
  page: 6 | 7 | 8;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-27-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_BASE}?page=${input.page}#question=${input.q}`,
    sourceLabel: `Cracku SSC CGL Tier-I 2023 solved paper — 27 Jul 2023 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-27",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-27-S1-P${input.page}-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    q: 51, page: 6, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "Algebra — difference and sum of cubes from symmetric constraints",
    representation: "CUBES_DIFFERENCE_AND_NUMBER_DIFFERENCE_TO_CUBE_SUM_MCQ",
    notes: "For natural numbers differing by 8, a³−b³=6272 gives a=20 and b=12; a³+b³=9728.",
  }),
  observation({
    q: 52, page: 6, packageId: "PCT-002", topic: "Arithmetic — Percentage",
    subtopic: "Percentage — expenditure invariance after price increase",
    representation: "PRICE_INCREASE_TO_CONSUMPTION_DECREASE_MCQ",
    notes: "With expenditure fixed after an 81% price rise, consumption falls by 81/181×100≈44.75%.",
  }),
  observation({
    q: 53, page: 6, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "Algebra — cubic identity after scaled-variable substitution",
    representation: "LINEAR_SUM_PRODUCT_TO_SUM_OF_CUBES_MCQ",
    notes: "Let a=2x and b=3y. Then a+b=16 and ab=54, so a³+b³=16³−3×54×16=1504.",
  }),
  observation({
    q: 54, page: 6, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle theorem — intersecting chords / power of a point",
    representation: "INTERSECTING_CHORDS_MISSING_SEGMENT_MCQ",
    notes: "AP=18−6=12 and AP×PB=CP×PD, so 12×6=4×PD and PD=18 cm.",
  }),
  observation({
    q: 55, page: 6, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "Algebra — sum of cubes from sum and product",
    representation: "SUM_PRODUCT_TO_SUM_OF_CUBES_MCQ",
    notes: "x³+y³=(x+y)³−3xy(x+y)=25³−3×20×25=14125.",
  }),
  observation({
    q: 56, page: 6, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-006 — Circular and closed-track motion",
    representation: "SAME_DIRECTION_CIRCULAR_CATCH_UP_MCQ",
    notes: "Relative speed is 18 km/h=5 m/s; one 1125 m relative lap takes 225 seconds.",
  }),
  observation({
    q: 57, page: 6, packageId: "NUM-001", topic: "Arithmetic — Number System",
    subtopic: "Number System — least multiple above a digit-length threshold",
    representation: "SMALLEST_FIVE_DIGIT_EXACT_MULTIPLE_MCQ",
    notes: "The first multiple of 526 at or above 10000 is 526×20=10520.",
  }),
  observation({
    q: 58, page: 6, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-001 — Same-distance speed and time reconstruction",
    representation: "SAME_DISTANCE_SPEED_TIME_DIFFERENCE_MCQ",
    notes: "For common distance d, d/4−d/6=1/2, giving d=6 km.",
  }),
  observation({
    q: 59, page: 6, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — complementary angles and ratio recovery",
    representation: "COMPLEMENTARY_ANGLE_SINE_TO_TANGENT_MCQ",
    notes: "B=90°−A, so tan B=cot A. With sin A=3/5 and cos A=4/5, tan B=4/3.",
  }),
  observation({
    q: 60, page: 6, packageId: "DI-004", topic: "Data Interpretation",
    subtopic: "Line graph — cross-year multiplicative comparison",
    representation: "LINE_GRAPH_YEAR_RATIO_MCQ",
    notes: "The source asks for the approximate ratio of imports in 1974 to imports in 1971 from the displayed line graph.",
  }),
  observation({
    q: 61, page: 7, packageId: "DI-003", topic: "Data Interpretation",
    subtopic: "Grouped/bar chart — combined category total comparison",
    representation: "BAR_CHART_COMBINED_GROUP_MAXIMUM_MCQ",
    notes: "The source chart compares boys plus girls across Classes VII-X and asks for the class with the maximum combined total.",
  }),
  observation({
    q: 62, page: 7, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "Time and Work — combined rates with wage/share allocation",
    representation: "WORK_RATE_CONTRIBUTION_TO_PAYMENT_SHARE_MCQ",
    notes: "Ashok and Anil together complete 5/6 of the work in four days, leaving Amar's contribution at 1/6; his share of ₹4500 is ₹750.",
  }),
  observation({
    q: 63, page: 7, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "Geometry — proportional triangle/segment relation",
    representation: "FIGURE_BASED_PROPORTIONAL_SEGMENT_RECOVERY_MCQ",
    notes: "The source supplies AB=AD=9, AC=AE=13 and BC=15 in a figure and asks for ED; ownership is theorem/proportional geometry rather than mensuration.",
  }),
  observation({
    q: 64, page: 7, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — complementary-angle relation in radians",
    representation: "COMPLEMENTARY_RADIAN_ANGLE_RECOVERY_MCQ",
    notes: "The rendered secondary source states θ1+θ2=π/2 but the θ1 value is formatting-limited/ambiguous. The observation preserves only the source family and does not infer a repaired value.",
  }),
  observation({
    q: 65, page: 7, packageId: "INT-001", topic: "Arithmetic — Interest",
    subtopic: "Simple interest — direct fractional-rate and fractional-year calculation",
    representation: "SIMPLE_INTEREST_FRACTIONAL_RATE_DURATION_MCQ",
    notes: "SI on ₹27,000 at 14 2/3% p.a. for eight months is ₹2,640.",
  }),
  observation({
    q: 66, page: 7, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation",
    subtopic: "Exact decimal arithmetic with division and signed terms",
    representation: "DECIMAL_SIGNED_ARITHMETIC_MCQ",
    notes: "80.40÷20−(−4.02)+2.06 = 4.02+4.02+2.06 = 10.1.",
  }),
  observation({
    q: 67, page: 7, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — cotangent substitution into sine-cosine expression",
    representation: "COTANGENT_TO_LINEAR_TRIG_RATIO_MCQ",
    notes: "3cot A=7/3 gives cot A=7/9; dividing the expression by sin A reduces it to (7/3+2)/(7/3−2)=13.",
  }),
  observation({
    q: 68, page: 7, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "Time and Work — heterogeneous worker-rate composition",
    representation: "MAN_WOMAN_BOY_RATE_COMPOSITION_MCQ",
    notes: "One man and one woman contribute 1/3+1/5=8/15 per day. Finishing in 1/5 day requires rate 5, so 67 boys at 1/15 each are needed.",
  }),
  observation({
    q: 69, page: 7, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "Marked price — successive discounts and reverse labelled price",
    representation: "SUCCESSIVE_DISCOUNTS_TO_MARKED_PRICE_MCQ",
    notes: "₹792 is 75%×88%=66% of labelled price; labelled price is ₹1200.",
  }),
  observation({
    q: 70, page: 7, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion",
    subtopic: "Foundational ratio/fraction comparison",
    representation: "COMPARE_FRACTION_RATIOS_MCQ",
    notes: "Among 5/6, 7/9, 11/12 and 13/18, the smallest value is 13/18.",
  }),
  observation({
    q: 71, page: 8, packageId: "MEN-002", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-009 — Hemisphere curved surface area and coating cost",
    representation: "HEMISPHERE_INSIDE_OUTSIDE_PAINTING_COST_MCQ",
    notes: "Negligible thickness makes inside plus outside curved area 4πr²=616 cm² for r=7; at ₹40 per 20 cm², cost is ₹1232.",
  }),
  observation({
    q: 72, page: 8, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-002 — Direct combined work rates",
    representation: "THREE_WORKER_COMBINED_TIME_MCQ",
    notes: "Combined rate is 1/6+1/9+1/11=73/198, so time is 198/73 = 2 52/73 days.",
  }),
  observation({
    q: 73, page: 8, packageId: "MAL-001", topic: "Arithmetic — Mixture & Alligation",
    subtopic: "MAL-CP-001 — Recover unknown source price from mixture ratio and mean price",
    representation: "TWO_COMPONENT_WEIGHTED_PRICE_UNKNOWN_SOURCE_MCQ",
    notes: "For C1:C2=2:3, (2×500+3×x)/5=650 gives x=₹750 per unit. This is the first normalized SSC CGL Tier-I MAL-001 profile observation.",
  }),
  observation({
    q: 74, page: 8, packageId: "MEN-001", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-003 — Circle sector area from arc length",
    representation: "SECTOR_AREA_FROM_ARC_LENGTH_AND_RADIUS_MCQ",
    notes: "Sector area = 1/2×radius×arc length = 1/2×r×5r = 2.5r².",
  }),
  observation({
    q: 75, page: 8, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "Profit/loss — recover cost price from linked gain-loss amounts",
    representation: "LINKED_GAIN_LOSS_TO_TARGET_PROFIT_SELLING_PRICE_MCQ",
    notes: "1498−CP = 1.25(CP−1300) gives CP=₹1388; a 25% gain requires selling price ₹1735.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS = Object.freeze({
  source: `${SOURCE_BASE} — secondary solved-paper collection`,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-27",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS.length,
  exactPaperDuplicatesReused: 0,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  sourceRenderingLimitations: Object.freeze(["Q64 displayed θ1 value is formatting-limited in the secondary source; no repaired value is inferred."] as const),
  frequencyCalibrationAllowed: false,
} as const);
