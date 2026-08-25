import {
  generateIntCp010ProductionCandidate as generateV1,
  type IntCp010CandidateAuthorityId,
} from "./cp010-production-authoring-candidate-v1";

export const INT_CP010_PRODUCTION_CANDIDATE_V2_VERSION = "INT-CP-010-PRODUCTION-AUTHORING-CANDIDATE-v2-realism" as const;

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen);
  return Object.freeze(value);
}

function rupees(value: { numerator: bigint; denominator: bigint }) {
  return Number(value.numerator) / Number(value.denominator);
}

function openingDebtFor(question: any) {
  return question.authorityId === "INT-CP010-AUTH-01"
    ? question.mathematicalState.openingDebt
    : question.answer;
}

function isRealistic(question: any) {
  const openingDebt = rupees(openingDebtFor(question));
  if (!(openingDebt >= 25_000 && openingDebt <= 2_500_000)) return false;
  if (question.authorityId === "INT-CP010-AUTH-01") {
    const instalment = rupees(question.answer);
    return instalment >= 8_000 && instalment <= 1_000_000;
  }
  const repayments = question.mathematicalState.repayments.map(rupees);
  return repayments.every((amount: number) => amount >= 8_000 && amount <= 1_000_000);
}

export function generateIntCp010ProductionCandidateV2(authorityId: IntCp010CandidateAuthorityId, seed: string | number) {
  const requestedSeed = String(seed);
  for (let attempt = 0; attempt < 96; attempt += 1) {
    const candidateSeed = `${requestedSeed}:realism:${attempt}`;
    const q = generateV1(authorityId, candidateSeed) as any;
    if (!isRealistic(q)) continue;
    return deepFreeze({
      ...q,
      productionCandidateVersion: INT_CP010_PRODUCTION_CANDIDATE_V2_VERSION,
      seed: requestedSeed,
      underlyingCandidateSeed: candidateSeed,
      realismSelectionAttempts: attempt + 1,
      realismBand: deepFreeze({
        openingDebtMin: 25_000,
        openingDebtMax: 2_500_000,
        paymentMin: 8_000,
        paymentMax: 1_000_000,
      }),
    });
  }
  throw new Error(`${authorityId}/${requestedSeed}: unable to construct a realistic CP010 production candidate within 96 deterministic attempts`);
}
