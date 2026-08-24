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
await runStage("knowledge engine", () => import("../knowledge-v1/engine.test"));
await runStage("composition verifier", () => import("../knowledge-v1/composition-verifier.test"));
await runStage("COM-001 discovery", () =>
  import("../knowledge-v1/computer-awareness/com001-memory-storage-discovery.test")
);
await runStage("COM-001 corpus requirements", () =>
  import("../knowledge-v1/computer-awareness/com001-memory-storage-corpus-requirements.test")
);
await runStage("COM-001 source manifest", () =>
  import("../knowledge-v1/computer-awareness/com001-source-manifest.test")
);
await runStage("COM-001 source authority extension", () =>
  import("../knowledge-v1/computer-awareness/com001-source-authority-extension.test")
);
await runStage("COM-001 candidate corpus", () =>
  import("../knowledge-v1/computer-awareness/com001-memory-storage-candidate-corpus.test")
);
await runStage("COM-001 merge/split audit", () =>
  import("../knowledge-v1/computer-awareness/com001-memory-storage-merge-split-audit.test")
);
await runStage("COM-001 readiness", () =>
  import("../knowledge-v1/computer-awareness/com001-memory-storage-readiness.test")
);
await runStage("COM-001 storage profiles", () =>
  import("../knowledge-v1/computer-awareness/com001-storage-device-profiles.test")
);
await runStage("COM-001 QL allocation readiness", () =>
  import("../knowledge-v1/computer-awareness/com001-ql-allocation-readiness.test")
);
await runStage("COM-001 permanent QL allocation", () =>
  import("../knowledge-v1/computer-awareness/com001-memory-storage-ql-allocation.test")
);
await runStage("COM-001 360-question review synthesis", () =>
  import("../knowledge-v1/computer-awareness/com001-review-synthesis.test")
);

console.log("Question Studio content engine foundation suite passed.");
