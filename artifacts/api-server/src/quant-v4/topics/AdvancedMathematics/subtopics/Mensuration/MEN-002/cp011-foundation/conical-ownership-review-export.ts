import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
  MEN_CP011_CONICAL_OWNERSHIP_FIXTURES,
  classifyMenCp011ConicalScenario,
  type MenCp011ConicalOwner,
} from "./conical-ownership-canonical";

const decisions = MEN_CP011_CONICAL_OWNERSHIP_FIXTURES.map((scenario) => ({
  scenario,
  decision: classifyMenCp011ConicalScenario(scenario),
}));

const ownerCounts: Record<MenCp011ConicalOwner, number> = {
  "MEN-CP-008": 0,
  "MEN-CP-010": 0,
  "MEN-CP-011": 0,
  "MEN-CP-012": 0,
  "MEN-CP-013": 0,
  REJECT_UNDERSPECIFIED: 0,
};
for (const { decision } of decisions) ownerCounts[decision.owner] += 1;

const outputBase = resolve(
  process.cwd(),
  "dist/quant-v4/men-cp011-conical-ownership-audit",
);
mkdirSync(dirname(outputBase), { recursive: true });

const replacer = (_key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

writeFileSync(
  `${outputBase}.json`,
  JSON.stringify(
    {
      authority: MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
      generatedAt: new Date().toISOString(),
      scenarioCount: decisions.length,
      ownerCounts,
      initialArchitectureStillComplete: true,
      permanentQlCount: 0,
      decisions,
    },
    replacer,
    2,
  ),
  "utf8",
);

const lines = [
  "# MEN-CP-011 Conical Shell Ownership Audit",
  "",
  "## Summary",
  "",
  "```text",
  `Authority:                       ${MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY}`,
  `Scenarios:                       ${decisions.length}`,
  `MEN-CP-008 direct cone:          ${ownerCounts["MEN-CP-008"]}`,
  `MEN-CP-010 frustum:              ${ownerCounts["MEN-CP-010"]}`,
  `MEN-CP-011 shell/vessel:         ${ownerCounts["MEN-CP-011"]}`,
  `MEN-CP-012 recasting:            ${ownerCounts["MEN-CP-012"]}`,
  `MEN-CP-013 composite removal:    ${ownerCounts["MEN-CP-013"]}`,
  `Rejected as underspecified:      ${ownerCounts.REJECT_UNDERSPECIFIED}`,
  "Permanent QLs:                   0",
  "Question Studio:                 disabled",
  "Publication:                     false",
  "```",
  "",
  "## Decisions",
  "",
];

for (const { scenario, decision } of decisions) {
  lines.push(
    `### ${scenario.scenarioId}`,
    "",
    `- Task: \`${scenario.task}\``,
    `- Relation: \`${scenario.relation}\``,
    `- Expected owner: \`${scenario.expectedOwner}\``,
    `- Resolved owner: \`${decision.owner}\``,
    `- Executable: \`${decision.executable}\``,
    `- Reason: ${decision.reason}`,
    "",
    "Checks:",
    "",
    ...decision.checks.map(
      (check) =>
        `- ${check.passed ? "PASS" : "FAIL"} — ${check.name}: ${check.message}`,
    ),
    "",
  );
}

lines.push(
  "## Authorised next CP-011 prototypes",
  "",
  "```text",
  "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-EXPLICIT-INNER",
  "MEN-CP011-PROT-HOLLOW-CONE-MATERIAL-VOLUME-SIMILAR-WALL",
  "MEN-CP011-PROT-HOLLOW-CONE-CURVED-AREA-BOTH-SIDES",
  "MEN-CP011-PROT-INNER-CONICAL-LINING-COST-FROM-SHELL",
  "```",
  "",
  "Direct outer cone area/volume/canvas cost remains MEN-CP-008. Frustum measurement remains MEN-CP-010. Recasting remains MEN-CP-012. Composite drilled-cone subtraction remains MEN-CP-013.",
);

writeFileSync(`${outputBase}.md`, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      authority: MEN_CP011_CONICAL_OWNERSHIP_AUTHORITY,
      scenarioCount: decisions.length,
      ownerCounts,
      outputJson: `${outputBase}.json`,
      outputMarkdown: `${outputBase}.md`,
    },
    null,
    2,
  ),
);
