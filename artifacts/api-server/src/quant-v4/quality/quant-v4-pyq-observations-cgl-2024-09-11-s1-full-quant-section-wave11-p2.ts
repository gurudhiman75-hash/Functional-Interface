import type { QuantV4PyqObservation } from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_AUTHORITY =
  "QUANT-V4-CGL-2024-09-11-S1-FULL-QUANT-SECTION-WAVE11-P2" as const;

const SOURCE_URL = "https://sscportal.in/sites/default/files/ssc-cgl-tier-1-paper-2024-sep-11-shift-1.pdf";
const PAPER_ID = "SSC-CGL-2024-TIER-I-2024-09-11-S1";

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
    observationId: `CGL-2024-09-11-S1-FULL-Q${input.q}`,
    examId: "SSC_CGL_TIER_I",
    evidenceKind: "VERIFIED_PYQ_COLLECTION",
    sourceRef: `${SOURCE_URL}#question-id-${input.sourceQuestionId}`,
    sourceLabel: `SSC response-sheet mirror — SSC CGL Tier-I 2024, held 11 Sep 2024 Shift 1, Quantitative Aptitude Q${sourceQuestionNumber} (normalized Q${input.q})`,
    heldDate: "2024-09-11",
    shift: "Shift 1",
    paperId: PAPER_ID,
    questionRef: `SSCPORTAL-SSC-CGL-2024-09-11-S1-Q${input.q}`,
    packageId: input.packageId,
    topic: input.topic,
    subtopic: input.subtopic,
    representation: input.representation,
    language: "en",
    notes: input.notes,
  });
}

