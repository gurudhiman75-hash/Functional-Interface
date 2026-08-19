# SEA-001 — Final Source Saturation and Exam-Realness Gate

Date: 2026-08-19  
Authority boundary: SEA-001 only. This document does not certify SEA-002, SEA-003, full-family exam weights, Question Bank delivery, mock eligibility, staging or public release.

## 1. Technical SEA-001 source saturation — GREEN

The existing Wave 5 source audit remains the executable source-relevance authority for the implemented SEA-001 scope.

```text
verified source records       13
exam families covered          4  (SSC, Banking, Railway, Punjab State)
SEA-001 checkpoints covered    5/5
invalid source records          0
external source audit          GREEN
```

This establishes external exam relevance for all five implemented SEA-001 checkpoint classes. It does **not** make the entire Seating Arrangement family source-complete.

Authorities:

- `saturation/source-audit.ts`
- `sea-001-source-audit-proof.test.ts`
- `WAVE5-SATURATION-AUDIT-EVIDENCE.md`

## 2. Target-exam family evidence — MEASURED, NOT WEIGHT-FROZEN

The newer realness register contains 17 target-exam observations and evaluates complete exam demand rather than only already-implemented SEA-001 patterns.

```text
SSC           3 records  -> requires SEA-002
Banking       9 records  -> requires SEA-002 and SEA-003
Punjab State  5 records  -> source base still too concentrated in Punjab Police
product weighting freeze ready = false
```

These observations must not be converted into fixed SSC/Banking/Punjab generation percentages yet.

Authorities:

- `realness/exam-evidence.ts`
- `sea-001-exam-profile-evidence-proof.test.ts`

## 3. Production-scale machine-realness measurement — COMPLETE

The deterministic measurement completed successfully on a production-scale audit corpus:

```text
caselets                         1,600
child questions                  6,400
checkpoint distribution          320 each across CP-001..CP-005
rendered-participant failures    0
```

Key healthy distribution measurements:

```text
answer positions, largest share              25.75%
answer-position max:min                       1.059
answer position by child index max:min        1.165
seat-count cell, largest share                11.63%
overall authority structures unique           897 / 1,600 = 56.06%
structure + query combinations unique        1,030 / 1,600 = 64.38%
lexical templates unique                       605 / 1,600 = 37.81%
```

Dynamic multilingual measurements covered all 20 permanent QLs per locale. Latin learner residue was 0 in both locales. Exact normalized full-question repeats were 3/80 in Hindi and 2/80 in Punjabi.

The successful measurement is recorded on draft PR #925 by the `Measure SEA-001 final realness gate` workflow.

## 4. Engineering anti-artifact thresholds — PINNED

`realness/machine-realness-thresholds.ts` now contains the engineering guardrails. These are **anti-generator-artifact thresholds**, not historical exam-frequency targets.

Important pinned limits include:

```text
overall authority unique share        >= 55%
structure + query unique share        >= 64%
lexical template unique share         >= 35%
per-blueprint structural unique share >= 20%
per-blueprint largest clone cluster   <= 10
answer-position largest share         <= 27%
answer-position max:min               <= 1.10
child-index answer-position max:min   <= 1.20
```

The thresholds were not loosened to make the current corpus green.

## 5. Machine-realness verdict — BLOCKED ON THREE PBAs

The current automated verdict is **BLOCKED**, specifically because three frozen blueprint authorities fall below the structural-diversity standard:

```text
SEA-PBA-001  end anchor + linked consecutive block
  unique authority structures: 15/80 = 18.75%
  largest clone cluster:        15

SEA-PBA-011  centre-facing gap + adjacency mix
  unique authority structures: 10/80 = 12.50%
  largest clone cluster:        18

SEA-PBA-014  outward reversal-intensive chain
  unique authority structures:  8/80 = 10.00%
  largest clone cluster:        17
```

The rest of the measured machine checks currently sit inside the pinned engineering guardrails, including answer-position balance, seat-count concentration, aggregate structural diversity, multilingual template concentration, exact-repeat limits and Latin-residue checks.

Because SEA-001 learner content is already English/HI/PA fingerprint-frozen, these three generators must **not** be silently diversified in-place. Correcting them requires a deliberate content-hardening/re-review path so previously approved learner fingerprints are not mutated without review.

## 6. Dynamic Hindi/Punjabi review boundary

The 2026-08-18 Hindi/Punjabi approval remains valid for the exact frozen reviewed localization corpus. It is not automatically reused as approval of a fresh dynamic-generation realness sample.

```text
measurement coverage     20 QLs per locale
machine template checks   within pinned guardrails
human dynamic spot review PENDING
multilingual freeze       unchanged
approved learner text     unchanged
```

## 7. Executable final-readiness state

`realness/final-readiness.ts` now records the measured state fail-closed:

```text
SEA-001 technical source saturation        GREEN
machine anti-artifact thresholds           PINNED
machine realness verdict                    BLOCKED: PBA-001 / PBA-011 / PBA-014
dynamic multilingual spot review           PENDING
family product-weight freeze               BLOCKED
Question Studio activation                 unchanged
Question Bank writes                       false
mock-test eligibility                      false
production staging                         false
public delivery                            false
```

Family-level blockers remain:

```text
SSC_REQUIRES_SEA002
BANKING_REQUIRES_SEA002_AND_SEA003
PUNJAB_SOURCE_BASE_TOO_NARROW
```

SEA-001-specific remaining blockers are:

```text
STRUCTURAL_REALNESS_SEA_PBA_001
STRUCTURAL_REALNESS_SEA_PBA_011
STRUCTURAL_REALNESS_SEA_PBA_014
DYNAMIC_MULTILINGUAL_SPOT_REVIEW_PENDING
```

## 8. Completion rule

The next SEA-001 realness hardening checkpoint must:

1. deliberately diversify PBA-001, PBA-011 and PBA-014 without changing their frozen solve contracts;
2. regenerate the 1,600-caselet measurement and clear the pinned machine thresholds;
3. rerun solver/oracle, necessity, freeze and multilingual parity regressions;
4. produce a new learner-review candidate for any wording/content that necessarily changes;
5. obtain the required human review before replacing existing frozen learner fingerprints; and
6. conduct a fresh Hindi/Punjabi dynamic spot review.

Even after SEA-001 clears those gates, full Seating-family SSC/Banking/Punjab weighting remains a later family-level gate requiring SEA-002/SEA-003 and broader Punjab evidence. Product activation remains separate.
