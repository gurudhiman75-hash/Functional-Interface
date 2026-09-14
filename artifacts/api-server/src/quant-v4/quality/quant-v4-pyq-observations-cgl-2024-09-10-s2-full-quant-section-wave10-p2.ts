import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_AUTHORITY =
  "QUANT-V4-CGL-2024-09-10-S2-FULL-QUANT-SECTION-WAVE10-P2" as const;

const SOURCE_URL = "https://sscportal.in/sites/default/files/ssc-cgl-tier-1-paper-2024-sep-10-shift-2.pdf";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-10-S2";

function observation(input: {
  q: number;
  sourceQuestionId: string;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  const sourceQuestionNumber = input.q - 50;
  return Object.freeze({
    observationId: `CGL-2024-09-10-S2-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-id-${input.sourceQuestionId}`,
    sourceLabel: `SSC response-sheet mirror — SSC CGL Tier-I 2024, held 10 Sep 2024 Shift 2, Quantitative Aptitude Q${sourceQuestionNumber} (normalized Q${input.q})`,
    heldDate: "2024-09-10",
    shift: "Shift 2",
    paperId: PAPER_ID,
    questionRef: `SSCPORTAL-SSC-CGL-2024-09-10-S2-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

// Q53 is not repeated here. The already-counted ALG-V2-S01 observation is the exact
// paper Q3 linear-system item and is reused after its questionRef is normalized to Q53.
export const QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, sourceQuestionId: "630680428087", packageId: "DI-001", topic: "Data Interpretation", subtopic: "Basic table — recover an unknown quantity from unit price and total cost", representation: "TABLE_UNIT_PRICE_QUANTITY_TOTAL_UNKNOWN_MCQ", notes: "Six notebooks cost 6×₹20=₹120. The remaining ₹60 buys pens at ₹10 each, so X=6." }),
  observation({ q: 52, sourceQuestionId: "6306801047988", packageId: "MAL-001", topic: "Arithmetic — Mixture and Alligation", subtopic: "Three-component concentration mixture — unknown mixing ratio", representation: "THREE_ACID_WEIGHTED_CONCENTRATION_UNKNOWN_RATIO_MCQ", notes: "(20×3+30×5+40a)/(3+5+a)=30 gives 210+40a=240+30a, hence a=3." }),
  observation({ q: 54, sourceQuestionId: "630680428498", packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Pursuit — initial lead and catch time", representation: "PURSUIT_INITIAL_GAP_CATCH_TIME_SPEED_MCQ", notes: "The 0.5 km lead closes in 0.25 h, so relative speed is 2 km/h. The policeman therefore runs at 15+2=17 km/h." }),
  observation({ q: 55, sourceQuestionId: "630680526523", packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Similar triangles — corresponding-side scale factor", representation: "SIMILAR_TRIANGLES_CORRESPONDING_SIDE_SCALE_MCQ", notes: "HI=3EF, so the similar-triangle scale factor is 3. Since FG=9 cm corresponds to IJ, IJ=27 cm." }),
  observation({ q: 56, sourceQuestionId: "630680413498", packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-004 — Difference-of-cubes factorisation and cancellation", representation: "DECIMAL_DIFFERENCE_OF_CUBES_FACTOR_CANCEL_MCQ", notes: "Write 0.001=0.1³ and the denominator as 0.58²+0.58×0.1+0.1². Using (a³-b³)/(a²+ab+b²)=a-b gives 0.48." }),
  observation({ q: 57, sourceQuestionId: "630680403295", packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — two filling pipes", representation: "TWO_FILL_PIPES_COMBINED_TIME_MCQ", notes: "The combined rate is 1/30+1/45=1/18 pool per hour, so the pool fills in 18 hours." }),
  observation({ q: 58, sourceQuestionId: "630680915059", packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Ratio fundamentals — combine two linked ratios", representation: "LINKED_THREE_TERM_RATIO_MCQ", notes: "A:B=3:4 and B:C=5:12. Equalising B to 20 gives A:B:C=15:20:48." }),
  observation({ q: 59, sourceQuestionId: "630680428136", packageId: "DI-001", topic: "Data Interpretation", subtopic: "Basic table — category value compared with overall average", representation: "TABLE_CATEGORY_TO_OVERALL_AVERAGE_RATIO_MCQ", notes: "Read the subject counts from the supplied table, compute the mean books per subject, and compare B1 with that mean; the source answer is 10:11." }),
  observation({ q: 60, sourceQuestionId: "630680518878", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric ratio substitution — expression in sin and cos", representation: "TAN_GIVEN_SIN_COS_RATIONAL_EXPRESSION_MCQ", notes: "2tanθ=3 gives tanθ=3/2. Dividing numerator and denominator by cosθ gives (3tanθ-2)/(3tanθ+2)=5/13." }),
  observation({ q: 61, sourceQuestionId: "630680403306", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — cotangent, secant and cosecant", representation: "COT_GIVEN_SEC_COSEC_IDENTITY_EXPRESSION_MCQ", notes: "cotθ=4/3 gives sinθ=3/5 and cosθ=4/5 on the intended acute branch. Substitution reduces the expression to 3/4." }),
  observation({ q: 62, sourceQuestionId: "630680421519", packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Solid mensuration — cone formed by rotating a right triangle", representation: "RIGHT_TRIANGLE_ROTATION_CONE_VOLUME_MCQ", notes: "Rotating the 3-4-5 right triangle about the 3 cm side gives height 3 and radius 4. Volume=(1/3)π×4²×3=16π cm³." }),
  observation({ q: 63, sourceQuestionId: "630680413553", packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal radical identity", representation: "SQRT_RECIPROCAL_SUM_TO_X_PLUS_RECIPROCAL_MCQ", notes: "Squaring √x+1/√x=7 gives x+1/x+2=49, so x+1/x=47." }),
  observation({ q: 64, sourceQuestionId: "630680217285", packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Equivalent single discount for successive discounts", representation: "SUCCESSIVE_DISCOUNTS_TO_EQUIVALENT_SINGLE_DISCOUNT_MCQ", notes: "The retained price fraction is 0.60×0.70=0.42, so the equivalent discount is 58%." }),
  observation({ q: 65, sourceQuestionId: "630680388630", packageId: "PCT-005", topic: "Arithmetic — Percentage", subtopic: "Successive percentage change — repeated salary increase", representation: "SUCCESSIVE_PERCENT_INCREASE_NET_GAIN_MCQ", notes: "Two 50% increases multiply salary by 1.5×1.5=2.25, so the net gain is 125%." }),
  observation({ q: 66, sourceQuestionId: "630680421381", packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle angles — exterior angle from two remote interior angles", representation: "TRIANGLE_TWO_ANGLES_TO_EXTERIOR_ANGLE_MCQ", notes: "The third interior angle is 180°-45°-65°=70°. Its exterior angle is 110°, equivalently 45°+65°." }),
  observation({ q: 67, sourceQuestionId: "630680429000", packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Weighted profit rates — split quantity at two profit percentages", representation: "TWO_PROFIT_RATES_WEIGHTED_QUANTITY_SPLIT_MCQ", notes: "If x kg is sold at 40%, then 0.40x+0.10(1000-x)=0.20×1000. Thus x=1000/3=333⅓ kg." }),
  observation({ q: 68, sourceQuestionId: "630680138107", packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Remainders — large odd power modulo one more than the base", representation: "LARGE_ODD_POWER_PLUS_BASE_REMAINDER_MCQ", notes: "Modulo 78, 77≡-1. Hence 77^77+77≡-1-1=-2≡76 (mod 78)." }),
  observation({ q: 69, sourceQuestionId: "63068071031", packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — equal annual instalments accumulated to a due date", representation: "SIMPLE_INTEREST_EQUAL_ANNUAL_INSTALMENT_DEBT_MCQ", notes: "At the end of year 4, the four instalments have factors 1.18, 1.12, 1.06 and 1. Their sum is 4.36, so instalment=26160/4.36=₹6000." }),
  observation({ q: 70, sourceQuestionId: "630680379674", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric equations — eliminate p and q using sin/cos relations", representation: "TRIG_PARAMETER_ELIMINATION_P2_PLUS_4Q2_MCQ", notes: "p cosA=2q sinA gives p=2q tanA. The second relation then becomes 3q secA=3, so q=cosA and p=2sinA. Therefore p²+4q²=4." }),
  observation({ q: 71, sourceQuestionId: "630680428212", packageId: "DI-003", topic: "Data Interpretation", subtopic: "Grouped bar chart — cross-branch two-year percentage comparison", representation: "GROUPED_BAR_TWO_YEAR_BRANCH_PERCENT_COMPARISON_MCQ", notes: "Add B6 sales across 2000 and 2001, add B3 sales across the same years, and form the percentage. The source answer is 73.17%." }),
  observation({ q: 72, sourceQuestionId: "630680428231", packageId: "DI-003", topic: "Data Interpretation", subtopic: "Bar chart — count years above the multi-year average", representation: "BAR_CHART_COUNT_ABOVE_AVERAGE_YEARS_MCQ", notes: "The seven production values are 35, 50, 70, 90, 40, 60 and 30 thousand. Their average is 375/7≈53.57, exceeded in 2010, 2011 and 2013: 3 years." }),
  observation({ q: 73, sourceQuestionId: "630680404007", packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — chord length from radius and perpendicular distance from centre", representation: "CIRCLE_RADIUS_CENTRE_DISTANCE_TO_CHORD_LENGTH_MCQ", notes: "Half-chord=√[(5√13)²-10²]=√225=15 cm, so the full chord is 30 cm." }),
  observation({ q: 74, sourceQuestionId: "630680379690", packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Two vehicles — infer speeds from same-direction and opposite-direction meetings", representation: "TWO_CARS_SUM_DIFFERENCE_SPEEDS_FROM_MEET_TIMES_MCQ", notes: "Same-direction meeting gives speed difference 20 km/h. Opposite-direction meeting in 0.2 h gives speed sum 100 km/h. Solving gives 60 and 40 km/h." }),
  observation({ q: 75, sourceQuestionId: "630680426287", packageId: "SAP", topic: "Arithmetic — Simplification & Approximation", subtopic: "Exact decimal simplification — nested brackets and multiplication", representation: "NESTED_DECIMAL_BODMAS_SIMPLIFICATION_MCQ", notes: "1.1×0.2=0.22, so 3.22-0.22=3; then 6+7-3=10 and 21-10=11." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_SOURCE_LIMITATIONS = Object.freeze({
  source: "SSC Portal response-sheet PDF mirror — SSC CGL Tier-I 10 Sep 2024 Shift 2",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-10",
  shift: "Shift 2",
  sectionQuestionRange: "normalized Q51-Q75 (source Quant Q1-Q25)",
  newObservationCount: QUANT_V4_CGL_2024_09_10_S2_FULL_QUANT_SECTION_WAVE10_COUNTABLE_PYQ_OBSERVATIONS.length,
  priorObservationReused: "ALG-V2-S01",
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
