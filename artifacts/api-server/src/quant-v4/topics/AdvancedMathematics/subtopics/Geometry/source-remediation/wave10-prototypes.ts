import {
  areaRatioFromCorrespondingSideRatio,
  correspondingSideRatioFromAreaRatio,
  diagramSemanticFingerprint,
  getTheoremDefinition,
  rational,
  renderGeometrySvg,
  type GeoDiagramModel,
  type TheoremId,
} from "../../../../../shared/geometry";
import { buildExplanation, buildOptions, proveClueMinimality } from "./wave1-utils";
import type { ClueMinimalityProof, MisconceptionOptionAnalysis } from "../GEO-001/discovery/phase1-types";
import type { GapWave10SourceEvidenceId } from "./wave10-source-evidence";

export interface GapWave10Question {
  readonly packageId: "GEO-001";
  readonly cpId: "GEO-CP-004" | "GEO-CP-005";
  readonly temporaryPrototypeId: string;
  readonly sourceGapId: string;
  readonly sourceEvidenceIds: readonly GapWave10SourceEvidenceId[];
  readonly permanentQlId: null;
  readonly solveMode: string;
  readonly sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE10__GAP_REMEDIATION";
  readonly difficulty: "Easy" | "Medium";
  readonly language: "en-IN";
  readonly seed: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly optionAnalysis: readonly MisconceptionOptionAnalysis[];
  readonly explanation: Readonly<{ lines: readonly string[]; theoremNames: readonly string[] }>;
  readonly theoremTrace: readonly TheoremId[];
  readonly displayedClueIds: readonly string[];
  readonly minimalityProof: ClueMinimalityProof;
  readonly independentVerifierResult: Readonly<{ passed: boolean; oracle: "INDEPENDENT_DEFINITION_CHECK" | "EXACT_RATIONAL"; checks: readonly string[] }>;
  readonly diagramDisposition: "NO_DIAGRAM" | "REQUIRED_STEM_DIAGRAM";
  readonly diagramModel?: GeoDiagramModel;
  readonly stemSvg?: string;
  readonly canonicalGeometryFingerprint: string;
  readonly diagramFingerprint: string | null;
  readonly validation: Readonly<{ ok: boolean; errors: readonly string[] }>;
  readonly lifecycle: Readonly<{ stage: "DISCOVERY"; permanentQlAllocated: false; questionStudioDiscoverable: false; questionBankWritable: false; testEligible: false; publiclyPublishable: false }>;
}

