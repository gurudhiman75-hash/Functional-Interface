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
  observation({ q: 51, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — cube edge from space diagonal", representation: "CUBE_SPACE_DIAGONAL_TO_VOLUME_MCQ", notes: "The longest diagonal is a√3=7√3, so edge a=7 and volume is 343 cm³." }),
  observation({ q: 52, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-004 — Structured products and factorisation", representation: "MEAN_PROPORTIONAL_FACTORED_ALGEBRA_MCQ", notes: "The product of the two expressions is (a+b)^4(a-b)^4, so the mean proportional is (a+b)^2(a-b)^2=(a²-b²)² under the intended principal-root interpretation." }),
  observation({ q: 53, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Variable workforce with fixed daily attrition", representation: "DAILY_WORKER_DROPOUT_PROJECT_TIME_MCQ", notes: "If the initial strength is n, planned work is 10n student-days. Actual work is n+(n-2)+...+(n-28)=15(n-14). Equating gives n=42." }),
  observation({ q: 54, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Men-days inverse proportion", representation: "MEN_DAYS_REQUIRED_WORKERS_MCQ", notes: "4×18=72 man-days. Completing the same work in 12 days needs 6 men, so 2 additional men are required." }),
  observation({ q: 55, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric standard-angle equation", representation: "COS_ANGLE_EQUALS_SIN_STANDARD_ANGLE_MCQ", notes: "sin30°=cos60°. On the intended acute branch, 40°+x=60°, so x=20°." }),
  observation({ q: 56, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Circular track — opposite-direction meeting followed by speed exchange", representation: "CIRCULAR_TRACK_MEET_SWAP_SPEED_RETURN_MCQ", notes: "They first meet after 500/(6+10)=31.25 s. P has covered 187.5 m and Q 312.5 m. After swapping speeds, P covers the remaining 312.5 m at 10 m/s and Q the remaining 187.5 m at 6 m/s, so both return together." }),
  observation({ q: 57, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — cuboid surface area reshaped into a square", representation: "CUBOID_TSA_TO_EQUAL_AREA_SQUARE_SIDE_MCQ", notes: "Paper area is 2(4×6+6×8+8×4)=208 square units. The square side is √208≈14.42 units." }),
  observation({ q: 58, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — split principal across two rates", representation: "TWO_RATE_SIMPLE_INTEREST_SPLIT_PRINCIPAL_MCQ", notes: "If x is deposited at 12%, then 0.12x+0.08(50000-x)=5200, giving x=30000." }),
  observation({ q: 59, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — average one expenditure head across years", representation: "TABLE_MULTIYEAR_CATEGORY_AVERAGE_MCQ", notes: "The paper supplies a four-year company-expenditure table and asks for the average annual salary expenditure." }),
  observation({ q: 60, packageId: "PCT-005", topic: "Arithmetic — Percentage", subtopic: "Successive percentage change — reverse chained comparison", representation: "CHAINED_PERCENT_MORE_REVERSE_BASE_MCQ", notes: "Tarun's area is 110% of Basab's and Nakul's is 140% of Tarun's, so Nakul is 154% of Basab. Therefore Basab's area is 2695/1.54=1750 sq ft." }),
  observation({ q: 61, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-004 — Factorisation and cancellation of a rational expression", representation: "RATIONAL_EXPRESSION_FACTOR_CANCEL_MCQ", notes: "Factor the numerator as (s+t-u)(s+t+u) and denominator as (s-t-u)(s+t+u). The stated non-zero common factor cancels, leaving (s+t-u)/(s-t-u). This is expression factorisation, not rational-equation solving." }),
  observation({ q: 62, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — cosecant minus sine", representation: "COSEC_MINUS_SIN_IDENTITY_MCQ", notes: "1/sinθ-sinθ=(1-sin²θ)/sinθ=cos²θ/sinθ=cosθ·cotθ." }),
  observation({ q: 63, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Bulk purchase with split selling prices", representation: "BULK_PURCHASE_SPLIT_SALES_GAIN_PERCENT_MCQ", notes: "₹120 per dozen means ₹10 per mango, so total cost is ₹16000. Sales are 900×15+700×14=₹23300, giving a gain of 45.625%." }),
  observation({ q: 64, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Delayed pursuit — residual gap after a chase interval", representation: "CHASE_DELAY_RESIDUAL_GAP_SPEED_AND_CATCH_POINT_MCQ", notes: "The thief gets a 4-minute head start, covering 1 km. After 16 minutes of pursuit the thief is 5 km from the start and the policeman is 4.8 km away, so the policeman's speed is 18 km/h. The remaining 0.2 km closes in 4 more minutes; catch point is 6 km." }),
  observation({ q: 65, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — common tangent geometry with unequal radii", representation: "TWO_CIRCLES_COMMON_TANGENT_UNKNOWN_RADIUS_DIAGRAM_MCQ", notes: "The diagram constrains two circles tangent to a common line. The relevant centre-to-centre and perpendicular-radius geometry determines the unknown radius." }),
  observation({ q: 66, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — central angle and inscribed angle", representation: "DIAMETER_CENTRAL_ANGLE_TO_INSCRIBED_ANGLE_MCQ", notes: "PQ is a diameter. With central angle QOR=100°, the corresponding remaining semicircular arc PR is 80°, so the inscribed angle PSR is 40°." }),
  observation({ q: 67, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Cubic identity from a linear combination and sum of squares", representation: "SIGNED_THREE_TERM_CUBIC_IDENTITY_MCQ", notes: "Treat the third term as -c. Since a+b-c=20 and a²+b²+c²=152, ab-ac-bc=(400-152)/2=124. Then a³+b³-c³+3abc=20(152-124)=560." }),
  observation({ q: 68, packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Dilution — add water while solute remains fixed", representation: "ADD_WATER_REVISED_CONCENTRATION_MCQ", notes: "Alcohol remains 25% of 40=10 litres. Total volume becomes 50 litres, so alcohol becomes 20% of the mixture." }),
  observation({ q: 69, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar chart — average across a multi-year interval", representation: "BAR_CHART_MULTIYEAR_AVERAGE_MCQ", notes: "The paper supplies annual FDI bars and asks for the average over 1992-1997; DI-003 owns bar-chart interpretation." }),
  observation({ q: 70, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Discount — rate from marked and selling prices", representation: "MARKED_PRICE_SELLING_PRICE_DISCOUNT_PERCENT_MCQ", notes: "Discount is ₹15990-₹12792=₹3198. Therefore the discount rate is 3198/15990×100=20%." }),
  observation({ q: 71, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-001 — Nested algebraic bracket simplification", representation: "NESTED_ALGEBRAIC_BRACKET_SIMPLIFICATION_MCQ", notes: "8p-(4q-10p)=18p-4q; then 3q-(18p-4q)=7q-18p; finally -7p-(7q-18p)=11p-7q." }),
  observation({ q: 72, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "TMW-CP-002 — Men/women equivalent work rates", representation: "MEN_WOMEN_COMBINED_RATE_TO_SINGLE_MAN_TIME_MCQ", notes: "One woman's rate is 1/150. Twenty women contribute 2/15 per day; the full group contributes 1/6, so 15 men contribute 1/30. One man's rate is 1/450, hence 450 days." }),
  observation({ q: 73, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Right triangle — incircle radius relation", representation: "RIGHT_TRIANGLE_INRADIUS_ONE_LEG_UNKNOWN_LEG_MCQ", notes: "For a right triangle r=(a+b-c)/2. With r=4 and one leg 12, c=b+4. Using c²=12²+b² gives b=16." }),
  observation({ q: 74, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — combined tests for 44", representation: "DIVISIBILITY_BY_44_OPTION_FILTER_MCQ", notes: "44=4×11, so the valid option must pass both divisibility by 4 and the alternating-sum test for 11; 54736 is divisible by 44." }),
  observation({ q: 75, packageId: "SRI-002", topic: "Arithmetic — Number System", subtopic: "Surds, radicals and rationalisation — binomial conjugate", representation: "RATIONALISE_BINOMIAL_SURD_FRACTION_MCQ", notes: "With x=2 and y=3, multiply (√2-√3)/(√2+√3) by the conjugate. This gives (5-2√6)/(2-3)=2√6-5." }),
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
