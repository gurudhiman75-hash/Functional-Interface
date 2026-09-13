# ExamTree Reasoning V1 — OPS-001 Representative Pilot Report

Status: representative runtime pilot passed. Permanent QL allocation remains unfrozen.

## 1. Purpose

This report records the executable proof for the twelve temporary candidate contracts selected after the OPS-001 source, checkpoint and candidate-consolidation audits.

The pilot answers a narrower question than full chapter implementation:

```text
Can every materially different OPS solver topology generate deterministic,
unique, four-option, independently solved questions on the shared foundation?
```

It does not publish `OPS-QL-*` identities or freeze the final chapter size.

## 2. Candidate contracts proved

| Candidate | Checkpoint | Solver topology |
|---|---|---|
| `OPS-CAND-001` | `OPS-CP-001` | supplied mapping then exact evaluation |
| `OPS-CAND-003` | `OPS-CP-001` | map and validate every equation option |
| `OPS-CAND-010` | `OPS-CP-004` | enumerate one missing arithmetic operator |
| `OPS-CAND-012` | `OPS-CP-004` | enumerate ordered operator sequences |
| `OPS-CAND-014` | `OPS-CP-005` | prescribed global operator interchange |
| `OPS-CAND-016` | `OPS-CP-005` | enumerate all operator-pair repairs |
| `OPS-CAND-018` | `OPS-CP-005` | enumerate arithmetic/relation pair repairs and rediscover relation boundary |
| `OPS-CAND-020` | `OPS-CP-006` | enumerate complete-number token swaps |
| `OPS-CAND-023` | `OPS-CP-007` | enumerate global digit-identity swaps |
| `OPS-CAND-026` | `OPS-CP-008` | enumerate operator × whole-number compound pool |
| `OPS-CAND-030` | `OPS-CP-009` | infer a bijective arithmetic mapping from evidence |
| `OPS-CAND-034` | `OPS-CP-009` | infer a mixed arithmetic/relation mapping from evidence |

The IDs above remain design-candidate IDs. They are not permanent content identities.

## 3. Runtime files

```text
pilot/representative-pilots.ts
pilot/representative-pilots.test.ts
```

The existing workflow was expanded to validate both foundation and representative pilots:

```text
.github/workflows/ops-001-foundation-pilot.yml
```

## 4. Generation contract

Every pilot question emits:

- candidate and checkpoint identity;
- deterministic seed;
- task kind and solve mode;
- renderer class;
- exam-style stem;
- exactly four semantic options;
- one null error label on the correct option;
- machine-readable error labels on every distractor;
- shuffled correct position;
- question-specific explanation steps;
- solver route;
- eligible-candidate count;
- one-survivor uniqueness proof;
- semantic fingerprint;
- topology-specific metadata.

No pilot stem or explanation exposes an internal `OPS-CAND-*` identifier.

## 5. Stress run

The test generates:

```text
12 candidates × 200 seeds = 2,400 instances
```

For every instance it requires:

- deterministic regeneration;
- four options;
- four unique option values;
- exactly one correct option;
- correct-index parity;
- non-empty error labels on all distractors;
- one surviving solver candidate;
- non-empty semantic fingerprint;
- non-generic explanation trace;
- no leaked internal candidate ID.

Observed answer-position counts:

```text
index 0: 636
index 1: 551
index 2: 596
index 3: 617
```

Balance ratio:

```text
max / min = 1.1543
required  < 1.2000
```

Result:

```text
DETERMINISTIC_GENERATION          = PASS
FOUR_OPTION_YIELD                 = 100%
SEMANTIC_OPTION_UNIQUENESS        = PASS
ANSWER_POSITION_BALANCE           = PASS
DISTRACTOR_ERROR_LABELS           = PASS
SOLVER_UNIQUENESS_PROOF           = PASS
INTERNAL_ID_LEAKAGE               = 0
RUNTIME_EXCEPTIONS                = 0
```

## 6. GitHub Actions proof

