# NUM-CP-011 — Cumulative Landing Contract

**Checkpoint:** `NUM-CP-011 — Factorials, Prime Valuations and Trailing Zeroes`  
**Package:** `NUM-002`  
**Permanent QLs:** `NUM-QL-213..225`  
**Next free Number System QL:** `NUM-QL-226`  
**Landing target:** live `New-main`

## Landing state

CP011 Waves 0–3 are already present on live `New-main`. This cumulative landing carries the remaining certified stack in one integration surface:

- Wave 04 source saturation and final merge/split decision;
- permanent 13-authority allocation;
- frozen English runtime;
- frozen Hindi/Punjabi learner runtime;
- Question Studio review-source integration through the shared generation engine and real admin route;
- cumulative release audit.

No new discovery authority is introduced by this landing.

## Final authority count

Exactly 13 solve authorities are retained:

```text
NUM-QL-213 .. NUM-QL-225
```

The next free Number System identity after CP011 is:

```text
NUM-QL-226
```

Statement/claim wrappers and Data Sufficiency do not create additional CP011 QLs. The ownership decisions frozen in Wave 04 remain binding.

## Question Studio state

CP011 is exposed in Question Studio as a frozen review source in:

- English;
- Hindi;
- Punjabi.

The shared `NUM-002` Question Studio capability now covers:

```text
NUM-CP-008: NUM-QL-166..184  = 19
NUM-CP-009: NUM-QL-185..196  = 12
NUM-CP-010: NUM-QL-197..212  = 16
NUM-CP-011: NUM-QL-213..225  = 13
------------------------------------
TOTAL                         = 60
```

Package-only `NUM-002` requests retain the historical CP008 fallback. CP011 claims only explicit CP, pattern or QL ownership.

## Real-route contract

Landing readiness requires the actual admin route—not only the CP011 adapter—to prove:

- `NUM-CP-011` pattern recognition;
- direct checkpoint recognition;
- `NUM-QL-213..225 -> NUM-CP-011` inference;
- NUM-002 routing for CP011;
- Hindi/Punjabi allow-list inclusion;
- CP008/009/010 routing remains intact.

The shared generation engine must expose CP011 capabilities and dispatch the frozen CP011 runtime before older NUM-002 fallbacks.

## Cumulative executable proof

The dedicated cumulative workflow reruns the decisive stack rather than trusting old PR labels:

1. Wave 04 saturation;
2. permanent exact-range/exact-once allocation;
3. permanent English 2,340-package audit;
4. Hindi/Punjabi parity audit;
5. Hindi/Punjabi human-quality audit;
6. final localized textual-answer binding;
7. CP011 Question Studio integration;
8. shared-engine/admin-route contract;
9. CP010 Question Studio regression;
10. CP009 Question Studio regression;
11. CP008 Question Studio regression;
12. Number System shared Question Studio release audit;
13. cumulative CP011 landing audit;
14. actual admin route bundle.

Repository-wide integration/build workflows triggered by the cumulative PR remain additional landing evidence and must also be green before merge.

## Lifecycle boundary

The landing intentionally opens only the Question Studio review-source gate:

```text
Question Studio discoverable = true
Question Bank writable       = false
test eligible                = false
mock-test eligible           = false
publicly publishable         = false
automatic student publish    = false
```

Generated Question Studio review runs may be persisted in the generation-review tables; that is not Question Bank publication.

## Merge rule

This cumulative branch may be prepared while individual stacked CI is runner-queued, but it must **not** be merged into `New-main` until decisive exact-head cumulative and repository-wide shared gates are green. Any lower-stack correctness failure must be repaired and synchronized before landing.
