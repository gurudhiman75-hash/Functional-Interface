# TRG-002 20-QL Runtime Proof Status

Status: **FINAL EXAM-READINESS REMEDIATION IMPLEMENTED — EXECUTION / RENDERED VISUAL REVIEW / HUMAN REVIEW PENDING**

## Scope

Phase 6 still uses the same 20 permanent English proof QLs for `TRG-002 — Heights & Distances Applications`:

- TRG-CP-007: 5
- TRG-CP-008: 5
- TRG-CP-009: 5
- TRG-CP-010: 5
- proof total: **20 / 20**
- production target: **96 QLs**

Permanent IDs and locked family roles are unchanged.

## Active authority surface

Trace/input layers retained:

- `runtime-proof.ts` — legacy engineering generator
- `runtime-proof-reviewed.ts` — earlier editorial input
- `runtime-proof-exam-ready.ts` — first comprehensive exam-readiness remediation layer

Current math/editorial authority:

- `runtime-proof-final-remediation.ts`

Current delivery authority:

- `runtime-proof-solution-diagram.ts`

Active gates:

- `runtime-proof-exam-ready.test.ts`
- `runtime-proof-final-remediation.test.ts`
- `runtime-proof-solution-diagram.test.ts`

The solution-diagram delivery surface consumes the final-remediation layer directly.

## Final remediation completed

### QL-015 — height from depression

The intermediate remediation removed awkward answers such as `30 − 10√3`, but it still achieved clean output by supplying a surd horizontal distance in the stem.

The final construction is more exam-natural:

- angle of depression: **45°**;
- observer-building height: integer;
- horizontal separation: integer;
- vertical drop: integer;
- requested pole height: integer;
- explanation explicitly distinguishes the drop below eye level from the final pole height.

The canonical state, independent spatial verifier, answer reconstruction and solution diagram are rebuilt from the same 45° geometry.

### QL-025 — shadow → height

- avoids `√3/3`-style final answers;
- keeps ordinary integer shadow lengths in the stem;
- exact surd remains a natural height result when appropriate.

### QL-030 — height → shadow

- stem gives a natural integer object height;
- exact surd is allowed in the requested shadow answer rather than manufacturing a surd input.

### QL-056 / QL-065 / QL-068

Canonical requested targets remain explicitly locked:

- QL-056: final near distance from tower;
- QL-065: original far distance from tower;
- QL-068: separation between the two same-side observation points.

All three are calibrated to **Medium** in their current standard-angle forms.

### QL-061

The earlier information-leak correction remains authoritative:

- original distance is not supplied;
- observer moves away;
- both 60° and 30° observations are required;
- genuine multi-step **Hard** role retained.

### QL-073

Observer eye height remains fixed at a realistic **1.5 m**, consistently across stem, canonical state, answer, explanation and diagram.

### QL-078

- opposite-side wording clarified;
- Medium difficulty;
- distractor provenance now names the actual misconception, e.g. using the full observer separation as the height.

### QL-083 / QL-088 / QL-092

Wording and explanations were calibrated for exam readability, and direct standard-angle forms are classified **Medium** rather than inflated to Hard.

### QL-049

Retains genuine Hard status as a same-side two-observation system. Final wording uses explicit “observation points” rather than unnecessary A/B naming.

## Difficulty truth

Genuine Hard proof anchors:

- `QL-049`
- `QL-061`

Medium calibrated roles include:

- `QL-056`
- `QL-065`
- `QL-068`
- `QL-078`
- `QL-083`
- `QL-088`
- `QL-092`

Other proof roles retain their existing Easy/Medium classification.

## Diagram policy

The solution-diagram-first architecture remains unchanged by the content remediation.

For all 20 proof QLs:

- solution diagram: **REQUIRED**;
- stem diagram: **OPTIONAL**, never automatically emitted;
- solution disclosure: **AFTER_ATTEMPT**;
- diagram evidence is fingerprint-bound to canonical spatial state;
- a diagram reused against another/tampered state fails validation;
- optional stem figures must not leak requested numeric labels or requested angles;
- solution measurement annotations are derived from explicit canonical semantic sources.

## Gate targets

### Exam-ready gate

`runtime-proof-exam-ready.test.ts` targets 240 canonical cases plus a 1,000-case sweep and locks the first comprehensive remediation layer.

### Final-remediation gate

`runtime-proof-final-remediation.test.ts` targets:

- 20 permanent QLs;
- 12 canonical seeds per QL = **240 target cases**;
- 50-seed sweep = **1,000 target cases**;
- canonical spatial/diagram/answer verification;
- four unique options and correct-index integrity;
- activation locks;
- Medium/Hard calibration;
- QL-015 exact 45° depression and integer stem measurements;
- QL-025 answer-form regression protection;
- QL-030 natural integer given-height protection;
- QL-073 1.5 m eye-height lock;
- QL-078 precise distractor provenance;
- multi-step Hard reasoning for QL-049 and QL-061.

### Solution-diagram gate

`runtime-proof-solution-diagram.test.ts` targets:

- 20/20 required solution diagrams;
- canonical-state binding;
- requested-target consistency;
- diagram strategy agreement;
- solved measurement annotations;
- no automatic stem figures;
- AFTER_ATTEMPT disclosure;
- 240 canonical diagram cases;
- 1,000-case diagram sweep.

## Execution evidence

The gates are committed, but execution is still **not claimed**.

Current truth:

- strict TypeScript compile: **NOT CLAIMED**
- exam-ready gate execution: **NOT CLAIMED**
- final-remediation gate execution: **NOT CLAIMED**
- solution-diagram gate execution: **NOT CLAIMED**
- GitHub Actions pass: **NOT CLAIMED**

No GitHub Actions run has been observed on the current proof head.

## Review truth

- AI remediation of the 20 proof anchors: **implemented**
- human review: **0 / 20**
- rendered solution-diagram visual review: **pending**

Runtime review flags remain conservative (`UNREVIEWED` / `PENDING`).

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
2. build and visually inspect representative rendered solution diagrams across every proof spatial strategy;
3. perform one final active-output exam-readiness sample audit;
4. then expand to the 48-QL MVP, adding still-missing broken-object and composite-vertical-object geometry.
