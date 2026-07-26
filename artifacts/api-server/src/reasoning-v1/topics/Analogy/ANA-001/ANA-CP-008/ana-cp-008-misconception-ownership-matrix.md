# ANA-CP-008 Misconception Ownership Matrix

Status: **PROVISIONAL DESIGN GATE — NO QL IDS OR COUNTS FROZEN**

## 1. Purpose

This matrix assigns dominant wrong-reasoning families to every candidate ANA-CP-008 solve contract. It is used to decide whether contexts can share one permanent QL, explanation structure and distractor policy.

A context may share a QL only when it preserves:

1. the same student calculation sequence;
2. the same dependency between letter and number components;
3. the same dominant misconception family;
4. the same validity-domain checks;
5. the same explanation checkpoints.

Parameter magnitude, sign and token order do not alone create a new solve contract. They may still require separate language templates or validators.

## 2. Global distractor rules

Every generated option must satisfy all of the following:

- it is not the intended output;
- it does not complete any registered ANA-CP-008 rule with the displayed evidence;
- it represents a named misconception or a bounded near miss;
- it preserves the answer token kind expected by the task;
- it does not rely on malformed tokens, leading zeros, non-integral arithmetic or approximate roots;
- odd-pair questions contain exactly three valid pairs and one invalid pair;
- equivalent-pair questions contain exactly one complete pair matching the reference relation.

## 3. Ownership matrix

| Candidate solve contract | Dominant misconceptions | Required explanation checkpoints | Prohibited distractor shortcuts | QL implication |
|---|---|---|---|---|
| Ordinary-position sum to scalar | multiply positions; use reverse positions; omit one letter; off-by-one alphabet indexing | write each ordinary position; add all positions; retain numeric output | malformed number; unrelated nearby integer with no misconception basis | separate from product and sum-to-letter |
| Ordinary-position product to scalar | add positions; multiply after off-by-one indexing; use only one position; reverse-position product | write each position; multiply; check bounded integer | sum result disguised as arbitrary near miss without collision check | separate from sum |
| Ordinary-position sum to derived letter | stop at scalar sum; apply modulo without authority; map with A=0; choose one input letter | show positions; add; verify result 1..26; map back to letter | wrapped output; output already present in input when it collapses to simpler rule | separate output and explanation contract |
| Single-letter position square | return position only; double the position; cube it; use reverse position | identify ordinary position; square; keep numeric result | arbitrary perfect square not linked to the input letter | standalone position-power contract |
| Independent single-letter shift plus numeric delta | apply number change to letter; use same delta for both components; reverse one sign; change only one component | derive letter shift; derive whole-number add/subtract; apply independently | distractor matching shared-delta or another registered independent context | one solve contract across source-safe signs and magnitudes |
| Shared delta across cluster letters and number | apply delta only to number; apply different letter shifts; reverse one component; treat number as multiplier | state one common signed delta; apply to every letter and number; verify all components | any output fitting independent-vector authority | separate coupled/shared contract |
| Independent cluster vector plus fixed numeric delta | force one common letter shift; swap positional shifts; reverse numeric sign; ignore one component | calculate first-letter shift; second-letter shift; numeric delta; transfer all three | distractor fitting shared-delta, multiplier, power or root authority | one solve contract across registered vectors and deltas |
| Cluster vector plus exact multiplier | add the factor; multiply letters; use decimal approximation; invert numerator/denominator; ignore exact divisibility | apply letter vector; write exact factor; prove integral result; preserve token order | rounded rational result; non-integral output; result fitting fixed-delta rule | integer and rational factors may share one solve contract |
| Number-first cluster vector plus exact multiplier | reorder token; treat number as suffix; add instead of multiply; round rational output | preserve number-first order; apply exact factor; apply positional letter vector | cluster-first rendering; approximate result | same arithmetic solve contract, representation-template decision remains open |
| Cluster vector plus direct cube | square instead of cube; cube root; multiply by three; apply power to letter positions | apply letter vector; cube displayed number; check bounds | perfect-square-to-cube result; root result | separate direct-power contract |
| Cluster vector plus perfect-square-to-cube | cube displayed number directly; square it; use square root only; accept non-square input | prove input is r²; derive r; compute r³; apply letter vector | non-perfect-square source; direct-cube alternative | separate multi-stage recognition contract |
| Cluster vector plus exact cube root of n+1 | cube input; cube-root input without +1; use approximate root; subtract one after root | add one; prove exact perfect cube; take integer cube root; apply letter vector | approximate/root-rounded output; direct power output | separate inverse-power contract |
| Number-first cluster vector plus exact square root of n+1 | reorder token; square input; root input without +1; approximate root | preserve number-first order; add one; prove perfect square; take exact root; apply letter vector | cluster-first output; rounded root | separate square-root contract and representation template candidate |
| Digit-sum-square successor | shift letter independently; square whole number; use input digit sum for output; increment letter directly | verify input invariant; increment number; recompute digit sum; square; map to letter | output fitting independent letter-number shift; stale input-derived letter | standalone coupled invariant |

## 4. Context-level ownership rules

The following remain parameters, not new misconception families, while source and yield audits stay green:

- sign and magnitude of fixed shifts or deltas;
- source-backed vector values;
- exact multiplier values such as `5`, `5/2`, `3/2` and `2`;
- cluster-first versus number-first token order when the arithmetic contract is unchanged;
- answer-position permutation;
- letter and number samples within the registered validity domain.

A split is required when any context introduces:

- a different arithmetic sequence;
- a different dependency between components;
- a new domain precondition such as perfect-square recognition;
- a different output kind;
- a different dominant misconception set;
- materially different multilingual explanation grammar.

## 5. Task-specific misconception policy

### Direct completion

The three wrong options should cover different misconception families where possible. Repeating the same arithmetic error with three nearby values is not sufficient editorial diversity.

### Odd-pair selection

The invalid pair should violate exactly one dominant rule component unless the source pattern explicitly tests compound inconsistency. The three valid pairs must uniquely identify one rule and context.

### Equivalent-pair selection

The three wrong pairs must fail the reference relation and must not form any other registered relation with the references. This mode remains pilot-only pending an exact official mixed fixture.

## 6. Allocation consequences

This audit supports the current candidate solve-contract splits in the operation-by-task matrix. It does not support a Cartesian product of every solve contract and task mode.

Before permanent allocation, each candidate unit still requires:

1. English stem and explanation prototypes;
2. Hindi and Punjabi structural review;
3. token-order template audit;
4. cross-checks against CP-005, CP-006, CP-007, numeric analogy, Coding-Decoding and CP-009;
5. a final recurring-source gap audit;
6. rerun of rule, option, presentation and misconception gates after any split or merge.

## 7. Current conclusion

All proven ANA-CP-008 operation families now have explicit misconception ownership. This is sufficient to proceed to stem/explanation prototype discovery, but not to freeze permanent QLs, solve modes or the inherited `ANA-QL-223..238` reservation.