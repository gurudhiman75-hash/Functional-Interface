import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_AUTHORITY =
  "QUANT-V4-CGL-2023-07-25-S4-FULL-QUANT-SECTION-WAVE8-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-tier-1-25th-july-2023-shift-4-question-paper-solved";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-25-S4";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-25-S4-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2023, held 25 Jul 2023 Shift 4, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-25",
    shift: "Shift 4",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-25-S4-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Cube — recover edge from space diagonal and find volume", representation: "CUBE_SPACE_DIAGONAL_TO_VOLUME_MCQ", notes: "The longest diagonal is a√3=7√3, so edge a=7 and volume is 343 cm³." }),
  observation({ q: 52, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic products — mean proportional of structured expressions", representation: "MEAN_PROPORTIONAL_FACTORED_ALGEBRA_MCQ", notes: "The geometric mean of (a+b)(a-b)^3 and (a+b)^3(a-b) is (a+b)^2(a-b)^2=(a²-b²)² under the intended positive-root interpretation." }),
  observation({ q: 53, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Variable workforce — fixed number of workers leave each day", representation: "DAILY_WORKER_DROPOUT_PROJECT_TIME_MCQ", notes: "Equate the planned work 10n to the actual sum of daily workforce over 15 days when two students drop out each day; solve for the starting strength." }),
  observation({ q: 54, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Men-days inverse proportion", representation: "MEN_DAYS_REQUIRED_WORKERS_MCQ", notes: "4×18=72 man-days. Completing in 12 days needs 6 men, so 2 additional men are required." }),
  observation({ q: 55, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric complementary-angle equation", representation: "COS_ANGLE_EQUALS_SIN_STANDARD_ANGLE_MCQ", notes: "sin30°=cos60°, hence 40°+x=60° for the intended acute solution and x=20°." }),
  observation({ q: 56, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Circular track — opposite-direction meeting followed by speed exchange", representation: "CIRCULAR_TRACK_MEET_SWAP_SPEED_RETURN_MCQ", notes: "They first meet after 500/(6+10)=31.25 s. The distances then swap as remaining arcs after the speed exchange, yielding equal return times to the start." }),
  observation({ q: 57, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Cuboid surface area reshaped into square", representation: "CUBOID_TSA_TO_EQUAL_AREA_SQUARE_SIDE_MCQ", notes: "Paper area is 2(4×6+6×8+8×4)=208 square units; the square side is √208≈14.42." }),
  observation({ q: 58, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — split investment across two rates", representation: "TWO_RATE_SIMPLE_INTEREST_SPLIT_PRINCIPAL_MCQ", notes: "If x is at 12%, then 0.12x+0.08(50000-x)=5200, giving x=30000." }),
  observation({ q: 59, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — average one expenditure head across years", representation: "TABLE_ROW_OR_COLUMN_MULTIYEAR_AVERAGE_MCQ", notes: "The paper supplies a four-year company-expenditure table and asks the average annual salary expenditure." }),
  observation({ q: 60, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Successive percentage comparison — reverse base value", representation: "CHAINED_PERCENT_MORE_REVERSE_BASE_MCQ", notes: "Tarun is 110% of Basab and Nakul is 140% of Tarun, so Nakul is 154% of Basab; 2695/1.54=1750." }),
  observation({ q: 61, packageId: "ALG-002", topic: "Advanced Mathematics", subtopic: "Algebraic fractions — factor numerator and denominator", representation: "RATIONAL_EXPRESSION_DIFFERENCE_OF_SQUARES_FACTOR_MCQ", notes: "Factor numerator as (s+t-u)(s+t+u) and denominator as (s-t-u)(s+t+u); cancel the stated nonzero common factor." }),
  observation({ q: 62, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — transform cosecant minus sine", representation: "COSEC_MINUS_SIN_IDENTITY_MCQ", notes: "1/sinθ-sinθ=(1-sin²θ)/sinθ=cos²θ/sinθ=cosθ·cotθ." }),
  observation({ q: 63, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Mixed selling prices after common per-unit purchase cost", representation: "BULK_PURCHASE_SPLIT_SALES_GAIN_PERCENT_MCQ", notes: "₹120 per dozen means ₹10 per mango, so CP=₹16000. Sales are 900×15+700×14=₹23300, giving 45.625% gain." }),
  observation({ q: 64, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Delayed pursuit — residual gap after a chase interval", representation: "CHASE_DELAY_RESIDUAL_GAP_SPEED_AND_CATCH_POINT_MCQ", notes: "Use the thief's four-minute head start plus the remaining 200 m gap after 16 minutes to infer relative speed, then extend to catch distance." }),
  observation({ q: 65, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — common tangent geometry with unequal radii", representation: "TWO_CIRCLES_COMMON_TANGENT_UNKNOWN_RADIUS_DIAGRAM_MCQ", notes: "The diagram constrains two tangent circles against the same line; apply the right-triangle relation formed by centres, perpendicular radii and tangent separation." }),
  observation({ q: 66, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circle theorem — central angle and inscribed angle", representation: "DIAMETER_CENTRAL_ANGLE_TO_INSCRIBED_ANGLE_MCQ", notes: "With PQ a diameter and ∠QOR=100°, arc PR on the relevant side is 80°; the corresponding inscribed angle is 40°." }),
  observation({ q: 67, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identity — cubic expression from linear combination and squares", representation: "A_PLUS_B_MINUS_C_CUBIC_IDENTITY_MCQ", notes: "Use x=a+b and the identity a³+b³-c³+3abc=(a+b-c)(a²+b²+c²+ab-ac-bc), then derive the mixed-term bracket from (a+b-c)²." }),
  observation({ q: 68, packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Dilution — add water while solute quantity stays fixed", representation: "ADD_WATER_REVISED_CONCENTRATION_MCQ", notes: "Alcohol remains 25% of 40=10 litres. Total volume becomes 50 litres, so the new concentration is 20%." }),
  observation({ q: 69, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar chart — average across a multi-year interval", representation: "BAR_CHART_MULTIYEAR_AVERAGE_MCQ", notes: "The paper supplies annual FDI bars and asks for the average over 1992-1997." }),
  observation({ q: 70, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Discount — rate from marked and selling prices", representation: "MARKED_PRICE_SELLING_PRICE_DISCOUNT_PERCENT_MCQ", notes: "Discount is 15990-12792=3198; 3198/15990×100=20%." }),
  observation({ q: 71, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic simplification — nested brackets with variables", representation: "NESTED_ALGEBRAIC_BRACKET_SIMPLIFICATION_MCQ", notes: "Expand from the innermost bracket and combine p- and q-terms carefully to reach the equivalent linear expression." }),
  observation({ q: 72, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Men/women work-rate equivalence", representation: "MEN_WOMEN_COMBINED_RATE_TO_SINGLE_MAN_TIME_MCQ", notes: "One woman's rate is 1/150. The combined rate of 20 women and 15 men is 1/6; subtract the women's contribution and divide by 15 to get one man's rate." }),
  observation({ q: 73, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Right triangle — incircle radius relation", representation: "RIGHT_TRIANGLE_INRADIUS_ONE_LEG_UNKNOWN_LEG_MCQ", notes: "For a right triangle, r=(a+b-c)/2. With r=4 and one leg 12, combine 12+b-c=8 with c²=12²+b² to solve the other leg." }),
  observation({ q: 74, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — test divisibility by 44", representation: "DIVISIBILITY_BY_44_OPTION_FILTER_MCQ", notes: "44=4×11, so a valid option must satisfy both divisibility by 4 and the alternating-sum test for 11." }),
  observation({ q: 75, packageId: "SRI-002", topic: "Number System", subtopic: "Surds, radicals and rationalisation — conjugate denominator", representation: "RATIONALISE_BINOMIAL_SURD_FRACTION_MCQ", notes: "Substitute x=2,y=3 and multiply (√2-√3)/(√2+√3) by the conjugate. The result simplifies to 5-2√6." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 25 Jul 2023 Shift 4",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-25",
  shift: "Shift 4",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_07_25_S4_FULL_QUANT_SECTION_WAVE8_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: true,
  productionPromotionAuthorized: false,
} as const);
