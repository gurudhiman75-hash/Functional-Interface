import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MENSURATION_CANONICAL_PROBLEM_STATUS,
  auditMensurationCompletion,
} from "./mensuration-completion-audit";

const audit = auditMensurationCompletion();
const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/mensuration-13-cp-completion-audit-v1",
);
mkdirSync(dirname(outputBase), { recursive: true });

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      audit,
      canonicalProblems: MENSURATION_CANONICAL_PROBLEM_STATUS,
    },
    null,
    2,
  ),
  "utf8",
);

const lines = [
  "# Mensuration 13-CP Completion Audit V1",
  "",
  "## Verdict",
  "",
  "Mensuration is partially implemented, not complete. Ten of thirteen canonical problems have executable English/runtime authorities. Three remain design-only. No canonical problem is activated for Question Studio, Question Bank, tests or public publication.",
  "",
  "```text",
  `Authority:                         ${audit.authority}`,
  `Canonical problems:                ${audit.canonicalProblemCount}`,
  `Engineering implemented:           ${audit.engineeringImplementedCount}`,
  `Design-only / not implemented:     ${audit.designOnlyNotImplementedCount}`,
  `Activation-ready:                  ${audit.activationReadyCount}`,
  `Question Studio discoverable:      ${audit.questionStudioDiscoverableCount}`,
  `Question Bank stored:              ${audit.questionBankStoredCount}`,
  `Test eligible:                     ${audit.testEligibleCount}`,
  `Publicly publishable:              ${audit.publiclyPublishableCount}`,
  `Mensuration engineering complete:  ${audit.mensurationEngineeringComplete}`,
  `Mensuration product ready:         ${audit.mensurationProductReady}`,
  "```",
  "",
  "## Canonical problem matrix",
  "",
  "| CP | Package | Scope | Status | QL range | Evidence |",
  "|---|---|---|---|---|---|",
];

for (const row of MENSURATION_CANONICAL_PROBLEM_STATUS) {
  lines.push(
    `| ${row.cpId} | ${row.packageId} | ${row.title} | ${row.implementationStatus} | ${row.permanentQlRange ?? "—"} | ${row.evidencePr ? `PR #${row.evidencePr}` : "design authority only"} |`,
  );
}

lines.push("", "## Remaining implementation order", "");
for (const cpId of audit.nextImplementationOrder) {
  const row = MENSURATION_CANONICAL_PROBLEM_STATUS.find(
    (candidate) => candidate.cpId === cpId,
  )!;
  lines.push(`1. **${row.cpId} — ${row.title}**: ${row.nextAction}`);
}

lines.push(
  "",
  "## Activation boundary",
  "",
  "Implementation completion must not be confused with product activation. Every CP remains inactive, hidden from Question Studio, absent from the Question Bank, test-ineligible and unpublished. Localisation, human editorial/source review and product routing remain later gates according to each CP's own authority.",
  "",
  "## Conclusion",
  "",
  `\`${audit.conclusion}\``,
  "",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      outputBase,
      canonicalProblemCount: audit.canonicalProblemCount,
      engineeringImplementedCount: audit.engineeringImplementedCount,
      designOnlyNotImplementedCount: audit.designOnlyNotImplementedCount,
      activationReadyCount: audit.activationReadyCount,
      nextImplementationOrder: audit.nextImplementationOrder,
    },
    null,
    2,
  ),
);
