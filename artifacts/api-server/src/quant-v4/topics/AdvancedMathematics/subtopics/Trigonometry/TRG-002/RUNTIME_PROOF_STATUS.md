# TRG-002 20-QL Runtime Proof Status

Status: **EXAM-READINESS REMEDIATION IMPLEMENTED — EXECUTION / VISUAL DIAGRAM REVIEW / HUMAN REVIEW PENDING**

## Scope

Phase 6 still uses the same **20 permanent English QLs** for `TRG-002 — Heights & Distances Applications`:

- TRG-CP-007: 5
- TRG-CP-008: 5
- TRG-CP-009: 5
- TRG-CP-010: 5
- proof total: **20 / 20**
- production target: **96 QLs**

Permanent IDs and locked family roles are unchanged.

## Active authority surface

The original engineering layers remain for traceability:

- `runtime-proof.ts` — legacy engineering generator
- `runtime-proof-reviewed.ts` — earlier QL-061 editorial input

The active candidate is now:

- `runtime-proof-exam-ready.ts` — current math/editorial proof authority
- `runtime-proof-solution-diagram.ts` — current solution-diagram-aware delivery surface

Active gates:

- `runtime-proof-exam-ready.test.ts`
- `runtime-proof-solution-diagram.test.ts`

The original `runtime-proof.test.ts` and `runtime-proof-reviewed.test.ts` were retired after fresh review found that they exercised a known-invalid engineering difficulty surface. The reason is recorded in `LEGACY_PROOF_GATE_NOTE.md`; Git history preserves those files.

## Fresh audit finding corrected

Three additional execution blockers were found in the pre-remediation engineering runtime:

- `TRG-002-QL-056`
- `TRG-002-QL-065`
- `TRG-002-QL-068`

Each was marked **Hard** while the engineering explanation had only **two steps**. The engineering runtime requires at least three explanation steps for Hard questions, so those QLs could throw before the earlier reviewed wrapper was reached.

The current candidate does not hide this. These roles have been rebuilt/recalibrated as **Medium**, which better matches their present standard-angle forms.

## Mathematical/state remediation

### QL-015 — height from depression

Old issue: awkward forms such as `30 − 10√3` could appear as the target height.

Current construction:

- valid 30° depression geometry;
- horizontal separation chosen as a clean multiple of `√3`;
- vertical drop becomes an integer;
- target pole height is an integer;
- explanation explicitly distinguishes **vertical drop** from **final pole height**.

### QL-025 — shadow to height

Old issue: some seeds produced less natural `√3/3`-style height answers.

Current construction varies the 30°/60° case while choosing the shadow length so the exact height is a clean multiple of `√3` rather than a rationalized denominator form.

### QL-030 — height to shadow

Old issue: reverse construction could give the learner a synthetic surd object height merely to force a tidy shadow.

Current construction gives a natural **integer object height** and allows the exact surd to appear in the requested shadow answer, which is more exam-like.

### QL-056 — observer moves closer

- permanent family retained;
- current difficulty: **Medium**;
- complete two-observation setup;
- stem wording clarified;
- distractors represent original distance, distance walked, and tower height.

### QL-065 — recover original distance

- permanent family retained;
- current difficulty: **Medium**;
- intended same-height relation used explicitly;
- explanation no longer relies on an inflated Hard label.

### QL-068 — recover point separation

- permanent family retained;
- current difficulty: **Medium**;
- nearer and farther distances are found from the tower height and then subtracted;
- same-side difference is emphasized.

### QL-073 — observer-height correction

Old issue: seeded eye height could be **2.5 m**, which is poor real-world modeling for a standing observer.

Current authority fixes eye height at **1.5 m** and binds the stem, canonical state, answer, explanation and solution diagram to that same value.

## Difficulty calibration

Current exam-readiness difficulty decisions:

### Genuine Hard retained

- `QL-049` — same-side two-observation system
- `QL-061` — move-farther system with the original distance intentionally unknown

### Medium in current standard-angle form

