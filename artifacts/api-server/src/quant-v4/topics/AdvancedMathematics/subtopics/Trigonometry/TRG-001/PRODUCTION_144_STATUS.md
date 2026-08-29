# TRG-001 144-QL Engineering Trace Status

Status: **SUPERSEDED AS THE ACTIVE CANDIDATE BY THE PHASE-0-AUTHORITY-ALIGNED SURFACE**

The initial 144-QL engineering expansion remains in this branch as trace evidence. It established complete numerical coverage (144 QLs, 24 per CP), exact-answer runtime contracts, deterministic generation, production locks, and the first production-scale gate suite.

A later audit against the detailed Phase 0 `TRG-001/ql-ledger.md`, however, found that correct CP membership was not enough: a number of permanent QL IDs had drifted into the wrong locked mathematical subfamily. Examples included side-recovery roles, degree/radian conversion positions, conjugate families and the CP-006 double-angle/series/application ranges.

For that reason:

- `production-runtime.ts` is now a **trace runtime**, not the active production candidate;
- `production-candidate-runtime.ts` is a **trace-hardened candidate**, not the final authority candidate;
- `production-runtime.test.ts` remains useful engineering evidence but does not establish Phase 0 row-family compliance;
- the earlier 72-row MVP AI editorial result remains useful content evidence but is **not carried forward as final row-level approval** after permanent-ID reconciliation.

The active candidate is now defined by:

- `production-authority-runtime.ts`
- `production-authority-candidate-runtime.ts`
- `production-authority.test.ts`
- `production-authority.manifest.json`
- `PRODUCTION_AUTHORITY_AUDIT.md`
- `PRODUCTION_AUTHORITY_STATUS.md`

The authority-aligned candidate preserves all 144 permanent IDs, restores every detailed Phase 0 subfamily count, reuses 114 unique sound trace templates exactly once, and introduces 30 newly authored roles where the locked family coverage was missing or insufficient.

The authority candidate also resets row-level review state to:

- AI editorial: **0 / 144 PENDING**
- human review: **0 / 144 PENDING**

This reset is intentional. Row-level approval must correspond to the final permanent QL role, not merely to a mathematical template that previously appeared under another ID.

Activation remains locked:

- Question Studio discovery: OFF
- Test Builder eligibility: OFF
- question-bank storage: OFF
- public publication: OFF
- Hindi/Punjabi runtime: OFF

No GitHub Actions/runtime execution is claimed unless an actual run exists for the authority head.

See `PRODUCTION_AUTHORITY_STATUS.md` for the current TRG-001 production checkpoint.