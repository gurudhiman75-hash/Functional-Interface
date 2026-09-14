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
  observation({ q: 51, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Identities and transformed values", representation: "SUM_PRODUCT_TO_DIFFERENCE_OF_CUBES_MCQ", notes: "The cube of the sum is 1728, so a+b=12. With ab=32, (a-b)^2=(a+b)^2-4ab=16, hence |a-b|=4 and the positive difference of cubes is 4×(144-32)=448." }),
  observation({ q: 52, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-004 — Polynomial operations and factorisation", representation: "RATIONAL_EXPRESSION_FACTOR_CANCEL_MCQ", notes: "Factor x^2-2x-63=(x-9)(x+7) and x^2+14x+49=(x+7)^2. Cancel one common factor to get (x-9)/(x+7), with x≠-7 retained as the domain restriction." }),
  observation({ q: 53, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — radical form from 1±cosθ", representation: "HALF_ANGLE_RADICAL_TO_COSEC_COT_MCQ", notes: "For the intended acute-angle branch, √((1+cosθ)/(1-cosθ))=(1+cosθ)/sinθ=cosecθ+cotθ." }),
  observation({ q: 54, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — combine selected sectors from a fixed total", representation: "PIE_TWO_SECTOR_TOTAL_COUNT_MCQ", notes: "The complete paper supplies a five-district pie chart for 136000 female employees and asks for the combined count in districts C and D; DI-005 owns pie-chart composition questions." }),
  observation({ q: 55, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Single discount versus successive discounts", representation: "SINGLE_VS_SUCCESSIVE_DISCOUNT_BILL_REVERSE_MCQ", notes: "Two successive 30% discounts give a 51% discount. The difference from a single 40% discount is 11% of the bill, and 11%=₹220, so the bill is ₹2000." }),
  observation({ q: 56, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal transformed values and identities", representation: "RECIPROCAL_SIXTH_POWER_FROM_SUM_MCQ", notes: "From y+1/y=4, obtain y^2+1/y^2=14 and y^3+1/y^3=52; therefore y^6+1/y^6=52^2-2=2702." }),
  observation({ q: 57, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Efficiency comparison and joint completion time", representation: "EFFICIENCY_PERCENT_TO_COMBINED_TIME_MCQ", notes: "B takes 20 days. A is 50% more efficient, so A:B efficiency is 3:2; their combined rate is 1/8 of the work per day and they finish in 8 days." }),
  observation({ q: 58, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-003 — Circles, arcs and sectors", representation: "SECTOR_AREA_FROM_RADIUS_ARC_LENGTH_MCQ", notes: "Sector area is one-half × radius × arc length, so 1/2×8×12=48 square units." }),
  observation({ q: 59, packageId: "PCT-005", topic: "Arithmetic — Percentage", subtopic: "Successive percentage change — reverse original value", representation: "SUCCESSIVE_DECREASE_INCREASE_REVERSE_BASE_MCQ", notes: "A 10% decrease followed by a 20% increase multiplies the original value by 0.9×1.2=1.08. Since the final cost is ₹540, the original cost is ₹500." }),
  observation({ q: 60, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — cylinder curved surface area and volume", representation: "CYLINDER_CSA_TO_VOLUME_MCQ", notes: "2πrh=2640 with h=12 and π=22/7 gives r=35. Then volume πr^2h=46200 cubic units." }),
  observation({ q: 61, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "BODMAS — nested brackets with 'of'", representation: "BODMAS_OF_NESTED_BRACKETS_MCQ", notes: "Apply 'of' before addition/subtraction, then work from the innermost bracket outward. The expression evaluates to 30; this is a simplification contract rather than a Number System divisibility/remainder contract." }),
  observation({ q: 62, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Fourth proportional", representation: "FOURTH_PROPORTIONAL_MCQ", notes: "For 8:32=13:x, x=32×13/8=52." }),
  observation({ q: 63, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — rate from amount after a fixed time", representation: "SIMPLE_INTEREST_RATE_FROM_AMOUNT_MCQ", notes: "Interest is ₹10200-₹9000=₹1200. Rate=1200×100/(9000×4)=10/3%=3⅓% per annum." }),
  observation({ q: 64, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-005 — Remainder and Factor Theorem", representation: "REMAINDER_THEOREM_X_PLUS_ONE_MCQ", notes: "For f(x)=x^17+1 divided by x+1, the remainder is f(-1)=(-1)^17+1=0." }),
  observation({ q: 65, packageId: "TSD-002", topic: "Arithmetic — Time, Speed & Distance", subtopic: "TSD-CP-009 — Boats, streams and one-dimensional medium motion", representation: "UPSTREAM_DOWNSTREAM_TIME_TO_BOAT_CURRENT_RATIO_MCQ", notes: "For equal distance, upstream:downstream speeds are 7:10. Thus boat speed:current speed=(10+7):(10-7)=17:3." }),
  observation({ q: 66, packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Weighted mixture price — recover an unknown component price", representation: "THREE_VARIETY_WEIGHTED_PRICE_MCQ", notes: "With prices ₹35, ₹38 and ₹x mixed in ratio 2:1:2 to average ₹42, (70+38+2x)/5=42 gives x=51." }),
  observation({ q: 67, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — direct common tangent between externally touching circles", representation: "EXTERNALLY_TOUCHING_CIRCLES_COMMON_TANGENT_MCQ", notes: "For radii 6 and 3, centre distance is 9. Direct common tangent length is √(9^2-(6-3)^2)=6√2." }),
  observation({ q: 68, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — mixed standard-angle expression", representation: "TRIG_STANDARD_ANGLES_COMPOSITE_VALUE_MCQ", notes: "Substitute cos60=1/2, tan30=1/√3, cos0=1, cos^2 45=1/2 and sin^2 60=3/4. The expression evaluates to 5/2." }),
  observation({ q: 69, packageId: "TSD-002", topic: "Arithmetic — Time, Speed & Distance", subtopic: "TSD-CP-009 — Boats, streams and one-dimensional medium motion", representation: "UPSTREAM_DOWNSTREAM_SPEED_TO_STREAM_SPEED_MCQ", notes: "Current speed is half the difference between downstream and upstream speeds: (20.8-15.2)/2=2.8 km/h." }),
  observation({ q: 70, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Men/women equivalent work rates", representation: "MEN_WOMEN_INDIVIDUAL_EQUIVALENT_WORK_RATE_MCQ", notes: "2 men finish in 6 days, so one man's rate is 1/12. 3 women finish in 4 days, so one woman's rate is also 1/12. One man plus two women work at 1/4 per day and need 4 days." }),
  observation({ q: 71, packageId: "PCT-005", topic: "Arithmetic — Percentage", subtopic: "Successive percentage change — equal rise and fall", representation: "EQUAL_PERCENT_INCREASE_DECREASE_NET_CHANGE_MCQ", notes: "A 30% increase followed by a 30% decrease multiplies the original by 1.3×0.7=0.91, so the net result is a 9% decrease." }),
  observation({ q: 72, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric angle addition from a squared ratio", representation: "COS_SQUARE_TO_ANGLE_ADDITION_SINE_MCQ", notes: "For acute θ, cos^2θ=3/4 gives cosθ=√3/2 and θ=30°. Therefore sin(θ+30°)=sin60°=√3/2." }),
  observation({ q: 73, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Recover individual worker time from pair time", representation: "COMBINED_WORK_TO_SECOND_WORKER_TIME_MCQ", notes: "A's rate is 1/14 and A+B rate is 1/3.5=2/7=4/14. B's rate is therefore 3/14, so B alone takes 14/3 days." }),
  observation({ q: 74, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — normalized sum/difference squares", representation: "SCALED_SIN_COS_SUM_DIFFERENCE_SQUARE_IDENTITY_MCQ", notes: "r^2/15^2+s^2/16^2=(sinθ+cosθ)^2+(sinθ-cosθ)^2=2." }),
  observation({ q: 75, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Linked table — subgroup percentage and gender ratio", representation: "TABLE_POVERTY_PERCENT_FEMALE_SHARE_COUNT_MCQ", notes: "Use State B's below-poverty percentage on the total population 7200, then apply the female share from the male:female ratio within the below-poverty subgroup; DI-001 owns this linked-table composition." }),
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
