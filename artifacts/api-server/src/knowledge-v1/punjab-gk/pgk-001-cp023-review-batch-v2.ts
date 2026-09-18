import { PGK_001_CP023_FACTS } from "./pgk-001-cp023-facts";
import { PGK_001_CP023_REVIEW_BATCH_V1, auditPgk001Cp023ReviewBatchV1 } from "./pgk-001-cp023-review-batch-v1";

const PROVENANCE_BY_QL: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "PGK-001-QL-154": ["bhangra-harvest-dhol","bhangra-baisakhi","dhol-instrument","chimta-instrument"],
  "PGK-001-QL-155": ["giddha-women-boliyan","boliyan-form","kikli-paired-spin"],
  "PGK-001-QL-156": ["jhumar-style","sammi-style","luddi-style","bhangra-harvest-dhol"],
  "PGK-001-QL-157": ["dhol-instrument","algoza-instrument","tumbi-instrument","chimta-instrument","sarangi-instrument"],
  "PGK-001-QL-158": ["boliyan-form","tappa-form","dholak-instrument","giddha-women-boliyan"],
  "PGK-001-QL-159": ["phulkari-craft","punjabi-jutti","men-dress","women-dress"],
  "PGK-001-QL-160": ["bhangra-harvest-dhol","giddha-women-boliyan","kikli-paired-spin","jhumar-style","sammi-style","algoza-instrument","tumbi-instrument","sarangi-instrument","chimta-instrument","boliyan-form","phulkari-craft","punjabi-jutti"],
});

function provenanceForQl(qlId: string) {
  const factIds = PROVENANCE_BY_QL[qlId] ?? [];
  const factSet = new Set(factIds);
  const sourceIds = [...new Set(
    PGK_001_CP023_FACTS
      .filter((fact) => factSet.has(fact.id))
      .flatMap((fact) => [...fact.sourceIds]),
  )];
  return Object.freeze({ factIds: Object.freeze([...factIds]), sourceIds: Object.freeze(sourceIds) });
}

export const PGK_001_CP023_REVIEW_BATCH_V2 = Object.freeze(
  PGK_001_CP023_REVIEW_BATCH_V1.map((question) =>
    Object.freeze({ ...question, ...provenanceForQl(question.qlId) }),
  ),
);

export function auditPgk001Cp023ReviewBatchV2() {
  const base = auditPgk001Cp023ReviewBatchV1();
  const errors = [...base.errors];
  for (const question of PGK_001_CP023_REVIEW_BATCH_V2) {
    if (!question.factIds.length) errors.push(`${question.id}: missing fact provenance`);
    if (!question.sourceIds.length) errors.push(`${question.id}: missing source provenance`);
  }
  return Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) });
}
