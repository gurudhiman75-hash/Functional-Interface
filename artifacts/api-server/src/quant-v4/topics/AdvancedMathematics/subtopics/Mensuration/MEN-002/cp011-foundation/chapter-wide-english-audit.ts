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

const DISCOVERY_STATUS = {
  "MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA": "MISSING",
  "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA": "MISSING",
  "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA": "MISSING",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME": "MISSING",
  "MEN-CP011-PROT-HOLLOW-PIPE-CURVED-AREA-BOTH-SIDES": "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY",
  "MEN-CP011-PROT-HOLLOW-PIPE-TSA-WITH-ANNULAR-ENDS": "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY",
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
} as const;

const BLOCKERS = [
  "CHAPTER_COVERAGE_INCOMPLETE",
  "DIRECT_SOURCE_NORMALISATION_PENDING",
  "PERMANENT_QLS_UNALLOCATED",
  "MANUAL_ENGLISH_REVIEW_PENDING",
] as const;

type Question = any;
const foundationBatch = generateMenCp011ReviewBatch(
  "men-cp011-chapter-audit-foundation-v1",
  12,
);
const surfaceBatch = generateMenCp011SurfaceReviewBatch(
  "men-cp011-chapter-audit-surface-v1",
  12,
);
const foundationRecords = foundationBatch.records as Question[];
const surfaceRecords = surfaceBatch.records as Question[];
const records = [...foundationRecords, ...surfaceRecords];
const prototypeIds = [
  ...getMenCp011FoundationPrototypeIds(),
  ...getMenCp011SurfacePrototypeIds(),
];
const profiles = getMenCp011MeasurementProfiles();

function thicknessOf(question: Question): bigint {
  return question.state.thickness ??
    question.state.outerRadius - question.state.innerRadius;
}

function physicalStateKey(question: Question) {
  return menCp011PhysicalStateKey({
    outerRadius: question.state.outerRadius,
    innerRadius: question.state.innerRadius,
    height: question.state.height,
    thickness: thicknessOf(question),
  });
}

function normalizeStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+(?:\.\d+)?/g, "<number>")
    .replace(/\s+/g, " ")
    .trim();
}

function exactPackageKey(question: Question) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
  ].join("\n");
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function learnerText(question: Question) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
    question.learnerSolution.formula,
    ...question.learnerSolution.steps,
    question.learnerSolution.finalAnswer,
    question.learnerSolution.shortcut,
    ...question.learnerSolution.wrongOptionAnalysis,
  ].join("\n");
}

function technicallyClean(question: Question) {
  const text = learnerText(question);
  return !text.includes("\\pih") &&
    !/=\$[^$]+\$\$$/.test(text) &&
    (text.match(/\$/g) ?? []).length % 2 === 0 &&
    !/\[[A-Z0-9_]+\]/.test(text) &&
    !/MEN-CP011-PROT|misconceptionId|FALLBACK_|UNCLASSIFIED/.test(text) &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text);
}

const exactStems = records.map((question) => question.stem);
const exactPackages = records.map(exactPackageKey);
const normalizedCounts = new Map<string, number>();
for (const question of records) {
  const key = normalizeStem(question.stem);
  normalizedCounts.set(key, (normalizedCounts.get(key) ?? 0) + 1);
}

const answerPositionCounts = { A: 0, B: 0, C: 0, D: 0 };
const profileCounts = Object.fromEntries(
  profiles.map((profile) => [profile.id, 0]),
) as Record<string, number>;
const prototypeProfileCounts = Object.fromEntries(
  prototypeIds.flatMap((prototypeId) =>
    profiles.map((profile) => [`${prototypeId}|${profile.id}`, 0]),
  ),
) as Record<string, number>;
const prototypeAnswerCounts = Object.fromEntries(
  prototypeIds.map((prototypeId) => [
    prototypeId,
    { A: 0, B: 0, C: 0, D: 0 },
  ]),
) as Record<string, Record<"A" | "B" | "C" | "D", number>>;

for (const question of records) {
  const label = question.options[question.correctIndex].label as
    "A" | "B" | "C" | "D";
  answerPositionCounts[label] += 1;
  profileCounts[question.measurementProfile.id] += 1;
  prototypeProfileCounts[
    `${question.prototypeId}|${question.measurementProfile.id}`
  ] += 1;
  prototypeAnswerCounts[question.prototypeId][label] += 1;
}

const stemWordCounts = records.map((question) => wordCount(question.stem));
const solutionWordCounts = records.map((question) => wordCount([
  question.learnerSolution.formula,
  ...question.learnerSolution.steps,
  question.learnerSolution.shortcut,
  ...question.learnerSolution.wrongOptionAnalysis,
].join(" ")));
const missingInitialPrototypes = Object.entries(DISCOVERY_STATUS)
  .filter(([, status]) => status === "MISSING")
  .map(([prototypeId]) => prototypeId);

