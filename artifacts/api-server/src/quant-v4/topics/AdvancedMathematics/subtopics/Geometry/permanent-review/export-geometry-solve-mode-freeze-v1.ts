import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_PERMANENT_QL_ALLOCATION_PROOF_V1 } from "./geometry-permanent-ql-allocation-proof-v1";
import {
  GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1,
  GEO_SOLVE_MODE_FREEZE_V1,
} from "./geometry-solve-mode-freeze-v1";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-solve-mode-freeze-v1");
mkdirSync(outputDirectory, { recursive: true });

const json = {
  status: "GEOMETRY_PERMANENT_75_SOLVE_MODE_FREEZE_V1",
  authorityRevision: 3,
  permanentQlAllocationProof: GEO_PERMANENT_QL_ALLOCATION_PROOF_V1,
  solveModeFreezeAuthority: GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1,
  solveModeFamilies: GEO_SOLVE_MODE_FREEZE_V1,
};
writeFileSync(resolve(outputDirectory, "geometry-solve-mode-freeze-v1.json"), JSON.stringify(json, null, 2) + "\n");

const grouped = new Map<string, typeof GEO_SOLVE_MODE_FREEZE_V1[number][]>();
for (const family of GEO_SOLVE_MODE_FREEZE_V1) {
  const list = grouped.get(family.cpId) ?? [];
  list.push(family);
  grouped.set(family.cpId, list);
}

const md = [
  "# ExamTree Geometry — Permanent Solve-Mode Freeze V1",
  "",
  `**Permanent QLs:** ${GEO_SOLVE_MODE_FREEZE_V1.length}`,
  `**Canonical solve-mode families:** ${GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyCount}`,
  `**Range:** ${GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyRange}`,
  `**Allocation proof:** run ${GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.workflowRunId}, job ${GEO_PERMANENT_QL_ALLOCATION_PROOF_V1.proof.workflowJobId}`,
  "",
  "Each permanent QL has exactly one canonical solve-mode family. Prototype solve-mode identifiers remain attached as provenance/parameter variants; they are not discarded or silently merged.",
  "",
  "English runtime, English freeze, localisation, Question Studio, Question Bank, test eligibility and publication remain locked until this solve-mode freeze itself is proven.",
  "",
  ...[...grouped.entries()].flatMap(([cpId, families]) => [
    `## ${cpId} — ${families.length} solve-mode families`,
    "",
    ...families.flatMap((family) => [
      `### ${family.canonicalSolveModeFamilyId} / ${family.permanentQlId} — ${family.proposalKey}`,
      "",
      `- Learner decision: ${family.learnerDecision}`,
      `- Freeze kind: ${family.freezeKind}`,
      `- Prototype solve modes: ${family.prototypeSolveModes.map((mode) => `\`${mode}\``).join(", ")}`,
      `- Temporary authorities: ${family.candidateIds.map((id) => `\`${id}\``).join(", ")}`,
      "",
    ]),
  ]),
  `After CI proof, next gate: **${GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.postProofNextGate}**.`,
  "",
].join("\n");

writeFileSync(resolve(outputDirectory, "geometry-solve-mode-freeze-v1.md"), md);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_PERMANENT_75_SOLVE_MODE_FREEZE_V1",
  permanentQlCount: GEO_SOLVE_MODE_FREEZE_V1.length,
  canonicalSolveModeFamilyCount: GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyCount,
  canonicalSolveModeFamilyRange: GEO_SOLVE_MODE_FREEZE_AUTHORITY_V1.canonicalSolveModeFamilyRange,
  outputDirectory,
}));
