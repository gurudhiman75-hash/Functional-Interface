# NUM-CP-004 Hindi/Punjabi Human Quality V2 Status

## Scope

This record governs the current Hindi (`hi-IN`) and Punjabi (`pa-IN`) learner-review surface for `NUM-CP-004 — Prime Structure and Factorisation`.

Permanent mathematics remains owned by the frozen English Editorial V2 authority for `NUM-QL-018..NUM-QL-045`.

## Forward-port basis

Historical review PR `#843` was based on an obsolete `New-main` and had diverged by hundreds of commits. Its six localization files were therefore transplanted by blob identity onto current main rather than merging the stale branch lineage.

Historical machine evidence retained:

- localization head: `22c55bac2ce4a9409fe99c4d262c5123260b363e`
- workflow run: `31957577449` — SUCCESS
- review artifact: `9266435149`
- artifact digest: `sha256:1a8bb97b476e509d70a3a940a56c498db2a485d4ae9bab2943895dbcfd01f8e4`
- mathematical/linguistic audit: 4,480 localized questions
- retained human-review questions: 224

## Direct human-quality findings

Inspection of the retained review artifact found learner-facing defects not rejected by the historical automated gate:

1. residual English `and` inside Hindi/Punjabi claim stems;
2. duplicated endings such as `है। है।` / `ਹੈ। ਹੈ।`;
3. awkward Hindi comparison wording (`दिए हैं। में किसके...`);
4. literal `से सख़्ती से बड़ी` / Punjabi equivalent;
5. mechanical Data Sufficiency wording;
6. inconsistent wording for complete prime factorisation.

## V2 remediation

The final localized review wrapper now:

- removes the residual English conjunction;
- naturalizes the identified comparison and strict-greater stems;
- uses simple Data Sufficiency wording;
- normalizes complete-prime-factorisation terminology;
- replaces sentence-appending conclusions with a direct answer line:
  - Hindi: `अतः सही उत्तर: ...`
  - Punjabi: `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ: ...`;
- preserves option order, correctness, misconception ancestry, hidden state and mathematical fingerprint.

## New exhaustive gate

`runtime-human-quality.test.ts` audits all `28 × 80 × 2 = 4,480` localized questions and rejects regression of every defect family found above, plus answer/correct-option drift.

The historical 4,480-case mathematical/linguistic/rule-first parity gate remains mandatory and continues to export the 224-question review pack.

## Lifecycle

This is a controlled multilingual review authority only.

- Question Studio activation: OFF
- Question Bank writes: OFF
- scored/mock-test eligibility: OFF
- public publication: OFF
- automatic student publication: OFF

A green V2 gate establishes technical/editorial review readiness. It does not by itself authorize downstream activation.
