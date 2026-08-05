import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateMenCp011ReviewBatch } from "../../cp011-foundation/exam-readiness-batch";

const SOURCE_AUTHORITY = "New-main@3d7e97aed15102c8be6615e5f4495d2efc2f706e";
const { records, audit } = generateMenCp011ReviewBatch(
  "men-cp011-post-merge-exam-readiness-review",
  12,
);

const payload = {
  meta: {
    packageId: "MEN-002",
    canonicalProblemId: "MEN-CP-011",
    wave: "MEN-CP-011-FOUNDATION-WAVE-01",
    sourceAuthority: SOURCE_AUTHORITY,
    diagramAuthority: "TUBE_EXAMTREE_EXAM_READY_V2",
    recordCount: records.length,
    prototypeCount: 4,
    permanentQlCount: 0,
    publicationEligible: false,
    audit,
  },
  records: records.map((question, index) => ({
    reviewId: `${question.prototypeId}::${index + 1}`,
    sampleNumber: index + 1,
    prototypeId: question.prototypeId,
    solveMode: question.solveMode,
    representation: question.state.representation,
    difficulty: question.difficulty,
    piPolicy: question.piPolicy,
    stem: question.stem,
    options: question.options.map((option) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    optionPermutationSeed: question.optionPermutationSeed,
    promptDiagram: {
      svg: question.diagram.svg,
      accessibleText: question.diagram.accessibleText,
      visibleLabels: [...question.diagram.visibleLabels],
    },
    solutionDiagram: {
      svg: question.solutionDiagram.svg,
      accessibleText: question.solutionDiagram.accessibleText,
      visibleLabels: [...question.solutionDiagram.visibleLabels],
    },
    learnerSolution: question.learnerSolution,
    admin: {
      explanation: question.explanation,
      trapCodes: [...question.renderSurfaces.admin.trapCodes],
      verification: question.verification,
      validation: question.validation,
    },
    renderPolicies: {
      attempt: question.renderSurfaces.attempt,
      practice: {
        diagramPolicy: question.renderSurfaces.practice.diagramPolicy,
        exposesInternalCodes: question.renderSurfaces.practice.exposesInternalCodes,
      },
      solution: {
        exposesInternalCodes: question.renderSurfaces.solution.exposesInternalCodes,
      },
      responsiveDiagramPolicy: question.renderSurfaces.responsiveDiagramPolicy,
    },
    state: {
      outerRadius: question.state.outerRadius.toString(),
      innerRadius: question.state.innerRadius.toString(),
      height: question.state.height.toString(),
      thickness: question.state.thickness.toString(),
      outerDiameter: question.state.outerDiameter.toString(),
      innerDiameter: question.state.innerDiameter.toString(),
      ringCoefficient: question.state.ringCoefficient.toString(),
    },
    lifecycle: {
      permanentQlId: question.permanentQlId,
      reviewStatus: question.reviewStatus,
      questionBankStatus: question.questionBankStatus,
      testEligibility: question.testEligibility,
      publiclyPublishable: question.publiclyPublishable,
      questionStudioDiscoverable: question.questionStudioDiscoverable,
    },
  })),
};

if (payload.meta.recordCount !== 48) {
  throw new Error(`Expected 48 records, received ${payload.meta.recordCount}.`);
}
if (audit.exactStemCount !== 48 || audit.exactQuestionOptionCount !== 48) {
  throw new Error("The post-merge review must contain no exact duplicate stems or stem-option packages.");
}
if (audit.maximumNormalizedStemRepetition > 3) {
  throw new Error("Normalized stem repetition exceeds the approved remediation limit.");
}
if (!Object.values(audit.answerPositionCounts).every((count) => count === 12)) {
  throw new Error("A, B, C and D must each contain exactly 12 correct answers.");
}
if (!payload.records.every((record) => record.admin.validation.valid)) {
  throw new Error("Every exported record must pass runtime validation.");
}
if (!payload.records.every((record) =>
  record.promptDiagram.svg.includes('data-diagram-role="PROMPT"') &&
  record.solutionDiagram.svg.includes('data-diagram-role="SOLUTION"') &&
  record.promptDiagram.svg.includes('data-responsive="true"') &&
  record.promptDiagram.svg.includes('data-label-placement="detached"')
)) {
  throw new Error("Every record must retain prompt/solution separation and responsive detached-label geometry.");
}
if (!payload.records.every((record) => {
  if (record.representation !== "OUTER_RADIUS_AND_THICKNESS" &&
      record.representation !== "INVERSE_INNER_RADIUS") return true;
  return record.promptDiagram.visibleLabels.includes("r = ?") &&
    !record.promptDiagram.svg.includes(`r = ${record.state.innerRadius} cm`) &&
    record.solutionDiagram.svg.includes(`r = ${record.state.innerRadius} cm`);
})) {
  throw new Error("Derived inner radius must remain hidden in the prompt and appear only in the solution diagram.");
}
if (!payload.records.every((record) =>
  !record.learnerSolution.wrongOptionAnalysis.some((text) => /\[[A-Z0-9_]+\]/.test(text)) &&
  !JSON.stringify(record.learnerSolution).includes("\\pih")
)) {
  throw new Error("Learner solutions may not expose trap codes or malformed TeX.");
}

const outputPath = resolve("dist/review/MEN-CP-011-Exam-Readiness-Review-Source.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${outputPath}`);
console.log(`Exported ${payload.meta.recordCount} records from ${payload.meta.sourceAuthority}.`);
