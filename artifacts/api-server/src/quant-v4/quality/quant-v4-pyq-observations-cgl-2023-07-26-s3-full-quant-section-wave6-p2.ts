import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_AUTHORITY =
  "QUANT-V4-CGL-2023-07-26-S3-FULL-QUANT-SECTION-WAVE6-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-tier-1-26th-july-2023-shift-3-question-paper-solved";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-26-S3";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-26-S3-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2023, held 26 Jul 2023 Shift 3, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-26",
    shift: "Shift 3",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-26-S3-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Direct proportion — corresponding height and shadow scaling", representation: "DIRECT_PROPORTION_SHADOW_STOREY_COUNT_MCQ", notes: "Under the same sun angle, building height/storeys scale with shadow length. Required storeys = 7*(48/28)=12." }),
  observation({ q: 52, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Changing workforce — convert men/women efficiencies and complete after a mid-workforce change", representation: "MEN_WOMEN_MIDWORKFORCE_CHANGE_MCQ", notes: "6 men*8 days = 10 women*16 days, so 1 woman = 0.3 man. Twelve men do half the work in 2 days; the remaining 24 man-days at 6 men + 5 women = 7.5 men takes 16/5 days, total 26/5 days." }),
  observation({ q: 53, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — present worth of a future amount", representation: "SIMPLE_INTEREST_PRESENT_WORTH_MCQ", notes: "If present worth is P, then P(1+0.05*2)=1100, hence P=1000." }),
  observation({ q: 54, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — derive cos²x+sec²x from cosx+secx", representation: "COS_SEC_SUM_TO_SQUARE_SUM_MCQ", notes: "Squaring cosx+secx=7/(2sqrt3) gives cos²x+sec²x+2=49/12, hence cos²x+sec²x=25/12." }),
  observation({ q: 55, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — double-angle numerator over Pythagorean denominator", representation: "TRIG_DOUBLE_ANGLE_OVER_IDENTITY_MCQ", notes: "cos²15°-sin²15°=cos30°=sqrt3/2 and cos²145°+sin²145°=1, so the value is sqrt3/2." }),
  observation({ q: 56, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-001 — Triangle measurement systems", representation: "EQUILATERAL_TRIANGLE_AREA_FROM_SIDE_MCQ", notes: "Area=(sqrt3/4)*16²=64sqrt3 cm²." }),
  observation({ q: 57, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Remainder theorem — reduce a modulus when one divisor is a multiple of another", representation: "REMAINDER_MODULUS_REDUCTION_MCQ", notes: "N=45k+21=15(3k+1)+6, so division by 15 leaves remainder 6." }),
  observation({ q: 58, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratio substitution — rational expression from tan A", representation: "TAN_GIVEN_LINEAR_SIN_COS_RATIO_MCQ", notes: "Divide numerator and denominator by cosA: (3tanA+2)/(3tanA-2). With tanA=3/8 this is (25/8)/(-7/8)=-25/7." }),
  observation({ q: 59, packageId: "TSD-002", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Train motion — moving train crossing a stationary train", representation: "TRAIN_CROSSES_STATIONARY_TRAIN_MCQ", notes: "Distance covered is 108+148=256 m. Speed 128 km/h = 320/9 m/s, so time=256*9/320=7.2 s." }),
  observation({ q: 60, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "BODMAS simplification with fractional multiplication and division", representation: "BODMAS_FRACTION_CHAIN_MCQ", notes: "(5/6)*(4/5) divided by (4/3)=1/2, hence 2/3-1/2+1/2=2/3." }),
  observation({ q: 61, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric periodicity — reduce large-angle tan and cot", representation: "LARGE_ANGLE_TAN_COT_PERIODICITY_MCQ", notes: "tan4384°=tan64°. cot6814°=cot154°=-cot26°=-tan64°, so the sum is 0." }),
  observation({ q: 62, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Marked price and discount — recover profit percentage from markup and selling-price fraction", representation: "MARKUP_AND_MP_FRACTION_TO_PROFIT_MCQ", notes: "Take CP=100, MP=140. SP=73.5% of 140=102.9, hence profit=2.9%." }),
  observation({ q: 63, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — selected sectors relative to another sector", representation: "PIE_SELECTED_SECTORS_TO_SINGLE_SECTOR_PERCENT_MCQ", notes: "Pie shares are A+B+C=56% and D=44%; required percentage=(56/44)*100=127.27%." }),
  observation({ q: 64, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle angle system — classify triangle after solving linear angle constraints", representation: "TRIANGLE_ANGLE_LINEAR_SYSTEM_CLASSIFICATION_MCQ", notes: "x+2y+10=180 and x-2y=10 give x=90°, so ABC is right-angled." }),
  observation({ q: 65, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Alternating assistance — primary worker daily with helpers every second day", representation: "EVERY_SECOND_DAY_ASSISTED_WORK_MCQ", notes: "Using 60 work units, X=12/day, Y=4/day, Z=2/day. Two-day work is 12+(12+4+2)=30 units, so 60 units finish in 4 days." }),
  observation({ q: 66, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Profit percentage — price difference between two profit rates", representation: "PROFIT_RATE_DIFFERENCE_TO_COST_PRICE_MCQ", notes: "The extra ₹20 represents 15%-10%=5% of cost price, so CP=20/0.05=₹400." }),
  observation({ q: 67, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Combined work — two workers with known individual completion times", representation: "TWO_WORKER_COMBINED_TIME_MCQ", notes: "Combined time=1/(1/9+1/6)=18/5=3 3/5 days." }),
  observation({ q: 68, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Average speed — aggregate unequal distance/time legs", representation: "MULTI_LEG_AVERAGE_SPEED_MCQ", notes: "Total distance=45 km and total time=120/60+150/60=4.5 h, so average speed=10 km/h." }),
  observation({ q: 69, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Reciprocal algebra — eighth-power difference from x+1/x", representation: "RECIPROCAL_EIGHTH_POWER_DIFFERENCE_MCQ", notes: "x+1/x=sqrt6 and x>1 give x-1/x=sqrt2. Then x²+1/x²=4 and x²-1/x²=2sqrt3; x⁴-1/x⁴=8sqrt3 and x⁴+1/x⁴=14, hence x⁸-1/x⁸=112sqrt3." }),
  observation({ q: 70, packageId: "PCT-007", topic: "Arithmetic — Percentage", subtopic: "Mixed percentage application — nested shares and savings to recover income", representation: "NESTED_PERCENT_SHARE_SAVING_INCOME_MCQ", notes: "Both sons receive 8% of income in total; elder receives 85% of that and saves 10%. Thus 0.08*0.85*0.10*income=17, giving income ₹2500." }),
  observation({ q: 71, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar chart — percentage increase between two years", representation: "BAR_CHART_TWO_YEAR_PERCENT_INCREASE_MCQ", notes: "Maize production rises from 20 (2017) to 65 (2019) thousand tonnes; percentage increase=(45/20)*100=225%." }),
  observation({ q: 72, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "MEN-CP-007 — Cubes, cuboids and prisms", representation: "CUBE_TOTAL_SURFACE_AREA_MCQ", notes: "Total surface area=6a²=6*12²=864 cm²." }),
  observation({ q: 73, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — sum of cubes via (a+b)(a²-ab+b²)", representation: "SUM_OF_CUBES_IDENTITY_NUMERIC_MCQ", notes: "The expression is (5/b+5b)(25/b²-25+25b²)=125/b³+125b³. With b=5 this is 1+15625=15626." }),
  observation({ q: 74, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Reciprocal algebra — fourth-power sum from x−1/x", representation: "RECIPROCAL_FOURTH_POWER_SUM_MCQ", notes: "The Cracku HTML drops the minus glyph in the premise; independent reproductions of this exact SSC CGL 26 Jul 2023 Shift 3 item preserve x−1/x=10. Then x²+1/x²=102 and x⁴+1/x⁴=102²−2=10402." }),
  observation({ q: 75, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Alternating work — order invariance when all worker efficiencies are equal", representation: "EQUAL_EFFICIENCY_ALTERNATING_ORDER_MCQ", notes: "A, B and C have equal efficiencies, so changing the alternating order does not change the completion time: 15 days." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 26 Jul 2023 Shift 3",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-26",
  shift: "Shift 3",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_07_26_S3_FULL_QUANT_SECTION_WAVE6_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
