# SAP-CP-001 Wave 03 — Saturation and Merge/Split Report

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-001`  
**Wave:** remaining representation authorities and cross-wave saturation  
**Permanent QLs:** 0  
**Question Studio exposure:** disabled

## 1. Remaining executable authorities

Wave 03 closes the four solve-mode gaps left after Waves 01 and 02:

```text
SAP-CP001-PROT-VINCULUM-FRACTION-BAR-SCOPE
SAP-CP001-PROT-UNAMBIGUOUS-IMPLICIT-MULTIPLICATION
SAP-CP001-PROT-REPEATED-GROUPING
SAP-CP001-PROT-NEGATIVE-INTERMEDIATE
```

These are temporary discovery identities. They do not allocate permanent QL IDs.

## 2. Shared expression substrate extension

The typed expression AST now includes two explicit semantic nodes:

- `FRACTION_BAR` — the complete numerator and denominator are scoped operands;
- `IMPLICIT_MULTIPLY` — allowed only when the right operand is an explicitly grouped factor.

Both nodes are supported by:

- the canonical exact evaluator;
- the independent RPN verifier;
- the mathematical fingerprint system;
- the expression renderer;
- the Wave 01 and Wave 02 regression workflows.

The implicit-multiplication helper rejects an ungrouped right operand. This prevents forms such as `a ÷ b(c)` from entering the generation system.

## 3. Wave 03 proof contract

The runtime proof executes 100 deterministic seeds for each of the four authorities.

```text
Generated packages: 400
Canonical/verifier mismatches: 0 required
Duplicate-option packages: 0 required
Lifecycle leaks: 0 required
Permanent QLs: 0
Active/public packages: 0
```

The proof also requires:

- all four answer positions for every temporary authority;
- Easy, Medium and Hard states for every temporary authority;
- round, square and curly bracket representation;
- explicit fraction-bar rendering;
- no explicit multiplication token inside the implicit-multiplication authority;
- a forced negative intermediate in every negative-intermediate state;
- both positive and negative final-answer outcomes;
- at least forty distinct mathematical fingerprints per authority.

## 4. Cross-wave saturation

The design baseline contains 18 solve modes. Waves 01–03 currently contain 17 temporary authorities because two baseline modes intentionally share one authority:

```text
evaluateNestedParenthesesExpression
evaluateMixedBracketExpression
```

Both map to `SAP-CP001-PROT-NESTED-GROUPING`. Bracket glyph type does not create a different mathematical precedence, so splitting these into separate learner authorities would duplicate the same solve contract.

All 18 design modes now map to an executable temporary authority.

## 5. Merge/split decisions

### Merged now

- nested parentheses and mixed-bracket expressions share one temporary authority;
- bracket-shape variation is representation coverage, not a new QL.

### Retained separately for further review

- unary negative versus a negative intermediate;
- ordinary nested grouping versus repeated/redundant grouping;
- first-valid-step selection versus first-incorrect-step diagnosis.

These pairs have different learner actions or error signatures, but permanent separation remains subject to editorial review and stress evidence.

### Ownership boundary

A fraction-bar item stays in `SAP-CP-001` only when the primary difficulty is identifying the bar's scope. It moves to `SAP-CP-002` when fraction arithmetic, cancellation, mixed numbers or complex rational structure becomes the principal challenge.

## 6. Current ID-free authority inventory

```text
Wave 01 temporary authorities: 8
Wave 02 temporary authorities: 5
Wave 03 temporary authorities: 4
Total temporary authorities:   17
Mapped design solve modes:      18
Permanent QLs:                  0
```

## 7. Freeze status

Wave 03 closes the current design-baseline gaps but does not by itself authorise permanent IDs. The next gate is a manual editorial freeze covering:

- stem realism and repetition;
- explanation clarity and exam-speed usefulness;
- misconception quality;
- over-merge and over-split review;
- source-pattern saturation beyond the initial uploaded fixtures;
- difficulty calibration;
- English authority approval.

Until that review is approved, every package remains inactive, non-public and unavailable to Question Studio or the Question Bank.
