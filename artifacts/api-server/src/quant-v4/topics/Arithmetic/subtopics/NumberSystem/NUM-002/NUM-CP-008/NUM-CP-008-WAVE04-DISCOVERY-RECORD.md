# NUM-CP-008 Wave 04 — Final Material Gap Discovery Record

**Checkpoint:** `NUM-CP-008 — Modular Arithmetic and Simultaneous Congruences`  
**Basis:** post-Wave-03 gap audit  
**Temporary prototypes added:** 2  
**Permanent QLs:** 0  
**Next available Number System identity:** `NUM-QL-166`

## Why this wave has two prototypes

Wave 04 is intentionally need-based. The post-Wave-03 audit rejected an arbitrary eight-family expansion and found only two materially distinct ordinary learner targets not already represented by `PROT-001..024`.

## `NUM-CP008-PROT-025` — bounded system solution multiplicity

Classifies a simultaneous modular system within a stated interval as:

- no solution;
- exactly one solution;
- more than one solution.

Canonical route:
- merge compatible congruences into one residue class and period;
- project that class into the interval;
- classify the resulting bounded count.

Independent verifier:
- enumerate every integer in the interval;
- directly test every displayed congruence;
- classify the direct solution count.

The generator explicitly produces incompatible, exactly-one and multiple-solution states.

## `NUM-CP008-PROT-026` — complete bounded set for a compatible triple system

Returns the complete set of bounded integers satisfying three compatible congruences.

Canonical route:
- generalized CRT merge;
- residue-period projection into the interval.

Independent verifier:
- direct bounded enumeration under all three displayed conditions.

This stays separate from `PROT-024`, whose learner target is the count rather than the complete set.

## Required executable proof

The authority gate covers `2 × 120 = 240` deterministic packages and requires:

- deterministic replay;
- canonical/verifier equality;
- four distinct options with exactly one correct answer;
- all four answer positions for both prototypes;
- at least two genuine difficulty bands per prototype;
- broad mathematical-fingerprint diversity;
- all three bounded multiplicity classes for P025;
- complete-set equality against direct enumeration for every P026 state;
- lifecycle locks on every package.

The workflow also reruns Wave 01, Wave 02, Wave 03 and the post-Wave-03 gap audit.

## Advanced theorem disposition remains unchanged

Wave 04 does not promote direct modular inverse, unrestricted symbolic/general CRT, Fermat/Euler reduction or Wilson theorem merely to enlarge the bank. Those remain explicit source/enrichment holds pending material exam-source evidence.

## Lifecycle

```text
permanentQlId: null
maturity: EXECUTABLE_DISCOVERY_PROOF
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```

After Wave 04 passes direct learner review, the next gate is the final source-fixture recheck, CP007/CP009 anti-duplication audit and ID-free merge/split proposal across `PROT-001..026`.
