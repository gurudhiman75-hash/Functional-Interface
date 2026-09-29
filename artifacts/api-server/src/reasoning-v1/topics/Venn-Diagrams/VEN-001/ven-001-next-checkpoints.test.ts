import assert from "node:assert/strict";
import type { QuestionStudioGenerationRequest } from "../../../../question-studio/engine-types.ts";
import {
  generateVen001NextCheckpointBatch,
  isVen001NextCheckpointRequest,
} from "./ven-001-next-checkpoints.ts";

const locales = ["en", "hi", "pa"] as const;
const families = [
  { id: "VEN-CP001", count: 12, operation: "RELATIONS_TO_DIAGRAM" },
  { id: "VEN-CP002", count: 19, operation: "RELATIONS_TO_DIAGRAM" },
  { id: "VEN-CP004", count: 19, operation: "REGION_IDENTIFICATION" },
] as const;

for (const family of families) {
  for (const language of locales) {
    const request = {
      packageId: "VEN-001",
      patternId: family.id,
      count: family.count,
      language,
      seed: `VEN-001:${family.id}:${language}:review-test`,
      runtimeMode: "review-only",
    } as QuestionStudioGenerationRequest;
    assert.equal(isVen001NextCheckpointRequest(request), true);
    const result = generateVen001NextCheckpointBatch(request);
    assert.equal(result.questions.length, family.count);
    assert.equal(result.generationContext.requestedOperation, family.operation);
    const keys = new Set<string>();
    for (const item of result.questions) {
      assert.equal(item.cpId, family.id);
      assert.equal(item.questionOperation, family.operation);
      assert.equal(item.language, language);
      assert.equal(item.reviewOnly, true);
      assert.equal(item.questionBankWritable, false);
      assert.equal(item.productionReleaseAuthorized, false);
      assert.equal(item.validation.exactlyOneCorrect, true);
      assert.ok(item.stem.length > 30);
      keys.add(item.candidateId);
      if (family.id === "VEN-CP004") {
        assert.equal(item.stimulusSvgs?.length, 1);
        assert.equal(item.options.length, 4);
        assert.equal(new Set(item.options).size, 4);
        assert.equal(item.validation.diagramLabelsMatchAssignment, true);
        assert.match(item.stimulusSvgs?.[0] ?? "", /Numbered regions/);
      } else {
        assert.equal(item.optionSvgs?.length, 4);
        assert.equal(item.optionDetails.length, 4);
        assert.equal(item.validation.distinctOptions, true);
        assert.equal(item.correctIndex, item.optionDetails.findIndex((o) => o.isCorrect));
        assert.ok(item.optionSvgs?.every((svg) => /<text[^>]*>[ABC]<\/text>/.test(svg)));
      }
    }
    assert.equal(keys.size, family.count);
    if (family.id === "VEN-CP004") {
      const representedRegions = new Set(result.questions.map((item) => item.semanticMetadata.numberedRegionAnswer));
      for (const region of ["0", "1", "2", "3", "4", "5", "6", "7"]) {
        assert.ok(representedRegions.has(region), `missing reviewed region target: ${region}`);
      }
    }
    if (family.id === "VEN-CP002") {
      const keyedTopologies = new Set(result.questions.map((item) => item.semanticMetadata.topologyId));
      for (const topology of [
        "THREE_NESTED", "THREE_TWO_DISJOINT_SUBSETS",
        "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET", "THREE_PAIRWISE_OVERLAP_WITH_TRIPLE",
        "THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE", "THREE_TWO_OVERLAP_ONE_SEPARATE",
        "THREE_ONE_NESTED_PAIR_ONE_SEPARATE", "THREE_ALL_DISJOINT",
        "THREE_NESTED_PAIR_CROSSED_BY_THIRD", "THREE_TWO_DISJOINT_OVERLAP_THIRD",
        "THREE_NESTED_PAIR_OUTER_ONLY_OVERLAP",
      ]) assert.ok(keyedTopologies.has(topology), `missing keyed topology: ${topology}`);
    }
  }
}

assert.throws(
  () =>
    generateVen001NextCheckpointBatch({
      patternId: "VEN-CP004",
      count: 20,
      language: "en",
    } as QuestionStudioGenerationRequest),
  /has 19 distinct region candidates/,
);
assert.throws(
  () =>
    generateVen001NextCheckpointBatch({
      patternId: "VEN-CP002",
      count: 20,
      language: "en",
    } as QuestionStudioGenerationRequest),
  /has 19 distinct candidates/,
);
assert.throws(
  () =>
    generateVen001NextCheckpointBatch({
      patternId: "VEN-CP001",
      count: 13,
      language: "en",
    } as QuestionStudioGenerationRequest),
  /has 12 distinct candidates/,
);
assert.throws(
  () =>
    generateVen001NextCheckpointBatch({
      patternId: "VEN-CP004",
      count: 1,
      language: "en",
      runtimeMode: "production",
    } as QuestionStudioGenerationRequest),
  /only supports review-only/,
);

console.log("VEN-001 CP001/CP002/CP004 Question Studio review generation passed.");
