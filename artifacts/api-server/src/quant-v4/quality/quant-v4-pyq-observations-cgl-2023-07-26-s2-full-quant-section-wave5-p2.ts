import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_AUTHORITY =
  "QUANT-V4-CGL-2023-07-26-S2-FULL-QUANT-SECTION-WAVE5-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-tier-1-26th-july-2023-shift-2-question-paper-solved";
const PAPER_ID = "SSC-CGL-2023-TIER-I-2023-07-26-S2";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2023-07-26-S2-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2023, held 26 Jul 2023 Shift 2, Quantitative Aptitude Q${input.q}`,
    heldDate: "2023-07-26",
    shift: "Shift 2",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2023-07-26-S2-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Part-to-whole ratio — recover the complementary group count", representation: "PART_TO_WHOLE_COMPLEMENT_COUNT_MCQ", notes: "Boys:total is 7:17. With 1099 boys, one part is 157 and girls are 10 parts = 1570." }),
  observation({ q: 52, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle congruence — perimeter invariance", representation: "CONGRUENT_TRIANGLES_PERIMETER_PROPERTY_MCQ", notes: "Congruent triangles have equal corresponding sides, so their perimeters are equal." }),
  observation({ q: 53, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "TSD-CP-006 — Circular and closed-track motion", representation: "CIRCULAR_TRACK_SPEED_RATIO_MEETING_TIME_MCQ", notes: "Ram is three times as fast as Shyam. Their relative speed is two Shyam-speed units; one relative lap of 1440 m takes 8 min, giving Shyam 90 m/min and a 16 min lap." }),
  observation({ q: 54, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — separate fill times from combined time and a time difference", representation: "PIPE_SEPARATE_TIMES_FROM_COMBINED_DIFFERENCE_MCQ", notes: "If A takes x minutes and B takes x+5, 1/x+1/(x+5)=1/6 gives x=10, so the times are 10 and 15 minutes." }),
  observation({ q: 55, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — cubic sum identity linked to pairwise squared differences", representation: "CUBIC_IDENTITY_WITH_SQUARED_DIFFERENCE_SUM_MCQ", notes: "a^3+b^3+c^3-3abc=(a+b+c)/2 times the sum of pairwise squared differences. Thus 405=(a+b+c)*54/2, so a+b+c=15." }),
  observation({ q: 56, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "MEN-CP-009 — Spheres and hemispheres", representation: "SPHERE_SURFACE_AREA_MCQ", notes: "Surface area = 4πr² = 4*(22/7)*35² = 15400 cm²." }),
  observation({ q: 57, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — convert partial-fill time to full rate and combine", representation: "PARTIAL_FILL_RATE_COMBINED_PIPE_TIME_MCQ", notes: "Pipe A fills half a tank in 6 h, so it fills a full tank in 12 h. With B taking 18 h, combined time is 36/5 h = 432 minutes." }),
  observation({ q: 58, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility rules — missing digits under divisibility by 9", representation: "MISSING_DIGITS_DIVISIBILITY_BY_9_MCQ", notes: "Digit sum is 35+X+Y and Y-X=6. Writing Y=X+6 gives total 41+2X; divisibility by 9 gives X=2 and Y=8, so sqrt(2X+4Y)=sqrt(36)=6." }),
  observation({ q: 59, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratios in a right triangle — complementary-angle simplification", representation: "RIGHT_TRIANGLE_COMPLEMENTARY_TRIG_EXPRESSION_MCQ", notes: "With B=90°, C=90°-A, so sin C=cos A. The expression reduces using tan A=1/sqrt(3), i.e. A=30°." }),
  observation({ q: 60, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Relative motion — chase from a fixed initial lead", representation: "CHASE_INITIAL_LEAD_DISTANCE_MCQ", notes: "Initial lead is 360 m. Relative speed is 1.2 km/h, so catch time is 0.3 h; the policeman covers 9.2*0.3=2.76 km = 2760 m." }),
  observation({ q: 61, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Marked price and discount — compare successive and single discount schemes", representation: "SUCCESSIVE_DISCOUNT_COMPARISON_MCQ", notes: "A single 10% discount exceeds two 5% discounts (9.75%) and two discounts of 8% and 2% (9.84%)." }),
  observation({ q: 62, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table DI — aggregate passed/enrolled percentage across years", representation: "TABLE_MULTIYEAR_AGGREGATE_PERCENTAGE_MCQ", notes: "The source table lists enrolled and passed students for college B from 2010-2014; the task aggregates both columns and computes the passed percentage." }),
  observation({ q: 63, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Algebraic identities — square of a three-term sum", representation: "SUM_SQUARE_FROM_PAIRWISE_PRODUCTS_MCQ", notes: "a²+b²+c²=(a+b+c)²-2(ab+bc+ca)=169-108=61." }),
  observation({ q: 64, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratio equation — recover cotangent", representation: "LINEAR_SIN_COS_RATIO_TO_COT_MCQ", notes: "21c+3s=2(3c+4s) gives 15c=5s, so tan A=3 and cot A=1/3." }),
  observation({ q: 65, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Combined work — recover one worker's individual time", representation: "INDIVIDUAL_TIME_FROM_COMBINED_RATE_MCQ", notes: "B's rate = 1/72-1/120 = 1/180, so B alone takes 180 days." }),
  observation({ q: 66, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — recover annual rate from interest, principal and time", representation: "SIMPLE_INTEREST_RATE_RECOVERY_MCQ", notes: "R=SI*100/(P*T)=6400*100/(21000*3)=640/63%=10 10/63%." }),
  observation({ q: 67, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — multiple inlet and outlet pipes", representation: "MULTIPLE_INLETS_OUTLETS_NET_RATE_MCQ", notes: "Net rate = 9/84-10/105 = 3/28-2/21 = 1/84 tank per hour, so the cistern fills in 84 hours." }),
  observation({ q: 68, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratio recovery — cosine from sine", representation: "COSINE_FROM_SINE_PYTHAGOREAN_IDENTITY_MCQ", notes: "For acute x, cos x=sqrt(1-9/49)=sqrt(40/49)=2sqrt(10)/7." }),
  observation({ q: 69, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "AVG-CP-004 — Weighted and combined aggregation", representation: "COMBINED_AVERAGE_MISSING_GROUP_MEAN_MCQ", notes: "Total class weight is 60*46.5=2790 kg. Boys weigh 35*42=1470 kg, leaving 1320 kg for 25 girls, so girls average 52.8 kg." }),
  observation({ q: 70, packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-003 — Circles, arcs, sectors and annular regions", representation: "SECTOR_AREA_TO_RADIUS_MCQ", notes: "110=(56/360)*(22/7)*r² gives r²=225 and r=15 cm." }),
  observation({ q: 71, packageId: "PCT-002", topic: "Arithmetic — Percentage", subtopic: "Base switching — reverse a percentage decrease into percentage increase", representation: "PERCENT_LESS_TO_PERCENT_MORE_BASE_SWITCH_MCQ", notes: "Sam=81% of Peter, so Peter exceeds Sam by 19/81*100=23.45679%, i.e. 23.46%." }),
  observation({ q: 72, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Percentage-distribution table — compare absolute year-over-year variation", representation: "TABLE_PERCENT_DISTRIBUTION_ABSOLUTE_VARIATION_MCQ", notes: "The source provides department percentage distributions for totals 1200 and 1600; each department's absolute strength is reconstructed before comparing variation." }),
  observation({ q: 73, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Reciprocal algebra — reduce rational expression using x+1/x", representation: "RECIPROCAL_SUM_RATIONAL_EXPRESSION_MCQ", notes: "Divide numerator and denominator by x: (x+1/x+7)/(x+1/x+11)=(1+7)/(1+11)=2/3." }),
  observation({ q: 74, packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "BODMAS simplification with nested brackets", representation: "NESTED_BODMAS_INTEGER_EXPRESSION_MCQ", notes: "First bracket is 3-3+7-2=5; inner brace is 3-1=2, then 2*5-6=4; 6-5*4=-14." }),
  observation({ q: 75, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "MEN-CP-007 — Cubes, cuboids and prisms", representation: "CUBOID_CAPACITY_TO_LITRES_MCQ", notes: "Volume = 50*25*10=12500 m³. At 1000 L per m³, capacity is 12,500,000 litres." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 26 Jul 2023 Shift 2",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2023-07-26",
  shift: "Shift 2",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2023_07_26_S2_FULL_QUANT_SECTION_WAVE5_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
