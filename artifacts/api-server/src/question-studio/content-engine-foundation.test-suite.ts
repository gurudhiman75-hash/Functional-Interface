const stages = [
  ["engine registry", "./engine-registry.test"],
  ["engine route integration", "./engine-route-integration.test"],
  ["knowledge engine", "../knowledge-v1/engine.test"],
  ["composition verifier", "../knowledge-v1/composition-verifier.test"],
  ["COM-001 discovery", "../knowledge-v1/computer-awareness/com001-memory-storage-discovery.test"],
  ["COM-001 corpus requirements", "../knowledge-v1/computer-awareness/com001-memory-storage-corpus-requirements.test"],
  ["COM-001 source manifest", "../knowledge-v1/computer-awareness/com001-source-manifest.test"],
  ["COM-001 source authority extension", "../knowledge-v1/computer-awareness/com001-source-authority-extension.test"],
  ["COM-001 candidate corpus", "../knowledge-v1/computer-awareness/com001-memory-storage-candidate-corpus.test"],
  ["COM-001 merge/split audit", "../knowledge-v1/computer-awareness/com001-memory-storage-merge-split-audit.test"],
  ["COM-001 readiness", "../knowledge-v1/computer-awareness/com001-memory-storage-readiness.test"],
  ["COM-001 storage profiles", "../knowledge-v1/computer-awareness/com001-storage-device-profiles.test"],
  ["COM-001 QL allocation readiness", "../knowledge-v1/computer-awareness/com001-ql-allocation-readiness.test"],
  ["COM-001 permanent QL allocation", "../knowledge-v1/computer-awareness/com001-memory-storage-ql-allocation.test"],
  ["COM-001 360-question review synthesis", "../knowledge-v1/computer-awareness/com001-review-synthesis.test"],
] as const;

for (const [label, modulePath] of stages) {
  try {
    await import(modulePath);
    console.log(`[content-engine-foundation] PASS: ${label}`);
  } catch (error) {
    console.error(`[content-engine-foundation] FAIL: ${label}`);
    throw error;
  }
}

console.log("Question Studio content engine foundation suite passed.");
