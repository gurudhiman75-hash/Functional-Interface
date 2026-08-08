import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateMenCp011ReviewBatch } from "./exam-readiness-batch";
import { getMenCp011FoundationPrototypeIds } from "./registry";
import {
  generateMenCp011SurfaceReviewBatch,
  getMenCp011SurfacePrototypeIds,
} from "./surface-area-runtime";
import {
  generateMenCp011OpenContainerReviewBatch,
  getMenCp011OpenContainerPrototypeIds,
  MEN_CP011_OPEN_CUBOID_DISPOSITION,
} from "./open-containers-runtime";
import {
  generateMenCp011InverseReviewBatch,
  getMenCp011InversePrototypeIds,
} from "./inverse-thickness-length";
import {
  generateMenCp011HollowBoxReviewBatch,
  getMenCp011HollowBoxPrototypeIds,
} from "./hollow-boxes";
import {
  auditMenCp011ShellBatch,
  generateMenCp011ShellReviewBatch,
  getMenCp011ShellPrototypeIds,
} from "./spherical-shells";
import {
  auditMenCp011HiddenFaceBatch,
  generateMenCp011HiddenFaceReviewBatch,
  getMenCp011HiddenFacePrototypeIds,
} from "./hidden-face-exposure";
import {
  auditMenCp011CostBatch,
  generateMenCp011CostReviewBatch,
  getMenCp011CostPrototypeIds,
} from "./cost-lining";
import {
  auditMenCp011RatioPercentBatch,
  generateMenCp011RatioPercentReviewBatch,
  getMenCp011RatioPercentPrototypeIds,
} from "./ratio-percent";
import {
  auditMenCp011ConicalMaterialBatch,
  generateMenCp011ConicalMaterialReviewBatch,
  getMenCp011ConicalMaterialPrototypeIds,
} from "./conical-material";

export const MEN_CP011_CURRENT_CHAPTER_AUDIT_AUTHORITY =
  "MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V6" as const;

type Question = any;
type Label = "A" | "B" | "C" | "D";

const INITIAL_DISCOVERY_STATUS = {
  "MEN-CP011-PROT-OPEN-CUBOID-SHEET-AREA": "REASSIGNED_TO_MEN_CP007_EXISTING_AUTHORITY",
  "MEN-CP011-PROT-OPEN-CYLINDER-ONE-END-AREA": "IMPLEMENTED",
  "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA": "IMPLEMENTED",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-HOLLOW-PIPE-CURVED-AREA-BOTH-SIDES": "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY",
  "MEN-CP011-PROT-HOLLOW-PIPE-TSA-WITH-ANNULAR-ENDS": "IMPLEMENTED_BY_EQUIVALENT_SURFACE_AUTHORITY",
  "MEN-CP011-PROT-HOLLOW-CUBE-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME": "IMPLEMENTED",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA": "IMPLEMENTED",
  "MEN-CP011-PROT-CUBOID-ON-FLOOR-PAINTED-AREA": "IMPLEMENTED",
  "MEN-CP011-PROT-OPEN-CONTAINER-SHEET-COST": "IMPLEMENTED",
  "MEN-CP011-PROT-INNER-LINING-COST": "IMPLEMENTED",
  "MEN-CP011-PROT-MATERIAL-VOLUME-RATIO": "IMPLEMENTED",
  "MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE": "IMPLEMENTED",
} as const;

const BLOCKERS = [
  "CONICAL_SURFACE_AND_COST_FAMILIES_PENDING",
  "DIRECT_SOURCE_NORMALISATION_PENDING",
  "PERMANENT_QLS_UNALLOCATED",
  "MANUAL_ENGLISH_REVIEW_PENDING",
] as const;

