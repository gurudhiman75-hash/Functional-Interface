import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MEN_CP011_OPEN_CONTAINER_AUTHORITY,
  MEN_CP011_OPEN_CUBOID_DISPOSITION,
  generateMenCp011OpenContainerReviewBatch,
  proveMenCp011OpenCuboidOwnership,
} from "./open-containers";

const review = generateMenCp011OpenContainerReviewBatch();
const boundaryProofs = Array.from({ length: 32 }, (_, index) =>
  proveMenCp011OpenCuboidOwnership(
    `men-cp011-open-cuboid-review-boundary:${index}`,
  ),
);
if (!boundaryProofs.every((proof) => proof.valid)) {
  throw new Error("The MEN-CP-011/MEN-CP-007 open-cuboid ownership boundary failed.");
}

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const jsonPath = resolve(
  outputDirectory,
  "men-cp011-open-containers-wave01-review.json",
);
const markdownPath = resolve(
  outputDirectory,
  "men-cp011-open-containers-wave01-review.md",
);

const evidence = {
  authority: MEN_CP011_OPEN_CONTAINER_AUTHORITY,
  generatedAt: new Date().toISOString(),
  sourceCommit: process.env.GITHUB_SHA ?? "LOCAL_OR_UNSPECIFIED",
  lifecycle: {
    permanentQlCount: 0,
    questionStudio: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
  openCuboidDisposition: MEN_CP011_OPEN_CUBOID_DISPOSITION,
  openCuboidBoundaryProofCount: boundaryProofs.length,
  audit: review.audit,
  records: review.records.map((question) => ({
    prototypeId: question.prototypeId,
    solveMode: question.solveMode,
    seed: question.seed,
    difficulty: question.difficulty,
    piPolicy: question.piPolicy,
    linearUnit: question.state.linearUnit,
    areaUnit: question.unit,
    radius: question.state.radius,
    height: question.state.height,
    openEndCount: question.state.openEndCount,
    stem: question.stem,
    options: question.options.map((option) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    correctIndex: question.correctIndex,
    answer: question.answer,
    surfaceLedger: question.state.surfaceLedger,
    learnerSolution: question.learnerSolution,
    validation: question.validation,
    verification: question.verification,
  })),
};

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    evidence,
    (_key, value) => (typeof value === "bigint" ? value.toString() : value),
    2,
  )}\n`,
  "utf8",
);

const markdown = [
  "# MEN-CP-011 Open-Container Wave 01 Review",
  "",
  `Authority: \`${MEN_CP011_OPEN_CONTAINER_AUTHORITY}\``,
  "",
  "## Lifecycle",
  "",
  "- Permanent QLs: **0**",
  "- Question Studio: **disabled**",
  "- Question Bank: **NOT_STORED**",
  "- Test eligibility: **INELIGIBLE**",
  "- Public publication: **false**",
  "",
  "## Ownership decision",
  "",
  `The candidate \`${MEN_CP011_OPEN_CUBOID_DISPOSITION.candidatePrototypeId}\` is not duplicated. It remains owned by \`${MEN_CP011_OPEN_CUBOID_DISPOSITION.ownerPrototypeId}\` under \`${MEN_CP011_OPEN_CUBOID_DISPOSITION.ownerCanonicalProblemId}\`.`,
  "",
  MEN_CP011_OPEN_CUBOID_DISPOSITION.reason,
  "",
  `Boundary proofs executed: **${boundaryProofs.length}**`,
  "",
  "## Runtime review matrix",
  "",
  `- Runtime prototypes: **${review.audit.prototypeCount}**`,
  `- Review records: **${review.audit.recordCount}**`,
  `- Unique exact stems: **${review.audit.exactStemCount}**`,
  `- Unique stem-option packages: **${review.audit.exactQuestionOptionCount}**`,
  `- Normalized stem groups: **${review.audit.normalizedStemGroupCount}**`,
  `- Maximum normalized repetition: **${review.audit.maximumNormalizedStemRepetition}**`,
  `- Unique physical states: **${review.audit.uniquePhysicalStateCount}**`,
  `- Answer positions: **A${review.audit.answerPositionCounts.A} B${review.audit.answerPositionCounts.B} C${review.audit.answerPositionCounts.C} D${review.audit.answerPositionCounts.D}**`,
  "",
  "### Unit and π profiles",
  "",
  ...Object.entries(review.audit.profileCounts).map(
    ([profile, count]) => `- \`${profile}\`: ${count}`,
  ),
  "",
  "## Review records",
  "",
  ...review.records.flatMap((question, index) => [
    `### ${index + 1}. ${question.prototypeId}`,
    "",
    `- Seed: \`${question.seed}\``,
    `- State: radius ${question.state.radius} ${question.state.linearUnit}, height ${question.state.height} ${question.state.linearUnit}, open ends ${question.state.openEndCount}`,
    `- π policy: \`${question.piPolicy}\``,
    `- Stem: ${question.stem}`,
    `- Options: ${question.options.map((option) => `${option.label}. ${option.display}`).join(" | ")}`,
    `- Correct answer: **${question.answer}**`,
    `- Formula: ${question.learnerSolution.formula}`,
    `- Shortcut: ${question.learnerSolution.shortcut}`,
    "",
  ]),
  "## Remaining blockers",
  "",
  ...review.audit.blockers.map((blocker) => `- \`${blocker}\``),
  "",
].join("\n");

writeFileSync(markdownPath, markdown, "utf8");

console.log(
  `MEN-CP-011 open-container review exported: ${review.audit.recordCount} records, ${review.audit.uniquePhysicalStateCount} unique states, A${review.audit.answerPositionCounts.A} B${review.audit.answerPositionCounts.B} C${review.audit.answerPositionCounts.C} D${review.audit.answerPositionCounts.D}, and ${boundaryProofs.length} open-cuboid ownership proofs.`,
);
