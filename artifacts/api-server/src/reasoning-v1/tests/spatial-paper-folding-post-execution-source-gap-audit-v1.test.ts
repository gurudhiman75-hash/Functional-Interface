import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_TPF_POST_EXECUTION_GAPS_V1,
  PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1,
} from "../foundation/spatial/paper-folding-post-execution-source-gap-audit-v1";

assert.equal(PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1.exactGreenWave1Head, "38b1d8047c3c5690d6e74ea7cf0d5e1d127590f0");
assert.equal(PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1.exactGreenWave1Run, 32163013843);
assert.equal(PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1.exactGreenWave1Artifact, 9334855376);
assert.equal(PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1.permanentQlAllocationAllowed, false);
assert.equal(PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1.questionStudioAllowed, false);
assert.equal(PFC_TPF_POST_EXECUTION_GAPS_V1.filter((gap) => gap.blocksSscCoreSaturation).length, 4);
assert.deepEqual(
  PFC_TPF_POST_EXECUTION_GAPS_V1.filter((gap) => gap.blocksSscCoreSaturation).map((gap) => gap.gapId).sort(),
  ["PFC-GAP-W2-001", "PFC-GAP-W2-002", "PFC-GAP-W2-003", "TPF-GAP-W2-001"],
);
assert.ok(PFC_TPF_POST_EXECUTION_GAPS_V1.some((gap) => gap.gapId === "EXAM-HOLD-BANKING-PFC" && !gap.blocksSscCoreSaturation));
assert.ok(PFC_TPF_POST_EXECUTION_GAPS_V1.some((gap) => gap.gapId === "EXAM-HOLD-PUNJAB-PFC" && !gap.blocksSscCoreSaturation));

const evidence = {
  authority: PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1,
  status: "PASS_PFC_TPF_POST_EXECUTION_SOURCE_GAP_AUDIT_V1",
  gaps: PFC_TPF_POST_EXECUTION_GAPS_V1,
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-post-execution-source-gap-audit-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
