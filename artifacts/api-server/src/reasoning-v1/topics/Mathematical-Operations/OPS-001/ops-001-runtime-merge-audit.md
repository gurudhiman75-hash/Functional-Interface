# ExamTree Reasoning V1 — OPS-001 Runtime Merge Audit

Status: runtime-supported candidate consolidation. Permanent QL IDs and ranges are not assigned by this document.

## 1. Purpose

The source and design audits produced 34 candidate contracts. All 34 now have executable runtime proof. This audit uses that evidence to decide which candidates represent distinct Question Logic contracts and which are presentation variants of the same contract.

A merge is allowed only when the two candidates share:

- the same transformation family;
- the same student reasoning operation;
- the same answer semantic;
- the same ambiguity pool;
- the same independent solver route;
- the same distractor architecture;
- the same localisation mode;
- no materially different explanation proof.

A different sentence shape alone is not enough to retain a separate QL.

## 2. Merge decision: candidate 002 into candidate 001

```text
OPS-CAND-001  evaluateAfterGivenArithmeticSignMapping
OPS-CAND-002  recoverMissingResultAfterGivenArithmeticMapping
```

Runtime comparison:

| Dimension | 001 | 002 |
|---|---|---|
| transformation | supplied arithmetic-sign mapping | same |
| solver | map, parse, exact evaluate | same |
| answer semantic | integer/rational value | same |
| ambiguity pool | supplied mapping evaluation | same |
| distractors | numeric transformation/precedence errors | same |
| locale mode | translatable | same |
| difference | direct question | result blank after `=` |

The missing-result slot does not require equation-side inference. It merely renders the already calculated target value after an equality marker.

Decision:

```text
MERGE OPS-CAND-002 INTO OPS-CAND-001
```

Required retained metadata:

```text
queryPresentation:
  DIRECT_VALUE
  MISSING_RESULT_SLOT
```

## 3. Merge decision: candidate 006 into candidate 004

```text
OPS-CAND-004  evaluateAfterGivenArbitraryTokenMapping
OPS-CAND-006  recoverMissingResultAfterArbitraryTokenMapping
```

Runtime comparison is identical to the 001/002 pair except that the display tokens are arbitrary language-neutral tokens.

Both candidates use:

```text
arbitrary-token mapping
  -> transformed arithmetic expression
  -> exact evaluator
  -> numeric answer
```

The result blank introduces no new ambiguity or solver topology.

Decision:

```text
MERGE OPS-CAND-006 INTO OPS-CAND-004
```

Required retained metadata:

```text
queryPresentation:
  DIRECT_VALUE
  MISSING_RESULT_SLOT
```

## 4. Merge decision: candidate 031 into candidate 030

```text
OPS-CAND-030  inferArithmeticOperatorMappingThenEvaluateTarget
OPS-CAND-031  inferOperatorMappingThenRecoverMissingResult
```

Both candidates:

1. enumerate the same hidden mapping domain;
2. require the same evidence sufficiency and mapping uniqueness proof;
3. apply the same surviving mapping to the same target expression;
4. return the same numeric answer semantic;
5. use the same error-model distractors.

The only difference is whether the target is introduced as “evaluate” or displayed with a blank result.

Decision:

```text
MERGE OPS-CAND-031 INTO OPS-CAND-030
```

Required retained metadata:

```text
queryPresentation:
  DIRECT_VALUE
  MISSING_RESULT_SLOT
```

## 5. Retain candidate 005 separately from candidate 004

```text
OPS-CAND-004  language-neutral arbitrary tokens
OPS-CAND-005  language-adapted word tokens
```

The arithmetic solver is shared, but the content contracts are materially different:

- word token boundaries are language-dependent;
- English, Hindi and Punjabi require different operator lexicons;
- Unicode script handling is mandatory;
- the token dictionary is part of localisation state;
- literal translation can alter token identity and expression parsing.

Decision:

```text
RETAIN OPS-CAND-005 AS A DISTINCT CONTRACT
```

## 6. Retain single and double prescribed interchange separately

```text
OPS-CAND-014  prescribed one-pair interchange
OPS-CAND-015  prescribed two-pair interchange
```

Although both use simultaneous token substitution, candidate 015 has:

- two transformation components;
- a distinct `ONLY_FIRST_SWAP_APPLIED` error model;
- a longer explanation trace;
- source-backed recent SSC selection value;
- higher transformation-count difficulty metadata.

