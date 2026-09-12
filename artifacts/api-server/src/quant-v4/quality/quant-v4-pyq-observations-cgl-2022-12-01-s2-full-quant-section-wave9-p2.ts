import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_AUTHORITY =
  "QUANT-V4-CGL-2022-12-01-S2-FULL-QUANT-SECTION-WAVE9-P2" as const;

const SOURCE_URL = "https://cracku.in/ssc-cgl-1-dec-2022-shift-2-question-paper-solved";
const PAPER_ID = "SSC-CGL-2022-TIER-I-2022-12-01-S2";

function observation(input: {
  q: number;
  packageId: string;
  topic: string;
  subtopic: string;
  representation: string;
  notes: string;
}): QuantV4PyqObservation {
  return Object.freeze({
    observationId: `CGL-2022-12-01-S2-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-${input.q}`,
    sourceLabel: `Cracku — SSC CGL Tier-I 2022, held 1 Dec 2022 Shift 2, Quantitative Aptitude Q${input.q}`,
    heldDate: "2022-12-01",
    shift: "Shift 2",
    paperId: PAPER_ID,
    questionRef: `CRACKU-SSC-CGL-2022-12-01-S2-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, packageId: "ALG-002", topic: "Advanced Mathematics", subtopic: "Algebraic fractions — evaluate rational expression under reciprocal constraint", representation: "RATIONAL_EXPRESSION_RECIPROCAL_CONSTRAINT_MCQ", notes: "Use k+1/k=-2 with the stated negative branch to reduce numerator and denominator before evaluation." }),
  observation({ q: 52, packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "Reciprocal identities — fourth power from x+1/x", representation: "RECIPROCAL_FOURTH_POWER_FROM_SUM_MCQ", notes: "From x+1/x=5√2, obtain x²+x⁻²=48 and then x⁴+x⁻⁴=48²-2=2302." }),
  observation({ q: 53, packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Boats and streams — still-water time from upstream/downstream times", representation: "BOAT_STREAM_EQUAL_DISTANCE_STILL_WATER_TIME_MCQ", notes: "For equal distance, downstream and upstream speeds are proportional to 1/9 and 1/18; derive still-water speed and find the time for three-fifths of the distance." }),
  observation({ q: 54, packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — central angle from category share", representation: "PIE_CATEGORY_SHARE_TO_CENTRAL_ANGLE_MCQ", notes: "The supplied steel-production chart asks for Kerala's sector angle, requiring category share ×360°." }),
  observation({ q: 55, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Successive discounts and profit — infer alternate profit rate", representation: "SUCCESSIVE_DISCOUNT_PROFIT_TO_ALTERNATE_DISCOUNT_PROFIT_MCQ", notes: "The 10% then 20% selling path gives 72% of marked price and corresponds to 144% of cost; infer cost-to-marked relation and recompute at a single 15% discount." }),
  observation({ q: 56, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric exact values — product of tangent ratios", representation: "TRIG_PRODUCT_STANDARD_COMPLEMENTARY_ANGLES_MCQ", notes: "The quotient is tan30°·tan40°·tan50°·tan60°. Complementary tangent factors cancel in pairs, giving 1." }),
  observation({ q: 57, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "HCF-LCM relation — recover HCF from product and LCM", representation: "HCF_LCM_PRODUCT_RELATION_RATIO_MCQ", notes: "For two integers, product=HCF×LCM. HCF=384/48=8, so HCF:LCM=1:6." }),
  observation({ q: 58, packageId: "PCT-001", topic: "Arithmetic — Percentage", subtopic: "Successive percentage increase — three-stage multiplier", representation: "THREE_SUCCESSIVE_PERCENT_INCREASE_NET_CHANGE_MCQ", notes: "Apply 1.10×1.05×1.15 and subtract 1 to get the total percentage increase." }),
  observation({ q: 59, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Similar triangles — side ratio from area ratio", representation: "SIMILAR_TRIANGLES_AREA_RATIO_TO_SIDE_MCQ", notes: "If areas are x²:y², corresponding side ratio is x:y; with EF=a, the corresponding side is ax/y." }),
  observation({ q: 60, packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Corrected average — two entries recorded too high", representation: "AVERAGE_CORRECTION_TWO_WRONG_ENTRIES_MCQ", notes: "Original total is 25×19. Replace 18 and 19 by 14 and 15, reducing total by 8, then divide by 25 to obtain 18.68." }),
  observation({ q: 61, packageId: "SRI-001", topic: "Number System", subtopic: "Indices and exponents — product with positive, zero and negative powers", representation: "INDEX_LAWS_COMBINE_EXPONENTS_MCQ", notes: "Add exponents 9+5-4+0-6=4, so the product is x⁴." }),
  observation({ q: 62, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — sine difference at standard angles", representation: "SIN_A_COS_B_MINUS_COS_A_SIN_B_MCQ", notes: "Recognize sin30°cos60°-cos30°sin60°=sin(-30°)=-sin30°." }),
  observation({ q: 63, packageId: "RAP-001", topic: "Arithmetic — Ratio and Proportion", subtopic: "Mean proportional and third proportional", representation: "MEAN_PROPORTIONAL_TO_THIRD_PROPORTIONAL_RATIO_MCQ", notes: "Mean proportional of 1.6 and 3.6 is 2.4. Third proportional to 5 and 8 is 64/5=12.8, yielding 3:16." }),
  observation({ q: 64, packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Profit amount and rate — recover selling price", representation: "PROFIT_AMOUNT_PERCENT_TO_SP_MCQ", notes: "₹1200 is 15% of cost, so CP=₹8000 and SP=₹9200." }),
  observation({ q: 65, packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — interest exceeds principal by fixed amount", representation: "SIMPLE_INTEREST_RELATION_TO_PRINCIPAL_MCQ", notes: "At 25% simple interest for 6 years, interest=150% of principal. The excess over principal is therefore 50%=₹360, giving principal ₹720." }),
  observation({ q: 66, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Equilateral triangle — circumradius", representation: "EQUILATERAL_TRIANGLE_SIDE_TO_CIRCUMRADIUS_MCQ", notes: "For side a=12, circumradius R=a/√3=4√3 cm." }),
  observation({ q: 67, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — contribution of one shop-item cell to grand revenue", representation: "TABLE_CELL_REVENUE_AS_PERCENT_OF_GRAND_TOTAL_MCQ", notes: "Use quantity×unit selling price for every listed shop-item cell, then divide Cooler revenue from shop E by the grand revenue." }),
  observation({ q: 68, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — count rows meeting an overall average threshold", representation: "TABLE_MULTI_SUBJECT_OVERALL_PERCENT_THRESHOLD_COUNT_MCQ", notes: "Average each student's four percentage marks and count those at or above 80%." }),
  observation({ q: 69, packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — direct category ratio", representation: "TABLE_DIRECT_TWO_CATEGORY_RATIO_MCQ", notes: "Read participant counts for states S3 and S4 and reduce their ratio." }),
  observation({ q: 70, packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Remainder — direct divisibility", representation: "DIRECT_INTEGER_REMAINDER_MCQ", notes: "8127=8×1015+7, so the remainder is 7." }),
  observation({ q: 71, packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Periodic assistance — helpers join every third day", representation: "PRIMARY_WORKER_PERIODIC_ASSISTANCE_CYCLE_MCQ", notes: "A works daily at 1/10; on each third day B and C also work at 1/20 and 1/40. Sum work over repeating three-day cycles and finish the residual part." }),
  observation({ q: 72, packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric identities — sum-to-product", representation: "SIN_DIFFERENCE_SUM_TO_PRODUCT_IDENTITY_MCQ", notes: "sinα-sinβ=2cos((α+β)/2)sin((α-β)/2)." }),
  observation({ q: 73, packageId: "MEN-002", topic: "Advanced Mathematics", subtopic: "Recasting solids — hemisphere into cone", representation: "HEMISPHERE_TO_CONE_EQUAL_VOLUME_UNKNOWN_RADIUS_MCQ", notes: "Equate 2/3π(4³) to 1/3πr²(72), giving r²=16/9 and r=4/3≈1.33 cm." }),
  observation({ q: 74, packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Triangle angle sum — linear expressions in one variable", representation: "TRIANGLE_ANGLE_SUM_LINEAR_VARIABLE_MCQ", notes: "(x-46)+(x+96)+8x=180 gives 10x=130, so 2x=26°." }),
  observation({ q: 75, packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circle tangent — radius perpendicular to tangent", representation: "TANGENT_LENGTH_RADIUS_TO_CENTRE_DISTANCE_MCQ", notes: "OQ⊥PQ, so OP=√(10²+24²)=26 cm." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_SOURCE_LIMITATIONS = Object.freeze({
  source: "Cracku solved-paper page — SSC CGL Tier-I 1 Dec 2022 Shift 2",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2022-12-01",
  shift: "Shift 2",
  sectionQuestionRange: "Q51-Q75",
  newObservationCount: QUANT_V4_CGL_2022_12_01_S2_FULL_QUANT_SECTION_WAVE9_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  stabilityExpansionEvidence: true,
  productionPromotionAuthorized: false,
} as const);
