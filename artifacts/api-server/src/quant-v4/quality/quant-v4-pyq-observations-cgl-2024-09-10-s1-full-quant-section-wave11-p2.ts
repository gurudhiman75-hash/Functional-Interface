import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY =
  "QUANT-V4-CGL-2024-09-10-S1-FULL-QUANT-SECTION-WAVE11-P2" as const;

const SOURCE_URL = "https://www.scribd.com/document/885443882/SSC-CGL-2024-Tier-I-Official-Paper-Held-On-10-Sept-2024-Shift-1";
const COMPANION_MATH_SOURCE_URL = "https://www.scribd.com/document/852571651/Setwise-Pre-2024";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-10-S1";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2024-09-10-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#quant-question-${input.q}`,
    sourceLabel: `SSC CGL Tier-I 2024 — 10 Sep 2024 Shift 1, Quantitative Aptitude Q${input.q}`,
    heldDate: "2024-09-10",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `SSC-CGL-2024-09-10-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 1, packageId: "RAP-003", topic: "Arithmetic — Ratio & Proportion", subtopic: "Age relations — linked present-age ratios and differences", representation: "LINKED_AGE_RELATIONS_MCQ", notes: "Ram and Ravi differ by 7 years; Mayadevi is three times Ram; Ravi is four times Soham; Mayadevi and Soham differ by 65 years. Solve the linked age relations to obtain Mayadevi's age." }),
  observation({ q: 2, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — derive male counts from total and female counts then compare", representation: "TABLE_DERIVED_CATEGORY_RATIO_MCQ", notes: "From the research-scholar table, derive male scholars as total minus female and compare Mathematics with Statistics." }),
  observation({ q: 3, packageId: "RAP-002", topic: "Arithmetic — Ratio & Proportion", subtopic: "Linked proportion — solve fourth proportional from tabular values", representation: "FOURTH_PROPORTIONAL_TABLE_MCQ", notes: "Use A:C = B:D with the supplied table values to solve the missing D. This is first whole-section support for RAP-002." }),
  observation({ q: 4, packageId: "GEO-001", topic: "Advanced Mathematics — Geometry", subtopic: "Triangle congruence — identify invalid congruence criterion", representation: "TRIANGLE_CONGRUENCE_CRITERION_MCQ", notes: "AAA proves similarity, not congruence; ASA, SSS and SAS are valid congruence criteria." }),
  observation({ q: 5, packageId: "GEO-002", topic: "Advanced Mathematics — Geometry", subtopic: "Two circles — direct common tangent for externally touching circles", representation: "DIRECT_COMMON_TANGENT_TOUCHING_CIRCLES_MCQ", notes: "For radii 18 cm and 12 cm touching externally, direct common tangent length is 2√(r1 r2)=12√6 cm." }),
  observation({ q: 6, packageId: "TRG-001", topic: "Advanced Mathematics — Trigonometry", subtopic: "Trigonometric identities — sec/cosec with tan/cot", representation: "SEC_COSEC_TAN_COT_IDENTITY_MCQ", notes: "Rewrite tan² and cot² using sec²−1 and cosec²−1, then simplify the quotient." }),
  observation({ q: 7, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — split principal between two rates", representation: "SPLIT_PRINCIPAL_TWO_SI_RATES_MCQ", notes: "₹4,000 is split at 8% and 10% with annual interest ₹352; alligation or a linear equation gives ₹1,600 at 10%." }),
  observation({ q: 8, packageId: "GEO-002", topic: "Advanced Mathematics — Geometry", subtopic: "Circle through three points — collinearity feasibility", representation: "THREE_POINT_CIRCLE_COLLINEARITY_MCQ", notes: "XY+YZ=XZ (11+13=24), so the three points are collinear and no circle can pass through all three." }),
  observation({ q: 9, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "BODMAS — mixed division, multiplication and 'of'", representation: "BODMAS_OF_DIVISION_MULTIPLICATION_MCQ", notes: "Evaluate the mixed operation expression using 'of' as multiplication and standard precedence; the value is 5." }),
  observation({ q: 10, packageId: "PNL-001", topic: "Arithmetic — Profit, Loss & Discount", subtopic: "Discount comparison — single discount versus successive discounts", representation: "SINGLE_VS_SUCCESSIVE_DISCOUNT_MP_MCQ", notes: "30% then 40% gives 58% effective discount; the 7-point gap from 65% equals ₹105, so marked price is ₹1,500." }),
  observation({ q: 11, packageId: "TRG-001", topic: "Advanced Mathematics — Trigonometry", subtopic: "Heights and distances — ladder/pole against wall", representation: "RIGHT_TRIANGLE_STANDARD_ANGLE_BASE_MCQ", notes: "A 10 m pole makes 30° with the ground; horizontal distance is 10 cos30°=5√3 m." }),
  observation({ q: 12, packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar graph — ratio of averages across selected schools and years", representation: "BAR_GRAPH_SELECTED_AVERAGES_PERCENT_MCQ", notes: "Compare average sales of A,B,C in 2014 with A,C,F in 2013; common division by three cancels and the required percentage is 81.08%." }),
  observation({ q: 13, packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Coin counts — ratio with weighted denominations", representation: "COIN_RATIO_WEIGHTED_VALUE_MCQ", notes: "Counts of ₹1, ₹5 and ₹10 coins are in 3:5:7; weighted value per ratio block is 98 and total ₹980 gives 70 ten-rupee coins." }),
  observation({ q: 14, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — largest five-digit multiple", representation: "LARGEST_N_DIGIT_DIVISIBLE_NUMBER_MCQ", notes: "Check the largest five-digit candidates for divisibility by 47; 99,969 is divisible by 47." }),
  observation({ q: 15, packageId: "MEN-002", topic: "Advanced Mathematics — Mensuration", subtopic: "Cone — infer radius from volume then total surface area", representation: "CONE_VOLUME_TO_TSA_MCQ", notes: "Volume 1232 cm³ and height 24 cm give r=7 cm; slant height is 25 cm and TSA is 704 cm²." }),
  observation({ q: 16, packageId: "TRG-001", topic: "Advanced Mathematics — Trigonometry", subtopic: "Sine-cosine ordering over an acute-angle interval", representation: "SIN_COS_ORDERING_INTERVAL_MCQ", notes: "For 0°<t<90°, sin t < cos t when t<45°, equal at 45°, and greater after 45°." }),
  observation({ q: 17, packageId: "PNL-001", topic: "Arithmetic — Profit, Loss & Discount", subtopic: "Commercial discount scheme — date-window discount plus cash discount", representation: "DATED_BILLS_MULTI_DISCOUNT_MCQ", notes: "Apply 5% cash discount to the current ₹5,480 bill and 2% within-10-days discount to the earlier ₹9,800 bill; total paid is ₹14,810." }),
  observation({ q: 18, packageId: "PNL-001", topic: "Arithmetic — Profit & Loss", subtopic: "Profit stated as fraction of selling price — convert to gain percent on cost", representation: "PROFIT_FRACTION_OF_SP_TO_GAIN_PERCENT_MCQ", notes: "If profit is one-sixth of SP, then CP is five-sixths of SP and profit percent on CP is 20%." }),
  observation({ q: 19, packageId: "ALG-001", topic: "Advanced Mathematics — Algebra", subtopic: "Reciprocal identity — square from a plus reciprocal", representation: "RECIPROCAL_SQUARE_IDENTITY_MCQ", notes: "From a+1/a=12, square and subtract 2 to obtain a²+1/a²=142." }),
  observation({ q: 20, packageId: "MEN-001", topic: "Advanced Mathematics — Mensuration", subtopic: "Composite plane area — equilateral triangle minus three sectors", representation: "TRIANGLE_MINUS_VERTEX_SECTORS_AREA_MCQ", notes: "Subtract the three 60° sectors of radius 14 cm from the area of an equilateral triangle of side 28 cm; result is 31.08 cm² with the stated approximations." }),
  observation({ q: 21, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — difference between one category average and combined-category average", representation: "TABLE_MULTI_YEAR_AVERAGE_DIFFERENCE_MCQ", notes: "For 2015–2018 car production, B averages 647.5 and the combined A/C average is 918.75; difference is 271.25 thousand." }),
  observation({ q: 22, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Circular race — same direction relative speed", representation: "CIRCULAR_TRACK_SAME_DIRECTION_MEETING_MCQ", notes: "Relative speed is 4.5 km/h=1.25 m/s; 750/1.25=600 seconds for the first re-meeting." }),
  observation({ q: 23, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Average speed — equal-distance thirds at three speeds", representation: "EQUAL_DISTANCE_THREE_SPEEDS_HARMONIC_AVERAGE_MCQ", notes: "For equal thirds at 40, 50 and 60 km/h, use total distance divided by total time; average is about 48.65 km/h." }),
  observation({ q: 24, packageId: "TMW-001", topic: "Arithmetic — Time & Work", subtopic: "Pipes and cisterns — two pipes turned off after common start", representation: "THREE_PIPES_PARTIAL_RUNTIME_MCQ", notes: "With rates 1/40, 1/80 and 1/120, P works all 30 minutes and Q,R work for x minutes; solving gives x=12 minutes." }),
  observation({ q: 25, packageId: "ALG-001", topic: "Advanced Mathematics — Algebra", subtopic: "Cubic symmetric identity from sum and sum of squares", representation: "CUBIC_SYMMETRIC_IDENTITY_MCQ", notes: "Use a³+b³+c³−3abc=(a+b+c)(a²+b²+c²−ab−bc−ca), with a+b+c=18 and sum of squares 36." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS = Object.freeze({
  source: "Scribd full-paper transcription cross-checked against Abhinay Maths setwise 2024 Quant compilation",
  sourceUrl: SOURCE_URL,
  companionMathSourceUrl: COMPANION_MATH_SOURCE_URL,
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-10",
  shift: "Shift 1",
  sectionQuestionRange: "Q1-Q25",
  newObservationCount: QUANT_V4_CGL_2024_09_10_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  stabilityExpansionEvidence: true,
  officialSscHostedCopy: false,
  productionPromotionAuthorized: false,
} as const);
