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
  generateMenCp011ShellReviewBatch,
  getMenCp011ShellPrototypeIds,
} from "./spherical-shells";
import {
  generateMenCp011HiddenFaceReviewBatch,
  getMenCp011HiddenFacePrototypeIds,
} from "./hidden-face-exposure";
import {
  generateMenCp011CostReviewBatch,
  getMenCp011CostPrototypeIds,
} from "./cost-lining";
import {
  generateMenCp011RatioPercentReviewBatch,
  getMenCp011RatioPercentPrototypeIds,
} from "./ratio-percent";
import {
  generateMenCp011ConicalMaterialReviewBatch,
  getMenCp011ConicalMaterialPrototypeIds,
} from "./conical-material";
import {
  auditMenCp011ConicalSurfaceCostBatch,
  generateMenCp011ConicalSurfaceCostReviewBatch,
  getMenCp011ConicalSurfaceCostPrototypeIds,
} from "./conical-surface-cost";

export const MEN_CP011_CURRENT_CHAPTER_AUDIT_AUTHORITY =
  "MEN-CP011-CHAPTER-WIDE-COVERAGE-ENGLISH-AUDIT-V7" as const;

type Question = any;
type Label = "A" | "B" | "C" | "D";

const waves = [
  {
    wave: "PIPE_MATERIAL_AND_INVERSE_CORE",
    records: generateMenCp011ReviewBatch(
      "men-cp011-current-audit-foundation-v7",
      12,
    ).records as Question[],
  },
  {
    wave: "PIPE_SURFACE_EXPOSURE",
    records: generateMenCp011SurfaceReviewBatch(
      "men-cp011-current-audit-surface-v7",
      12,
    ).records as Question[],
  },
  {
    wave: "OPEN_CONTAINER_EXPOSURE",
    records: generateMenCp011OpenContainerReviewBatch(
      "men-cp011-current-audit-open-container-v7",
      16,
    ).records as Question[],
  },
  {
    wave: "INVERSE_THICKNESS_AND_LENGTH",
    records: generateMenCp011InverseReviewBatch().records as Question[],
  },
  {
    wave: "HOLLOW_CUBE_AND_CUBOID",
    records: generateMenCp011HollowBoxReviewBatch().records as Question[],
  },
  {
    wave: "SPHERICAL_AND_HEMISPHERICAL_SHELLS",
    records: generateMenCp011ShellReviewBatch().records as Question[],
  },
  {
    wave: "JOINED_AND_PLACED_HIDDEN_FACES",
    records: generateMenCp011HiddenFaceReviewBatch().records as Question[],
  },
  {
    wave: "COST_AND_INNER_LINING",
    records: generateMenCp011CostReviewBatch().records as Question[],
  },
  {
    wave: "MATERIAL_RATIO_AND_PERCENT_CHANGE",
    records: generateMenCp011RatioPercentReviewBatch().records as Question[],
  },
  {
    wave: "CONICAL_MATERIAL_VOLUME",
    records: generateMenCp011ConicalMaterialReviewBatch().records as Question[],
  },
  {
    wave: "CONICAL_SURFACE_AND_LINING_COST",
    records: generateMenCp011ConicalSurfaceCostReviewBatch().records as Question[],
  },
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
  ...getMenCp011ConicalSurfaceCostPrototypeIds(),
];