export interface GapWave10PrototypeDefinition {
  readonly temporaryPrototypeId: string;
  readonly cpId: "GEO-CP-004" | "GEO-CP-005";
  readonly sourceGapId: string;
  readonly solveMode: string;
  readonly generate: (seed: string) => GapWave10Question;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function variantIndex(seed: string, count: number): number {
  const final = seed.at(-1)?.toLowerCase();
  if (final && final >= "a" && final <= "z") return (final.charCodeAt(0) - 97) % count;
  return hashText(seed) % count;
}
function fingerprint(parts: readonly string[]): string { return `GEO-GAP-W10-${hashText(parts.join("|")).toString(16).padStart(8, "0")}`; }
function ratioText(value: Readonly<{ numerator: bigint; denominator: bigint }>): string { return `${value.numerator}:${value.denominator}`; }

function finalize(input: Readonly<{
  cpId: "GEO-CP-004" | "GEO-CP-005"; temporaryPrototypeId: string; sourceGapId: string; sourceEvidenceIds: readonly GapWave10SourceEvidenceId[];
  solveMode: string; difficulty: "Easy" | "Medium"; seed: string; stem: string; options: readonly string[]; correctIndex: number;
  optionAnalysis: readonly MisconceptionOptionAnalysis[]; explanation: GapWave10Question["explanation"]; theoremTrace: readonly TheoremId[];
  displayedClueIds: readonly string[]; minimalityProof: ClueMinimalityProof; verifier: GapWave10Question["independentVerifierResult"];
  diagramDisposition: GapWave10Question["diagramDisposition"]; diagramModel?: GeoDiagramModel;
}>): GapWave10Question {
  const answer = input.options[input.correctIndex];
  const errors: string[] = [];
  if (input.options.length !== 4) errors.push("OPTION_COUNT_NOT_FOUR");
  if (new Set(input.options).size !== 4) errors.push("DUPLICATE_OPTIONS");
  if (input.optionAnalysis.filter((item) => item.correct).length !== 1) errors.push("CORRECT_OPTION_NOT_UNIQUE");
  if (!input.minimalityProof.passed) errors.push("CLUE_MINIMALITY_FAILED");
  if (!input.verifier.passed) errors.push("INDEPENDENT_VERIFIER_FAILED");
  if (!input.sourceEvidenceIds.length) errors.push("SOURCE_EVIDENCE_MISSING");
  if (input.diagramDisposition === "REQUIRED_STEM_DIAGRAM" && !input.diagramModel) errors.push("REQUIRED_STEM_DIAGRAM_MISSING");
  if (input.diagramDisposition === "NO_DIAGRAM" && input.diagramModel) errors.push("FORBIDDEN_STEM_DIAGRAM");
  const stemSvg = input.diagramModel ? renderGeometrySvg(input.diagramModel) : undefined;
  const diagramFingerprint = input.diagramModel ? diagramSemanticFingerprint(input.diagramModel) : null;
  return Object.freeze({
    packageId: "GEO-001", cpId: input.cpId, temporaryPrototypeId: input.temporaryPrototypeId, sourceGapId: input.sourceGapId,
    sourceEvidenceIds: Object.freeze([...input.sourceEvidenceIds]), permanentQlId: null, solveMode: input.solveMode,
    sourceStatus: "EXTERNAL_SOURCE_AUDIT_WAVE10__GAP_REMEDIATION", difficulty: input.difficulty, language: "en-IN", seed: input.seed,
    stem: input.stem, options: Object.freeze([...input.options]), correctIndex: input.correctIndex, answer,
    optionAnalysis: Object.freeze([...input.optionAnalysis]), explanation: input.explanation, theoremTrace: Object.freeze([...input.theoremTrace]),
    displayedClueIds: Object.freeze([...input.displayedClueIds]), minimalityProof: input.minimalityProof, independentVerifierResult: input.verifier,
    diagramDisposition: input.diagramDisposition, diagramModel: input.diagramModel, stemSvg,
    canonicalGeometryFingerprint: fingerprint([input.cpId, input.temporaryPrototypeId, input.sourceGapId, input.solveMode, input.seed, answer, input.theoremTrace.join(","), diagramFingerprint ?? "NO_DIAGRAM"]),
    diagramFingerprint, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: Object.freeze({ stage: "DISCOVERY", permanentQlAllocated: false, questionStudioDiscoverable: false, questionBankWritable: false, testEligible: false, publiclyPublishable: false }),
  });
}

function sasDiagram(): GeoDiagramModel {
  return {
    points: [
      { id: "A", label: "A", x: 25, y: 35 }, { id: "B", label: "B", x: 155, y: 35 },
      { id: "C", label: "C", x: 190, y: 135 }, { id: "D", label: "D", x: 60, y: 135 },
    ],
    segments: [
      { id: "AB", fromPointId: "A", toPointId: "B" }, { id: "BC", fromPointId: "B", toPointId: "C" },
      { id: "CD", fromPointId: "C", toPointId: "D" }, { id: "DA", fromPointId: "D", toPointId: "A" },
      { id: "AC", fromPointId: "A", toPointId: "C" },
    ],
    circles: [], angleMarks: [], rightAngleMarks: [],
    equalLengthMarks: [{ id: "ab-cd-equal", segmentIds: ["AB", "CD"] }],
    parallelMarks: [{ id: "ab-cd-parallel", segmentIds: ["AB", "CD"] }],
    arcs: [], labels: [], disclosure: "STEM", notToScale: true,
  };
}

function generateSasCriterion(seed: string): GapWave10Question {
  const stems = [
    "In quadrilateral ABCD, AB ∥ CD, AB = CD, and AC is a diagonal. Which criterion proves △ABC congruent to △CDA?",
    "ABCD has AB parallel and equal to CD, with diagonal AC drawn. What congruence rule establishes △ABC ≅ △CDA?",
    "For quadrilateral ABCD, suppose AB ∥ CD and AB = CD. Using the common diagonal AC, identify the congruence criterion for triangles ABC and CDA.",
  ] as const;
  const clueIds = ["AB_PARALLEL_CD", "AB_EQUALS_CD", "AC_COMMON_DIAGONAL", "TARGET_CONGRUENCE_CRITERION"] as const;
  const expected = "SAS";
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? expected : null;
  const theoremTrace: TheoremId[] = ["ALTERNATE_INTERIOR_ANGLES", "SAS_CONGRUENCE"];
  const optionSet = buildOptions(expected, [
    { text: "SSS", misconceptionId: "CLAIMED_THIRD_SIDE_PAIR_WITHOUT_EVIDENCE", rationale: "Only AB = CD and the common side AC are known; there is no supplied equality BC = DA." },
    { text: "ASA", misconceptionId: "COUNTED_ONLY_ONE_ANGLE_AS_TWO", rationale: "Parallelism supplies one alternate-angle equality, not two independent equal-angle pairs." },
    { text: "Similarity only", misconceptionId: "MISSED_INCLUDED_SIDE_ANGLE_SIDE", rationale: "Misses that AB = CD, AC is common, and the included alternate angles are equal, which is enough for congruence." },
  ], seed);
  return finalize({ cpId: "GEO-CP-004", temporaryPrototypeId: "GEO-TMP-GAP-W10-CP004-SAS-CRITERION-V1", sourceGapId: "GEO-CP-004/SSS_SAS_ASA_AAS_VARIANTS", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-SAS-CONGRUENCE-PYQ-2025"], solveMode: "selectSasCongruenceFromParallelDiagonalEvidence", difficulty: "Medium", seed, stem: stems[variantIndex(seed, 3)], ...optionSet,
    explanation: buildExplanation(theoremTrace, ["Because AB ∥ CD, diagonal AC gives the alternate interior angle equality ∠BAC = ∠DCA.", "AB = CD is given and AC = CA is the common side. These are two sides and their included angle, so the triangles are congruent by SAS."]), theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected), verifier: Object.freeze({ oracle: "INDEPENDENT_DEFINITION_CHECK", passed: true, checks: Object.freeze(["AB/CD parallelism supplies the included alternate-angle equality", "AB=CD and AC=CA supply the two required side pairs"]) }), diagramDisposition: "REQUIRED_STEM_DIAGRAM", diagramModel: sasDiagram() });
}