Workflow:

```text
Validate OPS-001 foundation and representative pilots
```

Run:

```text
30186546835
```

Job:

```text
pilot-proof
```

Result:

```text
Strict TypeScript check                    PASS
Exact foundation contract proof            PASS
Stress 12 representative candidate pilots  PASS
Overall workflow conclusion                SUCCESS
```

The workflow runs against the pull-request merge ref, so it proves compatibility with the current PR base rather than only the isolated feature head.

## 7. Topology decisions supported by runtime evidence

### 7.1 Supplied mapping evaluation and equation-option truth remain separate

`OPS-CAND-001` and `OPS-CAND-003` share mapping utilities but differ materially in:

- student action;
- answer semantic;
- option solver route;
- explanation structure;
- ambiguity surface.

Verdict: retain separate candidate contracts.

### 7.2 One missing operator and ordered fill sequence remain separate

`OPS-CAND-010` enumerates a four-member single-position domain. `OPS-CAND-012` enumerates ordered sequences and must prove uniqueness over the complete Cartesian product.

Verdict: retain separate.

### 7.3 Prescribed, inferred and relation-moving interchanges remain separate

The three CP-005 pilots prove different contracts:

- prescribed transformation and numeric evaluation;
- inverse search over arithmetic pairs;
- inverse search where `=` may move and the transformed token stream must be reparsed.

Verdict: retain all three topologies separately.

### 7.4 Whole-number and digit interchange split is validated

The CP-006 and CP-007 pilots require different identity domains:

```text
whole number: replace complete numeric tokens
digit: rebuild every affected numeric literal
```

Digit questions additionally require leading-zero rejection.

Verdict: keep separate checkpoints.

### 7.5 Compound transformation requires its own ambiguity pool

`OPS-CAND-026` verifies every operator-pair × number-pair combination from the original equation. It rejects candidates unless the complete compound pool has exactly one survivor.

Verdict: retain compound transformation as a separate checkpoint family.

### 7.6 Hidden arithmetic and hidden mixed-relation inference remain separate

Mixed inference changes the candidate mapping domain and requires relation-boundary validation after mapping.

Verdict: retain separate candidate contracts.

## 8. Quality limitations deliberately retained

The representative pilots prove runtime topology, not finished editorial breadth.

Current limits:

- English runtime wording only;
- finite curated blueprint pools for some prescribed tasks;
- no permanent QL registry;
- no full candidate-to-QL allocation;
- no production discovery or Question Studio wiring;
- no mobile-width export audit;
- no chapter-wide stem diversity audit;
- no final Hindi/Punjabi renderer proof.

These limits are intentional. A pilot candidate must not silently become production content.

## 9. Gate verdicts

```text
FOUNDATION_RUNTIME                         = PASS
12_REPRESENTATIVE_CANDIDATE_PILOTS        = PASS
SEEDED_GENERATION                          = PASS
FOUR_OPTION_YIELD                          = PASS
DISTRACTOR_ERROR_MODEL_PROOF               = PASS
COMPLETE_POOL_UNIQUENESS                   = PASS
ANSWER_POSITION_BALANCE                    = PASS
STRICT_TYPESCRIPT_AND_RUNTIME_CI           = PASS
CHECKPOINT_TOPOLOGY_RUNTIME_SUPPORT        = PASS
HI_PA_RUNTIME_RENDERING                    = NEXT
FINAL_34_CANDIDATE_MERGE_AUDIT             = PARTIAL
PERMANENT_QL_MANIFEST                      = BLOCKED
PRODUCTION_WIRING                          = BLOCKED
```

## 10. Next stage

1. add structured Hindi and Punjabi rendering for the twelve representative pilots;
2. prove answer, option, seed and difficulty parity across all three locales;
3. run mobile-width and glyph-safety audits;
4. use renderer evidence to resolve the remaining merge-sensitive candidate pairs;
5. only after the final gap audit, freeze permanent QL IDs and ranges.
