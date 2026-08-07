import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMenCp011ReviewBatch } from "./exam-readiness-batch";
import { getMenCp011FoundationPrototypeIds } from "./registry";
import {
  generateMenCp011SurfaceReviewBatch,
  getMenCp011SurfacePrototypeIds,
} from "./surface-area-runtime";
import { getMenCp011MeasurementProfiles } from "./measurement-profiles";
import {
  getMenCp011PhysicalStateCatalog,
  menCp011PhysicalStateKey,
} from "./state-pool";

export const MEN_CP011_CHAPTER_AUDIT_AUTHORITY =
  "MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V1" as const;

const INITIAL_DISCOVERY_PROTOTYPES = [
  "MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA",
  "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA",
  "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
  "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME",
  "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-PIPE-CURVED-AREA-BOTH-SIDES",
  "MEN-CP011-PROT-HOLLOW-PIPE-TSA-WITH-ANNULAR-ENDS",
  "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
  "MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA",
  "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST",
  "MEN-CP011-PROT-INNER-LINING-COST",
  "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO",
  "MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE",
] as const;

const DISCOVERY_STATUS: Record<
  (typeof INITIAL_DISCOVERY_PROTOTYPES)[number],
  "IMPLEMENTED" | "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY" | "MISSING"
> = {
  "MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA": "MISSING",
  "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA": "MISSING",
  "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA": "MISSING",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME": "MISSING",
  "MEN-CP011-PROT-HOLLOW-PIPE-CURVED-AREA-BOTH-SIDES":
    "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY",
  "MEN-CP011-PROT-HOLLOW-PIPE-TSA-WITH-ANNULAR-ENDS":
    "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY",
  "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME": "MISSING",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME": "MISSING",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME": "MISSING",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME": "MISSING",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA": "MISSING",
  "MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA": "MISSING",
  "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST": "MISSING",
  "MEN-CP011-PROT-INNER-LINING-COST": "MISSING",
  "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO": "MISSING",
  "MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE": "MISSING",
};

type AuditQuestion = {
  prototypeId: string;
  solveMode: string;
  target: string;
  stem: string;
  answer: string;
  correctIndex: number;
  options: Array<{
    label: "A" | "B" | "C" | "D";
    display: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }>;
  difficulty: string;
  piPolicy: string;
  permanentQlId: null;
  reviewStatus: string;
  questionBankStatus: string;
  testEligibility: string;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  validation: { valid: boolean };
  verification: { valid: boolean };
  measurementProfile: {
    id: string;
    mixedUnits: boolean;
    radialUnit: string;
    heightUnit: string;
  };
  state: {
    outerRadius: bigint;
    innerRadius: bigint;
    height: bigint;
    thickness: bigint;
  };
  learnerSolution: {
    formula: string;
    steps: string[];
    finalAnswer: string;
    shortcut: string;
    wrongOptionAnalysis: string[];
  };
  renderSurfaces: {
    attempt: { diagram: null; exposesInternalCodes: false };
    practice: { exposesInternalCodes: false };
    solution: { exposesInternalCodes: false };
    admin: { exposesInternalCodes: true; trapCodes: string[] };
  };
};

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+(?:\.\d+)?/g, "<number>")
    .replace(/\s+/g, " ")
    .trim();
}