const audit = {
  auditAuthority: MEN_CP011_CHAPTER_AUDIT_AUTHORITY,
  sourceCommit: process.env.GITHUB_SHA ?? "LOCAL_OR_UNSPECIFIED",
  runtimePrototypeCount: prototypeIds.length,
  foundationPrototypeCount: getMenCp011FoundationPrototypeIds().length,
  surfacePrototypeCount: getMenCp011SurfacePrototypeIds().length,
  recordCount: records.length,
  foundationRecordCount: foundationRecords.length,
  surfaceRecordCount: surfaceRecords.length,
  uniqueExactStemCount: new Set(exactStems).size,
  uniqueQuestionOptionPackageCount: new Set(exactPackages).size,
  normalizedStemGroupCount: normalizedCounts.size,
  maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
  statePoolAuthoritySize: getMenCp011PhysicalStateCatalog().length,
  foundationDistinctGeneratedStateCount:
    new Set(foundationRecords.map(physicalStateKey)).size,
  surfaceDistinctGeneratedStateCount:
    new Set(surfaceRecords.map(physicalStateKey)).size,
  combinedDistinctGeneratedStateCount:
    new Set(records.map(physicalStateKey)).size,
  measurementProfileCount: profiles.length,
  mixedUnitRecordCount: records.filter(
    (question) => question.measurementProfile.mixedUnits,
  ).length,
  answerPositionCounts,
  measurementProfileCounts: profileCounts,
  prototypeProfileCounts,
  prototypeAnswerCounts,
  minimumStemWordCount: Math.min(...stemWordCounts),
  maximumStemWordCount: Math.max(...stemWordCounts),
  averageStemWordCount: Math.round(
    stemWordCounts.reduce((sum, value) => sum + value, 0) /
      records.length * 10,
  ) / 10,
  minimumLearnerSolutionWordCount: Math.min(...solutionWordCounts),
  maximumLearnerSolutionWordCount: Math.max(...solutionWordCounts),
  averageLearnerSolutionWordCount: Math.round(
    solutionWordCounts.reduce((sum, value) => sum + value, 0) /
      records.length * 10,
  ) / 10,
  technicallyCleanLearnerRecords: records.filter(technicallyClean).length,
  initialDiscoveryPrototypeCount: Object.keys(DISCOVERY_STATUS).length,
  implementedInitialDiscoveryPrototypeCount: Object.values(DISCOVERY_STATUS)
    .filter((status) => status !== "MISSING").length,
  missingInitialDiscoveryPrototypeCount: missingInitialPrototypes.length,
  missingInitialPrototypes,
  discoveryStatus: DISCOVERY_STATUS,
  coverageAxes: {
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
  },
  pipeCoreCoverageComplete: true,
  chapterCoverageComplete: false,
  automatedEnglishStatus: "TECHNICALLY_CLEAN_HUMAN_REVIEW_REQUIRED",
  humanEnglishApproval: false,
  permanentQlCount: 0,
  publicationEligible: false,
  blockers: BLOCKERS,
};

