# ExamTree Reasoning V1 — OPS-001 Foundation Pilot Report

Status: foundation pilot passed. Permanent QL allocation remains blocked.

## 1. Scope

This report records the first executable proof for:

`OPS-001 — Mathematical Operations and Symbol Substitution`

The pilot proves the shared runtime required before authoring the 12 representative candidate contracts. It does not claim chapter completion or production readiness.

## 2. Branch and review state

```text
branch: feat/ops-001-end-to-end-design
pull request: #174
draft: true
production wiring: absent
permanent OPS-QL IDs: absent
```

The PR remains draft because:

- `New-main` has continued to advance independently;
- the 12 representative candidate generators are not implemented yet;
- Hindi/Punjabi runtime rendering is not implemented yet;
- final candidate merge/split decisions remain runtime-dependent.

## 3. Foundation files implemented

```text
foundation/types.ts
foundation/exact-rational.ts
foundation/tokenizer.ts
foundation/transformations.ts
foundation/parser.ts
foundation/evaluator.ts
foundation/solver.ts
foundation/index.ts
foundation/ops-foundation.test.ts
```

CI definition:

```text
.github/workflows/ops-001-foundation-pilot.yml
```

## 4. Capabilities proved

### 4.1 Exact arithmetic

- reduced `bigint` rational values;
- exact integer parsing;
- exact finite-decimal conversion;
- exact addition, subtraction, multiplication and division;
- exact comparison;
- canonical value keys;
- no binary floating-point equation validation.

Confirmed examples:

```text
0.02   -> 1/50
0.0625 -> 1/16
1/8 + 0.125 -> 1/4
```

### 4.2 Source-aware tokenisation

- ordinary arithmetic signs;
- ASCII aliases normalised to canonical signs;
- relation signs;
- arbitrary letter tokens;
- punctuation/symbol tokens;
- unsigned integer and finite-decimal literals;
- brackets;
- Unicode single-glyph symbol fallback;
- malformed-number and unknown-token rejection.

### 4.3 Typed transformation layer

- supplied complete mappings;
- partial mappings;
- many-to-one mappings;
- standard-sign preservation where allowed;
- simultaneous one-pair operator swaps;
- simultaneous disjoint double-pair operator swaps;
- arithmetic-sign/relation-sign swaps;
- complete numeric-token swaps;
- global digit-identity swaps;
- leading-zero rejection;
- composed operator-plus-number transformations;
- stable transformation fingerprints.

### 4.4 Parser and exact evaluator

- multiplication/division precedence;
- addition/subtraction precedence;
- left associativity;
- brackets;
- unary negative;
- arithmetic ASTs;
- one top-level relation AST;
- equality, less-than and greater-than evaluation;
- relation-boundary rediscovery after transformation;
- malformed and multi-relation rejection;
- stable semantic AST fingerprints.

### 4.5 Independent search and inference

- enumerate all eligible operator-pair repairs;
- enumerate arithmetic/relation-token repairs;
- enumerate whole-number-pair repairs;
- enumerate digit-pair repairs;
- enumerate operator-plus-number compound repairs;
- infer a unique bijective arithmetic mapping from evidence;
- infer a unique mixed arithmetic/relation mapping from evidence.

The enumerators always transform the original typed token stream and reparse from scratch.

## 5. Test cases proved

The executable contract test includes:

```text
exact finite decimals
rational reduction
zero-denominator rejection
precedence
brackets
left associativity
unary negative
exact relation truth
multi-relation rejection
complete supplied mapping
partial supplied mapping
many-to-one supplied mapping
arbitrary operation tokens
swap involution
disjoint-pair enforcement
relation-boundary relocation
whole-number versus digit semantics
leading-zero rejection
compound transformation composition
unique operator-pair repair
unique arithmetic/relation repair
unique whole-number repair
unique digit repair
hidden arithmetic mapping inference
hidden mixed relation mapping inference
semantic fingerprint stability
source compound-swap collision detection
```

## 6. GitHub Actions proof

Workflow:

```text
Validate OPS-001 foundation pilot
```

Run:

```text
30185710130
```

Job:

```text
foundation-proof
```

Result:

```text
Strict TypeScript check             PASS
Exact foundation contract proof     PASS
Overall workflow conclusion         SUCCESS
```

The workflow uses Node 22, the repository lockfile, strict compiler flags and direct execution of `ops-foundation.test.ts`.

## 7. Important source-collision finding

The published-style compound equation:

```text
16 × 4 + 12 ÷ 4 − 15 = 59
```

has the expected repair:

```text
swap + and −
swap 16 and 12
```

which gives:

```text
12 × 4 − 16 ÷ 4 + 15 = 59
```

However, unrestricted enumeration found a second valid repair:

```text
swap − and ×
swap 16 and 15
```

which gives:

```text
15 − 4 + 12 ÷ 4 × 16 = 59
```

Therefore:

```text
complete eligible-pool uniqueness = FAIL for this source instance
```

This validates the master architecture requirement that ExamTree must not accept a question merely because exactly one listed option matches a source key.

Production generators must reject any instance when an equal-or-simpler unlisted transformation also solves it.

## 8. Foundation gate verdicts

```text
EXACT_NUMERIC_FOUNDATION             = PASS
TOKENISER_FOUNDATION                 = PASS
TYPED_TRANSFORMATION_FOUNDATION      = PASS
AST_PARSER_FOUNDATION                = PASS
EXACT_EVALUATOR_FOUNDATION           = PASS
RELATION_BOUNDARY_VALIDATION         = PASS
REPAIR_ENUMERATION_FOUNDATION        = PASS
HIDDEN_MAPPING_INFERENCE_FOUNDATION  = PASS
STRICT_TYPESCRIPT_CI                 = PASS
FOUNDATION_CONTRACT_TEST             = PASS
```

Not yet passed:

```text
12_REPRESENTATIVE_CANDIDATE_PILOTS   = NOT_STARTED
SEEDED_GENERATION                    = NOT_STARTED
FOUR_OPTION_YIELD                    = NOT_STARTED
DISTRACTOR_ERROR_MODEL_PROOF         = NOT_STARTED
EXPLANATION_VARIETY_PROOF            = NOT_STARTED
HI_PA_RUNTIME_RENDERING              = NOT_STARTED
MOBILE_WIDTH_PROOF                   = NOT_STARTED
PERMANENT_QL_MANIFEST                = BLOCKED
```

## 9. Next implementation stage

Implement temporary pilot contracts for:

```text
OPS-CAND-001  supplied mapping evaluation
OPS-CAND-003  equation-option truth selection
OPS-CAND-010  single missing operator
OPS-CAND-012  ordered fill sequence
OPS-CAND-014  prescribed operator swap
OPS-CAND-016  identify operator swap
OPS-CAND-018  arithmetic/relation swap
OPS-CAND-020  whole-number swap
OPS-CAND-023  digit swap
OPS-CAND-026  compound operator-number swap
OPS-CAND-030  hidden mapping inference
OPS-CAND-034  hidden mixed relation inference
```

These IDs remain temporary design-candidate IDs. They must not be published as permanent `OPS-QL-*` identities.

## 10. Final pilot conclusion

The shared OPS-001 foundation is executable, strict-type clean and CI-proven.

The design can now move from architecture discovery to representative seeded generators without freezing chapter size prematurely.
