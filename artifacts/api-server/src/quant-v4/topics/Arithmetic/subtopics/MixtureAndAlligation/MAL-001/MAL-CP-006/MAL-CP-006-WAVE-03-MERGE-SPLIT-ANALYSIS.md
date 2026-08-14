# MAL-CP-006 Wave 03 — Merge / Split Analysis

Status: **open discovery analysis only**  
Permanent QLs: **0**  
Permanent solve modes: **0**  
Activation: **off**

## Decision rule

A learner identity is not created by a new liquid name, container noun, stem paraphrase or number set. The MAL-001 design requires identity to be justified by material differences in task direction, unknown variable, answer semantic, required evidence, state topology or learner reasoning.

Wave 03 therefore compares the five retained Wave 01 learner candidates and the two approved Wave 02 candidates on those dimensions.

## Result

**All seven candidates remain distinct. No merge and no further split is justified at this gate.**

| Candidate | Direction | State topology | Requested answer | Decision |
|---|---|---|---|---|
| Transfer-return final ratio | Forward | Sequential two-vessel transfer-return | Final within-vessel component ratio | Retain distinct |
| Equal exchange amount | Inverse | Simultaneous two-vessel equal exchange | Transfer quantity | Retain distinct |
| Three-vessel cycle | Forward | Sequential three-vessel cycle | Final concentration | Retain distinct |
| Transfer-refill-retransfer | Forward | Two-vessel transfer + pure refill + retransfer | Final destination ratio | Retain distinct |
| Round-trip cross-vessel ratio | Forward | Sequential two-vessel transfer-return | Cross-vessel component ratio | Retain distinct |
| Inverse transfer-return target ratio | Inverse | Sequential two-vessel transfer-return | Transfer quantity | Retain distinct |
| Changed-source linear chain | Hybrid inverse then forward | Sequential three-vessel linear chain | Final remaining component quantity | Retain distinct |

## Collision review

### 1. Transfer-return final ratio vs round-trip cross-vessel ratio

These share the same broad two-vessel sequential round-trip skeleton. They should still not merge because the requested evidence is different:

- the first asks for the final ratio **inside one vessel**;
- the second asks for a ratio between component amounts located in **different final vessels**.

The answer semantic and final projection are therefore materially different even though the transfer ledger can share implementation machinery.

### 2. Forward round-trip families vs inverse transfer-return

The inverse family shares the same broad transfer-return state transition, but it reverses the task:

- forward families are given transfer quantities and reconstruct a final state;
- the inverse family is given a target final ratio and solves the transfer quantity.

Task direction, unknown variable, equation structure and answer semantic all change. It remains a separate learner identity.

### 3. Three-vessel cycle vs changed-source linear chain

Both require current-source sampling across three vessels, but their contracts are not duplicates:

- cycle: known transfers, closed A-B-C-A progression, final concentration target;
- linear chain: A-B-C progression, infer `x` from C's ratio, then compute the component remaining in B.

The second family combines an inverse constraint with a forward ledger and has a different requested semantic.

### 4. Transfer-return final ratio vs transfer-refill-retransfer

Both can finish with a destination ratio, but the refill family has an additional state transition: the source is changed by adding a pure component before the second transfer. That changes the decisive invariant and learner reasoning, so it should not be folded into ordinary transfer-return.

### 5. Equal exchange vs inverse transfer-return

Both may ask for an unknown transfer quantity, but the mathematics is different:

- equal exchange is simultaneous and uses the equal-concentration exchange invariant;
- inverse transfer-return is sequential and the return sample comes from a changed source.

They should share neither QL identity nor learner solution contract.

## No-split findings

No candidate should be split merely because of:

- milk-water versus fuel/oil/solution contexts;
- vessel/container/tank/drum wording;
- stem-structure variants;
- different numerical states;
- which compatible vessel is named first;
- ordinary changes in stage count that preserve the same requested task and reasoning contract.

These belong to variable, object and language diversity inside one identity.

## Generalisation gaps before permanent allocation

Two gaps remain, but neither creates a new QL at present.

1. **Inverse transfer-return:** the approved generator emphasizes equal out-and-back quantities. Supporting bank evidence also contains a known first transfer followed by a different unknown return amount. This should be generalized **inside the inverse identity**, then re-audited.
2. **Forward transfer-return:** direct evidence includes both two-leg and longer alternating transfer-return sequences. Longer stage counts should be treated as **within-identity depth** when the answer semantic remains the same, not as automatic new QLs.

## Boundary decisions retained

- The held `FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE` candidate remains a **CP001 weighted-blend equivalent** and does not re-enter CP006.
- A multi-vessel story that telescopes to a single static weighted blend remains CP001.
- One-vessel repeated remove/refill remains CP003.
- One-vessel dilution/strengthening remains CP004.
- Alligation cross is not a CP006 core solve mode.

## Provisional solve-mode clustering

This analysis does **not** freeze solve modes, but implementation reuse appears naturally grouped as:

1. sequential current-composition ledger — forward families;
2. target-constraint + sequential ledger — inverse/hybrid families;
3. simultaneous equal-exchange invariant — equalisation family.

QL identity should not be collapsed merely because two families can reuse the same ledger engine.

## Wave 03 conclusion

```text
retained learner identities: 7
merge recommendations:       0
split recommendations:       0
held CP001 boundary:          1
permanent QLs:                0
permanent solve modes:        0
Question Studio:              off
Question Bank:                off
test/public:                  off
```

Next gate after this analysis: generalise the two within-identity coverage gaps, rerun exact learner audits, then prepare a permanent-allocation proposal for explicit approval. No permanent allocation is authorized by this document.