assert.equal(audit.recordCount, 120);
assert.equal(audit.runtimePrototypeCount, 10);
assert.equal(audit.foundationRecordCount, 48);
assert.equal(audit.surfaceRecordCount, 72);
assert.equal(audit.uniqueExactStemCount, 120);
assert.equal(audit.uniqueQuestionOptionPackageCount, 120);
assert.ok(audit.maximumNormalizedStemRepetition <= 3);
assert.equal(audit.statePoolAuthoritySize, 72);
assert.equal(audit.foundationDistinctGeneratedStateCount, 48);
assert.equal(audit.surfaceDistinctGeneratedStateCount, 72);
assert.equal(audit.combinedDistinctGeneratedStateCount, 72);
assert.deepEqual(answerPositionCounts, { A: 30, B: 30, C: 30, D: 30 });
assert.ok(Object.values(profileCounts).every((count) => count === 30));
assert.ok(Object.values(prototypeProfileCounts).every((count) => count === 3));
assert.ok(Object.values(prototypeAnswerCounts).every((counts) =>
  Object.values(counts).every((count) => count === 3)
));
assert.equal(audit.mixedUnitRecordCount, 60);
assert.equal(audit.technicallyCleanLearnerRecords, 120);
assert.ok(records.every((question) =>
  question.validation.valid && question.verification.valid
));
assert.ok(records.every((question) =>
  question.options.length === 4 &&
  new Set(question.options.map((option: any) => option.display)).size === 4 &&
  question.options.filter((option: any) => option.isCorrect).length === 1 &&
  question.options[question.correctIndex].isCorrect === true
));
assert.ok(records.every((question) =>
  question.learnerSolution.wrongOptionAnalysis.length === 3
));
assert.ok(records.every((question) =>
  question.renderSurfaces.attempt.diagram === null &&
  !question.renderSurfaces.attempt.exposesInternalCodes &&
  !question.renderSurfaces.practice.exposesInternalCodes &&
  !question.renderSurfaces.solution.exposesInternalCodes &&
  question.renderSurfaces.admin.exposesInternalCodes
));
assert.ok(records.every((question) =>
  question.permanentQlId === null &&
  question.questionBankStatus === "NOT_STORED" &&
  question.testEligibility === "INELIGIBLE" &&
  !question.publiclyPublishable &&
  !question.questionStudioDiscoverable
));
assert.ok(stemWordCounts.every((count) => count >= 10 && count <= 110));
assert.ok(solutionWordCounts.every((count) => count >= 15 && count <= 240));
assert.equal(audit.missingInitialDiscoveryPrototypeCount, 14);
assert.equal(audit.pipeCoreCoverageComplete, true);
assert.equal(audit.chapterCoverageComplete, false);

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
    thickness: thicknessOf(question).toString(),
    height: question.state.height.toString(),
    radialUnit: question.measurementProfile.radialUnit,
    heightUnit: question.measurementProfile.heightUnit,
  },
  stem: question.stem,
  options: question.options.map((option: any) => ({
    label: option.label,
    display: option.display,
    isCorrect: option.isCorrect,
  })),
  answer: question.answer,
  learnerSolution: question.learnerSolution,
  automatedEnglishChecks: {
    technicallyClean: technicallyClean(question),
    stemWordCount: wordCount(question.stem),
    learnerSolutionWordCount: wordCount([
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

const prototypeSummary = prototypeIds.map((prototypeId) =>
  `- \`${prototypeId}\`: ${records.filter(
    (question) => question.prototypeId === prototypeId,
  ).length} review records`
).join("\n");
const missingSummary = missingInitialPrototypes.map((prototypeId, index) =>
  `${index + 1}. \`${prototypeId}\``
).join("\n");
const samples = prototypeIds.map((prototypeId) => {
  const sample = records.find(
    (question) => question.prototypeId === prototypeId,
  );
  return [
    `### ${prototypeId}`,
    "",
    sample.stem,
    "",
    ...sample.options.map(
      (option: any) => `- ${option.label}. ${option.display}`,
    ),
    "",
    `**Answer:** ${sample.answer}`,
    "",
    `**Learner formula:** ${sample.learnerSolution.formula}`,
  ].join("\n");
}).join("\n\n");

const markdown = `# MEN-CP-011 Chapter-Wide Coverage and English Audit\n\n` +
  `Authority: **${MEN_CP011_CHAPTER_AUDIT_AUTHORITY}**  \n` +
  `Source commit: **${audit.sourceCommit}**  \n` +
  `Permanent QLs: **0**  \n` +
  `Publication: **blocked**\n\n` +
  `## Verdict\n\n` +
  `The implemented hollow-pipe core is technically complete for its current scope, but it is not the complete MEN-CP-011 chapter defined by the discovery plan. Automated technical English checks passed for ${audit.technicallyCleanLearnerRecords}/${audit.recordCount} records; human editorial approval remains required.\n\n` +
  `## Executable evidence\n\n` +
  `- Runtime prototypes: ${audit.runtimePrototypeCount}\n` +
  `- Review records: ${audit.recordCount}\n` +
  `- Unique exact stems: ${audit.uniqueExactStemCount}\n` +
  `- Unique stem-option packages: ${audit.uniqueQuestionOptionPackageCount}\n` +
  `- State-pool authority: ${audit.statePoolAuthoritySize} entries\n` +
  `- Distinct generated states: foundation ${audit.foundationDistinctGeneratedStateCount}, surface ${audit.surfaceDistinctGeneratedStateCount}, combined ${audit.combinedDistinctGeneratedStateCount}\n` +
  `- Mixed-unit records: ${audit.mixedUnitRecordCount}\n` +
  `- Answer positions: A${answerPositionCounts.A} B${answerPositionCounts.B} C${answerPositionCounts.C} D${answerPositionCounts.D}\n` +
  `- Average stem length: ${audit.averageStemWordCount} words\n` +
  `- Average learner-solution length: ${audit.averageLearnerSolutionWordCount} words\n\n` +
  `## Implemented prototype matrix\n\n${prototypeSummary}\n\n` +
  `## Missing initial discovery families\n\n${missingSummary}\n\n` +
  `Unresolved axes also include π = 3.14, inverse thickness/length, open containers, non-cylindrical shells, joined/placed solids and cost/rate/count/ratio/percentage applications.\n\n` +
  `## English decision\n\n` +
  `No malformed \\pih command, unbalanced learner delimiters, nested answer delimiters, learner-visible codes, fallback IDs, exact duplicate stems, exact duplicate packages, option-key failures or learner/admin leakage were found. English remains unfrozen because exam naturalness, distractor plausibility, explanation usefulness and difficulty calibration require human review.\n\n` +
  `## Active blockers\n\n${BLOCKERS.map(
    (blocker) => `- \`${blocker}\``,
  ).join("\n")}\n\n` +
  `## Representative records\n\n${samples}\n`;
writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-review.md"),
  markdown,
  "utf8",
);

console.log(
  `MEN-CP-011 chapter-wide audit passed for ${records.length} records across ${prototypeIds.length} implemented prototypes. Pipe-core coverage is complete; chapter coverage and human English approval remain blocked.`,
);