function questionOptionKey(question: AuditQuestion) {
  return [question.stem, ...question.options.map((option) => option.display)].join("\n");
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function learnerText(question: AuditQuestion) {
  return [
    question.stem,
    ...question.options.map((option) => option.display),
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
}

function learnerTextIsClean(question: AuditQuestion) {
  const text = learnerText(question);
  return (
    !text.includes("\\pih") &&
    !/=\$[^$]+\$\$$/.test(text) &&
    (text.match(/\$/g) ?? []).length % 2 === 0 &&
    !/\[[A-Z0-9_]+\]/.test(text) &&
    !/MEN-CP011-PROT|misconceptionId|FALLBACK_|UNCLASSIFIED/.test(text) &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)
  );
}

function surfaceAreaPrototype(prototypeId: string) {
  return prototypeId.includes("SURFACE") || prototypeId.includes("ANNULAR");
}

const foundationBatch = generateMenCp011ReviewBatch(
  "men-cp011-chapter-audit-foundation-v1",
  12,
);
const surfaceBatch = generateMenCp011SurfaceReviewBatch(
  "men-cp011-chapter-audit-surface-v1",
  12,
);
const records = [
  ...foundationBatch.records,
  ...surfaceBatch.records,
] as unknown as AuditQuestion[];

const prototypeIds = [
  ...getMenCp011FoundationPrototypeIds(),
  ...getMenCp011SurfacePrototypeIds(),
];
const profileIds = getMenCp011MeasurementProfiles().map((profile) => profile.id);
const exactStems = records.map((question) => question.stem);
const questionOptionPackages = records.map(questionOptionKey);
const normalizedCounts = new Map<string, number>();
for (const question of records) {
  const key = normalizeStem(question.stem);
  normalizedCounts.set(key, (normalizedCounts.get(key) ?? 0) + 1);
}

const answerPositionCounts = { A: 0, B: 0, C: 0, D: 0 };
const profileCounts = Object.fromEntries(profileIds.map((id) => [id, 0])) as Record<
  string,
  number
>;
const prototypeProfileCounts = Object.fromEntries(
  prototypeIds.flatMap((prototypeId) =>
    profileIds.map((profileId) => [`${prototypeId}|${profileId}`, 0]),
  ),
) as Record<string, number>;
const prototypeAnswerCounts = Object.fromEntries(
  prototypeIds.map((prototypeId) => [prototypeId, { A: 0, B: 0, C: 0, D: 0 }]),
) as Record<string, Record<"A" | "B" | "C" | "D", number>>;

for (const question of records) {
  const label = question.options[question.correctIndex]!.label;
  answerPositionCounts[label] += 1;
  profileCounts[question.measurementProfile.id] += 1;
  prototypeProfileCounts[`${question.prototypeId}|${question.measurementProfile.id}`] += 1;
  prototypeAnswerCounts[question.prototypeId]![label] += 1;
}

const learnerWordCounts = records.map((question) =>
  words([
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join(" ")),
);
const stemWordCounts = records.map((question) => words(question.stem));
const physicalStateKeys = records.map((question) =>
  menCp011PhysicalStateKey({
    outerRadius: question.state.outerRadius,
    innerRadius: question.state.innerRadius,
    height: question.state.height,
    thickness: question.state.thickness,
  }),
);

const implementedInitialCount = Object.values(DISCOVERY_STATUS).filter(
  (status) => status !== "MISSING",
).length;
const missingInitialPrototypes = INITIAL_DISCOVERY_PROTOTYPES.filter(
  (prototypeId) => DISCOVERY_STATUS[prototypeId] === "MISSING",
);

const coverageAxes = {
  hollowPipeMaterialVolume: "COVERED",
  hollowPipeSurfaceExposure: "COVERED",
  radiusDiameterThicknessRepresentations: "COVERED",
  centimetreMetreAndMixedUnits: "COVERED",
  exactPiAndDeclared22Over7: "COVERED",
  openContainers: "MISSING",
  joinedAndPlacedSolids: "MISSING",
  hollowCubeCuboidSphereHemisphereCone: "MISSING",
  inverseThicknessAndInverseLength: "MISSING",
  costRateCountRatioPercentApplications: "MISSING",
  declaredPi314: "MISSING",
} as const;

const blockers = [
  "CHAPTER_COVERAGE_INCOMPLETE",
  "DIRECT_SOURCE_NORMALISATION_PENDING",
  "PERMANENT_QLS_UNALLOCATED",
  "MANUAL_ENGLISH_REVIEW_PENDING",
] as const;

const audit = {
  auditAuthority: MEN_CP011_CHAPTER_AUDIT_AUTHORITY,
  sourceCommit: process.env.GITHUB_SHA ?? "LOCAL_OR_UNSPECIFIED",
  runtimePrototypeCount: prototypeIds.length,
  foundationPrototypeCount: getMenCp011FoundationPrototypeIds().length,
  surfacePrototypeCount: getMenCp011SurfacePrototypeIds().length,
  recordCount: records.length,
  foundationRecordCount: foundationBatch.records.length,
  surfaceRecordCount: surfaceBatch.records.length,
  uniqueExactStemCount: new Set(exactStems).size,
  uniqueQuestionOptionPackageCount: new Set(questionOptionPackages).size,
  normalizedStemGroupCount: normalizedCounts.size,
  maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
  physicalStateCatalogSize: getMenCp011PhysicalStateCatalog().length,
  representedPhysicalStateCount: new Set(physicalStateKeys).size,
  measurementProfileCount: profileIds.length,
  mixedUnitRecordCount: records.filter(
    (question) => question.measurementProfile.mixedUnits,
  ).length,
  answerPositionCounts,
  measurementProfileCounts: profileCounts,
  prototypeProfileCounts,
  prototypeAnswerCounts,
  minimumStemWordCount: Math.min(...stemWordCounts),
  maximumStemWordCount: Math.max(...stemWordCounts),
  averageStemWordCount:
    Math.round((stemWordCounts.reduce((sum, count) => sum + count, 0) / records.length) * 10) / 10,
  minimumLearnerSolutionWordCount: Math.min(...learnerWordCounts),
  maximumLearnerSolutionWordCount: Math.max(...learnerWordCounts),
  averageLearnerSolutionWordCount:
    Math.round((learnerWordCounts.reduce((sum, count) => sum + count, 0) / records.length) * 10) / 10,
  technicallyCleanLearnerRecords: records.filter(learnerTextIsClean).length,
  initialDiscoveryPrototypeCount: INITIAL_DISCOVERY_PROTOTYPES.length,
  implementedInitialDiscoveryPrototypeCount: implementedInitialCount,
  missingInitialDiscoveryPrototypeCount: missingInitialPrototypes.length,
  missingInitialPrototypes,
  discoveryStatus: DISCOVERY_STATUS,
  coverageAxes,
  pipeCoreCoverageComplete: true,
  chapterCoverageComplete: false,
  automatedEnglishStatus: "TECHNICALLY_CLEAN_HUMAN_REVIEW_REQUIRED",
  humanEnglishApproval: false,
  permanentQlCount: 0,
  publicationEligible: false,
  blockers,
};

assert.equal(records.length, 120);
assert.equal(prototypeIds.length, 10);
assert.equal(getMenCp011FoundationPrototypeIds().length, 4);
assert.equal(getMenCp011SurfacePrototypeIds().length, 6);
assert.equal(new Set(exactStems).size, 120);
assert.equal(new Set(questionOptionPackages).size, 120);
assert.ok(audit.maximumNormalizedStemRepetition <= 3);
assert.equal(audit.physicalStateCatalogSize, 72);
assert.equal(audit.representedPhysicalStateCount, 72);
assert.deepEqual(answerPositionCounts, { A: 30, B: 30, C: 30, D: 30 });
assert.ok(Object.values(profileCounts).every((count) => count === 30));
assert.ok(Object.values(prototypeProfileCounts).every((count) => count === 3));
assert.ok(
  Object.values(prototypeAnswerCounts).every((counts) =>
    Object.values(counts).every((count) => count === 3),
  ),
);
assert.equal(audit.mixedUnitRecordCount, 60);
assert.equal(audit.technicallyCleanLearnerRecords, 120);
assert.ok(records.every((question) => question.validation.valid));
assert.ok(records.every((question) => question.verification.valid));
assert.ok(records.every((question) => question.options.length === 4));
assert.ok(
  records.every(
    (question) =>
      new Set(question.options.map((option) => option.display)).size === 4 &&
      question.options.filter((option) => option.isCorrect).length === 1 &&
      question.options[question.correctIndex]?.isCorrect === true,
  ),
);
assert.ok(records.every((question) => question.learnerSolution.wrongOptionAnalysis.length === 3));
assert.ok(records.every((question) => question.renderSurfaces.attempt.diagram === null));
assert.ok(records.every((question) => question.renderSurfaces.attempt.exposesInternalCodes === false));
assert.ok(records.every((question) => question.renderSurfaces.practice.exposesInternalCodes === false));
assert.ok(records.every((question) => question.renderSurfaces.solution.exposesInternalCodes === false));
assert.ok(records.every((question) => question.renderSurfaces.admin.exposesInternalCodes === true));
assert.ok(records.every((question) => question.permanentQlId === null));
assert.ok(records.every((question) => question.questionBankStatus === "NOT_STORED"));
assert.ok(records.every((question) => question.testEligibility === "INELIGIBLE"));
assert.ok(records.every((question) => question.publiclyPublishable === false));
assert.ok(records.every((question) => question.questionStudioDiscoverable === false));
assert.ok(stemWordCounts.every((count) => count >= 12 && count <= 100));
assert.ok(learnerWordCounts.every((count) => count >= 20 && count <= 220));
assert.equal(audit.pipeCoreCoverageComplete, true);
assert.equal(audit.chapterCoverageComplete, false);
assert.equal(missingInitialPrototypes.length, 14);
assert.ok(blockers.includes("CHAPTER_COVERAGE_INCOMPLETE"));
assert.ok(blockers.includes("MANUAL_ENGLISH_REVIEW_PENDING"));
assert.ok(records.some((question) => surfaceAreaPrototype(question.prototypeId)));

const reviewRows = records.map((question, index) => ({
  reviewId: `MEN-CP011-CHAPTER-AUDIT-${String(index + 1).padStart(3, "0")}`,
  prototypeId: question.prototypeId,
  solveMode: question.solveMode,
  target: question.target,
  difficulty: question.difficulty,
  piPolicy: question.piPolicy,
  measurementProfile: question.measurementProfile.id,
  dimensions: {
    outerRadius: question.state.outerRadius.toString(),
    innerRadius: question.state.innerRadius.toString(),
    thickness: question.state.thickness.toString(),
    height: question.state.height.toString(),
    radialUnit: question.measurementProfile.radialUnit,
    heightUnit: question.measurementProfile.heightUnit,
  },
  stem: question.stem,
  options: question.options.map((option) => ({
    label: option.label,
    display: option.display,
    isCorrect: option.isCorrect,
  })),
  answer: question.answer,
  learnerSolution: question.learnerSolution,
  automatedEnglishChecks: {
    learnerTextClean: learnerTextIsClean(question),
    stemWordCount: words(question.stem),
    learnerSolutionWordCount: words([
      question.learnerSolution.formula,
      ...question.learnerSolution.steps,
      question.learnerSolution.shortcut,
      ...question.learnerSolution.wrongOptionAnalysis,
    ].join(" ")),
  },
}));

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });
writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-audit.json"),
  `${JSON.stringify({ audit, reviewRows }, null, 2)}\n`,
  "utf8",
);

