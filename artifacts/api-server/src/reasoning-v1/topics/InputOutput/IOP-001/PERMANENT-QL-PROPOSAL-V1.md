# IOP-001 — Permanent QL Proposal V1

Status: **PROPOSAL ONLY — NOT ALLOCATED / NOT FROZEN**

Date: 2026-08-17

Authority: `CHECKPOINT-C-SOURCE-SATURATION-V1.md` plus executable CP001–CP010 discovery and the source-backed CP008 mixed transformation gap.

## Allocation rule

Permanent QLs represent materially different learner reasoning contracts. They do **not** represent:

- every ascending/descending parameter;
- every left/right placement parameter;
- every child-question wording;
- every reverse/missing-step query;
- every executable synthetic pipeline.

## Proposed inventory

| Proposed QL | CP | Permanent reasoning contract | Discovery/runtime authority | Disposition |
|---|---|---|---|---|
| `IOP-QL-001` | CP001 | One-sided alphabetical word rearrangement | CP001 word prototypes | PROPOSE |
| `IOP-QL-002` | CP001 | One-sided numeric rearrangement | CP001 numeric prototype | PROPOSE |
| `IOP-QL-003` | CP002 | Mixed blocked-category word-number rearrangement | CP002 prototypes merged | PROPOSE |
| `IOP-QL-004` | CP003 | Pure-number simultaneous double-ended rearrangement | CP003 numeric min/max prototype | PROPOSE |
| `IOP-QL-005` | CP003 | Mixed word-number simultaneous double-ended rearrangement | CP003 mixed prototypes merged | PROPOSE |
| `IOP-QL-006` | CP004 | Alternating mixed word-number rearrangement | CP004 mixed prototypes merged | PROPOSE |
| `IOP-QL-007` | CP005 | Word attribute-based rearrangement | word-length authority; future source-backed keys become modes only when semantically equivalent | PROPOSE |
| `IOP-QL-008` | CP005 | Number attribute-based rearrangement | digit-sum authority | PROPOSE |
| `IOP-QL-009` | CP006 | Numeric operation pipeline | CP006 engine + source-whitelisted operations | PROPOSE, exact transform whitelist required before English freeze |
| `IOP-QL-010` | CP007 | Word transformation pipeline | CP007 word authorities merged | PROPOSE |
| `IOP-QL-011` | CP007 | Alphanumeric transformation pipeline | CP007 alphanumeric authority | PROPOSE |
| `IOP-QL-012` | CP008 | Mixed word-number transformed-pair machine | `IOP-CP008-GAP-PROT-001`, RBI Grade B 2024 source family | PROPOSE |
| `IOP-QL-013` | CP009 | Box/table arithmetic machine | CP009 topology engine | PROPOSE, exact operation whitelist required before English freeze |

Proposed total: **13 permanent machine QLs**.

## Explicit non-QL solve modes

These attach to compatible machine QLs instead of receiving separate permanent IDs:

- `STEP_OUTPUT`
- `FINAL_OUTPUT`
- `ELEMENT_AT_POSITION`
- `POSITION_OF_ELEMENT`
- `STEP_NUMBER`
- `PREVIOUS_STEP`
- `MISSING_STEP`
- `REMAINING_STEP_COUNT`

Future source-backed modes may include relative-position, adjacency and valid/invalid-state questions without increasing the machine QL count unless the required reasoning contract materially changes.

## Quarantined discovery probes

The following executable capabilities are **not production authorities by themselves**:

- pure-number alternating min/max CP004 probe without direct normalized source evidence;
- vowel-count ordering as an independent V1 authority;
- arbitrary CP006 transform chains not on the source whitelist;
- homogeneous CP008 transform combinations that are not independently source-normalized;
- CP009 `sum + absolute-difference` pair rewrites and their exact synthetic pipelines until directly source-matched;
- CP010 machine duplicates used only to exercise reverse/missing-state query mechanics.

They remain useful for engine testing but cannot be selected for production generation merely because they pass deterministic proof.

## Freeze blockers

Permanent allocation is blocked until all are true:

```text
CP001-CP004 foundation regression: PASS
CP005-CP010 advanced proof:        PASS
CP008 mixed source gap proof:      PASS
strict TypeScript:                 PASS
production API build:              PASS
source saturation closure:         PASS
New-main drift/overlap review:     PASS
```

Even after allocation, English content freeze remains a separate later gate requiring learner-facing question review and source-whitelisted operation sets for `IOP-QL-009` and `IOP-QL-013`.

## Product lifecycle

```text
permanentQlCount:            0   # until proposal is formally allocated
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```