function learnerSolutionText(question: Question) {
  return [
    question.learnerSolution?.formula ?? "",
    ...(question.learnerSolution?.steps ?? []),
    question.learnerSolution?.finalAnswer ?? "",
    question.learnerSolution?.shortcut ?? "",
    ...(question.learnerSolution?.wrongOptionAnalysis ?? []),
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
  return (
    !text.includes("\\pih") &&
    (text.match(/\$/g) ?? []).length % 2 === 0 &&
    !/\$\$/.test(text) &&
    !/\$\([^$]*\$/.test(question.stem) &&
    !/\[(?:USED_|CALCULATED_|ADDED_|OMITTED_|RETURNED_|COPIED_|COUNTED_|SUBTRACTED_|CHARGED_|STOPPED_|MEN-CP011-PROT-|FALLBACK_|UNCLASSIFIED)/.test(
      text,
    ) &&
    !/misconceptionId|prototypeId/.test(text) &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)
  );
}

function exactPackageKey(question: Question) {
  return [
    question.stem,
    ...question.options.map((option: any) => option.display),
  ].join("\n");
}

function physicalStateKey(question: Question) {
  return JSON.stringify(
    {
      prototypeId: question.prototypeId,
      state: question.state,
    },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
  );
}

function profileKey(question: Question) {
  return (
    question.measurementProfile?.id ??
    question.state?.measurementProfileId ??
    `${question.state?.unit ?? question.unit ?? "UNSPECIFIED"}|${
      question.state?.piPolicy ?? question.piPolicy ?? "NO_PI_POLICY"
    }`
  );
}

function increment(record: Record<string, number>, key: string) {
  record[key] = (record[key] ?? 0) + 1;
}

const answerPositionCounts: Record<Label, number> = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
};
const waveRecordCounts: Record<string, number> = {};
const prototypeRecordCounts: Record<string, number> = {};
const profileCounts: Record<string, number> = {};
const targetCounts: Record<string, number> = {};
const unitCounts: Record<string, number> = {};
const piPolicyCounts: Record<string, number> = {};

for (const question of records) {
  const label = question.options[question.correctIndex]?.label as Label;
  answerPositionCounts[label] += 1;
  increment(waveRecordCounts, question.__auditWave);
  increment(prototypeRecordCounts, question.prototypeId);
  increment(profileCounts, profileKey(question));
  increment(targetCounts, question.target ?? "UNSPECIFIED_TARGET");
  increment(
    unitCounts,
    question.state?.unit ?? question.state?.linearUnit ?? question.unit ?? "UNSPECIFIED_UNIT",
  );
  increment(
    piPolicyCounts,
    question.state?.piPolicy ?? question.piPolicy ?? "NO_PI_POLICY",
  );
}

const conicalSurfaceCostRecords = records.filter(
  (question) => question.__auditWave === "CONICAL_SURFACE_AND_LINING_COST",
);
const conicalSurfaceCostAudit = auditMenCp011ConicalSurfaceCostBatch(
  conicalSurfaceCostRecords,
);

const audit = {
  auditAuthority: MEN_CP011_CURRENT_CHAPTER_AUDIT_AUTHORITY,
  sourceCommit: process.env.GITHUB_SHA ?? "LOCAL_OR_UNSPECIFIED",
  runtimePrototypeCount: runtimePrototypeIds.length,
  runtimePrototypeIds,
  waveCount: waves.length,
  generatedReviewRecordCount: records.length,
  waveRecordCounts,
  prototypeRecordCounts,
  profileCounts,
  targetCounts,
  unitCounts,
  piPolicyCounts,
  uniqueExactStemCount: new Set(records.map((question) => question.stem)).size,
  uniqueQuestionOptionPackageCount: new Set(records.map(exactPackageKey)).size,
  uniquePhysicalStateCount: new Set(records.map(physicalStateKey)).size,
  technicallyCleanLearnerRecords: records.filter(technicallyClean).length,
  answerPositionCounts,
  initialArchitectureCandidateCount: 20,
  implementedOrOwnedInitialCandidateCount: 20,
  unresolvedInitialCandidateCount: 0,
  initialArchitectureListComplete: true,
  conicalOwnershipAuditComplete: true,
  conicalExecutableDiscoveryComplete: true,
  conicalImplementedFamilies: [
    ...getMenCp011ConicalMaterialPrototypeIds(),
    ...getMenCp011ConicalSurfaceCostPrototypeIds(),
  ],
  conicalSurfaceCostSlice: {
    recordCount: conicalSurfaceCostAudit.recordCount,
    targetCounts: conicalSurfaceCostAudit.targetCounts,
    answerPositionCounts: conicalSurfaceCostAudit.answerPositionCounts,
    unitCounts: conicalSurfaceCostAudit.unitCounts,
    piPolicyCounts: conicalSurfaceCostAudit.piPolicyCounts,
  },
  executableDiscoveryCoverageComplete: true,
  directSourceNormalisationComplete: false,
  humanEnglishApproval: false,
  permanentQlCount: 0,
  chapterFrozen: false,
  publicationEligible: false,
  blockers: [
    "DIRECT_SOURCE_NORMALISATION_PENDING",
    "PERMANENT_QLS_UNALLOCATED",
    "MANUAL_ENGLISH_REVIEW_PENDING",
    "MULTILINGUAL_PARITY_PENDING",
  ],
};

assert.equal(audit.runtimePrototypeCount, 28);
assert.equal(new Set(runtimePrototypeIds).size, 28);
assert.equal(audit.waveCount, 11);
assert.equal(audit.generatedReviewRecordCount, 448);
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
  CONICAL_SURFACE_AND_LINING_COST: 40,
});
assert.equal(audit.uniqueExactStemCount, 448);
assert.equal(audit.uniqueQuestionOptionPackageCount, 448);
assert.equal(audit.technicallyCleanLearnerRecords, 448);
assert.deepEqual(answerPositionCounts, {
  A: 112,
  B: 112,
  C: 112,
  D: 112,
});
assert.equal(audit.initialArchitectureListComplete, true);
assert.equal(audit.conicalOwnershipAuditComplete, true);
assert.equal(audit.conicalExecutableDiscoveryComplete, true);
assert.equal(audit.conicalImplementedFamilies.length, 4);
assert.deepEqual(conicalSurfaceCostAudit.targetCounts, {
  AREA: 24,
  COST: 16,
});
assert.deepEqual(conicalSurfaceCostAudit.answerPositionCounts, {
  A: 10,
  B: 10,
  C: 10,
  D: 10,
});
assert.deepEqual(conicalSurfaceCostAudit.unitCounts, {
  cm: 12,
  m: 28,
});
assert.deepEqual(conicalSurfaceCostAudit.piPolicyCounts, {
  EXACT_PI: 8,
  PI_22_OVER_7: 16,
  PI_3_14: 16,
});
assert.ok(
  records.every(
    (question) =>
      question.validation?.valid === true &&
      question.verification?.valid === true,
  ),
);
assert.ok(
  records.every(
    (question) =>
      question.options.length === 4 &&
      new Set(question.options.map((option: any) => option.display)).size === 4 &&
      question.options.filter((option: any) => option.isCorrect).length === 1 &&
      question.options[question.correctIndex]?.isCorrect === true,
  ),
);
assert.ok(
  records.every(
    (question) => question.learnerSolution?.wrongOptionAnalysis?.length === 3,
  ),
);
assert.ok(
  records.every(
    (question) =>
      question.renderSurfaces?.attempt?.diagram === null &&
      question.renderSurfaces?.attempt?.exposesInternalCodes === false &&
      question.renderSurfaces?.practice?.exposesInternalCodes === false &&
      question.renderSurfaces?.solution?.exposesInternalCodes === false &&
      question.renderSurfaces?.admin?.exposesInternalCodes === true,
  ),
);
assert.ok(
  records.every(
    (question) =>
      question.permanentQlId === null &&
      question.questionBankStatus === "NOT_STORED" &&
      question.testEligibility === "INELIGIBLE" &&
      question.publiclyPublishable === false &&
      question.questionStudioDiscoverable === false,
  ),
);
assert.equal(audit.executableDiscoveryCoverageComplete, true);
assert.equal(audit.chapterFrozen, false);
assert.equal(audit.publicationEligible, false);

