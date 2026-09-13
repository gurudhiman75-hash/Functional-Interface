# ExamTree Reasoning V1 — OPS-001 All-Candidate Runtime Report

Status: all 34 pre-merge candidate contracts have executable English runtime proof. Permanent QL allocation remains unfrozen.

## 1. Scope

The OPS-001 candidate-consolidation audit retained 34 temporary contracts for runtime evaluation. The pilot layer now implements every one of those contracts without assigning permanent `OPS-QL-*` identities.

The three pilot registries are:

```text
pilot/representative-pilots.ts       OPS-CAND-001 etc. 12 candidates
pilot/supplementary-pilots.ts        CP-001 to CP-005 supplements, 12 candidates
pilot/final-candidate-pilots.ts      CP-006 to CP-009 supplements, 10 candidates
```

The combined registry is asserted to equal the continuous set:

```text
OPS-CAND-001 through OPS-CAND-034
```

No candidate ID is missing or duplicated.

## 2. Runtime coverage totals

```text
Representative layer: 12 × 200 seeds = 2,400 instances
Supplementary layer:  12 × 150 seeds = 1,800 instances
Final layer:          10 × 150 seeds = 1,500 instances

Total English runtime proof            = 5,700 instances
```

All candidate layers require:

- deterministic regeneration by candidate and seed;
- exactly four option values;
- semantic option uniqueness;
- exactly one option with a null error label;
- correct-index parity with the answer;
- machine-readable error labels on all distractors;
- one-survivor solver proof;
- non-empty semantic fingerprint;
- candidate-specific explanation trace;
- no internal candidate identifier in student wording;
- balanced answer positions within the configured ratio.

## 3. Checkpoint coverage

| Checkpoint | Runtime-proved candidate range |
|---|---|
| `OPS-CP-001` | 001–003 |
| `OPS-CP-002` | 004–007 |
| `OPS-CP-003` | 008–009 |
| `OPS-CP-004` | 010–013 |
| `OPS-CP-005` | 014–019 |
| `OPS-CP-006` | 020–022 |
| `OPS-CP-007` | 023–025 |
| `OPS-CP-008` | 026–029 |
| `OPS-CP-009` | 030–034 |

Every checkpoint in the nine-checkpoint ownership model has executable forward and/or inverse proof appropriate to its scope.

## 4. Additional runtime findings

### 4.1 Unicode word operators are now foundation-supported

The tokenizer was expanded from ASCII word tokens to Unicode letter-and-mark clusters.

Direct executable proofs include:

```text
4 गुणा 3 जोड़ 2 = 14
4 ਗੁਣਾ 3 ਜੋੜ 2 = 14
```

This resolves the previous foundation blocker for `OPS-CAND-005` language-adapted word operators.

### 4.2 Double-pair inverse search excludes simpler repairs

`OPS-CAND-017` enumerates:

- all three disjoint pairings of the four arithmetic operators;
- all six simpler single-pair interchanges.

An accepted instance requires:

```text
exactly one valid double pairing
zero valid single-pair repairs
```

This proves that the two-pair answer is necessary rather than merely one working option.

### 4.3 Operator-plus-digit repair uses the complete compound pool

`OPS-CAND-027` enumerates every eligible:

```text
operator pair × digit pair
```

for the original displayed equation. Each digit transformation rebuilds every affected numeral and rejects leading-zero literals. Accepted instances have exactly one compound survivor.

### 4.4 Prescribed and inferred query forms are independently represented

The runtime now proves all major query topologies:

- evaluate after supplied transformation;
- recover a missing result;
- select a true equation;
- recover a missing arithmetic or relation token;
- fill an ordered sequence;
- infer one or two swap pairs;
- infer compound operator-number or operator-digit swaps;
- infer a hidden mapping;
- recover one mapping component.

## 5. CI proof

Workflow:

```text
Validate OPS-001 foundation, all candidates and localization
```

Successful all-candidate run:

```text
Run ID: 30187597401
```

Passed steps:

```text
Strict TypeScript check                                  PASS
Exact foundation contract proof                          PASS
12 representative candidates / 2,400 instances          PASS
12 supplementary CP001-CP005 / 1,800 instances          PASS
10 final candidates / 1,500 instances                    PASS
continuous 34-candidate registry assertion               PASS
Hindi and Punjabi representative answer parity           PASS
```

The run executes against the pull-request merge ref.

## 6. Runtime gate verdicts

```text
EXACT_FOUNDATION                         = PASS
ALL_NINE_CHECKPOINTS                     = PASS
ALL_34_PREMERGE_CANDIDATES               = PASS
CONTINUOUS_CANDIDATE_ID_COVERAGE         = PASS
DETERMINISTIC_ENGLISH_GENERATION         = PASS
FOUR_OPTION_YIELD                        = PASS
COMPLETE_POOL_UNIQUENESS                 = PASS
UNICODE_WORD_OPERATOR_FOUNDATION         = PASS
STRICT_TYPESCRIPT                        = PASS
RUNTIME_EXCEPTIONS                       = 0
```

## 7. What this does not yet freeze

The all-candidate proof does not mean that all 34 contracts should receive permanent QL IDs.

Runtime evidence must now be used to merge contracts that differ only by result-slot presentation. The following remain explicit merge probes:

```text
OPS-CAND-002 with OPS-CAND-001
OPS-CAND-006 with OPS-CAND-004
OPS-CAND-031 with OPS-CAND-030
```

Full Hindi/Punjabi rendering, device-level visual review and final gap audit remain required before permanent allocation.
