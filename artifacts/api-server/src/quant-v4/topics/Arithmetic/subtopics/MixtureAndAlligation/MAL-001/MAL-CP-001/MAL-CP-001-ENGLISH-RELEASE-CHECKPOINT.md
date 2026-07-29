# MAL-CP-001 English Release Checkpoint

Status: **ENGLISH RELEASE IMPLEMENTED — EXACT-HEAD CI REQUIRED**

## 1. Scope

```text
Package:             MAL-001
Checkpoint:          MAL-CP-001
Permanent QLs:       MAL-QL-001..MAL-QL-011
English release ID:  MAL-CP001-EN-v1
```

This checkpoint completes the first English release of standard alligation and basic component-blending questions. It does not add or remove a QL, solve mode or approved prototype.

## 2. Review authority

The 44-row permanent review pack was re-generated through the release runtime and approved through:

```text
GROUPED_MANUAL_AND_EXECUTABLE_AUDIT_UNDER_PRODUCT_OWNER_DIRECTIVE
```

The approval records the review completed under the product-owner instruction to finish MAL-CP-001. It does not claim that the product owner personally performed a separate row-by-row review of all 44 rows.

## 3. Released learner surface

Every released question preserves the frozen exact solver and permanent identity while adding:

- the `MAL-CP001-EN-SIMPLE-TEACHER-V1` explanation authority;
- numbered, expanded calculations;
- a core concept and formula section;
- a 10-second exam shortcut;
- a misconception-linked trap warning;
- clear Indian-rupee and unit formatting;
- four unique options with the answer tied to the correct option;
- release traceability and validation checks.

## 4. Delivery state

```text
maturity:                       FROZEN
release status:                 APPROVED
active QLs:                     11
publiclyPublishable:            true
Question Studio discoverable:  true
Question Bank writable:        true
testEligible:                   true
runtime mode:                   RELEASED
review status:                  APPROVED_EDITORIAL_ENGLISH
language:                       English only
Hindi/Punjabi:                  excluded from this release
```

The implementation-proof pipeline remains inactive and unchanged. Only `runMalCp001EnglishReleasePipeline` may produce delivery-eligible packages.

## 5. Question Studio routing

`MAL-001` is registered in the Quant V4 Question Studio entry point with:

```text
Topic:                 Arithmetic
Subtopic:              Mixture & Alligation
Canonical problem:     MAL-CP-001
Difficulties:          Easy, Medium, Hard
Languages:             English
Explicit QL selection: supported
Batch generation:      supported
```

Question Studio generation routes through the released runtime, not through the inactive implementation-proof runtime.

## 6. Preserved exclusions

The release cannot select:

```text
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

These outputs remain deferred or internal-only:

```text
final total mixture quantity output
item-quantity difference output
impossible/indeterminate alligation predicate
```

## 7. Required exact-head gate

The release workflow must prove:

- the frozen foundation still passes;
- permanent allocation and teacher-language audits still pass;
- 1,100 released generations and deterministic regenerations pass;
- the release does not alter solver, options, answer index, fingerprint or reasoning graph;
- all 11 QLs are active only through the release wrapper;
- all release validation checks pass;
- the approved 44-row pack contains 44 distinct stems;
- Question Studio discovers `MAL-001`;
- all 11 QLs generate through Question Studio;
- difficulty and explicit QL filters work;
- English packages are publishable, writable and test eligible;
- Hindi, unknown CPs and unknown QLs are rejected.

## 8. Completion boundary

After exact-head CI passes and the stacked PR chain is settled, MAL-CP-001 is complete for its first English release. Hindi and Punjabi remain separate language projects and do not block this English completion.
