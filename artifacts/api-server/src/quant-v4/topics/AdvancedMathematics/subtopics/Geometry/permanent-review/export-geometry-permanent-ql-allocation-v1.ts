import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PERMANENT_FAMILY_APPROVAL_V1 } from "./geometry-permanent-family-approval-v1";
import {
  GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  GEO_PERMANENT_QL_ALLOCATIONS_V1,
} from "./geometry-permanent-ql-allocation-v1";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-permanent-ql-allocation-v1");
mkdirSync(outputDirectory, { recursive: true });

const json = {
  status: "GEOMETRY_PERMANENT_75_QL_ALLOCATION_V1",
  authorityRevision: 3,
  approval: GEO_PERMANENT_FAMILY_APPROVAL_V1,
  allocationAuthority: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  allocations: GEO_PERMANENT_QL_ALLOCATIONS_V1,
};
writeFileSync(resolve(outputDirectory, "geometry-permanent-ql-allocation-v1.json"), JSON.stringify(json, null, 2) + "\n");

const grouped = new Map<string, typeof GEO_PERMANENT_QL_ALLOCATIONS_V1[number][]>();
for (const allocation of GEO_PERMANENT_QL_ALLOCATIONS_V1) {
  const list = grouped.get(allocation.cpId) ?? [];
  list.push(allocation);
  grouped.set(allocation.cpId, list);
}
const md = [
  "# ExamTree Geometry — Permanent 75 QL Allocation V1",
  "",
  `**Permanent QLs:** ${GEO_PERMANENT_QL_ALLOCATIONS_V1.length}`,
  `**Range:** ${GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlRange}`,
  `**Next available:** ${GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextAvailablePermanentQlId}`,
  `**Approval authority:** ${GEO_PERMANENT_FAMILY_APPROVAL_V1.authorityId}`,
  "",
  "Solve modes are not frozen. English runtime, localisation, Question Studio, Question Bank, test eligibility and publication remain locked.",
  "",
  ...[...grouped.entries()].flatMap(([cpId, allocations]) => [
    `## ${cpId} — ${allocations.length} permanent QLs`,
    "",
    ...allocations.flatMap((allocation) => [
      `### ${allocation.permanentQlId} — ${allocation.proposalKey}`,
      "",
      `- Learner decision: ${allocation.learnerDecision}`,
      `- Temporary authorities: ${allocation.candidateIds.map((id) => `\`${id}\``).join(", ")}`,
      `- Solve modes pending freeze: ${allocation.solveModes.map((mode) => `\`${mode}\``).join(", ")}`,
      "",
    ]),
  ]),
  `Next gate: **${GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextGate}**.`,
  "",
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-permanent-ql-allocation-v1.md"), md);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_PERMANENT_75_QL_ALLOCATION_V1",
  permanentQlCount: GEO_PERMANENT_QL_ALLOCATIONS_V1.length,
  permanentQlRange: GEO_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.permanentQlRange,
  outputDirectory,
}));
