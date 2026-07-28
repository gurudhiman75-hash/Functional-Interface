# MAL-CP-001 Permanent Allocation Checkpoint

Status: **PERMANENT IDENTITIES ALLOCATED — IMPLEMENTATION PROOF ONLY**

## 1. Authority and boundary

This checkpoint follows the frozen English foundation for:

```text
MAL-CP-001 — Component Blending to or from a Target Mean
```

The foundation discovered and froze seven solve modes and eleven QL-template families without prescribing their counts in advance. This checkpoint assigns permanent identities to those eleven frozen contracts.

Permanent allocation does **not** authorise publication, Question Studio exposure, Question Bank writes, test eligibility, Hindi/Punjabi generation or student routing.

## 2. Permanent range

```text
MAL-QL-001 through MAL-QL-011
```

No earlier `MAL-QL-*` identity exists in the repository. The range is consecutive, collision-free and confined to `MAL-CP-001`.

## 3. Allocation map

| Permanent QL | Frozen template | Solve mode | Prototype allocation | Difficulty |
|---|---|---|---|---|
| `MAL-QL-001` | `MAL-CP001-QLC-TARGET-RATIO` | `MAL-CP001-SM-TARGET-RATIO` | ratio from target | Easy |
| `MAL-QL-002` | `MAL-CP001-QLC-FINAL-MEAN-EXPLICIT-TWO` | `MAL-CP001-SM-FINAL-MEAN` | mean from explicit quantities | Easy |
| `MAL-QL-003` | `MAL-CP001-QLC-FINAL-MEAN-RATIO` | `MAL-CP001-SM-FINAL-MEAN` | mean from ratio | Easy |
| `MAL-QL-004` | `MAL-CP001-QLC-FINAL-MEAN-MULTI-COMPONENT` | `MAL-CP001-SM-FINAL-MEAN` | three-component mean | Medium |
| `MAL-QL-005` | `MAL-CP001-QLC-UNKNOWN-SOURCE-QUANTITY-EVIDENCE` | `MAL-CP001-SM-UNKNOWN-SOURCE-WEIGHTED-BALANCE` | unknown source from explicit quantities | Medium |
| `MAL-QL-006` | `MAL-CP001-QLC-UNKNOWN-SOURCE-RATIO-EVIDENCE` | `MAL-CP001-SM-UNKNOWN-SOURCE-RATIO-EVIDENCE` | unknown source from ratio evidence | Medium |
| `MAL-QL-007` | `MAL-CP001-QLC-UNKNOWN-QUANTITY-ONE-KNOWN` | `MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY` | static missing quantity and must-be-added framing | Medium |
| `MAL-QL-008` | `MAL-CP001-QLC-UNKNOWN-QUANTITY-MULTI-KNOWN` | `MAL-CP001-SM-UNKNOWN-COMPONENT-QUANTITY` | third-component quantity | Hard |
| `MAL-QL-009` | `MAL-CP001-QLC-RATIO-SCALE-BOTH-QUANTITIES` | `MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL` | both quantities from total | Medium |
| `MAL-QL-010` | `MAL-CP001-QLC-RATIO-SCALE-REQUESTED-SHARE` | `MAL-CP001-SM-RATIO-SCALE-FROM-TOTAL` | requested component share | Medium |
| `MAL-QL-011` | `MAL-CP001-QLC-TWO-STAGE-FINAL-MEAN` | `MAL-CP001-SM-TWO-STAGE-FINAL-MEAN` | two-stage final mean | Medium |

Difficulty allocation:

```text
Easy:   3
Medium: 7
Hard:   1
```

Difficulty here is the permanent QL contract band. It does not create additional QLs or split scenario/context variants.

## 4. Runtime implementation

`runMalCp001PermanentPipeline` now:

1. accepts a permanent QL ID and deterministic seed;
2. resolves the frozen template, solve mode and approved prototype allocation;
3. selects a prototype deterministically when one QL owns more than one approved framing;
4. generates through the frozen foundation normaliser;
5. emits the permanent QL identity and complete traceability;
6. preserves exact solver, verifier, reasoning graph, options and explanation evidence;
7. refuses unsupported languages and unknown QL IDs.

`MAL-QL-007` deliberately owns two executable prototypes because static missing quantity and “must be added” wording were frozen as one learner contract. Both are normalised to the QL's frozen inverse task direction.

## 5. Preserved exclusions

The permanent allocation does not admit:

```text
MAL-CP001-PROT-DIFFERENCE-BASED-QUANTITIES
MAL-CP001-PROT-TWO-STAGE-UNKNOWN
MAL-CP001-PROT-THREE-WAY-TARGET-WITH-RELATION
```

It also preserves the three source-gap decisions:

```text
final total mixture quantity output
→ deferred

component-quantity difference output
→ deferred

impossible/indeterminate learner predicate
→ internal validation only
```

## 6. Lifecycle state

```text
permanent identity count:       11
permanent identities frozen:   true
maturity:                       IMPLEMENTATION_PROOF
active QLs:                     0
publiclyPublishable:            false
Question Studio discoverable:  false
Question Bank writable:        false
testEligible:                   false
Hindi/Punjabi:                  unsupported
student/public routing:         disabled
```

## 7. Validation gate

The dedicated stacked workflow must prove:

- frozen foundation regression remains green;
- the permanent range is consecutive and unique;
- all eleven frozen templates are represented exactly once;
- all seven solve modes remain represented;
- all twelve approved prototypes are represented exactly once;
- excluded and deferred prototypes cannot enter the permanent runtime;
- 1,100 permanent-runtime generations and deterministic regenerations pass;
- every package has four unique options, a valid answer index and passing validation;
- the merged `MAL-QL-007` runtime exercises both approved prototype framings;
- all lifecycle exposure flags remain false;
- a 44-question permanent-Ql review pack is exported.

## 8. Next gate

After the implementation-proof audit passes, product review should inspect the 44-question permanent-Ql pack. Only a later release checkpoint may activate English QLs or connect them to Question Studio, Question Bank and tests.
