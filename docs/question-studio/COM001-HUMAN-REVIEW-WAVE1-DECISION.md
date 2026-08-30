# COM-001 Human Review Wave 1 Decision

Status: `REVIEWED_WITH_REMEDIATION_REQUIRED`

Scope: 26 exact generated questions from Content Engine run #119 (18 English + 8 targeted Hindi/Punjabi).

## QL verdicts

| QL | Verdict | Notes |
| --- | --- | --- |
| COM-001-QL-001 | PASS | Volatility questions are clear, authentic and well-distracted. |
| COM-001-QL-002 | NEEDS_MINOR_FIX | Learner task is sound. Explanation grammar must avoid singular agreement for labels such as `CPU registers`. |
| COM-001-QL-003 | NEEDS_MINOR_FIX | Stems/options are sound. English explanations contain malformed constructions such as `is used to stores/holds`. |
| COM-001-QL-004 | PASS | Subtype/family discrimination is clear and exam-like. |
| COM-001-QL-005 | PASS | Magnetic/optical/solid-state classification is clean and authentic. |
| COM-001-QL-006 | PASS | Broad hierarchy ordering is concise and unambiguous. |
| COM-001-QL-007 | NEEDS_REWORK | Current profile puzzle can surface enterprise-niche `RDX removable disk` and over-engineered WORM archival constraints. Retain the backup/sequential-access learner task, but surface exam-familiar objects and direct PYQ-like wording. Keep RDX out of learner-facing options until target-exam evidence exists. |
| COM-001-QL-008 | PASS | Multi-statement composition is strong, uniquely solvable and close to actual SSC computer-question style. |
| COM-001-QL-009 | NEEDS_REWORK | Standards-correct KiB/MiB/GiB questions are useful but insufficient for SSC. SSC CHSL official-paper evidence uses traditional competitive-exam convention `1 MB = 1024 KB`. V2 must explicitly model both exam convention and standards convention instead of silently conflating them. |

## Localization verdict

Targeted Hindi/Punjabi samples for QL-003/007/008/009 preserved answer/index/source parity and were readable. Localization remains downstream of English remediation; changed English surfaces must be re-localized and re-frozen as V2.

## Evidence notes

- SSC CGL Tier-II 2022 paper (held 7 March 2023) directly tests magnetic-tape sequential-access properties and its suitability for backup-oriented storage.
- SSC CHSL previous paper (20 Oct 2020) asks the WORM expansion `Write Once, Read Many`.
- SSC CHSL Tier-I 2022 official paper (held 21 March 2023 Shift 4) asks `A megabyte (MB) consists of 1024 ______`, answer `Kilobytes`.

## Lifecycle decision

- Do **not** mutate `COM-001-ENGLISH-FREEZE-V1` in place.
- Build remediation as a V2 candidate in parallel.
- V1 remains review-only and production-locked.
- Production/Question Bank/test/publication remain unauthorized.
- Promote only after V2 human review + deterministic audit + EN/HI/PA parity + new freeze fingerprints.
