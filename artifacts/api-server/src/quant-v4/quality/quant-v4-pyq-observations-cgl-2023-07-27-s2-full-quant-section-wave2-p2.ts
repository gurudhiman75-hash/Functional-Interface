import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_AUTHORITY =
  "QUANT-V4-CGL-2023-07-27-S2-FULL-QUANT-SECTION-WAVE2-P2" as const;

const SOURCE_FILE_ID = "file_000000003d58820880870d8465ef40c5";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-27-S2";

function observation(input: {
  q: number;
  page: 2 | 3;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-27-S2-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `library://${SOURCE_FILE_ID}#page=${input.page}&question=${input.q}`,
    sourceLabel: `30 Yearwise SSC CGL Solved Paper (English) 2023 — SSC CGL Tier-I, held 27 Jul 2023 Shift 2, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-27",
    shift: "Shift 2",
    paperId: PAPER_ID,
    questionRef: `YEARWISE-SSC-CGL-2023-P${input.page}-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

// Q29 was already normalized in CGL Tier-I Cross-Topic Wave 1. This wave adds
// every other Quant question from the paper so Q26-Q50 exist exactly once in the shared registry.
export const QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    q: 26, page: 2, packageId: "INT-001", topic: "Arithmetic — Interest",
    subtopic: "Simple interest — principal from interest difference across durations",
    representation: "SI_PRINCIPAL_FROM_DURATION_DIFFERENCE_MCQ",
    notes: "At 4% p.a., the five-year interest difference is ₹7,500, so principal is ₹37,500.",
  }),
  observation({
    q: 27, page: 2, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-002 — Marked price and discount reverse calculation",
    representation: "LIST_PRICE_FROM_DISCOUNTED_SELLING_PRICE_MCQ",
    notes: "₹54,000 is 80% of list price after a 20% discount, giving list price ₹67,500.",
  }),
  observation({
    q: 28, page: 2, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-002 — Reciprocal transformed values and identities",
    representation: "RECIPROCAL_POWER_DIFFERENCE_IDENTITY_MCQ",
    notes: "From x²−1/x²=4√2, squaring gives x²+1/x²=6; multiplying the conjugate-style factors gives x⁴−1/x⁴=24√2.",
  }),
  observation({
    q: 30, page: 2, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-002 — Pairwise-rate reconstruction",
    representation: "PAIRWISE_COMBINED_RATES_TO_ALL_THREE_TIME_MCQ",
    notes: "Pair rates are 1/12, 1/15 and 1/10. Their sum is twice the three-person rate, yielding combined completion time 8 days.",
  }),
  observation({
    q: 31, page: 2, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-001 — Distance-time scaling and speed ratio",
    representation: "DISTANCE_FRACTION_TIME_MULTIPLE_TO_SPEED_RATIO_MCQ",
    notes: "The second person covers one-fourth the distance in three times the time, so the first-to-second speed ratio is 12:1.",
  }),
  observation({
    q: 32, page: 2, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-005 — False weight combined with stated selling loss",
    representation: "FALSE_WEIGHT_WITH_STATED_LOSS_RATE_MCQ",
    notes: "If 25 g costs ₹100, 20 g costs ₹80 while the dealer charges ₹85 after a stated 15% loss; actual profit is 6.25%.",
  }),
  observation({
    q: 33, page: 2, packageId: "MEN-002", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-011 — Hollow cylindrical material volume",
    representation: "HOLLOW_PIPE_MATERIAL_VOLUME_FROM_CAPACITY_RELATION_MCQ",
    notes: "Inner radius is half the outer radius. Capacity fixes outer radius at 4 m; shell volume is 37.7 cubic metres using the source convention.",
  }),
  observation({
    q: 34, page: 2, packageId: "DI-003", topic: "Data Interpretation",
    subtopic: "Grouped/bar chart — direct category difference",
    representation: "BAR_CHART_DIRECT_DIFFERENCE_MCQ",
    notes: "Department E has 300 employees and C has 50, so the difference is 250.",
  }),
  observation({
    q: 35, page: 2, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — secant-tangent Pythagorean identity",
    representation: "SEC_TAN_SUBSTITUTION_IDENTITY_MCQ",
    notes: "Given sec A=3x and tan A=3/x, sec²A−tan²A=1 directly gives the displayed expression as 1.",
  }),
  observation({
    q: 36, page: 2, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle theorem — angle in a semicircle",
    representation: "LARGEST_CHORD_INSCRIBED_ANGLE_MCQ",
    notes: "The largest chord is a diameter; a diameter subtends 90° at any point on the same circle.",
  }),
  observation({
    q: 37, page: 2, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation",
    subtopic: "Exact simplification — structured difference of powers",
    representation: "STRUCTURED_POWER_DIFFERENCE_SIMPLIFICATION_MCQ",
    notes: "The source algebra simplifies the symmetric 120/100 expression exactly to 120−100=20.",
  }),
  observation({
    q: 38, page: 2, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-005 — Periodic assistance schedule",
    representation: "EVERY_THIRD_DAY_ASSISTANCE_MCQ",
    notes: "A does 3 units/day; B and C add 3 units on every third day. Each three-day cycle completes 12 of 60 units, so total time is 15 days.",
  }),
  observation({
    q: 39, page: 3, packageId: "RAP-003", topic: "Arithmetic — Ratio & Proportion",
    subtopic: "RAP-CP-015 — Income, expenditure and savings ratio",
    representation: "EXPENDITURE_SAVINGS_RATIO_WITH_INCOME_INCREASE_MCQ",
    notes: "Savings ₹4,500 represents 3 ratio parts, so initial income is ₹12,000; a 25% increase gives ₹15,000.",
  }),
  observation({
    q: 40, page: 3, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-003 — Three-variable symmetric identities",
    representation: "SUM_AND_CUBIC_IDENTITY_TO_SUM_OF_SQUARES_MCQ",
    notes: "Using a³+b³+c³−3abc=(a+b+c)(a²+b²+c²−ab−bc−ca) with sum 14 gives ab+bc+ca=63 and square-sum 70.",
  }),
  observation({
    q: 41, page: 3, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "GEO-CP-005 — Similarity and proportional geometry",
    representation: "TRIANGLE_SIMILARITY_SIDE_RECOVERY_MCQ",
    notes: "DC=5. Similar triangles give BC/AC=AC/DC, hence AC²=16×5 and AC=4√5 cm.",
  }),
  observation({
    q: 42, page: 3, packageId: "NUM-001", topic: "Arithmetic — Number System",
    subtopic: "NUM-CP-003 — Divisibility from digit-sum structure",
    representation: "CONSECUTIVE_DIGITS_ALWAYS_DIVISIBLE_BY_MCQ",
    notes: "Six consecutive digits sum to 6x+15=3(2x+5), so the number is always divisible by 3.",
  }),
  observation({
    q: 43, page: 3, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-004 — Early leaving and staged participation",
    representation: "MULTI_WORKER_EARLY_LEAVING_COMPLETION_TIME_MCQ",
    notes: "Using 144 work units, the missing 4 Benny-days and 10 Chethan-days add 64 units to the 144 base; 208/13=16 days.",
  }),
  observation({
    q: 44, page: 3, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-003 — Pursuit and catch-up",
    representation: "POLICE_THIEF_INITIAL_GAP_PURSUIT_MCQ",
    notes: "Relative speed is 5 km/h. Closing a 1150 m gap takes 828 s; at 6 km/h the thief covers 1380 m.",
  }),
  observation({
    q: 45, page: 3, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation",
    subtopic: "Exact fraction simplification",
    representation: "MIXED_FRACTION_ARITHMETIC_MCQ",
    notes: "The solved-paper simplification evaluates the displayed fractional expression to 13 3/28.",
  }),
  observation({
    q: 46, page: 3, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion",
    subtopic: "RAP-CP-004 / RAP-QL-018 — Third proportional",
    representation: "THIRD_PROPORTIONAL_WITH_ALGEBRAIC_TERMS_MCQ",
    notes: "For a=3x² and b=4xy, third proportional b²/a=48 reduces to y²=9; positive y=3.",
  }),
  observation({
    q: 47, page: 3, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle tangents — direct common tangent between two circles",
    representation: "TWO_CIRCLE_DIRECT_COMMON_TANGENT_LENGTH_MCQ",
    notes: "With centre distance 32 and radii 22 and 18, tangent length is √(32²−4²)=√1008=2√252 cm.",
  }),
  observation({
    q: 48, page: 3, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — aggregate two years and compare as ratio",
    representation: "TABLE_TWO_PERIOD_AGGREGATE_RATIO_MCQ",
    notes: "Clipkart 2019+2020 is 5.6+6.4=12; Tomato is 2.7+3.3=6; ratio 2:1.",
  }),
  observation({
    q: 49, page: 3, packageId: "MEN-002", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-007 — Cuboid room surface-area relation",
    representation: "FLOOR_ROOF_AREA_EQUALS_FOUR_WALLS_HEIGHT_MCQ",
    notes: "2lb=2(l+b)h with l=21 and b=14 gives h=8.4 m.",
  }),
  observation({
    q: 50, page: 3, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — sec A ± tan A reciprocal relation",
    representation: "SEC_PLUS_TAN_TO_SINE_MCQ",
    notes: "sec A+tan A=5 implies sec A−tan A=1/5; hence sec A=13/5, cos A=5/13 and sin A=12/13.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: `${SOURCE_FILE_ID} — 30 Yearwise SSC CGL Solved Paper (English) 2023.pdf`,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-27",
  shift: "Shift 2",
  sectionQuestionRange: "Q26-Q50",
  priorObservationReused: "CGL-T1-XTOP-W1-2023-07-27-S2-Q29",
  newObservationCount: QUANT_V4_CGL_2023_S2_FULL_QUANT_SECTION_WAVE2_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
} as const);
