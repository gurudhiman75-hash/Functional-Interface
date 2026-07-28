# MEN-001 Exact Four-Tier Explanation Audit

## Scope

Every active English MEN-001 explanation uses the exact competitive-exam learning structure. Question ownership, solve modes, generated values, answers and options remain unchanged.

## Required order

1. Key Rule & Formula
2. Step-by-Step Solution, including the contextual final result in the last worked step
3. Exam Speed Shortcut
4. Common Traps

A separate fifth `Final Answer` block is forbidden.

Runtime display contract:

```text
FOUR_TIER_COMPETITIVE_EXPLANATION
```

The canonical `explanation.lines` output also contains exactly four complete Markdown blocks with these headings; it no longer carries the legacy flat explanation.

## Shortcut layer

The generated state determines the shortcut. Supported routes include triangle half-factor cancellation, valid Pythagorean triplets, percentage identities, direct wire-reshaping relations, scale-factor rules and unit-conversion rules. A safe answer-dimension strategy is used when no specialised shortcut applies.

The complete standard solution always remains visible before the shortcut.

## Common-trap layer

Options are generated and shuffled before the explanation is composed. Each trap warning therefore names the real option letter, the displayed value and the mathematical error that produced it.

Each question has exactly three trap warnings. Internal implementation labels are rejected from learner-facing text.

## Focused examples

- `MEN-001-QL-001`: `Identify the Measurements` → `Substitute and Calculate`; halve the even base before multiplying; explain the omitted-half and repeated-dimension distractors.
- `MEN-001-QL-020`: use a triplet shortcut only when the generated sides satisfy Pythagoras.
- `MEN-001-QL-414`: use `2p + p²/100` for equal linear increases.
- `MEN-001-QL-436`: `Find the Wire Length` → `Find the Side of the Square` → `Calculate the Enclosed Area`; use `s = πr/2 = 11r/7`; distinguish the original-circle and incorrect wire relations.

## Executable proof

`four-tier-explanation.test.ts` audits every active QL across three deterministic states. It requires:

- exact four-tier order;
- no `FINAL_ANSWER` section;
- the canonical answer inside the last worked step;
- exactly four canonical Markdown blocks in `explanation.lines`;
- one non-empty shortcut;
- three option-aware trap warnings;
- complete wrong-option-letter coverage;
- natural learner-facing language;
- focused step-shape checks for QL-001 and QL-436.

The existing 3,880-case runtime proof, authorship audit, structured MathJax audit, production build and review exports remain required gates.

## Repository boundary

The permanent implementation changes only MEN-001 explanation rendering, validation, audits and documentation. It does not change QLs, solve modes, parameter generation, canonical answers, distractor values, publication status or Question Studio routing.
