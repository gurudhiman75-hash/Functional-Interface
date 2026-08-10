# TMW-001 Remediation R3 Status

## Scope

R3 completes the planned checkpoint-wise learner/editorial remediation for:

- `TMW-CP-007` — `TMW-QL-128..143`
- `TMW-CP-008` — `TMW-QL-144..156`
- `TMW-CP-009` — `TMW-QL-157..174`
- `TMW-CP-010` — `TMW-QL-175..192`
- `TMW-CP-011` — `TMW-QL-193..211`

Total R3 learner-migrated range: **84 QLs**.

R1 remains the authority for the seven critical source/correctness blockers, and R2 remains the authority for CP-001 through CP-006 / QL-001 through QL-127. R3 is layered after those remediations and does not replace them.

## Editorial findings closed in R3

The final chapter boundary now owns targeted remediation for the remaining audited findings:

- `TMW-QL-130` — Hindi/Punjabi mixed-crew conclusion grammar
- `TMW-QL-136` — Hindi/Punjabi replacement conclusion grammar
- `TMW-QL-140` — Hindi/Punjabi solo-time conclusion grammar
- `TMW-QL-150` — answer named as ratio of days worked, not contribution-factor ratio
- `TMW-QL-160` — complete net-change conclusion
- `TMW-QL-174` — natural “does not become empty” outcome wording
- `TMW-QL-189` — complete-cycle count agreement
- `TMW-QL-192` — switch time named as switch time, not total completion time
- `TMW-QL-195` — first-day output named explicitly
- `TMW-QL-199` — first-day output named explicitly
- `TMW-QL-208` — additional daily rate named explicitly

## Learner explanation migration

All `TMW-QL-128..211` outputs now expose `TMW_LEARNER_V2` using the same post-audit contract already used by R2:

1. **Method** — one concise concept-led instruction
2. **Solution** — 2–5 connected calculation steps
3. **Answer** — exact requested quantity named explicitly

The learner view does not require a separate formula block, givens block, generic “10-second” claim, shortcut, or common-mistake section. Internal word-based/localized subscripts are normalized out of learner-facing working.

Checkpoint-specific method selection is retained:

- CP-007 — heterogeneous capacity / category equations
- CP-008 — contribution and payment sharing
- CP-009 — signed net pipe rate and boundary comparison
- CP-010 — staged timeline / cycle plus terminal segment
- CP-011 — arithmetic/geometric/variable daily-rate sequences

## Runtime boundary

`chapter-localized-runtime.ts` now routes both English and Hindi/Punjabi CP-007 through CP-011 outputs through the same final sequence:

1. existing checkpoint generator/localizer
2. legacy chapter presentation/editorial layers
3. R1 critical remediation
4. R2 editorial remediation (range-gated)
5. R3 editorial remediation (range-gated)
6. R2 learner V2 (range-gated)
7. R3 learner V2 (range-gated)

This keeps the full 211-QL chapter on one chapter-level finalization path without changing checkpoint mathematics or publication state.

## Proof added

### R3 editorial proof

- 11 audited findings
- 3 languages: English, Hindi, Punjabi
- 3 deterministic seeds per finding-language pair
- **99 targeted cases**

### R3 learner V2 proof

- 84 QLs
- 3 languages
- 3 deterministic seeds per QL-language pair
- **756 learner cases**

Checks include source validity, four unique options, correct-option/solved-answer agreement, learner contract validity, concrete calculation before answer, notation hygiene, language-script presence, explicit target semantics for the audited QLs, and publication lock retention.

### Regressions retained

R3 CI also reruns:

- R1 critical-remediation regression
- R2 learner-V2 regression for QL-001..127
- complete multilingual chapter parity regression

## Exact validation snapshot

Validated implementation head: `8768908ee4b521bccf3e8b1c9078551d1a8e1457`

GitHub Actions run: `31411751817`

Result: **PASS**

Passed stages:

- strict TypeScript check
- eleven-finding R3 editorial proof
- R3 learner-V2 proof
- R1 critical regression
- R2 learner regression
- complete multilingual parity regression
- evidence upload

## Chapter state after R3

Implementation remediation is now complete across `TMW-QL-001..211` under R1 + R2 + R3.

However, **publication remains locked**. R3 does not authorize Question Studio routing, Question Bank writes, test assembly, manual multilingual freeze, or public delivery.

The next gate is a **fresh independent full-chapter exam-readiness audit of the remediated 211-QL runtime output**, including regenerated English/Hindi/Punjabi learner samples. Only that audit should decide whether the chapter can advance toward manual freeze and Question Studio integration.
