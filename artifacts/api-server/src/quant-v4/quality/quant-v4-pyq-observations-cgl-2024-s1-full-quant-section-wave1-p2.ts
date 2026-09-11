import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_AUTHORITY =
  "QUANT-V4-CGL-2024-S1-FULL-QUANT-SECTION-WAVE1-P2" as const;

const SOURCE_FILE_ID = "file_00000000c95482438c82d805300a3107";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-09-S1";

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
    observationId: `CGL-2024-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `library://${SOURCE_FILE_ID}#page=${input.page}&question=${input.q}`,
    sourceLabel: `30 Yearwise SSC CGL Solved Paper (English) 2024 — SSC CGL Tier-I, held 09 Sep 2024 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-09",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `YEARWISE-SSC-CGL-2024-P${input.page}-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

// Q51 is already normalized by CGL Tier-I Cross-Topic Wave 1. This file adds
// Q52-Q75 only so the shared registry has exactly one observation per paper question.
export const QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({
    q: 52, page: 3, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — complementary-angle and Pythagorean identities",
    representation: "TRIG_COMPLEMENTARY_SQUARE_IDENTITY_MCQ",
    notes: "cos²29° + cos²61° = cos²29° + sin²29° = 1.",
  }),
  observation({
    q: 53, page: 3, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance",
    subtopic: "TSD-CP-006 — Circular and closed-track motion",
    representation: "SAME_DIRECTION_CIRCULAR_CATCH_UP_MCQ",
    notes: "Relative speed is 12−6=6 m/s; one 840 m relative lap takes 840/6=140 seconds.",
  }),
  observation({
    q: 54, page: 3, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "GEO-CP-010 — Chords and perpendicular distance from the centre",
    representation: "PARALLEL_CHORDS_DIAMETER_RECOVERY_MCQ",
    notes: "Half-chords are 5 and 12. With perpendicular distances differing by 7, equal-radius equations give the smaller distance 5 and radius 13, hence diameter 26.",
  }),
  observation({
    q: 55, page: 3, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "GEO-CP-004 — Congruence and rigid triangle inference",
    representation: "CONGRUENCE_SUFFICIENCY_STATEMENT_MCQ",
    notes: "Two equal corresponding sides plus equal perimeter forces the third sides equal, establishing SSS congruence.",
  }),
  observation({
    q: 56, page: 3, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — convert percentage marks to absolute threshold",
    representation: "TABLE_PERCENT_TO_ABSOLUTE_THRESHOLD_MCQ",
    notes: "History is out of 175 and pass mark is 105. Ram and Mohan are below 105; Shyam's 75% is 131.25, so exactly one student passes.",
  }),
  observation({
    q: 57, page: 4, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-009 — Core pipes and combined fill rates",
    representation: "PIPE_EFFICIENCY_RATIO_COMBINED_TIME_MCQ",
    notes: "If Q's rate is 1 unit/min for 110 units and P is 21 times faster, combined rate is 22 units/min; time = 110/22 = 5 minutes.",
  }),
  observation({
    q: 58, page: 4, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — row total to overall percentage",
    representation: "TABLE_ROW_AGGREGATE_PERCENTAGE_MCQ",
    notes: "The solved-paper solution totals Tarun's five marks as 395 out of 500, i.e. 79%.",
  }),
  observation({
    q: 59, page: 4, packageId: "ALG-002", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-007 — Simultaneous linear equations and constrained integer recovery",
    representation: "COIN_COUNT_LINEAR_SYSTEM_OPTION_MCQ",
    notes: "5x+2y+z=100 and x+y+z=40 reduce to 4x+y=60; option consistency gives x=13 five-rupee coins.",
  }),
  observation({
    q: 60, page: 4, packageId: "MEN-002", topic: "Advanced Mathematics",
    subtopic: "MEN-CP-008 — Cylinders and cones",
    representation: "CONE_VOLUME_RATIO_TO_HEIGHT_RATIO_MCQ",
    notes: "V∝r²h. With r1:r2=2:5 and V1:V2=3:5, h1:h2=(3/5)/(4/25)=15:4.",
  }),
  observation({
    q: 61, page: 4, packageId: "NUM-001", topic: "Arithmetic — Number System",
    subtopic: "NUM-CP-003 — Divisibility rules and missing-digit constraints",
    representation: "MISSING_DIGIT_DIVISIBILITY_BY_6_MCQ",
    notes: "Divisibility by 6 requires an even last digit and digit sum divisible by 3. k=2 makes the digit sum 27.",
  }),
  observation({
    q: 62, page: 4, packageId: "PCT-002", topic: "Arithmetic — Percentage",
    subtopic: "PCT-CP-006 — Multi-stage attrition and elections",
    representation: "ELECTION_NONVOTER_INVALID_VALID_MARGIN_REVERSE_MCQ",
    notes: "After non-voters and 10% invalid ballots, the valid-vote share gap is 18.75%; equating the winning margin to 2484 yields y=8% non-voters.",
  }),
  observation({
    q: 63, page: 4, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss",
    subtopic: "PNL-CP-002 — Marked price, discount and profit calibration",
    representation: "MARKED_PRICE_DISCOUNT_SP_ABOVE_CP_MCQ",
    notes: "40% discount on ₹550 gives SP ₹330. Since SP is 110% of CP, CP=₹300.",
  }),
  observation({
    q: 64, page: 4, packageId: "GEO-001", topic: "Advanced Mathematics",
    subtopic: "GEO-CP-003 — Triangle angle and side properties",
    representation: "EQUILATERAL_SIDE_FROM_TWO_SIDE_SUM_MCQ",
    notes: "All equilateral-triangle sides are equal; if two sides total 16 cm, each side and therefore the third side is 8 cm.",
  }),
  observation({
    q: 65, page: 4, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-004 — Polynomial operations and factorisation",
    representation: "DIFFERENCE_OF_SQUARES_CANCELLATION_MCQ",
    notes: "The source simplifies the factorable rational expression by using x²−9=(x−3)(x+3), leaving x−3 under the stated expression domain.",
  }),
  observation({
    q: 66, page: 4, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — derived absentees and ordinal comparison",
    representation: "TABLE_DERIVED_TOTAL_SECOND_HIGHEST_MCQ",
    notes: "Absentees are total minus present across P/Q/R. The solved-paper totals are 34 (2018), 31 (2019), 30 (2020), 30 (2017), making 2019 second highest.",
  }),
  observation({
    q: 67, page: 4, packageId: "GEO-002", topic: "Advanced Mathematics",
    subtopic: "Circle tangents — direct common tangent between two circles",
    representation: "TWO_CIRCLE_DIRECT_COMMON_TANGENT_LENGTH_MCQ",
    notes: "For centre distance 37 and radii 22 and 10, direct common tangent length is √(37²−12²)=√1225=35 cm.",
  }),
  observation({
    q: 68, page: 4, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — complementary-angle square-identity cancellation",
    representation: "MULTI_TERM_TRIG_SQUARE_CANCELLATION_MCQ",
    notes: "Complementary pairs convert sin²(90°−θ) to cos²θ; grouped Pythagorean identities cancel to 0.",
  }),
  observation({
    q: 69, page: 4, packageId: "AVG-001", topic: "Arithmetic — Average",
    subtopic: "AVG-CP-004 — Weighted and combined aggregation",
    representation: "TWO_GROUP_AVERAGE_TO_COUNT_RATIO_MCQ",
    notes: "75x+80y=78(x+y) gives 3x=2y, hence boys:girls = 2:3.",
  }),
  observation({
    q: 70, page: 4, packageId: "TMW-001", topic: "Arithmetic — Time and Work",
    subtopic: "TMW-CP-001 — Fundamental work-rate-time mapping",
    representation: "FRACTIONAL_WORK_TO_TOTAL_TIME_MCQ",
    notes: "If 17/27 of the printing order takes 34 days at constant rate, the whole order takes 34×27/17=54 days.",
  }),
  observation({
    q: 71, page: 4, packageId: "ALG-001", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-004 — Polynomial operations and factorisation",
    representation: "POLYNOMIAL_FACTOR_CANCELLATION_MCQ",
    notes: "The source factorises the cubic numerator around (x−5) and simplifies to x²+10x+25.",
  }),
  observation({
    q: 72, page: 4, packageId: "TRG-001", topic: "Advanced Mathematics",
    subtopic: "Trigonometry — ratio recovery and compound identities",
    representation: "COSEC_GIVEN_SEC_COT_IDENTITY_EVALUATION_MCQ",
    notes: "cosecθ=5/3 gives cotθ=4/3 and sec²θ−1=tan²θ=9/16; exact substitution yields 25/9.",
  }),
  observation({
    q: 73, page: 4, packageId: "ALG-002", topic: "Advanced Mathematics",
    subtopic: "ALG-CP-009 — Quadratic equations",
    representation: "SIMPLIFY_TO_QUADRATIC_PARAMETER_ROOT_PAIR_MCQ",
    notes: "The source reduces the relation to 11k−9=k²+1, so k²−11k+10=0=(k−1)(k−10); k=1 or 10.",
  }),
  observation({
    q: 74, page: 4, packageId: "DI-001", topic: "Data Interpretation",
    subtopic: "Linked table — column maxima followed by overall percentage",
    representation: "TABLE_COLUMN_MAXIMA_AGGREGATE_PERCENTAGE_MCQ",
    notes: "Taking the highest listed percentage in each subject produces 547 marks out of 600, i.e. 91 1/6%.",
  }),
  observation({
    q: 75, page: 4, packageId: "INT-001", topic: "Arithmetic — Interest",
    subtopic: "INT-CP-002 — Simple-interest interval ledger with partial principal discharge",
    representation: "SIMPLE_INTEREST_PARTIAL_PRINCIPAL_REPAYMENT_TIMELINE_MCQ",
    notes: "First-year SI is ₹84,418.40. After ₹21,679 principal repayment, second-year principal is ₹4,00,413 and SI ₹80,082.60; final payment totals ₹5,64,914.",
  }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_SOURCE_LIMITATIONS = Object.freeze({
  sourceFile: `${SOURCE_FILE_ID} — 30 Yearwise SSC CGL Solved Paper (English) 2024.pdf`,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-09",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  priorObservationReused: "CGL-T1-XTOP-W1-2024-09-09-S1-Q51",
  newObservationCount: QUANT_V4_CGL_2024_S1_FULL_QUANT_SECTION_WAVE1_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
} as const);