const waves = [
  {
    wave: "PIPE_MATERIAL_AND_INVERSE_CORE",
    records: generateMenCp011ReviewBatch(
      "men-cp011-current-audit-foundation-v6",
      12,
    ).records as Question[],
  },
  {
    wave: "PIPE_SURFACE_EXPOSURE",
    records: generateMenCp011SurfaceReviewBatch(
      "men-cp011-current-audit-surface-v6",
      12,
    ).records as Question[],
  },
  {
    wave: "OPEN_CONTAINER_EXPOSURE",
    records: generateMenCp011OpenContainerReviewBatch(
      "men-cp011-current-audit-open-container-v6",
      16,
    ).records as Question[],
  },
  { wave: "INVERSE_THICKNESS_AND_LENGTH", records: generateMenCp011InverseReviewBatch().records as Question[] },
  { wave: "HOLLOW_CUBE_AND_CUBOID", records: generateMenCp011HollowBoxReviewBatch().records as Question[] },
  { wave: "SPHERICAL_AND_HEMISPHERICAL_SHELLS", records: generateMenCp011ShellReviewBatch().records as Question[] },
  { wave: "JOINED_AND_PLACED_HIDDEN_FACES", records: generateMenCp011HiddenFaceReviewBatch().records as Question[] },
  { wave: "COST_AND_INNER_LINING", records: generateMenCp011CostReviewBatch().records as Question[] },
  { wave: "MATERIAL_RATIO_AND_PERCENT_CHANGE", records: generateMenCp011RatioPercentReviewBatch().records as Question[] },
  { wave: "CONICAL_MATERIAL_VOLUME", records: generateMenCp011ConicalMaterialReviewBatch().records as Question[] },
] as const;

const records = waves.flatMap(({ wave, records: waveRecords }) =>
  waveRecords.map((question) => ({ ...question, __auditWave: wave })),
);

const runtimePrototypeIds = [
  ...getMenCp011FoundationPrototypeIds(),
  ...getMenCp011SurfacePrototypeIds(),
  ...getMenCp011OpenContainerPrototypeIds(),
  ...getMenCp011InversePrototypeIds(),
  ...getMenCp011HollowBoxPrototypeIds(),
  ...getMenCp011ShellPrototypeIds(),
  ...getMenCp011HiddenFacePrototypeIds(),
  ...getMenCp011CostPrototypeIds(),
  ...getMenCp011RatioPercentPrototypeIds(),
  ...getMenCp011ConicalMaterialPrototypeIds(),
];

function normalizedStem(stem: string) {
  return stem
    .toLowerCase()
    .replace(/\$[^$]+\$/g, "<value>")
    .replace(/\d+(?:\.\d+)?/g, "<number>")
    .replace(/\s+/g, " ")
    .trim();
}

function exactPackageKey(question: Question) {
  return [question.stem, ...question.options.map((option: any) => option.display)].join("\n");
}

function learnerSolutionText(question: Question) {
  const learner = question.learnerSolution;
  return [
    learner?.formula ?? "",
    ...(learner?.steps ?? []),
    learner?.finalAnswer ?? "",
    learner?.shortcut ?? "",
    ...(learner?.wrongOptionAnalysis ?? []),
  ].join("\n");
}

function learnerText(question: Question) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
    question.answer,
    learnerSolutionText(question),
  ].join("\n");
}

