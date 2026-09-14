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
  "SER-QL-019" | "SER-QL-020"
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

const REJECTED_IDS = new Set<string>(
  SER_CP008_REJECTED_SOURCE_GAPS.map((entry) => entry.qlId),
);

export const SER_CP008_AUDITED_QL_IDS = Object.freeze(
  SER_CP008_PROVISIONAL_QL_IDS.filter(
    (qlId): qlId is SerCp008AuditedQlId => !REJECTED_IDS.has(qlId),
  ),
);

export const SER_CP008_AUDITED_QL_AUTHORITIES = Object.freeze(
  SER_CP008_QL_AUTHORITIES.filter((entry) => !REJECTED_IDS.has(entry.qlId)),
);

if (SER_CP008_AUDITED_QL_IDS.length !== 13) {
  throw new Error(`SER-CP-008 audited QL count drifted: ${SER_CP008_AUDITED_QL_IDS.length}`);
}
if (SER_CP008_AUDITED_QL_AUTHORITIES.length !== 13) {
  throw new Error(
    `SER-CP-008 audited authority count drifted: ${SER_CP008_AUDITED_QL_AUTHORITIES.length}`,
  );
}

export function assertSerCp008AuditedQlId(
  value: string,
): asserts value is SerCp008AuditedQlId {
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
