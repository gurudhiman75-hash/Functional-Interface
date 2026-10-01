import assert from "node:assert/strict";
import test from "node:test";

import {
  deriveQuestionStudioCpTitles,
  enrichQuestionStudioPackageCpTitles,
} from "./package-metadata";

test("derives CP titles while preserving explicit metadata priority", () => {
  const titles = deriveQuestionStudioCpTitles({
    cpIds: ["CP-001", "CP-002", "CP-003", "CP-004"],
    dynamicCandidateCpIds: ["CP-DYN-001"],
    metadata: {
      cpTitles: {
        "CP-001": "Explicit checkpoint title",
        "QL-999": "Must not leak",
      },
    },
    canonicalProblems: [
      { id: "CP-001", label: "Lower-priority canonical label" },
      { id: "CP-002", label: "Canonical checkpoint title" },
      { id: "QL-001", label: "Question language label" },
      { checkpointId: "CP-004", id: "QL-004", label: "QL label must not be used as a CP title" },
    ],
    checkpoints: [
      { checkpointId: "CP-003", title: "Checkpoint object title" },
      { checkpointId: "CP-004", label: "CP-004" },
      { checkpointId: "CP-DYN-001", name: "Dynamic candidate checkpoint" },
    ],
  });

  assert.deepEqual(titles, {
    "CP-001": "Explicit checkpoint title",
    "CP-002": "Canonical checkpoint title",
    "CP-003": "Checkpoint object title",
    "CP-DYN-001": "Dynamic candidate checkpoint",
  });
});

test("ignores labels for ids outside the package CP set", () => {
  const titles = deriveQuestionStudioCpTitles({
    cpIds: ["CP-010"],
    canonicalProblems: [
      { id: "QL-010", label: "A learner question-language family" },
    ],
    checkpoints: [
      { checkpointId: "CP-011", label: "Another package checkpoint" },
    ],
  });

  assert.deepEqual(titles, {});
});


test("enrichment preserves unrelated package metadata", () => {
  const pkg = enrichQuestionStudioPackageCpTitles({
    engineId: "reasoning-v1",
    packageId: "TEST-001",
    topic: "Reasoning",
    subtopic: "Test chapter",
    label: "Test chapter",
    enabled: true,
    cpIds: ["TEST-CP-001"],
    supportedLanguages: ["en"],
    metadata: {
      lifecycleLock: "REVIEW_ONLY",
      cpTitles: {
        "TEST-CP-001": "Readable checkpoint",
      },
    },
  });

  assert.equal(pkg.metadata?.lifecycleLock, "REVIEW_ONLY");
  assert.deepEqual(pkg.metadata?.cpTitles, {
    "TEST-CP-001": "Readable checkpoint",
  });
});
