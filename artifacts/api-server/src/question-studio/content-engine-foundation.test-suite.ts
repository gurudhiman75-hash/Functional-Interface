async function runStage(label: string, loader: () => Promise<unknown>) {
  try {
    await loader();
    console.log(`[content-engine-foundation] PASS: ${label}`);
  } catch (error) {
    console.error(`[content-engine-foundation] FAIL: ${label}`);
    throw error;
  }
}

await runStage("engine registry", () => import("./engine-registry.test"));
await runStage("engine route integration", () => import("./engine-route-integration.test"));
await runStage("standard Question Studio lifecycle", () => import("./standard-lifecycle.test"));
await runStage("knowledge engine", () => import("../knowledge-v1/engine.test"));
await runStage("composition verifier", () => import("../knowledge-v1/composition-verifier.test"));
await runStage("COM-001 discovery", () => import("../knowledge-v1/computer-awareness/com001-memory-storage-discovery.test"));
await runStage("COM-001 corpus requirements", () => import("../knowledge-v1/computer-awareness/com001-memory-storage-corpus-requirements.test"));
await runStage("COM-001 source manifest", () => import("../knowledge-v1/computer-awareness/com001-source-manifest.test"));
await runStage("COM-001 source authority extension", () => import("../knowledge-v1/computer-awareness/com001-source-authority-extension.test"));
await runStage("COM-001 candidate corpus", () => import("../knowledge-v1/computer-awareness/com001-memory-storage-candidate-corpus.test"));
await runStage("COM-001 merge/split audit", () => import("../knowledge-v1/computer-awareness/com001-memory-storage-merge-split-audit.test"));
await runStage("COM-001 readiness", () => import("../knowledge-v1/computer-awareness/com001-memory-storage-readiness.test"));
await runStage("COM-001 storage profiles", () => import("../knowledge-v1/computer-awareness/com001-storage-device-profiles.test"));
await runStage("COM-001 QL allocation readiness", () => import("../knowledge-v1/computer-awareness/com001-ql-allocation-readiness.test"));
await runStage("COM-001 permanent QL allocation", () => import("../knowledge-v1/computer-awareness/com001-memory-storage-ql-allocation.test"));
await runStage("COM-001 editorial fact review", () => import("../knowledge-v1/computer-awareness/com001-editorial-review.test"));
await runStage("COM-001 360-question review synthesis", () => import("../knowledge-v1/computer-awareness/com001-review-synthesis.test"));
await runStage("COM-001 360-question editorial quality audit", () => import("../knowledge-v1/computer-awareness/com001-editorial-question-audit.test"));
await runStage("COM-001 English freeze V1", () => import("../knowledge-v1/computer-awareness/com001-english-freeze-v1.test"));
await runStage("COM-001 Hindi/Punjab localization parity V1", () => import("../knowledge-v1/computer-awareness/com001-localization-v1.test"));
await runStage("COM-001 Hindi/Punjabi localization freeze V1", () => import("../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v1.test"));
await runStage("COM-001 standard Question Studio adapter audit", () => import("./engines/knowledge-v1-com001-adapter.test"));
await runStage("COM-001 historical review integration authority V1", () => import("./engines/com001-question-studio-review-integration-v1.test"));
await runStage("COM-001 human review wave 1 sampler", () => import("../knowledge-v1/computer-awareness/com001-human-review-wave1.test"));
await runStage("COM-001 human review wave 2 sampler", () => import("../knowledge-v1/computer-awareness/com001-human-review-wave2.test"));
await runStage("COM-001 human review wave 3 QL-009 sampler", () => import("../knowledge-v1/computer-awareness/com001-human-review-wave3.test"));
await runStage("COM-001 360-question English V2 candidate audit", () => import("../knowledge-v1/computer-awareness/com001-review-synthesis-v2.test"));
await runStage("COM-001 English freeze V2", () => import("../knowledge-v1/computer-awareness/com001-english-freeze-v2.test"));
await runStage("COM-001 Hindi/Punjabi localization parity V2", () => import("../knowledge-v1/computer-awareness/com001-localization-v2.test"));
await runStage("COM-001 Hindi/Punjabi localization freeze V2", () => import("../knowledge-v1/computer-awareness/com001-hi-pa-localization-freeze-v2.test"));
await runStage("COM-001 historical review integration authority V2", () => import("./engines/com001-question-studio-review-integration-v2.test"));
await runStage("COM-001 V2 topology difficulty classifier", () => import("../knowledge-v1/computer-awareness/com001-difficulty-routing-v2.test"));
await runStage("COM-001 historical review difficulty authority V1", () => import("./engines/com001-question-studio-review-difficulty-authority-v1.test"));
await runStage("COM-001 Question Bank normalization audit V1", () => import("./engines/com001-question-bank-readiness-v1.test"));

await runStage("COM-002 source/PYQ manifest", () => import("../knowledge-v1/computer-awareness/com002-source-manifest.test"));
await runStage("COM-002 source authority extension", () => import("../knowledge-v1/computer-awareness/com002-source-authority-extension.test"));
await runStage("COM-002 operating-system discovery inventory", () => import("../knowledge-v1/computer-awareness/com002-operating-system-discovery.test"));
await runStage("COM-002 cross-exam Banking PYQ evidence", () => import("../knowledge-v1/computer-awareness/com002-cross-exam-pyq-evidence.test"));
await runStage("COM-002 recent SSC Tier-II PYQ evidence", () => import("../knowledge-v1/computer-awareness/com002-ssc-tier2-pyq-evidence.test"));
await runStage("COM-002 merge/split ownership audit", () => import("../knowledge-v1/computer-awareness/com002-operating-system-merge-split-audit.test"));
await runStage("COM-002 permanent allocation readiness", () => import("../knowledge-v1/computer-awareness/com002-allocation-readiness.test"));
await runStage("COM-002 permanent CP/QL allocation", () => import("../knowledge-v1/computer-awareness/com002-permanent-ql-allocation.test"));

console.log("Question Studio content engine foundation suite passed.");
