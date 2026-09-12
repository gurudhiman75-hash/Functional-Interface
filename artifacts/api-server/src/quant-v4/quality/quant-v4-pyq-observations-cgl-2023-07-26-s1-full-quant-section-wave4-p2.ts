import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_AUTHORITY =
  "QUANT-V4-CGL-2023-07-26-S1-FULL-QUANT-SECTION-WAVE4-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-tier-1-26th-july-2023-shift-1-question-paper-solved";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-26-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-26-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2023, held 26 Jul 2023 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-26",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-26-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Replacement and dilution — draw mixture and replace with water to reach a target component ratio", representation: "MIXTURE_REPLACEMENT_TARGET_RATIO_MCQ", notes: "Initial water:syrup is 5:11. If fraction f is drawn off and replaced by water, syrup becomes 11(1-f)/16. Target syrup:water is 3:2, so syrup fraction is 3/5; 11(1-f)/16=3/5 gives f=7/55." }),
  observation({ q: 52, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — direct common tangent between externally touching circles", representation: "EXTERNALLY_TOUCHING_CIRCLES_COMMON_TANGENT_MCQ", notes: "Radii are 12 and 8, centre distance 20. Direct common tangent = sqrt(20²-(12-8)²)=8sqrt(6)." }),
  observation({ q: 53, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle similarity — parallel segment proportionality", representation: "PARALLEL_SEGMENT_TRIANGLE_SIMILARITY_MCQ", notes: "AD:BD=4:5, so AD:AB=4:9. Since DE||BC, DE/BC=4/9; DE=12 gives BC=27." }),
  observation({ q: 54, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — recover x²+1/x² from a quadratic relation", representation: "QUADRATIC_TO_RECIPROCAL_SQUARE_IDENTITY_MCQ", notes: "x²+8x-1=0 gives x-1/x=-8; squaring gives x²+1/x²=66." }),
  observation({ q: 55, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — central and circumferential angle relation", representation: "CENTRAL_TO_INSCRIBED_ANGLE_MCQ", notes: "The source diagram has central angle AOB=130° and asks for angle APB; the keyed option is 115° using the intercepted major arc." }),
  observation({ q: 56, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility rules — four-digit palindromic form ABBA divisible by 4", representation: "PALINDROME_DIVISIBILITY_COUNT_MCQ", notes: "Count digit pairs a<b for which the last two digits BA are divisible by 4; source options give a finite counting task." }),
  observation({ q: 57, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — reciprocal fourth powers with sign branch", representation: "RECIPROCAL_FOURTH_POWER_SIGNED_IDENTITY_MCQ", notes: "x²+1/x²=6 and 0<x<1 imply x²-1/x²=-4sqrt(2); multiplying by 6 gives x⁴-1/x⁴=-24sqrt(2)." }),
  observation({ q: 58, packageId: "TSD-002", topic: "Arithmetic — Time, Speed & Distance", subtopic: "TSD-CP-009 — Boats, streams and one-dimensional medium motion", representation: "UPSTREAM_DOWNSTREAM_TWO_TRIP_SYSTEM_MCQ", notes: "20/u+44/d=8 and 15/u+22/d=5 solve to upstream 5 km/h and downstream 11 km/h; still-water speed is 8 km/h." }),
  observation({ q: 59, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Efficiency ratios — men, women and boys to combined completion time", representation: "MULTI_CLASS_EFFICIENCY_RATIO_WORK_MCQ", notes: "4 men=6 women and 4 women=6 boys. Relative rates man:woman:boy=9:6:4; with a boy taking 60 days, one man plus one woman finishes in 16 days." }),
  observation({ q: 60, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Relative motion — chase from a fixed initial lead", representation: "CHASE_INITIAL_DISTANCE_LEAD_MCQ", notes: "Initial lead is 400 m and relative speed is 2 km/h, so catch time is 0.2 h; policeman covers 2.4 km." }),
  observation({ q: 61, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Changing workforce — fixed number of workers leave after each day", representation: "ARITHMETIC_SEQUENCE_WORKFORCE_ATTRITION_MCQ", notes: "Planned work=11N. Actual 15-day worker-days=15N-16(0+...+14)=15N-1680; equality gives N=420." }),
  observation({ q: 62, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — transform cos relation into powers of sine", representation: "TRIG_POWER_IDENTITY_FROM_COS_RELATION_MCQ", notes: "cos A+cos²A=1 implies sin²A=cos A; hence sin⁴A+sin⁶A=cos²A(1+cos A)=cos A." }),
  observation({ q: 63, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle classification — obtuse test using side squares", representation: "OBTUSE_TRIANGLE_SIDE_SET_CLASSIFICATION_MCQ", notes: "For 15,62,64, 64²=4096 exceeds 62²+15²=4069, so the triangle is obtuse." }),
  observation({ q: 64, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "MEN-CP-008 — Cone curved surface area", representation: "CONE_CURVED_SURFACE_AREA_MCQ", notes: "CSA=pi*r*l=(22/7)*21*60=3960 cm²." }),
  observation({ q: 65, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "BODMAS simplification with division and bracket", representation: "BODMAS_INTEGER_EXPRESSION_MCQ", notes: "1755/39=45 and (8-28/4)=1, so 45*1-2=43." }),
  observation({ q: 66, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar chart — average FDI across a four-year interval", representation: "BAR_CHART_INTERVAL_AVERAGE_MCQ", notes: "The paper supplies an FDI bar chart and asks for the rounded average over 1992-1995." }),
  observation({ q: 67, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — cosec 30° and cos 60°", representation: "TRIG_EXACT_VALUE_DIFFERENCE_MCQ", notes: "cosec30°-cos60°=2-1/2=3/2." }),
  observation({ q: 68, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Delayed chase — infer pursuer speed and catch distance", representation: "DELAYED_CHASE_GAP_AFTER_TIME_MCQ", notes: "Thief's six-minute lead is 2 km. After 24 minutes the gap is 0.4 km, so relative speed is 4 km/h and police speed 24 km/h; catch point is 12 km from the crime spot." }),
  observation({ q: 69, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Marked price — change discount while holding cost price fixed", representation: "DISCOUNT_CHANGE_TO_PROFIT_PERCENT_MCQ", notes: "At 18% discount, SP=82% MP=130% CP. At 12% discount, SP=88% MP, giving profit about 39.51%." }),
  observation({ q: 70, packageId: "PCT-002", topic: "Arithmetic — Percentage", subtopic: "Direct percentage evaluation and comparison", representation: "COMPARE_PERCENT_OF_VALUES_MCQ", notes: "The four values are 75, 83.25, 72 and 76.05; the least is 10% of 720 = 72." }),
  observation({ q: 71, packageId: "PCT-007", topic: "Arithmetic — Percentage", subtopic: "PCT-CP-001 — Income, expenditure and savings", representation: "INCOME_INCREASE_SAVINGS_INCREASE_CURRENT_SHARE_MCQ", notes: "Take initial income 100 and savings 20. New income is 125 and savings 21, so current savings share is 21/125=16.8%." }),
  observation({ q: 72, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table DI — poverty percentage with male/female composition", representation: "TABLE_PERCENTAGE_COMPOSITION_COUNT_MCQ", notes: "The paper provides state poverty percentages plus male:female composition below/above poverty line and asks the combined female-below-poverty count for states B and C." }),
  observation({ q: 73, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Dishonest measurement — faulty weighing scale with target profit", representation: "FAULTY_SCALE_PACKET_PROFIT_MCQ", notes: "A displayed 200 g corresponds to actual 175 g. At ₹880/kg cost, packet cost is ₹154; adding 25% profit gives ₹192.50." }),
  observation({ q: 74, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Reciprocal algebra — transform x=1/(x-3) to x+1/x", representation: "RECIPROCAL_QUADRATIC_TO_SUM_MCQ", notes: "Interpreting the source equation as x=1/(x-3), x²-3x-1=0 gives x-1/x=3; therefore (x+1/x)²=13 and x+1/x=sqrt(13) for x>0." }),
  observation({ q: 75, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — rate from multiplication of principal over time", representation: "SIMPLE_INTEREST_TRIPLE_PRINCIPAL_RATE_MCQ", notes: "Tripling means interest=2P in 16 years, so rate=2*100/16=12.5% p.a." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 26 Jul 2023 Shift 1",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-26",
  shift: "Shift 1",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_07_26_S1_FULL_QUANT_SECTION_WAVE4_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
