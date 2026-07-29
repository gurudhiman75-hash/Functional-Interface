# NUM-CP-003 — Permanent Allocation Checkpoint

**Status:** product-owner approved; inactive implementation proof  
**Permanent range:** `NUM-QL-001..NUM-QL-017`  
**Frozen learner families:** 17  
**Frozen solve modes:** 7  
**Active QLs:** 0

## Allocation map

| Permanent QL | Frozen QL-template family | Retained ancestry | Solve mode |
|---|---|---|---|
| `NUM-QL-001` | divisor/non-divisor selection | `NUM-CP003-QLT2-01` | apply divisibility rule |
| `NUM-QL-002` | unique missing digit | `NUM-CP003-QLT2-02` | resolve single-digit candidate set |
| `NUM-QL-003` | extremum valid digit | `NUM-CP003-QLT2-03` | resolve single-digit candidate set |
| `NUM-QL-004` | valid-digit count | `NUM-CP003-QLT2-04` | resolve single-digit candidate set |
| `NUM-QL-005` | valid-digit sum | `NUM-CP003-QLT2-05` | resolve single-digit candidate set |
| `NUM-QL-006` | complete valid-digit set | `NUM-CP003-QLT2-06` | resolve single-digit candidate set |
| `NUM-QL-007` | extremum completed number | `NUM-CP003-QLT2-07` | resolve single-digit candidate set |
| `NUM-QL-008` | unique ordered digit pair | `NUM-CP003-QLT2-08` | resolve ordered-pair candidate set |
| `NUM-QL-009` | ordered-pair count | `NUM-CP003-QLT2-09` | resolve ordered-pair candidate set |
| `NUM-QL-010` | complete ordered-pair set | `NUM-CP003-QLT2-10` | resolve ordered-pair candidate set |
| `NUM-QL-011` | ordered-pair solution class | `NUM-CP003-QLT2-11` | resolve ordered-pair candidate set |
| `NUM-QL-012` | extremum n-digit multiple | `NUM-CP003-QLT2-12` | find digit-bound multiple |
| `NUM-QL-013` | one-divisor inclusive-range count | `NUM-CP003-QLT2-13` | count one-divisor range |
| `NUM-QL-014` | implicit repeated-numeral divisibility | `NUM-CP003-QLT2-14` | test implicit repeated numeral |
| `NUM-QL-015` | linked arithmetic/divisibility extremum | `NUM-CP003-QLT2-15` | resolve linked arithmetic and divisibility |
| `NUM-QL-016` | missing-digit data sufficiency | `NUM-CP003-QLT2-16` | resolve single-digit candidate set |
| `NUM-QL-017` | divisibility claim verification | `NUM-CP003-QLT2-17` | apply divisibility rule |

## Permanent runtime contract

`runNumCp003PermanentPipeline` accepts:

```text
questionLanguageId: NUM-QL-001..NUM-QL-017
seed:               deterministic string
language:           en only
```

It resolves the approved permanent allocation, invokes the consolidated retained mathematical authority, independently verifies the answer and returns permanent traceability without changing the learner-facing or mathematical package.

The permanent wrapper must preserve exact parity for:

- stem;
- answer and correct option index;
- option order and misconception metadata;
- hidden mathematical state;
- difficulty derived from the generated state;
- explanation and reasoning graph;
- mathematical fingerprint;
- canonical and independent verification.

Only permanent identity, traceability and inactive implementation-proof metadata may differ from the retained package.

## Proof requirements

The allocation workflow must establish:

```text
17 permanent QLs
17 frozen QL-template families
7 frozen solve modes
continuous identities NUM-QL-001..NUM-QL-017
unique permanent and ancestry mappings
17 × 100 deterministic permanent packages
retained/permanent learner-surface equality
all answer positions per QL
Easy, Medium and Hard reach
source and prototype ancestry on every row
unknown-QL rejection
non-English rejection
zero active/public/delivery exposure
```

## Safety contract

Permanent allocation is not activation. Every allocation and generated package remains:

```text
active:                       false
questionBankStatus:           NOT_STORED
questionBankWritable:         false
testEligibility:              INELIGIBLE
testEligible:                 false
questionStudioDiscoverable:   false
publiclyPublishable:          false
```

The next unused Number System identity after this checkpoint is `NUM-QL-018`.