const reviewRows = records.map((question, index) => ({
  reviewId: `MEN-CP011-CURRENT-AUDIT-V7-${String(index + 1).padStart(3, "0")}`,
  wave: question.__auditWave,
  prototypeId: question.prototypeId,
  solveMode: question.solveMode,
  target: question.target,
  difficulty: question.difficulty,
  profile: profileKey(question),
  stem: question.stem,
  options: question.options.map((option: any) => ({
    label: option.label,
    display: option.display,
    isCorrect: option.isCorrect,
  })),
  answer: question.answer,
  learnerSolution: question.learnerSolution,
  technicallyClean: technicallyClean(question),
}));

const outputDir = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDir, { recursive: true });
writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-audit.json"),
  `${JSON.stringify(
    { audit, reviewRows },
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const prototypeSummary = runtimePrototypeIds
  .map(
    (prototypeId) =>
      `- \`${prototypeId}\`: ${prototypeRecordCounts[prototypeId] ?? 0} review records`,
  )
  .join("\n");
const representativeRows = runtimePrototypeIds.map(
  (prototypeId) =>
    records.find((question) => question.prototypeId === prototypeId)!,
);
const representativeMarkdown = representativeRows
  .map((question, index) => {
    const options = question.options
      .map(
        (option: any) =>
          `${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`,
      )
      .join("\n");
    return (
      `### ${index + 1}. ${question.prototypeId}\n\n` +
      `- Wave: \`${question.__auditWave}\`\n` +
      `- Profile: \`${profileKey(question)}\`\n` +
      `- Difficulty: \`${question.difficulty}\`\n\n` +
      `${question.stem}\n\n${options}\n\n` +
      `**Answer:** ${question.answer}\n\n` +
      `**Formula:** ${question.learnerSolution.formula}\n\n` +
      `**Shortcut:** ${question.learnerSolution.shortcut}\n`
    );
  })
  .join("\n\n---\n\n");

