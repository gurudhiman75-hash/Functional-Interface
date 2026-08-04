# SYL-001 — Structured Proof Pedagogy V3

Authority: `SYL_001_STRUCTURED_PROOF_PEDAGOGY_V3`

Status: **approved for implementation with remediation**.

This authority adopts the uploaded `SYL-001 Proposed Corrections and Remodelling Specification` and applies the approved critical amendments below.

## Release boundary

```text
questionStudioVisible = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
humanReviewStatus = REVISE
```

## Mandatory V3 amendments

1. Logical truth and task correctness are separate fields.
2. A definite conclusion is proved from forced relations, not from one convenient model.
3. Possibility uses one complete satisfying model; non-following uses one complete countermodel.
4. One integrated visual proof artifact is required, but the renderer may use Euler geometry, a region model, a relation graph or a two-state canvas when circles alone would mislead.
5. Witness identity is explicit: same required, distinct required, or may be same/different.
6. The existence policy must be versioned, source-authorized, visible and identical across solver, explanation, diagram and locale.
7. Combination questions analyse named conclusions once, derive the mask, then reject visible mask options by mismatch.
8. The current 18 QLs are provisional review archetypes. Exhaustive QL discovery remains open until semantic, task, witness, topology, existence, diagram and distractor gap audits close.
9. Stable identity is content-hash based: logic content ID, localized record ID and review version ID.
10. Validation is evidence-backed. Automated validation never implies native editorial approval.

## Structured proof objects

V3 introduces:

- `SemanticEvaluation`;
- `TaskEvaluation`;
- `VisibleOptionAnalysis`;
- `ProofTrace`;
- `WitnessRegistry`;
- `IntegratedDiagramSpec`;
- `LocalizedExplanationV3`;
- `ValidationEvidence`;
- `HumanReviewDecision`.

## Student order

```text
1. Understand the statements
2. Combine the statements
3. Check each visible option
4. Why the correct option is right
5. Fast exam rule
6. One combined diagram for the correct option
7. Final answer
```

## Permanent invariants

- explanation option order equals visible option order;
- every visible option has one precise task-aware reason;
- impossible and possible-but-not-definite are never conflated;
- every correct answer has a complete proof, satisfying model or countermodel appropriate to the task;
- diagram count is exactly one;
- all relevant premises are represented in the integrated artifact;
- the artifact focuses only on the keyed option;
- human approval attaches to an immutable review-version hash;
- no publication gate opens before all P0 gates and native reviews pass.
