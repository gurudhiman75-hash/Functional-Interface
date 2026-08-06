import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildClsCp008OwnershipAudit } from "./ownership-registry";

const audit = buildClsCp008OwnershipAudit();
const outputDir = path.resolve(
  process.cwd(),
  "dist/reasoning-v1/cls-001/cp008-ownership-review",
);

const candidateRows = audit.candidates.map((candidate) => [
  candidate.candidateId,
  candidate.label,
  candidate.disposition,
  candidate.targetOwner ?? "—",
  candidate.targetQlId ?? "—",
  candidate.renderer,
  candidate.sourceBacked ? "yes" : "no",
  candidate.recurringSourceAuthority ? "yes" : "no",
  candidate.reason,
]);

const sourceRows = audit.sourceControls.map((control) => [
  control.sourceControlId,
  control.sourceDocument,
  control.sourceLocation,
  control.candidateId,
  control.renderer,
  control.observedForm,
]);

const table = (headers: readonly string[], rows: readonly (readonly string[])[]): string => [
  `| ${headers.join(" | ")} |`,
  `| ${headers.map(() => "---").join(" | ")} |`,
  ...rows.map((row) => `| ${row.map((value) => value.replaceAll("|", "\\|")).join(" | ")} |`),
].join("\n");

const markdown = [
  "# CLS-CP-008 Mixed-Token Ownership Review",
  "",
  "## Result",
  "",
  `- Candidate families audited: ${audit.candidates.length}`,
  `- Source controls audited: ${audit.sourceControls.length}`,
  `- New permanent QLs: ${audit.permanentQlCount}`,
  `- New runtime generators: ${audit.newRuntimeGeneratorCount}`,
  `- Question Studio discoverable: ${audit.questionStudioDiscoverable}`,
  `- Question Bank writable: ${audit.questionBankWritable}`,
  `- Test eligible: ${audit.testEligible}`,
  `- Publicly publishable: ${audit.publiclyPublishable}`,
  "",
  "## Candidate dispositions",
  "",
  table(
    ["Candidate", "Family", "Disposition", "Owner", "QL", "Renderer", "Source", "Recurring", "Reason"],
    candidateRows,
  ),
  "",
  "## Source controls",
  "",
  table(
    ["Control", "Document", "Location", "Candidate", "Renderer", "Observed form"],
    sourceRows,
  ),
  "",
  "## Allocation conclusion",
  "",
  "The only renderer-safe textual mixed-symbol control merges into `CLS-QL-001`. All other source-backed candidates belong to dedicated chapters, and source-thin synthesis proposals are rejected. The Classification inventory remains `CLS-QL-001` through `CLS-QL-013`.",
  "",
].join("\n");

await mkdir(outputDir, { recursive: true });
await writeFile(
  path.join(outputDir, "cls-cp008-ownership-review.json"),
  `${JSON.stringify(audit, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDir, "cls-cp008-ownership-review.md"),
  `${markdown}\n`,
  "utf8",
);

console.log("CLS-CP-008 ownership review written.", {
  outputDir,
  candidateFamilies: audit.candidates.length,
  sourceControls: audit.sourceControls.length,
  permanentQlCount: audit.permanentQlCount,
  newRuntimeGeneratorCount: audit.newRuntimeGeneratorCount,
});
