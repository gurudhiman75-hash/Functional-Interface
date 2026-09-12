# ARG-001 Post-CP008 CP007 Real-Paper Editorial Audit

Status: **REAL-PAPER RELEASE BLOCKED / CP007 REMEDIATION REQUIRED**

This audit is additive documentation only. It does not mutate `ARG_CP007_REAL_PAPER_PARITY_V2` or `ARG_CP008_REAL_PAPER_CLOSURE_V1`.

## Scope

Audited the six CP007 concise real-paper templates, their two semantic slot banks, four profile shapes, and shared EN/HI/PA slot-indexing model.

CP007 independently varies two four-value slots. Its renderer uses:

- `aIndex = seed mod 4`
- `bIndex = (floor(seed / 4) + 3 * seed) mod 4`

Across a 16-seed cycle, every A/B pair is reachable. Therefore semantic compatibility cannot rely on the values being listed in matching positions; every cross-pair must make sense.

## Release-blocking findings

### RP01 — `ARG-CP007-QL001-T01` — correction deadline placed after process completion

The statement is:

`Should {a} display {b} clearly after the relevant process is complete?`

One `{b}` value is `a correction deadline`.

That yields surfaces such as:

`Should a recruitment board display a correction deadline clearly after the relevant process is complete?`

A correction deadline is normally actionable before the correction/application process closes. Placing it after the relevant process is complete makes the proposition temporally incoherent or at minimum seriously ambiguous.

**Impact:** 4 / 16 A/B semantic pairs in QL001 (the correction-deadline value crossed with all four authorities), shared structurally by EN/HI/PA.

**Required remediation:** either replace the slot with a post-process item, or make the statement timing conditional on the selected information type.

### RP02 — `ARG-CP007-QL006-T01` — organisation/trigger Cartesian mismatch

The authority slot is:

- an online marketplace
- an examination authority
- a bank
- a college

The trigger slot is:

- one buyer complaint
- one cheating complaint
- one automated fraud flag
- one misconduct allegation

Because these are independently crossed, CP007 can generate category mismatches. Definite examples include:

- `an online marketplace` × `one cheating complaint`
- `an examination authority` × `one buyer complaint`
- `a bank` × `one buyer complaint`
- `a bank` × `one cheating complaint`
- `a college` × `one buyer complaint`
- `a college` × `one automated fraud flag`

The argument logic may remain formally parseable, but the scenario is not a credible real-paper surface for the selected institution.

**Impact:** at least 6 / 16 A/B semantic pairs are definite mismatches; other cross-pairs are context-dependent and should be curated rather than assumed valid. The same semantic pairings propagate to EN/HI/PA.

**Required remediation:** use correlated authority/trigger scenario pairs, or replace both slots with generic nouns that are valid under all 16 combinations.

## High-priority real-paper naturalness debt

These are not included in the minimum hard-blocker count but should be handled in the same remediation pass:

- `ARG-CP007-QL003-T01`: some organisation/service cross-pairs are much less natural than others (for example a passport centre with `standard certificate services`).
- `ARG-CP007-QL004-T01`: road type and peak-period slots are independently crossed, producing context-poor combinations such as a school-zone road during generic weekend peak hours.
- `ARG-CP007-QL005-T01`: employee type and monitoring technology are independently crossed; some combinations are possible but substantially less realistic than the aligned pairs.
- CP007 strong opposing arguments sometimes express a safeguard/qualification rather than a clean rejection. This can be valid argument-strength reasoning, but the editorial pass should ensure the wording remains recognisably exam-like rather than policy-analysis prose.

## Release strategy implication

CP007 cannot currently be treated as a clean learner-release escape hatch around the CP003 saturation defects. Both layers require remediation before ARG-001 is promoted beyond review-only use.

The correct next implementation is a superseding editorial layer with **correlated-slot support**. The fix should not simply delete bad seeds: doing so would preserve fragile template architecture and make future additions easy to break again.

## Required proof for the superseding layer

1. Exhaustively enumerate all 16 CP007 A/B pairs per QL and all three locales.
2. Assert that each organisation/action/object pairing belongs to an explicit compatibility set.
3. Keep all four exam profile option shapes and answer-selection logic unchanged unless a separate real-paper evidence review requires otherwise.
4. Preserve deterministic replay after the compatibility model changes.
5. Re-run answer-position and combination-option coverage.
6. Preserve Question Studio review-only lifecycle and all learner-delivery locks until manual approval.
7. Issue a new freeze authority only after the corrected CP003/CP004 and CP007 layers are green together.

## Verdict

**CP007 IS NOT READY FOR LEARNER RELEASE AS CURRENTLY FROZEN.**

CP008 remains a valid historical closure record, but the post-freeze editorial audit has identified slot-composition defects that require an explicit superseding authority before learner delivery is considered.
