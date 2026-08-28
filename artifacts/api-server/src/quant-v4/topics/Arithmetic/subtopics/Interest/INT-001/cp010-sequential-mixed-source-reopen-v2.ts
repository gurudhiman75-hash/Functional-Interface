import {
  INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES,
  INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY,
  INT_CP010_SEQUENTIAL_REOPEN_VERSION,
  buildIntCp010SequentialReopenPackage,
  constructIntCp010SequentialReopenState,
  solveIntCp010SequentialReopen,
  verifyIntCp010SequentialReopen,
  type IntCp010SequentialReopenPrototypeId,
} from "./cp010-sequential-mixed-source-reopen-v1";

export {
  INT_CP010_SEQUENTIAL_REOPEN_PROTOTYPES,
  INT_CP010_SEQUENTIAL_REOPEN_SOURCE_AUTHORITY,
  solveIntCp010SequentialReopen,
  verifyIntCp010SequentialReopen,
};
export type { IntCp010SequentialReopenPrototypeId };

export const INT_CP010_SEQUENTIAL_REOPEN_V2_VERSION = "INT-CP-010-SEQUENTIAL-MIXED-SOURCE-REOPEN-v2" as const;
export const INT_CP010_SEQUENTIAL_REOPEN_V2_BASE = INT_CP010_SEQUENTIAL_REOPEN_VERSION;

function hasNominalSpreadCollision(prototypeId: IntCp010SequentialReopenPrototypeId, seed: string) {
  if (prototypeId !== "INT-CP010-REOPEN-PROT-004") return false;
  const state = constructIntCp010SequentialReopenState(prototypeId, seed);
  return state.prototypeId === "INT-CP010-REOPEN-PROT-004"
    && state.lendNominalCompoundRatePercent.numerator * state.borrowSimpleRatePercent.denominator
      === state.borrowSimpleRatePercent.numerator * state.lendNominalCompoundRatePercent.denominator;
}

function resolveEffectiveSeed(prototypeId: IntCp010SequentialReopenPrototypeId, requestedSeed: string) {
  if (!hasNominalSpreadCollision(prototypeId, requestedSeed)) return { effectiveSeed: requestedSeed, attempts: 1 };
  for (let attempt = 2; attempt <= 32; attempt += 1) {
    const candidate = `${requestedSeed}:spread-distractor-valid-state:${attempt - 1}`;
    if (!hasNominalSpreadCollision(prototypeId, candidate)) return { effectiveSeed: candidate, attempts: attempt };
  }
  throw new Error(`${prototypeId}/${requestedSeed}: unable to construct a non-zero naive spread distractor after 32 deterministic attempts`);
}

export function buildIntCp010SequentialReopenPackageV2(prototypeId: IntCp010SequentialReopenPrototypeId, requestedSeed: string) {
  const { effectiveSeed, attempts } = resolveEffectiveSeed(prototypeId, requestedSeed);
  const base = buildIntCp010SequentialReopenPackage(prototypeId, effectiveSeed);
  return Object.freeze({
    ...base,
    requestedSeed,
    effectiveSeed,
    seedResolutionAttempts: attempts,
    packagingRemediationVersion: INT_CP010_SEQUENTIAL_REOPEN_V2_VERSION,
    packagingRemediation: "Avoid zero-denominator nominal-rate-gap distractor states without changing the mathematical authority.",
  });
}