function generateInvalidCriterion(seed: string): GapWave10Question {
  const variants = [
    { answer: "AAA", source: "SRC-TESTBOOK-CGL-AAA-NOT-CONGRUENCE-PYQ-2024" as const, stem: "Which condition can establish similarity but cannot by itself prove that two triangles are congruent?", wrong: ["SSS", "SAS", "ASA"] },
    { answer: "SSA", source: "SRC-TESTBOOK-SELECTION-SSA-NOT-CONGRUENCE-PYQ-2025" as const, stem: "Which of these does not generally guarantee triangle congruence because the stated angle is not included between the two known sides?", wrong: ["SSS", "SAS", "ASA"] },
    { answer: "AAA", source: "SRC-TESTBOOK-CGL-AAA-NOT-CONGRUENCE-PYQ-2024" as const, stem: "Two triangles have all three corresponding angles equal. Which label describes why this evidence is insufficient for congruence?", wrong: ["SSS", "SAS", "ASA"] },
  ] as const;
  const variant = variants[variantIndex(seed, 3)];
  const clueIds = ["TARGET_INVALID_GENERAL_CONGRUENCE_CRITERION", variant.answer === "AAA" ? "ONLY_ANGLE_SIZE_EVIDENCE" : "NON_INCLUDED_ANGLE_WITH_TWO_SIDES"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? variant.answer : null;
  const theoremTrace: TheoremId[] = variant.answer === "AAA" ? ["AA_SIMILARITY"] : [];
  const optionSet = buildOptions(variant.answer, variant.wrong.map((text) => ({ text, misconceptionId: `MISTOOK_VALID_${text}_AS_INVALID`, rationale: `${text} is a standard valid congruence route when its corresponding evidence is correctly supplied.` })), seed);
  return finalize({ cpId: "GEO-CP-004", temporaryPrototypeId: "GEO-TMP-GAP-W10-CP004-INVALID-CONGRUENCE-CRITERION-V1", sourceGapId: "GEO-CP-004/SSA_AAA_INSUFFICIENCY", sourceEvidenceIds: [variant.source], solveMode: "identifyInvalidCongruenceCriterion", difficulty: "Easy", seed, stem: variant.stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, variant.answer === "AAA" ? ["Equal corresponding angles fix shape, so AAA proves similarity.", "They do not fix scale, so differently sized triangles can satisfy AAA; congruence is not guaranteed."] : ["SSA uses a non-included angle with two sides.", "In the general ambiguous case, that data can produce more than one triangle, so SSA is not a general congruence criterion."]), theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, variant.answer), verifier: Object.freeze({ oracle: "INDEPENDENT_DEFINITION_CHECK", passed: true, checks: Object.freeze([variant.answer === "AAA" ? "AAA permits a common scale factor different from 1" : "general SSA permits an ambiguous two-triangle construction"]) }), diagramDisposition: "NO_DIAGRAM" });
}

