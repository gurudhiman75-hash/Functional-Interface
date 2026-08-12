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

Trace layers retained:

- `runtime-proof.ts` — legacy engineering generator
- `runtime-proof-reviewed.ts` — earlier QL-061 editorial input

Current authority:

- `runtime-proof-exam-ready.ts` — math/editorial proof candidate
- `runtime-proof-solution-diagram.ts` — solution-diagram-aware delivery surface

Active gates:

- `runtime-proof-exam-ready.test.ts`
- `runtime-proof-solution-diagram.test.ts`

The original `runtime-proof.test.ts` and `runtime-proof-reviewed.test.ts` were retired after fresh review found that they exercised a known-invalid engineering difficulty surface. `LEGACY_PROOF_GATE_NOTE.md` records why; Git history retains the original files.

## Fresh audit findings corrected

### Engineering explanation-depth blockers

The pre-remediation engineering runtime marked:

- `TRG-002-QL-056`
- `TRG-002-QL-065`
- `TRG-002-QL-068`

as **Hard**, although each engineering explanation contained only **two steps**. Because the engineering runtime requires at least three steps for Hard items, those QLs could throw before the older editorial wrapper was reached.

The active candidate rebuilds/recalibrates all three as **Medium**, which better matches their current standard-angle forms.

### Canonical requested-target mismatch found during self-review

A second self-review caught that the first remediation draft reused `buildSameSideMovingState()` for QL-056 and QL-065 but initially inherited its default requested target (`OBJECT_HEIGHT`). The stems and solutions asked for distances, so independent answer reconstruction would have rejected those drafts.

The active candidate now binds canonical requested targets explicitly:

- `QL-056`: tower base → **near/final observation point** horizontal distance;
- `QL-065`: tower base → **far/original observation point** horizontal distance;
- `QL-068`: **near point → far point separation**.

The exam-ready gate locks all three requested-target identities so they cannot silently regress.

## Mathematical/state remediation

### QL-015 — height from depression

Old issue: awkward forms such as `30 − 10√3` could appear as the target height.

Current construction uses valid 30° depression geometry, a clean multiple-of-`√3` horizontal separation, an integer vertical drop, and an integer target pole height. The explanation explicitly distinguishes the **drop below eye level** from the **final pole height**.

### QL-025 — shadow → height

Old issue: some seeds produced less natural `√3/3`-style height answers.

Current construction varies the 30°/60° case while selecting shadow lengths so the exact height is a clean multiple of `√3` rather than a rationalized-denominator form.

### QL-030 — height → shadow

Old issue: the reverse construction could give a synthetic surd object height merely to force a tidy shadow.

Current construction gives a natural **integer object height** and allows the exact surd to appear in the requested shadow answer.

### QL-056 — observer moves closer

- permanent family retained;
- current difficulty: **Medium**;
- complete two-observation setup;
- canonical target is the final near distance;
- distractors represent original distance, distance walked, and tower height.

### QL-065 — recover original distance

- permanent family retained;
- current difficulty: **Medium**;
- same-height relation is explicit;
- canonical target is the original far distance.

### QL-068 — recover point separation

- permanent family retained;
- current difficulty: **Medium**;
- canonical target is near-to-far observation-point separation;
- same-side difference is emphasized.

### QL-073 — observer-height correction

Old issue: seeded eye height could be **2.5 m**, which is poor real-world modeling for a standing observer.

Current authority fixes eye height at **1.5 m** and binds the stem, canonical state, answer, explanation and solution diagram to that same value.

## Difficulty calibration

### Genuine Hard retained

- `QL-049` — same-side two-observation system
- `QL-061` — move-farther system with original distance intentionally unknown

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

The earlier information-leak fix remains authoritative: initial angle 60°, distance walked away, final angle 30°, original distance not supplied, and both observations required.

### QL-078

- opposite-side wording clarified;
- difficulty calibrated to Medium;
- distractor provenance IDs now describe the actual error.

### QL-083

- building-to-building wording clarified;
- explanation separates rise above the first roof from the full second-building height;
- difficulty calibrated to Medium.

### QL-088

- elevation/depression wording cleaned;
- explanation frames the target around the observer's horizontal level;
- difficulty calibrated to Medium.

### QL-092

- river-width wording clarified;
- 45° equality is explained instead of presenting a direct setup as Hard;
- difficulty calibrated to Medium.

## Diagram policy

The solution-diagram-first architecture is unchanged by this content pass.

For all 20 proof QLs:

- solution diagram: **REQUIRED**;
- stem diagram: **OPTIONAL**, not automatically emitted;
- solution disclosure: **AFTER_ATTEMPT**;
- diagram evidence is fingerprint-bound to canonical spatial state;
- a solution diagram reused against another state fails validation;
- optional stem figures must not leak requested numeric labels/angles.

`runtime-proof-solution-diagram.ts` consumes the exam-ready candidate directly.

## Active gate targets

### Exam-ready gate

`runtime-proof-exam-ready.test.ts` targets:

- 20 permanent proof IDs;
- 12 canonical seeds per QL = **240 target cases**;
- spatial and legacy diagram verification;
- independent answer reconstruction;
- four distinct options and correct-index integrity;
- at least two stem variants per QL;
- explicit Medium/Hard calibration;
- clean QL-015 integer heights;
- no QL-025 `√3/3` regression;
- natural integer-given QL-030 stems;
- QL-056 near-distance requested target;
- QL-061 information-leak protection;
- QL-065 original-distance requested target;
- QL-068 point-separation requested target;
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

- AI remediation: **implemented for the 20 proof anchors**
- human review: **0 / 20**
- rendered diagram visual review: **not yet completed**

Runtime review flags remain conservative (`UNREVIEWED` / `PENDING`) until the later human process.

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
2. visually inspect representative rendered solution diagrams from every major spatial strategy represented by the proof;
3. perform one more exam-readiness sample review using active-candidate output;
4. then expand to the 48-QL MVP, adding still-missing broken-object and composite-vertical-object geometry.
