# PNL-CP-001 Dynamic Runtime Checkpoint

Status: **IMPLEMENTED — CI VALIDATION PENDING**

## Scope

This checkpoint promotes the 36 frozen English QLs in `PNL-CP-001` from static canonical review to a true seeded dynamic-candidate pipeline.

Implemented layers:

- QL-addressable deterministic parameter generation;
- direct and reverse fundamental price relations across all 18 solve modes;
- exact canonical solving;
- independent exact verification;
- Editorial V2 stem and explanation binding;
- answer-semantic formatting for money, percentage, ratio, fraction and no-change answers;
- four unique misconception-labelled options;
- deterministic option ordering;
- dynamic package emission with full traceability;
- explicit Question Bank, test and publication safety.

## Frozen range

```text
PNL-QL-001 through PNL-QL-036
QL count: 36
Canonical problem: PNL-CP-001
Language: English
Runtime mode: DYNAMIC_CANDIDATE
```

## Proof gate

The dedicated runtime proof generates every QL across 24 deterministic seeds:

```text
36 QLs × 24 seeds = 864 generated packages
```

It checks:

- exact deterministic regeneration;
- four unique options and one keyed answer;
- independent-verifier agreement;
- no unresolved placeholders;
- value-specific explanations;
- seed diversity per QL;
- difficulty-band selection;
- unsupported-language rejection;
- publication safety.

## Safety boundary

Until manual review and later release gates are completed, every generated package remains:

```text
reviewStatus: UNREVIEWED_DYNAMIC_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```

Shared Question Studio routing remains on the already merged canonical-review runtime during this proof checkpoint. Dynamic routing must be enabled only after the dedicated CI proof is green and the generated review export is manually inspected.