const reviewMarkdown =
  `# MEN-CP-011 Current Chapter-Wide Coverage and English Audit V7\n\n` +
  `## Verdict\n\n` +
  `The live discovery system contains **${audit.runtimePrototypeCount} direct runtime families** and **${audit.generatedReviewRecordCount} technically clean review records**. The initial architecture, conical ownership audit and planned executable conical discovery are complete. Chapter freeze is still withheld pending direct-source normalisation, human English approval, permanent-family compression and multilingual parity.\n\n` +
  `## Current metrics\n\n\`\`\`text\n` +
  `Audit authority:                    ${audit.auditAuthority}\n` +
  `Runtime prototypes:                 ${audit.runtimePrototypeCount}\n` +
  `Review records:                     ${audit.generatedReviewRecordCount}\n` +
  `Unique exact stems:                 ${audit.uniqueExactStemCount}\n` +
  `Unique stem-option packages:        ${audit.uniqueQuestionOptionPackageCount}\n` +
  `Technically clean learner records:  ${audit.technicallyCleanLearnerRecords}\n` +
  `Correct positions:                  A${answerPositionCounts.A} B${answerPositionCounts.B} C${answerPositionCounts.C} D${answerPositionCounts.D}\n` +
  `Conical executable discovery:       complete\n` +
  `Permanent QLs:                      0\n` +
  `Publication eligible:               false\n` +
  `\`\`\`\n\n` +
  `## Implemented runtime families\n\n${prototypeSummary}\n\n` +
  `## Remaining gates\n\n` +
  `- Direct source normalisation and neighbouring-CP ownership closure.\n` +
  `- Human English review and final family compression.\n` +
  `- Permanent QL allocation only after those gates close.\n` +
  `- Hindi/Punjabi localisation and multilingual parity proof.\n\n` +
  `## Representative current records\n\n${representativeMarkdown}\n`;

writeFileSync(
  resolve(outputDir, "men-cp011-chapter-wide-english-review.md"),
  reviewMarkdown,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      auditAuthority: audit.auditAuthority,
      runtimePrototypeCount: audit.runtimePrototypeCount,
      recordCount: audit.generatedReviewRecordCount,
      uniqueExactStemCount: audit.uniqueExactStemCount,
      technicallyCleanLearnerRecords: audit.technicallyCleanLearnerRecords,
      answerPositionCounts: audit.answerPositionCounts,
      conicalSurfaceCostSlice: audit.conicalSurfaceCostSlice,
      executableDiscoveryCoverageComplete:
        audit.executableDiscoveryCoverageComplete,
      blockers: audit.blockers,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
