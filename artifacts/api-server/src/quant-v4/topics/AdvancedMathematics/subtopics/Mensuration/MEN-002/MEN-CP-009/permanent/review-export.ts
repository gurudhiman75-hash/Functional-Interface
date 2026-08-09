import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { auditMenCp009Registry, MEN_CP_009_FROZEN_QLS } from "./registry";
import { generateMenCp009Question } from "./runtime";

const registry = auditMenCp009Registry();
const seeds = ["review-a", "review-b", "review-c", "review-d"] as const;
const reviewRows = MEN_CP_009_FROZEN_QLS.flatMap((definition) =>
  seeds.map((seed) => generateMenCp009Question(definition.qlId, seed)),
);
const answerPositions = reviewRows.reduce<Record<string, number>>((counts, question) => {
  const label = question.options[question.correctIndex]!.label;
  counts[label] = (counts[label] ?? 0) + 1;
  return counts;
}, {});
const audit = {
  authority: "MEN-CP009-ENGLISH-IMPLEMENTATION-V1",
  completionStatus: "IMPLEMENTATION_COMPLETE__ACTIVATION_LOCKED",
  qlCount: registry.qlCount,
  firstQlId: registry.firstQlId,
  lastQlId: registry.lastQlId,
  deterministicProofPackages: registry.qlCount * 80,
  reviewRecordCount: reviewRows.length,
  validReviewRecordCount: reviewRows.filter((question) => question.validation.valid).length,
  independentlyVerifiedReviewRecordCount: reviewRows.filter((question) => question.verification.valid).length,
  uniqueReviewStems: new Set(reviewRows.map((question) => question.stem)).size,
  uniqueStemOptionPackages: new Set(reviewRows.map((question) => `${question.stem}|${question.options.map((option) => option.display).join("|")}`)).size,
  answerPositions,
  piPolicies: [...new Set(reviewRows.map((question) => question.piPolicy))],
  permanentQlAllocated: true,
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  humanEnglishApproval: null,
  directSourceNormalisationComplete: false,
  hindiParity: false,
  punjabiParity: false,
  implementationComplete: true,
  activationReady: false,
} as const;

const outputBase = resolve(process.cwd(), "dist/quant-v4/men-cp009-complete-v1");
mkdirSync(dirname(outputBase), { recursive: true });
function replacer(_key: string, value: unknown) { return typeof value === "bigint" ? value.toString() : value; }
writeFileSync(`${outputBase}.json`, `${JSON.stringify({ generatedAt: new Date().toISOString(), audit, registry: MEN_CP_009_FROZEN_QLS, reviewRows }, replacer, 2)}\n`, "utf8");

const markdown = [
  "# MEN-CP-009 Complete English Implementation V1",
  "",
  "## Verdict",
  "",
  "```text",
  `Status:                         ${audit.completionStatus}`,
  `Permanent QLs:                  ${audit.qlCount}`,
  `QL range:                       ${audit.firstQlId}..${audit.lastQlId}`,
  `Deterministic proof packages:   ${audit.deterministicProofPackages}`,
  `Review records:                 ${audit.reviewRecordCount}`,
  `Valid review records:           ${audit.validReviewRecordCount}`,
  `Independently verified:         ${audit.independentlyVerifiedReviewRecordCount}`,
  `Unique review stems:            ${audit.uniqueReviewStems}`,
  `Unique stem-option packages:    ${audit.uniqueStemOptionPackages}`,
  `Answer positions:               A${answerPositions.A} B${answerPositions.B} C${answerPositions.C} D${answerPositions.D}`,
  "```",
  "",
  "## Frozen family registry",
  "",
  "| QL | Family | Solve mode | Target |",
  "|---|---|---|---|",
  ...MEN_CP_009_FROZEN_QLS.map((row) => `| \`${row.qlId}\` | ${row.title} | \`${row.solveMode}\` | ${row.target} |`),
  "",
  "## Ownership boundary",
  "",
  "- CP-009 owns direct and inverse sphere/hemisphere measurement, applications, ratios and scaling.",
  "- Hollow spherical and hemispherical shells remain with CP-011.",
  "- Melting, recasting and number of new solids remain with CP-012.",
  "- Inscribed, circumscribed, composite and displacement states remain with CP-013.",
  "",
  "## Activation locks",
  "",
  "```text",
  "Question Studio:       disabled",
  "Question Bank:         NOT_STORED",
  "Mock-test eligibility: INELIGIBLE",
  "Public publication:    false",
  "Human English review:  pending",
  "Direct source review:  pending",
  "Hindi parity:          pending",
  "Punjabi parity:        pending",
  "```",
  "",
  "## Review questions",
  "",
  ...reviewRows.flatMap((question, index) => [
    `### ${index + 1}. ${question.permanentQlId} — ${question.familyId}`,
    "",
    question.stem,
    "",
    ...question.options.map((option) => `- ${option.label}. ${option.display}${option.isCorrect ? " **(correct)**" : ""}`),
    "",
    `**Answer:** ${question.answer}`,
    "",
    `**Rule:** ${question.explanation.keyRule}`,
    "",
    ...question.explanation.steps.map((step) => `- **${step.title}:** ${step.body}${step.equation ? ` — $${step.equation}$` : ""}`),
    "",
    `**Shortcut:** ${question.explanation.shortcut}`,
    "",
  ]),
].join("\n");

writeFileSync(`${outputBase}.md`, markdown, "utf8");
console.log(JSON.stringify({ ...audit, outputJson: `${outputBase}.json`, outputMarkdown: `${outputBase}.md` }, null, 2));
