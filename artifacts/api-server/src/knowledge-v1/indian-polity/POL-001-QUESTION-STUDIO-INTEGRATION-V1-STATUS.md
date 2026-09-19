# POL-001 Indian Polity — Question Studio Integration V1

**Status:** IMPLEMENTED CANDIDATE  
**Date:** 2026-09-19  
**Package:** `POL-001`  
**Engine:** `knowledge-v1`  
**Runtime mode:** `review-only`

## Chapter audit

- POL-CP-001 through POL-CP-027 are present on `New-main`.
- All 27 English CPs are approved/content-frozen.
- POL-CP-001 through POL-CP-006 had stale review-candidate lifecycle headers; those metadata records were reconciled during this pass without changing question content.
- POL-CP-007 through POL-CP-027 already carried approved/frozen lifecycle state.
- The package roadmap now lists all 27 CPs as eligible for shared package binding.

## Qualification explanation audit

The final audit backfills the chapter-wide qualification standard across the frozen English corpus:

- President — Article 58 full qualification set;
- Vice-President — Article 66 full qualification set;
- Parliament membership — Article 84 citizenship, oath, age and Parliament-law qualifications;
- Supreme Court Judges — Article 124(3) full judicial/advocacy/distinguished-jurist routes;
- High Court Judges — Article 217(2) citizenship and ten-year professional routes, with no invented minimum age;
- Governor — Article 157 citizenship and age only; Article 158 conditions remain separate;
- State Legislature membership — Article 173 citizenship, oath, age and Parliament-law qualifications;
- Attorney-General and Advocate-General — existing CP022 V2 full qualification notes retained.

A cross-chapter regression test now guards these explanations against reverting to single-condition notes.

## Integration

`knowledge-v1-pol001-adapter-v1.ts` materializes each CP from its latest approved review generator and exposes one frozen Question Studio package:

- package ID: `POL-001`;
- subject: `Static GK`;
- topic: `Indian Polity`;
- 27 CP selectors;
- QL selectors across the full frozen corpus;
- Easy / Medium / Hard / Mixed filtering;
- deterministic seeded selection;
- selection without replacement;
- English only at this checkpoint.

The adapter normalizes older and newer Polity review-generator shapes into one runtime contract. It derives the canonical answer from the correct option when older/newer CP generators do not expose a dedicated canonical-answer field.

## Safety boundary

This registration uses the standard Question Studio `REVIEW_ONLY` lifecycle:

- review surface required;
- manual approval required;
- Question Bank writes disabled;
- tests ineligible;
- mocks ineligible;
- public publication disabled;
- automatic student publication disabled;
- production release not authorised.

This pass does **not** publish Polity questions to students and does **not** activate Hindi/Punjabi localization.

## Regression coverage

The adapter test verifies:

- exactly one registered `POL-001` package;
- 27 unique CP IDs;
- deterministic generation without repeated question IDs;
- CP selection;
- QL selection;
- difficulty filtering;
- rejection of unsupported languages and unknown selectors;
- review-only lifecycle safety flags.

## Revision policy

Frozen review questions remain owned by their source CP generators. Any factual/editorial correction must be made in the owning CP and revalidated there; the package adapter must not silently rewrite frozen question content.
