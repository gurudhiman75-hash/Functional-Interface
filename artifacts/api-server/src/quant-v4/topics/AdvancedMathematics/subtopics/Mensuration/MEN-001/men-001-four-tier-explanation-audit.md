# MEN-001 Four-Tier Explanation Audit

## Scope

Every active English MEN-001 explanation now uses a competitive-exam learning layout. Question ownership, solve modes, generated values, answers and options remain unchanged.

## Required order

1. Key Rule & Formula
2. Step-by-Step Solution
3. Exam Speed Shortcut
4. Common Traps
5. Final Answer

Runtime display contract:

```text
FOUR_TIER_COMPETITIVE_EXPLANATION
```

## Shortcut layer

The generated state determines the shortcut. Supported routes include triangle half-factor cancellation, valid Pythagorean triplets, percentage identities, direct wire-reshaping relations, scale-factor rules and unit-conversion rules. A safe answer-dimension strategy is used when no specialised shortcut applies.

The complete standard solution always remains visible before the shortcut.

## Common-trap layer

Options are generated and shuffled before the explanation is composed. Each trap warning therefore names the real option letter, the displayed value and the mathematical error that produced it.

Each question has exactly three trap warnings. Internal implementation labels are rejected from learner-facing text.

## Focused examples

- `MEN-001-QL-001`: halve the even base before multiplying; explain the omitted-half and repeated-dimension distractors.
- `MEN-001-QL-020`: use a triplet shortcut only when the generated sides satisfy Pythagoras.
- `MEN-001-QL-414`: use `2p + p²/100` for equal linear increases.
- `MEN-001-QL-436`: use `s = πr/2 = 11r/7` and distinguish the original-circle and incorrect wire relations.

## Executable proof

`four-tier-explanation.test.ts` audits every active QL across three deterministic states. It requires exact block order, one non-empty shortcut, three option-aware trap warnings, complete wrong-option-letter coverage and natural learner-facing language.

The existing 3,880-case runtime proof, authorship audit, structured MathJax audit, production build and review exports remain required gates.

## Repository boundary

The one-use migration workflows and patch script were removed after the structural conversion. The permanent implementation consists only of the runtime, renderer, review exporter, tests and documentation required by MEN-001.
