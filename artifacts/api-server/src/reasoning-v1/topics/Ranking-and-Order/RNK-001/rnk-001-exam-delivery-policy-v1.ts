export type RnkExamRealismTier =
  | 'CORE'
  | 'SECONDARY'
  | 'ADVANCED'
  | 'SOURCE_SPECIFIC';

export const RNK_EXAM_DELIVERY_POLICY_VERSION =
  'RNK_001_EXAM_DELIVERY_POLICY_V1' as const;

export const RNK_EXAM_MODE_MIX_GUARD = Object.freeze({
  coreMinimumShare: 0.70,
  secondaryMaximumShare: 0.25,
  advancedMaximumShare: 0.08,
  sourceSpecificMaximumShare: 0.05,
});

export const RNK_OPTION_DELIVERY_CAPABILITY = Object.freeze({
  SSC: Object.freeze({ preferredOptionCount: 4, supportedOptionCounts: [4] as const }),
  BANKING: Object.freeze({ preferredOptionCount: 5, supportedOptionCounts: [4, 5] as const }),
  PUNJAB_STATE: Object.freeze({ preferredOptionCount: 4, supportedOptionCounts: [4] as const }),
});

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  if (!match) throw new Error(`Invalid RNK QL id: ${qlId}`);
  const value = Number(match[1]);
  if (value < 1 || value > 42) throw new Error(`RNK QL outside frozen range: ${qlId}`);
  return value;
}

export function rnkExamRealismTier(qlId: string): RnkExamRealismTier {
  const value = qlNumber(qlId);
  if (value <= 26) return 'CORE';
  if (value <= 35) return 'SECONDARY';
  if (value <= 41) return 'ADVANCED';
  return 'SOURCE_SPECIFIC';
}

export interface RnkExamMixAudit {
  readonly total: number;
  readonly shares: Readonly<Record<RnkExamRealismTier, number>>;
  readonly passesExamRealismGuard: boolean;
  readonly violations: readonly string[];
}

export function auditRnkExamModeMix(qlIds: readonly string[]): RnkExamMixAudit {
  if (qlIds.length === 0) {
    return {
      total: 0,
      shares: { CORE: 0, SECONDARY: 0, ADVANCED: 0, SOURCE_SPECIFIC: 0 },
      passesExamRealismGuard: false,
      violations: ['EMPTY_EXAM_MIX'],
    };
  }

  const counts: Record<RnkExamRealismTier, number> = {
    CORE: 0,
    SECONDARY: 0,
    ADVANCED: 0,
    SOURCE_SPECIFIC: 0,
  };
  for (const qlId of qlIds) counts[rnkExamRealismTier(qlId)] += 1;
  const shares = {
    CORE: counts.CORE / qlIds.length,
    SECONDARY: counts.SECONDARY / qlIds.length,
    ADVANCED: counts.ADVANCED / qlIds.length,
    SOURCE_SPECIFIC: counts.SOURCE_SPECIFIC / qlIds.length,
  } as const;

  const violations: string[] = [];
  if (shares.CORE < RNK_EXAM_MODE_MIX_GUARD.coreMinimumShare) violations.push('CORE_SHARE_TOO_LOW');
  if (shares.SECONDARY > RNK_EXAM_MODE_MIX_GUARD.secondaryMaximumShare) violations.push('SECONDARY_SHARE_TOO_HIGH');
  if (shares.ADVANCED > RNK_EXAM_MODE_MIX_GUARD.advancedMaximumShare) violations.push('ADVANCED_SHARE_TOO_HIGH');
  if (shares.SOURCE_SPECIFIC > RNK_EXAM_MODE_MIX_GUARD.sourceSpecificMaximumShare) violations.push('SOURCE_SPECIFIC_SHARE_TOO_HIGH');

  return {
    total: qlIds.length,
    shares,
    passesExamRealismGuard: violations.length === 0,
    violations,
  };
}

export function rnkChapterPracticeAllows(qlId: string): boolean {
  qlNumber(qlId);
  return true;
}
