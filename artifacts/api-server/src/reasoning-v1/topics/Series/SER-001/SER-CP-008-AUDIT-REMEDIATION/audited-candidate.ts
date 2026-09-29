import {
  SER_CP008_PROVISIONAL_QL_IDS,
  SER_CP008_QL_AUTHORITIES,
  type SerCp008AllProvisionalQlId,
} from "./question-language";
import {
  generateSerCp008Final,
  type GeneratedSerCp008FinalQuestion,
} from "./runtime-final";
import type { SerCp008Locale } from "./runtime";

export type SerCp008AuditedQlId = Exclude<
  SerCp008AllProvisionalQlId,
  "SER-QL-014" | "SER-QL-015" | "SER-QL-019" | "SER-QL-020" | "SER-QL-026" | "SER-QL-028"
>;

export const SER_CP008_REJECTED_SOURCE_GAPS = Object.freeze([
  Object.freeze({
    qlId: "SER-QL-019" as const,
    sourcePrototype: "ALPHANUMERIC_LETTER_POSITION_BINDING" as const,
    auditDecision: "REJECT_WRONG_CHAPTER_OWNERSHIP" as const,
    reason:
      "The displayed tokens do not form a cross-term progression. The missing number is recovered only from the letter-number relation inside one token, so the learner solve contract is an internal alphanumeric relation rather than Series.",
    permanentQlReserved: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  }),
  Object.freeze({
    qlId: "SER-QL-020" as const,
    sourcePrototype: "ALPHANUMERIC_OUTER_LETTER_SUM_BINDING" as const,
    auditDecision: "REJECT_WRONG_CHAPTER_OWNERSHIP" as const,
    reason:
      "The answer is obtained by adding the two outer letter positions inside the target token; the preceding tokens need not progress from one term to the next. This is an internal alphanumeric relation, not a Series progression.",
    permanentQlReserved: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
  }),
]);

export const SER_CP008_MERGED_INTO_EXISTING_QLS = Object.freeze([
  Object.freeze({
    qlId: "SER-QL-014" as const,
    authorityId: "SINGLE_LETTER_PROGRESSIVE_JUMP" as const,
    existingPermanentQlId: "SER-QL-003" as const,
    decision: "MERGE_AS_EXISTING_QL_VARIANT" as const,
    reason:
      "A one-letter progressive jump is the one-column case of the already permanent progressive column-wise movement contract. Letter-group width is an object/renderer property, not a new solve contract.",
  }),
  Object.freeze({
    qlId: "SER-QL-015" as const,
    authorityId: "SINGLE_LETTER_INTERLEAVED_ROWS" as const,
    existingPermanentQlId: "SER-QL-007" as const,
    decision: "MERGE_AS_EXISTING_QL_VARIANT" as const,
    reason:
      "Single-letter interleaving uses the same learner operation as permanent interleaved letter-group rows: split by positional row and continue the target row. Token width does not justify a new QL.",
  }),
  Object.freeze({
    qlId: "SER-QL-026" as const,
    authorityId: "ALPHANUMERIC_TOKEN_ROTATION" as const,
    existingPermanentQlId: "SER-QL-011" as const,
    decision: "MERGE_AS_EXISTING_QL_VARIANT" as const,
    reason:
      "Cyclic token rotation is explicitly a subtype of the permanent position-permutation contract. Mixed alphanumeric token members change the object type, not the positional-permutation solve contract.",
  }),
  Object.freeze({
    qlId: "SER-QL-028" as const,
    authorityId: "ALPHANUMERIC_NUMBER_LETTER_BLOCK_COMPLETION" as const,
    existingPermanentQlId: "SER-QL-010" as const,
    decision: "MERGE_AS_EXISTING_QL_VARIANT" as const,
    reason:
      "Repeated number-letter block completion is the mixed-token renderer of the permanent periodic block/gap completion contract. The learner reconstructs the repeating block and fills the gaps in order.",
  }),
]);

const MERGED_IDS = new Set<string>(
  SER_CP008_MERGED_INTO_EXISTING_QLS.map((entry) => entry.qlId),
);

const REJECTED_IDS = new Set<string>(
  SER_CP008_REJECTED_SOURCE_GAPS.map((entry) => entry.qlId),
);

export const SER_CP008_AUDITED_QL_IDS = Object.freeze(
  SER_CP008_PROVISIONAL_QL_IDS.filter(
    (qlId): qlId is SerCp008AuditedQlId => !REJECTED_IDS.has(qlId) && !MERGED_IDS.has(qlId),
  ),
);

export const SER_CP008_AUDITED_QL_AUTHORITIES = Object.freeze(
  SER_CP008_QL_AUTHORITIES.filter(
    (entry) => !REJECTED_IDS.has(entry.qlId) && !MERGED_IDS.has(entry.qlId),
  ),
);

if (SER_CP008_AUDITED_QL_IDS.length !== 9) {
  throw new Error(`SER-CP-008 audited QL count drifted: ${SER_CP008_AUDITED_QL_IDS.length}`);
}
if (SER_CP008_AUDITED_QL_AUTHORITIES.length !== 9) {
  throw new Error(
    `SER-CP-008 audited authority count drifted: ${SER_CP008_AUDITED_QL_AUTHORITIES.length}`,
  );
}

export function assertSerCp008AuditedQlId(
  value: string,
): asserts value is SerCp008AuditedQlId {
  const merged = SER_CP008_MERGED_INTO_EXISTING_QLS.find((entry) => entry.qlId === value);
  if (merged) {
    throw new Error(`${value} is not a new Series QL; it is a variant of ${merged.existingPermanentQlId}: ${merged.reason}`);
  }
  const rejected = SER_CP008_REJECTED_SOURCE_GAPS.find((entry) => entry.qlId === value);
  if (rejected) {
    throw new Error(`${value} was rejected from Series: ${rejected.reason}`);
  }
  if (!(SER_CP008_AUDITED_QL_IDS as readonly string[]).includes(value)) {
    throw new Error(`Unsupported audited SER-CP-008 QL '${value}'.`);
  }
}

export function generateSerCp008Audited(
  qlId: SerCp008AuditedQlId,
  seed = 1,
  locale: SerCp008Locale = "en-IN",
): GeneratedSerCp008FinalQuestion {
  return generateSerCp008Final(qlId, seed, locale);
}