- `QL-056`
- `QL-065`
- `QL-068`
- `QL-078`
- `QL-083`
- `QL-088`
- `QL-092`

This avoids calling a direct 45° or routine 30°/60° application Hard simply because the scenario contains more words.

## Editorial refinements

### QL-061

The earlier information-leak fix remains authoritative:

- initial angle = 60°;
- distance walked away is given;
- final angle = 30°;
- original distance is **not** given;
- the explanation must use both observations.

### QL-078

- opposite-side wording clarified;
- difficulty calibrated to Medium;
- distractor provenance IDs now say what the error actually is, e.g. using the full observer separation as height.

### QL-083

- building-to-building stem clarified;
- explanation separates **rise above the first roof** from **full second-building height**;
- difficulty calibrated to Medium.

### QL-088

- elevation/depression wording cleaned;
- explanation frames the target as lower part + upper part around the observer's horizontal level;
- difficulty calibrated to Medium.

### QL-092

- river-width wording clarified;
- 45° shortcut is explained rather than treated as a Hard system;
- difficulty calibrated to Medium.

## Diagram policy

The solution-diagram-first architecture remains unchanged by this content pass.

For all 20 proof QLs:

- solution diagram: **REQUIRED**;
- stem diagram: **OPTIONAL**, not automatically emitted;
- solution disclosure: **AFTER_ATTEMPT**;
- diagram evidence is fingerprint-bound to the canonical spatial state;
- a solution diagram reused against a different state must fail validation;
- optional stem figures must not leak requested numeric labels/angles.

`runtime-proof-solution-diagram.ts` now consumes the exam-ready candidate directly.

## Active gate targets

### Exam-ready gate

`runtime-proof-exam-ready.test.ts` targets:

- all 20 permanent proof IDs;
- 12 canonical seeds per QL = **240 target cases**;
- spatial verification;
- legacy diagram projection verification;
- independent answer reconstruction;
- four distinct options and valid correct index;
- at least two stem variants per QL;
- explicit difficulty locks for remediated Medium / retained Hard roles;
- clean QL-015 integer target heights;
- no `√3/3`-style QL-025 regression;
- natural integer-given QL-030 stems;
- QL-061 information-leak protection;
- QL-073 eye height = 1.5 m;
- QL-078 distractor-tag remediation;
- 50-seed sweep = **1,000 target cases**.

### Solution-diagram gate

`runtime-proof-solution-diagram.test.ts` targets:

- 20/20 required solution diagrams;
- canonical-state binding;
- correct diagram strategy;
- no automatic stem diagrams;
- AFTER_ATTEMPT disclosure;
- 240 canonical diagram cases;
- 1,000-case diagram sweep.

## Execution evidence

The new gates are committed, but **execution is still not claimed**.

Current truth:

- strict TypeScript compile: **NOT CLAIMED**
- exam-ready 240-case gate: **NOT CLAIMED**
- exam-ready 1,000-case sweep: **NOT CLAIMED**
- solution-diagram 240-case gate: **NOT CLAIMED**
- solution-diagram 1,000-case sweep: **NOT CLAIMED**
- GitHub Actions pass: **NOT CLAIMED**

No GitHub Actions run has been observed on the current proof head.

## Review truth

- AI remediation pass: **implemented for 20/20 proof anchors**
- human review: **0 / 20**
- rendered diagram visual review: **not yet completed**

Runtime review flags remain conservative (`UNREVIEWED` / `PENDING`) until the later human process; AI remediation is recorded in this status/manifest rather than impersonating human review.

## Activation

Still OFF:

- Question Studio discovery
- Test Builder eligibility
- question-bank storage
- public publication
- Hindi/Punjabi runtime

## Next checkpoint

Before expanding **20 → 48 QLs**:

1. obtain real TypeScript/runtime execution evidence if available;
2. visually inspect representative rendered solution diagrams from all major spatial strategies represented by the proof;
3. perform one more exam-readiness sample review using the active candidate output;
4. then expand to the 48-QL MVP while adding still-missing families, especially broken-object and composite-vertical-object geometry.