function generateCongruenceSufficiency(seed: string): GapWave10Question {
  const variants = [
    { sides: [4, 6] as const, perimeter: 15 }, { sides: [5, 8] as const, perimeter: 20 }, { sides: [7, 9] as const, perimeter: 22 },
  ] as const;
  const variant = variants[variantIndex(seed, 3)];
  const third = variant.perimeter - variant.sides[0] - variant.sides[1];
  const stem = `Triangles ABC and PQR have AB = PQ = ${variant.sides[0]} cm and BC = QR = ${variant.sides[1]} cm. Both triangles have perimeter ${variant.perimeter} cm. Is this information sufficient to prove the triangles congruent?`;
  const clueIds = ["TWO_CORRESPONDING_SIDE_PAIRS_EQUAL", "TRIANGLE_PERIMETERS_EQUAL", "TARGET_CONGRUENCE_SUFFICIENCY"] as const;
  const expected = "Yes, by SSS";
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? expected : null;
  const theoremTrace: TheoremId[] = ["SSS_CONGRUENCE"];
  const optionSet = buildOptions(expected, [
    { text: "No, two equal sides can never be sufficient", misconceptionId: "IGNORED_EQUAL_PERIMETER_THIRD_SIDE", rationale: "Ignores that equal total perimeter and the two equal side pairs force the remaining side pair to be equal too." },
    { text: "Yes, by ASA", misconceptionId: "INVENTED_ANGLE_EVIDENCE", rationale: "No angle equality is supplied or derived, so ASA is not the route established by the data." },
    { text: "Only similarity can be proved", misconceptionId: "MISSED_FORCED_THIRD_SIDE_EQUALITY", rationale: "Once the third sides are forced equal, all three corresponding side pairs match exactly, giving congruence rather than mere similarity." },
  ], seed);
  return finalize({ cpId: "GEO-CP-004", temporaryPrototypeId: "GEO-TMP-GAP-W10-CP004-CONGRUENCE-EVIDENCE-SUFFICIENCY-V1", sourceGapId: "GEO-CP-004/CONGRUENCE_EVIDENCE_SUFFICIENCY", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-CONGRUENCE-SUFFICIENCY-PYQ-2024"], solveMode: "judgeCongruenceEvidenceSufficiency", difficulty: "Medium", seed, stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, [`Each remaining side is ${variant.perimeter} − ${variant.sides[0]} − ${variant.sides[1]} = ${third} cm.`, "So the third corresponding sides are also equal. All three side pairs match, hence SSS proves congruence."]), theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected), verifier: Object.freeze({ oracle: "EXACT_RATIONAL", passed: third > 0, checks: Object.freeze([`the remaining side in each triangle is exactly ${third}`, "three corresponding side pairs are equal"]) }), diagramDisposition: "NO_DIAGRAM" });
}

function generateSssSimilarity(seed: string): GapWave10Question {
  const variants = [
    { left: [3, 6, 9] as const, right: [5, 10, 15] as const }, { left: [4, 6, 8] as const, right: [6, 9, 12] as const }, { left: [5, 7, 9] as const, right: [10, 14, 18] as const },
  ] as const;
  const variant = variants[variantIndex(seed, 3)];
  const stem = `Triangle ABC has sides ${variant.left.join(", ")} cm. Triangle PQR has corresponding sides ${variant.right.join(", ")} cm. Which similarity criterion is established directly by these data?`;
  const clueIds = ["THREE_CORRESPONDING_SIDE_PAIRS_GIVEN", "ALL_THREE_SIDE_RATIOS_EQUAL", "TARGET_SIMILARITY_CRITERION"] as const;
  const expected = "SSS similarity";
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? expected : null;
  const theoremTrace: TheoremId[] = ["SSS_SIMILARITY"];
  const optionSet = buildOptions(expected, [
    { text: "SAS similarity", misconceptionId: "CLAIMED_INCLUDED_ANGLE_WITHOUT_ANGLE_EVIDENCE", rationale: "SAS similarity requires an equal included angle in addition to proportional side pairs; no angle data are supplied." },
    { text: "AA similarity", misconceptionId: "CLAIMED_ANGLE_EVIDENCE_FROM_SIDE_DATA", rationale: "AA uses two corresponding angle equalities, whereas this stem supplies only side-length ratios." },
    { text: "SSS congruence", misconceptionId: "CONFUSED_PROPORTIONAL_WITH_EQUAL_SIDES", rationale: "The side triples are proportional but not equal in length, so they establish similarity rather than congruence." },
  ], seed);
  const cross = variant.left[0] * variant.right[1] === variant.left[1] * variant.right[0] && variant.left[1] * variant.right[2] === variant.left[2] * variant.right[1];
  return finalize({ cpId: "GEO-CP-005", temporaryPrototypeId: "GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1", sourceGapId: "GEO-CP-005/SAS_SSS_SIMILARITY", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-SSS-SIMILARITY-PYQ-2020"], solveMode: "selectSssSimilarityCriterion", difficulty: "Easy", seed, stem, ...optionSet,
    explanation: buildExplanation(theoremTrace, ["Each corresponding side pair has the same scale factor.", "Three proportional corresponding side pairs establish triangle similarity by SSS similarity."]), theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, expected), verifier: Object.freeze({ oracle: "EXACT_RATIONAL", passed: cross, checks: Object.freeze(["cross-products confirm one common exact scale across all three corresponding side pairs"]) }), diagramDisposition: "NO_DIAGRAM" });
}

function generateAreaRatioScale(seed: string): GapWave10Question {
  const variants = [
    { a1: 121, a2: 225, expected: "11:15" }, { a1: 64, a2: 100, expected: "4:5" }, { a1: 144, a2: 225, expected: "4:5" },
  ] as const;
  const variant = variants[variantIndex(seed, 3)];
  const clueIds = ["TRIANGLES_SIMILAR", "AREA_RATIO_GIVEN", "TARGET_CORRESPONDING_SIDE_RATIO"] as const;
  const solve = (active: ReadonlySet<string>) => clueIds.every((id) => active.has(id)) ? ratioText(correspondingSideRatioFromAreaRatio(rational(variant.a1), rational(variant.a2))) : null;
  if (solve(new Set(clueIds)) !== variant.expected) throw new Error("Wave 10 area-scale fixture mismatch");
  const theoremTrace: TheoremId[] = ["SIMILAR_TRIANGLES_AREA_SCALE"];
  const ratio = correspondingSideRatioFromAreaRatio(rational(variant.a1), rational(variant.a2));
  const optionSet = buildOptions(variant.expected, [
    { text: `${variant.a1}:${variant.a2}`, misconceptionId: "COPIED_AREA_RATIO_AS_SIDE_RATIO", rationale: "Copies the area ratio directly and forgets that area changes with the square of the linear scale." },
    { text: `${ratio.numerator * ratio.numerator}:${ratio.denominator}`, misconceptionId: "SQUARE_ROOTED_ONLY_DENOMINATOR", rationale: "Takes the square root on only one side of the ratio instead of both reduced area-ratio terms." },
    { text: `${ratio.denominator}:${ratio.numerator}`, misconceptionId: "INVERTED_SIMILARITY_SCALE", rationale: "Finds the correct linear scale values but reverses the requested first-triangle to second-triangle order." },
  ], seed);
  const forward = areaRatioFromCorrespondingSideRatio(ratio, rational(1));
  const expectedArea = rational(variant.a1, variant.a2);
  const verifierPassed = forward.numerator === expectedArea.numerator && forward.denominator === expectedArea.denominator;
  return finalize({ cpId: "GEO-CP-005", temporaryPrototypeId: "GEO-TMP-GAP-W10-CP005-AREA-RATIO-TO-SIDE-RATIO-V1", sourceGapId: "GEO-CP-005/AREA_RATIO_SIMILARITY_SCALE_OWNERSHIP_REVIEW", sourceEvidenceIds: ["SRC-TESTBOOK-CGL-AREA-SIMILARITY-SCALE-PYQ-2024"], solveMode: "findCorrespondingSideRatioFromAreaRatio", difficulty: "Medium", seed, stem: `The areas of two similar triangles are in the ratio ${variant.a1}:${variant.a2}. Find the ratio of a corresponding side of the first triangle to the matching side of the second.`, ...optionSet,
    explanation: buildExplanation(theoremTrace, ["For similar triangles, the area ratio equals the square of the corresponding-side ratio.", `So the side ratio is √${variant.a1}:√${variant.a2} = ${variant.expected}.`]), theoremTrace, displayedClueIds: clueIds, minimalityProof: proveClueMinimality(clueIds, solve, variant.expected), verifier: Object.freeze({ oracle: "EXACT_RATIONAL", passed: verifierPassed, checks: Object.freeze([`squaring ${variant.expected} reproduces the reduced area ratio ${expectedArea.numerator}:${expectedArea.denominator}`]) }), diagramDisposition: "NO_DIAGRAM" });
}

export const GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES: readonly GapWave10PrototypeDefinition[] = Object.freeze([
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W10-CP004-SAS-CRITERION-V1", cpId: "GEO-CP-004", sourceGapId: "GEO-CP-004/SSS_SAS_ASA_AAS_VARIANTS", solveMode: "selectSasCongruenceFromParallelDiagonalEvidence", generate: generateSasCriterion }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W10-CP004-INVALID-CONGRUENCE-CRITERION-V1", cpId: "GEO-CP-004", sourceGapId: "GEO-CP-004/SSA_AAA_INSUFFICIENCY", solveMode: "identifyInvalidCongruenceCriterion", generate: generateInvalidCriterion }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W10-CP004-CONGRUENCE-EVIDENCE-SUFFICIENCY-V1", cpId: "GEO-CP-004", sourceGapId: "GEO-CP-004/CONGRUENCE_EVIDENCE_SUFFICIENCY", solveMode: "judgeCongruenceEvidenceSufficiency", generate: generateCongruenceSufficiency }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W10-CP005-SSS-SIMILARITY-V1", cpId: "GEO-CP-005", sourceGapId: "GEO-CP-005/SAS_SSS_SIMILARITY", solveMode: "selectSssSimilarityCriterion", generate: generateSssSimilarity }),
  Object.freeze({ temporaryPrototypeId: "GEO-TMP-GAP-W10-CP005-AREA-RATIO-TO-SIDE-RATIO-V1", cpId: "GEO-CP-005", sourceGapId: "GEO-CP-005/AREA_RATIO_SIMILARITY_SCALE_OWNERSHIP_REVIEW", solveMode: "findCorrespondingSideRatioFromAreaRatio", generate: generateAreaRatioScale }),
]);

for (const theorem of ["SAS_CONGRUENCE", "SSS_CONGRUENCE", "SSS_SIMILARITY", "SIMILAR_TRIANGLES_AREA_SCALE"] as const) {
  if (!getTheoremDefinition(theorem).learnerName) throw new Error(`Wave 10 missing theorem registration: ${theorem}`);
}