const missingRows = missingInitialPrototypes
  .map((prototypeId, index) => `${index + 1}. \`${prototypeId}\``)
  .join("\n");
const prototypeSummary = prototypeIds
  .map((prototypeId) => {
    const count = records.filter((question) => question.prototypeId === prototypeId).length;
    return `- \`${prototypeId}\`: ${count} review records`;
  })
  .join("\n");
const sampleRows = prototypeIds
  .map((prototypeId) => {
    const sample = records.find((question) => question.prototypeId === prototypeId)!;
    return [
      `### ${prototypeId}`,
      "",
      sample.stem,
      "",
      ...sample.options.map((option) => `- ${option.label}. ${option.display}`),
      "",
      `**Answer:** ${sample.answer}`,
      "",
      `**Learner formula:** ${sample.learnerSolution.formula}`,
    ].join("\n");
  })
  .join("\n\n");

const markdown = `# MEN-CP-011 Chapter-Wide Coverage and English Audit\n\n` +
  `Authority: **${MEN_CP011_CHAPTER_AUDIT_AUTHORITY}**  \n` +
  `Source commit: **${audit.sourceCommit}**  \n` +
  `Permanent QLs: **0**  \n` +
  `Publication: **blocked**\n\n` +
  `## Verdict\n\n` +
  `The implemented hollow-pipe core is technically strong and internally complete for its present scope: material volume, inverse inner radius, unit/representation variants, and all principal pipe surface-exposure combinations. It is **not yet the complete MEN-CP-011 chapter** defined by the executable discovery plan.\n\n` +
  `Automated English checks passed for **${audit.technicallyCleanLearnerRecords}/${audit.recordCount}** review records, but this does not replace human editorial approval.\n\n` +
  `## Executable inventory\n\n` +
  `- Runtime prototypes: ${audit.runtimePrototypeCount}\n` +
  `- Review records: ${audit.recordCount}\n` +
  `- Unique exact stems: ${audit.uniqueExactStemCount}\n` +
  `- Unique stem-option packages: ${audit.uniqueQuestionOptionPackageCount}\n` +
  `- Physical-state catalogue represented: ${audit.representedPhysicalStateCount}/${audit.physicalStateCatalogSize}\n` +
  `- Mixed-unit records: ${audit.mixedUnitRecordCount}\n` +
  `- Answer positions: A${answerPositionCounts.A} B${answerPositionCounts.B} C${answerPositionCounts.C} D${answerPositionCounts.D}\n` +
  `- Average stem length: ${audit.averageStemWordCount} words\n` +
  `- Average learner-solution length: ${audit.averageLearnerSolutionWordCount} words\n\n` +
  `## Implemented prototype review matrix\n\n${prototypeSummary}\n\n` +
  `## Coverage decision\n\n` +
  `The initial discovery plan named ${audit.initialDiscoveryPrototypeCount} architecture candidates. ` +
  `${audit.implementedInitialDiscoveryPrototypeCount} are implemented directly or by an equivalent pipe-surface authority; ${audit.missingInitialDiscoveryPrototypeCount} remain uncovered.\n\n` +
  `### Missing initial discovery families\n\n${missingRows}\n\n` +
  `Additional unresolved axes include declared π = 3.14, inverse thickness/length, non-cylindrical shells, open containers, joined/placed solids, and cost/rate/count/ratio/percentage applications.\n\n` +
  `## English decision\n\n` +
  `The automated audit found no malformed \\pih command, unbalanced learner MathJax delimiters, nested answer delimiters, learner-visible misconception codes, fallback IDs, duplicate exact stems, duplicate stem-option packages, option-key failures, or learner/admin surface leakage.\n\n` +
  `Human review is still required for exam naturalness, wording tone, explanation usefulness, distractor plausibility and difficulty calibration. Therefore English remains **unfrozen**.\n\n` +
  `## Active blockers\n\n` + blockers.map((blocker) => `- \`${blocker}\``).join("\n") +
  `\n\n## Representative records\n\n${sampleRows}\n`;

writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-review.md"),
  markdown,
  "utf8",
);

console.log(
  `MEN-CP-011 chapter-wide audit passed for ${records.length} review records across ${prototypeIds.length} implemented prototypes. Pipe-core coverage is complete, chapter coverage remains incomplete, permanent QLs remain 0 and English remains pending human review.`,
);
