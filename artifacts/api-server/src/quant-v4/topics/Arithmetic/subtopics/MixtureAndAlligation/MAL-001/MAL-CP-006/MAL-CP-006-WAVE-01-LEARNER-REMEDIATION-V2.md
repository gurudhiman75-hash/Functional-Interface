# MAL-CP-006 Wave 01 — Learner Remediation V2

Status: **DISCOVERY LEARNER SURFACE — REVIEW ONLY**

Runtime: `MAL-CP006-EN-LEARNER-REMEDIATION-WAVE01-V2`

Permanent QLs: **0**  
Permanent solve modes: **0**

## Why this remediation was required

The Wave 01 exact vessel model was mathematically sound, but the first learner review exposed avoidable editorial problems:

- internal phrases such as `salt solution component` and `component load` leaked into student text;
- explanations described bookkeeping instead of showing the actual arithmetic;
- some generated answers used needlessly awkward fractions;
- equal-exchange stems did not always state the two starting concentrations even though students naturally expect them;
- distractors included generic numeric perturbations rather than mistakes a student could realistically make;
- technical state keys appeared in the review export;
- the common-concentration-after-equalisation task did not actually require the transfer ledger once equal final concentrations were guaranteed.

V2 fixes the learner surface without changing the exact V1 solver.

## Retained learner candidates

Five Wave 01 candidates remain in CP-006 learner discovery:

1. transfer → mix → return → final ratio;
2. equal amount exchanged simultaneously → unknown amount for equal final concentrations;
3. three-vessel A→B→C→A cycle → final concentration;
4. transfer → refill source with pure water → retransfer → destination ratio;
5. pure-component round trip → final component amounts across two vessels.

The retained set deliberately has no synthetic Easy family. A task that is merely a direct one-step blend belongs to CP-001 rather than being kept in CP-006 to fill a difficulty quota.

## Held candidate

`MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE`

Decision: `HOLD_CP001_WEIGHTED_BLEND_EQUIVALENT`

If the problem already guarantees that the two final concentrations are equal, then

```text
common concentration
= total initial solute / total initial liquid
```

The stated exchange quantity is not required to obtain the answer. That makes the learner task a weighted-combination result rather than a genuine vessel-ledger task. It therefore consumes no CP-006 learner identity at this checkpoint.

## V2 learner policy

### Natural contexts only

Approved Wave 01 English contexts are ordinary exam language such as:

- milk-water mixture;
- alcohol-water mixture;
- salt-water solution;
- acid-water solution;
- source-backed spirit-water and pure milk/pure water cases.

Internal model nouns must never be exposed to students.

### Calculation-first explanations

A visible solution must show three or four short numerical steps. Later transfers must explicitly use the mixture composition after the preceding stage.

Example shape:

```text
1. First transfer: milk = 60% of 12 = 7.2 L; water = 4.8 L.
2. Vessel A now contains ... , so the returned 15 L contains ... .
3. Vessel B finally contains ... milk and ... water.
4. Required ratio = ... : ... = ... .
```

The exact vessel state remains available for QA, but words such as `ledger`, `component load`, `state key`, `snapshot`, and `current fraction` are not part of the learner explanation.

### Arithmetic policy

V2 searches the already-proven V1 exact-state space and keeps calculation-friendly states only. It rejects learner answers with needlessly large ratio parts or awkward percentage/quantity denominators. Simple terminating decimals and familiar small fractions are allowed.

Difficulty must come from changing vessel composition and transfer order, not from arithmetic ugliness.

### Distractor policy

Each wrong option must correspond to a named learner mistake, for example:

- using A's starting percentage for a return transfer after A has changed;
- using B or C's starting percentage for a later stage;
- treating a returned mixture as pure water or pure milk;
- ignoring the refill;
- reversing the requested ratio;
- using half a vessel instead of solving the simultaneous-exchange condition.

Generic `±1`, arbitrary doubling, and similar perturbation distractors are rejected in V2.

## Review/export policy

The human-review file contains only:

- question stem;
- four options;
- answer;
- short calculation-first solution;
- common mistake.

Exact state keys and other engineering metadata stay in machine evidence, not in the learner review.

## Lifecycle

```text
allocationStatus:             UNALLOCATED_OPEN_DISCOVERY
permanent QLs:                0
permanent solve modes:        0
Question Studio discovery:    false
Question Bank writes:         false
test eligibility:             false
public publication:           false
Hindi/Punjabi:                not started
```

Wave 02 source expansion must build on this remediated learner policy rather than the original V1 editorial surface.