export const QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS = Object.freeze([
  observation({ q: 51, sourceQuestionId: "630680387087", packageId: "GEO-001", topic: "Advanced Mathematics", subtopic: "Quadrilaterals — rhombus diagonals and perpendicular-bisector locus", representation: "RHOMBUS_EQUAL_VERTEX_DISTANCES_DIAGONAL_ANGLE_MCQ", notes: "OA=OC places O on the perpendicular bisector of diagonal AC. In a rhombus, BD is that perpendicular bisector, so D,O,B are collinear and ∠DOB=180°. Five-ninths of 180° is 100°." }),
  observation({ q: 52, sourceQuestionId: "630680566256", packageId: "AVG-001", topic: "Arithmetic — Average", subtopic: "Combined average — two subgroups with the same mean", representation: "TWO_GROUP_EQUAL_AVERAGES_COMBINED_AVERAGE_MCQ", notes: "Both the first 12 students and the remaining 18 students have average 62, so the combined average is also 62." }),
  observation({ q: 53, sourceQuestionId: "630680429072", packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "Dishonest dealer — short weight combined with stated profit", representation: "FALSE_WEIGHT_PLUS_PROFIT_TOTAL_GAIN_PERCENT_MCQ", notes: "The merchant charges for 1 kg while giving 0.88 kg and also prices at 10% above cost. Effective gain factor is 1.10/0.88=1.25, hence total gain is 25%." }),
  observation({ q: 54, sourceQuestionId: "630680421359", packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "MEN-CP-001 — Equilateral triangle perimeter to exact area", representation: "EQUILATERAL_PERIMETER_TO_AREA_MCQ", notes: "Perimeter 36 gives side 12. Area=(√3/4)×12²=36√3 square units." }),
  observation({ q: 55, sourceQuestionId: "630680526445", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric complementary-angle identities", representation: "SEC_COSEC_COMPLEMENTARY_ANGLE_CANCELLATION_MCQ", notes: "cosec55°=sec35° and sin65°=cos25°. The two ratios are each 1, so their difference is 0." }),
  observation({ q: 56, sourceQuestionId: "630680413505", packageId: "ALG-001", topic: "Advanced Mathematics", subtopic: "ALG-CP-002 — Reciprocal cubic identity from x+1/x", representation: "RECIPROCAL_CUBIC_DIFFERENCE_FROM_SUM_MCQ", notes: "From x+1/x=2√10 and x>1, (x-1/x)²=40-4=36, so x-1/x=6. Then x³-1/x³=6³+3×6=234." }),
  observation({ q: 57, sourceQuestionId: "630680354950", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Trigonometric algebra — eliminate coefficients using sine/cosine relation", representation: "TRIG_COEFFICIENT_RELATION_A2_PLUS_B2_MCQ", notes: "Use a sinx=b cosx together with a sin³x+b cos³x=sinx cosx. Substitution and sin²x+cos²x=1 reduce the required value to a²+b²=1." }),
  observation({ q: 58, sourceQuestionId: "630680108185", packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Divisibility — least addition to reach a multiple", representation: "LEAST_ADDITION_FOR_DIVISIBILITY_MCQ", notes: "999 leaves remainder 9 on division by 99. The least addition is 99-9=90." }),
  observation({ q: 59, sourceQuestionId: "630680392970", packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Simple interest — derive time from interest-as-fraction-of-principal", representation: "SI_FRACTION_OF_PRINCIPAL_TO_TIME_THEN_INTEREST_MCQ", notes: "At 10% simple interest, earning 3/5 of principal takes (3/5×100)/10=6 years. On ₹16,000 at 14% for 6 years, SI=16000×14×6/100=₹13,440." }),
  observation({ q: 60, sourceQuestionId: "630680387062", packageId: "DI-003", topic: "Data Interpretation", subtopic: "Grouped bar chart — compare combined multi-year averages by percentage", representation: "GROUPED_BAR_COMBINED_AVERAGE_PERCENT_MORE_LESS_MCQ", notes: "The paper supplies four years of coffee production for companies A-D and asks the percentage by which the combined A+C average differs from the combined B+D average; this is a grouped-bar comparison contract." }),
  observation({ q: 61, sourceQuestionId: "630680397551", packageId: "GEO-002", topic: "Advanced Mathematics", subtopic: "Circles — intersecting chords theorem", representation: "INTERSECTING_CHORD_SEGMENTS_UNKNOWN_LENGTH_MCQ", notes: "MO×ON=PO×OQ, so 9×5=PO×6 and PO=7.5 cm." }),
  observation({ q: 62, sourceQuestionId: "630680421536", packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "HCF application — largest square tile for a rectangular floor", representation: "RECTANGLE_DIMENSIONS_HCF_MINIMUM_SQUARE_TILES_MCQ", notes: "Convert to centimetres: 495 and 1665. Their HCF is 45 cm, so the least tile count is (495/45)×(1665/45)=11×37=407." }),
  observation({ q: 63, sourceQuestionId: "630680427952", packageId: "PCT-002", topic: "Arithmetic — Percentage", subtopic: "PCT-CP-006 — Multi-stage election attrition and candidate share", representation: "ELECTION_TURNOUT_INVALID_VALID_CANDIDATE_SHARE_MCQ", notes: "Votes polled=75,60,000×90%; valid votes are 85% of polled votes. Q receives the remaining 22% of valid votes, giving 12,72,348." }),
  observation({ q: 64, sourceQuestionId: "630680422123", packageId: "DI-005", topic: "Data Interpretation", subtopic: "Pie chart — combine subgroup percentages across two sectors", representation: "PIE_TWO_SECTOR_SUBGROUP_PERCENT_OF_TOTAL_MCQ", notes: "B.Sc C.Sci is 25% of all students and 60% are girls; B.Com is 20% and 60% are girls. Girls in the two courses are 0.60×25%+0.60×20%=27% of all students." }),
  observation({ q: 65, sourceQuestionId: "630680396995", packageId: "TRG-001", topic: "Advanced Mathematics", subtopic: "Right-triangle complementary angles — cotangent of angle sum", representation: "RIGHT_TRIANGLE_ANGLE_SUM_COT_PRODUCT_MCQ", notes: "Since C=90°, A+B=90°. Therefore cot(A+B)=cot90°=0, making the entire product sinA cosB cot(A+B) equal to 0." }),
  observation({ q: 66, sourceQuestionId: "630680285560", packageId: "ALG-002", topic: "Advanced Mathematics", subtopic: "ALG-CP-009 — Three-variable linear system", representation: "THREE_LINEAR_EQUATIONS_THREE_UNKNOWNS_MCQ", notes: "Solving x+2z=3, x+2y+3z=5 and 3x-5z=-13 gives x=-1, y=0 and z=2." }),
  observation({ q: 67, sourceQuestionId: "6306801047985", packageId: "TMW-001", topic: "Arithmetic — Time and Work", subtopic: "Pipes and cisterns — combined time with a rate ratio", representation: "TWO_FILL_PIPES_COMBINED_TIME_RATE_RATIO_MCQ", notes: "Let the slower rate be r and the faster rate 1.5r. Then 2.5r=1/15, so the faster rate is 1/25 tank per minute and the faster pipe alone takes 25 minutes." }),
  observation({ q: 68, sourceQuestionId: "630680178722", packageId: "PNL-001", topic: "Arithmetic — Profit and Loss", subtopic: "PNL-CP-002 — Successive discounts from marked price", representation: "MARKED_PRICE_TWO_SUCCESSIVE_DISCOUNTS_SELLING_PRICE_MCQ", notes: "Selling price=1200×0.85×0.90=₹918." }),
  observation({ q: 69, sourceQuestionId: "630680523743", packageId: "DI-001", topic: "Data Interpretation", subtopic: "Linked table — qualification percentage and subgroup ratio", representation: "TABLE_QUALIFIED_PERCENT_GENDER_RATIO_REVERSE_APPEARED_MCQ", notes: "Female qualified candidates are 7/12 of all qualified candidates, so total qualified=168×12/7=288. Since this is 60% of appeared candidates, appeared=288/0.60=480." }),
  observation({ q: 70, sourceQuestionId: "630680382687", packageId: "INT-001", topic: "Arithmetic — Interest", subtopic: "Repeated fixed annual increment — recover increment from two salary years", representation: "FIXED_ANNUAL_INCREMENT_FROM_TWO_SALARY_LEVELS_MCQ", notes: "The two salary figures are 9 annual increments apart. Increase=₹52,997-₹28,400=₹24,597, so annual increment=24597/9=₹2,733." }),
  observation({ q: 71, sourceQuestionId: "630680428116", packageId: "DI-001", topic: "Data Interpretation", subtopic: "Table — average marks in one subject across students", representation: "TABLE_SINGLE_SUBJECT_AVERAGE_ACROSS_ROWS_MCQ", notes: "The Mathematics scores are 70, 85, 90, 95 and 75. Their average is 415/5=83." }),
  observation({ q: 72, sourceQuestionId: "630680358045", packageId: "MEN-001", topic: "Advanced Mathematics", subtopic: "Circular track — annulus area and levelling cost", representation: "ANNULUS_AREA_RATE_COST_MCQ", notes: "Track area=(22/7)(28²-25²). Multiplying by ₹28 per m² gives 22×(28-25)×(28+25)×4=₹13,992." }),
  observation({ q: 73, sourceQuestionId: "630680108754", packageId: "NUM-001", topic: "Arithmetic — Number System", subtopic: "Division algorithm — linked divisor, quotient and remainder", representation: "DIVISOR_QUOTIENT_REMAINDER_RELATION_DIVIDEND_MCQ", notes: "Remainder=32, so divisor=2×32=64. Since divisor=4×quotient, quotient=16. Dividend=64×16+32=1056." }),
  observation({ q: 74, sourceQuestionId: "630680428186", packageId: "TSD-001", topic: "Arithmetic — Time, Speed & Distance", subtopic: "Race — combine time head start and distance head start", representation: "RACE_TIME_HEADSTART_AND_DISTANCE_HEADSTART_SPEED_RECOVERY_MCQ", notes: "Let Vishu's speed be v and Atul's race time be t. First race gives v(t+20)=765; second gives 711/v=t+8. Hence 54/v=12, so v=4.5 m/s and Vishu's 900 m time is 200 s=3 min 20 s." }),
  observation({ q: 75, sourceQuestionId: "630680455637", packageId: "RAP-001", topic: "Arithmetic — Ratio & Proportion", subtopic: "Ratio distribution — recover one share from difference of two shares", representation: "FOUR_PART_RATIO_DIFFERENCE_TO_TARGET_SHARE_MCQ", notes: "Q-R corresponds to 9-2=7 parts=₹560, so one part is ₹80. S has 3 parts, hence ₹240." }),
] satisfies readonly QuantV4PyqObservation[]);

export const QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_SOURCE_LIMITATIONS = Object.freeze({
  source: "SSC Portal response-sheet PDF mirror — SSC CGL Tier-I 11 Sep 2024 Shift 1",
  evidenceKind: "VERIFIED_PYQ_COLLECTION",
  paperId: PAPER_ID,
  heldDate: "2024-09-11",
  shift: "Shift 1",
  sectionQuestionRange: "normalized Q51-Q75 (source Quant Q1-Q25)",
  newObservationCount: QUANT_V4_CGL_2024_09_11_S1_FULL_QUANT_SECTION_WAVE11_COUNTABLE_PYQ_OBSERVATIONS.length,
  completeSectionQuestionCount: 25,
  paperIdentityResolved: true,
  wholeSectionNormalized: true,
  frequencyCalibrationAllowed: false,
  productionPromotionAuthorized: false,
} as const);
