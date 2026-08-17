# SYL-001 — Foundation Implementation Report

Status: **pre-allocation foundation implemented; draft review; zero permanent QLs**.

## Implemented authority

```text
SYL_001_FOUNDATION_PREALLOCATION_V1
```

## Included

- canonical A/E/I/O categorical forms;
- guarded surface forms for `ONLY`, `ARE_ONLY`, `A_FEW`, `ONLY_A_FEW`, `IDENTITY` and unresolved `FEW`;
- frozen `INDIAN_COMPETITIVE_EXAM_SYLLOGISM_V1` foundation profile;
- bounded region model for at most five terms;
- region-constraint satisfiability solver;
- independent finite-witness verifier;
- witness and countermodel conclusion classification;
- solver-agreement gate;
- adversarial foundation proof;
- semantic conflict ledger;
- dedicated GitHub Actions workflow.

## Corrected semantic guarantees

```text
Only A are B  -> All B are A
A are only B  -> All A are B
Only a few A are B -> Some A are B AND Some A are not B
```

`FEW` is rejected until a source-profile decision is frozen.

## Truth profile

Each conclusion is classified through:

```text
canBeTrue / canBeFalse

true / false  -> ENTAILED
false / true  -> CONTRADICTED
true / true   -> UNDETERMINED
```

The primary route and independent verifier must agree on all three values.

## Adversarial proof coverage

- universal existential consequence;
- illicit conversion rejection;
- negative universal subject existence;
- no automatic negative-universal predicate existence;
- correct `only` direction;
- only-a-few overlap and non-overlap witnesses;
- inconsistent premise rejection;
- separate existential witnesses;
- transitive subset consequence;
- unconstrained possibility;
- unresolved `FEW` rejection;
- explicit identity entailment.

## Lifecycle locks

```text
permanentQlCount:           0
questionStudioVisible:      false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
localizationStarted:        false
```

## Next boundary

After foundation review and exact-head CI approval:

```text
feat/syl-cp-001-discovery
SYL_CP001_OPEN_DISCOVERY_V1
```

CP-001 must begin with source saturation and temporary prototypes. Permanent QL allocation remains prohibited until discovery, merge/split, inverse, edge, representation and editorial audits close.
