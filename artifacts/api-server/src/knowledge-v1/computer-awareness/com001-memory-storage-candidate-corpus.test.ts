import { strict as assert } from "node:assert";

import { validateKnowledgeFactEligibility } from "../eligibility";
import {
  COM001_MEMORY_STORAGE_CANDIDATE_FACTS,
  auditCom001CandidateCorpus,
} from "./com001-memory-storage-candidate-corpus";
import { auditCom001Corpus } from "./com001-memory-storage-corpus-requirements";

const audit = auditCom001CandidateCorpus();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 24);
assert.equal(audit.relationCounts.has_volatility, 6);
assert.equal(audit.relationCounts.uses_storage_medium, 7);
assert.equal(audit.relationCounts.expands_to, 5);
assert.equal(audit.relationCounts.capacity_unit_relation, 4);
assert.equal(audit.relationCounts.has_primary_function, 1);
assert.equal(audit.relationCounts.uses_backing_resource, 1);

for (const fact of COM001_MEMORY_STORAGE_CANDIDATE_FACTS) {
  assert.equal(fact.review.status, "REVIEW_REQUIRED");
  assert.equal(
    validateKnowledgeFactEligibility(fact, {
      asOf: "2026-08-23T00:00:00.000Z",
    }).eligible,
    false,
    `${fact.factId} must remain non-generatable before editorial approval`,
  );
}

// Even with 24 source-backed candidates, the production corpus must remain
// unready because review status is a hard eligibility gate and several
// relation families have not yet reached breadth thresholds.
const readiness = auditCom001Corpus(
  COM001_MEMORY_STORAGE_CANDIDATE_FACTS,
  "2026-08-23T00:00:00.000Z",
);
assert.equal(readiness.ready, false);
assert.equal(readiness.passed, 0);

const candidateFactIds = new Set(
  COM001_MEMORY_STORAGE_CANDIDATE_FACTS.map((fact) => fact.factId),
);
assert.equal(candidateFactIds.size, COM001_MEMORY_STORAGE_CANDIDATE_FACTS.length);

const capacityFacts = COM001_MEMORY_STORAGE_CANDIDATE_FACTS.filter(
  (fact) => fact.relation === "capacity_unit_relation",
);
assert.equal(
  capacityFacts.some((fact) => fact.entity.label.en.includes("KiB")),
  true,
);
assert.equal(
  capacityFacts.some((fact) => fact.entity.label.en.includes("MiB")),
  true,
);
assert.equal(
  capacityFacts.some((fact) => fact.entity.label.en.includes("GiB")),
  true,
);
assert.equal(
  capacityFacts.some((fact) => /1 KB|1 MB|1 GB/.test(fact.entity.label.en)),
  false,
  "Ambiguous decimal/binary KB/MB/GB equations must not enter the initial corpus",
);
