import { strict as assert } from "node:assert";

import type { KnowledgeFact } from "../types";
import {
  COM001_CORPUS_REQUIREMENTS,
  auditCom001Corpus,
  auditCom001CorpusRequirement,
} from "./com001-memory-storage-corpus-requirements";

const asOf = "2026-08-23T00:00:00.000Z";

const emptyAudit = auditCom001Corpus([], asOf);
assert.equal(emptyAudit.ready, false);
assert.equal(emptyAudit.passed, 0);
assert.equal(emptyAudit.total, COM001_CORPUS_REQUIREMENTS.length);
assert.equal(
  emptyAudit.results.every((result) => result.issues.length > 0),
  true,
);

const volatilityRequirement = COM001_CORPUS_REQUIREMENTS.find(
  (entry) => entry.relationFamily === "volatility",
)!;

const names = [
  ["ram", "RAM", "volatile"],
  ["dram", "DRAM", "volatile"],
  ["sram", "SRAM", "volatile"],
  ["cache", "Cache memory", "volatile"],
  ["register", "Processor register", "volatile"],
  ["rom", "ROM", "non-volatile"],
  ["flash", "Flash memory", "non-volatile"],
  ["eeprom", "EEPROM", "non-volatile"],
] as const;

const volatilityFacts: KnowledgeFact[] = names.map(
  ([id, label, answer], index) => ({
    factId: `com001-volatility-${id}`,
    entityId: `computer:${id}`,
    subject: "Computer Awareness",
    chapterId: "COM-001",
    cpId: "COM-001-CP-DISCOVERY",
    relation: "has_volatility",
    entity: {
      canonicalName: label,
      label: { en: label },
    },
    value: {
      kind: "text",
      text: { en: answer },
    },
    contextGroupId: "memory-volatility",
    distractorGroupIds: ["memory-volatility-classification"],
    difficulty: index < 5 ? "Easy" : "Medium",
    examTags: ["SSC"],
    tags: ["memory", "corpus-readiness-fixture"],
    source: {
      sourceId: `fixture-${id}`,
      sourceType: "reference",
      title: "COM-001 corpus readiness fixture",
      locator: id,
    },
    review: {
      status: "APPROVED",
      confidence: 0.99,
      reviewedAt: "2026-08-20T00:00:00.000Z",
      reviewedBy: "fixture-reviewer",
    },
    freshness: {
      class: "IMMUTABLE",
    },
  }),
);

const volatilityAudit = auditCom001CorpusRequirement(
  volatilityFacts,
  volatilityRequirement,
  asOf,
);
assert.equal(volatilityAudit.ready, true, volatilityAudit.issues.join("\n"));
assert.equal(volatilityAudit.eligibleFactCount, 8);
assert.equal(volatilityAudit.distinctEntityCount, 8);
assert.equal(volatilityAudit.distinctAnswerCount, 2);
assert.equal(volatilityAudit.missingEntityHints.length, 0);

const unreviewed = volatilityFacts.map((fact, index) =>
  index === 0
    ? {
        ...fact,
        review: {
          ...fact.review,
          status: "REVIEW_REQUIRED" as const,
        },
      }
    : fact,
);
const unreviewedAudit = auditCom001CorpusRequirement(
  unreviewed,
  volatilityRequirement,
  asOf,
);
assert.equal(unreviewedAudit.ready, false);
assert.equal(unreviewedAudit.eligibleFactCount, 7);
assert.equal(
  unreviewedAudit.issues.some((issue) => issue.startsWith("ELIGIBLE_FACTS:")),
  true,
);

const wrongChapter = volatilityFacts.map((fact) => ({
  ...fact,
  chapterId: "COM-999",
}));
assert.equal(
  auditCom001CorpusRequirement(
    wrongChapter,
    volatilityRequirement,
    asOf,
  ).eligibleFactCount,
  0,
);

const noDistractorGroups = volatilityFacts.map((fact) => ({
  ...fact,
  distractorGroupIds: [],
}));
const noDistractorAudit = auditCom001CorpusRequirement(
  noDistractorGroups,
  volatilityRequirement,
  asOf,
);
assert.equal(noDistractorAudit.ready, false);
assert.equal(
  noDistractorAudit.issues.some((issue) => issue.startsWith("DISTRACTOR_GROUPS:")),
  true,
);
