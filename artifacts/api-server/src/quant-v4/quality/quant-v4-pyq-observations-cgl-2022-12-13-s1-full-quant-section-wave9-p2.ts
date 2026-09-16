import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_AUTHORITY =
  "QUANT-V4-CGL-2022-12-13-S1-FULL-QUANT-SECTION-WAVE9-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-13-dec-2022-shift-1-question-paper-solved";
const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-13-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  const page = input.q <= 60 ? 6 : input.q <= 70 ? 7 : 8;
  return Object.freeze({
    observationId: `CGL-2022-12-13-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}?page=${page}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2022, held 13 Dec 2022 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2022-12-13",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2022-12-13-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — recover cotangent from secant and tangent", representation: "SEC_TAN_IDENTITY_TO_COT_MCQ", notes: "Using sec²A=1+tan²A, the condition gives tan²A=1; the source answer takes the positive exam-domain value cot A=1." }),
  observation({ q: 52, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — cylinder curved surface area and volume relation", representation: "CYLINDER_CSA_VOLUME_RADIUS_RELATION_MCQ", notes: "2×CSA = volume gives 4πrh=πr²h, hence r=4." }),
  observation({ q: 53, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal transformed values", representation: "RECIPROCAL_ROOT_HIGH_POWER_VALUE_MCQ", notes: "K+1/K=-2 with K<0 forces K=-1, so K^11+1/K^4=0." }),
  observation({ q: 54, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Marked price, successive discounts and final profit percentage", representation: "SUCCESSIVE_DISCOUNT_TO_PROFIT_PERCENT_MCQ", notes: "Selling price is 8400×0.75×0.85=5355; profit is 1355 on cost 4000, i.e. 33.875%, rounded to 34%." }),
  observation({ q: 55, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "Circle measurement — circumference to radius difference", representation: "TWO_CIRCLE_CIRCUMFERENCE_RADIUS_DIFFERENCE_MCQ", notes: "With circumferences 110 and 330, the radii are 17.5 and 52.5 cm for π=22/7, so the difference is 35 cm." }),
  observation({ q: 56, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Races — chained winning margins and head starts", representation: "THREE_RUNNER_HEADSTART_MARGIN_MCQ", notes: "The first race gives speed ratio A:B:C=100:90:81. With cumulative 100 m head starts, C runs only 800 m and wins; the next runner is about 20 m behind." }),
  observation({ q: 57, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Right-triangle trigonometry — 45 degree side equality", representation: "RIGHT_TRIANGLE_45_DEGREE_SIDE_MCQ", notes: "A right triangle with one acute angle 45° is isosceles, so QR=PQ=8 cm." }),
  observation({ q: 58, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Ratio fundamentals — equal additive change to both terms", representation: "SALARY_RATIO_COMMON_INCREMENT_MCQ", notes: "Let salaries be 3x and 5x. (3x+5000)/(5x+5000)=5/7 gives x=2500, so Riya's salary is 12500." }),
  observation({ q: 59, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Basic table — direct ratio between two categories", representation: "TABLE_DIRECT_RATIO_MCQ", notes: "The source table asks for working days in year R relative to year T; this is the live basic-table DI contract." }),
  observation({ q: 60, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Grouped bar chart — percentage distribution across two years", representation: "GROUPED_BAR_UNSOLD_PERCENT_COMPLEMENT_MCQ", notes: "The chart gives T-type production shares in two years; 25% of each year's T production remains unsold." }),
  observation({ q: 61, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Efficiency comparison — combined completion time", representation: "EFFICIENCY_PERCENT_TO_COMBINED_TIME_MCQ", notes: "If A:B efficiency=6:5 and A alone takes 29 days, combined rate is 11/174 of the job per day, so time is 174/11 days." }),
  observation({ q: 62, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-005 — Polynomial remainder theorem", representation: "POLYNOMIAL_REMAINDER_AT_MINUS_ONE_MCQ", notes: "For division by m+1, substitute m=-1: (-1)^12-1=0." }),
  observation({ q: 63, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric reciprocal relation — tan and cot", representation: "TAN_COT_SUM_HIGH_POWER_MCQ", notes: "For positive acute-angle tanθ and cotθ with product 1, a+b=2 implies both equal 1; the requested high-power sum is 2." }),
  observation({ q: 64, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — verify numerical statements", representation: "ALGEBRA_IDENTITY_STATEMENT_VERIFICATION_MCQ", notes: "Statement I gives 1728-8-1000=720, not 360. Statement II gives 4(x²+y²)=4[(48)²-64]=8960, not 4480; neither statement is correct." }),
  observation({ q: 65, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Grouped bar chart — cross-year percentage comparison", representation: "GROUPED_BAR_CROSS_YEAR_PERCENTAGE_MCQ", notes: "The source is a grouped bar graph of lecturer recruitment in three states across five years; B-2019 is compared with C-2021." }),
  observation({ q: 66, packageId: "PCT-006", topic: "Arithmetic — Percentage", subtopic: "Percentage comparison and comparative change", representation: "TWO_ENTITY_PERCENT_DECREASE_RATIO_MCQ", notes: "Company A decreases by 15% and company B by 10%; the ratio of the percentage decreases is 3:2." }),
  observation({ q: 67, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — compare interest amount with monthly income", representation: "SIMPLE_INTEREST_AS_PERCENT_OF_INCOME_MCQ", notes: "SI=30000×5×3/100=4500, which is 25% of monthly income 18000." }),
  observation({ q: 68, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "HCF and LCM with coprime ratio", representation: "HCF_RATIO_TO_LCM_MCQ", notes: "Numbers are 9×14 and 9×19 because 14 and 19 are coprime; LCM=9×14×19=2394." }),
  observation({ q: 69, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Basic table — one category as percentage of another", representation: "TABLE_CATEGORY_PERCENTAGE_MCQ", notes: "The source table compares salesman counts in companies J and K by direct percentage." }),
  observation({ q: 70, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Similar triangles — perimeter and corresponding-side proportionality", representation: "SIMILAR_TRIANGLES_PERIMETER_SIDE_SCALE_MCQ", notes: "Corresponding sides scale as the perimeters: AB/DE=32/12, so AB=16 cm." }),
  observation({ q: 71, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Angle geometry — square joined to equilateral triangle", representation: "SQUARE_EQUILATERAL_COMPOSITE_ANGLE_MCQ", notes: "The figure combines 60° equilateral-triangle geometry with 90° square geometry to recover angle ADC." }),
  observation({ q: 72, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "Circle sector — clock hand swept area", representation: "CLOCK_HAND_SECTOR_AREA_MCQ", notes: "Four hours correspond to 120°. With radius 6 cm, sector area=(120/360)π×36=12π≈37.70 cm²." }),
  observation({ q: 73, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Transformed reciprocal value in a rational expression", representation: "RECIPROCAL_SUM_RATIONAL_EXPRESSION_MCQ", notes: "x+1/x=6 implies x²+1=6x. Then 2x²-5x+2=2(x²+1)-5x=7x, so the expression is 3/7." }),
  observation({ q: 74, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Consecutive running averages — recover first-to-last difference", representation: "RUNNING_AVERAGE_STEPWISE_MEMBER_DIFFERENCE_MCQ", notes: "With running averages r, r+2, r+4, r+6 and r+8, successive totals give member weights r, r+4, r+8, r+12 and r+16. The fifth member is therefore 16 kg heavier than the first." }),
  observation({ q: 75, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Two-item purchase with different profit rates", representation: "TWO_ITEM_DIFFERENT_PROFIT_RATE_COST_SPLIT_MCQ", notes: "Let table and chair costs sum to 3900. The profit equation 0.08T+0.16C=540 resolves the two costs and their difference." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper pages — SSC CGL Tier-I 13 Dec 2022 Shift 1",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2022-12-13",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2022_12_13_S1_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
