import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_AUTHORITY =
  "QUANT-V4-CGL-2023-07-25-S3-FULL-QUANT-SECTION-WAVE7-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-tier-1-25th-july-2023-shift-3-question-paper-solved";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-25-S3";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-25-S3-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2023, held 25 Jul 2023 Shift 3, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-25",
    shift: "Shift 3",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-25-S3-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — difference of cubes from sum and product", representation: "TWO_NUMBER_SUM_PRODUCT_DIFFERENCE_OF_CUBES_MCQ", notes: "The cube of the sum is 1728, so a+b=12. With ab=32, use a^3-b^3=(a-b)((a+b)^2-ab) after recovering |a-b| from (a+b)^2-4ab=16; the positive difference is 448." }),
  observation({ q: 52, packageId: "ALG-002", topic: "Advanced Mathematics", subtopic: "ALG-CP-008 — Algebraic fractions and factor cancellation", representation: "RATIONAL_EXPRESSION_FACTOR_AND_CANCEL_MCQ", notes: "Factor x^2-2x-63=(x-9)(x+7) and x^2+14x+49=(x+7)^2, then cancel one common factor subject to x≠-7." }),
  observation({ q: 53, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — half-angle square-root form", representation: "SQRT_ONE_PLUS_COS_OVER_ONE_MINUS_COS_MCQ", notes: "Using 1+cosθ=2cos²(θ/2) and 1-cosθ=2sin²(θ/2), the expression is cot(θ/2)=cosecθ+cotθ for the intended acute-angle branch." }),
  observation({ q: 54, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — combine two sectors from a fixed total", representation: "PIE_TWO_SECTOR_TOTAL_FROM_PERCENT_SHARES_MCQ", notes: "The complete paper supplies a five-district pie chart and asks the combined female-employee count in districts C and D from a total of 136000." }),
  observation({ q: 55, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Single discount versus successive discounts", representation: "SINGLE_VS_SUCCESSIVE_DISCOUNT_DIFFERENCE_REVERSE_BILL_MCQ", notes: "A 40% single discount leaves 60% of the bill, while two 30% discounts leave 49%; their 11-point difference equals ₹220, so the bill is ₹2000." }),
  observation({ q: 56, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal transformed values and identities", representation: "RECIPROCAL_SIXTH_POWER_FROM_SUM_MCQ", notes: "From y+1/y=4, build y²+1/y²=14, y³+1/y³=52, then y⁶+1/y⁶=52²-2=2702." }),
  observation({ q: 57, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Efficiency comparison and joint completion time", representation: "EFFICIENCY_PERCENT_MORE_JOINT_TIME_MCQ", notes: "If A is 50% more efficient than B and B takes 20 days, their rates are in ratio 3:2; together they complete the work in 8 days." }),
  observation({ q: 58, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-003 — Circles, arcs and sectors", representation: "SECTOR_AREA_FROM_RADIUS_AND_ARC_LENGTH_MCQ", notes: "Sector area equals one-half radius times arc length, so 1/2×8×12=48 cm²." }),
  observation({ q: 59, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Successive percentage change — reverse original value", representation: "DECREASE_THEN_INCREASE_REVERSE_ORIGINAL_VALUE_MCQ", notes: "A 10% decrease followed by a 20% increase multiplies the original by 0.9×1.2=1.08. Final ₹540 therefore corresponds to original ₹500." }),
  observation({ q: 60, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Cylinder measurement — recover radius from curved surface area, then volume", representation: "CYLINDER_CSA_HEIGHT_TO_VOLUME_MCQ", notes: "2πrh=2640 with h=12 and π=22/7 gives r=35; volume πr²h=46200 cm³." }),
  observation({ q: 61, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Order of operations with nested brackets and 'of'", representation: "BODMAS_NESTED_BRACKETS_OF_MCQ", notes: "Evaluate 6 of 2 first, then work outward through parentheses, braces and brackets before the final subtraction." }),
  observation({ q: 62, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Fourth proportional", representation: "DIRECT_FOURTH_PROPORTIONAL_MCQ", notes: "For 8:32=13:x, x=32×13/8=52." }),
  observation({ q: 63, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — recover annual rate from amount", representation: "SIMPLE_INTEREST_AMOUNT_TO_RATE_MCQ", notes: "Interest is ₹1200 on ₹9000 over 4 years, so r=1200×100/(9000×4)=10/3%=3⅓%." }),
  observation({ q: 64, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebra — Remainder theorem", representation: "X_POWER_PLUS_ONE_DIVIDED_BY_X_PLUS_ONE_MCQ", notes: "By the remainder theorem, set x=-1: (-1)^17+1=0." }),
  observation({ q: 65, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Boats and streams — speed ratio from equal-distance upstream/downstream times", representation: "BOAT_STREAM_RATIO_FROM_EQUAL_DISTANCE_TIMES_MCQ", notes: "For equal distance, upstream:downstream speeds are 7:10. Thus boat speed:stream speed=(10+7):(10-7)=17:3." }),
  observation({ q: 66, packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Weighted mixture price — recover unknown component price", representation: "THREE_COMPONENT_WEIGHTED_MEAN_UNKNOWN_PRICE_MCQ", notes: "With prices 35, 38 and x mixed in ratio 2:1:2 to mean 42, solve (70+38+2x)/5=42 to get x=51." }),
  observation({ q: 67, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — common tangent between externally touching circles", representation: "EXTERNALLY_TOUCHING_CIRCLES_COMMON_TANGENT_MCQ", notes: "For radii 6 and 3, centre distance is 9. Direct common tangent length is √(9²-(6-3)²)=6√2." }),
  observation({ q: 68, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — mixed standard-angle expression", representation: "STANDARD_ANGLE_MIXED_TRIG_EXPRESSION_MCQ", notes: "Substitute cos60=1/2, tan30=1/√3, cos0=1, cos²45=1/2 and sin²60=3/4; the value is 2.5." }),
  observation({ q: 69, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Boats and streams — recover stream speed from upstream/downstream speeds", representation: "BOAT_STREAM_SPEED_FROM_UP_DOWN_SPEEDS_MCQ", notes: "Stream speed is half the difference: (20.8-15.2)/2=2.8 km/h." }),
  observation({ q: 70, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Men/women equivalent work rates", representation: "MEN_WOMEN_EQUIVALENT_RATES_JOINT_TIME_MCQ", notes: "2 men finish in 6 days, so one man's rate is 1/12. 3 women finish in 4 days, so one woman's rate is 1/12. One man plus two women work at 1/4 per day and need 4 days." }),
  observation({ q: 71, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Successive equal increase and decrease", representation: "EQUAL_PERCENT_INCREASE_DECREASE_NET_CHANGE_MCQ", notes: "A 30% rise then 30% fall multiplies income by 1.3×0.7=0.91, a net 9% decrease." }),
  observation({ q: 72, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric angle addition from a squared ratio", representation: "COS_SQUARED_TO_SIN_ANGLE_PLUS_STANDARD_ANGLE_MCQ", notes: "Acute θ with cos²θ=3/4 gives cosθ=√3/2 and sinθ=1/2, hence θ=30° and sin(θ+30°)=sin60°=√3/2." }),
  observation({ q: 73, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Recover individual worker time from pair time", representation: "PAIR_TIME_AND_ONE_WORKER_TO_OTHER_TIME_MCQ", notes: "A's rate is 1/14 and A+B rate is 2/7; B's rate is 3/14, so B alone takes 14/3 days." }),
  observation({ q: 74, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — normalized sum/difference squares", representation: "SCALED_SIN_COS_SUM_DIFFERENCE_SQUARE_IDENTITY_MCQ", notes: "r²/15²+s²/16²=(sinθ+cosθ)²+(sinθ-cosθ)²=2." }),
  observation({ q: 75, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Linked table — population share and gender ratio within a subgroup", representation: "TABLE_PERCENT_SUBGROUP_GENDER_RATIO_COUNT_MCQ", notes: "The table gives State B's below-poverty percentage and male:female ratio; apply the subgroup percentage to 7200, then allocate the female share from that subgroup." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 25 Jul 2023 Shift 3",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-25",
  shift: "Shift 3",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_07_25_S3_FULL_QUANT_SECTION_WAVE7_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
