import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_GAP_CLOSURE_COUNTS_V1, GEO_GAP_CLOSURE_LEDGER_V1 } from "./geometry-gap-closure-ledger-v1";
import {
  GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1,
  GEO_TEMPORARY_CANDIDATE_REGISTRY_V1,
  GEO_TEMPORARY_CANDIDATE_STAGE_COUNTS_V1,
} from "../permanent-review/geometry-temporary-candidate-registry-v1";

const out = resolve(process.cwd(), "dist/quant-v4/geometry-gap-closure-v1");
mkdirSync(out, { recursive: true });

writeFileSync(
  resolve(out, "geometry-gap-closure-v1.json"),
  JSON.stringify({
    status: "GEOMETRY_SOURCE_GAP_CLOSURE_V1",
    authorityRevision: 3,
    immutableBaselineGapCount: 52,
    finalTemporaryExecutableCandidateCount: 81,
    permanentQlCount: 0,
    frozenSolveModeCount: 0,
    counts: GEO_GAP_CLOSURE_COUNTS_V1,
    sourceSaturationClaimAllowed: false,
    reasonSaturationNotClosed: "Five theorem directions remain explicitly source-deferred, and Banking/Punjab recruitment scope saturation remains outside this SSC closure pass.",
    entries: GEO_GAP_CLOSURE_LEDGER_V1,
  }, null, 2) + "\n",
);

writeFileSync(
  resolve(out, "geometry-temporary-candidate-registry-v1.json"),
  JSON.stringify({
    status: "GEOMETRY_TEMPORARY_CANDIDATE_REGISTRY_V1",
    authorityRevision: 3,
    state: GEO_TEMPORARY_CANDIDATE_REGISTRY_STATE_V1,
    stageCounts: GEO_TEMPORARY_CANDIDATE_STAGE_COUNTS_V1,
    candidates: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1,
  }, null, 2) + "\n",
);

const grouped = new Map<string, typeof GEO_GAP_CLOSURE_LEDGER_V1[number][]>();
for (const entry of GEO_GAP_CLOSURE_LEDGER_V1) {
  const list = grouped.get(entry.cpId) ?? [];
  list.push(entry);
  grouped.set(entry.cpId, list);
}

const md = [
  "# ExamTree Geometry — 52-Gap Closure Ledger V1",
  "",
  "**Authority:** Composite Geometry Revision 3",
  "",
  "**Prototype waves:** finished through Wave 13",
  "",
  "**Final executable candidates:** 81",
  "",
  "**Permanent QLs:** 0",
  "",
  "**Frozen solve modes:** 0",
  "",
  `**Closure counts:** ${GEO_GAP_CLOSURE_COUNTS_V1.implemented} implemented · ${GEO_GAP_CLOSURE_COUNTS_V1.merged} merged · ${GEO_GAP_CLOSURE_COUNTS_V1.ownedOtherChapter} other-chapter owned · ${GEO_GAP_CLOSURE_COUNTS_V1.sourceDeferred} source-deferred`,
  "",
  "There are **no open or unclassified Source Saturation Audit V1 gaps**. This is a remediation-closure claim, not a source-saturation or production-readiness claim.",
  "",
  ...[...grouped.entries()].flatMap(([cp, entries]) => [
    `## ${cp}`,
    "",
    ...entries.map((entry) => `- **${entry.gapId.split("/")[1]}** — \`${entry.state}\` — ${entry.resolution}${entry.revisitTrigger ? ` Reopen: ${entry.revisitTrigger}` : ""}`),
    "",
  ]),
  "## Lifecycle",
  "",
  "- executable closure: **proven by retained Phase-5 gate**",
  "- canonical 81-candidate registry: **proven**",
  "- merge/split review: **active**",
  "- source saturation claim: **false**",
  "- permanent QL allocation: **false**",
  "- permanent solve-mode freeze: **false**",
  "- Question Studio activation: **false**",
  "- Question Bank writes: **false**",
  "- test eligibility: **false**",
  "- public publication: **false**",
  "",
  "Next lifecycle gate: exhaustive semantic merge/split compression over the exported 81-candidate registry, followed by a permanent QL proposal. Permanent numbering remains unauthorized until that proposal is approved.",
].join("\n");

writeFileSync(resolve(out, "geometry-gap-closure-v1.md"), md + "\n");
console.log(JSON.stringify({
  status: "EXPORTED_GEOMETRY_GAP_CLOSURE_V1",
  counts: GEO_GAP_CLOSURE_COUNTS_V1,
  candidateCount: GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length,
  outputDirectory: out,
}));
