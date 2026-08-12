# MAL-CP-005 Wave 05 — Permanent English Release

## Decision

The 13 frozen permanent MAL-CP-005 identities are promoted into an English release layer.

```text
release ID:                    MAL-CP005-EN-v1
runtime ID:                    MAL-CP005-EN-PERMANENT-RUNTIME-V1
permanent QL range:            MAL-QL-048..MAL-QL-060
permanent learner QLs:         13
permanent task solve modes:    13
shared mathematical cores:     3
Easy QLs:                      MAL-QL-048..049
Medium QLs:                    MAL-QL-050..060
Hard QLs:                      none
language:                      English only
```

The frozen Wave 04 allocation remains the identity authority. Wave 05 adds the active delivery wrapper; it does not renumber or redefine any permanent QL.

## Delivery authorization

The English release layer sets:

```text
active:                     true
questionStudioDiscoverable: true
questionBankWritable:       true
testEligible:               true
publiclyPublishable:        true
```

Hindi and Punjabi are explicitly excluded and remain unavailable until separate localisation/parity work is authorized and audited.

## Runtime routing

- `MAL-QL-048..059` wrap the 12 product-approved Exam-Ready V2 task contracts.
- `MAL-QL-060` wraps the separately product-approved price-change/profit-amount contract.
- all 13 retain their permanent solve-mode IDs and normalized source evidence from Wave 04.
- the Question Studio adapter now exposes `MAL-CP-005` and routes explicit or difficulty-filtered requests to the permanent English runtime.

## Difficulty policy

The source runtime already fixes the first two direct free-adulterant tasks as Easy and the remaining task contracts as Medium. Wave 05 preserves that authority exactly:

```text
MAL-QL-048  Easy
MAL-QL-049  Easy
MAL-QL-050  Medium
...
MAL-QL-060  Medium
```

No synthetic Hard QL is introduced merely for coverage symmetry.

## Terminology policy

Learner-facing text must use **cost price** when the original per-unit CP is meant.

The release layer rejects the phrases `buying rate` and `purchase rate` for that meaning. Normal transaction wording such as `buys milk at ₹40 per litre` remains valid.

This policy is audited across every generated release question, not only the price-change contract.

## Ownership boundaries retained

Wave 05 does not absorb neighboring families:

- neutral paid-blend reconstruction remains `MAL-CP-001`;
- repeated replacement remains `MAL-CP-003`;
- false weight, false measure and short delivery remain `PNL-CP-005`;
- unsupported target-loss and broad markup/discount symmetry remain outside the permanent CP-005 set.

## Release audit

The dedicated Wave 05 CI generates 100 deterministic questions for each of the 13 QLs and proves:

- permanent QL and solve-mode routing;
- source product approval;
- source validation/equivalence preservation;
- active English lifecycle flags;
- cost-price terminology;
- option/answer integrity;
- Question Studio explicit routing;
- Easy/Medium filtering;
- Hard blocking;
- Hindi/Punjabi blocking.

A 52-question review export (four questions per QL) is produced as release evidence.

## Lifecycle boundary

This branch/PR is the **English release candidate**. The code deliberately contains active delivery flags because the product owner authorized the activation/release implementation gate.

Merging the release candidate into `New-main` remains a separate explicit merge gate. Until merge, the active runtime is not part of the production base branch.