Decision:

```text
RETAIN 014 AND 015 SEPARATELY
```

## 7. Retain inverse one-pair and two-pair repair separately

```text
OPS-CAND-016  identify one operator pair
OPS-CAND-017  identify two disjoint operator pairs
```

Candidate 017 must prove not only that one double pairing works but also that no simpler single-pair repair works. Its answer semantic and ambiguity pool are therefore different.

Decision:

```text
RETAIN 016 AND 017 SEPARATELY
```

## 8. Retain arithmetic/relation interchange separately

Candidate 018 can move the top-level relation token. Each transformed stream must rediscover its equation boundary and reject zero or multiple relation positions.

Decision:

```text
RETAIN OPS-CAND-018
```

It must not merge into ordinary arithmetic-pair interchange.

## 9. Retain whole-number and digit checkpoints separately

Runtime proof confirms distinct identity domains:

```text
whole-number swap:
  replace complete NUMBER tokens

digit swap:
  substitute digit identities
  rebuild every numeric literal
  reject leading zeros
```

Therefore candidates 020–022 and 023–025 remain under separate checkpoints.

## 10. Retain evaluation and equation-option query forms separately

The following pairs remain distinct:

```text
021 vs 022
024 vs 025
028 vs 029
030 vs 032
```

Evaluation questions solve one target and construct numeric options. Equation-option questions must transform and validate each complete option independently and reject semantic duplicate equations.

Their answer semantics and option validation routes differ.

## 11. Retain operator-number and operator-digit compound inference separately

```text
OPS-CAND-026  operator + whole-number pair
OPS-CAND-027  operator + digit pair
```

Candidate 027 rebuilds literals and requires leading-zero rejection. It cannot safely share the complete-number transformation contract.

## 12. Retain hidden mapping component recovery separately

Candidate 033 answers with an operator meaning rather than a transformed numeric target. Its ambiguity proof concerns one mapping component and its distractors are alternate semantic operators.

Decision:

```text
RETAIN OPS-CAND-033
```

## 13. Consolidated runtime count

Starting candidate contracts:

```text
34
```

Merged presentation-only contracts:

```text
002 -> 001
006 -> 004
031 -> 030
```

Runtime-consolidated logical contracts:

```text
34 - 3 = 31
```

Interpretation:

```text
31 = current runtime-supported logical contract inventory
31 != permanent frozen QL count yet
```

## 14. Consolidated checkpoint counts

| Checkpoint | Pre-merge | After runtime merge |
|---|---:|---:|
| `OPS-CP-001` | 3 | 2 |
| `OPS-CP-002` | 4 | 3 |
| `OPS-CP-003` | 2 | 2 |
| `OPS-CP-004` | 4 | 4 |
| `OPS-CP-005` | 6 | 6 |
| `OPS-CP-006` | 3 | 3 |
| `OPS-CP-007` | 3 | 3 |
| `OPS-CP-008` | 4 | 4 |
| `OPS-CP-009` | 5 | 4 |
| **Total** | **34** | **31** |

## 15. Current gap verdict

The admitted V1 student actions remain fully covered after the three merges. No student action, answer semantic, transformation family or ambiguity pool becomes uncovered.

```text
FORWARD_EVALUATION                    = COVERED
MISSING_RESULT_PRESENTATION           = COVERED_AS_PARAMETER
EQUATION_OPTION_SELECTION             = COVERED
MISSING_OPERATOR_AND_RELATION         = COVERED
FIXED_AND_MOVABLE_RELATION_FILL       = COVERED
SINGLE_AND_DOUBLE_OPERATOR_SWAP       = COVERED
WHOLE_NUMBER_AND_DIGIT_SWAP           = COVERED
COMPOUND_SWAP                         = COVERED
HIDDEN_MAPPING_AND_COMPONENT_RECOVERY = COVERED
```

## 16. Remaining blockers before permanent allocation

```text
FULL_31_CONTRACT_HI_PA_RENDERING       = NOT_YET_PROVED
DEVICE_LEVEL_VISUAL_EXPORT             = NOT_STARTED
FINAL_SOURCE_TO_RUNTIME_LEDGER         = PARTIAL
BRANCH_SYNC_WITH_NEW_MAIN              = PENDING
PERMANENT_QL_IDS_AND_RANGES            = BLOCKED
```

The next valid step is multilingual expansion across the 31 consolidated contracts, not immediate assignment of 31 permanent QL IDs.
