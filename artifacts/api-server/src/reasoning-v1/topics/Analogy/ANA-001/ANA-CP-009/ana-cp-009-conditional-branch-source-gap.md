# ANA-CP-009 Conditional-Branch Source Gap and Admission Gate

Status: **SOURCE GAP — ZERO QLS; NO FORMAL RULE ADMITTED**.

## 1. Question under review

After the legacy CP-009 allocation audit, `ADV_CONDITIONAL_BRANCH` was the only historical label that could still describe a genuinely meta-level analogy:

```text
a visible condition chooses which bounded relation applies
```

This would differ from an ordinary analogy because the student would first evaluate a predicate and then apply the selected pair-local rule.

The family cannot be admitted merely because such a generator is technically possible. It requires recurring exam evidence that the task is actually asked as analogy rather than Coding-Decoding, symbolic operations, series or data sufficiency.

## 2. Source search result

The reviewed uploaded analogy material and current SSC/Railway analogy inventories consistently use one relationship transferred from source to target. The recurring families include semantic relation, alphabet movement, number formula, mixed letter-number transformation and figure transformation.

No recurring readable analogy fixture was found in which:

1. an explicit condition appears in the prompt;
2. that condition selects between two or more named analogy rules;
3. the same branch grammar is demonstrated by complete source pairs;
4. the target answer is unique without relying on an undocumented diagram or option-only inference.

Conditional instructions were found in neighbouring chapters instead:

- **Coding-Decoding:** conditions determine how a word, number or symbol is encoded;
- **Symbolic Operations:** stated symbol meanings determine which arithmetic operations to evaluate.

Those are valid exam patterns, but they do not establish CP-009 analogy ownership.

## 3. Why a design label is insufficient

The original ANA design contained direct and pair-selection placeholders named `ADV_CONDITIONAL_BRANCH`. It did not contain:

- an exam fixture;
- a branch predicate;
- a bounded rule whitelist;
- a solver contract;
- a collision model;
- a proof that the task remains analogy;
- a multilingual predicate contract.

The label is therefore a hypothesis, not an allocation authority.

## 4. Mandatory admission requirements

A conditional-branch family may be reconsidered only when all of the following pass together:

1. At least two independent readable exam fixtures use the same branch grammar.
2. The condition is visible in the question and is not reconstructed from options alone.
3. The predicate selects from a bounded whitelist of named pair-local rules.
4. Complete source pairs establish the same predicate and branch meaning.
5. An independent solver derives both the selected branch and the final answer.
6. The complete earlier-checkpoint rule pool rejects a simpler non-branch explanation.
7. Four unique options remain single-correct without hidden conditions.
8. Coding, symbol substitution, series and data-sufficiency framings are delegated.
9. English, Hindi and Punjabi preserve the exact condition and branch semantics.
10. No count or QL ID is assigned until every requirement passes.

The executable source ledger and admission state are maintained in:

- `conditional-branch-admission.ts`;
- `conditional-branch-admission.test.ts`.

## 5. Current decision

```text
candidate family: ADV_CONDITIONAL_BRANCH
status: SOURCE_GAP
recurring fixtures found: 0
formal rule contracts admitted: 0
permanent QL IDs: 0
publicly publishable: false
```

The provisional `ANA-QL-251..274` range remains entirely unallocated. CP-009 should not be implemented by inventing a conditional grammar to fill a historical count.

## 6. Next research priority

The next source pass should prioritise complete official or high-quality rendered solutions for the already observed changing-parameter fixtures. A new family may be admitted only when the cross-pair progression is explicitly recoverable and recurs across independent questions.
