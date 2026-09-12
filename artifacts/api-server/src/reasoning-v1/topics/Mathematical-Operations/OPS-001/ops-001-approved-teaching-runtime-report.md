# ExamTree Reasoning V1 — OPS-001 Approved Teaching Runtime Report

Status: **English V3 teaching runtime implemented and runtime-proven; manual review pending.**

## Scope completed

The approved Explanation Gold V3 method has been ported into the executable English runtime for all 31 retained logical contracts.

The runtime now requires candidate-appropriate teaching structure rather than a generic solver trace:

```text
meaning or interchange rule
original expression/equation
fully transformed expression/equation
multiplication/division calculations
addition/subtraction calculations
side comparison or option justification
exact final answer
```

Additional teaching obligations are enforced for:

- supplied symbol and arbitrary-token mappings;
- arithmetic/relation mixed mappings;
- missing operators and relations;
- ordered fill sequences;
- single and double operator interchanges;
- relation-boundary relocation;
- complete-number-token interchange;
- global digit-identity interchange;
- operator + complete-number compound transformations;
- operator + digit compound transformations;
- hidden arithmetic and mixed arithmetic/relation inference.

## Corrected source-runtime defects

### OPS-CAND-016

The earlier pilot generated an operator-pair question in which one member of the stated interchange was absent from the equation. It is now bypassed by a curated runtime of complete-pool-verified equations containing all four arithmetic operators. Every proposed pair is a genuine simultaneous two-way interchange.

### OPS-CAND-027

All earlier operator-and-digit blueprints contained an absent member of the intended operator pair. They are now bypassed by curated equations where:

- both intended operators occur;
- both intended digits occur;
- digit replacement is global on both sides;
- leading-zero outcomes are rejected;
- the complete operator-pair × digit-pair pool has exactly one survivor.

### OPS-CAND-028 and OPS-CAND-029

The random prescribed-compound selector could choose an invalid operator-and-digit blueprint. The canonical approved runtime now uses the valid operator-and-complete-number topology for both direct evaluation and equation-option selection.

### Exact teaching traces

The teaching arithmetic tracer now supports:

- signed integers;
- signed finite decimals;
- signed exact fractions;
- negative intermediate values;
- exact left-to-right reduction within equal-precedence groups.

## Automated proof

Dedicated workflow:

```text
Validate OPS-001 approved teaching runtime
Run ID: 30209093593
Head commit: 0b7e42077caa456c3ac5bdb42a6277f8bc85820a
```

Passed gates:

```text
strict TypeScript                                        PASS
31 retained contracts × 100 seeds = 3,100 instances     PASS
four unique options                                      PASS
exactly one keyed option                                 PASS
correct-index/answer consistency                         PASS
V3 teaching metadata                                     PASS
visible replacement/interchange                          PASS
no repeated expression/result trace                      PASS
BODMAS narration per equation side                       PASS
option-selection justification                           PASS
complete-number/digit distinction                        PASS
hidden-operation domain and inference                    PASS
canonical 310-question review export                     PASS
artifact upload                                          PASS
```

## Manual-review artifact

```text
31 retained contracts × 10 deterministic review seeds = 310 questions
```

Files generated:

- `OPS-001-EN-APPROVED-V3-310.html`
- `OPS-001-EN-APPROVED-V3-310.md`
- `OPS-001-EN-APPROVED-V3-310.csv`
- `OPS-001-EN-APPROVED-V3-310.json`
- `README.md`

Artifact name:

```text
ops-001-approved-v3-review-310
```

## Remaining gates

```text
English 310-question manual acceptance        PENDING
full 31-contract Hindi teaching runtime       BLOCKED ON ENGLISH ACCEPTANCE
full 31-contract Punjabi teaching runtime     BLOCKED ON ENGLISH ACCEPTANCE
device/glyph review                            PENDING
permanent OPS-QL allocation                    BLOCKED
production/Question Studio wiring              BLOCKED
chapter freeze                                 BLOCKED
```

The earlier V1 and V2 explanation exports remain rejected and must not be used.