# MAL-CP-003 Wave 11 — Source and Policy Closure

Status: **all source and policy blockers closed; permanent QLs remain unallocated pending unified runtime/editorial audit**.

## Purpose

Wave 10 left four mathematically distinct contracts open because direct evidence or policy authority was incomplete. Wave 11 closes those four blockers without skipping the final learner-runtime review.

```text
Former blocker contracts:       4
Remaining source blockers:      0
Effective owned contracts:      9
Merged representation variants: 2
Excluded to MAL-CP-004:         1
Permanent QLs:                  0
Freeze readiness:               false
```

## 1. Initial composition from final evidence

The retained contract is:

```text
MAL-CP003-PROT-INITIAL-ORIGINAL-QUANTITY-FROM-FINAL
```

A direct LIC AAO question reconstructs the initial water quantity from repeated-replacement evidence and a final component quantity. The current prototype reconstructs the initially named original component. These are complementary displays of the same uniquely determined initial two-component state.

Policy:

- vessel volume, equal removal quantity and operation count must be supplied;
- one final named-component quantity is supplied;
- reconstruct the requested initial component exactly;
- reconstruct its complement as `vessel volume − requested component` when needed;
- do not create separate QLs for initial milk versus initial water.

This closes the earlier output-mismatch blocker as a representation decision, not by pretending that the source wording was identical.

## 2. Exact operation count from exact final evidence

The retained contract is:

```text
MAL-CP003-PROT-OPERATION-COUNT-FROM-FINAL
```

Authority now includes:

- the reviewed ExamTree quant-v2 `replacementIterationsFromFinalRatio` runtime;
- a direct public aptitude question asking how many repeated replacement operations produce a stated final ratio.

Final policy:

```text
Allowed operation domain: 1..12
Comparison:               exact rational equality
Approximation:            forbidden
Floating logarithms:      forbidden
No exact solution:        reject the generated/input state
Multiple exact solutions: impossible when 0 < retained fraction < 1
```

The original-component sequence is strictly decreasing for every valid replacement. Therefore an exact positive target can match at most one operation count.

The minimum-threshold contract remains separate because it asks for the first stage satisfying an inequality, not an exact equality target.

## 3. Unequal replacement stages

The retained contract is:

```text
MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-UNEQUAL-REPLACEMENTS
```

Authority now includes:

- a direct Testbook question with a 5-litre replacement followed by an 8-litre replacement;
- the reviewed ExamTree quant-v2 `replacementDifferentRounds` runtime.

Final policy:

```text
Stage count:          2..4
Vessel volume:        restored after every refill
Stage order:          preserved in the visible explanation ledger
Final invariant:      initial original × product of stage retentions
Difficulty authority: Hard
```

Although multiplication of fixed-volume scalar retention factors is commutative, the explanation must retain the stated stage order. This keeps the learner's physical process and all intermediate quantities auditable.

## 4. Component switching and third-liquid stages

The retained contract is:

```text
MAL-CP003-PROT-THIRD-LIQUID-TWO-STAGE-COMPOSITION
```

Authority now includes:

- a direct three-component alcohol–acid–water replacement question;
- a competitive-exam question in which refill stages switch between water and pure acid;
- the MAL-001 ownership rule separating one-vessel repeated replacement from multi-vessel transfer.

Final policy:

```text
State:            full component vector after every stage
Output order:     exact named order from the stem
CP-003 ownership: all stages occur in one vessel
CP-006 boundary:  material is transferred between distinct vessels
```

A changing refill component does not by itself create a vessel-transfer problem. It remains CP-003 while the process acts on one well-mixed vessel.

## 5. Executable closure proof

The Wave 11 audit proves:

```text
Initial inverse round trips:              240
Complement representation proofs:         240
Exact operation-count round trips:         360
Non-exact operation targets rejected:      360
Unequal-stage product identities:          320
Three-component conservation states:       320
Existing blocker-runtime regressions:      200
```

The audit also requires:

- all four former blockers to have source evidence;
- nine unique effective contracts;
- zero remaining source-policy blockers;
- no permanent QL IDs;
- no publication, Question Studio, Question Bank or test eligibility.

## 6. Current readiness

```text
Source-policy readiness:    true
Runtime-editorial readiness: false
Freeze readiness:           false
Next available QL:           MAL-QL-029
QL reserved:                 false
```

Wave 12 must now expose all nine effective contracts through one inactive English runtime and judge the generated questions as a learner-facing corpus. Passing mathematical closure alone is not permission to freeze or publish the CP.
