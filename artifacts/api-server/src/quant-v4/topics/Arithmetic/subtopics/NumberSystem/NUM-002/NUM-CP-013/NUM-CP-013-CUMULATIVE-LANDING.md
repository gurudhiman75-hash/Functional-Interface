# NUM-CP-013 Cumulative Landing

## Chapter

`NUM-CP-013 — Positional Bases and Numeral Conversion`

## Certified discovery authority

The discovery/saturation stage is already exact-head certified at:

`3025065dbe9ffbfc3ea6ab1554465fc129a4aa4b`

That head passed Wave01, canonical Wave02 V4, Wave03, Wave04 merge/split, ownership closure and API build.

## Cumulative landing scope

The final CP013 landing gate must execute all of the following on one head:

1. Wave01 foundation and independent uniqueness.
2. Canonical Wave02 V4 representation/edge and independent saturation.
3. Wave03 source/edge and independent saturation.
4. Wave04 22-prototype → 11-authority merge/split/ownership closure.
5. Permanent QL allocation `NUM-QL-237..NUM-QL-247`.
6. Permanent English runtime audit across 880 packages, including source-seed decoupling and prototype-internal mode reachability.
7. Hindi/Punjabi semantic parity across 1,100 packages, including the same internal modes in each language.
8. Hindi/Punjabi human-quality/script audit across 770 packages.
9. CP013 Question Studio adapter audit, including permanent/source-seed traceability and native final-answer labels.
10. CP013 shared-facade/admin-route contract with exact mount-order guard.
11. CP013 cumulative landing audit.
12. Actual CP013 admin route bundle.
13. API server build.

## Permanent result

- discovery prototypes: 22
- permanent solve authorities: 11
- permanent QLs: `NUM-QL-237..NUM-QL-247`
- next free QL: `NUM-QL-248`

## Reachability repair included in the landing authority

Before final certification, static audit found that the original permanent projection reused one seed for both source-prototype choice and prototype-internal mode choice. Prototype-level coverage therefore hid two permanent coverage losses:

- QL237/P011 could not reach number-of-digits or smallest n-digit boundary modes;
- QL241/P021 could not reach one-solution or multiple-solution topology.

The landing candidate now decouples source selection from source generation:

- source prototype is selected by permanent-seed position in the authority's retained source list;
- source generator receives the successive visit number for that prototype as `sourceSeed`.

Cumulative certification explicitly requires:

- QL237/P011 → modes `0,1,2,3`;
- QL241/P021 → modes `0,1,2`;
- those same modes in both Hindi and Punjabi;
- positive permanent/source seeds and exact Studio traceability parity.

Additional permanent/localization audits also require all internal modes for P009, P012 and P015.

This is a CP013 freeze correction, not a new authority allocation. QL248 remains free.

## Shared Question Studio result

The additive NUM-002 review capability becomes **82 permanent QLs**:

- CP008: 19 (`166..184`)
- CP009: 12 (`185..196`)
- CP010: 16 (`197..212`)
- CP011: 13 (`213..225`)
- CP012: 11 (`226..236`)
- CP013: 11 (`237..247`)

Aggregate range: `NUM-QL-166..NUM-QL-247`.

Aggregate release:

`NUM-002-QS-CP008-CP013-MULTILINGUAL-FROZEN-V1`

Package-only `NUM-002` fallback remains preserved.

Studio review payloads distinguish `permanentSeed` from the resolved `sourceSeed`. Hindi/Punjabi final explanation lines use `उत्तर:` / `ਉੱਤਰ:` rather than English `Answer:`.

## Lifecycle closure

The cumulative landing opens only guarded Question Studio review for CP013.

- underlying permanent/localized source packages remain non-discoverable;
- Question Studio review projection is discoverable;
- Question Bank writes/stores remain OFF;
- test eligibility remains OFF;
- mock-test eligibility remains OFF;
- public publication remains OFF;
- automatic student publication remains OFF.

## Current certification caveat

GitHub Actions is currently failing repository-wide before jobs receive a first step. The observed CP013 and unrelated jobs have `steps: null`, so these are infrastructure-level non-executions rather than test assertion results. Vercel checks have also reported build-rate-limit failures.

Therefore this document defines the cumulative gate and records the completed code/static hardening, but CP013 must not be called cumulative-certified or merged until the latest candidate head executes the permanent English, localization, Question Studio, cumulative, admin-route/API and production regressions successfully.
