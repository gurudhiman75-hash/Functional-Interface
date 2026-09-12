import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_AUTHORITY =
  "QUANT-V4-CGL-2023-07-25-S1-FULL-QUANT-SECTION-WAVE6-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-previous-papers/ssc-cgl-tier-1-25th-july-2023-shift-1";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-25-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-25-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2023, held 25 Jul 2023 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-25",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-25-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — recover principal and interest from the principal-interest difference", representation: "SIMPLE_INTEREST_PRINCIPAL_DIFFERENCE_REVERSE_MCQ", notes: "At 12.5% p.a. for 6 years, SI=75% of principal. The principal exceeds SI by 25%=₹13,500, so principal=₹54,000 and SI=₹40,500." }),
  observation({ q: 52, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — angle addition and cosecant", representation: "COSEC_ANGLE_ADDITION_EXACT_VALUE_MCQ", notes: "sin75°=sin(45°+30°)=(√6+√2)/4, so cosec75°=√6−√2." }),
  observation({ q: 53, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "AVG-CP-002 — New observation required to raise an existing average", representation: "AVERAGE_NEW_INNINGS_TARGET_MCQ", notes: "Nineteen innings at average 65 total 1235. Twenty innings at average 67 require 1340, so the 20th innings must be 105." }),
  observation({ q: 54, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "MEN-CP-012 — Recasting, melting and volume conservation", representation: "CUBE_RECAST_THREE_CUBES_MISSING_SIDE_MCQ", notes: "A 12 cm cube has volume 1728. After cubes of sides 6 and 8 use 216+512=728, the remaining 1000 gives third side 10 cm." }),
  observation({ q: 55, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Relative motion — chase from a fixed initial lead", representation: "CHASE_INITIAL_LEAD_CATCH_DISTANCE_MCQ", notes: "The thief is 600 m ahead. Relative speed is 9−8=1 km/h, so catch time is 0.6 h; the thief runs 4.8 km and the policeman 5.4 km." }),
  observation({ q: 56, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Multi-lot selling — combine loss and profit portions to reach a target overall profit", representation: "MULTI_PORTION_SALES_TARGET_OVERALL_PROFIT_MCQ", notes: "The paper splits a ₹3,600 apple purchase across sale conditions and asks the final portion's selling price required for 27% overall profit; ownership is the profit/loss multi-lot ledger." }),
  observation({ q: 57, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Men/women efficiency system from two mixed-work equations", representation: "MEN_WOMEN_TWO_EQUATION_WORK_RATE_MCQ", notes: "4 men+6 women finish in 8 days and 3 men+7 women in 10 days; solve the two rate equations, then convert the total work to a 25-women completion time." }),
  observation({ q: 58, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Grouped bar chart — compare two branches across two years by percentage", representation: "GROUPED_BAR_TWO_YEAR_BRANCH_PERCENT_COMPARISON_MCQ", notes: "The paper gives book sales for six branches in 2018 and 2019 and asks Branch 6's two-year total as a percentage of Branch 3's two-year total." }),
  observation({ q: 59, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Remainders and modular arithmetic", representation: "POWER_PLUS_CONSTANT_REMAINDER_MCQ", notes: "Modulo 7, 8≡1, so 8^8+6≡1+6≡0; the remainder is 0." }),
  observation({ q: 60, packageId: "ALG-002", topic: "Advanced Mathematics", subtopic: "ALG-CP-008 — Algebraic fractions and rational equations", representation: "NESTED_RATIONAL_EQUATION_MCQ", notes: "The nested rational expression is simplified under its domain restrictions and solved as a rational equation; ALG-CP-008 owns algebraic fractions and rational equations." }),
  observation({ q: 61, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Division algorithm — divisor, quotient and remainder relations", representation: "DIVISION_ALGORITHM_RELATION_SYSTEM_MCQ", notes: "Divisor is 13 times the quotient and 6 times the remainder. With remainder 39, divisor=234 and quotient=18, so dividend=234×18+39." }),
  observation({ q: 62, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratios — recover secant from tangent", representation: "TAN_TO_SEC_PYTHAGOREAN_IDENTITY_MCQ", notes: "tan A=6 gives sec²A=1+tan²A=37, hence positive acute-angle sec A=√37." }),
  observation({ q: 63, packageId: "DI-004", topic: "Data Interpretation", subtopic: "Line graph — year-on-year ratio from plotted imports", representation: "LINE_GRAPH_ADJACENT_YEAR_RATIO_MCQ", notes: "The source graph asks how many times the 1977 import value is compared with 1976; DI-004 is the live line-graph package." }),
  observation({ q: 64, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — direct common tangent between externally touching circles", representation: "EXTERNALLY_TOUCHING_CIRCLES_DIRECT_TANGENT_MCQ", notes: "For externally touching circles of radii 25 and 4, centre distance is 29 and direct common tangent is √(29²−21²)=20." }),
  observation({ q: 65, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal transformed values and identities", representation: "RECIPROCAL_SIXTH_POWER_FROM_DIFFERENCE_MCQ", notes: "Starting from y−1/y=4, reciprocal-power identities recover y²+1/y² and then y⁶+1/y⁶ without solving y explicitly." }),
  observation({ q: 66, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-003 — Circles, arcs and sectors", representation: "ARC_LENGTH_FORMULA_IDENTIFICATION_MCQ", notes: "(central angle/360)×π×diameter is the arc-length formula, a plane-mensuration measurement contract." }),
  observation({ q: 67, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Relative motion — police chase from an initial gap", representation: "CHASE_INITIAL_GAP_DISTANCE_RUN_MCQ", notes: "With 400 m lead and speeds 16 and 18 km/h, relative speed is 2 km/h, catch time is 0.2 h, and the thief runs 3.2 km." }),
  observation({ q: 68, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Changing workforce — fixed number of men leave after each day", representation: "DAILY_WORKFORCE_ATTRITION_INITIAL_COUNT_MCQ", notes: "Planned 13-day work is equated to the actual 16-day arithmetic sequence of worker counts when 9 men leave after each day, yielding the initial workforce." }),
  observation({ q: 69, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Single discount versus successive discounts", representation: "SINGLE_VS_SUCCESSIVE_DISCOUNT_AMOUNT_DIFFERENCE_MCQ", notes: "On a ₹50,000 bill, compare one 40% discount with successive 36% and 4% discounts; this is the live PNL successive-discount family." }),
  observation({ q: 70, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Combined work and individual rate recovery", representation: "PAIR_TIME_AND_ONE_WORKER_TO_OTHER_TIME_MCQ", notes: "Raju and Rajat together take 5 days while Raju alone takes 7; subtract rates to recover Rajat's individual completion time." }),
  observation({ q: 71, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "PCT-CP-005 — Distributional analysis with wastage, remainder share and fixed-count relation", representation: "PERCENT_DISTRIBUTION_WASTAGE_REMAINDER_COUNT_MCQ", notes: "One-tenth are wasted, 35% of the remainder go to S, and N gets one-eighth of the total; the fixed difference between N's count and wastage anchors the original total." }),
  observation({ q: 72, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-002 — Quadrilateral measurement systems", representation: "RECTANGLE_PERIMETER_TO_DIAGONAL_RATIO_MCQ", notes: "For a 150×80 field, perimeter is 460 and diagonal is √(150²+80²)=170, giving ratio 46:17." }),
  observation({ q: 73, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — transverse common tangent formula", representation: "COMMON_TRANSVERSE_TANGENT_FORMULA_MCQ", notes: "For two circles, common transverse tangent length is √(d²−(r1+r2)²)." }),
  observation({ q: 74, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — angle addition with sine and cotangent", representation: "TRIG_ANGLE_ADDITION_COMPOSITE_VALUE_MCQ", notes: "cot A=1 and sin B=1/√2 fix acute A=B=45°, so A+B=90°; evaluate the requested composite under the source's stated expression/domain." }),
  observation({ q: 75, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Identities and reciprocal transformed values", representation: "QUADRATIC_RECIPROCAL_HIGH_POWER_IDENTITY_MCQ", notes: "x²−15x+1=0 gives x+1/x=15; reciprocal identities reduce the requested fourth-degree expression without selecting an individual root." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 25 Jul 2023 Shift 1",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-25",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_07_25_S1_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
