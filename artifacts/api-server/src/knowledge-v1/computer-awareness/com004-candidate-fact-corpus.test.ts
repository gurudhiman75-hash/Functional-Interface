import assert from "node:assert/strict";
import { COM004_CANDIDATE_FACTS, auditCom004CandidateFactCorpus } from "./com004-candidate-fact-corpus";

const audit = auditCom004CandidateFactCorpus();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM004_CANDIDATE_FACTS.length, 100);
assert.equal(audit.taskCount, 19);
assert.equal(audit.familyCount, 9);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionEligible, false);
assert.equal(audit.status, "SOURCE_BACKED_CANDIDATE_CORPUS_READY");

const truthSources = new Set(COM004_CANDIDATE_FACTS.map((fact) => fact.source.sourceId));
assert.equal([...truthSources].some((sourceId) => sourceId.startsWith("PYQ-")), false);
assert.equal(COM004_CANDIDATE_FACTS.every((fact) => fact.review.status === "REVIEW_REQUIRED"), true);
