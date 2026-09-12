import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY =
  "QUANT-V4-CGL-2022-12-06-S2-FULL-QUANT-SECTION-WAVE9-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-6-dec-2022-shift-2-question-paper-solved";
const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-06-S2";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2022-12-06-S2-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2022, held 6 Dec 2022 Shift 2, Quantitative Aptitude Q${input.q}`,
    heldDate: "2022-12-06",
    shift: "Shift 2",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2022-12-06-S2-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — number of circles through two fixed points", representation: "CIRCLE_THROUGH_TWO_FIXED_POINTS_CONCEPT_MCQ", notes: "Two fixed points determine a perpendicular-bisector locus of possible centres, so infinitely many circles pass through them." }),
  observation({ q: 52, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Mean proportional", representation: "MEAN_PROPORTIONAL_DECIMAL_VALUES_MCQ", notes: "x²=12.8×64.8=829.44, hence x=28.8." }),
  observation({ q: 53, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — double-angle from cotangent", representation: "COT_GIVEN_TAN_DOUBLE_ANGLE_MCQ", notes: "cot A=15/8 gives tan A=8/15; tan2A=2t/(1-t²)=240/161." }),
  observation({ q: 54, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — one category as a percentage of another", representation: "TABLE_DIRECT_PERCENT_COMPARISON_MCQ", notes: "The paper supplies a six-state survey table and asks L as a percentage of J." }),
  observation({ q: 55, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — compare two two-day aggregates", representation: "TABLE_TWO_PAIR_AGGREGATE_DIFFERENCE_MCQ", notes: "The weekly-temperature table requires (Mon+Tue) minus (Fri+Sat)." }),
  observation({ q: 56, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility of powers", representation: "POWER_SUM_DIVISIBILITY_MCQ", notes: "The expression is tested modulo the candidate divisors; factor common powers where useful rather than expanding." }),
  observation({ q: 57, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest embedded in instalment balance", representation: "DOWN_PAYMENT_FROM_SI_LOAN_INSTALMENTS_MCQ", notes: "Twenty instalments total ₹500000, which equals 110% of the financed balance; subtract that balance from ₹650000 to recover the down payment." }),
  observation({ q: 58, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Weighted overall profit from two sale rates", representation: "SPLIT_QUANTITY_TWO_PROFIT_RATES_OVERALL_GAIN_MCQ", notes: "Alligation between 20%, 12% and overall 18% gives quantities in ratio 3:1, so the 12%-profit portion is 555 kg." }),
  observation({ q: 59, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "HCF definition", representation: "HCF_CONCEPT_STATEMENT_MCQ", notes: "The correct definition is the greatest number that divides each given number exactly." }),
  observation({ q: 60, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — difference of two pairwise averages", representation: "PIE_PAIR_AVERAGE_DIFFERENCE_MCQ", notes: "The paper supplies six factory production shares from a total of 12000 and compares averages for P,R versus Q,T." }),
  observation({ q: 61, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Symmetric algebra — derive cubic sum from reciprocal-style condition", representation: "A_OVER_B_PLUS_B_OVER_A_AND_SUM_TO_CUBIC_SUM_MCQ", notes: "From a/b+b/a=1 derive a²+b²=ab. With a+b=2, obtain ab=4 and then a³+b³=(a+b)³-3ab(a+b)." }),
  observation({ q: 62, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Free-item offer as effective discount", representation: "BUY_X_GET_Y_FREE_EFFECTIVE_DISCOUNT_MCQ", notes: "Pay for 12 and receive 15; effective discount is 3/15=20%." }),
  observation({ q: 63, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Percentage change in a ratio when numerator and denominator both decrease", representation: "RATIO_PERCENT_CHANGE_FROM_DIFFERENT_COMPONENT_DECREASES_MCQ", notes: "New ratio multiplier is (100-p)/(100-q); converting its drop from 1 gives 100(p-q)/(100-q)." }),
  observation({ q: 64, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circle chords — distance of parallel chords from centre", representation: "PARALLEL_CHORDS_MIN_SEPARATION_MCQ", notes: "For radius 25, half-chords 20 and 15 lie 15 and 20 from the centre; minimum separation is 5 cm when on the same side." }),
  observation({ q: 65, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identity from quadratic form", representation: "SQUARE_OF_LINEAR_COMBINATION_FROM_SQUARES_AND_PRODUCT_MCQ", notes: "(2x+y)²=4x²+y²+4xy=40+24=64, so the positive value is 8." }),
  observation({ q: 66, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Successive gains through two resales", representation: "TWO_STAGE_SUCCESSIVE_GAIN_REVERSE_COST_MCQ", notes: "Final price equals original cost×1.16×1.32; reverse from ₹3828 to ₹2500." }),
  observation({ q: 67, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Hollow cylinder/pipe — total surface area", representation: "HOLLOW_PIPE_TOTAL_SURFACE_AREA_MCQ", notes: "External radius 10, internal radius 9, length 12; add outer CSA, inner CSA and both annular ends." }),
  observation({ q: 68, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Variable workforce — fixed number drop out daily", representation: "DAILY_WORKER_DROPOUT_PROJECT_TIME_MCQ", notes: "Equate planned work 6n to the eight-day arithmetic-series workforce total n+(n-18)+...+(n-126), yielding n=252." }),
  observation({ q: 69, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Complementary-angle identity", representation: "COS_OVER_SIN_COMPLEMENTARY_ANGLES_MCQ", notes: "sin53°=cos37°, so the ratio is 1." }),
  observation({ q: 70, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric periodicity with negative angle", representation: "COS_NEGATIVE_LARGE_ANGLE_REDUCTION_MCQ", notes: "Use evenness and reduce 17π/3 modulo 2π; the equivalent angle gives 1/2." }),
  observation({ q: 71, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Relative speed — chase from fixed lead", representation: "CHASE_INITIAL_DISTANCE_RELATIVE_SPEED_TIME_MCQ", notes: "Relative speed is 14 km/h; 280 m divided by that rate gives 1.2 minutes." }),
  observation({ q: 72, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circle tangent-secant theorem", representation: "TANGENT_SECANT_CHORD_LENGTH_MCQ", notes: "MT²=MA×MB gives 144=8×MB, so MB=18 and chord AB=10." }),
  observation({ q: 73, packageId: "SRI-002", topic: "Number System", subtopic: "Surds and radicals — conjugate reciprocal structure", representation: "QUADRATIC_SURD_POWER_SYMMETRY_MCQ", notes: "For p=7+4√3, 1/p=7-4√3 and p+1/p=14; reduce the symmetric power expression recursively." }),
  observation({ q: 74, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Equilateral triangle — recover side from height and find area", representation: "EQUILATERAL_HEIGHT_TO_AREA_MCQ", notes: "h=(√3/2)a=7√3 gives a=14; area=(√3/4)×196=49√3." }),
  observation({ q: 75, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — ratio of two pairwise averages expressed as percentage", representation: "PIE_PAIR_AVERAGE_PERCENT_RATIO_MCQ", notes: "The eight-school pie chart compares average boys in S1,S2 with average boys in S6,S8; equal pair sizes reduce the task to a ratio of pair totals." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 6 Dec 2022 Shift 2",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2022-12-06",
  shift: "Shift 2",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2022_12_06_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: true,
  productionPromotionAuthorized: false,
} as const);
