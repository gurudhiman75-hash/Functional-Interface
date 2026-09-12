import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_AUTHORITY =
  "QUANT-V4-CGL-2024-09-11-S1-FULL-QUANT-SECTION-WAVE10-P2" as const;

const SOURCE_URL = "https://sscportal.in/sites/default/files/ssc-cgl-tier-1-paper-2024-sep-11-shift-1.pdf";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-11-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2024-09-11-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `SSC Portal mirror — SSC CGL Tier-I 2024, held 11 Sep 2024 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-11",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `SSC-PORTAL-CGL-2024-09-11-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 1, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Quadrilaterals — rhombus symmetry and angle relation", representation: "RHOMBUS_INTERIOR_POINT_EQUAL_DISTANCES_ANGLE_MCQ", notes: "In rhombus ABCD, interior O satisfies OA=OC; use the resulting symmetry/angle structure to determine five-ninths of ∠DOB." }),
  observation({ q: 2, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Combined average with equal subgroup means", representation: "COMBINED_GROUP_SAME_AVERAGE_MCQ", notes: "Both the 12-student subgroup and the remaining 18 students average 62, so the full group average is also 62." }),
  observation({ q: 3, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Dishonest weights combined with stated profit", representation: "SHORT_WEIGHT_PLUS_PROFIT_EFFECTIVE_GAIN_MCQ", notes: "The merchant gives 88% of true weight while pricing for a 10% nominal profit; compute effective cost of the delivered quantity against selling price." }),
  observation({ q: 4, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Equilateral triangle — area from perimeter", representation: "EQUILATERAL_PERIMETER_TO_AREA_MCQ", notes: "Perimeter 36 gives side 12; area is (√3/4)×12²=36√3." }),
  observation({ q: 5, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Complementary-angle trigonometric ratios", representation: "SEC_COSEC_COMPLEMENTARY_MINUS_COS_SIN_COMPLEMENTARY_MCQ", notes: "cosec55°=sec35° and sin65°=cos25°, so each ratio is 1 and the difference is 0." }),
  observation({ q: 6, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Reciprocal algebraic identities — cube difference", representation: "X_PLUS_RECIPROCAL_TO_CUBE_DIFFERENCE_MCQ", notes: "Given x+1/x=2√10 and x>1, obtain x-1/x=6, then x³-1/x³=(x-1/x)((x+1/x)²-1)=234." }),
  observation({ q: 7, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric algebra under linked sine/cosine equations", representation: "LINKED_SIN_COS_COEFFICIENTS_IDENTITY_MCQ", notes: "Use a sinX=b cosX with the cubic relation to reduce the expression; the required a²+b² equals 1." }),
  observation({ q: 8, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — smallest addition", representation: "SMALLEST_ADDITION_FOR_DIVISIBILITY_MCQ", notes: "999 leaves remainder 9 when divided by 99, so add 90 to reach 1089." }),
  observation({ q: 9, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — linked time condition", representation: "SIMPLE_INTEREST_LINKED_TIME_AND_REFERENCE_SUM_MCQ", notes: "The paper links the unknown time to an SI relation involving another sum; substitution yields interest ₹13,440 on ₹16,000 at 14%." }),
  observation({ q: 10, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Grouped bar chart — compare combined multi-year averages", representation: "GROUPED_BAR_TWO_PAIR_MULTIYEAR_AVERAGE_PERCENT_MCQ", notes: "The chart compares four-year coffee production of A,C against B,D and asks the percentage more/less, rounded to two decimals." }),
  observation({ q: 11, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — intersecting chords theorem", representation: "INTERSECTING_CHORDS_UNKNOWN_SEGMENT_MCQ", notes: "MO×ON=PO×OQ gives 9×5=PO×6, hence PO=7.5 cm." }),
  observation({ q: 12, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "HCF application — largest square tile", representation: "HCF_RECTANGLE_LARGEST_SQUARE_TILE_COUNT_MCQ", notes: "Convert 4 m 95 cm and 16 m 65 cm to 495 cm and 1665 cm; the largest square tile side is their HCF, then divide total area by tile area." }),
  observation({ q: 13, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Election percentages — turnout, invalid votes and candidate share", representation: "ELECTION_MULTI_STAGE_PERCENT_VALID_VOTES_MCQ", notes: "Apply 90% turnout, then 85% valid votes, then Q's 22% share of valid votes to the electorate total." }),
  observation({ q: 14, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — nested subgroup percentages", representation: "PIE_COURSE_SHARE_GENDER_SUBGROUP_PERCENT_TOTAL_MCQ", notes: "Use B.Com and B.Sc C.Sci sector shares, then their stated girl percentages, and express the combined girls as a percentage of all 7000 students." }),
  observation({ q: 15, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Right-triangle complementary angles and cotangent", representation: "RIGHT_TRIANGLE_SIN_COS_COT_ANGLE_SUM_MCQ", notes: "In right triangle ABC at C, A+B=90°, so cot(A+B)=cot90°=0; the entire product is 0." }),
  observation({ q: 16, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Simultaneous linear equations — three unknowns", representation: "THREE_LINEAR_EQUATIONS_SOLVE_XYZ_MCQ", notes: "Solving x+2z=3, x+2y+3z=5 and 3x−5z=−13 gives x=−1, y=0, z=2." }),
  observation({ q: 17, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes — combined rate with one pipe 1.5 times as fast", representation: "TWO_PIPES_RATE_RATIO_FROM_JOINT_TIME_MCQ", notes: "Rates are in ratio 3:2 and sum to 1/15 tank/min; recover the faster pipe's individual time." }),
  observation({ q: 18, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Successive discounts", representation: "MARKED_PRICE_TWO_SUCCESSIVE_DISCOUNTS_MCQ", notes: "₹1200×0.85×0.90=₹918." }),
  observation({ q: 19, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — recover appeared candidates from qualified count and ratio", representation: "TABLE_QUALIFIED_COUNT_RATIO_REVERSE_TOTAL_MCQ", notes: "The state/year table supplies qualification information and a male:female relation; reverse the given quantities to obtain 480 appeared candidates." }),
  observation({ q: 20, packageId: "SAP", topic: "Arithmetic — Sequences & Progressions", subtopic: "Arithmetic progression — salary increment from two service years", representation: "AP_SALARY_TWO_TERMS_COMMON_DIFFERENCE_MCQ", notes: "Salary after 15 years minus salary after 6 years spans nine annual increments: (52997−28400)/9=2733." }),
  observation({ q: 21, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — average marks across students", representation: "TABLE_SINGLE_SUBJECT_AVERAGE_MCQ", notes: "Average the Mathematics marks 70,85,90,95,75 to get 83." }),
  observation({ q: 22, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "Mensuration — area of annular circular track and cost", representation: "ANNULUS_AREA_RATE_COST_MCQ", notes: "With outer radius 28 m, inner radius 25 m and π=22/7, area is π(28²−25²); multiply by ₹28/m² to get ₹13,992." }),
  observation({ q: 23, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Division algorithm — divisor, quotient and remainder relations", representation: "DIVISION_ALGORITHM_RELATIONAL_DIVISOR_QUOTIENT_REMAINDER_MCQ", notes: "Remainder 32 makes divisor 64 and quotient 16; dividend=64×16+32=1056." }),
  observation({ q: 24, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Race handicaps — combine time and distance starts", representation: "TWO_RACE_HANDICAPS_RECOVER_RUNNER_FULL_TIME_MCQ", notes: "Use the 20-second head-start race and the 189-metre head-start race jointly to solve Atul/Vishu speeds and recover Vishu's 900 m time." }),
  observation({ q: 25, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Partition ratio from difference between two shares", representation: "RATIO_SHARES_DIFFERENCE_TO_THIRD_SHARE_MCQ", notes: "Q−R corresponds to 7 ratio parts=₹560, so one part=₹80 and S's 3 parts=₹240." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS = Object.freeze({
  source: "SSC Portal mirrored paper — SSC CGL Tier-I 11 Sep 2024 Shift 1; image/formula-heavy stems cross-checked against alternate indexed copies",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-11",
  shift: "Shift 1",
  sectionQuestionRange: "Q1-Q25",
  newObservationCount: QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: true,
  productionPromotionAuthorized: false,
} as const);
