import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_TEMPORARY_CANDIDATE_REGISTRY_V1 } from "./geometry-temporary-candidate-registry-v1";
import {
  GEO_MERGE_SPLIT_PROPOSAL_STATE_V1,
  GEO_MERGE_SPLIT_PROPOSAL_V1,
} from "./geometry-merge-split-proposal-v1";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/geometry-merge-split-proposal-v1");
mkdirSync(outputDirectory, { recursive: true });

const mergedFamilies = GEO_MERGE_SPLIT_PROPOSAL_V1.filter((family) => family.candidateIds.length > 1);
const mergeSavings = mergedFamilies.reduce((sum, family) => sum + family.candidateIds.length - 1, 0);
const grouped = new Map<string, typeof GEO_MERGE_SPLIT_PROPOSAL_V1[number][]>();
for (const family of GEO_MERGE_SPLIT_PROPOSAL_V1) {
  const list = grouped.get(family.cpId) ?? [];
  list.push(family);
  grouped.set(family.cpId, list);
}

const json = {
  status: "GEOMETRY_STRICT_MERGE_SPLIT_PROPOSAL_V1",
  authorityRevision: 3,
  temporaryCandidateCount: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length,
  proposedSemanticFamilyCount: GEO_MERGE_SPLIT_PROPOSAL_V1.length,
  intentionalMergeGroupCount: mergedFamilies.length,
  mergeSavings,
  permanentQlCount: 0,
  permanentQlIdsReserved: false,
  permanentAllocationAuthorized: false,
  lifecycle: GEO_MERGE_SPLIT_PROPOSAL_STATE_V1,
  families: GEO_MERGE_SPLIT_PROPOSAL_V1,
};
writeFileSync(
  resolve(outputDirectory, "geometry-merge-split-proposal-v1.json"),
  JSON.stringify(json, null, 2) + "\n",
);

const md = [
  "# ExamTree Geometry — Strict 81→75 Merge/Split Proposal V1",
  "",
  "**Authority:** Composite Geometry Revision 3",
  "",
  `**Temporary executable candidates:** ${GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length}`,
  `**Proposed semantic learner families:** ${GEO_MERGE_SPLIT_PROPOSAL_V1.length}`,
  `**Intentional merge groups:** ${mergedFamilies.length}`,
  `**Duplicate-authority savings:** ${mergeSavings}`,
  "**Permanent QLs:** 0",
  "",
  "This is a proposal authority only. It does not reserve `GEO-QL-*` IDs or authorize solve-mode freeze, English freeze, localisation, Question Studio activation, Question Bank writes, test eligibility, publication or PR merge.",
  "",
  ...[...grouped.entries()].flatMap(([cpId, families]) => [
    `## ${cpId} — ${families.length} proposed families`,
    "",
    ...families.flatMap((family) => [
      `### ${family.proposalKey}`,
      "",
      `- Learner decision: ${family.learnerDecision}`,
      `- Candidate count: ${family.candidateIds.length}`,
      `- Candidates: ${family.candidateIds.map((id) => `\`${id}\``).join(", ")}`,
      `- Solve modes: ${family.solveModes.map((mode) => `\`${mode}\``).join(", ")}`,
      `- Decision: ${family.mergeRationale}`,
      "",
    ]),
  ]),
  "## Lifecycle gate",
  "",
  "Repository CI must prove exact 81-candidate coverage and the 75-family structure. After proof, explicit human approval is still required before permanent QL allocation.",
  "",
].join("\n");
writeFileSync(resolve(outputDirectory, "geometry-merge-split-proposal-v1.md"), md);

console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_STRICT_MERGE_SPLIT_PROPOSAL_V1",
  temporaryCandidateCount: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length,
  proposedSemanticFamilyCount: GEO_MERGE_SPLIT_PROPOSAL_V1.length,
  intentionalMergeGroupCount: mergedFamilies.length,
  mergeSavings,
  outputDirectory,
}));