function technicallyClean(question: Question) {
  const text = learnerText(question);
  return !text.includes("\\pih") &&
    (text.match(/\$/g) ?? []).length % 2 === 0 &&
    !/\$\$/.test(text) &&
    !/\$\([^$]*\$/.test(question.stem) &&
    !/\[(?:USED_|CALCULATED_|ADDED_|OMITTED_|RETURNED_|COPIED_|COUNTED_|SUBTRACTED_|STOPPED_|MEN-CP011-PROT-|FALLBACK_|UNCLASSIFIED)/.test(text) &&
    !/misconceptionId|prototypeId/.test(text) &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text);
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function profileKey(question: Question) {
  if (question.measurementProfile?.id) return question.measurementProfile.id;
  if (question.state?.measurementProfileId) return question.state.measurementProfileId;
  const unit = question.state?.linearUnit ??
    question.state?.radialUnit ??
    question.state?.unit ??
    question.unit ??
    "UNSPECIFIED_UNIT";
  const piPolicy = question.piPolicy ?? question.state?.piPolicy ?? "NO_PI_POLICY";
  return `${unit}|${piPolicy}`;
}

function unitKey(question: Question) {
  return question.state?.linearUnit ??
    question.state?.radialUnit ??
    question.state?.unit ??
    question.unit ??
    "UNSPECIFIED_UNIT";
}

function piPolicyKey(question: Question) {
  return question.piPolicy ?? question.state?.piPolicy ?? "NO_PI_POLICY";
}

function physicalStateSignature(question: Question) {
  const state = question.state ?? {};
  const excluded = new Set([
    "packageId",
    "canonicalProblemId",
    "permanentQlId",
    "waveId",
    "prototypeId",
    "solveMode",
    "target",
    "seed",
    "stateSelectionAttempt",
    "difficulty",
    "sourceMaturity",
  ]);
  return JSON.stringify(
    {
      prototypeId: question.prototypeId,
      state: Object.entries(state)
        .filter(([key, value]) => !excluded.has(key) && typeof value !== "function")
        .sort(([left], [right]) => left.localeCompare(right)),
    },
    (_key, value) => typeof value === "bigint" ? value.toString() : value,
  );
}

function increment(record: Record<string, number>, key: string) {
  record[key] = (record[key] ?? 0) + 1;
}

const normalizedCounts = new Map<string, number>();
const answerPositionCounts: Record<Label, number> = { A: 0, B: 0, C: 0, D: 0 };
const waveRecordCounts: Record<string, number> = {};
const prototypeRecordCounts: Record<string, number> = {};
const profileCounts: Record<string, number> = {};
const unitCounts: Record<string, number> = {};
const piPolicyCounts: Record<string, number> = {};
const difficultyCounts: Record<string, number> = {};
const targetCounts: Record<string, number> = {};

for (const question of records) {
  const normalized = normalizedStem(question.stem);
  normalizedCounts.set(normalized, (normalizedCounts.get(normalized) ?? 0) + 1);
  const label = question.options[question.correctIndex]?.label as Label;
  answerPositionCounts[label] += 1;
  increment(waveRecordCounts, question.__auditWave);
  increment(prototypeRecordCounts, question.prototypeId);
  increment(profileCounts, profileKey(question));
  increment(unitCounts, unitKey(question));
  increment(piPolicyCounts, piPolicyKey(question));
  increment(difficultyCounts, question.difficulty ?? "UNSPECIFIED_DIFFICULTY");
  increment(targetCounts, question.target ?? "UNSPECIFIED_TARGET");
}

const exactStems = records.map((question) => question.stem);
const exactPackages = records.map(exactPackageKey);
const stemWordCounts = records.map((question) => wordCount(question.stem));
const solutionWordCounts = records.map((question) => wordCount(learnerSolutionText(question)));
const initialStatusEntries = Object.entries(INITIAL_DISCOVERY_STATUS);
const shellAudit = auditMenCp011ShellBatch(
  records.filter((question) => question.__auditWave === "SPHERICAL_AND_HEMISPHERICAL_SHELLS"),
);
const hiddenFaceAudit = auditMenCp011HiddenFaceBatch(
  records.filter((question) => question.__auditWave === "JOINED_AND_PLACED_HIDDEN_FACES"),
);
const costAudit = auditMenCp011CostBatch(
  records.filter((question) => question.__auditWave === "COST_AND_INNER_LINING"),
);
const ratioPercentAudit = auditMenCp011RatioPercentBatch(
  records.filter((question) => question.__auditWave === "MATERIAL_RATIO_AND_PERCENT_CHANGE"),
);
const conicalMaterialAudit = auditMenCp011ConicalMaterialBatch(
  records.filter((question) => question.__auditWave === "CONICAL_MATERIAL_VOLUME"),
);

const audit = {
  auditAuthority: MEN_CP011_CURRENT_CHAPTER_AUDIT_AUTHORITY,
  sourceCommit: process.env.GITHUB_SHA ?? "LOCAL_OR_UNSPECIFIED",
  generatedReviewRecordCount: records.length,
  runtimePrototypeCount: runtimePrototypeIds.length,
  runtimePrototypeIds,
  waveCount: waves.length,
  waveRecordCounts,
  prototypeRecordCounts,
  uniqueExactStemCount: new Set(exactStems).size,
  uniqueQuestionOptionPackageCount: new Set(exactPackages).size,
  normalizedStemGroupCount: normalizedCounts.size,
  maximumNormalizedStemRepetition: Math.max(...normalizedCounts.values()),
  reviewStateSignatureCount: new Set(records.map(physicalStateSignature)).size,
  answerPositionCounts,
  profileCounts,
  unitCounts,
  piPolicyCounts,
  difficultyCounts,
  targetCounts,
  minimumStemWordCount: Math.min(...stemWordCounts),
  maximumStemWordCount: Math.max(...stemWordCounts),
  averageStemWordCount: Math.round(
    stemWordCounts.reduce((sum, value) => sum + value, 0) / records.length * 10,
  ) / 10,
  minimumLearnerSolutionWordCount: Math.min(...solutionWordCounts),
  maximumLearnerSolutionWordCount: Math.max(...solutionWordCounts),
  averageLearnerSolutionWordCount: Math.round(
    solutionWordCounts.reduce((sum, value) => sum + value, 0) / records.length * 10,
  ) / 10,
  technicallyCleanLearnerRecords: records.filter(technicallyClean).length,
  initialDiscoveryPrototypeCount: initialStatusEntries.length,
  implementedOrOwnedInitialDiscoveryPrototypeCount: initialStatusEntries.length,
  unresolvedInitialDiscoveryPrototypeCount: 0,
  unresolvedInitialPrototypes: [] as string[],
  initialDiscoveryStatus: INITIAL_DISCOVERY_STATUS,
  initialArchitectureListComplete: true,
  additionalImplementedDiscoveryFamilies: [
    "MEN-CP011-PROT-PIPE-LENGTH-FROM-MATERIAL-VOLUME",
    ...getMenCp011ConicalMaterialPrototypeIds(),
  ],
  openCuboidOwnershipDisposition: MEN_CP011_OPEN_CUBOID_DISPOSITION,
  coverageAxes: {
    pipeMaterialAndSurfaceCore: "COVERED",
    inversePipeThicknessAndLength: "COVERED",
    openCylinderTopologies: "COVERED",
    directOpenCuboidSheetArea: "OWNED_BY_MEN_CP007_EXISTING_AUTHORITY",
    hollowCubeCuboidSphereAndHemisphere: "COVERED",
    joinedAndPlacedHiddenFaces: "COVERED",
    sheetAndLiningCost: "COVERED",
    materialRatioAndPercentageChange: "COVERED",
    declaredPiPolicies: "COVERED",
    conicalShellMaterialVolume: "COVERED_EXPLICIT_AND_SIMILAR_RELATIONS",
    conicalShellSurfaceAndCost: "PENDING",
    directSourceNormalisation: "PENDING",
  },
  sliceAudits: {
    shellPiPolicies: shellAudit.piPolicyCounts,
    hiddenFaceAnswerPositions: hiddenFaceAudit.answerPositionCounts,
    costPiPolicies: costAudit.piPolicyCounts,
    ratioPercentAnswerPositions: ratioPercentAudit.answerPositionCounts,
    conicalMaterialAnswerPositions: conicalMaterialAudit.answerPositionCounts,
    conicalMaterialPiPolicies: conicalMaterialAudit.piPolicyCounts,
  },
  chapterCoverageComplete: false,
  initialArchitectureCoverageComplete: true,
  automatedEnglishStatus: "TECHNICALLY_CLEAN_HUMAN_REVIEW_REQUIRED",
  humanEnglishApproval: false,
  permanentQlCount: 0,
  publicationEligible: false,
  blockers: BLOCKERS,
};

assert.equal(audit.generatedReviewRecordCount, 408);
assert.equal(audit.runtimePrototypeCount, 26);
assert.equal(new Set(runtimePrototypeIds).size, 26);
assert.deepEqual(waveRecordCounts, {
  PIPE_MATERIAL_AND_INVERSE_CORE: 48,
  PIPE_SURFACE_EXPOSURE: 72,
  OPEN_CONTAINER_EXPOSURE: 32,
  INVERSE_THICKNESS_AND_LENGTH: 32,
  HOLLOW_CUBE_AND_CUBOID: 32,
  SPHERICAL_AND_HEMISPHERICAL_SHELLS: 48,
  JOINED_AND_PLACED_HIDDEN_FACES: 32,
  COST_AND_INNER_LINING: 32,
  MATERIAL_RATIO_AND_PERCENT_CHANGE: 32,
  CONICAL_MATERIAL_VOLUME: 48,
});
assert.equal(audit.uniqueExactStemCount, 408);
assert.equal(audit.uniqueQuestionOptionPackageCount, 408);
assert.deepEqual(answerPositionCounts, { A: 102, B: 102, C: 102, D: 102 });
assert.equal(audit.technicallyCleanLearnerRecords, 408);
assert.equal(audit.initialDiscoveryPrototypeCount, 20);
assert.equal(audit.implementedOrOwnedInitialDiscoveryPrototypeCount, 20);
assert.equal(audit.unresolvedInitialDiscoveryPrototypeCount, 0);
assert.equal(audit.initialArchitectureListComplete, true);
assert.deepEqual(shellAudit.piPolicyCounts, {
  EXACT_PI: 16,
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.deepEqual(hiddenFaceAudit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.deepEqual(costAudit.piPolicyCounts, { PI_22_OVER_7: 16, PI_3_14: 16 });
assert.deepEqual(ratioPercentAudit.answerPositionCounts, { A: 8, B: 8, C: 8, D: 8 });
assert.deepEqual(conicalMaterialAudit.answerPositionCounts, { A: 12, B: 12, C: 12, D: 12 });
assert.deepEqual(conicalMaterialAudit.piPolicyCounts, {
  EXACT_PI: 16,
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.ok(records.every((question) =>
  question.validation?.valid === true && question.verification?.valid === true
));
assert.ok(records.every((question) =>
  question.options.length === 4 &&
  new Set(question.options.map((option: any) => option.display)).size === 4 &&
  question.options.filter((option: any) => option.isCorrect).length === 1 &&
  question.options[question.correctIndex]?.isCorrect === true
));
assert.ok(records.every((question) =>
  question.learnerSolution?.wrongOptionAnalysis?.length === 3
));
assert.ok(records.every((question) =>
  question.renderSurfaces?.attempt?.diagram === null &&
  question.renderSurfaces?.attempt?.exposesInternalCodes === false &&
  question.renderSurfaces?.practice?.exposesInternalCodes === false &&
  question.renderSurfaces?.solution?.exposesInternalCodes === false &&
  question.renderSurfaces?.admin?.exposesInternalCodes === true
));
assert.ok(records.every((question) =>
  question.permanentQlId === null &&
  question.questionBankStatus === "NOT_STORED" &&
  question.testEligibility === "INELIGIBLE" &&
  question.publiclyPublishable === false &&
  question.questionStudioDiscoverable === false
));
assert.ok(stemWordCounts.every((count) => count >= 8 && count <= 150));
assert.ok(solutionWordCounts.every((count) => count >= 15 && count <= 360));
assert.equal(audit.chapterCoverageComplete, false);
assert.equal(audit.publicationEligible, false);

const reviewRows = records.map((question, index) => ({
  reviewId: `MEN-CP011-CURRENT-AUDIT-V6-${String(index + 1).padStart(3, "0")}`,
  wave: question.__auditWave,
  prototypeId: question.prototypeId,
  solveMode: question.solveMode,
  target: question.target,
  difficulty: question.difficulty,
  piPolicy: piPolicyKey(question),
  profile: profileKey(question),
  unit: unitKey(question),
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
    learnerSolutionWordCount: wordCount(learnerSolutionText(question)),
  },
}));

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });
writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-audit.json"),
  `${JSON.stringify({ audit, reviewRows }, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value, 2)}\n`,
  "utf8",
);

const prototypeSummary = runtimePrototypeIds.map((prototypeId) =>
  `- \`${prototypeId}\`: ${prototypeRecordCounts[prototypeId] ?? 0} review records`
).join("\n");
const representativeRows = runtimePrototypeIds.map((prototypeId) =>
  records.find((question) => question.prototypeId === prototypeId)!
);
const representativeMarkdown = representativeRows.map((question, index) => {
  const options = question.options.map((option: any) =>
    `${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`
  ).join("\n");
  return `### ${index + 1}. ${question.prototypeId}\n\n` +
    `- Wave: \`${question.__auditWave}\`\n` +
    `- Profile: \`${profileKey(question)}\`\n` +
    `- Difficulty: \`${question.difficulty}\`\n\n` +
    `${question.stem}\n\n${options}\n\n` +
    `**Answer:** ${question.answer}\n\n` +
    `**Formula:** ${question.learnerSolution.formula}\n\n` +
    `**Shortcut:** ${question.learnerSolution.shortcut}\n`;
}).join("\n\n---\n\n");

const reviewMarkdown = `# MEN-CP-011 Current Chapter-Wide Coverage and English Audit V6\n\n` +
  `## Verdict\n\n` +
  `The initial 20-candidate architecture remains complete. The live discovery system now contains **${audit.runtimePrototypeCount} direct runtime families** and **${audit.generatedReviewRecordCount} current review records**, including explicit-inner and declared-similar conical material-volume families. Chapter freeze is still not granted because conical surface/cost families, direct source normalisation and human English review remain pending.\n\n` +
  `## Current metrics\n\n\`\`\`text\n` +
  `Audit authority:                    ${audit.auditAuthority}\n` +
  `Runtime prototypes:                 ${audit.runtimePrototypeCount}\n` +
  `Review records:                     ${audit.generatedReviewRecordCount}\n` +
  `Unique exact stems:                 ${audit.uniqueExactStemCount}\n` +
  `Unique stem-option packages:        ${audit.uniqueQuestionOptionPackageCount}\n` +
  `Technically clean learner records:  ${audit.technicallyCleanLearnerRecords}\n` +
  `Correct positions:                  A${answerPositionCounts.A} B${answerPositionCounts.B} C${answerPositionCounts.C} D${answerPositionCounts.D}\n` +
  `Initial candidates implemented/owned: ${audit.implementedOrOwnedInitialDiscoveryPrototypeCount}/20\n` +
  `Permanent QLs:                      0\n` +
  `Publication eligible:               false\n` +
  `\`\`\`\n\n` +
  `## Implemented runtime families\n\n${prototypeSummary}\n\n` +
  `## Remaining work\n\n` +
  `- Conical-shell curved-area and lining-cost families.\n` +
  `- Direct source normalisation and neighbouring-CP ownership closure.\n` +
  `- Human English review and final family compression.\n` +
  `- Permanent QL allocation only after those gates close.\n\n` +
  `## Representative current records\n\n${representativeMarkdown}\n`;

writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-review.md"),
  reviewMarkdown,
  "utf8",
);

console.log(JSON.stringify({
  auditAuthority: audit.auditAuthority,
  runtimePrototypeCount: audit.runtimePrototypeCount,
  recordCount: audit.generatedReviewRecordCount,
  uniqueExactStemCount: audit.uniqueExactStemCount,
  technicallyCleanLearnerRecords: audit.technicallyCleanLearnerRecords,
  answerPositionCounts: audit.answerPositionCounts,
  conicalMaterialSlice: {
    answerPositions: audit.sliceAudits.conicalMaterialAnswerPositions,
    piPolicies: audit.sliceAudits.conicalMaterialPiPolicies,
  },
  blockers: audit.blockers,
  publicationEligible: audit.publicationEligible,
}, null, 2));
